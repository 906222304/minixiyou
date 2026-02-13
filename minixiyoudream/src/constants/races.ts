// 种族配置数据

import type { Race, RaceType } from '@/types';

/** 人族配置 */
export const HUMAN_RACE: Race = {
  id: 'race_human',
  type: 'human',
  name: '人族',
  description: '均衡发展的种族，适应性强，可学习各种技能。',
  icon: '👨',

  statBonus: {
    strength: 1.05,     // +5%
    intelligence: 1.05,
    vitality: 1.05,
    agility: 1.05,
    willpower: 1.05,
  },

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

  statBonus: {
    strength: 1.0,
    intelligence: 1.15,  // +15%
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.1,      // +10%
  },

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

  statBonus: {
    strength: 1.15,      // +15%
    intelligence: 1.0,
    vitality: 1.1,       // +10%
    agility: 1.0,
    willpower: 1.0,
  },

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
