// 装备类型定义

import type { UUID, Quality, CombatStats, BaseStats } from './common';
import type { Affix } from './affix';

// ==================== 门派专属武器类型 ====================

/** 武器类型 */
export type WeaponType =
  | 'sword'    // 剑
  | 'blade'    // 刀
  | 'staff'    // 法杖
  | 'fan'      // 扇
  | 'spear'    // 枪
  | 'hammer'   // 锤
  | 'ribbon'   // 飘带
  | 'claw';    // 爪

/** 门派ID类型 */
export type FactionId =
  | 'faction_datang'    // 大唐官府
  | 'faction_huasheng'  // 化生寺
  | 'faction_fangcun'   // 方寸山
  | 'faction_nver'      // 女儿村
  | 'faction_longgong'  // 龙宫
  | 'faction_tiangong'  // 天宫
  | 'faction_putuo'     // 普陀山
  | 'faction_wuzhuang'  // 五庄观
  | 'faction_shituo'    // 狮驼岭
  | 'faction_mowang'    // 魔王寨
  | 'faction_difu'      // 阴曹地府
  | 'faction_pansi';    // 盘丝洞

/** 门派专属武器映射 */
export const FACTION_WEAPONS: Record<FactionId, WeaponType[]> = {
  faction_datang: ['sword', 'blade'],        // 大唐官府: 剑、刀
  faction_huasheng: ['staff', 'fan'],        // 化生寺: 法杖、扇
  faction_fangcun: ['sword', 'fan'],         // 方寸山: 剑、扇
  faction_nver: ['ribbon', 'fan'],           // 女儿村: 飘带、扇
  faction_longgong: ['staff', 'fan'],        // 龙宫: 法杖、扇
  faction_tiangong: ['spear', 'hammer'],     // 天宫: 枪、锤
  faction_putuo: ['staff', 'ribbon'],        // 普陀山: 法杖、飘带
  faction_wuzhuang: ['sword', 'fan'],        // 五庄观: 剑、扇
  faction_shituo: ['hammer', 'claw'],        // 狮驼岭: 锤、爪
  faction_mowang: ['staff', 'fan'],          // 魔王寨: 法杖、扇
  faction_difu: ['sword', 'claw'],           // 阴曹地府: 剑、爪
  faction_pansi: ['ribbon', 'fan'],          // 盘丝洞: 飘带、扇
};

/** 武器类型名称 */
export const WEAPON_TYPE_NAMES: Record<WeaponType, string> = {
  sword: '剑',
  blade: '刀',
  staff: '法杖',
  fan: '扇',
  spear: '枪',
  hammer: '锤',
  ribbon: '飘带',
  claw: '爪',
};

// ==================== 装备槽位 ====================

/** 装备槽位 */
export type EquipmentSlot =
  | 'weapon'    // 武器
  | 'helmet'    // 头盔
  | 'armor'     // 衣服
  | 'boots'     // 鞋子
  | 'belt'      // 腰带
  | 'necklace'  // 项链
  | 'charm'     // 护符
  | 'ring1'     // 戒指1
  | 'ring2';    // 戒指2

/** 所有装备槽位 */
export type EquipmentSlots = {
  [K in EquipmentSlot]: Equipment | null;
};

// ==================== 宝石系统 ====================

/** 宝石类型 */
export type GemType =
  | 'ruby'     // 红宝石 - 力量
  | 'sapphire' // 蓝宝石 - 灵力
  | 'emerald'  // 绿宝石 - 体质
  | 'topaz'    // 黄宝石 - 敏捷
  | 'amethyst' // 紫宝石 - 魔力
  | 'diamond'; // 钻石 - 全属性

/** 宝石 */
export interface Gem {
  id: UUID;
  type: GemType;
  level: number;  // 1-6级
  name: string;
  statBonus: Partial<BaseStats>;
}

// ==================== 特效和特技系统 ====================

/** 装备特效类型 - 被动效果 */
export type EquipmentEffectType =
  | 'blessing'    // 神佑: 死亡时有概率复活
  | 'fury'        // 愤怒: 增加怒气获取
  | 'critical'    // 暴击: 增加暴击率
  | 'precision'   // 必中: 攻击必中
  | 'berserk'     // 狂暴: 低血量增加伤害
  | 'thorns'      // 荆棘: 反弹伤害
  | 'mystery'     // 神秘: 法术躲避
  | 'sturdy';     // 坚固: 减少装备损坏

