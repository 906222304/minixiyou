// 宠物技能槽配置 - 参考梦幻西游打书系统

import type { PetQuality, Quality } from '@/types';

// ============================================
// 技能槽数量配置（根据宠物品质）
// ============================================

/** 宠物品质对应的技能槽数量范围 */
export interface PetSkillSlotConfig {
  quality: PetQuality;
  name: string;
  minSlots: number;           // 最小技能格数量
  maxSlots: number;           // 最大技能格数量
  baseSlots: number;          // 初始解锁技能格数量
  unlockCostMultiplier: number; // 解锁消耗倍率
}

/** 宠物品质技能槽配置 */
export const PET_SKILL_SLOT_CONFIG: Record<PetQuality, PetSkillSlotConfig> = {
  wild: {
    quality: 'wild',
    name: '野生',
    minSlots: 3,
    maxSlots: 5,
    baseSlots: 3,
    unlockCostMultiplier: 1.0,
  },
  baby: {
    quality: 'baby',
    name: '宝宝',
    minSlots: 4,
    maxSlots: 7,
    baseSlots: 4,
    unlockCostMultiplier: 1.2,
  },
  variant: {
    quality: 'variant',
    name: '变异',
    minSlots: 5,
    maxSlots: 9,
    baseSlots: 5,
    unlockCostMultiplier: 1.5,
  },
  divine: {
    quality: 'divine',
    name: '神兽',
    minSlots: 8,
    maxSlots: 12,
    baseSlots: 8,
    unlockCostMultiplier: 2.0,
  },
};

// ============================================
// 技能格解锁配置
// ============================================

/** 技能格解锁方式 */
export interface SkillSlotUnlockConfig {
  slotIndex: number;          // 技能格索引（1开始）
  unlockMethod: 'default' | 'level' | 'item';
  unlockLevel?: number;       // 等级解锁所需等级
  unlockItem?: string;        // 道具解锁所需道具ID
  unlockItemCount?: number;   // 道具数量
  goldCost?: number;          // 金币消耗
}

/** 技能格解锁配置表 */
export const SKILL_SLOT_UNLOCK_CONFIG: SkillSlotUnlockConfig[] = [
  // 前3格默认解锁
  { slotIndex: 1, unlockMethod: 'default' },
  { slotIndex: 2, unlockMethod: 'default' },
  { slotIndex: 3, unlockMethod: 'default' },
  // 第4-5格通过等级解锁
  { slotIndex: 4, unlockMethod: 'level', unlockLevel: 15, goldCost: 5000 },
  { slotIndex: 5, unlockMethod: 'level', unlockLevel: 30, goldCost: 15000 },
  // 第6-8格需要道具解锁（金柳露）
  { slotIndex: 6, unlockMethod: 'item', unlockItem: 'item_golden_dew', unlockItemCount: 1, goldCost: 30000 },
  { slotIndex: 7, unlockMethod: 'item', unlockItem: 'item_golden_dew', unlockItemCount: 2, goldCost: 50000 },
  { slotIndex: 8, unlockMethod: 'item', unlockItem: 'item_golden_dew', unlockItemCount: 3, goldCost: 80000 },
  // 第9-12格需要高级道具解锁
  { slotIndex: 9, unlockMethod: 'item', unlockItem: 'item_immortal_dew', unlockItemCount: 1, goldCost: 150000 },
  { slotIndex: 10, unlockMethod: 'item', unlockItem: 'item_immortal_dew', unlockItemCount: 2, goldCost: 250000 },
  { slotIndex: 11, unlockMethod: 'item', unlockItem: 'item_immortal_dew', unlockItemCount: 3, goldCost: 400000 },
  { slotIndex: 12, unlockMethod: 'item', unlockItem: 'item_immortal_dew', unlockItemCount: 5, goldCost: 600000 },
];

// ============================================
// 技能锁定配置
// ============================================

/** 技能锁定配置 */
export interface SkillLockConfig {
  maxLockedSkills: number;    // 最多锁定技能数量
  lockItem: string;           // 锁定道具ID
  lockItemCountPerSkill: number; // 每个技能消耗的道具数量
  lockGoldCost: number;       // 锁定金币消耗
  lockSuccessRatePenalty: number; // 锁定后的打书成功率惩罚（百分比减少）
}

/** 技能锁定配置 */
export const SKILL_LOCK_CONFIG: SkillLockConfig = {
  maxLockedSkills: 3,
  lockItem: 'item_lock_pearl',
  lockItemCountPerSkill: 1,
  lockGoldCost: 10000,
  lockSuccessRatePenalty: 15, // 锁定后成功率降低15%
};

// ============================================
// 道具配置
// ============================================

