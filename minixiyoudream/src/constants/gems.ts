// 宝石系统配置

import type { GemType, Gem } from '@/types/equipment';
import type { BaseStats } from '@/types/common';

// ============================================
// 类型定义
// ============================================

/** 宝石类型配置 */
export interface GemTypeConfig {
  type: GemType;
  name: string;
  icon: string;
  color: string;
  description: string;
  mainStat: keyof BaseStats;
}

/** 宝石等级配置 */
export interface GemLevelConfig {
  level: number;
  name: string;
  statMultiplier: number;
  synthesizeRequired: number;
  synthesizeSuccessRate: number;
  sellPrice: number;
}

/** 宝石模板（用于生成宝石实例） */
export interface GemTemplate {
  type: GemType;
  level: number;
  name: string;
  icon: string;
  statBonus: Partial<BaseStats>;
  color: string;
}

// ============================================
// 宝石类型配置
// ============================================

/** 宝石类型配置表 */
export const GEM_TYPE_CONFIG: Record<GemType, GemTypeConfig> = {
  ruby: {
    type: 'ruby',
    name: '红宝石',
    icon: '🔴',
    color: '#FF4444',
    description: '增加力量，提升物理攻击',
    mainStat: 'strength',
  },
  sapphire: {
    type: 'sapphire',
    name: '蓝宝石',
    icon: '🔵',
    color: '#4488FF',
    description: '增加灵力，提升法术攻击',
    mainStat: 'intelligence',
  },
  emerald: {
    type: 'emerald',
    name: '绿宝石',
    icon: '🟢',
    color: '#44DD44',
    description: '增加体质，提升HP和防御',
    mainStat: 'vitality',
  },
  topaz: {
    type: 'topaz',
    name: '黄宝石',
    icon: '🟡',
    color: '#FFD700',
    description: '增加敏捷，提升速度和暴击',
    mainStat: 'agility',
  },
  amethyst: {
    type: 'amethyst',
    name: '紫宝石',
    icon: '🟣',
    color: '#AA44FF',
    description: '增加魔力，提升MP和法防',
    mainStat: 'willpower',
  },
  diamond: {
    type: 'diamond',
    name: '钻石',
    icon: '💎',
    color: '#FFFFFF',
    description: '增加全属性',
    mainStat: 'strength',
  },
};

// ============================================
// 宝石等级配置
// ============================================

/** 宝石等级配置表（1-10级） */
export const GEM_LEVEL_CONFIG: GemLevelConfig[] = [
  { level: 1, name: '一级', statMultiplier: 1.0, synthesizeRequired: 3, synthesizeSuccessRate: 1.0, sellPrice: 50 },
  { level: 2, name: '二级', statMultiplier: 2.5, synthesizeRequired: 3, synthesizeSuccessRate: 0.95, sellPrice: 150 },
  { level: 3, name: '三级', statMultiplier: 5.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.90, sellPrice: 400 },
  { level: 4, name: '四级', statMultiplier: 9.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.85, sellPrice: 1000 },
  { level: 5, name: '五级', statMultiplier: 15.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.80, sellPrice: 2500 },
  { level: 6, name: '六级', statMultiplier: 25.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.70, sellPrice: 6000 },
  { level: 7, name: '七级', statMultiplier: 40.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.60, sellPrice: 15000 },
  { level: 8, name: '八级', statMultiplier: 65.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.50, sellPrice: 40000 },
  { level: 9, name: '九级', statMultiplier: 100.0, synthesizeRequired: 3, synthesizeSuccessRate: 0.40, sellPrice: 100000 },
  { level: 10, name: '十级', statMultiplier: 150.0, synthesizeRequired: 0, synthesizeSuccessRate: 0, sellPrice: 300000 },
];

// ============================================
// 基础属性加成表
// ============================================

/** 宝石基础属性值（1级宝石的基础加成） */
export const GEM_BASE_STATS: Record<keyof BaseStats, number> = {
  strength: 5,
  intelligence: 5,
  vitality: 5,
  agility: 5,
  willpower: 5,
};

// ============================================
// 镶嵌规则配置
// ============================================

/** 装备槽位与可镶嵌宝石类型映射 */
export const SLOT_ALLOWED_GEMS: Record<string, GemType[]> = {
  weapon: ['ruby', 'sapphire', 'topaz', 'diamond'],
  helmet: ['ruby', 'sapphire', 'emerald', 'amethyst', 'diamond'],
  armor: ['emerald', 'amethyst', 'diamond'],
  boots: ['topaz', 'emerald', 'diamond'],
  belt: ['emerald', 'topaz', 'diamond'],
  necklace: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
  charm: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
  ring1: ['ruby', 'sapphire', 'topaz', 'diamond'],
  ring2: ['ruby', 'sapphire', 'topaz', 'diamond'],
};

