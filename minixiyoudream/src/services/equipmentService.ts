// 装备系统服务 - 强化、特效、套装效果计算、分解、重铸、传承

import { signal } from '@preact/signals-react';
import type {
  Equipment,
  EnhanceResult,
  EnhancementConfig,
  EnhancementPityState,
  CombatStats,
  EquipmentEffectType,
  SpecialSkillType,
  SetBonusEffect,
  Quality,
  Affix,
} from '@/types';
import {
  getSpecialEffect,
  getSpecialSkill,
  rollSpecialEffect,
  rollSpecialSkill,
} from '@/constants/equipmentEffects';
import {
  getEquipmentSetConfig,
  calculateSetBonuses,
} from '@/constants/equipmentSets';
import {
  getEquipmentTemplate,
  canFactionUseEquipment,
} from '@/constants/equipment';
import { QUALITY_CONFIG, QUALITY_ORDER, generateUUID } from '@/types/common';

// ==================== 强化系统配置 ====================

/** 强化配置表 */
const ENHANCEMENT_CONFIGS: EnhancementConfig[] = [
  // 1-5级: 100%成功
  {
    levelRange: [1, 5],
    successRate: 1.0,
    downgradeOnFail: 0,
    canDestroy: false,
    costBase: 100,
    costMultiplier: 1.5,
  },
  // 6-10级: 90%成功，失败不掉级
  {
    levelRange: [6, 10],
    successRate: 0.9,
    downgradeOnFail: 0,
    canDestroy: false,
    costBase: 500,
    costMultiplier: 1.8,
  },
  // 11-15级: 70%成功，失败降1级
  {
    levelRange: [11, 15],
    successRate: 0.7,
    downgradeOnFail: 1,
    canDestroy: false,
    costBase: 2000,
    costMultiplier: 2.0,
  },
  // 16-20级: 50%成功，失败可能碎装备
  {
    levelRange: [16, 20],
    successRate: 0.5,
    downgradeOnFail: 1,
    canDestroy: true,
    destroyChance: 0.2,
    costBase: 10000,
    costMultiplier: 2.5,
  },
];

/** 保底机制：连续失败3次后必定成功 */
const PITY_THRESHOLD = 3;

// ==================== 信号状态 ====================

/** 保底状态（按角色存储） */
const pityStates = signal<Record<string, EnhancementPityState>>({});

// ==================== 强化系统 ====================

/** 获取强化配置 */
function getEnhancementConfig(level: number): EnhancementConfig | undefined {
  return ENHANCEMENT_CONFIGS.find(
    (config) => level >= config.levelRange[0] && level <= config.levelRange[1]
  );
}

/** 计算强化消耗 */
export function calculateEnhancementCost(equipment: Equipment): number {
  const config = getEnhancementConfig(equipment.enhanceLevel + 1);
  if (!config) return 0;

  const qualityMultiplier = QUALITY_CONFIG[equipment.quality]?.multiplier || 1;
  return Math.floor(
    config.costBase * Math.pow(config.costMultiplier, equipment.enhanceLevel) * qualityMultiplier
  );
}

/** 获取强化成功率 */
export function getEnhancementSuccessRate(level: number, ownerId?: string): number {
  const config = getEnhancementConfig(level);
  if (!config) return 0;

  // 检查保底
  if (ownerId && pityStates.value[ownerId]?.guaranteedSuccess) {
    return 1.0;
  }

  return config.successRate;
}

