// 合宠服务逻辑

import type { Pet, PetAptitude, PetSkill, FusionResult, Quality } from '@/types';
import { generateUUID } from '@/types';
import { getPetTemplate } from '@/constants/pets';
import { calculatePetStats } from '@/constants/formulas';
import {
  PET_FUSION_CONFIG,
  getNextRarity,
  getMaxRarity,
} from '@/constants/petFusion';
import type { PRNG } from '@/utils/prng';

/** 合宠预览信息 */
export interface FusionPreview {
  /** 主宠物 */
  mainPet: Pet;
  /** 副宠物 */
  subPet: Pet;
  /** 资质范围预览 */
  aptitudeRange: {
    [K in keyof PetAptitude]: {
      min: number;
      max: number;
    };
  };
  /** 合并后的技能池 */
  mergedSkillPool: PetSkill[];
  /** 金币消耗 */
  goldCost: number;
  /** 额外技能槽概率 */
  bonusSlotChance: number;
  /** 稀有度提升概率 */
  rarityUpChance: number;
  /** 资质超范围概率 */
  overflowChance: number;
}

/** 合宠服务 */
export const petFusionService = {
  /**
   * 获取合宠预览信息
   */
  getFusionPreview(mainPet: Pet, subPet: Pet): FusionPreview {
    const aptitudeRange = this.calculateAptitudeRange(mainPet.aptitude, subPet.aptitude);
    const mergedSkillPool = this.getMergedSkillPool(mainPet.skills, subPet.skills);
    const goldCost = this.calculateFusionCost(mainPet.level, subPet.level);

    return {
      mainPet,
      subPet,
      aptitudeRange,
      mergedSkillPool,
      goldCost,
      bonusSlotChance: PET_FUSION_CONFIG.bonusSkillSlotChance * 100,
      rarityUpChance: PET_FUSION_CONFIG.rarityUpChance * 100,
      overflowChance: PET_FUSION_CONFIG.aptitudeOverflowChance * 100,
    };
  },

  /**
   * 合宠主方法
   * @param mainPet 主宠物
   * @param subPet 副宠物
   * @param prng 随机数生成器
   */
  fusePets(mainPet: Pet, subPet: Pet, prng: PRNG): FusionResult {
    // 1. 计算新资质
    const { aptitude: newAptitude } = this.calculateNewAptitudes(
      mainPet.aptitude,
      subPet.aptitude,
      prng
    );

    // 2. 合并技能
    const { skills: mergedSkills, absorbedSkills } = this.mergeSkills(
      mainPet.skills,
      subPet.skills,
      prng
    );

    // 3. 计算新等级（取两者中较高的等级）
    const newLevel = Math.max(mainPet.level, subPet.level);

    // 4. 确定新稀有度
    const { rarity: newRarity, rarityUp } = this.calculateNewRarity(
      mainPet.rarity,
      subPet.rarity,
      prng
    );

    // 5. 计算技能槽数量
    const { maxSkills: newMaxSkills, bonusSlot } = this.calculateSkillSlots(
      mainPet.maxSkills,
      subPet.maxSkills,
      prng
    );

    // 6. 创建新宠物
    const newPet = this.createNewPet(
      mainPet,
      newAptitude,
      mergedSkills,
      newLevel,
      newRarity,
      newMaxSkills
    );

    // 7. 构建资质变化记录
    const aptitudeChanges = this.buildAptitudeChanges(mainPet.aptitude, newAptitude);

    return {
      pet: newPet,
      absorbedSkills,
      aptitudeChanges,
      rarityUp,
      bonusSkillSlot: bonusSlot,
    };
  },

  /**
   * 计算新资质
   * 新宠物资质在两只原始宠物资质范围内随机
   * 有10%概率向上超范围10%
   */
  calculateNewAptitudes(
    mainAptitude: PetAptitude,
    subAptitude: PetAptitude,
    prng: PRNG
  ): { aptitude: PetAptitude; overflowed: boolean } {
    const range = this.calculateAptitudeRange(mainAptitude, subAptitude);

    // 检查是否触发超范围
    const overflowed = prng.roll(PET_FUSION_CONFIG.aptitudeOverflowChance * 100);

    const aptitude: PetAptitude = {
      attack: this.randomInRange(range.attack.min, range.attack.max, overflowed, prng),
      defense: this.randomInRange(range.defense.min, range.defense.max, overflowed, prng),
      magic: this.randomInRange(range.magic.min, range.magic.max, overflowed, prng),
      speed: this.randomInRange(range.speed.min, range.speed.max, overflowed, prng),
      hp: this.randomInRange(range.hp.min, range.hp.max, overflowed, prng),
      mp: this.randomInRange(range.mp.min, range.mp.max, overflowed, prng),
    };

    return { aptitude, overflowed };
  },

  /**
   * 计算资质范围
   */
  calculateAptitudeRange(
    mainAptitude: PetAptitude,
    subAptitude: PetAptitude
  ): { [K in keyof PetAptitude]: { min: number; max: number } } {
    return {
      attack: {
        min: Math.min(mainAptitude.attack, subAptitude.attack),
        max: Math.max(mainAptitude.attack, subAptitude.attack),
      },
      defense: {
        min: Math.min(mainAptitude.defense, subAptitude.defense),
        max: Math.max(mainAptitude.defense, subAptitude.defense),
      },
      magic: {
        min: Math.min(mainAptitude.magic, subAptitude.magic),
        max: Math.max(mainAptitude.magic, subAptitude.magic),
      },
      speed: {
        min: Math.min(mainAptitude.speed, subAptitude.speed),
        max: Math.max(mainAptitude.speed, subAptitude.speed),
      },
      hp: {
        min: Math.min(mainAptitude.hp, subAptitude.hp),
        max: Math.max(mainAptitude.hp, subAptitude.hp),
      },
      mp: {
        min: Math.min(mainAptitude.mp, subAptitude.mp),
        max: Math.max(mainAptitude.mp, subAptitude.mp),
      },
    };
  },

  /**
   * 在范围内生成随机值
   * @param overflowed 是否触发超范围，如果触发则最大值+10%
   */
  randomInRange(min: number, max: number, overflowed: boolean, prng: PRNG): number {
    let actualMax = max;
    if (overflowed) {
      // 向上超范围10%
      const bonus = (max - min) * PET_FUSION_CONFIG.aptitudeOverflowBonus;
      actualMax = max + bonus;
      // 但不能超过资质上限
      actualMax = Math.min(actualMax, PET_FUSION_CONFIG.aptitudeMax);
    }

    const value = prng.nextFloat(min, actualMax);
    // 保留4位小数
    return Math.round(value * 10000) / 10000;
  },

  /**
   * 合并技能池
   * 技能池合并，每个技能60%概率保留
   */
  mergeSkills(
    mainSkills: PetSkill[],
    subSkills: PetSkill[],
    prng: PRNG
  ): { skills: PetSkill[]; absorbedSkills: string[] } {
    const absorbedSkills: string[] = [];
    const retainedSkills: PetSkill[] = [];

    // 收集所有技能到Map中（去重）
    const allSkillsMap = new Map<string, PetSkill>();

    // 添加主宠物技能
    for (const skill of mainSkills) {
      allSkillsMap.set(skill.id, skill);
    }

    // 添加副宠物技能（如果不存在）
    for (const skill of subSkills) {
      if (!allSkillsMap.has(skill.id)) {
        allSkillsMap.set(skill.id, skill);
      }
    }

    // 对每个技能进行保留判定
    for (const [id, skill] of allSkillsMap) {
      if (prng.roll(PET_FUSION_CONFIG.skillRetentionRate * 100)) {
        retainedSkills.push(skill);
      } else {
        // 检查是否来自副宠物
        const isFromSub = subSkills.some(s => s.id === id);
        if (isFromSub) {
          absorbedSkills.push(skill.name);
        }
      }
    }

    return { skills: retainedSkills, absorbedSkills };
  },

  /**
   * 计算新稀有度
   * 10%概率提升稀有度
   */
  calculateNewRarity(
    mainRarity: Quality,
    subRarity: Quality,
    prng: PRNG
  ): { rarity: Quality; rarityUp: boolean } {
    // 基础稀有度取两者中较高的
    const baseRarity = getMaxRarity(mainRarity, subRarity);

    // 检查是否触发稀有度提升
    const rarityUp = prng.roll(PET_FUSION_CONFIG.rarityUpChance * 100);

    if (rarityUp) {
      const nextRarity = getNextRarity(baseRarity);
      if (nextRarity) {
        return { rarity: nextRarity, rarityUp: true };
      }
    }

    return { rarity: baseRarity, rarityUp: false };
  },

  /**
   * 计算技能槽数量
   * 15%概率获得额外技能槽
   */
  calculateSkillSlots(
    mainMaxSkills: number,
    subMaxSkills: number,
    prng: PRNG
  ): { maxSkills: number; bonusSlot: boolean } {
    // 基础技能槽取两者中较多的
    const baseMaxSkills = Math.max(mainMaxSkills, subMaxSkills);

    // 检查是否触发额外技能槽
    const bonusSlot = prng.roll(PET_FUSION_CONFIG.bonusSkillSlotChance * 100);

    if (bonusSlot && baseMaxSkills < PET_FUSION_CONFIG.maxSkillSlots) {
      return { maxSkills: baseMaxSkills + 1, bonusSlot: true };
    }

    return { maxSkills: baseMaxSkills, bonusSlot: false };
  },

  /**
   * 创建新宠物实例
   */
  createNewPet(
    mainPet: Pet,
    newAptitude: PetAptitude,
    skills: PetSkill[],
    level: number,
    rarity: Quality,
    maxSkills: number
  ): Pet {
    const template = getPetTemplate(mainPet.baseId);
    if (!template) {
      throw new Error(`Pet template not found: ${mainPet.baseId}`);
    }

    // 计算新属性
    const stats = calculatePetStats(
      template.baseStats,
      newAptitude as unknown as Record<string, number>,
      level
    );

    // 限制技能数量不超过技能槽
    const finalSkills = skills.slice(0, maxSkills);

    const newPet: Pet = {
      id: generateUUID(),
      baseId: mainPet.baseId,
      name: mainPet.name,
      nickname: mainPet.nickname, // 保留主宠物的昵称
      icon: mainPet.icon,
      type: mainPet.type,
      rarity,
      element: mainPet.element,
      level,
      exp: 0, // 经验重置
      maxLevel: mainPet.maxLevel,
      aptitude: newAptitude,
      stats,
      skills: finalSkills,
      maxSkills,
      intimacy: Math.max(mainPet.intimacy, 0), // 保留一定的亲密度
      intimacyLevel: Math.max(mainPet.intimacyLevel, 1),
      loyalty: Math.max(mainPet.loyalty, 50),
      isActive: false, // 默认不出战
      ownerType: mainPet.ownerType,
      ownerId: mainPet.ownerId,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      mp: stats.maxMp,
      maxMp: stats.maxMp,
    };

    return newPet;
  },

  /**
   * 构建资质变化记录
   */
  buildAptitudeChanges(
    oldAptitude: PetAptitude,
    newAptitude: PetAptitude
  ): FusionResult['aptitudeChanges'] {
    const keys: (keyof PetAptitude)[] = ['attack', 'defense', 'magic', 'speed', 'hp', 'mp'];
    return keys.map(stat => ({
      stat,
      oldValue: oldAptitude[stat],
      newValue: newAptitude[stat],
    }));
  },

  /**
   * 获取合并后的技能池（用于预览）
   */
  getMergedSkillPool(mainSkills: PetSkill[], subSkills: PetSkill[]): PetSkill[] {
    const allSkillsMap = new Map<string, PetSkill>();

    for (const skill of mainSkills) {
      allSkillsMap.set(skill.id, skill);
    }

    for (const skill of subSkills) {
      if (!allSkillsMap.has(skill.id)) {
        allSkillsMap.set(skill.id, skill);
      }
    }

    return Array.from(allSkillsMap.values());
  },

  /**
   * 计算合宠金币消耗
   */
  calculateFusionCost(mainPetLevel: number, subPetLevel: number): number {
    const baseCost = 1000;
    const levelMultiplier = (mainPetLevel + subPetLevel) * 50;
    return baseCost + levelMultiplier;
  },

  /**
   * 获取资质名称
   */
  getAptitudeName(stat: keyof PetAptitude): string {
    const names: Record<keyof PetAptitude, string> = {
      attack: '攻击资质',
      defense: '防御资质',
      magic: '法术资质',
      speed: '速度资质',
      hp: '生命资质',
      mp: '法力资质',
    };
    return names[stat];
  },

  /**
   * 验证两只宠物是否可以合宠
   */
  validateFusion(mainPet: Pet, subPet: Pet): { valid: boolean; reason?: string } {
    // 不能与自己合宠
    if (mainPet.id === subPet.id) {
      return { valid: false, reason: '不能选择相同的宠物进行合成' };
    }

    // 必须是同一种宠物
    if (mainPet.baseId !== subPet.baseId) {
      return { valid: false, reason: '只能合成相同种类的宠物' };
    }

    return { valid: true };
  },
};

export default petFusionService;
