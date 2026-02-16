// 挂机战斗控制组件 - 紧凑版

import { useSignals } from '@preact/signals-react/runtime';
import {
  autoBattleEnabled,
  autoBattleStatus,
  autoBattleStats,
  canAutoBattle,
  autoBattleRunTime,
  formatRunTime,
  startAutoBattle,
  stopAutoBattle,
  resetAutoBattleStats,
} from '@/signals/autoBattleSignals';
import { isInBattle } from '@/signals/battleSignals';

const STATUS_CONFIG: Record<string, { icon: string; text: string; color: string }> = {
  idle: { icon: '💤', text: '空闲', color: 'text-slate-600' },
  searching: { icon: '🔍', text: '寻找中', color: 'text-blue-600' },
  battling: { icon: '⚔️', text: '战斗中', color: 'text-red-600' },
  resting: { icon: '💤', text: '休息中', color: 'text-green-600' },
  stopped: { icon: '⏹️', text: '已停止', color: 'text-slate-600' },
  dead: { icon: '💀', text: '死亡', color: 'text-red-600' },
};

export function AutoBattle() {
  useSignals();

  const enabled = autoBattleEnabled.value;
  const status = autoBattleStatus.value;
  const stats = autoBattleStats.value;
  const canAuto = canAutoBattle.value;
  const runTime = autoBattleRunTime.value;
  const inBattle = isInBattle.value;

  if (!canAuto) return null;

  const handleToggle = () => {
    enabled ? stopAutoBattle() : startAutoBattle();
  };

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <div className="game-panel p-2.5">
      {/* 状态行 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span>{statusConfig.icon}</span>
          <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.text}</span>
        </div>
        {enabled && stats.startTime > 0 && (
          <span className="text-[11px] text-slate-600">{formatRunTime(runTime)}</span>
        )}
      </div>

      {/* 按钮 */}
      <button
        onClick={handleToggle}
        disabled={inBattle && status === 'battling' && enabled}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all touch-manipulation ${
          enabled
            ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
            : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
        } ${(inBattle && status === 'battling' && enabled) ? 'opacity-50' : ''}`}
      >
        {enabled ? '停止' : '开始挂机'}
      </button>

      {/* 统计 - 紧凑版 */}
      {stats.battleCount > 0 && (
        <div className="mt-2 p-2 bg-amber-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-amber-700">统计</span>
            <button onClick={resetAutoBattleStats} className="text-[11px] text-slate-600 hover:text-slate-800 touch-manipulation">
              重置
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-[11px]">
            <div>
              <div className="font-medium text-[var(--game-text)]">{stats.battleCount}</div>
              <div className="text-slate-600">战斗</div>
            </div>
            <div>
              <div className="font-medium text-red-600">{stats.killCount}</div>
              <div className="text-slate-600">击杀</div>
            </div>
            <div>
              <div className="font-medium text-green-600">{stats.totalExp > 9999 ? `${(stats.totalExp/1000).toFixed(1)}k` : stats.totalExp}</div>
              <div className="text-slate-600">经验</div>
            </div>
            <div>
              <div className="font-medium text-amber-600">{stats.totalGold > 9999 ? `${(stats.totalGold/1000).toFixed(1)}k` : stats.totalGold}</div>
              <div className="text-slate-600">金币</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
