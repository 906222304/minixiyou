// 商店配置数据

import type { ItemTemplate } from '@/types';
import { CONSUMABLE_TEMPLATES, MATERIAL_TEMPLATES } from './items';

/** 商店物品配置 */
export interface ShopItem {
  itemTemplateId: string;
  stock?: number;        // 库存，undefined表示无限
  discount?: number;     // 折扣 0-1，例如0.8表示8折
  levelRequirement?: number;
}

/** 商店配置 */
export interface ShopConfig {
  id: string;
  name: string;
  description?: string;
  items: ShopItem[];
  buyMultiplier?: number;  // 收购价格倍率
}

/** 所有商店配置 */
export const SHOP_CONFIGS: Record<string, ShopConfig> = {
  // 东海村鱼店
  shop_fish: {
    id: 'shop_fish',
    name: '渔夫的小店',
    description: '新鲜的海产品和简单补给',
    items: [
      { itemTemplateId: 'item_hp_potion_small', stock: 20 },
      { itemTemplateId: 'item_mp_potion_small', stock: 20 },
      { itemTemplateId: 'item_cure_pill', stock: 10 },
      { itemTemplateId: 'item_fish_scale', stock: 10 },
      { itemTemplateId: 'item_crab_shell', stock: 10 },
    ],
    buyMultiplier: 0.8,
  },

  // 长安城杂货店
  shop_general: {
    id: 'shop_general',
    name: '杂货铺',
    description: '应有尽有的杂货店',
    items: [
      { itemTemplateId: 'item_hp_potion_small', stock: 50 },
      { itemTemplateId: 'item_hp_potion_medium', stock: 30, levelRequirement: 10 },
      { itemTemplateId: 'item_mp_potion_small', stock: 50 },
      { itemTemplateId: 'item_mp_potion_medium', stock: 30, levelRequirement: 10 },
      { itemTemplateId: 'item_cure_pill', stock: 30 },
      { itemTemplateId: 'item_enhance_stone', stock: 20 },
      { itemTemplateId: 'item_iron_ore', stock: 50 },
      { itemTemplateId: 'item_copper_ore', stock: 50 },
    ],
    buyMultiplier: 0.9,
  },

  // 长安城药店
  shop_medicine: {
    id: 'shop_medicine',
    name: '杨家药铺',
    description: '各种丹药和医疗用品',
    items: [
      { itemTemplateId: 'item_hp_potion_small', stock: 100 },
      { itemTemplateId: 'item_hp_potion_medium', stock: 60, levelRequirement: 10 },
      { itemTemplateId: 'item_hp_potion_large', stock: 30, levelRequirement: 20 },
      { itemTemplateId: 'item_mp_potion_small', stock: 100 },
      { itemTemplateId: 'item_mp_potion_medium', stock: 60, levelRequirement: 10 },
      { itemTemplateId: 'item_mp_potion_large', stock: 30, levelRequirement: 20 },
      { itemTemplateId: 'item_cure_pill', stock: 50 },
      { itemTemplateId: 'item_exp_pill_small', stock: 20 },
      { itemTemplateId: 'item_exp_pill_medium', stock: 10, levelRequirement: 10 },
    ],
    buyMultiplier: 0.85,
  },

  // 大唐都城西域商人
  shop_exotic: {
    id: 'shop_exotic',
    name: '西域珍宝阁',
    description: '来自西域的珍稀物品',
    items: [
      { itemTemplateId: 'item_hp_potion_large', stock: 20, levelRequirement: 20 },
      { itemTemplateId: 'item_mp_potion_large', stock: 20, levelRequirement: 20 },
      { itemTemplateId: 'item_enhance_stone_advanced', stock: 15 },
      { itemTemplateId: 'item_reforge_stone', stock: 15 },
      { itemTemplateId: 'item_protection_charm', stock: 10 },
      { itemTemplateId: 'item_exp_pill_large', stock: 5, levelRequirement: 15 },
      { itemTemplateId: 'item_pearl', stock: 10 },
    ],
    buyMultiplier: 1.0,
  },

  // 大唐都城兵器铺
  shop_weapons: {
    id: 'shop_weapons',
    name: '神兵阁',
    description: '各种兵器装备',
    items: [
      { itemTemplateId: 'item_enhance_stone', stock: 30 },
      { itemTemplateId: 'item_enhance_stone_advanced', stock: 15 },
      { itemTemplateId: 'item_enhance_stone_supreme', stock: 5, levelRequirement: 25 },
      { itemTemplateId: 'item_lucky_charm', stock: 5, levelRequirement: 20 },
      { itemTemplateId: 'item_iron_ore', stock: 100 },
      { itemTemplateId: 'item_silver_ore', stock: 50, levelRequirement: 15 },
      { itemTemplateId: 'item_gold_ore', stock: 20, levelRequirement: 25 },
    ],
    buyMultiplier: 0.9,
  },

  // 大唐都城防具店
  shop_armors: {
    id: 'shop_armors',
    name: '护甲坊',
    description: '坚固的防具装备',
    items: [
      { itemTemplateId: 'item_enhance_stone', stock: 30 },
      { itemTemplateId: 'item_enhance_stone_advanced', stock: 15 },
      { itemTemplateId: 'item_protection_charm', stock: 10 },
      { itemTemplateId: 'item_fur', stock: 50 },
      { itemTemplateId: 'item_leather', stock: 30 },
      { itemTemplateId: 'item_iron_ore', stock: 100 },
    ],
    buyMultiplier: 0.9,
  },

  // 副本商店
  shop_dungeon: {
    id: 'shop_dungeon',
    name: '冒险者补给站',
    description: '副本探险必备品',
    items: [
      { itemTemplateId: 'item_hp_potion_medium', stock: 50, levelRequirement: 10 },
      { itemTemplateId: 'item_hp_potion_large', stock: 30, levelRequirement: 20 },
      { itemTemplateId: 'item_mp_potion_medium', stock: 50, levelRequirement: 10 },
      { itemTemplateId: 'item_mp_potion_large', stock: 30, levelRequirement: 20 },
      { itemTemplateId: 'item_full_restore', stock: 10, levelRequirement: 25 },
      { itemTemplateId: 'item_cure_pill', stock: 30 },
      { itemTemplateId: 'item_ticket_spider_cave', stock: 5 },
      { itemTemplateId: 'item_ticket_dayan_ta', stock: 3, levelRequirement: 15 },
    ],
    buyMultiplier: 1.1,
  },
};

/** 获取商店配置 */
export function getShopConfig(shopId: string): ShopConfig | undefined {
  return SHOP_CONFIGS[shopId];
}

/** 获取商店物品模板列表 */
export function getShopItemTemplates(shopId: string): (ShopItem & { template: ItemTemplate })[] {
  const shop = SHOP_CONFIGS[shopId];
  if (!shop) return [];

  const allTemplates = [...CONSUMABLE_TEMPLATES, ...MATERIAL_TEMPLATES];
  const templateMap = new Map(allTemplates.map(t => [t.id, t]));

  return shop.items
    .filter(shopItem => templateMap.has(shopItem.itemTemplateId))
    .map(shopItem => ({
      ...shopItem,
      template: templateMap.get(shopItem.itemTemplateId)!,
    }));
}

/** 获取所有商店ID列表 */
export function getAllShopIds(): string[] {
  return Object.keys(SHOP_CONFIGS);
}
