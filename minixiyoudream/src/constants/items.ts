// 物品模板数据

import type { ItemTemplate } from '@/types';

/** 消耗品模板 */
export const CONSUMABLE_TEMPLATES: ItemTemplate[] = [
  {
    id: 'item_hp_potion_small',
    name: '小型生命药水',
    description: '恢复50点HP。',
    icon: '🧪',
    type: 'consumable',
    quality: 'common',
    maxStack: 99,
    usable: true,
    effects: [{ type: 'heal_hp', value: 50 }],
    useRequirements: { target: 'self' },
    buyPrice: 50,
    sellPrice: 20,
    sources: ['商店', '掉落'],
  },
  {
    id: 'item_hp_potion_medium',
    name: '中型生命药水',
    description: '恢复150点HP。',
    icon: '🧪',
    type: 'consumable',
    quality: 'rare',
    maxStack: 99,
    usable: true,
    effects: [{ type: 'heal_hp', value: 150 }],
    useRequirements: { minLevel: 10, target: 'self' },
    buyPrice: 150,
    sellPrice: 60,
    sources: ['商店', '掉落'],
  },
  {
    id: 'item_mp_potion_small',
    name: '小型法力药水',
    description: '恢复30点MP。',
    icon: '💧',
    type: 'consumable',
    quality: 'common',
    maxStack: 99,
    usable: true,
    effects: [{ type: 'heal_mp', value: 30 }],
    useRequirements: { target: 'self' },
    buyPrice: 60,
    sellPrice: 25,
    sources: ['商店', '掉落'],
  },
  {
    id: 'item_mp_potion_medium',
    name: '中型法力药水',
    description: '恢复100点MP。',
    icon: '💧',
    type: 'consumable',
    quality: 'rare',
    maxStack: 99,
    usable: true,
    effects: [{ type: 'heal_mp', value: 100 }],
    useRequirements: { minLevel: 10, target: 'self' },
    buyPrice: 180,
    sellPrice: 75,
    sources: ['商店', '掉落'],
  },
];

/** 材料模板 */
export const MATERIAL_TEMPLATES: ItemTemplate[] = [
  {
    id: 'item_iron_ore',
    name: '铁矿石',
    description: '用于打造装备的基础材料。',
    icon: '🪨',
    type: 'material',
    quality: 'common',
    maxStack: 999,
    usable: false,
    buyPrice: 10,
    sellPrice: 5,
    sources: ['采集', '掉落'],
  },
  {
    id: 'item_dragon_scale',
    name: '龙鳞',
    description: '龙的鳞片，可用于打造强力装备。',
    icon: '🐉',
    type: 'material',
    quality: 'epic',
    maxStack: 99,
    usable: false,
    buyPrice: 500,
    sellPrice: 200,
    sources: ['副本掉落'],
  },
  {
    id: 'item_pearl',
    name: '珍珠',
    description: '东海特产的珍珠，价值不菲。',
    icon: '🦪',
    type: 'material',
    quality: 'rare',
    maxStack: 99,
    usable: false,
    buyPrice: 100,
    sellPrice: 40,
    sources: ['副本掉落'],
  },
];

/** 所有物品模板 */
export const ITEM_TEMPLATES: Record<string, ItemTemplate> = {};

// 初始化物品模板映射
[...CONSUMABLE_TEMPLATES, ...MATERIAL_TEMPLATES].forEach((template) => {
  ITEM_TEMPLATES[template.id] = template;
});

/** 获取物品模板 */
export function getItemTemplate(id: string): ItemTemplate | undefined {
  return ITEM_TEMPLATES[id];
}

/** 获取所有消耗品模板 */
export function getConsumableTemplates(): ItemTemplate[] {
  return CONSUMABLE_TEMPLATES;
}

/** 获取所有材料模板 */
export function getMaterialTemplates(): ItemTemplate[] {
  return MATERIAL_TEMPLATES;
}
