// 地图导航服务

import { computed } from '@preact/signals-react';
import { getMap, getMapsByRegion, getAllMaps } from '@/constants/maps';
import { player, updatePlayerPosition, playerLevel } from '@/signals/playerSignals';
import { hasItem } from '@/signals/inventorySignals';
import { unlockTeleport, isTeleportUnlocked } from '@/services/teleportService';
import { getTeleportByMapId } from '@/constants/teleports';
import type { GameMap, MapConnection, Direction, MapType } from '@/types';

/** 方向的中文名称映射 */
export const DIRECTION_NAMES: Record<Direction, string> = {
  north: '北',
  south: '南',
  east: '东',
  west: '西',
};

/** 方向的图标映射 */
export const DIRECTION_ICONS: Record<Direction, string> = {
  north: '⬆️',
  south: '⬇️',
  east: '➡️',
  west: '⬅️',
};

/** 获取当前地图信息 */
export function getCurrentMap(): GameMap | undefined {
  if (!player.value) return undefined;
  return getMap(player.value.currentMapId);
}

/** 当前地图的computed */
export const currentMap = computed(() => getCurrentMap());

/** 获取地图的所有相邻地图 */
export function getAdjacentMaps(mapId: string): Array<MapConnection & { targetMap: GameMap }> {
  const map = getMap(mapId);
  if (!map) return [];

  return map.connections
    .map(conn => {
      const targetMap = getMap(conn.targetMapId);
      if (!targetMap) return null;
      return { ...conn, targetMap };
    })
    .filter((conn): conn is MapConnection & { targetMap: GameMap } => conn !== null);
}

/** 检查是否可以移动到目标地图 */
export function canMoveToMap(targetMapId: string): { canMove: boolean; reason: string } {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { canMove: false, reason: '玩家数据异常' };
  }

  const currentMapData = getMap(currentPlayer.currentMapId);
  if (!currentMapData) {
    return { canMove: false, reason: '当前地图数据异常' };
  }

  const targetMap = getMap(targetMapId);
  if (!targetMap) {
    return { canMove: false, reason: '目标地图不存在' };
  }

  // 检查是否是相邻地图
  const connection = currentMapData.connections.find(c => c.targetMapId === targetMapId);
  if (!connection) {
    return { canMove: false, reason: '该地图与当前位置不相邻' };
  }

  // 检查等级限制
  if (connection.requiredLevel && currentPlayer.level < connection.requiredLevel) {
    return { canMove: false, reason: `等级不足，需要 Lv.${connection.requiredLevel}` };
  }

  // 检查物品限制（如果有）
  if (connection.requiredItem && !hasItem(connection.requiredItem)) {
    return { canMove: false, reason: '缺少所需物品' };
  }

  return { canMove: true, reason: '' };
}

/** 移动到相邻地图 */
export function moveToMap(targetMapId: string): { success: boolean; message: string } {
  const canMoveResult = canMoveToMap(targetMapId);
  if (!canMoveResult.canMove) {
    return { success: false, message: canMoveResult.reason };
  }

  const targetMap = getMap(targetMapId);
  if (!targetMap) {
    return { success: false, message: '目标地图不存在' };
  }

  // 更新玩家位置
  updatePlayerPosition(targetMapId, Math.floor(targetMap.size.width / 2), Math.floor(targetMap.size.height / 2));

  // 自动解锁该地图的传送点
  const teleportPoint = getTeleportByMapId(targetMapId);
  if (teleportPoint && !isTeleportUnlocked(teleportPoint.id)) {
    unlockTeleport(teleportPoint.id);
  }

  return { success: true, message: `成功移动到 ${targetMap.name}` };
}

/** 获取区域的所有地图（包括当前位置标记） */
export function getRegionMapsWithCurrent(region: string): Array<GameMap & { isCurrent: boolean }> {
  const maps = getMapsByRegion(region);
  const currentMapId = player.value?.currentMapId;

  return maps.map(map => ({
    ...map,
    isCurrent: map.id === currentMapId,
  }));
}

