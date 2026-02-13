// 伙伴类型定义

import type { UUID, FullStats, ElementResistances, Quality } from './common';
import type { RaceType } from './race';
import type { EquipmentSlots } from './equipment';
import type { LearnedSkill } from './skill';
import type { Pet } from './pet';

/** 伙伴模板 */
export interface CompanionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;

  // 门派与种族
  factionId: string;
  race: RaceType;

  // 品质
  rarity: Quality;

  // 基础属性
  baseStats: FullStats;

  // 成长率
  growthRate: {
    strength: number;
    intelligence: number;
    vitality: number;
    agility: number;
    willpower: number;
  };

  // 初始技能
  initialSkills: string[];

  // 解锁条件
  unlockCondition: {
    type: 'story' | 'quest' | 'level' | 'item' | 'dungeon';
    targetId: string;
    description: string;
  };

  // 羁绊信息
  bonds: string[];

  // 个性对话
  dialogues: {
    greeting: string[];
    battle: string[];
    victory: string[];
    defeat: string[];
    idle: string[];
  };
}

/** 伙伴实例 */
export interface Companion {
  // 基础信息
  id: UUID;
  baseId: string;
  name: string;
  title: string;
  description: string;
  avatar: string;

  // 门派信息
  factionId: string;
  race: RaceType;

  // 等级与经验
  level: number;
  exp: number;
  maxLevel: number;

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

  // 好感度
  favorability: number;       // 0-100
  favorabilityLevel: number;  // 1-5

  // 出战状态
  inParty: boolean;
  partySlot: 0 | 1;

  // 宠物
  activePetId: UUID | null;
  pets: Pet[];

  // 战斗状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

/** 羁绊配置 */
export interface Bond {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 激活条件
  requiredCompanions: string[];
  minFavorability?: number;

  // 羁绊效果
  effects: BondEffect[];
}

/** 羁绊效果 */
export interface BondEffect {
  type: 'stat' | 'skill' | 'trigger' | 'passive';
  target: 'self' | 'party' | 'specific';
  targetIds?: string[];

  // 属性加成
  stat?: keyof FullStats;
  value?: number;
  isPercent?: boolean;

  // 技能加成
  skillId?: string;
  skillBonus?: number;

  // 触发效果
  trigger?: string;
  triggerEffect?: string;

  description: string;
}

/** 激活的羁绊 */
export interface ActiveBond {
  bondId: string;
  name: string;
  description: string;
  effects: BondEffect[];
  members: string[];
}

/** 好感度等级配置 */
export interface FavorabilityLevel {
  level: number;
  requiredFavorability: number;
  name: string;
  bonuses: {
    stat: string;
    value: number;
  }[];
}
