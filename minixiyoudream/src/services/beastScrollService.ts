// 兽诀服务 - 梦幻西游风格打书系统核心逻辑

import { PRNG } from '@/utils/prng';
import type { Pet, PetSkill, PetType, Element, SkillTier } from '@/types';
import {
  getBeastScroll,
  getBeastScrollBySkillId,
  checkSkillExclusive,
  calculateFinalSuccessRate,
  type BeastScrollConfig,
  type BeastScrollTier,
} from '@/constants/beastScrolls';
import {
  getPetSkillSlotConfig,
  getSkillSlotUnlockConfig,
  getSlotUnlockGoldCost,
  getSlotUnlockItem,
  canUnlockSlotByLevel,
  SKILL_LOCK_CONFIG,
  getMaxSkillSlots,
} from '@/constants/petSkillSlots';

// ============================================
// 类型定义
// ============================================

/** 打书结果类型 */
export type LearnSkillResultType = 'learn' | 'upgrade' | 'override' | 'fail' | 'exclusive_conflict';

/** 打书结果 */
export interface LearnBeastScrollResult {
  success: boolean;
  pet: Pet;
  type: LearnSkillResultType;
  newSkill?: PetSkill;
  overriddenSkill?: PetSkill;
  previousLevel?: number;
  newLevel?: number;
  successRate?: number;
  reason?: string;
}

/** 技能锁定结果 */
export interface LockSkillResult {
  success: boolean;
  pet: Pet;
  message: string;
  goldCost?: number;
}

/** 技能解锁结果 */
export interface UnlockSkillResult {
  success: boolean;
  pet: Pet;
  message: string;
}

/** 技能格解锁结果 */
export interface UnlockSlotResult {
  success: boolean;
  pet: Pet;
  slot: number;
  method: 'level' | 'item';
  message: string;
  goldCost?: number;
  itemsConsumed?: { itemId: string; count: number };
}

/** 学习限制检查结果 */
export interface RestrictionCheckResult {
  canLearn: boolean;
  reason?: string;
}

// ============================================
// 技能等级配置
// ============================================

/** 最大技能等级 */
export const MAX_SKILL_LEVEL = 5;

/** 技能升级成功率（按当前等级） */
const SKILL_UPGRADE_RATES = [100, 80, 60, 40, 20]; // 1->2, 2->3, 3->4, 4->5

/** 每级技能效果加成 */
const SKILL_LEVEL_BONUS = [0, 0.1, 0.15, 0.2, 0.25];

// ============================================
// 学习限制检查
// ============================================

/** 检查学习限制 */
export function checkRestrictions(pet: Pet, scroll: BeastScrollConfig): RestrictionCheckResult {
  const { restrictions } = scroll;

  // 检查宠物类型限制
  if (restrictions?.petType && !restrictions.petType.includes(pet.type)) {
    const typeNames: Record<PetType, string> = {
      attack: '攻击型',
      magic: '法术型',
      defense: '防御型',
      support: '辅助型',
      control: '控制型',
      balance: '平衡型',
    };
    const allowedTypes = restrictions.petType.map(t => typeNames[t]).join('、');
    return {
      canLearn: false,
      reason: `仅${allowedTypes}宠物可学习此技能`,
    };
  }

  // 检查等级限制
  if (restrictions?.minLevel && pet.level < restrictions.minLevel) {
    return {
      canLearn: false,
      reason: `宠物等级需达到${restrictions.minLevel}级`,
    };
  }

  // 检查元素限制
  if (restrictions?.element && pet.element) {
    if (!restrictions.element.includes(pet.element)) {
      const elementNames: Record<Element, string> = {
        metal: '金',
        wood: '木',
        water: '水',
        fire: '火',
        earth: '土',
        physical: '物理',
        none: '无',
      };
      const allowedElements = restrictions.element.map(e => elementNames[e]).join('、');
      return {
        canLearn: false,
        reason: `仅${allowedElements}属性宠物可学习`,
      };
    }
  }

  return { canLearn: true };
}

