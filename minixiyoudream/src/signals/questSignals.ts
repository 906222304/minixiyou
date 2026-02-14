// 任务系统状态管理

import { signal, computed } from '@preact/signals-react';
import { questService } from '@/services/questService';
import { QUEST_TYPE_CONFIG, QUEST_CHAPTERS } from '@/constants/quests';
import { updatePlayerGold, addPlayerExp } from './playerSignals';
import { addItem } from './inventorySignals';
import type {
  QuestProgressInfo,
  QuestStats,
  QuestTracker,
  QuestEvent,
  QuestType,
  DialogLine,
  Quest,
} from '@/types/quest';

/** 任务进度列表 */
export const questProgress = signal<QuestProgressInfo[]>([]);

/** 任务统计 */
export const questStats = signal<QuestStats | null>(null);

/** 追踪器数据 */
export const questTracker = signal<QuestTracker | null>(null);

/** 是否已初始化 */
export const isQuestInitialized = signal(false);

/** 当前选中的任务类型 */
export const selectedQuestType = signal<QuestType | 'all'>('all');

/** 当前选中的任务ID（用于详情展示） */
export const selectedQuestId = signal<string | null>(null);

/** 当前显示的对话 */
export const currentDialog = signal<DialogLine[] | null>(null);

/** 当前对话索引 */
export const currentDialogIndex = signal(0);

/** 是否正在加载 */
export const isQuestLoading = signal(false);

/** 新完成的任务ID列表 */
export const newlyCompletedQuests = signal<string[]>([]);

/** 筛选后的任务进度 */
export const filteredQuestProgress = computed(() => {
  const progress = questProgress.value;
  const type = selectedQuestType.value;

  if (type === 'all') {
    return progress;
  }

  return progress.filter((p) => p.quest.type === type);
});

/** 进行中的任务 */
export const activeQuests = computed(() => {
  return questProgress.value.filter(
    (p) => p.playerData.status === 'in_progress' || p.playerData.status === 'completed'
  );
});

/** 可接取的任务 */
export const availableQuests = computed(() => {
  return questProgress.value.filter((p) => p.canAccept);
});

/** 可领取奖励的任务 */
export const claimableQuests = computed(() => {
  return questProgress.value.filter((p) => p.canClaim);
});

/** 主线任务进度 */
export const mainQuestProgress = computed(() => {
  const progress = questProgress.value.filter((p) => p.quest.type === 'main');
  const completed = progress.filter(
    (p) => p.playerData.status === 'completed' || p.playerData.status === 'claimed'
  ).length;

  return {
    completed,
    total: progress.length,
    percent: progress.length > 0 ? (completed / progress.length) * 100 : 0,
  };
});

/** 当前选中的任务详情 */
export const selectedQuestDetail = computed(() => {
  const questId = selectedQuestId.value;
  if (!questId) return null;

  return questProgress.value.find((p) => p.quest.id === questId) || null;
});

/** 是否有对话显示中 */
export const isDialogActive = computed(() => {
  return currentDialog.value !== null && currentDialog.value.length > 0;
});

/** 当前对话行 */
export const currentDialogLine = computed(() => {
  const dialog = currentDialog.value;
  const index = currentDialogIndex.value;

  if (!dialog || index >= dialog.length) {
    return null;
  }

  return dialog[index];
});

/**
 * 初始化任务系统
 */
