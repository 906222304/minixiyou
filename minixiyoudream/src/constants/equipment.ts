// 装备模板数据

import type { EquipmentTemplate, EquipmentSlot } from '@/types';

/** 武器模板 */
export const WEAPON_TEMPLATES: EquipmentTemplate[] = [
  {
    id: 'equip_sword_1',
    name: '新手剑',
    description: '一把普通的铁剑，适合新手使用。',
    icon: '🗡️',
    slot: 'weapon',
    baseQuality: 'common',
    baseStats: { physicalAttack: 10 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['ruby', 'diamond'],
  },
  {
    id: 'equip_staff_1',
    name: '新手法杖',
    description: '一根简单的木杖，蕴含微弱的魔力。',
    icon: '🪄',
    slot: 'weapon',
    baseQuality: 'common',
    baseStats: { magicAttack: 12 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['sapphire', 'amethyst', 'diamond'],
  },
  {
    id: 'equip_sword_2',
    name: '精钢剑',
    description: '由精钢打造的剑，锋利无比。',
    icon: '⚔️',
    slot: 'weapon',
    baseQuality: 'rare',
    baseStats: { physicalAttack: 25, critRate: 0.02 },
    gemSlots: 2,
    maxEnhance: 12,
    levelRequirement: 10,
    allowedGems: ['ruby', 'topaz', 'diamond'],
  },
];

/** 防具模板 */
export const ARMOR_TEMPLATES: EquipmentTemplate[] = [
  {
    id: 'equip_helmet_1',
    name: '布帽',
    description: '普通的布帽，提供微弱的防护。',
    icon: '🧢',
    slot: 'helmet',
    baseQuality: 'common',
    baseStats: { physicalDefense: 5, maxHp: 20 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['emerald', 'diamond'],
  },
  {
    id: 'equip_armor_1',
    name: '布衣',
    description: '简单的布衣，聊胜于无。',
    icon: '👕',
    slot: 'armor',
    baseQuality: 'common',
    baseStats: { physicalDefense: 8, magicDefense: 5, maxHp: 30 },
    gemSlots: 2,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['emerald', 'sapphire', 'diamond'],
  },
  {
    id: 'equip_boots_1',
    name: '布鞋',
    description: '轻便的布鞋，行走无声。',
    icon: '👟',
    slot: 'boots',
    baseQuality: 'common',
    baseStats: { speed: 5, dodgeRate: 0.01 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['topaz', 'diamond'],
  },
  {
    id: 'equip_belt_1',
    name: '皮带',
    description: '普通的皮带，可以挂载物品。',
    icon: '👙',
    slot: 'belt',
    baseQuality: 'common',
    baseStats: { maxHp: 25 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['emerald', 'diamond'],
  },
];

/** 饰品模板 */
export const ACCESSORY_TEMPLATES: EquipmentTemplate[] = [
  {
    id: 'equip_necklace_1',
    name: '铜项链',
    description: '简单的铜制项链。',
    icon: '📿',
    slot: 'necklace',
    baseQuality: 'common',
    baseStats: { magicDefense: 5, maxMp: 20 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['sapphire', 'amethyst', 'diamond'],
  },
  {
    id: 'equip_charm_1',
    name: '护身符',
    description: '据说能带来好运的护身符。',
    icon: '🔱',
    slot: 'charm',
    baseQuality: 'common',
    baseStats: { critRate: 0.01, dodgeRate: 0.01 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['topaz', 'amethyst', 'diamond'],
  },
  {
    id: 'equip_ring_1',
    name: '铜戒指',
    description: '普通的铜戒指。',
    icon: '💍',
    slot: 'ring1',
    baseQuality: 'common',
    baseStats: { physicalAttack: 3, magicAttack: 3 },
    gemSlots: 1,
    maxEnhance: 10,
    levelRequirement: 1,
    allowedGems: ['ruby', 'sapphire', 'diamond'],
  },
];

/** 所有装备模板 */
export const EQUIPMENT_TEMPLATES: Record<string, EquipmentTemplate> = {};

// 初始化装备模板映射
[...WEAPON_TEMPLATES, ...ARMOR_TEMPLATES, ...ACCESSORY_TEMPLATES].forEach((template) => {
  EQUIPMENT_TEMPLATES[template.id] = template;
});

/** 获取装备模板 */
export function getEquipmentTemplate(id: string): EquipmentTemplate | undefined {
  return EQUIPMENT_TEMPLATES[id];
}

/** 获取指定槽位的装备模板列表 */
export function getEquipmentTemplatesBySlot(slot: EquipmentSlot): EquipmentTemplate[] {
  return Object.values(EQUIPMENT_TEMPLATES).filter((t) => t.slot === slot);
}

/** 获取所有装备模板 */
export function getAllEquipmentTemplates(): EquipmentTemplate[] {
  return Object.values(EQUIPMENT_TEMPLATES);
}
