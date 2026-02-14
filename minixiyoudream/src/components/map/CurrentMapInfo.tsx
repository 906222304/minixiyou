// 当前地图信息展示组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  currentMap,
  getMapTypeName,
  isMapSuitableForLevel,
  getMapDangerStyle,
  getMapDangerText,
  getMapNPCs,
  getMapEvents,
} from '@/services/mapService';
import {
  getMapEncounterInfo,
  getEncounterRateDescription,
} from '@/services/encounterService';
import { playerLevel } from '@/signals/playerSignals';
import { NPCInteractionModal } from './NPCInteractionModal';
import type { NPC } from '@/types';

/** NPC类型的中文名称 */
const NPC_TYPE_NAMES: Record<string, string> = {
  merchant: '商人',
  quest: '任务',
  trainer: '训练师',
  story: '剧情',
  healer: '治疗师',
  teleporter: '传送员',
  blacksmith: '铁匠',
  alchemist: '炼金师',
  stable: '马厩',
  banker: '仓库',
};

/** NPC类型的颜色 */
const NPC_TYPE_COLORS: Record<string, string> = {
  merchant: 'bg-green-50 text-green-700 border-green-200',
  quest: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  trainer: 'bg-blue-50 text-blue-700 border-blue-200',
  story: 'bg-purple-50 text-purple-700 border-purple-200',
  healer: 'bg-red-50 text-red-700 border-red-200',
  teleporter: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  blacksmith: 'bg-orange-50 text-orange-700 border-orange-200',
  alchemist: 'bg-pink-50 text-pink-700 border-pink-200',
  stable: 'bg-amber-50 text-amber-700 border-amber-200',
  banker: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function CurrentMapInfo() {
  useSignals();

  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);

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
  const encounterInfo = getMapEncounterInfo(map.id);
  const encounterRateDesc = getEncounterRateDescription(map.id);

  const handleNPCClick = (npc: NPC) => {
    setSelectedNPC(npc);
  };

  const handleCloseNPCModal = () => {
    setSelectedNPC(null);
  };

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
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              <span className="text-sm font-medium text-red-700">野外危险区域</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">
              {encounterRateDesc}
            </span>
          </div>
          {/* 可能遇到的怪物 */}
          {encounterInfo.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-red-600 mb-1">可能遭遇：</p>
              <div className="flex flex-wrap gap-1">
                {encounterInfo.map((info) => (
                  <div
                    key={info.enemyGroupId}
                    className="text-xs px-2 py-1 rounded bg-white/80 border border-red-100"
                    title={`平均等级: Lv.${info.avgLevel}`}
                  >
                    <span className="font-medium">{info.enemyGroupName}</span>
                    <span className="text-red-400 ml-1">x{info.enemyCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NPC列表 */}
      {npcs.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-[var(--game-text)] mb-2 flex items-center gap-1">
            <span>👥</span> NPC
          </h4>
          <div className="space-y-2">
            {npcs.map((npc) => (
              <div
                key={npc.id}
                onClick={() => handleNPCClick(npc)}
                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  NPC_TYPE_COLORS[npc.type] || 'bg-white/70 border-gray-200'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-xl shadow-sm">
                  {npc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{npc.name}</span>
                    <span className="text-xs opacity-60">
                      [{NPC_TYPE_NAMES[npc.type] || npc.type}]
                    </span>
                  </div>
                  {npc.dialogues.greeting && (
                    <p className="text-xs opacity-70 truncate mt-0.5">
                      "{npc.dialogues.greeting}"
                    </p>
                  )}
                </div>
                <div className="text-lg opacity-50">›</div>
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
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg text-sm text-purple-600"
              >
                <span>
                  {event.type === 'treasure' ? '💎' : event.type === 'battle' ? '⚔️' : '📜'}
                </span>
                <span>
                  {event.type === 'treasure' ? '宝藏' : event.type === 'battle' ? '战斗' : '剧情'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NPC交互弹窗 */}
      {selectedNPC && (
        <NPCInteractionModal npc={selectedNPC} onClose={handleCloseNPCModal} />
      )}
    </div>
  );
}
