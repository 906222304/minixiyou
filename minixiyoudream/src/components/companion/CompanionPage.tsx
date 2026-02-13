// 伙伴页面组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  companions,
  activeCompanions,
  setCompanionActive,
  unlockCompanion,
} from '@/signals/companionSignals';
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
        alert('最多只能有2个伙伴同时出战');
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
      <h2 className="text-lg font-medium">伙伴</h2>

      {/* 出战中的伙伴 */}
      {active.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">出战中 ({active.length}/2)</h3>
          <div className="grid grid-cols-2 gap-3">
            {active.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion)}
                className="card bg-primary-900/30 border-primary-500 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{companion.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{companion.name}</div>
                    <div className="text-xs text-gray-400">
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
          <h3 className="text-sm font-medium text-gray-400">已解锁</h3>
          <div className="grid grid-cols-2 gap-3">
            {allCompanions.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion)}
                className={`card text-left ${
                  companion.inParty ? 'border-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{companion.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{companion.name}</div>
                    <div className="text-xs text-gray-400">Lv.{companion.level}</div>
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
          <h3 className="text-sm font-medium text-gray-400">未解锁</h3>
          <div className="grid grid-cols-2 gap-3">
            {lockedTemplates.map((template: CompanionTemplate) => (
              <div
                key={template.id}
                className="card opacity-50 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl grayscale">{template.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-gray-400">???</div>
                    <div className="text-xs text-gray-500">
                      {template.unlockCondition.description}
                    </div>
                  </div>
                  <span className="text-gray-500">🔒</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 测试按钮 */}
      <button
        onClick={handleUnlockAll}
        className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm touch-btn"
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
