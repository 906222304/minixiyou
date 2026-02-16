// 战斗单位组件

import { useSignals } from '@preact/signals-react/runtime';
import type { CombatUnit } from '@/types';

interface BattleUnitProps {
  unit: CombatUnit;
  isEnemy?: boolean;
  isPet?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  selectable?: boolean;
}

export function BattleUnit({ unit, isEnemy, isPet, isActive, isSelected, onClick, selectable }: BattleUnitProps) {
  useSignals();

  const hpPercent = (unit.hp / unit.maxHp) * 100;
  const mpPercent = unit.maxMp > 0 ? (unit.mp / unit.maxMp) * 100 : 0;
  const isDead = unit.hp <= 0;

  return (
    <div
      className={`
        battle-unit relative flex flex-col items-center p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all bg-white/70 shadow-sm
        ${isDead ? 'opacity-50 grayscale' : ''}
        ${isActive ? 'ring-2 ring-[var(--game-gold)] shadow-lg animate-pulse' : ''}
        ${isSelected ? 'ring-2 ring-[#dc2626] bg-red-50/70' : ''}
        ${selectable && !isDead ? 'cursor-pointer hover:bg-white/90 hover:shadow-md hover:scale-105' : ''}
      `}
      onClick={onClick}
    >
      {/* 单位图标 */}
      <div className={`
        battle-unit-icon text-xl sm:text-3xl mb-0.5 sm:mb-1 transition-transform
        ${isActive ? 'scale-110' : ''}
        ${isDead ? 'grayscale' : ''}
      `}>
        {isDead ? '💀' : isPet ? '🐾' : isEnemy ? '👹' : '🧑'}
      </div>

      {/* HP条 */}
      <div className="battle-unit-hp w-12 sm:w-16 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            hpPercent > 50 ? 'bg-[#4ade80]' : hpPercent > 25 ? 'bg-[#fbbf24]' : 'bg-[#f87171]'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
        {/* HP数值显示在条内 */}
        <span className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-medium text-gray-700">
          {unit.hp}
        </span>
      </div>

      {/* MP条（仅非宠物显示） */}
      {!isPet && unit.maxMp > 0 && (
        <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full bg-[#60a5fa] transition-all duration-300 rounded-full"
            style={{ width: `${mpPercent}%` }}
          />
        </div>
      )}

      {/* 名称 */}
      <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-center truncate w-12 sm:w-16 font-medium text-[var(--game-text)]">
        {unit.name}
      </div>

      {/* 状态效果指示 */}
      {unit.statusEffects.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {unit.statusEffects.slice(0, 3).map((effect) => (
            <span key={effect.id} className="text-[10px] sm:text-xs" title={effect.name}>
              {effect.icon}
            </span>
          ))}
        </div>
      )}

      {/* 防御状态指示 */}
      {unit.isDefending && (
        <div className="absolute -top-1 -right-1 text-[10px] sm:text-xs">🛡️</div>
      )}

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <span className="text-[10px] sm:text-xs text-[#dc2626]">▼</span>
        </div>
      )}
    </div>
  );
}
