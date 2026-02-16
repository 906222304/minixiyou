// 宠物捕捉系统配置 - 参考梦幻西游

import type { CaptureItem, CaptureConfig, PetQuality } from '@/types';

/** 捕获道具列表 */
export const CAPTURE_ITEMS: CaptureItem[] = [
  {
    id: 'capture_net_wooden',
    name: '木制捕捉网',
    description: '基础的捕捉工具，适合捕捉低等级野生宠物',
    bonusRate: 0.05,
    minLevel: 0,
    maxLevel: 20,
    rarity: 'common',
  },
  {
    id: 'capture_net_iron',
    name: '铁制捕捉网',
    description: '坚固的捕捉工具，适合捕捉中低等级宠物',
    bonusRate: 0.1,
    minLevel: 0,
    maxLevel: 40,
    rarity: 'common',
  },
  {
    id: 'capture_net_silver',
    name: '银丝捕捉网',
    description: '用银丝编织的捕捉网，更加坚韧',
    bonusRate: 0.15,
    minLevel: 0,
    maxLevel: 60,
    rarity: 'rare',
  },
  {
    id: 'capture_net_gold',
    name: '金丝捕捉网',
    description: '用金丝编织的顶级捕捉网，成功率极高',
    bonusRate: 0.25,
    minLevel: 0,
    maxLevel: 80,
    rarity: 'epic',
  },
  {
    id: 'capture_ball_basic',
    name: '普通封灵珠',
    description: '封印野生宠物的基础道具',
    bonusRate: 0.1,
    minLevel: 0,
    maxLevel: 0, // 无等级限制
    rarity: 'common',
  },
  {
    id: 'capture_ball_great',
    name: '高级封灵珠',
    description: '封印宠物的成功率高30%',
    bonusRate: 0.15,
    minLevel: 15,
    maxLevel: 0,
    rarity: 'rare',
  },
  {
    id: 'capture_ball_ultra',
    name: '超级封灵珠',
    description: '封印宠物的成功率高50%',
    bonusRate: 0.2,
    minLevel: 30,
    maxLevel: 0,
    rarity: 'epic',
  },
  {
    id: 'capture_ball_master',
    name: '大师封灵珠',
    description: '封印宠物的成功率高80%',
    bonusRate: 0.3,
    minLevel: 50,
    maxLevel: 0,
    rarity: 'legendary',
  },
  {
    id: 'capture_charm_common',
    name: '驯兽符(普通)',
    description: '增加驯服成功率的符咒',
    bonusRate: 0.08,
    minLevel: 0,
    maxLevel: 0,
    rarity: 'common',
  },
  {
    id: 'capture_charm_advanced',
    name: '驯兽符(高级)',
    description: '大幅增加驯服成功率的符咒',
    bonusRate: 0.15,
    minLevel: 20,
    maxLevel: 0,
    rarity: 'rare',
  },
  {
    id: 'capture_charm_supreme',
    name: '驯兽符(至尊)',
    description: '极大增加驯服成功率的符咒',
    bonusRate: 0.25,
    minLevel: 40,
    maxLevel: 0,
    rarity: 'epic',
  },
];

/** 捕获道具映射 */
export const CAPTURE_ITEMS_MAP: Record<string, CaptureItem> = Object.fromEntries(
  CAPTURE_ITEMS.map(item => [item.id, item])
);

/** 基础捕获配置 */
export const CAPTURE_CONFIG: CaptureConfig = {
  baseCaptureRate: 0.35,       // 基础捕获率35%
  hpFactor: 2.0,               // 血量因子
  statusFactor: 1.5,           // 异常状态加成50%
  qualityModifiers: {
    wild: 1.0,                 // 野生正常
    baby: 0.7,                 // 宝宝难度提高30%
    variant: 0.4,              // 变异难度提高60%
    divine: 0.2,               // 神兽难度提高80%
  },
};

/** 状态效果对捕获的加成 */
export const STATUS_CAPTURE_BONUS: Record<string, number> = {
  stun: 0.3,           // 眩晕 +30%
  sleep: 0.25,         // 睡眠 +25%
  freeze: 0.2,         // 冰冻 +20%
  poison: 0.1,         // 中毒 +10%
  burn: 0.1,           // 灼烧 +10%
  silence: 0.05,       // 沉默 +5%
  slow: 0.1,           // 减速 +10%
  paralyzed: 0.25,     // 麻痹 +25%
};

