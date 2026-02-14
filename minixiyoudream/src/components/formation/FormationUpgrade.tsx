// 阵法升级组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  addFormationExp,
  getPlayerFormation,
} from '@/signals/formationSignals';
import {
  getFormation,
  getFormationExpRequired,
  getFormationTypeColor,
  getFormationTypeName,
} from '@/constants/formations';
import { formationService } from '@/services/formationService';
import { showToast } from '@/signals/uiSignals';

interface FormationUpgradeProps {
  /** 阵法ID */
  formationId: string;
  /** 关闭回调 */
  onClose?: () => void;
}

export function FormationUpgrade({ formationId, onClose }: FormationUpgradeProps) {
  useSignals();

  const [upgrading, setUpgrading] = useState(false);
  const formation = getFormation(formationId);
  const playerFormation = getPlayerFormation(formationId);

  if (!formation) {
    return (
      <div className="game-panel p-4 text-center text-[var(--game-text-muted)]">
        阵法不存在
      </div>
    );
  }

  if (!playerFormation || !playerFormation.unlocked) {
    return (
      <div className="game-panel p-4 text-center text-[var(--game-text-muted)]">
        该阵法尚未解锁
      </div>
    );
  }

  const typeColor = getFormationTypeColor(formation.type);
  const progress = formationService.getFormationProgress(playerFormation);
  const isMaxLevel = playerFormation.level >= formation.maxLevel;

  const handleUpgrade = (expGain: number) => {
    setUpgrading(true);

    setTimeout(() => {
      const result = addFormationExp(formationId, expGain);

      if (result.success) {
        if (result.levelUp) {
          showToast(`${formation.name} 升级到 Lv.${result.newLevel}！`, 'success');
        } else {
          showToast(`获得 ${expGain} 点阵法经验`, 'success');
        }
      }

      setUpgrading(false);
    }, 300);
  };

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
            {formation.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: typeColor }}>
              {formation.name}
            </h3>
            <div className="text-sm text-[var(--game-text-muted)]">
              {getFormationTypeName(formation.type)} · Lv.{playerFormation.level}
              {isMaxLevel && <span className="text-[var(--game-gold)] ml-1">(满级)</span>}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--game-text-muted)] hover:text-white text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* 升级进度 */}
      {!isMaxLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--game-text-muted)]">升级进度</span>
            <span className="text-[var(--game-text)]">
              {progress.current} / {progress.required}
            </span>
          </div>
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress.percent}%`,
                background: `linear-gradient(90deg, ${typeColor} 0%, ${typeColor}80 100%)`,
              }}
            />
          </div>
          <div className="text-xs text-[var(--game-text-dim)] text-right">
            {progress.percent.toFixed(1)}%
          </div>
        </div>
      )}

      {/* 等级效果预览 */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">
          当前效果 (Lv.{playerFormation.level})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {formation.positions[0]?.effects.map((effect, idx) => {
            const levelMultiplier = 1 + (playerFormation.level - 1) * formation.levelBonus;
            const currentValue = Math.round(effect.value * levelMultiplier * 10) / 10;

            let nextValue = currentValue;
            if (!isMaxLevel) {
              const nextMultiplier = 1 + playerFormation.level * formation.levelBonus;
              nextValue = Math.round(effect.value * nextMultiplier * 10) / 10;
            }

            return (
              <div
                key={idx}
                className="bg-black/20 rounded p-2 text-sm"
              >
                <div className="text-[var(--game-text-muted)] text-xs">
                  {effect.type === 'stat_bonus' && effect.targetStat
                    ? getStatName(effect.targetStat)
                    : effect.type === 'damage_bonus'
                      ? '伤害加成'
                      : effect.type === 'damage_reduction'
                        ? '伤害减免'
                        : effect.type === 'heal_bonus'
                          ? '治疗效果'
                          : '效果'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--game-text)]">+{currentValue}%</span>
                  {!isMaxLevel && nextValue > currentValue && (
                    <span className="text-xs text-green-400">
                      → +{nextValue}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 升级消耗 */}
      {!isMaxLevel && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">获取经验</h4>
          <div className="grid grid-cols-3 gap-2">
            <UpgradeButton
              label="小型经验丹"
              exp={50}
              cost={100}
              onClick={() => handleUpgrade(50)}
              disabled={upgrading}
              color={typeColor}
            />
            <UpgradeButton
              label="中型经验丹"
              exp={150}
              cost={250}
              onClick={() => handleUpgrade(150)}
              disabled={upgrading}
              color={typeColor}
            />
            <UpgradeButton
              label="大型经验丹"
              exp={500}
              cost={800}
              onClick={() => handleUpgrade(500)}
              disabled={upgrading}
              color={typeColor}
            />
          </div>
        </div>
      )}

      {/* 满级提示 */}
      {isMaxLevel && (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-[var(--game-gold)] font-semibold">
            {formation.name} 已达到满级！
          </div>
          <div className="text-sm text-[var(--game-text-muted)] mt-1">
            所有效果已达到最大加成
          </div>
        </div>
      )}

      {/* 升级所需经验表 */}
      {!isMaxLevel && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">升级需求</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {Array.from({ length: formation.maxLevel - playerFormation.level }, (_, i) => {
              const targetLevel = playerFormation.level + i + 1;
              const expRequired = getFormationExpRequired(targetLevel - 1);
              return (
                <div
                  key={targetLevel}
                  className="flex justify-between text-xs px-2 py-1 bg-black/20 rounded"
                >
                  <span className="text-[var(--game-text-muted)]">
                    Lv.{playerFormation.level} → Lv.{targetLevel}
                  </span>
                  <span className="text-[var(--game-text)]">
                    {expRequired} EXP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** 升级按钮组件 */
interface UpgradeButtonProps {
  label: string;
  exp: number;
  cost: number;
  onClick: () => void;
  disabled?: boolean;
  color: string;
}

function UpgradeButton({
  label,
  exp,
  cost,
  onClick,
  disabled,
  color,
}: UpgradeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        game-card p-3 text-center transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
      style={{ borderColor: color }}
    >
      <div className="text-xs text-[var(--game-text-muted)] mb-1">{label}</div>
      <div className="text-sm font-semibold text-[var(--game-text)]">+{exp} EXP</div>
      <div className="text-xs text-[var(--game-gold)] mt-1">{cost} 金币</div>
    </button>
  );
}

/** 获取属性名称 */
function getStatName(stat: string): string {
  const names: Record<string, string> = {
    strength: '力量',
    intelligence: '灵力',
    vitality: '体质',
    agility: '敏捷',
    willpower: '魔力',
    physicalAttack: '物理攻击',
    physicalDefense: '物理防御',
    magicAttack: '法术攻击',
    magicDefense: '法术防御',
    speed: '速度',
    maxHp: '最大生命',
    maxMp: '最大魔法',
    critRate: '暴击率',
    critDamage: '暴击伤害',
    hitRate: '命中率',
    dodgeRate: '闪避率',
  };
  return names[stat] || stat;
}

export default FormationUpgrade;
