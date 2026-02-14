// Dexie IndexedDB 数据库配置

import Dexie, { type Table } from 'dexie';
import type { Player } from '@/types';
import type { Item, Equipment, EquipmentSlots } from '@/types';
import type { AffixLockState } from '@/types/affix';
import type { Pet } from '@/types';
import type { Companion } from '@/types';
import type { PlayerAchievement, PlayerTitle, AchievementTracker } from '@/types/achievement';
import type { DungeonProgress } from '@/types/dungeon';

/** 存档数据结构 */
export interface SaveData {
  /** 自增主键 */
  id?: number;
  /** 存档名称 */
  name: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 更新时间戳 */
  updatedAt: number;
  /** 存档版本号（用于数据迁移） */
  version: number;
  /** 游戏数据 */
  data: {
    player: Player | null;
    inventory: {
      items: Item[];
      equipments: Equipment[];
      equippedSlots: EquipmentSlots;
      /** 词条锁定状态 - 修复: 使用正确的 AffixLockState 类型 */
      affixLockStates?: AffixLockState[];
    };
    pets: Pet[];
    companions: Companion[];
    gameProgress: {
      currentMapId: string;
      playTime: number;
      lastAutoSaveTime: number;
    };
  };
}

/** 自动存档数据结构 */
export interface AutoSaveData {
  id?: number;
  type: 'auto';
  createdAt: number;
  updatedAt: number;
  version: number;
  data: SaveData['data'];
}

/** 成就数据存储结构 */
export interface AchievementData {
  /** 自增主键 */
  id?: number;
  /** 玩家ID */
  playerId: string;
  /** 玩家成就列表 */
  achievements: PlayerAchievement[];
  /** 玩家称号列表 */
  titles: PlayerTitle[];
  /** 当前激活的称号ID */
  activeTitleId: string | null;
  /** 成就追踪数据 */
  tracker: AchievementTracker;
  /** 累计成就点数 */
  totalPoints: number;
  /** 更新时间戳 */
  updatedAt: number;
}

/** 副本数据存储结构 */
export interface DungeonData {
  /** 自增主键 */
  id?: number;
  /** 玩家ID */
  playerId: string;
  /** 副本进度列表 */
  progress: DungeonProgress[];
  /** 更新时间戳 */
  updatedAt: number;
}

/** 游戏数据库类 */
class GameDatabase extends Dexie {
  /** 存档表 */
  saves!: Table<SaveData>;
  /** 自动存档表 */
  autoSaves!: Table<AutoSaveData>;
  /** 成就数据表 */
  achievements!: Table<AchievementData>;
  /** 副本数据表 */
  dungeonProgress!: Table<DungeonData>;

  constructor() {
    super('MiniXiyouDream');

    this.version(3).stores({
      saves: '++id, name, updatedAt, createdAt',
      autoSaves: '++id, type, updatedAt',
      achievements: '++id, playerId, updatedAt',
      dungeonProgress: '++id, playerId, updatedAt',
    });
  }
}

/** 数据库单例实例 */
export const db = new GameDatabase();

/** 当前存档版本 */
export const SAVE_VERSION = 1;

/** 最大存档数量 */
export const MAX_SAVE_SLOTS = 5;