/** 执行强化 */
export function enhanceEquipment(equipment: Equipment, ownerId?: string): EnhanceResult {
  const currentLevel = equipment.enhanceLevel;
  const nextLevel = currentLevel + 1;

  // 获取模板检查强化上限
  const template = getEquipmentTemplate(equipment.templateId);
  if (template && nextLevel > template.maxEnhance) {
    return {
      success: false,
      newLevel: currentLevel,
      broken: false,
      destroyed: false,
      cost: 0,
    };
  }

  const config = getEnhancementConfig(nextLevel);
  if (!config) {
    return {
      success: false,
      newLevel: currentLevel,
      broken: false,
      destroyed: false,
      cost: 0,
    };
  }

  const cost = calculateEnhancementCost(equipment);

  // 检查保底
  let pityState = ownerId ? pityStates.value[ownerId] : undefined;
  const hasPity = pityState?.guaranteedSuccess || false;

  // 计算成功率
  let successRate = config.successRate;
  if (hasPity) {
    successRate = 1.0;
  }

  // 判定结果
  const roll = Math.random();
  const success = roll < successRate;

  if (success) {
    // 成功：重置保底
    if (ownerId) {
      pityStates.value = {
        ...pityStates.value,
        [ownerId]: { consecutiveFails: 0, guaranteedSuccess: false },
      };
    }

    return {
      success: true,
      newLevel: nextLevel,
      broken: false,
      destroyed: false,
      cost,
    };
  }

  // 失败：更新保底
  if (ownerId) {
    const currentFails = pityState?.consecutiveFails || 0;
    const newFails = currentFails + 1;
    pityStates.value = {
      ...pityStates.value,
      [ownerId]: {
        consecutiveFails: newFails,
        guaranteedSuccess: newFails >= PITY_THRESHOLD,
      },
    };
  }

  // 处理失败惩罚
  let newLevel = currentLevel;

  // 检查是否碎装备
  if (config.canDestroy && config.destroyChance) {
    if (Math.random() < config.destroyChance) {
      return {
        success: false,
        newLevel: 0,
        broken: true,
        destroyed: true,
        cost,
      };
    }
  }

  // 降级
  if (config.downgradeOnFail > 0) {
    newLevel = Math.max(0, currentLevel - config.downgradeOnFail);
  }

  return {
    success: false,
    newLevel,
    broken: newLevel < currentLevel,
    destroyed: false,
    cost,
  };
}

/** 计算强化后的属性 */
export function calculateEnhancedStats(
  baseStats: Partial<CombatStats>,
  enhanceLevel: number
): Partial<CombatStats> {
  const enhanced: Partial<CombatStats> = { ...baseStats };
  const bonusMultiplier = 1 + enhanceLevel * 0.1; // 每级增加10%

  for (const key of Object.keys(enhanced) as (keyof CombatStats)[]) {
    const value = enhanced[key];
    if (value !== undefined && typeof value === 'number') {
      enhanced[key] = Math.floor(value * bonusMultiplier);
    }
  }

  return enhanced;
}

// ==================== 特效系统 ====================

/** 检查特效是否触发 */
export function checkEffectTrigger(
  effectType: EquipmentEffectType,
  context: {
    currentHp?: number;
    maxHp?: number;
    isDead?: boolean;
    isTakingDamage?: boolean;
    isAttacking?: boolean;
  }
): boolean {
  const effect = getSpecialEffect(effectType);
  if (!effect || !effect.trigger) return false;

  const { trigger } = effect;

  switch (trigger.type) {
    case 'on_death':
      return context.isDead === true;

    case 'on_damage':
      return context.isTakingDamage === true;

    case 'on_attack':
      return context.isAttacking === true;

    case 'low_hp':
      if (context.currentHp !== undefined && context.maxHp !== undefined) {
        const hpPercent = context.currentHp / context.maxHp;
        return hpPercent <= (trigger.threshold || 0.3);
      }
      return false;

    case 'passive':
      return true;

    default:
      return false;
  }
}

/** 计算特效效果 */
export function calculateEffectValue(
  effectType: EquipmentEffectType
): number {
  const effect = getSpecialEffect(effectType);
  if (!effect) return 0;

  return effect.value;
}

/** 计算神佑复活效果 */
export function calculateBlessingRevive(
  maxHp: number
): { revived: boolean; healAmount: number } {
  const effect = getSpecialEffect('blessing');
  if (!effect) return { revived: false, healAmount: 0 };

  // 20%概率复活
  if (Math.random() > effect.value) {
    return { revived: false, healAmount: 0 };
  }

  // 复活后恢复30%生命值
  const healPercent = effect.trigger?.threshold || 0.3;
  return { revived: true, healAmount: Math.floor(maxHp * healPercent) };
}

/** 计算荆棘反弹伤害 */
export function calculateThornsDamage(receivedDamage: number): number {
  const effect = getSpecialEffect('thorns');
  if (!effect) return 0;

  return Math.floor(receivedDamage * effect.value);
}

/** 计算狂暴伤害加成 */
export function calculateBerserkBonus(): number {
  const effect = getSpecialEffect('berserk');
  if (!effect) return 0;

  return effect.value;
}