/** 检查技能互斥关系 */
export function checkExclusiveConflict(
  skillId: string,
  existingSkills: PetSkill[]
): { hasConflict: boolean; conflictingSkill?: PetSkill } {
  const existingIds = existingSkills.map(s => s.skillId || s.id);
  const result = checkSkillExclusive(skillId, existingIds);

  if (result.hasConflict && result.conflictingSkill) {
    const conflicting = existingSkills.find(
      s => s.skillId === result.conflictingSkill || s.id === result.conflictingSkill
    );
    return { hasConflict: true, conflictingSkill: conflicting };
  }

  return { hasConflict: false };
}

/** 查找已有技能 */
export function findExistingSkill(pet: Pet, skillId: string): { skill: PetSkill; index: number } | null {
  for (let i = 0; i < pet.skills.length; i++) {
    const skill = pet.skills[i];
    if (skill.skillId === skillId || skill.id === skillId) {
      return { skill, index: i };
    }
  }
  return null;
}

// ============================================
// 成功率计算
// ============================================

/** 计算平均资质 */
function getAverageAptitude(pet: Pet): number {
  const apt = pet.aptitude;
  return (apt.attack + apt.defense + (apt.magic ?? apt.dodge) + apt.speed + apt.hp + apt.mp) / 6;
}

/** 计算平均成长 */
function getAverageGrowth(pet: Pet): number {
  // growthRate 是一个 number（GrowthRateValue），直接返回
  return typeof pet.growthRate === 'number' ? pet.growthRate : 1.0;
}

/** 获取锁定技能数量 */
function getLockedSkillsCount(pet: Pet): number {
  return pet.skills.filter(s => s.locked).length;
}

/** 计算打书成功率 */
export function calculateLearnSuccessRate(pet: Pet, scroll: BeastScrollConfig): number {
  const aptitude = getAverageAptitude(pet);
  const growth = getAverageGrowth(pet);
  const lockedCount = getLockedSkillsCount(pet);

  return calculateFinalSuccessRate(scroll, aptitude, growth, pet.intimacy, lockedCount);
}

/** 获取技能升级成功率 */
export function getSkillUpgradeRate(currentLevel: number, scroll: BeastScrollConfig): number {
  if (currentLevel >= MAX_SKILL_LEVEL) return 0;
  const baseRate = SKILL_UPGRADE_RATES[currentLevel - 1] || 100;

  // 高级兽诀升级成功率+10%
  const bonus = scroll.tier === 'high' ? 10 : 0;

  return Math.min(100, baseRate + bonus);
}

// ============================================
// 技能创建和升级
// ============================================

