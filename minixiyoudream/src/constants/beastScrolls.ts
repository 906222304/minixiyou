// 兽诀配置 - 梦幻西游风格打书系统

import type { PetType, Element } from '@/types';
import type { Quality } from '@/types/common';

// ============================================
// 兽诀类型定义
// ============================================

/** 兽诀等级 */
export type BeastScrollTier = 'low' | 'high';

/** 兽诀技能分类 */
export type BeastScrollCategory = 'attack' | 'defense' | 'support' | 'magic';

/** 兽诀技能定义 - 用于兽诀配置 */
export interface BeastScrollSkill {
  id: string;
  name: string;
  type: 'passive' | 'active' | 'trigger';
  description?: string;
  multiplier?: number;
  skillId: string;
  mpCost?: number;
  cooldown?: number;
  element?: Element;
  effect?: {
    type: string;
    statusEffect?: string;
    duration?: number;
  };
}

/** 兽诀配置 */
export interface BeastScrollConfig {
  id: string;
  name: string;
  description: string;
  tier: BeastScrollTier;
  category: BeastScrollCategory;
  quality: Quality;
  icon: string;
  buyPrice: number;
  sellPrice: number;

  // 技能效果
  skill: BeastScrollSkill;

  // 学习限制
  restrictions?: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };

  // 覆盖成功率加成（高级兽诀更高）
  overrideBonus: number;

  // 技能互斥关系
  exclusiveWith?: string[];
}

/** 技能互斥组 - 同组技能只能存在一个 */
export interface SkillExclusiveGroup {
  groupId: string;
  name: string;
  description: string;
  skillIds: string[];
}

// ============================================
// 技能互斥组配置
// ============================================

/** 技能互斥组 - 参考梦幻西游 */
export const SKILL_EXCLUSIVE_GROUPS: SkillExclusiveGroup[] = [
  {
    groupId: 'attack_style',
    name: '攻击风格',
    description: '连击与必杀只能存在一个',
    skillIds: ['skill_combo_strike', 'skill_fatal_blow'],
  },
  {
    groupId: 'stealth_detection',
    name: '隐匿感知',
    description: '隐身与感知互斥',
    skillIds: ['skill_stealth', 'skill_detection'],
  },
  {
    groupId: 'ghost_type',
    name: '鬼魂类型',
    description: '不同鬼魂技能互斥',
    skillIds: ['skill_ghost', 'skill_advanced_ghost'],
  },
  {
    groupId: 'life_steal',
    name: '吸血类型',
    description: '吸血与高级吸血互斥',
    skillIds: ['skill_life_steal', 'skill_advanced_life_steal'],
  },
  {
    groupId: 'defense_style',
    name: '防御风格',
    description: '防御与招架只能存在一个',
    skillIds: ['skill_defense', 'skill_parry'],
  },
];

// ============================================
// 低级兽诀配置（20+种）
// ============================================

