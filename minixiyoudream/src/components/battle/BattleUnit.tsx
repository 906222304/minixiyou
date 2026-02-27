// 战斗单位组件 - 增强版（含特效动画）

import { useState, useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { getAvatarUrl } from '@/constants/avatars';
import type { CombatUnit } from '@/types';

/** 单个伤害飘字 */
interface DamageNumberData {
  id: string;
  value: number;
  type: 'damage' | 'heal' | 'critical' | 'miss' | 'mp';
  /** 随机水平偏移（防止重叠） */
  offsetX?: number;
}

interface BattleUnitProps {
  unit: CombatUnit;
  isEnemy?: boolean;
  isPet?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  selectable?: boolean;
  /** 是否正在受击 */
  isHit?: boolean;
  /** 是否正在治疗 */
  isHealing?: boolean;
  /** 伤害飘字数据 */
  damageNumbers?: DamageNumberData[];
}

/** 伤害飘字组件 */
function DamageFloat({ data, onComplete }: { data: DamageNumberData; onComplete: (id: string) => void }) {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    // 初始弹出效果
    setTimeout(() => setScale(1), 10);

    // 上升动画
    const riseInterval = setInterval(() => {
      setOffset(prev => prev + 3);
    }, 16);

    // 淡出动画
    const fadeTimeout = setTimeout(() => {
      setOpacity(0);
    }, 500);

    // 完成回调
    const completeTimeout = setTimeout(() => {
      onComplete(data.id);
    }, 800);

    return () => {
      clearInterval(riseInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(completeTimeout);
    };
  }, [data.id, onComplete]);

  const getStyle = () => {
    const baseStyle = {
      transform: `translateX(-50%) translateY(-${offset}px) scale(${scale})`,
      opacity,
    };

    switch (data.type) {
      case 'critical':
        return {
          ...baseStyle,
          color: '#fbbf24',
          fontSize: '1.75rem',
          fontWeight: 'bold',
          textShadow: '0 0 10px #f59e0b, 0 2px 4px rgba(0,0,0,0.5)',
        };
      case 'heal':
        return {
          ...baseStyle,
          color: '#4ade80',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textShadow: '0 0 8px #22c55e',
        };
      case 'mp':
        return {
          ...baseStyle,
          color: '#60a5fa',
          fontSize: '1.25rem',
          textShadow: '0 0 6px #3b82f6',
        };
      case 'miss':
        return {
          ...baseStyle,
          color: '#9ca3af',
          fontSize: '1.25rem',
          fontStyle: 'italic',
        };
      default:
        return {
          ...baseStyle,
          color: '#f87171',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        };
    }
  };

  const getDisplayValue = () => {
    if (data.type === 'miss') return 'MISS';
    if (data.type === 'critical') return `${data.value}!`;
    if (data.type === 'heal') return `+${data.value}`;
    if (data.type === 'mp') return `+${data.value}`;
    return `-${data.value}`;
  };

  return (
    <div
      className="absolute pointer-events-none z-50 whitespace-nowrap"
      style={{
        left: `calc(50% + ${data.offsetX || 0}px)`,
        top: '30%',
        transition: 'opacity 0.3s ease-out',
        ...getStyle(),
      }}
    >
      {getDisplayValue()}
    </div>
  );
}

export function BattleUnit({
  unit,
  isEnemy,
  isPet,
  isActive,
  isSelected,
  onClick,
  selectable,
  isHit,
  isHealing,
  damageNumbers = [],
}: BattleUnitProps) {
  useSignals();
  const containerRef = useRef<HTMLDivElement>(null);
  const [localDamages, setLocalDamages] = useState<DamageNumberData[]>([]);
  const [showShake, setShowShake] = useState(false);
  const [showHealGlow, setShowHealGlow] = useState(false);

  const hpPercent = (unit.hp / unit.maxHp) * 100;
  const mpPercent = unit.maxMp > 0 ? (unit.mp / unit.maxMp) * 100 : 0;
  const isDead = unit.hp <= 0;

  // 处理受击动画
  useEffect(() => {
    if (isHit) {
      setShowShake(true);
      const timer = setTimeout(() => setShowShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isHit]);

  // 处理治疗动画
  useEffect(() => {
    if (isHealing) {
      setShowHealGlow(true);
      const timer = setTimeout(() => setShowHealGlow(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isHealing]);

  // 处理伤害飘字
  useEffect(() => {
    if (damageNumbers.length > 0) {
      setLocalDamages(prev => [...prev, ...damageNumbers]);
    }
  }, [damageNumbers]);

  // 移除已完成的飘字
  const removeDamage = (id: string) => {
    setLocalDamages(prev => prev.filter(d => d.id !== id));
  };

  // 计算动画类名
  const getAnimationClass = () => {
    if (showShake) return 'animate-[shake_0.4s_ease-in-out]';
    if (showHealGlow) return 'animate-[heal-glow_0.6s_ease-out]';
    return '';
  };

  return (
    <div
      ref={containerRef}
      className={`
        battle-unit relative flex flex-col items-center p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 bg-white/70 shadow-sm
        ${isDead ? 'opacity-50 grayscale' : ''}
        ${isActive ? 'ring-2 ring-[var(--game-gold)] shadow-lg' : ''}
        ${isSelected ? 'ring-3 ring-[#dc2626] bg-red-50/70 scale-110 shadow-xl shadow-red-500/30' : ''}
        ${selectable && !isDead && !isSelected ? 'cursor-pointer hover:bg-white/90 hover:shadow-md hover:scale-105 ring-2 ring-dashed ring-amber-400/50' : ''}
        ${getAnimationClass()}
      `}
      onClick={onClick}
    >
      {/* 可选择提示（敌方单位） */}
      {selectable && !isDead && !isSelected && isEnemy && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap animate-pulse">
          点击选择
        </div>
      )}

      {/* 选中目标指示器 */}
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-bold animate-bounce shadow-lg">
          目标
        </div>
      )}
      {/* 伤害飘字 */}
      {localDamages.length > 0 && (
        <div className="damage-float-container">
          {localDamages.map(damage => (
            <DamageFloat
              key={damage.id}
              data={damage}
              onComplete={removeDamage}
            />
          ))}
        </div>
      )}

      {/* 单位图标/头像 */}
      <div
        className={`
          battle-unit-icon text-xl sm:text-3xl mb-0.5 sm:mb-1 transition-transform
          ${isActive ? 'scale-110 animate-pulse' : ''}
          ${isDead ? 'grayscale' : ''}
          ${showShake ? 'brightness-125' : ''}
        `}
      >
        {isDead ? (
          '💀'
        ) : !isEnemy && unit.avatar?.startsWith('avatar_') ? (
          <img
            src={getAvatarUrl(unit.avatar, 'small')}
            alt={unit.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
          />
        ) : isPet ? (
          '🐾'
        ) : isEnemy ? (
          '👹'
        ) : (
          '🧑'
        )}
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

      {/* 回合指示器 */}
      {isActive && !isDead && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="text-[10px] sm:text-xs text-[var(--game-gold)] animate-bounce">◆</span>
        </div>
      )}
    </div>
  );
}
