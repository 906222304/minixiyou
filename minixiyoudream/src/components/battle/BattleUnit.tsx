// 战斗单位组件

import { useSignals } from '@preact/signals-react/runtime';
import type { CombatUnit } from '@/types';

interface BattleUnitProps {
  unit: CombatUnit;
  isEnemy?: boolean;
  isPet?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  selectable?: boolean;
}

export function BattleUnit({ unit, isEnemy, isPet, isActive, onClick, selectable }: BattleUnitProps) {
  useSignals();

  const hpPercent = (unit.hp / unit.maxHp) * 100;
  const mpPercent = unit.maxMp > 0 ? (unit.mp / unit.maxMp) * 100 : 0;
  const isDead = unit.hp <= 0;

  return (
    <div
      className={`
        relative flex flex-col items-center p-2 rounded-lg transition-all
        ${isDead ? 'opacity-50 grayscale' : ''}
        ${isActive ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
        ${selectable ? 'cursor-pointer hover:bg-white/10' : ''}
        ${isEnemy ? 'flex-col' : 'flex-col'}
      `}
      onClick={onClick}
    >
      {/* 单位图标 */}
      <div className={`
        text-3xl mb-1 transition-transform
        ${isActive ? 'scale-110' : ''}
        ${isDead ? 'grayscale' : ''}
      `}>
        {isDead ? '💀' : isPet ? '🐾' : isEnemy ? '👤' : '🧑'}
      </div>

      {/* HP条 */}
      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {/* MP条（仅非宠物显示） */}
      {!isPet && unit.maxMp > 0 && (
        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${mpPercent}%` }}
          />
        </div>
      )}

      {/* 名称 */}
      <div className="text-xs mt-1 text-center truncate w-16">
        {unit.name}
      </div>

      {/* HP数值 */}
      <div className="text-xs text-gray-400">
        {unit.hp}/{unit.maxHp}
      </div>

      {/* 状态效果指示 */}
      {unit.statusEffects.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {unit.statusEffects.slice(0, 3).map((effect) => (
            <span key={effect.id} className="text-xs" title={effect.name}>
              {effect.icon}
            </span>
          ))}
        </div>
      )}

      {/* 防御状态指示 */}
      {unit.isDefending && (
        <div className="absolute -top-1 -right-1 text-xs">🛡️</div>
      )}
    </div>
  );
}
