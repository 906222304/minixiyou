// 召唤兽模板数据 - 基于梦幻西游官网数据
// 数据来源: https://xyq.163.com/counter/list.html

import type { PetTemplate, PetAptitudeConfig, PetType, PetElement, PetRarity } from '@/types/pet';

// ==================== 辅助函数 ====================

/** 创建资质配置 */
function createAptitudeConfig(
  attack: [number, number],
  defense: [number, number],
  hp: [number, number],
  mp: [number, number],
  speed: [number, number],
  dodge: [number, number]
): PetAptitudeConfig {
  return {
    attack: { min: attack[0], max: attack[1] },
    defense: { min: defense[0], max: defense[1] },
    hp: { min: hp[0], max: hp[1] },
    mp: { min: mp[0], max: mp[1] },
    speed: { min: speed[0], max: speed[1] },
    dodge: { min: dodge[0], max: dodge[1] },
  };
}

/** 创建召唤兽模板 */
function createSummonTemplate(params: {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: PetType;
  element: PetElement;
  rarity: PetRarity;
  carryLevel: number;
  growthRates: [number, number, number, number, number];
  aptitudes: PetAptitudeConfig;
  skills: string[];
  captureLocations: string[];
}): PetTemplate {
  return params;
}

// ==================== 第1批: 0级携带召唤兽 ====================

/** 0级携带召唤兽 - 新手区 */
export const SUMMON_TIER_0: PetTemplate[] = [
  // ===== 东海湾/建邺城区域 =====
  createSummonTemplate({
    id: 'summon_juwa',
    name: '巨蛙',
    description: '生活在东海湾的巨大蛙类，在漫长的岁月中，领悟了水系法术',
    icon: '🐸',
    type: 'balance',
    element: 'water',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.882, 0.891, 0.9, 0.909, 0.918],
    aptitudes: createAptitudeConfig(
      [864, 1080],   // 攻击资质
      [672, 840],    // 防御资质
      [2160, 2700],  // 体力资质
      [960, 1200],   // 法力资质
      [1056, 1320],  // 速度资质
      [816, 1020]    // 躲闪资质
    ),
    skills: ['skill_huigen', 'skill_xingyun', 'skill_shuigong', 'skill_ruodianhuo'],
    captureLocations: ['东海海底', '沉船', '东海岩洞'],
  }),

  createSummonTemplate({
    id: 'summon_dahaitui',
    name: '大海龟',
    description: '有着比一般龟类巨大得多的身躯，据说寿命极长',
    icon: '🐢',
    type: 'defense',
    element: 'water',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.882, 0.891, 0.9, 0.909, 0.918],
    aptitudes: createAptitudeConfig(
      [768, 960],    // 攻击资质
      [768, 960],    // 防御资质
      [2880, 3600],  // 体力资质
      [960, 1200],   // 法力资质
      [672, 840],    // 速度资质
      [1056, 1320]   // 躲闪资质
    ),
    skills: ['skill_fenzhen', 'skill_huigen', 'skill_xingyun', 'skill_shuishuxingxishou', 'skill_fangyu'],
    captureLocations: ['东海湾', '东海海底', '东海沉船'],
  }),

  createSummonTemplate({
    id: 'summon_haixing',
    name: '海星',
    description: '栖息在海边，动作僵硬而笨拙，在漫长的发呆之中领悟了些许法术本领',
    icon: '⭐',
    type: 'magic',
    element: 'water',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.882, 0.891, 0.9, 0.909, 0.918],
    aptitudes: createAptitudeConfig(
      [864, 1080],   // 攻击资质
      [912, 1140],   // 防御资质
      [1920, 2400],  // 体力资质
      [1152, 1440],  // 法力资质
      [960, 1200],   // 速度资质
      [816, 1020]    // 躲闪资质
    ),
    skills: ['skill_huigen', 'skill_gj_fenzhen', 'skill_shuigong', 'skill_shuishuxingxishou', 'skill_ruodianhuo'],
    captureLocations: ['东海湾', '东海海底', '沉船'],
  }),

  createSummonTemplate({
    id: 'summon_zhangyu',
    name: '章鱼',
    description: '海中生灵，有着灵活的八爪，能吐墨藏匿行踪',
    icon: '🦑',
    type: 'attack',
    element: 'water',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.882, 0.891, 0.9, 0.909, 0.918],
    aptitudes: createAptitudeConfig(
      [1152, 1440],  // 攻击资质
      [672, 840],    // 防御资质
      [1920, 2400],  // 体力资质
      [960, 1200],   // 法力资质
      [1056, 1320],  // 速度资质
      [960, 1200]    // 躲闪资质
    ),
    skills: ['skill_lianji', 'skill_du', 'skill_xixue', 'skill_shuishuxingxishou', 'skill_ruodianhuo'],
    captureLocations: ['东海海底', '沉船'],
  }),

  createSummonTemplate({
    id: 'summon_paopao',
    name: '泡泡',
    description: '圆头圆脑，蹦蹦跳跳，可爱的泡泡只会出现在和它有缘的人面前',
    icon: '🫧',
    type: 'balance',
    element: 'none',
    rarity: 'rare',
    carryLevel: 0,
    growthRates: [0.97, 0.98, 0.99, 1.0, 1.01],
    aptitudes: createAptitudeConfig(
      [1056, 1320],  // 攻击资质
      [1104, 1380],  // 防御资质
      [3360, 4200],  // 体力资质
      [1728, 2160],  // 法力资质
      [1056, 1320],  // 速度资质
      [1056, 1320]   // 躲闪资质
    ),
    skills: ['skill_gj_fangyu', 'skill_gj_xingyun', 'skill_lianji', 'skill_jingshenjizhong', 'skill_zaisheng'],
    captureLocations: ['无固定场景'],
  }),

  createSummonTemplate({
    id: 'summon_shuguai',
    name: '树怪',
    description: '百草树木皆有灵性，只有少数老树在人烟罕至的地方修炼成精',
    icon: '🌳',
    type: 'defense',
    element: 'wood',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.882, 0.891, 0.9, 0.909, 0.918],
    aptitudes: createAptitudeConfig(
      [1056, 1320],  // 攻击资质
      [1056, 1320],  // 防御资质
      [2640, 3300],  // 体力资质
      [1056, 1320],  // 法力资质
      [720, 900],    // 速度资质
      [768, 960]     // 躲闪资质
    ),
    skills: ['skill_fanji', 'skill_ganjing', 'skill_qugui', 'skill_zaisheng', 'skill_ruodianhuo', 'skill_chidun'],
    captureLocations: ['江南野外'],
  }),

  createSummonTemplate({
    id: 'summon_huwei',
    name: '护卫',
    description: '本是皇宫的守卫，现在伴主人行走江湖，手持利斧，有凛然之气',
    icon: '💂',
    type: 'attack',
    element: 'metal',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.931, 0.94, 0.95, 0.959, 0.969],
    aptitudes: createAptitudeConfig(
      [912, 1140],   // 攻击资质
      [816, 1020],   // 防御资质
      [2160, 2700],  // 体力资质
      [1440, 1800],  // 法力资质
      [960, 1200],   // 速度资质
      [960, 1200]    // 躲闪资质
    ),
    skills: ['skill_fanji', 'skill_bisha', 'skill_qiangli'],
    captureLocations: ['无'],
  }),

  createSummonTemplate({
    id: 'summon_dutu',
    name: '赌徒',
    description: '沉迷赌博的无赖，身手敏捷却心术不正',
    icon: '🎰',
    type: 'balance',
    element: 'none',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.931, 0.94, 0.95, 0.959, 0.969],
    aptitudes: createAptitudeConfig(
      [900, 1125],   // 攻击资质
      [800, 1000],   // 防御资质
      [2000, 2500],  // 体力资质
      [1200, 1500],  // 法力资质
      [1000, 1250],  // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_touxi', 'skill_zhaojia'],
    captureLocations: ['大雁塔'],
  }),

  createSummonTemplate({
    id: 'summon_qiangdao',
    name: '强盗',
    description: '落草为寇的亡命之徒，擅长偷袭',
    icon: '🗡️',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.989, 0.999, 1.01, 1.02, 1.03],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [750, 940],    // 防御资质
      [1800, 2250],  // 体力资质
      [900, 1125],   // 法力资质
      [1000, 1250],  // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_touxi', 'skill_bisha', 'skill_qiangli'],
    captureLocations: ['大雁塔', '国境'],
  }),

  createSummonTemplate({
    id: 'summon_haimaochong',
    name: '海毛虫',
    description: '东海中的奇特生物，形似毛虫，毒性强烈',
    icon: '🐛',
    type: 'attack',
    element: 'water',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.989, 0.999, 1.01, 1.02, 1.03],
    aptitudes: createAptitudeConfig(
      [1100, 1375],  // 攻击资质
      [700, 875],    // 防御资质
      [1600, 2000],  // 体力资质
      [800, 1000],   // 法力资质
      [1100, 1375],  // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_lianji', 'skill_du', 'skill_bisha'],
    captureLocations: ['东海湾', '东海海底'],
  }),

  createSummonTemplate({
    id: 'summon_dabianfu',
    name: '大蝙蝠',
    description: '栖息在阴暗处的巨大蝙蝠，依靠吸血为生',
    icon: '🦇',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [1.058, 1.069, 1.08, 1.09, 1.101],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [720, 900],    // 防御资质
      [1680, 2100],  // 体力资质
      [800, 1000],   // 法力资质
      [1200, 1500],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_xixue', 'skill_yezhan', 'skill_yezhan'],
    captureLocations: ['大雁塔', '魔王寨'],
  }),

  createSummonTemplate({
    id: 'summon_shanzai',
    name: '山贼',
    description: '盘踞山林的匪徒，凶狠残暴',
    icon: '🪓',
    type: 'attack',
    element: 'earth',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [0.994, 1.004, 1.01, 1.025, 1.035],
    aptitudes: createAptitudeConfig(
      [1080, 1350],  // 攻击资质
      [840, 1050],   // 防御资质
      [2000, 2500],  // 体力资质
      [800, 1000],   // 法力资质
      [800, 1000],   // 速度资质
      [700, 875]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_bisha', 'skill_fanji'],
    captureLocations: ['花果山', '魔王寨'],
  }),
];

