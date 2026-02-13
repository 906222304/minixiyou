// 门派配置数据 - 含成长系数

import type { Faction, RaceType } from '@/types';

/** 人族门派 */
export const DATANG_FACTION: Faction = {
  id: 'faction_datang',
  name: '大唐官府',
  shortName: '大唐',
  description: '程咬金创立的门派，以横扫千军著称，物理爆发力强。',
  icon: '⚔️',
  race: 'human',
  role: 'physical_dps',
  primaryStat: 'strength',
  secondaryStat: 'agility',
  growthRate: {
    strength: 3,      // 高力量成长
    intelligence: 1,
    vitality: 2,
    agility: 2,       // 中敏捷成长
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_hengsao',
    name: '横扫千军',
    description: '连续攻击敌方3次，每次伤害递减',
  },
  skills: ['skill_hengsao', 'skill_pojian', 'skill_houfa'],
  elementAffinity: 'none',
};

export const HUASHENG_FACTION: Faction = {
  id: 'faction_huasheng',
  name: '化生寺',
  shortName: '化生',
  description: '佛门圣地，擅长治疗和辅助，是队伍中不可缺少的支援。',
  icon: '🙏',
  race: 'human',
  role: 'healer',
  primaryStat: 'intelligence',
  secondaryStat: 'willpower',
  growthRate: {
    strength: 1,
    intelligence: 3,  // 高灵力成长（治疗量）
    vitality: 2,
    agility: 1,
    willpower: 2,     // 中魔力成长（MP）
  },
  signatureSkill: {
    id: 'skill_tuiqi',
    name: '推气过宫',
    description: '为全体友方恢复生命值',
  },
  skills: ['skill_tuiqi', 'skill_jinlao', 'skill_hushen'],
  elementAffinity: 'none',
};

export const FANGCUN_FACTION: Faction = {
  id: 'faction_fangcun',
  name: '方寸山',
  shortName: '方寸',
  description: '菩提祖师创立的门派，擅长封印控制，让敌人无法行动。',
  icon: '🔮',
  race: 'human',
  role: 'control',
  primaryStat: 'intelligence',
  secondaryStat: 'agility',
  growthRate: {
    strength: 1,
    intelligence: 3,  // 高灵力成长（封印命中）
    vitality: 1,
    agility: 2,       // 中敏捷成长（速度）
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_dingshen',
    name: '定身符',
    description: '封印目标，使其无法行动',
  },
  skills: ['skill_dingshen', 'skill_shenshi', 'skill_leiting'],
  elementAffinity: 'thunder',
};

export const NVER_FACTION: Faction = {
  id: 'faction_nver',
  name: '女儿村',
  shortName: '女儿',
  description: '以暗器和速度著称的门派，攻击迅速且致命。',
  icon: '🌸',
  race: 'human',
  role: 'physical_dps',
  primaryStat: 'agility',
  secondaryStat: 'strength',
  growthRate: {
    strength: 2,
    intelligence: 1,
    vitality: 1,
    agility: 3,       // 高敏捷成长（速度+暴击）
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_manhua',
    name: '满天花雨',
    description: '对多个敌人造成伤害',
  },
  skills: ['skill_manhua', 'skill_qinggong', 'skill_anyue'],
  elementAffinity: 'none',
};

/** 仙族门派 */
export const LONGGONG_FACTION: Faction = {
  id: 'faction_longgong',
  name: '龙宫',
  shortName: '龙宫',
  description: '东海龙王的门派，擅长水系法术，群体伤害能力出众。',
  icon: '🐉',
  race: 'celestial',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'willpower',
  growthRate: {
    strength: 1,
    intelligence: 3,  // 高灵力成长（法伤）
    vitality: 1,
    agility: 1,
    willpower: 3,     // 高魔力成长（MP+法防）
  },
  signatureSkill: {
    id: 'skill_longjuan',
    name: '龙卷雨击',
    description: '召唤水龙攻击全体敌人',
  },
  skills: ['skill_longjuan', 'skill_longteng', 'skill_huilong'],
  elementAffinity: 'ice',
};

export const TIANGONG_FACTION: Faction = {
  id: 'faction_tiangong',
  name: '天宫',
  shortName: '天宫',
  description: '天庭门派，雷系法术强大，单体爆发伤害极高。',
  icon: '⚡',
  race: 'celestial',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'strength',
  growthRate: {
    strength: 2,      // 中力量成长（部分技能需力量）
    intelligence: 3,  // 高灵力成长
    vitality: 1,
    agility: 1,
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_tianlei',
    name: '天雷斩',
    description: '召唤天雷攻击单个敌人，造成巨额伤害',
  },
  skills: ['skill_tianlei', 'skill_leiting', 'skill_hudun'],
  elementAffinity: 'thunder',
};

