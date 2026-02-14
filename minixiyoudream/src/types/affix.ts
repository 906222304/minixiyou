// 词条类型定义

import type { Quality, StatType } from './common';

// ============================================
// 基础词条类型
// ============================================

/** 词条类型 */
export type AffixType =
  | 'base_stat'       // 基础属性 (力量+10)
  | 'percent_stat'    // 百分比属性 (攻击+5%)
  | 'combat_stat'     // 战斗属性 (暴击率+3%)
  | 'element_damage'  // 元素伤害 (火系伤害+10%)
  | 'conditional'     // 条件触发 (HP<30%时攻击+20%)
  | 'special';        // 特殊效果 (攻击时5%概率触发火球)

/** 词条稀有度 */
export type AffixRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

// ============================================
// 条件触发词条
// ============================================

/** 条件类型 */
export type ConditionType =
  | 'hp_threshold'    // HP阈值 (HP<X%时)
  | 'mp_threshold'    // MP阈值 (MP<X%时)
  | 'on_crit'         // 暴击时
  | 'on_kill'         // 击杀时
  | 'on_hit'          // 被攻击时
  | 'on_attack';      // 攻击时

/** 条件运算符 */
export type ConditionOperator = 'lt' | 'gt' | 'eq' | 'lte' | 'gte';

/** 条件配置 */
export interface AffixCondition {
  type: ConditionType;
  threshold?: number;      // 阈值（如HP百分比）
  operator?: ConditionOperator;
}

/** 条件触发效果 */
export interface ConditionalEffect {
  stat: StatType;          // 影响的属性
  value: number;           // 数值
  isPercent: boolean;      // 是否百分比
}

/** 条件触发词条 */
export interface ConditionalAffix {
  templateId: string;
  name: string;
  type: 'conditional';
  description: string;
  condition: AffixCondition;
  effect: ConditionalEffect;
  rarity: AffixRarity;
}

// ============================================
// 特殊效果词条
// ============================================

/** 触发事件类型 */
export type TriggerEvent = 'on_attack' | 'on_hit' | 'on_crit' | 'on_kill';

/** 特殊效果类型 */
export type SpecialEffectType = 'skill' | 'damage' | 'status' | 'heal';

/** 状态效果类型 */
export type StatusEffectType = 'stun' | 'burn' | 'freeze' | 'poison' | 'slow' | 'silence';

/** 特殊效果触发配置 */
export interface SpecialTrigger {
  event: TriggerEvent;
  chance: number;          // 触发概率 (0-1)
}

/** 特殊效果配置 */
export interface SpecialEffect {
  type: SpecialEffectType;
  skillId?: string;        // 触发的技能ID
  damageValue?: number;    // 固定伤害值
  damagePercent?: number;  // 百分比伤害（基于攻击力）
  element?: 'fire' | 'ice' | 'thunder';
  statusEffect?: StatusEffectType;
  statusDuration?: number; // 状态持续回合
  healPercent?: number;    // 治疗百分比（基于最大HP）
}

/** 特殊效果词条 */
export interface SpecialAffix {
  templateId: string;
  name: string;
  type: 'special';
  description: string;
  trigger: SpecialTrigger;
  effect: SpecialEffect;
  rarity: AffixRarity;
}

// ============================================
// 通用词条
// ============================================

/** 词条模板 */
export interface AffixTemplate {
  id: string;
  name: string;
  type: AffixType;
  description: string;

  // 可出现的装备槽位
  allowedSlots: string[];

  // 品质范围
  qualityRange: {
    min: Quality;
    max: Quality;
  };

  // 数值范围
  valueRange: {
    min: number;
    max: number;
  };

  // 是否百分比
  isPercent: boolean;

  // 影响的属性
  targetStat: string;

  // 权重（用于随机抽取）
  weight: number;
}

/** 基础词条实例 */
export interface BaseAffix {
  templateId: string;
  name: string;
  type: 'base_stat' | 'percent_stat' | 'combat_stat' | 'element_damage';
  value: number;
  isPercent: boolean;
  targetStat: string;
  description: string;
}

/** 词条联合类型 */
export type Affix = BaseAffix | ConditionalAffix | SpecialAffix;

/** 词条锁定状态 */
export interface AffixLockState {
  equipmentId: string;
  lockedIndices: number[];  // 锁定的词条索引
}

/** 词条生成配置 */
export interface AffixGenerationConfig {
  quality: Quality;
  minAffixes: number;
  maxAffixes: number;
  excludedTypes?: AffixType[];
}

/** 洗练消耗 */
export interface ReforgeCost {
  reforgeStones: number;    // 洗练石数量
  lockStones: number;       // 锁定石数量
  gold: number;             // 金币
}

// ============================================
// 常量配置
// ============================================

/** MVP简化：词条类型分布 */
export const AFFIX_TYPE_DISTRIBUTION: Record<AffixType, number> = {
  base_stat: 35,       // 35%
  percent_stat: 25,    // 25%
  combat_stat: 15,     // 15%
  element_damage: 10,  // 10%
  conditional: 10,     // 10%
  special: 5,          // 5%
};

/** 按品质的数值范围倍率 */
export const QUALITY_AFFIX_MULTIPLIER: Record<Quality, number> = {
  common: 0.6,
  rare: 0.8,
  epic: 1.0,
  legendary: 1.3,
  mythic: 1.6,
};

/** 按词条稀有度的数值倍率 */
export const AFFIX_RARITY_MULTIPLIER: Record<AffixRarity, number> = {
  common: 1.0,
  rare: 1.3,
  epic: 1.6,
  legendary: 2.0,
  mythic: 2.5,
};

/** 锁定石消耗配置（按锁定词条数量） */
export const LOCK_STONE_COST: Record<number, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 6,
};

// ============================================
// 类型守卫
// ============================================

/** 检查是否为条件触发词条 */
export function isConditionalAffix(affix: Affix): affix is ConditionalAffix {
  return affix.type === 'conditional';
}

/** 检查是否为特殊效果词条 */
export function isSpecialAffix(affix: Affix): affix is SpecialAffix {
  return affix.type === 'special';
}

/** 检查是否为基础词条 */
export function isBaseAffix(affix: Affix): affix is BaseAffix {
  return affix.type !== 'conditional' && affix.type !== 'special';
}