// ==================== 特技系统 ====================

/** 获取特技信息 */
export function getSpecialSkillInfo(skillType: SpecialSkillType) {
  return getSpecialSkill(skillType);
}

/** 使用特技 */
export function useSpecialSkill(
  skillType: SpecialSkillType,
  currentRage: number
): { canUse: boolean; rageCost: number; cooldown: number } {
  const skill = getSpecialSkill(skillType);
  if (!skill) {
    return { canUse: false, rageCost: 0, cooldown: 0 };
  }

  const canUse = currentRage >= skill.rageCost;
  return {
    canUse,
    rageCost: skill.rageCost,
    cooldown: skill.cooldown,
  };
}

/** 计算特技伤害/治疗效果 */
export function calculateSpecialSkillEffect(
  skillType: SpecialSkillType,
  casterStats: Partial<CombatStats>
): { damage: number; heal: number; targetType: string } {
  const skill = getSpecialSkill(skillType);
  if (!skill) {
    return { damage: 0, heal: 0, targetType: 'self' };
  }

  let damage = 0;
  let heal = 0;

  for (const effect of skill.effects) {
    if (effect.type === 'damage') {
      damage += effect.value || 0;
    } else if (effect.type === 'heal') {
      if (effect.isPercent && casterStats.maxHp) {
        heal += Math.floor(casterStats.maxHp * (effect.value || 0));
      } else {
        heal += effect.value || 0;
      }
    }
  }

  return {
    damage,
    heal,
    targetType: skill.targetType,
  };
}

// ==================== 套装系统 ====================

/** 计算装备中的套装件数 */
export function countSetPieces(
  equipment: Equipment[],
  setId: string
): number {
  return equipment.filter((e) => e && e.setId === setId).length;
}

/** 获取所有激活的套装效果 */
export function getActiveSetBonuses(equipment: Equipment[]): Map<string, SetBonusEffect[]> {
  const bonuses = new Map<string, SetBonusEffect[]>();

  // 统计每个套装的件数
  const setCounts = new Map<string, number>();
  for (const equip of equipment) {
    if (equip && equip.setId) {
      const count = setCounts.get(equip.setId) || 0;
      setCounts.set(equip.setId, count + 1);
    }
  }

  // 计算激活的套装效果
  for (const [setId, count] of setCounts) {
    const setBonuses = calculateSetBonuses(setId, count);
    if (setBonuses.length > 0) {
      bonuses.set(setId, setBonuses);
    }
  }

  return bonuses;
}

/** 计算套装总属性加成 */
export function calculateSetTotalStats(equipment: Equipment[]): Partial<CombatStats> {
  const activeBonuses = getActiveSetBonuses(equipment);
  const totalStats: Partial<CombatStats> = {};

  for (const [_setId, bonuses] of activeBonuses) {
    for (const bonus of bonuses) {
      if (bonus.stat && (bonus.type === 'stat_flat' || bonus.type === 'stat_percent')) {
        const currentValue = totalStats[bonus.stat] || 0;
        totalStats[bonus.stat] = currentValue + bonus.value;
      }
    }
  }

  return totalStats;
}

/** 获取套装效果描述列表 */
export function getSetBonusDescriptions(equipment: Equipment[]): string[] {
  const descriptions: string[] = [];
  const activeBonuses = getActiveSetBonuses(equipment);

  for (const [setId, bonuses] of activeBonuses) {
    const setConfig = getEquipmentSetConfig(setId);
    if (setConfig) {
      descriptions.push(`【${setConfig.name}】`);
      for (const bonus of bonuses) {
        descriptions.push(`  ${bonus.description}`);
      }
    }
  }

  return descriptions;
}

// ==================== 装备生成 ====================

