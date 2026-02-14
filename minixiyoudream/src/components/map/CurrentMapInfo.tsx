// 当前地图信息展示组件

import { useSignals } from '@preact/signals-react/runtime';
import { currentMap, getMapTypeName, isMapSuitableForLevel, getMapDangerStyle, getMapDangerText, getMapNPCs, getMapEvents } from '@/services/mapService';
import { playerLevel } from '@/signals/playerSignals';

export function CurrentMapInfo() {
  useSignals();

  const map = currentMap.value;
  const level = playerLevel.value;

  if (!map) {
    return (
      <div className="game-panel p-4 text-center text-[var(--game-text-muted)]">
        地图数据加载中...
      </div>
    );
  }

  const suitability = isMapSuitableForLevel(map, level);
  const npcs = getMapNPCs(map.id);
  const events = getMapEvents(map.id);

  return (
    <div className="game-panel p-4">
      {/* 地图标题 */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--game-gold)]/20 to-white/50 border border-[var(--game-gold)]/30 flex items-center justify-center text-3xl shadow-sm">
          {map.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--game-gold-dark)]">{map.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--game-primary)]/20 text-[var(--game-primary)]">
              {getMapTypeName(map.type)}
            </span>
            <span className={`text-xs ${getMapDangerStyle(suitability)}`}>
              {getMapDangerText(suitability)}
            </span>
          </div>
        </div>
      </div>

      {/* 地图描述 */}
      <p className="text-sm text-[var(--game-text-muted)] mb-3">{map.description}</p>

      {/* 地图信息 */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-white/50 rounded-lg p-2">
          <span className="text-[var(--game-text-muted)]">等级范围：</span>
          <span className="font-medium text-[var(--game-text)]">
            Lv.{map.levelRange.min} - Lv.{map.levelRange.max}
          </span>
        </div>
        <div className="bg-white/50 rounded-lg p-2">
          <span className="text-[var(--game-text-muted)]">区域：</span>
          <span className="font-medium text-[var(--game-text)]">
            {map.region === 'newbie' ? '新手村' : '东土大唐'}
          </span>
        </div>
      </div>

      {/* 遭遇配置 */}
      {map.encounterConfig && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-sm">
            <span>⚠️</span>
            <span className="text-red-600">野外区域，可能遭遇敌人</span>
          </div>
        </div>
      )}

      {/* NPC列表 */}
      {npcs.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-[var(--game-text)] mb-2 flex items-center gap-1">
            <span>👥</span> NPC
          </h4>
          <div className="flex flex-wrap gap-2">
            {npcs.map(npc => (
              <div
                key={npc.id}
                className="flex items-center gap-1 px-2 py-1 bg-white/70 rounded-lg text-sm"
              >
                <span>{npc.avatar}</span>
                <span className="text-[var(--game-text)]">{npc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 事件列表 */}
      {events.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-[var(--game-text)] mb-2 flex items-center gap-1">
            <span>✨</span> 特殊事件
          </h4>
          <div className="flex flex-wrap gap-2">
            {events.map(event => (
              <div
                key={event.id}
                className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg text-sm text-purple-600"
              >
                <span>{event.type === 'treasure' ? '💎' : event.type === 'battle' ? '⚔️' : '📜'}</span>
                <span>{event.type === 'treasure' ? '宝藏' : event.type === 'battle' ? '战斗' : '剧情'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
