// 宠物系统服务 - 整合品质、成长、捕捉、进化、炼妖逻辑

import type {
  Pet,
  PetTemplate,
  PetQuality,
  GrowthRate,
  PetAptitude,
  PetSkill,
  CaptureResult,
  AlchemyResult,
  EvolutionActionResult,
  CombatStats,
} from '@/types';
import { generateUUID } from '@/types';
import { getPetTemplate, PET_TEMPLATES } from '@/constants/pets';
import {
  generateGrowthRate,
  generateAptitude,
  rollPetQuality,
  calculateGrowthStat,
  getPetQualityConfig,
} from '@/constants/petGrowth';
import {
  calculateCaptureRate,
  canUseCaptureItem,
  getRecommendedCaptureItem,
  CAPTURE_CONFIG,
} from '@/constants/petCapture';
import {
  getEvolutionConfig,
  canEvolve,
  getAlchemyMaterial,
  getAptitudeCap,
  calculateFusionQuality,
  calculateFusionAptitude,
  FUSION_RULES,
} from '@/constants/petEvolution';

/** PRNG 接口 */
export interface PRNG {
  nextFloat: (min?: number, max?: number) => number;
  roll: (chance: number) => boolean;
  nextInt: (min: number, max: number) => number;
}

/** 默认随机数生成器 */
const defaultPrng: PRNG = {
  nextFloat: (min = 0, max = 1) => Math.random() * (max - min) + min,
  roll: (chance) => Math.random() * 100 < chance,
  nextInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

/** 宠物服务 */
export const petService = {
  // ==================== 宠物创建 ====================

  /**
   * 创建新宠物实例
   * @param templateId 宠物模板ID
   * @param level 宠物等级
   * @param quality 品质 (可选，不传则随机)
   * @param prng 随机数生成器
   */
  createPet(
    templateId: string,
    level: number,
    quality?: PetQuality,
    prng: PRNG = defaultPrng
  ): Pet | null {
    const template = getPetTemplate(templateId);
    if (!template) {
      console.error(`Pet template not found: ${templateId}`);
      return null;
    }

    // 确定品质
    const petQuality = quality || rollPetQuality(prng.nextFloat);
    const qualityConfig = getPetQualityConfig(petQuality);

    // 生成成长率
    const growthRate = generateGrowthRate(petQuality, template.type, prng.nextFloat);

    // 生成资质
    const aptitude = generateAptitude(petQuality, prng.nextFloat);

    // 计算属性
    const stats = this.calculateStats(template, aptitude, growthRate, level, qualityConfig.baseStatMultiplier);

    // 生成初始技能
    const skills = this.generateInitialSkills(template, petQuality, prng);

    // 确定最大技能数
    const baseMaxSkills = 3;
    const maxSkillsBonus = petQuality === 'variant' ? 1 : petQuality === 'divine' ? 2 : 0;

    const pet: Pet = {
      id: generateUUID(),
      baseId: templateId,
      name: template.name,
      icon: template.icon,
      type: template.type,
      rarity: template.baseRarity,
      element: template.element,
      quality: petQuality,
      growthRate,
      level,
      exp: 0,
      maxLevel: 100,
      aptitude,
      stats,
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
   * 计算宠物属性
   */
  calculateStats(
    template: PetTemplate,
    aptitude: PetAptitude,
    growthRate: GrowthRate,
    level: number,
    qualityMultiplier: number
  ): CombatStats {
    const base = template.baseStats;

    // 使用成长率公式计算各项属性
    const physicalAttack = calculateGrowthStat(base.physicalAttack ?? 0, growthRate.physical, level, aptitude.attack);
    const physicalDefense = calculateGrowthStat(base.physicalDefense ?? 0, growthRate.defense, level, aptitude.defense);
    const magicAttack = calculateGrowthStat(base.magicAttack ?? 0, growthRate.magic, level, aptitude.magic);
    const magicDefense = calculateGrowthStat(base.magicDefense ?? 0, growthRate.defense, level, aptitude.defense);
    const speed = calculateGrowthStat(base.speed ?? 0, growthRate.speed, level, aptitude.speed);
    const maxHp = Math.floor(calculateGrowthStat(base.maxHp ?? 0, growthRate.hp, level, aptitude.hp));
    const maxMp = Math.floor(calculateGrowthStat(base.maxMp ?? 0, growthRate.mp, level, aptitude.mp));

    // 应用品质倍率
    const applyMultiplier = (value: number) => Math.floor(value * qualityMultiplier);

    return {
      physicalAttack: applyMultiplier(physicalAttack),
      physicalDefense: applyMultiplier(physicalDefense),
      magicAttack: applyMultiplier(magicAttack),
      magicDefense: applyMultiplier(magicDefense),
      speed: applyMultiplier(speed),
      maxHp: applyMultiplier(maxHp),
      maxMp: applyMultiplier(maxMp),
      critRate: base.critRate ?? 0,
      critDamage: base.critDamage ?? 0,
      hitRate: base.hitRate ?? 0,
      dodgeRate: base.dodgeRate ?? 0,
      antiCritRate: base.antiCritRate ?? 0,
      penetration: base.penetration ?? 0,
      lifeSteal: base.lifeSteal ?? 0,
      reflect: base.reflect ?? 0,
      healBonus: base.healBonus ?? 0,
      cooldownReduction: base.cooldownReduction ?? 0,
    };
  },

  /**
   * 生成初始技能
   */
  generateInitialSkills(
    template: PetTemplate,
    quality: PetQuality,
    prng: PRNG
  ): PetSkill[] {
    const config = getPetQualityConfig(quality);
    const skillCount = prng.nextInt(config.initialSkillMin, config.initialSkillMax);

    if (skillCount === 0 || template.learnableSkills.length === 0) {
      return [];
    }

    // 从可学习技能中随机选择
    const availableSkills = [...template.learnableSkills];
    const selectedSkills: PetSkill[] = [];

    for (let i = 0; i < skillCount && availableSkills.length > 0; i++) {
      const index = prng.nextInt(0, availableSkills.length - 1);
      const skillId = availableSkills.splice(index, 1)[0];

      // 创建简化的技能对象
      selectedSkills.push({
        id: skillId,
        name: this.getSkillName(skillId),
        type: 'active',
        description: '',
      });
    }

    return selectedSkills;
  },

  /**
   * 获取技能名称 (简化版本)
   */
  getSkillName(skillId: string): string {
    const skillNames: Record<string, string> = {
      pet_shell: '护盾',
      pet_provoke: '挑衅',
      pet_iron_skin: '铁皮',
      pet_bite: '撕咬',
      pet_jump: '跳跃',
      pet_fury: '狂暴',
      pet_charge: '冲锋',
      pet_tough_skin: '厚皮',
      pet_poison: '毒击',
      pet_slash: '劈砍',
      pet_steal: '偷窃',
      pet_suck_blood: '吸血',
      pet_speed_up: '加速',
      pet_taunt: '嘲讽',
      pet_crit_up: '暴击强化',
      pet_bone_strike: '骨击',
      pet_curse: '诅咒',
      pet_fear: '恐惧',
      pet_magic_missile: '魔法飞弹',
      pet_fireball: '火球术',
      pet_heal: '治疗',
      pet_root: '缠绕',
      pet_roar: '咆哮',
      pet_claw: '利爪',
      pet_counter: '反击',
      pet_charm: '魅惑',
      pet_illusion: '幻象',
      pet_sleep: '睡眠',
      pet_acid: '酸液',
      pet_web: '蛛网',
      pet_thunder_strike: '雷击',
      pet_thunder_breath: '雷霆吐息',
      pet_paralyze: '麻痹',
      pet_magic_boost: '魔攻强化',
      pet_buff: '增益',
      pet_cleanse: '净化',
      pet_king_roar: '王者咆哮',
      pet_fury_claw: '狂暴之爪',
      pet_brave: '勇猛',
      pet_dark_magic: '暗黑魔法',
      pet_divine_strike: '神圣一击',
      pet_dragon_breath: '龙息',
      pet_ice_storm: '冰风暴',
      pet_dragon_roar: '龙啸',
      pet_fire_storm: '火焰风暴',
      pet_rebirth: '重生',
      pet_phoenix_tears: '凤凰之泪',
      pet_blood_fury: '血怒',
      pet_dark_strike: '暗影打击',
      pet_invisibility: '隐身',
      pet_hell_strike: '地狱打击',
      pet_dance: '舞蹈',
      pet_multi_strike: '连击',
      pet_talisman: '符咒',
      pet_resurrect: '复活',
      pet_immortal: '不朽',
      pet_tiger_fury: '虎威',
      pet_golden_claw: '金爪',
      pet_nirvana_fire: '涅槃之火',
      pet_eternal_flame: '永恒之炎',
      pet_mass_resurrect: '群体复活',
      pet_divine_shield: '神圣护盾',
      pet_divine_bite: '神圣撕咬',
      pet_heavenly_roar: '天咆',
      pet_divine_heal: '神圣治疗',
      pet_blessing: '祝福',
      pet_monkey_king: '猴王之怒',
      pet_dodge: '闪避',
      pet_snowball: '雪球',
      pet_freeze: '冰冻',
      pet_illuminate: '照明',
      pet_iron_wall: '铁壁',
    };
    return skillNames[skillId] || skillId;
  },

  // ==================== 捕捉系统 ====================

  /**
   * 尝试捕捉宠物
   * @param templateId 宠物模板ID
   * @param currentHp 当前血量
   * @param maxHp 最大血量
   * @param statuses 状态效果列表
   * @param itemId 捕获道具ID
   * @param mapId 地图ID
   * @param prng 随机数生成器
   */
  capturePet(
    templateId: string,
    currentHp: number,
    maxHp: number,
    statuses: string[] = [],
    itemId?: string,
    mapId?: string,
    prng: PRNG = defaultPrng
  ): CaptureResult {
    const template = getPetTemplate(templateId);
    if (!template) {
      return {
        success: false,
        captureRate: 0,
        roll: 0,
        reason: '未找到宠物模板',
      };
    }

    // 检查道具是否可用
    if (itemId && !canUseCaptureItem(itemId, 1)) {
      return {
        success: false,
        captureRate: 0,
        roll: 0,
        reason: '该道具无法使用',
      };
    }

    // 先随机品质
    const quality = rollPetQuality(prng.nextFloat);

    // 计算捕获率
    const captureRate = calculateCaptureRate(
      CAPTURE_CONFIG.baseCaptureRate,
      currentHp,
      maxHp,
      statuses,
      quality,
      itemId,
      mapId
    );

    // 执行捕获判定
    const roll = prng.nextFloat();
    const success = roll < captureRate;

    if (!success) {
      return {
        success: false,
        captureRate,
        roll,
        reason: '捕捉失败',
      };
    }

    // 创建宠物
    const pet = this.createPet(templateId, 1, quality, prng);

    if (!pet) {
      return {
        success: false,
        captureRate,
        roll,
        reason: '创建宠物失败',
      };
    }

    return {
      success: true,
      pet,
      captureRate,
      roll,
    };
  },

  /**
   * 获取捕捉预览信息
   */
  getCapturePreview(
    templateId: string,
    currentHp: number,
    maxHp: number,
    statuses: string[] = [],
    itemId?: string,
    mapId?: string
  ): {
    baseRate: number;
    hpBonus: number;
    statusBonus: number;
    itemBonus: number;
    mapBonus: number;
    recommendedItem?: { id: string; name: string; bonusRate: number };
  } {
    const template = getPetTemplate(templateId);
    if (!template) {
      return {
        baseRate: 0,
        hpBonus: 0,
        statusBonus: 0,
        itemBonus: 0,
        mapBonus: 0,
      };
    }

    // 计算各项加成
    const hpRatio = currentHp / maxHp;
    const hpBonus = CAPTURE_CONFIG.hpFactor * (1 - hpRatio);

    const statusBonus = statuses.reduce((sum, status) => {
      const bonusMap: Record<string, number> = {
        stun: 0.3, sleep: 0.25, freeze: 0.2, poison: 0.1,
        burn: 0.1, silence: 0.05, slow: 0.1, paralyzed: 0.25,
      };
      return sum + (bonusMap[status] || 0);
    }, 0) * CAPTURE_CONFIG.statusFactor;

    let itemBonus = 0;
    if (itemId) {
      const itemMap: Record<string, { bonusRate: number }> = {};
      itemBonus = itemMap[itemId]?.bonusRate || 0;
    }

    const mapBonusMap: Record<string, number> = {
      map_fairy_spring: 0.1,
      map_flower_valley: 0.05,
      map_dragon_palace: -0.1,
      map_underworld: -0.15,
      map_celestial_palace: -0.2,
    };
    const mapBonus = mapId ? (mapBonusMap[mapId] || 0) : 0;

    // 获取推荐道具
    const recommendedItem = getRecommendedCaptureItem(1, 'wild');

    return {
      baseRate: CAPTURE_CONFIG.baseCaptureRate,
      hpBonus,
      statusBonus,
      itemBonus,
      mapBonus,
      recommendedItem: recommendedItem ? {
        id: recommendedItem.id,
        name: recommendedItem.name,
        bonusRate: recommendedItem.bonusRate,
      } : undefined,
    };
  },

  // ==================== 炼妖系统 ====================

  /**
   * 炼妖 - 提升资质
   * @param pet 宠物
   * @param materialId 炼妖材料ID
   * @param prng 随机数生成器
   */
  alchemy(
    pet: Pet,
    materialId: string,
    prng: PRNG = defaultPrng
  ): AlchemyResult {
    const material = getAlchemyMaterial(materialId);
    if (!material) {
      return {
        success: false,
        reason: '未找到炼妖材料',
      };
    }

    // 获取资质上限
    const aptitudeCap = getAptitudeCap(pet.quality);
    const targetStat = material.targetAptitude;
    const currentValue = pet.aptitude[targetStat];

    // 检查是否已达上限
    if (currentValue >= aptitudeCap) {
      return {
        success: false,
        reason: '资质已达上限',
      };
    }

    // 判断是否成功
    const success = prng.roll(material.successRate * 100);

    if (success) {
      // 成功 - 随机提升资质
      const bonus = prng.nextFloat(material.bonusRange[0], material.bonusRange[1]);
      const newValue = Math.min(currentValue + bonus, aptitudeCap);

      pet.aptitude[targetStat] = Math.round(newValue * 100) / 100;

      return {
        success: true,
        aptitudeChange: {
          stat: targetStat,
          oldValue: currentValue,
          newValue: pet.aptitude[targetStat],
        },
      };
    } else {
      // 失败 - 可能下降
      if (prng.roll(50)) { // 50%概率下降
        const penalty = material.failPenalty;
        const newValue = Math.max(0.7, currentValue - penalty); // 最低0.7
        pet.aptitude[targetStat] = Math.round(newValue * 100) / 100;

        return {
          success: false,
          aptitudeChange: {
            stat: targetStat,
            oldValue: currentValue,
            newValue: pet.aptitude[targetStat],
          },
          reason: '炼妖失败，资质下降',
        };
      }

      return {
        success: false,
        reason: '炼妖失败，资质未变',
      };
    }
  },

  // ==================== 进化系统 ====================

  /**
   * 进化宠物
   * @param pet 宠物
   * @param consumedItems 消耗的物品
   */
  evolve(
    pet: Pet,
    consumedItems: { id: string; count: number }[]
  ): EvolutionActionResult {
    const evolutionConfig = getEvolutionConfig(pet.baseId);

    if (!evolutionConfig) {
      return {
        success: false,
        reason: '该宠物无法进化',
      };
    }

    // 检查进化条件
    const evolutionCheck = canEvolve(pet.baseId, pet.level, pet.aptitude, pet.intimacy);
    if (!evolutionCheck.canEvolve) {
      return {
        success: false,
        reason: evolutionCheck.reason,
      };
    }

    // 检查物品是否满足
    for (const required of evolutionConfig.requirements.items) {
      const consumed = consumedItems.find(i => i.id === required.id);
      if (!consumed || consumed.count < required.count) {
        return {
          success: false,
          reason: `缺少进化材料: ${required.id}`,
        };
      }
    }

    // 执行进化
    const targetId = evolutionConfig.result.targetId;
    const targetTemplate = getPetTemplate(targetId);

    if (!targetTemplate) {
      return {
        success: false,
        reason: '未找到进化目标模板',
      };
    }

    // 更新宠物数据
    pet.baseId = targetId;
    pet.name = targetTemplate.name;
    pet.icon = targetTemplate.icon;
    pet.type = targetTemplate.type;

    // 应用属性加成
    const statBonus = 1 + evolutionConfig.result.statBonus;
    pet.stats = {
      ...pet.stats,
      physicalAttack: Math.floor(pet.stats.physicalAttack * statBonus),
      physicalDefense: Math.floor(pet.stats.physicalDefense * statBonus),
      magicAttack: Math.floor(pet.stats.magicAttack * statBonus),
      magicDefense: Math.floor(pet.stats.magicDefense * statBonus),
      maxHp: Math.floor(pet.stats.maxHp * statBonus),
      maxMp: Math.floor(pet.stats.maxMp * statBonus),
    };
    pet.maxHp = pet.stats.maxHp;
    pet.maxMp = pet.stats.maxMp;

    // 添加新技能
    for (const skillId of evolutionConfig.result.newSkills) {
      if (!pet.skills.some(s => s.id === skillId)) {
        pet.skills.push({
          id: skillId,
          name: this.getSkillName(skillId),
          type: 'active',
          description: '',
        });
      }
    }

    // 品质提升
    if (evolutionConfig.result.qualityUpgrade) {
      pet.quality = evolutionConfig.result.qualityUpgrade;
    }

    // 外观变化
    if (evolutionConfig.result.appearanceChange) {
      pet.variantAppearance = `${targetId}_evolved`;
    }

    return {
      success: true,
      pet,
    };
  },

  /**
   * 获取进化预览
   */
  getEvolutionPreview(pet: Pet): {
    canEvolve: boolean;
    requirements?: {
      level: number;
      items: { id: string; count: number }[];
      aptitudeMin?: Partial<PetAptitude>;
      intimacyMin?: number;
    };
    result?: {
      targetName: string;
      statBonus: number;
      newSkills: string[];
    };
    missingRequirements: string[];
  } {
    const config = getEvolutionConfig(pet.baseId);
    const missingRequirements: string[] = [];

    if (!config) {
      return { canEvolve: false, missingRequirements: ['该宠物无法进化'] };
    }

    // 检查等级
    if (pet.level < config.requirements.level) {
      missingRequirements.push(`等级需要达到 ${config.requirements.level} 级`);
    }

    // 检查资质
    if (config.requirements.aptitudeMin) {
      for (const [stat, min] of Object.entries(config.requirements.aptitudeMin)) {
        if (pet.aptitude[stat as keyof PetAptitude] < (min as number)) {
          missingRequirements.push(`${stat}资质不足`);
        }
      }
    }

    // 检查亲密度
    if (config.requirements.intimacyMin && pet.intimacy < config.requirements.intimacyMin) {
      missingRequirements.push(`亲密度需要达到 ${config.requirements.intimacyMin}`);
    }

    const targetTemplate = getPetTemplate(config.result.targetId);

    return {
      canEvolve: missingRequirements.length === 0,
      requirements: config.requirements,
      result: {
        targetName: targetTemplate?.name || config.result.targetId,
        statBonus: config.result.statBonus,
        newSkills: config.result.newSkills,
      },
      missingRequirements,
    };
  },

  // ==================== 合宠系统 ====================

  /**
   * 合宠
   * @param pet1 宠物1
   * @param pet2 宠物2
   * @param prng 随机数生成器
   */
  fuse(
    pet1: Pet,
    pet2: Pet,
    prng: PRNG = defaultPrng
  ): Pet {
    // 确定基础宠物
    const basePet = prng.nextFloat() < 0.5 ? pet1 : pet2;

    // 计算新品质
    const sameType = pet1.type === pet2.type;
    const newQuality = calculateFusionQuality(pet1.quality, pet2.quality, prng.nextFloat);

    // 计算新资质
    const newAptitude = calculateFusionAptitude(pet1.aptitude, pet2.aptitude, sameType);

    // 合并技能
    const maxSkills = sameType
      ? FUSION_RULES.maxInheritedSkills + 1
      : FUSION_RULES.maxInheritedSkills;
    const allSkills = [...new Map([...pet1.skills, ...pet2.skills].map(s => [s.id, s])).values()];
    const selectedSkills = allSkills
      .sort(() => prng.nextFloat() - 0.5)
      .slice(0, maxSkills);

    // 计算新等级 (取较高者)
    const newLevel = Math.max(pet1.level, pet2.level);

    // 获取模板
    const template = getPetTemplate(basePet.baseId);
    if (!template) {
      throw new Error(`Pet template not found: ${basePet.baseId}`);
    }

    // 计算新属性
    const qualityConfig = getPetQualityConfig(newQuality);
    const newGrowthRate = generateGrowthRate(newQuality, basePet.type, prng.nextFloat);
    const newStats = this.calculateStats(template, newAptitude, newGrowthRate, newLevel, qualityConfig.baseStatMultiplier);

    // 创建新宠物
    const newPet: Pet = {
      id: generateUUID(),
      baseId: basePet.baseId,
      name: basePet.name,
      nickname: basePet.nickname,
      icon: basePet.icon,
      type: basePet.type,
      rarity: basePet.rarity,
      element: basePet.element,
      quality: newQuality,
      growthRate: newGrowthRate,
      level: newLevel,
      exp: 0,
      maxLevel: basePet.maxLevel,
      aptitude: newAptitude,
      stats: newStats,
      skills: selectedSkills,
      maxSkills: Math.max(pet1.maxSkills, pet2.maxSkills),
      intimacy: Math.floor((pet1.intimacy + pet2.intimacy) / 2),
      intimacyLevel: Math.max(pet1.intimacyLevel, pet2.intimacyLevel),
      loyalty: Math.floor((pet1.loyalty + pet2.loyalty) / 2),
      isActive: false,
      ownerType: basePet.ownerType,
      ownerId: basePet.ownerId,
      hp: newStats.maxHp,
      maxHp: newStats.maxHp,
      mp: newStats.maxMp,
      maxMp: newStats.maxMp,
      variantAppearance: qualityConfig.hasAppearanceChange ? `${basePet.baseId}_fused` : undefined,
    };

    return newPet;
  },

  /**
   * 验证合宠条件
   */
  validateFusion(pet1: Pet, pet2: Pet): { valid: boolean; reason?: string } {
    if (pet1.id === pet2.id) {
      return { valid: false, reason: '不能选择相同的宠物' };
    }

    if (pet1.level < FUSION_RULES.minLevel || pet2.level < FUSION_RULES.minLevel) {
      return { valid: false, reason: `宠物等级需要达到 ${FUSION_RULES.minLevel} 级` };
    }

    return { valid: true };
  },

  // ==================== 成长系统 ====================

  /**
   * 宠物升级
   * @param pet 宠物
   * @param expGained 获得的经验
   * @param expTable 经验表
   */
  levelUp(
    pet: Pet,
    expGained: number,
    expTable: number[] = []
  ): { leveledUp: boolean; oldLevel: number; newLevel: number } {
    const oldLevel = pet.level;
    pet.exp += expGained;

    let leveledUp = false;

    // 检查是否升级
    while (pet.level < pet.maxLevel) {
      const requiredExp = expTable[pet.level] || pet.level * 100;
      if (pet.exp >= requiredExp) {
        pet.exp -= requiredExp;
        pet.level++;
        leveledUp = true;
      } else {
        break;
      }
    }

    if (leveledUp) {
      // 重新计算属性
      const template = getPetTemplate(pet.baseId);
      if (template) {
        const qualityConfig = getPetQualityConfig(pet.quality);
        pet.stats = this.calculateStats(template, pet.aptitude, pet.growthRate, pet.level, qualityConfig.baseStatMultiplier);
        pet.maxHp = pet.stats.maxHp;
        pet.maxMp = pet.stats.maxMp;
        pet.hp = pet.maxHp;
        pet.mp = pet.maxMp;
      }
    }

    return {
      leveledUp,
      oldLevel,
      newLevel: pet.level,
    };
  },

  /**
   * 增加亲密度
   */
  increaseIntimacy(pet: Pet, amount: number): void {
    pet.intimacy = Math.min(100, pet.intimacy + amount);

    // 更新亲密度等级
    if (pet.intimacy >= 80) pet.intimacyLevel = 5;
    else if (pet.intimacy >= 60) pet.intimacyLevel = 4;
    else if (pet.intimacy >= 40) pet.intimacyLevel = 3;
    else if (pet.intimacy >= 20) pet.intimacyLevel = 2;
    else pet.intimacyLevel = 1;
  },

  /**
   * 增加忠诚度
   */
  increaseLoyalty(pet: Pet, amount: number): void {
    pet.loyalty = Math.min(100, pet.loyalty + amount);
  },

  /**
   * 减少忠诚度 (战斗失败时)
   */
  decreaseLoyalty(pet: Pet, amount: number): void {
    pet.loyalty = Math.max(0, pet.loyalty - amount);
  },

  // ==================== 辅助方法 ====================

  /**
   * 获取所有可捕捉的宠物
   */
  getCapturablePets(mapId: string): PetTemplate[] {
    return Object.values(PET_TEMPLATES).filter(t =>
      t.captureLocations.includes(mapId)
    );
  },

  /**
   * 获取宠物信息摘要
   */
  getPetSummary(pet: Pet): string {
    const qualityConfig = getPetQualityConfig(pet.quality);
    return `${pet.name} (${qualityConfig.name}) Lv.${pet.level} - 攻:${pet.stats.physicalAttack} 防:${pet.stats.physicalDefense} 血:${pet.maxHp}`;
  },
};

export default petService;
