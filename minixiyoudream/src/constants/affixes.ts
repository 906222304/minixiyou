// 词条配置数据

import type {
  AffixRarity,
  ConditionType,
  TriggerEvent,
  SpecialEffectType,
  StatusEffectType,
} from '@/types/affix';
import type { StatType } from '@/types/common';

// ============================================
// 条件触发词条模板
// ============================================

/** 条件触发词条模板配置 */
interface ConditionalAffixTemplate {
  id: string;
  name: string;
  description: string;
  rarity: AffixRarity;
  condition: {
    type: ConditionType;
    threshold?: number;
    operator?: 'lt' | 'gt' | 'lte' | 'gte';
  };
  effect: {
    stat: StatType;
    valueMin: number;
    valueMax: number;
    isPercent: boolean;
  };
  weight: number;
}

/** 条件触发词条池 */
export const CONDITIONAL_AFFIX_TEMPLATES: ConditionalAffixTemplate[] = [
  // ===== 普通级 =====
  {
    id: 'cond_hp_low_str_1',
    name: '绝境之力',
    description: 'HP低于30%时，力量+{value}%',
    rarity: 'common',
    condition: { type: 'hp_threshold', threshold: 30, operator: 'lt' },
    effect: { stat: 'strength', valueMin: 3, valueMax: 5, isPercent: true },
    weight: 100,
  },
  {
    id: 'cond_hp_low_atk_1',
    name: '背水一战',
    description: 'HP低于30%时，物理攻击+{value}%',
    rarity: 'common',
    condition: { type: 'hp_threshold', threshold: 30, operator: 'lt' },
    effect: { stat: 'physicalAttack', valueMin: 5, valueMax: 8, isPercent: true },
    weight: 100,
  },
  {
    id: 'cond_mp_low_matk_1',
    name: '魔力枯竭',
    description: 'MP低于20%时，法术攻击+{value}%',
    rarity: 'common',
    condition: { type: 'mp_threshold', threshold: 20, operator: 'lt' },
    effect: { stat: 'magicAttack', valueMin: 5, valueMax: 8, isPercent: true },
    weight: 100,
  },

  // ===== 稀有级 =====
  {
    id: 'cond_hp_low_all_1',
    name: '不屈意志',
    description: 'HP低于30%时，全属性+{value}%',
    rarity: 'rare',
    condition: { type: 'hp_threshold', threshold: 30, operator: 'lt' },
    effect: { stat: 'strength', valueMin: 5, valueMax: 8, isPercent: true },
    weight: 60,
  },
  {
    id: 'cond_crit_heal_1',
    name: '暴击治愈',
    description: '暴击时，回复{value}%最大HP',
    rarity: 'rare',
    condition: { type: 'on_crit' },
    effect: { stat: 'maxHp', valueMin: 3, valueMax: 5, isPercent: true },
    weight: 60,
  },
  {
    id: 'cond_hit_def_1',
    name: '受击坚守',
    description: '被攻击时，防御+{value}%，持续本回合',
    rarity: 'rare',
    condition: { type: 'on_hit' },
    effect: { stat: 'physicalDefense', valueMin: 10, valueMax: 15, isPercent: true },
    weight: 60,
  },

  // ===== 史诗级 =====
  {
    id: 'cond_hp_low_dmg_1',
    name: '狂暴',
    description: 'HP低于30%时，伤害+{value}%',
    rarity: 'epic',
    condition: { type: 'hp_threshold', threshold: 30, operator: 'lt' },
    effect: { stat: 'damageBonus', valueMin: 15, valueMax: 20, isPercent: true },
    weight: 30,
  },
  {
    id: 'cond_kill_heal_1',
    name: '嗜血',
    description: '击杀敌人时，回复{value}%最大HP',
    rarity: 'epic',
    condition: { type: 'on_kill' },
    effect: { stat: 'maxHp', valueMin: 10, valueMax: 15, isPercent: true },
    weight: 30,
  },
  {
    id: 'cond_crit_dmg_1',
    name: '暴击强化',
    description: '暴击时，下次攻击伤害+{value}%',
    rarity: 'epic',
    condition: { type: 'on_crit' },
    effect: { stat: 'damageBonus', valueMin: 20, valueMax: 30, isPercent: true },
    weight: 30,
  },

  // ===== 传说级 =====
  {
    id: 'cond_hp_low_immortal_1',
    name: '不灭金身',
    description: 'HP低于10%时，伤害减免+{value}%',
    rarity: 'legendary',
    condition: { type: 'hp_threshold', threshold: 10, operator: 'lt' },
    effect: { stat: 'damageReduction', valueMin: 30, valueMax: 40, isPercent: true },
    weight: 10,
  },
  {
    id: 'cond_kill_speed_1',
    name: '追猎者',
    description: '击杀敌人时，速度+{value}%，持续3回合',
    rarity: 'legendary',
    condition: { type: 'on_kill' },
    effect: { stat: 'speed', valueMin: 30, valueMax: 50, isPercent: true },
    weight: 10,
  },

  // ===== 神话级 =====
  {
    id: 'cond_hp_ultimate_1',
    name: '绝境重生',
    description: 'HP低于10%时，全属性+{value}%，伤害减免+20%',
    rarity: 'mythic',
    condition: { type: 'hp_threshold', threshold: 10, operator: 'lt' },
    effect: { stat: 'damageBonus', valueMin: 40, valueMax: 50, isPercent: true },
    weight: 3,
  },
];