/** 生成装备实例 */
export function createEquipment(
  templateId: string,
  options: {
    quality?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    ownerId?: string;
    withSpecialEffect?: boolean;
    withSpecialSkill?: boolean;
    luck?: number;
  } = {}
): Equipment | null {
  const template = getEquipmentTemplate(templateId);
  if (!template) return null;

  const quality = options.quality || template.baseQuality;
  const qualityConfig = QUALITY_CONFIG[quality];

  // 计算基础属性
  const baseStats: Partial<CombatStats> = {};
  for (const [key, value] of Object.entries(template.baseStats)) {
    baseStats[key as keyof CombatStats] = Math.floor(
      (value as number) * qualityConfig.multiplier
    );
  }

  const equipment: Equipment = {
    id: generateUUID(),
    templateId,
    name: template.name,
    quality,
    enhanceLevel: 0,
    baseStats,
    affixes: [],
    gems: Array(template.gemSlots).fill(null),
    setId: template.setId,
    ownerId: options.ownerId,
    durability: 100,
    maxDurability: 100,
  };

  // 随机添加特效（高品质装备概率更高）
  if (options.withSpecialEffect || (quality !== 'common' && Math.random() < 0.1 * qualityConfig.multiplier)) {
    const effect = rollSpecialEffect(template.slot, options.luck || 0);
    if (effect) {
      equipment.specialEffect = {
        type: effect.id,
        name: effect.name,
        description: effect.description,
        value: effect.value,
      };
    }
  }

  // 随机添加特技（传说及以上品质）
  if (options.withSpecialSkill || ((quality === 'legendary' || quality === 'mythic') && Math.random() < 0.2)) {
    const skill = rollSpecialSkill(template.slot, options.luck || 0);
    if (skill) {
      equipment.specialSkill = {
        type: skill.id,
        name: skill.name,
        description: skill.description,
        rageCost: skill.rageCost,
        cooldown: skill.cooldown,
        currentCooldown: 0,
      };
    }
  }

  return equipment;
}

/** 计算装备总属性（含强化、宝石、套装） */
export function calculateEquipmentTotalStats(
  equipment: Equipment
): Partial<CombatStats> {
  // 基础属性 + 强化加成
  const enhancedStats = calculateEnhancedStats(equipment.baseStats, equipment.enhanceLevel);

  // 宝石加成
  const gemStats: Partial<CombatStats> = {};
  if (equipment.gems) {
    for (const gem of equipment.gems) {
      if (gem && gem.statBonus) {
        for (const [key, value] of Object.entries(gem.statBonus)) {
          const currentValue = gemStats[key as keyof CombatStats] || 0;
          gemStats[key as keyof CombatStats] = currentValue + (value as number);
        }
      }
    }
  }

  // 合并属性
  const totalStats: Partial<CombatStats> = { ...enhancedStats };
  for (const [key, value] of Object.entries(gemStats)) {
    const currentValue = totalStats[key as keyof CombatStats] || 0;
    totalStats[key as keyof CombatStats] = currentValue + (value as number);
  }

  return totalStats;
}

// ==================== 导出服务 ====================

export const equipmentService = {
  // 强化系统
  enhanceEquipment,
  calculateEnhancementCost,
  getEnhancementSuccessRate,
  calculateEnhancedStats,

  // 特效系统
  checkEffectTrigger,
  calculateEffectValue,
  calculateBlessingRevive,
  calculateThornsDamage,
  calculateBerserkBonus,

  // 特技系统
  getSpecialSkillInfo,
  useSpecialSkill,
  calculateSpecialSkillEffect,

  // 套装系统
  countSetPieces,
  getActiveSetBonuses,
  calculateSetTotalStats,
  getSetBonusDescriptions,

  // 装备生成
  createEquipment,
  calculateEquipmentTotalStats,
  canFactionUseEquipment,
};

// ==================== 分解系统 ====================

/** 分解结果 */
export interface DecomposeResult {
  success: boolean;
  materials: DecomposeMaterial[];
  goldReturn: number;
  enhanceStoneReturn: number;
}

/** 分解材料 */
export interface DecomposeMaterial {
  itemId: string;
  name: string;
  count: number;
  icon: string;
}

