// 宠物类型定义 - 基于梦幻西游召唤兽系统重新设计

import type { UUID, Quality, CombatStats, Element } from './common';
import type { SkillType } from './skill';

// ==================== 召唤兽基础类型 ====================

/** 召唤兽类型定位 */
export type PetType = 'attack' | 'magic' | 'defense' | 'support' | 'control' | 'balance';

/** 召唤兽品质 - 参考梦幻西游 */
export type PetQuality = 'wild' | 'baby' | 'variant' | 'divine';

/** 召唤兽稀有度 */
export type PetRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/** 召唤兽五行 */
export type PetElement = 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'physical' | 'none';

// ==================== 资质系统 ====================

/** 召唤兽资质 - 参考梦幻西游 */
export interface PetAptitude {
  attack: number;    // 攻击资质 (480-3000)
  defense: number;   // 防御资质 (480-3000)
  hp: number;        // 体力资质 (960-6000)
  mp: number;        // 法力资质 (960-3600)
  speed: number;     // 速度资质 (640-1800)
  dodge: number;     // 躲闪资质 (480-1800)
  magic?: number;    // 法术资质（兼容旧系统，等同于dodge的别名）
}

/** 资质范围 */
export interface AptitudeRange {
  min: number;
  max: number;
}

/** 召唤兽资质配置 */
export interface PetAptitudeConfig {
  attack: AptitudeRange;
  defense: AptitudeRange;
  hp: AptitudeRange;
  mp: AptitudeRange;
  speed: AptitudeRange;
  dodge: AptitudeRange;
  magic?: AptitudeRange;  // 法术资质（兼容旧系统）
}

// ==================== 成长率系统 ====================

/** 成长率 - 参考梦幻西游单一成长率设计 */
export type GrowthRateValue = number; // 0.882 - 1.295

/** 成长率类型别名 - 兼容旧系统 */
export type GrowthRate = GrowthRateValue;

/** 进化行动结果 - 兼容旧系统 */
export interface EvolutionActionResult {
  success: boolean;
  pet?: Pet;
  reason?: string;
  message: string;
}

/** 品质配置 */
export interface PetQualityConfig {
  type: PetQuality;
  name: string;
  nameEn: string;
  baseStatMultiplier: number;      // 基础属性倍率
  aptitudeBonus: number;           // 资质加成百分比
  growthBonus: number;             // 成长率加成
  initialSkillMin: number;         // 初始技能数量下限
  initialSkillMax: number;         // 初始技能数量上限
  hasAppearanceChange: boolean;    // 是否有外观变化
  captureWeight: number;           // 捕捉权重
}

// ==================== 技能系统 ====================

/** 技能等级 */
export type SkillTier = 'basic' | 'weakness' | 'advanced' | 'special' | 'super';

/** 技能书等级 - 用于技能书配置 */
export type SkillBookTier = 'low' | 'medium' | 'high' | 'super';

// SkillType 现在从 ./skill 导入，避免重复定义

/** 技能分类 */
export type SkillCategory = '物理' | '法术' | '防御' | '速度' | '辅助' | '特殊' | '吸收' | '弱点';

/** 技能效果类型 */
export interface PetSkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control' | 'absorb' | 'special';
  statusEffect?: 'burn' | 'poison' | 'bleed' | 'stun' | 'silence' | 'freeze' | 'sleep' | 'charm' | 'fear';
  element?: Element;
  stat?: string;
  baseValue?: number;
  multiplier?: number;
  duration?: number;
  chance?: number;
}

/** 宠物技能模板 */
export interface PetSkillTemplate {
  id: string;
  name: string;
  tier: SkillTier;
  type: SkillType;
  category: SkillCategory;
  effect: string;              // 效果描述
  effectData?: PetSkillEffect; // 详细效果数据
  element?: Element;           // 元素属性（法术技能）
  mpCost?: number;             // 法力消耗
  cooldown?: number;           // 冷却回合
  exclusiveGroup?: string;     // 互斥组（如四大法术）
}

/** 宠物技能实例 */
export interface PetSkill {
  id: string;
  templateId: string;
  name: string;
  tier: SkillTier;
  type: SkillType;
  level: number;              // 技能等级 1-5
  locked: boolean;            // 是否锁定（打书不会被覆盖）
  // 可选属性（用于兽诀等场景）
  description?: string;       // 技能描述
  multiplier?: number;        // 效果倍率
  skillId?: string;           // 技能ID（兼容旧代码）
  mpCost?: number;            // 法力消耗
  cooldown?: number;          // 冷却回合
  element?: Element;          // 元素属性
}

/** 技能学习结果 */
export interface SkillLearnResult {
  success: boolean;
  type: 'learn' | 'upgrade' | 'override' | 'fail';
  skill?: PetSkill;
  newSkill?: PetSkill;          // 新学习的技能（别名）
  overriddenSkill?: PetSkill;
  previousLevel?: number;
  newLevel?: number;
  message: string;
  reason?: string;              // 失败原因
}

/** 技能书 */
export interface SkillBook {
  id: string;
  skillId: string;
  name: string;
  description: string;
  tier: SkillTier | SkillBookTier;  // 支持两种等级类型
  rarity: Quality;
  restrictions: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };
  overrideBonus?: number;  // 覆盖成功率加成
}

// ==================== 召唤兽模板 ====================

