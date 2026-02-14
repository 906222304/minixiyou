// 副本状态管理

import { signal, computed } from '@preact/signals-react';
import { dungeonService, type DungeonRunState } from '@/services/dungeonService';
import { getDungeon } from '@/constants/dungeons';
import { startBattle, battleState } from './battleSignals';
import { player, addPlayerExp, updatePlayerGold } from './playerSignals';
import { addItem } from './inventorySignals';
import type {
  Dungeon,
  DungeonProgress,
  DungeonDifficulty,
  DungeonResult,
} from '@/types';

// ============================================
// Signals
// ============================================

/** 当前副本运行状态 */
export const dungeonRunState = signal<DungeonRunState | null>(null);

/** 所有副本进度列表 */
export const dungeonProgressList = signal<DungeonProgress[]>([]);

/** 是否正在副本中 */
export const isInDungeon = computed(() => dungeonRunState.value !== null);

/** 当前副本ID */
export const currentDungeonId = computed(() => dungeonRunState.value?.dungeonId ?? null);

/** 当前副本难度 */
export const currentDungeonDifficulty = computed<DungeonDifficulty>(
  () => dungeonRunState.value?.difficulty ?? 'easy'
);

/** 当前层数 */
export const currentFloor = computed(() => dungeonRunState.value?.currentFloor ?? 0);

/** 是否正在战斗中 */
export const isDungeonBattle = computed(
  () => isInDungeon.value && battleState.value !== null
);

/** 当前副本配置 */
export const currentDungeon = computed<Dungeon | null>(() => {
  const dungeonId = currentDungeonId.value;
  if (!dungeonId) return null;
  return getDungeon(dungeonId) ?? null;
});

/** 当前层是否是Boss层 */
export const isBossFloor = computed(() => {
  const floor = currentFloor.value;
  const dungeon = currentDungeon.value;
  if (!dungeon || !floor) return false;

  const floorConfig = dungeon.floors.find(f => f.floorNumber === floor);
  return floorConfig?.bossId !== undefined;
});

/** 副本进度百分比 */
export const dungeonProgressPercent = computed(() => {
  const dungeon = currentDungeon.value;
  const floor = currentFloor.value;
  if (!dungeon || !floor) return 0;

  return Math.floor((floor / dungeon.floors.length) * 100);
});

// ============================================
// 初始化
// ============================================

/** 是否已初始化 */
export const isDungeonInitialized = signal(false);

/** 初始化副本系统 */
export async function initDungeons(): Promise<void> {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    console.log('[Dungeon] No player, skipping initialization');
    return;
  }

  try {
    const data = await dungeonService.initPlayerDungeons(currentPlayer.id);
    dungeonProgressList.value = data.progress;
    isDungeonInitialized.value = true;
    console.log('[Dungeon] Dungeon system initialized');
  } catch (error) {
    console.error('[Dungeon] Failed to initialize dungeon system:', error);
  }
}

// ============================================
// 副本操作
// ============================================

/** 进入副本结果 */
export interface EnterDungeonResult {
  success: boolean;
  error?: string;
  dungeon?: Dungeon;
  difficulty?: DungeonDifficulty;
}

/**
 * 进入副本
 */
export function enterDungeon(
  dungeonId: string,
  difficulty: DungeonDifficulty
): EnterDungeonResult {
  const currentPlayer = player.value;
  if (!currentPlayer) {
    return { success: false, error: '玩家不存在' };
  }

  // 检查是否已在副本中
  if (isInDungeon.value) {
    return { success: false, error: '已在副本中，请先完成或退出当前副本' };
  }

  const dungeon = getDungeon(dungeonId);
  if (!dungeon) {
    return { success: false, error: '副本不存在' };
  }

  // 调用服务进入副本
  const result = dungeonService.enterDungeon(dungeonId, difficulty);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // 更新状态
  dungeonRunState.value = result.state ?? null;

  // 开始战斗
  if (result.enemies && result.enemies.length > 0) {
    startBattle(result.enemies);
  }

  return {
    success: true,
    dungeon,
    difficulty,
  };
}

/**
 * 推进到下一层
 */
export function advanceDungeonFloor(): {
  success: boolean;
  isComplete?: boolean;
  error?: string;
} {
  if (!isInDungeon.value) {
    return { success: false, error: '未在副本中' };
  }

  // 检查战斗是否结束
  if (battleState.value !== null) {
    return { success: false, error: '战斗尚未结束' };
  }

  const result = dungeonService.advanceFloor();

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // 更新运行状态
  dungeonRunState.value = result.state ?? null;

  if (result.isComplete) {
    // 副本完成，返回成功
    return { success: true, isComplete: true };
  }

  // 开始新一层的战斗
  if (result.enemies && result.enemies.length > 0) {
    startBattle(result.enemies);
  }

  return { success: true, isComplete: false };
}

/**
 * 完成副本
 */
export function completeDungeon(): DungeonResult | null {
  if (!isInDungeon.value) {
    return null;
  }

  const result = dungeonService.completeDungeon();

  // 发放奖励
  if (result.success) {
    grantRewards(result);
  }

  // 清除状态
  dungeonRunState.value = null;

  // 刷新进度列表
  refreshDungeonProgress();

  return result;
}

