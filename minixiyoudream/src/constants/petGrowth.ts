// 宠物成长率和品质配置 - 参考梦幻西游

import type { PetQuality, PetQualityConfig, GrowthRate, PetAptitude } from '@/types';

/** 品质配置表 */
export const PET_QUALITY_CONFIG: Record<PetQuality, PetQualityConfig> = {
  wild: {
    type: 'wild',
    name: '野生',
    nameEn: 'Wild',
    baseStatMultiplier: 0.8,       // 基础属性80%
    aptitudeMin: 0.7,              // 资质范围0.7-1.0
    aptitudeMax: 1.0,
    initialSkillMin: 0,            // 无初始技能
    initialSkillMax: 0,
    hasAppearanceChange: false,
    captureWeight: 70,             // 70%捕捉权重
  },
  baby: {
    type: 'baby',
    name: '宝宝',
    nameEn: 'Baby',
    baseStatMultiplier: 1.0,       // 基础属性100%
    aptitudeMin: 0.9,              // 资质范围0.9-1.2
    aptitudeMax: 1.2,
    initialSkillMin: 1,            // 1-2个初始技能
    initialSkillMax: 2,
    hasAppearanceChange: false,
    captureWeight: 25,             // 25%捕捉权重
  },
  variant: {
    type: 'variant',
    name: '变异',
    nameEn: 'Variant',
    baseStatMultiplier: 1.15,      // 基础属性115%
    aptitudeMin: 1.0,              // 资质范围1.0-1.3
    aptitudeMax: 1.3,
    initialSkillMin: 2,            // 2-3个初始技能
    initialSkillMax: 3,
    hasAppearanceChange: true,     // 外观变化
    captureWeight: 4.5,            // 4.5%捕捉权重
  },
  divine: {
    type: 'divine',
    name: '神兽',
    nameEn: 'Divine',
    baseStatMultiplier: 1.3,       // 基础属性130%
    aptitudeMin: 1.2,              // 资质范围1.2-1.5
    aptitudeMax: 1.5,
    initialSkillMin: 3,            // 3-4个初始技能
    initialSkillMax: 4,
    hasAppearanceChange: true,     // 特殊外观
    captureWeight: 0.5,            // 0.5%捕捉权重
  },
};

/** 品质权重列表 (用于随机抽取) */
export const PET_QUALITY_WEIGHTS: Array<{ quality: PetQuality; weight: number }> = [
  { quality: 'wild', weight: 70 },
  { quality: 'baby', weight: 25 },
  { quality: 'variant', weight: 4.5 },
  { quality: 'divine', weight: 0.5 },
];

/** 成长率范围配置 */
export const GROWTH_RATE_RANGES = {
  min: 0.8,
  max: 1.5,
  default: 1.0,
};

/** 品质对应的成长率加成 */
export const QUALITY_GROWTH_BONUS: Record<PetQuality, { min: number; max: number }> = {
  wild: { min: 0.8, max: 1.0 },
  baby: { min: 0.95, max: 1.2 },
  variant: { min: 1.1, max: 1.35 },
  divine: { min: 1.25, max: 1.5 },
};

/** 根据宠物类型获取成长率倾向 */
export const PET_TYPE_GROWTH_BIAS: Record<string, Partial<Record<keyof GrowthRate, number>>> = {
  attack: { physical: 1.2, hp: 1.0, defense: 0.9, speed: 1.1 },
  magic: { magic: 1.2, mp: 1.2, defense: 0.9, speed: 1.0 },
  defense: { defense: 1.2, hp: 1.2, physical: 0.9, speed: 0.8 },
  support: { magic: 1.1, mp: 1.1, defense: 1.0, speed: 1.1 },
  control: { speed: 1.3, magic: 1.0, defense: 0.9, hp: 0.9 },
};

/**
 * 生成随机成长率
 * @param quality 宠物品质
 * @param petType 宠物类型
 * @param prng 随机数生成函数
 */
export function generateGrowthRate(
  quality: PetQuality,
  petType: string,
  prng: () => number = Math.random
): GrowthRate {
  const range = QUALITY_GROWTH_BONUS[quality];
  const bias = PET_TYPE_GROWTH_BIAS[petType] || {};

  const generateValue = (key: keyof GrowthRate): number => {
    const baseMin = range.min;
    const baseMax = range.max;
    const baseValue = baseMin + prng() * (baseMax - baseMin);
    const biasMultiplier = bias[key] || 1.0;
    // 应用倾向后不能超过范围
    return Math.min(baseMax, Math.max(baseMin, baseValue * biasMultiplier));
  };

  return {
    physical: generateValue('physical'),
    magic: generateValue('magic'),
    defense: generateValue('defense'),
    speed: generateValue('speed'),
    hp: generateValue('hp'),
    mp: generateValue('mp'),
  };
}

/**
 * 生成随机资质
 * @param quality 宠物品质
 * @param prng 随机数生成函数
 */
export function generateAptitude(
  quality: PetQuality,
  prng: () => number = Math.random
): PetAptitude {
  const config = PET_QUALITY_CONFIG[quality];

  const generateValue = (): number => {
    return config.aptitudeMin + prng() * (config.aptitudeMax - config.aptitudeMin);
  };

  return {
    attack: generateValue(),
    defense: generateValue(),
    magic: generateValue(),
    speed: generateValue(),
    hp: generateValue(),
    mp: generateValue(),
  };
}

/**
 * 根据品质随机抽取
 * @param prng 随机数生成函数
 */
export function rollPetQuality(prng: () => number = Math.random): PetQuality {
  const roll = prng() * 100;
  let cumulative = 0;

  for (const { quality, weight } of PET_QUALITY_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) {
      return quality;
    }
  }

  return 'wild'; // 默认返回野生
}

/**
 * 计算成长后的属性值
 * @param baseStat 基础属性
 * @param growthRate 成长率
 * @param level 等级
 * @param aptitude 资质
 */
export function calculateGrowthStat(
  baseStat: number,
  growthRate: number,
  level: number,
  aptitude: number
): number {
  // 属性计算公式: stat = baseStat * (1 + growthRate * (level - 1) * 0.1) * aptitude
  return Math.floor(baseStat * (1 + growthRate * (level - 1) * 0.1) * aptitude);
}

/**
 * 获取品质配置
 */
export function getPetQualityConfig(quality: PetQuality): PetQualityConfig {
  return PET_QUALITY_CONFIG[quality];
}

/**
 * 获取品质名称
 */
export function getPetQualityName(quality: PetQuality): string {
  return PET_QUALITY_CONFIG[quality].name;
}

/**
 * 计算资质总分
 */
export function calculateAptitudeScore(aptitude: PetAptitude): number {
  return (
    aptitude.attack +
    aptitude.defense +
    aptitude.magic +
    aptitude.speed +
    aptitude.hp +
    aptitude.mp
  ) / 6;
}

/**
 * 判断资质是否优秀 (超过平均值)
 */
export function isAptitudeExcellent(aptitude: PetAptitude, quality: PetQuality): boolean {
  const config = PET_QUALITY_CONFIG[quality];
  const avgAptitude = (config.aptitudeMin + config.aptitudeMax) / 2;
  const score = calculateAptitudeScore(aptitude);
  return score >= avgAptitude;
}
