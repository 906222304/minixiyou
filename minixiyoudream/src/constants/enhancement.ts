// 强化系统配置

import type { Quality, CombatStats } from '@/types';

// ============================================
// 类型定义
// ============================================

/** 强化等级配置 */
export interface EnhancementLevel {
  level: number;           // 目标等级
  successRate: number;     // 成功率 (0-1)
  statBonus: number;       // 属性加成百分比
  goldCost: number;        // 金币消耗（基础值）
  failPenalty: 'none' | 'downgrade';  // 失败惩罚
}

/** 强化结果 */
export interface EnhancementResult {
  success: boolean;
  newLevel: number;
  downgraded: boolean;     // 是否降级
  cost: number;
}

/** 强化预览信息 */
export interface EnhancementPreview {
  currentLevel: number;
  targetLevel: number;
  successRate: number;
  goldCost: number;
  failPenalty: 'none' | 'downgrade';
  canEnhance: boolean;
  reason?: string;
  maxLevel: number;
}

// ============================================
// 强化表配置
// ============================================

/** 强化等级配置表 */
export const ENHANCEMENT_TABLE: EnhancementLevel[] = [
  { level: 1, successRate: 1.0, statBonus: 0.05, goldCost: 100, failPenalty: 'none' },
  { level: 2, successRate: 1.0, statBonus: 0.05, goldCost: 200, failPenalty: 'none' },
  { level: 3, successRate: 1.0, statBonus: 0.05, goldCost: 300, failPenalty: 'none' },
  { level: 4, successRate: 0.9, statBonus: 0.05, goldCost: 400, failPenalty: 'downgrade' },
  { level: 5, successRate: 0.85, statBonus: 0.06, goldCost: 600, failPenalty: 'downgrade' },
  { level: 6, successRate: 0.75, statBonus: 0.06, goldCost: 800, failPenalty: 'downgrade' },
  { level: 7, successRate: 0.65, statBonus: 0.07, goldCost: 1200, failPenalty: 'downgrade' },
  { level: 8, successRate: 0.55, statBonus: 0.07, goldCost: 1800, failPenalty: 'downgrade' },
  { level: 9, successRate: 0.45, statBonus: 0.08, goldCost: 2800, failPenalty: 'downgrade' },
  { level: 10, successRate: 0.35, statBonus: 0.08, goldCost: 4500, failPenalty: 'downgrade' },
  { level: 11, successRate: 0.25, statBonus: 0.10, goldCost: 7000, failPenalty: 'downgrade' },
  { level: 12, successRate: 0.20, statBonus: 0.10, goldCost: 10000, failPenalty: 'downgrade' },
  { level: 13, successRate: 0.15, statBonus: 0.12, goldCost: 15000, failPenalty: 'downgrade' },
  { level: 14, successRate: 0.10, statBonus: 0.12, goldCost: 22000, failPenalty: 'downgrade' },
  { level: 15, successRate: 0.05, statBonus: 0.15, goldCost: 35000, failPenalty: 'downgrade' },
];

/** 品质对应的最大强化等级 */
export const QUALITY_MAX_ENHANCE: Record<Quality, number> = {
  common: 5,
  uncommon: 6,
  rare: 8,
  epic: 10,
  legendary: 12,
  mythic: 15,
};

/** 保护道具配置 */
export const PROTECTION_ITEM = {
  id: 'enhancement_protection_stone',
  name: '强化保护石',
  icon: '🛡️',
  description: '强化失败时防止装备降级',
};

/** 保护道具消耗（按等级） */
export const PROTECTION_STONE_COST_BY_LEVEL: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 1,
  5: 1,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 4,
  11: 5,
  12: 6,
  13: 8,
  14: 10,
  15: 12,
};

// ============================================
// 计算函数
// ============================================

/** 获取强化等级配置 */
export function getEnhancementLevelConfig(level: number): EnhancementLevel | undefined {
  return ENHANCEMENT_TABLE.find(config => config.level === level);
}

/** 获取品质最大强化等级 */
export function getMaxEnhanceLevel(quality: Quality): number {
  return QUALITY_MAX_ENHANCE[quality] || 5;
}