// ============================================
// 特殊效果词条模板
// ============================================

/** 特殊效果词条模板配置 */
interface SpecialAffixTemplate {
  id: string;
  name: string;
  description: string;
  rarity: AffixRarity;
  trigger: {
    event: TriggerEvent;
    chanceMin: number;  // 最小触发概率（百分比）
    chanceMax: number;  // 最大触发概率（百分比）
  };
  effect: {
    type: SpecialEffectType;
    damagePercent?: number;    // 伤害百分比
    element?: 'fire' | 'ice' | 'thunder';
    statusEffect?: StatusEffectType;
    statusDuration?: number;
    healPercent?: number;
  };
  weight: number;
}

/** 特殊效果词条池 */
export const SPECIAL_AFFIX_TEMPLATES: SpecialAffixTemplate[] = [
  // ===== 普通级 =====
  {
    id: 'special_fireball_1',
    name: '火球术',
    description: '攻击时{chance}%概率触发火球术，造成{value}%攻击力的火系伤害',
    rarity: 'common',
    trigger: { event: 'on_attack', chanceMin: 3, chanceMax: 5 },
    effect: { type: 'damage', damagePercent: 50, element: 'fire' },
    weight: 100,
  },
  {
    id: 'special_ice_shard_1',
    name: '冰晶',
    description: '攻击时{chance}%概率触发冰晶，造成{value}%攻击力的冰系伤害',
    rarity: 'common',
    trigger: { event: 'on_attack', chanceMin: 3, chanceMax: 5 },
    effect: { type: 'damage', damagePercent: 50, element: 'ice' },
    weight: 100,
  },
  {
    id: 'special_heal_1',
    name: '生命汲取',
    description: '攻击时{chance}%概率回复{value}%最大HP',
    rarity: 'common',
    trigger: { event: 'on_attack', chanceMin: 3, chanceMax: 5 },
    effect: { type: 'heal', healPercent: 3 },
    weight: 100,
  },

  // ===== 稀有级 =====
  {
    id: 'special_thunder_1',
    name: '雷霆',
    description: '攻击时{chance}%概率触发雷霆，造成{value}%攻击力的雷系伤害',
    rarity: 'rare',
    trigger: { event: 'on_attack', chanceMin: 5, chanceMax: 8 },
    effect: { type: 'damage', damagePercent: 80, element: 'thunder' },
    weight: 60,
  },
  {
    id: 'special_burn_1',
    name: '灼烧',
    description: '攻击时{chance}%概率使目标灼烧，持续3回合',
    rarity: 'rare',
    trigger: { event: 'on_attack', chanceMin: 5, chanceMax: 8 },
    effect: { type: 'status', statusEffect: 'burn', statusDuration: 3 },
    weight: 60,
  },
  {
    id: 'special_freeze_1',
    name: '冰冻',
    description: '攻击时{chance}%概率使目标减速30%，持续2回合',
    rarity: 'rare',
    trigger: { event: 'on_attack', chanceMin: 5, chanceMax: 8 },
    effect: { type: 'status', statusEffect: 'slow', statusDuration: 2 },
    weight: 60,
  },

  // ===== 史诗级 =====
  {
    id: 'special_stun_1',
    name: '眩晕打击',
    description: '攻击时{chance}%概率使目标眩晕1回合',
    rarity: 'epic',
    trigger: { event: 'on_attack', chanceMin: 5, chanceMax: 10 },
    effect: { type: 'status', statusEffect: 'stun', statusDuration: 1 },
    weight: 30,
  },
  {
    id: 'special_crit_heal_1',
    name: '暴击回春',
    description: '暴击时{chance}%概率回复{value}%最大HP',
    rarity: 'epic',
    trigger: { event: 'on_crit', chanceMin: 30, chanceMax: 50 },
    effect: { type: 'heal', healPercent: 8 },
    weight: 30,
  },
  {
    id: 'special_reflect_1',
    name: '伤害反射',
    description: '被攻击时{chance}%概率反弹{value}%受到的伤害',
    rarity: 'epic',
    trigger: { event: 'on_hit', chanceMin: 10, chanceMax: 15 },
    effect: { type: 'damage', damagePercent: 50 },
    weight: 30,
  },

  // ===== 传说级 =====
  {
    id: 'special_chain_1',
    name: '连锁闪电',
    description: '攻击时{chance}%概率触发连锁闪电，对目标及相邻敌人造成{value}%攻击力的雷系伤害',
    rarity: 'legendary',
    trigger: { event: 'on_attack', chanceMin: 8, chanceMax: 12 },
    effect: { type: 'damage', damagePercent: 100, element: 'thunder' },
    weight: 10,
  },
  {
    id: 'special_execute_1',
    name: '处决',
    description: '击杀时{chance}%概率回复{value}%最大HP和MP',
    rarity: 'legendary',
    trigger: { event: 'on_kill', chanceMin: 50, chanceMax: 80 },
    effect: { type: 'heal', healPercent: 15 },
    weight: 10,
  },

  // ===== 神话级 =====
  {
    id: 'special_phoenix_1',
    name: '凤凰之火',
    description: '攻击时{chance}%概率触发凤凰之火，造成{value}%攻击力的火系伤害并回复等量HP',
    rarity: 'mythic',
    trigger: { event: 'on_attack', chanceMin: 10, chanceMax: 15 },
    effect: { type: 'damage', damagePercent: 150, element: 'fire' },
    weight: 3,
  },
];

