// 成就进度显示组件

import { useSignals } from '@preact/signals-react/runtime';
import {
  achievementStats,
  selectedAchievementCategory,
  // 修复: 导入 setSelectedAchievementCategory 用于点击事件
  setSelectedAchievementCategory,
} from '@/signals/achievementSignals';
import { ACHIEVEMENT_CATEGORIES } from '@/constants/achievements';
import type { AchievementCategory, AchievementStats } from '@/types/achievement';

interface AchievementProgressProps {
  compact?: boolean;
}

/** 进度条组件 */
function ProgressSegment({
  current,
  total,
  color = 'var(--game-gold)',
  height = 'h-3',
  showLabel = true,
  label = '',
}: {
  current: number;
  total: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  label?: string;
}) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{label || `${current} / ${total}`}</span>
          <span>{percent.toFixed(1)}%</span>
        </div>
      )}
      <div className={`${height} bg-slate-300 rounded-full overflow-hidden`}>
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${Math.min(100, percent)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

/** 类别进度卡片 */
function CategoryProgressCard({
  category,
  stats,
  onClick,
  isActive,
}: {
  category: AchievementCategory;
  stats: AchievementStats['categoryProgress'][AchievementCategory];
  onClick: () => void;
  isActive: boolean;
}) {
  const config = ACHIEVEMENT_CATEGORIES[category];
  const percent = stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-amber-100 border border-amber-300'
          : 'bg-slate-100 border border-[var(--game-border)] hover:bg-slate-200'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{config.icon}</span>
        <span className="text-sm font-semibold text-[var(--game-text)]">{config.name}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">完成度</span>
          <span className="text-slate-600">
            {stats.unlocked}/{stats.total}
          </span>
        </div>
        <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--game-gold)] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">点数</span>
          <span className="text-[var(--game-gold)]">
            {stats.earnedPoints}/{stats.points}
          </span>
        </div>
      </div>
    </div>
  );
}

/** 总体进度概览 */
export function AchievementProgressOverview({ compact = false }: AchievementProgressProps) {
  useSignals();

  const stats = achievementStats.value;

  if (!stats) {
    return (
      <div className="game-panel p-4 text-center">
        <div className="text-[var(--game-text-muted)]">加载中...</div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="game-panel p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--game-text-muted)]">成就进度</span>
          <span className="text-sm font-bold text-[var(--game-gold)]">
            {stats.unlockedAchievements}/{stats.totalAchievements}
          </span>
        </div>
        <ProgressSegment
          current={stats.unlockedAchievements}
          total={stats.totalAchievements}
          height="h-2"
          showLabel={false}
        />
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>成就点数</span>
          <span className="text-[var(--game-gold)]">
            {stats.earnedPoints}/{stats.totalPoints}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel p-4 space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--game-gold)] flex items-center gap-2">
          <span>🏆</span>
          <span>成就总览</span>
        </h3>
      </div>

      {/* 总体进度 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-slate-100 rounded-lg">
          <div className="text-2xl font-bold text-[var(--game-gold)]">
            {stats.unlockedAchievements}
          </div>
          <div className="text-xs text-slate-600">
            / {stats.totalAchievements} 成就
          </div>
        </div>
        <div className="text-center p-3 bg-slate-100 rounded-lg">
          <div className="text-2xl font-bold text-[var(--game-gold)]">
            {stats.earnedPoints}
          </div>
          <div className="text-xs text-slate-600">
            / {stats.totalPoints} 点数
          </div>
        </div>
      </div>

      {/* 主进度条 */}
      <div>
        <ProgressSegment
          current={stats.unlockedAchievements}
          total={stats.totalAchievements}
          label="总体完成度"
        />
      </div>

      {/* 各类别进度 */}
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(stats.categoryProgress) as AchievementCategory[]).map((category) => (
          <CategoryProgressCard
            key={category}
            category={category}
            stats={stats.categoryProgress[category]}
            // 修复: 实现点击事件，设置选中的成就类别
            onClick={() => setSelectedAchievementCategory(category)}
            isActive={selectedAchievementCategory.value === category}
          />
        ))}
      </div>
    </div>
  );
}