/** 召唤兽模板 */
export interface PetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 基础信息
  type: PetType;
  element: PetElement;
  rarity: PetRarity;
  carryLevel: number;           // 携带等级

  // 成长率（5档）
  growthRates: [number, number, number, number, number];

  // 资质范围
  aptitudes: PetAptitudeConfig;

  // 可携带技能
  skills: string[];

  // 捕捉地点
  captureLocations: string[];
}

/** 旧版宠物模板 - 用于向后兼容旧数据文件 */
export interface LegacyPetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 基础信息
  type: PetType;
  element: PetElement;
  baseRarity?: PetRarity;       // 旧系统使用 baseRarity

  // 旧系统属性
  baseStats?: Partial<CombatStats>;
  learnableSkills?: string[];

  // 进化配置
  evolution?: {
    targetId: string;
    level: number;
    requirements: string[];
  };

  // 捕捉地点
  captureLocations: string[];
}

// ==================== 召唤兽实例 ====================

/** 召唤兽实例 */
export interface Pet {
  // 基础信息
  id: UUID;
  templateId: string;
  baseId?: string;           // 兼容旧系统
  name: string;
  nickname?: string;
  icon: string;

  // 类型信息
  type: PetType;
  element: PetElement;
  rarity: PetRarity;
  quality: PetQuality;

  // 等级
  level: number;
  exp: number;
  maxLevel: number;

  // 成长率（从模板5档中随机一档）
  growthRate: GrowthRateValue;

  // 资质（在资质范围内随机）
  aptitude: PetAptitude;

  // 战斗属性
  stats: CombatStats;

  // 技能
  skills: PetSkill[];
  maxSkills: number;
  unlockedSlots?: number[];    // 已解锁的技能槽位数组

  // 亲密度
  intimacy: number;        // 0-100
  intimacyLevel: number;   // 1-5

  // 忠诚度
  loyalty: number;         // 0-100

  // 状态
  isActive: boolean;
  ownerType: 'player' | 'companion';
  ownerId: string;

  // 战斗状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  // 外观变体
  variantAppearance?: string;
}

// ==================== 战斗相关 ====================

/** 捕获道具 */
export interface CaptureItem {
  id: string;
  name: string;
  description: string;
  bonusRate: number;
  minLevel: number;
  maxLevel: number;
  rarity: Quality;
}

/** 捕获配置 */
export interface CaptureConfig {
  baseCaptureRate: number;
  hpFactor: number;
  statusFactor: number;
  qualityModifiers: Record<PetQuality, number>;
}

/** 捕获结果 */
export interface CaptureResult {
  success: boolean;
  pet?: Pet;
  captureRate: number;
  roll: number;
  reason?: string;
}

// ==================== 合宠/炼妖 ====================

/** 合宠规则 */
export interface FusionRules {
  minLevel: number;
  sameTypeBonus: boolean;
  maxInheritedSkills: number;
  aptitudeInheritRate: number;
}

/** 合宠结果 */
export interface FusionResult {
  pet: Pet;
  absorbedSkills: string[];
  aptitudeChanges: {
    stat: keyof PetAptitude;
    oldValue: number;
    newValue: number;
  }[];
  bonusSkillSlot: boolean;
  rarityUp?: boolean;        // 品质是否提升
  messages: string[];
}

/** 炼妖材料（资质培养道具） */
export interface AlchemyMaterial {
  id: string;
  name: string;
  description: string;
  targetAptitude: keyof PetAptitude;
  bonusRange: [number, number];  // 资质增加范围
  successRate: number;            // 成功率
  failPenalty: number;            // 失败时资质减少
  rarity: Quality;
}

/** 炼妖结果 */
export interface AlchemyResult {
  success: boolean;
  aptitudeChange?: {
    stat: keyof PetAptitude;
    oldValue: number;
    newValue: number;
  };
  criticalHit: boolean;  // 是否暴击（双倍效果）
  message: string;
}

/** 资质上限配置 */
export interface AptitudeLimits {
  attack: { min: number; max: number };
  defense: { min: number; max: number };
  hp: { min: number; max: number };
  mp: { min: number; max: number };
  speed: { min: number; max: number };
  dodge: { min: number; max: number };
}

// ==================== 存储系统 ====================

/** 宠物存储 */
export interface PetStorage {
  playerPets: Pet[];
  companionPets: Map<string, Pet[]>;

  activePets: {
    player: Pet | null;
    companion1: Pet | null;
    companion2: Pet | null;
  };

  maxPetsPerCharacter: number;
}

// ==================== 类型守卫和工具函数 ====================

/** 资质键名 */
export const APTITUDE_KEYS: (keyof PetAptitude)[] = ['attack', 'defense', 'hp', 'mp', 'speed', 'dodge'];

/** 资质名称映射 */
export const APTITUDE_NAMES: Record<keyof PetAptitude, string> = {
  attack: '攻击资质',
  defense: '防御资质',
  hp: '体力资质',
  mp: '法力资质',
  speed: '速度资质',
  dodge: '躲闪资质',
  magic: '法术资质',
};

/** 技能等级名称 */
export const SKILL_TIER_NAMES: Record<SkillTier, string> = {
  basic: '初级技能',
  weakness: '弱点技能',
  advanced: '高级技能',
  special: '特殊技能',
  super: '超级技能',
};

/** 品质名称 */
export const QUALITY_NAMES: Record<PetQuality, string> = {
  wild: '野生',
  baby: '宝宝',
  variant: '变异',
  divine: '神兽',
};