/** 拆卸宝石消耗金币（按宝石等级） */
export const REMOVE_GEM_GOLD_COST: Record<number, number> = {
  1: 100,
  2: 300,
  3: 800,
  4: 2000,
  5: 5000,
  6: 12000,
  7: 30000,
  8: 75000,
  9: 180000,
  10: 500000,
};

/** 合成宝石金币消耗（按目标等级） */
export const SYNTHESIZE_GEM_GOLD_COST: Record<number, number> = {
  2: 100,
  3: 300,
  4: 800,
  5: 2000,
  6: 5000,
  7: 12000,
  8: 30000,
  9: 75000,
  10: 200000,
};

// ============================================
// 辅助函数
// ============================================

/** 获取宝石类型配置 */
export function getGemTypeConfig(type: GemType): GemTypeConfig | undefined {
  return GEM_TYPE_CONFIG[type];
}

/** 获取宝石等级配置 */
export function getGemLevelConfig(level: number): GemLevelConfig | undefined {
  return GEM_LEVEL_CONFIG.find(config => config.level === level);
}

/** 获取宝石名称 */
export function getGemName(type: GemType, level: number): string {
  const typeConfig = getGemTypeConfig(type);
  const levelConfig = getGemLevelConfig(level);
  return `${levelConfig?.name || ''}${typeConfig?.name || '宝石'}`;
}

/** 获取宝石图标 */
export function getGemIcon(type: GemType): string {
  return GEM_TYPE_CONFIG[type]?.icon || '💎';
}

/** 获取宝石颜色 */
export function getGemColor(type: GemType): string {
  return GEM_TYPE_CONFIG[type]?.color || '#FFFFFF';
}

/** 计算宝石属性加成 */
export function calculateGemStats(type: GemType, level: number): Partial<BaseStats> {
  const typeConfig = getGemTypeConfig(type);
  const levelConfig = getGemLevelConfig(level);

  if (!typeConfig || !levelConfig) {
    return {};
  }

  const multiplier = levelConfig.statMultiplier;
  const stats: Partial<BaseStats> = {};

  if (type === 'diamond') {
    // 钻石增加全属性
    const baseStatsKeys: (keyof BaseStats)[] = ['strength', 'intelligence', 'vitality', 'agility', 'willpower'];
    for (const stat of baseStatsKeys) {
      const baseValue = GEM_BASE_STATS[stat] * 0.4; // 钻石单属性加成较低
      stats[stat] = Math.floor(baseValue * multiplier);
    }
  } else {
    // 普通宝石增加主属性
    const mainStat = typeConfig.mainStat;
    const baseValue = GEM_BASE_STATS[mainStat];
    stats[mainStat] = Math.floor(baseValue * multiplier);
  }

  return stats;
}

/** 检查宝石是否可以镶嵌到装备槽位 */
export function canSocketGemInSlot(
  slot: string,
  gemType: GemType
): boolean {
  const allowedGems = SLOT_ALLOWED_GEMS[slot];
  return allowedGems?.includes(gemType) ?? false;
}

/** 获取拆卸宝石消耗 */
export function getRemoveGemCost(gemLevel: number): number {
  return REMOVE_GEM_GOLD_COST[gemLevel] || 100;
}

/** 获取合成宝石消耗 */
export function getSynthesizeCost(targetLevel: number): { gems: number; gold: number; successRate: number } {
  const levelConfig = getGemLevelConfig(targetLevel);
  return {
    gems: levelConfig?.synthesizeRequired || 3,
    gold: SYNTHESIZE_GEM_GOLD_COST[targetLevel] || 0,
    successRate: levelConfig?.synthesizeSuccessRate || 0,
  };
}

/** 获取宝石出售价格 */
export function getGemSellPrice(level: number): number {
  const levelConfig = getGemLevelConfig(level);
  return levelConfig?.sellPrice || 50;
}

/** 获取所有宝石类型 */
export function getAllGemTypes(): GemType[] {
  return Object.keys(GEM_TYPE_CONFIG) as GemType[];
}

/** 获取最大宝石等级 */
export function getMaxGemLevel(): number {
  return GEM_LEVEL_CONFIG.length;
}

// ============================================
// 宝石生成函数
// ============================================

/** 生成随机宝石（用于掉落等场景） */
export function generateRandomGem(
  prng: { next: () => number },
  minLevel: number = 1,
  maxLevel: number = 3
): { type: GemType; level: number } {
  const types = getAllGemTypes();
  const type = types[Math.floor(prng.next() * types.length)];

  // 宝石等级权重（低级宝石更常见）
  const weights: number[] = [];
  for (let level = minLevel; level <= maxLevel; level++) {
    weights.push(Math.pow(2, maxLevel - level));
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let roll = prng.next() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return { type, level: minLevel + i };
    }
  }

  return { type, level: minLevel };
}

/** 创建宝石实例 */
export function createGem(
  type: GemType,
  level: number,
  id: string
): Gem {
  return {
    id,
    type,
    level,
    name: getGemName(type, level),
    statBonus: calculateGemStats(type, level),
  };
}
