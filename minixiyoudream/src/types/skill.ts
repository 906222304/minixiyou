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
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control' | 'summon' | 'utility' | 'dispel' | 'drain' | 'restore';
  damageType?: SkillDamageType;
  element?: Element;
  baseValue?: number;
  multiplier?: number;
  statScale?: { stat: string; ratio: number };
  stat?: string;
  value?: number;
  duration?: number;
  statusEffect?: string;
  probability?: number;  // 触发概率 (0-1)
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

  // 目标数量（多目标技能）
  targetCount?: number;

  // 元素属性
  element: Element;

  // 消耗
  mpCost: number;
  hpCostPercent?: number; // 消耗气血百分比（如血雨消耗20%气血）
  cooldown: number;

  // 效果
  effects: SkillEffect[];

  // 倍率
  multiplier: number;

  // 连击次数（默认1）
  hitCount?: number;

  // === 梦幻西游特性 ===

  // HP百分比要求（如横扫千军需要HP>50%）
  hpRequirement?: number;

  // 使用后休息回合数
  restAfterUse?: number;

  // 伤害递增比例（每次攻击递增，如横扫千军）
  increasingDamage?: number;

  // 技能等级要求（门派技能等级，非角色等级）
  skillLevelRequirement?: number;

  // 需要的基础技能ID
  requireBaseSkillId?: string;

  // 需要的基础技能等级
  requireBaseSkillLevel?: number;

  // 是否需要飞升
  requireAscension?: boolean;
}

/** 角色已学习技能 */
export interface LearnedSkill {
  skillId: string;
  level: number;
  cooldownRemaining: number;
}

// ==================== 基础技能系统 ====================

/** 基础技能属性加成类型 */
export type BaseSkillBonusType =
  | 'hitRate'      // 命中
  | 'damage'       // 伤害力
  | 'magicPower'   // 灵力
  | 'defense'      // 防御力
  | 'dodge'        // 躲避力
  | 'speed'        // 速度
  | 'hp'           // 气血上限
  | 'mp'           // 魔法上限
  | 'none';        // 无属性加成

/** 基础技能解锁的主动技能 */
export interface BaseSkillUnlock {
  skillId: string;
  requiredLevel: number;
  isAscension?: boolean;  // 是否需要飞升
}

/** 基础技能配置 */
export interface BaseSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  factionId: string;

  // 属性加成类型
  bonusType: BaseSkillBonusType;

  // 每级提供的属性值（如每级+2命中）
  bonusPerLevel: number;

  // 最大等级
  maxLevel: number;

  // 解锁的主动技能列表
  unlockSkills: BaseSkillUnlock[];
}

/** 角色已学习的基础技能 */
export interface LearnedBaseSkill {
  skillId: string;
  level: number;
}

/** 基础技能属性加成结果 */
export interface BaseSkillBonus {
  hitRate: number;
  damage: number;
  magicPower: number;
  defense: number;
  dodge: number;
  speed: number;
  hp: number;
  mp: number;
}
