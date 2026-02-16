// 技能书配置数据 - 宠物打书系统

import type { SkillBook, PetSkill, PetType } from '@/types';
import type { Quality } from '@/types/common';

// ============================================
// 技能等级配置
// ============================================

/** 技能等级配置 */
export interface SkillLevelConfig {
  level: number;
  multiplierBonus: number;     // 每级倍率加成
  mpCostBonus: number;         // 每级消耗增加
  successRate: number;         // 升级成功率
}

/** 技能等级配置表 */
export const SKILL_LEVEL_CONFIG: SkillLevelConfig[] = [
  { level: 1, multiplierBonus: 0, mpCostBonus: 0, successRate: 100 },   // 1级 -> 2级: 100%
  { level: 2, multiplierBonus: 0.1, mpCostBonus: 2, successRate: 80 },  // 2级 -> 3级: 80%
  { level: 3, multiplierBonus: 0.15, mpCostBonus: 4, successRate: 60 }, // 3级 -> 4级: 60%
  { level: 4, multiplierBonus: 0.2, mpCostBonus: 6, successRate: 40 },  // 4级 -> 5级: 40%
  { level: 5, multiplierBonus: 0.25, mpCostBonus: 8, successRate: 20 }, // 5级（满级）
];

/** 最大技能等级 */
export const MAX_SKILL_LEVEL = 5;

/** 技能槽解锁配置 */
export interface SkillSlotConfig {
  slot: number;
  unlockLevel?: number;        // 等级解锁
  unlockItem?: string;         // 道具解锁
  default?: boolean;           // 初始解锁
}

/** 技能槽配置 */
export const SKILL_SLOT_CONFIG: SkillSlotConfig[] = [
  { slot: 1, default: true },
  { slot: 2, unlockLevel: 10 },
  { slot: 3, unlockLevel: 25 },
  { slot: 4, unlockLevel: 40 },
];

/** 技能遗忘配置 */
export const SKILL_FORGET_CONFIG = {
  goldCost: 1000,              // 基础金币消耗
  returnItemRate: 0.3,         // 返还技能书概率
  returnItemLevel: 'low',      // 返还低级技能书
};

// ============================================
// 技能书品质配置
// ============================================

/** 技能书品质配置 */
export interface SkillBookTierConfig {
  tier: 'low' | 'medium' | 'high' | 'super';
  quality: Quality;
  name: string;
  successRate: number;         // 学习成功率（满槽时）
  upgradeBonus: number;        // 升级加成
  price: number;               // 基础价格
}

/** 技能书品质配置表 */
export const SKILL_BOOK_TIER_CONFIG: Record<string, SkillBookTierConfig> = {
  low: {
    tier: 'low',
    quality: 'common',
    name: '初级技能书',
    successRate: 80,
    upgradeBonus: 0,
    price: 500,
  },
  medium: {
    tier: 'medium',
    quality: 'rare',
    name: '中级技能书',
    successRate: 60,
    upgradeBonus: 5,
    price: 2000,
  },
  high: {
    tier: 'high',
    quality: 'epic',
    name: '高级技能书',
    successRate: 40,
    upgradeBonus: 10,
    price: 8000,
  },
  super: {
    tier: 'super',
    quality: 'legendary',
    name: '超级技能书',
    successRate: 20,
    upgradeBonus: 20,
    price: 30000,
  },
};

// ============================================
// 宠物技能模板
// ============================================

/** 宠物技能模板（带等级信息） */
export interface PetSkillTemplate extends Omit<PetSkill, 'id'> {
  maxLevel?: number;           // 最大可升级等级
  tier?: 'low' | 'medium' | 'high' | 'super';  // 技能书等级
}

