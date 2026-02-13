/**
 * xiyou 数据迁移工具函数
 * 用于将 PHP 项目的数据转换为 TypeScript 项目格式
 */

import {
  XiyouItem,
  XiyouEquipment,
  XiyouPet,
  XiyouDungeon,
  XiyouDrops,
  XiyouExpTable,
  MigratedItem,
  MigratedEquipment,
  MigratedPet,
  MigratedDungeon,
  MigratedDropTable,
  MigratedExpTable,
  MigratedRarity,
  MigratedItemType,
  MigratedEquipmentSlot,
  MigrationConfig,
  MigrationResult,
  XIYOU_EQUIPMENT_SLOTS,
  XIYOU_DIFFICULTIES,
  XIYOU_DUNGEON_NAMES,
} from '../types/xiyou';

// ============== 默认配置 ==============

/** 默认迁移配置 */
export const DEFAULT_MIGRATION_CONFIG: MigrationConfig = {
  idPrefix: 'xiyou',
  inferRarity: true,
  preserveOriginalId: true,
  mapElementToPhysical: true,
  scalingFactors: {
    attack: 0.1,
    defense: 0.1,
    hp: 0.01,
    price: 0.1,
  },
};

// ============== 工具函数 ==============

/**
 * 将数字ID转换为字符串ID
 * @param oldId 原始数字ID
 * @param prefix ID前缀 (item, equip, pet, dungeon)
 * @returns 字符串ID
 */
export const convertId = (oldId: number, prefix: string): string => {
  return `xiyou-${prefix}-${oldId.toString().padStart(4, '0')}`;
};

/**
 * 清理名称中的特殊标记
 * @param name 原始名称
 * @returns 清理后的名称
 */
export const cleanName = (name: string): string => {
  return name
    .replace(/【|】|〖|〗/g, '')
    .replace(/（绝版）|（典藏版）/g, '')
    .trim();
};

/**
 * 根据物品属性推断稀有度
 * @param price 价格
 * @param level 等级
 * @returns 稀有度
 */
export const inferRarity = (price: number = 0, level: number = 1): MigratedRarity => {
  const score = price + level * 100;

  if (score >= 50000) return '仙品';
  if (score >= 10000) return '传说';
  if (score >= 2000) return '稀有';
  return '普通';
};

/**
 * 根据名称关键词推断稀有度
 * @param name 物品名称
 * @returns 稀有度
 */
export const inferRarityFromName = (name: string): MigratedRarity | null => {
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
};

/**
 * 缩放数值
 * @param value 原始值
 * @param factor 缩放因子
 * @returns 缩放后的值
 */
export const scaleValue = (value: number | undefined, factor: number): number => {
  if (value === undefined || value === null) return 0;
  return Math.floor(value * factor);
};

/**
 * 推断物品类型
 * @param item 物品数据
 * @returns 物品类型
 */
export const inferItemType = (item: XiyouItem): MigratedItemType => {
  const name = item.name || '';

  if (name.includes('丹') || name.includes('药') || name.includes('回城')) {
    return '消耗品';
  }
  if (name.includes('宝石') || name.includes('晶石') || name.includes('石一') || name.includes('石二')) {
    return '宝石';
  }
  if (name.includes('任务') || name.includes('凭证')) {
    return '任务物品';
  }
  return '材料';
};

/**
 * 映射装备槽位
 * @param category 装备分类
 * @returns 装备槽位
 */
export const mapEquipmentSlot = (category: number | undefined): MigratedEquipmentSlot => {
  if (category === undefined) return '饰品';
  return XIYOU_EQUIPMENT_SLOTS[category] || '饰品';
};

// ============== 迁移函数 ==============

/**
 * 迁移物品数据
 * @param items 原始物品数组
 * @param config 迁移配置
 * @returns 迁移结果
 */
export const migrateItems = (
  items: XiyouItem[],
  config: MigrationConfig = DEFAULT_MIGRATION_CONFIG
): MigrationResult<MigratedItem> => {
  const result: MigrationResult<MigratedItem> = {
    data: [],
    mapping: {},
    warnings: [],
    stats: { total: items.length, success: 0, skipped: 0 },
  };

  for (const item of items) {
    try {
      const newId = convertId(item.id, 'item');
      result.mapping[item.id] = newId;

      const nameRarity = inferRarityFromName(item.name);
      const rarity = nameRarity || (config.inferRarity
        ? inferRarity(item.price, item.level)
        : '普通');

      const migratedItem: MigratedItem = {
        id: newId,
        originalId: item.id,
        name: cleanName(item.name),
        description: item.description || '',
        type: inferItemType(item),
        rarity,
        price: scaleValue(item.price, config.scalingFactors.price),
        level: item.level,
        quantity: 1,
      };

      result.data.push(migratedItem);
      result.stats.success++;
    } catch (error) {
      result.warnings.push(`Failed to migrate item ${item.id}: ${error}`);
      result.stats.skipped++;
    }
  }

  return result;
};

