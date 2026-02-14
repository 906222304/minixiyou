// 种族类型定义

import type { UUID, BaseStats } from './common';

/** 种族枚举 */
export type RaceType = 'human' | 'celestial' | 'demon';

/** 种族特性 */
export interface RaceTrait {
  id: string;
  name: string;
  description: string;
  effect: {
    type: 'physical_attack' | 'magic_attack' | 'hp_bonus' | 'mp_bonus' | 'balanced' | 'crit_rate' | 'speed' | 'defense';
    value: number; // 百分比加成，如 0.1 表示 10%
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

  // 种族特性列表
  traits: RaceTrait[];

  // 种族被动技能
  passiveSkill: {
    id: string;
    name: string;
    description: string;
    effect: string;
  };

  // 可选门派
  availableFactions: string[];
}

/** 种族被动效果 */
export interface RacePassiveEffect {
  raceType: RaceType;
  effectType: 'damage_reduction' | 'mp_regen' | 'attack_boost';
  trigger?: string;
  value: number;
  description: string;
}