/** 类别进度条（用于筛选器） */
export function AchievementCategoryFilter({ compact = false }: AchievementProgressProps) {
  useSignals();

  const stats = achievementStats.value;
  const currentCategory = selectedAchievementCategory.value;

  if (!stats) return null;

  const categories: AchievementCategory[] = ['growth', 'combat', 'collection', 'explore', 'social'];

  if (compact) {
    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        <button
          // 修复: 实现点击事件，设置为全部类别
          onClick={() => setSelectedAchievementCategory('all')}
          className={`
            flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all
            ${currentCategory === 'all'
              ? 'bg-[var(--game-gold)] text-white'
              : 'bg-slate-200 text-[var(--game-text)] hover:bg-slate-300'
            }
          `}
        >
          全部
        </button>
        {categories.map((category) => {
          const config = ACHIEVEMENT_CATEGORIES[category];
          const catStats = stats.categoryProgress[category];
          const completed = catStats.unlocked === catStats.total && catStats.total > 0;

          return (
            <button
              key={category}
              // 修复: 实现点击事件，设置为对应类别
              onClick={() => setSelectedAchievementCategory(category)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1
                ${currentCategory === category
                  ? 'bg-[var(--game-gold)] text-white'
                  : completed
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-slate-200 text-[var(--game-text)] hover:bg-slate-300'
                }
              `}
            >
              <span>{config.icon}</span>
              <span>{config.name}</span>
              <span className="opacity-60">({catStats.unlocked}/{catStats.total})</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {/* 全部选项 */}
      <button
        // 修复: 实现点击事件，设置为全部类别
        onClick={() => setSelectedAchievementCategory('all')}
        className={`
          p-3 rounded-lg transition-all text-center
          ${currentCategory === 'all'
            ? 'bg-[var(--game-gold)]/20 border border-[var(--game-gold)]/50'
            : 'bg-slate-100 border border-[var(--game-border)] hover:bg-slate-200'
          }
        `}
      >
        <div className="text-lg mb-1">🏆</div>
        <div className="text-xs font-semibold text-[var(--game-text)]">全部</div>
        <div className="text-xs text-slate-500">
          {stats.unlockedAchievements}/{stats.totalAchievements}
        </div>
      </button>

      {/* 各类别选项 */}
      {categories.map((category) => {
        const config = ACHIEVEMENT_CATEGORIES[category];
        const catStats = stats.categoryProgress[category];
        const percent = catStats.total > 0 ? (catStats.unlocked / catStats.total) * 100 : 0;
        const completed = catStats.unlocked === catStats.total && catStats.total > 0;

        return (
          <button
            key={category}
            // 修复: 实现点击事件，设置为对应类别
            onClick={() => setSelectedAchievementCategory(category)}
            className={`
              p-3 rounded-lg transition-all text-center
              ${currentCategory === category
                ? 'bg-[var(--game-gold)]/20 border border-[var(--game-gold)]/50'
                : completed
                ? 'bg-green-50 border border-green-300'
                : 'bg-slate-100 border border-[var(--game-border)] hover:bg-slate-200'
              }
            `}
          >
            <div className="text-lg mb-1">{config.icon}</div>
            <div className="text-xs font-semibold text-[var(--game-text)]">{config.name}</div>
            <div className="text-xs text-slate-500">
              {catStats.unlocked}/{catStats.total}
            </div>
            <div className="mt-1 h-1 bg-slate-300 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${completed ? 'bg-emerald-500' : 'bg-[var(--game-gold)]'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** 简易进度指示器 */
export function AchievementMiniProgress() {
  useSignals();

  const stats = achievementStats.value;

  if (!stats) return null;

  const percent = stats.totalAchievements > 0
    ? (stats.unlockedAchievements / stats.totalAchievements) * 100
    : 0;

  return (
    <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
      <span className="text-lg">🏆</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--game-text-muted)]">成就</span>
          <span className="text-[var(--game-gold)] font-semibold">
            {stats.unlockedAchievements}/{stats.totalAchievements}
          </span>
        </div>
        <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--game-gold)] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-[var(--game-gold)] font-bold">{stats.earnedPoints}</div>
        <div className="text-xs text-slate-500">点数</div>
      </div>
    </div>
  );
}

export default AchievementProgressOverview;
