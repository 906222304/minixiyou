// 特性配置数据 - 扩展版

import type { Trait, Quality } from '@/types';

/** 特性列表 - 扩展版 */
export const TRAITS: Trait[] = [
  // ===== 普通特性 (白色) - 50% =====
  {
    id: 'trait_strength_small',
    name: '力量+5',
    description: '永久增加5点力量',
    icon: '💪',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'strength', value: 5, description: '力量+5' }],
    stackable: false,
  },
  {
    id: 'trait_intelligence_small',
    name: '灵力+5',
    description: '永久增加5点灵力',
    icon: '🧠',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'intelligence', value: 5, description: '灵力+5' }],
    stackable: false,
  },
  {
    id: 'trait_vitality_small',
    name: '体质+5',
    description: '永久增加5点体质',
    icon: '❤️',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'vitality', value: 5, description: '体质+5' }],
    stackable: false,
  },
  {
    id: 'trait_agility_small',
    name: '敏捷+5',
    description: '永久增加5点敏捷',
    icon: '💨',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'agility', value: 5, description: '敏捷+5' }],
    stackable: false,
  },
  {
    id: 'trait_willpower_small',
    name: '魔力+5',
    description: '永久增加5点魔力',
    icon: '✨',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'willpower', value: 5, description: '魔力+5' }],
    stackable: false,
  },
  {
    id: 'trait_hp_small',
    name: '生命+50',
    description: '永久增加50点生命上限',
    icon: '💗',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'maxHp', value: 50, description: '生命上限+50' }],
    stackable: false,
  },
  {
    id: 'trait_mp_small',
    name: '法力+30',
    description: '永久增加30点法力上限',
    icon: '💙',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'maxMp', value: 30, description: '法力上限+30' }],
    stackable: false,
  },
  {
    id: 'trait_speed_small',
    name: '速度+3',
    description: '永久增加3点速度',
    icon: '👟',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'speed', value: 3, description: '速度+3' }],
    stackable: false,
  },
  {
    id: 'trait_attack_small',
    name: '物攻+10',
    description: '永久增加10点物理攻击',
    icon: '🗡️',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'physicalAttack', value: 10, description: '物理攻击+10' }],
    stackable: false,
  },
  {
    id: 'trait_magic_small',
    name: '法攻+10',
    description: '永久增加10点法术攻击',
    icon: '📖',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'magicAttack', value: 10, description: '法术攻击+10' }],
    stackable: false,
  },
  {
    id: 'trait_defense_small',
    name: '物防+8',
    description: '永久增加8点物理防御',
    icon: '🛡️',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'physicalDefense', value: 8, description: '物理防御+8' }],
    stackable: false,
  },
  {
    id: 'trait_mdef_small',
    name: '法防+8',
    description: '永久增加8点法术防御',
    icon: '🔮',
    rarity: 'common',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'magicDefense', value: 8, description: '法术防御+8' }],
    stackable: false,
  },

  // ===== 稀有特性 (蓝色) - 30% =====
  {
    id: 'trait_attack_percent',
    name: '攻击强化',
    description: '物理攻击提升5%',
    icon: '⚔️',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'physicalAttack', value: 5, isPercent: true, description: '物理攻击+5%' }],
    stackable: false,
  },
  {
    id: 'trait_magic_percent',
    name: '法术强化',
    description: '法术攻击提升5%',
    icon: '🔮',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'magicAttack', value: 5, isPercent: true, description: '法术攻击+5%' }],
    stackable: false,
  },
  {
    id: 'trait_defense_percent',
    name: '防御强化',
    description: '物理防御提升5%',
    icon: '🛡️',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'physicalDefense', value: 5, isPercent: true, description: '物理防御+5%' }],
    stackable: false,
  },
  {
    id: 'trait_mdef_percent',
    name: '法防强化',
    description: '法术防御提升5%',
    icon: '🌀',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'magicDefense', value: 5, isPercent: true, description: '法术防御+5%' }],
    stackable: false,
  },
  {
    id: 'trait_hp_regen',
    name: '生命回复',
    description: '每回合恢复2%最大生命值',
    icon: '💚',
    rarity: 'rare',
    effects: [{ type: 'special', target: 'self', condition: 'on_turn_end', description: '每回合恢复2%HP' }],
    stackable: false,
  },
  {
    id: 'trait_mp_regen',
    name: '冥想',
    description: '每回合恢复3%最大法力值',
    icon: '💜',
    rarity: 'rare',
    effects: [{ type: 'special', target: 'self', condition: 'on_turn_end', description: '每回合恢复3%MP' }],
    stackable: false,
  },
  {
    id: 'trait_crit_small',
    name: '暴击倾向',
    description: '暴击率提升3%',
    icon: '💥',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'critRate', value: 3, isPercent: true, description: '暴击率+3%' }],
    stackable: false,
  },
  {
    id: 'trait_crit_damage_small',
    name: '暴伤强化',
    description: '暴击伤害提升10%',
    icon: '💫',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'critDamage', value: 10, isPercent: true, description: '暴击伤害+10%' }],
    stackable: false,
  },
  {
    id: 'trait_hit_small',
    name: '精准',
    description: '命中率提升3%',
    icon: '🎯',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'hitRate', value: 3, isPercent: true, description: '命中率+3%' }],
    stackable: false,
  },
  {
    id: 'trait_dodge_small',
    name: '灵巧',
    description: '闪避率提升2%',
    icon: '🏃',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'dodgeRate', value: 2, isPercent: true, description: '闪避率+2%' }],
    stackable: false,
  },
  {
    id: 'trait_speed_percent',
    name: '疾风',
    description: '速度提升5%',
    icon: '🌬️',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'speed', value: 5, isPercent: true, description: '速度+5%' }],
    stackable: false,
  },
  {
    id: 'trait_hp_percent',
    name: '健壮',
    description: '最大生命值提升5%',
    icon: '❤️',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'maxHp', value: 5, isPercent: true, description: '最大HP+5%' }],
    stackable: false,
  },
  {
    id: 'trait_mp_percent',
    name: '睿智',
    description: '最大法力值提升5%',
    icon: '💙',
    rarity: 'rare',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'maxMp', value: 5, isPercent: true, description: '最大MP+5%' }],
    stackable: false,
  },

  // ===== 史诗特性 (紫色) - 15% =====
  {
    id: 'trait_crit_large',
    name: '致命一击',
    description: '暴击率提升8%，暴击伤害提升15%',
    icon: '⚡',
    rarity: 'epic',
    effects: [
      { type: 'combat_bonus', target: 'self', stat: 'critRate', value: 8, isPercent: true, description: '暴击率+8%' },
      { type: 'combat_bonus', target: 'self', stat: 'critDamage', value: 15, isPercent: true, description: '暴击伤害+15%' },
    ],
    stackable: false,
  },
  {
    id: 'trait_double_attack',
    name: '连击',
    description: '攻击时有10%概率追加一次攻击',
    icon: '🔗',
    rarity: 'epic',
    effects: [{ type: 'special', target: 'self', condition: 'on_attack', description: '10%概率追加攻击' }],
    stackable: false,
  },
  {
    id: 'trait_vampire',
    name: '吸血',
    description: '造成伤害的10%转化为自身生命值',
    icon: '🩸',
    rarity: 'epic',
    effects: [{ type: 'special', target: 'self', condition: 'on_damage_dealt', description: '伤害的10%转化为HP' }],
    stackable: false,
  },
  {
    id: 'trait_speed_large',
    name: '迅捷',
    description: '速度提升15%',
    icon: '🌪️',
    rarity: 'epic',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'speed', value: 15, isPercent: true, description: '速度+15%' }],
    stackable: false,
  },
  {
    id: 'trait_penetration',
    name: '破甲',
    description: '物理穿透+20',
    icon: '🔨',
    rarity: 'epic',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'physicalPenetration', value: 20, description: '物理穿透+20' }],
    stackable: false,
  },
  {
    id: 'trait_magic_pen',
    name: '破魔',
    description: '法术穿透+20',
    icon: '✨',
    rarity: 'epic',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'magicPenetration', value: 20, description: '法术穿透+20' }],
    stackable: false,
  },
  {
    id: 'trait_damage_bonus',
    name: '伤害加深',
    description: '造成的伤害提升8%',
    icon: '💀',
    rarity: 'epic',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'damageBonus', value: 8, isPercent: true, description: '伤害加成+8%' }],
    stackable: false,
  },
  {
    id: 'trait_damage_reduction',
    name: '伤害减免',
    description: '受到的伤害减少8%',
    icon: '🛡️',
    rarity: 'epic',
    effects: [{ type: 'combat_bonus', target: 'self', stat: 'damageReduction', value: 8, isPercent: true, description: '伤害减免+8%' }],
    stackable: false,
  },
  {
    id: 'trait_spell_vamp',
    name: '法术吸血',
    description: '法术伤害的8%转化为自身生命值',
    icon: '💜',
    rarity: 'epic',
    effects: [{ type: 'special', target: 'self', condition: 'on_magic_damage', description: '法术伤害8%转化为HP' }],
    stackable: false,
  },
  {
    id: 'trait_counter',
    name: '反击',
    description: '被攻击时有15%概率反击',
    icon: '↩️',
    rarity: 'epic',
    effects: [{ type: 'special', target: 'self', condition: 'on_hit', description: '15%概率反击' }],
    stackable: false,
  },

  // ===== 传说特性 (橙色) - 4% =====
  {
    id: 'trait_element_fire',
    name: '炎之力',
    description: '火系技能伤害提升20%，火抗+15%',
    icon: '🔥',
    rarity: 'legendary',
    effects: [
      { type: 'special', target: 'self', condition: 'fire_damage', description: '火系技能伤害+20%' },
      { type: 'stat_bonus', target: 'self', stat: 'fireResistance', value: 15, description: '火抗+15%' },
    ],
    stackable: false,
  },
  {
    id: 'trait_element_ice',
    name: '冰之力',
    description: '冰系技能伤害提升20%，冰抗+15%',
    icon: '❄️',
    rarity: 'legendary',
    effects: [
      { type: 'special', target: 'self', condition: 'ice_damage', description: '冰系技能伤害+20%' },
      { type: 'stat_bonus', target: 'self', stat: 'iceResistance', value: 15, description: '冰抗+15%' },
    ],
    stackable: false,
  },
  {
    id: 'trait_element_thunder',
    name: '雷之力',
    description: '雷系技能伤害提升20%，雷抗+15%',
    icon: '⚡',
    rarity: 'legendary',
    effects: [
      { type: 'special', target: 'self', condition: 'thunder_damage', description: '雷系技能伤害+20%' },
      { type: 'stat_bonus', target: 'self', stat: 'thunderResistance', value: 15, description: '雷抗+15%' },
    ],
    stackable: false,
  },
  {
    id: 'trait_berserker',
    name: '狂战士',
    description: '生命值越低，攻击力越高（最高+30%）',
    icon: '😤',
    rarity: 'legendary',
    effects: [{ type: 'conditional', target: 'self', condition: 'hp_low', description: '低HP时攻击力提升' }],
    stackable: false,
  },
  {
    id: 'trait_turtle',
    name: '龟甲',
    description: '生命值低于30%时，伤害减免+25%',
    icon: '🐢',
    rarity: 'legendary',
    effects: [{ type: 'conditional', target: 'self', condition: 'hp_low_defense', description: '低HP时伤害减免+25%' }],
    stackable: false,
  },
  {
    id: 'trait_execute',
    name: '斩杀',
    description: '对生命值低于20%的敌人伤害+50%',
    icon: '☠️',
    rarity: 'legendary',
    effects: [{ type: 'conditional', target: 'self', condition: 'enemy_low_hp', description: '对低HP敌人伤害+50%' }],
    stackable: false,
  },
  {
    id: 'trait_mage_lord',
    name: '法神',
    description: '法术攻击+15%，法术穿透+15',
    icon: '🧙',
    rarity: 'legendary',
    effects: [
      { type: 'combat_bonus', target: 'self', stat: 'magicAttack', value: 15, isPercent: true, description: '法攻+15%' },
      { type: 'combat_bonus', target: 'self', stat: 'magicPenetration', value: 15, description: '法穿+15' },
    ],
    stackable: false,
  },
  {
    id: 'trait_war_lord',
    name: '武神',
    description: '物理攻击+15%，物理穿透+15',
    icon: '⚔️',
    rarity: 'legendary',
    effects: [
      { type: 'combat_bonus', target: 'self', stat: 'physicalAttack', value: 15, isPercent: true, description: '物攻+15%' },
      { type: 'combat_bonus', target: 'self', stat: 'physicalPenetration', value: 15, description: '物穿+15' },
    ],
    stackable: false,
  },

  // ===== 神话特性 (金色) - 1% =====
  {
    id: 'trait_revive',
    name: '不死之身',
    description: '死亡时有30%概率以30%生命值复活',
    icon: '👼',
    rarity: 'mythic',
    effects: [{ type: 'special', target: 'self', condition: 'on_death', description: '30%概率复活' }],
    stackable: false,
  },
  {
    id: 'trait_all_stats',
    name: '天选之人',
    description: '所有属性提升10%',
    icon: '⭐',
    rarity: 'mythic',
    effects: [{ type: 'stat_bonus', target: 'self', stat: 'all', value: 10, isPercent: true, description: '全属性+10%' }],
    stackable: false,
  },
  {
    id: 'trait_god_speed',
    name: '神速',
    description: '速度+30%，闪避率+10%',
    icon: '⚡',
    rarity: 'mythic',
    effects: [
      { type: 'combat_bonus', target: 'self', stat: 'speed', value: 30, isPercent: true, description: '速度+30%' },
      { type: 'combat_bonus', target: 'self', stat: 'dodgeRate', value: 10, isPercent: true, description: '闪避+10%' },
    ],
    stackable: false,
  },
  {
    id: 'trait_avatar',
    name: '化身',
    description: '战斗开始时获得一个护盾，吸收20%最大生命值的伤害',
    icon: '🌟',
    rarity: 'mythic',
    effects: [{ type: 'special', target: 'self', condition: 'on_battle_start', description: '开局获得20%HP护盾' }],
    stackable: false,
  },
  {
    id: 'trait_time_master',
    name: '时间掌控',
    description: '每回合有20%概率额外行动一次',
    icon: '⏰',
    rarity: 'mythic',
    effects: [{ type: 'special', target: 'self', condition: 'extra_turn', description: '20%概率额外行动' }],
    stackable: false,
  },
];

