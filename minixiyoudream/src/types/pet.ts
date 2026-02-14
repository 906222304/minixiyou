// 宠物类型定义

import type { UUID, Quality, CombatStats, Element } from './common';

/** 宠物类型 */
export type PetType = 'attack' | 'magic' | 'defense' | 'support' | 'control';

/** 宠物资质 */
export interface PetAptitude {
  attack: number;   // 攻击资质 (0.8-1.5)
  defense: number;  // 防御资质
  magic: number;    // 法术资质
  speed: number;    // 速度资质
  hp: number;       // 生命资质
  mp: number;       // 法力资质
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

  // 基础属性
  baseStats: CombatStats;

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

/** 打书结果 */
export interface LearnSkillResult {
  success: boolean;
  newSkill?: PetSkill;
  overriddenSkill?: PetSkill;
  reason?: string;
}

/** 炼妖材料 */
export interface AlchemyMaterial {
  id: string;
  name: string;
  targetAptitude: keyof PetAptitude;
  bonusRange: [number, number];
  successRate: number;
  failPenalty: number;
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

/** 技能书 */
export interface SkillBook {
  id: string;
  skillId: string;
  name: string;
  description: string;
  rarity: Quality;

  // 学习限制
  restrictions: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };

  // 覆盖概率加成
  overrideBonus?: number;
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
