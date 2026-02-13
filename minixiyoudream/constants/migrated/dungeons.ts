/**
 * 副本数据 - 从 xiyou/assets/data/config/dungeons.json 迁移
 * 18 个副本，每个4个难度
 */

import { MigratedDungeon } from '../../types/xiyou';

/** 迁移后的副本数据 */
export const MIGRATED_DUNGEONS: MigratedDungeon[] = [
  {
    id: 'xiyou-dungeon-0001',
    originalId: 1,
    name: 'bglm',
    fullName: '白骨陵墓',
    difficulties: [
      { index: 1, instanceId: 16, name: '普通' },
      { index: 2, instanceId: 17, name: '困难' },
      { index: 3, instanceId: 18, name: '梦魇' },
      { index: 4, instanceId: 36, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0002',
    originalId: 2,
    name: 'bjd',
    fullName: '芭蕉洞',
    difficulties: [
      { index: 1, instanceId: 53, name: '普通' },
      { index: 2, instanceId: 54, name: '困难' },
      { index: 3, instanceId: 55, name: '梦魇' },
      { index: 4, instanceId: 56, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0003',
    originalId: 3,
    name: 'bjt',
    fullName: '冰晶塔',
    difficulties: [
      { index: 1, instanceId: 1, name: '普通' },
      { index: 2, instanceId: 2, name: '困难' },
      { index: 3, instanceId: 3, name: '梦魇' },
      { index: 4, instanceId: 31, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0004',
    originalId: 4,
    name: 'byd',
    fullName: '白云洞',
    difficulties: [
      { index: 1, instanceId: 13, name: '普通' },
      { index: 2, instanceId: 14, name: '困难' },
      { index: 3, instanceId: 15, name: '梦魇' },
      { index: 4, instanceId: 35, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0005',
    originalId: 5,
    name: 'byzzl',
    fullName: '白云庄之路',
    difficulties: [
      { index: 1, instanceId: 4, name: '普通' },
      { index: 2, instanceId: 5, name: '困难' },
      { index: 3, instanceId: 6, name: '梦魇' },
      { index: 4, instanceId: 32, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0006',
    originalId: 6,
    name: 'jdd',
    fullName: '解刀洞',
    difficulties: [
      { index: 1, instanceId: 41, name: '普通' },
      { index: 2, instanceId: 42, name: '困难' },
      { index: 3, instanceId: 43, name: '梦魇' },
      { index: 4, instanceId: 44, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0007',
    originalId: 7,
    name: 'lhd',
    fullName: '龙虎洞',
    difficulties: [
      { index: 1, instanceId: 10, name: '普通' },
      { index: 2, instanceId: 11, name: '困难' },
      { index: 3, instanceId: 12, name: '梦魇' },
      { index: 4, instanceId: 34, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0008',
    originalId: 8,
    name: 'ljl',
    fullName: '龙脊岭',
    difficulties: [
      { index: 1, instanceId: 28, name: '普通' },
      { index: 2, instanceId: 29, name: '困难' },
      { index: 3, instanceId: 30, name: '梦魇' },
      { index: 4, instanceId: 40, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0009',
    originalId: 9,
    name: 'psd',
    fullName: '菩提寺',
    difficulties: [
      { index: 1, instanceId: 61, name: '普通' },
      { index: 2, instanceId: 62, name: '困难' },
      { index: 3, instanceId: 63, name: '梦魇' },
      { index: 4, instanceId: 64, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0010',
    originalId: 10,
    name: 'sld',
    fullName: '水帘洞',
    difficulties: [
      { index: 1, instanceId: 19, name: '普通' },
      { index: 2, instanceId: 20, name: '困难' },
      { index: 3, instanceId: 21, name: '梦魇' },
      { index: 4, instanceId: 37, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0011',
    originalId: 11,
    name: 'std',
    fullName: '狮驼岭',
    difficulties: [
      { index: 1, instanceId: 65, name: '普通' },
      { index: 2, instanceId: 66, name: '困难' },
      { index: 3, instanceId: 67, name: '梦魇' },
      { index: 4, instanceId: 68, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0012',
    originalId: 12,
    name: 'ttsf',
    fullName: '通天水府',
    difficulties: [
      { index: 1, instanceId: 49, name: '普通' },
      { index: 2, instanceId: 50, name: '困难' },
      { index: 3, instanceId: 51, name: '梦魇' },
      { index: 4, instanceId: 52, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0013',
    originalId: 13,
    name: 'wdd',
    fullName: '无底洞',
    difficulties: [
      { index: 1, instanceId: 69, name: '普通' },
      { index: 2, instanceId: 70, name: '困难' },
      { index: 3, instanceId: 71, name: '梦魇' },
      { index: 4, instanceId: 72, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0014',
    originalId: 14,
    name: 'wsc',
    fullName: '五庄观',
    difficulties: [
      { index: 1, instanceId: 25, name: '普通' },
      { index: 2, instanceId: 26, name: '困难' },
      { index: 3, instanceId: 27, name: '梦魇' },
      { index: 4, instanceId: 39, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0015',
    originalId: 15,
    name: 'xlys',
    fullName: '西梁玉山',
    difficulties: [
      { index: 1, instanceId: 57, name: '普通' },
      { index: 2, instanceId: 58, name: '困难' },
      { index: 3, instanceId: 59, name: '梦魇' },
      { index: 4, instanceId: 60, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0016',
    originalId: 16,
    name: 'yc',
    fullName: '银川',
    difficulties: [
      { index: 1, instanceId: 45, name: '普通' },
      { index: 2, instanceId: 46, name: '困难' },
      { index: 3, instanceId: 47, name: '梦魇' },
      { index: 4, instanceId: 48, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0017',
    originalId: 17,
    name: 'yld',
    fullName: '月亮洞',
    difficulties: [
      { index: 1, instanceId: 7, name: '普通' },
      { index: 2, instanceId: 8, name: '困难' },
      { index: 3, instanceId: 9, name: '梦魇' },
      { index: 4, instanceId: 33, name: '地狱' },
    ],
  },
  {
    id: 'xiyou-dungeon-0018',
    originalId: 18,
    name: 'zyt',
    fullName: '镇妖塔',
    difficulties: [
      { index: 1, instanceId: 22, name: '普通' },
      { index: 2, instanceId: 23, name: '困难' },
      { index: 3, instanceId: 24, name: '梦魇' },
      { index: 4, instanceId: 38, name: '地狱' },
    ],
  },
];

/** 副本ID映射 (原始ID -> 新ID) */
export const DUNGEON_ID_MAPPING: Record<number, string> = Object.fromEntries(
  MIGRATED_DUNGEONS.map((d) => [d.originalId, d.id])
);

/** 副本实例ID到副本的映射 */
export const INSTANCE_TO_DUNGEON: Record<number, { dungeon: MigratedDungeon; difficulty: string }> = {};
for (const dungeon of MIGRATED_DUNGEONS) {
  for (const diff of dungeon.difficulties) {
    INSTANCE_TO_DUNGEON[diff.instanceId] = { dungeon, difficulty: diff.name };
  }
}

/** 副本总数 */
export const TOTAL_DUNGEONS = MIGRATED_DUNGEONS.length;

/** 总副本实例数 */
export const TOTAL_INSTANCES = MIGRATED_DUNGEONS.reduce((sum, d) => sum + d.difficulties.length, 0);
