// 背包状态管理

import { signal, computed } from '@preact/signals-react';
import type { Item, Equipment, EquipmentSlots, AffixLockState, ItemEffect } from '@/types';
import { generateUUID } from '@/types';
import { createEmptyEquipmentSlots } from '@/types/equipment';
import { getItemTemplate } from '@/constants/items';
import { updateEquipEvent } from './questSignals';
import { player, updatePlayerHp, updatePlayerMp, updatePlayerGold } from './playerSignals';
import { addPlayerExp } from './playerSignals';
import { randomInt, randomChoice } from '@/utils/prng';

/** 背包物品列表 */
export const inventoryItems = signal<Item[]>([]);

/** 背包装备列表 */
export const inventoryEquipments = signal<Equipment[]>([]);

/** 已装备的装备槽位 */
export const equippedSlots = signal<EquipmentSlots>(createEmptyEquipmentSlots());

/** 背包最大容量 */
export const maxInventorySlots = 50;

/** 背包物品数量 */
export const itemCount = computed(() => {
  const items = inventoryItems.value;
  return items.reduce((sum, item) => sum + item.count, 0);
});

/** 背包装备数量 */
export const equipmentCount = computed(() => inventoryEquipments.value.length);

/** 背包是否已满 */
export const isInventoryFull = computed(() => {
  return inventoryItems.value.length >= maxInventorySlots;
});

/** 检查是否拥有指定物品（根据模板ID） */
export function hasItem(templateId: string, count: number = 1): boolean {
  const items = inventoryItems.value;
  const item = items.find(i => i.templateId === templateId);
  return item !== undefined && item.count >= count;
}

/** 添加物品到背包 */
export function addItem(templateId: string, count: number = 1): boolean {
  const items = inventoryItems.value;

  // 查找是否已有相同物品
  const existingIndex = items.findIndex((item) => item.templateId === templateId);

  if (existingIndex >= 0) {
    // 增加数量
    const newItems = [...items];
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      count: newItems[existingIndex].count + count,
    };
    inventoryItems.value = newItems;
  } else {
    // 添加新物品
    if (items.length >= maxInventorySlots) {
      return false; // 背包已满
    }

    // 导入物品模板获取信息
    import('@/constants/items').then(({ getItemTemplate }) => {
      const template = getItemTemplate(templateId);
      if (!template) return;

      const newItem: Item = {
        id: generateUUID(),
        templateId,
        name: template.name,
        type: template.type,
        quality: template.quality,
        count,
      };

      inventoryItems.value = [...items, newItem];
    });
  }

  return true;
}

/** 移除物品 */
export function removeItem(itemId: string, count: number = 1): boolean {
  const items = inventoryItems.value;
  const index = items.findIndex((item) => item.id === itemId);

  if (index < 0) return false;

  const item = items[index];
  if (item.count <= count) {
    // 完全移除
    inventoryItems.value = items.filter((_, i) => i !== index);
  } else {
    // 减少数量
    const newItems = [...items];
    newItems[index] = { ...item, count: item.count - count };
    inventoryItems.value = newItems;
  }

  return true;
}

/** 使用消耗品 */
export function useItem(itemId: string): { success: boolean; message: string; effects?: ItemEffect[] } {
  const items = inventoryItems.value;
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return { success: false, message: '物品不存在' };
  }

  // 获取物品模板
  const template = getItemTemplate(item.templateId);
  if (!template) {
    return { success: false, message: '物品模板不存在' };
  }

  if (!template.usable) {
    return { success: false, message: '该物品无法使用' };
  }

  // 检查使用条件
  if (template.useRequirements) {
    const currentPlayer = player.value;
    if (!currentPlayer) {
      return { success: false, message: '玩家数据不存在' };
    }

    if (template.useRequirements.minLevel && currentPlayer.level < template.useRequirements.minLevel) {
      return { success: false, message: `需要等级 ${template.useRequirements.minLevel}` };
    }

    // 检查是否需要战斗中
    if (template.useRequirements.inBattle) {
      // TODO: 检查是否在战斗中
      // return { success: false, message: '只能在战斗中使用' };
    }
  }

  // 应用效果
  const effects = template.effects || [];
  let effectMessage = '';

  for (const effect of effects) {
    switch (effect.type) {
      case 'heal_hp':
        if (effect.value) {
          updatePlayerHp(effect.value);
          effectMessage += `恢复 ${effect.value} HP `;
        }
        break;
      case 'heal_mp':
        if (effect.value) {
          updatePlayerMp(effect.value);
          effectMessage += `恢复 ${effect.value} MP `;
        }
        break;
      case 'heal_hp_percent':
        if (effect.value && player.value) {
          const healAmount = Math.floor(player.value.maxHp * effect.value / 100);
          updatePlayerHp(healAmount);
          effectMessage += `恢复 ${effect.value}% HP (${healAmount}) `;
        }
        break;
      case 'heal_mp_percent':
        if (effect.value && player.value) {
          const healAmount = Math.floor(player.value.maxMp * effect.value / 100);
          updatePlayerMp(healAmount);
          effectMessage += `恢复 ${effect.value}% MP (${healAmount}) `;
        }
        break;
      case 'cure':
        // TODO: 实现治愈负面状态的逻辑
        effectMessage += '治愈负面状态 ';
        break;
      case 'add_exp':
        if (effect.value) {
          const leveledUp = addPlayerExp(effect.value);
          effectMessage += `获得 ${effect.value} 经验值 `;
          if (leveledUp) {
            effectMessage += '(升级了!) ';
          }
        }
        break;
      case 'add_gold':
        if (effect.value) {
          // 添加一定范围内的随机金币
          const variance = effect.value * 0.5; // 50%浮动
          const minGold = Math.floor(effect.value - variance);
          const maxGold = Math.floor(effect.value + variance);
          const goldGained = randomInt(minGold, maxGold);
          updatePlayerGold(goldGained);
          effectMessage += `获得 ${goldGained} 金币 `;
        }
        break;
      case 'open_box':
        // 宝箱逻辑：随机选择一个物品
        if (effect.boxItems && effect.boxItems.length > 0) {
          const randomItem = randomChoice(effect.boxItems);
          addItem(randomItem, 1);
          const itemTemplate = getItemTemplate(randomItem);
          effectMessage += `开出了 ${itemTemplate?.name || randomItem} `;
        }
        break;
      case 'buff':
        // TODO: 实现增益效果
        if (effect.stat && effect.value && effect.duration) {
          effectMessage += `获得 ${effect.stat} +${effect.value} (${effect.duration}回合) `;
        }
        break;
      default:
        break;
    }
  }

  // 减少物品数量
  removeItem(itemId, 1);

  return {
    success: true,
    message: effectMessage || '使用成功',
    effects,
  };
}

