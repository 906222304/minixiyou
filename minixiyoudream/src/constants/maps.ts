// 地图配置数据（新手村8张地图）

import type { GameMap } from '@/types';

/** 地图配置列表 */
export const MAPS: Record<string, GameMap> = {
  // 长安城（安全区）
  map_changan: {
    id: 'map_changan',
    name: '长安城',
    description: '大唐都城，繁华热闹，是冒险者的聚集地。',
    type: 'town',
    region: 'newbie',
    levelRange: { min: 1, max: 10 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'east', targetMapId: 'map_village_1' },
    ],
    npcs: [
      { id: 'npc_guide', name: '新手引导员', avatar: '👨', type: 'trainer', position: { x: 5, y: 5 }, dialogues: { default: ['欢迎来到长安城！', '需要帮助吗？'] } },
      { id: 'npc_shop', name: '杂货商', avatar: '🧑', type: 'merchant', position: { x: 3, y: 3 }, dialogues: { default: ['要买点什么？'] }, shopId: 'shop_general' },
    ],
    events: [],
    teleporters: [],
    icon: '🏯',
  },

  // 新手村野外地图
  map_village_1: {
    id: 'map_village_1',
    name: '长安郊外',
    description: '长安城外的郊野地带，偶尔有野兽出没。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 1, max: 5 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_changan' },
      { direction: 'east', targetMapId: 'map_village_2' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.1,
      enemyGroups: ['enemy_group_wolves', 'enemy_group_rabbits'],
      stepTrigger: 10,
    },
    icon: '🌲',
  },

  map_village_2: {
    id: 'map_village_2',
    name: '竹林小道',
    description: '一片幽静的竹林，适合初级冒险者练级。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 3, max: 7 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_1' },
      { direction: 'east', targetMapId: 'map_village_3' },
      { direction: 'north', targetMapId: 'map_village_5' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_bamboo', 'enemy_group_snakes'],
      stepTrigger: 8,
    },
    icon: '🎋',
  },

  map_village_3: {
    id: 'map_village_3',
    name: '清溪流泉',
    description: '清澈的小溪旁，风景宜人。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 5, max: 9 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_2' },
      { direction: 'east', targetMapId: 'map_village_4' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_frogs', 'enemy_group_fish'],
      stepTrigger: 8,
    },
    icon: '💧',
  },

  map_village_4: {
    id: 'map_village_4',
    name: '古树森林',
    description: '古老的森林，树木参天。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 7, max: 11 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_3' },
      { direction: 'north', targetMapId: 'map_village_6' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_boars', 'enemy_group_bears'],
      stepTrigger: 7,
    },
    icon: '🌳',
  },

  map_village_5: {
    id: 'map_village_5',
    name: '山顶云海',
    description: '山顶之上，云雾缭绕。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 6, max: 10 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'south', targetMapId: 'map_village_2' },
      { direction: 'east', targetMapId: 'map_village_6' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_eagles', 'enemy_group_monkeys'],
      stepTrigger: 6,
    },
    icon: '⛰️',
  },

  map_village_6: {
    id: 'map_village_6',
    name: '花果山脚',
    description: '传说中孙悟空的故乡，花果山脚下。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 8, max: 12 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_5' },
      { direction: 'south', targetMapId: 'map_village_4' },
      { direction: 'east', targetMapId: 'map_village_7' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_monkeys', 'enemy_group_tigers'],
      stepTrigger: 5,
    },
    icon: '🍑',
  },

  map_village_7: {
    id: 'map_village_7',
    name: '水帘洞外',
    description: '传说中的水帘洞入口，危险与机遇并存。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 10, max: 15 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_6' },
      { direction: 'east', targetMapId: 'map_datang_west', requiredLevel: 10 },
    ],
    npcs: [],
    events: [
      {
        id: 'event_waterfall',
        type: 'story',
        position: { x: 6, y: 6 },
        trigger: 'interact',
        data: { storyId: 'story_waterfall' },
        oneTime: false,
      },
    ],
    teleporters: [
      {
        id: 'teleport_dungeon',
        position: { x: 6, y: 5 },
        targetMapId: 'map_changan',
        targetPosition: { x: 5, y: 5 },
      },
    ],
    encounterConfig: {
      rate: 0.25,
      enemyGroups: ['enemy_group_elite_monkeys', 'enemy_group_boss_monkey'],
      stepTrigger: 4,
    },
    icon: '🌊',
  },

  // ========== 东土大唐区域 ==========

  // 大唐都城（安全区）
  map_datang_capital: {
    id: 'map_datang_capital',
    name: '大唐都城',
    description: '大唐帝国的繁华都城，商贾云集，人声鼎沸。',
    type: 'town',
    region: 'datang',
    levelRange: { min: 10, max: 25 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_east' },
      { direction: 'west', targetMapId: 'map_datang_west' },
      { direction: 'north', targetMapId: 'map_datang_north' },
      { direction: 'south', targetMapId: 'map_datang_south' },
    ],
    npcs: [
      { id: 'npc_datang_guard', name: '守城将军', avatar: '💂', type: 'trainer', position: { x: 7, y: 7 }, dialogues: { default: ['欢迎来到大唐都城！', '城外危险，请多加小心。'] } },
      { id: 'npc_datang_merchant', name: '西域商人', avatar: '🧔', type: 'merchant', position: { x: 5, y: 8 }, dialogues: { default: ['要看看西域来的珍宝吗？'] }, shopId: 'shop_exotic' },
    ],
    events: [],
    teleporters: [],
    icon: '🏛️',
  },

  // 东郊
  map_datang_east: {
    id: 'map_datang_east',
    name: '大唐东郊',
    description: '大唐都城以东的郊外地带，风景秀丽。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 10, max: 15 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_fox_valley' },
      { direction: 'north', targetMapId: 'map_ancient_temple' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_foxes', 'enemy_group_deer'],
      stepTrigger: 8,
    },
    icon: '🌅',
  },

  // 西郊
  map_datang_west: {
    id: 'map_datang_west',
    name: '大唐西郊',
    description: '大唐都城以西的郊外，通往西域的要道。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 10, max: 14 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_7', requiredLevel: 10 },
      { direction: 'east', targetMapId: 'map_datang_capital' },
      { direction: 'south', targetMapId: 'map_spider_forest' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_bandits', 'enemy_group_wild_dogs'],
      stepTrigger: 8,
    },
    icon: '🌄',
  },

  // 北郊
  map_datang_north: {
    id: 'map_datang_north',
    name: '大唐北郊',
    description: '大唐都城以北，群山环绕，地势险要。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 12, max: 18 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'south', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_dragon_pool' },
      { direction: 'west', targetMapId: 'map_tiger_den' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_wild_wolves', 'enemy_group_bears_datang'],
      stepTrigger: 7,
    },
    icon: '🏔️',
  },

  // 南郊
  map_datang_south: {
    id: 'map_datang_south',
    name: '大唐南郊',
    description: '大唐都城以南，河流纵横，土地肥沃。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 11, max: 16 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'north', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_misty_swamp' },
      { direction: 'west', targetMapId: 'map_ghost_town' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.14,
      enemyGroups: ['enemy_group_water_demons', 'enemy_group_fishmen'],
      stepTrigger: 7,
    },
    icon: '🌾',
  },

  // 狐狸谷
  map_fox_valley: {
    id: 'map_fox_valley',
    name: '狐狸谷',
    description: '传说中有妖狐出没的山谷，迷雾缭绕。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 15, max: 20 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_east' },
      { direction: 'north', targetMapId: 'map_fairy_peak' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_foxes', 'enemy_group_fox_spirits'],
      stepTrigger: 6,
    },
    icon: '🦊',
  },

  // 蜘蛛林
  map_spider_forest: {
    id: 'map_spider_forest',
    name: '蜘蛛林',
    description: '蜘蛛横行的森林，蛛网密布，阴森恐怖。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 14, max: 19 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'north', targetMapId: 'map_datang_west' },
      { direction: 'east', targetMapId: 'map_dungeon_entrance' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_spider_nest',
        type: 'battle',
        position: { x: 6, y: 6 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_spider_queen' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_spiders', 'enemy_group_poison_spiders'],
      stepTrigger: 5,
    },
    icon: '🕸️',
  },

  // 山贼据点
  map_bandit_stronghold: {
    id: 'map_bandit_stronghold',
    name: '山贼据点',
    description: '山贼盘踞的要塞，易守难攻。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 16, max: 22 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'south', targetMapId: 'map_ancient_temple' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.22,
      enemyGroups: ['enemy_group_bandits', 'enemy_group_bandit_elites'],
      stepTrigger: 5,
    },
    icon: '🏴',
  },

  // 古庙
  map_ancient_temple: {
    id: 'map_ancient_temple',
    name: '古庙',
    description: '一座废弃的古庙，据说曾是有道高僧修行之地。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 13, max: 18 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'south', targetMapId: 'map_datang_east' },
      { direction: 'north', targetMapId: 'map_bandit_stronghold' },
    ],
    npcs: [
      { id: 'npc_old_monk', name: '老僧', avatar: '🧘', type: 'trainer', position: { x: 6, y: 6 }, dialogues: { default: ['施主，佛法无边...', '贫僧在此守庙数十载...'] } },
    ],
    events: [
      {
        id: 'event_temple_treasure',
        type: 'treasure',
        position: { x: 3, y: 3 },
        trigger: 'interact',
        data: { treasureId: 'chest_temple' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_ghosts', 'enemy_group_temple_guardians'],
      stepTrigger: 6,
    },
    icon: '⛩️',
  },

  // 迷雾沼泽
  map_misty_swamp: {
    id: 'map_misty_swamp',
    name: '迷雾沼泽',
    description: '终年笼罩在迷雾中的沼泽地，毒虫遍地。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 17, max: 23 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_south' },
      { direction: 'north', targetMapId: 'map_dungeon_entrance' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_swamp_creatures', 'enemy_group_poison_toads'],
      stepTrigger: 5,
    },
    icon: '🌫️',
  },

  // 龙潭
  map_dragon_pool: {
    id: 'map_dragon_pool',
    name: '龙潭',
    description: '传说中有神龙居住的深潭，灵气充沛。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 18, max: 24 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_north' },
      { direction: 'south', targetMapId: 'map_fairy_peak' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_dragon_blessing',
        type: 'story',
        position: { x: 5, y: 5 },
        trigger: 'interact',
        data: { storyId: 'story_dragon_blessing' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_water_dragons', 'enemy_group_dragon_fish'],
      stepTrigger: 5,
    },
    icon: '🐉',
  },

  // 虎穴
  map_tiger_den: {
    id: 'map_tiger_den',
    name: '虎穴',
    description: '猛虎聚居的洞穴，危机四伏。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 16, max: 22 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_north' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.22,
      enemyGroups: ['enemy_group_tigers_datang', 'enemy_group_tiger_king'],
      stepTrigger: 5,
    },
    icon: '🐯',
  },

  // 仙峰
  map_fairy_peak: {
    id: 'map_fairy_peak',
    name: '仙峰',
    description: '高耸入云的山峰，据说是仙人修炼之所。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 20, max: 25 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'south', targetMapId: 'map_fox_valley' },
      { direction: 'north', targetMapId: 'map_dragon_pool' },
    ],
    npcs: [
      { id: 'npc_hermit', name: '隐士', avatar: '🧙', type: 'trainer', position: { x: 5, y: 5 }, dialogues: { default: ['年轻人，你可知修仙之路？'] } },
    ],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_fairy_beasts', 'enemy_group_cloud_spirits'],
      stepTrigger: 6,
    },
    icon: '⛰️',
  },

  // 鬼城
  map_ghost_town: {
    id: 'map_ghost_town',
    name: '鬼城',
    description: '一座被诅咒的废弃城池，阴魂不散。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 19, max: 25 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_south' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_ghost_treasure',
        type: 'treasure',
        position: { x: 6, y: 6 },
        trigger: 'interact',
        data: { treasureId: 'chest_ghost' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_ghosts_datang', 'enemy_group_skeleton_warriors'],
      stepTrigger: 5,
    },
    icon: '👻',
  },

  // 副本入口区
  map_dungeon_entrance: {
    id: 'map_dungeon_entrance',
    name: '副本入口',
    description: '通往各种秘境副本的入口，危机与机遇并存。',
    type: 'dungeon',
    region: 'datang',
    levelRange: { min: 15, max: 30 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_spider_forest' },
      { direction: 'south', targetMapId: 'map_misty_swamp' },
    ],
    npcs: [
      { id: 'npc_dungeon_guard', name: '守卫', avatar: '⚔️', type: 'quest', position: { x: 5, y: 5 }, dialogues: { default: ['前方是危险的副本区域，请做好准备。'] } },
    ],
    events: [],
    teleporters: [],
    icon: '🚪',
  },
};

/** 获取地图配置 */
export function getMap(id: string): GameMap | undefined {
  return MAPS[id];
}

/** 获取所有地图列表 */
export function getAllMaps(): GameMap[] {
  return Object.values(MAPS);
}

/** 获取区域地图列表 */
export function getMapsByRegion(region: string): GameMap[] {
  return Object.values(MAPS).filter(m => m.region === region);
}
