// 地图页面任务追踪组件 - 紧凑版

import { useSignals } from '@preact/signals-react/runtime';
import { activeQuests, claimableQuests, availableQuests } from '@/signals/questSignals';
import { navigateToQuest } from '@/signals/uiSignals';

export function QuestTracker() {
  useSignals();

  const active = activeQuests.value;
  const claimable = claimableQuests.value;
  const available = availableQuests.value;

  // 只显示进行中的任务（不包含已完成的）
  const inProgressQuests = active.filter(
    (p) => p.playerData.status === 'in_progress'
  );

  return (
    <div className="game-panel p-2 space-y-1.5">
      {/* 可领取奖励 - 优先显示 */}
      {claimable.length > 0 && (
        <button
          onClick={() => navigateToQuest('claimable')}
          className="w-full py-2 px-2 bg-green-100 rounded-lg flex items-center justify-center gap-1.5 text-green-700 hover:bg-green-200 active:bg-green-300 transition-colors touch-manipulation"
        >
          <span className="text-sm">🎁</span>
          <span className="text-xs font-medium">{claimable.length} 个奖励待领取</span>
          <span className="text-xs">→</span>
        </button>
      )}

      {/* 进行中的任务列表 - 紧凑布局 */}
      {inProgressQuests.length > 0 ? (
        inProgressQuests.slice(0, 3).map((questProgress) => {
          // 获取当前未完成的条件
          const incompleteCondition = questProgress.conditionDetails.find(
            (cd) => !cd.completed
          );
          const currentTarget = incompleteCondition?.condition.description ||
            (questProgress.progressPercent >= 100 ? '已完成' : '进行中');

          return (
            <div
              key={questProgress.quest.id}
              className="bg-slate-100 rounded-lg p-2 cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors touch-manipulation"
              onClick={() => navigateToQuest('normal')}
            >
              {/* 第一行：图标 + 名称 + 进度百分比 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <span className="text-sm">{questProgress.quest.icon}</span>
                  <span className="text-xs font-medium text-[var(--game-text)] truncate">
                    {questProgress.quest.name}
                  </span>
                </div>
                <span className="text-[11px] text-amber-600 font-medium ml-1 whitespace-nowrap">
                  {Math.round(questProgress.progressPercent)}%
                </span>
              </div>

              {/* 第二行：进度条 */}
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full transition-all ${
                    questProgress.progressPercent >= 100
                      ? 'bg-green-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, questProgress.progressPercent)}%` }}
                />
              </div>

              {/* 第三行：当前目标描述 */}
              <div className="text-[11px] text-slate-600 truncate">
                {currentTarget}
              </div>
            </div>
          );
        })
      ) : available.length > 0 ? (
        /* 有可接取的任务时显示提示 */
        <button
          onClick={() => navigateToQuest('available')}
          className="w-full py-2 px-2 bg-amber-50 rounded-lg flex items-center justify-center gap-1.5 text-amber-700 hover:bg-amber-100 active:bg-amber-200 transition-colors touch-manipulation"
        >
          <span className="text-sm">📋</span>
          <span className="text-xs font-medium">{available.length} 个任务可接取</span>
          <span className="text-xs">→</span>
        </button>
      ) : (
        /* 没有任何任务时显示占位 */
        <button
          onClick={() => navigateToQuest('normal')}
          className="w-full py-2 px-2 bg-slate-100 rounded-lg flex items-center justify-center gap-1.5 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors touch-manipulation"
        >
          <span className="text-sm">📋</span>
          <span className="text-xs">查看任务</span>
          <span className="text-xs">→</span>
        </button>
      )}

      {/* 更多任务提示 */}
      {inProgressQuests.length > 3 && (
        <button
          onClick={() => navigateToQuest('normal')}
          className="w-full text-center text-[11px] text-slate-500 py-1.5 hover:text-amber-600 active:text-amber-700 transition-colors touch-manipulation"
        >
          还有 {inProgressQuests.length - 3} 个任务...
        </button>
      )}
    </div>
  );
}

export default QuestTracker;