export async function initQuests(playerId: string, playerLevel: number): Promise<void> {
  if (isQuestInitialized.value) return;

  isQuestLoading.value = true;

  try {
    // 初始化并加载数据
    await questService.initPlayerQuests(playerId);

    // 并行加载所有数据
    const [progress, stats, tracker] = await Promise.all([
      questService.getQuestProgress(playerId, playerLevel),
      questService.getQuestStats(playerId, playerLevel),
      questService.getTracker(playerId),
    ]);

    questProgress.value = progress;
    questStats.value = stats;
    questTracker.value = tracker ?? null;

    isQuestInitialized.value = true;

    // 处理自动接取任务的开始对话
    // 找到刚自动接取且尚未显示过对话的任务
    for (const progressInfo of progress) {
      if (progressInfo.playerData.status === 'in_progress' &&
          progressInfo.quest.autoAccept &&
          progressInfo.quest.startDialog &&
          progressInfo.quest.startDialog.length > 0) {
        // 检查是否是新接取的任务（acceptedAt在最近10秒内）
        const acceptedAt = progressInfo.playerData.acceptedAt || 0;
        const isNewlyAccepted = Date.now() - acceptedAt < 10000;
        if (isNewlyAccepted) {
          showQuestDialog(progressInfo.quest.startDialog);
          break; // 只显示一个对话
        }
      }
    }

    // 自动完成无条件的任务
    for (const progressInfo of progress) {
      if (progressInfo.playerData.status === 'in_progress' &&
          progressInfo.quest.conditions.length === 0) {
        // 无条件的任务直接完成
        await completeQuest(playerId, progressInfo.quest.id);
      }
    }

    // 刷新进度后，自动接取可接取的主线任务
    const updatedProgress = await questService.getQuestProgress(playerId, playerLevel);
    for (const progressInfo of updatedProgress) {
      if (progressInfo.canAccept && progressInfo.quest.type === 'main') {
        // 自动接取主线任务
        await acceptQuest(playerId, progressInfo.quest.id);
      }
    }

    // 最终刷新一次进度
    const finalProgress = await questService.getQuestProgress(playerId, playerLevel);
    questProgress.value = finalProgress;

    // 处理新接取任务的开始对话
    for (const progressInfo of finalProgress) {
      if (progressInfo.playerData.status === 'in_progress' &&
          progressInfo.quest.startDialog &&
          progressInfo.quest.startDialog.length > 0) {
        const playerData = progressInfo.playerData as { acceptedAt?: number };
        const acceptedAt = playerData.acceptedAt || 0;
        const isNewlyAccepted = Date.now() - acceptedAt < 10000;
        if (isNewlyAccepted) {
          showQuestDialog(progressInfo.quest.startDialog);
          break;
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize quests:', error);
  } finally {
    isQuestLoading.value = false;
  }
}

/**
 * 刷新任务数据
 */
export async function refreshQuests(playerId: string, playerLevel: number): Promise<void> {
  if (!isQuestInitialized.value) return;

  isQuestLoading.value = true;

  try {
    const [progress, stats] = await Promise.all([
      questService.getQuestProgress(playerId, playerLevel),
      questService.getQuestStats(playerId, playerLevel),
    ]);

    questProgress.value = progress;
    questStats.value = stats;
  } catch (error) {
    console.error('Failed to refresh quests:', error);
  } finally {
    isQuestLoading.value = false;
  }
}

/**
 * 接取任务
 */
export async function acceptQuest(playerId: string, questId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const result = await questService.acceptQuest(playerId, questId);

    if (result.success && result.quest) {
      // 显示开始对话
      if (result.quest.startDialog && result.quest.startDialog.length > 0) {
        showQuestDialog(result.quest.startDialog);
      }

      // 更新本地状态
      questProgress.value = questProgress.value.map((p) => {
        if (p.quest.id === questId) {
          return {
            ...p,
            playerData: {
              ...p.playerData,
              status: 'in_progress',
              acceptedAt: Date.now(),
            },
            canAccept: false,
            showDetails: true,
          };
        }
        return p;
      });
    }

    return { success: result.success, message: result.message };
  } catch (error) {
    console.error('Failed to accept quest:', error);
    return { success: false, message: '接取任务失败' };
  }
}

/**
 * 完成任务
 */
export async function completeQuest(playerId: string, questId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const result = await questService.completeQuest(playerId, questId);

    if (result.success && result.quest) {
      // 显示完成对话
      if (result.quest.completeDialog && result.quest.completeDialog.length > 0) {
        showQuestDialog(result.quest.completeDialog);
      }

      // 更新本地状态
      questProgress.value = questProgress.value.map((p) => {
        if (p.quest.id === questId) {
          return {
            ...p,
            playerData: {
              ...p.playerData,
              status: 'completed',
              completedAt: Date.now(),
            },
            progressPercent: 100,
            canClaim: true,
          };
        }
        return p;
      });

      // 更新新完成任务列表
      newlyCompletedQuests.value = [...newlyCompletedQuests.value, questId];
    }

    return { success: result.success, message: result.message };
  } catch (error) {
    console.error('Failed to complete quest:', error);
    return { success: false, message: '完成任务失败' };
  }
}

/**
 * 领取任务奖励
 */
export async function claimQuestReward(playerId: string, questId: string): Promise<{
  success: boolean;
  message: string;
  rewards?: Quest['rewards'];
}> {
  try {
    const result = await questService.claimReward(playerId, questId);

    if (result.success && result.rewards) {
      // 实际发放奖励
      const rewards = result.rewards;

      // 发放金币
      if (rewards.gold && rewards.gold > 0) {
        updatePlayerGold(rewards.gold);
      }

      // 发放经验
      if (rewards.exp && rewards.exp > 0) {
        addPlayerExp(rewards.exp);
      }

      // 发放物品
      if (rewards.items && rewards.items.length > 0) {
        for (const itemReward of rewards.items) {
          addItem(itemReward.itemId, itemReward.count);
        }
      }

      // 更新本地状态
      questProgress.value = questProgress.value.map((p) => {
        if (p.quest.id === questId) {
          return {
            ...p,
            playerData: {
              ...p.playerData,
              status: 'claimed',
              claimedAt: Date.now(),
            },
            canClaim: false,
          };
        }
        return p;
      });

      // 更新统计
      if (questStats.value) {
        questStats.value = {
          ...questStats.value,
          completedQuests: questStats.value.completedQuests + 1,
        };
      }
    }

    return {
      success: result.success,
      message: result.message,
      rewards: result.rewards,
    };
  } catch (error) {
    console.error('Failed to claim quest reward:', error);
    return { success: false, message: '领取奖励失败' };
  }
}

/**
 * 触发任务事件
 */
export async function triggerQuestEvent(
  playerId: string,
  event: QuestEvent
): Promise<string[]> {
  if (!isQuestInitialized.value) return [];

  try {
    const updatedIds = await questService.processEvent(playerId, event);

    if (updatedIds.length > 0) {
      // 刷新任务进度
      const playerLevel = 1; // 从玩家数据获取
      await refreshQuests(playerId, playerLevel);

      // 检查是否有任务可以完成
      for (const questId of updatedIds) {
        const progress = questProgress.value.find((p) => p.quest.id === questId);
        if (progress && progress.playerData.status === 'in_progress') {
          // 检查是否所有条件都满足
          const allCompleted = progress.conditionDetails.every((cd) => cd.completed);
          if (allCompleted) {
            // 自动完成任务
            await completeQuest(playerId, questId);
          }
        }
      }
    }

    return updatedIds;
  } catch (error) {
    console.error('Failed to process quest event:', error);
    return [];
  }
}

/**
 * 显示任务对话
 */
export function showQuestDialog(dialog: DialogLine[]): void {
  currentDialog.value = dialog;
  currentDialogIndex.value = 0;
}

/**
 * 推进对话
 */
export function advanceDialog(): void {
  const dialog = currentDialog.value;
  const index = currentDialogIndex.value;

  if (!dialog) return;

  if (index < dialog.length - 1) {
    currentDialogIndex.value = index + 1;
  } else {
    // 对话结束
    closeDialog();
  }
}

/**
 * 关闭对话
 */
export function closeDialog(): void {
  currentDialog.value = null;
  currentDialogIndex.value = 0;
}

/**
 * 设置选中的任务类型
 */
export function setSelectedQuestType(type: QuestType | 'all'): void {
  selectedQuestType.value = type;
}

/**
 * 设置选中的任务ID
 */
export function setSelectedQuestId(questId: string | null): void {
  selectedQuestId.value = questId;
}

/**
 * 清除新完成任务通知
 */
export function clearNewlyCompletedQuests(): void {
  newlyCompletedQuests.value = [];
}

/**
 * 移除特定的新完成任务
 */
export function removeNewlyCompletedQuest(questId: string): void {
  newlyCompletedQuests.value = newlyCompletedQuests.value.filter((id) => id !== questId);
}

/**
 * 重置任务系统状态
 */
export function resetQuestState(): void {
  questProgress.value = [];
  questStats.value = null;
  questTracker.value = null;
  isQuestInitialized.value = false;
  selectedQuestType.value = 'all';
  selectedQuestId.value = null;
  currentDialog.value = null;
  currentDialogIndex.value = 0;
  isQuestLoading.value = false;
  newlyCompletedQuests.value = [];

  // 清除服务缓存
  questService.clearCache();
}

/**
 * 获取任务进度信息
 */
export function getQuestProgressInfo(questId: string): QuestProgressInfo | undefined {
  return questProgress.value.find((p) => p.quest.id === questId);
}

/**
 * 快捷方法：更新击杀事件
 */
export async function updateKillQuestEvent(
  playerId: string,
  monsterId: string,
  isBoss: boolean = false
): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'monster_killed',
    targetId: isBoss ? 'boss' : monsterId,
    count: 1,
    data: { monsterId, isBoss },
  });
}

