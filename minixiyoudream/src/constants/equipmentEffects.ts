// 装备特效和特技配置 - 梦幻西游风格

import type { CombatStats, EquipmentEffectType, SpecialSkillType } from '@/types';

// 重导出类型供外部使用
export type { EquipmentEffectType, SpecialSkillType };

// ==================== 特效类型 ====================

/** 特效配置 */
export interface SpecialEffect {
  id: EquipmentEffectType;
  name: string;
  description: string;
  icon: string;
  // 特效数值（百分比或固定值）
  value: number;
  // 特效触发条件
  trigger?: {
    type: 'on_death' | 'on_damage' | 'on_attack' | 'low_hp' | 'passive';
    threshold?: number; // 触发阈值（如低血量百分比）
  };
  // 适用装备槽位（不填则所有装备都可用）
  applicableSlots?: string[];
  // 品质权重（越高越稀有）
  rarityWeight: number;
}

/** 所有特效配置 */
export const SPECIAL_EFFECTS: Record<EquipmentEffectType, SpecialEffect> = {
  blessing: {
    id: 'blessing',
    name: '神佑',
    description: '死亡时有20%概率复活，恢复30%生命值',
    icon: '👼',
    value: 0.2,
    trigger: {
      type: 'on_death',
      threshold: 0.3, // 复活时恢复30%HP
    },
    rarityWeight: 10,
  },
  fury: {
    id: 'fury',
    name: '愤怒',
    description: '战斗中怒气获取速度提升30%',
    icon: '💢',
    value: 0.3,
    trigger: {
      type: 'passive',
    },
    rarityWeight: 8,
  },
  critical: {
    id: 'critical',
    name: '暴击',
    description: '暴击率额外提升10%',
    icon: '💥',
    value: 0.1,
    trigger: {
      type: 'passive',
    },
    rarityWeight: 7,
  },
  precision: {
    id: 'precision',
    name: '必中',
    description: '攻击必定命中，无视闪避',
    icon: '🎯',
    value: 1.0,
    trigger: {
      type: 'on_attack',
    },
    rarityWeight: 9,
  },
  berserk: {
    id: 'berserk',
    name: '狂暴',
    description: '生命值低于30%时，伤害提升50%',
    icon: '👹',
    value: 0.5,
    trigger: {
      type: 'low_hp',
      threshold: 0.3,
    },
    rarityWeight: 8,
  },
  thorns: {
    id: 'thorns',
    name: '荆棘',
    description: '受到物理攻击时反弹15%伤害',
    icon: '🌵',
    value: 0.15,
    trigger: {
      type: 'on_damage',
    },
    applicableSlots: ['armor', 'helmet', 'belt'],
    rarityWeight: 6,
  },
  mystery: {
    id: 'mystery',
    name: '神秘',
    description: '有15%概率躲避法术攻击',
    icon: '🌙',
    value: 0.15,
    trigger: {
      type: 'passive',
    },
    rarityWeight: 8,
  },
  sturdy: {
    id: 'sturdy',
    name: '坚固',
    description: '装备耐久消耗降低50%，不易损坏',
    icon: '🛡️',
    value: 0.5,
    trigger: {
      type: 'passive',
    },
    rarityWeight: 5,
  },
};

// ==================== 特技类型 ====================

/** 特技目标类型 */
export type SkillTargetType =
  | 'self'           // 自身
  | 'single_enemy'   // 单个敌人
  | 'single_ally'    // 单个友方
  | 'all_enemies'    // 所有敌人
  | 'all_allies'     // 所有友方
  | 'dead_ally';     // 死亡的友方

/** 特技配置 */
export interface SpecialSkill {
  id: SpecialSkillType;
  name: string;
  description: string;
  icon: string;
  // 怒气消耗
  rageCost: number;
  // 冷却回合数
  cooldown: number;
  // 目标类型
  targetType: SkillTargetType;
  // 技能效果
  effects: {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'revive' | 'dispel' | 'steal';
    value?: number;
    isPercent?: boolean;
    duration?: number; // 持续回合
    stat?: keyof CombatStats;
  }[];
  // 品质权重
  rarityWeight: number;
  // 适用装备槽位
  applicableSlots?: string[];
}