/** 添加装备到背包 */
export function addEquipment(equipment: Equipment): boolean {
  const equipments = inventoryEquipments.value;

  if (equipments.length >= maxInventorySlots) {
    return false; // 背包已满
  }

  inventoryEquipments.value = [...equipments, equipment];
  return true;
}

/** 移除装备 */
export function removeEquipment(equipmentId: string): boolean {
  const equipments = inventoryEquipments.value;
  const newEquipments = equipments.filter((e) => e.id !== equipmentId);

  if (newEquipments.length === equipments.length) {
    return false; // 未找到装备
  }

  inventoryEquipments.value = newEquipments;
  return true;
}

/** 装备装备 */
export function equipItem(equipmentId: string): boolean {
  const equipment = inventoryEquipments.value.find((e) => e.id === equipmentId);
  if (!equipment) return false;

  // 获取装备模板以确定槽位
  import('@/constants/equipment').then(({ getEquipmentTemplate }) => {
    const template = getEquipmentTemplate(equipment.templateId);
    if (!template) return;

    const slots = equippedSlots.value;
    const slot = template.slot;

    // 处理戒指槽位（有两个）
    let targetSlot = slot;
    if (slot === 'ring1' || slot === 'ring2') {
      // 优先使用空槽位
      if (!slots.ring1) {
        targetSlot = 'ring1';
      } else if (!slots.ring2) {
        targetSlot = 'ring2';
      } else {
        // 两个槽位都有装备，替换ring1
        targetSlot = 'ring1';
      }
    }

    // 获取当前装备
    const currentEquipment = slots[targetSlot as keyof EquipmentSlots];

    // 卸下当前装备到背包
    if (currentEquipment) {
      inventoryEquipments.value = [...inventoryEquipments.value, currentEquipment];
    }

    // 装备新装备
    const newSlots = { ...slots };
    (newSlots as Record<string, Equipment | null>)[targetSlot] = equipment;
    equippedSlots.value = newSlots as EquipmentSlots;

    // 从背包移除
    removeEquipment(equipmentId);

    // 更新玩家属性
    updatePlayerStats();

    // 触发任务事件：装备物品
    const currentPlayer = player.value;
    if (currentPlayer) {
      updateEquipEvent(currentPlayer.id, equipment.templateId).catch(err =>
        console.error('[Inventory] Failed to trigger equip event:', err)
      );
    }
  });

  return true;
}

/** 卸下装备 */
export function unequipItem(slot: keyof EquipmentSlots): boolean {
  const slots = equippedSlots.value;
  const equipment = slots[slot];

  if (!equipment) return false;

  if (isInventoryFull.value) {
    return false; // 背包已满
  }

  // 从槽位移除
  const newSlots = { ...slots };
  (newSlots as Record<string, Equipment | null>)[slot] = null;
  equippedSlots.value = newSlots as EquipmentSlots;

  // 添加到背包
  addEquipment(equipment);

  // 更新玩家属性
  updatePlayerStats();

  return true;
}

