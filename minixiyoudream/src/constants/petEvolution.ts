// 宠物进化和炼妖系统配置 - 参考梦幻西游

import type {
  EvolutionConfig,
  AlchemyMaterial,
  FusionRules,
  PetQuality,
  PetAptitude,
} from '@/types';

/** 进化链配置 */
export const EVOLUTION_CHAINS: EvolutionConfig[] = [
  // 蛟龙 -> 青龙
  {
    petId: 'pet_dragon',
    requirements: {
      level: 80,
      items: [
        { id: 'dragon_scale', count: 10 },
        { id: 'dragon_pearl', count: 5 },
      ],
      aptitudeMin: {
        magic: 1.3,
        hp: 1.2,
      },
      intimacyMin: 80,
    },
    result: {
      targetId: 'pet_azure_dragon',
      statBonus: 0.2,
      newSkills: ['pet_thunder_storm', 'pet_immortal'],
      appearanceChange: true,
      qualityUpgrade: 'variant',
    },
  },
  // 凤凰 -> 涅槃凤皇
  {
    petId: 'pet_phoenix',
    requirements: {
      level: 80,
      items: [
        { id: 'phoenix_feather', count: 10 },
        { id: 'phoenix_heart', count: 3 },
      ],
      aptitudeMin: {
        magic: 1.35,
        mp: 1.2,
      },
      intimacyMin: 90,
    },
    result: {
      targetId: 'pet_divine_phoenix',
      statBonus: 0.25,
      newSkills: ['pet_eternal_flame', 'pet_mass_resurrect'],
      appearanceChange: true,
      qualityUpgrade: 'divine',
    },
  },
  // 老虎 -> 白虎 (特殊进化)
  {
    petId: 'pet_tiger',
    requirements: {
      level: 75,
      items: [
        { id: 'beast_essence', count: 20 },
        { id: 'celestial_stone', count: 5 },
      ],
      aptitudeMin: {
        attack: 1.2,
        speed: 1.1,
      },
      intimacyMin: 95,
    },
    result: {
      targetId: 'pet_white_tiger',
      statBonus: 0.3,
      newSkills: ['pet_tiger_fury', 'pet_golden_claw'],
      appearanceChange: true,
      qualityUpgrade: 'divine',
    },
  },
  // 黑熊 -> 玄武 (特殊进化)
  {
    petId: 'pet_black_bear',
    requirements: {
      level: 75,
      items: [
        { id: 'tortoise_shell', count: 15 },
        { id: 'celestial_stone', count: 5 },
      ],
      aptitudeMin: {
        defense: 1.3,
        hp: 1.25,
      },
      intimacyMin: 95,
    },
    result: {
      targetId: 'pet_black_tortoise',
      statBonus: 0.3,
      newSkills: ['pet_iron_wall', 'pet_immortal'],
      appearanceChange: true,
      qualityUpgrade: 'divine',
    },
  },
  // 花妖 -> 朱雀 (特殊进化)
  {
    petId: 'pet_flower_fairy',
    requirements: {
      level: 75,
      items: [
        { id: 'fire_crystal', count: 20 },
        { id: 'celestial_stone', count: 5 },
      ],
      aptitudeMin: {
        magic: 1.3,
        mp: 1.2,
      },
      intimacyMin: 95,
    },
    result: {
      targetId: 'pet_vermilion_bird',
      statBonus: 0.3,
      newSkills: ['pet_nirvana_fire', 'pet_eternal_flame'],
      appearanceChange: true,
      qualityUpgrade: 'divine',
    },
  },
];

/** 进化配置映射 */
export const EVOLUTION_CONFIG_MAP: Record<string, EvolutionConfig> = Object.fromEntries(
  EVOLUTION_CHAINS.map(config => [config.petId, config])
);

