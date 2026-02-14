// 存档服务 - 使用 Dexie.js (IndexedDB)

import { db, SAVE_VERSION, MAX_SAVE_SLOTS, type SaveData, type AutoSaveData } from '@/db';
import { player } from '@/signals/playerSignals';
import {
  inventoryItems,
  inventoryEquipments,
  equippedSlots,
  affixLockStates,
} from '@/signals/inventorySignals';
import { companions } from '@/signals/companionSignals';
import { playerPets } from '@/signals/petSignals';

/** 存档结果 */
export interface SaveResult {
  success: boolean;
  message: string;
  saveId?: number;
}

/** 加载结果 */
export interface LoadResult {
  success: boolean;
  message: string;
  data?: SaveData['data'];
}

/** 存档信息（用于列表显示） */
export interface SaveInfo {
  id: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  playerName?: string;
  playerLevel?: number;
  playTime: number;
  currentMapId: string;
}

/**
 * 获取当前游戏数据
 */
function getCurrentGameData(): SaveData['data'] {
  const currentPlayer = player.value;

  return {
    player: currentPlayer,
    inventory: {
      items: inventoryItems.value,
      equipments: inventoryEquipments.value,
      equippedSlots: equippedSlots.value,
    },
    pets: playerPets.value,
    companions: companions.value,
    gameProgress: {
      currentMapId: currentPlayer?.currentMapId ?? 'map_changan',
      playTime: currentPlayer?.playTime ?? 0,
      lastAutoSaveTime: Date.now(),
    },
  };
}

/**
 * 应用加载的游戏数据到状态
 */
function applyGameData(data: SaveData['data']): void {
  // 恢复玩家状态
  if (data.player) {
    player.value = data.player;
  }

  // 恢复背包状态
  inventoryItems.value = data.inventory.items;
  inventoryEquipments.value = data.inventory.equipments;
  equippedSlots.value = data.inventory.equippedSlots;

  // 恢复宠物状态
  if (data.pets) {
    playerPets.value = data.pets;
  }

  // 恢复伙伴状态
  if (data.companions) {
    companions.value = data.companions;
  }

  // 清空词条锁定状态
  affixLockStates.value = new Map();
}

/**
 * 保存存档
 * @param name 存档名称
 * @param saveId 可选，指定要覆盖的存档ID
 */
export async function save(name: string, saveId?: number): Promise<SaveResult> {
  try {
    const now = Date.now();
    const gameData = getCurrentGameData();

    // 如果指定了存档ID，更新现有存档
    if (saveId !== undefined) {
      const existingSave = await db.saves.get(saveId);
      if (existingSave) {
        await db.saves.update(saveId, {
          name,
          updatedAt: now,
          version: SAVE_VERSION,
          data: gameData,
        });

        return {
          success: true,
          message: '存档已更新',
          saveId,
        };
      }
    }

    // 检查存档数量是否已达上限
    const saveCount = await db.saves.count();
    if (saveCount >= MAX_SAVE_SLOTS) {
      return {
        success: false,
        message: `存档数量已达上限（${MAX_SAVE_SLOTS}个）`,
      };
    }

    // 创建新存档
    const newSave: SaveData = {
      name,
      createdAt: now,
      updatedAt: now,
      version: SAVE_VERSION,
      data: gameData,
    };

    const id = await db.saves.add(newSave);

    return {
      success: true,
      message: '存档成功',
      saveId: id as number,
    };
  } catch (error) {
    console.error('Save failed:', error);
    return {
      success: false,
      message: '存档失败，请重试',
    };
  }
}

/**
 * 加载存档
 * @param id 存档ID
 */
export async function load(id: number): Promise<LoadResult> {
  try {
    const saveData = await db.saves.get(id);

    if (!saveData) {
      return {
        success: false,
        message: '存档不存在',
      };
    }

    // 检查版本兼容性
    if (saveData.version > SAVE_VERSION) {
      return {
        success: false,
        message: '存档版本不兼容，请更新游戏',
      };
    }

    // 应用数据到游戏状态
    applyGameData(saveData.data);

    return {
      success: true,
      message: '读档成功',
      data: saveData.data,
    };
  } catch (error) {
    console.error('Load failed:', error);
    return {
      success: false,
      message: '读档失败，请重试',
    };
  }
}

/**
 * 获取所有存档列表
 */
export async function list(): Promise<SaveInfo[]> {
  try {
    const saves = await db.saves.orderBy('updatedAt').reverse().toArray();

    return saves.map((save) => ({
      id: save.id!,
      name: save.name,
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
      playerName: save.data.player?.name,
      playerLevel: save.data.player?.level,
      playTime: save.data.gameProgress?.playTime ?? save.data.player?.playTime ?? 0,
      currentMapId: save.data.gameProgress?.currentMapId ?? save.data.player?.currentMapId ?? '',
    }));
  } catch (error) {
    console.error('List saves failed:', error);
    return [];
  }
}

/**
 * 删除存档
 * @param id 存档ID
 */
export async function deleteSave(id: number): Promise<SaveResult> {
  try {
    const save = await db.saves.get(id);
    if (!save) {
      return {
        success: false,
        message: '存档不存在',
      };
    }

    await db.saves.delete(id);

    return {
      success: true,
      message: '存档已删除',
    };
  } catch (error) {
    console.error('Delete save failed:', error);
    return {
      success: false,
      message: '删除失败，请重试',
    };
  }
}

/**
 * 快速存档（使用固定名称）
 */
