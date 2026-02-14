// 常驻任务提示组件 - 紧凑内联版本，用于放在欢迎卡片右边

import { useState, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  questProgress,
  activeQuests,
  claimableQuests,
  getQuestTypeName,
  getQuestTypeIcon,
} from '@/signals/questSignals';
import { navigateTo, currentPage } from '@/signals';
import type { QuestProgressInfo } from '@/types/quest';

/** 获取任务优先级（用于排序） */
function getQuestPriority(progressInfo: QuestProgressInfo): number {
  const { quest, playerData, canClaim } = progressInfo;

  // 可领取奖励的任务优先级最高
  if (canClaim || playerData.status === 'completed') return 0;

  // 主线任务优先
  if (quest.type === 'main') return 1;

  // 日常任务
  if (quest.type === 'daily') return 2;

  // 支线任务
  if (quest.type === 'side') return 3;

  return 4;
}

/** 获取最重要的任务 */
function getMostImportantQuest(progressList: QuestProgressInfo[]): QuestProgressInfo | null {
  // 先检查可领取奖励的任务
  const claimable = progressList.filter((p) => p.canClaim);
  if (claimable.length > 0) {
    return claimable[0];
  }

  // 进行中的任务
  const inProgress = progressList.filter((p) => p.playerData.status === 'in_progress');
  if (inProgress.length === 0) return null;

  // 按优先级排序
  const sorted = [...inProgress].sort((a, b) => getQuestPriority(a) - getQuestPriority(b));
  return sorted[0];
}

/** 获取下一步提示文本 */
function getNextStepHint(progressInfo: QuestProgressInfo): string {
  const { conditionDetails } = progressInfo;

  // 找到第一个未完成的条件
  const nextCondition = conditionDetails.find((cd) => !cd.completed);

  if (nextCondition) {
    return `${nextCondition.condition.description} (${Math.min(nextCondition.current, nextCondition.required)}/${nextCondition.required})`;
  }

  // 所有条件已完成
  if (progressInfo.canClaim) {
    return '点击领取奖励';
  }

  return '任务已完成';
}

/** 紧凑内联版本 - 用于欢迎信息旁边 */
export function QuestHintInline() {
  useSignals();

  const progress = questProgress.value;

  // 获取最重要的任务
  const primaryQuest = getMostImportantQuest(progress);

  // 如果没有进行中的任务，显示默认提示
  if (!primaryQuest) {
    return (
      <div className="flex items-center gap-2 ml-4 px-3 py-2 bg-gray-100 rounded-lg">
        <span className="text-lg">📋</span>
        <span className="text-sm text-gray-500">暂无进行中的任务</span>
      </div>
    );
  }

  const { quest, playerData, canClaim } = primaryQuest;
  const nextStep = getNextStepHint(primaryQuest);

  // 点击跳转到任务页面
  const handleClick = () => {
    navigateTo('quest');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center gap-3 ml-4 px-4 py-2 rounded-full cursor-pointer transition-all
        ${canClaim
          ? 'bg-green-100 hover:bg-green-200 border-2 border-green-400'
          : 'bg-[var(--game-gold)]/10 hover:bg-[var(--game-gold)]/20 border-2 border-[var(--game-gold)]/30'
        }
      `}
    >
      {/* 任务图标 */}
      <span className="text-xl">{getQuestTypeIcon(quest.type)}</span>

      {/* 任务信息 */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-800">{quest.name}</span>
          {canClaim && (
            <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse">
              领取
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 truncate max-w-[200px]">{nextStep}</span>
      </div>

      {/* 进度指示 */}
      {playerData.status === 'in_progress' && !canClaim && (
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--game-gold)] to-yellow-400"
              style={{ width: `${Math.min(primaryQuest.progressPercent, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{Math.round(primaryQuest.progressPercent)}%</span>
        </div>
      )}

      {/* 箭头 */}
      <span className="text-gray-400">›</span>
    </div>
  );
}