/** 按稀有度获取特性 */
export function getTraitsByRarity(rarity: Quality): Trait[] {
  return TRAITS.filter(t => t.rarity === rarity);
}

/** 获取特性配置 */
export function getTrait(id: string): Trait | undefined {
  return TRAITS.find(t => t.id === id);
}

/** 按概率随机抽取特性 */
export function rollRandomTraits(count: number, prng: () => number): Trait[] {
  const result: Trait[] = [];
  const usedIds = new Set<string>();

  while (result.length < count) {
    const roll = prng() * 100;
    let rarity: Quality;

    // 神话1%，传说4%，史诗15%，稀有30%，普通50%
    if (roll < 1) rarity = 'mythic';
    else if (roll < 5) rarity = 'legendary';
    else if (roll < 20) rarity = 'epic';
    else if (roll < 50) rarity = 'rare';
    else rarity = 'common';

    const candidates = getTraitsByRarity(rarity).filter(t => !usedIds.has(t.id));

    if (candidates.length > 0) {
      const trait = candidates[Math.floor(prng() * candidates.length)];
      result.push(trait);
      usedIds.add(trait.id);
    }
  }

  return result;
}

/** 特性稀有度权重配置 */
export const TRAIT_RARITY_WEIGHTS: Record<Quality, number> = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 4,
  mythic: 1,
};
