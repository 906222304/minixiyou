// 成就系统类型定义

/** 成就类别 */
export type AchievementCategory = 'growth' | 'combat' | 'collection' | 'explore' | 'social';

/** 成就条件类型 */
export type AchievementConditionType =
  // 成长类
  | 'reach_level' // 达到等级
  | 'reach_realm' // 达到境界
  | 'accumulate_playtime' // 累计游戏时长
  | 'accumulate_gold' // 累计获得金币
  | 'accumulate_exp' // 累计获得经验
  // 战斗类
  | 'defeat_monsters' // 击败怪物数量
  | 'defeat_bosses' // 击败Boss数量
  | 'clear_dungeon' // 通关副本
  | 'clear_dungeon_no_damage' // 无伤通关副本
  | 'win_pvp_battles' // PVP胜利次数
  | 'total_damage_dealt' // 累计造成伤害
  | 'win_battles' // 战斗胜利次数
  // 收集类
  | 'collect_equipment' // 收集装备数量
  | 'collect_legendary' // 收集传说装备
  | 'collect_mythic' // 收集神话装备
  | 'collect_pets' // 收集宠物
  | 'collect_companions' // 收集伙伴
  | 'collect_items' // 收集物品
  // 探索类
  | 'explore_maps' // 探索地图数量
  | 'discover_secrets' // 发现秘密
  | 'unlock_teleports' // 解锁传送点
  | 'visit_all_maps' // 访问所有地图
  // 社交类
  | 'max_favorability' // 好感度达到满级
  | 'unlock_bonds' // 解锁羁绊数量
  | 'max_bond_level' // 羁绊达到满级;

/** 成就条件 */
export interface AchievementCondition {
  /** 条件类型 */
  type: AchievementConditionType;
  /** 目标数值 */
  target: number;
  /** 当前进度 */
  progress?: number;
  /** 额外参数（如特定地图ID、副本ID等） */
  params?: Record<string, string | number | boolean>;
}

/** 成就奖励 */
export interface AchievementReward {
  /** 金币奖励 */
  gold?: number;
  /** 经验奖励 */
  exp?: number;
  /** 称号ID */
  titleId?: string;
  /** 物品奖励 */
  items?: Array<{
    itemId: string;
    count: number;
  }>;
  /** 属性加成 */
  statBonus?: Record<string, number>;
}

/** 成就定义 */
export interface Achievement {
  /** 成就ID */
  id: string;
  /** 成就名称 */
  name: string;
  /** 成就描述 */
  description: string;
  /** 成就类别 */
  category: AchievementCategory;
  /** 成就图标（emoji） */
  icon: string;
  /** 成就点数 */
  points: number;
  /** 成就条件 */
  condition: AchievementCondition;
  /** 成就奖励 */
  reward?: AchievementReward;
  /** 是否为隐藏成就（完成前不显示详情） */
  hidden?: boolean;
  /** 前置成就ID（可选） */
  prerequisiteId?: string;
  /** 排序权重 */
  order?: number;
}

/** 玩家成就数据 */
export interface PlayerAchievement {
  /** 成就ID */
  achievementId: string;
  /** 是否已解锁 */
  unlocked: boolean;
  /** 解锁时间戳 */
  unlockedAt?: number;
  /** 是否已领取奖励 */
  claimed: boolean;
  /** 领取奖励时间戳 */
  claimedAt?: number;
  /** 当前进度 */
  progress: number;
}

/** 成就进度信息 */
export interface AchievementProgressInfo {
  /** 成就定义 */
  achievement: Achievement;
  /** 玩家成就数据 */
  playerData: PlayerAchievement;
  /** 进度百分比 (0-100) */
  progressPercent: number;
  /** 是否可以领取奖励 */
  canClaim: boolean;
  /** 是否显示详情（非隐藏或已解锁） */
  showDetails: boolean;
}

/** 称号定义 */
export interface Title {
  /** 称号ID */
  id: string;
  /** 称号名称 */
  name: string;
  /** 称号描述 */
  description: string;
  /** 称号图标 */
  icon: string;
  /** 称号颜色 */
  color: string;
  /** 称号属性加成 */
  statBonus?: Record<string, number>;
  /** 获取条件描述 */
  condition: string;
  /** 是否稀有 */
  rare?: boolean;
}

/** 玩家称号数据 */
export interface PlayerTitle {
  /** 称号ID */
  titleId: string;
  /** 获取时间戳 */
  acquiredAt: number;
  /** 是否正在使用 */
  isActive?: boolean;
}

/** 成就统计 */
export interface AchievementStats {
  /** 总成就数 */
  totalAchievements: number;
  /** 已解锁成就数 */
  unlockedAchievements: number;
  /** 已领取奖励数 */
  claimedRewards: number;
  /** 总成就点数 */
  totalPoints: number;
  /** 已获得成就点数 */
  earnedPoints: number;
  /** 各类别进度 */
  categoryProgress: Record<AchievementCategory, {
    total: number;
    unlocked: number;
    points: number;
    earnedPoints: number;
  }>;
}

/** 成就进度追踪数据 */
export interface AchievementTracker {
  // 成长类追踪
  maxLevel: number;
  maxRealm: number;
  totalPlayTime: number;
  totalGoldEarned: number;
  totalExpEarned: number;

  // 战斗类追踪
  monstersKilled: number;
  bossesKilled: number;
  dungeonsCleared: string[]; // 副本ID列表
  noDamageDungeons: string[];
  pvpWins: number;
  totalDamageDealt: number;
  battlesWon: number;

  // 收集类追踪
  equipmentCollected: number;
  legendaryCollected: number;
  mythicCollected: number;
  petsCollected: number;
  companionsCollected: number;
  itemsCollected: number;

  // 探索类追踪
  mapsExplored: string[];
  secretsDiscovered: number;
  teleportsUnlocked: string[];

  // 社交类追踪
  maxFavorabilityCompanions: string[];
  bondsUnlocked: number;
  maxLevelBonds: number;
}

/** 成就事件类型（用于触发成就检查） */
export type AchievementEventType =
  | 'level_up'
  | 'realm_breakthrough'
  | 'monster_killed'
  | 'boss_killed'
  | 'dungeon_cleared'
  | 'equipment_obtained'
  | 'pet_obtained'
  | 'companion_unlocked'
  | 'map_entered'
  | 'teleport_unlocked'
  | 'favorability_increased'
  | 'bond_unlocked'
  | 'gold_earned'
  | 'exp_earned'
  | 'damage_dealt'
  | 'battle_won';

/** 成就事件 */
export interface AchievementEvent {
  /** 事件类型 */
  type: AchievementEventType;
  /** 事件数据 */
  data: Record<string, number | string | boolean>;
  /** 事件时间戳 */
  timestamp: number;
}
