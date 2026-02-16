// 技能书服务 - 宠物打书系统核心逻辑

import { PRNG } from '@/utils/prng';
import type { Pet, SkillBook, PetSkill, PetType, Element } from '@/types';
import {
  getSkillBook,
  createPetSkill,
  SKILL_BOOK_TIER_CONFIG,
  SKILL_LEVEL_CONFIG,
  SKILL_FORGET_CONFIG,
  SKILL_LEARNING_CONFIG,
  MAX_SKILL_LEVEL,
  getAvailableSkillSlots,
  getSkillUpgradeSuccessRate,
  type SkillBookWithTier,
} from '@/constants/skillBooks';

// ============================================
// 类型定义
// ============================================

/** 学习限制检查结果 */
export interface RestrictionCheckResult {
  canLearn: boolean;
  reason?: string;
}

/** 技能学习结果 */
export interface TeachSkillResult {
  success: boolean;
  pet: Pet;
  type: 'learn' | 'upgrade' | 'override' | 'fail';
  newSkill?: PetSkill;
  overriddenSkill?: PetSkill;
  previousLevel?: number;
  newLevel?: number;
  successRate?: number;
  reason?: string;
}

/** 技能遗忘结果 */
export interface ForgetSkillResult {
  success: boolean;
  pet: Pet;
  goldCost: number;
  returnedBook?: string;
  message: string;
}

/** 技能槽解锁结果 */
export interface UnlockSlotResult {
  success: boolean;
  pet: Pet;
  slot: number;
  method: 'level' | 'item';
  message: string;
}

// ============================================
// 学习限制检查
// ============================================

/** 检查学习限制 */
export function checkRestrictions(pet: Pet, skillBook: SkillBook): RestrictionCheckResult {
  const { restrictions } = skillBook;

  // 检查宠物类型限制
  if (restrictions.petType && !restrictions.petType.includes(pet.type)) {
    const typeNames: Record<PetType, string> = {
      attack: '攻击型',
      magic: '法术型',
      defense: '防御型',
      support: '辅助型',
      control: '控制型',
    };
    const allowedTypes = restrictions.petType.map(t => typeNames[t]).join('、');
    return {
      canLearn: false,
      reason: `仅${allowedTypes}宠物可学习此技能`,
    };
  }

  // 检查等级限制
  if (restrictions.minLevel && pet.level < restrictions.minLevel) {
    return {
      canLearn: false,
      reason: `宠物等级需达到${restrictions.minLevel}级`,
    };
  }

  // 检查元素限制
  if (restrictions.element && pet.element) {
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

/** 检查是否已学习该技能（返回技能和索引） */
export function findExistingSkill(pet: Pet, skillId: string): { skill: PetSkill; index: number } | null {
  for (let i = 0; i < pet.skills.length; i++) {
    const skill = pet.skills[i];
    // 检查skillId或模板ID
    if (skill.skillId === skillId || skill.id.startsWith(`pet_skill_${skillId}_`)) {
      return { skill, index: i };
    }
  }
  return null;
}

// ============================================
// 技能选择逻辑
// ============================================

/** 选择被覆盖的技能 */
export function selectSkillToOverride(pet: Pet, prng: PRNG): PetSkill | null {
  if (pet.skills.length === 0) {
    return null;
  }

  // 随机选择一个技能被覆盖
  const randomIndex = prng.nextInt(0, pet.skills.length - 1);
  return pet.skills[randomIndex];
}

// ============================================
// 成功率计算
// ============================================

/** 获取技能书品质对应的学习成功率 */
export function getTierSuccessRate(tier: 'low' | 'medium' | 'high' | 'super'): number {
  return SKILL_BOOK_TIER_CONFIG[tier]?.successRate ?? 70;
}

/** 计算学习成功率（满槽时） */
export function calculateLearnSuccessRate(
  skillBook: SkillBook,
  pet: Pet
): number {
  // 获取品质基础成功率
  const tier = (skillBook as SkillBookWithTier).tier || 'low';
  let baseRate = getTierSuccessRate(tier);

  // 技能书提供的成功率加成
  if (skillBook.overrideBonus) {
    baseRate += skillBook.overrideBonus;
  }

  // 亲密度加成（每点亲密度增加0.1%）
  const intimacyBonus = pet.intimacy * 0.1;
  baseRate += intimacyBonus;

  // 忠诚度加成（每点忠诚度增加0.05%）
  const loyaltyBonus = pet.loyalty * 0.05;
  baseRate += loyaltyBonus;

  // 限制最大95%（不使用保护道具时）
  return Math.min(baseRate, 95);
}

/** 计算技能升级成功率 */
export function calculateUpgradeSuccessRate(
  currentLevel: number,
  skillBook: SkillBook
): number {
  if (currentLevel >= MAX_SKILL_LEVEL) return 0;

  // 基础成功率
  const baseRate = getSkillUpgradeSuccessRate(currentLevel);

  // 技能书加成
  const bonus = (skillBook as SkillBookWithTier).upgradeSuccessBonus || 0;

  return Math.min(baseRate + bonus, 100);
}

// ============================================
// 技能学习核心逻辑
// ============================================

/** 使用技能书让宠物学习技能 */
export function teachSkillFromBook(
  pet: Pet,
  skillBookId: string,
  useProtection: boolean,
  prng: PRNG
): TeachSkillResult {
  // 获取技能书配置
  const skillBook = getSkillBook(skillBookId);
  if (!skillBook) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '技能书不存在',
    };
  }

  // 检查学习限制
  const restrictionCheck = checkRestrictions(pet, skillBook);
  if (!restrictionCheck.canLearn) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: restrictionCheck.reason,
    };
  }

  // 检查是否已学习该技能
  const existingSkill = findExistingSkill(pet, skillBook.skillId);

  // 如果已学习，尝试升级
  if (existingSkill) {
    return upgradeSkill(pet, existingSkill.index, skillBook, useProtection, prng);
  }

  // 获取当前可用技能槽
  const availableSlots = getAvailableSkillSlots(pet.level);
  const currentSkillCount = pet.skills.length;

  // 技能槽未满，直接学习
  if (currentSkillCount < availableSlots) {
    const newSkill = createPetSkill(skillBook.skillId, 1);
    if (!newSkill) {
      return {
        success: false,
        pet,
        type: 'fail',
        reason: '技能不存在',
      };
    }

    const updatedPet: Pet = {
      ...pet,
      skills: [...pet.skills, newSkill],
    };

    return {
      success: true,
      pet: updatedPet,
      type: 'learn',
      newSkill,
    };
  }

  // 技能槽已满，需要覆盖
  const successRate = useProtection
    ? SKILL_LEARNING_CONFIG.protectionSuccessRate
    : calculateLearnSuccessRate(skillBook, pet);

  // 判定是否成功
  const roll = prng.next() * 100;
  const isSuccess = roll < successRate;

  if (!isSuccess) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '学习失败，技能书已消耗',
      successRate,
    };
  }

  // 选择被覆盖的技能
  const overriddenSkill = selectSkillToOverride(pet, prng);
  if (!overriddenSkill) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '没有可覆盖的技能',
    };
  }

  // 创建新技能
  const newSkill = createPetSkill(skillBook.skillId, 1);
  if (!newSkill) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '技能不存在',
    };
  }

  // 创建更新后的宠物
  const updatedSkills = pet.skills.map(skill =>
    skill.id === overriddenSkill.id ? newSkill : skill
  );

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

