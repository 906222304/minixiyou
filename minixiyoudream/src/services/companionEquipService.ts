// 伙伴装备服务

import type { Equipment, EquipmentSlot, EquipmentSlots, CombatStats, FullStats, Companion } from '@/types';
import { isBaseAffix } from '@/types/affix';
import { companions, getCompanion } from '@/signals/companionSignals';
import { inventoryEquipments, addEquipment, removeEquipment } from '@/signals/inventorySignals';
import { getEquipmentTemplate } from '@/constants/equipment';

/** 穿戴结果 */
export interface EquipResult {
  success: boolean;
  message: string;
  previousEquipment?: Equipment;
}

/** 好感度加成配置 */
const FAVORABILITY_BONUS: Record<number, number> = {
  1: 1.0,   // 0-19
  2: 1.05,  // 20-39
  3: 1.1,   // 40-59
  4: 1.15,  // 60-79
  5: 1.2,   // 80-100
};

/** 获取好感度等级对应的加成倍率 */
function getFavorabilityMultiplier(level: number): number {
  return FAVORABILITY_BONUS[level] || 1.0;
}

/** 计算装备总属性 */
export function calculateEquipmentStats(equipment: EquipmentSlots): Partial<CombatStats> {
  const stats: Partial<CombatStats> = {};

  for (const equip of Object.values(equipment)) {
    if (!equip) continue;

    // 基础属性 - 修复: 使用类型安全的方式处理属性累加
    for (const [key, value] of Object.entries(equip.baseStats)) {
      const statKey = key as keyof CombatStats;
      if (statKey in stats) {
        stats[statKey] = (stats[statKey] || 0) + (value as number);
      } else {
        stats[statKey] = value as number;
      }
    }

    // 词条属性（只计算基础词条）- 修复: 使用类型安全的方式处理属性累加
    if (equip.affixes) {
      for (const affix of equip.affixes) {
        if (isBaseAffix(affix) && affix.targetStat && affix.value) {
          const statKey = affix.targetStat as keyof CombatStats;
          stats[statKey] = (stats[statKey] || 0) + affix.value;
        }
      }
    }

    // TODO: 加入宝石属性
  }

  return stats;
}

/** 穿戴装备 */
export function equipItem(companionId: string, item: Equipment, slot: EquipmentSlot): EquipResult {
  const companion = getCompanion(companionId);
  if (!companion) {
    return { success: false, message: '伙伴不存在' };
  }

  // 验证装备槽位
  const template = getEquipmentTemplate(item.templateId);
  if (!template) {
    return { success: false, message: '装备模板不存在' };
  }

  // 检查装备等级要求
  if (template.levelRequirement > companion.level) {
    return { success: false, message: `需要等级 ${template.levelRequirement}` };
  }

  // 确定目标槽位
  let targetSlot = slot;
  if (slot === 'ring1' || slot === 'ring2') {
    // 如果传的是戒指槽位，检查是否匹配装备模板
    if (template.slot !== 'ring1' && template.slot !== 'ring2') {
      return { success: false, message: '装备槽位不匹配' };
    }
    // 优先使用空槽位
    if (!companion.equipment.ring1) {
      targetSlot = 'ring1';
    } else if (!companion.equipment.ring2) {
      targetSlot = 'ring2';
    } else {
      // 两个槽位都有装备，替换指定的槽位
      targetSlot = slot;
    }
  } else if (template.slot !== slot) {
    return { success: false, message: '装备槽位不匹配' };
  }

  // 获取当前装备
  const currentEquipment = companion.equipment[targetSlot];

  // 从背包移除装备
  if (!removeEquipment(item.id)) {
    return { success: false, message: '装备不在背包中' };
  }

  // 如果有当前装备，放回背包
  if (currentEquipment) {
    currentEquipment.ownerId = undefined;
    addEquipment(currentEquipment);
  }

  // 更新伙伴装备
  const newEquipment = { ...companion.equipment };
  newEquipment[targetSlot] = { ...item, ownerId: companionId };

  // 更新伙伴数据
  const newCompanion = {
    ...companion,
    equipment: newEquipment,
  };

  // 重新计算装备属性
  const equipmentStats = calculateEquipmentStats(newEquipment);

  // 计算最终属性
  const finalStats = calculateFinalStats(newCompanion, equipmentStats);

  // 更新伙伴列表
  companions.value = companions.value.map(c =>
    c.id === companionId
      ? { ...newCompanion, equipmentStats, finalStats }
      : c
  );

  return {
    success: true,
    message: '装备成功',
    previousEquipment: currentEquipment || undefined,
  };
}

/** 卸下装备 */
export function unequipItem(companionId: string, slot: EquipmentSlot): Equipment | null {
  const companion = getCompanion(companionId);
  if (!companion) return null;

  const equipment = companion.equipment[slot];
  if (!equipment) return null;

  // 添加到背包
  const unequippedItem = { ...equipment, ownerId: undefined };
  addEquipment(unequippedItem);

  // 更新伙伴装备
  const newEquipment = { ...companion.equipment };
  newEquipment[slot] = null;

  // 重新计算装备属性
  const equipmentStats = calculateEquipmentStats(newEquipment);

  // 计算最终属性
  const finalStats = calculateFinalStats(companion, equipmentStats);

  // 更新伙伴列表
  companions.value = companions.value.map(c =>
    c.id === companionId
      ? { ...c, equipment: newEquipment, equipmentStats, finalStats }
      : c
  );

  return unequippedItem;
}

