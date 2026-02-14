// 战斗日志组件

import { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { battleState } from '@/signals';

export function BattleLog() {
  useSignals();

  const logEndRef = useRef<HTMLDivElement>(null);
  const state = battleState.value;
  const logs = state?.logs ?? [];

  // 自动滚动到最新日志
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  if (!state) return null;

  return (
    <div className="bg-white/70 rounded-xl p-3 h-24 overflow-y-auto text-xs shadow-sm border border-[var(--game-border)]">
      {logs.length === 0 ? (
        <p className="text-[var(--game-text-muted)] text-center">战斗开始！</p>
      ) : (
        <div className="space-y-1">
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
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