export async function quickSave(): Promise<SaveResult> {
  const currentPlayer = player.value;
  const playerName = currentPlayer?.name ?? '玩家';
  const saveName = `[快存] ${playerName} - Lv.${currentPlayer?.level ?? 1}`;

  // 查找是否已有快存档
  const existingQuicksaves = await db.saves
    .where('name')
    .startsWith('[快存]')
    .toArray();

  // 如果已有快存档，更新它
  if (existingQuicksaves.length > 0) {
    const quicksaveId = existingQuicksaves[0].id!;
    return save(saveName, quicksaveId);
  }

  // 否则创建新存档
  return save(saveName);
}

/**
 * 快速读档
 */
export async function quickLoad(): Promise<LoadResult> {
  try {
    // 查找快存档
    const quicksaves = await db.saves
      .where('name')
      .startsWith('[快存]')
      .reverse()
      .toArray();

    if (quicksaves.length === 0) {
      return {
        success: false,
        message: '没有找到快速存档',
      };
    }

    const latestQuicksave = quicksaves[0];
    return load(latestQuicksave.id!);
  } catch (error) {
    console.error('Quick load failed:', error);
    return {
      success: false,
      message: '快速读档失败',
    };
  }
}

/**
 * 自动存档
 */
export async function autoSave(): Promise<SaveResult> {
  try {
    const now = Date.now();
    const gameData = getCurrentGameData();

    // 查找现有自动存档
    const existingAutoSaves = await db.autoSaves.toArray();

    const autoSaveEntry: AutoSaveData = {
      type: 'auto',
      createdAt: existingAutoSaves.length > 0 ? existingAutoSaves[0].createdAt : now,
      updatedAt: now,
      version: SAVE_VERSION,
      data: gameData,
    };

    if (existingAutoSaves.length > 0) {
      // 更新现有自动存档 - 使用 put 替换整个记录
      await db.autoSaves.put({ ...autoSaveEntry, id: existingAutoSaves[0].id });
    } else {
      // 创建新的自动存档
      await db.autoSaves.add(autoSaveEntry);
    }

    return {
      success: true,
      message: '自动存档成功',
    };
  } catch (error) {
    console.error('Auto save failed:', error);
    return {
      success: false,
      message: '自动存档失败',
    };
  }
}

/**
 * 从自动存档恢复
 */
export async function loadAutoSave(): Promise<LoadResult> {
  try {
    const autoSaveData = await db.autoSaves.toArray();

    if (autoSaveData.length === 0) {
      return {
        success: false,
        message: '没有找到自动存档',
      };
    }

    const latest = autoSaveData[0];
    applyGameData(latest.data);

    return {
      success: true,
      message: '从自动存档恢复成功',
      data: latest.data,
    };
  } catch (error) {
    console.error('Load auto save failed:', error);
    return {
      success: false,
      message: '加载自动存档失败',
    };
  }
}

/**
 * 检查是否有自动存档
 */
export async function hasAutoSave(): Promise<boolean> {
  try {
    const count = await db.autoSaves.count();
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * 获取存档详情
 * @param id 存档ID
 */
export async function getSaveDetail(id: number): Promise<SaveData | null> {
  try {
    const save = await db.saves.get(id);
    return save ?? null;
  } catch {
    return null;
  }
}

/**
 * 重命名存档
 * @param id 存档ID
 * @param newName 新名称
 */
export async function renameSave(id: number, newName: string): Promise<SaveResult> {
  try {
    const save = await db.saves.get(id);
    if (!save) {
      return {
        success: false,
        message: '存档不存在',
      };
    }

    await db.saves.update(id, {
      name: newName,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: '重命名成功',
    };
  } catch (error) {
    console.error('Rename save failed:', error);
    return {
      success: false,
      message: '重命名失败',
    };
  }
}

/**
 * 清除所有存档（危险操作）
 */
export async function clearAllSaves(): Promise<SaveResult> {
  try {
    await db.saves.clear();
    await db.autoSaves.clear();

    return {
      success: true,
      message: '所有存档已清除',
    };
  } catch (error) {
    console.error('Clear all saves failed:', error);
    return {
      success: false,
      message: '清除存档失败',
    };
  }
}

/**
 * 导出存档数据（用于备份）
 * @param id 存档ID
 */
export async function exportSave(id: number): Promise<string | null> {
  try {
    const save = await db.saves.get(id);
    if (!save) return null;

    return JSON.stringify(save);
  } catch {
    return null;
  }
}

/**
 * 导入存档数据
 * @param jsonData JSON格式的存档数据
 */
export async function importSave(jsonData: string): Promise<SaveResult> {
  try {
    const saveData = JSON.parse(jsonData) as SaveData;

    // 验证数据结构
    if (!saveData.name || !saveData.data) {
      return {
        success: false,
        message: '存档数据格式无效',
      };
    }

    // 检查存档数量
    const saveCount = await db.saves.count();
    if (saveCount >= MAX_SAVE_SLOTS) {
      return {
        success: false,
        message: `存档数量已达上限（${MAX_SAVE_SLOTS}个）`,
      };
    }

    // 创建新存档
    const newSave: SaveData = {
      name: saveData.name + ' (导入)',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: SAVE_VERSION,
      data: saveData.data,
    };

    const id = await db.saves.add(newSave);

    return {
      success: true,
      message: '存档导入成功',
      saveId: id as number,
    };
  } catch (error) {
    console.error('Import save failed:', error);
    return {
      success: false,
      message: '存档导入失败',
    };
  }
}

/** 存档服务实例 */
export const saveService = {
  save,
  load,
  list,
  deleteSave,
  quickSave,
  quickLoad,
  autoSave,
  loadAutoSave,
  hasAutoSave,
  getSaveDetail,
  renameSave,
  clearAllSaves,
  exportSave,
  importSave,
};

export default saveService;
