// 计算公式配置 - 增强版

import type { BaseStats, CombatStats, ExtendedCombatStats, FullStats, RaceType, Element, DamageResult } from '@/types';
import { RACES } from './races';
import { ELEMENT_ADVANTAGE } from '@/types/common';

// ============== 基础属性计算 ==============

/** 基础属性计算 */
export function calculateBaseStats(
  baseStats: BaseStats,
  level: number,
  growthRate: BaseStats
): BaseStats {
  return {
    strength: Math.floor(baseStats.strength + growthRate.strength * (level - 1)),
    intelligence: Math.floor(baseStats.intelligence + growthRate.intelligence * (level - 1)),
    vitality: Math.floor(baseStats.vitality + growthRate.vitality * (level - 1)),
    agility: Math.floor(baseStats.agility + growthRate.agility * (level - 1)),
    willpower: Math.floor(baseStats.willpower + growthRate.willpower * (level - 1)),
  };
}

/** 战斗属性计算 */
export function calculateCombatStats(
  stats: BaseStats,
  race: RaceType,
  level: number
): CombatStats {
  const raceBonus = RACES[race]?.statBonus || {
    strength: 1,
    intelligence: 1,
    vitality: 1,
    agility: 1,
    willpower: 1,
  };

  const str = stats.strength * raceBonus.strength;
  const int = stats.intelligence * raceBonus.intelligence;
  const vit = stats.vitality * raceBonus.vitality;
  const agi = stats.agility * raceBonus.agility;
  const wil = stats.willpower * raceBonus.willpower;

  return {
    // 攻防属性
    physicalAttack: Math.floor(str * 2 + agi * 0.5 + level * 2),
    physicalDefense: Math.floor(vit * 1.5 + str * 0.3 + level),
    magicAttack: Math.floor(int * 2.2 + wil * 0.5 + level * 2),
    magicDefense: Math.floor(wil * 1.5 + int * 0.3 + level),

    // HP/MP
    maxHp: Math.floor(vit * 10 + str * 2 + level * 5 + 100),
    maxMp: Math.floor(wil * 8 + int * 2 + level * 3 + 50),

    // 速度
    speed: Math.floor(agi * 2 + level),

    // 暴击 - 暴击率上限50%，暴击伤害基础150%
    critRate: Math.min(0.05 + agi * 0.002, 0.5),
    critDamage: 0.5 + agi * 0.01,

    // 命中/闪避 - 命中上限99%，闪避上限30%
    hitRate: Math.min(0.9 + agi * 0.001, 0.99),
    dodgeRate: Math.min(0.02 + agi * 0.002, 0.3),
  };
}

// ============== 命中与闪避系统 ==============

/** 命中判定结果 */
export interface HitResult {
  isHit: boolean;
  hitChance: number;
  rollValue: number;
  dodgeType: 'dodge' | 'miss' | null;
}

/**
 * 判定攻击是否命中
 * @param attacker 攻击者属性
 * @param defender 防御者属性
 * @param skillAccuracy 技能命中率修正（默认1.0）
 * @param prng 随机数生成器
 */
export function checkHit(
  attacker: CombatStats,
  defender: CombatStats,
  skillAccuracy: number = 1.0,
  prng: () => number
): HitResult {
  // 最终命中率 = 攻击者命中率 × 技能修正
  const finalHitRate = Math.min(0.99, attacker.hitRate * skillAccuracy);

  // 有效闪避率
  const effectiveDodgeRate = Math.min(0.3, defender.dodgeRate);

  // 最终命中概率 = 命中率 × (1 - 闪避率)
  const hitChance = finalHitRate * (1 - effectiveDodgeRate);

  const random = prng();
  const isHit = random < hitChance;

  return {
    isHit,
    hitChance,
    rollValue: random,
    dodgeType: !isHit ? (random > finalHitRate ? 'miss' : 'dodge') : null,
  };
}

// ============== 暴击系统 ==============

/** 暴击判定结果 */
export interface CriticalResult {
  isCritical: boolean;
  critRate: number;
  critMultiplier: number;
  rollValue: number;
}

/**
 * 暴击判定
 * @param attacker 攻击者属性
 * @param critBonus 技能暴击加成
 * @param prng 随机数生成器
 */
