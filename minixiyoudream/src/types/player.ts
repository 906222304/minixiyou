// 玩家类型定义

import type { UUID, FullStats, ElementResistances } from './common';
import type { RaceType } from './race';
import type { EquipmentSlots } from './equipment';
import type { CharacterTrait } from './trait';
import type { LearnedSkill } from './skill';
import type { Pet } from './pet';

/** 玩家配置 */
export interface Player {
  // 基础信息
  id: UUID;
  name: string;
  avatar: string;

  // 种族和门派
  race: RaceType;
  factionId: string;

  // 等级和经验
  level: number;
  exp: number;

  // 属性
  baseStats: FullStats;
  equipmentStats: Partial<FullStats>;
  bondStats: Partial<FullStats>;
  finalStats: FullStats;

  // 元素抗性
  elementResistances: ElementResistances;

  // 装备
  equipment: EquipmentSlots;

  // 技能
  skills: LearnedSkill[];
  skillPoints: number;

  // 特性
  traits: CharacterTrait[];

  // 资源
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;

  // 宠物
  activePetId: UUID | null;
  pets: Pet[];

  // 位置
  currentMapId: string;
  position: { x: number; y: number };

  // 时间
  createdAt: number;
  updatedAt: number;
  playTime: number; // 游戏时长（秒）
}

/** 创建角色的选项 */
export interface CreatePlayerOptions {
  name: string;
  race: RaceType;
  factionId: string;
  traitIds: string[];
}

/** 玩家状态 */
export interface PlayerState {
  player: Player | null;
  isLoading: boolean;
  error: string | null;
}
