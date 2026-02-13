/**
 * 数据迁移脚本
 * 从 xiyou/assets/data/config 读取 JSON 数据并生成 TypeScript 常量文件
 *
 * 运行方式: npx tsx minixiyou/scripts/migrateData.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============== 配置 ==============

const CONFIG = {
  sourceDir: '../../xiyou/assets/data/config',
  targetDir: '../constants/migrated',
  scalingFactors: {
    attack: 0.1,
    defense: 0.1,
    hp: 0.01,
    price: 0.1,
  },
};

// ============== 工具函数 ==============

function convertId(oldId: number, prefix: string): string {
  return `xiyou-${prefix}-${oldId.toString().padStart(4, '0')}`;
}

function cleanName(name: string): string {
  return name
    .replace(/【|】|〖|〗/g, '')
    .replace(/（绝版）|（典藏版）/g, '')
    .trim();
}

function inferRarity(price: number = 0, level: number = 1): string {
  const score = price + level * 100;
  if (score >= 50000) return '仙品';
  if (score >= 10000) return '传说';
  if (score >= 2000) return '稀有';
  return '普通';
}

function inferRarityFromName(name: string): string | null {
  if (name.includes('绝版') || name.includes('圣祖') || name.includes('大圣')) {
    return '仙品';
  }
  if (name.includes('典藏') || name.includes('混沌') || name.includes('玄女')) {
    return '传说';
  }
  if (name.includes('〖') || name.includes('【')) {
    return '稀有';
  }
  return null;
}

function scaleValue(value: number | undefined, factor: number): number {
  if (value === undefined || value === null) return 0;
  return Math.floor(value * factor);
}

function inferItemType(item: any): string {
  const name = item.name || '';

  if (name.includes('丹') || name.includes('药') || name.includes('回城')) {
    return '消耗品';
  }
  if (name.includes('宝石') || name.includes('晶石') || /石[一二三四五六七八九十]/.test(name)) {
    return '宝石';
  }
  if (name.includes('任务') || name.includes('凭证')) {
    return '任务物品';
  }
  return '材料';
}

const EQUIPMENT_SLOTS: Record<number, string> = {
  3: '武器',
  5: '头部',
  6: '鞋子',
  7: '饰品',
  8: '戒指',
};

function mapEquipmentSlot(category: number | undefined): string {
  if (category === undefined) return '饰品';
  return EQUIPMENT_SLOTS[category] || '饰品';
}

// ============== 迁移函数 ==============

interface MigratedItem {
  id: string;
  originalId: number;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  level?: number;
}

interface MigratedEquipment {
  id: string;
  originalId: number;
  name: string;
  description: string;
  rarity: string;
  level: number;
  equipmentSlot: string;
  faction?: number;
  price: number;
  effect: {
    hp: number;
    attack: number;
    defense: number;
    spirit: number;
  };
}

function migrateItems(items: any[]): { data: MigratedItem[]; mapping: Record<number, string> } {
  const data: MigratedItem[] = [];
  const mapping: Record<number, string> = {};

  for (const item of items) {
    const newId = convertId(item.id, 'item');
    mapping[item.id] = newId;

    const nameRarity = inferRarityFromName(item.name);
    const rarity = nameRarity || inferRarity(item.price, item.level);

    data.push({
      id: newId,
      originalId: item.id,
      name: cleanName(item.name),
      description: (item.description || '').replace(/'/g, "\\'"),
      type: inferItemType(item),
      rarity,
      price: scaleValue(item.price, CONFIG.scalingFactors.price),
      level: item.level,
    });
  }

  return { data, mapping };
}

function migrateEquipment(equipment: any[]): { data: MigratedEquipment[]; mapping: Record<number, string> } {
  const data: MigratedEquipment[] = [];
  const mapping: Record<number, string> = {};

  for (const equip of equipment) {
    const newId = convertId(equip.id, 'equip');
    mapping[equip.id] = newId;

    const nameRarity = inferRarityFromName(equip.name);
    const rarity = nameRarity || inferRarity(equip.price, equip.level);

    data.push({
      id: newId,
      originalId: equip.id,
      name: cleanName(equip.name),
      description: (equip.description || '').replace(/'/g, "\\'"),
      rarity,
      level: equip.level || 1,
      equipmentSlot: mapEquipmentSlot(equip.category),
      faction: equip.faction,
      price: scaleValue(equip.price, CONFIG.scalingFactors.price),
      effect: {
        hp: scaleValue(equip.hp, CONFIG.scalingFactors.hp),
        attack: scaleValue(equip.attack, CONFIG.scalingFactors.attack),
        defense: scaleValue(equip.defense, CONFIG.scalingFactors.defense),
        spirit: scaleValue(equip.magicAttack, CONFIG.scalingFactors.attack * 0.5),
      },
    });
  }

  return { data, mapping };
}

// ============== 文件生成 ==============

function generateItemsFile(data: MigratedItem[], mapping: Record<number, string>): string {
  const itemsStr = data.map(item => `  {
    id: '${item.id}',
    originalId: ${item.originalId},
    name: '${item.name}',
    description: '${item.description}',
    type: '${item.type}' as const,
    rarity: '${item.rarity}' as const,
    price: ${item.price},
    ${item.level ? `level: ${item.level},` : ''}
  }`).join(',\n');

  const mappingStr = Object.entries(mapping)
    .map(([k, v]) => `  ${k}: '${v}'`)
    .join(',\n');

  return `/**
 * 物品数据 - 从 xiyou/assets/data/config/items.json 迁移
 * 自动生成 - ${new Date().toISOString().split('T')[0]}
 * 总数: ${data.length} 条
 */

import { MigratedItem } from '../../types/xiyou';

