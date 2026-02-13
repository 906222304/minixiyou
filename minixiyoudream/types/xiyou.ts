/**
 * xiyou 原始数据类型定义
 * 用于从 PHP 项目迁移数据到 TypeScript 项目
 */

// ============== 原始数据类型 ==============

/** xiyou 物品类型 */
export interface XiyouItem {
  id: number;
  name: string;
  description: string;
  beanPrice?: number;    // 仙豆价格 (充值货币)
  price?: number;        // 游戏币价格
  level?: number;        // 使用等级要求
  weight?: number;       // 物品重量
  isBound?: number;      // 是否绑定 (0/1)
  category?: number;     // 物品分类
  sellPrice?: number;    // 出售价格
}

/** xiyou 装备类型 */
export interface XiyouEquipment {
  id: number;
  name: string;
  description: string;
  hp?: number;
  attack?: number;
  magicAttack?: number;
  defense?: number;
  iceAttack?: number;
  fireAttack?: number;
  thunderAttack?: number;
  iceDefense?: number;
  fireDefense?: number;
  thunderDefense?: number;
  level?: number;        // 装备等级要求
  weight?: number;
  isBound?: number;
  price?: number;
  isEquipped?: number;
  faction?: number;      // 门派限制 (1-6)
  category?: number;     // 装备部位 (3-8)
}

/** xiyou 宠物类型 */
export interface XiyouPet {
  id: number;
  name: string;
  level?: number;
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
  attack?: number;
  magicAttack?: number;
  defense?: number;
  magicDefense?: number;
  iceAttack?: number;
  fireAttack?: number;
  thunderAttack?: number;
  iceDefense?: number;
  fireDefense?: number;
  thunderDefense?: number;
  starLevel?: number;
  isActive?: number;
}

/** xiyou 副本实例 */
export interface XiyouDungeonInstance {
  index: number;    // 难度索引 (1-4)
  id: number;       // 副本实例ID
}

/** xiyou 副本类型 */
export interface XiyouDungeon {
  id: number;
  name: string;              // 副本名称缩写
  fileName: string;          // 对应的 PHP 文件名
  variable: string;          // PHP 变量名
  instances: XiyouDungeonInstance[];
}

/** xiyou 掉落物品 */
export interface XiyouDropItem {
  itemId: number;
  itemName: string;
  dropRate: number;      // 掉落率 (百分比)
  minCount: number;
  maxCount: number;
  condition: string | null;
}

/** xiyou 掉落来源 */
export interface XiyouDropSource {
  sourceId: number;
  sourceType: string;
  sourceName: string;
  difficulty: string;
  difficultyIndex: number;
  drops: XiyouDropItem[];
}

/** xiyou 通关奖励 */
export interface XiyouCompletionReward {
  sourceId: number;
  sourceType: string;
  sourceName: string;
  difficulty: string;
  difficultyIndex: number;
  rewards: {
    experience: number;
    silver: number;
    items: Array<{
      itemId: number;
      itemName: string;
      count: number;
    }>;
  };
}

/** xiyou 掉落配置 */
export interface XiyouDrops {
  drops: XiyouDropSource[];
  completionRewards: XiyouCompletionReward[];
}

/** xiyou 地图信息 */
export interface XiyouMapInfo {
  totalMaps: number;
  mapFiles: string[];
  connectionTemplate?: {
    description: string;
    directions: {
      up: string;
      down: string;
      left: string;
      right: string;
    };
    notes: string;
  };
}

/** xiyou 经验等级 */
export interface XiyouExpLevel {
  level: number;
  expRequired: number;
  totalExp: number;
  expFromPrevious: number;
  xiulianRequired?: number;
  xiulianTotal?: number;
}

/** xiyou 经验表 */
export interface XiyouExpTable {
  meta: {
    version: string;
    description: string;
    maxLevel: number;
    createdAt: string;
    curveType: string;
    formula?: string;
    source?: string;
  };
  formulas?: {
    normal: {
      name: string;
      formula: string;
      phpCode?: string;
      description: string;
    };
    xiulian: {
      name: string;
      formula: string;
      phpCode?: string;
      description: string;
    };
  };
  levels: XiyouExpLevel[];
}

// ============== 迁移后数据类型 ==============

/** 稀有度类型 */
export type MigratedRarity = '普通' | '稀有' | '传说' | '仙品';

/** 物品类型 */
export type MigratedItemType = '消耗品' | '材料' | '任务物品' | '宝石';

