// 成就系统状态管理

import { signal, computed } from '@preact/signals-react';
import { achievementService } from '@/services/achievementService';
import { ACHIEVEMENT_CATEGORIES } from '@/constants/achievements';
import { updatePlayerGold, addPlayerExp } from './playerSignals';
import { addItem } from './inventorySignals';
import type {
  AchievementProgressInfo,
  AchievementStats,
  AchievementTracker,
  AchievementEvent,
  AchievementCategory,
  PlayerTitle,
  Title,
} from '@/types/achievement';

/** 成就进度列表 */
export const achievementProgress = signal<AchievementProgressInfo[]>([]);

/** 成就统计 */
export const achievementStats = signal<AchievementStats | null>(null);

/** 追踪器数据 */
export const achievementTracker = signal<AchievementTracker | null>(null);

/** 玩家称号列表 */
export const playerTitles = signal<Array<PlayerTitle & { title: Title }>>([]);

/** 当前激活的称号 */
export const activeTitle = signal<{ title: Title; playerTitle: PlayerTitle } | null>(null);

/** 是否已初始化 */
export const isAchievementInitialized = signal(false);

/** 当前选中的成就类别 */
export const selectedAchievementCategory = signal<AchievementCategory | 'all'>('all');

/** 新解锁的成就ID列表（用于通知） */
export const newlyUnlockedAchievements = signal<string[]>([]);

/** 是否正在加载 */
export const isAchievementLoading = signal(false);

/** 筛选后的成就进度 */
export const filteredAchievementProgress = computed(() => {
  const progress = achievementProgress.value;
  const category = selectedAchievementCategory.value;

  if (category === 'all') {
    return progress;
  }

  return progress.filter(p => p.achievement.category === category);
});

/** 已解锁的成就数量 */
export const unlockedAchievementCount = computed(() => {
  return achievementProgress.value.filter(p => p.playerData.unlocked).length;
});

/** 总成就数量 */
export const totalAchievementCount = computed(() => {
  return achievementProgress.value.length;
});

/** 已获得的总成就点数 */
export const earnedAchievementPoints = computed(() => {
  return achievementStats.value?.earnedPoints ?? 0;
});

/** 可领取的奖励数量 */
export const claimableRewardCount = computed(() => {
  return achievementProgress.value.filter(p => p.canClaim).length;
});

/**
 * 初始化成就系统
 */
export async function initAchievements(playerId: string): Promise<void> {
  if (isAchievementInitialized.value) return;

  isAchievementLoading.value = true;

  try {
    // 初始化并加载数据
    await achievementService.initPlayerAchievements(playerId);

    // 并行加载所有数据
    const [progress, stats, tracker, titles, active] = await Promise.all([
      achievementService.getAchievementProgress(playerId),
      achievementService.getAchievementStats(playerId),
      achievementService.getTracker(playerId),
      achievementService.getPlayerTitles(playerId),
      achievementService.getActiveTitle(playerId),
    ]);

    achievementProgress.value = progress;
    achievementStats.value = stats;
    achievementTracker.value = tracker ?? null;
    playerTitles.value = titles;
    activeTitle.value = active;

    isAchievementInitialized.value = true;
  } catch (error) {
    console.error('Failed to initialize achievements:', error);
  } finally {
    isAchievementLoading.value = false;
  }
}

/**
 * 刷新成就数据
 */
export async function refreshAchievements(playerId: string): Promise<void> {
  if (!isAchievementInitialized.value) return;

  isAchievementLoading.value = true;

  try {
    const [progress, stats] = await Promise.all([
      achievementService.getAchievementProgress(playerId),
      achievementService.getAchievementStats(playerId),
    ]);

    achievementProgress.value = progress;
    achievementStats.value = stats;
  } catch (error) {
    console.error('Failed to refresh achievements:', error);
  } finally {
    isAchievementLoading.value = false;
  }
}

/**
 * 触发成就事件
 */
export async function triggerAchievementEvent(
  playerId: string,
  event: Omit<AchievementEvent, 'timestamp'>
): Promise<string[]> {
  if (!isAchievementInitialized.value) return [];

  try {
    const fullEvent: AchievementEvent = {
      ...event,
      timestamp: Date.now(),
    };

    const unlockedIds = await achievementService.processEvent(playerId, fullEvent);

    if (unlockedIds.length > 0) {
      // 更新新解锁成就列表
      newlyUnlockedAchievements.value = [
        ...newlyUnlockedAchievements.value,
        ...unlockedIds,
      ];

      // 刷新数据
      await refreshAchievements(playerId);

      // 更新称号列表
      const titles = await achievementService.getPlayerTitles(playerId);
      playerTitles.value = titles;
    }

    return unlockedIds;
  } catch (error) {
    console.error('Failed to process achievement event:', error);
    return [];
  }
}

/**
 * 领取成就奖励
 */
export async function claimAchievementReward(
  playerId: string,
  achievementId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await achievementService.claimReward(playerId, achievementId);

    if (result.success && result.reward) {
      // 实际发放奖励
      const reward = result.reward;

      // 发放金币
      if (reward.gold && reward.gold > 0) {
        updatePlayerGold(reward.gold);
      }

      // 发放经验
      if (reward.exp && reward.exp > 0) {
        addPlayerExp(reward.exp);
      }

      // 发放物品
      if (reward.items && reward.items.length > 0) {
        for (const itemReward of reward.items) {
          addItem(itemReward.itemId, itemReward.count);
        }
      }

      // 更新本地状态
      achievementProgress.value = achievementProgress.value.map(p => {
        if (p.achievement.id === achievementId) {
          return {
            ...p,
            playerData: { ...p.playerData, claimed: true, claimedAt: Date.now() },
            canClaim: false,
          };
        }
        return p;
      });

      // 更新统计
      if (achievementStats.value) {
        achievementStats.value = {
          ...achievementStats.value,
          claimedRewards: achievementStats.value.claimedRewards + 1,
        };
      }
    }

    return { success: result.success, message: result.message };
  } catch (error) {
    console.error('Failed to claim achievement reward:', error);
    return { success: false, message: '领取奖励失败' };
  }
}