/** 获取可穿戴装备列表 */
export function getEquipableItems(companionId: string, slot: EquipmentSlot): Equipment[] {
  const companion = getCompanion(companionId);
  if (!companion) return [];

  const equipments = inventoryEquipments.value;
  const result: Equipment[] = [];

  for (const equip of equipments) {
    const template = getEquipmentTemplate(equip.templateId);
    if (!template) continue;

    // 检查槽位匹配
    let slotMatches = false;
    if (slot === 'ring1' || slot === 'ring2') {
      slotMatches = template.slot === 'ring1' || template.slot === 'ring2';
    } else {
      slotMatches = template.slot === slot;
    }

    if (!slotMatches) continue;

    // 检查等级要求
    if (template.levelRequirement > companion.level) continue;

    result.push(equip);
  }

  return result;
}

/** 计算最终属性 */
export function calculateFinalStats(
  companion: Companion,
  equipmentStats: Partial<FullStats>
): FullStats {
  const favorabilityMult = getFavorabilityMultiplier(companion.favorabilityLevel);

  // 基础属性
  const baseStats = companion.baseStats;

  // 计算最终属性 = (基础 + 装备) * 羁绊 * 好感度
  // TODO: 加入羁绊加成
  const finalStats: FullStats = {
    strength: Math.floor((baseStats.strength + (equipmentStats.strength || 0)) * favorabilityMult),
    intelligence: Math.floor((baseStats.intelligence + (equipmentStats.intelligence || 0)) * favorabilityMult),
    vitality: Math.floor((baseStats.vitality + (equipmentStats.vitality || 0)) * favorabilityMult),
    agility: Math.floor((baseStats.agility + (equipmentStats.agility || 0)) * favorabilityMult),
    willpower: Math.floor((baseStats.willpower + (equipmentStats.willpower || 0)) * favorabilityMult),
    physicalAttack: Math.floor((baseStats.physicalAttack + (equipmentStats.physicalAttack || 0)) * favorabilityMult),
    physicalDefense: Math.floor((baseStats.physicalDefense + (equipmentStats.physicalDefense || 0)) * favorabilityMult),
    magicAttack: Math.floor((baseStats.magicAttack + (equipmentStats.magicAttack || 0)) * favorabilityMult),
    magicDefense: Math.floor((baseStats.magicDefense + (equipmentStats.magicDefense || 0)) * favorabilityMult),
    speed: Math.floor((baseStats.speed + (equipmentStats.speed || 0)) * favorabilityMult),
    maxHp: Math.floor((baseStats.maxHp + (equipmentStats.maxHp || 0)) * favorabilityMult),
    maxMp: Math.floor((baseStats.maxMp + (equipmentStats.maxMp || 0)) * favorabilityMult),
    critRate: Math.min(1, (baseStats.critRate + (equipmentStats.critRate || 0)) * favorabilityMult),
    critDamage: (baseStats.critDamage + (equipmentStats.critDamage || 0)) * favorabilityMult,
    hitRate: Math.min(1, (baseStats.hitRate + (equipmentStats.hitRate || 0)) * favorabilityMult),
    dodgeRate: Math.min(0.5, (baseStats.dodgeRate + (equipmentStats.dodgeRate || 0)) * favorabilityMult),
  };

  return finalStats;
}

/** 重新计算装备属性 */
export function recalculateEquipmentStats(companionId: string): void {
  const companion = getCompanion(companionId);
  if (!companion) return;

  const equipmentStats = calculateEquipmentStats(companion.equipment);
  const finalStats = calculateFinalStats(companion, equipmentStats);

  companions.value = companions.value.map(c =>
    c.id === companionId
      ? { ...c, equipmentStats, finalStats }
      : c
  );
}

/** 计算装备对比属性 */
export function compareEquipment(
  companionId: string,
  newEquip: Equipment,
  slot: EquipmentSlot
): { stat: string; current: number; new: number; diff: number }[] {
  const companion = getCompanion(companionId);
  if (!companion) return [];

  const currentEquip = companion.equipment[slot];
  const currentStats: Record<string, number> = {};
  const newStats: Record<string, number> = {};

  // 收集当前装备属性
  if (currentEquip) {
    for (const [key, value] of Object.entries(currentEquip.baseStats)) {
      currentStats[key] = (currentStats[key] || 0) + (value as number);
    }
    if (currentEquip.affixes) {
      for (const affix of currentEquip.affixes) {
        if (isBaseAffix(affix) && affix.targetStat && affix.value) {
          currentStats[affix.targetStat] = (currentStats[affix.targetStat] || 0) + affix.value;
        }
      }
    }
  }

  // 收集新装备属性
  for (const [key, value] of Object.entries(newEquip.baseStats)) {
    newStats[key] = (newStats[key] || 0) + (value as number);
  }
  if (newEquip.affixes) {
    for (const affix of newEquip.affixes) {
      if (isBaseAffix(affix) && affix.targetStat && affix.value) {
        newStats[affix.targetStat] = (newStats[affix.targetStat] || 0) + affix.value;
      }
    }
  }

  // 计算差异
  const allStats = new Set([...Object.keys(currentStats), ...Object.keys(newStats)]);
  const result: { stat: string; current: number; new: number; diff: number }[] = [];

  for (const stat of allStats) {
    const currentVal = currentStats[stat] || 0;
    const newVal = newStats[stat] || 0;
    if (newVal !== currentVal) {
      result.push({
        stat,
        current: currentVal,
        new: newVal,
        diff: newVal - currentVal,
      });
    }
  }

  return result.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}

export const companionEquipService = {
  equipItem,
  unequipItem,
  getEquipableItems,
  recalculateEquipmentStats,
  calculateEquipmentStats,
  calculateFinalStats,
  compareEquipment,
};
