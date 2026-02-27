// 战斗日志组件 - 增强版

import { useEffect, useRef, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { battleState } from '@/signals';

type LogFilter = 'all' | 'player' | 'enemy' | 'critical' | 'heal';

export function BattleLog() {
  useSignals();

  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<LogFilter>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const state = battleState.value;
  const logs = state?.logs ?? [];

  // 自动滚动到最新日志
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs.length]);

  if (!state) return null;

  // 根据过滤条件筛选日志
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'player') return log.actor.isPlayer;
    if (filter === 'enemy') return !log.actor.isPlayer;
    if (filter === 'critical') return log.text.includes('暴击');
    if (filter === 'heal') return log.text.includes('恢复') || log.text.includes('治疗');
    return true;
  });

  // 获取日志颜色
  const getLogColor = (log: typeof logs[0]) => {
    if (log.text.includes('暴击')) return 'text-amber-500 font-semibold';
    if (log.text.includes('恢复') || log.text.includes('治疗')) return 'text-green-500';
    if (log.text.includes('闪避') || log.text.includes('MISS')) return 'text-gray-400 italic';
    if (log.text.includes('防御')) return 'text-blue-400';
    if (log.actor.isPlayer) return 'text-blue-600';
    return 'text-red-500';
  };

  return (
    <div className={`relative ${isExpanded ? 'h-48 sm:h-64' : 'h-20 sm:h-28'}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { key: 'all', label: '全部' },
            { key: 'player', label: '我方' },
            { key: 'enemy', label: '敌方' },
            { key: 'critical', label: '暴击' },
            { key: 'heal', label: '治疗' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as LogFilter)}
              className={`
                px-2 py-0.5 text-[10px] sm:text-xs rounded-full whitespace-nowrap transition-colors
                ${filter === item.key
                  ? 'bg-[var(--game-gold)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] sm:text-xs text-[var(--game-text-muted)] hover:text-[var(--game-text)] px-2"
        >
          {isExpanded ? '收起 ▲' : '展开 ▼'}
        </button>
      </div>

      {/* 日志内容 */}
      <div
        ref={containerRef}
        className={`
          bg-slate-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3
          overflow-y-auto text-[10px] sm:text-xs
          shadow-sm border border-[var(--game-border)]
          transition-all duration-300
          ${isExpanded ? 'h-40 sm:h-56' : 'h-14 sm:h-20'}
        `}
      >
        {filteredLogs.length === 0 ? (
          <p className="text-[var(--game-text-muted)] text-center py-2">
            {logs.length === 0 ? '战斗开始！' : '暂无符合条件的日志'}
          </p>
        ) : (
          <div className="space-y-0.5 sm:space-y-1">
            {filteredLogs.map((log, index) => (
              <div
                key={`${log.timestamp}-${index}`}
                className={`${getLogColor(log)} leading-relaxed`}
              >
                <span className="text-[var(--game-text-dim)] opacity-60">[{log.round}]</span>{' '}
                <span className="font-medium">{log.actor.name}</span>
                <span className="text-[var(--game-text-muted)]">: </span>
                {log.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
