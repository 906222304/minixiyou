// 宠物状态管理

import { signal, computed } from '@preact/signals-react';
import type { Pet } from '@/types';
import { generateUUID } from '@/types';
import { getPetTemplate, randomAptitude } from '@/constants/pets';
import { calculatePetStats } from '@/constants/formulas';

/** 玩家拥有的宠物列表 */
export const playerPets = signal<Pet[]>([]);

/** 当前出战的宠物 */
export const activePet = computed(() => {
  const pets = playerPets.value;
  return pets.find((p) => p.isActive) ?? null;
});

/** 宠物数量 */
export const petCount = computed(() => playerPets.value.length);

/** 最大宠物数量 */
export const maxPets = 10;

/** 创建宠物实例 */
export function createPet(
  templateId: string,
  ownerType: 'player' | 'companion' = 'player',
  ownerId: string = 'player',
  prng: () => number = Math.random
): Pet | null {
  const template = getPetTemplate(templateId);
  if (!template) return null;

  const aptitude = randomAptitude(prng);
  const level = 1;
  const stats = calculatePetStats(template.baseStats, aptitude as unknown as Record<string, number>, level);

  const pet: Pet = {
    id: generateUUID(),
    baseId: templateId,
    name: template.name,
    icon: template.icon,
    type: template.type,
    rarity: template.baseRarity,
    element: template.element,
    level,
    exp: 0,
    maxLevel: 100,
    aptitude,
    stats,
    skills: [],
    maxSkills: 4,
    intimacy: 0,
    intimacyLevel: 1,
    loyalty: 50,
    isActive: false,
    ownerType,
    ownerId,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    mp: stats.maxMp,
    maxMp: stats.maxMp,
  };

  return pet;
}

/** 添加宠物 */
export function addPet(pet: Pet): boolean {
  const pets = playerPets.value;

  if (pets.length >= maxPets) {
    return false; // 宠物栏已满
  }

  playerPets.value = [...pets, pet];
  return true;
}

/** 移除宠物 */
export function removePet(petId: string): boolean {
  const pets = playerPets.value;
  const newPets = pets.filter((p) => p.id !== petId);

  if (newPets.length === pets.length) {
    return false; // 未找到宠物
  }

  playerPets.value = newPets;
  return true;
}

/** 设置出战宠物 */
export function setActivePet(petId: string): boolean {
  const pets = playerPets.value;
  const pet = pets.find((p) => p.id === petId);

  if (!pet) return false;

  // 取消当前出战宠物的出战状态
  const newPets = pets.map((p) => ({
    ...p,
    isActive: p.id === petId,
  }));

  playerPets.value = newPets;
  return true;
}

/** 取消出战 */
export function unsetActivePet(): void {
  const pets = playerPets.value;
  playerPets.value = pets.map((p) => ({ ...p, isActive: false }));
}

/** 增加宠物经验 */
export function addPetExp(petId: string, exp: number): boolean {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);

  if (index < 0) return false;

  const pet = pets[index];
  let newExp = pet.exp + exp;
  let newLevel = pet.level;

  // 简单的升级逻辑
  while (newExp >= getExpForLevel(newLevel) && newLevel < pet.maxLevel) {
    newExp -= getExpForLevel(newLevel);
    newLevel++;
  }

  if (newLevel !== pet.level) {
    // 重新计算属性
    const template = getPetTemplate(pet.baseId);
    if (template) {
      const newStats = calculatePetStats(
        template.baseStats,
        pet.aptitude as unknown as Record<string, number>,
        newLevel
      );

      const newPets = [...pets];
      newPets[index] = {
        ...pet,
        level: newLevel,
        exp: newExp,
        stats: newStats,
        maxHp: newStats.maxHp,
        maxMp: newStats.maxMp,
        hp: Math.min(pet.hp, newStats.maxHp),
        mp: Math.min(pet.mp, newStats.maxMp),
      };

      playerPets.value = newPets;
    }
  } else {
    const newPets = [...pets];
    newPets[index] = { ...pet, exp: newExp };
    playerPets.value = newPets;
  }

  return true;
}

/** 获取升级所需经验 */
function getExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

/** 恢复宠物HP/MP */
export function restorePet(petId: string): void {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);

  if (index < 0) return;

  const pet = pets[index];
  const newPets = [...pets];
  newPets[index] = {
    ...pet,
    hp: pet.maxHp,
    mp: pet.maxMp,
  };

  playerPets.value = newPets;
}

/** 给宠物改名 */
export function renamePet(petId: string, nickname: string): boolean {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);

  if (index < 0) return false;

  const newPets = [...pets];
  newPets[index] = { ...newPets[index], nickname };

  playerPets.value = newPets;
  return true;
}

/** 清空宠物列表 */
export function clearPets(): void {
  playerPets.value = [];
}
