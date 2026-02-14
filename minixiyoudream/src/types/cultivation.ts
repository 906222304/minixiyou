// 修炼系统类型定义

/** 修炼类型 - 对应5种基础属性 */
export type CultivationType = 'strength' | 'intelligence' | 'vitality' | 'agility' | 'willpower';

/** 修炼类型配置 */
export interface CultivationTypeConfig {
  type: CultivationType;
  name: string;
  icon: string;
  description: string;
  targetStat: string;
}

/** 单项修炼进度 */
export interface CultivationProgress {
  /** 当前等级 */
  level: number;
  /** 当前经验 */
  exp: number;
  /** 升级所需经验 */
  expToNext: number;
  /** 提供的属性加成 */
  bonus: number;
}

/** 境界突破记录 */
export interface BreakthroughRecord {
  /** 突破时间 */
  timestamp: number;
  /** 突破前境界 */
  fromRealm: number;
  /** 突破后境界 */
  toRealm: number;
  /** 是否成功 */
  success: boolean;
}

/** 玩家修炼数据 */
export interface CultivationData {
  /** 当前境界 */
  realm: number;
  /** 境界名称 */
  realmName: string;
  /** 累计修炼点数 */
  totalCultivation: number;
  /** 各项修炼进度 */
  cultivations: {
    strength: CultivationProgress;
    intelligence: CultivationProgress;
    vitality: CultivationProgress;
    agility: CultivationProgress;
    willpower: CultivationProgress;
  };
  /** 突破历史记录 */
  breakthroughHistory: BreakthroughRecord[];
  /** 最后修炼时间 */
  lastCultivateTime: number;
}

/** 升级结果 */
export interface LevelUpResult {
  /** 是否升级 */
  leveledUp: boolean;
  /** 旧等级 */
  oldLevel: number;
  /** 新等级 */
  newLevel: number;
  /** 获得的属性加成 */
  bonusGained: number;
}

/** 突破结果 */
export interface BreakthroughResult {
  /** 是否成功 */
  success: boolean;
  /** 突破前境界 */
  fromRealm: number;
  /** 突破后境界 */
  toRealm: number;
  /** 突破后境界名称 */
  newRealmName: string;
  /** 失败原因（如果失败） */
  reason?: string;
  /** 获得的奖励描述 */
  rewards?: string[];
}

/** 境界配置 */
export interface RealmConfig {
  /** 境界等级 */
  level: number;
  /** 境界名称 */
  name: string;
  /** 境界描述 */
  description: string;
  /** 需要的修炼总等级 */
  requiredTotalLevel: number;
  /** 需要的物品ID */
  requiredItem?: string;
  /** 突破成功率基础值 */
  baseSuccessRate: number;
  /** 境界加成倍率 */
  bonusMultiplier: number;
  /** 境界特效 */
  effect?: string;
}

/** 修炼丹药配置 */
export interface CultivationPill {
  /** 物品ID */
  itemId: string;
  /** 名称 */
  name: string;
  /** 增加的经验值 */
  expBonus: number;
  /** 增加的修炼类型（不填则任意类型） */
  targetType?: CultivationType;
  /** 是否有使用冷却 */
  cooldown?: number;
}

/** 修炼加成汇总 */
export interface CultivationBonus {
  /** 力量加成 */
  strength: number;
  /** 灵力加成 */
  intelligence: number;
  /** 体质加成 */
  vitality: number;
  /** 敏捷加成 */
  agility: number;
  /** 魔力加成 */
  willpower: number;
  /** 境界加成倍率 */
  realmMultiplier: number;
}

/** 创建默认修炼数据 */
export function createDefaultCultivationData(): CultivationData {
  const createProgress = (): CultivationProgress => ({
    level: 1,
    exp: 0,
    expToNext: 100,
    bonus: 0,
  });

  return {
    realm: 1,
    realmName: '练气期',
    totalCultivation: 0,
    cultivations: {
      strength: createProgress(),
      intelligence: createProgress(),
      vitality: createProgress(),
      agility: createProgress(),
      willpower: createProgress(),
    },
    breakthroughHistory: [],
    lastCultivateTime: Date.now(),
  };
}

/** 获取修炼类型的中文名称 */
export function getCultivationTypeName(type: CultivationType): string {
  const names: Record<CultivationType, string> = {
    strength: '力量修炼',
    intelligence: '灵力修炼',
    vitality: '体质修炼',
    agility: '敏捷修炼',
    willpower: '魔力修炼',
  };
  return names[type];
}

/** 获取修炼类型的图标 */
export function getCultivationTypeIcon(type: CultivationType): string {
  const icons: Record<CultivationType, string> = {
    strength: '💪',
    intelligence: '🔮',
    vitality: '❤️',
    agility: '💨',
    willpower: '💙',
  };
  return icons[type];
}
