// 种族配置数据

import type { Race, RaceType } from '@/types';

/** 人族配置 */
export const HUMAN_RACE: Race = {
  id: 'race_human',
  type: 'human',
  name: '人族',
  description: '均衡发展的种族，适应性强，所有属性获得5%加成。',
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

  // 战斗属性加成 - 人族特性：所有属性+5%
  statBonus: {
    strength: 1.05,     // +5%
    intelligence: 1.05,
    vitality: 1.05,
    agility: 1.05,
    willpower: 1.05,
  },

  // 种族特性 - 强化版
  traits: [
    {
      id: 'trait_human_adaptability',
      name: '万金油',
      description: '所有基础属性+5%',
      effect: { type: 'all_stats', value: 0.05 },
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
  description: '灵力深厚的种族，法术专精，法攻+15%，法防+10%。',
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

  // 战斗属性加成 - 仙族特性：法攻+15%，法防+10%
  statBonus: {
    strength: 1.0,
    intelligence: 1.15,  // +15% 法攻
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.1,      // +10% 法防
  },

  // 种族特性 - 强化版
  traits: [
    {
      id: 'trait_celestial_magic',
      name: '仙风道骨',
      description: '法术攻击+15%',
      effect: { type: 'magic_attack', value: 0.15 },
    },
    {
      id: 'trait_celestial_mana',
      name: '灵力充沛',
      description: '法术防御+10%',
      effect: { type: 'magic_defense', value: 0.1 },
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
  description: '体魄强健的种族，物理专精，物攻+15%，物防+10%。',
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

  // 战斗属性加成 - 魔族特性：物攻+15%，物防+10%
  statBonus: {
    strength: 1.15,      // +15% 物攻
    intelligence: 1.0,
    vitality: 1.1,       // +10% 物防
    agility: 1.0,
    willpower: 1.0,
  },

  // 种族特性 - 强化版
  traits: [
    {
      id: 'trait_demon_strength',
      name: '魔血沸腾',
      description: '物理攻击+15%',
      effect: { type: 'physical_attack', value: 0.15 },
    },
    {
      id: 'trait_demon_vitality',
      name: '魔躯',
      description: '物理防御+10%',
      effect: { type: 'physical_defense', value: 0.1 },
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

/** 妖族配置 - 敏捷专精 */
export const SPIRIT_RACE: Race = {
  id: 'race_spirit',
  type: 'spirit',
  name: '妖族',
  description: '天生的灵兽化身，敏捷专精，速度+20%，闪避+10%。',
  icon: '🦊',

  // 初始基础属性 - 敏捷型
  baseStats: {
    strength: 9,
    intelligence: 9,
    vitality: 8,
    agility: 14,
    willpower: 10,
  },

  // 属性成长 - 敏捷成长
  statGrowth: {
    strength: 1.0,
    intelligence: 1.0,
    vitality: 0.9,
    agility: 1.3,
    willpower: 1.0,
  },

  // 战斗属性加成 - 妖族特性：速度+20%，闪避+10%
  statBonus: {
    strength: 1.0,
    intelligence: 1.0,
    vitality: 1.0,
    agility: 1.2,        // +20% 速度
    willpower: 1.0,
  },

  // 种族特性 - 敏捷专精
  traits: [
    {
      id: 'trait_spirit_speed',
      name: '疾风步',
      description: '速度+20%',
      effect: { type: 'speed', value: 0.2 },
    },
    {
      id: 'trait_spirit_dodge',
      name: '灵闪',
      description: '闪避率+10%',
      effect: { type: 'dodge', value: 0.1 },
    },
  ],

  passiveSkill: {
    id: 'passive_spirit_reflex',
    name: '自然反射',
    description: '有概率闪避致命伤害',
    effect: '受到致命伤害时，有15%概率闪避此次伤害',
  },

  availableFactions: [
    'faction_shituo',
    'faction_pansi',
    'faction_fangcun',
    'faction_longgong',
  ],
};

/** 所有种族配置 */
export const RACES: Record<RaceType, Race> = {
  human: HUMAN_RACE,
  celestial: CELESTIAL_RACE,
  demon: DEMON_RACE,
  spirit: SPIRIT_RACE,
};

/** 获取种族配置 */
export function getRace(type: RaceType): Race {
  return RACES[type];
}

/** 获取所有种族列表 */
export function getAllRaces(): Race[] {
  return Object.values(RACES);
}
