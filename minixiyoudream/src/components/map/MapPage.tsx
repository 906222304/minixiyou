// 地图页面组件

import { useSignals } from '@preact/signals-react/runtime';
import { player, updatePlayerPosition } from '@/signals';
import { getAllMaps } from '@/constants/maps';

export function MapPage() {
  useSignals();

  const currentPlayer = player.value;
  const allMaps = getAllMaps();

  const handleTeleport = (mapId: string) => {
    if (currentPlayer) {
      updatePlayerPosition(mapId, 0, 0);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">地图</h2>

      {/* 当前位置 */}
      {currentPlayer && (
        <div className="card bg-primary-900/30 border-primary-500">
          <div className="text-sm text-gray-400 mb-1">当前位置</div>
          <div className="font-medium">{currentPlayer.currentMapId}</div>
        </div>
      )}

      {/* 可用地图列表 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">传送点</h3>
        {allMaps.map((map) => (
          <button
            key={map.id}
            onClick={() => handleTeleport(map.id)}
            className={`w-full card text-left hover:border-primary-500 transition-colors ${
              currentPlayer?.currentMapId === map.id ? 'border-primary-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{map.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{map.name}</div>
                <div className="text-sm text-gray-400">{map.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  等级范围: Lv.{map.levelRange.min} - Lv.{map.levelRange.max}
                </div>
              </div>
              {currentPlayer?.currentMapId === map.id && (
                <span className="text-xs bg-primary-600 px-2 py-1 rounded">当前位置</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