/** 宠物技能模板 */
export const PET_SKILL_TEMPLATES: Record<string, PetSkillTemplate> = {
  // 攻击型技能
  skill_bite: {
    name: '撕咬',
    type: 'active',
    description: '对敌人造成物理伤害',
    mpCost: 10,
    multiplier: 1.2,
    element: 'physical',
  },
  skill_claw: {
    name: '利爪',
    type: 'active',
    description: '用锋利的爪子攻击，有几率造成流血',
    mpCost: 15,
    multiplier: 1.4,
    element: 'physical',
  },
  skill_howl: {
    name: '嚎叫',
    type: 'trigger',
    description: '战斗开始时提升自身攻击力',
    multiplier: 1.1,
  },
  skill_roar: {
    name: '震慑咆哮',
    type: 'active',
    description: '发出震慑性咆哮，降低敌人防御',
    mpCost: 20,
    multiplier: 0.8,
  },
  skill_fury: {
    name: '狂暴',
    type: 'trigger',
    description: '生命值低于30%时提升攻击力50%',
    multiplier: 1.5,
  },
  skill_combo: {
    name: '连击',
    type: 'active',
    description: '连续攻击敌人2次',
    mpCost: 25,
    multiplier: 0.7,
    element: 'physical',
  },

  // 法术型技能
  skill_magic_missile: {
    name: '魔法飞弹',
    type: 'active',
    description: '发射魔法飞弹攻击敌人',
    mpCost: 15,
    multiplier: 1.3,
    element: 'water',
  },
  skill_fireball: {
    name: '火球术',
    type: 'active',
    description: '发射火球攻击敌人',
    mpCost: 20,
    multiplier: 1.5,
    element: 'fire',
  },
  skill_thunder: {
    name: '落雷',
    type: 'active',
    description: '召唤雷电攻击敌人',
    mpCost: 25,
    multiplier: 1.6,
    element: 'metal',
  },
  skill_ice_arrow: {
    name: '冰箭',
    type: 'active',
    description: '发射冰箭，有几率冻结敌人',
    mpCost: 18,
    multiplier: 1.2,
    element: 'water',
  },

  // 防御型技能
  skill_shell: {
    name: '护盾',
    type: 'active',
    description: '提升自身防御力',
    mpCost: 15,
    multiplier: 1.5,
  },
  skill_provoke: {
    name: '挑衅',
    type: 'active',
    description: '嘲讽敌人，吸引攻击',
    mpCost: 10,
  },
  skill_iron_skin: {
    name: '铁壁',
    type: 'passive',
    description: '永久提升防御力20%',
    multiplier: 1.2,
  },
  skill_counter: {
    name: '反击',
    type: 'trigger',
    description: '被攻击时有30%几率反击',
    multiplier: 0.8,
  },

  // 辅助型技能
  skill_heal: {
    name: '治愈',
    type: 'active',
    description: '恢复主人一定生命值',
    mpCost: 20,
    multiplier: 0.3,
  },
  skill_buff: {
    name: '强化',
    type: 'active',
    description: '提升主人攻击力',
    mpCost: 15,
    multiplier: 1.2,
  },
  // 修复: skill_cleans -> skill_cleanse 拼写错误
  skill_cleanse: {
    name: '净化',
    type: 'active',
    description: '清除主人的负面状态',
    mpCost: 25,
  },
  skill_resurrect: {
    name: '复活',
    type: 'trigger',
    description: '主人死亡时有20%几率复活主人',
    multiplier: 0.3,
  },

  // 控制型技能
  skill_stun: {
    name: '眩晕',
    type: 'active',
    description: '使敌人眩晕1回合',
    mpCost: 25,
  },
  skill_slow: {
    name: '减速',
    type: 'active',
    description: '降低敌人速度',
    mpCost: 15,
    multiplier: 0.7,
  },
  skill_sleep: {
    name: '催眠',
    type: 'active',
    description: '使敌人睡眠2回合',
    mpCost: 30,
  },

  // 高级技能（可升级到5级）
  skill_multi_strike: {
    name: '多段攻击',
    type: 'active',
    description: '对敌人进行3次连续攻击',
    mpCost: 30,
    multiplier: 0.5,
    element: 'physical',
    maxLevel: 5,
    tier: 'high',
  },
  skill_thunder_storm: {
    name: '雷暴',
    type: 'active',
    description: '召唤雷暴攻击全体敌人',
    mpCost: 40,
    multiplier: 1.2,
    element: 'metal',
    maxLevel: 5,
    tier: 'super',
  },
  skill_mass_heal: {
    name: '群体治愈',
    type: 'active',
    description: '恢复全体友方生命值',
    mpCost: 50,
    multiplier: 0.4,
    maxLevel: 5,
    tier: 'high',
  },
  skill_invisibility: {
    name: '隐身',
    type: 'trigger',
    description: '战斗开始时进入隐身状态2回合',
    maxLevel: 5,
    tier: 'high',
  },
  skill_magic_boost: {
    name: '魔力增幅',
    type: 'passive',
    description: '永久提升法术攻击力15%',
    multiplier: 1.15,
    maxLevel: 5,
    tier: 'medium',
  },
  skill_crit_up: {
    name: '暴击强化',
    type: 'passive',
    description: '永久提升暴击率10%',
    multiplier: 1.1,
    maxLevel: 5,
    tier: 'medium',
  },
  skill_speed_up: {
    name: '疾风',
    type: 'passive',
    description: '永久提升速度15%',
    multiplier: 1.15,
    maxLevel: 5,
    tier: 'medium',
  },
  skill_brave: {
    name: '勇猛',
    type: 'passive',
    description: '永久提升物理攻击力15%',
    multiplier: 1.15,
    maxLevel: 5,
    tier: 'medium',
  },
  skill_charm: {
    name: '魅惑',
    type: 'trigger',
    description: '被攻击时有几率魅惑攻击者',
    maxLevel: 5,
    tier: 'medium',
  },
  skill_poison: {
    name: '剧毒',
    type: 'trigger',
    description: '攻击时有30%几率使敌人中毒',
    multiplier: 0.1,
    maxLevel: 5,
    tier: 'low',
  },
  skill_web: {
    name: '蛛网',
    type: 'active',
    description: '降低敌人速度50%',
    mpCost: 15,
    multiplier: 0.5,
    maxLevel: 5,
    tier: 'low',
  },
  skill_illusion: {
    name: '幻象',
    type: 'trigger',
    description: '被攻击时有20%几率闪避',
    maxLevel: 5,
    tier: 'medium',
  },
  skill_suck_blood: {
    name: '吸血',
    type: 'trigger',
    description: '攻击时恢复造成伤害的20%生命值',
    multiplier: 0.2,
    maxLevel: 5,
    tier: 'medium',
  },
  skill_taunt: {
    name: '嘲讽',
    type: 'active',
    description: '嘲讽敌人，强制攻击自己3回合',
    mpCost: 20,
    maxLevel: 5,
    tier: 'low',
  },
};