/** 升级技能 */
export function upgradeSkill(
  pet: Pet,
  skillIndex: number,
  skillBook: SkillBook,
  useProtection: boolean,
  prng: PRNG
): TeachSkillResult {
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
  let successRate = calculateUpgradeSuccessRate(currentLevel, skillBook);
  if (useProtection) {
    successRate = 100;
  }

  // 判定是否成功
  const roll = prng.next() * 100;
  const isSuccess = roll < successRate;

  if (!isSuccess) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: `升级失败，技能书已消耗（成功率：${successRate}%）`,
      previousLevel: currentLevel,
      successRate,
    };
  }

  // 创建升级后的技能
  const newLevel = currentLevel + 1;
  const upgradedSkill = createPetSkill(skillBook.skillId, newLevel);
  if (!upgradedSkill) {
    return {
      success: false,
      pet,
      type: 'fail',
      reason: '技能升级失败',
    };
  }

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
// 技能遗忘功能
// ============================================

/** 遗忘技能 */
export function forgetSkill(
  pet: Pet,
  skillId: string,
  playerGold: number,
  prng: PRNG
): ForgetSkillResult {
  // 查找技能
  const skillIndex = pet.skills.findIndex(s => s.id === skillId);
  if (skillIndex === -1) {
    return {
      success: false,
      pet,
      goldCost: 0,
      message: '技能不存在',
    };
  }

  const skill = pet.skills[skillIndex];

  // 检查金币
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
  const updatedSkills = pet.skills.filter(s => s.id !== skillId);
  const updatedPet: Pet = {
    ...pet,
    skills: updatedSkills,
  };

  // 判断是否返还技能书
  let returnedBook: string | undefined;
  if (prng.next() < SKILL_FORGET_CONFIG.returnItemRate) {
    // 根据技能获取对应的技能书ID
    const skillTemplateId = skill.skillId || skill.id.split('_').slice(2, -2).join('_');
    const bookId = `book_${skillTemplateId.replace('skill_', '')}`;
    returnedBook = bookId;
  }

  return {
    success: true,
    pet: updatedPet,
    goldCost,
    returnedBook,
    message: returnedBook
      ? `成功遗忘技能${skill.name}，返还了技能书`
      : `成功遗忘技能${skill.name}`,
  };
}

