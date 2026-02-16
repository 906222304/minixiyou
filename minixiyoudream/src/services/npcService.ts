// NPC服务功能

import { signal } from '@preact/signals-react';
import { player, updatePlayerHp, updatePlayerMp, updatePlayerGold, updatePlayerPosition } from '@/signals/playerSignals';
import { addItem, inventoryItems, isInventoryFull } from '@/signals/inventorySignals';
import { showSuccess, showError } from '@/signals/uiSignals';
import { getShopConfig, getShopItemTemplates, type ShopItem } from '@/constants/shops';
import { getItemTemplate } from '@/constants/items';
import { getMap } from '@/constants/maps';
import type { ItemTemplate } from '@/types';

// ============================================
// 商店功能
// ============================================

/** 当前打开的商店ID */
export const currentShopId = signal<string | null>(null);

/** 商店是否打开 */
export const isShopOpen = signal<boolean>(false);

/** 打开商店 */
export function openShop(shopId: string): boolean {
  const shop = getShopConfig(shopId);
  if (!shop) {
    showError('商店不存在');
    return false;
  }

  currentShopId.value = shopId;
  isShopOpen.value = true;
  return true;
}

/** 关闭商店 */
export function closeShop(): void {
  currentShopId.value = null;
  isShopOpen.value = false;
}

/** 获取当前商店物品列表 */
export function getCurrentShopItems(): (ShopItem & { template: ItemTemplate })[] {
  const shopId = currentShopId.value;
  if (!shopId) return [];
  return getShopItemTemplates(shopId);
}

/** 购买物品结果 */
export interface BuyResult {
  success: boolean;
  message: string;
}

/** 购买物品 */
export function buyItem(itemTemplateId: string, quantity: number = 1): BuyResult {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { success: false, message: '玩家数据不存在' };
  }

  const shopId = currentShopId.value;
  if (!shopId) {
    return { success: false, message: '未打开商店' };
  }

  const shop = getShopConfig(shopId);
  if (!shop) {
    return { success: false, message: '商店不存在' };
  }

  // 查找物品
  const shopItem = shop.items.find(item => item.itemTemplateId === itemTemplateId);
  if (!shopItem) {
    return { success: false, message: '商店没有该物品' };
  }

  // 获取物品模板
  const template = getItemTemplate(itemTemplateId);
  if (!template) {
    return { success: false, message: '物品模板不存在' };
  }

  // 检查等级要求
  if (shopItem.levelRequirement && currentPlayer.level < shopItem.levelRequirement) {
    return { success: false, message: `需要等级 ${shopItem.levelRequirement}` };
  }

  // 计算价格（应用折扣）
  const discount = shopItem.discount ?? 1;
  const totalPrice = Math.floor((template.buyPrice ?? 0) * quantity * discount);

  // 检查金币
  if (currentPlayer.gold < totalPrice) {
    return { success: false, message: `金币不足，需要 ${totalPrice} 金币` };
  }

  // 检查背包空间
  if (isInventoryFull.value) {
    // 检查是否已有相同物品可堆叠
    const existingItem = inventoryItems.value.find(i => i.templateId === itemTemplateId);
    if (!existingItem) {
      return { success: false, message: '背包已满' };
    }
  }

  // 扣除金币
  updatePlayerGold(-totalPrice);

  // 添加物品
  const addSuccess = addItem(itemTemplateId, quantity);
  if (!addSuccess) {
    // 退还金币
    updatePlayerGold(totalPrice);
    return { success: false, message: '添加物品失败' };
  }

  showSuccess(`购买了 ${quantity} 个 ${template.name}，花费 ${totalPrice} 金币`);
  return { success: true, message: `成功购买 ${template.name} x${quantity}` };
}

/** 出售物品结果 */
export interface SellResult {
  success: boolean;
  message: string;
  goldReceived: number;
}