/** 低级兽诀列表 */
export const LOW_BEAST_SCROLLS: BeastScrollConfig[] = [
  // ==================== 攻击类 ====================
  {
    id: 'scroll_combo_strike',
    name: '连击兽诀',
    description: '攻击时有30%概率连续攻击2次，每次伤害降低25%',
    tier: 'low',
    category: 'attack',
    quality: 'rare',
    icon: '⚔️',
    buyPrice: 50000,
    sellPrice: 20000,
    skill: {
      id: 'skill_combo_strike',
      name: '连击',
      type: 'passive',
      description: '攻击时有30%概率连续攻击2次，每次伤害降低25%',
      multiplier: 0.75,
      skillId: 'skill_combo_strike',
    },
    restrictions: { petType: ['attack'] },
    overrideBonus: 0,
    exclusiveWith: ['skill_fatal_blow'],
  },
  {
    id: 'scroll_fatal_blow',
    name: '必杀兽诀',
    description: '攻击时有10%概率造成2倍暴击伤害',
    tier: 'low',
    category: 'attack',
    quality: 'rare',
    icon: '💥',
    buyPrice: 50000,
    sellPrice: 20000,
    skill: {
      id: 'skill_fatal_blow',
      name: '必杀',
      type: 'passive',
      description: '攻击时有10%概率造成2倍暴击伤害',
      multiplier: 2.0,
      skillId: 'skill_fatal_blow',
    },
    restrictions: { petType: ['attack'] },
    overrideBonus: 0,
    exclusiveWith: ['skill_combo_strike'],
  },
  {
    id: 'scroll_life_steal',
    name: '吸血兽诀',
    description: '攻击时恢复造成伤害的15%生命值',
    tier: 'low',
    category: 'attack',
    quality: 'rare',
    icon: '🩸',
    buyPrice: 60000,
    sellPrice: 24000,
    skill: {
      id: 'skill_life_steal',
      name: '吸血',
      type: 'trigger',
      description: '攻击时恢复造成伤害的15%生命值',
      multiplier: 0.15,
      skillId: 'skill_life_steal',
    },
    restrictions: { petType: ['attack'] },
    overrideBonus: 0,
    exclusiveWith: ['skill_advanced_life_steal'],
  },
  {
    id: 'scroll_sneak_attack',
    name: '偷袭兽诀',
    description: '攻击时有20%概率无视目标30%防御',
    tier: 'low',
    category: 'attack',
    quality: 'rare',
    icon: '🗡️',
    buyPrice: 40000,
    sellPrice: 16000,
    skill: {
      id: 'skill_sneak_attack',
      name: '偷袭',
      type: 'trigger',
      description: '攻击时有20%概率无视目标30%防御',
      multiplier: 0.3,
      skillId: 'skill_sneak_attack',
    },
    restrictions: { petType: ['attack'] },
    overrideBonus: 0,
  },
  {
    id: 'scroll_pursuit',
    name: '追击兽诀',
    description: '击杀目标后，有30%概率追击另一个目标',
    tier: 'low',
    category: 'attack',
    quality: 'rare',
    icon: '🏃',
    buyPrice: 45000,
    sellPrice: 18000,
    skill: {
      id: 'skill_pursuit',
      name: '追击',
      type: 'trigger',
      description: '击杀目标后，有30%概率追击另一个目标',
      multiplier: 0.5,
      skillId: 'skill_pursuit',
    },
    restrictions: { petType: ['attack'] },
    overrideBonus: 0,
  },

  // ==================== 防御类 ====================
  {
    id: 'scroll_defense',
    name: '防御兽诀',
    description: '永久提升防御力15%',
    tier: 'low',
    category: 'defense',
    quality: 'rare',
    icon: '🛡️',
    buyPrice: 40000,
    sellPrice: 16000,
    skill: {
      id: 'skill_defense',
      name: '防御',
      type: 'passive',
      description: '永久提升防御力15%',
      multiplier: 1.15,
      skillId: 'skill_defense',
    },
    restrictions: { petType: ['defense'] },
    overrideBonus: 0,
    exclusiveWith: ['skill_parry'],
  },
  {
    id: 'scroll_parry',
    name: '招架兽诀',
    description: '被攻击时有20%概率格挡，减少40%伤害',
    tier: 'low',
    category: 'defense',
    quality: 'rare',
    icon: '🛡️',
    buyPrice: 40000,
    sellPrice: 16000,
    skill: {
      id: 'skill_parry',
      name: '招架',
      type: 'trigger',
      description: '被攻击时有20%概率格挡，减少40%伤害',
      multiplier: 0.6,
      skillId: 'skill_parry',
    },
    restrictions: { petType: ['defense'] },
    overrideBonus: 0,
    exclusiveWith: ['skill_defense'],
  },
  {
    id: 'scroll_counter',
    name: '反震兽诀',
    description: '被攻击时有25%概率反弹20%伤害给攻击者',
    tier: 'low',
    category: 'defense',
    quality: 'rare',
    icon: '💫',
    buyPrice: 35000,
    sellPrice: 14000,
    skill: {
      id: 'skill_counter',
      name: '反震',
      type: 'trigger',
      description: '被攻击时有25%概率反弹20%伤害给攻击者',
      multiplier: 0.2,
      skillId: 'skill_counter',
    },
    restrictions: { petType: ['defense'] },
    overrideBonus: 0,
  },
  {
    id: 'scroll_god_bless',
    name: '神佑兽诀',
    description: '死亡时有20%概率复活，恢复30%生命值',
    tier: 'low',
    category: 'defense',
    quality: 'epic',
    icon: '👼',
    buyPrice: 80000,
    sellPrice: 32000,
    skill: {
      id: 'skill_god_bless',
      name: '神佑',
      type: 'trigger',
      description: '死亡时有20%概率复活，恢复30%生命值',
      multiplier: 0.3,
      skillId: 'skill_god_bless',
    },
    overrideBonus: 5,
  },
  {
    id: 'scroll_ghost',
    name: '鬼魂兽诀',
    description: '死亡后3回合复活，但对治疗技能免疫',
    tier: 'low',
    category: 'defense',
    quality: 'rare',
    icon: '👻',
    buyPrice: 45000,
    sellPrice: 18000,
    skill: {
      id: 'skill_ghost',
      name: '鬼魂',
      type: 'passive',
      description: '死亡后3回合复活，但对治疗技能免疫',
      skillId: 'skill_ghost',
    },
    overrideBonus: 0,
    exclusiveWith: ['skill_advanced_ghost'],
  },

  // ==================== 辅助类 ====================
  {
    id: 'scroll_agility',
    name: '敏捷兽诀',
    description: '永久提升速度15%',
    tier: 'low',
    category: 'support',
    quality: 'rare',
    icon: '⚡',
    buyPrice: 45000,
    sellPrice: 18000,
    skill: {
      id: 'skill_agility',
      name: '敏捷',
      type: 'passive',
      description: '永久提升速度15%',
      multiplier: 1.15,
      skillId: 'skill_agility',
    },
    overrideBonus: 0,
  },
  {
    id: 'scroll_detection',
    name: '感知兽诀',
    description: '可以攻击隐身状态的敌人',
    tier: 'low',
    category: 'support',
    quality: 'rare',
    icon: '👁️',
    buyPrice: 40000,
    sellPrice: 16000,
    skill: {
      id: 'skill_detection',
      name: '感知',
      type: 'passive',
      description: '可以攻击隐身状态的敌人',
      skillId: 'skill_detection',
    },
    overrideBonus: 0,
    exclusiveWith: ['skill_stealth'],
  },
  {
    id: 'scroll_stealth',
    name: '隐身兽诀',
    description: '战斗开始时隐身2回合，无法被普通攻击选中',
    tier: 'low',
    category: 'support',
    quality: 'epic',
    icon: '🌙',
    buyPrice: 70000,
    sellPrice: 28000,
    skill: {
      id: 'skill_stealth',
      name: '隐身',
      type: 'trigger',
      description: '战斗开始时隐身2回合，无法被普通攻击选中',
      skillId: 'skill_stealth',
    },
    overrideBonus: 5,
    exclusiveWith: ['skill_detection'],
  },
  {
    id: 'scroll_courage',
    name: '勇敢兽诀',
    description: '不会逃跑，对恐惧效果免疫',
    tier: 'low',
    category: 'support',
    quality: 'common',
    icon: '🦁',
    buyPrice: 20000,
    sellPrice: 8000,
    skill: {
      id: 'skill_courage',
      name: '勇敢',
      type: 'passive',
      description: '不会逃跑，对恐惧效果免疫',
      skillId: 'skill_courage',
    },
    overrideBonus: 0,
  },
  {
    id: 'scroll_lucky',
    name: '幸运兽诀',
    description: '被暴击概率降低50%',
    tier: 'low',
    category: 'support',
    quality: 'rare',
    icon: '🍀',
    buyPrice: 35000,
    sellPrice: 14000,
    skill: {
      id: 'skill_lucky',
      name: '幸运',
      type: 'passive',
      description: '被暴击概率降低50%',
      multiplier: 0.5,
      skillId: 'skill_lucky',
    },
    overrideBonus: 0,
  },
  {
    id: 'scroll_focus',
    name: '集中兽诀',
    description: '命中率提升15%',
    tier: 'low',
    category: 'support',
    quality: 'common',
    icon: '🎯',
    buyPrice: 25000,
    sellPrice: 10000,
    skill: {
      id: 'skill_focus',
      name: '集中',
      type: 'passive',
      description: '命中率提升15%',
      multiplier: 1.15,
      skillId: 'skill_focus',
    },
    overrideBonus: 0,
  },
  {
    id: 'scroll_regeneration',
    name: '再生兽诀',
    description: '每回合恢复2%最大生命值',
    tier: 'low',
    category: 'support',
    quality: 'rare',
    icon: '💚',
    buyPrice: 55000,
    sellPrice: 22000,
    skill: {
      id: 'skill_regeneration',
      name: '再生',
      type: 'passive',
      description: '每回合恢复2%最大生命值',
      multiplier: 0.02,
      skillId: 'skill_regeneration',
    },
    overrideBonus: 0,
  },

  // ==================== 法术类 ====================
  {
    id: 'scroll_magic_combo',
    name: '法术连击兽诀',
    description: '使用法术时有25%概率连续施放2次，第二次伤害降低50%',
    tier: 'low',
    category: 'magic',
    quality: 'rare',
    icon: '🔮',
    buyPrice: 60000,
    sellPrice: 24000,
    skill: {
      id: 'skill_magic_combo',
      name: '法术连击',
      type: 'passive',
      description: '使用法术时有25%概率连续施放2次，第二次伤害降低50%',
      multiplier: 0.5,
      skillId: 'skill_magic_combo',
    },
    restrictions: { petType: ['magic'] },
    overrideBonus: 0,
  },
  {
    id: 'scroll_magic_crit',
    name: '法术暴击兽诀',
    description: '法术攻击时有8%概率造成1.8倍伤害',
    tier: 'low',
    category: 'magic',
    quality: 'rare',
    icon: '✨',
    buyPrice: 55000,
    sellPrice: 22000,
    skill: {
      id: 'skill_magic_crit',
      name: '法术暴击',
      type: 'passive',
      description: '法术攻击时有8%概率造成1.8倍伤害',
      multiplier: 1.8,
      skillId: 'skill_magic_crit',
    },
    restrictions: { petType: ['magic'] },
    overrideBonus: 0,
  },
  {
    id: 'scroll_magic_pen',
    name: '法术穿透兽诀',
    description: '法术攻击无视目标15%法术防御',
    tier: 'low',
    category: 'magic',
    quality: 'rare',
    icon: '💠',
    buyPrice: 50000,
    sellPrice: 20000,
    skill: {
      id: 'skill_magic_pen',
      name: '法术穿透',
      type: 'passive',
      description: '法术攻击无视目标15%法术防御',
      multiplier: 0.15,
      skillId: 'skill_magic_pen',
    },
    restrictions: { petType: ['magic'] },
    overrideBonus: 0,
  },
  {
    id: 'scroll_mana_burn',
    name: '魔力燃烧兽诀',
    description: '法术攻击时额外消耗目标10点MP',
    tier: 'low',
    category: 'magic',
    quality: 'rare',
    icon: '🔥',
    buyPrice: 40000,
    sellPrice: 16000,
    skill: {
      id: 'skill_mana_burn',
      name: '魔力燃烧',
      type: 'trigger',
      description: '法术攻击时额外消耗目标10点MP',
      skillId: 'skill_mana_burn',
    },
    restrictions: { petType: ['magic'] },
    overrideBonus: 0,
  },
];