export const PUTUO_FACTION: Faction = {
  id: 'faction_putuo',
  name: '普陀山',
  shortName: '普陀',
  description: '观音菩萨的道场，擅长治疗和复活，守护队友。',
  icon: '🪷',
  race: 'celestial',
  role: 'healer',
  primaryStat: 'willpower',
  secondaryStat: 'intelligence',
  growthRate: {
    strength: 1,
    intelligence: 2,
    vitality: 2,
    agility: 1,
    willpower: 3,     // 高魔力成长（治疗量+MP）
  },
  signatureSkill: {
    id: 'skill_yangliu',
    name: '杨柳甘露',
    description: '复活死亡的队友',
  },
  skills: ['skill_yangliu', 'skill_jingu', 'skill_pusa'],
  elementAffinity: 'none',
};

export const WUZHUANG_FACTION: Faction = {
  id: 'faction_wuzhuang',
  name: '五庄观',
  shortName: '五庄',
  description: '镇元大仙的门派，兼顾输出与封印，战斗方式灵活。',
  icon: '🎋',
  race: 'celestial',
  role: 'support',
  primaryStat: 'intelligence',
  secondaryStat: 'vitality',
  growthRate: {
    strength: 1,
    intelligence: 2,
    vitality: 3,      // 高体质成长（生存能力）
    agility: 1,
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_qiankun',
    name: '乾坤袖',
    description: '封印目标并造成伤害',
  },
  skills: ['skill_qiankun', 'skill_rumeng', 'skill_xiaoyao'],
  elementAffinity: 'none',
};

/** 魔族门派 */
export const SHITUO_FACTION: Faction = {
  id: 'faction_shituo',
  name: '狮驼岭',
  shortName: '狮驼',
  description: '以变身著称的门派，变身后攻击力大幅提升，可攻击全体。',
  icon: '🦁',
  race: 'demon',
  role: 'physical_dps',
  primaryStat: 'strength',
  secondaryStat: 'vitality',
  growthRate: {
    strength: 3,      // 高力量成长
    intelligence: 1,
    vitality: 2,      // 中体质成长（变身消耗HP）
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_yingji',
    name: '鹰击',
    description: '变身后攻击全体敌人',
  },
  skills: ['skill_yingji', 'skill_xiangbian', 'skill_shiwang'],
  elementAffinity: 'none',
};

export const MOWANG_FACTION: Faction = {
  id: 'faction_mowang',
  name: '魔王寨',
  shortName: '魔王',
  description: '火系法术门派，群体伤害能力出众，还能附加灼烧效果。',
  icon: '🔥',
  race: 'demon',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'vitality',
  growthRate: {
    strength: 1,
    intelligence: 3,  // 高灵力成长
    vitality: 2,      // 中体质成长（生存能力）
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_feisha',
    name: '飞砂走石',
    description: '召唤火石攻击全体敌人，并附加灼烧',
  },
  skills: ['skill_feisha', 'skill_sanmei', 'skill_niul'],
  elementAffinity: 'fire',
};

export const DIFU_FACTION: Faction = {
  id: 'faction_difu',
  name: '阴曹地府',
  shortName: '地府',
  description: '阎王爷的门派，擅长固定伤害和削弱敌人。',
  icon: '💀',
  race: 'demon',
  role: 'support',
  primaryStat: 'vitality',
  secondaryStat: 'intelligence',
  growthRate: {
    strength: 1,
    intelligence: 2,
    vitality: 3,      // 高体质成长（固定伤害与HP相关）
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_yanluo',
    name: '阎罗令',
    description: '对敌人造成固定伤害',
  },
  skills: ['skill_yanluo', 'skill_lihun', 'skill_yinyang'],
  elementAffinity: 'none',
};

export const PANSI_FACTION: Faction = {
  id: 'faction_pansi',
  name: '盘丝洞',
  shortName: '盘丝',
  description: '蜘蛛精的门派，擅长封印和吸取MP，控制能力强。',
  icon: '🕸️',
  race: 'demon',
  role: 'control',
  primaryStat: 'agility',
  secondaryStat: 'intelligence',
  growthRate: {
    strength: 1,
    intelligence: 2,
    vitality: 1,
    agility: 3,       // 高敏捷成长（速度+封印）
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_pansi',
    name: '盘丝阵',
    description: '封印目标并吸取其MP',
  },
  skills: ['skill_pansi', 'skill_huixin', 'skill_tianluo'],
  elementAffinity: 'none',
};

/** 所有门派配置 */
export const FACTIONS: Record<string, Faction> = {
  faction_datang: DATANG_FACTION,
  faction_huasheng: HUASHENG_FACTION,
  faction_fangcun: FANGCUN_FACTION,
  faction_nver: NVER_FACTION,
  faction_longgong: LONGGONG_FACTION,
  faction_tiangong: TIANGONG_FACTION,
  faction_putuo: PUTUO_FACTION,
  faction_wuzhuang: WUZHUANG_FACTION,
  faction_shituo: SHITUO_FACTION,
  faction_mowang: MOWANG_FACTION,
  faction_difu: DIFU_FACTION,
  faction_pansi: PANSI_FACTION,
};

/** 按种族获取门派列表 */
export function getFactionsByRace(race: RaceType): Faction[] {
  return Object.values(FACTIONS).filter(f => f.race === race);
}

/** 获取门派配置 */
export function getFaction(id: string): Faction | undefined {
  return FACTIONS[id];
}

/** 获取所有门派列表 */
export function getAllFactions(): Faction[] {
  return Object.values(FACTIONS);
}
