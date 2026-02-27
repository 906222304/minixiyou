// 炼妖服务 - 基于梦幻西游合宠系统
// 包含合宠和资质培养功能

import type {
  Pet,
  PetAptitude,
  PetSkill,
  FusionResult,
  AlchemyResult,
  AlchemyMaterial,
} from '@/types/pet';
import { generateUUID } from '@/types/common';
import { getSummonTemplateById } from '@/constants/summonTemplates';
import { calculateAllStats, PET_QUALITY_CONFIG, APTITUDE_RANGES } from '@/constants/petGrowth';
import { PRNG, defaultPrng } from './prng';

/** 炼妖材料配置 */
export const ALCHEMY_MATERIALS: AlchemyMaterial[] = [
  // 攻击资质
  {
    id: 'alchemy_attack_low',
    name: '炼兽真经·攻',
    description: '可提升召唤兽攻击资质5-15点',
    targetAptitude: 'attack',
    bonusRange: [5, 15],
    successRate: 80,
    failPenalty: 3,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_attack_high',
    name: '高级炼兽真经·攻',
    description: '可提升召唤兽攻击资质15-30点',
    targetAptitude: 'attack',
    bonusRange: [15, 30],
    successRate: 60,
    failPenalty: 8,
    rarity: 'rare',
  },
  // 防御资质
  {
    id: 'alchemy_defense_low',
    name: '炼兽真经·防',
    description: '可提升召唤兽防御资质5-15点',
    targetAptitude: 'defense',
    bonusRange: [5, 15],
    successRate: 80,
    failPenalty: 3,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_defense_high',
    name: '高级炼兽真经·防',
    description: '可提升召唤兽防御资质15-30点',
    targetAptitude: 'defense',
    bonusRange: [15, 30],
    successRate: 60,
    failPenalty: 8,
    rarity: 'rare',
  },
  // 体力资质
  {
    id: 'alchemy_hp_low',
    name: '炼兽真经·体',
    description: '可提升召唤兽体力资质10-30点',
    targetAptitude: 'hp',
    bonusRange: [10, 30],
    successRate: 80,
    failPenalty: 5,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_hp_high',
    name: '高级炼兽真经·体',
    description: '可提升召唤兽体力资质30-60点',
    targetAptitude: 'hp',
    bonusRange: [30, 60],
    successRate: 60,
    failPenalty: 15,
    rarity: 'rare',
  },
  // 法力资质
  {
    id: 'alchemy_mp_low',
    name: '炼兽真经·法',
    description: '可提升召唤兽法力资质10-30点',
    targetAptitude: 'mp',
    bonusRange: [10, 30],
    successRate: 80,
    failPenalty: 5,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_mp_high',
    name: '高级炼兽真经·法',
    description: '可提升召唤兽法力资质30-60点',
    targetAptitude: 'mp',
    bonusRange: [30, 60],
    successRate: 60,
    failPenalty: 15,
    rarity: 'rare',
  },
  // 速度资质
  {
    id: 'alchemy_speed_low',
    name: '炼兽真经·速',
    description: '可提升召唤兽速度资质5-15点',
    targetAptitude: 'speed',
    bonusRange: [5, 15],
    successRate: 80,
    failPenalty: 3,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_speed_high',
    name: '高级炼兽真经·速',
    description: '可提升召唤兽速度资质15-30点',
    targetAptitude: 'speed',
    bonusRange: [15, 30],
    successRate: 60,
    failPenalty: 8,
    rarity: 'rare',
  },
  // 躲闪资质
  {
    id: 'alchemy_dodge_low',
    name: '炼兽真经·闪',
    description: '可提升召唤兽躲闪资质5-15点',
    targetAptitude: 'dodge',
    bonusRange: [5, 15],
    successRate: 80,
    failPenalty: 3,
    rarity: 'uncommon',
  },
  {
    id: 'alchemy_dodge_high',
    name: '高级炼兽真经·闪',
    description: '可提升召唤兽躲闪资质15-30点',
    targetAptitude: 'dodge',
    bonusRange: [15, 30],
    successRate: 60,
    failPenalty: 8,
    rarity: 'rare',
  },
];

/** 获取炼妖材料 */
export function getAlchemyMaterial(id: string): AlchemyMaterial | undefined {
  return ALCHEMY_MATERIALS.find(m => m.id === id);
}

/** 获取所有炼妖材料 */
export function getAllAlchemyMaterials(): AlchemyMaterial[] {
  return ALCHEMY_MATERIALS;
}

