// 敌人配置数据

import type { EnemyTemplate, EnemyGroup, Enemy } from '@/types';
import { generateUUID } from '@/types';

/** 敌人模板列表 */
export const ENEMY_TEMPLATES: Record<string, EnemyTemplate> = {
  // 普通怪 - 1-5级
  enemy_rabbit: {
    id: 'enemy_rabbit',
    name: '野兔',
    description: '一只普通的野兔',
    icon: '🐰',
    type: 'normal',
    baseStats: {
      physicalAttack: 8,
      physicalDefense: 5,
      magicAttack: 0,
      magicDefense: 3,
      speed: 15,
      maxHp: 30,
      maxMp: 0,
      critRate: 0.02,
      critDamage: 0.3,
      hitRate: 0.9,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 1, max: 5 },
    expReward: 10,
    goldReward: 5,
    drops: [{ itemId: 'item_meat', rate: 0.3, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_wolf: {
    id: 'enemy_wolf',
    name: '野狼',
    description: '一只凶狠的野狼',
    icon: '🐺',
    type: 'normal',
    baseStats: {
      physicalAttack: 15,
      physicalDefense: 8,
      magicAttack: 0,
      magicDefense: 5,
      speed: 20,
      maxHp: 50,
      maxMp: 0,
      critRate: 0.05,
      critDamage: 0.4,
      hitRate: 0.9,
      dodgeRate: 0.05,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 2, max: 6 },
    expReward: 20,
    goldReward: 10,
    drops: [
      { itemId: 'item_fur', rate: 0.2, minCount: 1, maxCount: 2 },
      { itemId: 'item_meat', rate: 0.4, minCount: 1, maxCount: 1 },
    ],
    capturable: true,
    petTemplateId: 'pet_wolf',
  },

  enemy_snake: {
    id: 'enemy_snake',
    name: '竹叶青',
    description: '一条剧毒的竹叶青蛇',
    icon: '🐍',
    type: 'normal',
    baseStats: {
      physicalAttack: 18,
      physicalDefense: 5,
      magicAttack: 5,
      magicDefense: 8,
      speed: 25,
      maxHp: 40,
      maxMp: 20,
      critRate: 0.08,
      critDamage: 0.5,
      hitRate: 0.92,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: -10, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 3, max: 8 },
    expReward: 25,
    goldReward: 15,
    drops: [{ itemId: 'item_snake_skin', rate: 0.15, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_boar: {
    id: 'enemy_boar',
    name: '野猪',
    description: '一头凶猛的野猪',
    icon: '🐗',
    type: 'normal',
    baseStats: {
      physicalAttack: 25,
      physicalDefense: 20,
      magicAttack: 0,
      magicDefense: 10,
      speed: 12,
      maxHp: 100,
      maxMp: 0,
      critRate: 0.03,
      critDamage: 0.35,
      hitRate: 0.85,
      dodgeRate: 0.02,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'defensive',
    rarity: 'common',
    levelRange: { min: 5, max: 10 },
    expReward: 35,
    goldReward: 20,
    drops: [
      { itemId: 'item_tusk', rate: 0.1, minCount: 1, maxCount: 2 },
      { itemId: 'item_meat', rate: 0.5, minCount: 1, maxCount: 2 },
    ],
    capturable: false,
  },

  enemy_monkey: {
    id: 'enemy_monkey',
    name: '猕猴',
    description: '一只顽皮的猕猴',
    icon: '🐒',
    type: 'normal',
    baseStats: {
      physicalAttack: 20,
      physicalDefense: 10,
      magicAttack: 5,
      magicDefense: 12,
      speed: 30,
      maxHp: 60,
      maxMp: 30,
      critRate: 0.1,
      critDamage: 0.45,
      hitRate: 0.92,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 6, max: 12 },
    expReward: 40,
    goldReward: 25,
    drops: [{ itemId: 'item_banana', rate: 0.3, minCount: 1, maxCount: 2 }],
    capturable: false,
  },

  // 精英怪
  enemy_tiger: {
    id: 'enemy_tiger',
    name: '猛虎',
    description: '一只威猛的老虎',
    icon: '🐯',
    type: 'elite',
    baseStats: {
      physicalAttack: 45,
      physicalDefense: 25,
      magicAttack: 0,
      magicDefense: 15,
      speed: 28,
      maxHp: 200,
      maxMp: 0,
      critRate: 0.12,
      critDamage: 0.6,
      hitRate: 0.92,
      dodgeRate: 0.06,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 8, max: 15 },
    expReward: 100,
    goldReward: 80,
    drops: [
      { itemId: 'item_tiger_fur', rate: 0.2, minCount: 1, maxCount: 1 },
      { itemId: 'item_tiger_bone', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: true,
    petTemplateId: 'pet_tiger',
  },

  // Boss
  enemy_monkey_king: {
    id: 'enemy_monkey_king',
    name: '美猴王',
    description: '花果山的美猴王，实力强大',
    icon: '👑',
    type: 'boss',
    baseStats: {
      physicalAttack: 80,
      physicalDefense: 40,
      magicAttack: 30,
      magicDefense: 35,
      speed: 50,
      maxHp: 500,
      maxMp: 200,
      critRate: 0.15,
      critDamage: 0.7,
      hitRate: 0.95,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 20, ice: 20, thunder: 20 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'legendary',
    levelRange: { min: 12, max: 12 },
    expReward: 500,
    goldReward: 300,
    drops: [
      { itemId: 'item_golden_fur', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'equip_staff', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },
};

/** 敌人组配置 */
export const ENEMY_GROUPS: Record<string, EnemyGroup> = {
  enemy_group_wolves: {
    id: 'enemy_group_wolves',
    name: '狼群',
    enemies: [
      { templateId: 'enemy_wolf', level: 3, position: 0 },
      { templateId: 'enemy_wolf', level: 3, position: 1 },
    ],
  },
  enemy_group_rabbits: {
    id: 'enemy_group_rabbits',
    name: '野兔群',
    enemies: [
      { templateId: 'enemy_rabbit', level: 2, position: 0 },
      { templateId: 'enemy_rabbit', level: 2, position: 1 },
      { templateId: 'enemy_rabbit', level: 2, position: 2 },
    ],
  },
  enemy_group_bamboo: {
    id: 'enemy_group_bamboo',
    name: '竹林生物',
    enemies: [
      { templateId: 'enemy_snake', level: 5, position: 0 },
      { templateId: 'enemy_snake', level: 5, position: 1 },
    ],
  },
  enemy_group_snakes: {
    id: 'enemy_group_snakes',
    name: '蛇群',
    enemies: [
      { templateId: 'enemy_snake', level: 6, position: 0 },
      { templateId: 'enemy_snake', level: 6, position: 1 },
      { templateId: 'enemy_snake', level: 5, position: 2 },
    ],
  },
  enemy_group_boars: {
    id: 'enemy_group_boars',
    name: '野猪群',
    enemies: [
      { templateId: 'enemy_boar', level: 8, position: 0 },
      { templateId: 'enemy_boar', level: 7, position: 1 },
    ],
  },
  enemy_group_monkeys: {
    id: 'enemy_group_monkeys',
    name: '猴群',
    enemies: [
      { templateId: 'enemy_monkey', level: 9, position: 0 },
      { templateId: 'enemy_monkey', level: 9, position: 1 },
      { templateId: 'enemy_monkey', level: 8, position: 2 },
    ],
  },
  enemy_group_tigers: {
    id: 'enemy_group_tigers',
    name: '猛虎',
    enemies: [
      { templateId: 'enemy_tiger', level: 12, position: 0 },
    ],
  },
  enemy_group_boss_monkey: {
    id: 'enemy_group_boss_monkey',
    name: '美猴王',
    enemies: [
      { templateId: 'enemy_monkey_king', level: 12, position: 0 },
    ],
    formationBonus: { stat: 'physicalAttack', value: 10, isPercent: true },
  },
};

/** 创建敌人实例 */
export function createEnemy(templateId: string, level: number): Enemy | null {
  const template = ENEMY_TEMPLATES[templateId];
  if (!template) return null;

  const levelFactor = 1 + (level - template.levelRange.min) * 0.1;

  return {
    id: generateUUID(),
    templateId,
    name: template.name,
    type: template.type,
    level,
    stats: {
      physicalAttack: Math.floor(template.baseStats.physicalAttack * levelFactor),
      physicalDefense: Math.floor(template.baseStats.physicalDefense * levelFactor),
      magicAttack: Math.floor(template.baseStats.magicAttack * levelFactor),
      magicDefense: Math.floor(template.baseStats.magicDefense * levelFactor),
      speed: Math.floor(template.baseStats.speed * levelFactor),
      maxHp: Math.floor(template.baseStats.maxHp * levelFactor),
      maxMp: Math.floor(template.baseStats.maxMp * levelFactor),
      critRate: template.baseStats.critRate,
      critDamage: template.baseStats.critDamage,
      hitRate: template.baseStats.hitRate,
      dodgeRate: template.baseStats.dodgeRate,
    },
    elementResistances: { ...template.elementResistances },
    element: template.element,
    skills: [...template.skills],
    hp: Math.floor(template.baseStats.maxHp * levelFactor),
    maxHp: Math.floor(template.baseStats.maxHp * levelFactor),
    mp: Math.floor(template.baseStats.maxMp * levelFactor),
    maxMp: Math.floor(template.baseStats.maxMp * levelFactor),
    statusEffects: [],
    expReward: Math.floor(template.expReward * levelFactor),
    goldReward: Math.floor(template.goldReward * levelFactor),
    drops: template.drops.map(d => ({
      itemId: d.itemId,
      count: Math.floor(Math.random() * (d.maxCount - d.minCount + 1)) + d.minCount,
    })),
    capturable: template.capturable,
    petTemplateId: template.petTemplateId,
  };
}

/** 获取敌人模板 */
export function getEnemyTemplate(id: string): EnemyTemplate | undefined {
  return ENEMY_TEMPLATES[id];
}

/** 获取敌人组 */
export function getEnemyGroup(id: string): EnemyGroup | undefined {
  return ENEMY_GROUPS[id];
}
