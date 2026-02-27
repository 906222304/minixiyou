// 宠物成长率和品质配置 - 基于梦幻西游召唤兽系统重新设计

import type {
  PetQuality,
  PetQualityConfig,
  GrowthRateValue,
  PetAptitude,
  PetAptitudeConfig,
  AptitudeRange,
  PetType,
  PetElement,
} from '@/types/pet';

// ==================== 品质配置 ====================

/** 品质配置表 - 参考梦幻西游 */
export const PET_QUALITY_CONFIG: Record<PetQuality, PetQualityConfig> = {
  wild: {
    type: 'wild',
    name: '野生',
    nameEn: 'Wild',
    baseStatMultiplier: 0.8,       // 基础属性80%
    aptitudeBonus: 0,              // 无资质加成
    growthBonus: 0,                // 无成长加成
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
    aptitudeBonus: 0.1,            // 资质+10%
    growthBonus: 0,                // 无成长加成
    initialSkillMin: 1,            // 1-2个初始技能
    initialSkillMax: 2,
    hasAppearanceChange: false,
    captureWeight: 25,             // 25%捕捉权重
  },
  variant: {
    type: 'variant',
    name: '变异',
    nameEn: 'Variant',
    baseStatMultiplier: 1.1,       // 基础属性110%
    aptitudeBonus: 0.15,           // 资质+15%
    growthBonus: 0.02,             // 成长+0.02
    initialSkillMin: 5,            // 固定5个初始技能（3高级+2低级）
    initialSkillMax: 5,
    hasAppearanceChange: true,     // 外观变化
    captureWeight: 4.5,            // 4.5%捕捉权重
  },
  divine: {
    type: 'divine',
    name: '神兽',
    nameEn: 'Divine',
    baseStatMultiplier: 1.2,       // 基础属性120%
    aptitudeBonus: 0.2,            // 资质+20%
    growthBonus: 0.05,             // 成长+0.05
    initialSkillMin: 5,            // 固定5个初始技能（3高级+2低级）
    initialSkillMax: 5,
    hasAppearanceChange: true,     // 特殊外观
    captureWeight: 0.5,            // 0.5%捕捉权重（神兽通常不通过捕捉获得）
  },
};

/** 品质权重列表 (用于随机抽取) */
export const PET_QUALITY_WEIGHTS: Array<{ quality: PetQuality; weight: number }> = [
  { quality: 'wild', weight: 70 },
  { quality: 'baby', weight: 25 },
  { quality: 'variant', weight: 4.5 },
  { quality: 'divine', weight: 0.5 },
];

// ==================== 成长率系统 ====================

/** 成长率全局范围 - 参考梦幻西游 */
export const GROWTH_RATE_RANGES = {
  min: 0.882,
  max: 1.295,
  default: 1.0,
  divineNormal: 1.2,     // 神兽飞升前
  divineAscended: 1.25,  // 神兽飞升后
};

/**
 * 根据宠物类型获取成长率倾向
 * 影响最终成长率的概率分布
 */
export const PET_TYPE_GROWTH_BIAS: Record<PetType, number> = {
  attack: 1.05,    // 攻宠略高成长
  magic: 1.05,     // 法宠略高成长
  defense: 1.0,    // 防宠标准成长
  support: 1.02,   // 辅助宠略高
  control: 1.08,   // 控制宠较高成长
  balance: 1.0,    // 平衡宠标准成长
};

// ==================== 资质系统 ====================

/** 资质全局范围 - 参考梦幻西游 */
export const APTITUDE_RANGES = {
  attack: { min: 480, max: 3000 },
  defense: { min: 480, max: 3000 },
  hp: { min: 960, max: 6000 },
  mp: { min: 960, max: 3600 },
  speed: { min: 640, max: 1800 },
  dodge: { min: 480, max: 1800 },
  magic: { min: 480, max: 1800 },  // 兼容旧系统
} as const;

/** 资质评价等级 */
export type AptitudeGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

/** 资质评价阈值 (相对于满资质的百分比) */
export const APTITUDE_GRADE_THRESHOLDS: Record<AptitudeGrade, { min: number; name: string; color: string }> = {
  S: { min: 0.95, name: '完美', color: '#ff6b00' },
  A: { min: 0.85, name: '优秀', color: '#ff00ff' },
  B: { min: 0.75, name: '良好', color: '#0066ff' },
  C: { min: 0.65, name: '普通', color: '#00ff00' },
  D: { min: 0.55, name: '较差', color: '#999999' },
  E: { min: 0, name: '极差', color: '#666666' },
};

/**
 * 根据宠物类型获取资质倾向
 * 影响各项资质的生成概率
 */
