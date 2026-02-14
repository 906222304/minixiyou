// 区域地图浏览组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getAllMapsGroupedByRegion,
  getRegionName,
  moveToMap,
  canMoveToMap,
  isMapSuitableForLevel,
  getMapDangerStyle,
  getMapDangerText,
  getMapTypeName,
} from '@/services/mapService';
import { playerLevel, player } from '@/signals/playerSignals';
import type { GameMap } from '@/types';

export function RegionMapView() {
  useSignals();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<string[]>(['newbie']);

  const level = playerLevel.value;
  const currentMapId = player.value?.currentMapId;
  const groupedMaps = getAllMapsGroupedByRegion();

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleMoveToMap = (map: GameMap) => {
    const canMove = canMoveToMap(map.id);
    if (!canMove.canMove) {
      // 如果不能步行到达，提示用户使用传送
      setMessage({
        type: 'error',
        text: canMove.reason + '，请使用传送功能'
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const result = moveToMap(map.id);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
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
        <span>🗺️</span>
        <span>区域地图</span>
      </h3>

      {Object.entries(groupedMaps).map(([region, maps]) => (
        <div key={region} className="game-panel overflow-hidden">
          {/* 区域标题 */}
          <button
            onClick={() => toggleRegion(region)}
            className="w-full p-3 flex items-center justify-between hover:bg-[var(--game-bg-hover)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{region === 'newbie' ? '🏡' : '🏯'}</span>
              <span className="font-medium text-[var(--game-text)]">{getRegionName(region)}</span>
              <span className="text-xs text-[var(--game-text-muted)]">({maps.length}个地图)</span>
            </div>
            <svg
              className={`w-5 h-5 text-[var(--game-text-muted)] transition-transform ${
                expandedRegions.includes(region) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 地图列表 */}
          {expandedRegions.includes(region) && (
            <div className="border-t border-[var(--game-border)]">
              {maps.map(map => {
                const suitability = isMapSuitableForLevel(map, level);
                const dangerStyle = getMapDangerStyle(suitability);
                const dangerText = getMapDangerText(suitability);
                const isCurrentMap = map.id === currentMapId;

                return (
                  <div
                    key={map.id}
                    className={`p-3 border-b border-[var(--game-border)] last:border-b-0 ${
                      isCurrentMap ? 'bg-[var(--game-gold)]/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 地图图标 */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        isCurrentMap
                          ? 'bg-[var(--game-gold)]/20 border border-[var(--game-gold)]/40'
                          : 'bg-white/70'
                      }`}>
                        {map.icon}
                      </div>

                      {/* 地图信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCurrentMap ? 'text-[var(--game-gold-dark)]' : 'text-[var(--game-text)]'}`}>
                            {map.name}
                          </span>
                          {isCurrentMap && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--game-gold)]/20 text-[var(--game-gold-dark)]">
                              当前位置
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--game-text-muted)]">
                          <span>{getMapTypeName(map.type)}</span>
                          <span>Lv.{map.levelRange.min}-{map.levelRange.max}</span>
                          <span className={dangerStyle}>{dangerText}</span>
                        </div>
                      </div>

                      {/* 快速导航（仅相邻地图） */}
                      {!isCurrentMap && (
                        <button
                          onClick={() => handleMoveToMap(map)}
                          className="px-3 py-1.5 text-xs bg-[var(--game-primary)]/10 hover:bg-[var(--game-primary)]/20 text-[var(--game-primary)] rounded-lg transition-colors"
                        >
                          前往
                        </button>
                      )}
                    </div>

                    {/* 简短描述 */}
                    <p className="mt-2 text-xs text-[var(--game-text-muted)] line-clamp-1">
                      {map.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