/**
 * 迁移装备数据
 * @param equipment 原始装备数组
 * @param config 迁移配置
 * @returns 迁移结果
 */
export const migrateEquipment = (
  equipment: XiyouEquipment[],
  config: MigrationConfig = DEFAULT_MIGRATION_CONFIG
): MigrationResult<MigratedEquipment> => {
  const result: MigrationResult<MigratedEquipment> = {
    data: [],
    mapping: {},
    warnings: [],
    stats: { total: equipment.length, success: 0, skipped: 0 },
  };

  for (const equip of equipment) {
    try {
      const newId = convertId(equip.id, 'equip');
      result.mapping[equip.id] = newId;

      const nameRarity = inferRarityFromName(equip.name);
      const rarity = nameRarity || (config.inferRarity
        ? inferRarity(equip.price, equip.level)
        : '普通');

      const migratedEquip: MigratedEquipment = {
        id: newId,
        originalId: equip.id,
        name: cleanName(equip.name),
        description: equip.description || '',
        rarity,
        level: equip.level || 1,
        equipmentSlot: mapEquipmentSlot(equip.category),
        faction: equip.faction,
        price: scaleValue(equip.price, config.scalingFactors.price),
        effect: {
          hp: scaleValue(equip.hp, config.scalingFactors.hp),
          attack: scaleValue(equip.attack, config.scalingFactors.attack),
          defense: scaleValue(equip.defense, config.scalingFactors.defense),
          spirit: scaleValue(equip.magicAttack, config.scalingFactors.attack * 0.5),
        },
      };

      result.data.push(migratedEquip);
      result.stats.success++;
    } catch (error) {
      result.warnings.push(`Failed to migrate equipment ${equip.id}: ${error}`);
      result.stats.skipped++;
    }
  }

  return result;
};

/**
 * 迁移宠物数据
 * @param pets 原始宠物数组
 * @param config 迁移配置
 * @returns 迁移结果
 */
export const migratePets = (
  pets: XiyouPet[],
  config: MigrationConfig = DEFAULT_MIGRATION_CONFIG
): MigrationResult<MigratedPet> => {
  const result: MigrationResult<MigratedPet> = {
    data: [],
    mapping: {},
    warnings: [],
    stats: { total: pets.length, success: 0, skipped: 0 },
  };

  for (const pet of pets) {
    try {
      const newId = convertId(pet.id, 'pet');
      result.mapping[pet.id] = newId;

      const nameRarity = inferRarityFromName(pet.name);
      let rarity: MigratedRarity = '普通';

      if (nameRarity) {
        rarity = nameRarity;
      } else if (pet.maxHp && pet.maxHp >= 100000) {
        rarity = '仙品';
      } else if (pet.maxHp && pet.maxHp >= 30000) {
        rarity = '传说';
      } else if (pet.maxHp && pet.maxHp >= 5000) {
        rarity = '稀有';
      }

      const migratedPet: MigratedPet = {
        id: newId,
        originalId: pet.id,
        name: cleanName(pet.name),
        rarity,
        baseStats: {
          hp: scaleValue(pet.maxHp, config.scalingFactors.hp),
          attack: scaleValue(pet.attack, config.scalingFactors.attack),
          defense: scaleValue(pet.defense, config.scalingFactors.defense),
          speed: 10 + Math.floor((pet.attack || 0) / 1000),
        },
        starLevel: pet.starLevel,
      };

      result.data.push(migratedPet);
      result.stats.success++;
    } catch (error) {
      result.warnings.push(`Failed to migrate pet ${pet.id}: ${error}`);
      result.stats.skipped++;
    }
  }

  return result;
};

/**
 * 迁移副本数据
 * @param dungeons 原始副本数组
 * @returns 迁移结果
 */
