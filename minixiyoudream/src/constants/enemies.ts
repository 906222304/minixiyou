// 敌人配置数据

import type { EnemyTemplate, EnemyGroup, Enemy } from '@/types';
import { generateUUID } from '@/types';
import { random, randomInt } from '@/utils/prng';

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
    drops: [
      { itemId: 'item_meat', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_fur', rate: 0.15, minCount: 1, maxCount: 1 },
    ],
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
    drops: [
      { itemId: 'item_snake_skin', rate: 0.15, minCount: 1, maxCount: 1 },
      { itemId: 'item_poison_gland', rate: 0.05, minCount: 1, maxCount: 1 },
    ],
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
      { itemId: 'item_bone', rate: 0.15, minCount: 1, maxCount: 1 },
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
    drops: [
      { itemId: 'item_banana', rate: 0.3, minCount: 1, maxCount: 2 },
      { itemId: 'item_fur', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  enemy_eagle: {
    id: 'enemy_eagle',
    name: '山鹰',
    description: '山顶盘旋的山鹰',
    icon: '🦅',
    type: 'normal',
    baseStats: {
      physicalAttack: 22,
      physicalDefense: 8,
      magicAttack: 0,
      magicDefense: 10,
      speed: 35,
      maxHp: 50,
      maxMp: 0,
      critRate: 0.12,
      critDamage: 0.5,
      hitRate: 0.95,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 6, max: 10 },
    expReward: 38,
    goldReward: 22,
    drops: [
      { itemId: 'item_feather', rate: 0.25, minCount: 1, maxCount: 2 },
      { itemId: 'item_meat', rate: 0.2, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  enemy_frog: {
    id: 'enemy_frog',
    name: '毒蛙',
    description: '溪边的毒蛙',
    icon: '🐸',
    type: 'normal',
    baseStats: {
      physicalAttack: 15,
      physicalDefense: 8,
      magicAttack: 12,
      magicDefense: 15,
      speed: 18,
      maxHp: 45,
      maxMp: 20,
      critRate: 0.05,
      critDamage: 0.4,
      hitRate: 0.88,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: -10, ice: 15, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 5, max: 9 },
    expReward: 28,
    goldReward: 18,
    drops: [
      { itemId: 'item_poison_gland', rate: 0.1, minCount: 1, maxCount: 1 },
      { itemId: 'item_hp_potion_small', rate: 0.05, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  enemy_bat: {
    id: 'enemy_bat',
    name: '蝙蝠',
    description: '洞穴中的蝙蝠',
    icon: '🦇',
    type: 'normal',
    baseStats: {
      physicalAttack: 18,
      physicalDefense: 5,
      magicAttack: 8,
      magicDefense: 10,
      speed: 32,
      maxHp: 35,
      maxMp: 15,
      critRate: 0.1,
      critDamage: 0.4,
      hitRate: 0.9,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 4, max: 8 },
    expReward: 22,
    goldReward: 15,
    drops: [
      { itemId: 'item_bat_wing', rate: 0.2, minCount: 1, maxCount: 1 },
      { itemId: 'item_exp_pill_small', rate: 0.03, minCount: 1, maxCount: 1 },
    ],
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
      { itemId: 'item_enhance_stone', rate: 0.15, minCount: 1, maxCount: 1 },
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
      { itemId: 'item_spirit_ball', rate: 0.2, minCount: 1, maxCount: 1 },
      { itemId: 'item_enhance_stone_supreme', rate: 0.15, minCount: 1, maxCount: 2 },
      { itemId: 'item_exp_pill_large', rate: 0.25, minCount: 1, maxCount: 2 },
      { itemId: 'item_treasure_box_gold', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  // ========== 东土大唐区域怪物 ==========

  // 普通怪 - 10-15级
  enemy_fox: {
    id: 'enemy_fox',
    name: '野狐',
    description: '一只狡猾的野狐',
    icon: '🦊',
    type: 'normal',
    baseStats: {
      physicalAttack: 25,
      physicalDefense: 12,
      magicAttack: 8,
      magicDefense: 15,
      speed: 35,
      maxHp: 80,
      maxMp: 30,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.92,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 10, max: 14 },
    expReward: 50,
    goldReward: 35,
    drops: [{ itemId: 'item_fox_fur', rate: 0.2, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_deer: {
    id: 'enemy_deer',
    name: '灵鹿',
    description: '一只敏捷的灵鹿',
    icon: '🦌',
    type: 'normal',
    baseStats: {
      physicalAttack: 20,
      physicalDefense: 15,
      magicAttack: 10,
      magicDefense: 18,
      speed: 28,
      maxHp: 100,
      maxMp: 40,
      critRate: 0.05,
      critDamage: 0.4,
      hitRate: 0.9,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: 0, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'defensive',
    rarity: 'common',
    levelRange: { min: 10, max: 13 },
    expReward: 45,
    goldReward: 30,
    drops: [{ itemId: 'item_deer_antler', rate: 0.1, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_bandit: {
    id: 'enemy_bandit',
    name: '山贼',
    description: '拦路抢劫的山贼',
    icon: '🗡️',
    type: 'normal',
    baseStats: {
      physicalAttack: 35,
      physicalDefense: 20,
      magicAttack: 0,
      magicDefense: 10,
      speed: 22,
      maxHp: 120,
      maxMp: 0,
      critRate: 0.08,
      critDamage: 0.5,
      hitRate: 0.88,
      dodgeRate: 0.05,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 11, max: 16 },
    expReward: 55,
    goldReward: 50,
    drops: [
      { itemId: 'item_bandit_badge', rate: 0.15, minCount: 1, maxCount: 1 },
      { itemId: 'item_gold', rate: 0.3, minCount: 1, maxCount: 3 },
    ],
    capturable: false,
  },

  enemy_wild_dog: {
    id: 'enemy_wild_dog',
    name: '野狗',
    description: '成群结队的野狗',
    icon: '🐕',
    type: 'normal',
    baseStats: {
      physicalAttack: 28,
      physicalDefense: 12,
      magicAttack: 0,
      magicDefense: 8,
      speed: 30,
      maxHp: 70,
      maxMp: 0,
      critRate: 0.1,
      critDamage: 0.45,
      hitRate: 0.9,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 10, max: 14 },
    expReward: 40,
    goldReward: 25,
    drops: [{ itemId: 'item_dog_fang', rate: 0.15, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  // 普通怪 - 15-20级
  enemy_spider_small: {
    id: 'enemy_spider_small',
    name: '小蜘蛛',
    description: '一只小型毒蜘蛛',
    icon: '🕷️',
    type: 'normal',
    baseStats: {
      physicalAttack: 30,
      physicalDefense: 10,
      magicAttack: 15,
      magicDefense: 12,
      speed: 25,
      maxHp: 60,
      maxMp: 30,
      critRate: 0.08,
      critDamage: 0.4,
      hitRate: 0.9,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: -10, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 14, max: 18 },
    expReward: 60,
    goldReward: 40,
    drops: [{ itemId: 'item_spider_silk', rate: 0.2, minCount: 1, maxCount: 2 }],
    capturable: false,
  },

  enemy_spider_poison: {
    id: 'enemy_spider_poison',
    name: '毒蛛',
    description: '一只剧毒蜘蛛',
    icon: '🕷️',
    type: 'normal',
    baseStats: {
      physicalAttack: 35,
      physicalDefense: 12,
      magicAttack: 25,
      magicDefense: 15,
      speed: 28,
      maxHp: 80,
      maxMp: 50,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.92,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: -10, ice: 15, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 16, max: 20 },
    expReward: 75,
    goldReward: 55,
    drops: [
      { itemId: 'item_spider_silk', rate: 0.25, minCount: 1, maxCount: 2 },
      { itemId: 'item_poison_gland', rate: 0.15, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  enemy_ghost: {
    id: 'enemy_ghost',
    name: '游魂',
    description: '一缕游荡的鬼魂',
    icon: '👻',
    type: 'normal',
    baseStats: {
      physicalAttack: 15,
      physicalDefense: 5,
      magicAttack: 40,
      magicDefense: 30,
      speed: 35,
      maxHp: 70,
      maxMp: 80,
      critRate: 0.12,
      critDamage: 0.55,
      hitRate: 0.9,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: -20, ice: 20, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 13, max: 18 },
    expReward: 65,
    goldReward: 45,
    drops: [{ itemId: 'item_ghost_essence', rate: 0.15, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_water_demon: {
    id: 'enemy_water_demon',
    name: '水妖',
    description: '河流中的水妖',
    icon: '🌊',
    type: 'normal',
    baseStats: {
      physicalAttack: 32,
      physicalDefense: 18,
      magicAttack: 28,
      magicDefense: 25,
      speed: 22,
      maxHp: 110,
      maxMp: 60,
      critRate: 0.08,
      critDamage: 0.45,
      hitRate: 0.88,
      dodgeRate: 0.06,
    },
    elementResistances: { fire: -15, ice: 25, thunder: -10 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 12, max: 17 },
    expReward: 70,
    goldReward: 50,
    drops: [{ itemId: 'item_water_gem', rate: 0.1, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_fishman: {
    id: 'enemy_fishman',
    name: '鱼人',
    description: '半人半鱼的生物',
    icon: '🐟',
    type: 'normal',
    baseStats: {
      physicalAttack: 38,
      physicalDefense: 22,
      magicAttack: 10,
      magicDefense: 18,
      speed: 25,
      maxHp: 130,
      maxMp: 30,
      critRate: 0.06,
      critDamage: 0.4,
      hitRate: 0.85,
      dodgeRate: 0.05,
    },
    elementResistances: { fire: -10, ice: 20, thunder: -5 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 11, max: 16 },
    expReward: 60,
    goldReward: 42,
    drops: [{ itemId: 'item_fish_scale', rate: 0.2, minCount: 1, maxCount: 2 }],
    capturable: false,
  },

  // 精英怪 - 15-25级
  enemy_fox_spirit: {
    id: 'enemy_fox_spirit',
    name: '狐妖',
    description: '修炼成精的狐狸',
    icon: '🦊',
    type: 'elite',
    baseStats: {
      physicalAttack: 55,
      physicalDefense: 25,
      magicAttack: 45,
      magicDefense: 35,
      speed: 40,
      maxHp: 250,
      maxMp: 150,
      critRate: 0.15,
      critDamage: 0.6,
      hitRate: 0.92,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 10, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'rare',
    levelRange: { min: 15, max: 22 },
    expReward: 150,
    goldReward: 120,
    drops: [
      { itemId: 'item_fox_fur', rate: 0.3, minCount: 1, maxCount: 2 },
      { itemId: 'item_fox_pearl', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: true,
    petTemplateId: 'pet_fox_spirit',
  },

  enemy_spider_elite: {
    id: 'enemy_spider_elite',
    name: '巨蛛',
    description: '体型巨大的蜘蛛',
    icon: '🕷️',
    type: 'elite',
    baseStats: {
      physicalAttack: 60,
      physicalDefense: 30,
      magicAttack: 35,
      magicDefense: 25,
      speed: 28,
      maxHp: 300,
      maxMp: 100,
      critRate: 0.12,
      critDamage: 0.55,
      hitRate: 0.9,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: -15, ice: 15, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 17, max: 23 },
    expReward: 180,
    goldReward: 140,
    drops: [
      { itemId: 'item_spider_silk', rate: 0.4, minCount: 2, maxCount: 4 },
      { itemId: 'item_poison_gland', rate: 0.25, minCount: 1, maxCount: 2 },
    ],
    capturable: false,
  },

  enemy_bandit_elite: {
    id: 'enemy_bandit_elite',
    name: '山贼头目',
    description: '山贼中的精英头目',
    icon: '⚔️',
    type: 'elite',
    baseStats: {
      physicalAttack: 65,
      physicalDefense: 40,
      magicAttack: 5,
      magicDefense: 20,
      speed: 30,
      maxHp: 350,
      maxMp: 50,
      critRate: 0.15,
      critDamage: 0.6,
      hitRate: 0.9,
      dodgeRate: 0.06,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 18, max: 24 },
    expReward: 200,
    goldReward: 180,
    drops: [
      { itemId: 'item_bandit_badge', rate: 0.3, minCount: 1, maxCount: 2 },
      { itemId: 'item_gold', rate: 0.5, minCount: 3, maxCount: 5 },
    ],
    capturable: false,
  },

  enemy_tiger_datang: {
    id: 'enemy_tiger_datang',
    name: '大唐猛虎',
    description: '大唐境内凶猛的老虎',
    icon: '🐯',
    type: 'elite',
    baseStats: {
      physicalAttack: 70,
      physicalDefense: 35,
      magicAttack: 0,
      magicDefense: 22,
      speed: 35,
      maxHp: 320,
      maxMp: 0,
      critRate: 0.18,
      critDamage: 0.65,
      hitRate: 0.92,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 16, max: 22 },
    expReward: 170,
    goldReward: 130,
    drops: [
      { itemId: 'item_tiger_fur', rate: 0.25, minCount: 1, maxCount: 1 },
      { itemId: 'item_tiger_bone', rate: 0.15, minCount: 1, maxCount: 1 },
    ],
    capturable: true,
    petTemplateId: 'pet_tiger',
  },

  enemy_fox_illusion: {
    id: 'enemy_fox_illusion',
    name: '狐妖幻影',
    description: '狐妖制造的幻影分身',
    icon: '✨',
    type: 'elite',
    baseStats: {
      physicalAttack: 40,
      physicalDefense: 15,
      magicAttack: 55,
      magicDefense: 40,
      speed: 45,
      maxHp: 180,
      maxMp: 200,
      critRate: 0.2,
      critDamage: 0.7,
      hitRate: 0.95,
      dodgeRate: 0.2,
    },
    elementResistances: { fire: 15, ice: 15, thunder: 15 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'rare',
    levelRange: { min: 18, max: 26 },
    expReward: 160,
    goldReward: 100,
    drops: [{ itemId: 'item_illusion_crystal', rate: 0.15, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_skeleton_warrior: {
    id: 'enemy_skeleton_warrior',
    name: '骷髅战士',
    description: '被诅咒的骷髅战士',
    icon: '💀',
    type: 'elite',
    baseStats: {
      physicalAttack: 58,
      physicalDefense: 32,
      magicAttack: 20,
      magicDefense: 28,
      speed: 25,
      maxHp: 280,
      maxMp: 50,
      critRate: 0.12,
      critDamage: 0.55,
      hitRate: 0.88,
      dodgeRate: 0.05,
    },
    elementResistances: { fire: 0, ice: 10, thunder: -20 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 19, max: 25 },
    expReward: 190,
    goldReward: 150,
    drops: [
      { itemId: 'item_bone', rate: 0.3, minCount: 1, maxCount: 2 },
      { itemId: 'item_cursed_gem', rate: 0.08, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  enemy_fairy_beast: {
    id: 'enemy_fairy_beast',
    name: '仙兽',
    description: '山中修炼的仙兽',
    icon: '🦄',
    type: 'elite',
    baseStats: {
      physicalAttack: 65,
      physicalDefense: 38,
      magicAttack: 50,
      magicDefense: 45,
      speed: 38,
      maxHp: 350,
      maxMp: 180,
      critRate: 0.15,
      critDamage: 0.6,
      hitRate: 0.92,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: 20, ice: 20, thunder: 20 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'rare',
    levelRange: { min: 20, max: 25 },
    expReward: 220,
    goldReward: 180,
    drops: [
      { itemId: 'item_fairy_dust', rate: 0.2, minCount: 1, maxCount: 2 },
      { itemId: 'item_immortal_herb', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: true,
    petTemplateId: 'pet_fairy_beast',
  },

  // Boss - 大唐区域
  boss_spider_queen: {
    id: 'boss_spider_queen',
    name: '蛛后',
    description: '蜘蛛巢穴的统治者，拥有剧毒和蛛网的力量',
    icon: '🕷️',
    type: 'boss',
    baseStats: {
      physicalAttack: 90,
      physicalDefense: 50,
      magicAttack: 80,
      magicDefense: 60,
      speed: 35,
      maxHp: 1200,
      maxMp: 400,
      critRate: 0.18,
      critDamage: 0.7,
      hitRate: 0.95,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: -20, ice: 30, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'legendary',
    levelRange: { min: 18, max: 18 },
    expReward: 800,
    goldReward: 500,
    drops: [
      { itemId: 'item_spider_queen_gem', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_poison_essence', rate: 0.4, minCount: 1, maxCount: 2 },
      { itemId: 'equip_spider_ring', rate: 0.1, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  boss_nine_tailed_fox: {
    id: 'boss_nine_tailed_fox',
    name: '九尾妖狐',
    description: '传说中的九尾妖狐，精通幻术和魅惑',
    icon: '🦊',
    type: 'boss',
    baseStats: {
      physicalAttack: 100,
      physicalDefense: 45,
      magicAttack: 120,
      magicDefense: 80,
      speed: 55,
      maxHp: 1500,
      maxMp: 600,
      critRate: 0.2,
      critDamage: 0.8,
      hitRate: 0.96,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: 30, ice: 30, thunder: 30 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'legendary',
    levelRange: { min: 25, max: 25 },
    expReward: 1500,
    goldReward: 1000,
    drops: [
      { itemId: 'item_nine_tails_essence', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_illusion_crystal', rate: 0.5, minCount: 2, maxCount: 3 },
      { itemId: 'equip_fox_charm', rate: 0.15, minCount: 1, maxCount: 1 },
      { itemId: 'equip_nine_tails_fan', rate: 0.05, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  // 通用Boss模板（用于新章节）
  enemy_boss_ghost: {
    id: 'enemy_boss_ghost',
    name: '魔将',
    description: '魔王麾下的强大将领',
    icon: '💀',
    type: 'boss',
    baseStats: {
      physicalAttack: 80,
      physicalDefense: 60,
      magicAttack: 70,
      magicDefense: 50,
      speed: 40,
      maxHp: 1000,
      maxMp: 300,
      critRate: 0.15,
      critDamage: 0.6,
      hitRate: 0.95,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: 20, ice: 20, thunder: 20 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'epic',
    levelRange: { min: 15, max: 32 },
    expReward: 500,
    goldReward: 300,
    drops: [
      { itemId: 'item_enhance_stone_advanced', rate: 0.3, minCount: 1, maxCount: 2 },
    ],
    capturable: false,
  },

  boss_demon_king: {
    id: 'boss_demon_king',
    name: '魔王',
    description: '最终的敌人，上古魔王',
    icon: '👹',
    type: 'boss',
    baseStats: {
      physicalAttack: 200,
      physicalDefense: 150,
      magicAttack: 180,
      magicDefense: 120,
      speed: 60,
      maxHp: 5000,
      maxMp: 2000,
      critRate: 0.25,
      critDamage: 1.0,
      hitRate: 0.99,
      dodgeRate: 0.2,
    },
    elementResistances: { fire: 50, ice: 50, thunder: 50 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'legendary',
    levelRange: { min: 30, max: 30 },
    expReward: 5000,
    goldReward: 3000,
    drops: [
      { itemId: 'item_legend_treasure_box', rate: 1.0, minCount: 1, maxCount: 1 },
      { itemId: 'item_spirit_bead_complete', rate: 1.0, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  boss_dragon_king: {
    id: 'boss_dragon_king',
    name: '龙王',
    description: '东海龙宫的统治者',
    icon: '🐉',
    type: 'boss',
    baseStats: {
      physicalAttack: 150,
      physicalDefense: 120,
      magicAttack: 180,
      magicDefense: 150,
      speed: 50,
      maxHp: 3000,
      maxMp: 1500,
      critRate: 0.2,
      critDamage: 0.9,
      hitRate: 0.98,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: -30, ice: 50, thunder: 30 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'legendary',
    levelRange: { min: 32, max: 32 },
    expReward: 3000,
    goldReward: 2000,
    drops: [
      { itemId: 'item_dragon_pearl', rate: 0.5, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  // ========== 剧情任务相关怪物 ==========

  // 第一章：东海村区域
  enemy_crab: {
    id: 'enemy_crab',
    name: '海蟹',
    description: '东海沙滩上的螃蟹',
    icon: '🦀',
    type: 'normal',
    baseStats: {
      physicalAttack: 12,
      physicalDefense: 15,
      magicAttack: 0,
      magicDefense: 5,
      speed: 10,
      maxHp: 40,
      maxMp: 0,
      critRate: 0.03,
      critDamage: 0.3,
      hitRate: 0.85,
      dodgeRate: 0.02,
    },
    elementResistances: { fire: -10, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'defensive',
    rarity: 'common',
    levelRange: { min: 1, max: 4 },
    expReward: 15,
    goldReward: 8,
    drops: [{ itemId: 'item_crab_shell', rate: 0.2, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_crab_spirit: {
    id: 'enemy_crab_spirit',
    name: '蟹精',
    description: '修炼成精的巨蟹，钳子锋利无比',
    icon: '🦞',
    type: 'boss',
    baseStats: {
      physicalAttack: 35,
      physicalDefense: 30,
      magicAttack: 10,
      magicDefense: 15,
      speed: 18,
      maxHp: 300,
      maxMp: 50,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.9,
      dodgeRate: 0.05,
    },
    elementResistances: { fire: -15, ice: 20, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 4, max: 4 },
    expReward: 200,
    goldReward: 150,
    drops: [
      { itemId: 'item_crab_pearl', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_crab_shell', rate: 0.5, minCount: 2, maxCount: 3 },
    ],
    capturable: false,
  },

  // 第四章：黑衣人
  enemy_black_guards: {
    id: 'enemy_black_guards',
    name: '黑衣大汉',
    description: '天法国的黑衣护卫',
    icon: '🎭',
    type: 'elite',
    baseStats: {
      physicalAttack: 50,
      physicalDefense: 30,
      magicAttack: 15,
      magicDefense: 20,
      speed: 25,
      maxHp: 200,
      maxMp: 50,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.9,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'rare',
    levelRange: { min: 7, max: 10 },
    expReward: 120,
    goldReward: 100,
    drops: [{ itemId: 'item_black_badge', rate: 0.2, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  // 第五章：萧晓月
  enemy_xiao_xiaoyue: {
    id: 'enemy_xiao_xiaoyue',
    name: '萧晓月',
    description: '振远镖局的大小姐，武功不弱',
    icon: '👩',
    type: 'elite',
    baseStats: {
      physicalAttack: 55,
      physicalDefense: 25,
      magicAttack: 20,
      magicDefense: 25,
      speed: 35,
      maxHp: 250,
      maxMp: 80,
      critRate: 0.15,
      critDamage: 0.55,
      hitRate: 0.92,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'rare',
    levelRange: { min: 10, max: 10 },
    expReward: 200,
    goldReward: 150,
    drops: [{ itemId: 'item_jade_pendant', rate: 0.3, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  // 第六章：大雁塔怪物
  enemy_snake_demon: {
    id: 'enemy_snake_demon',
    name: '蛇妖男',
    description: '大雁塔中的蛇妖，善于用毒',
    icon: '🐍',
    type: 'boss',
    baseStats: {
      physicalAttack: 70,
      physicalDefense: 35,
      magicAttack: 60,
      magicDefense: 45,
      speed: 40,
      maxHp: 600,
      maxMp: 200,
      critRate: 0.15,
      critDamage: 0.6,
      hitRate: 0.92,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: -10, ice: 20, thunder: -10 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'legendary',
    levelRange: { min: 12, max: 12 },
    expReward: 500,
    goldReward: 400,
    drops: [
      { itemId: 'item_snake_pearl', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_poison_gland', rate: 0.5, minCount: 2, maxCount: 3 },
    ],
    capturable: false,
  },

  enemy_fox_demon_female: {
    id: 'enemy_fox_demon_female',
    name: '妖狐女',
    description: '大雁塔中的女狐妖，擅长魅惑',
    icon: '🦊',
    type: 'boss',
    baseStats: {
      physicalAttack: 55,
      physicalDefense: 30,
      magicAttack: 80,
      magicDefense: 50,
      speed: 45,
      maxHp: 500,
      maxMp: 300,
      critRate: 0.18,
      critDamage: 0.65,
      hitRate: 0.95,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: 20, ice: 20, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'legendary',
    levelRange: { min: 13, max: 13 },
    expReward: 550,
    goldReward: 450,
    drops: [
      { itemId: 'item_fox_pearl', rate: 0.3, minCount: 1, maxCount: 1 },
      { itemId: 'item_illusion_crystal', rate: 0.4, minCount: 1, maxCount: 2 },
    ],
    capturable: false,
  },

  // 第七章：方寸山
  enemy_qingfeng_daoshi: {
    id: 'enemy_qingfeng_daoshi',
    name: '清风道长',
    description: '实际上是晓风所化，拥有千年道行',
    icon: '🧙',
    type: 'boss',
    baseStats: {
      physicalAttack: 75,
      physicalDefense: 40,
      magicAttack: 90,
      magicDefense: 60,
      speed: 50,
      maxHp: 800,
      maxMp: 400,
      critRate: 0.2,
      critDamage: 0.7,
      hitRate: 0.95,
      dodgeRate: 0.12,
    },
    elementResistances: { fire: 30, ice: 30, thunder: 30 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'legendary',
    levelRange: { min: 16, max: 16 },
    expReward: 800,
    goldReward: 600,
    drops: [
      { itemId: 'item_xiaofeng_essence', rate: 0.5, minCount: 1, maxCount: 1 },
      { itemId: 'item_taoist_charm', rate: 0.4, minCount: 1, maxCount: 2 },
    ],
    capturable: false,
  },

  enemy_red_blood_dragon: {
    id: 'enemy_red_blood_dragon',
    name: '赤血龙王',
    description: '东海海底莽林的霸主，邪法操纵海妖',
    icon: '🐉',
    type: 'boss',
    baseStats: {
      physicalAttack: 100,
      physicalDefense: 60,
      magicAttack: 85,
      magicDefense: 55,
      speed: 45,
      maxHp: 1200,
      maxMp: 500,
      critRate: 0.2,
      critDamage: 0.75,
      hitRate: 0.95,
      dodgeRate: 0.1,
    },
    elementResistances: { fire: 30, ice: -20, thunder: 20 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'legendary',
    levelRange: { min: 17, max: 17 },
    expReward: 1200,
    goldReward: 800,
    drops: [
      { itemId: 'item_earth_spirit_bead', rate: 1, minCount: 1, maxCount: 1 },
      { itemId: 'item_dragon_scale', rate: 0.5, minCount: 2, maxCount: 3 },
      { itemId: 'item_dragon_blood', rate: 0.3, minCount: 1, maxCount: 1 },
    ],
    capturable: false,
  },

  // 第八章：兵马俑
  enemy_terracotta_warriors: {
    id: 'enemy_terracotta_warriors',
    name: '兵马俑',
    description: '秦始皇陵的守卫，千年不灭',
    icon: '🗿',
    type: 'elite',
    baseStats: {
      physicalAttack: 65,
      physicalDefense: 50,
      magicAttack: 10,
      magicDefense: 35,
      speed: 20,
      maxHp: 350,
      maxMp: 0,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.85,
      dodgeRate: 0.03,
    },
    elementResistances: { fire: 20, ice: 20, thunder: -30 },
    skills: [],
    aiBehavior: 'defensive',
    rarity: 'rare',
    levelRange: { min: 18, max: 22 },
    expReward: 180,
    goldReward: 150,
    drops: [{ itemId: 'item_terracotta_shard', rate: 0.25, minCount: 1, maxCount: 2 }],
    capturable: false,
  },

  enemy_mountain_spirit: {
    id: 'enemy_mountain_spirit',
    name: '山精',
    description: '方寸山上的山精',
    icon: '🏔️',
    type: 'normal',
    baseStats: {
      physicalAttack: 45,
      physicalDefense: 30,
      magicAttack: 35,
      magicDefense: 35,
      speed: 25,
      maxHp: 150,
      maxMp: 80,
      critRate: 0.08,
      critDamage: 0.45,
      hitRate: 0.9,
      dodgeRate: 0.08,
    },
    elementResistances: { fire: 0, ice: 10, thunder: 0 },
    skills: [],
    aiBehavior: 'balanced',
    rarity: 'common',
    levelRange: { min: 14, max: 18 },
    expReward: 80,
    goldReward: 60,
    drops: [{ itemId: 'item_mountain_essence', rate: 0.15, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  enemy_sea_monster: {
    id: 'enemy_sea_monster',
    name: '海妖',
    description: '东海海底的海妖',
    icon: '🐙',
    type: 'normal',
    baseStats: {
      physicalAttack: 50,
      physicalDefense: 35,
      magicAttack: 40,
      magicDefense: 30,
      speed: 28,
      maxHp: 180,
      maxMp: 100,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.88,
      dodgeRate: 0.06,
    },
    elementResistances: { fire: -15, ice: 25, thunder: -10 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 15, max: 20 },
    expReward: 90,
    goldReward: 70,
    drops: [{ itemId: 'item_sea_gem', rate: 0.12, minCount: 1, maxCount: 1 }],
    capturable: false,
  },

  // 大老鼠（收集药引用）
  enemy_big_rat: {
    id: 'enemy_big_rat',
    name: '大老鼠',
    description: '城市下水道的大老鼠',
    icon: '🐀',
    type: 'normal',
    baseStats: {
      physicalAttack: 20,
      physicalDefense: 8,
      magicAttack: 0,
      magicDefense: 5,
      speed: 30,
      maxHp: 50,
      maxMp: 0,
      critRate: 0.08,
      critDamage: 0.4,
      hitRate: 0.88,
      dodgeRate: 0.15,
    },
    elementResistances: { fire: 0, ice: 0, thunder: 0 },
    skills: [],
    aiBehavior: 'aggressive',
    rarity: 'common',
    levelRange: { min: 3, max: 8 },
    expReward: 18,
    goldReward: 12,
    drops: [{ itemId: 'item_animal_tooth', rate: 0.3, minCount: 1, maxCount: 1 }],
    capturable: false,
  },
};

/** 敌人组配置 */
export const ENEMY_GROUPS: Record<string, EnemyGroup> = {
  // ========== 新手村敌人组（动态生成） ==========
  enemy_group_wolves: {
    id: 'enemy_group_wolves',
    name: '野狼群',
    description: '长安郊外游荡的野狼',
    icon: '🐺',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_wolf', minLevel: 2, maxLevel: 4, minCount: 1, maxCount: 3, weight: 70 },
        { templateId: 'enemy_rabbit', minLevel: 1, maxLevel: 2, minCount: 0, maxCount: 2, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_rabbits: {
    id: 'enemy_group_rabbits',
    name: '野兔群',
    description: '一群受惊的野兔',
    icon: '🐰',
    difficulty: 'easy',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_rabbit', minLevel: 1, maxLevel: 3, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },
  enemy_group_bamboo: {
    id: 'enemy_group_bamboo',
    name: '竹林生物',
    description: '竹林中出没的各种生物',
    icon: '🎋',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 4, maxLevel: 6, minCount: 1, maxCount: 2, weight: 50 },
        { templateId: 'enemy_rabbit', minLevel: 3, maxLevel: 5, minCount: 0, maxCount: 2, weight: 30 },
        { templateId: 'enemy_wolf', minLevel: 3, maxLevel: 5, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_snakes: {
    id: 'enemy_group_snakes',
    name: '毒蛇群',
    description: '剧毒的竹叶青蛇',
    icon: '🐍',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 5, maxLevel: 7, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_boars: {
    id: 'enemy_group_boars',
    name: '野猪群',
    description: '森林中横冲直撞的野猪',
    icon: '🐗',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boar', minLevel: 6, maxLevel: 9, minCount: 1, maxCount: 2, weight: 80 },
        { templateId: 'enemy_wolf', minLevel: 5, maxLevel: 7, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 1,
      maxTotalCount: 3,
    },
  },
  enemy_group_monkeys: {
    id: 'enemy_group_monkeys',
    name: '猕猴群',
    description: '花果山脚下的顽皮猕猴',
    icon: '🐒',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_monkey', minLevel: 7, maxLevel: 10, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_eagles: {
    id: 'enemy_group_eagles',
    name: '山鹰群',
    description: '山顶盘旋的山鹰',
    icon: '🦅',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_eagle', minLevel: 6, maxLevel: 9, minCount: 1, maxCount: 3, weight: 60 },
        { templateId: 'enemy_bat', minLevel: 5, maxLevel: 7, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_frogs: {
    id: 'enemy_group_frogs',
    name: '溪边生物',
    description: '清溪流泉附近的各种生物',
    icon: '🐸',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_frog', minLevel: 5, maxLevel: 8, minCount: 1, maxCount: 3, weight: 50 },
        { templateId: 'enemy_snake', minLevel: 5, maxLevel: 7, minCount: 0, maxCount: 2, weight: 30 },
        { templateId: 'enemy_rabbit', minLevel: 4, maxLevel: 6, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_fish: {
    id: 'enemy_group_fish',
    name: '水边生物',
    description: '溪流边出没的生物',
    icon: '🐟',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 6, maxLevel: 8, minCount: 1, maxCount: 3, weight: 70 },
        { templateId: 'enemy_wolf', minLevel: 5, maxLevel: 7, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_bears: {
    id: 'enemy_group_bears',
    name: '森林猛兽',
    description: '古树森林中的猛兽',
    icon: '🐻',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boar', minLevel: 8, maxLevel: 11, minCount: 1, maxCount: 2, weight: 60 },
        { templateId: 'enemy_wolf', minLevel: 7, maxLevel: 9, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 1,
      maxTotalCount: 3,
    },
  },
  enemy_group_tigers: {
    id: 'enemy_group_tigers',
    name: '猛虎',
    description: '花果山脚的猛虎',
    icon: '🐯',
    difficulty: 'elite',
    weight: 8,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_tiger', minLevel: 10, maxLevel: 13, minCount: 1, maxCount: 1, weight: 70 },
        { templateId: 'enemy_monkey', minLevel: 8, maxLevel: 10, minCount: 0, maxCount: 2, weight: 30 },
      ],
      minTotalCount: 1,
      maxTotalCount: 2,
    },
  },
  enemy_group_elite_monkeys: {
    id: 'enemy_group_elite_monkeys',
    name: '精英猴群',
    description: '水帘洞外的精英猕猴',
    icon: '🐵',
    difficulty: 'hard',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_monkey', minLevel: 10, maxLevel: 13, minCount: 2, maxCount: 4, weight: 80 },
        { templateId: 'enemy_tiger', minLevel: 11, maxLevel: 13, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_boss_monkey: {
    id: 'enemy_group_boss_monkey',
    name: '美猴王',
    description: '传说中的美猴王',
    icon: '👑',
    difficulty: 'boss',
    weight: 3,
    enemies: [
      { templateId: 'enemy_monkey_king', level: 12, position: 0 },
      { templateId: 'enemy_monkey', level: 10, position: 1 },
      { templateId: 'enemy_monkey', level: 10, position: 2 },
    ],
    formationBonus: { stat: 'physicalAttack', value: 10, isPercent: true },
  },

  // ========== 东土大唐敌人组（动态生成） ==========
  enemy_group_foxes: {
    id: 'enemy_group_foxes',
    name: '野狐群',
    description: '大唐东郊的野狐',
    icon: '🦊',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_fox', minLevel: 10, maxLevel: 13, minCount: 1, maxCount: 3, weight: 70 },
        { templateId: 'enemy_deer', minLevel: 9, maxLevel: 12, minCount: 0, maxCount: 2, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_deer: {
    id: 'enemy_group_deer',
    name: '灵鹿群',
    description: '大唐东郊的灵鹿',
    icon: '🦌',
    difficulty: 'easy',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_deer', minLevel: 10, maxLevel: 12, minCount: 2, maxCount: 4, weight: 80 },
        { templateId: 'enemy_fox', minLevel: 9, maxLevel: 11, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_bandits: {
    id: 'enemy_group_bandits',
    name: '山贼帮',
    description: '拦路抢劫的山贼',
    icon: '🗡️',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_bandit', minLevel: 11, maxLevel: 14, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_wild_dogs: {
    id: 'enemy_group_wild_dogs',
    name: '野狗群',
    description: '成群结队的野狗',
    icon: '🐕',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_wild_dog', minLevel: 10, maxLevel: 13, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },
  enemy_group_spiders: {
    id: 'enemy_group_spiders',
    name: '蜘蛛群',
    description: '蜘蛛林中的小蜘蛛',
    icon: '🕷️',
    difficulty: 'normal',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_spider_small', minLevel: 14, maxLevel: 17, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_poison_spiders: {
    id: 'enemy_group_poison_spiders',
    name: '毒蛛群',
    description: '剧毒蜘蛛',
    icon: '🕷️',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_spider_poison', minLevel: 16, maxLevel: 19, minCount: 1, maxCount: 3, weight: 70 },
        { templateId: 'enemy_spider_small', minLevel: 15, maxLevel: 17, minCount: 0, maxCount: 2, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_ghosts: {
    id: 'enemy_group_ghosts',
    name: '游魂群',
    description: '古庙中游荡的灵魂',
    icon: '👻',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 13, maxLevel: 16, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_ghosts_datang: {
    id: 'enemy_group_ghosts_datang',
    name: '鬼城游魂',
    description: '被诅咒城池中的游魂',
    icon: '👻',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 18, maxLevel: 22, minCount: 2, maxCount: 4, weight: 70 },
        { templateId: 'enemy_skeleton_warrior', minLevel: 19, maxLevel: 22, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_temple_guardians: {
    id: 'enemy_group_temple_guardians',
    name: '古庙守卫',
    description: '守护古庙的幽灵',
    icon: '⛩️',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 14, maxLevel: 17, minCount: 1, maxCount: 3, weight: 70 },
        { templateId: 'enemy_skeleton_warrior', minLevel: 15, maxLevel: 17, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_water_demons: {
    id: 'enemy_group_water_demons',
    name: '水妖群',
    description: '河流中的水妖',
    icon: '🌊',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_water_demon', minLevel: 12, maxLevel: 15, minCount: 1, maxCount: 3, weight: 60 },
        { templateId: 'enemy_fishman', minLevel: 11, maxLevel: 14, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_fishmen: {
    id: 'enemy_group_fishmen',
    name: '鱼人群',
    description: '半人半鱼的生物',
    icon: '🐟',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_fishman', minLevel: 11, maxLevel: 15, minCount: 2, maxCount: 4, weight: 70 },
        { templateId: 'enemy_water_demon', minLevel: 12, maxLevel: 14, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_wild_wolves: {
    id: 'enemy_group_wild_wolves',
    name: '北方狼群',
    description: '大唐北郊的狼群',
    icon: '🐺',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_wolf', minLevel: 13, maxLevel: 16, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_bears_datang: {
    id: 'enemy_group_bears_datang',
    name: '北方猛兽',
    description: '大唐北郊的猛兽',
    icon: '🐻',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boar', minLevel: 14, maxLevel: 17, minCount: 1, maxCount: 2, weight: 60 },
        { templateId: 'enemy_wolf', minLevel: 13, maxLevel: 15, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 1,
      maxTotalCount: 3,
    },
  },
  enemy_group_skeleton_warriors: {
    id: 'enemy_group_skeleton_warriors',
    name: '骷髅战士',
    description: '被诅咒的骷髅战士',
    icon: '💀',
    difficulty: 'elite',
    weight: 8,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_skeleton_warrior', minLevel: 20, maxLevel: 24, minCount: 1, maxCount: 2, weight: 70 },
        { templateId: 'enemy_ghost', minLevel: 19, maxLevel: 22, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 1,
      maxTotalCount: 2,
    },
  },
  enemy_group_swamp_creatures: {
    id: 'enemy_group_swamp_creatures',
    name: '沼泽生物',
    description: '迷雾沼泽中的各种生物',
    icon: '🌫️',
    difficulty: 'hard',
    weight: 18,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_water_demon', minLevel: 17, maxLevel: 20, minCount: 1, maxCount: 2, weight: 50 },
        { templateId: 'enemy_ghost', minLevel: 16, maxLevel: 19, minCount: 0, maxCount: 2, weight: 30 },
        { templateId: 'enemy_spider_poison', minLevel: 16, maxLevel: 18, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_poison_toads: {
    id: 'enemy_group_poison_toads',
    name: '沼泽毒物',
    description: '迷雾沼泽中的毒物',
    icon: '🐸',
    difficulty: 'normal',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_spider_poison', minLevel: 17, maxLevel: 20, minCount: 1, maxCount: 2, weight: 60 },
        { templateId: 'enemy_spider_small', minLevel: 16, maxLevel: 18, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_water_dragons: {
    id: 'enemy_group_water_dragons',
    name: '幼龙群',
    description: '龙潭中的幼龙',
    icon: '🐉',
    difficulty: 'hard',
    weight: 12,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_water_demon', minLevel: 19, maxLevel: 22, minCount: 1, maxCount: 2, weight: 70 },
        { templateId: 'enemy_fishman', minLevel: 18, maxLevel: 20, minCount: 0, maxCount: 2, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_dragon_fish: {
    id: 'enemy_group_dragon_fish',
    name: '龙鱼群',
    description: '龙潭中的鱼人',
    icon: '🐲',
    difficulty: 'normal',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_fishman', minLevel: 18, maxLevel: 21, minCount: 2, maxCount: 4, weight: 70 },
        { templateId: 'enemy_water_demon', minLevel: 17, maxLevel: 19, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_tigers_datang: {
    id: 'enemy_group_tigers_datang',
    name: '大唐猛虎',
    description: '虎穴中的猛虎',
    icon: '🐯',
    difficulty: 'elite',
    weight: 8,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_tiger_datang', minLevel: 17, maxLevel: 20, minCount: 1, maxCount: 2, weight: 80 },
        { templateId: 'enemy_wolf', minLevel: 16, maxLevel: 18, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 1,
      maxTotalCount: 2,
    },
  },
  enemy_group_tiger_king: {
    id: 'enemy_group_tiger_king',
    name: '虎王',
    description: '虎穴之主',
    icon: '🐯',
    difficulty: 'boss',
    weight: 3,
    enemies: [
      { templateId: 'enemy_tiger_datang', level: 20, position: 0 },
      { templateId: 'enemy_tiger_datang', level: 18, position: 1 },
    ],
    formationBonus: { stat: 'physicalAttack', value: 15, isPercent: true },
  },
  enemy_group_fox_spirits: {
    id: 'enemy_group_fox_spirits',
    name: '狐妖群',
    description: '狐狸谷中的狐妖',
    icon: '🦊',
    difficulty: 'elite',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_fox_spirit', minLevel: 17, maxLevel: 21, minCount: 1, maxCount: 2, weight: 60 },
        { templateId: 'enemy_fox', minLevel: 16, maxLevel: 19, minCount: 0, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_fairy_beasts: {
    id: 'enemy_group_fairy_beasts',
    name: '仙兽群',
    description: '仙峰上的仙兽',
    icon: '🦄',
    difficulty: 'elite',
    weight: 8,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_fairy_beast', minLevel: 21, maxLevel: 24, minCount: 1, maxCount: 2, weight: 70 },
        { templateId: 'enemy_ghost', minLevel: 20, maxLevel: 22, minCount: 0, maxCount: 1, weight: 30 },
      ],
      minTotalCount: 1,
      maxTotalCount: 2,
    },
  },
  enemy_group_cloud_spirits: {
    id: 'enemy_group_cloud_spirits',
    name: '云灵',
    description: '仙峰上的云灵',
    icon: '☁️',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 21, maxLevel: 24, minCount: 2, maxCount: 4, weight: 80 },
        { templateId: 'enemy_fairy_beast', minLevel: 20, maxLevel: 22, minCount: 0, maxCount: 1, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },
  enemy_group_bandit_elites: {
    id: 'enemy_group_bandit_elites',
    name: '山贼精英',
    description: '山贼据点中的精英',
    icon: '⚔️',
    difficulty: 'elite',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_bandit_elite', minLevel: 19, maxLevel: 23, minCount: 1, maxCount: 1, weight: 50 },
        { templateId: 'enemy_bandit', minLevel: 18, maxLevel: 21, minCount: 1, maxCount: 3, weight: 50 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },
  enemy_group_spider_queen: {
    id: 'enemy_group_spider_queen',
    name: '蛛后守卫',
    description: '守护蛛后的蜘蛛',
    icon: '🕷️',
    difficulty: 'elite',
    weight: 5,
    enemies: [
      { templateId: 'enemy_spider_elite', level: 17, position: 0 },
      { templateId: 'enemy_spider_poison', level: 16, position: 1 },
      { templateId: 'enemy_spider_poison', level: 16, position: 2 },
    ],
  },

  // ========== 剧情任务相关敌人组 ==========

  // 东海村区域
  enemy_group_crabs: {
    id: 'enemy_group_crabs',
    name: '海蟹群',
    description: '东海沙滩上的螃蟹',
    icon: '🦀',
    difficulty: 'easy',
    weight: 30,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_crab', minLevel: 1, maxLevel: 3, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },

  enemy_group_crab_spirit: {
    id: 'enemy_group_crab_spirit',
    name: '蟹精',
    description: '潮水洞穴中的蟹精',
    icon: '🦞',
    difficulty: 'boss',
    weight: 3,
    enemies: [
      { templateId: 'enemy_crab_spirit', level: 4, position: 0 },
      { templateId: 'enemy_crab', level: 3, position: 1 },
      { templateId: 'enemy_crab', level: 3, position: 2 },
    ],
    formationBonus: { stat: 'physicalDefense', value: 10, isPercent: true },
  },

  // 剧情敌人组
  enemy_group_black_guards: {
    id: 'enemy_group_black_guards',
    name: '黑衣人',
    description: '天法国的黑衣护卫',
    icon: '🎭',
    difficulty: 'elite',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_black_guards', minLevel: 7, maxLevel: 10, minCount: 1, maxCount: 3, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },

  enemy_group_xiao_xiaoyue: {
    id: 'enemy_group_xiao_xiaoyue',
    name: '萧晓月',
    description: '振远镖局的大小姐',
    icon: '👩',
    difficulty: 'elite',
    weight: 5,
    enemies: [
      { templateId: 'enemy_xiao_xiaoyue', level: 10, position: 0 },
    ],
  },

  enemy_group_snake_demon: {
    id: 'enemy_group_snake_demon',
    name: '蛇妖男',
    description: '大雁塔中的蛇妖',
    icon: '🐍',
    difficulty: 'boss',
    weight: 3,
    enemies: [
      { templateId: 'enemy_snake_demon', level: 12, position: 0 },
      { templateId: 'enemy_snake', level: 10, position: 1 },
      { templateId: 'enemy_snake', level: 10, position: 2 },
    ],
    formationBonus: { stat: 'magicAttack', value: 15, isPercent: true },
  },

  enemy_group_fox_demon_female: {
    id: 'enemy_group_fox_demon_female',
    name: '妖狐女',
    description: '大雁塔中的女狐妖',
    icon: '🦊',
    difficulty: 'boss',
    weight: 3,
    enemies: [
      { templateId: 'enemy_fox_demon_female', level: 13, position: 0 },
      { templateId: 'enemy_fox_spirit', level: 11, position: 1 },
    ],
    formationBonus: { stat: 'magicDefense', value: 20, isPercent: true },
  },

  enemy_group_qingfeng_daoshi: {
    id: 'enemy_group_qingfeng_daoshi',
    name: '清风道长',
    description: '方寸山的假清风道长',
    icon: '🧙',
    difficulty: 'boss',
    weight: 2,
    enemies: [
      { templateId: 'enemy_qingfeng_daoshi', level: 16, position: 0 },
    ],
    formationBonus: { stat: 'magicAttack', value: 20, isPercent: true },
  },

  enemy_group_red_blood_dragon: {
    id: 'enemy_group_red_blood_dragon',
    name: '赤血龙王',
    description: '东海海底莽林的霸主',
    icon: '🐉',
    difficulty: 'boss',
    weight: 2,
    enemies: [
      { templateId: 'enemy_red_blood_dragon', level: 17, position: 0 },
      { templateId: 'enemy_sea_monster', level: 15, position: 1 },
      { templateId: 'enemy_sea_monster', level: 15, position: 2 },
    ],
    formationBonus: { stat: 'physicalAttack', value: 15, isPercent: true },
  },

  enemy_group_terracotta_warriors: {
    id: 'enemy_group_terracotta_warriors',
    name: '兵马俑阵',
    description: '秦始皇陵的守卫',
    icon: '🗿',
    difficulty: 'elite',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_terracotta_warriors', minLevel: 18, maxLevel: 22, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },

  enemy_group_mountain_spirits: {
    id: 'enemy_group_mountain_spirits',
    name: '山精群',
    description: '方寸山上的山精',
    icon: '🏔️',
    difficulty: 'normal',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_mountain_spirit', minLevel: 14, maxLevel: 18, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_sea_monsters: {
    id: 'enemy_group_sea_monsters',
    name: '海妖群',
    description: '东海海底的海妖',
    icon: '🐙',
    difficulty: 'hard',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_sea_monster', minLevel: 15, maxLevel: 20, minCount: 2, maxCount: 4, weight: 80 },
        { templateId: 'enemy_water_demon', minLevel: 14, maxLevel: 18, minCount: 0, maxCount: 2, weight: 20 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_big_rats: {
    id: 'enemy_group_big_rats',
    name: '大老鼠群',
    description: '城市下水道的大老鼠',
    icon: '🐀',
    difficulty: 'easy',
    weight: 25,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_big_rat', minLevel: 3, maxLevel: 6, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },

  // ==================== 新增敌人组（西域/魔界） ====================

  enemy_group_desert_bandits: {
    id: 'enemy_group_desert_bandits',
    name: '沙漠强盗',
    description: '丝绸之路上的强盗团伙',
    icon: '🏴',
    difficulty: 'normal',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_bandit', minLevel: 20, maxLevel: 24, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_sand_worms: {
    id: 'enemy_group_sand_worms',
    name: '沙虫群',
    description: '沙漠中的巨大虫群',
    icon: '🐛',
    difficulty: 'normal',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 20, maxLevel: 24, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_desert_creatures: {
    id: 'enemy_group_desert_creatures',
    name: '沙漠生物',
    description: '西域沙漠中的各种生物',
    icon: '🦂',
    difficulty: 'normal',
    weight: 20,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 21, maxLevel: 26, minCount: 1, maxCount: 3, weight: 60 },
        { templateId: 'enemy_wolf', minLevel: 21, maxLevel: 26, minCount: 1, maxCount: 2, weight: 40 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_scorpions: {
    id: 'enemy_group_scorpions',
    name: '蝎子群',
    description: '西域的毒蝎群',
    icon: '🦂',
    difficulty: 'normal',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_snake', minLevel: 22, maxLevel: 27, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },

  enemy_group_lesser_demons: {
    id: 'enemy_group_lesser_demons',
    name: '小恶魔群',
    description: '魔气裂隙中的低等恶魔',
    icon: '😈',
    difficulty: 'hard',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 24, maxLevel: 28, minCount: 2, maxCount: 5, weight: 100 },
      ],
      minTotalCount: 3,
      maxTotalCount: 5,
    },
  },

  enemy_group_demon_scouts: {
    id: 'enemy_group_demon_scouts',
    name: '恶魔斥候',
    description: '魔王的侦察兵',
    icon: '🕵️',
    difficulty: 'hard',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 24, maxLevel: 28, minCount: 1, maxCount: 3, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 3,
    },
  },

  enemy_group_demon_generals: {
    id: 'enemy_group_demon_generals',
    name: '魔将群',
    description: '魔王手下的精锐将领',
    icon: '💀',
    difficulty: 'elite',
    weight: 5,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boss_ghost', minLevel: 26, maxLevel: 30, minCount: 1, maxCount: 2, weight: 100 },
      ],
      minTotalCount: 1,
      maxTotalCount: 2,
    },
  },

  enemy_group_shadow_beasts: {
    id: 'enemy_group_shadow_beasts',
    name: '暗影兽群',
    description: '上古封印中的暗影生物',
    icon: '👾',
    difficulty: 'elite',
    weight: 5,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 26, maxLevel: 30, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_demon_elites: {
    id: 'enemy_group_demon_elites',
    name: '恶魔精锐',
    description: '魔王城的精锐守卫',
    icon: '👹',
    difficulty: 'elite',
    weight: 5,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boss_ghost', minLevel: 28, maxLevel: 32, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_four_generals: {
    id: 'enemy_group_four_generals',
    name: '四魔将',
    description: '魔王麾下的四位大将军',
    icon: '💀',
    difficulty: 'boss',
    weight: 2,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_boss_ghost', minLevel: 29, maxLevel: 29, minCount: 1, maxCount: 1, weight: 100 },
      ],
      minTotalCount: 1,
      maxTotalCount: 1,
    },
  },

  enemy_group_demon_king: {
    id: 'enemy_group_demon_king',
    name: '魔王',
    description: '最终的敌人，魔王本尊',
    icon: '👹',
    difficulty: 'boss',
    weight: 1,
    enemies: [
      { templateId: 'enemy_boss_ghost', level: 30, position: 2 },
    ],
  },

  enemy_group_scouts: {
    id: 'enemy_group_scouts',
    name: '斥候群',
    description: '神秘组织的斥候',
    icon: '🕵️',
    difficulty: 'normal',
    weight: 15,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_bandit', minLevel: 5, maxLevel: 8, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_tower_spirits: {
    id: 'enemy_group_tower_spirits',
    name: '塔中灵体',
    description: '大雁塔深处的灵体',
    icon: '👻',
    difficulty: 'hard',
    weight: 10,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_ghost', minLevel: 13, maxLevel: 17, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_tower_guardian: {
    id: 'enemy_group_tower_guardian',
    name: '塔守护者',
    description: '大雁塔深处的守护者',
    icon: '🗿',
    difficulty: 'elite',
    weight: 5,
    enemies: [
      { templateId: 'enemy_boss_ghost', level: 15, position: 2 },
    ],
  },

  enemy_group_dragon_guards: {
    id: 'enemy_group_dragon_guards',
    name: '龙宫守卫',
    description: '东海龙宫的守卫',
    icon: '🐲',
    difficulty: 'elite',
    weight: 8,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_water_demon', minLevel: 30, maxLevel: 35, minCount: 2, maxCount: 4, weight: 100 },
      ],
      minTotalCount: 2,
      maxTotalCount: 4,
    },
  },

  enemy_group_sea_dragons: {
    id: 'enemy_group_sea_dragons',
    name: '海龙群',
    description: '东海的海龙',
    icon: '🐉',
    difficulty: 'elite',
    weight: 5,
    dynamicConfig: {
      members: [
        { templateId: 'enemy_water_demon', minLevel: 30, maxLevel: 38, minCount: 1, maxCount: 3, weight: 100 },
      ],
      minTotalCount: 1,
      maxTotalCount: 3,
    },
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
      count: randomInt(d.minCount, d.maxCount),
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

/**
 * 生成动态敌人组实例
 * 根据敌人组配置动态生成怪物组合
 */
export function generateDynamicEnemyGroup(groupId: string, playerLevel?: number): {
  templateId: string;
  level: number;
  position: number;
}[] {
  const group = ENEMY_GROUPS[groupId];
  if (!group) return [];

  // 如果有固定阵容，直接返回
  if (group.enemies && group.enemies.length > 0) {
    return group.enemies.map(e => ({
      templateId: e.templateId,
      level: e.level,
      position: e.position,
    }));
  }

  // 如果没有动态配置，返回空
  if (!group.dynamicConfig) return [];

  const { members, minTotalCount, maxTotalCount } = group.dynamicConfig;
  const result: { templateId: string; level: number; position: number }[] = [];

  // 随机决定总数量
  const totalCount = randomInt(minTotalCount, maxTotalCount);

  // 计算总权重
  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0);

  // 生成怪物
  let position = 0;
  while (result.length < totalCount) {
    // 加权随机选择一个怪物类型
    let randomVal = random() * totalWeight;
    let selectedMember = members[0];

    for (const member of members) {
      randomVal -= member.weight;
      if (randomVal <= 0) {
        selectedMember = member;
        break;
      }
    }

    // 检查是否已达到该类型的最大数量
    const currentCount = result.filter(r => r.templateId === selectedMember.templateId).length;
    if (currentCount >= selectedMember.maxCount) {
      // 选择其他类型
      const availableMembers = members.filter(m => {
        const count = result.filter(r => r.templateId === m.templateId).length;
        return count < m.maxCount;
      });
      if (availableMembers.length === 0) break;
      selectedMember = availableMembers[randomInt(0, availableMembers.length - 1)];
    }

    // 确保至少达到最小数量要求
    if (result.length >= totalCount - 1) {
      // 检查哪些类型还没有达到最小数量
      const belowMinMembers = members.filter(m => {
        const count = result.filter(r => r.templateId === m.templateId).length;
        return count < m.minCount;
      });
      if (belowMinMembers.length > 0) {
        selectedMember = belowMinMembers[0];
      }
    }

    // 生成等级
    const template = ENEMY_TEMPLATES[selectedMember.templateId];
    let level: number;
    if (selectedMember.minLevel !== undefined && selectedMember.maxLevel !== undefined) {
      level = randomInt(selectedMember.minLevel, selectedMember.maxLevel);
    } else if (template) {
      const minLvl = template.levelRange.min;
      const maxLvl = template.levelRange.max;
      level = randomInt(minLvl, maxLvl);
    } else {
      level = 1;
    }

    // 如果提供了玩家等级，适当调整怪物等级
    if (playerLevel && template) {
      const levelDiff = level - playerLevel;
      // 如果怪物等级比玩家高太多，降低一点
      if (levelDiff > 3) {
        level = Math.max(template.levelRange.min, level - Math.floor(levelDiff / 2));
      }
      // 如果怪物等级比玩家低太多，提高一点
      if (levelDiff < -5) {
        level = Math.min(template.levelRange.max, level + Math.floor(-levelDiff / 3));
      }
    }

    result.push({
      templateId: selectedMember.templateId,
      level,
      position: position++,
    });
  }

  return result;
}

/**
 * 获取敌人组的预览信息（用于UI显示）
 */
export function getEnemyGroupPreview(groupId: string): {
  name: string;
  icon: string;
  difficulty: string;
  description: string;
  possibleEnemies: { templateId: string; name: string; icon: string; minLevel: number; maxLevel: number }[];
  minCount: number;
  maxCount: number;
} | null {
  const group = ENEMY_GROUPS[groupId];
  if (!group) return null;

  const possibleEnemies: { templateId: string; name: string; icon: string; minLevel: number; maxLevel: number }[] = [];

  if (group.dynamicConfig) {
    for (const member of group.dynamicConfig.members) {
      const template = ENEMY_TEMPLATES[member.templateId];
      if (template) {
        const minLevel = member.minLevel ?? template.levelRange.min;
        const maxLevel = member.maxLevel ?? template.levelRange.max;
        possibleEnemies.push({
          templateId: member.templateId,
          name: template.name,
          icon: template.icon,
          minLevel,
          maxLevel,
        });
      }
    }
    return {
      name: group.name,
      icon: group.icon || '?',
      difficulty: group.difficulty,
      description: group.description || '',
      possibleEnemies,
      minCount: group.dynamicConfig.minTotalCount,
      maxCount: group.dynamicConfig.maxTotalCount,
    };
  } else if (group.enemies) {
    for (const enemy of group.enemies) {
      const template = ENEMY_TEMPLATES[enemy.templateId];
      if (template) {
        // 避免重复
        if (!possibleEnemies.find(e => e.templateId === enemy.templateId)) {
          possibleEnemies.push({
            templateId: enemy.templateId,
            name: template.name,
            icon: template.icon,
            minLevel: enemy.level,
            maxLevel: enemy.level,
          });
        }
      }
    }
    return {
      name: group.name,
      icon: group.icon || '?',
      difficulty: group.difficulty,
      description: group.description || '',
      possibleEnemies,
      minCount: group.enemies.length,
      maxCount: group.enemies.length,
    };
  }

  return null;
}