/** 所有特技配置 */
export const SPECIAL_SKILLS: Record<SpecialSkillType, SpecialSkill> = {
  po_xue_kuang_gong: {
    id: 'po_xue_kuang_gong',
    name: '破血狂攻',
    description: '消耗怒气，连续攻击目标两次',
    icon: '⚔️',
    rageCost: 80,
    cooldown: 0,
    targetType: 'single_enemy',
    effects: [
      {
        type: 'damage',
        value: 100,
        isPercent: false,
      },
      {
        type: 'damage',
        value: 100,
        isPercent: false,
      },
    ],
    rarityWeight: 10,
    applicableSlots: ['weapon'],
  },
  jing_qing_jue: {
    id: 'jing_qing_jue',
    name: '晶清诀',
    description: '解除自身所有异常状态，并恢复20%生命值',
    icon: '💠',
    rageCost: 100,
    cooldown: 3,
    targetType: 'self',
    effects: [
      {
        type: 'dispel',
      },
      {
        type: 'heal',
        value: 0.2,
        isPercent: true,
      },
    ],
    rarityWeight: 9,
  },
  luo_han_jin_zhong: {
    id: 'luo_han_jin_zhong',
    name: '罗汉金钟',
    description: '3回合内受到的伤害减少50%',
    icon: '🔔',
    rageCost: 120,
    cooldown: 5,
    targetType: 'self',
    effects: [
      {
        type: 'buff',
        stat: 'physicalDefense',
        value: 0.5,
        isPercent: true,
        duration: 3,
      },
      {
        type: 'buff',
        stat: 'magicDefense',
        value: 0.5,
        isPercent: true,
        duration: 3,
      },
    ],
    rarityWeight: 12,
    applicableSlots: ['armor', 'helmet', 'charm'],
  },
  ci_hang_pu_du: {
    id: 'ci_hang_pu_du',
    name: '慈航普度',
    description: '复活一名死亡的队友，恢复其40%生命值',
    icon: '🧚',
    rageCost: 150,
    cooldown: 8,
    targetType: 'dead_ally',
    effects: [
      {
        type: 'revive',
        value: 0.4,
        isPercent: true,
      },
    ],
    rarityWeight: 15,
    applicableSlots: ['necklace', 'charm'],
  },
  si_hai_sheng_ping: {
    id: 'si_hai_sheng_ping',
    name: '四海升平',
    description: '恢复全体友方30%生命值',
    icon: '🌈',
    rageCost: 135,
    cooldown: 6,
    targetType: 'all_allies',
    effects: [
      {
        type: 'heal',
        value: 0.3,
        isPercent: true,
      },
    ],
    rarityWeight: 12,
    applicableSlots: ['necklace', 'charm'],
  },
  xiao_li_cang_dao: {
    id: 'xiao_li_cang_dao',
    name: '笑里藏刀',
    description: '偷取目标50点怒气',
    icon: '😏',
    rageCost: 40,
    cooldown: 2,
    targetType: 'single_enemy',
    effects: [
      {
        type: 'steal',
        value: 50,
        isPercent: false,
      },
    ],
    rarityWeight: 8,
    applicableSlots: ['weapon', 'ring1', 'ring2'],
  },
  jue_huan_mo_yin: {
    id: 'jue_huan_mo_yin',
    name: '绝幻魔音',
    description: '使所有敌人陷入混乱状态2回合',
    icon: '🎶',
    rageCost: 100,
    cooldown: 5,
    targetType: 'all_enemies',
    effects: [
      {
        type: 'debuff',
        value: 1,
        isPercent: false,
        duration: 2,
      },
    ],
    rarityWeight: 11,
    applicableSlots: ['necklace', 'charm'],
  },
  xiu_luo_zhou: {
    id: 'xiu_luo_zhou',
    name: '修罗咒',
    description: '3回合内伤害提升30%，但每回合损失5%生命值',
    icon: '😈',
    rageCost: 80,
    cooldown: 4,
    targetType: 'self',
    effects: [
      {
        type: 'buff',
        stat: 'physicalAttack',
        value: 0.3,
        isPercent: true,
        duration: 3,
      },
      {
        type: 'buff',
        stat: 'magicAttack',
        value: 0.3,
        isPercent: true,
        duration: 3,
      },
    ],
    rarityWeight: 10,
    applicableSlots: ['weapon', 'ring1', 'ring2'],
  },
};

// ==================== 辅助函数 ====================

/** 获取特效配置 */
export function getSpecialEffect(type: EquipmentEffectType): SpecialEffect | undefined {
  return SPECIAL_EFFECTS[type];
}

/** 获取所有特效列表 */
export function getAllSpecialEffects(): SpecialEffect[] {
  return Object.values(SPECIAL_EFFECTS);
}

/** 根据槽位获取可用特效 */
export function getSpecialEffectsBySlot(slot: string): SpecialEffect[] {
  return Object.values(SPECIAL_EFFECTS).filter(
    (effect) => !effect.applicableSlots || effect.applicableSlots.includes(slot)
  );
}

/** 获取特技配置 */
export function getSpecialSkill(type: SpecialSkillType): SpecialSkill | undefined {
  return SPECIAL_SKILLS[type];
}

/** 获取所有特技列表 */
export function getAllSpecialSkills(): SpecialSkill[] {
  return Object.values(SPECIAL_SKILLS);
}

/** 根据槽位获取可用特技 */
export function getSpecialSkillsBySlot(slot: string): SpecialSkill[] {
  return Object.values(SPECIAL_SKILLS).filter(
    (skill) => !skill.applicableSlots || skill.applicableSlots.includes(slot)
  );
}

/** 根据稀有度权重随机选择特效 */
export function rollSpecialEffect(slot: string, luck: number = 0): SpecialEffect | null {
  const availableEffects = getSpecialEffectsBySlot(slot);
  if (availableEffects.length === 0) return null;

  // 幸运值增加获得稀有特效的概率
  const adjustedLuck = Math.min(luck, 50);
  const totalWeight = availableEffects.reduce((sum, e) => sum + e.rarityWeight, 0);
  let roll = Math.random() * totalWeight;

  // 幸运值让roll偏向更高权重的特效
  if (adjustedLuck > 0) {
    roll = roll * (1 - adjustedLuck / 100);
  }

  for (const effect of availableEffects) {
    roll -= effect.rarityWeight;
    if (roll <= 0) {
      return effect;
    }
  }

  return availableEffects[0];
}

/** 根据稀有度权重随机选择特技 */
export function rollSpecialSkill(slot: string, luck: number = 0): SpecialSkill | null {
  const availableSkills = getSpecialSkillsBySlot(slot);
  if (availableSkills.length === 0) return null;

  const adjustedLuck = Math.min(luck, 50);
  const totalWeight = availableSkills.reduce((sum, s) => sum + s.rarityWeight, 0);
  let roll = Math.random() * totalWeight;

  if (adjustedLuck > 0) {
    roll = roll * (1 - adjustedLuck / 100);
  }

  for (const skill of availableSkills) {
    roll -= skill.rarityWeight;
    if (roll <= 0) {
      return skill;
    }
  }

  return availableSkills[0];
}
