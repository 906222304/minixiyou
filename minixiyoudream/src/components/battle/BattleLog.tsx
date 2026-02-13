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
    <div className="bg-black/30 rounded-lg p-2 h-24 overflow-y-auto text-xs">
      {logs.length === 0 ? (
        <p className="text-gray-500 text-center">战斗开始！</p>
      ) : (
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className={`
                ${log.actor.isPlayer ? 'text-blue-300' : 'text-red-300'}
              `}
            >
              <span className="text-gray-500">[回合{log.round}]</span>{' '}
              {log.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
