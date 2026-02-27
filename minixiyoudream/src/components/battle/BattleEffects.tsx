// 战斗特效组件 - 提供丰富的战斗视觉反馈

import { useEffect, useState, useCallback } from 'react';

/** 伤害飘字特效 */
export interface DamageNumber {
  id: string;
  value: number;
  type: 'damage' | 'heal' | 'critical' | 'mp' | 'miss';
  x: number;
  y: number;
  timestamp: number;
}

interface DamageFloatProps {
  damage: DamageNumber;
  onComplete: (id: string) => void;
}

function DamageFloat({ damage, onComplete }: DamageFloatProps) {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 上升动画
    const riseInterval = setInterval(() => {
      setOffset(prev => prev + 2);
    }, 16);

    // 淡出动画
    const fadeTimeout = setTimeout(() => {
      setOpacity(0);
    }, 600);

    // 完成回调
    const completeTimeout = setTimeout(() => {
      onComplete(damage.id);
    }, 1000);

    return () => {
      clearInterval(riseInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(completeTimeout);
    };
  }, [damage.id, onComplete]);

  const getStyle = () => {
    const baseStyle = {
      transform: `translateY(-${offset}px)`,
      opacity,
    };

    switch (damage.type) {
      case 'critical':
        return {
          ...baseStyle,
          color: '#fbbf24',
          fontSize: '2rem',
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
    if (damage.type === 'miss') return 'MISS';
    if (damage.type === 'critical') return `${damage.value}!`;
    if (damage.type === 'heal') return `+${damage.value}`;
    if (damage.type === 'mp') return `+${damage.value}MP`;
    return `-${damage.value}`;
  };

  return (
    <div
      className="absolute pointer-events-none z-50 animate-bounce"
      style={{
        left: damage.x,
        top: damage.y,
        ...getStyle(),
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {getDisplayValue()}
    </div>
  );
}

/** 伤害飘字容器 */
interface DamageFloatContainerProps {
  damages: DamageNumber[];
  onRemove: (id: string) => void;
}

export function DamageFloatContainer({ damages, onRemove }: DamageFloatContainerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {damages.map(damage => (
        <DamageFloat
          key={damage.id}
          damage={damage}
          onComplete={onRemove}
        />
      ))}
    </div>
  );
}

/** 受击震动效果 */
interface ShakeEffectProps {
  isActive: boolean;
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function ShakeEffect({ isActive, children, intensity = 'medium' }: ShakeEffectProps) {
  const getShakeClass = () => {
    if (!isActive) return '';
    switch (intensity) {
      case 'light':
        return 'animate-[shake-light_0.3s_ease-in-out]';
      case 'heavy':
        return 'animate-[shake-heavy_0.5s_ease-in-out]';
      default:
        return 'animate-[shake_0.4s_ease-in-out]';
    }
  };

  return (
    <div className={getShakeClass()}>
      {children}
    </div>
  );
}

/** 攻击闪光效果 */
interface AttackFlashProps {
  isActive: boolean;
  color?: string;
}

export function AttackFlash({ isActive, color = '#fbbf24' }: AttackFlashProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        animation: 'flash 0.15s ease-out',
      }}
    />
  );
}

/** 技能释放特效 */
interface SkillCastEffectProps {
  isActive: boolean;
  skillType?: 'physical' | 'magic' | 'heal';
  onComplete?: () => void;
}