/** 获取所有区域的地图分组 */
export function getAllMapsGroupedByRegion(): Record<string, Array<GameMap & { isCurrent: boolean }>> {
  const allMaps = getAllMaps();
  const currentMapId = player.value?.currentMapId;
  const grouped: Record<string, Array<GameMap & { isCurrent: boolean }>> = {};

  for (const map of allMaps) {
    if (!grouped[map.region]) {
      grouped[map.region] = [];
    }
    grouped[map.region].push({
      ...map,
      isCurrent: map.id === currentMapId,
    });
  }

  return grouped;
}

/** 获取区域名称 */
export function getRegionName(region: string): string {
  const regionNames: Record<string, string> = {
    newbie: '新手村',
    datang: '东土大唐',
  };
  return regionNames[region] || region;
}

/** 获取地图类型名称 */
export function getMapTypeName(type: MapType): string {
  const typeNames: Record<MapType, string> = {
    town: '城镇',
    field: '野外',
    building: '建筑',
    dungeon: '副本入口',
    hidden: '隐藏',
  };
  return typeNames[type];
}

/** 获取玩家当前可移动的相邻地图 */
export function getAvailableAdjacentMaps(): Array<MapConnection & { targetMap: GameMap; canMove: boolean; reason: string }> {
  const currentMapData = getCurrentMap();
  if (!currentMapData) return [];

  const adjacentMaps = getAdjacentMaps(currentMapData.id);
  const currentLevel = playerLevel.value;

  return adjacentMaps.map(conn => {
    let canMove = true;
    let reason = '';

    if (conn.requiredLevel && currentLevel < conn.requiredLevel) {
      canMove = false;
      reason = `需要 Lv.${conn.requiredLevel}`;
    }

    if (conn.requiredItem && !hasItem(conn.requiredItem)) {
      canMove = false;
      reason = '缺少物品';
    }

    return { ...conn, canMove, reason };
  });
}

/** 检查地图是否适合当前等级 */
export function isMapSuitableForLevel(map: GameMap, level?: number): 'easy' | 'suitable' | 'hard' | 'dangerous' {
  const playerLevelValue = level ?? playerLevel.value;

  if (playerLevelValue > map.levelRange.max + 5) return 'easy';
  if (playerLevelValue >= map.levelRange.min && playerLevelValue <= map.levelRange.max) return 'suitable';
  if (playerLevelValue >= map.levelRange.min - 3) return 'hard';
  return 'dangerous';
}

/** 获取地图危险等级样式 */
export function getMapDangerStyle(suitability: 'easy' | 'suitable' | 'hard' | 'dangerous'): string {
  switch (suitability) {
    case 'easy':
      return 'text-green-400';
    case 'suitable':
      return 'text-blue-400';
    case 'hard':
      return 'text-yellow-400';
    case 'dangerous':
      return 'text-red-400';
  }
}

/** 获取地图危险等级文字 */
export function getMapDangerText(suitability: 'easy' | 'suitable' | 'hard' | 'dangerous'): string {
  switch (suitability) {
    case 'easy':
      return '轻松';
    case 'suitable':
      return '适合';
    case 'hard':
      return '困难';
    case 'dangerous':
      return '危险';
  }
}

/** 获取地图的NPC列表 */
export function getMapNPCs(mapId: string) {
  const map = getMap(mapId);
  return map?.npcs ?? [];
}

/** 获取地图的事件列表 */
export function getMapEvents(mapId: string) {
  const map = getMap(mapId);
  return map?.events ?? [];
}

/** 获取地图的传送点（地图内传送点，非传送系统） */
export function getMapTeleporters(mapId: string) {
  const map = getMap(mapId);
  return map?.teleporters ?? [];
}

/** 地图服务对象 */
export const mapService = {
  getCurrentMap,
  getAdjacentMaps,
  canMoveToMap,
  moveToMap,
  getRegionMapsWithCurrent,
  getAllMapsGroupedByRegion,
  getRegionName,
  getMapTypeName,
  getAvailableAdjacentMaps,
  isMapSuitableForLevel,
  getMapDangerStyle,
  getMapDangerText,
  getMapNPCs,
  getMapEvents,
  getMapTeleporters,
};
