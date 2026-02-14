// 宝石镶嵌服务 - 宝石镶嵌、拆卸、合成等功能

import { generateUUID } from '@/types/common';
import type { Gem, Equipment, GemType } from '@/types/equipment';
import {
  GEM_TYPE_CONFIG,
  GEM_LEVEL_CONFIG,
  getGemTypeConfig,
  canSocketGemInSlot,
  getRemoveGemCost,
  getSynthesizeCost,
  createGem,
} from '@/constants/gems';
import { getEquipmentTemplate } from '@/constants/equipment';

// ============================================
// 类型定义
// ============================================

/** 镶嵌结果 */
export interface SocketResult {
  success: boolean;
  equipment?: Equipment;
  error?: string;
  cost?: {
    gold: number;
  };
}

/** 拆卸结果 */
export interface RemoveResult {
  success: boolean;
  equipment?: Equipment;
  gem?: Gem;
  error?: string;
  cost?: {
    gold: number;
  };
}

/** 合成结果 */
export interface SynthesizeResult {
  success: boolean;
  newGem?: Gem;
  consumedGems: string[]; // 消耗的宝石ID列表
  error?: string;
  cost?: {
    gold: number;
  };
}

/** 镶嵌检查结果 */
export interface SocketCheckResult {
  canSocket: boolean;
  reason?: string;
}

/** 合成预览 */
export interface SynthesizePreview {
  canSynthesize: boolean;
  targetLevel: number;
  requiredGems: number;
  requiredGold: number;
  successRate: number;
  reason?: string;
}

// ============================================
// 镶嵌功能
// ============================================

/**
 * 检查是否可以镶嵌宝石
 * @param equipment 装备
 * @param gem 宝石
 * @param slotIndex 槽位索引
 */
export function canSocketGem(
  equipment: Equipment,
  gem: Gem,
  slotIndex: number
): SocketCheckResult {
  // 获取装备模板
  const template = getEquipmentTemplate(equipment.templateId);

  if (!template) {
    return { canSocket: false, reason: '装备模板不存在' };
  }

  // 检查槽位是否有效
  if (slotIndex < 0 || slotIndex >= template.gemSlots) {
    return { canSocket: false, reason: '无效的宝石槽位' };
  }

  // 检查槽位是否已有宝石
  if (equipment.gems[slotIndex]) {
    return { canSocket: false, reason: '该槽位已有宝石，请先拆卸' };
  }

  // 检查宝石类型是否兼容装备槽位
  if (!canSocketGemInSlot(template.slot, gem.type)) {
    const typeConfig = getGemTypeConfig(gem.type);
    return {
      canSocket: false,
      reason: `${typeConfig?.name || '该宝石'}无法镶嵌到此装备`
    };
  }

  // 检查装备是否允许该类型宝石
  if (template.allowedGems && template.allowedGems.length > 0) {
    if (!template.allowedGems.includes(gem.type)) {
      return { canSocket: false, reason: '该装备不支持此类型宝石' };
    }
  }

  return { canSocket: true };
}

/**
 * 镶嵌宝石到装备
 * @param equipment 装备
 * @param gem 宝石
 * @param slotIndex 槽位索引
 */
export function socketGem(
  equipment: Equipment,
  gem: Gem,
  slotIndex: number
): SocketResult {
  // 检查是否可以镶嵌
  const checkResult = canSocketGem(equipment, gem, slotIndex);
  if (!checkResult.canSocket) {
    return {
      success: false,
      error: checkResult.reason,
    };
  }

  // 创建新的宝石数组
  const newGems = [...equipment.gems];
  newGems[slotIndex] = { ...gem };

  // 返回更新后的装备
  const updatedEquipment: Equipment = {
    ...equipment,
    gems: newGems,
  };

  return {
    success: true,
    equipment: updatedEquipment,
    cost: { gold: 0 }, // 镶嵌免费
  };
}

/**
 * 拆卸宝石
 * @param equipment 装备
 * @param slotIndex 槽位索引
 * @param playerGold 玩家当前金币
 */