/** 计算强化金币消耗 */
export function calculateEnhancementGoldCost(currentLevel: number): number {
  const targetLevel = currentLevel + 1;
  const config = getEnhancementLevelConfig(targetLevel);
  return config?.goldCost || 0;
}

/** 计算保护石消耗 */
export function calculateProtectionStoneCost(targetLevel: number): number {
  return PROTECTION_STONE_COST_BY_LEVEL[targetLevel] || 0;
}

/** 获取成功率 */
export function getSuccessRate(targetLevel: number): number {
  const config = getEnhancementLevelConfig(targetLevel);
  return config?.successRate || 0;
}

/** 获取失败惩罚类型 */
export function getFailPenalty(targetLevel: number): 'none' | 'downgrade' {
  const config = getEnhancementLevelConfig(targetLevel);
  return config?.failPenalty || 'downgrade';
}

/** 获取属性加成百分比 */
export function getStatBonus(level: number): number {
  if (level <= 0) return 0;
  let totalBonus = 0;
  for (let i = 1; i <= level; i++) {
    const config = getEnhancementLevelConfig(i);
    if (config) {
      totalBonus += config.statBonus;
    }
  }
  return totalBonus;
}

/** 计算强化后的属性 */
export function calculateEnhancedStats(
  baseStats: Partial<CombatStats>,
  enhanceLevel: number
): Partial<CombatStats> {
  if (enhanceLevel <= 0) return baseStats;

  const bonus = getStatBonus(enhanceLevel);
  const enhancedStats: Partial<CombatStats> = {};

  for (const [key, value] of Object.entries(baseStats)) {
    if (typeof value === 'number') {
      // 百分比属性不参与强化加成
      const isPercentStat = ['critRate', 'critDamage', 'hitRate', 'dodgeRate'].includes(key);
      if (isPercentStat) {
        enhancedStats[key as keyof CombatStats] = value;
      } else {
        enhancedStats[key as keyof CombatStats] = Math.floor(value * (1 + bonus));
      }
    }
  }

  return enhancedStats;
}

/** 检查是否可以强化 */
export function canEnhance(
  currentLevel: number,
  quality: Quality,
  gold: number,
  protectionStones: number = 0,
  useProtection: boolean = false
): { canEnhance: boolean; reason?: string } {
  const maxLevel = getMaxEnhanceLevel(quality);

  if (currentLevel >= maxLevel) {
    return { canEnhance: false, reason: '已达到该品质的最大强化等级' };
  }

  const targetLevel = currentLevel + 1;
  const goldCost = calculateEnhancementGoldCost(currentLevel);

  if (gold < goldCost) {
    return { canEnhance: false, reason: `金币不足，需要 ${goldCost.toLocaleString()} 金币` };
  }

  if (useProtection) {
    const protectionCost = calculateProtectionStoneCost(targetLevel);
    if (protectionStones < protectionCost) {
      return { canEnhance: false, reason: `保护石不足，需要 ${protectionCost} 个` };
    }
  }

  return { canEnhance: true };
}

/** 获取强化预览信息 */
export function getEnhancementPreview(
  currentLevel: number,
  quality: Quality,
  gold: number,
  protectionStones: number = 0
): EnhancementPreview {
  const maxLevel = getMaxEnhanceLevel(quality);
  const targetLevel = currentLevel + 1;
  const config = getEnhancementLevelConfig(targetLevel);

  const checkResult = canEnhance(currentLevel, quality, gold, protectionStones);

  return {
    currentLevel,
    targetLevel,
    successRate: config?.successRate || 0,
    goldCost: config?.goldCost || 0,
    failPenalty: config?.failPenalty || 'none',
    canEnhance: checkResult.canEnhance,
    reason: checkResult.reason,
    maxLevel,
  };
}

/** 格式化成功率显示 */
export function formatSuccessRate(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

/** 格式化属性加成显示 */
export function formatStatBonus(bonus: number): string {
  return `+${(bonus * 100).toFixed(0)}%`;
}
