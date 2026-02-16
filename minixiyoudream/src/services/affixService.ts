// 词条服务 - 生成、洗练、条件检查、效果执行

import { PRNG } from '@/utils/prng';
import {
  CONDITIONAL_AFFIX_TEMPLATES,
  SPECIAL_AFFIX_TEMPLATES,
} from '@/constants/affixes';
import { canReforge, calculateReforgeCost } from '@/constants/reforge';
import type {
  Affix,
  BaseAffix,
  ConditionalAffix,
  SpecialAffix,
  AffixRarity,
  ConditionalEffect,
} from '@/types/affix';
import type { Equipment, Quality } from '@/types';
import type { StatType, FullStats, DamageResult } from '@/types/common';

// ============================================
// 词条生成
// ============================================

interface HasWeight {
  weight: number;
}

/** 根据权重随机选择 */
function weightedChoice<T extends HasWeight>(items: T[], prng: PRNG): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = prng.next() * totalWeight;

  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

/** 生成条件触发词条 */
export function generateConditionalAffix(
  quality: Quality,
  prng: PRNG
): ConditionalAffix {
  // 根据品质确定稀有度范围
  const rarityByQuality: Record<Quality, AffixRarity[]> = {
    common: ['common'],
    uncommon: ['common', 'rare'],
    rare: ['common', 'rare'],
    epic: ['common', 'rare', 'epic'],
    legendary: ['rare', 'epic', 'legendary'],
    mythic: ['epic', 'legendary', 'mythic'],
  };

  const allowedRarities = rarityByQuality[quality];
  const templates = CONDITIONAL_AFFIX_TEMPLATES.filter(
    t => allowedRarities.includes(t.rarity)
  );

  if (templates.length === 0) {
    // 降级到最低稀有度
    const fallbackTemplates = CONDITIONAL_AFFIX_TEMPLATES.filter(
      t => t.rarity === 'common'
    );
    const template = weightedChoice(fallbackTemplates, prng);
    return createConditionalAffixFromTemplate(template, prng);
  }

  const template = weightedChoice(templates, prng);
  return createConditionalAffixFromTemplate(template, prng);
}

/** 从模板创建条件触发词条 */
function createConditionalAffixFromTemplate(
  template: typeof CONDITIONAL_AFFIX_TEMPLATES[0],
  prng: PRNG
): ConditionalAffix {
  const value = prng.nextFloat(template.effect.valueMin, template.effect.valueMax);

  return {
    templateId: template.id,
    name: template.name,
    type: 'conditional',
    description: template.description
      .replace('{value}', value.toFixed(0)),
    condition: {
      type: template.condition.type,
      threshold: template.condition.threshold,
      operator: template.condition.operator,
    },
    effect: {
      stat: template.effect.stat,
      value,
      isPercent: template.effect.isPercent,
    },
    rarity: template.rarity,
  };
}

/** 生成特殊效果词条 */
export function generateSpecialAffix(
  quality: Quality,
  prng: PRNG
): SpecialAffix {
  const rarityByQuality: Record<Quality, AffixRarity[]> = {
    common: ['common'],
    uncommon: ['common', 'rare'],
    rare: ['common', 'rare'],
    epic: ['common', 'rare', 'epic'],
    legendary: ['rare', 'epic', 'legendary'],
    mythic: ['epic', 'legendary', 'mythic'],
  };

  const allowedRarities = rarityByQuality[quality];
  const templates = SPECIAL_AFFIX_TEMPLATES.filter(
    t => allowedRarities.includes(t.rarity)
  );

  if (templates.length === 0) {
    const fallbackTemplates = SPECIAL_AFFIX_TEMPLATES.filter(
      t => t.rarity === 'common'
    );
    const template = weightedChoice(fallbackTemplates, prng);
    return createSpecialAffixFromTemplate(template, prng);
  }

  const template = weightedChoice(templates, prng);
  return createSpecialAffixFromTemplate(template, prng);
}

/** 从模板创建特殊效果词条 */
function createSpecialAffixFromTemplate(
  template: typeof SPECIAL_AFFIX_TEMPLATES[0],
  prng: PRNG
): SpecialAffix {
  const chance = prng.nextFloat(template.trigger.chanceMin, template.trigger.chanceMax);
  const damagePercent = template.effect.damagePercent
    ? prng.nextFloat(template.effect.damagePercent * 0.8, template.effect.damagePercent * 1.2)
    : undefined;

  let description = template.description
    .replace('{chance}', chance.toFixed(1));

  if (damagePercent) {
    description = description.replace('{value}', damagePercent.toFixed(0));
  }

  return {
    templateId: template.id,
    name: template.name,
    type: 'special',
    description,
    trigger: {
      event: template.trigger.event,
      chance: chance / 100, // 转换为 0-1 范围
    },
    effect: {
      type: template.effect.type,
      damagePercent,
      element: template.effect.element,
      statusEffect: template.effect.statusEffect,
      statusDuration: template.effect.statusDuration,
      healPercent: template.effect.healPercent,
    },
    rarity: template.rarity,
  };
}