export function removeGem(
  equipment: Equipment,
  slotIndex: number,
  playerGold: number
): RemoveResult {
  // 获取装备模板
  const template = getEquipmentTemplate(equipment.templateId);

  if (!template) {
    return { success: false, error: '装备模板不存在' };
  }

  // 检查槽位是否有效
  if (slotIndex < 0 || slotIndex >= template.gemSlots) {
    return { success: false, error: '无效的宝石槽位' };
  }

  // 检查槽位是否有宝石
  const gem = equipment.gems[slotIndex];
  if (!gem) {
    return { success: false, error: '该槽位没有宝石' };
  }

  // 计算拆卸费用
  const cost = getRemoveGemCost(gem.level);

  // 检查金币是否足够
  if (playerGold < cost) {
    return {
      success: false,
      error: `金币不足，拆卸需要 ${cost.toLocaleString()} 金币`,
    };
  }

  // 创建新的宝石数组
  const newGems = [...equipment.gems];
  newGems[slotIndex] = null;

  // 返回更新后的装备和拆卸的宝石
  const updatedEquipment: Equipment = {
    ...equipment,
    gems: newGems,
  };

  return {
    success: true,
    equipment: updatedEquipment,
    gem: gem,
    cost: { gold: cost },
  };
}

// ============================================
// 合成功能
// ============================================

/**
 * 获取合成预览
 * @param gems 用于合成的宝石列表
 */
export function getSynthesizePreview(gems: Gem[]): SynthesizePreview {
  if (gems.length === 0) {
    return {
      canSynthesize: false,
      targetLevel: 0,
      requiredGems: 0,
      requiredGold: 0,
      successRate: 0,
      reason: '请选择宝石进行合成',
    };
  }

  // 检查所有宝石是否同类型同等级
  const firstGem = gems[0];
  const allSame = gems.every(
    gem => gem.type === firstGem.type && gem.level === firstGem.level
  );

  if (!allSame) {
    return {
      canSynthesize: false,
      targetLevel: 0,
      requiredGems: 0,
      requiredGold: 0,
      successRate: 0,
      reason: '只能合成同类型同等级的宝石',
    };
  }

  const targetLevel = firstGem.level + 1;
  const maxLevel = GEM_LEVEL_CONFIG.length;

  // 检查是否已达最高等级
  if (targetLevel > maxLevel) {
    return {
      canSynthesize: false,
      targetLevel,
      requiredGems: 0,
      requiredGold: 0,
      successRate: 0,
      reason: '已达最高等级，无法继续合成',
    };
  }

  const costConfig = getSynthesizeCost(targetLevel);

  // 检查宝石数量是否足够
  if (gems.length < costConfig.gems) {
    return {
      canSynthesize: false,
      targetLevel,
      requiredGems: costConfig.gems,
      requiredGold: costConfig.gold,
      successRate: costConfig.successRate,
      reason: `需要 ${costConfig.gems} 颗同等级宝石`,
    };
  }

  return {
    canSynthesize: true,
    targetLevel,
    requiredGems: costConfig.gems,
    requiredGold: costConfig.gold,
    successRate: costConfig.successRate,
  };
}

/**
 * 合成宝石
 * @param gems 用于合成的宝石列表
 * @param playerGold 玩家当前金币
 * @param prng 随机数生成器
 */
export function synthesizeGem(
  gems: Gem[],
  playerGold: number,
  prng: { next: () => number }
): SynthesizeResult {
  // 获取预览信息
  const preview = getSynthesizePreview(gems);

  if (!preview.canSynthesize) {
    return {
      success: false,
      consumedGems: [],
      error: preview.reason,
    };
  }

  // 检查金币是否足够
  if (playerGold < preview.requiredGold) {
    return {
      success: false,
      consumedGems: [],
      error: `金币不足，合成需要 ${preview.requiredGold.toLocaleString()} 金币`,
    };
  }

  // 取出需要的宝石数量
  const gemsToUse = gems.slice(0, preview.requiredGems);
  const firstGem = gemsToUse[0];

  // 概率判定
  const roll = prng.next();
  if (roll > preview.successRate) {
    // 合成失败，宝石消失
    return {
      success: false,
      consumedGems: gemsToUse.map(g => g.id),
      error: '合成失败，宝石已消失',
      cost: { gold: preview.requiredGold },
    };
  }

  // 合成成功，创建新宝石
  const newGem = createGem(
    firstGem.type,
    preview.targetLevel,
    generateUUID()
  );

  return {
    success: true,
    newGem,
    consumedGems: gemsToUse.map(g => g.id),
    cost: { gold: preview.requiredGold },
  };
}

