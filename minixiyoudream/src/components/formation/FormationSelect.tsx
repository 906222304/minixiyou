// 阵法选择组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  playerFormations,
  activeFormationId,
  setActiveFormation,
  getAllFormationStatus,
  isFormationUnlocked,
} from '@/signals/formationSignals';
import {
  FORMATIONS,
  getFormationTypeName,
  getFormationTypeColor,
} from '@/constants/formations';

interface FormationSelectProps {
  onSelect?: (formationId: string) => void;
  showLocked?: boolean;
}

export function FormationSelect({ onSelect, showLocked = true }: FormationSelectProps) {
  useSignals();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formations = getAllFormationStatus();
  const currentActiveId = activeFormationId.value;

  const handleSelect = (formationId: string) => {
    setSelectedId(formationId);
    onSelect?.(formationId);
  };

  const handleActivate = (formationId: string) => {
    if (isFormationUnlocked(formationId)) {
      setActiveFormation(formationId);
    }
  };

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">📐</span>
        <h2 className="text-xl font-bold text-[var(--game-gold)]">阵法</h2>
      </div>

      {/* 阵法列表 */}
      <div className="grid grid-cols-2 gap-3">
        {formations.map((status) => {
          const formation = FORMATIONS.find(f => f.id === status.formationId);
          if (!formation) return null;
          if (!showLocked && !status.unlocked) return null;

          const typeColor = getFormationTypeColor(formation.type);
          const isActive = currentActiveId === status.formationId;
          const isSelected = selectedId === status.formationId;

          return (
            <div
              key={status.formationId}
              onClick={() => handleSelect(status.formationId)}
              className={`
                game-card p-4 cursor-pointer transition-all duration-200
                ${isActive ? 'ring-2 ring-[var(--game-gold)]' : ''}
                ${!status.unlocked ? 'opacity-50' : ''}
                ${isSelected ? 'ring-2 ring-blue-400' : ''}
              `}
              style={{
                borderColor: status.unlocked ? typeColor : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <div
                  className="game-icon game-icon-md text-2xl"
                  style={{
                    background: status.unlocked
                      ? `linear-gradient(135deg, ${typeColor}30 0%, ${typeColor}10 100%)`
                      : undefined,
                  }}
                >
                  {status.unlocked ? formation.icon : '🔒'}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold"
                      style={{ color: status.unlocked ? typeColor : 'var(--game-text-dim)' }}
                    >
                      {formation.name}
                    </span>
                    {isActive && (
                      <span className="game-tag game-tag-gold text-xs">
                        使用中
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[var(--game-text-muted)] mt-1">
                    {getFormationTypeName(formation.type)}
                  </div>

                  {status.unlocked && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--game-text-dim)]">Lv.{status.level}</span>
                      <span className="text-xs text-[var(--game-text-muted)]">
                        / {formation.maxLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 选中阵法详情 */}
      {selectedId && (
        <FormationDetail
          formationId={selectedId}
          onActivate={handleActivate}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

/** 阵法详情组件 */
interface FormationDetailProps {
  formationId: string;
  onActivate?: (formationId: string) => void;
  onClose?: () => void;
}

function FormationDetail({ formationId, onActivate, onClose }: FormationDetailProps) {
  useSignals();

  const formation = FORMATIONS.find(f => f.id === formationId);
  const playerFormation = playerFormations.value.find(f => f.formationId === formationId);
  const currentActiveId = activeFormationId.value;

  if (!formation) return null;

  const typeColor = getFormationTypeColor(formation.type);
  const isUnlocked = playerFormation?.unlocked ?? false;
  const isActive = currentActiveId === formationId;
  const level = playerFormation?.level ?? 0;

  return (
    <div className="game-panel p-4 space-y-4">
      {/* 头部 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="game-icon game-icon-lg text-3xl"
            style={{
              background: `linear-gradient(135deg, ${typeColor}30 0%, ${typeColor}10 100%)`,
            }}
          >
            {isUnlocked ? formation.icon : '🔒'}
          </div>
          <div>
            <h3
              className="font-bold text-lg"
              style={{ color: isUnlocked ? typeColor : 'var(--game-text-dim)' }}
            >
              {formation.name}
            </h3>
            <div className="text-sm text-[var(--game-text-muted)]">
              {getFormationTypeName(formation.type)}
              {isUnlocked && ` · Lv.${level}`}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--game-text-muted)] hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      {/* 描述 */}
      <p className="text-sm text-[var(--game-text)]">
        {formation.description}
      </p>

      {/* 阵法效果 */}
      {isUnlocked && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">阵法效果</h4>
          <div className="grid grid-cols-3 gap-2">
            {formation.positions.slice(0, 3).map((pos) => (
              <div
                key={pos.slot}
                className="bg-black/20 rounded p-2 text-xs"
              >
                <div className="text-[var(--game-text-dim)] mb-1">
                  {pos.row === 'front' ? '前排' : '后排'} {pos.slot + 1}
                </div>
                {pos.effects.map((effect, idx) => (
                  <div key={idx} className="text-[var(--game-text)]">
                    {effect.description}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {formation.positions.slice(3, 6).map((pos) => (
              <div
                key={pos.slot}
                className="bg-black/20 rounded p-2 text-xs"
              >
                <div className="text-[var(--game-text-dim)] mb-1">
                  {pos.row === 'front' ? '前排' : '后排'} {pos.slot + 1}
                </div>
                {pos.effects.map((effect, idx) => (
                  <div key={idx} className="text-[var(--game-text)]">
                    {effect.description}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 克制关系 */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">克制关系</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-green-400">克制：</span>
            {formation.counters.length > 0 ? (
              formation.counters.map(id => {
                const f = FORMATIONS.find(x => x.id === id);
                return f ? (
                  <span key={id} className="ml-1">{f.name}</span>
                ) : null;
              })
            ) : (
              <span className="text-[var(--game-text-dim)]">无</span>
            )}
          </div>
          <div>
            <span className="text-red-400">被克：</span>
            {formation.counteredBy.length > 0 ? (
              formation.counteredBy.map(id => {
                const f = FORMATIONS.find(x => x.id === id);
                return f ? (
                  <span key={id} className="ml-1">{f.name}</span>
                ) : null;
              })
            ) : (
              <span className="text-[var(--game-text-dim)]">无</span>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      {isUnlocked && !isActive && (
        <button
          onClick={() => onActivate?.(formationId)}
          className="game-btn w-full"
        >
          使用此阵法
        </button>
      )}

      {!isUnlocked && (
        <div className="text-center text-sm text-[var(--game-text-muted)]">
          该阵法尚未解锁
        </div>
      )}
    </div>
  );
}

export default FormationSelect;