/** 分解配置（按品质） */
const DECOMPOSE_CONFIG: Record<Quality, { materials: { itemId: string; count: [number, number] }[]; goldBase: number }> = {
  common: {
    materials: [
      { itemId: 'item_iron_ore', count: [1, 3] },
    ],
    goldBase: 10,
  },
  uncommon: {
    materials: [
      { itemId: 'item_iron_ore', count: [2, 5] },
      { itemId: 'item_copper_ore', count: [1, 3] },
    ],
    goldBase: 30,
  },
  rare: {
    materials: [
      { itemId: 'item_iron_ore', count: [3, 6] },
      { itemId: 'item_silver_ore', count: [1, 2] },
      { itemId: 'item_reforge_stone', count: [1, 1] },
    ],
    goldBase: 100,
  },
  epic: {
    materials: [
      { itemId: 'item_silver_ore', count: [2, 4] },
      { itemId: 'item_gold_ore', count: [1, 2] },
      { itemId: 'item_reforge_stone_advanced', count: [1, 1] },
      { itemId: 'item_enhance_stone', count: [1, 2] },
    ],
    goldBase: 300,
  },
  legendary: {
    materials: [
      { itemId: 'item_gold_ore', count: [2, 4] },
      { itemId: 'item_dragon_scale', count: [1, 2] },
      { itemId: 'item_reforge_stone_advanced', count: [1, 2] },
      { itemId: 'item_enhance_stone_advanced', count: [1, 2] },
    ],
    goldBase: 800,
  },
  mythic: {
    materials: [
      { itemId: 'item_dragon_scale', count: [2, 4] },
      { itemId: 'item_dragon_blood', count: [1, 1] },
      { itemId: 'item_fairy_dust', count: [1, 3] },
      { itemId: 'item_enhance_stone_supreme', count: [1, 2] },
    ],
    goldBase: 2000,
  },
};

/** 计算分解结果 */
export function calculateDecomposeResult(equipment: Equipment): DecomposeResult {
  const config = DECOMPOSE_CONFIG[equipment.quality];
  if (!config) {
    return { success: false, materials: [], goldReturn: 0, enhanceStoneReturn: 0 };
  }

  const materials: DecomposeMaterial[] = [];

  // 基础材料
  for (const mat of config.materials) {
    const count = Math.floor(Math.random() * (mat.count[1] - mat.count[0] + 1)) + mat.count[0];
    if (count > 0) {
      materials.push({
        itemId: mat.itemId,
        name: getItemName(mat.itemId),
        count,
        icon: getItemIcon(mat.itemId),
      });
    }
  }

  // 金币返还
  let goldReturn = config.goldBase;

  // 强化返还（每级返还一定金币和强化石）
  let enhanceStoneReturn = 0;
  if (equipment.enhanceLevel > 0) {
    goldReturn += equipment.enhanceLevel * 50;
    enhanceStoneReturn = Math.floor(equipment.enhanceLevel / 3); // 每3级返还1个强化石
    if (enhanceStoneReturn > 0) {
      materials.push({
        itemId: 'item_enhance_stone',
        name: '强化石',
        count: enhanceStoneReturn,
        icon: '💎',
      });
    }
  }

  return { success: true, materials, goldReturn, enhanceStoneReturn };
}

/** 分解装备 */
export function decomposeEquipment(equipment: Equipment): DecomposeResult {
  return calculateDecomposeResult(equipment);
}

// ==================== 重铸系统 ====================

/** 重铸结果 */
export interface ReforgeResult {
  success: boolean;
  equipment?: Equipment;
  cost: {
    gold: number;
    reforgeStones: number;
    lockStones: number;
  };
  error?: string;
}

/** 重铸配置（按品质） */
const REFORGE_CONFIG: Record<Quality, { goldCost: number; stoneCost: number; lockStoneCost: number }> = {
  common: { goldCost: 100, stoneCost: 1, lockStoneCost: 1 },
  uncommon: { goldCost: 200, stoneCost: 1, lockStoneCost: 1 },
  rare: { goldCost: 500, stoneCost: 2, lockStoneCost: 2 },
  epic: { goldCost: 1500, stoneCost: 3, lockStoneCost: 3 },
  legendary: { goldCost: 5000, stoneCost: 5, lockStoneCost: 5 },
  mythic: { goldCost: 15000, stoneCost: 8, lockStoneCost: 8 },
};

/** 计算重铸消耗 */
export function calculateReforgeCost(equipment: Equipment, lockedAffixCount: number = 0): { gold: number; reforgeStones: number; lockStones: number } {
  const config = REFORGE_CONFIG[equipment.quality];
  if (!config) {
    return { gold: 0, reforgeStones: 0, lockStones: 0 };
  }

  return {
    gold: config.goldCost,
    reforgeStones: config.stoneCost,
    lockStones: lockedAffixCount * config.lockStoneCost,
  };
}

