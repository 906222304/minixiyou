// 阵法服务 - 效果计算、克制判定、升级逻辑

import type {
  Formation,
  FormationEffect,
  PlayerFormation,
  FormationUpgradeResult,
  CounterBonusResult,
} from '@/types/formation';
import type { FullStats } from '@/types/common';
import {
  getFormation,
  getFormationExpRequired,
  FORMATION_COUNTER_BONUS,
} from '@/constants/formations';

// ============================================
// 阵法效果计算
// ============================================

/**
 * 获取阵法在特定槽位的效果（考虑等级加成）
 */
export function getFormationEffects(
  formationId: string,
  level: number,
  slot: number
): FormationEffect[] {
  const formation = getFormation(formationId);
  if (!formation) {
    return [];
  }

  const position = formation.positions.find(p => p.slot === slot);
  if (!position) {
    return [];
  }

  // 应用等级加成
  const levelMultiplier = 1 + (level - 1) * formation.levelBonus;

  return position.effects.map(effect => ({
    ...effect,
    value: Math.round(effect.value * levelMultiplier * 10) / 10,
  }));
}

/**
 * 计算阵法对单位属性的加成
 */
export function calculateFormationStats(
  formationId: string,
  level: number,
  slot: number,
  baseStats: FullStats
): Partial<FullStats> {
  const effects = getFormationEffects(formationId, level, slot);
  const statBonus: Partial<FullStats> = {};

  for (const effect of effects) {
    if (effect.type === 'stat_bonus' && effect.targetStat) {
      const stat = effect.targetStat as keyof FullStats;
      const baseValue = baseStats[stat] || 0;
      const bonusValue = Math.floor(baseValue * effect.value / 100);
      statBonus[stat] = (statBonus[stat] || 0) + bonusValue;
    }
  }

  return statBonus;
}

/**
 * 获取阵法对伤害的加成百分比
 */
export function getFormationDamageBonus(
  formationId: string,
  level: number,
  slot: number
): number {
  const effects = getFormationEffects(formationId, level, slot);
  let totalBonus = 0;

  for (const effect of effects) {
    if (effect.type === 'damage_bonus') {
      totalBonus += effect.value;
    }
  }

  return totalBonus;
}

/**
 * 获取阵法对伤害的减免百分比
 */
export function getFormationDamageReduction(
  formationId: string,
  level: number,
  slot: number
): number {
  const effects = getFormationEffects(formationId, level, slot);
  let totalReduction = 0;

  for (const effect of effects) {
    if (effect.type === 'damage_reduction') {
      totalReduction += effect.value;
    }
  }

  return totalReduction;
}

/**
 * 获取阵法对治疗的加成百分比
 */
export function getFormationHealBonus(
  formationId: string,
  level: number,
  slot: number
): number {
  const effects = getFormationEffects(formationId, level, slot);
  let totalBonus = 0;

  for (const effect of effects) {
    if (effect.type === 'heal_bonus') {
      totalBonus += effect.value;
    }
  }

  return totalBonus;
}

// ============================================
// 克制判定
// ============================================

/**
 * 计算阵法克制加成
 */
export function getCounterBonus(
  attackFormationId: string,
  defenseFormationId: string
): CounterBonusResult {
  const attackFormation = getFormation(attackFormationId);
  const defenseFormation = getFormation(defenseFormationId);

  if (!attackFormation || !defenseFormation) {
    return { hasCounter: false, bonus: 0, type: 'neutral' };
  }

  // 检查攻击方是否克制防守方
  if (attackFormation.counters.includes(defenseFormationId)) {
    return {
      hasCounter: true,
      bonus: FORMATION_COUNTER_BONUS,
      type: 'advantage',
    };
  }

  // 检查防守方是否克制攻击方
  if (attackFormation.counteredBy.includes(defenseFormationId)) {
    return {
      hasCounter: true,
      bonus: -FORMATION_COUNTER_BONUS,
      type: 'disadvantage',
    };
  }

  return { hasCounter: false, bonus: 0, type: 'neutral' };
}

/**
 * 获取克制关系描述
 */
export function getCounterDescription(
  formationId: string
): { advantages: string[]; disadvantages: string[] } {
  const formation = getFormation(formationId);

  if (!formation) {
    return { advantages: [], disadvantages: [] };
  }

  const advantages = formation.counters.map(id => {
    const f = getFormation(id);
    return f ? f.name : id;
  });

  const disadvantages = formation.counteredBy.map(id => {
    const f = getFormation(id);
    return f ? f.name : id;
  });

  return { advantages, disadvantages };
}

// ============================================
// 阵法升级
// ============================================

