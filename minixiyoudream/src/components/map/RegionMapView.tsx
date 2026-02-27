// 区域地图浏览组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getAllMapsGroupedByRegion,
  getRegionName,
  moveToMap,
  canMoveToMap,
  isMapSuitableForLevel,
  getMapDangerText,
  getMapTypeName,
} from '@/services/mapService';
import { playerLevel, player } from '@/signals/playerSignals';
import { useConfirmModal, ConfirmModal } from '@/components/common/ConfirmModal';
import type { GameMap } from '@/types';

export function RegionMapView() {
  useSignals();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<string[]>(['newbie']);
  const { showConfirm, modalProps } = useConfirmModal();

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

    // 检查危险等级，如果是危险地图则弹出确认框
    const suitability = isMapSuitableForLevel(map, level);
    if (suitability === 'dangerous' || suitability === 'hard') {
      showConfirm(
        `「${map.name}」是${suitability === 'dangerous' ? '危险' : '困难'}区域（Lv.${map.levelRange.min}-${map.levelRange.max}）\n您的等级可能不足以安全探索，确定要前往吗？`,
        {
          title: suitability === 'dangerous' ? '危险警告' : '注意',
          type: suitability === 'dangerous' ? 'danger' : 'warning',
          onConfirm: () => {
            const result = moveToMap(map.id);
            setMessage({ type: result.success ? 'success' : 'error', text: result.message });
            setTimeout(() => setMessage(null), 3000);
          },
        }
      );
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

      {/* 危险等级图例 */}
      <div className="flex items-center gap-4 text-xs text-[var(--game-text-muted)] px-1">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400"></span>轻松</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span>适合</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400"></span>困难</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span>危险</span>
      </div>

      {Object.entries(groupedMaps).map(([region, maps]) => (
        <div key={region} className="game-panel overflow-hidden">
          {/* 区域标题 - 增大触控区域 */}
          <button
            onClick={() => toggleRegion(region)}
            className="w-full p-3 flex items-center justify-between hover:bg-[var(--game-bg-hover)] transition-colors min-h-[48px] touch-manipulation active:bg-slate-100"
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
                const dangerText = getMapDangerText(suitability);
                const isCurrentMap = map.id === currentMapId;

                // 危险等级背景色
                const getDangerBgStyle = () => {
                  switch (suitability) {
                    case 'easy':
                      return 'border-l-4 border-l-green-400 bg-green-50/30';
                    case 'suitable':
                      return 'border-l-4 border-l-blue-400 bg-blue-50/30';
                    case 'hard':
                      return 'border-l-4 border-l-amber-400 bg-amber-50/30';
                    case 'dangerous':
                      return 'border-l-4 border-l-red-500 bg-red-50/30';
                    default:
                      return '';
                  }
                };

                return (
                  <div
                    key={map.id}
                    className={`p-3 border-b border-[var(--game-border)] last:border-b-0 ${
                      isCurrentMap ? 'bg-gradient-to-r from-[var(--game-gold)]/15 to-[var(--game-gold)]/5 border-l-4 border-l-[var(--game-gold)]' : getDangerBgStyle()
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 地图图标 - 增大尺寸 */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isCurrentMap
                          ? 'bg-[var(--game-gold)]/20 border-2 border-[var(--game-gold)]/40'
                          : 'bg-white/70'
                      }`}>
                        {map.icon}
                      </div>

                      {/* 地图信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-medium ${isCurrentMap ? 'text-[var(--game-gold-dark)]' : 'text-[var(--game-text)]'}`}>
                            {map.name}
                          </span>
                          {isCurrentMap && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--game-gold)]/30 text-[var(--game-gold-dark)] font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                              当前位置
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--game-text-muted)]">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100">{getMapTypeName(map.type)}</span>
                          <span>Lv.{map.levelRange.min}-{map.levelRange.max}</span>
                          <span className={`px-1.5 py-0.5 rounded font-medium ${
                            suitability === 'easy' ? 'bg-green-100 text-green-700' :
                            suitability === 'suitable' ? 'bg-blue-100 text-blue-700' :
                            suitability === 'hard' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{dangerText}</span>
                        </div>
                      </div>

                      {/* 快速导航 - 增大触控区域 */}
                      {!isCurrentMap && (
                        <button
                          onClick={() => handleMoveToMap(map)}
                          className="px-4 py-2.5 text-sm bg-[var(--game-primary)]/10 hover:bg-[var(--game-primary)]/20 text-[var(--game-primary)] rounded-lg transition-colors min-h-[44px] touch-manipulation active:scale-95"
                        >
                          前往
                        </button>
                      )}
                      {isCurrentMap && (
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      )}
                    </div>

                    {/* 简短描述 */}
                    <p className="mt-2 text-xs text-[var(--game-text-muted)] line-clamp-1 pl-15">
                      {map.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* 确认弹窗 */}
      <ConfirmModal {...modalProps} />
    </div>
  );
}
