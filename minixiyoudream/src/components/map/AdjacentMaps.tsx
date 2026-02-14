// 相邻地图导航组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getAvailableAdjacentMaps,
  moveToMap,
  DIRECTION_NAMES,
  DIRECTION_ICONS,
  isMapSuitableForLevel,
  getMapDangerStyle,
  getMapDangerText,
  getMapTypeName,
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
      <div className="game-panel p-4 text-center text-[var(--game-text-muted)]">
        当前地图没有相邻的区域
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 消息提示 */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <h3 className="text-sm font-medium text-[var(--game-text-muted)] flex items-center gap-2">
        <span>🚶</span>
        <span>步行前往</span>
      </h3>

      <div className="space-y-2">
        {adjacentMaps.map(conn => {
          const suitability = isMapSuitableForLevel(conn.targetMap, level);
          const dangerStyle = getMapDangerStyle(suitability);
          const dangerText = getMapDangerText(suitability);

          return (
            <button
              key={conn.targetMapId}
              onClick={() => conn.canMove && handleMove(conn.targetMapId)}
              disabled={!conn.canMove}
              className={`w-full game-panel p-3 text-left transition-all ${
                conn.canMove
                  ? 'hover:border-[var(--game-gold)] cursor-pointer active:scale-[0.98]'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 方向指示 */}
                <div className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center">
                  <span className="text-xl">{DIRECTION_ICONS[conn.direction]}</span>
                </div>

                {/* 地图图标 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--game-gold)]/10 to-white/30 border border-[var(--game-gold)]/20 flex items-center justify-center text-2xl">
                  {conn.targetMap.icon}
                </div>

                {/* 地图信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--game-text)]">{conn.targetMap.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {getMapTypeName(conn.targetMap.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-[var(--game-text-muted)]">
                      向{DIRECTION_NAMES[conn.direction]}走
                    </span>
                    <span className="text-[var(--game-text-muted)]">
                      Lv.{conn.targetMap.levelRange.min}-{conn.targetMap.levelRange.max}
                    </span>
                    <span className={dangerStyle}>{dangerText}</span>
                  </div>

                  {/* 不能移动的原因 */}
                  {!conn.canMove && (
                    <div className="mt-1 text-xs text-red-500">
                      {conn.reason}
                    </div>
                  )}

                  {/* 等级限制提示 */}
                  {conn.requiredLevel && conn.canMove && (
                    <div className="mt-1 text-xs text-yellow-600">
                      需要 Lv.{conn.requiredLevel}+
                    </div>
                  )}
                </div>

                {/* 箭头 */}
                {conn.canMove && (
                  <div className="text-[var(--game-text-muted)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