/** 重铸装备 */
export function reforgeEquipment(
  equipment: Equipment,
  lockedAffixIndices: number[],
  playerGold: number,
  reforgeStones: number,
  lockStones: number
): ReforgeResult {
  const cost = calculateReforgeCost(equipment, lockedAffixIndices.length);

  // 检查资源
  if (playerGold < cost.gold) {
    return { success: false, cost, error: `金币不足，需要 ${cost.gold} 金币` };
  }
  if (reforgeStones < cost.reforgeStones) {
    return { success: false, cost, error: `洗练石不足，需要 ${cost.reforgeStones} 个` };
  }
  if (lockStones < cost.lockStones) {
    return { success: false, cost, error: `锁定石不足，需要 ${cost.lockStones} 个` };
  }

  const template = getEquipmentTemplate(equipment.templateId);
  if (!template) {
    return { success: false, cost, error: '装备模板不存在' };
  }

  // 生成新的词条（排除已锁定的数量）
  const newAffixCount = equipment.affixes.length - lockedAffixIndices.length;
  const qualityConfig = QUALITY_CONFIG[equipment.quality];
  const newAffixes = generateRandomAffixesLocal(
    equipment.quality,
    newAffixCount,
    qualityConfig.multiplier
  );

  // 合并词条
  const finalAffixes: Affix[] = [];
  let newAffixIndex = 0;
  for (let i = 0; i < equipment.affixes.length; i++) {
    if (lockedAffixIndices.includes(i)) {
      finalAffixes.push(equipment.affixes[i]);
    } else if (newAffixIndex < newAffixes.length) {
      finalAffixes.push(newAffixes[newAffixIndex]);
      newAffixIndex++;
    }
  }

  // 创建重铸后的装备
  const reforgedEquipment: Equipment = {
    ...equipment,
    affixes: finalAffixes,
  };

  return {
    success: true,
    equipment: reforgedEquipment,
    cost,
  };
}

// ==================== 传承系统 ====================

/** 传承结果 */
export interface TransferResult {
  success: boolean;
  sourceEquipment?: Equipment;  // 传承后的源装备（强化等级归零）
  targetEquipment?: Equipment;  // 传承后的目标装备
  cost: {
    gold: number;
    transferCharms: number;
  };
  error?: string;
}

/** 传承配置（按强化等级） */
const TRANSFER_CONFIG: Record<number, { goldCost: number; charmCost: number; successRate: number }> = {
  1: { goldCost: 100, charmCost: 1, successRate: 0.80 },
  2: { goldCost: 200, charmCost: 1, successRate: 0.80 },
  3: { goldCost: 400, charmCost: 1, successRate: 0.80 },
  4: { goldCost: 800, charmCost: 2, successRate: 0.80 },
  5: { goldCost: 1500, charmCost: 2, successRate: 0.80 },
  6: { goldCost: 3000, charmCost: 3, successRate: 0.80 },
  7: { goldCost: 5000, charmCost: 3, successRate: 0.80 },
  8: { goldCost: 8000, charmCost: 4, successRate: 0.80 },
  9: { goldCost: 12000, charmCost: 4, successRate: 0.80 },
  10: { goldCost: 18000, charmCost: 5, successRate: 0.80 },
  11: { goldCost: 25000, charmCost: 6, successRate: 0.80 },
  12: { goldCost: 35000, charmCost: 7, successRate: 0.80 },
  13: { goldCost: 50000, charmCost: 8, successRate: 0.80 },
  14: { goldCost: 70000, charmCost: 10, successRate: 0.80 },
  15: { goldCost: 100000, charmCost: 12, successRate: 0.80 },
};

/** 计算传承消耗 */
export function calculateTransferCost(sourceEnhanceLevel: number): { gold: number; transferCharms: number; successRate: number } {
  if (sourceEnhanceLevel <= 0) {
    return { gold: 0, transferCharms: 0, successRate: 0 };
  }

  const config = TRANSFER_CONFIG[sourceEnhanceLevel];
  if (!config) {
    // 超过15级的情况
    return {
      gold: 100000 + (sourceEnhanceLevel - 15) * 50000,
      transferCharms: 12 + (sourceEnhanceLevel - 15) * 2,
      successRate: 0.80,
    };
  }

  return {
    gold: config.goldCost,
    transferCharms: config.charmCost,
    successRate: config.successRate,
  };
}

