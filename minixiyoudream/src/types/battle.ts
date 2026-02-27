// 战斗类型定义

import type { UUID, Element, ElementResistances, CombatStats, ItemDrop, ExpReward } from './common';
import type { RaceType } from './race';
import type { Player } from './player';
import type { Companion } from './companion';
import type { Pet } from './pet';
import type { Skill } from './skill';
import type { Enemy } from './enemy';

/** 战斗单位 */
export interface CombatUnit {
  id: UUID;
  name: string;
  type: 'player' | 'companion' | 'pet' | 'enemy';
  isPlayerSide: boolean;

  // 种族（仅玩家方单位有效）
  race?: RaceType;

  // 头像（玩家/伙伴/宠物使用图片头像，敌人使用emoji/图标）
  avatar?: string;

  // 属性
  stats: CombatStats;
  elementResistances: ElementResistances;
  element?: Element;

  // 战斗状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  // 技能
  skills: Skill[];

  // 状态效果
  statusEffects: StatusEffect[];

  // 行动状态
  isDefending: boolean;
  isDead: boolean;

  // 位置
  position: number;

  // 引用
  ref?: Player | Companion | Pet | Enemy;
}

/** 状态效果 */
export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'control';
  icon: string;

  // 效果
  statModifiers?: Partial<CombatStats>;
  dotDamage?: number;
  hotHeal?: number;

  // 控制
  stun?: boolean;
  silence?: boolean;
  taunt?: string;

  // 持续
  duration: number;
  remaining: number;

  // 来源
  sourceId: string;
}

/** 战斗阵容 */
export interface BattleFormation {
  characters: (CombatUnit | null)[];  // 3个人物位
  pets: (CombatUnit | null)[];        // 3个宠物位
}

/** 行动队列项 */
export interface ActionQueueItem {
  unit: CombatUnit;
  speed: number;
  isPlayerSide: boolean;
  position: number;
}

/** 战斗行动类型 */
export type BattleActionType = 'attack' | 'skill' | 'defend' | 'item' | 'escape' | 'capture';

/** 战斗行动 */
export interface BattleAction {
  actorId: UUID;
  type: BattleActionType;
  targetId?: UUID;
  skillId?: string;
  itemId?: string;
}

/** 战斗日志 */
export interface BattleLog {
  round: number;
  timestamp: number;
  actor: {
    id: UUID;
    name: string;
    isPlayer: boolean;
  };
  action: BattleActionType;
  skillId?: string;
  itemId?: string;
  target?: {
    id: UUID;
    name: string;
  };
  result: {
    damage?: number;
    heal?: number;
    isCritical?: boolean;
    isMiss?: boolean;
    effectsApplied?: string[];
  };
  text: string;
}

/** 战斗状态 */
export interface BattleState {
  id: UUID;

  // 阵容
  playerFormation: BattleFormation;
  enemies: CombatUnit[];

  // 行动队列
  actionQueue: ActionQueueItem[];
  currentActorIndex: number;

  // 回合
  round: number;
  maxRounds: number;

  // 日志
  logs: BattleLog[];

  // 战斗设置
  isAuto: boolean;
  speed: 1 | 2 | 3;

  // 战斗结果
  result?: BattleResult;

  // 种子（用于回放）
  seed: number;
}

/** 战斗结果 */
export interface BattleResult {
  victory: boolean;

  // 战斗统计
  stats: {
    rounds: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    criticalHits: number;
    skillsUsed: number;
  };

  // 奖励
  rewards: ExpReward & {
    items: ItemDrop[];
  };

  // 首次击杀奖励
  firstKill?: {
    bonus: ExpReward & { items: ItemDrop[] };
  };
}

/** 战斗类型 */
export type BattleType = 'wild' | 'dungeon' | 'boss' | 'pvp';

/** 战斗配置 */
export interface BattleConfig {
  type: BattleType;
  canEscape: boolean;
  canCapture: boolean;
  maxRounds: number;
}

/** 目标选择策略 */
export type TargetStrategy = 'random' | 'weakest' | 'strongest' | 'lowestHp' | 'highestHp';

/** 角色自动战斗配置 */
export interface CharacterAutoConfig {
  /** 优先使用的技能ID */
  preferredSkillId: string | null;
  /** 目标选择策略 */
  targetStrategy: TargetStrategy;
  /** HP低于此百分比时使用药品 (0-100) */
  hpThreshold: number;
  /** MP低于此百分比时使用药品 (0-100) */
  mpThreshold: number;
  /** 是否自动使用药品 */
  autoUsePotion: boolean;
}

/** 宠物自动战斗配置 */
export interface PetAutoConfig {
  /** 优先使用的技能ID */
  preferredSkillId: string | null;
  /** 目标选择策略 */
  targetStrategy: TargetStrategy;
}

/** 自动战斗配置 */
export interface AutoBattleConfig {
  /** 角色配置 */
  character: CharacterAutoConfig;
  /** 宠物配置 */
  pet: PetAutoConfig;
}

/** 伙伴AI策略 */
export type CompanionStrategy = 'aggressive' | 'balanced' | 'defensive';

/** 伙伴优先目标类型 */
export type CompanionPreferredTarget = 'random' | 'boss' | 'weakest' | 'highestDamage' | 'lowestHp';

/** 伙伴保护目标类型 */
export type CompanionProtectTarget = 'player' | 'weakest' | 'none';

/** 伙伴AI配置 */
export interface CompanionAIConfig {
  /** 伙伴ID */
  companionId: string;
  /** 攻击策略 */
  strategy: CompanionStrategy;
  /** 优先目标 */
  preferredTarget: CompanionPreferredTarget;
  /** 技能优先级列表 (技能ID按优先级排序) */
  skillPriority: string[];
  /** 保护目标 */
  protectTarget: CompanionProtectTarget;
  /** HP低于此百分比时更倾向于防御 (0-100) */
  defensiveHpThreshold: number;
  /** 是否自动使用治疗技能 */
  autoHeal: boolean;
  /** 治疗目标HP阈值 (0-100) */
  healThreshold: number;
}

/** 默认角色自动战斗配置 */
export const DEFAULT_CHARACTER_AUTO_CONFIG: CharacterAutoConfig = {
  preferredSkillId: null,
  targetStrategy: 'lowestHp',
  hpThreshold: 30,
  mpThreshold: 20,
  autoUsePotion: true,
};

/** 默认宠物自动战斗配置 */
export const DEFAULT_PET_AUTO_CONFIG: PetAutoConfig = {
  preferredSkillId: null,
  targetStrategy: 'random',
};

/** 默认自动战斗配置 */
export const DEFAULT_AUTO_BATTLE_CONFIG: AutoBattleConfig = {
  character: DEFAULT_CHARACTER_AUTO_CONFIG,
  pet: DEFAULT_PET_AUTO_CONFIG,
};

/** 默认伙伴AI配置 */
export const DEFAULT_COMPANION_AI_CONFIG: Omit<CompanionAIConfig, 'companionId'> = {
  strategy: 'balanced',
  preferredTarget: 'weakest',
  skillPriority: [],
  protectTarget: 'player',
  defensiveHpThreshold: 30,
  autoHeal: true,
  healThreshold: 40,
};