export function checkCritical(
  attacker: CombatStats,
  critBonus: number = 0,
  prng: () => number
): CriticalResult {
  // 基础暴击率 + 技能加成，上限75%
  const critRate = Math.min(0.75, attacker.critRate + critBonus);

  const random = prng();
  const isCritical = random < critRate;

  // 暴击伤害 = 基础150% + 额外暴伤
  const critMultiplier = isCritical ? (1 + attacker.critDamage) : 1;

  return {
    isCritical,
    critRate,
    critMultiplier,
    rollValue: random,
  };
}

// ============== 元素系统 ==============

/**
 * 计算元素克制倍率
 * @param attackElement 攻击元素
 * @param defenderElement 防御者元素属性
 */
export function calculateElementMultiplier(
  attackElement: Element,
  defenderElement?: Element
): number {
  // 克制：+30%伤害
  if (ELEMENT_ADVANTAGE[attackElement] === defenderElement) {
    return 1.3;
  }

  // 被克：-30%伤害
  if (defenderElement && ELEMENT_ADVANTAGE[defenderElement] === attackElement) {
    return 0.7;
  }

  return 1.0;
}

/**
 * 计算元素抗性减免
 * @param resistance 元素抗性百分比
 */
export function calculateResistanceMultiplier(resistance: number = 0): number {
  // 抗性上限75%
  return 1 - Math.min(0.75, resistance);
}

// ============== 伤害计算 ==============

/**
 * 计算物理伤害（完整版）
 * @param attacker 攻击者属性
 * @param defender 防御者属性
 * @param skillMultiplier 技能倍率
 * @param prng 随机数生成器
 */
export function calculatePhysicalDamage(
  attacker: ExtendedCombatStats,
  defender: ExtendedCombatStats,
  skillMultiplier: number,
  prng: () => number
): DamageResult {
  // 1. 应用穿透后的防御力
  const penetration = attacker.physicalPenetration || 0;
  const penDefense = Math.max(0, defender.physicalDefense - penetration);

  // 2. 基础伤害 = 物攻 - 穿透后物防（最小为1）
  const baseDamage = Math.max(1, attacker.physicalAttack - penDefense);

  // 3. 技能倍率
  const skillDamage = baseDamage * skillMultiplier;

  // 4. 随机波动 (90% ~ 110%)
  const randomMultiplier = 0.9 + prng() * 0.2;

  // 5. 伤害加成
  const bonusMultiplier = 1 + (attacker.damageBonus || 0);

  // 6. 暴击判定
  const critResult = checkCritical(attacker, 0, prng);

  // 7. 伤害减免（上限75%）
  const reductionMultiplier = 1 - Math.min(0.75, defender.damageReduction || 0);

  // 8. 最终伤害
  const finalDamage = Math.floor(
    skillDamage * randomMultiplier * bonusMultiplier * critResult.critMultiplier * reductionMultiplier
  );

  // 9. 吸血计算
  const lifestealAmount = Math.floor(finalDamage * (attacker.lifesteal || 0));

  return {
    damage: Math.max(1, finalDamage),
    isCritical: critResult.isCritical,
    lifestealAmount,
    element: 'physical',
  };
}

/**
 * 计算法术伤害（完整版）
 * @param attacker 攻击者属性
 * @param defender 防御者属性
 * @param skill 技能信息
 * @param prng 随机数生成器
 */
export function calculateMagicDamage(
  attacker: ExtendedCombatStats,
  defender: ExtendedCombatStats,
  skill: { multiplier: number; element: Element; critBonus?: number },
  prng: () => number
): DamageResult {
  // 1. 应用穿透后的防御力
  const penetration = attacker.magicPenetration || 0;
  const penDefense = Math.max(0, defender.magicDefense - penetration);

  // 2. 基础伤害 = 法攻 - 穿透后法防（最小为1）
  const baseDamage = Math.max(1, attacker.magicAttack - penDefense);

  // 3. 技能倍率
  const skillDamage = baseDamage * skill.multiplier;

  // 4. 元素克制
  const elementMultiplier = calculateElementMultiplier(skill.element, undefined);

  // 5. 元素抗性
  const resistanceKey = `${skill.element}Resistance` as keyof ExtendedCombatStats;
  const resistance = (defender[resistanceKey] as number) || 0;
  const resistanceMultiplier = calculateResistanceMultiplier(resistance);

  // 6. 随机波动
  const randomMultiplier = 0.9 + prng() * 0.2;

  // 7. 伤害加成
  const bonusMultiplier = 1 + (attacker.damageBonus || 0);

  // 8. 暴击判定
  const critResult = checkCritical(attacker, skill.critBonus || 0, prng);

  // 9. 伤害减免（上限75%）
  const reductionMultiplier = 1 - Math.min(0.75, defender.damageReduction || 0);

  // 10. 最终伤害
  const finalDamage = Math.floor(
    skillDamage *
    elementMultiplier *
    resistanceMultiplier *
    randomMultiplier *
    bonusMultiplier *
    critResult.critMultiplier *
    reductionMultiplier
  );

  // 11. 法术吸血
  const vampAmount = Math.floor(finalDamage * (attacker.spellVamp || 0));

  return {
    damage: Math.max(1, finalDamage),
    isCritical: critResult.isCritical,
    lifestealAmount: vampAmount,
    element: skill.element,
    elementalAdvantage: elementMultiplier > 1,
  };
}

