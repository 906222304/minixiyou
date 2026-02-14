// 宠物技能学习服务 - 打书系统核心逻辑

import { PRNG } from '@/utils/prng';
import {
  getSkillBook,
  createPetSkill,
  SKILL_LEARNING_CONFIG,
} from '@/constants/skillBooks';
import type { Pet, SkillBook, PetSkill, LearnSkillResult, PetType, Element } from '@/types';

// ============================================
// 学习限制检查
// ============================================

/** 学习限制检查结果 */
export interface RestrictionCheckResult {
  canLearn: boolean;
  reason?: string;
}

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
        fire: '火',
        ice: '冰',
        thunder: '雷',
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

/** 检查是否已学习该技能 */
export function hasSkill(pet: Pet, skillId: string): boolean {
  return pet.skills.some(skill => {
    // 从技能id中提取模板id
    const templateId = skill.id.split('_').slice(0, -2).join('_') || skill.id;
    return templateId === skillId || skill.id === skillId;
  });
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

/** 计算覆盖成功率 */
export function calculateOverrideSuccessRate(
  skillBook: SkillBook,
  pet: Pet
): number {
  let baseRate = SKILL_LEARNING_CONFIG.fullSlotBaseSuccessRate;

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

// ============================================
// 技能学习核心逻辑
// ============================================

/** 学习技能结果 */
export interface TeachSkillResult extends LearnSkillResult {
  pet: Pet;
  successRate?: number;
}

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
      reason: '技能书不存在',
    };
  }

  // 检查学习限制
  const restrictionCheck = checkRestrictions(pet, skillBook);
  if (!restrictionCheck.canLearn) {
    return {
      success: false,
      pet,
      reason: restrictionCheck.reason,
    };
  }

  // 检查是否已学习该技能
  if (hasSkill(pet, skillBook.skillId)) {
    return {
      success: false,
      pet,
      reason: '宠物已经学习了此技能',
    };
  }

  // 创建新技能
  const newSkill = createPetSkill(skillBook.skillId);
  if (!newSkill) {
    return {
      success: false,
      pet,
      reason: '技能不存在',
    };
  }

  // 技能槽未满，直接学习
  if (pet.skills.length < pet.maxSkills) {
    const updatedPet: Pet = {
      ...pet,
      skills: [...pet.skills, newSkill],
    };

    return {
      success: true,
      pet: updatedPet,
      newSkill,
    };
  }

  // 技能槽已满，需要覆盖
  const successRate = useProtection
    ? SKILL_LEARNING_CONFIG.protectionSuccessRate
    : calculateOverrideSuccessRate(skillBook, pet);

  // 判定是否成功
  const roll = prng.next() * 100;
  const isSuccess = roll < successRate;

  if (!isSuccess) {
    return {
      success: false,
      pet,
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
      reason: '没有可覆盖的技能',
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
    newSkill,
    overriddenSkill,
    successRate,
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
      fire: '火',
      ice: '冰',
      thunder: '雷',
      physical: '物理',
      none: '无',
    };
    const elements = restrictions.element.map(e => elementNames[e]).join('/');
    requirements.push(`属性要求: ${elements}`);
  }

  return requirements;
}

// ============================================
// 导出服务对象
// ============================================

export const petSkillService = {
  // 核心方法
  teachSkillFromBook,
  checkRestrictions,
  selectSkillToOverride,

  // 辅助方法
  hasSkill,
  calculateOverrideSuccessRate,
  getSkillTypeName,
  getSkillTypeColor,
  formatSkillBookRequirements,
};