/**
 * 快捷方法：更新物品收集事件
 */
export async function updateItemCollectEvent(
  playerId: string,
  itemId: string,
  count: number = 1
): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'item_collected',
    targetId: itemId,
    count,
  });
}

/**
 * 快捷方法：更新NPC对话事件
 */
export async function updateNpcTalkEvent(playerId: string, npcId: string): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'npc_talked',
    targetId: npcId,
  });
}

/**
 * 快捷方法：更新地图访问事件
 */
export async function updateMapVisitEvent(playerId: string, mapId: string): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'map_reached',
    targetId: mapId,
  });
}

/**
 * 快捷方法：更新装备事件
 */
export async function updateEquipEvent(playerId: string, equipmentId: string): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'item_equipped',
    targetId: equipmentId,
  });
}

/**
 * 快捷方法：更新等级事件
 */
export async function updateLevelQuestEvent(playerId: string, level: number): Promise<string[]> {
  // 更新等级条件
  const updatedIds = await questService.updateLevelCondition(playerId, level);

  if (updatedIds.length > 0) {
    // 刷新任务进度
    await refreshQuests(playerId, level);

    // 检查是否有任务可以完成
    for (const questId of updatedIds) {
      const progress = questProgress.value.find((p) => p.quest.id === questId);
      if (progress && progress.playerData.status === 'in_progress') {
        const allCompleted = progress.conditionDetails.every((cd) => cd.completed);
        if (allCompleted) {
          await completeQuest(playerId, questId);
        }
      }
    }
  }

  return updatedIds;
}

/**
 * 快捷方法：更新战斗胜利事件
 */
export async function updateBattleWinEvent(playerId: string): Promise<string[]> {
  return triggerQuestEvent(playerId, {
    type: 'battle_won',
    targetId: 'any',
    count: 1,
  });
}

/**
 * 获取任务类型名称
 */
export function getQuestTypeName(type: QuestType): string {
  return QUEST_TYPE_CONFIG[type].name;
}

/**
 * 获取任务类型图标
 */
export function getQuestTypeIcon(type: QuestType): string {
  return QUEST_TYPE_CONFIG[type].icon;
}

/**
 * 获取章节名称
 */
export function getChapterName(chapterId: number): string {
  return QUEST_CHAPTERS.find((c) => c.id === chapterId)?.name || `第${chapterId}章`;
}
