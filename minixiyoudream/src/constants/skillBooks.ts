// 技能书配置数据

import type { SkillBook, PetSkill, PetType } from '@/types';
import type { Quality } from '@/types/common';

/** 宠物技能模板 */
export const PET_SKILL_TEMPLATES: Record<string, Omit<PetSkill, 'id'>> = {
  // 攻击型技能
  skill_bite: {
    name: '撕咬',
    type: 'active',
    description: '对敌人造成物理伤害',
    mpCost: 10,
    multiplier: 1.2,
    element: 'physical',
  },
  skill_claw: {
    name: '利爪',
    type: 'active',
    description: '用锋利的爪子攻击，有几率造成流血',
    mpCost: 15,
    multiplier: 1.4,
    element: 'physical',
  },
  skill_howl: {
    name: '嚎叫',
    type: 'trigger',
    description: '战斗开始时提升自身攻击力',
    multiplier: 1.1,
  },
  skill_roar: {
    name: '震慑咆哮',
    type: 'active',
    description: '发出震慑性咆哮，降低敌人防御',
    mpCost: 20,
    multiplier: 0.8,
  },
  skill_fury: {
    name: '狂暴',
    type: 'trigger',
    description: '生命值低于30%时提升攻击力50%',
    multiplier: 1.5,
  },
  skill_combo: {
    name: '连击',
    type: 'active',
    description: '连续攻击敌人2次',
    mpCost: 25,
    multiplier: 0.7,
    element: 'physical',
  },

  // 法术型技能
  skill_magic_missile: {
    name: '魔法飞弹',
    type: 'active',
    description: '发射魔法飞弹攻击敌人',
    mpCost: 15,
    multiplier: 1.3,
    element: 'ice',
  },
  skill_fireball: {
    name: '火球术',
    type: 'active',
    description: '发射火球攻击敌人',
    mpCost: 20,
    multiplier: 1.5,
    element: 'fire',
  },
  skill_thunder: {
    name: '落雷',
    type: 'active',
    description: '召唤雷电攻击敌人',
    mpCost: 25,
    multiplier: 1.6,
    element: 'thunder',
  },
  skill_ice_arrow: {
    name: '冰箭',
    type: 'active',
    description: '发射冰箭，有几率冻结敌人',
    mpCost: 18,
    multiplier: 1.2,
    element: 'ice',
  },

  // 防御型技能
  skill_shell: {
    name: '护盾',
    type: 'active',
    description: '提升自身防御力',
    mpCost: 15,
    multiplier: 1.5,
  },
  skill_provoke: {
    name: '挑衅',
    type: 'active',
    description: '嘲讽敌人，吸引攻击',
    mpCost: 10,
  },
  skill_iron_skin: {
    name: '铁壁',
    type: 'passive',
    description: '永久提升防御力20%',
    multiplier: 1.2,
  },
  skill_counter: {
    name: '反击',
    type: 'trigger',
    description: '被攻击时有30%几率反击',
    multiplier: 0.8,
  },

  // 辅助型技能
  skill_heal: {
    name: '治愈',
    type: 'active',
    description: '恢复主人一定生命值',
    mpCost: 20,
    multiplier: 0.3,
  },
  skill_buff: {
    name: '强化',
    type: 'active',
    description: '提升主人攻击力',
    mpCost: 15,
    multiplier: 1.2,
  },
  // 修复: skill_cleans -> skill_cleanse 拼写错误
  skill_cleanse: {
    name: '净化',
    type: 'active',
    description: '清除主人的负面状态',
    mpCost: 25,
  },
  skill_resurrect: {
    name: '复活',
    type: 'trigger',
    description: '主人死亡时有20%几率复活主人',
    multiplier: 0.3,
  },

  // 控制型技能
  skill_stun: {
    name: '眩晕',
    type: 'active',
    description: '使敌人眩晕1回合',
    mpCost: 25,
  },
  skill_slow: {
    name: '减速',
    type: 'active',
    description: '降低敌人速度',
    mpCost: 15,
    multiplier: 0.7,
  },
  skill_sleep: {
    name: '催眠',
    type: 'active',
    description: '使敌人睡眠2回合',
    mpCost: 30,
  },
};

