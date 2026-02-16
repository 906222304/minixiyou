// 伙伴配置数据（MVP 3个伙伴）

import type { CompanionTemplate, Bond } from '@/types';

/** 伙伴模板列表 */
export const COMPANION_TEMPLATES: Record<string, CompanionTemplate> = {
  // 孙悟空 - 大唐官府
  companion_sun_wukong: {
    id: 'companion_sun_wukong',
    name: '孙悟空',
    title: '齐天大圣',
    description: '曾经大闹天宫的齐天大圣，如今保护唐僧西天取经。',
    avatar: '🐵',
    factionId: 'faction_datang',
    race: 'demon',
    rarity: 'legendary',
    baseStats: {
      strength: 25,
      intelligence: 10,
      vitality: 18,
      agility: 22,
      willpower: 8,
      physicalAttack: 50,
      physicalDefense: 30,
      magicAttack: 20,
      magicDefense: 20,
      maxHp: 300,
      maxMp: 150,
      speed: 45,
      critRate: 0.1,
      critDamage: 0.5,
      hitRate: 0.95,
      dodgeRate: 0.08,
      antiCritRate: 0,
      penetration: 0,
      lifeSteal: 0,
      reflect: 0,
      healBonus: 0,
      cooldownReduction: 0,
    },
    growthRate: {
      strength: 3.5,
      intelligence: 1.5,
      vitality: 2.5,
      agility: 3.0,
      willpower: 1.0,
    },
    initialSkills: ['skill_hengsao', 'skill_pojian'],
    unlockCondition: {
      type: 'story',
      targetId: 'story_chapter_1',
      description: '完成第一章主线剧情',
    },
    bonds: ['bond_journey_west', 'bond_master_disciple'],
    dialogues: {
      greeting: ['师父，俺老孙来也！', '有什么需要帮忙的？'],
      battle: ['吃俺老孙一棒！', '妖怪，哪里跑！'],
      victory: ['小菜一碟！', '这种妖怪，俺老孙一根手指就能搞定！'],
      defeat: ['可恶，俺老孙轻敌了...', '师父莫怕，俺老孙还会回来的！'],
      idle: ['师父，我们什么时候出发？', '俺老孙的金箍棒好久没动了...'],
    },
  },

  // 小龙女 - 龙宫
  companion_xiaolongnv: {
    id: 'companion_xiaolongnv',
    name: '小龙女',
    title: '东海公主',
    description: '东海龙王之女，精通水系法术，性格温婉。',
    avatar: '🐉',
    factionId: 'faction_longgong',
    race: 'celestial',
    rarity: 'epic',
    baseStats: {
      strength: 10,
      intelligence: 28,
      vitality: 15,
      agility: 18,
      willpower: 20,
      physicalAttack: 20,
      physicalDefense: 20,
      magicAttack: 55,
      magicDefense: 35,
      maxHp: 250,
      maxMp: 250,
      speed: 38,
      critRate: 0.08,
      critDamage: 0.4,
      hitRate: 0.95,
      dodgeRate: 0.05,
      antiCritRate: 0,
      penetration: 0,
      lifeSteal: 0,
      reflect: 0,
      healBonus: 0,
      cooldownReduction: 0,
    },
    growthRate: {
      strength: 1.0,
      intelligence: 3.8,
      vitality: 2.0,
      agility: 2.5,
      willpower: 2.8,
    },
    initialSkills: ['skill_longjuan', 'skill_longteng'],
    unlockCondition: {
      type: 'dungeon',
      targetId: 'dungeon_east_sea',
      description: '完成东海副本',
    },
    bonds: ['bond_dragon_royal'],
    dialogues: {
      greeting: ['需要我帮忙吗？', '愿为您效劳。'],
      battle: ['龙吟九霄！', '水龙，听我号令！'],
      victory: ['承让了。', '这就是龙族的力量。'],
      defeat: ['我...还能战斗...', '龙族不会轻易放弃。'],
      idle: ['父王还好吗...', '东海的水，总是那么温暖。'],
    },
  },

  // 猪八戒 - 狮驼岭
  companion_zhu_bajie: {
    id: 'companion_zhu_bajie',
    name: '猪八戒',
    title: '天蓬元帅',
    description: '前世是天蓬元帅，因犯错被贬下凡，如今保护唐僧取经。',
    avatar: '🐷',
    factionId: 'faction_shituo',
    race: 'demon',
    rarity: 'epic',
    baseStats: {
      strength: 20,
      intelligence: 8,
      vitality: 28,
      agility: 12,
      willpower: 10,
      physicalAttack: 40,
      physicalDefense: 45,
      magicAttack: 15,
      magicDefense: 30,
      maxHp: 400,
      maxMp: 120,
      speed: 28,
      critRate: 0.05,
      critDamage: 0.3,
      hitRate: 0.9,
      dodgeRate: 0.03,
      antiCritRate: 0,
      penetration: 0,
      lifeSteal: 0,
      reflect: 0,
      healBonus: 0,
      cooldownReduction: 0,
    },
    growthRate: {
      strength: 2.5,
      intelligence: 1.0,
      vitality: 3.5,
      agility: 1.5,
      willpower: 1.2,
    },
    initialSkills: ['skill_yingji', 'skill_xiangbian'],
    unlockCondition: {
      type: 'level',
      targetId: 'level_20',
      description: '角色等级达到20级',
    },
    bonds: ['bond_journey_west', 'bond_master_disciple'],
    dialogues: {
      greeting: ['师父，俺老猪来了！', '有什么好吃的吗？'],
      battle: ['看我的九齿钉耙！', '别惹俺老猪生气！'],
      victory: ['嘿嘿，俺老猪还是有点本事的！', '收工，该吃饭了！'],
      defeat: ['哎哟，好疼...', '师父，先撤吧！'],
      idle: ['高老庄的翠花还好吗...', '肚子饿了...'],
    },
  },
};