// ============================================
// 辅助函数
// ============================================

/** 根据稀有度获取条件触发词条模板 */
export function getConditionalTemplatesByRarity(rarity: AffixRarity): ConditionalAffixTemplate[] {
  return CONDITIONAL_AFFIX_TEMPLATES.filter(t => t.rarity === rarity);
}

/** 根据稀有度获取特殊效果词条模板 */
export function getSpecialTemplatesByRarity(rarity: AffixRarity): SpecialAffixTemplate[] {
  return SPECIAL_AFFIX_TEMPLATES.filter(t => t.rarity === rarity);
}

/** 获取所有条件触发词条模板（带权重） */
export function getWeightedConditionalTemplates(): Array<ConditionalAffixTemplate & { weight: number }> {
  return CONDITIONAL_AFFIX_TEMPLATES;
}

/** 获取所有特殊效果词条模板（带权重） */
export function getWeightedSpecialTemplates(): Array<SpecialAffixTemplate & { weight: number }> {
  return SPECIAL_AFFIX_TEMPLATES;
}

/** 按稀有度权重随机选择稀有度 */
export function rollAffixRarity(prng: { next: () => number }): AffixRarity {
  const roll = prng.next() * 100;
  if (roll < 1) return 'mythic';
  if (roll < 5) return 'legendary';
  if (roll < 20) return 'epic';
  if (roll < 50) return 'rare';
  return 'common';
}