/** 扩展技能书类型（带等级信息） */
export interface SkillBookWithTier extends SkillBook {
  tier: 'low' | 'medium' | 'high' | 'super';
  upgradeSuccessBonus?: number;  // 升级成功率加成
}

/** 技能书列表 */
export const SKILL_BOOKS: Record<string, SkillBookWithTier> = {
  // ==================== 低级技能书（普通品质，80%成功率）====================
  book_bite: {
    id: 'book_bite',
    skillId: 'skill_bite',
    name: '撕咬技能书',
    description: '学习撕咬技能，对敌人造成物理伤害',
    rarity: 'common',
    tier: 'low',
    restrictions: {
      petType: ['attack'],
    },
    overrideBonus: 0,
  },
  book_shell: {
    id: 'book_shell',
    skillId: 'skill_shell',
    name: '护盾技能书',
    description: '学习护盾技能，提升自身防御力',
    rarity: 'common',
    tier: 'low',
    restrictions: {
      petType: ['defense'],
    },
    overrideBonus: 0,
  },
  book_heal: {
    id: 'book_heal',
    skillId: 'skill_heal',
    name: '治愈技能书',
    description: '学习治愈技能，恢复主人生命值',
    rarity: 'common',
    tier: 'low',
    restrictions: {
      petType: ['support'],
    },
    overrideBonus: 0,
  },
  book_poison: {
    id: 'book_poison',
    skillId: 'skill_poison',
    name: '剧毒技能书',
    description: '学习剧毒，攻击时有几率使敌人中毒',
    rarity: 'common',
    tier: 'low',
    restrictions: {},
    overrideBonus: 0,
  },
  book_web: {
    id: 'book_web',
    skillId: 'skill_web',
    name: '蛛网技能书',
    description: '学习蛛网，降低敌人速度',
    rarity: 'common',
    tier: 'low',
    restrictions: {},
    overrideBonus: 0,
  },
  book_taunt: {
    id: 'book_taunt',
    skillId: 'skill_taunt',
    name: '嘲讽技能书',
    description: '学习嘲讽，强制敌人攻击自己',
    rarity: 'common',
    tier: 'low',
    restrictions: {
      petType: ['defense'],
    },
    overrideBonus: 0,
  },
  book_slow: {
    id: 'book_slow',
    skillId: 'skill_slow',
    name: '减速技能书',
    description: '学习减速，降低敌人速度',
    rarity: 'common',
    tier: 'low',
    restrictions: {
      petType: ['control'],
    },
    overrideBonus: 0,
  },

  // ==================== 中级技能书（稀有品质，60%成功率）====================
  book_claw: {
    id: 'book_claw',
    skillId: 'skill_claw',
    name: '利爪技能书',
    description: '学习利爪技能，有几率造成流血',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['attack'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_magic_missile: {
    id: 'book_magic_missile',
    skillId: 'skill_magic_missile',
    name: '魔法飞弹技能书',
    description: '学习魔法飞弹，发射魔法攻击敌人',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['magic'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_provoke: {
    id: 'book_provoke',
    skillId: 'skill_provoke',
    name: '挑衅技能书',
    description: '学习挑衅技能，嘲讽敌人',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['defense'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_stun: {
    id: 'book_stun',
    skillId: 'skill_stun',
    name: '眩晕技能书',
    description: '学习眩晕技能，使敌人眩晕1回合',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['control'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_brave: {
    id: 'book_brave',
    skillId: 'skill_brave',
    name: '勇猛技能书',
    description: '学习勇猛，永久提升物理攻击力',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['attack'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_magic_boost: {
    id: 'book_magic_boost',
    skillId: 'skill_magic_boost',
    name: '魔力增幅技能书',
    description: '学习魔力增幅，永久提升法术攻击力',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['magic'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_crit_up: {
    id: 'book_crit_up',
    skillId: 'skill_crit_up',
    name: '暴击强化技能书',
    description: '学习暴击强化，永久提升暴击率',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_speed_up: {
    id: 'book_speed_up',
    skillId: 'skill_speed_up',
    name: '疾风技能书',
    description: '学习疾风，永久提升速度',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {},
    overrideBonus: 5,
  },
  book_charm: {
    id: 'book_charm',
    skillId: 'skill_charm',
    name: '魅惑技能书',
    description: '学习魅惑，被攻击时有几率魅惑攻击者',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['control'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_illusion: {
    id: 'book_illusion',
    skillId: 'skill_illusion',
    name: '幻象技能书',
    description: '学习幻象，被攻击时有几率闪避',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_suck_blood: {
    id: 'book_suck_blood',
    skillId: 'skill_suck_blood',
    name: '吸血技能书',
    description: '学习吸血，攻击时恢复生命值',
    rarity: 'rare',
    tier: 'medium',
    restrictions: {
      petType: ['attack'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },

  // ==================== 高级技能书（史诗品质，40%成功率）====================
  book_howl: {
    id: 'book_howl',
    skillId: 'skill_howl',
    name: '嚎叫技能书',
    description: '学习嚎叫，战斗开始时提升攻击力',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['attack'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_fireball: {
    id: 'book_fireball',
    skillId: 'skill_fireball',
    name: '火球术技能书',
    description: '学习火球术，发射火球攻击敌人',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['magic'],
      minLevel: 20,
      element: ['fire'],
    },
    overrideBonus: 10,
  },
  book_iron_skin: {
    id: 'book_iron_skin',
    skillId: 'skill_iron_skin',
    name: '铁壁技能书',
    description: '学习铁壁，永久提升防御力',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['defense'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_buff: {
    id: 'book_buff',
    skillId: 'skill_buff',
    name: '强化技能书',
    description: '学习强化，提升主人攻击力',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['support'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_multi_strike: {
    id: 'book_multi_strike',
    skillId: 'skill_multi_strike',
    name: '多段攻击技能书',
    description: '学习多段攻击，连续攻击敌人3次',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['attack'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_mass_heal: {
    id: 'book_mass_heal',
    skillId: 'skill_mass_heal',
    name: '群体治愈技能书',
    description: '学习群体治愈，恢复全体友方生命值',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      petType: ['support'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_invisibility: {
    id: 'book_invisibility',
    skillId: 'skill_invisibility',
    name: '隐身技能书',
    description: '学习隐身，战斗开始时进入隐身状态',
    rarity: 'epic',
    tier: 'high',
    restrictions: {
      minLevel: 20,
    },
    overrideBonus: 10,
  },

  // ==================== 超级技能书（传说品质，20%成功率）====================
  book_fury: {
    id: 'book_fury',
    skillId: 'skill_fury',
    name: '狂暴技能书',
    description: '学习狂暴，生命值低时大幅提升攻击',
    rarity: 'legendary',
    tier: 'super',
    restrictions: {
      petType: ['attack'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },
  book_thunder: {
    id: 'book_thunder',
    skillId: 'skill_thunder',
    name: '落雷技能书',
    description: '学习落雷，召唤雷电攻击敌人',
    rarity: 'legendary',
    tier: 'super',
    restrictions: {
      petType: ['magic'],
      minLevel: 30,
      element: ['metal'],
    },
    overrideBonus: 15,
  },
  book_counter: {
    id: 'book_counter',
    skillId: 'skill_counter',
    name: '反击技能书',
    description: '学习反击，被攻击时有几率反击',
    rarity: 'legendary',
    tier: 'super',
    restrictions: {
      petType: ['defense'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },
  book_resurrect: {
    id: 'book_resurrect',
    skillId: 'skill_resurrect',
    name: '复活技能书',
    description: '学习复活，主人死亡时有几率复活',
    rarity: 'legendary',
    tier: 'super',
    restrictions: {
      petType: ['support'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },
  book_thunder_storm: {
    id: 'book_thunder_storm',
    skillId: 'skill_thunder_storm',
    name: '雷暴技能书',
    description: '学习雷暴，召唤雷暴攻击全体敌人',
    rarity: 'legendary',
    tier: 'super',
    restrictions: {
      petType: ['magic'],
      minLevel: 30,
      element: ['metal'],
    },
    overrideBonus: 15,
  },

  // ==================== 神话技能书（通用，无类型限制）====================
  book_combo: {
    id: 'book_combo',
    skillId: 'skill_combo',
    name: '连击技能书',
    description: '学习连击，连续攻击敌人2次',
    rarity: 'mythic',
    tier: 'super',
    restrictions: {
      minLevel: 40,
    },
    overrideBonus: 25,
  },
  book_ice_arrow: {
    id: 'book_ice_arrow',
    skillId: 'skill_ice_arrow',
    name: '冰箭技能书',
    description: '学习冰箭，有几率冻结敌人',
    rarity: 'mythic',
    tier: 'super',
    restrictions: {
      minLevel: 40,
      element: ['water'],
    },
    overrideBonus: 25,
  },
};

/** 获取技能书 */
export function getSkillBook(id: string): SkillBookWithTier | undefined {
  return SKILL_BOOKS[id];
}

/** 获取技能模板 */
export function getPetSkillTemplate(skillId: string): PetSkillTemplate | undefined {
  return PET_SKILL_TEMPLATES[skillId];
}

/** 创建技能实例（带等级） */
export function createPetSkill(skillId: string, level: number = 1): PetSkill | undefined {
  const template = PET_SKILL_TEMPLATES[skillId];
  if (!template) return undefined;

  const levelConfig = SKILL_LEVEL_CONFIG[level - 1] || SKILL_LEVEL_CONFIG[0];
  const baseMultiplier = template.multiplier || 1;
  const baseMpCost = template.mpCost || 0;

  return {
    id: `pet_skill_${skillId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    type: template.type,
    description: template.description,
    mpCost: baseMpCost > 0 ? baseMpCost + levelConfig.mpCostBonus * (level - 1) : undefined,
    cooldown: template.cooldown,
    multiplier: baseMultiplier + levelConfig.multiplierBonus * (level - 1),
    element: template.element,
    effect: template.effect,
    level,
  };
}

/** 获取技能升级成功率 */
export function getSkillUpgradeSuccessRate(currentLevel: number): number {
  if (currentLevel >= MAX_SKILL_LEVEL) return 0;
  return SKILL_LEVEL_CONFIG[currentLevel - 1]?.successRate || 100;
}

/** 根据品质获取可用的技能书 */
export function getSkillBooksByQuality(quality: Quality): SkillBookWithTier[] {
  return Object.values(SKILL_BOOKS).filter(book => book.rarity === quality);
}

/** 根据等级获取可用的技能书 */
export function getSkillBooksByTier(tier: 'low' | 'medium' | 'high' | 'super'): SkillBookWithTier[] {
  return Object.values(SKILL_BOOKS).filter(book => book.tier === tier);
}

/** 根据宠物类型获取可学习的技能书 */
export function getSkillBooksForPetType(petType: PetType): SkillBookWithTier[] {
  return Object.values(SKILL_BOOKS).filter(book => {
    if (!book.restrictions.petType) return true;
    return book.restrictions.petType.includes(petType);
  });
}

/** 获取宠物当前可用的技能槽数量 */
export function getAvailableSkillSlots(petLevel: number): number {
  let slots = 1; // 初始1个槽位
  for (const config of SKILL_SLOT_CONFIG) {
    if (config.slot > 1 && config.unlockLevel && petLevel >= config.unlockLevel) {
      slots = Math.max(slots, config.slot);
    }
  }
  return slots;
}

/** 检查技能槽是否解锁 */
export function isSkillSlotUnlocked(slot: number, petLevel: number): boolean {
  const config = SKILL_SLOT_CONFIG.find(c => c.slot === slot);
  if (!config) return false;
  if (config.default) return true;
  if (config.unlockLevel && petLevel >= config.unlockLevel) return true;
  return false;
}

/** 学习保护道具配置 */
export const SKILL_PROTECTION_ITEM = {
  id: 'item_skill_protection',
  name: '技能保护符',
  description: '使用技能书时保证100%成功，不会覆盖失败',
  icon: '🔮',
  buyPrice: 500,
};

/** 技能槽解锁道具 */
export const SKILL_SLOT_UNLOCK_ITEM = {
  id: 'item_skill_slot_unlock',
  name: '技能槽解锁符',
  description: '永久解锁一个技能槽',
  icon: '🔓',
  buyPrice: 2000,
};

/** 学习成功率配置 */
export const SKILL_LEARNING_CONFIG = {
  // 技能槽未满时的成功率
  emptySlotSuccessRate: 100,
  // 技能槽已满时的基础成功率（会被技能书tier修正）
  fullSlotBaseSuccessRate: 70,
  // 保护道具使用后的成功率
  protectionSuccessRate: 100,
  // 技能升级基础成功率（按等级递减）
  upgradeBaseRates: [100, 80, 60, 40, 20],
};
