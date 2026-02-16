// 副本页面组件

import { useSignals } from '@preact/signals-react/runtime';
import { useEffect, useState } from 'react';
import {
  player,
  isPlayerCreated,
  battleState,
  battleResult,
  isBattleActive,
  returnToExplore,
} from '@/signals';
import { getAllDungeons, getDungeon } from '@/constants/dungeons';
import {
  // 状态
  isInDungeon,
  currentDungeon,
  currentFloor,
  isBossFloor,
  dungeonProgressPercent,
  isDungeonInitialized,
  // 操作
  initDungeons,
  enterDungeon,
  advanceDungeonFloor,
  completeDungeon,
  failDungeon,
  exitDungeon,
  canEnterDungeon,
  getDungeonRemainingRuns,
  hasFirstClear,
  // 辅助
  getDifficultyName,
  getDifficultyColor,
  getDungeonTypeName,
} from '@/signals/dungeonSignals';
import { getItemTemplate } from '@/constants/items';
import type { DungeonDifficulty, Dungeon } from '@/types';

/** 难度选择模态框 */
function DifficultyModal({
  dungeon,
  onClose,
  onSelect,
}: {
  dungeon: Dungeon;
  onClose: () => void;
  onSelect: (difficulty: DungeonDifficulty) => void;
}) {
  const currentPlayer = player.value;
  const remainingRuns = getDungeonRemainingRuns(dungeon.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="game-panel p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4 text-[var(--game-text)]">
          选择难度 - {dungeon.name}
        </h3>

        <div className="space-y-3">
          {dungeon.difficulties.map((diff) => {
            const checkResult = canEnterDungeon(dungeon.id, diff.difficulty);
            const isUnlocked =
              currentPlayer &&
              currentPlayer.level >= diff.recommendedLevel;
            const hasCleared = hasFirstClear(dungeon.id, diff.difficulty);

            return (
              <button
                key={diff.difficulty}
                onClick={() => isUnlocked && onSelect(diff.difficulty)}
                disabled={!isUnlocked || !checkResult.canEnter}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  isUnlocked && checkResult.canEnter
                    ? 'bg-[var(--game-panel)] hover:bg-[var(--game-panel-hover)] cursor-pointer'
                    : 'bg-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${getDifficultyColor(diff.difficulty)}`}>
                    {getDifficultyName(diff.difficulty)}
                    {hasCleared && ' ✓'}
                  </span>
                  {dungeon.dailyLimit && (
                    <span className="text-xs text-[var(--game-text-muted)]">
                      剩余: {remainingRuns.daily}/{dungeon.dailyLimit}
                    </span>
                  )}
                </div>

                <div className="text-sm text-[var(--game-text-muted)] space-y-1">
                  <div>推荐等级: Lv.{diff.recommendedLevel}</div>
                  <div>推荐战力: {diff.recommendedPower}</div>
                  <div className="text-yellow-500">
                    奖励倍率: x{diff.rewardMultiplier}
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="text-red-400 text-xs mt-2">
                    需要 Lv.{diff.recommendedLevel}
                  </div>
                )}
                {isUnlocked && !checkResult.canEnter && (
                  <div className="text-red-400 text-xs mt-2">
                    {checkResult.reason}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}

/** 副本进度UI */
function DungeonProgressBar() {
  const dungeon = currentDungeon.value;
  const floor = currentFloor.value;
  const percent = dungeonProgressPercent.value;
  const isBoss = isBossFloor.value;

  if (!dungeon) return null;

  const floorConfig = dungeon.floors.find((f) => f.floorNumber === floor);

  return (
    <div className="game-panel p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[var(--game-text)] font-medium">
          {dungeon.name}
          {isBoss && <span className="text-red-500 ml-2">[BOSS]</span>}
        </span>
        <span className="text-sm text-[var(--game-text-muted)]">
          {floor}/{dungeon.floors.length} 层
        </span>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isBoss ? 'bg-red-500' : 'bg-[var(--game-gold)]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {floorConfig && (
        <div className="mt-2 text-sm text-[var(--game-text-muted)]">
          {floorConfig.name}
          {floorConfig.description && ` - ${floorConfig.description}`}
        </div>
      )}
    </div>
  );
}

/** 副本结算UI */
function DungeonResultModal({
  result,
  onClose,
}: {
  result: {
    success: boolean;
    dungeonId: string;
    difficulty: DungeonDifficulty;
    floorsCleared: number;
    stats: {
      totalRounds: number;
      totalDamageDealt: number;
      totalDamageTaken: number;
      enemiesDefeated: number;
      timeSpent: number;
    };
    rewards: {
      exp: number;
      gold: number;
      items: { itemId: string; count: number }[];
      isFirstClear: boolean;
    };
  };
  onClose: () => void;
}) {
  const dungeon = getDungeon(result.dungeonId);
  const timeSeconds = Math.floor(result.stats.timeSpent / 1000);
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="game-panel p-6 max-w-md w-full mx-4">
        <h3
          className={`text-xl font-bold mb-4 text-center ${
            result.success ? 'text-yellow-400' : 'text-red-400'
          }`}
        >
          {result.success ? '副本通关!' : '挑战失败'}
          {result.rewards.isFirstClear && (
            <span className="block text-sm text-purple-400 mt-1">首次通关!</span>
          )}
        </h3>

        <div className="space-y-4">
          <div className="text-center">
            <span className="text-lg text-[var(--game-text)]">
              {dungeon?.name} - {getDifficultyName(result.difficulty)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-[var(--game-panel)] p-2 rounded">
              <span className="text-[var(--game-text-muted)]">通关层数</span>
              <div className="text-[var(--game-text)] font-medium">
                {result.floorsCleared}
              </div>
            </div>
            <div className="bg-[var(--game-panel)] p-2 rounded">
              <span className="text-[var(--game-text-muted)]">用时</span>
              <div className="text-[var(--game-text)] font-medium">
                {minutes > 0 ? `${minutes}分` : ''}{seconds}秒
              </div>
            </div>
            <div className="bg-[var(--game-panel)] p-2 rounded">
              <span className="text-[var(--game-text-muted)]">击杀敌人</span>
              <div className="text-[var(--game-text)] font-medium">
                {result.stats.enemiesDefeated}
              </div>
            </div>
            <div className="bg-[var(--game-panel)] p-2 rounded">
              <span className="text-[var(--game-text-muted)]">战斗回合</span>
              <div className="text-[var(--game-text)] font-medium">
                {result.stats.totalRounds}
              </div>
            </div>
          </div>

          {result.success && (
            <div className="bg-[var(--game-panel)] p-3 rounded">
              <h4 className="text-sm font-medium text-[var(--game-text)] mb-2">
                获得奖励
              </h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-green-400">+{result.rewards.exp} 经验</span>
                <span className="text-yellow-400">+{result.rewards.gold} 金币</span>
                {result.rewards.items.map((item, i) => {
                  const itemTemplate = getItemTemplate(item.itemId);
                  return (
                    <span key={i} className="text-purple-400">
                      +{item.count}x {itemTemplate?.name || item.itemId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-lg bg-[var(--game-gold)] text-white font-medium hover:brightness-110 transition-all"
        >
          确认
        </button>
      </div>
    </div>
  );
}

/** 副本进行中UI */
function DungeonInProgress() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    exitDungeon();
    setShowExitConfirm(false);
  };

  return (
    <div className="space-y-4">
      <DungeonProgressBar />

      {/* 退出按钮 */}
      <button
        onClick={handleExit}
        className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
      >
        退出副本
      </button>

      {/* 退出确认框 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="game-panel p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-[var(--game-text)] mb-4">
              确认退出副本?
            </h3>
            <p className="text-sm text-[var(--game-text-muted)] mb-4">
              退出副本将不会获得任何奖励，且会消耗挑战次数。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 副本列表 */
function DungeonList({
  onSelectDungeon,
}: {
  onSelectDungeon: (dungeon: Dungeon) => void;
}) {
  const dungeons = getAllDungeons();

  return (
    <div className="space-y-3">
      {dungeons.map((dungeon) => {
        const checkResult = canEnterDungeon(dungeon.id);
        const canEnter = checkResult.canEnter;
        const remainingRuns = getDungeonRemainingRuns(dungeon.id);
        const hasAnyClear = dungeon.difficulties.some((diff) =>
          hasFirstClear(dungeon.id, diff.difficulty)
        );

        return (
          <div
            key={dungeon.id}
            className={`game-panel p-4 ${!canEnter ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{dungeon.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--game-text)]">
                    {dungeon.name}
                  </span>
                  {hasAnyClear && (
                    <span className="text-xs text-green-400">已通关</span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-[var(--game-text-muted)]">
                    {getDungeonTypeName(dungeon.type)}
                  </span>
                </div>
                <div className="text-sm text-[var(--game-text-muted)]">
                  {dungeon.description}
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-[var(--game-text-muted)]">
                    推荐: Lv.{dungeon.requirements.minLevel}+
                  </span>
                  <span className="text-yellow-500">
                    奖励: {dungeon.baseRewards.exp}经验 {dungeon.baseRewards.gold}金币
                  </span>
                  {dungeon.dailyLimit && (
                    <span className="text-blue-400">
                      每日{remainingRuns.daily}/{dungeon.dailyLimit}次
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onSelectDungeon(dungeon)}
                disabled={!canEnter}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  canEnter
                    ? 'bg-[var(--game-gold)] text-white hover:brightness-110'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canEnter ? '进入副本' : checkResult.reason || '条件不足'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** 主组件 */
export function DungeonPage() {
  useSignals();

  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [resultModal, setResultModal] = useState<{
    success: boolean;
    dungeonId: string;
    difficulty: DungeonDifficulty;
    floorsCleared: number;
    stats: {
      totalRounds: number;
      totalDamageDealt: number;
      totalDamageTaken: number;
      enemiesDefeated: number;
      timeSpent: number;
    };
    rewards: {
      exp: number;
      gold: number;
      items: { itemId: string; count: number }[];
      isFirstClear: boolean;
    };
  } | null>(null);

  const isInitialized = isDungeonInitialized.value;
  const inDungeon = isInDungeon.value;
  const inBattle = isBattleActive.value;
  const battleEnded = battleState.value !== null && battleResult.value !== undefined;

  // 初始化副本系统
  useEffect(() => {
    if (!isInitialized && isPlayerCreated.value) {
      initDungeons();
    }
  }, [isInitialized, isPlayerCreated.value]);

  // 监听战斗结束
  useEffect(() => {
    if (!inDungeon || !battleEnded) return;

    const result = battleResult.value;
    if (!result) return;

    if (result.victory) {
      // 战斗胜利，推进到下一层
      const advanceResult = advanceDungeonFloor();

      if (advanceResult.isComplete) {
        // 副本完成
        const dungeonResult = completeDungeon();
        if (dungeonResult) {
          setResultModal({
            success: dungeonResult.success,
            dungeonId: dungeonResult.dungeonId,
            difficulty: dungeonResult.difficulty,
            floorsCleared: dungeonResult.floorsCleared,
            stats: dungeonResult.stats,
            rewards: dungeonResult.rewards,
          });
        }
      }
    } else {
      // 战斗失败
      const dungeonResult = failDungeon();
      if (dungeonResult) {
        setResultModal({
          success: dungeonResult.success,
          dungeonId: dungeonResult.dungeonId,
          difficulty: dungeonResult.difficulty,
          floorsCleared: dungeonResult.floorsCleared,
          stats: dungeonResult.stats,
          rewards: dungeonResult.rewards,
        });
      }
    }
  }, [battleEnded, inDungeon]);

  // 处理选择难度
  const handleSelectDifficulty = (difficulty: DungeonDifficulty) => {
    if (!selectedDungeon) return;

    const result = enterDungeon(selectedDungeon.id, difficulty);
    if (!result.success) {
      // TODO: 显示错误提示
      console.error('Failed to enter dungeon:', result.error);
    }

    setSelectedDungeon(null);
  };

  // 关闭结果弹窗
  const handleCloseResult = () => {
    setResultModal(null);
  };

  // 如果正在战斗中，显示战斗界面（由BattlePage处理）
  if (inBattle && !battleEnded) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">副本进行中</h2>
        <p className="text-[var(--game-text-muted)]">战斗中...</p>
      </div>
    );
  }

  // 如果在副本中但战斗已结束，显示推进按钮
  if (inDungeon && battleEnded) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">副本</h2>
        <DungeonInProgress />
        <div className="text-center text-[var(--game-text-muted)]">
          战斗结束，请等待结算...
        </div>
      </div>
    );
  }

  // 如果在副本中，显示副本进度
  if (inDungeon) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">副本进行中</h2>
        <DungeonInProgress />
      </div>
    );
  }

  // 显示副本列表
  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <button
        onClick={returnToExplore}
        className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--game-text-muted)] hover:text-[var(--game-text)] active:bg-white/10 rounded-lg transition-colors touch-manipulation"
      >
        <span className="text-lg">←</span>
        <span>返回西游</span>
      </button>

      <h2 className="text-lg font-medium">副本</h2>

      <DungeonList onSelectDungeon={setSelectedDungeon} />

      {/* 难度选择弹窗 */}
      {selectedDungeon && (
        <DifficultyModal
          dungeon={selectedDungeon}
          onClose={() => setSelectedDungeon(null)}
          onSelect={handleSelectDifficulty}
        />
      )}

      {/* 结果弹窗 */}
      {resultModal && (
        <DungeonResultModal result={resultModal} onClose={handleCloseResult} />
      )}
    </div>
  );
}
