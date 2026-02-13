// 地图类型定义

import type { UUID } from './common';

/** 地图类型 */
export type MapType =
  | 'town'     // 城镇
  | 'field'    // 野外
  | 'building' // 建筑
  | 'dungeon'  // 副本入口
  | 'hidden';  // 隐藏

/** 地图连接方向 */
export type Direction = 'north' | 'south' | 'east' | 'west';

/** 地图连接 */
export interface MapConnection {
  direction: Direction;
  targetMapId: string;
  requiredLevel?: number;
  requiredItem?: string;
}

/** NPC配置 */
export interface NPC {
  id: string;
  name: string;
  avatar: string;
  type: 'merchant' | 'quest' | 'trainer' | 'story';

  // 位置
  position: { x: number; y: number };

  // 对话
  dialogues: {
    default: string[];
    quest?: string[];
  };

  // 功能
  shopId?: string;
  questIds?: string[];
}

/** 地图事件 */
export interface MapEvent {
  id: string;
  type: 'treasure' | 'battle' | 'teleport' | 'story' | 'npc';

  // 触发位置
  position: { x: number; y: number };

  // 触发条件
  trigger: 'step' | 'interact' | 'auto';

  // 事件数据
  data: {
    treasureId?: string;
    enemyGroupId?: string;
    targetMapId?: string;
    storyId?: string;
    npcId?: string;
  };

  // 是否一次性
  oneTime: boolean;
  triggered?: boolean;
}

/** 地图配置 */
export interface GameMap {
  id: UUID;
  name: string;
  description: string;
  type: MapType;

  // 区域信息
  region: string;
  levelRange: {
    min: number;
    max: number;
  };

  // 尺寸
  size: {
    width: number;
    height: number;
  };

  // 连接
  connections: MapConnection[];

  // NPC列表
  npcs: NPC[];

  // 事件
  events: MapEvent[];

  // 传送点
  teleporters: {
    id: string;
    position: { x: number; y: number };
    targetMapId: string;
    targetPosition: { x: number; y: number };
  }[];

  // 遭遇配置
  encounterConfig?: {
    rate: number;        // 遭遇概率
    enemyGroups: string[];
    stepTrigger: number; // 多少步触发一次
  };

  // 图标/背景
  icon: string;
  background?: string;
}

/** 玩家地图状态 */
export interface PlayerMapState {
  currentMapId: string;
  position: { x: number; y: number };
  visitedMaps: string[];
  discoveredEvents: string[];
}