export function SkillCastEffect({ isActive, skillType = 'physical', onComplete }: SkillCastEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // 生成粒子
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 50,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) return null;

  const getParticleColor = () => {
    switch (skillType) {
      case 'magic':
        return 'bg-purple-400';
      case 'heal':
        return 'bg-green-400';
      default:
        return 'bg-amber-400';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-3 h-3 rounded-full ${getParticleColor()} animate-ping`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '0.6s',
          }}
        />
      ))}
      {/* 中心光效 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full animate-pulse"
        style={{
          background: skillType === 'magic'
            ? 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)'
            : skillType === 'heal'
            ? 'radial-gradient(circle, rgba(74,222,128,0.6) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

/** 暴击特效 */
interface CriticalHitEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function CriticalHitEffect({ isActive, onComplete }: CriticalHitEffectProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      setPhase(1);
      const t1 = setTimeout(() => setPhase(2), 100);
      const t2 = setTimeout(() => setPhase(3), 200);
      const t3 = setTimeout(() => {
        setPhase(0);
        onComplete?.();
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isActive, onComplete]);

  if (!isActive || phase === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {/* 冲击波 */}
      <div
        className="absolute w-32 h-32 rounded-full border-4 border-amber-400"
        style={{
          animation: 'expand-ring 0.4s ease-out forwards',
          opacity: phase >= 2 ? 0 : 1,
        }}
      />
      <div
        className="absolute w-24 h-24 rounded-full border-4 border-amber-300"
        style={{
          animation: 'expand-ring 0.3s ease-out forwards',
          animationDelay: '50ms',
          opacity: phase >= 2 ? 0 : 1,
        }}
      />
      {/* 暴击文字 */}
      {phase >= 2 && (
        <div
          className="text-3xl font-bold text-amber-400 animate-bounce"
          style={{
            textShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b, 0 4px 8px rgba(0,0,0,0.5)',
            animation: 'pop-in 0.3s ease-out',
          }}
        >
          暴击!
        </div>
      )}
    </div>
  );
}

/** 胜利/失败特效 */
interface BattleResultEffectProps {
  result: 'victory' | 'defeat' | null;
  onComplete?: () => void;
}

export function BattleResultEffect({ result, onComplete }: BattleResultEffectProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [result, onComplete]);

  if (!visible || !result) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div
        className={`text-5xl sm:text-7xl font-bold animate-bounce ${
          result === 'victory' ? 'text-amber-400' : 'text-red-500'
        }`}
        style={{
          textShadow: result === 'victory'
            ? '0 0 30px #f59e0b, 0 0 60px #f59e0b, 0 8px 16px rgba(0,0,0,0.5)'
            : '0 0 30px #ef4444, 0 0 60px #ef4444, 0 8px 16px rgba(0,0,0,0.5)',
          animation: 'pop-in 0.5s ease-out, bounce 1s ease-in-out infinite',
        }}
      >
        {result === 'victory' ? '胜利!' : '失败...'}
      </div>
      {/* 背景闪光 */}
      <div
        className={`absolute inset-0 ${
          result === 'victory' ? 'bg-amber-400/20' : 'bg-red-500/20'
        }`}
        style={{
          animation: 'flash-bg 0.5s ease-out',
        }}
      />
    </div>
  );
}

/** Hook: 管理战斗特效 */
export function useBattleEffects() {
  const [damages, setDamages] = useState<DamageNumber[]>([]);
  const [shakeTarget, setShakeTarget] = useState<string | null>(null);
  const [criticalTarget, setCriticalTarget] = useState<string | null>(null);

  // 显示伤害飘字
  const showDamage = useCallback((targetId: string, value: number, type: DamageNumber['type'], elementRef?: HTMLElement) => {
    const rect = elementRef?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : 0;
    const y = rect ? rect.top + rect.height / 3 : 0;

    const newDamage: DamageNumber = {
      id: `${targetId}-${Date.now()}`,
      value,
      type,
      x,
      y,
      timestamp: Date.now(),
    };

    setDamages(prev => [...prev, newDamage]);

    // 如果是暴击，显示暴击特效
    if (type === 'critical') {
      setCriticalTarget(targetId);
      setTimeout(() => setCriticalTarget(null), 500);
    }
  }, []);

  // 显示受击震动
  const showShake = useCallback((targetId: string) => {
    setShakeTarget(targetId);
    setTimeout(() => setShakeTarget(null), 400);
  }, []);

  // 移除伤害飘字
  const removeDamage = useCallback((id: string) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  }, []);

  return {
    damages,
    shakeTarget,
    criticalTarget,
    showDamage,
    showShake,
    removeDamage,
  };
}