/** 传承装备强化等级 */
export function transferEnhancement(
  sourceEquipment: Equipment,
  targetEquipment: Equipment,
  playerGold: number,
  transferCharms: number
): TransferResult {
  const enhanceLevel = sourceEquipment.enhanceLevel;

  if (enhanceLevel <= 0) {
    return {
      success: false,
      cost: { gold: 0, transferCharms: 0 },
      error: '源装备没有强化等级',
    };
  }

  // 检查目标装备是否已有强化
  if (targetEquipment.enhanceLevel > 0) {
    return {
      success: false,
      cost: { gold: 0, transferCharms: 0 },
      error: '目标装备已有强化等级，无法传承',
    };
  }

  // 检查目标装备是否是同槽位
  const sourceTemplate = getEquipmentTemplate(sourceEquipment.templateId);
  const targetTemplate = getEquipmentTemplate(targetEquipment.templateId);
  if (!sourceTemplate || !targetTemplate) {
    return {
      success: false,
      cost: { gold: 0, transferCharms: 0 },
      error: '装备模板不存在',
    };
  }

  if (sourceTemplate.slot !== targetTemplate.slot) {
    return {
      success: false,
      cost: { gold: 0, transferCharms: 0 },
      error: '只能传承给相同槽位的装备',
    };
  }

  const costConfig = calculateTransferCost(enhanceLevel);
  const cost = {
    gold: costConfig.gold,
    transferCharms: costConfig.transferCharms,
  };

  // 检查资源
  if (playerGold < cost.gold) {
    return { success: false, cost, error: `金币不足，需要 ${cost.gold.toLocaleString()} 金币` };
  }
  if (transferCharms < cost.transferCharms) {
    return { success: false, cost, error: `传承符不足，需要 ${cost.transferCharms} 个` };
  }

  // 判定成功率
  const roll = Math.random();
  if (roll > costConfig.successRate) {
    // 传承失败，源装备等级归零，目标装备不变
    return {
      success: false,
      sourceEquipment: { ...sourceEquipment, enhanceLevel: 0 },
      targetEquipment,
      cost,
      error: '传承失败，强化等级已消失',
    };
  }

  // 传承成功
  return {
    success: true,
    sourceEquipment: { ...sourceEquipment, enhanceLevel: 0 },
    targetEquipment: { ...targetEquipment, enhanceLevel },
    cost,
  };
}

// ==================== 强化系统完善 ====================

/** 完整的强化配置表（1-15级） */
const FULL_ENHANCEMENT_CONFIGS: EnhancementConfig[] = [
  // 1-5级: 100%成功，不掉级
  { levelRange: [1, 5], successRate: 1.0, downgradeOnFail: 0, canDestroy: false, costBase: 100, costMultiplier: 1.5 },
  // 6-10级: 80%成功，+10以下不掉级
  { levelRange: [6, 10], successRate: 0.80, downgradeOnFail: 0, canDestroy: false, costBase: 500, costMultiplier: 1.8 },
  // 11-15级: 50%成功，+10以上可能掉1级
  { levelRange: [11, 15], successRate: 0.50, downgradeOnFail: 1, canDestroy: false, costBase: 2000, costMultiplier: 2.0 },
];

/** 获取完整强化配置 */
function getFullEnhancementConfig(level: number): EnhancementConfig | undefined {
  return FULL_ENHANCEMENT_CONFIGS.find(
    (config) => level >= config.levelRange[0] && level <= config.levelRange[1]
  );
}

