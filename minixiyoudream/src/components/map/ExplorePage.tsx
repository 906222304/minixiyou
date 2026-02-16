// 西游页面组件 - 紧凑布局

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { AdjacentMaps } from './AdjacentMaps';
import { MapMonsters } from './MapMonsters';
import { AutoBattle } from './AutoBattle';
import { QuestTracker } from './QuestTracker';
import { NPCList } from './NPCList';
import { currentMap, getMapTypeName } from '@/services/mapService';
import { player, playerGold, playerLevel } from '@/signals';

/** 顶部信息栏 - 合并玩家状态和位置 */
function TopBar() {
  useSignals();

  const currentPlayer = player.value;
  const gold = playerGold.value;
  const level = playerLevel.value;
  const map = currentMap.value;

  if (!currentPlayer || !map) return null;

  return (
    <div className="game-panel p-2.5">
      {/* 第一行：玩家信息 + 金币 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--game-gold)]/15 flex items-center justify-center text-base">
            👤
          </div>
          <div>
            <span className="font-semibold text-sm text-[var(--game-text)]">{currentPlayer.name}</span>
            <span className="text-xs text-[var(--game-text-muted)] ml-1.5">Lv.{level}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span>💰</span>
          <span className="font-semibold text-[var(--game-gold-dark)]">{gold.toLocaleString()}</span>
        </div>
      </div>

      {/* 第二行：当前位置 */}
      <div className="flex items-center gap-2 p-2 bg-[var(--game-gold)]/5 rounded-lg">
        <div className="w-9 h-9 rounded-lg bg-[var(--game-gold)]/15 flex items-center justify-center text-xl">
          {map.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-[var(--game-gold-dark)]">{map.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
              {getMapTypeName(map.type)}
            </span>
          </div>
          <div className="text-[11px] text-[var(--game-text-muted)]">
            Lv.{map.levelRange.min}-{map.levelRange.max} · {map.description}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 行动模式切换 - 紧凑版 */
function ActionTabs({ active, onChange }: { active: 'move' | 'battle'; onChange: (t: 'move' | 'battle') => void }) {
  return (
    <div className="flex bg-slate-200 rounded-lg p-1">
      <button
        onClick={() => onChange('move')}
        className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 touch-manipulation ${
          active === 'move'
            ? 'bg-[var(--game-gold)] text-white shadow-sm'
            : 'text-[var(--game-text)] hover:bg-slate-300 active:bg-slate-400'
        }`}
      >
        <span>🚶</span>
        <span>移动</span>
      </button>
      <button
        onClick={() => onChange('battle')}
        className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 touch-manipulation ${
          active === 'battle'
            ? 'bg-[var(--game-gold)] text-white shadow-sm'
            : 'text-[var(--game-text)] hover:bg-slate-300 active:bg-slate-400'
        }`}
      >
        <span>⚔️</span>
        <span>战斗</span>
      </button>
    </div>
  );
}

export function ExplorePage() {
  useSignals();

  const [activeTab, setActiveTab] = useState<'move' | 'battle'>('move');

  const map = currentMap.value;
  const hasMonsters = map?.encounterConfig && map.encounterConfig.enemyGroups.length > 0;

  return (
    <div className="space-y-3">
      {/* 顶部信息栏 */}
      <TopBar />

      {/* NPC列表 */}
      <NPCList />

      {/* 任务追踪 */}
      <QuestTracker />

      {/* 行动模式切换 */}
      <ActionTabs active={activeTab} onChange={setActiveTab} />

      {/* 内容区 */}
      {activeTab === 'move' ? (
        <div className="space-y-3">
          <AdjacentMaps />
          {hasMonsters && <MapMonsters />}
        </div>
      ) : (
        <div className="space-y-3">
          {hasMonsters ? (
            <>
              <AutoBattle />
              <MapMonsters />
            </>
          ) : (
            <div className="game-panel p-6 text-center">
              <div className="text-3xl mb-2">🏯</div>
              <p className="text-sm text-[var(--game-text)]">安全区域</p>
              <p className="text-xs text-[var(--game-text-dim)] mt-1">切换到「移动」前往野外</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
