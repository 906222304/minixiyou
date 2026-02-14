// 敌人类型定义

import type { UUID, Quality, CombatStats, Element, ItemDrop } from './common';
import type { PetSkill } from './pet';

/** 敌人类型 */
export type EnemyType =
  | 'normal'   // 普通怪
  | 'elite'    // 精英怪
  | 'boss'     // Boss
  | 'rare';    // 稀有怪

/** 敌人AI行为 */
export type EnemyAIBehavior =
  | 'aggressive'   // 激进
  | 'defensive'    // 防御
  | 'balanced'     // 平衡
  | 'support';     // 辅助

/** 敌人模板 */
export interface EnemyTemplate {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 类型
  type: EnemyType;

  // 属性
  baseStats: CombatStats;

  // 元素
  element?: Element;
  elementResistances: {
    fire: number;
    ice: number;
    thunder: number;
  };

  // 技能
  skills: PetSkill[];

  // AI行为
  aiBehavior: EnemyAIBehavior;

  // 品质（影响掉落）
  rarity: Quality;

  // 等级范围
  levelRange: {
    min: number;
    max: number;
  };

  // 奖励
  expReward: number;
  goldReward: number;

  // 掉落
  drops: {
    itemId: string;
    rate: number;
    minCount: number;
    maxCount: number;
  }[];

  // 可捕捉
  capturable: boolean;
  petTemplateId?: string;

  // 出现条件
  spawnConditions?: {
    time?: 'day' | 'night' | 'any';
    weather?: string;
    requiredItem?: string;
  };
}

/** 敌人实例 */
export interface Enemy {
  id: UUID;
  templateId: string;
  name: string;
  type: EnemyType;

  // 等级
  level: number;

  // 属性（应用等级缩放后）
  stats: CombatStats;
  elementResistances: {
    fire: number;
    ice: number;
    thunder: number;
  };
  element?: Element;

  // 技能
  skills: PetSkill[];

  // 战斗状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  // 状态效果
  statusEffects: {
    id: string;
    name: string;
    duration: number;
    remaining: number;
  }[];

  // 奖励（实例化后）
  expReward: number;
  goldReward: number;
  drops: ItemDrop[];

  // 可捕捉
  capturable: boolean;
  petTemplateId?: string;
}

/** 怪物组难度 */
export type EnemyGroupDifficulty = 'easy' | 'normal' | 'hard' | 'elite' | 'boss';

/** 敌人组中的敌人配置（支持动态生成） */
export interface EnemyGroupMemberConfig {
  templateId: string;         // 怪物模板ID
  minLevel?: number;          // 最小等级（如果不设置，使用模板默认）
  maxLevel?: number;          // 最大等级
  minCount: number;           // 最小数量
  maxCount: number;           // 最大数量
  weight: number;             // 出现权重（用于随机选择）
  position?: number;          // 固定位置（可选）
}

/** 敌人组固定配置（用于固定阵容） */
export interface EnemyGroupFixedMember {
  templateId: string;
  level: number;
  position: number;
}

/** 敌人组（支持动态生成和固定阵容两种模式） */
export interface EnemyGroup {
  id: string;
  name: string;

  // 动态生成配置（随机生成怪物组合）
  dynamicConfig?: {
    members: EnemyGroupMemberConfig[];  // 可能出现的怪物
    minTotalCount: number;               // 最少怪物总数
    maxTotalCount: number;               // 最多怪物总数
    totalLevelRange?: {                  // 总等级范围限制
      min: number;
      max: number;
    };
  };

  // 固定阵容配置
  enemies?: EnemyGroupFixedMember[];

  // 难度
  difficulty: EnemyGroupDifficulty;

  // 阵型加成
  formationBonus?: {
    stat: keyof CombatStats;
    value: number;
    isPercent: boolean;
  };

  // 出现权重（用于地图选择怪物组）
  weight?: number;

  // 描述
  description?: string;

  // 图标
  icon?: string;
}

/** 生成敌人的配置 */
export interface EnemySpawnConfig {
  templateId: string;
  level: number;
  difficulty?: number;  // 难度系数
}
