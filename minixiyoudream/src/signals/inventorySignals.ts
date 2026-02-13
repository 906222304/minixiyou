// 背包状态管理

import { signal, computed } from '@preact/signals-react';
import type { Item, Equipment, EquipmentSlots } from '@/types';
import { generateUUID } from '@/types';
import { createEmptyEquipmentSlots } from '@/types/equipment';

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

    // TODO: 加入宝石属性
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
}