/** 检查是否可以强化（带保护） */
export function canEnhanceWithProtection(
  equipment: Equipment,
  playerGold: number,
  protectionStones: number,
  useProtection: boolean
): { canEnhance: boolean; reason?: string; cost: { gold: number; protectionStones: number } } {
  const template = getEquipmentTemplate(equipment.templateId);
  if (!template) {
    return { canEnhance: false, reason: '装备模板不存在', cost: { gold: 0, protectionStones: 0 } };
  }

  if (equipment.enhanceLevel >= template.maxEnhance) {
    return { canEnhance: false, reason: '已达到强化上限', cost: { gold: 0, protectionStones: 0 } };
  }

  if (equipment.enhanceLevel >= 15) {
    return { canEnhance: false, reason: '已达最高强化等级+15', cost: { gold: 0, protectionStones: 0 } };
  }

  const nextLevel = equipment.enhanceLevel + 1;
  const config = getFullEnhancementConfig(nextLevel);
  if (!config) {
    return { canEnhance: false, reason: '无法获取强化配置', cost: { gold: 0, protectionStones: 0 } };
  }

  const qualityMultiplier = QUALITY_CONFIG[equipment.quality]?.multiplier || 1;
  const goldCost = Math.floor(config.costBase * Math.pow(config.costMultiplier, equipment.enhanceLevel) * qualityMultiplier);

  let protectionCost = 0;
  if (useProtection && config.downgradeOnFail > 0) {
    protectionCost = Math.ceil(nextLevel / 5); // 每5级需要1个保护石
  }

  if (playerGold < goldCost) {
    return { canEnhance: false, reason: `金币不足，需要 ${goldCost.toLocaleString()} 金币`, cost: { gold: goldCost, protectionStones: protectionCost } };
  }

  if (useProtection && protectionStones < protectionCost) {
    return { canEnhance: false, reason: `保护石不足，需要 ${protectionCost} 个`, cost: { gold: goldCost, protectionStones: protectionCost } };
  }

  return { canEnhance: true, cost: { gold: goldCost, protectionStones: protectionCost } };
}

// ==================== 辅助函数 ====================

/** 获取物品名称 */
function getItemName(itemId: string): string {
  const names: Record<string, string> = {
    'item_iron_ore': '铁矿石',
    'item_copper_ore': '铜矿石',
    'item_silver_ore': '银矿石',
    'item_gold_ore': '金矿石',
    'item_dragon_scale': '龙鳞',
    'item_dragon_blood': '龙血',
    'item_fairy_dust': '仙尘',
    'item_reforge_stone': '洗练石',
    'item_reforge_stone_advanced': '高级洗练石',
    'item_enhance_stone': '强化石',
    'item_enhance_stone_advanced': '高级强化石',
    'item_enhance_stone_supreme': '至尊强化石',
  };
  return names[itemId] || itemId;
}

/** 获取物品图标 */
function getItemIcon(itemId: string): string {
  const icons: Record<string, string> = {
    'item_iron_ore': '🪨',
    'item_copper_ore': '🔶',
    'item_silver_ore': '⬜',
    'item_gold_ore': '🟡',
    'item_dragon_scale': '🐉',
    'item_dragon_blood': '🩸',
    'item_fairy_dust': '✨',
    'item_reforge_stone': '🔮',
    'item_reforge_stone_advanced': '🌙',
    'item_enhance_stone': '💎',
    'item_enhance_stone_advanced': '💠',
    'item_enhance_stone_supreme': '🔥',
  };
  return icons[itemId] || '📦';
}

/** 生成随机词条（简化版，本地实现） */
function generateRandomAffixesLocal(
  quality: Quality,
  count: number,
  multiplier: number
): Affix[] {
  // 简化的词条生成，实际应该使用 affixService
  const affixes: Affix[] = [];
  const qualityIndex = QUALITY_ORDER.indexOf(quality);

  // 根据品质决定词条数量
  const affixCount = Math.min(count, Math.max(1, qualityIndex));

  // 可能的词条类型
  const affixTypes: Array<{ targetStat: string; name: string }> = [
    { targetStat: 'physicalAttack', name: '物理攻击' },
    { targetStat: 'magicAttack', name: '法术攻击' },
    { targetStat: 'physicalDefense', name: '物理防御' },
    { targetStat: 'magicDefense', name: '法术防御' },
  ];

  for (let i = 0; i < affixCount; i++) {
    const randomType = affixTypes[Math.floor(Math.random() * affixTypes.length)];
    const value = Math.floor(10 * multiplier);

    affixes.push({
      templateId: `random_${randomType.targetStat}_${generateUUID().slice(0, 8)}`,
      type: 'combat_stat',
      value,
      isPercent: false,
      targetStat: randomType.targetStat,
      name: randomType.name,
      description: `${randomType.name}+${value}`,
    });
  }

  return affixes;
}

export default equipmentService;