/** 开格道具配置 */
export interface SlotUnlockItemConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  quality: Quality;
  buyPrice: number;
  sellPrice: number;
}

/** 金柳露 - 开启技能格道具 */
export const GOLDEN_DEW_CONFIG: SlotUnlockItemConfig = {
  id: 'item_golden_dew',
  name: '金柳露',
  description: '神奇的露水，可以开启宠物的隐藏技能格。最多可开启第6-8个技能格。',
  icon: '💧',
  quality: 'rare',
  buyPrice: 50000,
  sellPrice: 20000,
};

/** 仙露 - 高级开格道具 */
export const IMMORTAL_DEW_CONFIG: SlotUnlockItemConfig = {
  id: 'item_immortal_dew',
  name: '仙露',
  description: '仙人采集的露水，可以开启宠物的潜能技能格。可开启第9-12个技能格。',
  icon: '✨',
  quality: 'legendary',
  buyPrice: 200000,
  sellPrice: 80000,
};

/** 锁妖珠 - 技能锁定道具 */
export const LOCK_PEARL_CONFIG: SlotUnlockItemConfig = {
  id: 'item_lock_pearl',
  name: '锁妖珠',
  description: '可以将宠物技能锁定，打书时不会被覆盖。最多同时锁定3个技能。',
  icon: '🔮',
  quality: 'epic',
  buyPrice: 30000,
  sellPrice: 12000,
};

// ============================================
// 辅助函数
// ============================================

/** 获取宠物品质对应的技能槽配置 */
export function getPetSkillSlotConfig(quality: PetQuality): PetSkillSlotConfig {
  return PET_SKILL_SLOT_CONFIG[quality];
}

/** 获取宠物初始技能格数量 */
export function getInitialSkillSlots(quality: PetQuality): number {
  return PET_SKILL_SLOT_CONFIG[quality].baseSlots;
}

/** 获取宠物最大技能格数量 */
export function getMaxSkillSlots(quality: PetQuality): number {
  return PET_SKILL_SLOT_CONFIG[quality].maxSlots;
}

/** 获取技能格解锁配置 */
export function getSkillSlotUnlockConfig(slotIndex: number): SkillSlotUnlockConfig | undefined {
  return SKILL_SLOT_UNLOCK_CONFIG.find(c => c.slotIndex === slotIndex);
}

/** 检查技能格是否可以解锁（根据等级） */
export function canUnlockSlotByLevel(slotIndex: number, petLevel: number): boolean {
  const config = getSkillSlotUnlockConfig(slotIndex);
  if (!config) return false;
  if (config.unlockMethod === 'default') return true;
  if (config.unlockMethod === 'level' && config.unlockLevel) {
    return petLevel >= config.unlockLevel;
  }
  return false;
}

/** 检查技能格是否需要道具解锁 */
export function needsItemUnlock(slotIndex: number): boolean {
  const config = getSkillSlotUnlockConfig(slotIndex);
  return config?.unlockMethod === 'item';
}

/** 获取解锁技能格所需道具 */
export function getSlotUnlockItem(slotIndex: number): { itemId: string; count: number } | null {
  const config = getSkillSlotUnlockConfig(slotIndex);
  if (!config || config.unlockMethod !== 'item') return null;
  return {
    itemId: config.unlockItem!,
    count: config.unlockItemCount!,
  };
}

/** 获取解锁技能格金币消耗 */
export function getSlotUnlockGoldCost(slotIndex: number, quality: PetQuality): number {
  const config = getSkillSlotUnlockConfig(slotIndex);
  const qualityConfig = getPetSkillSlotConfig(quality);
  const baseCost = config?.goldCost || 0;
  return Math.floor(baseCost * qualityConfig.unlockCostMultiplier);
}

/** 获取所有开格道具配置 */
export function getAllSlotUnlockItems(): SlotUnlockItemConfig[] {
  return [GOLDEN_DEW_CONFIG, IMMORTAL_DEW_CONFIG, LOCK_PEARL_CONFIG];
}

/** 计算宠物当前可用的技能格数量 */
export function getAvailableSkillSlots(
  quality: PetQuality,
  petLevel: number,
  unlockedSlots: number[]
): number {
  const baseSlots = getInitialSkillSlots(quality);
  let availableSlots = 0;

  for (let i = 1; i <= Math.max(baseSlots, ...unlockedSlots); i++) {
    const config = getSkillSlotUnlockConfig(i);
    if (!config) continue;

    if (config.unlockMethod === 'default') {
      availableSlots++;
    } else if (config.unlockMethod === 'level' && petLevel >= (config.unlockLevel || 0)) {
      availableSlots++;
    } else if (unlockedSlots.includes(i)) {
      availableSlots++;
    }
  }

  return availableSlots;
}