// ==================== 第2批: 5-15级携带召唤兽 ====================

/** 5-15级携带召唤兽 */
export const SUMMON_TIER_5_15: PetTemplate[] = [
  createSummonTemplate({
    id: 'summon_yezhu',
    name: '野猪',
    description: '山林中常见的野猪，獠牙锋利，性格凶猛',
    icon: '🐗',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 5,
    growthRates: [0.999, 1.009, 1.02, 1.03, 1.04],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [880, 1100],   // 防御资质
      [2200, 2750],  // 体力资质
      [800, 1000],   // 法力资质
      [720, 900],    // 速度资质
      [720, 900]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_fanji', 'skill_lianji'],
    captureLocations: ['大唐境外', '花果山'],
  }),

  createSummonTemplate({
    id: 'summon_kulouguai',
    name: '骷髅怪',
    description: '死去多年的白骨，受阴气侵染而成了精怪',
    icon: '💀',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 0,
    growthRates: [1.009, 1.019, 1.03, 1.04, 1.05],
    aptitudes: createAptitudeConfig(
      [1300, 1625],  // 攻击资质
      [720, 900],    // 防御资质
      [1680, 2100],  // 体力资质
      [720, 900],    // 法力资质
      [1120, 1400],  // 速度资质
      [880, 1100]    // 躲闪资质
    ),
    skills: ['skill_yezhan', 'skill_guihun', 'skill_gj_yezhan'],
    captureLocations: ['地府', '大雁塔'],
  }),

  createSummonTemplate({
    id: 'summon_yangtoutou',
    name: '羊头怪',
    description: '长着羊头的妖怪，力大无穷',
    icon: '🐏',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 25,
    growthRates: [1.004, 1.014, 1.025, 1.035, 1.045],
    aptitudes: createAptitudeConfig(
      [1280, 1600],  // 攻击资质
      [880, 1100],   // 防御资质
      [2400, 3000],  // 体力资质
      [800, 1000],   // 法力资质
      [800, 1000],   // 速度资质
      [720, 900]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_bisha', 'skill_fanji'],
    captureLocations: ['狮驼岭'],
  }),

  createSummonTemplate({
    id: 'summon_hamajing',
    name: '蛤蟆精',
    description: '修炼成精的蟾蜍，毒性强烈',
    icon: '🐸',
    type: 'magic',
    element: 'water',
    rarity: 'common',
    carryLevel: 15,
    growthRates: [1.009, 1.019, 1.03, 1.04, 1.05],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [800, 1000],   // 防御资质
      [2000, 2500],  // 体力资质
      [1200, 1500],  // 法力资质
      [1000, 1250],  // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_du', 'skill_shuigong', 'skill_huigen'],
    captureLocations: ['魔王寨'],
  }),

  createSummonTemplate({
    id: 'summon_hulijing',
    name: '狐狸精',
    description: '修炼千年的狐狸，善于魅惑之术',
    icon: '🦊',
    type: 'magic',
    element: 'fire',
    rarity: 'common',
    carryLevel: 15,
    growthRates: [1.009, 1.019, 1.03, 1.04, 1.05],
    aptitudes: createAptitudeConfig(
      [900, 1125],   // 攻击资质
      [800, 1000],   // 防御资质
      [1800, 2250],  // 体力资质
      [1400, 1750],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_yinshen', 'skill_liehuo', 'skill_huigen'],
    captureLocations: ['魔王寨'],
  }),

  createSummonTemplate({
    id: 'summon_laohu',
    name: '老虎',
    description: '百兽之王，威风凛凛，攻击力极强',
    icon: '🐅',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 15,
    growthRates: [1.004, 1.014, 1.025, 1.035, 1.045],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [880, 1100],   // 防御资质
      [2400, 3000],  // 体力资质
      [720, 900],    // 法力资质
      [1000, 1250],  // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_lianji', 'skill_qiangli'],
    captureLocations: ['花果山', '狮驼岭'],
  }),

  createSummonTemplate({
    id: 'summon_heixiong',
    name: '黑熊',
    description: '身躯庞大的黑熊，力量惊人',
    icon: '🐻',
    type: 'defense',
    element: 'none',
    rarity: 'common',
    carryLevel: 15,
    growthRates: [1.004, 1.014, 1.025, 1.035, 1.045],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2800, 3500],  // 体力资质
      [640, 800],    // 法力资质
      [640, 800],    // 速度资质
      [640, 800]     // 躲闪资质
    ),
    skills: ['skill_fangyu', 'skill_fanji', 'skill_chidun', 'skill_qiangli'],
    captureLocations: ['花果山', '大唐境外'],
  }),
];

