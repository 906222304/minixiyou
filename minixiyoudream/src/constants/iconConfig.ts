// 图标配置 - 支持emoji和图片路径

/** 图标类型 */
export type IconType = 'emoji' | 'image';

/** 图标配置 */
export interface IconConfig {
  type: IconType;
  value: string;  // emoji字符或图片路径
  alt?: string;   // 图片的替代文本
}

/** 图标基础路径 */
export const ICON_BASE_PATH = '/icons';

/** 门派图标映射 */
export const FACTION_ICONS: Record<string, IconConfig> = {
  faction_datang: { type: 'emoji', value: '⚔️', alt: '大唐官府' },
  faction_huasheng: { type: 'emoji', value: '🙏', alt: '化生寺' },
  faction_fangcun: { type: 'emoji', value: '🔮', alt: '方寸山' },
  faction_nver: { type: 'emoji', value: '🌸', alt: '女儿村' },
  faction_longgong: { type: 'emoji', value: '🐉', alt: '龙宫' },
  faction_tiangong: { type: 'emoji', value: '⚡', alt: '天宫' },
  faction_putuo: { type: 'emoji', value: '🪷', alt: '普陀山' },
  faction_wuzhuang: { type: 'emoji', value: '🎋', alt: '五庄观' },
  faction_shituo: { type: 'emoji', value: '🦁', alt: '狮驼岭' },
  faction_mowang: { type: 'emoji', value: '🔥', alt: '魔王寨' },
  faction_difu: { type: 'emoji', value: '💀', alt: '阴曹地府' },
  faction_pansi: { type: 'emoji', value: '🕸️', alt: '盘丝洞' },
};

/** 套装图标映射 */
export const SET_ICONS: Record<string, IconConfig> = {
  set_dingxin: { type: 'emoji', value: '☯️', alt: '定心套装' },
  set_nilin: { type: 'emoji', value: '🐲', alt: '逆鳞套装' },
  set_jingang: { type: 'emoji', value: '🛡️', alt: '金刚套装' },
  set_dinghun: { type: 'emoji', value: '👻', alt: '定魂套装' },
  set_nitian: { type: 'emoji', value: '⭐', alt: '逆天套装' },
  set_hundun: { type: 'emoji', value: '🌌', alt: '混沌套装' },
  set_longhun: { type: 'emoji', value: '💠', alt: '龙魂套装' },
  set_shenwei: { type: 'emoji', value: '🌩️', alt: '神威套装' },
};

/** 神兽图标映射 */
export const DIVINE_BEAST_ICONS: Record<string, IconConfig> = {
  pet_azure_dragon: { type: 'emoji', value: '🐲', alt: '青龙' },
  pet_white_tiger: { type: 'emoji', value: '🐯', alt: '白虎' },
  pet_vermilion_bird: { type: 'emoji', value: '🔥', alt: '朱雀' },
  pet_black_tortoise: { type: 'emoji', value: '🐢', alt: '玄武' },
};

/** 装备特效图标映射 */
export const EFFECT_ICONS: Record<string, IconConfig> = {
  blessing: { type: 'emoji', value: '👼', alt: '神佑' },
  fury: { type: 'emoji', value: '💢', alt: '愤怒' },
  critical: { type: 'emoji', value: '💥', alt: '暴击' },
  precision: { type: 'emoji', value: '🎯', alt: '必中' },
  berserk: { type: 'emoji', value: '👹', alt: '狂暴' },
  thorns: { type: 'emoji', value: '🌵', alt: '荆棘' },
  mystery: { type: 'emoji', value: '🌙', alt: '神秘' },
  sturdy: { type: 'emoji', value: '🛡️', alt: '坚固' },
};

/** 装备特技图标映射 */
export const SKILL_ICONS: Record<string, IconConfig> = {
  po_xue_kuang_gong: { type: 'emoji', value: '⚔️', alt: '破血狂攻' },
  jing_qing_jue: { type: 'emoji', value: '💠', alt: '晶清诀' },
  luo_han_jin_zhong: { type: 'emoji', value: '🔔', alt: '罗汉金钟' },
  ci_hang_pu_du: { type: 'emoji', value: '🧚', alt: '慈航普度' },
  si_hai_sheng_ping: { type: 'emoji', value: '🌈', alt: '四海升平' },
  xiao_li_cang_dao: { type: 'emoji', value: '😏', alt: '笑里藏刀' },
  jue_huan_mo_yin: { type: 'emoji', value: '🎶', alt: '绝幻魔音' },
  xiu_luo_zhou: { type: 'emoji', value: '😈', alt: '修罗咒' },
};

/**
 * 获取图标显示值
 * @param config 图标配置
 * @returns 如果是emoji返回emoji字符，如果是图片返回图片URL
 */
export function getIconDisplay(config: IconConfig): string {
  if (config.type === 'emoji') {
    return config.value;
  }
  return `${ICON_BASE_PATH}/${config.value}`;
}

/**
 * 检查是否使用图片图标
 * @param config 图标配置
 */
export function isImageIcon(config: IconConfig): boolean {
  return config.type === 'image';
}

/**
 * 获取门派图标
 */
export function getFactionIcon(factionId: string): IconConfig {
  return FACTION_ICONS[factionId] || { type: 'emoji', value: '❓', alt: '未知' };
}

/**
 * 获取套装图标
 */
export function getSetIcon(setId: string): IconConfig {
  return SET_ICONS[setId] || { type: 'emoji', value: '❓', alt: '未知' };
}

/**
 * 获取神兽图标
 */
export function getDivineBeastIcon(petId: string): IconConfig {
  return DIVINE_BEAST_ICONS[petId] || { type: 'emoji', value: '❓', alt: '未知' };
}

/**
 * 获取特效图标
 */
export function getEffectIcon(effectId: string): IconConfig {
  return EFFECT_ICONS[effectId] || { type: 'emoji', value: '❓', alt: '未知' };
}

/**
 * 获取特技图标
 */
export function getSkillIcon(skillId: string): IconConfig {
  return SKILL_ICONS[skillId] || { type: 'emoji', value: '❓', alt: '未知' };
}

/**
 * 切换到图片图标模式
 * 调用此函数后，所有图标将使用图片路径
 */
export function enableImageIcons(): void {
  // 门派图标
  for (const key of Object.keys(FACTION_ICONS)) {
    FACTION_ICONS[key] = {
      type: 'image',
      value: `factions/${key}.png`,
      alt: FACTION_ICONS[key].alt,
    };
  }

  // 套装图标
  for (const key of Object.keys(SET_ICONS)) {
    SET_ICONS[key] = {
      type: 'image',
      value: `sets/${key}.png`,
      alt: SET_ICONS[key].alt,
    };
  }

  // 神兽图标
  for (const key of Object.keys(DIVINE_BEAST_ICONS)) {
    DIVINE_BEAST_ICONS[key] = {
      type: 'image',
      value: `pets/${key}.png`,
      alt: DIVINE_BEAST_ICONS[key].alt,
    };
  }

  // 特效图标
  for (const key of Object.keys(EFFECT_ICONS)) {
    EFFECT_ICONS[key] = {
      type: 'image',
      value: `effects/${key}.png`,
      alt: EFFECT_ICONS[key].alt,
    };
  }

  // 特技图标
  for (const key of Object.keys(SKILL_ICONS)) {
    SKILL_ICONS[key] = {
      type: 'image',
      value: `skills/${key}.png`,
      alt: SKILL_ICONS[key].alt,
    };
  }
}