/** 装备槽位 */
export type MigratedEquipmentSlot =
  | '武器'
  | '头部'
  | '肩部'
  | '胸部'
  | '手套'
  | '腿部'
  | '鞋子'
  | '饰品'
  | '戒指';

/** 迁移后的物品属性 */
export interface MigratedItemEffect {
  hp?: number;
  attack?: number;
  defense?: number;
  spirit?: number;
  physique?: number;
  speed?: number;
}

/** 迁移后的物品 */
export interface MigratedItem {
  id: string;                    // 字符串ID: 'xiyou-item-0001'
  originalId: number;            // 原始数字ID
  name: string;
  description: string;
  type: MigratedItemType;
  rarity: MigratedRarity;
  price: number;
  level?: number;
  effect?: MigratedItemEffect;
  quantity?: number;
}

/** 迁移后的装备 */
export interface MigratedEquipment {
  id: string;
  originalId: number;
  name: string;
  description: string;
  rarity: MigratedRarity;
  level: number;
  equipmentSlot: MigratedEquipmentSlot;
  faction?: number;              // 保留门派信息
  price: number;
  effect: MigratedItemEffect;
}

/** 迁移后的宠物 */
export interface MigratedPet {
  id: string;
  originalId: number;
  name: string;
  rarity: MigratedRarity;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  starLevel?: number;
}

/** 迁移后的副本 */
export interface MigratedDungeon {
  id: string;
  originalId: number;
  name: string;
  fullName: string;
  difficulties: Array<{
    index: number;
    instanceId: number;
    name: string;
  }>;
}

/** 迁移后的掉落表 */
export interface MigratedDropTable {
  sourceId: number;
  sourceName: string;
  difficulty: string;
  drops: Array<{
    itemId: string;
    itemName: string;
    originalItemId: number;
    dropRate: number;
    minCount: number;
    maxCount: number;
  }>;
  completionReward?: {
    experience: number;
    silver: number;
    items: Array<{
      itemId: string;
      itemName: string;
      count: number;
    }>;
  };
}

/** 迁移后的经验表 */
export interface MigratedExpTable {
  curveType: string;
  levels: Array<{
    level: number;
    expRequired: number;
    totalExp: number;
  }>;
}

// ============== 迁移配置类型 ==============

/** 迁移配置 */
export interface MigrationConfig {
  idPrefix: string;
  inferRarity: boolean;
  preserveOriginalId: boolean;
  mapElementToPhysical: boolean;
  scalingFactors: {
    attack: number;
    defense: number;
    hp: number;
    price: number;
  };
}

/** 迁移结果 */
export interface MigrationResult<T> {
  data: T[];
  mapping: Record<number, string>;   // oldId -> newId
  warnings: string[];
  stats: {
    total: number;
    success: number;
    skipped: number;
  };
}

// ============== 常量 ==============

/** 物品分类映射 */
export const XIYOU_ITEM_CATEGORIES: Record<number, string> = {
  1: '消耗品',
  2: '宝石',
  3: '武器',
  4: '其他',
  5: '头部',
  6: '鞋子',
  7: '项链',
  8: '手镯',
};

/** 装备部位映射 */
export const XIYOU_EQUIPMENT_SLOTS: Record<number, MigratedEquipmentSlot> = {
  3: '武器',
  5: '头部',
  6: '鞋子',
  7: '饰品',
  8: '戒指',
};

/** 门派映射 */
export const XIYOU_FACTIONS: Record<number, string> = {
  1: '将军府',
  2: '龙宫',
  3: '方寸山',
  4: '普陀山',
  5: '月宫',
  6: '通用',
};

/** 副本难度映射 */
export const XIYOU_DIFFICULTIES: Record<number, string> = {
  1: '普通',
  2: '困难',
  3: '梦魇',
  4: '地狱',
};

/** 副本名称映射 */
export const XIYOU_DUNGEON_NAMES: Record<string, string> = {
  bglm: '白骨陵墓',
  bjd: '芭蕉洞',
  bjt: '冰晶塔',
  byd: '白云洞',
  byzzl: '白云庄之路',
  jdd: '解刀洞',
  lhd: '龙虎洞',
  ljl: '龙脊岭',
  psd: '菩提寺',
  sld: '水帘洞',
  std: '狮驼岭',
  ttsf: '通天水府',
  wdd: '无底洞',
  wsc: '五庄观',
  xlys: '西梁玉山',
  yc: '银川',
  yld: '月亮洞',
  zyt: '镇妖塔',
};
