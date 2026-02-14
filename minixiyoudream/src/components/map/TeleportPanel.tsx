// 传送面板组件

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
import type { TeleportPoint } from '@/constants/teleports';
// 修复: 添加 getMap 导入用于获取地图名称
import { getMap } from '@/constants/maps';

type TeleportFilter = 'all' | 'unlocked' | 'available';

export function TeleportPanel() {
  useSignals();

  const [filter, setFilter] = useState<TeleportFilter>('available');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
  const groupedTeleports = (): Record<string, TeleportPoint[]> => {
    const teleports = getTeleportList();
    const groups: Record<string, TeleportPoint[]> = {
      '新手村': [],
      '东土大唐': [],
    };

    teleports.forEach(tp => {
      if (tp.id.startsWith('teleport_village') || tp.id === 'teleport_changan') {
        groups['新手村'].push(tp);
      } else if (tp.id.startsWith('teleport_datang') || tp.id.startsWith('teleport_fox') ||
                 tp.id.startsWith('teleport_spider') || tp.id.startsWith('teleport_bandit') ||
                 tp.id.startsWith('teleport_ancient') || tp.id.startsWith('teleport_misty') ||
                 tp.id.startsWith('teleport_dragon') || tp.id.startsWith('teleport_tiger') ||
                 tp.id.startsWith('teleport_fairy') || tp.id.startsWith('teleport_ghost') ||
                 tp.id.startsWith('teleport_dungeon_entrance')) {
        groups['东土大唐'].push(tp);
      }
    });

    // 过滤空组
    return Object.fromEntries(
      Object.entries(groups).filter(([, items]) => items.length > 0)
    );
  };

  const handleTeleport = (teleportId: string) => {
    const result = teleport(teleportId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    if (result.success) {
      setTimeout(() => setMessage(null), 3000);
    } else {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUnlock = (teleportId: string) => {
    const result = unlockTeleport(teleportId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
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
        return 'opacity-50 bg-gray-800/50 border-gray-600';
      case 'unavailable':
        return 'opacity-70 bg-gray-800/50 border-gray-500';
      case 'current':
        return 'border-primary-500 bg-primary-900/30';
      case 'available':
      default:
        return 'border-gray-700 hover:border-primary-500';
    }
  };

  const groups = groupedTeleports();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">传送点</h2>
        <div className="text-sm text-gray-400">
          金币: <span className="text-yellow-400">{currentGold}</span>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-900/50 text-green-300 border border-green-700'
              : 'bg-red-900/50 text-red-300 border border-red-700'
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
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f === 'available' ? '可用' : f === 'unlocked' ? '已解锁' : '全部'}
          </button>
        ))}
      </div>

      {/* 当前位置 */}
      {currentPlayer && (
        <div className="card bg-primary-900/30 border-primary-500">
          <div className="text-sm text-gray-400 mb-1">当前位置</div>
          {/* 修复: 显示地图名称而非 ID */}
          <div className="font-medium">
            {getMap(currentPlayer.currentMapId)?.name ?? currentPlayer.currentMapId}
          </div>
        </div>
      )}

      {/* 传送点列表 */}
      <div className="space-y-4">
        {Object.entries(groups).map(([region, teleports]) => (
          <div key={region} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-1">
              {region}
            </h3>
            <div className="grid gap-2">
              {teleports.map(tp => {
                const status = getTeleportStatus(tp);
                const canAfford = canAffordTeleport(tp.id);
                const meetsLevelReq = !tp.requirements?.minLevel || currentLevel >= tp.requirements.minLevel;

                return (
                  <div
                    key={tp.id}
                    className={`card transition-all ${getStatusStyle(status)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tp.icon || '📍'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{tp.name}</span>
                          {status === 'current' && (
                            <span className="text-xs bg-primary-600 px-2 py-0.5 rounded">当前位置</span>
                          )}
                          {status === 'locked' && (
                            <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">未解锁</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 truncate">{tp.description}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>Lv.{tp.requirements?.minLevel || 1}+</span>
                          {tp.cost.gold > 0 && (
                            <span className={canAfford ? 'text-yellow-400' : 'text-red-400'}>
                              {tp.cost.gold} 金币
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {status === 'locked' && meetsLevelReq && (
                          <button
                            onClick={() => handleUnlock(tp.id)}
                            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                          >
                            解锁
                          </button>
                        )}
                        {status === 'locked' && !meetsLevelReq && (
                          <span className="text-xs text-gray-500">等级不足</span>
                        )}
                        {status === 'available' && (
                          <button
                            onClick={() => handleTeleport(tp.id)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              canAfford
                                ? 'bg-primary-600 hover:bg-primary-500'
                                : 'bg-gray-600 cursor-not-allowed opacity-50'
                            }`}
                          >
                            传送
                          </button>
                        )}
                        {status === 'unavailable' && (
                          <span className="text-xs text-gray-500">条件不足</span>
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
        <div className="text-center text-gray-500 py-8">
          暂无符合条件的传送点
        </div>
      )}
    </div>
  );
}