/** 技能书列表 */
export const SKILL_BOOKS: Record<string, SkillBook> = {
  // 普通技能书
  book_bite: {
    id: 'book_bite',
    skillId: 'skill_bite',
    name: '撕咬技能书',
    description: '学习撕咬技能，对敌人造成物理伤害',
    rarity: 'common',
    restrictions: {
      petType: ['attack'],
    },
    overrideBonus: 0,
  },
  book_shell: {
    id: 'book_shell',
    skillId: 'skill_shell',
    name: '护盾技能书',
    description: '学习护盾技能，提升自身防御力',
    rarity: 'common',
    restrictions: {
      petType: ['defense'],
    },
    overrideBonus: 0,
  },
  book_heal: {
    id: 'book_heal',
    skillId: 'skill_heal',
    name: '治愈技能书',
    description: '学习治愈技能，恢复主人生命值',
    rarity: 'common',
    restrictions: {
      petType: ['support'],
    },
    overrideBonus: 0,
  },

  // 稀有技能书
  book_claw: {
    id: 'book_claw',
    skillId: 'skill_claw',
    name: '利爪技能书',
    description: '学习利爪技能，有几率造成流血',
    rarity: 'rare',
    restrictions: {
      petType: ['attack'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_magic_missile: {
    id: 'book_magic_missile',
    skillId: 'skill_magic_missile',
    name: '魔法飞弹技能书',
    description: '学习魔法飞弹，发射魔法攻击敌人',
    rarity: 'rare',
    restrictions: {
      petType: ['magic'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_provoke: {
    id: 'book_provoke',
    skillId: 'skill_provoke',
    name: '挑衅技能书',
    description: '学习挑衅技能，嘲讽敌人',
    rarity: 'rare',
    restrictions: {
      petType: ['defense'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },
  book_stun: {
    id: 'book_stun',
    skillId: 'skill_stun',
    name: '眩晕技能书',
    description: '学习眩晕技能，使敌人眩晕1回合',
    rarity: 'rare',
    restrictions: {
      petType: ['control'],
      minLevel: 10,
    },
    overrideBonus: 5,
  },

  // 史诗技能书
  book_howl: {
    id: 'book_howl',
    skillId: 'skill_howl',
    name: '嚎叫技能书',
    description: '学习嚎叫，战斗开始时提升攻击力',
    rarity: 'epic',
    restrictions: {
      petType: ['attack'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_fireball: {
    id: 'book_fireball',
    skillId: 'skill_fireball',
    name: '火球术技能书',
    description: '学习火球术，发射火球攻击敌人',
    rarity: 'epic',
    restrictions: {
      petType: ['magic'],
      minLevel: 20,
      element: ['fire'],
    },
    overrideBonus: 10,
  },
  book_iron_skin: {
    id: 'book_iron_skin',
    skillId: 'skill_iron_skin',
    name: '铁壁技能书',
    description: '学习铁壁，永久提升防御力',
    rarity: 'epic',
    restrictions: {
      petType: ['defense'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },
  book_buff: {
    id: 'book_buff',
    skillId: 'skill_buff',
    name: '强化技能书',
    description: '学习强化，提升主人攻击力',
    rarity: 'epic',
    restrictions: {
      petType: ['support'],
      minLevel: 20,
    },
    overrideBonus: 10,
  },

  // 传说技能书
  book_fury: {
    id: 'book_fury',
    skillId: 'skill_fury',
    name: '狂暴技能书',
    description: '学习狂暴，生命值低时大幅提升攻击',
    rarity: 'legendary',
    restrictions: {
      petType: ['attack'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },
  book_thunder: {
    id: 'book_thunder',
    skillId: 'skill_thunder',
    name: '落雷技能书',
    description: '学习落雷，召唤雷电攻击敌人',
    rarity: 'legendary',
    restrictions: {
      petType: ['magic'],
      minLevel: 30,
      element: ['thunder'],
    },
    overrideBonus: 15,
  },
  book_counter: {
    id: 'book_counter',
    skillId: 'skill_counter',
    name: '反击技能书',
    description: '学习反击，被攻击时有几率反击',
    rarity: 'legendary',
    restrictions: {
      petType: ['defense'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },
  book_resurrect: {
    id: 'book_resurrect',
    skillId: 'skill_resurrect',
    name: '复活技能书',
    description: '学习复活，主人死亡时有几率复活',
    rarity: 'legendary',
    restrictions: {
      petType: ['support'],
      minLevel: 30,
    },
    overrideBonus: 15,
  },

  // 神话技能书（通用，无类型限制）
  book_combo: {
    id: 'book_combo',
    skillId: 'skill_combo',
    name: '连击技能书',
    description: '学习连击，连续攻击敌人2次',
    rarity: 'mythic',
    restrictions: {
      minLevel: 40,
    },
    overrideBonus: 25,
  },
  book_ice_arrow: {
    id: 'book_ice_arrow',
    skillId: 'skill_ice_arrow',
    name: '冰箭技能书',
    description: '学习冰箭，有几率冻结敌人',
    rarity: 'mythic',
    restrictions: {
      minLevel: 40,
      element: ['ice'],
    },
    overrideBonus: 25,
  },
};

/** 获取技能书 */
export function getSkillBook(id: string): SkillBook | undefined {
  return SKILL_BOOKS[id];
}

/** 获取技能模板 */
export function getPetSkillTemplate(skillId: string): Omit<PetSkill, 'id'> | undefined {
  return PET_SKILL_TEMPLATES[skillId];
}

/** 创建技能实例 */
export function createPetSkill(skillId: string): PetSkill | undefined {
  const template = PET_SKILL_TEMPLATES[skillId];
  if (!template) return undefined;

  return {
    id: `pet_skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...template,
  };
}

/** 根据品质获取可用的技能书 */
export function getSkillBooksByQuality(quality: Quality): SkillBook[] {
  return Object.values(SKILL_BOOKS).filter(book => book.rarity === quality);
}

/** 根据宠物类型获取可学习的技能书 */
export function getSkillBooksForPetType(petType: PetType): SkillBook[] {
  return Object.values(SKILL_BOOKS).filter(book => {
    if (!book.restrictions.petType) return true;
    return book.restrictions.petType.includes(petType);
  });
}

/** 学习保护道具配置 */
export const SKILL_PROTECTION_ITEM = {
  id: 'item_skill_protection',
  name: '技能保护符',
  description: '使用技能书时保证100%成功，不会覆盖失败',
  icon: '🔮',
};

/** 学习成功率配置 */
export const SKILL_LEARNING_CONFIG = {
  // 技能槽未满时的成功率
  emptySlotSuccessRate: 100,
  // 技能槽已满时的基础成功率
  fullSlotBaseSuccessRate: 70,
  // 保护道具使用后的成功率
  protectionSuccessRate: 100,
};
