/**
 * 迁移数据统一导出
 * 从 xiyou 目录迁移的所有游戏数据
 */

// 类型导出
export * from '../../types/xiyou';

// 工具函数导出
export * from '../../utils/migrationUtils';

// 物品数据
export {
  MIGRATED_ITEMS,
  ITEM_ID_MAPPING,
  ITEMS_BY_TYPE,
  ITEMS_BY_RARITY,
  TOTAL_ITEMS,
} from './items';

// 装备数据
export {
  MIGRATED_EQUIPMENT,
  EQUIPMENT_ID_MAPPING,
  EQUIPMENT_BY_SLOT,
  EQUIPMENT_BY_RARITY,
  TOTAL_EQUIPMENT,
} from './equipment';

// 宠物数据
export {
  MIGRATED_PETS,
  PET_ID_MAPPING,
  PETS_BY_RARITY,
  TOTAL_PETS,
} from './pets';

// 副本数据
export {
  MIGRATED_DUNGEONS,
  DUNGEON_ID_MAPPING,
  INSTANCE_TO_DUNGEON,
  TOTAL_DUNGEONS,
  TOTAL_INSTANCES,
} from './dungeons';

// 掉落表数据
export {
  MIGRATED_DROPS,
  DROPS_BY_INSTANCE_ID,
  TOTAL_DROP_TABLES,
  DROPS_WITH_ITEMS,
  DROPS_WITH_REWARDS,
} from './drops';

// 地图数据
export {
  MIGRATED_MAPS,
  MAP_NAME_MAPPING,
  MAP_ID_BY_FILENAME,
  TOTAL_MAPS,
} from './maps';

// 经验表数据
export {
  MIGRATED_EXP_TABLE,
  getExpRequired,
  getTotalExp,
  getLevelFromExp,
  MAX_LEVEL,
  TOTAL_EXP_TO_MAX,
} from './expTable';

// ============== 数据汇总 ==============

/** 迁移数据统计 */
export const MIGRATION_STATS = {
  items: {
    total: 1018,
    exported: 1018,
    source: 'xiyou/assets/data/config/items.json',
  },
  equipment: {
    total: 661,
    exported: 661,
    source: 'xiyou/assets/data/config/equipment.json',
  },
  pets: {
    total: 15,
    exported: 15,
    source: 'xiyou/assets/data/config/pets.json',
  },
  dungeons: {
    total: 18,
    instances: 72,  // 18 x 4
    exported: 18,
    source: 'xiyou/assets/data/config/dungeons.json',
  },
  drops: {
    total: 16,
    exported: 16,
    source: 'xiyou/assets/data/config/drops.json',
  },
  maps: {
    total: 95,
    exported: 95,
    source: 'xiyou/assets/data/config/map_info.json',
  },
  expTable: {
    total: 100,
    exported: 100,
    source: 'xiyou/assets/data/config/exp_table.json',
  },
};

/** 迁移完成状态 */
export const MIGRATION_STATUS = {
  items: 'complete',
  equipment: 'complete',
  pets: 'complete',
  dungeons: 'complete',
  drops: 'complete',
  maps: 'complete',
  expTable: 'complete',
};

/** 总数据量 */
export const TOTAL_MIGRATED_RECORDS = Object.values(MIGRATION_STATS).reduce(
  (sum, stat) => sum + stat.total,
  0
);