// ==================== 第3批: 25-35级携带召唤兽 ====================

/** 25-35级携带召唤兽 */
export const SUMMON_TIER_25_35: PetTemplate[] = [
  createSummonTemplate({
    id: 'summon_huayao',
    name: '花妖',
    description: '花丛中诞生的精灵，擅长法术攻击',
    icon: '🌸',
    type: 'magic',
    element: 'wood',
    rarity: 'common',
    carryLevel: 25,
    growthRates: [1.029, 1.039, 1.05, 1.06, 1.071],
    aptitudes: createAptitudeConfig(
      [900, 1125],   // 攻击资质
      [900, 1125],   // 防御资质
      [1800, 2250],  // 体力资质
      [1600, 2000],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_huigen', 'skill_gj_fangyu'],
    captureLocations: ['长寿村外'],
  }),

  createSummonTemplate({
    id: 'summon_lang',
    name: '狼',
    description: '凶猛的野狼，速度极快',
    icon: '🐺',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 25,
    growthRates: [0.999, 1.009, 1.02, 1.03, 1.04],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [720, 900],    // 防御资质
      [1800, 2250],  // 体力资质
      [720, 900],    // 法力资质
      [1200, 1500],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_lianji', 'skill_touxi', 'skill_yezhan'],
    captureLocations: ['长寿村外', '大唐境外'],
  }),

  createSummonTemplate({
    id: 'summon_niuyao',
    name: '牛妖',
    description: '牛头人身的妖怪，力大无穷',
    icon: '🐂',
    type: 'attack',
    element: 'none',
    rarity: 'common',
    carryLevel: 35,
    growthRates: [1.078, 1.089, 1.1, 1.111, 1.122],
    aptitudes: createAptitudeConfig(
      [1600, 2000],  // 攻击资质
      [1000, 1250],  // 防御资质
      [2800, 3500],  // 体力资质
      [640, 800],    // 法力资质
      [720, 900],    // 速度资质
      [640, 800]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_bisha', 'skill_gj_lianji'],
    captureLocations: ['魔王寨'],
  }),

  createSummonTemplate({
    id: 'summon_yegui',
    name: '野鬼',
    description: '游荡在人间的孤魂野鬼',
    icon: '👻',
    type: 'magic',
    element: 'none',
    rarity: 'common',
    carryLevel: 35,
    growthRates: [0.994, 1.004, 1.015, 1.025, 1.035],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [800, 1000],   // 防御资质
      [1800, 2250],  // 体力资质
      [1200, 1500],  // 法力资质
      [1000, 1250],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_yezhan', 'skill_guihun', 'skill_qugui'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_xiabing',
    name: '虾兵',
    description: '龙宫的虾兵，手持长枪',
    icon: '🦐',
    type: 'attack',
    element: 'water',
    rarity: 'common',
    carryLevel: 35,
    growthRates: [1.014, 1.024, 1.035, 1.045, 1.055],
    aptitudes: createAptitudeConfig(
      [1300, 1625],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2400, 3000],  // 体力资质
      [1000, 1250],  // 法力资质
      [900, 1125],   // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_shuigong', 'skill_fanji'],
    captureLocations: ['龙宫'],
  }),

  createSummonTemplate({
    id: 'summon_xiejiang',
    name: '蟹将',
    description: '龙宫的蟹将，手持利斧',
    icon: '🦀',
    type: 'attack',
    element: 'water',
    rarity: 'common',
    carryLevel: 35,
    growthRates: [1.025, 1.035, 1.046, 1.056, 1.066],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2400, 3000],  // 体力资质
      [800, 1000],   // 法力资质
      [800, 1000],   // 速度资质
      [700, 875]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_bisha', 'skill_fangyu'],
    captureLocations: ['龙宫'],
  }),

  createSummonTemplate({
    id: 'summon_xiaolongnv',
    name: '小龙女',
    description: '龙王的女儿，法力高强',
    icon: '🐉',
    type: 'magic',
    element: 'water',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.043, 1.054, 1.065, 1.075, 1.086],
    aptitudes: createAptitudeConfig(
      [1100, 1375],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2600, 3250],  // 体力资质
      [1600, 2000],  // 法力资质
      [1200, 1500],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_shuigong', 'skill_gj_shuimanjinshan', 'skill_huigen'],
    captureLocations: ['龙宫'],
  }),

  createSummonTemplate({
    id: 'summon_zhizhujing',
    name: '蜘蛛精',
    description: '盘丝洞的蜘蛛精，善于吐丝缠绕',
    icon: '🕷️',
    type: 'control',
    element: 'wood',
    rarity: 'common',
    carryLevel: 35,
    growthRates: [1.068, 1.079, 1.09, 1.1, 1.111],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [900, 1125],   // 防御资质
      [2000, 2500],  // 体力资质
      [1400, 1750],  // 法力资质
      [1200, 1500],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_du', 'skill_du', 'skill_gj_du'],
    captureLocations: ['盘丝洞'],
  }),
];

