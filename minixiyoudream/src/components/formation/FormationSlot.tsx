// 阵法槽位组件 - 显示每个槽位的效果

import { useSignals } from '@preact/signals-react/runtime';
import { activeFormationId, activeFormationLevel, getActiveFormationEffects } from '@/signals/formationSignals';
import { getFormation, getFormationTypeColor } from '@/constants/formations';
import type { FormationEffect } from '@/types/formation';

interface FormationSlotProps {
  /** 槽位编号 (0-5) */
  slot: number;
  /** 该槽位是否有人物/宠物 */
  occupied?: boolean;
  /** 槽位上的单位名称 */
  unitName?: string;
  /** 是否高亮显示 */
  highlight?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

export function FormationSlot({
  slot,
  occupied = false,
  unitName,
  highlight = false,
  onClick,
}: FormationSlotProps) {
  useSignals();

  const formationId = activeFormationId.value;
  const level = activeFormationLevel.value;
  const formation = getFormation(formationId);
  const effects = getActiveFormationEffects(slot);

  if (!formation) {
    return (
      <div className="w-24 h-28 border border-dashed border-[var(--game-border)] rounded-lg flex items-center justify-center text-[var(--game-text-dim)] bg-white/30">
        空
      </div>
    );
  }

  const position = formation.positions.find(p => p.slot === slot);
  const row = position?.row ?? (slot < 3 ? 'front' : 'back');
  const typeColor = getFormationTypeColor(formation.type);

  return (
    <div
      onClick={onClick}
      className={`
        relative w-28 rounded-lg transition-all duration-200 cursor-pointer
        ${highlight ? 'ring-2 ring-[var(--game-gold)] scale-105' : ''}
        ${occupied ? 'bg-[var(--game-bg-panel)]/80' : 'bg-white/30'}
        ${row === 'front' ? 'h-32' : 'h-28'}
        border-2
      `}
      style={{
        borderColor: occupied ? typeColor : 'var(--game-border)',
        boxShadow: occupied ? `0 0 10px ${typeColor}30` : undefined,
      }}
    >
      {/* 槽位编号 */}
      <div
        className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: typeColor,
          color: 'white',
        }}
      >
        {slot + 1}
      </div>

      {/* 行标识 */}
      <div className="absolute top-1 right-2 text-xs text-[var(--game-text-dim)]">
        {row === 'front' ? '前' : '后'}
      </div>

      {/* 单位名称 */}
      {occupied && unitName && (
        <div className="px-2 pt-4 pb-1 text-center">
          <span
            className="font-semibold text-sm truncate block"
            style={{ color: typeColor }}
          >
            {unitName}
          </span>
        </div>
      )}

      {/* 空槽位提示 */}
      {!occupied && (
        <div className="flex items-center justify-center h-full">
          <span className="text-[var(--game-text-dim)] text-2xl">+</span>
        </div>
      )}

      {/* 阵法效果 */}
      {occupied && effects.length > 0 && (
        <div className="px-2 pb-2 space-y-0.5">
          {effects.map((effect, idx) => (
            <EffectBadge key={idx} effect={effect} />
          ))}
        </div>
      )}

      {/* 等级加成提示 */}
      {occupied && level > 1 && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
          style={{
            background: typeColor,
            color: 'white',
          }}
        >
          Lv.{level}
        </div>
      )}
    </div>
  );
}

/** 效果徽章组件 */
function EffectBadge({ effect }: { effect: FormationEffect }) {
  const getEffectIcon = () => {
    switch (effect.type) {
      case 'stat_bonus':
        return '📊';
      case 'damage_bonus':
        return '⚔️';
      case 'damage_reduction':
        return '🛡️';
      case 'heal_bonus':
        return '💚';
      case 'counter_rate':
        return '🔄';
      default:
        return '✨';
    }
  };

  const getEffectColor = () => {
    switch (effect.type) {
      case 'stat_bonus':
        return 'text-blue-300';
      case 'damage_bonus':
        return 'text-red-300';
      case 'damage_reduction':
        return 'text-cyan-300';
      case 'heal_bonus':
        return 'text-green-300';
      default:
        return 'text-yellow-300';
    }
  };

  return (
    <div className={`flex items-center gap-1 text-xs ${getEffectColor()}`}>
      <span>{getEffectIcon()}</span>
      <span>+{effect.value}%</span>
    </div>
  );
}

/** 阵法布局预览组件 */
interface FormationLayoutProps {
  /** 各槽位的单位名称 */
  units?: (string | null)[];
  /** 高亮的槽位 */
  highlightSlot?: number;
  /** 点击槽位回调 */
  onSlotClick?: (slot: number) => void;
}

export function FormationLayout({
  units = [null, null, null, null, null, null],
  highlightSlot,
  onSlotClick,
}: FormationLayoutProps) {
  useSignals();

  const formationId = activeFormationId.value;
  const formation = getFormation(formationId);

  if (!formation) {
    return (
      <div className="text-center text-[var(--game-text-muted)]">
        未选择阵法
      </div>
    );
  }

  const typeColor = getFormationTypeColor(formation.type);

  return (
    <div className="space-y-3">
      {/* 阵法名称 */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl">{formation.icon}</span>
        <span className="font-bold" style={{ color: typeColor }}>
          {formation.name}
        </span>
      </div>

      {/* 后排 */}
      <div className="flex justify-center gap-3">
        {[3, 4, 5].map((slot) => (
          <FormationSlot
            key={slot}
            slot={slot}
            occupied={units[slot] !== null && units[slot] !== undefined}
            unitName={units[slot] ?? undefined}
            highlight={highlightSlot === slot}
            onClick={() => onSlotClick?.(slot)}
          />
        ))}
      </div>

      {/* 前排 */}
      <div className="flex justify-center gap-3">
        {[0, 1, 2].map((slot) => (
          <FormationSlot
            key={slot}
            slot={slot}
            occupied={units[slot] !== null && units[slot] !== undefined}
            unitName={units[slot] ?? undefined}
            highlight={highlightSlot === slot}
            onClick={() => onSlotClick?.(slot)}
          />
        ))}
      </div>
    </div>
  );
}

export default FormationSlot;