/** 创建技能实例 */
export function createSkillInstance(scroll: BeastScrollConfig, level: number = 1): PetSkill {
  const baseSkill = scroll.skill;
  const levelBonus = SKILL_LEVEL_BONUS[level - 1] || 0;

  // 根据兽诀等级映射到技能等级
  const tierMap: Record<string, SkillTier> = {
    low: 'basic',
    medium: 'advanced',
    high: 'special',
    super: 'super',
  };

  return {
    id: `skill_${baseSkill.skillId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    templateId: baseSkill.skillId,
    name: baseSkill.name,
    tier: tierMap[scroll.tier] || 'basic',
    type: baseSkill.type,
    description: baseSkill.description,
    mpCost: baseSkill.mpCost,
    cooldown: baseSkill.cooldown,
    multiplier: baseSkill.multiplier ? baseSkill.multiplier + levelBonus : undefined,
    element: baseSkill.element,
    level,
    skillId: baseSkill.skillId,
    locked: false,
  };
}

/** 升级技能 */
export function upgradeSkill(
  pet: Pet,
  skillIndex: number,
  scroll: BeastScrollConfig,
  prng: PRNG
): LearnBeastScrollResult {
  const skill = pet.skills[skillIndex];
  if (!skill) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '技能不存在',
    };
  }

  const currentLevel = skill.level || 1;

  // 检查是否已满级
  if (currentLevel >= MAX_SKILL_LEVEL) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '技能已达到最高等级',
    };
  }

  // 计算升级成功率
  const successRate = getSkillUpgradeRate(currentLevel, scroll);

  // 判定是否成功
  const roll = prng.next() * 100;
  const isSuccess = roll < successRate;

  if (!isSuccess) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: `升级失败，兽诀已消耗（成功率：${successRate.toFixed(1)}%）`,
      previousLevel: currentLevel,
      successRate,
    };
  }

  // 创建升级后的技能
  const newLevel = currentLevel + 1;
  const upgradedSkill = createSkillInstance(scroll, newLevel);
  upgradedSkill.locked = skill.locked; // 保持锁定状态

  // 更新宠物技能
  const updatedSkills = [...pet.skills];
  updatedSkills[skillIndex] = upgradedSkill;

  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  return {
    success: true,
    pet: updatedPet,
    type: 'upgrade',
    newSkill: upgradedSkill,
    previousLevel: currentLevel,
    newLevel,
    successRate,
  };
}

// ============================================
// 打书核心逻辑
// ============================================

/** 使用兽诀学习技能 */
export function learnBeastScroll(
  pet: Pet,
  scrollId: string,
  prng: PRNG
): LearnBeastScrollResult {
  // 获取兽诀配置
  const scroll = getBeastScroll(scrollId);
  if (!scroll) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '兽诀不存在',
    };
  }

  // 检查学习限制
  const restrictionCheck = checkRestrictions(pet, scroll);
  if (!restrictionCheck.canLearn) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: restrictionCheck.reason,
    };
  }

  // 检查技能互斥
  const exclusiveCheck = checkExclusiveConflict(scroll.skill.skillId!, pet.skills);
  if (exclusiveCheck.hasConflict && exclusiveCheck.conflictingSkill) {
    return {
      success: false,
      pet,
      type: 'exclusive_conflict',
      reason: `技能【${exclusiveCheck.conflictingSkill.name}】与【${scroll.skill.name}】互斥，无法同时存在`,
      overriddenSkill: exclusiveCheck.conflictingSkill,
    };
  }

  // 检查是否已学习该技能
  const existingSkill = findExistingSkill(pet, scroll.skill.skillId!);

  // 如果已学习，尝试升级
  if (existingSkill) {
    return upgradeSkill(pet, existingSkill.index, scroll, prng);
  }

  // 获取当前可用技能槽
  const availableSlots = pet.unlockedSlots?.length || getPetSkillSlotConfig(pet.quality).baseSlots;
  const currentSkillCount = pet.skills.length;

  // 技能槽未满，直接学习
  if (currentSkillCount < availableSlots) {
    const newSkill = createSkillInstance(scroll, 1);
    const updatedPet: Pet = {
      ...pet,
      skills: [...pet.skills, newSkill],
    };

    return {
      success: true,
      pet: updatedPet,
      type: 'learn',
      newSkill,
      successRate: 100,
    };
  }

  // 技能槽已满，需要覆盖
  const successRate = calculateLearnSuccessRate(pet, scroll);

  // 判定是否成功
  const roll = prng.next() * 100;
  const isSuccess = roll < successRate;

  if (!isSuccess) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: `打书失败，兽诀已消耗（成功率：${successRate.toFixed(1)}%）`,
      successRate,
    };
  }

  // 选择被覆盖的技能（不覆盖锁定的技能）
  const unlockedSkills = pet.skills.filter(s => !s.locked);
  if (unlockedSkills.length === 0) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '所有技能都已锁定，无法覆盖',
    };
  }

  const randomIndex = prng.nextInt(0, unlockedSkills.length - 1);
  const overriddenSkill = unlockedSkills[randomIndex];

  // 找到要替换的技能在原数组中的索引
  const originalIndex = pet.skills.findIndex(s => s.id === overriddenSkill.id);

  // 创建新技能
  const newSkill = createSkillInstance(scroll, 1);

  // 更新宠物技能
  const updatedSkills = [...pet.skills];
  updatedSkills[originalIndex] = newSkill;

  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  return {
    success: true,
    pet: updatedPet,
    type: 'override',
    newSkill,
    overriddenSkill,
    successRate,
  };
}

// ============================================
// 技能锁定功能
// ============================================

/** 锁定技能 */
export function lockSkill(
  pet: Pet,
  skillId: string,
  playerGold: number,
  hasLockItem: boolean
): LockSkillResult {
  // 检查技能是否存在
  const skillIndex = pet.skills.findIndex(s => s.id === skillId || s.skillId === skillId);
  if (skillIndex === -1) {
    return {
      success: false,
      pet,
      message: '技能不存在',
    };
  }

  const skill = pet.skills[skillIndex];

  // 检查是否已锁定
  if (skill.locked) {
    return {
      success: false,
      pet,
      message: '技能已经锁定',
    };
  }

  // 检查锁定数量限制
  const lockedCount = getLockedSkillsCount(pet);
  if (lockedCount >= SKILL_LOCK_CONFIG.maxLockedSkills) {
    return {
      success: false,
      pet,
      message: `最多只能锁定${SKILL_LOCK_CONFIG.maxLockedSkills}个技能`,
    };
  }

  // 检查道具和金币
  const goldCost = SKILL_LOCK_CONFIG.lockGoldCost;
  if (!hasLockItem) {
    return {
      success: false,
      pet,
      message: '需要锁妖珠道具',
    };
  }
  if (playerGold < goldCost) {
    return {
      success: false,
      pet,
      message: `金币不足，需要${goldCost}金币`,
    };
  }

  // 锁定技能
  const updatedSkills = [...pet.skills];
  updatedSkills[skillIndex] = { ...skill, locked: true };

  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  return {
    success: true,
    pet: updatedPet,
    message: `成功锁定技能【${skill.name}】`,
    goldCost,
  };
}

/** 解锁技能 */
export function unlockSkill(pet: Pet, skillId: string): UnlockSkillResult {
  const skillIndex = pet.skills.findIndex(s => s.id === skillId || s.skillId === skillId);
  if (skillIndex === -1) {
    return {
      success: false,
      pet,
      message: '技能不存在',
    };
  }

  const skill = pet.skills[skillIndex];

  if (!skill.locked) {
    return {
      success: false,
      pet,
      message: '技能未锁定',
    };
  }

  const updatedSkills = [...pet.skills];
  updatedSkills[skillIndex] = { ...skill, locked: false };

  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  return {
    success: true,
    pet: updatedPet,
    message: `成功解锁技能【${skill.name}】`,
  };
}

// ============================================
// 技能格解锁功能
// ============================================

/** 通过等级解锁技能格 */
export function unlockSlotByLevel(pet: Pet, slotIndex: number): UnlockSlotResult {
  const maxSlots = getMaxSkillSlots(pet.quality);

  if (slotIndex > maxSlots) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'level',
      message: `此宠物最多只能有${maxSlots}个技能格`,
    };
  }

  if (!canUnlockSlotByLevel(slotIndex, pet.level)) {
    const config = getSkillSlotUnlockConfig(slotIndex);
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'level',
      message: `需要达到${config?.unlockLevel || 0}级才能解锁`,
    };
  }

  const unlockedSlots = pet.unlockedSlots || [];

  if (unlockedSlots.includes(slotIndex)) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'level',
      message: '技能格已经解锁',
    };
  }

  const goldCost = getSlotUnlockGoldCost(slotIndex, pet.quality);
  const updatedPet: Pet = {
    ...pet,
    unlockedSlots: [...unlockedSlots, slotIndex],
  };

  return {
    success: true,
    pet: updatedPet,
    slot: slotIndex,
    method: 'level',
    message: `成功解锁第${slotIndex}个技能格`,
    goldCost,
  };
}

/** 使用道具解锁技能格 */
export function unlockSlotWithItem(
  pet: Pet,
  slotIndex: number,
  hasItem: boolean,
  itemCount: number
): UnlockSlotResult {
  const maxSlots = getMaxSkillSlots(pet.quality);

  if (slotIndex > maxSlots) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'item',
      message: `此宠物最多只能有${maxSlots}个技能格`,
    };
  }

  const unlockItem = getSlotUnlockItem(slotIndex);
  if (!unlockItem) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'item',
      message: '此技能格无法通过道具解锁',
    };
  }

  const unlockedSlots = pet.unlockedSlots || [];

  if (unlockedSlots.includes(slotIndex)) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'item',
      message: '技能格已经解锁',
    };
  }

  if (!hasItem || itemCount < unlockItem.count) {
    return {
      success: false,
      pet,
      slot: slotIndex,
      method: 'item',
      message: `需要${unlockItem.count}个解锁道具`,
    };
  }

  const goldCost = getSlotUnlockGoldCost(slotIndex, pet.quality);
  const updatedPet: Pet = {
    ...pet,
    unlockedSlots: [...unlockedSlots, slotIndex],
  };

  return {
    success: true,
    pet: updatedPet,
    slot: slotIndex,
    method: 'item',
    message: `成功解锁第${slotIndex}个技能格`,
    goldCost,
    itemsConsumed: { itemId: unlockItem.itemId, count: unlockItem.count },
  };
}

// ============================================
// 技能遗忘功能
// ============================================

/** 遗忘技能配置 */
const SKILL_FORGET_CONFIG = {
  goldCost: 1000,
  returnItemRate: 0.3,
};

/** 遗忘技能结果 */
export interface ForgetSkillResult {
  success: boolean;
  pet: Pet;
  goldCost: number;
  returnedScroll?: string;
  message: string;
}

/** 遗忘技能 */
export function forgetSkill(
  pet: Pet,
  skillId: string,
  playerGold: number,
  prng: PRNG
): ForgetSkillResult {
  const skillIndex = pet.skills.findIndex(s => s.id === skillId || s.skillId === skillId);
  if (skillIndex === -1) {
    return {
      success: false,
      pet,
      goldCost: 0,
      message: '技能不存在',
    };
  }

  const skill = pet.skills[skillIndex];
  const goldCost = SKILL_FORGET_CONFIG.goldCost;

  if (playerGold < goldCost) {
    return {
      success: false,
      pet,
      goldCost,
      message: `金币不足，需要${goldCost}金币`,
    };
  }

  // 移除技能
  const updatedSkills = pet.skills.filter((_, i) => i !== skillIndex);
  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  // 判断是否返还兽诀
  let returnedScroll: string | undefined;
  if (prng.next() < SKILL_FORGET_CONFIG.returnItemRate) {
    const scrollConfig = getBeastScrollBySkillId(skill.skillId || skill.id);
    if (scrollConfig) {
      returnedScroll = scrollConfig.id;
    }
  }

  return {
    success: true,
    pet: updatedPet,
    goldCost,
    returnedScroll,
    message: returnedScroll
      ? `成功遗忘技能【${skill.name}】，返还了兽诀`
      : `成功遗忘技能【${skill.name}】`,
  };
}

// ============================================
// 辅助函数
// ============================================

/** 获取技能类型名称 */
export function getSkillTypeName(type: string): string {
  const names: Record<string, string> = {
    active: '主动',
    passive: '被动',
    trigger: '触发',
  };
  return names[type] || type;
}

/** 获取技能类型颜色 */
export function getSkillTypeColor(type: string): string {
  const colors: Record<string, string> = {
    active: '#4ade80',
    passive: '#60a5fa',
    trigger: '#f472b6',
  };
  return colors[type] || '#ffffff';
}

/** 获取兽诀类别名称 */
export function getScrollCategoryName(category: string): string {
  const names: Record<string, string> = {
    attack: '攻击',
    defense: '防御',
    support: '辅助',
    magic: '法术',
  };
  return names[category] || category;
}

/** 获取兽诀等级名称 */
export function getScrollTierName(tier: BeastScrollTier): string {
  return tier === 'high' ? '高级' : '低级';
}

/** 计算技能实际效果倍率 */
export function calculateSkillMultiplier(skill: PetSkill): number {
  const base = skill.multiplier || 1;
  const level = skill.level || 1;
  const levelBonus = SKILL_LEVEL_BONUS[level - 1] || 0;
  return base + levelBonus;
}

// ============================================
// 导出服务对象
// ============================================

export const beastScrollService = {
  // 核心方法
  learnBeastScroll,
  upgradeSkill,
  forgetSkill,
  lockSkill,
  unlockSkill,
  unlockSlotByLevel,
  unlockSlotWithItem,

  // 检查方法
  checkRestrictions,
  checkExclusiveConflict,
  findExistingSkill,

  // 成功率计算
  calculateLearnSuccessRate,
  getSkillUpgradeRate,

  // 辅助方法
  getSkillTypeName,
  getSkillTypeColor,
  getScrollCategoryName,
  getScrollTierName,
  calculateSkillMultiplier,
  createSkillInstance,
};
