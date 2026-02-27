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
  skills: ['skill_jingang_huti', 'skill_jingang_hufa', 'skill_weituo', 'skill_yiweidujiang', 'skill_damo', 'skill_tuiqi'],
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
  skills: ['skill_longjuan', 'skill_nilin', 'skill_chengfengpolang', 'skill_longteng', 'skill_longyin', 'skill_shenlong'],
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
  skills: ['skill_tianlei', 'skill_tianshenhuti', 'skill_leiting', 'skill_wuleihongding', 'skill_zhenyao', 'skill_haotian'],
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
  skills: ['skill_yangliu', 'skill_pudu', 'skill_lianhua', 'skill_qisi', 'skill_lingdongjiutian', 'skill_guanyin'],
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
  skills: ['skill_bianshen', 'skill_shibo', 'skill_xiangta', 'skill_yingji', 'skill_dingxin', 'skill_xiongshi'],
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
  skills: ['skill_yanluo', 'skill_panguan', 'skill_dingxinshu', 'skill_guiyan', 'skill_yunhun', 'skill_huangquan'],
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

// ==================== 新增门派 ====================

/** 人族门派 - 神木林 */
export const SHENMULIN_FACTION: Faction = {
  id: 'faction_shenmulin',
  name: '神木林',
  shortName: '神木',
  description: '通晓自然之力的门派，擅长木系法术，可造成持续伤害。',
  icon: '🌿',
  race: 'human',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'willpower',
  growthRate: {
    strength: 1,
    intelligence: 3,
    vitality: 1,
    agility: 1,
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_luoyexiaoxiao',
    name: '落叶萧萧',
    description: '木系法术攻击多个敌人',
  },
  skills: ['skill_luoyexiaoxiao', 'skill_jingjiwu', 'skill_bingchuannu', 'skill_wushan', 'skill_xingyuezhihui', 'skill_yanhu'],
  elementAffinity: 'wood',
};

/** 人族门派 - 天机城 */
export const TIANJICHENG_FACTION: Faction = {
  id: 'faction_tianjicheng',
  name: '天机城',
  shortName: '天机',
  description: '精通偃术的门派，可操控机关作战，防御反击能力出众。',
  icon: '⚙️',
  race: 'human',
  role: 'tank',
  primaryStat: 'vitality',
  secondaryStat: 'strength',
  growthRate: {
    strength: 2,
    intelligence: 1,
    vitality: 3,
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_fengmangbilu',
    name: '锋芒毕露',
    description: '嘲讽敌人，使其攻击自己',
  },
  skills: ['skill_fengmangbilu', 'skill_youxi', 'skill_poji', 'skill_jiangxin_gujia', 'skill_jiangxin_xurui', 'skill_yishi'],
  elementAffinity: 'none',
};

/** 人族门派 - 九黎城 */
export const JIULICHENG_FACTION: Faction = {
  id: 'faction_jiulicheng',
  name: '九黎城',
  shortName: '九黎',
  description: '上古战神后裔，擅长双武器连击，爆发力极强。',
  icon: '⚔️',
  race: 'human',
  role: 'physical_dps',
  primaryStat: 'strength',
  secondaryStat: 'agility',
  growthRate: {
    strength: 3,
    intelligence: 1,
    vitality: 1,
    agility: 2,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_liegushan',
    name: '裂鼓山',
    description: '连续攻击敌人多次',
  },
  skills: ['skill_liegushan', 'skill_shijue', 'skill_huimie', 'skill_fushi', 'skill_shaman', 'skill_lianwu'],
  elementAffinity: 'none',
};

/** 人族门派 - 东海渊（奇遇门派） */
export const DONGHAIYUAN_FACTION: Faction = {
  id: 'faction_donghaiyuan',
  name: '东海渊',
  shortName: '东海',
  description: '东海龙王的隐秘门派，掌握古老的水系秘术。',
  icon: '🌊',
  race: 'human',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'willpower',
  growthRate: {
    strength: 1,
    intelligence: 3,
    vitality: 1,
    agility: 1,
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_canghaiyixiao',
    name: '沧海一笑',
    description: '水系法术攻击全体敌人',
  },
  skills: ['skill_canghaiyixiao', 'skill_jingtaonu', 'skill_fanjiangdaohai', 'skill_huashenlong', 'skill_longyinshentan', 'skill_shuilongyin'],
  elementAffinity: 'ice',
};