/** 特技类型 - 主动技能 */
export type SpecialSkillType =
  | 'po_xue_kuang_gong'  // 破血狂攻
  | 'jing_qing_jue'      // 晶清诀
  | 'luo_han_jin_zhong'  // 罗汉金钟
  | 'ci_hang_pu_du'      // 慈航普度
  | 'si_hai_sheng_ping'  // 四海升平
  | 'xiao_li_cang_dao'   // 笑里藏刀
  | 'jue_huan_mo_yin'    // 绝幻魔音
  | 'xiu_luo_zhou';      // 修罗咒

/** 装备特效（被动） */
export interface EquipmentSpecialEffect {
  type: EquipmentEffectType;
  name: string;
  description: string;
  value: number;
}

/** 装备特技（主动） */
export interface EquipmentSpecialSkill {
  type: SpecialSkillType;
  name: string;
  description: string;
  rageCost: number;
  cooldown: number;
  currentCooldown?: number;
}

// ==================== 套装系统 ====================

/** 套装效果类型 */
export type SetBonusType =
  | 'stat_flat'      // 固定属性加成
  | 'stat_percent'   // 百分比属性加成
  | 'special'        // 特殊效果
  | 'immunity';      // 免疫效果

/** 套装效果配置 */
export interface SetBonusEffect {
  type: SetBonusType;
  stat?: keyof CombatStats;
  value: number;
  isPercent: boolean;
  description: string;
  specialData?: {
    effectType: string;
    value?: number;
    duration?: number;
  };
}

/** 套装配置 */
export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 包含的装备模板ID
  pieces?: string[];

  // 套装品质
  quality?: Quality;

  // 等级要求
  levelRequirement?: number;

  // 套装效果
  bonuses: {
    pieceCount: number;
    effects: SetBonusEffect[];
  }[];
}

// ==================== 装备模板 ====================

/** 装备模板 */
export interface EquipmentTemplate {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 槽位
  slot: EquipmentSlot;

  // 武器类型（仅武器有）
  weaponType?: WeaponType;

  // 限制门派（仅武器有）
  restrictedFactions?: FactionId[];

  // 基础品质范围
  baseQuality: Quality;

  // 基础属性
  baseStats: Partial<CombatStats>;

  // 宝石槽位数量
  gemSlots: number;

  // 强化上限
  maxEnhance: number;

  // 套装ID
  setId?: string;

  // 等级要求
  levelRequirement: number;

  // 可镶嵌宝石类型
  allowedGems: GemType[];
}

// ==================== 装备实例 ====================

/** 装备实例 */
export interface Equipment {
  id: UUID;
  templateId: string;
  name: string;

  // 品质
  quality: Quality;

  // 强化等级
  enhanceLevel: number;

  // 基础属性（基于模板）
  baseStats: Partial<CombatStats>;

  // 词条列表
  affixes: Affix[];

  // 镶嵌的宝石
  gems: (Gem | null)[];

  // 套装ID
  setId?: string;

  // 所属角色ID
  ownerId?: string;

  // 特效（被动效果）
  specialEffect?: EquipmentSpecialEffect;

  // 特技（主动技能）
  specialSkill?: EquipmentSpecialSkill;

  // 耐久度
  durability?: number;
  maxDurability?: number;
}

// ==================== 强化系统 ====================

/** 强化结果 */
export interface EnhanceResult {
  success: boolean;
  newLevel: number;
  broken: boolean;  // 是否降级
  destroyed: boolean; // 是否碎裂
  cost: number;
}

/** 强化配置 */
export interface EnhancementConfig {
  // 等级范围
  levelRange: [number, number];
  // 成功率
  successRate: number;
  // 失败降级数
  downgradeOnFail: number;
  // 是否可能碎裂
  canDestroy: boolean;
  // 碎裂概率
  destroyChance?: number;
  // 消耗金币基数
  costBase: number;
  // 消耗金币倍率
  costMultiplier: number;
}

/** 强化保底状态 */
export interface EnhancementPityState {
  consecutiveFails: number;
  guaranteedSuccess: boolean;
}

// ==================== 辅助函数 ====================

/** 创建空的装备槽位 */
export function createEmptyEquipmentSlots(): EquipmentSlots {
  return {
    weapon: null,
    helmet: null,
    armor: null,
    boots: null,
    belt: null,
    necklace: null,
    charm: null,
    ring1: null,
    ring2: null,
  };
}

/** 检查门派是否能使用武器 */
export function canFactionUseWeapon(factionId: FactionId, weaponType: WeaponType): boolean {
  const allowedWeapons = FACTION_WEAPONS[factionId];
  return allowedWeapons?.includes(weaponType) ?? false;
}

/** 获取武器可用的门派列表 */
export function getWeaponAllowedFactions(weaponType: WeaponType): FactionId[] {
  return Object.entries(FACTION_WEAPONS)
    .filter(([_, weapons]) => weapons.includes(weaponType))
    .map(([factionId]) => factionId as FactionId);
}