/**
 * 副本失败
 */
export function failDungeon(): DungeonResult | null {
  if (!isInDungeon.value) {
    return null;
  }

  const result = dungeonService.failDungeon();

  // 清除状态
  dungeonRunState.value = null;

  // 刷新进度列表
  refreshDungeonProgress();

  return result;
}

/**
 * 退出副本（中途退出）
 */
export function exitDungeon(): void {
  dungeonService.exitDungeon();
  dungeonRunState.value = null;
}

/**
 * 刷新副本进度
 */
export async function refreshDungeonProgress(): Promise<void> {
  const currentPlayer = player.value;
  if (!currentPlayer) return;

  try {
    const data = await dungeonService.initPlayerDungeons(currentPlayer.id);
    dungeonProgressList.value = data.progress;
  } catch (error) {
    console.error('[Dungeon] Failed to refresh dungeon progress:', error);
  }
}

// ============================================
// 检查函数
// ============================================

/**
 * 检查是否可以进入副本
 */
export function canEnterDungeon(
  dungeonId: string,
  difficulty?: DungeonDifficulty
): { canEnter: boolean; reason?: string } {
  return dungeonService.canEnterDungeon(dungeonId, difficulty);
}

/**
 * 获取副本进度
 */
export function getDungeonProgress(dungeonId: string): DungeonProgress | undefined {
  return dungeonService.getDungeonProgress(dungeonId);
}

/**
 * 获取副本剩余次数
 */
export function getDungeonRemainingRuns(dungeonId: string): {
  daily: number;
  weekly: number;
} {
  const dungeon = getDungeon(dungeonId);
  if (!dungeon) {
    return { daily: 0, weekly: 0 };
  }

  const progress = getDungeonProgress(dungeonId);

  return {
    daily: (dungeon.dailyLimit ?? 0) - (progress?.todayRuns ?? 0),
    weekly: (dungeon.weeklyLimit ?? 0) - (progress?.weekRuns ?? 0),
  };
}

/**
 * 检查是否已首通
 */
export function hasFirstClear(dungeonId: string, difficulty: DungeonDifficulty): boolean {
  const progress = getDungeonProgress(dungeonId);
  if (!progress) return false;

  return progress.firstClears.some(fc => fc.difficulty === difficulty);
}

// ============================================
// 战斗回调
// ============================================

/**
 * 当战斗胜利时调用
 */
export function onDungeonBattleWin(): void {
  if (!isInDungeon.value) return;

  // 检查是否通关
  const dungeon = currentDungeon.value;
  const floor = currentFloor.value;

  if (dungeon && floor >= dungeon.floors.length) {
    // 最后一层通关，完成副本
    const result = completeDungeon();
    if (result) {
      console.log('[Dungeon] Dungeon completed:', result);
    }
  }
}

/**
 * 当战斗失败时调用
 */
export function onDungeonBattleLose(): void {
  if (!isInDungeon.value) return;

  // 副本失败
  const result = failDungeon();
  if (result) {
    console.log('[Dungeon] Dungeon failed:', result);
  }
}

// ============================================
// 辅助函数
// ============================================

/**
 * 发放副本奖励
 */
function grantRewards(result: DungeonResult): void {
  if (!result.rewards) return;

  const { exp, gold, items } = result.rewards;

  // 发放经验
  if (exp > 0) {
    const leveledUp = addPlayerExp(exp);
    console.log(`[Dungeon] Gained ${exp} exp${leveledUp ? ' (leveled up!)' : ''}`);
  }

  // 发放金币
  if (gold > 0) {
    updatePlayerGold(gold);
    console.log(`[Dungeon] Gained ${gold} gold`);
  }

  // 发放物品
  if (items && items.length > 0) {
    items.forEach(item => {
      addItem(item.itemId, item.count);
      console.log(`[Dungeon] Gained ${item.count}x ${item.itemId}`);
    });
  }
}

/**
 * 更新战斗统计
 */
export function updateDungeonStats(stats: Partial<DungeonRunState['stats']>): void {
  dungeonService.updateBattleStats(stats);
}

/**
 * 获取难度名称
 */
export function getDifficultyName(difficulty: DungeonDifficulty): string {
  const names: Record<DungeonDifficulty, string> = {
    easy: '简单',
    normal: '普通',
    hard: '困难',
    hell: '地狱',
  };
  return names[difficulty] ?? difficulty;
}

/**
 * 获取难度颜色
 */
export function getDifficultyColor(difficulty: DungeonDifficulty): string {
  const colors: Record<DungeonDifficulty, string> = {
    easy: 'text-green-500',
    normal: 'text-blue-500',
    hard: 'text-orange-500',
    hell: 'text-red-500',
  };
  return colors[difficulty] ?? 'text-gray-500';
}

/**
 * 获取副本类型名称
 */
export function getDungeonTypeName(type: string): string {
  const names: Record<string, string> = {
    normal: '普通副本',
    elite: '精英副本',
    raid: '团队副本',
    tower: '爬塔',
  };
  return names[type] ?? type;
}
