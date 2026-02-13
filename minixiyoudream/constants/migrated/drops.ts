/**
 * 掉落表数据 - 从 xiyou/assets/data/config/drops.json 迁移
 * 包含副本掉落和通关奖励
 */

import { MigratedDropTable } from '../../types/xiyou';

/** 迁移后的掉落表数据 */
export const MIGRATED_DROPS: MigratedDropTable[] = [
  // 白骨陵墓 - 普通
  {
    sourceId: 16,
    sourceName: '白骨陵墓',
    difficulty: '普通',
    drops: [
      { itemId: 'xiyou-item-0331', itemName: '百年魔珠', originalItemId: 331, dropRate: 60, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0022', itemName: '红宝石一', originalItemId: 22, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0023', itemName: '红水晶一', originalItemId: 23, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0024', itemName: '蓝宝石一', originalItemId: 24, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0025', itemName: '蓝水晶一', originalItemId: 25, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0026', itemName: '黄宝石一', originalItemId: 26, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0027', itemName: '黄水晶一', originalItemId: 27, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0028', itemName: '金刚石一', originalItemId: 28, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0029', itemName: '佛印石一', originalItemId: 29, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0030', itemName: '玄武石一', originalItemId: 30, dropRate: 20, minCount: 1, maxCount: 1 },
    ],
    completionReward: {
      experience: 2000000,
      silver: 2000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 1 }],
    },
  },
  // 白骨陵墓 - 困难
  {
    sourceId: 17,
    sourceName: '白骨陵墓',
    difficulty: '困难',
    drops: [],
    completionReward: {
      experience: 3000000,
      silver: 3000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 2 }],
    },
  },
  // 白骨陵墓 - 梦魇
  {
    sourceId: 18,
    sourceName: '白骨陵墓',
    difficulty: '梦魇',
    drops: [],
    completionReward: {
      experience: 5000000,
      silver: 5000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 白骨陵墓 - 地狱
  {
    sourceId: 36,
    sourceName: '白骨陵墓',
    difficulty: '地狱',
    drops: [],
    completionReward: {
      experience: 6000000,
      silver: 6000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 冰晶塔 - 普通
  {
    sourceId: 1,
    sourceName: '冰晶塔',
    difficulty: '普通',
    drops: [],
    completionReward: {
      experience: 1000000,
      silver: 1000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 1 }],
    },
  },
  // 冰晶塔 - 困难
  {
    sourceId: 2,
    sourceName: '冰晶塔',
    difficulty: '困难',
    drops: [],
    completionReward: {
      experience: 2000000,
      silver: 2000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 2 }],
    },
  },
  // 冰晶塔 - 梦魇
  {
    sourceId: 3,
    sourceName: '冰晶塔',
    difficulty: '梦魇',
    drops: [],
    completionReward: {
      experience: 4000000,
      silver: 4000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 冰晶塔 - 地狱
  {
    sourceId: 31,
    sourceName: '冰晶塔',
    difficulty: '地狱',
    drops: [],
    completionReward: {
      experience: 5000000,
      silver: 5000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 芭蕉洞 - 普通
  {
    sourceId: 53,
    sourceName: '芭蕉洞',
    difficulty: '普通',
    drops: [
      { itemId: 'xiyou-item-0331', itemName: '百年魔珠', originalItemId: 331, dropRate: 60, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0031', itemName: '红宝石二', originalItemId: 31, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0032', itemName: '红水晶二', originalItemId: 32, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0033', itemName: '蓝宝石二', originalItemId: 33, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0034', itemName: '蓝水晶二', originalItemId: 34, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0035', itemName: '黄宝石二', originalItemId: 35, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0036', itemName: '黄水晶二', originalItemId: 36, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0037', itemName: '金刚石二', originalItemId: 37, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0038', itemName: '佛印石二', originalItemId: 38, dropRate: 20, minCount: 1, maxCount: 1 },
      { itemId: 'xiyou-item-0039', itemName: '玄武石二', originalItemId: 39, dropRate: 20, minCount: 1, maxCount: 1 },
    ],
    completionReward: {
      experience: 10000000,
      silver: 10000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 1 }],
    },
  },
  // 芭蕉洞 - 困难
  {
    sourceId: 54,
    sourceName: '芭蕉洞',
    difficulty: '困难',
    drops: [],
    completionReward: {
      experience: 15000000,
      silver: 15000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 2 }],
    },
  },
  // 芭蕉洞 - 梦魇
  {
    sourceId: 55,
    sourceName: '芭蕉洞',
    difficulty: '梦魇',
    drops: [],
    completionReward: {
      experience: 20000000,
      silver: 25000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 芭蕉洞 - 地狱
  {
    sourceId: 56,
    sourceName: '芭蕉洞',
    difficulty: '地狱',
    drops: [],
    completionReward: {
      experience: 30000000,
      silver: 30000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 4 }],
    },
  },
  // 无底洞 - 普通
  {
    sourceId: 69,
    sourceName: '无底洞',
    difficulty: '普通',
    drops: [],
    completionReward: {
      experience: 200000000,
      silver: 200000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 1 }],
    },
  },
  // 无底洞 - 困难
  {
    sourceId: 70,
    sourceName: '无底洞',
    difficulty: '困难',
    drops: [],
    completionReward: {
      experience: 300000000,
      silver: 300000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 2 }],
    },
  },
  // 无底洞 - 梦魇
  {
    sourceId: 71,
    sourceName: '无底洞',
    difficulty: '梦魇',
    drops: [],
    completionReward: {
      experience: 400000000,
      silver: 400000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 3 }],
    },
  },
  // 无底洞 - 地狱
  {
    sourceId: 72,
    sourceName: '无底洞',
    difficulty: '地狱',
    drops: [],
    completionReward: {
      experience: 500000000,
      silver: 500000000,
      items: [{ itemId: 'xiyou-item-0394', itemName: '英雄牌', count: 4 }],
    },
  },
];

/** 按副本ID索引的掉落表 */
export const DROPS_BY_INSTANCE_ID: Record<number, MigratedDropTable> = Object.fromEntries(
  MIGRATED_DROPS.map((drop) => [drop.sourceId, drop])
);

/** 掉落表总数 */
export const TOTAL_DROP_TABLES = MIGRATED_DROPS.length;

/** 有掉落配置的副本数量 */
export const DROPS_WITH_ITEMS = MIGRATED_DROPS.filter((d) => d.drops.length > 0).length;

/** 有通关奖励的副本数量 */
export const DROPS_WITH_REWARDS = MIGRATED_DROPS.filter((d) => d.completionReward).length;
