// 物品类型定义

import type { UUID, Quality } from './common';
import type { GemType } from './equipment';

/** 物品类型 */
export type ItemType =
  | 'consumable'   // 消耗品
  | 'material'     // 材料
  | 'key'          // 关键道具
  | 'quest'        // 任务物品
  | 'skill_book'   // 技能书
  | 'gem'          // 宝石
  | 'special';     // 特殊物品（经验丹、金币袋、宝箱等）

/** 使用效果类型 */
export type ItemEffectType =
  | 'heal_hp'          // 恢复HP
  | 'heal_mp'          // 恢复MP
  | 'heal_hp_percent'  // 恢复HP百分比
  | 'heal_mp_percent'  // 恢复MP百分比
  | 'buff'             // 增益效果
  | 'cure'             // 治愈负面状态
  | 'revive'           // 复活
  | 'add_exp'          // 增加经验
  | 'add_gold'         // 增加金币
  | 'open_box';        // 开启宝箱

/** 使用效果 */
export interface ItemEffect {
  type: ItemEffectType;
  value?: number;
  stat?: string;
  duration?: number;
  boxItems?: string[];       // 宝箱可能开出的物品ID列表
}

/** 物品模板 */
export interface ItemTemplate {
  id: UUID;
  name: string;
  description: string;
  icon: string;

  // 类型
  type: ItemType;

  // 品质
  quality: Quality;

  // 最大堆叠
  maxStack: number;

  // 是否可使用
  usable: boolean;

  // 使用效果
  effects?: ItemEffect[];

  // 使用条件
  useRequirements?: {
    minLevel?: number;
    inBattle?: boolean;
    target?: 'self' | 'ally' | 'enemy';
  };

  // 价格
  buyPrice: number;
  sellPrice: number;

  // 获取途径
  sources: string[];

  // 宝石相关属性（仅gem类型）
  gemType?: GemType;
  gemLevel?: number;

  // 材料子类型（仅material类型）
  materialSubType?: 'enhance' | 'reforge' | 'craft' | 'ticket' | 'general';

  // 任务物品相关（仅quest类型）
  questId?: string;
}

/** 物品实例 */
export interface Item {
  id: UUID;
  templateId: string;
  name: string;
  type: ItemType;
  quality: Quality;
  count: number;
  // 宝石相关属性（仅gem类型）
  gemType?: GemType;
  gemLevel?: number;
}

/** 背包 */
export interface Inventory {
  items: Item[];
  maxSlots: number;
  gold: number;
}

/** 商店配置 */
export interface Shop {
  id: string;
  name: string;
  type: 'general' | 'equipment' | 'pet' | 'special';

  // 出售的物品
  items: {
    itemId: string;
    price: number;
    currency: 'gold' | 'token';
    stock?: number;      // 库存（null表示无限）
    restockTime?: number;
    requirements?: {
      minLevel?: number;
      reputation?: number;
    };
  }[];

  // 回收配置
  buybackRate: number;   // 回收价格倍率
}