// ============================================
// 高级兽诀配置（15+种）
// ============================================

/** 高级兽诀列表 */
export const HIGH_BEAST_SCROLLS: BeastScrollConfig[] = [
  // ==================== 攻击类 ====================
  {
    id: 'scroll_advanced_combo',
    name: '高级连击兽诀',
    description: '攻击时有45%概率连续攻击2次，每次伤害降低15%',
    tier: 'high',
    category: 'attack',
    quality: 'epic',
    icon: '⚔️',
    buyPrice: 300000,
    sellPrice: 120000,
    skill: {
      id: 'skill_advanced_combo',
      name: '高级连击',
      type: 'passive',
      description: '攻击时有45%概率连续攻击2次，每次伤害降低15%',
      multiplier: 0.85,
      skillId: 'skill_advanced_combo',
    },
    restrictions: { petType: ['attack'], minLevel: 30 },
    overrideBonus: 15,
    exclusiveWith: ['skill_combo_strike', 'skill_fatal_blow', 'skill_advanced_fatal'],
  },
  {
    id: 'scroll_advanced_fatal',
    name: '高级必杀兽诀',
    description: '攻击时有20%概率造成2.5倍暴击伤害',
    tier: 'high',
    category: 'attack',
    quality: 'epic',
    icon: '💥',
    buyPrice: 300000,
    sellPrice: 120000,
    skill: {
      id: 'skill_advanced_fatal',
      name: '高级必杀',
      type: 'passive',
      description: '攻击时有20%概率造成2.5倍暴击伤害',
      multiplier: 2.5,
      skillId: 'skill_advanced_fatal',
    },
    restrictions: { petType: ['attack'], minLevel: 30 },
    overrideBonus: 15,
    exclusiveWith: ['skill_combo_strike', 'skill_fatal_blow', 'skill_advanced_combo'],
  },
  {
    id: 'scroll_advanced_life_steal',
    name: '高级吸血兽诀',
    description: '攻击时恢复造成伤害的25%生命值',
    tier: 'high',
    category: 'attack',
    quality: 'epic',
    icon: '🩸',
    buyPrice: 350000,
    sellPrice: 140000,
    skill: {
      id: 'skill_advanced_life_steal',
      name: '高级吸血',
      type: 'trigger',
      description: '攻击时恢复造成伤害的25%生命值',
      multiplier: 0.25,
      skillId: 'skill_advanced_life_steal',
    },
    restrictions: { petType: ['attack'], minLevel: 30 },
    overrideBonus: 15,
    exclusiveWith: ['skill_life_steal'],
  },
  {
    id: 'scroll_rampage',
    name: '高级狂暴兽诀',
    description: '生命值低于40%时，攻击力提升50%',
    tier: 'high',
    category: 'attack',
    quality: 'legendary',
    icon: '🔥',
    buyPrice: 500000,
    sellPrice: 200000,
    skill: {
      id: 'skill_rampage',
      name: '高级狂暴',
      type: 'trigger',
      description: '生命值低于40%时，攻击力提升50%',
      multiplier: 1.5,
      skillId: 'skill_rampage',
    },
    restrictions: { petType: ['attack'], minLevel: 40 },
    overrideBonus: 20,
  },

  // ==================== 防御类 ====================
  {
    id: 'scroll_advanced_defense',
    name: '高级防御兽诀',
    description: '永久提升防御力30%',
    tier: 'high',
    category: 'defense',
    quality: 'epic',
    icon: '🛡️',
    buyPrice: 250000,
    sellPrice: 100000,
    skill: {
      id: 'skill_advanced_defense',
      name: '高级防御',
      type: 'passive',
      description: '永久提升防御力30%',
      multiplier: 1.3,
      skillId: 'skill_advanced_defense',
    },
    restrictions: { petType: ['defense'], minLevel: 30 },
    overrideBonus: 15,
  },
  {
    id: 'scroll_advanced_god_bless',
    name: '高级神佑兽诀',
    description: '死亡时有40%概率复活，恢复50%生命值',
    tier: 'high',
    category: 'defense',
    quality: 'legendary',
    icon: '👼',
    buyPrice: 600000,
    sellPrice: 240000,
    skill: {
      id: 'skill_advanced_god_bless',
      name: '高级神佑',
      type: 'trigger',
      description: '死亡时有40%概率复活，恢复50%生命值',
      multiplier: 0.5,
      skillId: 'skill_advanced_god_bless',
    },
    restrictions: { minLevel: 40 },
    overrideBonus: 25,
  },
  {
    id: 'scroll_advanced_ghost',
    name: '高级鬼魂兽诀',
    description: '死亡后2回合复活，恢复70%生命值，不受异常状态影响',
    tier: 'high',
    category: 'defense',
    quality: 'epic',
    icon: '👻',
    buyPrice: 280000,
    sellPrice: 112000,
    skill: {
      id: 'skill_advanced_ghost',
      name: '高级鬼魂',
      type: 'passive',
      description: '死亡后2回合复活，恢复70%生命值，不受异常状态影响',
      multiplier: 0.7,
      skillId: 'skill_advanced_ghost',
    },
    restrictions: { minLevel: 30 },
    overrideBonus: 15,
    exclusiveWith: ['skill_ghost'],
  },
  {
    id: 'scroll_damage_reduction',
    name: '高级减伤兽诀',
    description: '受到的所有伤害降低20%',
    tier: 'high',
    category: 'defense',
    quality: 'epic',
    icon: '💎',
    buyPrice: 320000,
    sellPrice: 128000,
    skill: {
      id: 'skill_damage_reduction',
      name: '高级减伤',
      type: 'passive',
      description: '受到的所有伤害降低20%',
      multiplier: 0.8,
      skillId: 'skill_damage_reduction',
    },
    restrictions: { petType: ['defense'], minLevel: 35 },
    overrideBonus: 15,
  },

  // ==================== 辅助类 ====================
  {
    id: 'scroll_advanced_agility',
    name: '高级敏捷兽诀',
    description: '永久提升速度30%',
    tier: 'high',
    category: 'support',
    quality: 'epic',
    icon: '⚡',
    buyPrice: 280000,
    sellPrice: 112000,
    skill: {
      id: 'skill_advanced_agility',
      name: '高级敏捷',
      type: 'passive',
      description: '永久提升速度30%',
      multiplier: 1.3,
      skillId: 'skill_advanced_agility',
    },
    restrictions: { minLevel: 30 },
    overrideBonus: 15,
  },
  {
    id: 'scroll_advanced_stealth',
    name: '高级隐身兽诀',
    description: '战斗开始时隐身3回合，隐身期间攻击力提升20%',
    tier: 'high',
    category: 'support',
    quality: 'legendary',
    icon: '🌙',
    buyPrice: 450000,
    sellPrice: 180000,
    skill: {
      id: 'skill_advanced_stealth',
      name: '高级隐身',
      type: 'trigger',
      description: '战斗开始时隐身3回合，隐身期间攻击力提升20%',
      multiplier: 1.2,
      skillId: 'skill_advanced_stealth',
    },
    restrictions: { minLevel: 40 },
    overrideBonus: 20,
  },
  {
    id: 'scroll_healing_aura',
    name: '高级治愈兽诀',
    description: '每回合恢复全体友方3%最大生命值',
    tier: 'high',
    category: 'support',
    quality: 'epic',
    icon: '💚',
    buyPrice: 400000,
    sellPrice: 160000,
    skill: {
      id: 'skill_healing_aura',
      name: '高级治愈',
      type: 'passive',
      description: '每回合恢复全体友方3%最大生命值',
      multiplier: 0.03,
      skillId: 'skill_healing_aura',
    },
    restrictions: { minLevel: 35 },
    overrideBonus: 15,
  },
  {
    id: 'scroll_purify',
    name: '高级净化兽诀',
    description: '每回合开始时，有50%概率清除自身一个负面状态',
    tier: 'high',
    category: 'support',
    quality: 'epic',
    icon: '✨',
    buyPrice: 260000,
    sellPrice: 104000,
    skill: {
      id: 'skill_purify',
      name: '高级净化',
      type: 'trigger',
      description: '每回合开始时，有50%概率清除自身一个负面状态',
      multiplier: 0.5,
      skillId: 'skill_purify',
    },
    restrictions: { minLevel: 30 },
    overrideBonus: 15,
  },

  // ==================== 法术类 ====================
  {
    id: 'scroll_advanced_magic_combo',
    name: '高级法术连击兽诀',
    description: '使用法术时有40%概率连续施放2次，第二次伤害降低30%',
    tier: 'high',
    category: 'magic',
    quality: 'epic',
    icon: '🔮',
    buyPrice: 350000,
    sellPrice: 140000,
    skill: {
      id: 'skill_advanced_magic_combo',
      name: '高级法术连击',
      type: 'passive',
      description: '使用法术时有40%概率连续施放2次，第二次伤害降低30%',
      multiplier: 0.7,
      skillId: 'skill_advanced_magic_combo',
    },
    restrictions: { petType: ['magic'], minLevel: 30 },
    overrideBonus: 15,
  },
  {
    id: 'scroll_magic_power',
    name: '魔之心兽诀',
    description: '永久提升法术攻击力25%',
    tier: 'high',
    category: 'magic',
    quality: 'legendary',
    icon: '💜',
    buyPrice: 500000,
    sellPrice: 200000,
    skill: {
      id: 'skill_magic_power',
      name: '魔之心',
      type: 'passive',
      description: '永久提升法术攻击力25%',
      multiplier: 1.25,
      skillId: 'skill_magic_power',
    },
    restrictions: { petType: ['magic'], minLevel: 40 },
    overrideBonus: 25,
  },
];