export const PET_TYPE_APTITUDE_BIAS: Record<PetType, Partial<Record<keyof PetAptitude, number>>> = {
  attack: { attack: 1.2, hp: 1.1, speed: 1.1, defense: 0.9 },
  magic: { mp: 1.3, speed: 1.0, defense: 0.9, hp: 0.9 },
  defense: { defense: 1.3, hp: 1.2, speed: 0.8, dodge: 0.9 },
  support: { mp: 1.1, hp: 1.1, speed: 1.1, defense: 1.0 },
  control: { speed: 1.3, dodge: 1.2, mp: 1.0, defense: 0.9 },
  balance: { attack: 1.0, defense: 1.0, hp: 1.0, mp: 1.0, speed: 1.0, dodge: 1.0 },
};

// ==================== 生成函数 ====================

/**
 * 从5档成长率中随机选择一档
 * @param growthRates 5档成长率数组
 * @param quality 品质（影响选择概率）
 * @param prng 随机数生成函数
 */
export function selectGrowthRate(
  growthRates: [number, number, number, number, number],
  quality: PetQuality = 'baby',
  prng: () => number = Math.random
): GrowthRateValue {
  const config = PET_QUALITY_CONFIG[quality];

  // 根据品质调整概率分布
  // 宝宝倾向于中间档，变异/神兽倾向于高档
  const weights = [10, 25, 30, 25, 10]; // 基础权重

  // 品质加成：越高品质越容易抽到高档
  const qualityBonus = quality === 'divine' ? 2 : quality === 'variant' ? 1 : 0;
  const adjustedWeights = weights.map((w, i) => w + (i * qualityBonus * 5));

  // 加权随机选择
  const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
  let roll = prng() * totalWeight;

  for (let i = 0; i < adjustedWeights.length; i++) {
    roll -= adjustedWeights[i];
    if (roll <= 0) {
      return growthRates[i] + config.growthBonus;
    }
  }

  return growthRates[2] + config.growthBonus; // 默认返回中档
}

/**
 * 生成随机资质
 * @param aptitudeConfig 资质配置范围
 * @param quality 品质
 * @param petType 宠物类型
 * @param prng 随机数生成函数
 */
