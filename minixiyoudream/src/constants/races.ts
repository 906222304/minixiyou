// 种族配置数据

import type { Race, RaceType } from '@/types';

/** 人族配置 */
export const HUMAN_RACE: Race = {
  id: 'race_human',
  type: 'human',
  name: '人族',
  description: '均衡发展的种族，适应性强，可学习各种技能。',
  icon: '👨',

  // 初始基础属性 - 均衡型
  baseStats: {
    strength: 10,
    intelligence: 10,
    vitality: 10,
    agility: 10,
    willpower: 10,
  },

  // 属性成长 - 均衡成长
  statGrowth: {
    strength: 1.0,
    intelligence: 1.0,
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.0,
  },

  // 战斗属性加成
  statBonus: {
    strength: 1.05,     // +5%
    intelligence: 1.05,
    vitality: 1.05,
    agility: 1.05,
    willpower: 1.05,
  },

  // 种族特性
  traits: [
    {
      id: 'trait_human_adaptability',
      name: '适应',
      description: '所有属性均衡发展，适应性强',
      effect: { type: 'balanced', value: 0 },
    },
    {
      id: 'trait_human_versatility',
      name: '多才多艺',
      description: '可以加入更多门派',
      effect: { type: 'balanced', value: 0 },
    },
  ],

  passiveSkill: {
    id: 'passive_human_will',
    name: '坚韧意志',
    description: '致命伤害时有概率保留1点生命值',
    effect: '当受到致命伤害时，有10%概率保留1HP存活',
  },

  availableFactions: [
    'faction_datang',
    'faction_huasheng',
    'faction_fangcun',
    'faction_nver',
  ],
};

/** 仙族配置 */
export const CELESTIAL_RACE: Race = {
  id: 'race_celestial',
  type: 'celestial',
  name: '仙族',
  description: '灵力深厚的种族，擅长法术攻击，拥有强大的魔法能力。',
  icon: '🧚',

  // 初始基础属性 - 法术型
  baseStats: {
    strength: 8,
    intelligence: 14,
    vitality: 8,
    agility: 10,
    willpower: 10,
  },

  // 属性成长 - 法术成长
  statGrowth: {
    strength: 0.9,
    intelligence: 1.2,
    vitality: 0.9,
    agility: 1.0,
    willpower: 1.1,
  },

  // 战斗属性加成
  statBonus: {
    strength: 1.0,
    intelligence: 1.15,  // +15%
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.1,      // +10%
  },

  // 种族特性
  traits: [
    {
      id: 'trait_celestial_magic',
      name: '仙风道骨',
      description: '法术攻击+10%',
      effect: { type: 'magic_attack', value: 0.1 },
    },
    {
      id: 'trait_celestial_mana',
      name: '灵力充沛',
      description: '最大MP+10%',
      effect: { type: 'mp_bonus', value: 0.1 },
    },
  ],

  passiveSkill: {
    id: 'passive_celestial_protection',
    name: '仙体护佑',
    description: '每回合自动恢复少量MP',
    effect: '每回合结束时恢复2%最大MP',
  },

  availableFactions: [
    'faction_longgong',
    'faction_tiangong',
    'faction_putuo',
    'faction_wuzhuang',
  ],
};

/** 魔族配置 */
export const DEMON_RACE: Race = {
  id: 'race_demon',
  type: 'demon',
  name: '魔族',
  description: '体魄强健的种族，擅长物理攻击，拥有强大的生命力和攻击力。',
  icon: '👹',

  // 初始基础属性 - 物理型
  baseStats: {
    strength: 14,
    intelligence: 8,
    vitality: 10,
    agility: 10,
    willpower: 8,
  },

  // 属性成长 - 物理成长
  statGrowth: {
    strength: 1.2,
    intelligence: 0.9,
    vitality: 1.1,
    agility: 1.0,
    willpower: 0.8,
  },

  // 战斗属性加成
  statBonus: {
    strength: 1.15,      // +15%
    intelligence: 1.0,
    vitality: 1.1,       // +10%
    agility: 1.0,
    willpower: 1.0,
  },

  // 种族特性
  traits: [
    {
      id: 'trait_demon_strength',
      name: '魔血沸腾',
      description: '物理攻击+10%',
      effect: { type: 'physical_attack', value: 0.1 },
    },
    {
      id: 'trait_demon_vitality',
      name: '魔躯',
      description: '最大HP+10%',
      effect: { type: 'hp_bonus', value: 0.1 },
    },
  ],

  passiveSkill: {
    id: 'passive_demon_blood',
    name: '狂战血脉',
    description: '生命值低时攻击力提升',
    effect: '当HP低于30%时，物理攻击+20%',
  },

  availableFactions: [
    'faction_shituo',
    'faction_mowang',
    'faction_difu',
    'faction_pansi',
  ],
};

/** 所有种族配置 */
export const RACES: Record<RaceType, Race> = {
  human: HUMAN_RACE,
  celestial: CELESTIAL_RACE,
  demon: DEMON_RACE,
};

/** 获取种族配置 */
export function getRace(type: RaceType): Race {
  return RACES[type];
}

/** 获取所有种族列表 */
export function getAllRaces(): Race[] {
  return Object.values(RACES);
}
