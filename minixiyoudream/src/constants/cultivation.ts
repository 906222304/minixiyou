// 修炼系统常量配置

import type {
  CultivationType,
  CultivationTypeConfig,
  RealmConfig,
  CultivationPill,
} from '@/types/cultivation';

// ============================================
// 修炼类型配置
// ============================================

/** 修炼类型配置列表 */
export const CULTIVATION_TYPES: CultivationTypeConfig[] = [
  {
    type: 'strength',
    name: '力量修炼',
    icon: '💪',
    description: '提升力量属性，增强物理攻击能力',
    targetStat: 'strength',
  },
  {
    type: 'intelligence',
    name: '灵力修炼',
    icon: '🔮',
    description: '提升灵力属性，增强法术攻击能力',
    targetStat: 'intelligence',
  },
  {
    type: 'vitality',
    name: '体质修炼',
    icon: '❤️',
    description: '提升体质属性，增加生命值和物理防御',
    targetStat: 'vitality',
  },
  {
    type: 'agility',
    name: '敏捷修炼',
    icon: '💨',
    description: '提升敏捷属性，增加速度和暴击率',
    targetStat: 'agility',
  },
  {
    type: 'willpower',
    name: '魔力修炼',
    icon: '💙',
    description: '提升魔力属性，增加法力值和法术防御',
    targetStat: 'willpower',
  },
];

/** 获取修炼类型配置 */
export function getCultivationTypeConfig(type: CultivationType): CultivationTypeConfig | undefined {
  return CULTIVATION_TYPES.find(c => c.type === type);
}

// ============================================
// 境界配置
// ============================================

/** 境界列表 */
export const REALMS: RealmConfig[] = [
  {
    level: 1,
    name: '练气期',
    description: '初入仙途，感应天地灵气',
    requiredTotalLevel: 0,
    baseSuccessRate: 1.0,
    bonusMultiplier: 1.0,
  },
  {
    level: 2,
    name: '筑基期',
    description: '筑建道基，凝聚真元',
    requiredTotalLevel: 25,
    requiredItem: 'item_foundation_pill',
    baseSuccessRate: 0.8,
    bonusMultiplier: 1.2,
    effect: '全属性+5%',
  },
  {
    level: 3,
    name: '金丹期',
    description: '凝结金丹，道法初成',
    requiredTotalLevel: 60,
    requiredItem: 'item_golden_core_pill',
    baseSuccessRate: 0.6,
    bonusMultiplier: 1.5,
    effect: '全属性+10%，暴击率+5%',
  },
  {
    level: 4,
    name: '元婴期',
    description: '元婴出窍，神游太虚',
    requiredTotalLevel: 120,
    requiredItem: 'item_nascent_soul_pill',
    baseSuccessRate: 0.4,
    bonusMultiplier: 2.0,
    effect: '全属性+20%，暴击伤害+20%',
  },
  {
    level: 5,
    name: '化神期',
    description: '化神入道，通天彻地',
    requiredTotalLevel: 200,
    requiredItem: 'item_deity_pill',
    baseSuccessRate: 0.2,
    bonusMultiplier: 3.0,
    effect: '全属性+30%，所有伤害+15%',
  },
];

/** 获取境界配置 */
export function getRealmConfig(level: number): RealmConfig | undefined {
  return REALMS.find(r => r.level === level);
}

/** 获取下一个境界 */
export function getNextRealm(currentRealm: number): RealmConfig | undefined {
  return REALMS.find(r => r.level === currentRealm + 1);
}

/** 获取最高境界等级 */
export function getMaxRealmLevel(): number {
  return Math.max(...REALMS.map(r => r.level));
}

// ============================================
// 经验配置
// ============================================

/** 修炼等级上限 */
export const MAX_CULTIVATION_LEVEL = 100;

/** 计算升级所需经验 */
export function getExpToNextLevel(level: number): number {
  // 经验随等级指数增长
  // 基础经验100，每级增长20%
  const baseExp = 100;
  const growthRate = 1.2;
  return Math.floor(baseExp * Math.pow(growthRate, level - 1));
}

/** 计算每级提供的属性加成 */
export function getBonusPerLevel(level: number): number {
  // 每级提供1点基础加成
  // 每10级额外提供1点
  return 1 + Math.floor(level / 10);
}

/** 获取修炼等级对应的总加成 */
export function getTotalBonus(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += getBonusPerLevel(i);
  }
  return total;
}

// ============================================
// 修炼丹药配置
// ============================================

/** 修炼丹药列表 */
export const CULTIVATION_PILLS: CultivationPill[] = [
  {
    itemId: 'item_exp_pill_small',
    name: '小经验丹',
    expBonus: 50,
  },
  {
    itemId: 'item_exp_pill_medium',
    name: '中经验丹',
    expBonus: 200,
  },
  {
    itemId: 'item_exp_pill_large',
    name: '大经验丹',
    expBonus: 500,
  },
  {
    itemId: 'item_strength_pill',
    name: '力量修炼丹',
    expBonus: 300,
    targetType: 'strength',
  },
  {
    itemId: 'item_intelligence_pill',
    name: '灵力修炼丹',
    expBonus: 300,
    targetType: 'intelligence',
  },
  {
    itemId: 'item_vitality_pill',
    name: '体质修炼丹',
    expBonus: 300,
    targetType: 'vitality',
  },
  {
    itemId: 'item_agility_pill',
    name: '敏捷修炼丹',
    expBonus: 300,
    targetType: 'agility',
  },
  {
    itemId: 'item_willpower_pill',
    name: '魔力修炼丹',
    expBonus: 300,
    targetType: 'willpower',
  },
];

/** 获取修炼丹药配置 */
export function getCultivationPill(itemId: string): CultivationPill | undefined {
  return CULTIVATION_PILLS.find(p => p.itemId === itemId);
}

// ============================================
// 修炼速度配置
// ============================================

/** 基础修炼速度（每分钟获得的经验） */
export const BASE_CULTIVATION_SPEED = 10;

/** 每次自动修炼获得的经验 */
export const AUTO_CULTIVATION_EXP = 5;

/** 自动修炼间隔（毫秒） */
export const AUTO_CULTIVATION_INTERVAL = 3000;

/** 离线修炼效率（相对于在线） */
export const OFFLINE_CULTIVATION_EFFICIENCY = 0.3;

/** 最大离线修炼时间（毫秒） - 12小时 */
export const MAX_OFFLINE_CULTIVATION_TIME = 12 * 60 * 60 * 1000;

// ============================================
// 突破配置
// ============================================

/** 计算突破成功率 */
export function calculateBreakthroughSuccessRate(
  baseRate: number,
  totalLevel: number,
  requiredLevel: number
): number {
  // 超出要求的等级会增加成功率
  const levelBonus = Math.max(0, (totalLevel - requiredLevel) / requiredLevel) * 0.2;
  // 最高成功率不超过95%
  return Math.min(0.95, baseRate + levelBonus);
}

/** 突破失败后的惩罚 - 损失的修炼经验比例 */
export const BREAKTHROUGH_FAIL_EXP_PENALTY = 0.1;

/** 突破失败后需要等待的时间（毫秒） - 1小时 */
export const BREAKTHROUGH_FAIL_COOLDOWN = 60 * 60 * 1000;
