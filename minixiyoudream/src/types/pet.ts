// 宠物类型定义

import type { UUID, Quality, CombatStats, Element } from './common';

/** 宠物类型 */
export type PetType = 'attack' | 'magic' | 'defense' | 'support' | 'control';

/** 宠物品质 - 参考梦幻西游 */
export type PetQuality = 'wild' | 'baby' | 'variant' | 'divine';

/** 品质配置 */
export interface PetQualityConfig {
  type: PetQuality;
  name: string;
  nameEn: string;
  baseStatMultiplier: number;      // 基础属性倍率
  aptitudeMin: number;             // 资质下限
  aptitudeMax: number;             // 资质上限
  initialSkillMin: number;         // 初始技能数量下限
  initialSkillMax: number;         // 初始技能数量上限
  hasAppearanceChange: boolean;    // 是否有外观变化
  captureWeight: number;           // 捕捉权重
}

/** 成长率 */
export interface GrowthRate {
  physical: number;   // 物理成长 0.8-1.5
  magic: number;      // 法术成长 0.8-1.5
  defense: number;    // 防御成长 0.8-1.5
  speed: number;      // 速度成长 0.8-1.5
  hp: number;         // 生命成长 0.8-1.5
  mp: number;         // 法力成长 0.8-1.5
}

/** 捕获道具 */
export interface CaptureItem {
  id: string;
  name: string;
  description: string;
  bonusRate: number;        // 额外捕获率加成
  minLevel: number;         // 最低使用等级
  maxLevel: number;         // 最高使用等级 (0表示无限制)
  rarity: Quality;          // 道具稀有度
}

/** 捕获配置 */
export interface CaptureConfig {
  baseCaptureRate: number;     // 基础捕获率 20-50%
  hpFactor: number;            // 血量因子，血量越低越容易
  statusFactor: number;        // 状态因子，异常状态增加捕获率
  qualityModifiers: Record<PetQuality, number>;  // 品质修正
}

/** 进化条件 */
export interface EvolutionRequirements {
  level: number;
  items: { id: string; count: number }[];
  aptitudeMin?: Partial<PetAptitude>;
  intimacyMin?: number;       // 最低亲密度
}

/** 进化结果 */
export interface EvolutionResult {
  targetId: string;
  statBonus: number;          // 属性加成百分比
  newSkills: string[];        // 新获得的技能
  appearanceChange: boolean;  // 外观是否变化
  qualityUpgrade?: PetQuality; // 品质提升
}

/** 进化配置 */
export interface EvolutionConfig {
  petId: string;
  requirements: EvolutionRequirements;
  result: EvolutionResult;
}

/** 炼妖材料 */
export interface AlchemyMaterial {
  id: string;
  name: string;
  description: string;
  targetAptitude: keyof PetAptitude;
  bonusRange: [number, number];
  successRate: number;
  failPenalty: number;
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
  reason?: string;
}

/** 合宠规则 */
export interface FusionRules {
  minLevel: number;
  sameTypeBonus: boolean;
  maxInheritedSkills: number;
  aptitudeInheritRate: number;
}

/** 合宠结果 */
export interface FusionResultData {
  basePet: 'random' | 'parent1' | 'parent2';
  inheritedSkills: PetSkill[];
  averagedAptitude: PetAptitude;
  possibleRarityUp: boolean;
}

/** 宠物资质 */
export interface PetAptitude {
  attack: number;   // 攻击资质 (0.8-1.5)
  defense: number;  // 防御资质
  magic: number;    // 法术资质
  speed: number;    // 速度资质
  hp: number;       // 生命资质
  mp: number;       // 法力资质
}

/** 宠物技能效果 */
export interface PetSkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control';
  statusEffect?: 'burn' | 'poison' | 'bleed' | 'stun' | 'silence' | 'regen' | 'haste';
  stat?: string;
  value?: number;
  duration?: number;
}

/** 宠物技能 */
export interface PetSkill {
  id: string;
  name: string;
  type: 'active' | 'passive' | 'trigger';
  description: string;
  mpCost?: number;
  cooldown?: number;
  multiplier?: number;
  element?: Element;
  effect?: PetSkillEffect;
  level?: number;            // 技能等级 (1-5)
  skillId?: string;          // 技能模板ID
  locked?: boolean;          // 技能是否被锁定（打书时不会被覆盖）
  exclusiveGroup?: string;   // 技能互斥组ID
}

/** 技能学习结果详情 */
export interface SkillLearnResult {
  success: boolean;
  type: 'learn' | 'upgrade' | 'override' | 'fail';
  skill?: PetSkill;
  overriddenSkill?: PetSkill;
  previousLevel?: number;
  newLevel?: number;
  message: string;
}

/** 宠物模板 */
export interface PetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 类型
  type: PetType;

  // 基础品质
  baseRarity: Quality;

  // 基础属性 - 使用 Partial 以允许省略扩展属性
  baseStats: Partial<CombatStats>;

  // 元素属性
  element?: Element;

  // 可学习技能
  learnableSkills: string[];

  // 进化信息
  evolution?: {
    targetId: string;
    level: number;
    requirements: string[];
  };

  // 可捕捉的地图
  captureLocations: string[];
}

/** 宠物实例 */
export interface Pet {
  // 基础信息
  id: UUID;
  baseId: string;
  name: string;
  nickname?: string;
  icon: string;

  // 类型
  type: PetType;
  rarity: Quality;
  element?: Element;

  // 品质 (野生/宝宝/变异/神兽)
  quality: PetQuality;

  // 成长率
  growthRate: GrowthRate;

  // 等级与经验
  level: number;
  exp: number;
  maxLevel: number;

  // 资质
  aptitude: PetAptitude;

  // 属性
  stats: CombatStats;

  // 技能
  skills: PetSkill[];
  maxSkills: number;
  unlockedSlots?: number[];  // 已解锁的额外技能格索引列表

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

  // 外观变体ID (用于变异/神兽的特殊外观)
  variantAppearance?: string;
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
  rarityUp: boolean;
  bonusSkillSlot: boolean;
}

/** 捕获结果 */
export interface CaptureResult {
  success: boolean;
  pet?: Pet;
  captureRate: number;
  roll: number;
  reason?: string;
}

/** 打书结果 */
export interface LearnSkillResult {
  success: boolean;
  newSkill?: PetSkill;
  overriddenSkill?: PetSkill;
  reason?: string;
}

/** 进化执行结果 */
export interface EvolutionActionResult {
  success: boolean;
  pet?: Pet;
  reason?: string;
}

/** 技能书 */
export interface SkillBook {
  id: string;
  skillId: string;
  name: string;
  description: string;
  rarity: Quality;
  tier: 'low' | 'medium' | 'high' | 'super';  // 技能书等级

  // 学习限制
  restrictions: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };

  // 覆盖概率加成
  overrideBonus?: number;

  // 升级成功率加成
  upgradeSuccessBonus?: number;
}

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
