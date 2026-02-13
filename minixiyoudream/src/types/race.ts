// 种族类型定义

import type { UUID } from './common';

/** 种族枚举 */
export type RaceType = 'human' | 'celestial' | 'demon';

/** 种族配置 */
export interface Race {
  id: UUID;
  type: RaceType;
  name: string;
  description: string;
  icon: string;

  // 属性偏向
  statBonus: {
    strength: number;     // 力量加成
    intelligence: number; // 灵力加成
    vitality: number;     // 体质加成
    agility: number;      // 敏捷加成
    willpower: number;    // 魔力加成
  };

  // 种族被动
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