/** 迁移后的物品数据 */
export const MIGRATED_ITEMS: MigratedItem[] = [
${itemsStr}
];

/** 物品ID映射 (原始ID -> 新ID) */
export const ITEM_ID_MAPPING: Record<number, string> = {
${mappingStr}
};

/** 物品总数 */
export const TOTAL_ITEMS = MIGRATED_ITEMS.length;

/** 按类型分组的物品 */
export const ITEMS_BY_TYPE = {
  消耗品: MIGRATED_ITEMS.filter(i => i.type === '消耗品'),
  宝石: MIGRATED_ITEMS.filter(i => i.type === '宝石'),
  任务物品: MIGRATED_ITEMS.filter(i => i.type === '任务物品'),
  材料: MIGRATED_ITEMS.filter(i => i.type === '材料'),
};

/** 按稀有度分组的物品 */
export const ITEMS_BY_RARITY = {
  普通: MIGRATED_ITEMS.filter(i => i.rarity === '普通'),
  稀有: MIGRATED_ITEMS.filter(i => i.rarity === '稀有'),
  传说: MIGRATED_ITEMS.filter(i => i.rarity === '传说'),
  仙品: MIGRATED_ITEMS.filter(i => i.rarity === '仙品'),
};
`;
}

function generateEquipmentFile(data: MigratedEquipment[], mapping: Record<number, string>): string {
  const equipStr = data.map(equip => `  {
    id: '${equip.id}',
    originalId: ${equip.originalId},
    name: '${equip.name}',
    description: '${equip.description}',
    rarity: '${equip.rarity}' as const,
    level: ${equip.level},
    equipmentSlot: '${equip.equipmentSlot}' as const,
    ${equip.faction ? `faction: ${equip.faction},` : ''}
    price: ${equip.price},
    effect: {
      hp: ${equip.effect.hp},
      attack: ${equip.effect.attack},
      defense: ${equip.effect.defense},
      spirit: ${equip.effect.spirit},
    },
  }`).join(',\n');

  const mappingStr = Object.entries(mapping)
    .map(([k, v]) => `  ${k}: '${v}'`)
    .join(',\n');

  return `/**
 * 装备数据 - 从 xiyou/assets/data/config/equipment.json 迁移
 * 自动生成 - ${new Date().toISOString().split('T')[0]}
 * 总数: ${data.length} 条
 */

import { MigratedEquipment, MigratedEquipmentSlot } from '../../types/xiyou';

/** 迁移后的装备数据 */
export const MIGRATED_EQUIPMENT: MigratedEquipment[] = [
${equipStr}
];

/** 装备ID映射 (原始ID -> 新ID) */
export const EQUIPMENT_ID_MAPPING: Record<number, string> = {
${mappingStr}
};

/** 装备总数 */
export const TOTAL_EQUIPMENT = MIGRATED_EQUIPMENT.length;

/** 按槽位分组的装备 */
export const EQUIPMENT_BY_SLOT: Record<MigratedEquipmentSlot, MigratedEquipment[]> = {
  武器: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '武器'),
  头部: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '头部'),
  肩部: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '肩部'),
  胸部: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '胸部'),
  手套: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '手套'),
  腿部: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '腿部'),
  鞋子: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '鞋子'),
  饰品: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '饰品'),
  戒指: MIGRATED_EQUIPMENT.filter(e => e.equipmentSlot === '戒指'),
};

/** 按稀有度分组的装备 */
export const EQUIPMENT_BY_RARITY = {
  普通: MIGRATED_EQUIPMENT.filter(e => e.rarity === '普通'),
  稀有: MIGRATED_EQUIPMENT.filter(e => e.rarity === '稀有'),
  传说: MIGRATED_EQUIPMENT.filter(e => e.rarity === '传说'),
  仙品: MIGRATED_EQUIPMENT.filter(e => e.rarity === '仙品'),
};
`;
}

// ============== 主函数 ==============

async function main() {
  console.log('开始数据迁移...\n');

  const sourceDir = path.resolve(__dirname, CONFIG.sourceDir);
  const targetDir = path.resolve(__dirname, CONFIG.targetDir);

  // 迁移物品数据
  console.log('正在迁移物品数据...');
  try {
    const itemsPath = path.join(sourceDir, 'items.json');
    const itemsRaw = fs.readFileSync(itemsPath, 'utf-8');
    const itemsJson = JSON.parse(itemsRaw);
    const items = itemsJson.items || itemsJson;

    const { data: itemsData, mapping: itemsMapping } = migrateItems(items);
    const itemsFile = generateItemsFile(itemsData, itemsMapping);
    fs.writeFileSync(path.join(targetDir, 'items.ts'), itemsFile, 'utf-8');

    console.log(`  ✓ 物品迁移完成: ${itemsData.length} 条`);
  } catch (error) {
    console.error('  ✗ 物品迁移失败:', error);
  }

  // 迁移装备数据
  console.log('\n正在迁移装备数据...');
  try {
    const equipPath = path.join(sourceDir, 'equipment.json');
    const equipRaw = fs.readFileSync(equipPath, 'utf-8');
    const equipJson = JSON.parse(equipRaw);
    const equipment = equipJson.equipment || equipJson;

    const { data: equipData, mapping: equipMapping } = migrateEquipment(equipment);
    const equipFile = generateEquipmentFile(equipData, equipMapping);
    fs.writeFileSync(path.join(targetDir, 'equipment.ts'), equipFile, 'utf-8');

    console.log(`  ✓ 装备迁移完成: ${equipData.length} 条`);
  } catch (error) {
    console.error('  ✗ 装备迁移失败:', error);
  }

  console.log('\n迁移完成！');
}

main().catch(console.error);