// ==================== 第4批: 45-55级携带召唤兽 ====================

/** 45-55级携带召唤兽 */
export const SUMMON_TIER_45_55: PetTemplate[] = [
  createSummonTemplate({
    id: 'summon_guichengxiang',
    name: '龟丞相',
    description: '龙宫的丞相，法力深厚',
    icon: '🐢',
    type: 'magic',
    element: 'water',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.038, 1.049, 1.06, 1.07, 1.081],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [1400, 1750],  // 防御资质
      [3200, 4000],  // 体力资质
      [1800, 2250],  // 法力资质
      [800, 1000],   // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_shuigong', 'skill_gj_shuimanjinshan', 'skill_huigen', 'skill_fangyu'],
    captureLocations: ['龙宫'],
  }),

  createSummonTemplate({
    id: 'summon_tuziguai',
    name: '兔子怪',
    description: '成精的兔子，速度极快',
    icon: '🐰',
    type: 'attack',
    element: 'wood',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.097, 1.108, 1.12, 1.131, 1.142],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1000, 1250],  // 防御资质
      [2000, 2500],  // 体力资质
      [1000, 1250],  // 法力资质
      [1400, 1750],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_lianji', 'skill_bisha', 'skill_gj_minjie'],
    captureLocations: ['月宫'],
  }),

  createSummonTemplate({
    id: 'summon_heixiongjing',
    name: '黑熊精',
    description: '修炼成精的黑熊，力大无穷',
    icon: '🐻',
    type: 'defense',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.024, 1.034, 1.045, 1.055, 1.065],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1500, 1875],  // 防御资质
      [3200, 4000],  // 体力资质
      [800, 1000],   // 法力资质
      [700, 875],    // 速度资质
      [700, 875]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_gj_fangyu', 'skill_fanji', 'skill_chidun'],
    captureLocations: ['狮驼岭'],
  }),

  createSummonTemplate({
    id: 'summon_jiangshi',
    name: '僵尸',
    description: '复活的尸体，不畏死亡',
    icon: '🧟',
    type: 'attack',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.048, 1.059, 1.07, 1.08, 1.091],
    aptitudes: createAptitudeConfig(
      [1500, 1875],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2800, 3500],  // 体力资质
      [700, 875],    // 法力资质
      [900, 1125],   // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_yezhan', 'skill_guihun', 'skill_gj_xixue'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_niutou',
    name: '牛头',
    description: '地府的鬼差，手持钢叉',
    icon: '👹',
    type: 'attack',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.058, 1.069, 1.08, 1.09, 1.101],
    aptitudes: createAptitudeConfig(
      [1600, 2000],  // 攻击资质
      [1300, 1625],  // 防御资质
      [3000, 3750],  // 体力资质
      [700, 875],    // 法力资质
      [800, 1000],   // 速度资质
      [700, 875]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_bisha', 'skill_gj_yezhan'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_mamian',
    name: '马面',
    description: '地府的鬼差，手持长枪',
    icon: '🐴',
    type: 'attack',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 45,
    growthRates: [1.048, 1.059, 1.07, 1.08, 1.091],
    aptitudes: createAptitudeConfig(
      [1500, 1875],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2800, 3500],  // 体力资质
      [800, 1000],   // 法力资质
      [1000, 1250],  // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_gj_bisha', 'skill_gj_yezhan'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_leiniaoren',
    name: '雷鸟人',
    description: '操控雷电的鸟人，法力高强',
    icon: '⚡',
    type: 'magic',
    element: 'metal',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.127, 1.138, 1.15, 1.161, 1.173],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2400, 3000],  // 体力资质
      [2000, 2500],  // 法力资质
      [1200, 1500],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_leiji', 'skill_gj_bengleizhou', 'skill_huigen'],
    captureLocations: ['狮驼岭'],
  }),

  createSummonTemplate({
    id: 'summon_hudietongzi',
    name: '蝴蝶仙子',
    description: '美丽的蝴蝶仙子，擅长法术',
    icon: '🦋',
    type: 'magic',
    element: 'wood',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.078, 1.089, 1.1, 1.111, 1.122],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [1000, 1250],  // 防御资质
      [2000, 2500],  // 体力资质
      [1800, 2250],  // 法力资质
      [1400, 1750],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_gj_mozhixin', 'skill_gj_xingyun'],
    captureLocations: ['长寿村外'],
  }),

  createSummonTemplate({
    id: 'summon_gudairuishou',
    name: '古代瑞兽',
    description: '远古神兽的后裔，法力高强',
    icon: '🦁',
    type: 'magic',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.127, 1.138, 1.15, 1.161, 1.173],
    aptitudes: createAptitudeConfig(
      [1300, 1625],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2800, 3500],  // 体力资质
      [2000, 2500],  // 法力资质
      [1000, 1250],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_mozhixin', 'skill_gj_taishanyading', 'skill_gj_fangyu'],
    captureLocations: ['北俱芦洲'],
  }),

  createSummonTemplate({
    id: 'summon_baixiong',
    name: '白熊',
    description: '生活在北方的白熊，力量惊人',
    icon: '🐻‍❄️',
    type: 'defense',
    element: 'water',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.097, 1.108, 1.12, 1.131, 1.142],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1600, 2000],  // 防御资质
      [3600, 4500],  // 体力资质
      [700, 875],    // 法力资质
      [600, 750],    // 速度资质
      [600, 750]     // 躲闪资质
    ),
    skills: ['skill_qiangli', 'skill_gj_fangyu', 'skill_chidun', 'skill_fanji'],
    captureLocations: ['北俱芦洲'],
  }),

  createSummonTemplate({
    id: 'summon_heishanlaoyao',
    name: '黑山老妖',
    description: '传说中的妖王，法力无边',
    icon: '🌑',
    type: 'magic',
    element: 'none',
    rarity: 'rare',
    carryLevel: 55,
    growthRates: [1.107, 1.118, 1.13, 1.141, 1.152],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2800, 3500],  // 体力资质
      [2400, 3000],  // 法力资质
      [900, 1125],   // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_guihun', 'skill_gj_guihun', 'skill_gj_yezhan', 'skill_gj_xixue'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_tianbing',
    name: '天兵',
    description: '天庭的士兵，武艺高强',
    icon: '⚔️',
    type: 'attack',
    element: 'metal',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.127, 1.138, 1.15, 1.161, 1.173],
    aptitudes: createAptitudeConfig(
      [1600, 2000],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2600, 3250],  // 体力资质
      [1000, 1250],  // 法力资质
      [1000, 1250],  // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_bisha', 'skill_gj_bisha', 'skill_gj_fangyu'],
    captureLocations: ['天宫'],
  }),

  createSummonTemplate({
    id: 'summon_tianjiang',
    name: '天将',
    description: '天庭的将领，法力高强',
    icon: '🗡️',
    type: 'attack',
    element: 'metal',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.136, 1.148, 1.16, 1.171, 1.183],
    aptitudes: createAptitudeConfig(
      [1700, 2125],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2400, 3000],  // 体力资质
      [1200, 1500],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_lianji', 'skill_gj_bisha', 'skill_gj_qiangli'],
    captureLocations: ['天宫'],
  }),

  createSummonTemplate({
    id: 'summon_diyuzhanshen',
    name: '地狱战神',
    description: '来自地狱的战神，战斗力惊人',
    icon: '🔥',
    type: 'attack',
    element: 'fire',
    rarity: 'rare',
    carryLevel: 55,
    growthRates: [1.107, 1.118, 1.13, 1.141, 1.152],
    aptitudes: createAptitudeConfig(
      [1800, 2250],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2600, 3250],  // 体力资质
      [1000, 1250],  // 法力资质
      [1000, 1250],  // 速度资质
      [900, 1125]    // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_bisha', 'skill_gj_lianji'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_fengbo',
    name: '风伯',
    description: '掌管风的神仙，速度极快',
    icon: '🌀',
    type: 'control',
    element: 'none',
    rarity: 'uncommon',
    carryLevel: 55,
    growthRates: [1.127, 1.138, 1.15, 1.161, 1.173],
    aptitudes: createAptitudeConfig(
      [1100, 1375],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2200, 2750],  // 体力资质
      [1600, 2000],  // 法力资质
      [1500, 1875],  // 速度资质
      [1400, 1750]   // 躲闪资质
    ),
    skills: ['skill_gj_minjie', 'skill_gj_zhaojia', 'skill_feixing'],
    captureLocations: ['天宫'],
  }),
];

