// 境界突破组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  currentRealm,
  currentRealmName,
  totalCultivationLevel,
  canBreakthrough,
  realmInfo,
  attemptBreakthrough,
} from '@/signals/cultivationSignals';
import { REALMS, getNextRealm, calculateBreakthroughSuccessRate } from '@/constants/cultivation';
import type { BreakthroughResult } from '@/types/cultivation';

/** 境界徽章 */
function RealmBadge({ level, name, isActive }: { level: number; name: string; isActive: boolean }) {
  const realmColors: Record<number, string> = {
    1: 'from-gray-400 to-gray-500',
    2: 'from-blue-400 to-blue-500',
    3: 'from-yellow-400 to-yellow-500',
    4: 'from-purple-400 to-purple-500',
    5: 'from-red-400 to-orange-500',
  };

  return (
    <div
      className={`
        relative px-4 py-2 rounded-lg transition-all duration-300
        ${isActive
          ? `bg-gradient-to-r ${realmColors[level] || 'from-gray-400 to-gray-500'} text-white shadow-lg`
          : 'bg-[var(--game-bg-hover)] text-[var(--game-text-muted)]'
        }
      `}
    >
      <div className="text-center">
        <div className="text-xs opacity-80">第{level}境</div>
        <div className="font-bold text-sm">{name}</div>
      </div>
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

/** 境界进度条 */
function RealmProgressBar() {
  useSignals();

  const info = realmInfo.value;
  const percent = Math.min(100, info.progress);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-[var(--game-text-muted)] mb-1">
        <span>突破进度</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div className="game-progress" style={{ height: '12px' }}>
        <div
          className="game-progress-fill bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {info.next && (
        <div className="mt-1 text-[10px] text-[var(--game-text-dim)] text-right">
          {info.next.requiredTotalLevel - totalCultivationLevel.value} 级后可突破
        </div>
      )}
    </div>
  );
}

/** 突破结果弹窗 */
function BreakthroughResultModal({
  result,
  onClose,
}: {
  result: BreakthroughResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="game-modal w-full max-w-sm animate-slide-up">
        <div className="game-modal-header">
          <h3 className="game-modal-title">
            {result.success ? '🎉 突破成功' : '💫 突破失败'}
          </h3>
        </div>

        <div className="game-modal-body text-center">
          {result.success ? (
            <div className="space-y-4">
              <div className="text-6xl">🌟</div>
              <div>
                <div className="text-lg font-bold text-[var(--game-gold)]">
                  恭喜突破至 {result.newRealmName}
                </div>
                <div className="text-sm text-[var(--game-text-muted)] mt-1">
                  境界 {result.fromRealm} → {result.toRealm}
                </div>
              </div>

              {result.rewards && result.rewards.length > 0 && (
                <div className="bg-[var(--game-bg-hover)] rounded-lg p-3 text-left">
                  <div className="text-xs text-[var(--game-text-muted)] mb-2">获得奖励</div>
                  {result.rewards.map((reward, index) => (
                    <div key={index} className="text-sm text-green-600 flex items-center gap-2">
                      <span>✓</span>
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">💨</div>
              <div>
                <div className="text-lg font-bold text-[var(--game-text)]">
                  突破失败
                </div>
                <div className="text-sm text-[var(--game-text-muted)] mt-1">
                  {result.reason || '机缘未到，再接再厉'}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-xs text-red-500">
                  损失了部分修炼经验
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="game-modal-footer justify-center">
          <button onClick={onClose} className="game-btn game-btn-primary">
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

/** 境界突破组件 */
export function RealmBreakthrough() {
  useSignals();

  const [isAttempting, setIsAttempting] = useState(false);
  const [breakthroughResult, setBreakthroughResult] = useState<BreakthroughResult | null>(null);

  const realm = currentRealm.value;
  const realmName = currentRealmName.value;
  const totalLevel = totalCultivationLevel.value;
  const breakthroughStatus = canBreakthrough.value;
  const nextRealm = getNextRealm(realm);

  // 计算成功率
  const successRate = nextRealm
    ? calculateBreakthroughSuccessRate(
        nextRealm.baseSuccessRate,
        totalLevel,
        nextRealm.requiredTotalLevel
      )
    : 0;

  const handleBreakthrough = () => {
    if (!breakthroughStatus.canBreakthrough || isAttempting) return;

    setIsAttempting(true);

    // 模拟突破动画
    setTimeout(() => {
      const result = attemptBreakthrough();
      setBreakthroughResult(result);
      setIsAttempting(false);
    }, 1000);
  };

  const closeModal = () => {
    setBreakthroughResult(null);
  };

  return (
    <div className="game-panel p-4">
      <h3 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
        <span>⭐</span>
        <span>修炼境界</span>
      </h3>

      {/* 境界列表 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {REALMS.map((r) => (
          <RealmBadge
            key={r.level}
            level={r.level}
            name={r.name}
            isActive={realm === r.level}
          />
        ))}
      </div>

      {/* 当前境界信息 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-[var(--game-text-muted)]">当前境界</div>
            <div className="text-lg font-bold text-[var(--game-gold-dark)]">{realmName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--game-text-muted)]">总修炼等级</div>
            <div className="text-lg font-bold text-[var(--game-text)]">{totalLevel}</div>
          </div>
        </div>

        {/* 进度条 */}
        <RealmProgressBar />
      </div>

      {/* 下一境界信息 */}
      {nextRealm && (
        <div className="bg-[var(--game-bg-hover)]/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--game-text-muted)]">下一境界</span>
            <span className="text-sm font-semibold text-[var(--game-text)]">{nextRealm.name}</span>
          </div>
          <div className="text-xs text-[var(--game-text-dim)] mb-2">
            {nextRealm.description}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--game-text-muted)]">需要等级: {nextRealm.requiredTotalLevel}</span>
            <span className="text-green-600">成功率: {(successRate * 100).toFixed(1)}%</span>
          </div>
          {nextRealm.effect && (
            <div className="mt-2 text-xs text-purple-600">
              🌟 {nextRealm.effect}
            </div>
          )}
        </div>
      )}

      {/* 突破按钮 */}
      {nextRealm ? (
        <button
          onClick={handleBreakthrough}
          disabled={!breakthroughStatus.canBreakthrough || isAttempting}
          className={`
            w-full py-3 rounded-lg font-semibold transition-all duration-300
            ${breakthroughStatus.canBreakthrough && !isAttempting
              ? 'game-btn game-btn-primary'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isAttempting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚡</span>
              突破中...
            </span>
          ) : breakthroughStatus.canBreakthrough ? (
            '🚀 开始突破'
          ) : (
            breakthroughStatus.reason || '条件不足'
          )}
        </button>
      ) : (
        <div className="text-center py-3 text-[var(--game-text-muted)] text-sm">
          🎊 已达最高境界
        </div>
      )}

      {/* 突破失败提示 */}
      {!breakthroughStatus.canBreakthrough && nextRealm && (
        <div className="mt-3 text-xs text-center text-[var(--game-text-dim)]">
          继续修炼提升等级后再来突破吧
        </div>
      )}

      {/* 突破结果弹窗 */}
      {breakthroughResult && (
        <BreakthroughResultModal result={breakthroughResult} onClose={closeModal} />
      )}

      {/* 突破动画遮罩 */}
      {isAttempting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">🌟</div>
            <div className="text-white text-lg font-bold animate-pulse">
              正在突破...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealmBreakthrough;
