// 特性类型定义

import type { UUID, Quality } from './common';

/** 特性类型 */
export type TraitType =
  | 'stat_bonus'      // 属性加成
  | 'combat_bonus'    // 战斗加成
  | 'resource'        // 资源相关
  | 'special'         // 特殊效果
  | 'conditional';    // 条件触发

/** 特性效果 */
export interface TraitEffect {
  type: TraitType;
  target: 'self' | 'party' | 'enemy';
  stat?: string;
  value?: number;
  isPercent?: boolean;
  condition?: string;
  description: string;
}

/** 特性配置 */
export interface Trait {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 稀有度
  rarity: Quality;

  // 效果列表
  effects: TraitEffect[];

  // 是否可叠加
  stackable: boolean;
  maxStack?: number;

  // 冲突特性
  conflicts?: string[];
}

/** 角色拥有的特性 */
export interface CharacterTrait {
  traitId: string;
  acquiredAt: number;  // 获得时间戳
  source: 'creation' | 'item' | 'quest' | 'level';
}
