// 装备类型定义

import type { UUID, Quality, CombatStats, BaseStats } from './common';
import type { Affix } from './affix';

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

/** 装备模板 */
export interface EquipmentTemplate {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 槽位
  slot: EquipmentSlot;

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
}

/** 套装配置 */
export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 包含的装备模板ID
  pieces: string[];

  // 套装效果
  bonuses: {
    pieceCount: number;
    effects: {
      stat?: keyof CombatStats;
      value: number;
      isPercent: boolean;
      description: string;
    }[];
  }[];
}

/** 强化结果 */
export interface EnhanceResult {
  success: boolean;
  newLevel: number;
  broken: boolean;  // 是否降级
  cost: number;
}

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