// ============================================
// 词条洗练
// ============================================

interface ReforgeResult {
  success: boolean;
  equipment: Equipment;
  cost: {
    reforgeStones: number;
    lockStones: number;
    gold: number;
  };
  error?: string;
}

/** 洗练装备词条 */
export function reforgeAffixes(
  equipment: Equipment,
  lockedIndices: number[],
  prng: PRNG
): ReforgeResult {
  const { canReforge: canDo, reason } = canReforge(
    lockedIndices.length,
    equipment.affixes.length
  );

  if (!canDo) {
    return {
      success: false,
      equipment,
      cost: { reforgeStones: 0, lockStones: 0, gold: 0 },
      error: reason,
    };
  }

  const cost = calculateReforgeCost(equipment.quality, lockedIndices.length);
  const newAffixes: Affix[] = [...equipment.affixes];

  for (let i = 0; i < newAffixes.length; i++) {
    if (lockedIndices.includes(i)) {
      continue; // 跳过锁定的词条
    }

    // 根据品质决定新词条类型
    const roll = prng.next() * 100;
    let newAffix: Affix;

    if (roll < 10) {
      // 10% 概率生成条件触发词条
      newAffix = generateConditionalAffix(equipment.quality, prng);
    } else if (roll < 15) {
      // 5% 概率生成特殊效果词条
      newAffix = generateSpecialAffix(equipment.quality, prng);
    } else {
      // 85% 保持原有类型的基础词条
      const oldAffix = newAffixes[i];
      if (oldAffix && (oldAffix.type === 'base_stat' || oldAffix.type === 'percent_stat' || oldAffix.type === 'combat_stat')) {
        // 重新随机数值
        newAffix = {
          ...oldAffix,
          value: regenerateAffixValue(oldAffix, equipment.quality, prng),
        };
      } else {
        // 生成新的基础词条
        newAffix = generateBaseAffix(equipment.quality, prng);
      }
    }

    newAffixes[i] = newAffix;
  }

  return {
    success: true,
    equipment: {
      ...equipment,
      affixes: newAffixes,
    },
    cost,
  };
}

/** 重新生成基础词条数值 */
function regenerateAffixValue(
  _affix: BaseAffix,
  quality: Quality,
  prng: PRNG
): number {
  const multipliers: Record<Quality, number> = {
    common: 0.6,
    uncommon: 0.7,
    rare: 0.8,
    epic: 1.0,
    legendary: 1.3,
    mythic: 1.6,
  };

  const baseRange = {
    min: 5,
    max: 15,
  };

  const multiplier = multipliers[quality];
  const min = Math.floor(baseRange.min * multiplier);
  const max = Math.floor(baseRange.max * multiplier);

  return prng.nextInt(min, max);
}

/** 生成基础词条 */
function generateBaseAffix(quality: Quality, prng: PRNG): BaseAffix {
  const stats: StatType[] = [
    'strength', 'intelligence', 'vitality', 'agility', 'willpower',
    'physicalAttack', 'magicAttack', 'physicalDefense', 'magicDefense',
    'critRate', 'critDamage', 'speed',
  ];

  const stat = prng.choice(stats);
  const isPercent = prng.next() > 0.5;
  const multipliers: Record<Quality, number> = {
    common: 0.6,
    uncommon: 0.7,
    rare: 0.8,
    epic: 1.0,
    legendary: 1.3,
    mythic: 1.6,
  };

  const multiplier = multipliers[quality];
  const baseValue = isPercent
    ? prng.nextFloat(2, 8) * multiplier
    : prng.nextInt(5, 20) * multiplier;

  return {
    templateId: `base_${stat}`,
    name: getStatDisplayName(stat),
    type: isPercent ? 'percent_stat' : 'base_stat',
    value: Math.floor(baseValue * 10) / 10,
    isPercent,
    targetStat: stat,
    description: `${getStatDisplayName(stat)}+${baseValue.toFixed(1)}${isPercent ? '%' : ''}`,
  };
}

/** 获取属性显示名称 */
function getStatDisplayName(stat: StatType): string {
  const names: Record<StatType, string> = {
    strength: '力量',
    intelligence: '灵力',
    vitality: '体质',
    agility: '敏捷',
    willpower: '魔力',
    physicalAttack: '物攻',
    physicalDefense: '物防',
    magicAttack: '法攻',
    magicDefense: '法防',
    speed: '速度',
    maxHp: '最大HP',
    maxMp: '最大MP',
    critRate: '暴击率',
    critDamage: '暴击伤害',
    hitRate: '命中率',
    dodgeRate: '闪避率',
    antiCritRate: '抗暴率',
    penetration: '穿透',
    lifeSteal: '吸血',
    reflect: '反弹',
    healBonus: '治疗加成',
    cooldownReduction: '冷却缩减',
    lifesteal: '吸血',
    spellVamp: '法术吸血',
    damageBonus: '伤害加成',
    damageReduction: '伤害减免',
    healReceived: '被治疗',
    physicalPenetration: '物穿',
    magicPenetration: '法穿',
    metalResistance: '金抗',
    woodResistance: '木抗',
    waterResistance: '水抗',
    fireResistance: '火抗',
    earthResistance: '土抗',
  };
  return names[stat] || stat;
}