// ============================================
// 兽诀索引和辅助函数
// ============================================

/** 所有兽诀映射表 */
export const ALL_BEAST_SCROLLS: Record<string, BeastScrollConfig> = {};

// 初始化映射表
[...LOW_BEAST_SCROLLS, ...HIGH_BEAST_SCROLLS].forEach(scroll => {
  ALL_BEAST_SCROLLS[scroll.id] = scroll;
});

/** 获取兽诀配置 */
export function getBeastScroll(id: string): BeastScrollConfig | undefined {
  return ALL_BEAST_SCROLLS[id];
}

/** 获取技能对应的兽诀 */
export function getBeastScrollBySkillId(skillId: string): BeastScrollConfig | undefined {
  return Object.values(ALL_BEAST_SCROLLS).find(s => s.skill.skillId === skillId);
}

/** 获取所有低级兽诀 */
export function getLowBeastScrolls(): BeastScrollConfig[] {
  return LOW_BEAST_SCROLLS;
}

/** 获取所有高级兽诀 */
export function getHighBeastScrolls(): BeastScrollConfig[] {
  return HIGH_BEAST_SCROLLS;
}

/** 按类别获取兽诀 */
export function getBeastScrollsByCategory(category: BeastScrollCategory): BeastScrollConfig[] {
  return Object.values(ALL_BEAST_SCROLLS).filter(s => s.category === category);
}

