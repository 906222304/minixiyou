// 战斗日志组件

import { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { battleState } from '@/signals';

export function BattleLog() {
  useSignals();

  const containerRef = useRef<HTMLDivElement>(null);
  const state = battleState.value;
  const logs = state?.logs ?? [];

  // 自动滚动到最新日志 - 只滚动容器内部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs.length]);

  if (!state) return null;

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 h-16 sm:h-24 overflow-y-auto text-[10px] sm:text-xs shadow-sm border border-[var(--game-border)]"
    >
      {logs.length === 0 ? (
        <p className="text-[var(--game-text-muted)] text-center">战斗开始！</p>
      ) : (
        <div className="space-y-0.5 sm:space-y-1">
          {logs.map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className={`
                ${log.actor.isPlayer ? 'text-[#2563eb]' : 'text-[#dc2626]'}
              `}
            >
              <span className="text-[var(--game-text-dim)]">[回合{log.round}]</span>{' '}
              {log.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