/** 出售物品 */
export function sellItem(itemId: string, quantity: number = 1): SellResult {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { success: false, message: '玩家数据不存在', goldReceived: 0 };
  }

  const shopId = currentShopId.value;
  if (!shopId) {
    return { success: false, message: '未打开商店', goldReceived: 0 };
  }

  const shop = getShopConfig(shopId);
  if (!shop) {
    return { success: false, message: '商店不存在', goldReceived: 0 };
  }

  // 查找背包物品
  const inventoryItem = inventoryItems.value.find(i => i.id === itemId);
  if (!inventoryItem) {
    return { success: false, message: '物品不存在', goldReceived: 0 };
  }

  if (inventoryItem.count < quantity) {
    return { success: false, message: '数量不足', goldReceived: 0 };
  }

  // 获取物品模板
  const template = getItemTemplate(inventoryItem.templateId);
  if (!template) {
    return { success: false, message: '物品模板不存在', goldReceived: 0 };
  }

  // 检查是否可出售
  if (!template.sellPrice || template.sellPrice <= 0) {
    return { success: false, message: '该物品无法出售', goldReceived: 0 };
  }

  // 计算出售价格（应用商店收购倍率）
  const buyMultiplier = shop.buyMultiplier ?? 0.5;
  const totalGold = Math.floor(template.sellPrice * quantity * buyMultiplier);

  // 从背包移除物品（通过直接操作信号）
  const items = inventoryItems.value;
  const index = items.findIndex(i => i.id === itemId);
  if (index < 0) {
    return { success: false, message: '物品不存在', goldReceived: 0 };
  }

  const item = items[index];
  if (item.count <= quantity) {
    // 完全移除
    inventoryItems.value = items.filter((_, i) => i !== index);
  } else {
    // 减少数量
    const newItems = [...items];
    newItems[index] = { ...item, count: item.count - quantity };
    inventoryItems.value = newItems;
  }

  // 增加金币
  updatePlayerGold(totalGold);

  showSuccess(`出售了 ${quantity} 个 ${template.name}，获得 ${totalGold} 金币`);
  return { success: true, message: `成功出售 ${template.name} x${quantity}`, goldReceived: totalGold };
}

// ============================================
// 治疗功能
// ============================================

/** 治疗结果 */
export interface HealResult {
  success: boolean;
  message: string;
  hpRestored: number;
  mpRestored: number;
  cost: number;
}

/** 治疗玩家 */
export function healPlayer(healCost: number): HealResult {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { success: false, message: '玩家数据不存在', hpRestored: 0, mpRestored: 0, cost: 0 };
  }

  // 检查是否需要治疗
  const needsHeal = currentPlayer.hp < currentPlayer.maxHp || currentPlayer.mp < currentPlayer.maxMp;
  if (!needsHeal) {
    return { success: false, message: '你的状态良好，不需要治疗', hpRestored: 0, mpRestored: 0, cost: 0 };
  }

  // 检查金币
  if (currentPlayer.gold < healCost) {
    return { success: false, message: `金币不足，需要 ${healCost} 金币`, hpRestored: 0, mpRestored: 0, cost: 0 };
  }

  // 计算恢复量
  const hpRestored = currentPlayer.maxHp - currentPlayer.hp;
  const mpRestored = currentPlayer.maxMp - currentPlayer.mp;

  // 扣除金币
  updatePlayerGold(-healCost);

  // 恢复HP和MP
  updatePlayerHp(hpRestored);
  updatePlayerMp(mpRestored);

  showSuccess(`治疗完成！恢复 HP:${hpRestored} MP:${mpRestored}，花费 ${healCost} 金币`);
  return {
    success: true,
    message: '治疗完成！',
    hpRestored,
    mpRestored,
    cost: healCost,
  };
}

/** 计算治疗费用（基于缺失的HP/MP） */
export function calculateHealCost(baseCost: number): number {
  const currentPlayer = player.value;
  if (!currentPlayer) return baseCost;

  const hpMissing = currentPlayer.maxHp - currentPlayer.hp;
  const mpMissing = currentPlayer.maxMp - currentPlayer.mp;
  const totalMissing = hpMissing + mpMissing;

  // 基础费用 + 每点缺失HP/MP的费用
  return baseCost + Math.floor(totalMissing * 0.1);
}

// ============================================
// 传送功能
// ============================================

/** 传送结果 */
export interface TeleportResult {
  success: boolean;
  message: string;
}

/** 传送到指定地图 */
export function teleportToMap(mapId: string, cost: number): TeleportResult {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { success: false, message: '玩家数据不存在' };
  }

  // 检查目标地图是否存在
  const targetMap = getMap(mapId);
  if (!targetMap) {
    return { success: false, message: '目标地图不存在' };
  }

  // 检查是否已在目标地图
  if (currentPlayer.currentMapId === mapId) {
    return { success: false, message: '你已在该地图' };
  }

  // 检查等级要求
  if (targetMap.levelRange.min > currentPlayer.level) {
    return { success: false, message: `需要等级 ${targetMap.levelRange.min} 才能进入` };
  }

  // 检查金币
  if (currentPlayer.gold < cost) {
    return { success: false, message: `金币不足，需要 ${cost} 金币` };
  }

  // 扣除金币
  if (cost > 0) {
    updatePlayerGold(-cost);
  }

  // 更新玩家位置
  updatePlayerPosition(mapId, targetMap.size.width / 2, targetMap.size.height / 2);

  showSuccess(`传送到 ${targetMap.name} 成功！${cost > 0 ? `花费 ${cost} 金币` : ''}`);
  return { success: true, message: `成功传送到 ${targetMap.name}` };
}

/** 获取可传送的目的地信息 */
export function getTeleportDestinationInfo(mapId: string): { name: string; levelRequirement: number } | null {
  const map = getMap(mapId);
  if (!map) return null;

  return {
    name: map.name,
    levelRequirement: map.levelRange.min,
  };
}