// ==================== 第5批: 65-75级携带召唤兽 ====================

/** 65-75级携带召唤兽 */
export const SUMMON_TIER_65_75: PetTemplate[] = [
  // 65级
  createSummonTemplate({
    id: 'summon_fenghuang',
    name: '凤凰',
    description: '传说中的神鸟，浴火重生',
    icon: '🔥',
    type: 'magic',
    element: 'fire',
    rarity: 'rare',
    carryLevel: 65,
    growthRates: [1.176, 1.188, 1.2, 1.212, 1.224],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2600, 3250],  // 体力资质
      [2400, 3000],  // 法力资质
      [1200, 1500],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_gj_diyuliehuo', 'skill_gj_mozhixin', 'skill_gj_xingyun'],
    captureLocations: ['凤巢'],
  }),

  createSummonTemplate({
    id: 'summon_jiaolong',
    name: '蛟龙',
    description: '化龙未成的蛟，法力高强',
    icon: '🐲',
    type: 'magic',
    element: 'water',
    rarity: 'rare',
    carryLevel: 65,
    growthRates: [1.176, 1.188, 1.2, 1.212, 1.224],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2800, 3500],  // 体力资质
      [2200, 2750],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_shuimanjinshan', 'skill_gj_bengleizhou', 'skill_gj_fangyu'],
    captureLocations: ['龙窟'],
  }),

  createSummonTemplate({
    id: 'summon_yushi',
    name: '雨师',
    description: '掌管降雨的神仙',
    icon: '🌧️',
    type: 'magic',
    element: 'water',
    rarity: 'uncommon',
    carryLevel: 65,
    growthRates: [1.156, 1.168, 1.18, 1.191, 1.203],
    aptitudes: createAptitudeConfig(
      [1000, 1250],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2400, 3000],  // 体力资质
      [2400, 3000],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_shuimanjinshan', 'skill_gj_mozhixin', 'skill_huigen'],
    captureLocations: ['龙窟'],
  }),

  createSummonTemplate({
    id: 'summon_ruyitongzi',
    name: '如意仙子',
    description: '持有如意的仙子，法力无边',
    icon: '🧚',
    type: 'magic',
    element: 'none',
    rarity: 'rare',
    carryLevel: 65,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2600, 3250],  // 体力资质
      [2600, 3250],  // 法力资质
      [1300, 1625],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_gj_mozhixin', 'skill_gj_taishanyading', 'skill_gj_xingyun'],
    captureLocations: ['凤巢'],
  }),

  // 75级
  createSummonTemplate({
    id: 'summon_furongtongzi',
    name: '芙蓉仙子',
    description: '美丽的芙蓉仙子，擅长法术',
    icon: '🌺',
    type: 'magic',
    element: 'wood',
    rarity: 'rare',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2400, 3000],  // 体力资质
      [2400, 3000],  // 法力资质
      [1400, 1750],  // 速度资质
      [1300, 1625]   // 躲闪资质
    ),
    skills: ['skill_gj_mozhixin', 'skill_gj_bengleizhou', 'skill_gj_minjie'],
    captureLocations: ['凤巢'],
  }),

  createSummonTemplate({
    id: 'summon_xunyoutianshen',
    name: '巡游天神',
    description: '巡视三界的天神',
    icon: '👼',
    type: 'attack',
    element: 'metal',
    rarity: 'rare',
    carryLevel: 75,
    growthRates: [1.195, 1.207, 1.22, 1.232, 1.244],
    aptitudes: createAptitudeConfig(
      [1800, 2250],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2800, 3500],  // 体力资质
      [1200, 1500],  // 法力资质
      [1200, 1500],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_bisha', 'skill_gj_fangyu'],
    captureLocations: ['天宫'],
  }),

  createSummonTemplate({
    id: 'summon_xinglingtongzi',
    name: '星灵仙子',
    description: '来自星空的仙子',
    icon: '✨',
    type: 'magic',
    element: 'metal',
    rarity: 'rare',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1100, 1375],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2500, 3125],  // 体力资质
      [2500, 3125],  // 法力资质
      [1300, 1625],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_gj_bengleizhou', 'skill_gj_mozhixin', 'skill_gj_xingyun'],
    captureLocations: ['天宫'],
  }),

  createSummonTemplate({
    id: 'summon_youling',
    name: '幽灵',
    description: '神秘的幽灵，身法诡异',
    icon: '👻',
    type: 'control',
    element: 'none',
    rarity: 'rare',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1300, 1625],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2200, 2750],  // 体力资质
      [1600, 2000],  // 法力资质
      [1400, 1750],  // 速度资质
      [1500, 1875]   // 躲闪资质
    ),
    skills: ['skill_gj_yezhan', 'skill_gj_guihun', 'skill_gj_zhaojia'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_guijiang',
    name: '鬼将',
    description: '地府的猛将，战斗力惊人',
    icon: '⚔️',
    type: 'attack',
    element: 'none',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.215, 1.227, 1.24, 1.252, 1.264],
    aptitudes: createAptitudeConfig(
      [2000, 2500],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2800, 3500],  // 体力资质
      [1000, 1250],  // 法力资质
      [1200, 1500],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_bisha', 'skill_gj_lianji'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_xixuegui',
    name: '吸血鬼',
    description: '吸血的不死生物',
    icon: '🧛',
    type: 'attack',
    element: 'none',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1700, 2125],  // 攻击资质
      [1200, 1500],  // 防御资质
      [2600, 3250],  // 体力资质
      [1200, 1500],  // 法力资质
      [1300, 1625],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_gj_xixue', 'skill_gj_lianji', 'skill_gj_yezhan'],
    captureLocations: ['地府'],
  }),

  createSummonTemplate({
    id: 'summon_jingpingnvwa',
    name: '净瓶女娲',
    description: '女娲的后裔，持有净瓶',
    icon: '🏺',
    type: 'support',
    element: 'water',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.215, 1.227, 1.24, 1.252, 1.264],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1600, 2000],  // 防御资质
      [3000, 3750],  // 体力资质
      [2400, 3000],  // 法力资质
      [1100, 1375],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_shuimanjinshan', 'skill_gj_huigen', 'skill_gj_zaisheng'],
    captureLocations: ['女娲神迹'],
  }),

  createSummonTemplate({
    id: 'summon_lufanvwa',
    name: '律法女娲',
    description: '执法的女娲后裔',
    icon: '⚖️',
    type: 'attack',
    element: 'metal',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1800, 2250],  // 攻击资质
      [1500, 1875],  // 防御资质
      [2600, 3250],  // 体力资质
      [1200, 1500],  // 法力资质
      [1200, 1500],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_bisha', 'skill_shane_youbao'],
    captureLocations: ['女娲神迹'],
  }),

  createSummonTemplate({
    id: 'summon_lingfunvwa',
    name: '灵符女娲',
    description: '持符的女娲后裔，法力高强',
    icon: '📜',
    type: 'magic',
    element: 'fire',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2400, 3000],  // 体力资质
      [2800, 3500],  // 法力资质
      [1300, 1625],  // 速度资质
      [1100, 1375]   // 躲闪资质
    ),
    skills: ['skill_gj_diyuliehuo', 'skill_gj_bengleizhou', 'skill_xumizhenyan'],
    captureLocations: ['女娲神迹'],
  }),

  createSummonTemplate({
    id: 'summon_dalijingang',
    name: '大力金刚',
    description: '力大无穷的金刚',
    icon: '💪',
    type: 'attack',
    element: 'metal',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.215, 1.227, 1.24, 1.252, 1.264],
    aptitudes: createAptitudeConfig(
      [2200, 2750],  // 攻击资质
      [1400, 1750],  // 防御资质
      [3000, 3750],  // 体力资质
      [800, 1000],   // 法力资质
      [1000, 1250],  // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_bisha', 'skill_lipihuashan'],
    captureLocations: ['小西天'],
  }),

  createSummonTemplate({
    id: 'summon_wuzhongxian',
    name: '雾中仙',
    description: '雾中的仙子，神秘莫测',
    icon: '🌫️',
    type: 'magic',
    element: 'water',
    rarity: 'epic',
    carryLevel: 75,
    growthRates: [1.215, 1.227, 1.24, 1.252, 1.264],
    aptitudes: createAptitudeConfig(
      [1100, 1375],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2400, 3000],  // 体力资质
      [2600, 3250],  // 法力资质
      [1400, 1750],  // 速度资质
      [1500, 1875]   // 躲闪资质
    ),
    skills: ['skill_gj_shuimanjinshan', 'skill_gj_zhaojia', 'skill_gj_minjie'],
    captureLocations: ['凤巢'],
  }),
];

