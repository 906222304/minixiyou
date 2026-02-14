// 阵法状态管理

import { signal, computed } from '@preact/signals-react';
import type { PlayerFormation } from '@/types/formation';
import { FORMATIONS, getFormation } from '@/constants/formations';
import { formationService } from '@/services/formationService';

/** 玩家已解锁的阵法列表 */
export const playerFormations = signal<PlayerFormation[]>(
  // 默认解锁云垂阵（平衡型）
  [{
    formationId: 'formation_yunchui',
    level: 1,
    exp: 0,
    unlocked: true,
  }]
);

/** 当前激活的阵法ID */
export const activeFormationId = signal<string>('formation_yunchui');

/** 是否已初始化阵法系统 */
export const isFormationInitialized = signal<boolean>(true);

/** 当前激活的阵法 */
export const activeFormation = computed(() => {
  const formationId = activeFormationId.value;
  const formation = getFormation(formationId);

  if (!formation) {
    return null;
  }

  const playerFormation = getPlayerFormation(formationId);
  return {
    ...formation,
    level: playerFormation?.level ?? 0,
    exp: playerFormation?.exp ?? 0,
    unlocked: playerFormation?.unlocked ?? false,
  };
});

/** 当前激活阵法的等级 */
export const activeFormationLevel = computed(() => {
  const formationId = activeFormationId.value;
  const playerFormation = getPlayerFormation(formationId);
  return playerFormation?.level ?? 1;
});

/** 已解锁的阵法数量 */
export const unlockedFormationCount = computed(() => {
  return playerFormations.value.filter(f => f.unlocked).length;
});

// ============================================
// 阵法管理函数
// ============================================

/**
 * 获取玩家特定阵法的数据
 */
export function getPlayerFormation(formationId: string): PlayerFormation | undefined {
  return playerFormations.value.find(f => f.formationId === formationId);
}

/**
 * 检查阵法是否已解锁
 */
export function isFormationUnlocked(formationId: string): boolean {
  const playerFormation = getPlayerFormation(formationId);
  return playerFormation?.unlocked ?? false;
}

/**
 * 解锁阵法
 */
export function unlockFormation(formationId: string): boolean {
  const formation = getFormation(formationId);
  if (!formation) {
    return false;
  }

  const existingFormation = getPlayerFormation(formationId);
  if (existingFormation) {
    if (existingFormation.unlocked) {
      return false; // 已解锁
    }
    // 更新为已解锁
    playerFormations.value = playerFormations.value.map(f =>
      f.formationId === formationId
        ? { ...f, unlocked: true }
        : f
    );
  } else {
    // 添加新阵法
    playerFormations.value = [
      ...playerFormations.value,
      {
        formationId,
        level: 1,
        exp: 0,
        unlocked: true,
      },
    ];
  }

  return true;
}

/**
 * 设置当前激活的阵法
 */
export function setActiveFormation(formationId: string): boolean {
  const formation = getFormation(formationId);
  if (!formation) {
    return false;
  }

  const playerFormation = getPlayerFormation(formationId);
  if (!playerFormation?.unlocked) {
    return false;
  }

  activeFormationId.value = formationId;
  return true;
}

/**
 * 为阵法增加经验
 */
export function addFormationExp(formationId: string, expGain: number): {
  success: boolean;
  levelUp: boolean;
  newLevel: number;
} {
  const playerFormation = getPlayerFormation(formationId);
  if (!playerFormation || !playerFormation.unlocked) {
    return { success: false, levelUp: false, newLevel: 0 };
  }

  const result = formationService.upgradeFormation(playerFormation, expGain);

  if (result.success) {
    playerFormations.value = playerFormations.value.map(f =>
      f.formationId === formationId
        ? { ...f, level: result.newLevel, exp: result.newExp }
        : f
    );
  }

  return {
    success: result.success,
    levelUp: result.levelUp,
    newLevel: result.newLevel,
  };
}

/**
 * 获取阵法在特定槽位的效果
 */
export function getActiveFormationEffects(slot: number) {
  const formationId = activeFormationId.value;
  const level = activeFormationLevel.value;
  return formationService.getFormationEffects(formationId, level, slot);
}

/**
 * 获取当前阵法的克制加成
 */
export function getActiveCounterBonus(enemyFormationId: string) {
  return formationService.getCounterBonus(activeFormationId.value, enemyFormationId);
}

/**
 * 初始化阵法系统（新玩家）
 */
export function initializeFormations(): void {
  // 默认解锁云垂阵
  playerFormations.value = [{
    formationId: 'formation_yunchui',
    level: 1,
    exp: 0,
    unlocked: true,
  }];
  activeFormationId.value = 'formation_yunchui';
  isFormationInitialized.value = true;
}

/**
 * 重置阵法系统
 */
export function resetFormations(): void {
  playerFormations.value = [];
  activeFormationId.value = '';
  isFormationInitialized.value = false;
}

/**
 * 获取所有阵法的状态信息
 */
export function getAllFormationStatus(): {
  formationId: string;
  name: string;
  icon: string;
  type: string;
  unlocked: boolean;
  level: number;
  isActive: boolean;
}[] {
  return FORMATIONS.map(formation => {
    const playerFormation = getPlayerFormation(formation.id);
    return {
      formationId: formation.id,
      name: formation.name,
      icon: formation.icon,
      type: formation.type,
      unlocked: playerFormation?.unlocked ?? false,
      level: playerFormation?.level ?? 0,
      isActive: activeFormationId.value === formation.id,
    };
  });
}
