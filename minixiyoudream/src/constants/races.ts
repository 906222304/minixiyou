// 种族配置数据 - 三族设计

import type { Race, RaceType } from '@/types';

/**
 * 种族设计说明：
 *
 * 三族特性对比：
 * | 种族 | 特性1（核心） | 特性2（生存） | 特性3（续航/成长） |
 * |------|--------------|--------------|-------------------|
 * | 人族 | 全能（全属性+5%，伤害+8%） | 坚韧（20%存活致命伤） | 适应力（经验+15%，冷却-1） |
 * | 仙族 | 法神（法伤+18%） | 法力护盾（MP抵扣伤害） | 灵力充沛（MP+15%，每回合+4%） |
 * | 魔族 | 狂战士（物伤+18%，HP+18%） | 狂暴（残血最高+40%物攻） | 顽韧（15%存活并回血15%） |
 */

/** 人族配置 - 全能均衡型 */
export const HUMAN_RACE: Race = {
  id: 'race_human',
  type: 'human',
  name: '人族',
  description: '全能均衡的种族，各项属性均衡发展，技能释放更快，适合新手玩家。',
  icon: '👨',

  // 初始基础属性 - 均衡型
  baseStats: {
    strength: 10,
    intelligence: 10,
    vitality: 10,
    agility: 10,
    willpower: 10,
  },

  // 属性成长 - 人族：均衡成长（基准值1.0）
  statGrowth: {
    strength: 1.0,
    intelligence: 1.0,
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.0,
  },

  // 战斗属性加成 - 人族特性：全属性+5%
  statBonus: {
    strength: 1.05,
    intelligence: 1.05,
    vitality: 1.05,
    agility: 1.05,
    willpower: 1.05,
  },

  // 种族特性（3个）
  traits: [
    {
      id: 'trait_human_versatile',
      name: '全能',
      description: '全属性+5%，全技能伤害+8%',
      effect: { type: 'all_stats', value: 0.05 },
    },
    {
      id: 'trait_human_tenacity',
      name: '坚韧',
      description: '受到致命伤害时，20%概率保留1HP存活',
      effect: { type: 'survive_fatal', value: 0.2 },
    },
    {
      id: 'trait_human_adaptability',
      name: '适应力',
      description: '战斗经验+15%，技能冷却时间-1回合',
      effect: { type: 'exp_bonus', value: 0.15 },
    },
  ],

  availableFactions: [
    'faction_datang',
    'faction_huasheng',
    'faction_fangcun',
    'faction_nver',
    'faction_shenmulin',
    'faction_tianjicheng',
    'faction_donghaiyuan',
    'faction_jiulicheng',
  ],
};

/** 仙族配置 - 法术专精型 */
export const CELESTIAL_RACE: Race = {
  id: 'race_celestial',
  type: 'celestial',
  name: '仙族',
  description: '灵力深厚的种族，擅长法术，MP续航能力强，适合法系门派。',
  icon: '🧚',

  // 初始基础属性 - 法术型
  baseStats: {
    strength: 8,
    intelligence: 12,
    vitality: 10,
    agility: 10,
    willpower: 12,
  },

  // 属性成长 - 仙族：法术成长高，物理成长低
  statGrowth: {
    strength: 0.9,
    intelligence: 1.15,
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.2,
  },

  // 战斗属性加成 - 仙族特性
  statBonus: {
    strength: 0.95,
    intelligence: 1.1,
    vitality: 1.0,
    agility: 1.0,
    willpower: 1.15,
  },

  // 种族特性（3个）
  traits: [
    {
      id: 'trait_celestial_magic',
      name: '法神',
      description: '法术伤害+18%',
      effect: { type: 'magic_attack', value: 0.18 },
    },
    {
      id: 'trait_celestial_shield',
      name: '法力护盾',
      description: '受到伤害时，可消耗MP抵扣（MP:HP=1:2，每回合上限15%最大HP）',
      effect: { type: 'mp_shield', value: 0.5 },
    },
    {
      id: 'trait_celestial_mana',
      name: '灵力充沛',
      description: 'MP上限+15%，每回合恢复4%最大MP',
      effect: { type: 'mp_regen', value: 0.04 },
    },
  ],

  availableFactions: [
    'faction_longgong',
    'faction_tiangong',
    'faction_putuo',
    'faction_wuzhuang',
    'faction_lingbocheng',
    'faction_huaguoshan',
  ],
};

/** 魔族配置 - 物理爆发型 */
export const DEMON_RACE: Race = {
  id: 'race_demon',
  type: 'demon',
  name: '魔族',
  description: '体魄强健的种族，擅长物理攻击，残血时爆发力更强，适合物理门派。',
  icon: '👹',

  // 初始基础属性 - 物理型
  baseStats: {
    strength: 12,
    intelligence: 8,
    vitality: 12,
    agility: 10,
    willpower: 8,
  },

  // 属性成长 - 魔族：物理成长高，法术成长低
  statGrowth: {
    strength: 1.15,
    intelligence: 0.9,
    vitality: 1.2,
    agility: 1.0,
    willpower: 0.9,
  },

  // 战斗属性加成 - 魔族特性
  statBonus: {
    strength: 1.1,
    intelligence: 0.95,
    vitality: 1.18,
    agility: 1.0,
    willpower: 0.9,
  },

  // 种族特性（3个）
  traits: [
    {
      id: 'trait_demon_berserker',
      name: '狂战士',
      description: '物理伤害+18%，HP上限+18%',
      effect: { type: 'physical_attack', value: 0.18 },
    },
    {
      id: 'trait_demon_rage',
      name: '狂暴',
      description: 'HP每降低10%，物理攻击+4%（最高+40%）',
      effect: { type: 'low_hp_attack', value: 0.04 },
    },
    {
      id: 'trait_demon_resilient',
      name: '顽韧',
      description: '受到致命伤害时，15%概率存活并恢复15%HP',
      effect: { type: 'survive_heal', value: 0.15 },
    },
  ],

  availableFactions: [
    'faction_shituo',
    'faction_mowang',
    'faction_difu',
    'faction_pansi',
    'faction_wudidong',
    'faction_nvbaomu',
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

/**
 * 种族属性成长对比表
 *
 * | 种族 | 物攻 | 法攻 | 血量 | 速度 | 魔法 |
 * |------|------|------|------|------|------|
 * | 人族 | 1.0  | 1.0  | 1.0  | 1.0  | 1.0  |
 * | 仙族 | 0.9  | 1.15 | 1.0  | 1.0  | 1.2  |
 * | 魔族 | 1.15 | 0.9  | 1.2  | 1.0  | 0.9  |
 */
export const RACE_GROWTH_COMPARISON = {
  human: { physical: 1.0, magic: 1.0, hp: 1.0, speed: 1.0, mp: 1.0 },
  celestial: { physical: 0.9, magic: 1.15, hp: 1.0, speed: 1.0, mp: 1.2 },
  demon: { physical: 1.15, magic: 0.9, hp: 1.2, speed: 1.0, mp: 0.9 },
} as const;
