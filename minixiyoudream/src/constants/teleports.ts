// 传送点配置数据

/** 传送点配置 */
export interface TeleportPoint {
  id: string;
  name: string;
  mapId: string;
  cost: { gold: number };
  unlocked: boolean;
  requirements?: {
    minLevel?: number;
    requiredQuest?: string;
  };
  description?: string;
  icon?: string;
}

/** 传送点配置列表 */
export const TELEPORT_POINTS: Record<string, TeleportPoint> = {
  // 新手村传送点
  teleport_changan: {
    id: 'teleport_changan',
    name: '长安城',
    mapId: 'map_changan',
    cost: { gold: 0 },
    unlocked: true,
    description: '大唐都城，冒险者的聚集地',
    icon: '🏯',
  },

  teleport_village_1: {
    id: 'teleport_village_1',
    name: '长安郊外',
    mapId: 'map_village_1',
    cost: { gold: 10 },
    unlocked: true,
    requirements: { minLevel: 1 },
    description: '长安城外的郊野地带',
    icon: '🌲',
  },

  teleport_village_2: {
    id: 'teleport_village_2',
    name: '竹林小道',
    mapId: 'map_village_2',
    cost: { gold: 15 },
    unlocked: true,
    requirements: { minLevel: 3 },
    description: '幽静的竹林，适合初级冒险者练级',
    icon: '🎋',
  },

  teleport_village_3: {
    id: 'teleport_village_3',
    name: '清溪流泉',
    mapId: 'map_village_3',
    cost: { gold: 20 },
    unlocked: true,
    requirements: { minLevel: 5 },
    description: '清澈的小溪旁，风景宜人',
    icon: '💧',
  },

  teleport_village_4: {
    id: 'teleport_village_4',
    name: '古树森林',
    mapId: 'map_village_4',
    cost: { gold: 25 },
    unlocked: true,
    requirements: { minLevel: 7 },
    description: '古老的森林，树木参天',
    icon: '🌳',
  },

  teleport_village_5: {
    id: 'teleport_village_5',
    name: '山顶云海',
    mapId: 'map_village_5',
    cost: { gold: 30 },
    unlocked: true,
    requirements: { minLevel: 6 },
    description: '山顶之上，云雾缭绕',
    icon: '⛰️',
  },

  teleport_village_6: {
    id: 'teleport_village_6',
    name: '花果山脚',
    mapId: 'map_village_6',
    cost: { gold: 35 },
    unlocked: true,
    requirements: { minLevel: 8 },
    description: '传说中孙悟空的故乡',
    icon: '🍑',
  },

  teleport_village_7: {
    id: 'teleport_village_7',
    name: '水帘洞外',
    mapId: 'map_village_7',
    cost: { gold: 50 },
    unlocked: true,
    requirements: { minLevel: 10 },
    description: '传说中的水帘洞入口',
    icon: '🌊',
  },

  // 东土大唐传送点
  teleport_datang_capital: {
    id: 'teleport_datang_capital',
    name: '大唐都城',
    mapId: 'map_datang_capital',
    cost: { gold: 100 },
    unlocked: false,
    requirements: { minLevel: 10 },
    description: '大唐帝国的繁华都城',
    icon: '🏛️',
  },

  teleport_datang_east: {
    id: 'teleport_datang_east',
    name: '大唐东郊',
    mapId: 'map_datang_east',
    cost: { gold: 80 },
    unlocked: false,
    requirements: { minLevel: 10 },
    description: '大唐都城以东的郊外地带',
    icon: '🌅',
  },

  teleport_datang_west: {
    id: 'teleport_datang_west',
    name: '大唐西郊',
    mapId: 'map_datang_west',
    cost: { gold: 80 },
    unlocked: false,
    requirements: { minLevel: 10 },
    description: '大唐都城以西的郊外',
    icon: '🌄',
  },

  teleport_datang_north: {
    id: 'teleport_datang_north',
    name: '大唐北郊',
    mapId: 'map_datang_north',
    cost: { gold: 100 },
    unlocked: false,
    requirements: { minLevel: 12 },
    description: '大唐都城以北，群山环绕',
    icon: '🏔️',
  },

  teleport_datang_south: {
    id: 'teleport_datang_south',
    name: '大唐南郊',
    mapId: 'map_datang_south',
    cost: { gold: 90 },
    unlocked: false,
    requirements: { minLevel: 11 },
    description: '大唐都城以南，河流纵横',
    icon: '🌾',
  },

  teleport_fox_valley: {
    id: 'teleport_fox_valley',
    name: '狐狸谷',
    mapId: 'map_fox_valley',
    cost: { gold: 150 },
    unlocked: false,
    requirements: { minLevel: 15 },
    description: '传说中有妖狐出没的山谷',
    icon: '🦊',
  },

  teleport_spider_forest: {
    id: 'teleport_spider_forest',
    name: '蜘蛛林',
    mapId: 'map_spider_forest',
    cost: { gold: 140 },
    unlocked: false,
    requirements: { minLevel: 14 },
    description: '蜘蛛横行的森林',
    icon: '🕸️',
  },

  teleport_bandit_stronghold: {
    id: 'teleport_bandit_stronghold',
    name: '山贼据点',
    mapId: 'map_bandit_stronghold',
    cost: { gold: 180 },
    unlocked: false,
    requirements: { minLevel: 16 },
    description: '山贼盘踞的要塞',
    icon: '🏴',
  },

  teleport_ancient_temple: {
    id: 'teleport_ancient_temple',
    name: '古庙',
    mapId: 'map_ancient_temple',
    cost: { gold: 120 },
    unlocked: false,
    requirements: { minLevel: 13 },
    description: '一座废弃的古庙',
    icon: '⛩️',
  },

  teleport_misty_swamp: {
    id: 'teleport_misty_swamp',
    name: '迷雾沼泽',
    mapId: 'map_misty_swamp',
    cost: { gold: 200 },
    unlocked: false,
    requirements: { minLevel: 17 },
    description: '终年笼罩在迷雾中的沼泽地',
    icon: '🌫️',
  },

  teleport_dragon_pool: {
    id: 'teleport_dragon_pool',
    name: '龙潭',
    mapId: 'map_dragon_pool',
    cost: { gold: 220 },
    unlocked: false,
    requirements: { minLevel: 18 },
    description: '传说中有神龙居住的深潭',
    icon: '🐉',
  },

  teleport_tiger_den: {
    id: 'teleport_tiger_den',
    name: '虎穴',
    mapId: 'map_tiger_den',
    cost: { gold: 180 },
    unlocked: false,
    requirements: { minLevel: 16 },
    description: '猛虎聚居的洞穴',
    icon: '🐯',
  },

  teleport_fairy_peak: {
    id: 'teleport_fairy_peak',
    name: '仙峰',
    mapId: 'map_fairy_peak',
    cost: { gold: 300 },
    unlocked: false,
    requirements: { minLevel: 20 },
    description: '高耸入云的山峰，仙人修炼之所',
    icon: '⛰️',
  },

  teleport_ghost_town: {
    id: 'teleport_ghost_town',
    name: '鬼城',
    mapId: 'map_ghost_town',
    cost: { gold: 250 },
    unlocked: false,
    requirements: { minLevel: 19 },
    description: '一座被诅咒的废弃城池',
    icon: '👻',
  },

  teleport_dungeon_entrance: {
    id: 'teleport_dungeon_entrance',
    name: '副本入口',
    mapId: 'map_dungeon_entrance',
    cost: { gold: 200 },
    unlocked: false,
    requirements: { minLevel: 15 },
    description: '通往各种秘境副本的入口',
    icon: '🚪',
  },
};

/** 获取传送点配置 */
export function getTeleportPoint(id: string): TeleportPoint | undefined {
  return TELEPORT_POINTS[id];
}

/** 获取所有传送点列表 */
export function getAllTeleportPoints(): TeleportPoint[] {
  return Object.values(TELEPORT_POINTS);
}

/** 获取默认解锁的传送点 */
export function getDefaultUnlockedTeleports(): string[] {
  return Object.values(TELEPORT_POINTS)
    .filter(tp => tp.unlocked)
    .map(tp => tp.id);
}

/** 获取指定地图的传送点 */
export function getTeleportByMapId(mapId: string): TeleportPoint | undefined {
  return Object.values(TELEPORT_POINTS).find(tp => tp.mapId === mapId);
}
