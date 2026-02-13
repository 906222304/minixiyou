// 宠物配置数据（MVP简化版）

import type { PetTemplate, PetAptitude } from '@/types';

/** 生成随机资质 */
function randomAptitude(prng: () => number): PetAptitude {
  return {
    attack: 0.8 + prng() * 0.7,
    defense: 0.8 + prng() * 0.7,
    magic: 0.8 + prng() * 0.7,
    speed: 0.8 + prng() * 0.7,
    hp: 0.8 + prng() * 0.7,
    mp: 0.8 + prng() * 0.7,
  };
}

/** 宠物模板列表 */
export const PET_TEMPLATES: Record<string, PetTemplate> = {
  // 攻击型宠物
  pet_wolf: {
    id: 'pet_wolf',
    name: '小狼',
    description: '一只凶猛的小狼，擅长物理攻击',
    icon: '🐺',
    type: 'attack',
    baseRarity: 'common',
    baseStats: {
      physicalAttack: 30,
      physicalDefense: 15,
      magicAttack: 5,
      magicDefense: 10,
      speed: 25,
      maxHp: 150,
      maxMp: 50,
      critRate: 0.08,
      critDamage: 0.5,
      hitRate: 0.95,
      dodgeRate: 0.05,
    },
    learnableSkills: ['skill_bite', 'skill_howl'],
    captureLocations: ['map_village_1', 'map_village_2'],
  },
  pet_tiger: {
    id: 'pet_tiger',
    name: '小虎',
    description: '一只强壮的小老虎，攻击力强',
    icon: '🐯',
    type: 'attack',
    baseRarity: 'rare',
    baseStats: {
      physicalAttack: 40,
      physicalDefense: 20,
      magicAttack: 5,
      magicDefense: 12,
      speed: 22,
      maxHp: 200,
      maxMp: 40,
      critRate: 0.1,
      critDamage: 0.6,
      hitRate: 0.95,
      dodgeRate: 0.04,
    },
    learnableSkills: ['skill_bite', 'skill_claw', 'skill_roar'],
    captureLocations: ['map_village_3', 'map_village_4'],
  },

  // 法术型宠物
  pet_fairy: {
    id: 'pet_fairy',
    name: '小精灵',
    description: '一只神秘的小精灵，擅长法术攻击',
    icon: '🧚',
    type: 'magic',
    baseRarity: 'rare',
    baseStats: {
      physicalAttack: 10,
      physicalDefense: 10,
      magicAttack: 35,
      magicDefense: 25,
      speed: 28,
      maxHp: 120,
      maxMp: 150,
      critRate: 0.06,
      critDamage: 0.4,
      hitRate: 0.95,
      dodgeRate: 0.06,
    },
    element: 'ice',
    learnableSkills: ['skill_magic_missile', 'skill_heal'],
    captureLocations: ['map_village_2', 'map_village_5'],
  },

  // 防御型宠物
  pet_turtle: {
    id: 'pet_turtle',
    name: '小龟',
    description: '一只坚硬的小龟，防御力极高',
    icon: '🐢',
    type: 'defense',
    baseRarity: 'common',
    baseStats: {
      physicalAttack: 15,
      physicalDefense: 40,
      magicAttack: 5,
      magicDefense: 30,
      speed: 10,
      maxHp: 300,
      maxMp: 30,
      critRate: 0.02,
      critDamage: 0.3,
      hitRate: 0.9,
      dodgeRate: 0.02,
    },
    learnableSkills: ['skill_shell', 'skill_provoke'],
    captureLocations: ['map_village_1', 'map_village_3'],
  },

  // 辅助型宠物
  pet_panda: {
    id: 'pet_panda',
    name: '小熊猫',
    description: '一只可爱的小熊猫，擅长治疗',
    icon: '🐼',
    type: 'support',
    baseRarity: 'rare',
    baseStats: {
      physicalAttack: 20,
      physicalDefense: 20,
      magicAttack: 25,
      magicDefense: 25,
      speed: 18,
      maxHp: 180,
      maxMp: 120,
      critRate: 0.04,
      critDamage: 0.35,
      hitRate: 0.92,
      dodgeRate: 0.03,
    },
    learnableSkills: ['skill_heal', 'skill_buff', 'skill_cleans'],
    captureLocations: ['map_village_4', 'map_village_6'],
  },
};

/** 获取宠物模板 */
export function getPetTemplate(id: string): PetTemplate | undefined {
  return PET_TEMPLATES[id];
}

/** 获取所有宠物模板 */
export function getAllPetTemplates(): PetTemplate[] {
  return Object.values(PET_TEMPLATES);
}

/** 获取地图可捕捉的宠物 */
export function getCapturablePets(mapId: string): PetTemplate[] {
  return Object.values(PET_TEMPLATES).filter(t =>
    t.captureLocations.includes(mapId)
  );
}

export { randomAptitude };