/** 完整版本 - 固定在右下角 */
export function QuestHint() {
  useSignals();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const progress = questProgress.value;
  const active = activeQuests.value;
  const claimable = claimableQuests.value;
  const page = currentPage.value;

  // 如果在任务页面或首页，隐藏提示
  useEffect(() => {
    if (page === 'quest' || page === 'home') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [page]);

  // 获取最重要的任务
  const primaryQuest = getMostImportantQuest(progress);

  // 如果没有进行中的任务，不显示
  if (!primaryQuest || !isVisible) return null;

  const { quest, playerData, canClaim } = primaryQuest;
  const nextStep = getNextStepHint(primaryQuest);

  // 是否有多个任务
  const hasMultipleQuests = active.length > 1;
  const claimableCount = claimable.length;

  // 点击跳转到任务页面
  const handleViewDetails = () => {
    navigateTo('quest');
  };

  // 切换展开状态
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 获取前3个任务用于展开列表
  const displayQuests = active.slice(0, 3);

  return (
    <div
      className={`
        fixed z-30 transition-all duration-300 ease-out
        right-4 bottom-24
      `}
      style={{
        maxWidth: isExpanded ? '320px' : '240px',
      }}
    >
      {/* 主卡片 */}
      <div
        className={`
          bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[var(--game-border)]
          overflow-hidden transition-all duration-300
          ${canClaim ? 'ring-2 ring-green-400/50' : ''}
        `}
      >
        {/* 标题栏 */}
        <div
          className={`
            px-3 py-2 flex items-center justify-between cursor-pointer
            ${canClaim
              ? 'bg-gradient-to-r from-green-500/20 to-green-400/10'
              : 'bg-gradient-to-r from-[var(--game-gold)]/10 to-transparent'
            }
          `}
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getQuestTypeIcon(quest.type)}</span>
            <span className="text-xs font-medium text-[var(--game-text-muted)]">
              {getQuestTypeName(quest.type)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {claimableCount > 0 && (
              <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse">
                {claimableCount}
              </span>
            )}
            <span className={`text-xs text-[var(--game-text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>

        {/* 任务内容 */}
        <div className="px-3 py-2">
          <div className="font-medium text-[var(--game-text)] text-sm truncate mb-1">
            {quest.name}
          </div>
          <div className="text-xs text-[var(--game-text-muted)] line-clamp-1">
            {nextStep}
          </div>
          {playerData.status === 'in_progress' && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  canClaim
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-[var(--game-gold)] to-yellow-400'
                }`}
                style={{ width: `${Math.min(primaryQuest.progressPercent, 100)}%` }}
              />
            </div>
          )}
          {canClaim && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <span className="animate-bounce">🎁</span>
              <span className="font-medium">奖励可领取！</span>
            </div>
          )}
        </div>

        {isExpanded && hasMultipleQuests && (
          <div className="border-t border-[var(--game-border)] bg-gray-50/50">
            <div className="px-3 py-2">
              <div className="text-xs text-[var(--game-text-muted)] mb-2">其他进行中的任务</div>
              <div className="space-y-1.5">
                {displayQuests.filter((p) => p.quest.id !== primaryQuest.quest.id).map((p) => (
                  <div
                    key={p.quest.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <span className="text-sm">{getQuestTypeIcon(p.quest.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--game-text)] truncate">{p.quest.name}</div>
                      <div className="text-xs text-[var(--game-text-muted)]">
                        {p.canClaim ? '待领取' : `${Math.round(p.progressPercent)}%`}
                      </div>
                    </div>
                    {p.canClaim && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleViewDetails}
          className={`
            w-full py-2 text-xs font-medium transition-colors
            ${canClaim
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-[var(--game-gold)]/10 text-[var(--game-gold-dark)] hover:bg-[var(--game-gold)]/20'
            }
          `}
        >
          {canClaim ? '领取奖励' : '点击查看'}
        </button>
      </div>

      {hasMultipleQuests && !isExpanded && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--game-gold)] text-white text-xs rounded-full flex items-center justify-center shadow-md font-bold">
          {active.length}
        </div>
      )}
    </div>
  );
}

export default QuestHint;