/** 按品质获取兽诀 */
export function getBeastScrollsByQuality(quality: Quality): BeastScrollConfig[] {
  return Object.values(ALL_BEAST_SCROLLS).filter(s => s.quality === quality);
}

/** 检查技能互斥关系 */
export function checkSkillExclusive(skillId: string, existingSkillIds: string[]): {
  hasConflict: boolean;
  conflictingSkill?: string;
  conflictingGroup?: SkillExclusiveGroup;
} {
  for (const group of SKILL_EXCLUSIVE_GROUPS) {
    if (group.skillIds.includes(skillId)) {
      for (const existingId of existingSkillIds) {
        if (group.skillIds.includes(existingId) && existingId !== skillId) {
          return {
            hasConflict: true,
            conflictingSkill: existingId,
            conflictingGroup: group,
          };
        }
      }
    }
  }
  return { hasConflict: false };
}

/** 获取技能互斥组 */
export function getSkillExclusiveGroup(skillId: string): SkillExclusiveGroup | undefined {
  return SKILL_EXCLUSIVE_GROUPS.find(g => g.skillIds.includes(skillId));
}

/** 获取兽诀基础成功率（高级兽诀更高） */
export function getBeastScrollBaseSuccessRate(tier: BeastScrollTier): number {
  return tier === 'high' ? 75 : 55; // 高级兽诀75%，低级兽诀55%
}

/** 计算最终打书成功率 */
export function calculateFinalSuccessRate(
  scroll: BeastScrollConfig,
  petAptitude: number,      // 资质 0.8-1.5
  petGrowth: number,        // 成长 0.8-1.5
  petIntimacy: number,      // 亲密度 0-100
  lockedSkillsCount: number // 锁定的技能数量
): number {
  // 基础成功率
  let rate = getBeastScrollBaseSuccessRate(scroll.tier);

  // 兽诀本身的覆盖加成
  rate += scroll.overrideBonus;

  // 资质加成（资质1.0为基准，每0.1增减2%）
  rate += (petAptitude - 1.0) * 20;

  // 成长加成（成长1.0为基准，每0.1增减3%）
  rate += (petGrowth - 1.0) * 30;

  // 亲密度加成（每点亲密度增加0.1%）
  rate += petIntimacy * 0.1;

  // 锁定技能惩罚（每个锁定技能减少15%）
  rate -= lockedSkillsCount * SKILL_LOCK_CONFIG.lockSuccessRatePenalty;

  // 限制在10%-100%之间
  return Math.max(10, Math.min(100, rate));
}

// 导入锁定配置
import { SKILL_LOCK_CONFIG } from './petSkillSlots';
