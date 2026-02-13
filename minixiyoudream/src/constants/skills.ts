// 技能配置数据（MVP简化版）

import type { Skill } from '@/types';

/** 基础技能列表 */
export const SKILLS: Record<string, Skill> = {
  // 大唐官府技能
  skill_hengsao: {
    id: 'skill_hengsao',
    name: '横扫千军',
    description: '连续攻击敌方3次，每次伤害递减',
    icon: '⚔️',
    type: 'active',
    damageType: 'physical',
    factionId: 'faction_datang',
    levelRequirement: 1,
    rarity: 'rare',
    targetType: 'single_enemy',
    element: 'none',
    mpCost: 30,
    cooldown: 0,
    effects: [{ type: 'damage', damageType: 'physical', multiplier: 0.8, description: '连续攻击3次' }],
    multiplier: 2.4,
  },
  skill_pojian: {
    id: 'skill_pojian',
    name: '破剑式',
    description: '对单个敌人造成高额伤害',
    icon: '🗡️',
    type: 'active',
    damageType: 'physical',
    factionId: 'faction_datang',
    levelRequirement: 10,
    rarity: 'common',
    targetType: 'single_enemy',
    element: 'none',
    mpCost: 20,
    cooldown: 0,
    effects: [{ type: 'damage', damageType: 'physical', multiplier: 1.5, description: '单体高伤害' }],
    multiplier: 1.5,
  },

  // 龙宫技能
  skill_longjuan: {
    id: 'skill_longjuan',
    name: '龙卷雨击',
    description: '召唤水龙攻击全体敌人',
    icon: '🐉',
    type: 'active',
    damageType: 'magic',
    factionId: 'faction_longgong',
    levelRequirement: 1,
    rarity: 'rare',
    targetType: 'all_enemies',
    element: 'ice',
    mpCost: 40,
    cooldown: 0,
    effects: [{ type: 'damage', damageType: 'magic', element: 'ice', multiplier: 0.8, description: '群体水系伤害' }],
    multiplier: 0.8,
  },
  skill_longteng: {
    id: 'skill_longteng',
    name: '龙腾',
    description: '对单个敌人造成水系伤害',
    icon: '🌊',
    type: 'active',
    damageType: 'magic',
    factionId: 'faction_longgong',
    levelRequirement: 15,
    rarity: 'common',
    targetType: 'single_enemy',
    element: 'ice',
    mpCost: 25,
    cooldown: 0,
    effects: [{ type: 'damage', damageType: 'magic', element: 'ice', multiplier: 1.8, description: '单体水系伤害' }],
    multiplier: 1.8,
  },

  // 魔王寨技能
  skill_feisha: {
    id: 'skill_feisha',
    name: '飞砂走石',
    description: '召唤火石攻击全体敌人，并附加灼烧',
    icon: '🔥',
    type: 'active',
    damageType: 'magic',
    factionId: 'faction_mowang',
    levelRequirement: 1,
    rarity: 'rare',
    targetType: 'all_enemies',
    element: 'fire',
    mpCost: 45,
    cooldown: 0,
    effects: [
      { type: 'damage', damageType: 'magic', element: 'fire', multiplier: 0.7, description: '群体火系伤害' },
      { type: 'debuff', statusEffect: 'burn', duration: 3, description: '附加灼烧3回合' },
    ],
    multiplier: 0.7,
  },

  // 普攻
  skill_attack: {
    id: 'skill_attack',
    name: '普通攻击',
    description: '对敌人进行普通攻击',
    icon: '👊',
    type: 'active',
    damageType: 'physical',
    factionId: null,
    levelRequirement: 1,
    rarity: 'common',
    targetType: 'single_enemy',
    element: 'none',
    mpCost: 0,
    cooldown: 0,
    effects: [{ type: 'damage', damageType: 'physical', multiplier: 1, description: '普通攻击' }],
    multiplier: 1,
  },

  // 防御
  skill_defend: {
    id: 'skill_defend',
    name: '防御',
    description: '进入防御姿态，减少受到的伤害',
    icon: '🛡️',
    type: 'active',
    damageType: 'physical',
    factionId: null,
    levelRequirement: 1,
    rarity: 'common',
    targetType: 'self',
    element: 'none',
    mpCost: 0,
    cooldown: 0,
    effects: [{ type: 'buff', duration: 1, description: '本回合防御+50%' }],
    multiplier: 0,
  },
};

/** 获取技能配置 */
export function getSkill(id: string): Skill | undefined {
  return SKILLS[id];
}

/** 获取门派技能列表 */
export function getFactionSkills(factionId: string): Skill[] {
  return Object.values(SKILLS).filter(s => s.factionId === factionId);
}

/** 获取通用技能 */
export function getCommonSkills(): Skill[] {
  return Object.values(SKILLS).filter(s => s.factionId === null);
}