/** 地图捕获加成 */
export const MAP_CAPTURE_BONUS: Record<string, number> = {
  map_fairy_spring: 0.1,      // 仙境之泉 +10%
  map_flower_valley: 0.05,    // 花谷 +5%
  map_dragon_palace: -0.1,    // 龙宫 -10%
  map_underworld: -0.15,      // 地府 -15%
  map_celestial_palace: -0.2, // 天宫 -20%
};

/**
 * 计算捕获率
 * @param baseRate 基础捕获率
 * @param currentHp 当前血量
 * @param maxHp 最大血量
 * @param statuses 状态效果列表
 * @param quality 宠物品质
 * @param itemId 使用的捕获道具ID
 * @param mapId 地图ID
 */
export function calculateCaptureRate(
  baseRate: number = CAPTURE_CONFIG.baseCaptureRate,
  currentHp: number,
  maxHp: number,
  statuses: string[] = [],
  quality: PetQuality = 'wild',
  itemId?: string,
  mapId?: string
): number {
  // 血量因子: 血量越低越容易捕获
  const hpRatio = Math.max(0, Math.min(1, currentHp / maxHp));
  const hpMultiplier = 1 + CAPTURE_CONFIG.hpFactor * (1 - hpRatio);

  // 状态因子: 异常状态增加捕获率
  const statusBonus = statuses.reduce((sum, status) => {
    return sum + (STATUS_CAPTURE_BONUS[status] || 0);
  }, 0);
  const statusMultiplier = 1 + CAPTURE_CONFIG.statusFactor * statusBonus;

  // 品质修正
  const qualityMultiplier = CAPTURE_CONFIG.qualityModifiers[quality] || 1.0;

  // 道具加成
  let itemBonus = 0;
  if (itemId && CAPTURE_ITEMS_MAP[itemId]) {
    itemBonus = CAPTURE_ITEMS_MAP[itemId].bonusRate;
  }

  // 地图加成
  const mapBonus = mapId ? (MAP_CAPTURE_BONUS[mapId] || 0) : 0;

  // 最终捕获率 = 基础率 * 血量因子 * 状态因子 * 品质修正 + 道具加成 + 地图加成
  const finalRate =
    baseRate * hpMultiplier * statusMultiplier * qualityMultiplier +
    itemBonus +
    mapBonus;

  // 限制在 0.01 ~ 0.95 之间
  return Math.max(0.01, Math.min(0.95, finalRate));
}

/**
 * 检查是否可以使用捕获道具
 * @param itemId 道具ID
 * @param petLevel 宠物等级
 */
export function canUseCaptureItem(itemId: string, petLevel: number): boolean {
  const item = CAPTURE_ITEMS_MAP[itemId];
  if (!item) return false;

  // 检查等级限制
  if (petLevel < item.minLevel) return false;
  if (item.maxLevel > 0 && petLevel > item.maxLevel) return false;

  return true;
}

/**
 * 获取适合的捕获道具
 * @param petLevel 宠物等级
 * @param quality 宠物品质
 */
export function getRecommendedCaptureItem(
  petLevel: number,
  quality: PetQuality
): CaptureItem | undefined {
  // 筛选可用道具
  const usableItems = CAPTURE_ITEMS.filter(
    item => canUseCaptureItem(item.id, petLevel)
  );

  if (usableItems.length === 0) return undefined;

  // 根据品质选择推荐道具
  // 品质越高，推荐使用更好的道具
  const qualityIndex = ['wild', 'baby', 'variant', 'divine'].indexOf(quality);
  const targetIndex = Math.min(qualityIndex + 1, usableItems.length - 1);

  // 按加成排序
  usableItems.sort((a, b) => a.bonusRate - b.bonusRate);

  return usableItems[targetIndex];
}

/**
 * 执行捕获判定
 * @param captureRate 捕获率
 * @param prng 随机数生成函数
 */
export function rollCapture(
  captureRate: number,
  prng: () => number = Math.random
): boolean {
  return prng() < captureRate;
}

/**
 * 获取捕获道具
 */
export function getCaptureItem(itemId: string): CaptureItem | undefined {
  return CAPTURE_ITEMS_MAP[itemId];
}

/**
 * 获取所有捕获道具
 */
export function getAllCaptureItems(): CaptureItem[] {
  return [...CAPTURE_ITEMS];
}
