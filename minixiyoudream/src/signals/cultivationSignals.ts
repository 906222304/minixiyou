// 修炼系统状态管理

import { signal, computed } from '@preact/signals-react';
import type {
  CultivationType,
  CultivationData,
  CultivationProgress,
  LevelUpResult,
  BreakthroughResult,
  CultivationBonus,
} from '@/types/cultivation';
import { createDefaultCultivationData } from '@/types/cultivation';
import { cultivationService } from '@/services/cultivationService';
import { PRNG } from '@/utils/prng';
import {
  AUTO_CULTIVATION_INTERVAL,
  AUTO_CULTIVATION_EXP,
} from '@/constants/cultivation';

// ============================================
// 状态信号
// ============================================

/** 修炼数据 */
export const cultivationData = signal<CultivationData>(createDefaultCultivationData());

/** 当前修炼类型 */
export const activeCultivationType = signal<CultivationType>('strength');

/** 是否正在自动修炼 */
export const isAutoCultivating = signal<boolean>(false);

/** 自动修炼定时器ID */
let cultivationTimer: ReturnType<typeof setInterval> | null = null;

// ============================================
// 计算属性
// ============================================

/** 当前境界 */
export const currentRealm = computed(() => cultivationData.value.realm);

/** 当前境界名称 */
export const currentRealmName = computed(() => cultivationData.value.realmName);

/** 总修炼等级 */
export const totalCultivationLevel = computed(() => {
  const data = cultivationData.value;
  return Object.values(data.cultivations).reduce((sum, p) => sum + p.level, 0);
});

/** 修炼加成 */
export const cultivationBonus = computed<CultivationBonus>(() => {
  return cultivationService.getCultivationBonus(cultivationData.value);
});

/** 境界加成倍率 */
export const realmBonusMultiplier = computed(() => {
  return cultivationService.getRealmBonus(cultivationData.value.realm);
});

/** 是否可以突破 */
export const canBreakthrough = computed(() => {
  return cultivationService.canBreakthrough(cultivationData.value);
});

/** 境界信息 */
export const realmInfo = computed(() => {
  return cultivationService.getRealmInfo(cultivationData.value);
});

/** 当前修炼进度 */
export const activeCultivationProgress = computed<CultivationProgress>(() => {
  const type = activeCultivationType.value;
  return cultivationData.value.cultivations[type];
});

// ============================================
// 操作函数
// ============================================

/** 初始化修炼数据 */
export function initCultivation(data?: Partial<CultivationData>): void {
  if (data) {
    cultivationData.value = {
      ...createDefaultCultivationData(),
      ...data,
    };
  } else {
    cultivationData.value = createDefaultCultivationData();
  }
}

/** 切换修炼类型 */
export function setActiveCultivationType(type: CultivationType): void {
  activeCultivationType.value = type;
}

/** 开始自动修炼 */
export function startAutoCultivation(): void {
  if (isAutoCultivating.value) return;

  isAutoCultivating.value = true;

  cultivationTimer = setInterval(() => {
    const type = activeCultivationType.value;
    gainCultivationExp(type, AUTO_CULTIVATION_EXP);
  }, AUTO_CULTIVATION_INTERVAL);
}

/** 停止自动修炼 */
export function stopAutoCultivation(): void {
  if (!isAutoCultivating.value) return;

  isAutoCultivating.value = false;

  if (cultivationTimer) {
    clearInterval(cultivationTimer);
    cultivationTimer = null;
  }
}

/** 获得修炼经验 */
export function gainCultivationExp(type: CultivationType, amount: number): LevelUpResult {
  const { result, data } = cultivationService.gainCultivationExp(
    cultivationData.value,
    type,
    amount
  );
  cultivationData.value = data;
  return result;
}

/** 使用修炼丹药 */
export function useCultivationPill(itemId: string, type?: CultivationType): {
  success: boolean;
  expGained: number;
} {
  const targetType = type ?? activeCultivationType.value;
  const { success, data, expGained } = cultivationService.useCultivationPill(
    cultivationData.value,
    itemId,
    targetType
  );

  if (success) {
    cultivationData.value = data;
  }

  return { success, expGained };
}

/** 尝试境界突破 */
export function attemptBreakthrough(): BreakthroughResult {
  const prng = new PRNG(Date.now());
  const { result, data } = cultivationService.attemptBreakthrough(
    cultivationData.value,
    prng
  );

  cultivationData.value = data;
  return result;
}

/** 处理离线修炼 */
export function processOfflineCultivation(offlineTime: number): number {
  const { expGained, data } = cultivationService.calculateOfflineCultivation(
    cultivationData.value,
    offlineTime,
    activeCultivationType.value
  );

  if (expGained > 0) {
    cultivationData.value = data;
  }

  return expGained;
}

/** 重置修炼数据 */
export function resetCultivation(): void {
  stopAutoCultivation();
  cultivationData.value = createDefaultCultivationData();
  activeCultivationType.value = 'strength';
}

/** 获取指定类型的修炼进度 */
export function getCultivationProgress(type: CultivationType): CultivationProgress {
  return cultivationData.value.cultivations[type];
}

/** 获取修炼进度百分比 */
export function getProgressPercent(type: CultivationType): number {
  const progress = cultivationData.value.cultivations[type];
  return cultivationService.getProgressPercent(progress);
}

/** 更新最后修炼时间 */
export function updateLastCultivateTime(): void {
  cultivationData.value = {
    ...cultivationData.value,
    lastCultivateTime: Date.now(),
  };
}

// ============================================
// 导出
// ============================================

export {
  cultivationData as cultivation,
};