/** 炼妖材料列表 */
export const ALCHEMY_MATERIALS: AlchemyMaterial[] = [
  {
    id: 'alchemy_attack_herb',
    name: '力量草',
    description: '提升攻击资质的灵草',
    targetAptitude: 'attack',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_attack_fruit',
    name: '力量果',
    description: '大幅提升攻击资质的灵果',
    targetAptitude: 'attack',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_defense_herb',
    name: '铁皮草',
    description: '提升防御资质的灵草',
    targetAptitude: 'defense',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_defense_fruit',
    name: '铁甲果',
    description: '大幅提升防御资质的灵果',
    targetAptitude: 'defense',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_magic_herb',
    name: '灵力草',
    description: '提升法术资质的灵草',
    targetAptitude: 'magic',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_magic_fruit',
    name: '灵智果',
    description: '大幅提升法术资质的灵果',
    targetAptitude: 'magic',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_speed_herb',
    name: '疾风草',
    description: '提升速度资质的灵草',
    targetAptitude: 'speed',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_speed_fruit',
    name: '疾风果',
    description: '大幅提升速度资质的灵果',
    targetAptitude: 'speed',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_hp_herb',
    name: '生命草',
    description: '提升生命资质的灵草',
    targetAptitude: 'hp',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_hp_fruit',
    name: '生命果',
    description: '大幅提升生命资质的灵果',
    targetAptitude: 'hp',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_mp_herb',
    name: '法力草',
    description: '提升法力资质的灵草',
    targetAptitude: 'mp',
    bonusRange: [0.01, 0.05],
    successRate: 0.7,
    failPenalty: 0.02,
    rarity: 'common',
  },
  {
    id: 'alchemy_mp_fruit',
    name: '法力果',
    description: '大幅提升法力资质的灵果',
    targetAptitude: 'mp',
    bonusRange: [0.03, 0.1],
    successRate: 0.5,
    failPenalty: 0.05,
    rarity: 'rare',
  },
  {
    id: 'alchemy_all_essence',
    name: '万物精华',
    description: '随机提升一项资质的稀有材料',
    targetAptitude: 'attack', // 实际使用时随机
    bonusRange: [0.05, 0.15],
    successRate: 0.4,
    failPenalty: 0.03,
    rarity: 'epic',
  },
  {
    id: 'alchemy_celestial_dew',
    name: '天露',
    description: '大幅提升所有资质的神圣材料',
    targetAptitude: 'attack', // 实际使用时提升所有
    bonusRange: [0.02, 0.08],
    successRate: 0.3,
    failPenalty: 0.01,
    rarity: 'legendary',
  },
];

/** 炼妖材料映射 */
export const ALCHEMY_MATERIALS_MAP: Record<string, AlchemyMaterial> = Object.fromEntries(
  ALCHEMY_MATERIALS.map(material => [material.id, material])
);

/** 资质上限 */
export const APTITUDE_CAPS: Record<PetQuality, number> = {
  wild: 1.2,
  baby: 1.4,
  variant: 1.5,
  divine: 1.6,
};

/** 合宠规则 */
export const FUSION_RULES: FusionRules = {
  minLevel: 30,                // 最低等级30级才能合宠
  sameTypeBonus: true,         // 同类型宠物有加成
  maxInheritedSkills: 4,       // 最多继承4个技能
  aptitudeInheritRate: 0.7,    // 资质继承率70%
};

/** 合宠品质提升概率 */
export const FUSION_QUALITY_UP_CHANCE: Record<PetQuality, Record<PetQuality, number>> = {
  wild: {
    wild: 0.1,     // 野生 + 野生 = 10%变宝宝
    baby: 0.2,     // 野生 + 宝宝 = 20%变宝宝
    variant: 0.3,  // 野生 + 变异 = 30%变宝宝
    divine: 0.4,   // 野生 + 神兽 = 40%变宝宝
  },
  baby: {
    wild: 0.2,
    baby: 0.15,    // 宝宝 + 宝宝 = 15%变变异
    variant: 0.25,
    divine: 0.35,
  },
  variant: {
    wild: 0.3,
    baby: 0.25,
    variant: 0.1,  // 变异 + 变异 = 10%变神兽
    divine: 0.2,
  },
  divine: {
    wild: 0.4,
    baby: 0.35,
    variant: 0.2,
    divine: 0.05,  // 神兽 + 神兽 = 5%提升 (已满级)
  },
};

/** 同类型合宠加成 */
export const SAME_TYPE_FUSION_BONUS = {
  aptitudeBonus: 0.1,      // 资质加成10%
  skillInheritBonus: 1,    // 多继承1个技能
};