// ============================================
// 辅助功能
// ============================================

/**
 * 获取宝石属性加成描述
 * @param gem 宝石
 */
export function getGemStatBonusDescription(gem: Gem): string[] {
  const descriptions: string[] = [];
  const statNames: Record<keyof import('@/types/common').BaseStats, string> = {
    strength: '力量',
    intelligence: '灵力',
    vitality: '体质',
    agility: '敏捷',
    willpower: '魔力',
  };

  for (const [stat, value] of Object.entries(gem.statBonus)) {
    const statKey = stat as keyof typeof statNames;
    if (value && value > 0) {
      descriptions.push(`${statNames[statKey]}+${value}`);
    }
  }

  return descriptions;
}

/**
 * 获取宝石完整描述
 * @param gem 宝石
 */
export function getGemFullDescription(gem: Gem): string {
  const typeConfig = getGemTypeConfig(gem.type);
  const statDesc = getGemStatBonusDescription(gem).join(', ');
  return `${typeConfig?.description || ''}\n属性: ${statDesc}`;
}

/**
 * 计算装备上所有宝石的总属性加成
 * @param equipment 装备
 */
export function getTotalGemStats(
  equipment: Equipment
): Partial<import('@/types/common').BaseStats> {
  const totalStats: Partial<import('@/types/common').BaseStats> = {};

  for (const gem of equipment.gems) {
    if (!gem) continue;

    for (const [stat, value] of Object.entries(gem.statBonus)) {
      const currentValue = totalStats[stat as keyof typeof totalStats] || 0;
      totalStats[stat as keyof typeof totalStats] = currentValue + (value as number);
    }
  }

  return totalStats;
}

/**
 * 获取装备空余槽位数量
 * @param equipment 装备
 */
export function getEmptySlotCount(equipment: Equipment): number {
  const template = getEquipmentTemplate(equipment.templateId);
  if (!template) return 0;

  let count = 0;
  for (let i = 0; i < template.gemSlots; i++) {
    if (!equipment.gems[i]) {
      count++;
    }
  }
  return count;
}

/**
 * 获取装备已镶嵌宝石数量
 * @param equipment 装备
 */
export function getSocketedGemCount(equipment: Equipment): number {
  const template = getEquipmentTemplate(equipment.templateId);
  if (!template) return 0;

  let count = 0;
  for (let i = 0; i < template.gemSlots; i++) {
    if (equipment.gems[i]) {
      count++;
    }
  }
  return count;
}

/**
 * 获取装备宝石槽位信息
 * @param equipment 装备
 */
export function getGemSlotInfo(
  equipment: Equipment
): Array<{ index: number; gem: Gem | null; canSocket: GemType[] }> {
  const template = getEquipmentTemplate(equipment.templateId);
  if (!template) return [];

  const slots: Array<{ index: number; gem: Gem | null; canSocket: GemType[] }> = [];

  for (let i = 0; i < template.gemSlots; i++) {
    slots.push({
      index: i,
      gem: equipment.gems[i] || null,
      canSocket: template.allowedGems && template.allowedGems.length > 0
        ? template.allowedGems
        : Object.keys(GEM_TYPE_CONFIG) as GemType[],
    });
  }

  return slots;
}

// ============================================
// 服务导出
// ============================================

export const gemService = {
  // 镶嵌
  canSocketGem,
  socketGem,
  removeGem,

  // 合成
  getSynthesizePreview,
  synthesizeGem,

  // 辅助
  getGemStatBonusDescription,
  getGemFullDescription,
  getTotalGemStats,
  getEmptySlotCount,
  getSocketedGemCount,
  getGemSlotInfo,
};
