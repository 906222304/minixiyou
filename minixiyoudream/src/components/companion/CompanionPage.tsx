// 伙伴页面组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  companions,
  activeCompanions,
  setCompanionActive,
  unlockCompanion,
} from '@/signals/companionSignals';
import { returnToExplore, showError } from '@/signals';
import { getAllCompanionTemplates } from '@/constants/companions';
import type { Companion, CompanionTemplate } from '@/types';
import { CompanionDetail } from './CompanionDetail';

export function CompanionPage() {
  useSignals();

  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);

  const allCompanions = companions.value;
  const active = activeCompanions.value;

  const handleToggleActive = (companionId: string) => {
    const companion = allCompanions.find((c) => c.id === companionId);
    if (!companion) return;

    if (companion.inParty) {
      setCompanionActive(companionId, false);
    } else {
      if (active.length >= 2) {
        showError('最多只能有2个伙伴同时出战');
        return;
      }
      setCompanionActive(companionId, true);
    }
  };

  // 解锁所有伙伴（测试）
  const handleUnlockAll = () => {
    const templates = getAllCompanionTemplates();
    templates.forEach((t: CompanionTemplate) => unlockCompanion(t.id));
  };

  // 未解锁的伙伴模板
  const lockedTemplates = getAllCompanionTemplates().filter(
    (t: CompanionTemplate) => !allCompanions.some((c) => c.baseId === t.id)
  );

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <button
        onClick={returnToExplore}
        className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--game-text-muted)] hover:text-[var(--game-text)] active:bg-white/10 rounded-lg transition-colors touch-manipulation"
      >
        <span className="text-lg">←</span>
        <span>返回西游</span>
      </button>

      <h2 className="text-lg font-medium">伙伴</h2>

      {/* 出战中的伙伴 */}
      {active.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--game-text-muted)]">出战中 ({active.length}/2)</h3>
          <div className="grid grid-cols-2 gap-3">
            {active.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion)}
                className="game-card bg-amber-50 border-amber-300 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{companion.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--game-text)] truncate">{companion.name}</div>
                    <div className="text-xs text-[var(--game-text-muted)]">
                      Lv.{companion.level} · 好感度 {companion.favorability}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 已解锁的伙伴 */}
      {allCompanions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--game-text-muted)]">已解锁</h3>
          <div className="grid grid-cols-2 gap-3">
            {allCompanions.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion)}
                className={`game-card text-left ${
                  companion.inParty ? 'border-amber-400' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{companion.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--game-text)] truncate">{companion.name}</div>
                    <div className="text-xs text-[var(--game-text-muted)]">Lv.{companion.level}</div>
                  </div>
                  {companion.inParty && <span className="text-xs">⚔️</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 未解锁的伙伴 */}
      {lockedTemplates.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--game-text-muted)]">未解锁</h3>
          <div className="grid grid-cols-2 gap-3">
            {lockedTemplates.map((template: CompanionTemplate) => (
              <div
                key={template.id}
                className="game-card opacity-60 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl grayscale">{template.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-[var(--game-text-muted)]">???</div>
                    <div className="text-xs text-[var(--game-text-dim)]">
                      {template.unlockCondition.description}
                    </div>
                  </div>
                  <span className="text-[var(--game-text-dim)]">🔒</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 测试按钮 */}
      <button
        onClick={handleUnlockAll}
        className="w-full py-3 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 rounded-lg text-sm touch-btn text-[var(--game-text)] font-medium transition-colors"
      >
        🔓 解锁所有伙伴（测试）
      </button>

      {/* 伙伴详情弹窗 */}
      {selectedCompanion && (
        <CompanionDetail
          companion={selectedCompanion}
          onClose={() => setSelectedCompanion(null)}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
}