// ============================================
// 技能槽解锁功能
// ============================================

/** 通过等级解锁技能槽 */
export function checkSkillSlotUnlock(pet: Pet): UnlockSlotResult | null {
  const availableSlots = getAvailableSkillSlots(pet.level);
  const currentMaxSlots = pet.maxSkills;

  if (availableSlots > currentMaxSlots) {
    const updatedPet: Pet = {
      ...pet,
      maxSkills: availableSlots,
    };

    return {
      success: true,
      pet: updatedPet,
      slot: availableSlots,
      method: 'level',
      message: `等级达到${pet.level}级，解锁了第${availableSlots}个技能槽`,
    };
  }

  return null;
}

/** 使用道具解锁技能槽 */
export function unlockSkillSlotWithItem(pet: Pet): UnlockSlotResult {
  const maxUnlockableSlots = 4; // 最多4个槽位

  if (pet.maxSkills >= maxUnlockableSlots) {
    return {
      success: false,
      pet,
      slot: pet.maxSkills,
      method: 'item',
      message: '技能槽已全部解锁',
    };
  }

  const newSlot = pet.maxSkills + 1;
  const updatedPet: Pet = {
    ...pet,
    maxSkills: newSlot,
  };

  return {
    success: true,
    pet: updatedPet,
    slot: newSlot,
    method: 'item',
    message: `成功解锁第${newSlot}个技能槽`,
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
    active: '#4ade80',   // 绿色
    passive: '#60a5fa',  // 蓝色
    trigger: '#f472b6',  // 粉色
  };
  return colors[type] || '#ffffff';
}

/** 获取技能书品质颜色 */
export function getSkillBookTierColor(tier: string): string {
  const colors: Record<string, string> = {
    low: '#9ca3af',      // 灰色
    medium: '#60a5fa',   // 蓝色
    high: '#a78bfa',     // 紫色
    super: '#fbbf24',    // 金色
  };
  return colors[tier] || '#ffffff';
}

/** 格式化技能书需求 */
export function formatSkillBookRequirements(skillBook: SkillBook): string[] {
  const requirements: string[] = [];
  const { restrictions } = skillBook;

  if (restrictions.petType && restrictions.petType.length > 0) {
    const typeNames: Record<PetType, string> = {
      attack: '攻击型',
      magic: '法术型',
      defense: '防御型',
      support: '辅助型',
      control: '控制型',
    };
    const types = restrictions.petType.map(t => typeNames[t]).join('/');
    requirements.push(`宠物类型: ${types}`);
  }

  if (restrictions.minLevel) {
    requirements.push(`等级要求: ${restrictions.minLevel}级`);
  }

  if (restrictions.element && restrictions.element.length > 0) {
    const elementNames: Record<Element, string> = {
      metal: '金',
      wood: '木',
      water: '水',
      fire: '火',
      earth: '土',
      physical: '物理',
      none: '无',
    };
    const elements = restrictions.element.map(e => elementNames[e]).join('/');
    requirements.push(`属性要求: ${elements}`);
  }

  return requirements;
}

/** 计算技能属性加成 */
export function calculateSkillStats(skill: PetSkill): Record<string, number> {
  const stats: Record<string, number> = {};

  if (skill.multiplier) {
    // 假设multiplier影响伤害/治疗
    stats.multiplier = skill.multiplier;
  }

  return stats;
}

/** 获取技能描述（带等级信息） */
export function getSkillDescriptionWithLevel(skill: PetSkill): string {
  const level = skill.level || 1;
  let desc = skill.description;

  if (level > 1) {
    const levelConfig = SKILL_LEVEL_CONFIG[level - 1];
    if (levelConfig) {
      desc += ` (Lv.${level}: +${Math.round(levelConfig.multiplierBonus * 100)}%效果)`;
    }
  }

  return desc;
}

// ============================================
// 导出服务对象
// ============================================

export const skillBookService = {
  // 核心方法
  teachSkillFromBook,
  upgradeSkill,
  forgetSkill,
  checkSkillSlotUnlock,
  unlockSkillSlotWithItem,

  // 检查方法
  checkRestrictions,
  findExistingSkill,
  selectSkillToOverride,

  // 成功率计算
  getTierSuccessRate,
  calculateLearnSuccessRate,
  calculateUpgradeSuccessRate,

  // 辅助方法
  getSkillTypeName,
  getSkillTypeColor,
  getSkillBookTierColor,
  formatSkillBookRequirements,
  calculateSkillStats,
  getSkillDescriptionWithLevel,
};