/**
 * 升级阵法（增加经验）
 */
export function upgradeFormation(
  playerFormation: PlayerFormation,
  expGain: number
): FormationUpgradeResult {
  const formation = getFormation(playerFormation.formationId);

  if (!formation) {
    return {
      success: false,
      newLevel: playerFormation.level,
      newExp: playerFormation.exp,
      levelUp: false,
      error: '阵法不存在',
    };
  }

  if (!playerFormation.unlocked) {
    return {
      success: false,
      newLevel: playerFormation.level,
      newExp: playerFormation.exp,
      levelUp: false,
      error: '阵法未解锁',
    };
  }

  if (playerFormation.level >= formation.maxLevel) {
    return {
      success: false,
      newLevel: playerFormation.level,
      newExp: playerFormation.exp,
      levelUp: false,
      error: '已达最高等级',
    };
  }

  let currentExp = playerFormation.exp + expGain;
  let currentLevel = playerFormation.level;
  let levelUp = false;

  // 检查是否升级
  while (currentLevel < formation.maxLevel) {
    const expRequired = getFormationExpRequired(currentLevel);
    if (currentExp >= expRequired) {
      currentExp -= expRequired;
      currentLevel++;
      levelUp = true;
    } else {
      break;
    }
  }

  // 如果升到满级，经验归零
  if (currentLevel >= formation.maxLevel) {
    currentExp = 0;
  }

  return {
    success: true,
    newLevel: currentLevel,
    newExp: currentExp,
    levelUp,
  };
}

/**
 * 获取阵法升级进度
 */
export function getFormationProgress(
  playerFormation: PlayerFormation
): { current: number; required: number; percent: number } {
  const formation = getFormation(playerFormation.formationId);

  if (!formation || playerFormation.level >= formation.maxLevel) {
    return { current: 0, required: 0, percent: 100 };
  }

  const required = getFormationExpRequired(playerFormation.level);
  const percent = Math.min(100, (playerFormation.exp / required) * 100);

  return {
    current: playerFormation.exp,
    required,
    percent,
  };
}

// ============================================
// 阵法工具函数
// ============================================

/**
 * 获取阵法完整信息（合并配置和玩家数据）
 */
export function getFormationInfo(
  formationId: string,
  playerFormation?: PlayerFormation
): {
  formation: Formation | null;
  level: number;
  exp: number;
  unlocked: boolean;
  progress: { current: number; required: number; percent: number };
} {
  const formation = getFormation(formationId);

  if (!formation) {
    return {
      formation: null,
      level: 0,
      exp: 0,
      unlocked: false,
      progress: { current: 0, required: 0, percent: 0 },
    };
  }

  const level = playerFormation?.level ?? 0;
  const exp = playerFormation?.exp ?? 0;
  const unlocked = playerFormation?.unlocked ?? false;

  const progress = playerFormation
    ? getFormationProgress(playerFormation)
    : { current: 0, required: 0, percent: 0 };

  return {
    formation,
    level,
    exp,
    unlocked,
    progress,
  };
}

/**
 * 获取阵法所有槽位的效果汇总
 */
export function getFormationAllSlotEffects(
  formationId: string,
  level: number
): Map<number, FormationEffect[]> {
  const formation = getFormation(formationId);
  const effectsMap = new Map<number, FormationEffect[]>();

  if (!formation) {
    return effectsMap;
  }

  for (const position of formation.positions) {
    const effects = getFormationEffects(formationId, level, position.slot);
    effectsMap.set(position.slot, effects);
  }

  return effectsMap;
}

/**
 * 格式化阵法效果描述
 */
export function formatFormationEffects(effects: FormationEffect[]): string[] {
  return effects.map(effect => {
    switch (effect.type) {
      case 'stat_bonus':
        return `${effect.description}`;
      case 'damage_bonus':
        return `伤害加成+${effect.value}%`;
      case 'damage_reduction':
        return `伤害减免+${effect.value}%`;
      case 'heal_bonus':
        return `治疗效果+${effect.value}%`;
      case 'counter_rate':
        return `反击率+${effect.value}%`;
      default:
        return effect.description;
    }
  });
}

// ============================================
// 导出服务对象
// ============================================

export const formationService = {
  // 效果计算
  getFormationEffects,
  calculateFormationStats,
  getFormationDamageBonus,
  getFormationDamageReduction,
  getFormationHealBonus,

  // 克制判定
  getCounterBonus,
  getCounterDescription,

  // 升级
  upgradeFormation,
  getFormationProgress,

  // 工具
  getFormationInfo,
  getFormationAllSlotEffects,
  formatFormationEffects,
};
