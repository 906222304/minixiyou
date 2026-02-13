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
