// 种族类型定义

import type { UUID, BaseStats } from './common';

/** 种族枚举 */
export type RaceType = 'human' | 'celestial' | 'demon';

/** 种族特性效果类型 */
export type RaceTraitEffectType =
  | 'all_stats'        // 全属性
  | 'skill_damage'     // 技能伤害
  | 'physical_attack'  // 物理攻击
  | 'magic_attack'     // 法术攻击
  | 'hp_bonus'         // HP加成
  | 'mp_bonus'         // MP加成
  | 'survive_fatal'    // 存活致命伤
  | 'mp_shield'        // MP护盾
  | 'mp_regen'         // MP恢复
  | 'exp_bonus'        // 经验加成
  | 'cooldown_reduce'  // 冷却减少
  | 'low_hp_attack'    // 残血攻击加成
  | 'survive_heal';    // 存活回血

/** 种族特性 */
export interface RaceTrait {
  id: string;
  name: string;
  description: string;
  effect: {
    type: RaceTraitEffectType;
    value: number;
  };
}

/** 种族配置 */
export interface Race {
  id: UUID;
  type: RaceType;
  name: string;
  description: string;
  icon: string;

  // 初始基础属性（创建角色时的初始值）
  baseStats: BaseStats;

  // 属性成长加成（每点属性的效果倍率）
  statGrowth: {
    strength: number;     // 力量成长
    intelligence: number; // 灵力成长
    vitality: number;     // 体质成长
    agility: number;      // 敏捷成长
    willpower: number;    // 魔力成长
  };

  // 属性偏向（用于战斗属性计算）
  statBonus: {
    strength: number;     // 力量加成
    intelligence: number; // 灵力加成
    vitality: number;     // 体质加成
    agility: number;      // 敏捷加成
    willpower: number;    // 魔力加成
  };

  // 种族特性列表（3个特性）
  traits: [RaceTrait, RaceTrait, RaceTrait];

  // 可选门派
  availableFactions: string[];
}

/** 种族被动效果（用于战斗计算） */
export interface RacePassiveEffect {
  raceType: RaceType;
  effectType: 'survive_fatal' | 'mp_regen' | 'low_hp_attack' | 'survive_heal' | 'mp_shield';
  trigger?: string;
  value: number;
  description: string;
}
