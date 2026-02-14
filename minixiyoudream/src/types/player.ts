// 玩家类型定义

import type { UUID, FullStats, ElementResistances, BaseStats } from './common';
import type { RaceType } from './race';
import type { EquipmentSlots } from './equipment';
import type { CharacterTrait } from './trait';
import type { LearnedSkill } from './skill';
import type { Pet } from './pet';

/** 已分配的属性点明细 */
export interface AllocatedPoints {
  strength: number;     // 分配到力量的点数
  intelligence: number; // 分配到灵力的点数
  vitality: number;     // 分配到体质的点数
  agility: number;      // 分配到敏捷的点数
  willpower: number;    // 分配到魔力的点数
}

/** 属性点分配影响说明 */
export interface AttributeEffect {
  stat: keyof BaseStats;
  name: string;
  icon: string;
  description: string;
  effects: string[];
}

/** 属性点影响配置 */
export const ATTRIBUTE_EFFECTS: AttributeEffect[] = [
  {
    stat: 'strength',
    name: '力量',
    icon: '💪',
    description: '增强物理攻击能力',
    effects: ['+2 物理攻击', '+0.3 物理防御', '+2 最大HP', '+0.1% 命中'],
  },
  {
    stat: 'intelligence',
    name: '灵力',
    icon: '🔮',
    description: '增强法术攻击能力',
    effects: ['+2.2 法术攻击', '+0.3 法术防御', '+2 最大MP'],
  },
  {
    stat: 'vitality',
    name: '体质',
    icon: '❤️',
    description: '增强生存能力',
    effects: ['+10 最大HP', '+1.5 物理防御', '+2 物理攻击'],
  },
  {
    stat: 'agility',
    name: '敏捷',
    icon: '💨',
    description: '提升速度和暴击',
    effects: ['+2 速度', '+0.5 物理攻击', '+0.2% 暴击率', '+1% 暴击伤害', '+0.1% 命中', '+0.2% 闪避'],
  },
  {
    stat: 'willpower',
    name: '魔力',
    icon: '💙',
    description: '增强法力和法防',
    effects: ['+8 最大MP', '+1.5 法术防御', '+0.5 法术攻击'],
  },
];

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

  // 属性点系统
  attributePoints: number;        // 未分配的属性点
  allocatedPoints: AllocatedPoints; // 已分配的属性点明细

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

  // 捕捉技能等级（1-10级，影响捕捉成功率）
  captureSkillLevel: number;

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