// ==================== 第6批: 85-105级携带召唤兽 ====================

/** 85-105级携带召唤兽 */
export const SUMMON_TIER_85_105: PetTemplate[] = [
  // 85级
  createSummonTemplate({
    id: 'summon_yezhujing',
    name: '野猪精',
    description: '修炼成精的野猪',
    icon: '🐗',
    type: 'attack',
    element: 'none',
    rarity: 'rare',
    carryLevel: 85,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1800, 2250],  // 攻击资质
      [1500, 1875],  // 防御资质
      [3000, 3750],  // 体力资质
      [900, 1125],   // 法力资质
      [1000, 1250],  // 速度资质
      [800, 1000]    // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_fanji', 'skill_gj_fangyu'],
    captureLocations: ['麒麟山'],
  }),

  createSummonTemplate({
    id: 'summon_shuxianfeng',
    name: '鼠先锋',
    description: '成精的老鼠，速度极快',
    icon: '🐀',
    type: 'attack',
    element: 'none',
    rarity: 'rare',
    carryLevel: 85,
    growthRates: [1.205, 1.217, 1.23, 1.242, 1.254],
    aptitudes: createAptitudeConfig(
      [1700, 2125],  // 攻击资质
      [1100, 1375],  // 防御资质
      [2400, 3000],  // 体力资质
      [1000, 1250],  // 法力资质
      [1500, 1875],  // 速度资质
      [1400, 1750]   // 躲闪资质
    ),
    skills: ['skill_gj_lianji', 'skill_gj_minjie', 'skill_gj_touxi'],
    captureLocations: ['麒麟山'],
  }),

  createSummonTemplate({
    id: 'summon_huahun',
    name: '画魂',
    description: '画中的魂魄',
    icon: '🎨',
    type: 'magic',
    element: 'fire',
    rarity: 'epic',
    carryLevel: 85,
    growthRates: [1.216, 1.227, 1.24, 1.252, 1.264],
    aptitudes: createAptitudeConfig(
      [1200, 1500],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2400, 3000],  // 体力资质
      [2800, 3500],  // 法力资质
      [1300, 1625],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_gj_diyuliehuo', 'skill_gj_mozhixin', 'skill_gj_xingyun'],
    captureLocations: ['无名鬼城'],
  }),

  // 95级
  createSummonTemplate({
    id: 'summon_hongexianzi',
    name: '红萼仙子',
    description: '美丽的花仙子',
    icon: '🌹',
    type: 'magic',
    element: 'wood',
    rarity: 'epic',
    carryLevel: 95,
    growthRates: [1.225, 1.237, 1.25, 1.262, 1.275],
    aptitudes: createAptitudeConfig(
      [1300, 1625],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2600, 3250],  // 体力资质
      [2800, 3500],  // 法力资质
      [1400, 1750],  // 速度资质
      [1300, 1625]   // 躲闪资质
    ),
    skills: ['skill_gj_mozhixin', 'skill_gj_taishanyading', 'skill_gj_xingyun'],
    captureLocations: ['蓬莱仙岛'],
  }),

  createSummonTemplate({
    id: 'summon_longgui',
    name: '龙龟',
    description: '龙与龟的后代，防御力惊人',
    icon: '🐢',
    type: 'defense',
    element: 'water',
    rarity: 'epic',
    carryLevel: 95,
    growthRates: [1.225, 1.237, 1.25, 1.262, 1.275],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [2000, 2500],  // 防御资质
      [4000, 5000],  // 体力资质
      [1200, 1500],  // 法力资质
      [800, 1000],   // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_fangyu', 'skill_gj_fanji', 'skill_gj_xingyun'],
    captureLocations: ['蓬莱仙岛'],
  }),

  // 105级
  createSummonTemplate({
    id: 'summon_bashe',
    name: '巴蛇',
    description: '传说中的巨蛇',
    icon: '🐍',
    type: 'attack',
    element: 'wood',
    rarity: 'legendary',
    carryLevel: 105,
    growthRates: [1.234, 1.247, 1.26, 1.272, 1.285],
    aptitudes: createAptitudeConfig(
      [2000, 2500],  // 攻击资质
      [1300, 1625],  // 防御资质
      [2800, 3500],  // 体力资质
      [1200, 1500],  // 法力资质
      [1400, 1750],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_gj_du', 'skill_gj_lianji', 'skill_gj_qiangli'],
    captureLocations: ['墨家禁地'],
  }),

  createSummonTemplate({
    id: 'summon_hundunshou',
    name: '混沌兽',
    description: '来自混沌的怪兽',
    icon: '🌀',
    type: 'balance',
    element: 'none',
    rarity: 'legendary',
    carryLevel: 105,
    growthRates: [1.244, 1.257, 1.27, 1.282, 1.295],
    aptitudes: createAptitudeConfig(
      [1800, 2250],  // 攻击资质
      [1800, 2250],  // 防御资质
      [3600, 4500],  // 体力资质
      [2000, 2500],  // 法力资质
      [1400, 1750],  // 速度资质
      [1400, 1750]   // 躲闪资质
    ),
    skills: ['skill_gj_qiangli', 'skill_gj_fangyu', 'skill_gj_mozhixin'],
    captureLocations: ['混沌境'],
  }),
];

