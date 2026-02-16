// 成就卡片组件

import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';
import type { AchievementProgressInfo } from '@/types/achievement';
import { getCategoryName, getCategoryIcon } from '@/signals/achievementSignals';

interface AchievementCardProps {
  progressInfo: AchievementProgressInfo;
  onClaim?: (achievementId: string) => void;
}

/** 成就状态徽章 */
function AchievementBadge({ progressInfo }: { progressInfo: AchievementProgressInfo }) {
  const { playerData, canClaim } = progressInfo;

  if (playerData.claimed) {
    return (
      <span className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
        已领取
      </span>
    );
  }

  if (canClaim) {
    return (
      <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700 border border-amber-300 animate-pulse">
        可领取
      </span>
    );
  }

  if (playerData.unlocked) {
    return (
      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-300">
        已解锁
      </span>
    );
  }

  return null;
}

/** 进度条组件 */
function ProgressBar({
  current,
  target,
  percent,
  unlocked
}: {
  current: number;
  target: number;
  percent: number;
  unlocked: boolean;
}) {
  const barColor = unlocked
    ? 'bg-green-500'
    : percent >= 75
    ? 'bg-yellow-500'
    : percent >= 50
    ? 'bg-blue-500'
    : 'bg-gray-500';

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{current.toLocaleString()} / {target.toLocaleString()}</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}

/** 奖励展示 */
function RewardDisplay({ progressInfo }: { progressInfo: AchievementProgressInfo }) {
  const { achievement } = progressInfo;
  const reward = achievement.reward;

  if (!reward) return null;

  return (
    <div className="mt-3 p-2 bg-slate-100 rounded border border-[var(--game-border)]">
      <div className="text-xs text-slate-500 mb-1">奖励:</div>
      <div className="flex flex-wrap gap-2 text-xs">
        {reward.gold && (
          <span className="flex items-center gap-1 text-amber-500">
            <span>💰</span>
            <span>{reward.gold.toLocaleString()} 金币</span>
          </span>
        )}
        {reward.exp && (
          <span className="flex items-center gap-1 text-emerald-500">
            <span>✨</span>
            <span>{reward.exp.toLocaleString()} 经验</span>
          </span>
        )}
        {reward.titleId && (
          <span className="flex items-center gap-1 text-purple-500">
            <span>👑</span>
            <span>称号</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function AchievementCard({ progressInfo, onClaim }: AchievementCardProps) {
  useSignals();

  const [isExpanded, setIsExpanded] = useState(false);

  const { achievement, playerData, progressPercent, canClaim, showDetails } = progressInfo;

  // 隐藏成就未解锁时显示问号
  if (achievement.hidden && !playerData.unlocked) {
    return (
      <div className="game-card p-4 opacity-70">
        <div className="flex items-center gap-3">
          <div className="game-icon game-icon-sm bg-slate-100">
            <span>❓</span>
          </div>
          <div className="flex-1">
            <div className="text-slate-600">???</div>
            <div className="text-xs text-slate-500">
              隐藏成就 - 继续探索以解锁
            </div>
          </div>
          <span className="game-tag game-tag-default text-xs">
            {achievement.points} 点
          </span>
        </div>
      </div>
    );
  }

  // 根据成就状态设置卡片样式
  const cardStyle: React.CSSProperties = playerData.unlocked
    ? {
        borderColor: '#FFD700',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
      }
    : canClaim
    ? {
        borderColor: '#4ADE80',
        boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)',
      }
    : {};

  const currentProgress = playerData.progress || 0;

  return (
    <div
      className={`game-card p-4 cursor-pointer transition-all duration-200 ${canClaim ? 'ring-2 ring-yellow-500/50' : ''}`}
      style={cardStyle}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* 主要内容 */}
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div
          className={`game-icon game-icon-md ${playerData.unlocked ? 'bg-amber-100' : 'bg-slate-100'}`}
          style={playerData.unlocked ? { borderColor: '#FFD700' } : {}}
        >
          <span className="text-xl">{achievement.icon}</span>
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`font-semibold ${playerData.unlocked ? 'text-yellow-400' : 'text-white'}`}
            >
              {achievement.name}
            </h4>
            <AchievementBadge progressInfo={progressInfo} />
          </div>

          <div className="text-xs text-[var(--game-text-muted)] mt-1">
            {showDetails ? achievement.description : '???'}
          </div>

          {/* 类别和点数 */}
          <div className="flex items-center gap-2 mt-2">
            <span className="game-tag game-tag-default text-xs flex items-center gap-1">
              <span>{getCategoryIcon(achievement.category)}</span>
              <span>{getCategoryName(achievement.category)}</span>
            </span>
            <span
              className={`text-xs font-semibold ${playerData.unlocked ? 'text-yellow-400' : 'text-[var(--game-gold)]'}`}
            >
              {achievement.points} 成就点
            </span>
          </div>

          {/* 进度条 */}
          {!playerData.unlocked && showDetails && (
            <ProgressBar
              current={currentProgress}
              target={achievement.condition.target}
              percent={progressPercent}
              unlocked={false}
            />
          )}
        </div>

        {/* 展开指示器 */}
        <div className={`text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>

      {/* 展开内容 */}
      {isExpanded && showDetails && (
        <div className="mt-4 pt-4 border-t border-[var(--game-border)]">
          {/* 奖励信息 */}
          {achievement.reward && <RewardDisplay progressInfo={progressInfo} />}

          {/* 解锁时间 */}
          {playerData.unlocked && playerData.unlockedAt && (
            <div className="mt-2 text-xs text-slate-500">
              解锁于: {new Date(playerData.unlockedAt).toLocaleString('zh-CN')}
            </div>
          )}

          {/* 领取按钮 */}
          {canClaim && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaim?.(achievement.id);
              }}
              className="game-btn game-btn-primary w-full mt-3 py-2 text-sm"
            >
              领取奖励
            </button>
          )}

          {/* 已完成信息 */}
          {playerData.claimed && playerData.claimedAt && (
            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
              <span>✓</span>
              <span>奖励已于 {new Date(playerData.claimedAt).toLocaleString('zh-CN')} 领取</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AchievementCard;
