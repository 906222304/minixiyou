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

  // 蜘蛛巢穴
  dungeon_spider_nest: {
    id: 'dungeon_spider_nest',
    name: '蜘蛛巢穴',
    description: '蜘蛛林深处的地下巢穴，蛛后在此称霸。',
    icon: '🕷️',
    type: 'normal',
    difficulties: [
      {
        difficulty: 'easy',
        enemyMultiplier: 1.0,
        rewardMultiplier: 1.0,
        recommendedLevel: 15,
        recommendedPower: 1200,
      },
      {
        difficulty: 'normal',
        enemyMultiplier: 1.3,
        rewardMultiplier: 1.5,
        recommendedLevel: 18,
        recommendedPower: 1800,
      },
      {
        difficulty: 'hard',
        enemyMultiplier: 1.6,
        rewardMultiplier: 2.0,
        recommendedLevel: 22,
        recommendedPower: 2500,
      },
    ],
    floors: [
      {
        id: 'floor_1',
        floorNumber: 1,
        name: '蛛网入口',
        description: '蜘蛛巢穴的入口，蛛网密布。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_spider_small', 'enemy_spider_small', 'enemy_spider_small'], formation: 'line' },
          { id: 'group_2', enemyIds: ['enemy_spider_small', 'enemy_spider_poison', 'enemy_spider_small'], formation: 'triangle' },
        ],
        events: [
          { type: 'treasure', probability: 0.15, data: { treasureId: 'chest_spider_small' } },
        ],
      },
      {
        id: 'floor_2',
        floorNumber: 2,
        name: '毒液迷廊',
        description: '充满毒液的走廊，到处是中毒的冒险者遗骸。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_spider_poison', 'enemy_spider_poison', 'enemy_spider_small'], formation: 'triangle' },
          { id: 'group_2', enemyIds: ['enemy_spider_elite', 'enemy_spider_poison', 'enemy_spider_poison'], formation: 'line' },
        ],
        events: [
          { type: 'battle', probability: 0.25, data: { enemyGroupId: 'elite_spider_group' } },
          { type: 'rest', probability: 0.1, data: { healPercent: 25 } },
        ],
      },
      {
        id: 'floor_3',
        floorNumber: 3,
        name: '蛛后宫殿',
        description: '蛛后的巢穴，无数蜘蛛在此守卫。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_spider_elite', 'enemy_spider_elite'], formation: 'line' },
        ],
        events: [],
        bossId: 'boss_spider_queen',
      },
    ],
    requirements: {
      minLevel: 15,
    },
    resetTime: 24,
    dailyLimit: 3,
    baseRewards: {
      exp: 350,
      gold: 280,
    },
    dropPool: [
      { itemId: 'item_spider_silk', rate: 0.15, minCount: 1, maxCount: 3 },
      { itemId: 'item_poison_gland', rate: 0.1, minCount: 1, maxCount: 2 },
      { itemId: 'equip_spider_ring', rate: 0.02, minCount: 1, maxCount: 1 },
    ],
    firstClearReward: {
      exp: 800,
      gold: 600,
      items: [{ itemId: 'item_spider_queen_gem', count: 1 }],
    },
  },

  // 妖狐洞府
  dungeon_fox_den: {
    id: 'dungeon_fox_den',
    name: '妖狐洞府',
    description: '传说中九尾妖狐的洞府，充满了幻术与诱惑。',
    icon: '🦊',
    type: 'elite',
    difficulties: [
      {
        difficulty: 'normal',
        enemyMultiplier: 1.0,
        rewardMultiplier: 1.0,
        recommendedLevel: 20,
        recommendedPower: 2000,
      },
      {
        difficulty: 'hard',
        enemyMultiplier: 1.4,
        rewardMultiplier: 1.6,
        recommendedLevel: 25,
        recommendedPower: 3000,
      },
      {
        difficulty: 'hell',
        enemyMultiplier: 1.8,
        rewardMultiplier: 2.5,
        recommendedLevel: 30,
        recommendedPower: 4500,
      },
    ],
    floors: [
      {
        id: 'floor_1',
        floorNumber: 1,
        name: '幻境入口',
        description: '充满幻术的入口，真假难辨。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_fox_spirit', 'enemy_fox_spirit', 'enemy_fox_spirit'], formation: 'triangle' },
          { id: 'group_2', enemyIds: ['enemy_fox_spirit', 'enemy_fox_illusion', 'enemy_fox_spirit'], formation: 'line' },
        ],
        events: [
          { type: 'story', probability: 0.2, data: { storyId: 'story_fox_illusion' } },
          { type: 'treasure', probability: 0.1, data: { treasureId: 'chest_fox_small' } },
        ],
      },
      {
        id: 'floor_2',
        floorNumber: 2,
        name: '魅惑迷宫',
        description: '妖狐设下的迷宫，充满魅惑陷阱。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_fox_illusion', 'enemy_fox_illusion', 'enemy_fox_spirit'], formation: 'triangle' },
          { id: 'group_2', enemyIds: ['enemy_fox_elite', 'enemy_fox_illusion', 'enemy_fox_illusion'], formation: 'line' },
        ],
        events: [
          { type: 'battle', probability: 0.3, data: { enemyGroupId: 'elite_fox_group' } },
          { type: 'rest', probability: 0.08, data: { healPercent: 30 } },
        ],
      },
      {
        id: 'floor_3',
        floorNumber: 3,
        name: '九尾殿堂',
        description: '九尾妖狐的主殿，妖气冲天。',
        enemyGroups: [
          { id: 'group_1', enemyIds: ['enemy_fox_elite', 'enemy_fox_elite', 'enemy_fox_illusion'], formation: 'triangle' },
        ],
        events: [],
        bossId: 'boss_nine_tailed_fox',
      },
    ],
    requirements: {
      minLevel: 20,
    },
    resetTime: 48,
    dailyLimit: 2,
    baseRewards: {
      exp: 500,
      gold: 400,
    },
    dropPool: [
      { itemId: 'item_fox_fur', rate: 0.12, minCount: 1, maxCount: 2 },
      { itemId: 'item_illusion_crystal', rate: 0.08, minCount: 1, maxCount: 1 },
      { itemId: 'equip_fox_charm', rate: 0.02, minCount: 1, maxCount: 1 },
      { itemId: 'equip_nine_tails_fan', rate: 0.005, minCount: 1, maxCount: 1 },
    ],
    firstClearReward: {
      exp: 1200,
      gold: 1000,
      items: [{ itemId: 'item_nine_tails_essence', count: 1 }],
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
