// 合宠系统配置

import type { Quality } from '@/types';

/** 合宠配置 */
export const PET_FUSION_CONFIG = {
  /** 技能保留概率 (60%) */
  skillRetentionRate: 0.6,

  /** 额外技能槽概率 (15%) */
  bonusSkillSlotChance: 0.15,

  /** 稀有度提升概率 (10%) */
  rarityUpChance: 0.1,

  /** 资质超范围概率 (10%) */
  aptitudeOverflowChance: 0.1,

  /** 资质超范围上限 (向上10%) */
  aptitudeOverflowBonus: 0.1,

  /** 资质范围下限 */
  aptitudeMin: 0.8,

  /** 资质范围上限 */
  aptitudeMax: 1.5,

  /** 最大技能槽数量 */
  maxSkillSlots: 6,

  /** 基础技能槽数量 */
  baseSkillSlots: 4,
} as const;

/** 稀有度顺序 */
export const RARITY_ORDER: Quality[] = ['common', 'rare', 'epic', 'legendary', 'mythic'];

/** 获取下一级稀有度 */
export function getNextRarity(currentRarity: Quality): Quality | null {
  const index = RARITY_ORDER.indexOf(currentRarity);
  if (index < 0 || index >= RARITY_ORDER.length - 1) {
    return null;
  }
  return RARITY_ORDER[index + 1];
}

/** 比较稀有度，返回 1 表示 a > b, -1 表示 a < b, 0 表示相等 */
export function compareRarity(a: Quality, b: Quality): number {
  const indexA = RARITY_ORDER.indexOf(a);
  const indexB = RARITY_ORDER.indexOf(b);
  if (indexA > indexB) return 1;
  if (indexA < indexB) return -1;
  return 0;
}

/** 获取两个稀有度中较高的 */
export function getMaxRarity(a: Quality, b: Quality): Quality {
  return compareRarity(a, b) >= 0 ? a : b;
}

/** 计算合宠金币消耗 */
export function calculateFusionCost(mainPetLevel: number, subPetLevel: number): number {
  const baseCost = 1000;
  const levelMultiplier = (mainPetLevel + subPetLevel) * 50;
  return baseCost + levelMultiplier;
}
