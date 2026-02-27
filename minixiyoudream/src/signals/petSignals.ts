// 宠物状态管理 - 使用新的召唤兽系统

import { signal, computed } from '@preact/signals-react';
import type { Pet, FusionResult, AlchemyResult } from '@/types/pet';
import { summonService, type PRNG } from '@/services/summonService';
import { alchemyService } from '@/services/alchemyService';

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
  // 创建 PRNG 适配器
  const prngAdapter: PRNG = {
    nextFloat: (min = 0, max = 1) => min + prng() * (max - min),
    roll: (chance) => prng() * 100 < chance,
    nextInt: (min, max) => Math.floor(prng() * (max - min + 1)) + min,
  };

  // 使用 summonService 创建召唤兽
  const pet = summonService.createSummon(templateId, 1, undefined, prngAdapter);

  if (!pet) return null;

  // 设置所有者信息
  pet.ownerType = ownerType;
  pet.ownerId = ownerId;

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
  const previousLevel = pet.level;

  // 使用 summonService 处理升级
  const updatedPet = summonService.levelUp(pet, exp);

  // 如果等级变化了，需要重新计算属性（levelUp 内部已处理）
  if (updatedPet.level !== previousLevel) {
    const newPets = [...pets];
    newPets[index] = {
      ...updatedPet,
      // 保持 HP/MP 不超过新的最大值
      hp: Math.min(pet.hp, updatedPet.maxHp),
      mp: Math.min(pet.mp, updatedPet.maxMp),
    };
    playerPets.value = newPets;
  } else {
    const newPets = [...pets];
    newPets[index] = updatedPet;
    playerPets.value = newPets;
  }

  return true;
}

/** 获取升级所需经验 */
export function getExpForLevel(level: number): number {
  return summonService.getExpNeeded(level);
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

/** 学习技能（打书） */
export function learnPetSkill(
  petId: string,
  skillBookId: string
): { success: boolean; message: string } {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);
  if (index < 0) return { success: false, message: '宠物不存在' };

  const pet = pets[index];
  const result = summonService.learnSkill(pet, skillBookId, {
    nextFloat: () => Math.random(),
    roll: (chance) => Math.random() * 100 < chance,
    nextInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  });

  if (result.success) {
    const newPets = [...pets];
    newPets[index] = result.pet;
    playerPets.value = newPets;
  }

  return { success: result.success, message: result.message };
}

/** 锁定/解锁技能 */
export function togglePetSkillLock(petId: string, skillId: string): boolean {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);
  if (index < 0) return false;

  const pet = pets[index];
  const updatedPet = summonService.toggleSkillLock(pet, skillId);

  const newPets = [...pets];
  newPets[index] = updatedPet;
  playerPets.value = newPets;

  return true;
}

/** 获取宠物当前经验进度 (0-1) */
export function getPetExpProgress(pet: Pet): number {
  const expNeeded = summonService.getExpNeeded(pet.level);
  return expNeeded > 0 ? pet.exp / expNeeded : 0;
}

// ==================== 炼妖/合宠功能 ====================

/** 合宠（炼妖）- 两只召唤兽合成 */
export function fusePets(petId1: string, petId2: string): FusionResult | null {
  const pets = playerPets.value;
  const pet1 = pets.find((p) => p.id === petId1);
  const pet2 = pets.find((p) => p.id === petId2);

  if (!pet1 || !pet2) {
    return null;
  }

  // 执行合宠
  const result = alchemyService.fusePets(pet1, pet2);

  // 移除原宠物，添加新宠物
  const newPets = pets.filter((p) => p.id !== petId1 && p.id !== petId2);

  // 检查宠物栏是否已满
  if (newPets.length >= maxPets) {
    return null;
  }

  newPets.push(result.pet);
  playerPets.value = newPets;

  return result;
}

/** 获取合宠预览 */
export function getFusionPreview(petId1: string, petId2: string) {
  const pets = playerPets.value;
  const pet1 = pets.find((p) => p.id === petId1);
  const pet2 = pets.find((p) => p.id === petId2);

  if (!pet1 || !pet2) {
    return null;
  }

  return alchemyService.getFusionPreview(pet1, pet2);
}

// ==================== 资质培养功能 ====================

/** 使用炼妖材料培养资质 */
export function trainAptitude(petId: string, materialId: string): AlchemyResult {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);

  if (index < 0) {
    return { success: false, criticalHit: false, message: '宠物不存在' };
  }

  const pet = pets[index];
  const result = alchemyService.trainAptitude(pet, materialId);

  // 更新宠物状态
  if (result.aptitudeChange) {
    const newPets = [...pets];
    newPets[index] = { ...pet };
    playerPets.value = newPets;
  }

  return result;
}

/** 批量培养资质 */
export function trainAptitudeBatch(
  petId: string,
  materialId: string,
  count: number
): { results: AlchemyResult[]; totalChange: number } {
  const pets = playerPets.value;
  const index = pets.findIndex((p) => p.id === petId);

  if (index < 0) {
    return {
      results: [{ success: false, criticalHit: false, message: '宠物不存在' }],
      totalChange: 0,
    };
  }

  const pet = pets[index];
  const result = alchemyService.trainAptitudeBatch(pet, materialId, count);

  // 更新宠物状态
  const newPets = [...pets];
  newPets[index] = { ...pet };
  playerPets.value = newPets;

  return result;
}

/** 获取资质培养预估效果 */
export function getTrainingEstimate(petId: string, materialId: string) {
  const pets = playerPets.value;
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    return null;
  }

  return alchemyService.getTrainingEstimate(pet, materialId);
}

/** 获取所有炼妖材料 */
export function getAllAlchemyMaterials() {
  return alchemyService.getAllAlchemyMaterials();
}

