// 技能类型定义

import type { UUID, Quality, Element } from './common';

/** 技能类型 */
export type SkillType =
  | 'active'     // 主动技能
  | 'passive'    // 被动技能
  | 'trigger';   // 触发技能

/** 技能目标类型 */
export type SkillTargetType =
  | 'single_enemy'     // 单体敌人
  | 'all_enemies'      // 全体敌人
  | 'single_ally'      // 单体友方
  | 'all_allies'       // 全体友方
  | 'self'             // 自身
  | 'dead_ally';       // 死亡友方

/** 技能伤害类型 */
export type SkillDamageType = 'physical' | 'magic' | 'fixed' | 'true' | 'heal';

/** 技能效果 */
export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control' | 'summon';
  damageType?: SkillDamageType;
  element?: Element;
  baseValue?: number;
  multiplier?: number;
  statScale?: { stat: string; ratio: number };
  duration?: number;
  statusEffect?: string;
  description: string;
}

/** 技能配置 */
export interface Skill {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 技能类型
  type: SkillType;
  damageType: SkillDamageType;

  // 门派限制（null表示通用技能）
  factionId?: string | null;

  // 等级要求
  levelRequirement: number;

  // 品质
  rarity: Quality;

  // 目标类型
  targetType: SkillTargetType;

  // 元素属性
  element: Element;

  // 消耗
  mpCost: number;
  cooldown: number;

  // 效果
  effects: SkillEffect[];

  // 倍率
  multiplier: number;
}

/** 角色已学习技能 */
export interface LearnedSkill {
  skillId: string;
  level: number;
  cooldownRemaining: number;
}