/** 炼妖服务 */
export const alchemyService = {
  // ==================== 合宠功能 ====================

  /**
   * 合宠（炼妖）- 两只召唤兽合成
   * @param pet1 第一只召唤兽
   * @param pet2 第二只召唤兽
   * @param prng 随机数生成器
   */
  fusePets(
    pet1: Pet,
    pet2: Pet,
    prng: PRNG = defaultPrng
  ): FusionResult {
    const messages: string[] = [];

    // 选择主宠物（等级更高的作为基础）
    const [mainPet, subPet] = pet1.level >= pet2.level ? [pet1, pet2] : [pet2, pet1];

    // 获取主宠物模板
    const template = getSummonTemplateById(mainPet.templateId);
    if (!template) {
      throw new Error(`召唤兽模板不存在: ${mainPet.templateId}`);
    }

    // ========== 计算新资质 ==========
    // 资质在两只宠物资质之间随机波动，有小概率超出
    const newAptitude = this.calculateFusedAptitude(pet1.aptitude, pet2.aptitude, prng);
    const aptitudeChanges: FusionResult['aptitudeChanges'] = [];

    // 记录资质变化（与主宠物比较）
    for (const key of Object.keys(newAptitude) as (keyof PetAptitude)[]) {
      const oldVal = mainPet.aptitude[key];
      const newVal = newAptitude[key];
      if (oldVal !== undefined && newVal !== undefined) {
        aptitudeChanges.push({
          stat: key,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }

    // ========== 计算新成长率 ==========
    // 成长率在两只宠物成长率之间随机，有小概率突破
    let newGrowthRate = this.calculateFusedGrowthRate(pet1.growthRate, pet2.growthRate, prng);

    // ========== 继承技能 ==========
    const { skills: inheritedSkills, absorbedSkills, bonusSlot } = this.inheritSkills(
      pet1.skills,
      pet2.skills,
      mainPet.maxSkills,
      prng
    );

    if (bonusSlot) {
      messages.push('幸运！获得额外技能栏！');
    }

    // ========== 创建新宠物 ==========
    const qualityConfig = PET_QUALITY_CONFIG[mainPet.quality];
    const stats = calculateAllStats(
      mainPet.level,
      newAptitude,
      newGrowthRate,
      qualityConfig.baseStatMultiplier
    );

    const newPet: Pet = {
      id: generateUUID(),
      templateId: mainPet.templateId,
      name: mainPet.name,
      nickname: undefined,
      icon: mainPet.icon,
      type: mainPet.type,
      element: mainPet.element,
      rarity: mainPet.rarity,
      quality: mainPet.quality,
      level: mainPet.level,
      exp: 0,
      maxLevel: 180,
      growthRate: newGrowthRate,
      aptitude: newAptitude,
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
      skills: inheritedSkills,
      maxSkills: mainPet.maxSkills + (bonusSlot ? 1 : 0),
      intimacy: Math.floor((pet1.intimacy + pet2.intimacy) / 2),
      intimacyLevel: Math.floor((pet1.intimacyLevel + pet2.intimacyLevel) / 2),
      loyalty: Math.floor((pet1.loyalty + pet2.loyalty) / 2),
      isActive: false,
      ownerType: mainPet.ownerType,
      ownerId: mainPet.ownerId,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      mp: stats.maxMp,
      maxMp: stats.maxMp,
    };

    // 生成合宠报告
    messages.push(`合宠成功！${mainPet.name} + ${subPet.name} → ${mainPet.name}`);
    messages.push(`继承技能: ${absorbedSkills.length}个`);

    // 检查资质是否有突破
    for (const change of aptitudeChanges) {
      if (change.newValue > change.oldValue * 1.1) {
        messages.push(`${change.stat}资质大幅提升！`);
      }
    }

    return {
      pet: newPet,
      absorbedSkills,
      aptitudeChanges,
      bonusSkillSlot: bonusSlot,
      messages,
    };
  },

  /**
   * 计算合宠后的资质
   * 规则：在两只宠物资质之间随机，有10%几率波动±10%
   */
  calculateFusedAptitude(
    apt1: PetAptitude,
    apt2: PetAptitude,
    prng: PRNG
  ): PetAptitude {
    const result: PetAptitude = {
      attack: apt1.attack,
      defense: apt1.defense,
      hp: apt1.hp,
      mp: apt1.mp,
      speed: apt1.speed,
      dodge: apt1.dodge,
    };

    // 只处理主要的6个资质（不包括可选的magic）
    const mainKeys: (keyof PetAptitude)[] = ['attack', 'defense', 'hp', 'mp', 'speed', 'dodge'];

    for (const key of mainKeys) {
      const val1 = apt1[key] ?? 0;
      const val2 = apt2[key] ?? 0;
      const min = Math.min(val1, val2);
      const max = Math.max(val1, val2);

      // 基础值在两只宠物资质之间随机
      let value = prng.nextFloat(min, max);

      // 10%几率波动±10%
      if (prng.roll(10)) {
        const fluctuation = prng.nextFloat(0.9, 1.1);
        value = value * fluctuation;
      }

      // 限制在资质上限内
      const limits = APTITUDE_RANGES[key];
      if (limits) {
        result[key] = Math.floor(Math.max(limits.min, Math.min(limits.max, value)));
      }
    }

    return result;
  },

  /**
   * 计算合宠后的成长率
   * 规则：在两只宠物成长率之间随机，有5%几率突破最高值
   */
  calculateFusedGrowthRate(
    growth1: number,
    growth2: number,
    prng: PRNG
  ): number {
    const min = Math.min(growth1, growth2);
    const max = Math.max(growth1, growth2);

    let value = prng.nextFloat(min, max);

    // 5%几率突破最高值（最多+0.05）
    if (prng.roll(5)) {
      value = max + prng.nextFloat(0, 0.05);
    }

    // 限制成长率范围
    return Math.max(0.882, Math.min(1.295, parseFloat(value.toFixed(3))));
  },

  /**
   * 继承技能
   * 规则：随机继承两只宠物的技能，最多继承技能栏上限数量
   *       有10%几率获得额外技能栏
   */
  inheritSkills(
    skills1: PetSkill[],
    skills2: PetSkill[],
    maxSkills: number,
    prng: PRNG
  ): { skills: PetSkill[]; absorbedSkills: string[]; bonusSlot: boolean } {
    // 合并所有技能，去重
    const allSkills = new Map<string, PetSkill>();

    for (const skill of [...skills1, ...skills2]) {
      // 优先保留锁定技能和高级技能
      const existing = allSkills.get(skill.templateId);
      if (!existing || skill.locked || (skill.tier === 'advanced' && existing.tier === 'basic')) {
        allSkills.set(skill.templateId, { ...skill, id: `${skill.templateId}_${generateUUID().slice(0, 8)}` });
      }
    }

    const skillList = Array.from(allSkills.values());
    const absorbedSkills: string[] = [];

    // 10%几率获得额外技能栏
    const bonusSlot = prng.roll(10);
    const finalMaxSkills = maxSkills + (bonusSlot ? 1 : 0);

    // 随机选择技能
    const selectedSkills: PetSkill[] = [];

    // 先选择锁定的技能
    const lockedSkills = skillList.filter(s => s.locked);
    for (const skill of lockedSkills) {
      if (selectedSkills.length < finalMaxSkills) {
        selectedSkills.push(skill);
        absorbedSkills.push(skill.name);
      }
    }

    // 再随机选择其他技能
    const unlockedSkills = skillList.filter(s => !s.locked);
    const shuffled = unlockedSkills.sort(() => prng.nextFloat(-0.5, 0.5));

    for (const skill of shuffled) {
      if (selectedSkills.length >= finalMaxSkills) break;
      selectedSkills.push(skill);
      absorbedSkills.push(skill.name);
    }

    return { skills: selectedSkills, absorbedSkills, bonusSlot };
  },

  // ==================== 资质培养 ====================

  /**
   * 使用炼妖材料培养资质
   * @param pet 要培养的宠物
   * @param materialId 材料ID
   * @param prng 随机数生成器
   */
  trainAptitude(
    pet: Pet,
    materialId: string,
    prng: PRNG = defaultPrng
  ): AlchemyResult {
    const material = ALCHEMY_MATERIALS.find(m => m.id === materialId);
    if (!material) {
      return {
        success: false,
        criticalHit: false,
        message: '材料不存在',
      };
    }

    const targetStat = material.targetAptitude;
    const oldValue = pet.aptitude[targetStat];
    const limits = APTITUDE_RANGES[targetStat];

    // 检查资质和限制是否存在
    if (oldValue === undefined || !limits) {
      return {
        success: false,
        criticalHit: false,
        message: `${targetStat}资质不可培养`,
      };
    }

    // 检查是否已达上限
    if (oldValue >= limits.max) {
      return {
        success: false,
        criticalHit: false,
        message: `${targetStat}资质已达上限`,
      };
    }

    // 判定成功
    const success = prng.roll(material.successRate);

    if (success) {
      // 计算资质增加量
      let bonus = prng.nextInt(material.bonusRange[0], material.bonusRange[1]);

      // 5%几率暴击（双倍效果）
      const criticalHit = prng.roll(5);
      if (criticalHit) {
        bonus *= 2;
      }

      const newValue = Math.min(limits.max, oldValue + bonus);
      pet.aptitude[targetStat] = newValue;

      return {
        success: true,
        aptitudeChange: {
          stat: targetStat,
          oldValue,
          newValue,
        },
        criticalHit,
        message: criticalHit
          ? `暴击！${targetStat}资质 +${bonus}`
          : `${targetStat}资质 +${bonus}`,
      };
    } else {
      // 失败时不减少资质，只是培养失败
      return {
        success: false,
        criticalHit: false,
        message: `培养失败，资质未发生变化`,
      };
    }
  },

  /**
   * 批量培养资质（多次使用同一材料）
   */
  trainAptitudeBatch(
    pet: Pet,
    materialId: string,
    count: number,
    prng: PRNG = defaultPrng
  ): { results: AlchemyResult[]; totalChange: number } {
    const results: AlchemyResult[] = [];
    let totalChange = 0;
    const material = ALCHEMY_MATERIALS.find(m => m.id === materialId);

    if (!material) {
      return { results: [{ success: false, criticalHit: false, message: '材料不存在' }], totalChange: 0 };
    }

    const targetStat = material.targetAptitude;
    const limits = APTITUDE_RANGES[targetStat];

    if (!limits) {
      return { results: [{ success: false, criticalHit: false, message: '资质不可培养' }], totalChange: 0 };
    }

    for (let i = 0; i < count; i++) {
      const currentValue = pet.aptitude[targetStat] ?? 0;
      // 检查是否已达上限
      if (currentValue >= limits.max) {
        results.push({
          success: false,
          criticalHit: false,
          message: '已达资质上限',
        });
        break;
      }

      const result = this.trainAptitude(pet, materialId, prng);
      results.push(result);

      if (result.aptitudeChange) {
        totalChange += result.aptitudeChange.newValue - result.aptitudeChange.oldValue;
      }
    }

    return { results, totalChange };
  },

  // ==================== 工具方法 ====================

  /**
   * 获取资质培养预估效果
   */
  getTrainingEstimate(
    pet: Pet,
    materialId: string
  ): { current: number; minBonus: number; maxBonus: number; successRate: number; limit: number } {
    const material = ALCHEMY_MATERIALS.find(m => m.id === materialId);
    if (!material) {
      return { current: 0, minBonus: 0, maxBonus: 0, successRate: 0, limit: 0 };
    }

    const targetStat = material.targetAptitude;
    const limits = APTITUDE_RANGES[targetStat];
    const currentValue = pet.aptitude[targetStat] ?? 0;

    return {
      current: currentValue,
      minBonus: material.bonusRange[0],
      maxBonus: material.bonusRange[1],
      successRate: material.successRate,
      limit: limits?.max ?? 0,
    };
  },

  /**
   * 计算合宠预览
   */
  getFusionPreview(
    pet1: Pet,
    pet2: Pet
  ): {
    avgAptitude: PetAptitude;
    avgGrowth: number;
    totalSkills: number;
    potentialSkills: PetSkill[];
  } {
    // 计算平均资质
    const avgAptitude: PetAptitude = {
      attack: Math.floor((pet1.aptitude.attack + pet2.aptitude.attack) / 2),
      defense: Math.floor((pet1.aptitude.defense + pet2.aptitude.defense) / 2),
      hp: Math.floor((pet1.aptitude.hp + pet2.aptitude.hp) / 2),
      mp: Math.floor((pet1.aptitude.mp + pet2.aptitude.mp) / 2),
      speed: Math.floor((pet1.aptitude.speed + pet2.aptitude.speed) / 2),
      dodge: Math.floor((pet1.aptitude.dodge + pet2.aptitude.dodge) / 2),
    };

    // 计算平均成长
    const avgGrowth = (pet1.growthRate + pet2.growthRate) / 2;

    // 合并技能
    const skillMap = new Map<string, PetSkill>();
    for (const skill of [...pet1.skills, ...pet2.skills]) {
      if (!skillMap.has(skill.templateId)) {
        skillMap.set(skill.templateId, skill);
      }
    }
    const potentialSkills = Array.from(skillMap.values());

    return {
      avgAptitude,
      avgGrowth,
      totalSkills: pet1.skills.length + pet2.skills.length,
      potentialSkills,
    };
  },

  /**
   * 获取所有炼妖材料
   */
  getAllAlchemyMaterials(): AlchemyMaterial[] {
    return ALCHEMY_MATERIALS;
  },
};

export default alchemyService;
