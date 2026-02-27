// 成就主页面组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  achievementProgress,
  achievementStats,
  selectedAchievementCategory,
  filteredAchievementProgress,
  newlyUnlockedAchievements,
  isAchievementLoading,
  claimableRewardCount,
  playerTitles,
  activeTitle,
  setSelectedAchievementCategory,
  claimAchievementReward,
  removeNewlyUnlockedAchievement,
  clearNewlyUnlockedAchievements,
  activatePlayerTitle,
  deactivatePlayerTitle,
} from '@/signals/achievementSignals';
import { ACHIEVEMENT_CATEGORIES } from '@/constants/achievements';
import { player } from '@/signals/playerSignals';
import { showSuccess, showError, returnToExplore } from '@/signals/uiSignals';
import { AchievementCard } from './AchievementCard';
import type { AchievementCategory } from '@/types/achievement';

type TabType = 'achievements' | 'titles';

/** 成就类别筛选器 */
function CategoryFilter() {
  useSignals();

  const stats = achievementStats.value;
  const currentCategory = selectedAchievementCategory.value;

  if (!stats) return null;

  const categories: AchievementCategory[] = ['growth', 'combat', 'collection', 'explore', 'social'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {/* 全部选项 */}
      <button
        onClick={() => setSelectedAchievementCategory('all')}
        className={`
          flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${currentCategory === 'all'
            ? 'bg-[var(--game-gold)] text-white shadow-lg'
            : 'bg-slate-200 text-[var(--game-text)] hover:bg-slate-300 active:bg-slate-400'
          }
        `}
      >
        全部
        <span className="ml-2 opacity-70">
          ({stats.unlockedAchievements}/{stats.totalAchievements})
        </span>
      </button>

      {/* 各类别选项 */}
      {categories.map((category) => {
        const config = ACHIEVEMENT_CATEGORIES[category];
        const catStats = stats.categoryProgress[category];
        const completed = catStats.unlocked === catStats.total && catStats.total > 0;

        return (
          <button
            key={category}
            onClick={() => setSelectedAchievementCategory(category)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${currentCategory === category
                ? 'bg-[var(--game-gold)] text-white shadow-lg'
                : completed
                ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                : 'bg-slate-200 text-[var(--game-text)] hover:bg-slate-300 active:bg-slate-400'
              }
            `}
          >
            <span>{config.icon}</span>
            <span>{config.name}</span>
            <span className="opacity-70">({catStats.unlocked}/{catStats.total})</span>
          </button>
        );
      })}
    </div>
  );
}

/** 成就统计概览 */
function StatsOverview() {
  useSignals();

  const stats = achievementStats.value;

  if (!stats) return null;

  const percent = stats.totalAchievements > 0
    ? (stats.unlockedAchievements / stats.totalAchievements) * 100
    : 0;

  return (
    <div className="game-panel p-4">
      <div className="grid grid-cols-4 gap-4">
        {/* 完成进度 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--game-gold)]">
            {stats.unlockedAchievements}
          </div>
          <div className="text-xs text-slate-600">已完成</div>
          <div className="text-xs text-slate-500">
            / {stats.totalAchievements}
          </div>
        </div>

        {/* 成就点数 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--game-gold)]">
            {stats.earnedPoints}
          </div>
          <div className="text-xs text-slate-600">获得点数</div>
          <div className="text-xs text-slate-500">
            / {stats.totalPoints}
          </div>
        </div>

        {/* 可领取奖励 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {claimableRewardCount.value}
          </div>
          <div className="text-xs text-slate-600">待领取</div>
        </div>

        {/* 完成率 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-500">
            {percent.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-600">完成率</div>
        </div>
      </div>

      {/* 总进度条 */}
      <div className="mt-4">
        <div className="h-3 bg-slate-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--game-gold)] to-yellow-300 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** 新解锁成就通知 */
function NewAchievementNotification() {
  useSignals();

  const unlocked = newlyUnlockedAchievements.value;

  if (unlocked.length === 0) return null;

  return (
    <div className="game-panel p-4 border-2 border-yellow-500/50 bg-yellow-900/20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-yellow-400 font-bold flex items-center gap-2">
          <span>🎉</span>
          <span>新成就解锁!</span>
        </h4>
        <button
          onClick={clearNewlyUnlockedAchievements}
          className="text-xs text-[var(--game-text-muted)] hover:text-white"
        >
          清除
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {unlocked.map((id) => {
          const progress = achievementProgress.value.find(p => p.achievement.id === id);
          if (!progress) return null;

          return (
            <div
              key={id}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg"
            >
              <span>{progress.achievement.icon}</span>
              <span className="text-sm text-[var(--game-text)]">{progress.achievement.name}</span>
              <button
                onClick={() => removeNewlyUnlockedAchievement(id)}
                className="text-slate-500 hover:text-white"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 成就列表 */
function AchievementList() {
  useSignals();

  const progress = filteredAchievementProgress.value;
  const loading = isAchievementLoading.value;
  const currentPlayer = player.value;

  // 排序：可领取 > 已解锁 > 进度高 > 进度低
  const sortedProgress = [...progress].sort((a, b) => {
    if (a.canClaim && !b.canClaim) return -1;
    if (!a.canClaim && b.canClaim) return 1;
    if (a.playerData.unlocked && !b.playerData.unlocked) return -1;
    if (!a.playerData.unlocked && b.playerData.unlocked) return 1;
    return b.progressPercent - a.progressPercent;
  });

  const handleClaim = async (achievementId: string) => {
    if (!currentPlayer) return;

    const result = await claimAchievementReward(currentPlayer.id, achievementId);

    if (result.success) {
      showSuccess('奖励领取成功!');
    } else {
      showError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="game-panel p-8 text-center">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-[var(--game-text-muted)]">加载成就数据...</p>
      </div>
    );
  }

  if (sortedProgress.length === 0) {
    return (
      <div className="game-panel p-8 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <p className="text-[var(--game-text-muted)]">暂无成就数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedProgress.map((progressInfo) => (
        <AchievementCard
          key={progressInfo.achievement.id}
          progressInfo={progressInfo}
          onClaim={handleClaim}
        />
      ))}
    </div>
  );
}

/** 称号管理 */
function TitleManager() {
  useSignals();

  const titles = playerTitles.value;
  const active = activeTitle.value;
  const currentPlayer = player.value;

  // 激活称号
  const handleActivate = async (titleId: string) => {
    if (!currentPlayer) return;

    // 如果已有激活称号，先取消
    if (active) {
      await deactivatePlayerTitle(currentPlayer.id);
    }

    const success = await activatePlayerTitle(currentPlayer.id, titleId);
    if (success) {
      showSuccess('称号已激活');
    } else {
      showError('激活失败');
    }
  };

  // 取消激活
  const handleDeactivate = async () => {
    if (!currentPlayer) return;

    const success = await deactivatePlayerTitle(currentPlayer.id);
    if (success) {
      showSuccess('已取消激活称号');
    } else {
      showError('取消失败');
    }
  };

  // 渲染属性加成
  const renderStatBonus = (statBonus?: Record<string, number>) => {
    if (!statBonus || Object.keys(statBonus).length === 0) return null;

    const statNames: Record<string, string> = {
      strength: '力量',
      intelligence: '智力',
      vitality: '体质',
      agility: '敏捷',
      willpower: '耐力',
      physicalAttack: '物攻',
      magicAttack: '法攻',
      physicalDefense: '物防',
      magicDefense: '法防',
    };

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(statBonus).map(([stat, value]) => (
          <span key={stat} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded">
            {statNames[stat] || stat} +{value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 当前激活称号 */}
      {active && (
        <div className="game-panel p-4 border-2 border-[var(--game-gold)]/50">
          <h4 className="text-sm font-medium text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>当前称号</span>
          </h4>
          <div className="flex items-center gap-3">
            <span
              className="text-3xl"
              style={{ filter: active.title.rare ? 'drop-shadow(0 0 8px gold)' : 'none' }}
            >
              {active.title.icon}
            </span>
            <div className="flex-1">
              <div
                className="font-bold text-lg"
                style={{ color: active.title.color }}
              >
                {active.title.name}
              </div>
              <div className="text-sm text-[var(--game-text-muted)]">
                {active.title.description}
              </div>
              {renderStatBonus(active.title.statBonus)}
            </div>
            <button
              onClick={handleDeactivate}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors min-h-[44px]"
            >
              取消激活
            </button>
          </div>
        </div>
      )}

      {/* 称号列表 */}
      <div className="game-panel p-4">
        <h3 className="text-lg font-bold text-[var(--game-gold)] mb-4 flex items-center gap-2">
          <span>👑</span>
          <span>我的称号</span>
          <span className="text-sm font-normal text-[var(--game-text-muted)]">
            ({titles.length})
          </span>
        </h3>

        {titles.length === 0 ? (
          <div className="text-center text-[var(--game-text-muted)] py-8">
            <div className="text-4xl mb-3">🎖️</div>
            <p>暂无称号</p>
            <p className="text-sm mt-2">完成特定成就可获得称号</p>
          </div>
        ) : (
          <div className="space-y-3">
            {titles.map((playerTitle) => {
              const title = playerTitle.title;
              const isActive = playerTitle.isActive;

              return (
                <div
                  key={playerTitle.titleId}
                  className={`p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-100 border border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-2xl"
                      style={{
                        filter: title.rare ? 'drop-shadow(0 0 6px gold)' : 'none',
                      }}
                    >
                      {title.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: title.color }}
                        >
                          {title.name}
                        </span>
                        {title.rare && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">
                            稀有
                          </span>
                        )}
                        {isActive && (
                          <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded">
                            使用中
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--game-text-muted)]">
                        {title.description}
                      </div>
                      {renderStatBonus(title.statBonus)}
                      <div className="text-xs text-slate-500 mt-1">
                        获得时间: {new Date(playerTitle.acquiredAt).toLocaleDateString()}
                      </div>
                    </div>
                    {!isActive && (
                      <button
                        onClick={() => handleActivate(playerTitle.titleId)}
                        className="px-3 py-2 bg-[var(--game-gold)] text-white rounded-lg text-sm font-medium hover:brightness-110 active:scale-95 min-h-[44px] transition-all"
                      >
                        激活
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="text-center text-xs text-slate-500">
        称号可通过完成成就获得，激活称号可获得属性加成
      </div>
    </div>
  );
}

export function AchievementPage() {
  useSignals();

  const [activeTab, setActiveTab] = useState<TabType>('achievements');

  return (
    <div className="space-y-5">
      {/* 返回按钮 */}
      <button
        onClick={returnToExplore}
        className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--game-text-muted)] hover:text-[var(--game-text)] active:bg-white/10 rounded-lg transition-colors touch-manipulation"
      >
        <span className="text-lg">←</span>
        <span>返回西游</span>
      </button>

      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <h2 className="text-xl font-bold text-[var(--game-gold)]">成就</h2>
        </div>

        {/* 快速统计 */}
        {achievementStats.value && (
          <div className="flex items-center gap-4 text-sm">
            <div className="text-[var(--game-text-muted)]">
              <span className="text-[var(--game-gold)] font-bold">
                {achievementStats.value.unlockedAchievements}
              </span>
              <span> / {achievementStats.value.totalAchievements}</span>
            </div>
            <div className="text-[var(--game-text-muted)]">
              <span className="text-[var(--game-gold)] font-bold">
                {achievementStats.value.earnedPoints}
              </span>
              <span> 点数</span>
            </div>
            {claimableRewardCount.value > 0 && (
              <div className="px-2 py-1 bg-amber-100 text-amber-600 rounded text-xs animate-pulse">
                {claimableRewardCount.value} 个奖励待领取
              </div>
            )}
          </div>
        )}
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 p-1 bg-slate-200 rounded-lg">
        {(['achievements', 'titles'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-200
              ${activeTab === tab
                ? 'bg-[var(--game-gold)] text-white shadow-lg'
                : 'text-[var(--game-text)] hover:bg-slate-300 active:bg-slate-400'
              }
            `}
          >
            {tab === 'achievements' ? '🏆 成就' : '👑 称号'}
          </button>
        ))}
      </div>

      {/* 新解锁通知 */}
      <NewAchievementNotification />

      {/* 成就标签页内容 */}
      {activeTab === 'achievements' && (
        <>
          {/* 统计概览 */}
          <StatsOverview />

          {/* 类别筛选 */}
          <CategoryFilter />

          {/* 成就列表 */}
          <AchievementList />
        </>
      )}

      {/* 称号标签页内容 */}
      {activeTab === 'titles' && <TitleManager />}
    </div>
  );
}

export default AchievementPage;
