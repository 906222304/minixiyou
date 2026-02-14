// 传送服务

import { signal, computed } from '@preact/signals-react';
import {
  getTeleportPoint,
  getAllTeleportPoints,
  getDefaultUnlockedTeleports,
  type TeleportPoint,
} from '@/constants/teleports';
import { getMap } from '@/constants/maps';
// 修复: 移除 playerLevel，使用 player.value?.level 确保一致性
import { player, updatePlayerPosition, updatePlayerGold } from '@/signals/playerSignals';

/** 已解锁的传送点列表 */
export const unlockedTeleports = signal<string[]>(getDefaultUnlockedTeleports());

/** 所有传送点 */
export const allTeleports = computed(() => getAllTeleportPoints());

/** 已解锁的传送点详情 */
export const unlockedTeleportDetails = computed(() => {
  return getAllTeleportPoints().filter(tp => unlockedTeleports.value.includes(tp.id));
});

/** 当前可用的传送点（已解锁且满足等级要求） */
export const availableTeleports = computed(() => {
  // 修复: 使用 player.value?.level 替代 playerLevel.value 确保一致性
  const currentLevel = player.value?.level ?? 1;
  return getAllTeleportPoints().filter(tp => {
    if (!unlockedTeleports.value.includes(tp.id)) return false;
    if (tp.requirements?.minLevel && currentLevel < tp.requirements.minLevel) return false;
    return true;
  });
});

/** 解锁传送点 */
export function unlockTeleport(teleportId: string): { success: boolean; message: string } {
  const teleport = getTeleportPoint(teleportId);
  if (!teleport) {
    return { success: false, message: '传送点不存在' };
  }

  if (unlockedTeleports.value.includes(teleportId)) {
    return { success: false, message: '该传送点已解锁' };
  }

  // 修复: 使用 player.value?.level 替代 playerLevel.value 确保一致性
  const currentLevel = player.value?.level ?? 1;
  if (teleport.requirements?.minLevel && currentLevel < teleport.requirements.minLevel) {
    return { success: false, message: `等级不足，需要 Lv.${teleport.requirements.minLevel}` };
  }

  // 解锁传送点
  unlockedTeleports.value = [...unlockedTeleports.value, teleportId];

  return { success: true, message: `成功解锁传送点：${teleport.name}` };
}

/** 传送到指定传送点 */
export function teleport(teleportId: string): { success: boolean; message: string } {
  const teleportPoint = getTeleportPoint(teleportId);
  if (!teleportPoint) {
    return { success: false, message: '传送点不存在' };
  }

  // 检查是否已解锁
  if (!unlockedTeleports.value.includes(teleportId)) {
    return { success: false, message: '该传送点尚未解锁' };
  }

  // 修复: 使用 player.value?.level 替代 playerLevel.value 确保一致性
  const currentLevel = player.value?.level ?? 1;
  if (teleportPoint.requirements?.minLevel && currentLevel < teleportPoint.requirements.minLevel) {
    return { success: false, message: `等级不足，需要 Lv.${teleportPoint.requirements.minLevel}` };
  }

  // 检查玩家状态
  if (!player.value) {
    return { success: false, message: '玩家数据异常' };
  }

  // 检查金币是否足够
  const cost = teleportPoint.cost.gold;
  if (player.value.gold < cost) {
    return { success: false, message: `金币不足，需要 ${cost} 金币` };
  }

  // 检查目标地图是否存在
  const targetMap = getMap(teleportPoint.mapId);
  if (!targetMap) {
    return { success: false, message: '目标地图不存在' };
  }

  // 扣除金币
  if (cost > 0) {
    updatePlayerGold(-cost);
  }

  // 执行传送
  updatePlayerPosition(teleportPoint.mapId, 0, 0);

  return { success: true, message: `成功传送到 ${teleportPoint.name}` };
}

/** 获取已解锁的传送点列表 */
export function getUnlockedTeleports(): TeleportPoint[] {
  return getAllTeleportPoints().filter(tp => unlockedTeleports.value.includes(tp.id));
}

/** 计算传送费用（基于距离） */
export function calculateCost(fromMapId: string, toTeleportId: string): number {
  const teleport = getTeleportPoint(toTeleportId);
  if (!teleport) return 0;

  // 如果在同一个地图，免费
  if (fromMapId === teleport.mapId) return 0;

  // 返回传送点的固定费用
  return teleport.cost.gold;
}

/** 检查传送点是否已解锁 */
export function isTeleportUnlocked(teleportId: string): boolean {
  return unlockedTeleports.value.includes(teleportId);
}

/** 检查传送点是否可用（已解锁且满足条件） */
export function isTeleportAvailable(teleportId: string): boolean {
  const teleport = getTeleportPoint(teleportId);
  if (!teleport) return false;

  if (!unlockedTeleports.value.includes(teleportId)) return false;

  // 修复: 使用 player.value?.level 替代 playerLevel.value 确保一致性
  const currentLevel = player.value?.level ?? 1;
  if (teleport.requirements?.minLevel && currentLevel < teleport.requirements.minLevel) {
    return false;
  }

  return true;
}

/** 检查是否可以支付传送费用 */
export function canAffordTeleport(teleportId: string): boolean {
  const teleport = getTeleportPoint(teleportId);
  if (!teleport) return false;

  if (!player.value) return false;

  return player.value.gold >= teleport.cost.gold;
}

/** 自动解锁当前地图的传送点 */
export function unlockCurrentMapTeleport(): { success: boolean; message: string } {
  if (!player.value) {
    return { success: false, message: '玩家数据异常' };
  }

  const currentMapId = player.value.currentMapId;
  const teleport = getAllTeleportPoints().find(tp => tp.mapId === currentMapId);

  if (!teleport) {
    return { success: false, message: '当前地图没有传送点' };
  }

  return unlockTeleport(teleport.id);
}

/** 重置传送点数据（用于测试或重置） */
export function resetTeleports(): void {
  unlockedTeleports.value = getDefaultUnlockedTeleports();
}

/** 传送服务对象 */
export const teleportService = {
  unlockTeleport,
  teleport,
  getUnlockedTeleports,
  calculateCost,
  isTeleportUnlocked,
  isTeleportAvailable,
  canAffordTeleport,
  unlockCurrentMapTeleport,
  resetTeleports,
};