/** 羁绊配置 */
export const BONDS: Record<string, Bond> = {
  bond_journey_west: {
    id: 'bond_journey_west',
    name: '西天取经',
    description: '师徒三人齐心协力，共赴西天取经',
    icon: '🙏',
    requiredCompanions: ['companion_sun_wukong', 'companion_zhu_bajie'],
    minFavorability: 20,
    effects: [
      {
        type: 'stat',
        target: 'party',
        stat: 'physicalAttack',
        value: 5,
        isPercent: true,
        description: '全队物理攻击+5%',
      },
    ],
  },
  bond_master_disciple: {
    id: 'bond_master_disciple',
    name: '师徒情深',
    description: '师徒之间的深厚情谊',
    icon: '💕',
    requiredCompanions: ['companion_sun_wukong', 'companion_zhu_bajie'],
    minFavorability: 50,
    effects: [
      {
        type: 'stat',
        target: 'specific',
        targetIds: ['companion_sun_wukong', 'companion_zhu_bajie'],
        stat: 'critRate',
        value: 3,
        isPercent: true,
        description: '孙悟空、猪八戒暴击率+3%',
      },
    ],
  },
  bond_dragon_royal: {
    id: 'bond_dragon_royal',
    name: '龙族血脉',
    description: '龙族血统的强大力量',
    icon: '🐉',
    requiredCompanions: ['companion_xiaolongnv'],
    minFavorability: 30,
    effects: [
      {
        type: 'stat',
        target: 'self',
        stat: 'magicAttack',
        value: 10,
        isPercent: true,
        description: '小龙女法术攻击+10%',
      },
    ],
  },
};

/** 获取伙伴模板 */
export function getCompanionTemplate(id: string): CompanionTemplate | undefined {
  return COMPANION_TEMPLATES[id];
}

/** 获取所有伙伴模板 */
export function getAllCompanionTemplates(): CompanionTemplate[] {
  return Object.values(COMPANION_TEMPLATES);
}

/** 获取羁绊配置 */
export function getBond(id: string): Bond | undefined {
  return BONDS[id];
}
