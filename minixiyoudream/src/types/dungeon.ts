// 副本类型定义

import type { UUID, ExpReward, ItemDrop } from './common';

/** 副本类型 */
export type DungeonType =
  | 'normal'    // 普通副本
  | 'elite'     // 精英副本
  | 'raid'      // 团队副本
  | 'tower';    // 爬塔

/** 副本难度 */
export type DungeonDifficulty = 'easy' | 'normal' | 'hard' | 'hell';

/** 副本层数配置 */
export interface DungeonFloor {
  id: string;
  floorNumber: number;
  name: string;
  description: string;

  // 敌人配置
  enemyGroups: {
    id: string;
    enemyIds: string[];
    formation: string;
  }[];

  // 事件
  events: {
    type: 'battle' | 'treasure' | 'story' | 'rest';
    probability: number;
    data: Record<string, unknown>;
  }[];

  // Boss
  bossId?: string;
}

/** 副本配置 */
export interface Dungeon {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 类型
  type: DungeonType;

  // 难度设置
  difficulties: {
    difficulty: DungeonDifficulty;
    enemyMultiplier: number;  // 敌人属性倍率
    rewardMultiplier: number; // 奖励倍率
    recommendedLevel: number;
    recommendedPower: number;
  }[];

  // 层数
  floors: DungeonFloor[];

  // 入场条件
  requirements: {
    minLevel: number;
    requiredItems?: string[];
    requiredQuest?: string;
  };

  // 重置时间（小时）
  resetTime: number;

  // 每日/每周限制
  dailyLimit?: number;
  weeklyLimit?: number;

  // 基础奖励
  baseRewards: ExpReward;

  // 掉落池
  dropPool: {
    itemId: string;
    rate: number;
    minCount: number;
    maxCount: number;
    floorRestriction?: number[];
  }[];

  // 首通奖励
  firstClearReward: ExpReward & { items: ItemDrop[] };
}

/** 副本进度 */
export interface DungeonProgress {
  dungeonId: string;
  difficulty: DungeonDifficulty;

  // 当前层数
  currentFloor: number;

  // 已完成层数
  completedFloors: number[];

  // 首通记录
  firstClears: {
    difficulty: DungeonDifficulty;
    clearedAt: number;
  }[];

  // 今日/本周次数
  todayRuns: number;
  weekRuns: number;

  // 重置时间
  lastReset: number;
}

/** 副本结算 */
export interface DungeonResult {
  success: boolean;
  dungeonId: string;
  difficulty: DungeonDifficulty;
  floorsCleared: number;

  // 统计
  stats: {
    totalRounds: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    enemiesDefeated: number;
    timeSpent: number;
  };

  // 奖励
  rewards: {
    exp: number;
    gold: number;
    items: ItemDrop[];
    isFirstClear: boolean;
  };
}
