// 特性加成计算服务

import type { CharacterTrait, FullStats, ElementResistances } from '@/types';
import { getTrait } from '@/constants/traits';

/**
 * 应用特性加成到属性
 */
export function applyTraitBonuses(
  baseStats: FullStats,
  traits: CharacterTrait[],
): FullStats {
  if (traits.length === 0) return baseStats;

  // 复制基础属性
  const result = { ...baseStats };

  // 遍历所有特性并应用加成
  for (const charTrait of traits) {
    const trait = getTrait(charTrait.traitId);
    if (!trait) continue;

    for (const effect of trait.effects) {
      // 只处理 stat_bonus 和 combat_bonus 类型
      if (effect.type === 'stat_bonus' || effect.type === 'combat_bonus') {
        applyStatBonus(result, effect.stat, effect.value ?? 0, effect.isPercent ?? false);
      }
    }
  }

  return result;
}

/**
 * 应用单个属性加成
 */
function applyStatBonus(
  stats: FullStats,
  stat: string | undefined,
  value: number,
  isPercent: boolean,
): void {
  if (!stat) return;

  // 处理全属性加成
  if (stat === 'all') {
    const percentBonus = isPercent ? value / 100 : 0;
    const flatBonus = isPercent ? 0 : value;

    // 基础属性
    stats.strength += isPercent ? Math.floor(stats.strength * percentBonus) : flatBonus;
    stats.intelligence += isPercent ? Math.floor(stats.intelligence * percentBonus) : flatBonus;
    stats.vitality += isPercent ? Math.floor(stats.vitality * percentBonus) : flatBonus;
    stats.agility += isPercent ? Math.floor(stats.agility * percentBonus) : flatBonus;
    stats.willpower += isPercent ? Math.floor(stats.willpower * percentBonus) : flatBonus;

    // 战斗属性
    stats.physicalAttack += isPercent ? Math.floor(stats.physicalAttack * percentBonus) : flatBonus;
    stats.physicalDefense += isPercent ? Math.floor(stats.physicalDefense * percentBonus) : flatBonus;
    stats.magicAttack += isPercent ? Math.floor(stats.magicAttack * percentBonus) : flatBonus;
    stats.magicDefense += isPercent ? Math.floor(stats.magicDefense * percentBonus) : flatBonus;
    stats.maxHp += isPercent ? Math.floor(stats.maxHp * percentBonus) : flatBonus;
    stats.maxMp += isPercent ? Math.floor(stats.maxMp * percentBonus) : flatBonus;
    stats.speed += isPercent ? Math.floor(stats.speed * percentBonus) : flatBonus;
    return;
  }

  // 处理单个属性
  const statKey = stat as keyof FullStats;
  if (!(statKey in stats)) return;

  const currentValue = stats[statKey];
  if (typeof currentValue === 'number') {
    if (isPercent) {
      (stats[statKey] as number) += Math.floor(currentValue * (value / 100));
    } else {
      (stats[statKey] as number) += value;
    }
  }
}

/**
 * 应用特性元素抗性加成
 */
export function applyTraitElementResistances(
  baseResistances: ElementResistances,
  traits: CharacterTrait[],
): ElementResistances {
  if (traits.length === 0) return baseResistances;

  const result = { ...baseResistances };

  for (const charTrait of traits) {
    const trait = getTrait(charTrait.traitId);
    if (!trait) continue;

    for (const effect of trait.effects) {
      if (effect.type === 'stat_bonus' && effect.stat) {
        // 处理元素抗性
        const resistanceMap: Record<string, keyof ElementResistances> = {
          fireResistance: 'fire',
          iceResistance: 'water',  // 冰系对应水
          thunderResistance: 'metal', // 雷系对应金
          metalResistance: 'metal',
          woodResistance: 'wood',
          waterResistance: 'water',
          earthResistance: 'earth',
        };

        const elementKey = resistanceMap[effect.stat];
        if (elementKey && effect.value) {
          result[elementKey] += effect.value;
        }
      }
    }
  }

  return result;
}

/**
 * 获取特性的特殊效果列表（用于战斗中处理）
 */
export function getTraitSpecialEffects(traits: CharacterTrait[]): {
  condition: string;
  description: string;
  traitId: string;
}[] {
  const specialEffects: { condition: string; description: string; traitId: string }[] = [];

  for (const charTrait of traits) {
    const trait = getTrait(charTrait.traitId);
    if (!trait) continue;

    for (const effect of trait.effects) {
      if ((effect.type === 'special' || effect.type === 'conditional') && effect.condition) {
        specialEffects.push({
          condition: effect.condition,
          description: effect.description,
          traitId: charTrait.traitId,
        });
      }
    }
  }

  return specialEffects;
}

/**
 * 检查是否有特定特殊效果
 */
export function hasTraitEffect(traits: CharacterTrait[], condition: string): boolean {
  const specialEffects = getTraitSpecialEffects(traits);
  return specialEffects.some(e => e.condition === condition);
}

/**
 * 获取特性效果值（用于百分比效果）
 */
export function getTraitEffectValue(traits: CharacterTrait[], condition: string): number {
  let totalValue = 0;

  for (const charTrait of traits) {
    const trait = getTrait(charTrait.traitId);
    if (!trait) continue;

    for (const effect of trait.effects) {
      if ((effect.type === 'special' || effect.type === 'conditional') &&
          effect.condition === condition && effect.value) {
        totalValue += effect.value;
      }
      // 也检查 combat_bonus 类型
      if (effect.type === 'combat_bonus' && effect.condition === condition && effect.value) {
        totalValue += effect.value;
      }
    }
  }

  return totalValue;
}
