// 相邻地图导航组件 - 紧凑版

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getAvailableAdjacentMaps,
  moveToMap,
  DIRECTION_ICONS,
  isMapSuitableForLevel,
  getMapDangerStyle,
  getMapDangerText,
} from '@/services/mapService';
import { playerLevel } from '@/signals/playerSignals';

export function AdjacentMaps() {
  useSignals();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const level = playerLevel.value;
  const adjacentMaps = getAvailableAdjacentMaps();

  const handleMove = (targetMapId: string) => {
    const result = moveToMap(targetMapId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
  };

  if (adjacentMaps.length === 0) {
    return (
      <div className="game-panel p-3 text-center text-xs text-[var(--game-text-muted)]">
        没有相邻区域
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 消息提示 */}
      {message && (
        <div className={`px-3 py-2 rounded-lg text-xs ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* 地图列表 */}
      <div className="grid gap-1.5">
        {adjacentMaps.map(conn => {
          const suitability = isMapSuitableForLevel(conn.targetMap, level);
          const dangerStyle = getMapDangerStyle(suitability);
          const dangerText = getMapDangerText(suitability);

          return (
            <button
              key={conn.targetMapId}
              onClick={() => conn.canMove && handleMove(conn.targetMapId)}
              disabled={!conn.canMove}
              className={`w-full game-panel p-2.5 text-left transition-all flex items-center gap-2 touch-manipulation ${
                conn.canMove ? 'hover:border-[var(--game-gold)] active:bg-slate-100' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {/* 方向 + 地图图标 */}
              <div className="flex items-center gap-1.5">
                <span className="text-base">{DIRECTION_ICONS[conn.direction]}</span>
                <span className="text-xl">{conn.targetMap.icon}</span>
              </div>

              {/* 地图信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm text-[var(--game-text)]">{conn.targetMap.name}</span>
                  <span className="text-[11px] text-[var(--game-text-muted)]">
                    Lv.{conn.targetMap.levelRange.min}-{conn.targetMap.levelRange.max}
                  </span>
                  <span className={`text-[10px] font-medium ${dangerStyle}`}>{dangerText}</span>
                </div>
                {!conn.canMove && (
                  <div className="text-[11px] text-red-600 font-medium">{conn.reason}</div>
                )}
              </div>

              {/* 箭头 */}
              {conn.canMove && <span className="text-[var(--game-text-muted)] text-lg">›</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
