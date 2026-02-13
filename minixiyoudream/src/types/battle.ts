// 战斗类型定义

import type { UUID, Element, ElementResistances, CombatStats, ItemDrop, ExpReward } from './common';
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
