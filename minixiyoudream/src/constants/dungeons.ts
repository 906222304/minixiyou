// 副本配置数据（MVP 1个副本）

import type { Dungeon } from '@/types';

/** 副本配置列表 */
export const DUNGEONS: Record<string, Dungeon> = {
  dungeon_east_sea: {
    id: 'dungeon_east_sea',
    name: '东海龙宫',
    description: '传说中东海龙王的宫殿，藏有无数珍宝。',
    icon: '🐉',
    type: 'normal',
    difficulties: [
      {
        difficulty: 'easy',
        enemyMultiplier: 1.0,
        rewardMultiplier: 1.0,
        recommendedLevel: 8,
        recommendedPower: 500,
      },
      {
        difficulty: 'normal',
        enemyMultiplier: 1.3,
        rewardMultiplier: 1.5,
        recommendedLevel: 12,
        recommendedPower: 800,
      },
    ],
    floors: [
      {
        id: 'floor_1',
        floorNumber: 1,
        name: '龙宫大门',
        description: '东海龙宫的入口处',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_shrimp', 'enemy_shrimp', 'enemy_shrimp'], formation: 'line' },
          { id: 'group_2', enemyIds: ['enemy_shrimp', 'enemy_crab', 'enemy_shrimp'], formation: 'triangle' },
        ],
        events: [
          { type: 'treasure', probability: 0.2, data: { treasureId: 'chest_small' } },
        ],
      },
      {
        id: 'floor_2',
        floorNumber: 2,
        name: '珊瑚宫殿',
        description: '美丽的珊瑚宫殿，住着虾兵蟹将',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_crab', 'enemy_crab', 'enemy_shrimp'], formation: 'triangle' },
          { id: 'group_2', enemyIds: ['enemy_turtle_guard', 'enemy_crab', 'enemy_crab'], formation: 'line' },
        ],
        events: [
          { type: 'battle', probability: 0.3, data: { enemyGroupId: 'elite_group' } },
          { type: 'rest', probability: 0.1, data: { healPercent: 30 } },
        ],
      },
      {
        id: 'floor_3',
        floorNumber: 3,
        name: '龙王宝殿',
        description: '东海龙王的主殿',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_turtle_guard', 'enemy_turtle_guard'], formation: 'line' },
        ],
        events: [],
        bossId: 'boss_dragon_prince',
      },
    ],
    requirements: {
      minLevel: 8,
    },
    resetTime: 24,
    dailyLimit: 3,
    baseRewards: {
      exp: 200,
      gold: 150,
    },
    dropPool: [
      { itemId: 'item_dragon_scale', rate: 0.1, minCount: 1, maxCount: 2 },
      { itemId: 'item_pearl', rate: 0.2, minCount: 1, maxCount: 3 },
      { itemId: 'equip_water_staff', rate: 0.02, minCount: 1, maxCount: 1 },
    ],
    firstClearReward: {
      exp: 500,
      gold: 500,
      items: [{ itemId: 'item_dragon_pearl', count: 1 }],
    },
  },
};

/** 获取副本配置 */
export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS[id];
}

/** 获取所有副本列表 */
export function getAllDungeons(): Dungeon[] {
  return Object.values(DUNGEONS);
}
