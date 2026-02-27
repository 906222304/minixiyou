// 传送面板组件 - 与地图系统风格一致

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { player, playerGold, playerLevel } from '@/signals/playerSignals';
import {
  availableTeleports,
  teleport,
  unlockTeleport,
  isTeleportAvailable,
  canAffordTeleport,
  isTeleportUnlocked,
} from '@/services/teleportService';
import { getAllTeleportPoints } from '@/constants/teleports';
import { getMap, getRegionName } from '@/constants/maps';
import { isMapSuitableForLevel, getMapDangerStyle, getMapDangerText } from '@/services/mapService';
import { useConfirmModal, ConfirmModal } from '@/components/common/ConfirmModal';
import type { TeleportPoint } from '@/constants/teleports';
import type { GameMap } from '@/types';

type TeleportFilter = 'all' | 'unlocked' | 'available';

export function TeleportPanel() {
  useSignals();

  const [filter, setFilter] = useState<TeleportFilter>('available');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { showConfirm, modalProps } = useConfirmModal();

  const currentPlayer = player.value;
  const currentGold = playerGold.value;
  const currentLevel = playerLevel.value;

  // 获取传送点列表
  const getTeleportList = (): TeleportPoint[] => {
    const allTeleports = getAllTeleportPoints();

    switch (filter) {
      case 'unlocked':
        return allTeleports.filter(tp => isTeleportUnlocked(tp.id));
      case 'available':
        return availableTeleports.value;
      case 'all':
      default:
        return allTeleports;
    }
  };

  // 按区域分组传送点
  const groupedTeleports = (): Record<string, Array<TeleportPoint & { mapData?: GameMap }>> => {
    const teleports = getTeleportList();
    const groups: Record<string, Array<TeleportPoint & { mapData?: GameMap }>> = {};

    teleports.forEach(tp => {
      const mapData = getMap(tp.mapId);
      const region = mapData?.region || 'other';
      const regionName = getRegionName(region);

      if (!groups[regionName]) {
        groups[regionName] = [];
      }
      groups[regionName].push({ ...tp, mapData });
    });

    return groups;
  };

  const handleTeleport = (teleportId: string) => {
    const tp = getAllTeleportPoints().find(t => t.id === teleportId);
    if (!tp) return;

    showConfirm(
      `确定要传送到「${tp.name}」吗？\n${tp.cost.gold > 0 ? `需要消耗 ${tp.cost.gold} 金币` : '本次传送免费'}`,
      {
        title: '确认传送',
        type: 'info',
        onConfirm: () => {
          const result = teleport(teleportId);
          setMessage({ type: result.success ? 'success' : 'error', text: result.message });
          setTimeout(() => setMessage(null), 3000);
        },
      }
    );
  };

  const handleUnlock = (teleportId: string) => {
    const tp = getAllTeleportPoints().find(t => t.id === teleportId);
    if (!tp) return;

    showConfirm(
      `确定要解锁传送点「${tp.name}」吗？`,
      {
        title: '确认解锁',
        type: 'warning',
        onConfirm: () => {
          const result = unlockTeleport(teleportId);
          setMessage({ type: result.success ? 'success' : 'error', text: result.message });
          setTimeout(() => setMessage(null), 3000);
        },
      }
    );
  };

  const getTeleportStatus = (tp: TeleportPoint): 'locked' | 'unavailable' | 'available' | 'current' => {
    if (!isTeleportUnlocked(tp.id)) return 'locked';
    if (currentPlayer?.currentMapId === tp.mapId) return 'current';
    if (!isTeleportAvailable(tp.id)) return 'unavailable';
    return 'available';
  };

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'locked':
        return 'opacity-50 bg-gray-100 border-gray-300';
      case 'unavailable':
        return 'opacity-70 bg-gray-50 border-gray-200';
      case 'current':
        return 'border-[var(--game-gold)] bg-[var(--game-gold)]/10';
      case 'available':
      default:
        return 'bg-white/70 border-gray-200 hover:border-[var(--game-gold)]';
    }
  };

  const groups = groupedTeleports();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--game-text-muted)] flex items-center gap-2">
          <span>✨</span>
          <span>传送点</span>
        </h3>
        <div className="text-sm">
          <span className="text-[var(--game-text-muted)]">金币：</span>
          <span className="text-yellow-600 font-medium">{currentGold.toLocaleString()}</span>
        </div>
      </div>

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

      {/* 筛选器 */}
      <div className="flex gap-2">
        {(['available', 'unlocked', 'all'] as TeleportFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-3 py-3 text-sm rounded-lg transition-all min-h-[44px] touch-manipulation ${
              filter === f
                ? 'bg-[var(--game-gold)]/20 text-[var(--game-gold-dark)] border border-[var(--game-gold)]/40'
                : 'bg-white/50 text-[var(--game-text-muted)] hover:bg-white/70 border border-transparent active:bg-slate-200'
            }`}
          >
            {f === 'available' ? '可用' : f === 'unlocked' ? '已解锁' : '全部'}
          </button>
        ))}
      </div>

      {/* 当前位置 - 增强显示 */}
      {currentPlayer && (() => {
        const currentMapData = getMap(currentPlayer.currentMapId);
        return (
          <div className="game-panel p-3 bg-gradient-to-r from-[var(--game-gold)]/15 to-[var(--game-gold)]/5 border-2 border-[var(--game-gold)]/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--game-gold)]/20 flex items-center justify-center text-2xl border-2 border-[var(--game-gold)]/30">
                {currentMapData?.icon || '📍'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--game-gold)]/30 text-[var(--game-gold-dark)] font-medium">
                    当前位置
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div className="font-bold text-[var(--game-gold-dark)] text-base">
                  {currentMapData?.name ?? currentPlayer.currentMapId}
                </div>
                {currentMapData && (
                  <div className="text-xs text-[var(--game-text-muted)] mt-0.5">
                    Lv.{currentMapData.levelRange.min}-{currentMapData.levelRange.max} · {currentMapData.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 传送点列表 */}
      <div className="space-y-4">
        {Object.entries(groups).map(([region, teleports]) => (
          <div key={region} className="space-y-2">
            <h4 className="text-xs font-medium text-[var(--game-text-muted)] border-b border-gray-200 pb-1 flex items-center gap-2">
              <span>{region === '新手村' ? '🏡' : region === '东土大唐' ? '🏯' : '📍'}</span>
              {region}
            </h4>
            <div className="grid gap-2">
              {teleports.map(tp => {
                const status = getTeleportStatus(tp);
                const canAfford = canAffordTeleport(tp.id);
                const meetsLevelReq = !tp.requirements?.minLevel || currentLevel >= tp.requirements.minLevel;
                // 计算目标地图的危险等级
                const mapData = tp.mapData;
                const suitability = mapData ? isMapSuitableForLevel(mapData, currentLevel) : 'suitable';
                const dangerStyle = getMapDangerStyle(suitability);
                const dangerText = getMapDangerText(suitability);

                // 危险等级背景色
                const getDangerBgStyle = () => {
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
                  <div
                    key={tp.id}
                    className={`game-panel p-3 transition-all ${getStatusStyle(status)} ${getDangerBgStyle()}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 传送点图标 - 增大触控区域 */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        status === 'current'
                          ? 'bg-[var(--game-gold)]/20 border-2 border-[var(--game-gold)]/40'
                          : status === 'locked'
                          ? 'bg-gray-200/70'
                          : 'bg-white/70'
                      }`}>
                        {tp.icon || '📍'}
                      </div>

                      {/* 传送点信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[var(--game-text)] truncate">{tp.name}</span>
                          {status === 'current' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--game-gold)]/30 text-[var(--game-gold-dark)] font-medium">
                              当前
                            </span>
                          )}
                          {status === 'locked' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                              未解锁
                            </span>
                          )}
                          {/* 危险等级标签 */}
                          {status !== 'locked' && status !== 'current' && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dangerStyle} ${
                              suitability === 'easy' ? 'bg-green-50' :
                              suitability === 'suitable' ? 'bg-blue-50' :
                              suitability === 'hard' ? 'bg-amber-50' :
                              'bg-red-50'
                            }`}>
                              {dangerText}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--game-text-muted)]">
                          <span>Lv.{tp.requirements?.minLevel || 1}+</span>
                          {tp.cost.gold > 0 && (
                            <span className={`flex items-center gap-0.5 ${canAfford ? 'text-yellow-600' : 'text-red-500'}`}>
                              <span>💰</span>
                              {tp.cost.gold}
                            </span>
                          )}
                          {tp.cost.gold === 0 && (
                            <span className="text-green-600 flex items-center gap-0.5">
                              <span>✓</span> 免费
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 - 增大触控区域 */}
                      <div className="flex-shrink-0">
                        {status === 'locked' && meetsLevelReq && (
                          <button
                            onClick={() => handleUnlock(tp.id)}
                            className="px-4 py-2.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors min-h-[44px] min-w-[60px] touch-manipulation active:scale-95"
                          >
                            解锁
                          </button>
                        )}
                        {status === 'locked' && !meetsLevelReq && (
                          <span className="text-xs text-gray-400 px-2">等级不足</span>
                        )}
                        {status === 'available' && (
                          <button
                            onClick={() => handleTeleport(tp.id)}
                            disabled={!canAfford}
                            className={`px-4 py-2.5 text-sm rounded-lg transition-colors min-h-[44px] min-w-[60px] touch-manipulation active:scale-95 ${
                              canAfford
                                ? 'bg-[var(--game-primary)] hover:bg-[var(--game-primary)]/80 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            传送
                          </button>
                        )}
                        {status === 'unavailable' && (
                          <span className="text-xs text-gray-400 px-2">条件不足</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groups).length === 0 && (
        <div className="text-center text-[var(--game-text-muted)] py-8">
          暂无符合条件的传送点
        </div>
      )}

      {/* 使用说明 */}
      <div className="game-panel p-3 text-xs text-[var(--game-text-muted)]">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <p className="font-medium text-[var(--game-text)] mb-1">传送提示</p>
            <p>传送需要消耗金币。首次到达新地图时，会自动解锁该地图的传送点。</p>
            <p className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span>轻松</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>适合</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>困难</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>危险</span>
            </p>
          </div>
        </div>
      </div>

      {/* 确认弹窗 */}
      <ConfirmModal {...modalProps} />
    </div>
  );
}