export function generateAptitude(
  aptitudeConfig: PetAptitudeConfig,
  quality: PetQuality = 'baby',
  petType: PetType = 'balance',
  prng: () => number = Math.random
): PetAptitude {
  const config = PET_QUALITY_CONFIG[quality];
  const bias = PET_TYPE_APTITUDE_BIAS[petType] || {};

  const generateValue = (
    range: AptitudeRange,
    biasMultiplier: number = 1.0
  ): number => {
    // 基础值在范围内随机
    const baseValue = range.min + prng() * (range.max - range.min);

    // 应用品质加成
    const qualityBonus = 1 + config.aptitudeBonus;

    // 应用类型倾向（使其更接近上限）
    const biasedValue = range.min + (baseValue - range.min) * biasMultiplier;

    // 最终值不能超过范围上限
    return Math.min(range.max, Math.floor(biasedValue * qualityBonus));
  };

  return {
    attack: generateValue(aptitudeConfig.attack, bias.attack),
    defense: generateValue(aptitudeConfig.defense, bias.defense),
    hp: generateValue(aptitudeConfig.hp, bias.hp),
    mp: generateValue(aptitudeConfig.mp, bias.mp),
    speed: generateValue(aptitudeConfig.speed, bias.speed),
    dodge: generateValue(aptitudeConfig.dodge, bias.dodge),
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

// ==================== 属性计算 ====================

/**
 * 计算成长后的HP值
 * 公式参考梦幻西游: HP = 体力资质 * 等级 * 成长率 * 系数
 */
export function calculateHp(
  level: number,
  hpAptitude: number,
  growthRate: GrowthRateValue
): number {
  // 简化公式: HP = (资质 / 10) * 等级 * 成长率 * 5
  return Math.floor((hpAptitude / 10) * level * growthRate * 5);
}

/**
 * 计算成长后的MP值
 */
export function calculateMp(
  level: number,
  mpAptitude: number,
  growthRate: GrowthRateValue
): number {
  return Math.floor((mpAptitude / 10) * level * growthRate * 3);
}

/**
 * 计算成长后的攻击值
 */
export function calculateAttack(
  level: number,
  attackAptitude: number,
  growthRate: GrowthRateValue
): number {
  return Math.floor((attackAptitude / 100) * level * growthRate * 2);
}

/**
 * 计算成长后的防御值
 */
export function calculateDefense(
  level: number,
  defenseAptitude: number,
  growthRate: GrowthRateValue
): number {
  return Math.floor((defenseAptitude / 100) * level * growthRate * 2);
}

/**
 * 计算成长后的速度值
 */
export function calculateSpeed(
  level: number,
  speedAptitude: number,
  growthRate: GrowthRateValue
): number {
  return Math.floor((speedAptitude / 100) * level * growthRate * 1.5);
}

/**
 * 计算成长后的躲闪值
 */
export function calculateDodge(
  level: number,
  dodgeAptitude: number,
  growthRate: GrowthRateValue
): number {
  return Math.floor((dodgeAptitude / 100) * level * growthRate * 1.2);
}

/**
 * 计算所有战斗属性
 */
export function calculateAllStats(
  level: number,
  aptitude: PetAptitude,
  growthRate: GrowthRateValue,
  baseStatMultiplier: number = 1.0
): {
  maxHp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  dodge: number;
} {
  return {
    maxHp: Math.floor(calculateHp(level, aptitude.hp, growthRate) * baseStatMultiplier),
    maxMp: Math.floor(calculateMp(level, aptitude.mp, growthRate) * baseStatMultiplier),
    attack: Math.floor(calculateAttack(level, aptitude.attack, growthRate) * baseStatMultiplier),
    defense: Math.floor(calculateDefense(level, aptitude.defense, growthRate) * baseStatMultiplier),
    speed: Math.floor(calculateSpeed(level, aptitude.speed, growthRate) * baseStatMultiplier),
    dodge: Math.floor(calculateDodge(level, aptitude.dodge, growthRate) * baseStatMultiplier),
  };
}

// ==================== 工具函数 ====================

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
 * 计算资质总分 (百分比形式)
 */
export function calculateAptitudeScore(
  aptitude: PetAptitude,
  aptitudeConfig: PetAptitudeConfig
): number {
  const scores = [
    aptitude.attack / aptitudeConfig.attack.max,
    aptitude.defense / aptitudeConfig.defense.max,
    aptitude.hp / aptitudeConfig.hp.max,
    aptitude.mp / aptitudeConfig.mp.max,
    aptitude.speed / aptitudeConfig.speed.max,
    aptitude.dodge / aptitudeConfig.dodge.max,
  ];
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * 获取资质评价等级
 */
export function getAptitudeGrade(
  aptitudeValue: number,
  maxValue: number
): AptitudeGrade {
  const ratio = aptitudeValue / maxValue;

  for (const [grade, config] of Object.entries(APTITUDE_GRADE_THRESHOLDS)) {
    if (ratio >= config.min) {
      return grade as AptitudeGrade;
    }
  }

  return 'E';
}

/**
 * 判断资质是否优秀 (A级以上)
 */
export function isAptitudeExcellent(
  aptitude: PetAptitude,
  aptitudeConfig: PetAptitudeConfig
): boolean {
  const score = calculateAptitudeScore(aptitude, aptitudeConfig);
  return score >= APTITUDE_GRADE_THRESHOLDS.A.min;
}

/**
 * 获取资质等级名称
 */
export function getAptitudeGradeName(grade: AptitudeGrade): string {
  return APTITUDE_GRADE_THRESHOLDS[grade].name;
}

/**
 * 获取资质等级颜色
 */
export function getAptitudeGradeColor(grade: AptitudeGrade): string {
  return APTITUDE_GRADE_THRESHOLDS[grade].color;
}

/**
 * 五行相克关系
 */
export const ELEMENT_COUNTERS: Record<PetElement, PetElement> = {
  metal: 'wood',    // 金克木
  wood: 'earth',    // 木克土
  water: 'fire',    // 水克火
  fire: 'metal',    // 火克金
  earth: 'water',   // 土克水
  physical: 'none', // 物理不参与五行克制
  none: 'none',
};

/**
 * 检查五行克制
 * @returns 正数表示克制对方，负数表示被对方克制，0表示无关系
 */
export function checkElementCounter(
  attacker: PetElement,
  defender: PetElement
): number {
  if (attacker === 'none' || defender === 'none') return 0;
  if (ELEMENT_COUNTERS[attacker] === defender) return 1;  // 克制
  if (ELEMENT_COUNTERS[defender] === attacker) return -1; // 被克制
  return 0;
}

// ==================== 兼容旧系统的函数 ====================

/**
 * 生成随机成长率 - 兼容旧系统
 * @param quality 品质
 * @param prng 随机数生成函数
 */
export function generateGrowthRate(
  quality: PetQuality = 'baby',
  prng: () => number = Math.random
): GrowthRateValue {
  // 使用标准5档成长率
  const baseRates: [number, number, number, number, number] = [0.95, 1.05, 1.15, 1.20, 1.25];
  return selectGrowthRate(baseRates, quality, prng);
}

/**
 * 计算成长属性 - 兼容旧系统
 * @param level 等级
 * @param aptitude 资质
 * @param growthRate 成长率
 * @param statType 属性类型
 */
export function calculateGrowthStat(
  level: number,
  aptitude: number,
  growthRate: GrowthRateValue,
  statType: 'hp' | 'mp' | 'attack' | 'defense' | 'speed'
): number {
  const statCalculators: Record<string, (l: number, a: number, g: GrowthRateValue) => number> = {
    hp: calculateHp,
    mp: calculateMp,
    attack: calculateAttack,
    defense: calculateDefense,
    speed: calculateSpeed,
  };

  const calculator = statCalculators[statType];
  return calculator(level, aptitude, growthRate);
}