/** 仙族门派 - 凌波城 */
export const LINGBOCHENG_FACTION: Faction = {
  id: 'faction_lingbocheng',
  name: '凌波城',
  shortName: '凌波',
  description: '二郎神创立的门派，战意系统独特，可进行多段攻击。',
  icon: '🔱',
  race: 'celestial',
  role: 'physical_dps',
  primaryStat: 'strength',
  secondaryStat: 'intelligence',
  growthRate: {
    strength: 3,
    intelligence: 2,
    vitality: 1,
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_tianbengdilie',
    name: '天崩地裂',
    description: '消耗战意进行三连击',
  },
  skills: ['skill_lieshi', 'skill_langyong', 'skill_tianbengdilie', 'skill_budongrushan', 'skill_suixingjue', 'skill_tenglei'],
  elementAffinity: 'thunder',
};

/** 仙族门派 - 花果山 */
export const HUAGUOSHAN_FACTION: Faction = {
  id: 'faction_huaguoshan',
  name: '花果山',
  shortName: '花果',
  description: '齐天大圣的传承，如意神通变化无穷，物理爆发力极强。',
  icon: '🐵',
  race: 'celestial',
  role: 'physical_dps',
  primaryStat: 'strength',
  secondaryStat: 'agility',
  growthRate: {
    strength: 3,
    intelligence: 1,
    vitality: 1,
    agility: 2,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_dangtouyibang',
    name: '当头一棒',
    description: '临时提升伤害攻击敌人',
  },
  skills: ['skill_dangtouyibang', 'skill_shenzhenhanhai', 'skill_potiluangbang', 'skill_tongtietiebi', 'skill_wusuodunxing', 'skill_huzihuanxun'],
  elementAffinity: 'none',
};

/** 魔族门派 - 无底洞 */
export const WUDIDONG_FACTION: Faction = {
  id: 'faction_wudidong',
  name: '无底洞',
  shortName: '无底',
  description: '地涌夫人创立的门派，兼顾封印与治疗，战斗方式灵活。',
  icon: '🕳️',
  race: 'demon',
  role: 'support',
  primaryStat: 'intelligence',
  secondaryStat: 'willpower',
  growthRate: {
    strength: 1,
    intelligence: 2,
    vitality: 2,
    agility: 1,
    willpower: 2,
  },
  signatureSkill: {
    id: 'skill_duopoling',
    name: '夺魄令',
    description: '封印目标法术',
  },
  skills: ['skill_duopoling', 'skill_duomingzhou', 'skill_diyongjinlian', 'skill_mingguangbaozhu', 'skill_jinshensheli', 'skill_yihunhuagu'],
  elementAffinity: 'none',
};

/** 魔族门派 - 女魃墓 */
export const NVBAOMU_FACTION: Faction = {
  id: 'faction_nvbaomu',
  name: '女魃墓',
  shortName: '女魃',
  description: '天女魃的传承，擅长召唤怨灵幻魔，诅咒之术诡异莫测。',
  icon: '🔥',
  race: 'demon',
  role: 'magic_dps',
  primaryStat: 'intelligence',
  secondaryStat: 'vitality',
  growthRate: {
    strength: 1,
    intelligence: 3,
    vitality: 2,
    agility: 1,
    willpower: 1,
  },
  signatureSkill: {
    id: 'skill_huanling_hunhuo',
    name: '唤灵·魂火',
    description: '召唤怨灵协助战斗',
  },
  skills: ['skill_chihuoliuli', 'skill_huanling_hunhuo', 'skill_huanmo_duoyu', 'skill_jingshihuanghuo', 'skill_shixuezhiji', 'skill_yuanbuzhiqi'],
  elementAffinity: 'fire',
};

/** 所有门派配置 */
export const FACTIONS: Record<string, Faction> = {
  // 人族门派（8个）
  faction_datang: DATANG_FACTION,
  faction_huasheng: HUASHENG_FACTION,
  faction_fangcun: FANGCUN_FACTION,
  faction_nver: NVER_FACTION,
  faction_shenmulin: SHENMULIN_FACTION,
  faction_tianjicheng: TIANJICHENG_FACTION,
  faction_donghaiyuan: DONGHAIYUAN_FACTION,
  faction_jiulicheng: JIULICHENG_FACTION,
  // 仙族门派（6个）
  faction_longgong: LONGGONG_FACTION,
  faction_tiangong: TIANGONG_FACTION,
  faction_putuo: PUTUO_FACTION,
  faction_wuzhuang: WUZHUANG_FACTION,
  faction_lingbocheng: LINGBOCHENG_FACTION,
  faction_huaguoshan: HUAGUOSHAN_FACTION,
  // 魔族门派（6个）
  faction_shituo: SHITUO_FACTION,
  faction_mowang: MOWANG_FACTION,
  faction_difu: DIFU_FACTION,
  faction_pansi: PANSI_FACTION,
  faction_wudidong: WUDIDONG_FACTION,
  faction_nvbaomu: NVBAOMU_FACTION,
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