/**
 * 计算固定伤害（无视防御）
 * 例：地府的阎罗令
 * @param baseDamage 基础伤害
 * @param level 技能等级
 * @param defender 防御者属性
 * @param prng 随机数生成器
 */
export function calculateFixedDamage(
  baseDamage: number,
  level: number,
  defender: ExtendedCombatStats,
  prng: () => number
): DamageResult {
  // 等级系数
  const levelMultiplier = 1 + level * 0.05;

  // 随机波动 (95% ~ 105%)
  const randomMultiplier = 0.95 + prng() * 0.1;

  // 固定伤害仍受伤害减免影响（上限50%）
  const reductionMultiplier = 1 - Math.min(0.5, defender.damageReduction || 0);

  const finalDamage = Math.floor(
    baseDamage * levelMultiplier * randomMultiplier * reductionMultiplier
  );

  return {
    damage: Math.max(1, finalDamage),
    isCritical: false,
    isFixed: true,
  };
}

/**
 * 计算真实伤害（无视一切）
 * @param baseDamage 基础伤害
 */
export function calculateTrueDamage(baseDamage: number): DamageResult {
  return {
    damage: Math.max(1, Math.floor(baseDamage)),
    isCritical: false,
    isTrue: true,
  };
}

// ============== 旧版兼容函数 ==============

/**
 * 物理伤害计算（简化版，兼容旧代码）
 * @deprecated 使用 calculatePhysicalDamage 完整版
 */
export function calculatePhysicalDamageSimple(
  attack: number,
  defense: number,
  skillMultiplier: number,
  critRate: number,
  critDamage: number,
  randomFactor: () => number
): { damage: number; isCritical: boolean } {
  // 基础伤害
  const baseDamage = Math.max(1, attack - defense);

  // 技能倍率
  const skillDamage = baseDamage * skillMultiplier;

  // 随机波动 (90% ~ 110%)
  const random = 0.9 + randomFactor() * 0.2;

  // 暴击判定
  const isCritical = randomFactor() < critRate;
  const critMultiplier = isCritical ? (1.5 + critDamage) : 1;

  // 最终伤害
  const damage = Math.floor(skillDamage * random * critMultiplier);

  return { damage: Math.max(1, damage), isCritical };
}

/**
 * 法术伤害计算（简化版，兼容旧代码）
 * @deprecated 使用 calculateMagicDamage 完整版
 */
export function calculateMagicDamageSimple(
  magicAttack: number,
  magicDefense: number,
  skillMultiplier: number,
  elementMultiplier: number,
  critRate: number,
  critDamage: number,
  randomFactor: () => number
): { damage: number; isCritical: boolean } {
  // 基础伤害
  const baseDamage = Math.max(1, magicAttack - magicDefense);

  // 技能倍率
  const skillDamage = baseDamage * skillMultiplier;

  // 元素倍率
  const elementDamage = skillDamage * elementMultiplier;

  // 随机波动
  const random = 0.9 + randomFactor() * 0.2;

  // 暴击判定
  const isCritical = randomFactor() < critRate;
  const critMultiplier = isCritical ? (1.5 + critDamage) : 1;

  // 最终伤害
  const damage = Math.floor(elementDamage * random * critMultiplier);

  return { damage: Math.max(1, damage), isCritical };
}

// ============== 属性加成计算 ==============

/** 装备属性加成计算 */
export function calculateEquipmentBonus(
  equipmentStats: Partial<CombatStats>
): Partial<CombatStats> {
  return equipmentStats;
}

