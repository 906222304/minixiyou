// 洗练系统配置

import type { ReforgeCost, Quality } from '@/types';

// ============================================
// 洗练消耗配置
// ============================================

/** 按品质的基础洗练消耗 */
export const BASE_REFORGE_COST: Record<Quality, ReforgeCost> = {
  common: { reforgeStones: 1, lockStones: 0, gold: 500 },
  rare: { reforgeStones: 2, lockStones: 0, gold: 1000 },
  epic: { reforgeStones: 3, lockStones: 0, gold: 2000 },
  legendary: { reforgeStones: 5, lockStones: 0, gold: 5000 },
  mythic: { reforgeStones: 8, lockStones: 0, gold: 10000 },
};

/** 锁定词条消耗的锁定石数量 */
export const LOCK_STONE_COST_BY_COUNT: Record<number, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 6,
  4: 10,
  5: 15,
};

/** 锁定词条增加的金币消耗倍率 */
export const LOCK_GOLD_MULTIPLIER: Record<number, number> = {
  0: 1.0,
  1: 1.5,
  2: 2.0,
  3: 3.0,
  4: 4.0,
  5: 5.0,
};

// ============================================
// 洗练规则
// ============================================

/** 最大可锁定词条数 */
export const MAX_LOCKED_AFFIXES = 3;

/** 洗练保护（不会降低词条品质）所需的道具数量 */
export const PROTECTION_STONE_COST = 2;

// ============================================
// 计算函数
// ============================================

/** 计算洗练消耗 */
export function calculateReforgeCost(
  quality: Quality,
  lockedCount: number
): ReforgeCost {
  const baseCost = BASE_REFORGE_COST[quality];
  const lockStoneCost = LOCK_STONE_COST_BY_COUNT[lockedCount] || 0;
  const goldMultiplier = LOCK_GOLD_MULTIPLIER[lockedCount] || 1.0;

  return {
    reforgeStones: baseCost.reforgeStones,
    lockStones: lockStoneCost,
    gold: Math.floor(baseCost.gold * goldMultiplier),
  };
}

/** 检查是否可以洗练 */
export function canReforge(
  lockedCount: number,
  totalAffixCount: number
): { canReforge: boolean; reason?: string } {
  if (totalAffixCount === 0) {
    return { canReforge: false, reason: '装备没有词条' };
  }

  if (lockedCount >= totalAffixCount) {
    return { canReforge: false, reason: '至少需要1条未锁定的词条' };
  }

  if (lockedCount > MAX_LOCKED_AFFIXES) {
    return { canReforge: false, reason: `最多只能锁定${MAX_LOCKED_AFFIXES}条词条` };
  }

  return { canReforge: true };
}

/** 格式化消耗显示 */
export function formatReforgeCost(cost: ReforgeCost): string {
  const parts: string[] = [];

  if (cost.reforgeStones > 0) {
    parts.push(`洗练石×${cost.reforgeStones}`);
  }

  if (cost.lockStones > 0) {
    parts.push(`锁定石×${cost.lockStones}`);
  }

  parts.push(`金币×${cost.gold.toLocaleString()}`);

  return parts.join(' + ');
}
