// NPC列表组件 - 紧凑版

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { currentMap, getMapNPCs } from '@/services/mapService';
import { NPCInteractionModal } from './NPCInteractionModal';
import type { NPC } from '@/types';

/** NPC类型图标 */
const NPC_TYPE_ICONS: Record<string, string> = {
  merchant: '🛒',
  quest: '❗',
  trainer: '📚',
  story: '💬',
  healer: '💚',
  teleporter: '🌀',
  blacksmith: '🔨',
  alchemist: '⚗️',
  stable: '🐴',
  banker: '📦',
};

export function NPCList() {
  useSignals();

  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const map = currentMap.value;

  if (!map) return null;

  const npcs = getMapNPCs(map.id);

  if (npcs.length === 0) return null;

  return (
    <>
      <div className="game-panel p-2">
        <div className="flex flex-wrap gap-1.5">
          {npcs.map((npc) => (
            <button
              key={npc.id}
              onClick={() => setSelectedNPC(npc)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors text-xs touch-manipulation"
              title={npc.name}
            >
              <span>{npc.avatar}</span>
              <span className="text-[var(--game-text)] font-medium">{npc.name}</span>
              <span className="text-[var(--game-text-muted)]">
                {NPC_TYPE_ICONS[npc.type] || '👤'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* NPC交互弹窗 */}
      {selectedNPC && (
        <NPCInteractionModal npc={selectedNPC} onClose={() => setSelectedNPC(null)} />
      )}
    </>
  );
}

export default NPCList;
