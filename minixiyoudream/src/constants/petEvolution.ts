// 宠物进化配置 - 兼容旧系统
// 注意：新系统请使用 summonTemplates.ts 和 alchemyService.ts

import type { PetAptitude, PetQuality } from '@/types/pet';

/** 进化需求 */
export interface EvolutionRequirements {
  level: number;
  items: { id: string; count: number }[];
  aptitudeMin?: Partial<PetAptitude>;
  intimacyMin?: number;
}

/** 进化结果 */
export interface EvolutionResult {
  targetId: string;
  targetName: string;
  statBonus: number;
  newSkills: string[];
  qualityUpgrade?: PetQuality;
  appearanceChange?: boolean;
}

/** 进化配置 */
export interface EvolutionConfig {
  petId: string;
  requirements: EvolutionRequirements;
  result: EvolutionResult;
}

/** 合宠规则 */
export const FUSION_RULES = {
  minLevel: 30,
  sameTypeBonus: true,
  maxInheritedSkills: 4,
  aptitudeInheritRate: 0.7,
};

// 空的进化配置映射
const EVOLUTION_CONFIGS: Record<string, EvolutionConfig> = {};

/**
 * 获取进化配置
 */
export function getEvolutionConfig(petId: string): EvolutionConfig | null {
  // 新系统请使用 summonTemplates.ts
  const config = EVOLUTION_CONFIGS[petId];
  if (!config) {
    return null;
  }
  return config;
}

/**
 * 检查是否可以进化
 */
export function canEvolve(petId: string, level: number): boolean {
  const config = getEvolutionConfig(petId);
  if (!config) return false;
  return level >= config.requirements.level;
}

/**
 * 获取炼妖材料
 */
export interface AlchemyMaterialConfig {
  id: string;
  name: string;
  targetAptitude: keyof PetAptitude;
  bonusRange: [number, number];
  successRate: number;
  failPenalty: number;
}

export function getAlchemyMaterial(_id: string): AlchemyMaterialConfig | null {
  console.warn('getAlchemyMaterial: 请使用 alchemyService.ts 中的 ALCHEMY_MATERIALS');
  return null;
}

/**
 * 获取资质上限
 */
export function getAptitudeCap(stat: keyof PetAptitude, quality: PetQuality): number {
  // 根据品质返回不同的资质上限
  const baseCaps: Record<keyof PetAptitude, number> = {
    attack: 3000,
    defense: 3000,
    hp: 6000,
    mp: 3600,
    speed: 1800,
    dodge: 1800,
    magic: 1800,
  };

  const qualityMultipliers: Record<PetQuality, number> = {
    wild: 0.8,
    baby: 1.0,
    variant: 1.1,
    divine: 1.2,
  };

  return Math.floor(baseCaps[stat] * qualityMultipliers[quality]);
}

/**
 * 计算合宠品质
 */
export function calculateFusionQuality(quality1: PetQuality, quality2: PetQuality): PetQuality {
  // 简单取较高品质
  const qualityOrder: PetQuality[] = ['wild', 'baby', 'variant', 'divine'];
  const idx1 = qualityOrder.indexOf(quality1);
  const idx2 = qualityOrder.indexOf(quality2);
  return qualityOrder[Math.max(idx1, idx2)];
}

/**
 * 计算合宠资质
 */
export function calculateFusionAptitude(
  apt1: PetAptitude,
  apt2: PetAptitude,
  prng: () => number = Math.random
): PetAptitude {
  // 在两只宠物资质之间随机
  const randomBetween = (a: number, b: number) => {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.floor(min + (max - min) * prng());
  };

  return {
    attack: randomBetween(apt1.attack, apt2.attack),
    defense: randomBetween(apt1.defense, apt2.defense),
    hp: randomBetween(apt1.hp, apt2.hp),
    mp: randomBetween(apt1.mp, apt2.mp),
    speed: randomBetween(apt1.speed, apt2.speed),
    dodge: randomBetween(apt1.dodge, apt2.dodge),
  };
}