// ==================== 第7批: 115级携带召唤兽 ====================

/** 115级携带召唤兽 */
export const SUMMON_TIER_115: PetTemplate[] = [
  createSummonTemplate({
    id: 'summon_jinshenluohan',
    name: '金身罗汉',
    description: '修炼成金身的罗汉',
    icon: '🧘',
    type: 'defense',
    element: 'metal',
    rarity: 'legendary',
    carryLevel: 115,
    growthRates: [1.244, 1.257, 1.27, 1.282, 1.295],
    aptitudes: createAptitudeConfig(
      [1600, 2000],  // 攻击资质
      [2200, 2750],  // 防御资质
      [4400, 5500],  // 体力资质
      [1400, 1750],  // 法力资质
      [1000, 1250],  // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_gj_fangyu', 'skill_gj_fanji', 'skill_gj_zaisheng', 'skill_gj_xingyun'],
    captureLocations: ['灵山'],
  }),

  createSummonTemplate({
    id: 'summon_manzhushahua',
    name: '曼珠沙华',
    description: '彼岸花精，神秘莫测',
    icon: '🌸',
    type: 'magic',
    element: 'fire',
    rarity: 'legendary',
    carryLevel: 115,
    growthRates: [1.244, 1.257, 1.27, 1.282, 1.295],
    aptitudes: createAptitudeConfig(
      [1400, 1750],  // 攻击资质
      [1400, 1750],  // 防御资质
      [2800, 3500],  // 体力资质
      [3200, 4000],  // 法力资质
      [1600, 2000],  // 速度资质
      [1500, 1875]   // 躲闪资质
    ),
    skills: ['skill_gj_diyuliehuo', 'skill_gj_mozhixin', 'skill_gj_xingyun', 'skill_gj_guihun'],
    captureLocations: ['黄泉'],
  }),
];

// ==================== 第8批: 神兽 ====================

/** 神兽模板 */
export const DIVINE_BEASTS: PetTemplate[] = [
  createSummonTemplate({
    id: 'divine_chaopaopao',
    name: '超级泡泡',
    description: '传说中的超级神兽，圆滚滚十分可爱',
    icon: '🫧',
    type: 'balance',
    element: 'none',
    rarity: 'mythic',
    carryLevel: 0,
    growthRates: [1.2, 1.2, 1.2, 1.25, 1.25],
    aptitudes: createAptitudeConfig(
      [2400, 3000],  // 攻击资质
      [2400, 3000],  // 防御资质
      [4800, 6000],  // 体力资质
      [2400, 3000],  // 法力资质
      [1440, 1800],  // 速度资质
      [1440, 1800]   // 躲闪资质
    ),
    skills: ['skill_cj_bisha', 'skill_cj_xingyun', 'skill_cj_fangyu', 'skill_cj_lianji'],
    captureLocations: [],
  }),

  createSummonTemplate({
    id: 'divine_daxiongmao',
    name: '超级大熊猫',
    description: '传说中的超级神兽，憨态可掬',
    icon: '🐼',
    type: 'defense',
    element: 'wood',
    rarity: 'mythic',
    carryLevel: 0,
    growthRates: [1.2, 1.2, 1.2, 1.25, 1.25],
    aptitudes: createAptitudeConfig(
      [2000, 2500],  // 攻击资质
      [2800, 3500],  // 防御资质
      [5200, 6500],  // 体力资质
      [1600, 2000],  // 法力资质
      [1000, 1250],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_cj_fangyu', 'skill_cj_fanji', 'skill_cj_xingyun', 'skill_cj_qiangli'],
    captureLocations: [],
  }),

  createSummonTemplate({
    id: 'divine_jinhou',
    name: '超级金猴',
    description: '传说中的超级神兽，机灵活泼',
    icon: '🐵',
    type: 'attack',
    element: 'metal',
    rarity: 'mythic',
    carryLevel: 0,
    growthRates: [1.2, 1.2, 1.2, 1.25, 1.25],
    aptitudes: createAptitudeConfig(
      [2800, 3500],  // 攻击资质
      [2000, 2500],  // 防御资质
      [4000, 5000],  // 体力资质
      [1600, 2000],  // 法力资质
      [1600, 2000],  // 速度资质
      [1400, 1750]   // 躲闪资质
    ),
    skills: ['skill_cj_lianji', 'skill_cj_bisha', 'skill_cj_qiangli', 'skill_cj_minjie'],
    captureLocations: [],
  }),

  createSummonTemplate({
    id: 'divine_daxiang',
    name: '超级大象',
    description: '传说中的超级神兽，力大无穷',
    icon: '🐘',
    type: 'attack',
    element: 'earth',
    rarity: 'mythic',
    carryLevel: 0,
    growthRates: [1.2, 1.2, 1.2, 1.25, 1.25],
    aptitudes: createAptitudeConfig(
      [2600, 3250],  // 攻击资质
      [2400, 3000],  // 防御资质
      [5600, 7000],  // 体力资质
      [1200, 1500],  // 法力资质
      [800, 1000],   // 速度资质
      [1000, 1250]   // 躲闪资质
    ),
    skills: ['skill_cj_qiangli', 'skill_cj_fangyu', 'skill_cj_fanji', 'skill_cj_bisha'],
    captureLocations: [],
  }),

  createSummonTemplate({
    id: 'divine_chiyanshou',
    name: '超级赤焰兽',
    description: '传说中的超级神兽，浑身燃烧着火焰',
    icon: '🔥',
    type: 'magic',
    element: 'fire',
    rarity: 'mythic',
    carryLevel: 0,
    growthRates: [1.2, 1.2, 1.2, 1.25, 1.25],
    aptitudes: createAptitudeConfig(
      [1600, 2000],  // 攻击资质
      [1800, 2250],  // 防御资质
      [3600, 4500],  // 体力资质
      [3200, 4000],  // 法力资质
      [1400, 1750],  // 速度资质
      [1200, 1500]   // 躲闪资质
    ),
    skills: ['skill_cj_mozhixin', 'skill_cj_mozhixin', 'skill_cj_xingyun', 'skill_cj_huigen'],
    captureLocations: [],
  }),
];

// ==================== 导出汇总 ====================

/** 所有召唤兽模板（按批次添加） */
export const ALL_SUMMON_TEMPLATES: PetTemplate[] = [
  ...SUMMON_TIER_0,
  ...SUMMON_TIER_5_15,
  ...SUMMON_TIER_25_35,
  ...SUMMON_TIER_45_55,
  ...SUMMON_TIER_65_75,
  ...SUMMON_TIER_85_105,
  ...SUMMON_TIER_115,
  ...DIVINE_BEASTS,
];

/** 按ID获取召唤兽模板 */
export function getSummonTemplateById(id: string): PetTemplate | undefined {
  return ALL_SUMMON_TEMPLATES.find(t => t.id === id);
}

/** 按名称获取召唤兽模板 */
export function getSummonTemplateByName(name: string): PetTemplate | undefined {
  return ALL_SUMMON_TEMPLATES.find(t => t.name === name);
}

/** 按携带等级获取召唤兽列表 */
export function getSummonsByCarryLevel(level: number): PetTemplate[] {
  return ALL_SUMMON_TEMPLATES.filter(t => t.carryLevel <= level);
}

/** 按类型获取召唤兽列表 */
export function getSummonsByType(type: PetType): PetTemplate[] {
  return ALL_SUMMON_TEMPLATES.filter(t => t.type === type);
}

/** 按元素获取召唤兽列表 */
export function getSummonsByElement(element: PetElement): PetTemplate[] {
  return ALL_SUMMON_TEMPLATES.filter(t => t.element === element);
}