/**
 * 激活称号
 */
export async function activatePlayerTitle(playerId: string, titleId: string): Promise<boolean> {
  try {
    const success = await achievementService.activateTitle(playerId, titleId);

    if (success) {
      // 更新本地状态
      playerTitles.value = playerTitles.value.map(t => ({
        ...t,
        isActive: t.titleId === titleId,
      }));

      const title = playerTitles.value.find(t => t.titleId === titleId);
      if (title) {
        activeTitle.value = { title: title.title, playerTitle: title };
      }
    }

    return success;
  } catch (error) {
    console.error('Failed to activate title:', error);
    return false;
  }
}

/**
 * 取消激活称号
 */
export async function deactivatePlayerTitle(playerId: string): Promise<boolean> {
  try {
    const success = await achievementService.deactivateTitle(playerId);

    if (success) {
      playerTitles.value = playerTitles.value.map(t => ({
        ...t,
        isActive: false,
      }));
      activeTitle.value = null;
    }

    return success;
  } catch (error) {
    console.error('Failed to deactivate title:', error);
    return false;
  }
}

/**
 * 设置选中的成就类别
 */
export function setSelectedAchievementCategory(category: AchievementCategory | 'all'): void {
  selectedAchievementCategory.value = category;
}

/**
 * 清除新解锁成就通知
 */
export function clearNewlyUnlockedAchievements(): void {
  newlyUnlockedAchievements.value = [];
}

/**
 * 清除特定的新解锁成就
 */
export function removeNewlyUnlockedAchievement(achievementId: string): void {
  newlyUnlockedAchievements.value = newlyUnlockedAchievements.value.filter(
    id => id !== achievementId
  );
}

/**
 * 重置成就系统状态
 */
export function resetAchievementState(): void {
  achievementProgress.value = [];
  achievementStats.value = null;
  achievementTracker.value = null;
  playerTitles.value = [];
  activeTitle.value = null;
  isAchievementInitialized.value = false;
  selectedAchievementCategory.value = 'all';
  newlyUnlockedAchievements.value = [];
  isAchievementLoading.value = false;

  // 清除服务缓存
  achievementService.clearCache();
}

/**
 * 获取成就进度信息
 */
export function getAchievementProgressInfo(achievementId: string): AchievementProgressInfo | undefined {
  return achievementProgress.value.find(p => p.achievement.id === achievementId);
}

/**
 * 批量触发成就事件
 */
export async function triggerMultipleAchievementEvents(
  playerId: string,
  events: Array<Omit<AchievementEvent, 'timestamp'>>
): Promise<string[]> {
  const allUnlocked: string[] = [];

  for (const event of events) {
    const unlocked = await triggerAchievementEvent(playerId, event);
    allUnlocked.push(...unlocked);
  }

  return [...new Set(allUnlocked)]; // 去重
}

/**
 * 快捷方法：更新等级
 */
export async function updateLevelAchievement(playerId: string, level: number): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'level_up',
    data: { level },
  });
}

/**
 * 快捷方法：更新击杀数
 */
export async function updateKillAchievement(
  playerId: string,
  isBoss: boolean = false
): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: isBoss ? 'boss_killed' : 'monster_killed',
    data: { isBoss },
  });
}

/**
 * 快捷方法：更新副本通关
 */
export async function updateDungeonAchievement(
  playerId: string,
  dungeonId: string,
  noDamage: boolean = false
): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'dungeon_cleared',
    data: { dungeonId, noDamage },
  });
}

/**
 * 快捷方法：更新装备收集
 */
export async function updateEquipmentAchievement(
  playerId: string,
  quality: string,
  totalCount: number
): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'equipment_obtained',
    data: { quality, count: totalCount },
  });
}

/**
 * 快捷方法：更新地图探索
 */
export async function updateMapExploration(playerId: string, mapId: string): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'map_entered',
    data: { mapId },
  });
}

/**
 * 快捷方法：更新好感度
 */
export async function updateFavorabilityAchievement(
  playerId: string,
  companionId: string,
  isMax: boolean
): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'favorability_increased',
    data: { companionId, isMax },
  });
}

/**
 * 快捷方法：更新战斗胜利
 */
export async function updateBattleWinAchievement(playerId: string): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'battle_won',
    data: {},
  });
}

/**
 * 快捷方法：更新伤害统计
 */
export async function updateDamageAchievement(playerId: string, damage: number): Promise<string[]> {
  return triggerAchievementEvent(playerId, {
    type: 'damage_dealt',
    data: { amount: damage },
  });
}

/**
 * 获取类别名称
 */
export function getCategoryName(category: AchievementCategory): string {
  return ACHIEVEMENT_CATEGORIES[category].name;
}

/**
 * 获取类别图标
 */
export function getCategoryIcon(category: AchievementCategory): string {
  return ACHIEVEMENT_CATEGORIES[category].icon;
}
