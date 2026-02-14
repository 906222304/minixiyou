// 任务面板组件

import { useSignals } from '@preact/signals-react/runtime';
import {
  questProgress,
  questStats,
  selectedQuestType,
  selectedQuestId,
  filteredQuestProgress,
  activeQuests,
  claimableQuests,
  mainQuestProgress,
  isQuestLoading,
  setSelectedQuestType,
  setSelectedQuestId,
  acceptQuest,
  claimQuestReward,
} from '@/signals/questSignals';
import { QUEST_TYPE_CONFIG, QUEST_CHAPTERS } from '@/constants/quests';
import { player } from '@/signals/playerSignals';
import { showSuccess, showError } from '@/signals/uiSignals';
import { QuestDialog } from './QuestDialog';
import type { QuestType, QuestProgressInfo } from '@/types/quest';

/** 任务类型筛选器 */
function QuestTypeFilter() {
  useSignals();

  const currentType = selectedQuestType.value;
  const stats = questStats.value;

  const types: (QuestType | 'all')[] = ['all', 'main', 'side', 'daily'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {types.map((type) => {
        const config = type === 'all'
          ? { name: '全部', icon: '📋' }
          : QUEST_TYPE_CONFIG[type];

        let count = 0;
        if (type === 'all') {
          count = stats?.inProgressQuests ?? 0;
        } else {
          count = questProgress.value.filter(
            (p) => p.quest.type === type && p.playerData.status === 'in_progress'
          ).length;
        }

        return (
          <button
            key={type}
            onClick={() => setSelectedQuestType(type)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${currentType === type
                ? 'bg-[var(--game-gold)] text-[var(--game-bg-dark)] shadow-lg'
                : 'bg-black/30 text-[var(--game-text-muted)] hover:text-white hover:bg-black/40'
              }
            `}
          >
            <span>{config.icon}</span>
            <span>{config.name}</span>
            {count > 0 && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 主线进度概览 */
function MainStoryProgress() {
  useSignals();

  const stats = questStats.value;
  const mainProgress = mainQuestProgress.value;

  if (!stats) return null;

  const currentChapter = QUEST_CHAPTERS.find(
    (c) => c.id === stats.mainStoryProgress.chapter
  );

  return (
    <div className="game-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">📜</span>
        <div className="flex-1">
          <h4 className="font-bold text-[var(--game-gold)]">主线剧情</h4>
          <p className="text-sm text-[var(--game-text-muted)]">
            {currentChapter?.icon} {stats.mainStoryProgress.chapterName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {mainProgress.completed}/{mainProgress.total}
          </div>
          <div className="text-xs text-[var(--game-text-muted)]">任务完成</div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--game-gold)] to-yellow-300 transition-all duration-500"
          style={{ width: `${mainProgress.percent}%` }}
        />
      </div>
    </div>
  );
}

/** 任务卡片 */
function QuestCard({
  progressInfo,
  onAccept,
  onClaim,
  onSelect,
}: {
  progressInfo: QuestProgressInfo;
  onAccept: () => void;
  onClaim: () => void;
  onSelect: () => void;
}) {
  useSignals();

  const { quest, playerData, progressPercent, canClaim, canAccept, showDetails, conditionDetails } = progressInfo;
  const isSelected = selectedQuestId.value === quest.id;

  const typeConfig = QUEST_TYPE_CONFIG[quest.type];

  const getStatusBadge = () => {
    switch (playerData.status) {
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">
            进行中
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-xs animate-pulse">
            待领取
          </span>
        );
      case 'claimed':
        return (
          <span className="px-2 py-0.5 bg-gray-900/50 text-gray-400 rounded text-xs">
            已完成
          </span>
        );
      case 'available':
        return (
          <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded text-xs">
            可接取
          </span>
        );
      default:
        return null;
    }
  };

  const renderRewards = () => {
    const rewards = quest.rewards;
    const items = [];

    if (rewards.gold) {
      items.push(
        <span key="gold" className="flex items-center gap-1 text-xs text-yellow-400">
          <span>💰</span>
          <span>{rewards.gold}</span>
        </span>
      );
    }

    if (rewards.exp) {
      items.push(
        <span key="exp" className="flex items-center gap-1 text-xs text-green-400">
          <span>✨</span>
          <span>{rewards.exp}</span>
        </span>
      );
    }

    return items;
  };

  return (
    <div
      className={`
        game-panel p-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-[var(--game-gold)]' : ''}
        ${canClaim ? 'border-2 border-green-500/50' : ''}
      `}
      onClick={onSelect}
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${typeConfig.color}20` }}
        >
          {quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white truncate">{quest.name}</h4>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-[var(--game-text-muted)] line-clamp-2">
            {quest.description}
          </p>
        </div>
      </div>

      {/* 条件进度 */}
      {showDetails && conditionDetails.length > 0 && (
        <div className="space-y-2 mb-3">
          {conditionDetails.map((cd, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className={`text-sm ${cd.completed ? 'text-green-400' : 'text-[var(--game-text-muted)]'}`}
              >
                {cd.completed ? '✓' : '○'}
              </span>
              <span className="text-sm text-[var(--game-text-muted)] flex-1">
                {cd.condition.description}
              </span>
              <span className="text-sm font-medium">
                <span className={cd.completed ? 'text-green-400' : 'text-white'}>
                  {Math.min(cd.current, cd.required)}
                </span>
                <span className="text-[var(--game-text-dim)]">/{cd.required}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 进度条 */}
      {playerData.status === 'in_progress' && (
        <div className="mb-3">
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progressPercent >= 100
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-blue-500 to-blue-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 底部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {renderRewards()}
        </div>

        <div className="flex items-center gap-2">
          {canAccept && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="px-4 py-1.5 bg-[var(--game-gold)] text-[var(--game-bg-dark)] rounded-lg text-sm font-medium hover:brightness-110 transition-all"
            >
              接取任务
            </button>
          )}
          {canClaim && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaim();
              }}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-all"
            >
              领取奖励
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** 任务详情面板 */
function QuestDetailPanel() {
  useSignals();

  const detail = selectedQuestId.value
    ? questProgress.value.find((p) => p.quest.id === selectedQuestId.value)
    : null;

  if (!detail) return null;

  const { quest, conditionDetails, canAccept, canClaim } = detail;
  const currentPlayer = player.value;

  const handleAccept = async () => {
    if (!currentPlayer) return;

    const result = await acceptQuest(currentPlayer.id, quest.id);
    if (result.success) {
      showSuccess('任务接取成功！');
    } else {
      showError(result.message);
    }
  };

  const handleClaim = async () => {
    if (!currentPlayer) return;

    const result = await claimQuestReward(currentPlayer.id, quest.id);
    if (result.success) {
      showSuccess('奖励领取成功！');
    } else {
      showError(result.message);
    }
  };

  return (
    <div className="game-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--game-gold)]">任务详情</h3>
        <button
          onClick={() => setSelectedQuestId(null)}
          className="text-[var(--game-text-muted)] hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* 任务信息 */}
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-white mb-1">{quest.name}</h4>
          <p className="text-sm text-[var(--game-text-muted)]">{quest.description}</p>
        </div>

        {/* 条件列表 */}
        {conditionDetails.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-[var(--game-text-muted)] mb-2">任务条件</h5>
            <div className="space-y-2">
              {conditionDetails.map((cd, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    cd.completed ? 'bg-green-900/20' : 'bg-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={cd.completed ? 'text-green-400' : 'text-white'}>
                      {cd.condition.description}
                    </span>
                    <span className="text-sm">
                      <span className={cd.completed ? 'text-green-400' : 'text-white'}>
                        {Math.min(cd.current, cd.required)}
                      </span>
                      <span className="text-[var(--game-text-dim)]">/{cd.required}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 奖励预览 */}
        <div>
          <h5 className="text-sm font-medium text-[var(--game-text-muted)] mb-2">任务奖励</h5>
          <div className="flex flex-wrap gap-3">
            {quest.rewards.gold && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-900/30 rounded-lg">
                <span>💰</span>
                <span className="text-yellow-400 font-medium">{quest.rewards.gold}</span>
              </div>
            )}
            {quest.rewards.exp && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 rounded-lg">
                <span>✨</span>
                <span className="text-green-400 font-medium">{quest.rewards.exp}</span>
              </div>
            )}
            {quest.rewards.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 rounded-lg">
                <span>📦</span>
                <span className="text-blue-400 font-medium">{item.itemId} x{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 提示 */}
        {quest.hints && quest.hints.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-[var(--game-text-muted)] mb-2">提示</h5>
            <ul className="text-sm text-[var(--game-text-dim)] space-y-1">
              {quest.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          {canAccept && (
            <button onClick={handleAccept} className="game-btn game-btn-primary flex-1">
              接取任务
            </button>
          )}
          {canClaim && (
            <button onClick={handleClaim} className="game-btn game-btn-success flex-1">
              领取奖励
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** 任务列表 */
function QuestList() {
  useSignals();

  const progress = filteredQuestProgress.value;
  const loading = isQuestLoading.value;
  const currentPlayer = player.value;

  // 排序：进行中 > 可领取 > 可接取 > 已完成
  const sortedProgress = [...progress].sort((a, b) => {
    const statusOrder = {
      in_progress: 0,
      completed: 1,
      available: 2,
      claimed: 3,
      locked: 4,
    };

    const orderA = statusOrder[a.playerData.status] ?? 5;
    const orderB = statusOrder[b.playerData.status] ?? 5;

    if (orderA !== orderB) return orderA - orderB;

    // 同状态按进度排序
    return b.progressPercent - a.progressPercent;
  });

  const handleAccept = async (questId: string) => {
    if (!currentPlayer) return;

    const result = await acceptQuest(currentPlayer.id, questId);
    if (result.success) {
      showSuccess('任务接取成功！');
    } else {
      showError(result.message);
    }
  };

  const handleClaim = async (questId: string) => {
    if (!currentPlayer) return;

    const result = await claimQuestReward(currentPlayer.id, questId);
    if (result.success) {
      showSuccess('奖励领取成功！');
    } else {
      showError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="game-panel p-8 text-center">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-[var(--game-text-muted)]">加载任务数据...</p>
      </div>
    );
  }

  if (sortedProgress.length === 0) {
    return (
      <div className="game-panel p-8 text-center">
        <div className="text-4xl mb-3">📜</div>
        <p className="text-[var(--game-text-muted)]">暂无任务</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedProgress.map((progressInfo) => (
        <QuestCard
          key={progressInfo.quest.id}
          progressInfo={progressInfo}
          onAccept={() => handleAccept(progressInfo.quest.id)}
          onClaim={() => handleClaim(progressInfo.quest.id)}
          onSelect={() => setSelectedQuestId(progressInfo.quest.id)}
        />
      ))}
    </div>
  );
}

/** 快速任务追踪栏 */
function QuickQuestTracker() {
  useSignals();

  const active = activeQuests.value.slice(0, 3); // 最多显示3个

  if (active.length === 0) return null;

  return (
    <div className="game-panel p-3">
      <h4 className="text-sm font-medium text-[var(--game-text-muted)] mb-2 flex items-center gap-2">
        <span>📋</span>
        <span>当前任务</span>
      </h4>
      <div className="space-y-2">
        {active.map((p) => (
          <button
            key={p.quest.id}
            onClick={() => setSelectedQuestId(p.quest.id)}
            className="w-full text-left p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{p.quest.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{p.quest.name}</div>
                <div className="text-xs text-[var(--game-text-muted)]">
                  {p.conditionDetails.find((cd) => !cd.completed)?.condition.description || '已完成'}
                </div>
              </div>
              {p.canClaim && (
                <span className="text-xs text-green-400 animate-pulse">待领取</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuestPanel() {
  useSignals();

  return (
    <div className="space-y-4 -mt-2">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📜</span>
          <h2 className="text-xl font-bold text-[var(--game-gold)]">任务</h2>
        </div>

        {/* 快速统计 */}
        {questStats.value && (
          <div className="flex items-center gap-4 text-sm">
            <div className="text-[var(--game-text-muted)]">
              <span className="text-[var(--game-gold)] font-bold">
                {questStats.value.completedQuests}
              </span>
              <span> / {questStats.value.totalQuests}</span>
            </div>
            {claimableQuests.value.length > 0 && (
              <div className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs animate-pulse">
                {claimableQuests.value.length} 个奖励待领取
              </div>
            )}
          </div>
        )}
      </div>

      {/* 主线进度 */}
      <MainStoryProgress />

      {/* 类型筛选 */}
      <QuestTypeFilter />

      {/* 主体区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 任务列表 */}
        <div className="lg:col-span-2">
          <QuestList />
        </div>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {/* 快速追踪 */}
          <QuickQuestTracker />

          {/* 任务详情 */}
          {selectedQuestId.value && <QuestDetailPanel />}
        </div>
      </div>

      {/* 对话弹窗 */}
      <QuestDialog />
    </div>
  );
}

export default QuestPanel;
