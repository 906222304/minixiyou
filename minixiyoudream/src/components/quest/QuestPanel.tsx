// 任务面板组件 - 简洁布局

import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  questProgress,
  questStats,
  selectedQuestType,
  selectedQuestId,
  selectedQuestStatus,
  filteredQuestProgress,
  claimableQuests,
  availableQuests,
  isQuestLoading,
  trackedQuestId,
  setSelectedQuestType,
  setSelectedQuestId,
  setSelectedQuestStatus,
  setTrackedQuest,
  acceptQuest,
  claimQuestReward,
} from '@/signals/questSignals';
import { QUEST_TYPE_CONFIG } from '@/constants/quests';
import { player } from '@/signals/playerSignals';
import { showSuccess, showError, returnToExplore, questNavigationSource } from '@/signals/uiSignals';
import { QuestDialog } from './QuestDialog';
import type { QuestType, QuestProgressInfo } from '@/types/quest';

export function QuestPanel() {
  useSignals();

  // 根据导航来源自动切换视图，默认显示进行中
  useEffect(() => {
    const source = questNavigationSource.value;
    if (source === 'claimable') {
      setSelectedQuestStatus('completed');
    } else if (source === 'available') {
      setSelectedQuestStatus('available');
    } else {
      // 默认显示进行中的任务
      setSelectedQuestStatus('in_progress');
    }
  }, []);

  const progress = filteredQuestProgress.value;
  const loading = isQuestLoading.value;
  const currentPlayer = player.value;
  const currentStatus = selectedQuestStatus.value;
  const currentType = selectedQuestType.value;
  const stats = questStats.value;
  const claimable = claimableQuests.value;
  const available = availableQuests.value;

  // 排序
  const sortedProgress = [...progress].sort((a, b) => {
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

  // 状态选项 - 移除"全部"
  const statusOptions = [
    { status: 'in_progress' as const, icon: '🔄', name: '进行中', count: questProgress.value.filter(p => p.playerData.status === 'in_progress').length },
    { status: 'completed' as const, icon: '🎁', name: '可领取', count: claimable.length },
    { status: 'available' as const, icon: '📝', name: '可接取', count: available.length },
  ];

  // 类型选项 - 移除"全部类型"
  const typeOptions: QuestType[] = ['main', 'side', 'daily'];

  // 获取空状态提示
  const getEmptyMessage = () => {
    switch (currentStatus) {
      case 'in_progress':
        return { icon: '🔄', title: '没有进行中的任务', hint: '查看"可接取"获取新任务' };
      case 'completed':
        return { icon: '🎁', title: '没有可领取的奖励', hint: '完成任务后来这里领取' };
      case 'available':
        return { icon: '📝', title: '没有可接取的任务', hint: '提升等级解锁更多任务' };
      default:
        return { icon: '📜', title: '暂无任务', hint: '' };
    }
  };

  return (
    <div className="space-y-3 -mt-2">
      {/* 返回按钮 */}
      <button
        onClick={returnToExplore}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--game-text-muted)] hover:text-[var(--game-text)] active:bg-white/10 rounded-lg transition-colors touch-manipulation"
      >
        <span>←</span>
        <span>返回西游</span>
      </button>

      {/* 标题栏 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <h2 className="text-lg font-bold text-[var(--game-gold)]">任务</h2>
        </div>
        {stats && (
          <div className="text-sm text-[var(--game-text-muted)]">
            <span className="text-[var(--game-gold)] font-bold">{stats.completedQuests}</span>
            <span> / {stats.totalQuests}</span>
          </div>
        )}
      </div>

      {/* 状态筛选 Tab */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {statusOptions.map((opt) => (
          <button
            key={opt.status}
            onClick={() => setSelectedQuestStatus(opt.status)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1
              ${currentStatus === opt.status
                ? 'bg-[var(--game-gold)] text-white'
                : 'bg-slate-100 text-[var(--game-text)] hover:bg-slate-200 active:bg-slate-300'
              }
            `}
          >
            <span>{opt.icon}</span>
            <span>{opt.name}</span>
            {opt.count > 0 && (
              <span className="px-1 py-0.5 bg-white/20 rounded text-[10px]">{opt.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* 类型筛选 Tab */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {typeOptions.map((type) => {
          const config = QUEST_TYPE_CONFIG[type];
          const count = progress.filter(p => p.quest.type === type).length;

          return (
            <button
              key={type}
              onClick={() => setSelectedQuestType(type)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1
                ${currentType === type
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-[var(--game-text)] hover:bg-slate-200 active:bg-slate-300'
                }
              `}
            >
              <span>{config.icon}</span>
              <span>{config.name}</span>
              {count > 0 && (
                <span className="px-1 py-0.5 bg-white/20 rounded text-[10px]">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 任务列表 */}
      {loading ? (
        <div className="game-panel p-8 text-center">
          <div className="text-3xl mb-2 animate-spin">⏳</div>
          <p className="text-sm text-[var(--game-text-muted)]">加载中...</p>
        </div>
      ) : sortedProgress.length === 0 ? (
        <div className="game-panel p-6 text-center">
          <div className="text-3xl mb-2">{getEmptyMessage().icon}</div>
          <p className="text-sm text-[var(--game-text-muted)]">{getEmptyMessage().title}</p>
          {getEmptyMessage().hint && (
            <p className="text-xs text-slate-500 mt-1">{getEmptyMessage().hint}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedProgress.map((info) => (
            <QuestCard
              key={info.quest.id}
              progressInfo={info}
              onAccept={() => handleAccept(info.quest.id)}
              onClaim={() => handleClaim(info.quest.id)}
              expanded={selectedQuestId.value === info.quest.id}
              onToggle={() => {
                if (selectedQuestId.value === info.quest.id) {
                  setSelectedQuestId(null);
                } else {
                  setSelectedQuestId(info.quest.id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* 对话弹窗 */}
      <QuestDialog />
    </div>
  );
}

/** 任务卡片 */
function QuestCard({
  progressInfo,
  onAccept,
  onClaim,
  expanded,
  onToggle,
}: {
  progressInfo: QuestProgressInfo;
  onAccept: () => void;
  onClaim: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  useSignals();

  const { quest, playerData, progressPercent, canClaim, canAccept, conditionDetails } = progressInfo;
  const typeConfig = QUEST_TYPE_CONFIG[quest.type];

  const getStatusBadge = () => {
    switch (playerData.status) {
      case 'in_progress':
        return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">进行中</span>;
      case 'completed':
        return <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] animate-pulse">待领取</span>;
      case 'claimed':
        return <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px]">已完成</span>;
      case 'available':
        return <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">可接取</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`game-panel overflow-hidden transition-all ${canClaim ? 'border-l-4 border-green-500' : ''}`}
    >
      {/* 头部 - 可点击展开 */}
      <div
        className="p-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* 图标 */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${typeConfig.color}20` }}
          >
            {quest.icon}
          </div>

          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm text-[var(--game-text)] truncate">{quest.name}</span>
              {getStatusBadge()}
            </div>
            <div className="text-xs text-[var(--game-text-muted)] truncate">
              {typeConfig.name}
              {playerData.status === 'in_progress' && conditionDetails.length > 0 && (
                <> · {conditionDetails.find(cd => !cd.completed)?.condition.description || '已完成'}</>
              )}
            </div>
          </div>

          {/* 进度或奖励 */}
          <div className="flex-shrink-0 text-right">
            {playerData.status === 'in_progress' && (
              <div className="text-xs">
                <span className="text-[var(--game-text)] font-medium">{Math.round(progressPercent)}%</span>
              </div>
            )}
            {canClaim && (
              <button
                onClick={(e) => { e.stopPropagation(); onClaim(); }}
                className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-500"
              >
                领取
              </button>
            )}
            {canAccept && (
              <button
                onClick={(e) => { e.stopPropagation(); onAccept(); }}
                className="px-2.5 py-1 bg-[var(--game-gold)] text-white rounded text-xs font-medium hover:brightness-110"
              >
                接取
              </button>
            )}
            {playerData.status === 'claimed' && (
              <span className="text-xs text-slate-400">✓</span>
            )}
          </div>
        </div>

        {/* 进度条 */}
        {playerData.status === 'in_progress' && (
          <div className="mt-2 h-1.5 bg-slate-300 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* 展开详情 */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100">
          {/* 描述 */}
          <p className="text-xs text-[var(--game-text-muted)] mb-2">{quest.description}</p>

          {/* 条件列表 */}
          {conditionDetails.length > 0 && (
            <div className="space-y-1 mb-2">
              {conditionDetails.map((cd, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className={cd.completed ? 'text-emerald-500' : 'text-slate-300'}>
                    {cd.completed ? '✓' : '○'}
                  </span>
                  <span className="flex-1 text-[var(--game-text-muted)]">{cd.condition.description}</span>
                  <span className={cd.completed ? 'text-green-500' : 'text-[var(--game-text)]'}>
                    {Math.min(cd.current, cd.required)}/{cd.required}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 奖励 */}
          <div className="flex items-center gap-3 text-xs">
            {quest.rewards.gold && (
              <span className="flex items-center gap-1 text-amber-500">
                <span>💰</span>{quest.rewards.gold}
              </span>
            )}
            {quest.rewards.exp && (
              <span className="flex items-center gap-1 text-emerald-500">
                <span>✨</span>{quest.rewards.exp}
              </span>
            )}
          </div>

          {/* 操作按钮 */}
          {playerData.status === 'in_progress' && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setTrackedQuest(quest.id);
                  showSuccess(`正在追踪: ${quest.name}`);
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium ${
                  trackedQuestId.value === quest.id
                    ? 'bg-[var(--game-gold)] text-white'
                    : 'bg-slate-100 text-[var(--game-text)] hover:bg-slate-200'
                }`}
              >
                {trackedQuestId.value === quest.id ? '📍 追踪中' : '追踪'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestPanel;
