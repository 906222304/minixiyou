// 相邻地图导航组件 - 紧凑版

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getAvailableAdjacentMaps,
  moveToMap,
  DIRECTION_ICONS,
  isMapSuitableForLevel,
  getMapDangerText,
} from '@/services/mapService';
import { playerLevel } from '@/signals/playerSignals';
import { useConfirmModal, ConfirmModal } from '@/components/common/ConfirmModal';

export function AdjacentMaps() {
  useSignals();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { showConfirm, modalProps } = useConfirmModal();
  const level = playerLevel.value;
  const adjacentMaps = getAvailableAdjacentMaps();

  const handleMove = (targetMapId: string, mapName: string, suitability: 'easy' | 'suitable' | 'hard' | 'dangerous') => {
    // 如果是危险或困难区域，弹出确认框
    if (suitability === 'dangerous' || suitability === 'hard') {
      showConfirm(
        `「${mapName}」是${suitability === 'dangerous' ? '危险' : '困难'}区域\n您的等级可能不足以安全探索，确定要前往吗？`,
        {
          title: suitability === 'dangerous' ? '危险警告' : '注意',
          type: suitability === 'dangerous' ? 'danger' : 'warning',
          onConfirm: () => {
            const result = moveToMap(targetMapId);
            setMessage({ type: result.success ? 'success' : 'error', text: result.message });
            setTimeout(() => setMessage(null), 3000);
          },
        }
      );
      return;
    }

    const result = moveToMap(targetMapId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
  };

  if (adjacentMaps.length === 0) {
    return (
      <div className="game-panel p-4 text-center text-sm text-[var(--game-text-muted)] min-h-[60px] flex items-center justify-center">
        没有相邻区域
      </div>
    );
  }

  // 危险等级背景样式
  const getDangerBgStyle = (suitability: 'easy' | 'suitable' | 'hard' | 'dangerous') => {
    switch (suitability) {
      case 'easy':
        return 'border-l-4 border-l-green-400';
      case 'suitable':
        return 'border-l-4 border-l-blue-400';
      case 'hard':
        return 'border-l-4 border-l-amber-400';
      case 'dangerous':
        return 'border-l-4 border-l-red-500';
      default:
        return '';
    }
  };

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

      {/* 标题 */}
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--game-text)]">
        <span>🧭</span>
        <span>可前往区域</span>
      </div>

      {/* 地图列表 */}
      <div className="grid gap-2">
        {adjacentMaps.map(conn => {
          const suitability = isMapSuitableForLevel(conn.targetMap, level);
          const dangerText = getMapDangerText(suitability);

          return (
            <button
              key={conn.targetMapId}
              onClick={() => conn.canMove && handleMove(conn.targetMapId, conn.targetMap.name, suitability)}
              disabled={!conn.canMove}
              className={`w-full game-panel p-3 text-left transition-all flex items-center gap-3 min-h-[56px] touch-manipulation ${getDangerBgStyle(suitability)} ${
                conn.canMove ? 'hover:border-[var(--game-gold)] active:bg-slate-100' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {/* 方向 + 地图图标 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base">
                  {DIRECTION_ICONS[conn.direction]}
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center text-xl">
                  {conn.targetMap.icon}
                </div>
              </div>

              {/* 地图信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-[var(--game-text)]">{conn.targetMap.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    suitability === 'easy' ? 'bg-green-100 text-green-700' :
                    suitability === 'suitable' ? 'bg-blue-100 text-blue-700' :
                    suitability === 'hard' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {dangerText}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--game-text-muted)]">
                    Lv.{conn.targetMap.levelRange.min}-{conn.targetMap.levelRange.max}
                  </span>
                  {!conn.canMove && (
                    <span className="text-xs text-red-600 font-medium">{conn.reason}</span>
                  )}
                </div>
              </div>

              {/* 箭头 */}
              {conn.canMove && (
                <div className="w-8 h-8 rounded-full bg-[var(--game-primary)]/10 flex items-center justify-center text-lg text-[var(--game-primary)]">
                  ›
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 确认弹窗 */}
      <ConfirmModal {...modalProps} />
    </div>
  );
}