/** 羁绊加成计算 */
export function calculateBondBonus(
  bondEffects: Array<{ stat?: keyof CombatStats; value: number; isPercent: boolean }>
): Partial<CombatStats> {
  const result: Partial<CombatStats> = {};

  for (const effect of bondEffects) {
    if (effect.stat) {
      const currentValue = result[effect.stat] || 0;
      result[effect.stat] = effect.isPercent
        ? currentValue + effect.value
        : currentValue + effect.value;
    }
  }

  return result;
}

/** 最终属性计算 */
export function calculateFinalStats(
  baseStats: FullStats,
  equipmentBonus: Partial<CombatStats>,
  bondBonus: Partial<CombatStats>
): FullStats {
  const result: FullStats = { ...baseStats };

  // 应用装备加成
  for (const [key, value] of Object.entries(equipmentBonus)) {
    if (key in result && typeof value === 'number') {
      (result as unknown as Record<string, number>)[key] += value;
    }
  }

  // 应用羁绊加成
  for (const [key, value] of Object.entries(bondBonus)) {
    if (key in result && typeof value === 'number') {
      (result as unknown as Record<string, number>)[key] += value;
    }
  }

  return result;
}

/** 宠物资质计算 */
export function calculatePetStats(
  baseStats: CombatStats,
  aptitude: Record<string, number>,
  level: number
): CombatStats {
  const levelFactor = 1 + (level - 1) * 0.05;

  return {
    physicalAttack: Math.floor(baseStats.physicalAttack * aptitude.attack * levelFactor),
    physicalDefense: Math.floor(baseStats.physicalDefense * aptitude.defense * levelFactor),
    magicAttack: Math.floor(baseStats.magicAttack * aptitude.magic * levelFactor),
    magicDefense: Math.floor(baseStats.magicDefense * aptitude.magic * levelFactor),
    speed: Math.floor(baseStats.speed * aptitude.speed * levelFactor),
    maxHp: Math.floor(baseStats.maxHp * aptitude.hp * levelFactor),
    maxMp: Math.floor(baseStats.maxMp * aptitude.mp * levelFactor),
    critRate: baseStats.critRate,
    critDamage: baseStats.critDamage,
    hitRate: baseStats.hitRate,
    dodgeRate: baseStats.dodgeRate,
  };
}

// ============== 种族被动效果 ==============

/** 种族被动效果类型 */
export interface RacePassiveEffect {
  type: 'survive_fatal' | 'mp_regen' | 'low_hp_attack';
  trigger: 'on_fatal_damage' | 'on_turn_end' | 'on_attack';
  value: number;
  description: string;
}

/**
 * 获取种族被动效果
 * @param race 种族类型
 */
export function getRacePassiveEffect(race: RaceType): RacePassiveEffect {
  switch (race) {
    case 'human':
      return {
        type: 'survive_fatal',
        trigger: 'on_fatal_damage',
        value: 0.1, // 10%概率
        description: '受到致命伤害时，有10%概率保留1HP存活',
      };
    case 'celestial':
      return {
        type: 'mp_regen',
        trigger: 'on_turn_end',
        value: 0.02, // 2%MP
        description: '每回合结束时恢复2%最大MP',
      };
    case 'demon':
      return {
        type: 'low_hp_attack',
        trigger: 'on_attack',
        value: 0.2, // +20%攻击
        description: '当HP低于30%时，物理攻击+20%',
      };
    default:
      return {
        type: 'survive_fatal',
        trigger: 'on_fatal_damage',
        value: 0,
        description: '',
      };
  }
}

/**
 * 计算种族被动触发
 * @param race 种族类型
 * @param context 上下文（当前HP/MaxHP等）
 * @param prng 随机数生成器
 */
export function calculateRacePassive(
  race: RaceType,
  context: {
    currentHp: number;
    maxHp: number;
    currentMp: number;
    maxMp: number;
    isFatalDamage: boolean;
  },
  prng: () => number
): { triggered: boolean; effect?: string; value?: number } {
  const effect = getRacePassiveEffect(race);

  switch (effect.type) {
    case 'survive_fatal':
      if (context.isFatalDamage && prng() < effect.value) {
        return { triggered: true, effect: 'survive', value: 1 };
      }
      break;

    case 'mp_regen': {
      const mpRecovery = Math.floor(context.maxMp * effect.value);
      return { triggered: true, effect: 'mp_regen', value: mpRecovery };
    }

    case 'low_hp_attack':
      if (context.currentHp / context.maxHp < 0.3) {
        return { triggered: true, effect: 'attack_bonus', value: effect.value };
      }
      break;
  }

  return { triggered: false };
}
