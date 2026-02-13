/**
 * 宠物数据 - 从 xiyou/assets/data/config/pets.json 迁移
 * 15 条宠物数据
 */

import { MigratedPet } from '../../types/xiyou';

/** 迁移后的宠物数据 */
export const MIGRATED_PETS: MigratedPet[] = [
  {
    id: 'xiyou-pet-0001',
    originalId: 1,
    name: '花斑虎王',
    rarity: '普通',
    baseStats: { hp: 10, attack: 80, defense: 60, speed: 10 },
  },
  {
    id: 'xiyou-pet-0002',
    originalId: 2,
    name: '雪豹大王',
    rarity: '普通',
    baseStats: { hp: 11, attack: 90, defense: 60, speed: 12 },
  },
  {
    id: 'xiyou-pet-0003',
    originalId: 3,
    name: '狂狼大王',
    rarity: '稀有',
    baseStats: { hp: 15, attack: 110, defense: 90, speed: 14 },
  },
  {
    id: 'xiyou-pet-0004',
    originalId: 4,
    name: '双翅飞虎',
    rarity: '稀有',
    baseStats: { hp: 18, attack: 150, defense: 120, speed: 18 },
  },
  {
    id: 'xiyou-pet-0005',
    originalId: 5,
    name: '噬月天狼',
    rarity: '传说',
    baseStats: { hp: 30, attack: 210, defense: 300, speed: 25 },
  },
  {
    id: 'xiyou-pet-0006',
    originalId: 6,
    name: '统帅佣',
    rarity: '传说',
    baseStats: { hp: 30, attack: 210, defense: 300, speed: 22 },
  },
  {
    id: 'xiyou-pet-0007',
    originalId: 7,
    name: '通天神鼠',
    rarity: '传说',
    baseStats: { hp: 30, attack: 210, defense: 300, speed: 30 },
  },
  {
    id: 'xiyou-pet-0008',
    originalId: 8,
    name: '混沌战神',
    rarity: '仙品',
    baseStats: { hp: 400, attack: 1500, defense: 1400, speed: 40 },
  },
  {
    id: 'xiyou-pet-0009',
    originalId: 9,
    name: '九天玄女',
    rarity: '仙品',
    baseStats: { hp: 400, attack: 1500, defense: 1400, speed: 42 },
  },
  {
    id: 'xiyou-pet-0010',
    originalId: 10,
    name: '五行裂云兽',
    rarity: '仙品',
    baseStats: { hp: 400, attack: 1500, defense: 1400, speed: 38 },
  },
  {
    id: 'xiyou-pet-0011',
    originalId: 11,
    name: '九尾妖狐',
    rarity: '仙品',
    baseStats: { hp: 1000, attack: 4500, defense: 6000, speed: 55 },
  },
  {
    id: 'xiyou-pet-0012',
    originalId: 12,
    name: '瞌睡虫',
    rarity: '仙品',
    baseStats: { hp: 1000, attack: 3000, defense: 3000, speed: 35 },
  },
  {
    id: 'xiyou-pet-0013',
    originalId: 13,
    name: '齐天大圣',
    rarity: '仙品',
    baseStats: { hp: 1500, attack: 6000, defense: 6000, speed: 70 },
  },
  {
    id: 'xiyou-pet-0014',
    originalId: 14,
    name: '麒麟圣祖',
    rarity: '仙品',
    baseStats: { hp: 3000, attack: 10000, defense: 10000, speed: 80 },
    starLevel: 5,
  },
  {
    id: 'xiyou-pet-0015',
    originalId: 15,
    name: '凤凰圣祖',
    rarity: '仙品',
    baseStats: { hp: 9999, attack: 30000, defense: 30000, speed: 100 },
    starLevel: 5,
  },
];

/** 宠物ID映射 (原始ID -> 新ID) */
export const PET_ID_MAPPING: Record<number, string> = Object.fromEntries(
  MIGRATED_PETS.map((pet) => [pet.originalId, pet.id])
);

/** 按稀有度分组的宠物 */
export const PETS_BY_RARITY = {
  普通: MIGRATED_PETS.filter((p) => p.rarity === '普通'),
  稀有: MIGRATED_PETS.filter((p) => p.rarity === '稀有'),
  传说: MIGRATED_PETS.filter((p) => p.rarity === '传说'),
  仙品: MIGRATED_PETS.filter((p) => p.rarity === '仙品'),
};

/** 宠物总数 */
export const TOTAL_PETS = MIGRATED_PETS.length;