/**
 * 获取宠物的进化配置
 */
export function getEvolutionConfig(petId: string): EvolutionConfig | undefined {
  return EVOLUTION_CONFIG_MAP[petId];
}

/**
 * 检查是否可以进化
 */
export function canEvolve(
  petId: string,
  level: number,
  aptitude: PetAptitude,
  intimacy: number
): { canEvolve: boolean; reason?: string } {
  const config = getEvolutionConfig(petId);
  if (!config) {
    return { canEvolve: false, reason: '该宠物无法进化' };
  }

  if (level < config.requirements.level) {
    return { canEvolve: false, reason: `等级不足，需要${config.requirements.level}级` };
  }

  if (config.requirements.aptitudeMin) {
    for (const [stat, minValue] of Object.entries(config.requirements.aptitudeMin)) {
      const key = stat as keyof PetAptitude;
      if (aptitude[key] < (minValue as number)) {
        return {
          canEvolve: false,
          reason: `${getAptitudeName(key)}资质不足，需要${minValue}`,
        };
      }
    }
  }

  if (config.requirements.intimacyMin && intimacy < config.requirements.intimacyMin) {
    return {
      canEvolve: false,
      reason: `亲密度不足，需要${config.requirements.intimacyMin}`,
    };
  }

  return { canEvolve: true };
}

/**
 * 获取炼妖材料
 */
export function getAlchemyMaterial(materialId: string): AlchemyMaterial | undefined {
  return ALCHEMY_MATERIALS_MAP[materialId];
}

/**
 * 获取指定资质类型的炼妖材料
 */
export function getAlchemyMaterialsByAptitude(aptitude: keyof PetAptitude): AlchemyMaterial[] {
  return ALCHEMY_MATERIALS.filter(m => m.targetAptitude === aptitude);
}

/**
 * 获取资质名称
 */
function getAptitudeName(aptitude: keyof PetAptitude): string {
  const names: Record<keyof PetAptitude, string> = {
    attack: '攻击',
    defense: '防御',
    magic: '法术',
    speed: '速度',
    hp: '生命',
    mp: '法力',
  };
  return names[aptitude] || aptitude;
}

/**
 * 计算合宠后的品质
 */
export function calculateFusionQuality(
  quality1: PetQuality,
  quality2: PetQuality,
  prng: () => number = Math.random
): PetQuality {
  const qualityOrder: PetQuality[] = ['wild', 'baby', 'variant', 'divine'];
  const upChance = FUSION_QUALITY_UP_CHANCE[quality1][quality2];

  // 基础品质取较高者
  const idx1 = qualityOrder.indexOf(quality1);
  const idx2 = qualityOrder.indexOf(quality2);
  const baseQuality = qualityOrder[Math.max(idx1, idx2)];

  // 判断是否提升品质
  if (prng() < upChance) {
    const currentIdx = qualityOrder.indexOf(baseQuality);
    if (currentIdx < qualityOrder.length - 1) {
      return qualityOrder[currentIdx + 1];
    }
  }

  return baseQuality;
}

/**
 * 计算合宠后的资质
 */
export function calculateFusionAptitude(
  aptitude1: PetAptitude,
  aptitude2: PetAptitude,
  sameType: boolean
): PetAptitude {
  const rate = sameType
    ? FUSION_RULES.aptitudeInheritRate + SAME_TYPE_FUSION_BONUS.aptitudeBonus
    : FUSION_RULES.aptitudeInheritRate;

  const calculate = (v1: number, v2: number): number => {
    // 取平均值并加成
    const avg = (v1 + v2) / 2;
    return Math.round(avg * rate * 100) / 100;
  };

  return {
    attack: calculate(aptitude1.attack, aptitude2.attack),
    defense: calculate(aptitude1.defense, aptitude2.defense),
    magic: calculate(aptitude1.magic, aptitude2.magic),
    speed: calculate(aptitude1.speed, aptitude2.speed),
    hp: calculate(aptitude1.hp, aptitude2.hp),
    mp: calculate(aptitude1.mp, aptitude2.mp),
  };
}

/**
 * 获取资质上限
 */
export function getAptitudeCap(quality: PetQuality): number {
  return APTITUDE_CAPS[quality];
}