/** 计算装备总属性 */
export function getEquipmentStats(): Partial<import('@/types').CombatStats> {
  const slots = equippedSlots.value;
  const stats: Partial<import('@/types').CombatStats> = {};

  for (const equipment of Object.values(slots)) {
    if (!equipment) continue;

    // 基础属性
    for (const [key, value] of Object.entries(equipment.baseStats)) {
      const currentValue = (stats as Record<string, number>)[key] || 0;
      (stats as Record<string, number>)[key] = currentValue + (value as number);
    }

    // 宝石属性加成
    if (equipment.gems && equipment.gems.length > 0) {
      for (const gem of equipment.gems) {
        if (!gem) continue;

        for (const [key, value] of Object.entries(gem.statBonus)) {
          const currentValue = (stats as Record<string, number>)[key] || 0;
          (stats as Record<string, number>)[key] = currentValue + (value as number);
        }
      }
    }
  }

  return stats;
}

/** 更新玩家属性 */
function updatePlayerStats(): void {
  // 这里可以触发玩家属性重新计算
  // 目前先简单实现
}

/** 清空背包 */
export function clearInventory(): void {
  inventoryItems.value = [];
  inventoryEquipments.value = [];
  equippedSlots.value = createEmptyEquipmentSlots();
  affixLockStates.value = new Map();
}

// ============================================
// 词条锁定状态管理
// ============================================

/** 词条锁定状态（key: equipmentId, value: 锁定的词条索引数组） */
export const affixLockStates = signal<Map<string, AffixLockState>>(new Map());

/** 当前选中的装备（用于洗练界面） */
export const selectedEquipmentForReforge = signal<Equipment | null>(null);

/** 获取装备的锁定词条索引 */
export function getLockedAffixIndices(equipmentId: string): number[] {
  const state = affixLockStates.value.get(equipmentId);
  return state?.lockedIndices ?? [];
}

/** 切换词条锁定状态 */
export function toggleAffixLock(equipmentId: string, affixIndex: number): void {
  const states = new Map(affixLockStates.value);
  const current = states.get(equipmentId);

  if (current) {
    const isLocked = current.lockedIndices.includes(affixIndex);

    if (isLocked) {
      // 解锁
      const newIndices = current.lockedIndices.filter(i => i !== affixIndex);
      if (newIndices.length === 0) {
        states.delete(equipmentId);
      } else {
        states.set(equipmentId, {
          ...current,
          lockedIndices: newIndices,
        });
      }
    } else {
      // 锁定（最多3条）
      if (current.lockedIndices.length < 3) {
        states.set(equipmentId, {
          ...current,
          lockedIndices: [...current.lockedIndices, affixIndex].sort((a, b) => a - b),
        });
      }
    }
  } else {
    // 首次锁定
    states.set(equipmentId, {
      equipmentId,
      lockedIndices: [affixIndex],
    });
  }

  affixLockStates.value = states;
}

/** 锁定词条 */
export function lockAffix(equipmentId: string, affixIndex: number): boolean {
  const states = new Map(affixLockStates.value);
  const current = states.get(equipmentId);

  if (current) {
    if (current.lockedIndices.includes(affixIndex)) {
      return true; // 已经锁定
    }
    if (current.lockedIndices.length >= 3) {
      return false; // 已达上限
    }
    states.set(equipmentId, {
      ...current,
      lockedIndices: [...current.lockedIndices, affixIndex].sort((a, b) => a - b),
    });
  } else {
    states.set(equipmentId, {
      equipmentId,
      lockedIndices: [affixIndex],
    });
  }

  affixLockStates.value = states;
  return true;
}

/** 解锁词条 */
export function unlockAffix(equipmentId: string, affixIndex: number): void {
  const states = new Map(affixLockStates.value);
  const current = states.get(equipmentId);

  if (current) {
    const newIndices = current.lockedIndices.filter(i => i !== affixIndex);
    if (newIndices.length === 0) {
      states.delete(equipmentId);
    } else {
      states.set(equipmentId, {
        ...current,
        lockedIndices: newIndices,
      });
    }
    affixLockStates.value = states;
  }
}

/** 解锁所有词条 */
export function unlockAllAffixes(equipmentId: string): void {
  const states = new Map(affixLockStates.value);
  states.delete(equipmentId);
  affixLockStates.value = states;
}

/** 清除装备的锁定状态（洗练后调用） */
export function clearAffixLockState(equipmentId: string): void {
  const states = new Map(affixLockStates.value);
  states.delete(equipmentId);
  affixLockStates.value = states;
}

/** 检查词条是否被锁定 */
export function isAffixLocked(equipmentId: string, affixIndex: number): boolean {
  const state = affixLockStates.value.get(equipmentId);
  return state?.lockedIndices.includes(affixIndex) ?? false;
}

/** 获取锁定词条数量 */
export function getLockedAffixCount(equipmentId: string): number {
  const state = affixLockStates.value.get(equipmentId);
  return state?.lockedIndices.length ?? 0;
}

/** 设置选中装备（用于洗练） */
export function setSelectedEquipmentForReforge(equipment: Equipment | null): void {
  selectedEquipmentForReforge.value = equipment;
}