// ============================================
// 条件检查
// ============================================

interface CombatUnit {
  id: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: Partial<FullStats>;
}

/** 检查条件触发词条是否满足条件 */
export function checkConditionalAffix(
  affix: ConditionalAffix,
  unit: CombatUnit
): boolean {
  const { condition } = affix;

  switch (condition.type) {
    case 'hp_threshold': {
      const hpPercent = (unit.hp / unit.maxHp) * 100;
      return checkThreshold(hpPercent, condition.threshold ?? 0, condition.operator ?? 'lt');
    }

    case 'mp_threshold': {
      const mpPercent = (unit.mp / unit.maxMp) * 100;
      return checkThreshold(mpPercent, condition.threshold ?? 0, condition.operator ?? 'lt');
    }

    case 'on_crit':
    case 'on_kill':
    case 'on_hit':
    case 'on_attack':
      // 这些条件需要在战斗流程中触发检查
      return false;

    default:
      return false;
  }
}

/** 检查阈值条件 */
function checkThreshold(
  value: number,
  threshold: number,
  operator: string
): boolean {
  switch (operator) {
    case 'lt': return value < threshold;
    case 'gt': return value > threshold;
    case 'eq': return value === threshold;
    case 'lte': return value <= threshold;
    case 'gte': return value >= threshold;
    default: return false;
  }
}

/** 获取单位当前生效的条件触发效果 */
export function getActiveConditionalEffects(
  affixes: Affix[],
  unit: CombatUnit
): ConditionalEffect[] {
  const effects: ConditionalEffect[] = [];

  for (const affix of affixes) {
    if (affix.type === 'conditional') {
      if (checkConditionalAffix(affix, unit)) {
        effects.push(affix.effect);
      }
    }
  }

  return effects;
}

// ============================================
// 特殊效果执行
// ============================================

interface SpecialEffectResult {
  triggered: boolean;
  damage?: DamageResult;
  heal?: number;
  statusApplied?: {
    type: string;
    duration: number;
  };
  logText?: string;
}

/** 尝试触发特殊效果 */
export function tryTriggerSpecialEffect(
  affix: SpecialAffix,
  source: CombatUnit,
  _target: CombatUnit,
  prng: PRNG
): SpecialEffectResult {
  // 概率判定
  if (prng.next() > affix.trigger.chance) {
    return { triggered: false };
  }

  const { effect } = affix;
  const result: SpecialEffectResult = { triggered: true };

  switch (effect.type) {
    case 'damage': {
      const baseDamage = (source.stats.physicalAttack ?? 0) * (effect.damagePercent ?? 50) / 100;
      result.damage = {
        damage: Math.floor(baseDamage),
        isCritical: false,
        element: effect.element,
      };
      result.logText = `${source.id} 的 ${affix.name} 触发，造成 ${Math.floor(baseDamage)} 点${effect.element ?? ''}伤害`;
      break;
    }

    case 'heal': {
      const healAmount = Math.floor(source.maxHp * (effect.healPercent ?? 5) / 100);
      result.heal = healAmount;
      result.logText = `${source.id} 的 ${affix.name} 触发，回复 ${healAmount} HP`;
      break;
    }

    case 'status': {
      if (effect.statusEffect && effect.statusDuration) {
        result.statusApplied = {
          type: effect.statusEffect,
          duration: effect.statusDuration,
        };
        result.logText = `${source.id} 的 ${affix.name} 触发，使目标 ${effect.statusEffect} ${effect.statusDuration} 回合`;
      }
      break;
    }

    case 'skill':
      // 技能触发需要技能系统支持，这里暂时简化
      result.logText = `${source.id} 的 ${affix.name} 触发`;
      break;
  }

  return result;
}

/** 获取装备上的所有特殊效果词条 */
export function getSpecialAffixes(affixes: Affix[]): SpecialAffix[] {
  return affixes.filter((a): a is SpecialAffix => a.type === 'special');
}

/** 获取装备上的所有条件触发词条 */
export function getConditionalAffixes(affixes: Affix[]): ConditionalAffix[] {
  return affixes.filter((a): a is ConditionalAffix => a.type === 'conditional');
}

// ============================================
// 导出服务对象
// ============================================

export const affixService = {
  // 生成
  generateConditionalAffix,
  generateSpecialAffix,

  // 洗练
  reforgeAffixes,
  calculateReforgeCost,

  // 条件检查
  checkConditionalAffix,
  getActiveConditionalEffects,
  getConditionalAffixes,

  // 特殊效果
  tryTriggerSpecialEffect,
  getSpecialAffixes,
};
