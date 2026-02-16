// 通用类型定义

/** 唯一ID类型 */
export type UUID = string;

/** 生成UUID */
export function generateUUID(): UUID {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 品质枚举 */
export type Quality = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/** 属性类型（用于词条系统） */
export type StatType =
  // 基础属性
  | 'strength' | 'intelligence' | 'vitality' | 'agility' | 'willpower'
  // 战斗属性
  | 'physicalAttack' | 'physicalDefense'
  | 'magicAttack' | 'magicDefense'
  | 'speed' | 'maxHp' | 'maxMp'
  | 'critRate' | 'critDamage'
  | 'hitRate' | 'dodgeRate'
  // 新增核心扩展属性
  | 'antiCritRate' | 'penetration' | 'lifeSteal' | 'reflect' | 'healBonus' | 'cooldownReduction'
  // 扩展属性
  | 'lifesteal' | 'spellVamp'
  | 'damageBonus' | 'damageReduction'
  | 'healReceived'
  | 'physicalPenetration' | 'magicPenetration'
  // 五行抗性
  | 'metalResistance' | 'woodResistance' | 'waterResistance' | 'fireResistance' | 'earthResistance';

/** 品质配置 */
export const QUALITY_CONFIG: Record<Quality, { name: string; color: string; multiplier: number }> = {
  common: { name: '普通', color: '#FFFFFF', multiplier: 1.0 },
  uncommon: { name: '优秀', color: '#1EFF00', multiplier: 1.1 },
  rare: { name: '稀有', color: '#0070DD', multiplier: 1.2 },
  epic: { name: '史诗', color: '#A335EE', multiplier: 1.5 },
  legendary: { name: '传说', color: '#FF8000', multiplier: 1.8 },
  mythic: { name: '神话', color: '#E6CC80', multiplier: 2.2 },
};

/** 品质顺序（用于比较） */
export const QUALITY_ORDER: Quality[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

/** 元素类型 - 五行元素系统 */
export type Element = 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'physical' | 'none';

/** 元素克制关系 - 五行相克：金克木，木克土，土克水，水克火，火克金 */
export const ELEMENT_ADVANTAGE: Record<Element, Element | null> = {
  metal: 'wood',    // 金克木
  wood: 'earth',    // 木克土
  water: 'fire',    // 水克火
  fire: 'metal',    // 火克金
  earth: 'water',   // 土克水
  physical: null,
  none: null,
};

/** 元素被克关系 - 反向查找 */
export const ELEMENT_DISADVANTAGE: Record<Element, Element | null> = {
  metal: 'fire',    // 金被火克
  wood: 'metal',    // 木被金克
  water: 'earth',   // 水被土克
  fire: 'water',    // 火被水克
  earth: 'wood',    // 土被木克
  physical: null,
  none: null,
};

/** 元素名称映射 */
export const ELEMENT_NAMES: Record<Element, string> = {
  metal: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土',
  physical: '物理',
  none: '无',
};

/** 元素克制伤害加成 */
export const ELEMENT_ADVANTAGE_MULTIPLIER = 1.3; // 克制+30%伤害

/** 元素被克伤害减免 */
export const ELEMENT_DISADVANTAGE_MULTIPLIER = 0.8; // 被克-20%伤害

/** 基础属性 */
export interface BaseStats {
  strength: number;     // 力量 - 影响物理攻击
  intelligence: number; // 灵力 - 影响法术攻击
  vitality: number;     // 体质 - 影响HP和防御
  agility: number;      // 敏捷 - 影响速度和暴击
  willpower: number;    // 魔力 - 影响MP和法防
}

/** 战斗属性 - 核心属性 */
export interface CombatStats {
  physicalAttack: number;   // 物理攻击
  physicalDefense: number;  // 物理防御
  magicAttack: number;      // 法术攻击
  magicDefense: number;     // 法术防御
  speed: number;            // 速度
  maxHp: number;            // 最大HP
  maxMp: number;            // 最大MP
  critRate: number;         // 暴击率 (0-1)
  critDamage: number;       // 暴击伤害倍率 (1.5 = 150%)
  hitRate: number;          // 命中率 (0-1)
  dodgeRate: number;        // 闪避率 (0-1)
  // 新增扩展属性
  antiCritRate: number;     // 抗暴率 - 降低被暴击概率 (0-1)
  penetration: number;      // 穿透 - 无视部分防御（固定值）
  lifeSteal: number;        // 吸血 - 攻击回复生命百分比 (0-1)
  reflect: number;          // 反弹 - 受到伤害时反弹百分比 (0-1)
  healBonus: number;        // 治疗加成 - 提升受到治疗效果 (0-1)
  cooldownReduction: number;// 技能冷却缩减 (0-1)
}

/** 新增战斗属性的默认值 */
export const DEFAULT_EXTENDED_COMBAT_STATS = {
  antiCritRate: 0,
  penetration: 0,
  lifeSteal: 0,
  reflect: 0,
  healBonus: 0,
  cooldownReduction: 0,
};

/** 扩展战斗属性 - 包含穿透/吸血/加成等 */
export interface ExtendedCombatStats extends CombatStats {
  // 五行元素抗性
  metalResistance?: number;     // 金抗 (%)
  woodResistance?: number;      // 木抗 (%)
  waterResistance?: number;     // 水抗 (%)
  fireResistance?: number;      // 火抗 (%)
  earthResistance?: number;     // 土抗 (%)

  // 穿透（固定值覆盖）
  physicalPenetration?: number; // 物理穿透（固定值）
  magicPenetration?: number;    // 法术穿透（固定值）

  // 吸血（百分比覆盖）
  lifesteal?: number;           // 物理吸血 (%)
  spellVamp?: number;           // 法术吸血 (%)

  // 伤害加成/减免
  damageBonus?: number;         // 总伤害加成 (%)
  damageReduction?: number;     // 总伤害减免 (%)

  // 治疗加成
  healReceived?: number;        // 被治疗效果 (%)
}

/** 伤害结果 */
export interface DamageResult {
  damage: number;
  isCritical: boolean;
  lifestealAmount?: number;
  element?: Element;
  isFixed?: boolean;
  isTrue?: boolean;
  isMiss?: boolean;
  elementalAdvantage?: boolean;
}

/** 完整属性 = 基础属性 + 战斗属性 */
export interface FullStats extends BaseStats, CombatStats {}

/** 元素抗性 - 五行抗性 */
export interface ElementResistances {
  metal: number;   // 金抗 (%)
  wood: number;    // 木抗 (%)
  water: number;   // 水抗 (%)
  fire: number;    // 火抗 (%)
  earth: number;   // 土抗 (%)
}

/** 位置坐标 */
export interface Position {
  x: number;
  y: number;
}

/** 物品掉落 */
export interface ItemDrop {
  itemId: string;
  count: number;
  rate?: number; // 掉落概率
}

/** 经验奖励 */
export interface ExpReward {
  exp: number;
  gold: number;
  petExp?: number;
}
