// 词条类型定义

import type { Quality } from './common';

/** 词条类型 */
export type AffixType =
  | 'base_stat'       // 基础属性 (力量+10)
  | 'percent_stat'    // 百分比属性 (攻击+5%)
  | 'combat_stat'     // 战斗属性 (暴击率+3%)
  | 'element_damage'  // 元素伤害 (火系伤害+10%)
  | 'special';        // 特殊效果 (攻击时5%概率触发火球)

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

/** 词条实例 */
export interface Affix {
  templateId: string;
  name: string;
  type: AffixType;
  value: number;
  isPercent: boolean;
  targetStat: string;
  description: string;
}

/** 词条生成配置 */
export interface AffixGenerationConfig {
  quality: Quality;
  minAffixes: number;
  maxAffixes: number;
  excludedTypes?: AffixType[];
}

/** MVP简化：词条类型分布 */
export const AFFIX_TYPE_DISTRIBUTION: Record<AffixType, number> = {
  base_stat: 40,      // 40%
  percent_stat: 25,   // 25%
  combat_stat: 15,    // 15%
  element_damage: 10, // 10%
  special: 10,        // 10% (MVP暂不开放)
};

/** 按品质的数值范围倍率 */
export const QUALITY_AFFIX_MULTIPLIER: Record<Quality, number> = {
  common: 0.6,
  rare: 0.8,
  epic: 1.0,
  legendary: 1.3,
  mythic: 1.6,
};
