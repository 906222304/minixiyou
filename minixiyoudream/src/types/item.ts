// 物品类型定义

import type { UUID, Quality } from './common';

/** 物品类型 */
export type ItemType =
  | 'consumable'   // 消耗品
  | 'material'     // 材料
  | 'key'          // 关键道具
  | 'quest'        // 任务物品
  | 'skill_book'   // 技能书
  | 'gem'          // 宝石
  | 'capture';     // 捕捉道具

/** 使用效果 */
export interface ItemEffect {
  type: 'heal_hp' | 'heal_mp' | 'buff' | 'cure' | 'revive' | 'capture';
  value?: number;
  stat?: string;
  duration?: number;
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
}

/** 物品实例 */
export interface Item {
  id: UUID;
  templateId: string;
  name: string;
  type: ItemType;
  quality: Quality;
  count: number;
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
