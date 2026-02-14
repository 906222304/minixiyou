// 阵法类型定义

import type { StatType } from './common';

/** 阵法类型 */
export type FormationType = 'attack' | 'defense' | 'speed' | 'balance';

/** 阵法效果类型 */
export type FormationEffectType =
  | 'stat_bonus'      // 属性加成
  | 'damage_bonus'    // 伤害加成
  | 'damage_reduction' // 伤害减免
  | 'counter_rate'    // 反击率
  | 'heal_bonus';     // 治疗加成

/** 阵法效果 */
export interface FormationEffect {
  /** 效果类型 */
  type: FormationEffectType;
  /** 目标属性（用于stat_bonus） */
  targetStat?: StatType;
  /** 效果数值（百分比） */
  value: number;
  /** 效果描述 */
  description: string;
}

/** 阵法位置（槽位） */
export interface FormationPosition {
  /** 槽位编号 (0-5) */
  slot: number;
  /** 前排/后排 */
  row: 'front' | 'back';
  /** 该位置的效果 */
  effects: FormationEffect[];
}

/** 阵法配置 */
export interface Formation {
  /** 阵法ID */
  id: string;
  /** 阵法名称 */
  name: string;
  /** 阵法描述 */
  description: string;
  /** 阵法图标 */
  icon: string;
  /** 阵法类型 */
  type: FormationType;
  /** 各位置效果配置 */
  positions: FormationPosition[];
  /** 克制的阵法ID列表 */
  counters: string[];
  /** 被克制的阵法ID列表 */
  counteredBy: string[];
  /** 最大等级 */
  maxLevel: number;
  /** 每级效果提升比例 */
  levelBonus: number;
}

/** 玩家已解锁的阵法 */
export interface PlayerFormation {
  /** 阵法ID */
  formationId: string;
  /** 当前等级 */
  level: number;
  /** 当前经验 */
  exp: number;
  /** 是否已解锁 */
  unlocked: boolean;
}

/** 阵法升级结果 */
export interface FormationUpgradeResult {
  /** 是否成功 */
  success: boolean;
  /** 新等级 */
  newLevel: number;
  /** 新经验 */
  newExp: number;
  /** 是否升级 */
  levelUp: boolean;
  /** 错误信息 */
  error?: string;
}

/** 阵法克制加成结果 */
export interface CounterBonusResult {
  /** 是否存在克制关系 */
  hasCounter: boolean;
  /** 克制加成百分比 */
  bonus: number;
  /** 克制类型：'advantage'我方克制对方, 'disadvantage'对方克制我方, 'neutral'无克制 */
  type: 'advantage' | 'disadvantage' | 'neutral';
}

/** 阵法经验需求配置 */
export interface FormationExpConfig {
  /** 基础经验需求 */
  baseExp: number;
  /** 每级增加的经验 */
  expPerLevel: number;
}

/** 阵法战报记录 */
export interface FormationBattleLog {
  /** 阵法ID */
  formationId: string;
  /** 克制加成 */
  counterBonus: number;
  /** 触发的效果 */
  triggeredEffects: {
    slot: number;
    effect: FormationEffect;
    value: number;
  }[];
}
