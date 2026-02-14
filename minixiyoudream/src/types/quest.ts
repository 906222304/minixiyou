// 任务系统类型定义

/** 任务类型 */
export type QuestType = 'main' | 'side' | 'daily';

/** 任务状态 */
export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';

/** 任务条件类型 */
export type QuestConditionType =
  | 'kill'        // 击杀怪物
  | 'collect'     // 收集物品
  | 'talk'        // 与NPC对话
  | 'reach'       // 到达地点
  | 'equip'       // 装备物品
  | 'level'       // 达到等级
  | 'battle'      // 完成战斗
  | 'visit_map'   // 访问地图
  | 'capture'     // 捕捉宠物
  | 'dungeon'     // 完成副本
  | 'skill_use'   // 使用技能
  | 'enhance'     // 强化装备
  | 'arena'       // 竞技场挑战
  | 'gift'        // 赠送礼物
  | 'fish';       // 钓鱼

/** 任务条件 */
export interface QuestCondition {
  /** 条件类型 */
  type: QuestConditionType;
  /** 目标ID（怪物ID、物品ID、NPC ID、地图ID等） */
  target: string;
  /** 需要的数量 */
  required: number;
  /** 当前进度 */
  current?: number;
  /** 条件描述 */
  description: string;
}

/** 任务奖励 */
export interface QuestReward {
  /** 金币奖励 */
  gold?: number;
  /** 经验奖励 */
  exp?: number;
  /** 物品奖励 */
  items?: Array<{
    itemId: string;
    count: number;
  }>;
  /** 装备奖励 */
  equipments?: Array<{
    equipmentId: string;
    count: number;
  }>;
  /** 解锁内容 */
  unlocks?: {
    maps?: string[];
    features?: string[];
    npcs?: string[];
  };
}

/** 对话行 */
export interface DialogLine {
  /** 说话者名称 */
  speaker: string;
  /** 对话内容 */
  text: string;
  /** 立绘/头像 */
  portrait?: string;
  /** 说话者位置（左/右） */
  position?: 'left' | 'right';
  /** 是否有特效 */
  effect?: 'shake' | 'flash' | 'none';
}

/** 任务章节信息 */
export interface QuestChapter {
  /** 章节ID */
  id: number;
  /** 章节名称 */
  name: string;
  /** 章节描述 */
  description: string;
  /** 章节图标 */
  icon: string;
  /** 包含的任务ID列表 */
  questIds: string[];
}

/** 任务定义 */
export interface Quest {
  /** 任务ID */
  id: string;
  /** 任务名称 */
  name: string;
  /** 任务描述 */
  description: string;
  /** 任务类型 */
  type: QuestType;
  /** 章节（主线任务专用） */
  chapter?: number;
  /** 任务图标 */
  icon: string;
  /** 任务等级要求 */
  levelRequired?: number;

  /** 任务条件 */
  conditions: QuestCondition[];

  /** 任务奖励 */
  rewards: QuestReward;

  /** 前置任务ID */
  prerequisites?: string[];

  /** 开始对话 */
  startDialog?: DialogLine[];
  /** 完成对话 */
  completeDialog?: DialogLine[];
  /** 进行中对话（可选） */
  progressDialog?: DialogLine[];

  /** 任务提示 */
  hints?: string[];

  /** 任务位置 */
  location?: {
    mapId: string;
    npcId?: string;
  };

  /** 自动接取 */
  autoAccept?: boolean;

  /** 排序权重 */
  order?: number;
}

/** 玩家任务数据 */
export interface PlayerQuest {
  /** 任务ID */
  questId: string;
  /** 任务状态 */
  status: QuestStatus;
  /** 接取时间 */
  acceptedAt?: number;
  /** 完成时间 */
  completedAt?: number;
  /** 领取奖励时间 */
  claimedAt?: number;
  /** 条件进度 */
  conditionProgress: Record<string, number>;
}

/** 任务进度信息 */
export interface QuestProgressInfo {
  /** 任务定义 */
  quest: Quest;
  /** 玩家任务数据 */
  playerData: PlayerQuest;
  /** 整体完成进度 (0-100) */
  progressPercent: number;
  /** 是否可以领取奖励 */
  canClaim: boolean;
  /** 是否可以接取 */
  canAccept: boolean;
  /** 是否显示详情 */
  showDetails: boolean;
  /** 条件进度详情 */
  conditionDetails: Array<{
    condition: QuestCondition;
    current: number;
    required: number;
    completed: boolean;
  }>;
}

/** 任务统计 */
export interface QuestStats {
  /** 总任务数 */
  totalQuests: number;
  /** 已完成任务数 */
  completedQuests: number;
  /** 进行中任务数 */
  inProgressQuests: number;
  /** 可接取任务数 */
  availableQuests: number;
  /** 主线进度 */
  mainStoryProgress: {
    chapter: number;
    chapterName: string;
    completedInChapter: number;
    totalInChapter: number;
  };
  /** 今日日常完成数 */
  dailyCompletedToday: number;
  /** 今日日常总数 */
  dailyTotal: number;
}

/** 任务事件类型 */
export type QuestEventType =
  | 'monster_killed'
  | 'item_collected'
  | 'npc_talked'
  | 'map_reached'
  | 'item_equipped'
  | 'level_reached'
  | 'battle_won';

/** 任务事件 */
export interface QuestEvent {
  /** 事件类型 */
  type: QuestEventType;
  /** 目标ID */
  targetId: string;
  /** 数量 */
  count?: number;
  /** 额外数据 */
  data?: Record<string, unknown>;
}

/** 任务追踪器数据 */
export interface QuestTracker {
  // 击杀追踪
  monstersKilled: Record<string, number>;

  // 收集追踪
  itemsCollected: Record<string, number>;

  // NPC对话追踪
  npcsTalked: string[];

  // 地图访问追踪
  mapsVisited: string[];

  // 装备追踪
  equipmentsObtained: string[];

  // 战斗胜利追踪
  battlesWon: Record<string, number>;

  // 副本完成追踪
  dungeonsCompleted: Record<string, number>;

  // 技能使用追踪
  skillsUsed: Record<string, number>;

  // 装备强化追踪
  equipmentsEnhanced: number;

  // 竞技场挑战追踪
  arenaBattles: number;

  // 礼物赠送追踪
  giftsGiven: number;

  // 钓鱼追踪
  fishCaught: number;

  // 日常任务追踪
  dailyQuestsCompletedToday: string[];
  lastDailyReset: number;
}