export const migrateDungeons = (
  dungeons: XiyouDungeon[]
): MigrationResult<MigratedDungeon> => {
  const result: MigrationResult<MigratedDungeon> = {
    data: [],
    mapping: {},
    warnings: [],
    stats: { total: dungeons.length, success: 0, skipped: 0 },
  };

  for (const dungeon of dungeons) {
    try {
      const newId = convertId(dungeon.id, 'dungeon');
      result.mapping[dungeon.id] = newId;

      const fullName = XIYOU_DUNGEON_NAMES[dungeon.name] || dungeon.name;

      const migratedDungeon: MigratedDungeon = {
        id: newId,
        originalId: dungeon.id,
        name: dungeon.name,
        fullName,
        difficulties: dungeon.instances.map((instance) => ({
          index: instance.index,
          instanceId: instance.id,
          name: XIYOU_DIFFICULTIES[instance.index] || `难度${instance.index}`,
        })),
      };

      result.data.push(migratedDungeon);
      result.stats.success++;
    } catch (error) {
      result.warnings.push(`Failed to migrate dungeon ${dungeon.id}: ${error}`);
      result.stats.skipped++;
    }
  }

  return result;
};

/**
 * 迁移掉落表数据
 * @param drops 原始掉落数据
 * @returns 迁移结果
 */
export const migrateDrops = (drops: XiyouDrops): MigrationResult<MigratedDropTable> => {
  const result: MigrationResult<MigratedDropTable> = {
    data: [],
    mapping: {},
    warnings: [],
    stats: { total: drops.drops.length, success: 0, skipped: 0 },
  };

  // 创建掉落源映射
  const dropSourceMap = new Map<number, typeof drops.drops[0]>();
  for (const drop of drops.drops) {
    dropSourceMap.set(drop.sourceId, drop);
  }

  // 创建奖励映射
  const rewardMap = new Map<number, typeof drops.completionRewards[0]>();
  for (const reward of drops.completionRewards) {
    rewardMap.set(reward.sourceId, reward);
  }

  // 合并掉落和奖励
  for (const drop of drops.drops) {
    try {
      const reward = rewardMap.get(drop.sourceId);

      const migratedDrop: MigratedDropTable = {
        sourceId: drop.sourceId,
        sourceName: drop.sourceName,
        difficulty: drop.difficulty,
        drops: drop.drops.map((d) => ({
          itemId: convertId(d.itemId, 'item'),
          itemName: d.itemName,
          originalItemId: d.itemId,
          dropRate: d.dropRate,
          minCount: d.minCount,
          maxCount: d.maxCount,
        })),
        completionReward: reward ? {
          experience: reward.rewards.experience,
          silver: reward.rewards.silver,
          items: reward.rewards.items.map((item) => ({
            itemId: convertId(item.itemId, 'item'),
            itemName: item.itemName,
            count: item.count,
          })),
        } : undefined,
      };

      result.data.push(migratedDrop);
      result.stats.success++;
    } catch (error) {
      result.warnings.push(`Failed to migrate drop ${drop.sourceId}: ${error}`);
      result.stats.skipped++;
    }
  }

  return result;
};

/**
 * 迁移经验表数据
 * @param expTable 原始经验表
 * @returns 迁移结果
 */
export const migrateExpTable = (expTable: XiyouExpTable): MigratedExpTable => {
  return {
    curveType: expTable.meta.curveType,
    levels: expTable.levels.map((level) => ({
      level: level.level,
      expRequired: level.expRequired,
      totalExp: level.totalExp,
    })),
  };
};

/**
 * 生成迁移统计报告
 * @param results 迁移结果数组
 * @returns 统计报告字符串
 */
export const generateMigrationReport = (
  ...results: MigrationResult<unknown>[]
): string => {
  const lines: string[] = ['=== 数据迁移统计报告 ===\n'];

  let totalAll = 0;
  let successAll = 0;
  let skippedAll = 0;
  let warningCount = 0;

  for (const result of results) {
    totalAll += result.stats.total;
    successAll += result.stats.success;
    skippedAll += result.stats.skipped;
    warningCount += result.warnings.length;
  }

  lines.push(`总计: ${totalAll} 条`);
  lines.push(`成功: ${successAll} 条`);
  lines.push(`跳过: ${skippedAll} 条`);
  lines.push(`警告: ${warningCount} 条\n`);

  if (warningCount > 0) {
    lines.push('=== 警告详情 ===');
    for (const result of results) {
      for (const warning of result.warnings) {
        lines.push(`- ${warning}`);
      }
    }
  }

  return lines.join('\n');
};
