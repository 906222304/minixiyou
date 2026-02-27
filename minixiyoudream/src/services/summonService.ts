// 召唤兽服务 - 基于梦幻西游系统重新设计
// 整合品质、成长、捕捉、进化、炼妖逻辑

import type {
  Pet,
  PetTemplate,
  PetQuality,
  PetSkill,
  CaptureResult,
  PetType,
  PetElement,
} from '@/types/pet';
import { generateUUID } from '@/types/common';
import {
  getSummonTemplateById,
  ALL_SUMMON_TEMPLATES,
} from '@/constants/summonTemplates';
import {
  selectGrowthRate,
  generateAptitude as generateAptitudeValue,
  rollPetQuality,
  calculateAllStats,
  PET_QUALITY_CONFIG,
} from '@/constants/petGrowth';
import {
  getSkillTemplate,
  getSkillsByTier,
} from '@/constants/petSkills';
import { PRNG, defaultPrng } from './prng';

// 重新导出 PRNG 供其他模块使用
export type { PRNG } from './prng';

/** 召唤兽服务 */
export const summonService = {
  // ==================== 召唤兽创建 ====================

  /**
   * 创建新召唤兽实例
   * @param templateId 召唤兽模板ID
   * @param level 召唤兽等级
   * @param quality 品质 (可选，不传则随机)
   * @param prng 随机数生成器
   */
  createSummon(
    templateId: string,
    level: number,
    quality?: PetQuality,
    prng: PRNG = defaultPrng
  ): Pet | null {
    const template = getSummonTemplateById(templateId);
    if (!template) {
      console.error(`Summon template not found: ${templateId}`);
      return null;
    }

    // 确定品质
    const petQuality = quality || rollPetQuality(prng.nextFloat);
    const qualityConfig = PET_QUALITY_CONFIG[petQuality];

    // 从模板5档成长率中选择一档
    const growthRate = selectGrowthRate(
      template.growthRates,
      petQuality,
      prng.nextFloat
    );

    // 生成资质
    const aptitude = generateAptitudeValue(
      template.aptitudes,
      petQuality,
      template.type,
      prng.nextFloat
    );

    // 计算属性
    const stats = calculateAllStats(
      level,
      aptitude,
      growthRate,
      qualityConfig.baseStatMultiplier
    );

    // 生成初始技能
    const skills = this.generateInitialSkills(template, petQuality, prng);

    // 确定最大技能数
    const baseMaxSkills = 4;
    const maxSkillsBonus = petQuality === 'variant' ? 1 : petQuality === 'divine' ? 2 : 0;

    const pet: Pet = {
      id: generateUUID(),
      templateId,
      name: template.name,
      nickname: undefined,
      icon: template.icon,
      type: template.type,
      rarity: template.rarity,
      element: template.element,
      quality: petQuality,
      level,
      exp: 0,
      maxLevel: 180,
      growthRate,
      aptitude,
      stats: {
        physicalAttack: stats.attack,
        physicalDefense: stats.defense,
        magicAttack: Math.floor(stats.attack * 0.8),
        magicDefense: stats.defense,
        speed: stats.speed,
        maxHp: stats.maxHp,
        maxMp: stats.maxMp,
        critRate: 0.05,
        critDamage: 1.5,
        hitRate: 0.95,
        dodgeRate: stats.dodge / 1000,
        antiCritRate: 0,
        penetration: 0,
        lifeSteal: 0,
        reflect: 0,
        healBonus: 0,
        cooldownReduction: 0,
      },
      skills,
      maxSkills: baseMaxSkills + maxSkillsBonus,
      intimacy: 50,
      intimacyLevel: 1,
      loyalty: 80,
      isActive: false,
      ownerType: 'player',
      ownerId: '',
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      mp: stats.maxMp,
      maxMp: stats.maxMp,
      variantAppearance: qualityConfig.hasAppearanceChange ? `${templateId}_variant` : undefined,
    };

    return pet;
  },

  /**
   * 生成初始技能
   * 变异和神兽：固定5个技能（3个高级+2个初级）
   * 野生和宝宝：随机技能数
   */
  generateInitialSkills(
    template: PetTemplate,
    quality: PetQuality,
    prng: PRNG
  ): PetSkill[] {
    const config = PET_QUALITY_CONFIG[quality];
    const selectedSkills: PetSkill[] = [];

    // 变异和神兽：固定3个高级+2个初级
    if (quality === 'variant' || quality === 'divine') {
      // 获取高级和初级技能列表
      const advancedSkills = getSkillsByTier('advanced');
      const basicSkills = getSkillsByTier('basic');

      // 从模板技能中筛选高级和初级技能
      const templateAdvancedSkills = advancedSkills.filter(s => template.skills.includes(s.id));
      const templateBasicSkills = basicSkills.filter(s => template.skills.includes(s.id));

      // 如果模板技能不足，从全局技能池补充
      const availableAdvanced = templateAdvancedSkills.length >= 3
        ? templateAdvancedSkills
        : [...templateAdvancedSkills, ...advancedSkills.filter(s => !template.skills.includes(s.id))];
      const availableBasic = templateBasicSkills.length >= 2
        ? templateBasicSkills
        : [...templateBasicSkills, ...basicSkills.filter(s => !template.skills.includes(s.id))];

      // 随机选择3个高级技能
      const shuffledAdvanced = [...availableAdvanced].sort(() => prng.nextFloat(-0.5, 0.5));
      for (let i = 0; i < 3 && i < shuffledAdvanced.length; i++) {
        const skillTemplate = shuffledAdvanced[i];
        selectedSkills.push({
          id: `${skillTemplate.id}_${generateUUID().slice(0, 8)}`,
          templateId: skillTemplate.id,
          name: skillTemplate.name,
          tier: skillTemplate.tier,
          type: skillTemplate.type,
          level: 1,
          locked: false,
        });
      }

      // 随机选择2个初级技能
      const shuffledBasic = [...availableBasic].sort(() => prng.nextFloat(-0.5, 0.5));
      for (let i = 0; i < 2 && i < shuffledBasic.length; i++) {
        const skillTemplate = shuffledBasic[i];
        // 避免重复
        if (!selectedSkills.find(s => s.templateId === skillTemplate.id)) {
          selectedSkills.push({
            id: `${skillTemplate.id}_${generateUUID().slice(0, 8)}`,
            templateId: skillTemplate.id,
            name: skillTemplate.name,
            tier: skillTemplate.tier,
            type: skillTemplate.type,
            level: 1,
            locked: false,
          });
        }
      }

      return selectedSkills;
    }

    // 野生和宝宝：随机技能数
    const skillCount = prng.nextInt(config.initialSkillMin, config.initialSkillMax);

    if (skillCount === 0 || template.skills.length === 0) {
      return [];
    }

    // 从模板技能中随机选择
    const availableSkills = [...template.skills];

    for (let i = 0; i < skillCount && availableSkills.length > 0; i++) {
      const index = prng.nextInt(0, availableSkills.length - 1);
      const skillId = availableSkills.splice(index, 1)[0];

      // 获取技能模板
      const skillTemplate = getSkillTemplate(skillId);
      if (skillTemplate) {
        selectedSkills.push({
          id: `${skillId}_${generateUUID().slice(0, 8)}`,
          templateId: skillId,
          name: skillTemplate.name,
          tier: skillTemplate.tier,
          type: skillTemplate.type,
          level: 1,
          locked: false,
        });
      }
    }

    return selectedSkills;
  },

  // ==================== 属性计算 ====================

  /**
   * 重新计算召唤兽属性（升级/进化后调用）
   */
  recalculateStats(pet: Pet): Pet {
    const template = getSummonTemplateById(pet.templateId);
    if (!template) return pet;

    const qualityConfig = PET_QUALITY_CONFIG[pet.quality];
    const stats = calculateAllStats(
      pet.level,
      pet.aptitude,
      pet.growthRate,
      qualityConfig.baseStatMultiplier
    );

    return {
      ...pet,
      stats: {
        ...pet.stats,
        physicalAttack: stats.attack,
        physicalDefense: stats.defense,
        magicAttack: Math.floor(stats.attack * 0.8),
        magicDefense: stats.defense,
        speed: stats.speed,
        maxHp: stats.maxHp,
        maxMp: stats.maxMp,
        dodgeRate: stats.dodge / 1000,
      },
      maxHp: stats.maxHp,
      maxMp: stats.maxMp,
    };
  },

  /**
   * 升级召唤兽
   */
  levelUp(pet: Pet, expGain: number): Pet {
    const newExp = pet.exp + expGain;
    const expNeeded = this.getExpNeeded(pet.level);

    if (newExp >= expNeeded && pet.level < pet.maxLevel) {
      const leveledPet = {
        ...pet,
        level: pet.level + 1,
        exp: newExp - expNeeded,
      };
      return this.recalculateStats(leveledPet);
    }

    return {
      ...pet,
      exp: Math.min(newExp, expNeeded),
    };
  },

  /**
   * 获取升级所需经验
   */
  getExpNeeded(level: number): number {
    // 经验公式：基础经验 * 等级^1.5
    const baseExp = 100;
    return Math.floor(baseExp * Math.pow(level, 1.5));
  },

  // ==================== 技能系统 ====================

  /**
   * 学习新技能（打书）
   */
  learnSkill(
    pet: Pet,
    skillBookId: string,
    prng: PRNG = defaultPrng
  ): { success: boolean; message: string; pet: Pet } {
    const skillTemplate = getSkillTemplate(skillBookId);
    if (!skillTemplate) {
      return { success: false, message: '技能书不存在', pet };
    }

    // 检查是否已有该技能
    const existingSkill = pet.skills.find(s => s.templateId === skillBookId);
    if (existingSkill) {
      // 升级技能
      if (existingSkill.level < 5) {
        const updatedSkills = pet.skills.map(s =>
          s.templateId === skillBookId
            ? { ...s, level: s.level + 1 }
            : s
        );
        return {
          success: true,
          message: `${skillTemplate.name} 从 Lv.${existingSkill.level} 升级到 Lv.${existingSkill.level + 1}`,
          pet: { ...pet, skills: updatedSkills },
        };
      }
      return { success: false, message: '技能已达最高等级', pet };
    }

    // 检查技能栏是否已满
    if (pet.skills.length >= pet.maxSkills) {
      // 随机覆盖一个未锁定的技能
      const unlockedSkills = pet.skills.filter(s => !s.locked);
      if (unlockedSkills.length === 0) {
        return { success: false, message: '技能栏已满且所有技能已锁定', pet };
      }

      const overrideIndex = prng.nextInt(0, unlockedSkills.length - 1);
      const overrideSkill = unlockedSkills[overrideIndex];
      const updatedSkills = pet.skills.map(s =>
        s.id === overrideSkill.id
          ? {
              id: `${skillBookId}_${generateUUID().slice(0, 8)}`,
              templateId: skillBookId,
              name: skillTemplate.name,
              tier: skillTemplate.tier,
              type: skillTemplate.type,
              level: 1,
              locked: false,
            }
          : s
      );
      return {
        success: true,
        message: `${overrideSkill.name} 被 ${skillTemplate.name} 覆盖`,
        pet: { ...pet, skills: updatedSkills },
      };
    }

    // 添加新技能
    const newSkill: PetSkill = {
      id: `${skillBookId}_${generateUUID().slice(0, 8)}`,
      templateId: skillBookId,
      name: skillTemplate.name,
      tier: skillTemplate.tier,
      type: skillTemplate.type,
      level: 1,
      locked: false,
    };

    return {
      success: true,
      message: `学会新技能 ${skillTemplate.name}`,
      pet: { ...pet, skills: [...pet.skills, newSkill] },
    };
  },

  /**
   * 锁定/解锁技能
   */
  toggleSkillLock(pet: Pet, skillId: string): Pet {
    const updatedSkills = pet.skills.map(s =>
      s.id === skillId ? { ...s, locked: !s.locked } : s
    );
    return { ...pet, skills: updatedSkills };
  },

  // ==================== 捕捉系统 ====================

  /**
   * 计算捕捉成功率
   */
  calculateCaptureRate(
    templateId: string,
    currentHpPercent: number,
    hasStatusEffect: boolean,
    quality: PetQuality
  ): number {
    const template = getSummonTemplateById(templateId);
    if (!template) return 0;

    // 基础捕捉率
    let baseRate = 30;

    // HP越低越容易捕捉
    const hpFactor = (1 - currentHpPercent) * 40;
    baseRate += hpFactor;

    // 异常状态加成
    if (hasStatusEffect) {
      baseRate += 15;
    }

    // 品质修正
    const qualityModifiers: Record<PetQuality, number> = {
      wild: 0,
      baby: -10,
      variant: -25,
      divine: -50,
    };
    baseRate += qualityModifiers[quality];

    // 稀有度修正
    const rarityModifiers: Record<string, number> = {
      common: 0,
      uncommon: -5,
      rare: -15,
      epic: -25,
      legendary: -35,
      mythic: -50,
    };
    baseRate += rarityModifiers[template.rarity] || 0;

    return Math.max(1, Math.min(100, baseRate));
  },

  /**
   * 尝试捕捉召唤兽
   */
  attemptCapture(
    templateId: string,
    currentHpPercent: number,
    hasStatusEffect: boolean,
    prng: PRNG = defaultPrng
  ): CaptureResult {
    // 随机品质
    const quality = rollPetQuality(prng.nextFloat);

    // 计算捕捉率
    const captureRate = this.calculateCaptureRate(
      templateId,
      currentHpPercent,
      hasStatusEffect,
      quality
    );

    // 掷骰
    const roll = prng.nextFloat() * 100;
    const success = roll < captureRate;

    if (success) {
      const pet = this.createSummon(templateId, 1, quality, prng);
      return {
        success: true,
        pet: pet || undefined,
        captureRate,
        roll,
      };
    }

    return {
      success: false,
      captureRate,
      roll,
      reason: '捕捉失败',
    };
  },

  // ==================== 查询方法 ====================

  /**
   * 获取所有可捕捉的召唤兽模板
   */
  getAllTemplates(): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES;
  },

  /**
   * 按携带等级获取召唤兽列表
   */
  getTemplatesByCarryLevel(level: number): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES.filter(t => t.carryLevel <= level);
  },

  /**
   * 按类型获取召唤兽列表
   */
  getTemplatesByType(type: PetType): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES.filter(t => t.type === type);
  },

  /**
   * 按元素获取召唤兽列表
   */
  getTemplatesByElement(element: PetElement): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES.filter(t => t.element === element);
  },

  /**
   * 按稀有度获取召唤兽列表
   */
  getTemplatesByRarity(rarity: string): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES.filter(t => t.rarity === rarity);
  },

  /**
   * 获取地图可捕捉的召唤兽
   */
  getCapturablePets(mapId: string): PetTemplate[] {
    return ALL_SUMMON_TEMPLATES.filter(t => t.captureLocations.includes(mapId));
  },

  /**
   * 获取召唤兽信息摘要
   */
  getPetSummary(pet: Pet): string {
    const qualityConfig = PET_QUALITY_CONFIG[pet.quality];
    return `${pet.name} (${qualityConfig.name}) Lv.${pet.level} - 攻:${pet.stats.physicalAttack} 防:${pet.stats.physicalDefense} 血:${pet.maxHp}`;
  },

  // ==================== 成长系统 ====================

  /**
   * 增加亲密度
   */
  increaseIntimacy(pet: Pet, amount: number): Pet {
    const newIntimacy = Math.min(100, pet.intimacy + amount);

    // 更新亲密度等级
    let newIntimacyLevel = pet.intimacyLevel;
    if (newIntimacy >= 80) newIntimacyLevel = 5;
    else if (newIntimacy >= 60) newIntimacyLevel = 4;
    else if (newIntimacy >= 40) newIntimacyLevel = 3;
    else if (newIntimacy >= 20) newIntimacyLevel = 2;
    else newIntimacyLevel = 1;

    return {
      ...pet,
      intimacy: newIntimacy,
      intimacyLevel: newIntimacyLevel,
    };
  },

  /**
   * 增加忠诚度
   */
  increaseLoyalty(pet: Pet, amount: number): Pet {
    return {
      ...pet,
      loyalty: Math.min(100, pet.loyalty + amount),
    };
  },

  /**
   * 减少忠诚度 (战斗失败时)
   */
  decreaseLoyalty(pet: Pet, amount: number): Pet {
    return {
      ...pet,
      loyalty: Math.max(0, pet.loyalty - amount),
    };
  },
};

export default summonService;
