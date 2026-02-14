// 装备强化弹窗组件 - 专业游戏UI

import { useState, useCallback, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { enhancementService } from '@/services/enhancementService';
import { getPRNG } from '@/utils/prng';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import {
  formatSuccessRate,
  formatStatBonus,
  getEnhancementPreview,
  calculateProtectionStoneCost,
  getStatBonus,
  PROTECTION_ITEM,
} from '@/constants/enhancement';
import type { Equipment } from '@/types';

interface EnhancementModalProps {
  equipment: Equipment;
  playerGold: number;
  protectionStones?: number;
  onClose: () => void;
  onEnhanceSuccess?: (newEquipment: Equipment) => void;
  onGoldChange?: (cost: number) => void;
  onProtectionStonesChange?: (cost: number) => void;
}

/** 属性图标映射 */
const STAT_ICONS: Record<string, string> = {
  physicalAttack: '⚔️',
  physicalDefense: '🛡️',
  magicAttack: '🔮',
  magicDefense: '✨',
  speed: '💨',
  maxHp: '❤️',
  maxMp: '💙',
  critRate: '💥',
  critDamage: '💢',
  hitRate: '🎯',
  dodgeRate: '🌀',
};

/** 属性名称映射 */
const STAT_NAMES: Record<string, string> = {
  physicalAttack: '物理攻击',
  physicalDefense: '物理防御',
  magicAttack: '法术攻击',
  magicDefense: '法术防御',
  speed: '速度',
  maxHp: '最大HP',
  maxMp: '最大MP',
  critRate: '暴击率',
  critDamage: '暴击伤害',
  hitRate: '命中率',
  dodgeRate: '闪避率',
};

/** 强化动画状态 */
type AnimationState = 'idle' | 'enhancing' | 'success' | 'fail';

export function EnhancementModal({
  equipment,
  playerGold,
  protectionStones = 0,
  onClose,
  onEnhanceSuccess,
  onGoldChange,
  onProtectionStonesChange,
}: EnhancementModalProps) {
  useSignals();

  const [useProtection, setUseProtection] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(equipment);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    newLevel: number;
    downgraded: boolean;
  } | null>(null);

  // 当装备变化时更新当前装备
  useEffect(() => {
    setCurrentEquipment(equipment);
  }, [equipment]);

  const qualityColor = getQualityColor(currentEquipment.quality);

  // 获取强化预览
  const preview = getEnhancementPreview(
    currentEquipment.enhanceLevel,
    currentEquipment.quality,
    playerGold,
    protectionStones
  );

  // 保护石消耗
  const protectionCost = useProtection
    ? calculateProtectionStoneCost(preview.targetLevel)
    : 0;

  // 是否可以使用保护石
  const canUseProtection = preview.failPenalty === 'downgrade' && protectionStones >= protectionCost;

  // 是否可以强化
  const canEnhance = preview.canEnhance && (!useProtection || canUseProtection);

  // 切换保护石使用
  const handleToggleProtection = useCallback(() => {
    if (canUseProtection) {
      setUseProtection(!useProtection);
    }
  }, [canUseProtection, useProtection]);

  // 执行强化
  const handleEnhance = useCallback(() => {
    if (!canEnhance || animationState !== 'idle') return;

    setAnimationState('enhancing');
    setLastResult(null);

    const prng = getPRNG();

    // 延迟执行以显示动画
    setTimeout(() => {
      const result = enhancementService.enhanceEquipment(
        currentEquipment,
        useProtection,
        prng,
        playerGold,
        protectionStones
      );

      setAnimationState(result.success ? 'success' : 'fail');
      setLastResult({
        success: result.success,
        newLevel: result.newLevel,
        downgraded: result.downgraded || false,
      });

      if (result.equipment) {
        setCurrentEquipment(result.equipment);
      }

      // 扣除金币
      if (onGoldChange && result.cost > 0) {
        onGoldChange(result.cost);
      }

      // 扣除保护石
      if (useProtection && onProtectionStonesChange && protectionCost > 0) {
        onProtectionStonesChange(protectionCost);
      }

      // 成功回调
      if (result.success && result.equipment && onEnhanceSuccess) {
        onEnhanceSuccess(result.equipment);
      }

      // 重置动画状态
      setTimeout(() => {
        setAnimationState('idle');
      }, 1500);
    }, 800);
  }, [canEnhance, animationState, currentEquipment, useProtection, playerGold, protectionStones, protectionCost, onGoldChange, onProtectionStonesChange, onEnhanceSuccess]);

  // 渲染属性对比
  const renderStatsComparison = () => {
    const baseStats = currentEquipment.baseStats;
    const currentBonus = getStatBonus(currentEquipment.enhanceLevel);
    const nextBonus = getStatBonus(preview.targetLevel);

    const statEntries = Object.entries(baseStats).filter(([_, value]) => value);

    if (statEntries.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span className="text-base">📊</span>
          <span>属性预览</span>
        </h4>
        <div className="space-y-2">
          {statEntries.map(([key, value]) => {
            const statKey = key as keyof typeof STAT_NAMES;
            const isPercent = ['critRate', 'critDamage', 'hitRate', 'dodgeRate'].includes(key);

            // 当前属性
            const currentValue = isPercent
              ? value
              : Math.floor((value as number) * (1 + currentBonus));

            // 强化后属性
            const nextValue = isPercent
              ? value
              : Math.floor((value as number) * (1 + nextBonus));

            const increase = nextValue - currentValue;

            return (
              <div
                key={key}
                className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-[var(--game-border)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{STAT_ICONS[statKey] || '◆'}</span>
                  <span className="text-[var(--game-text-muted)] text-xs">
                    {STAT_NAMES[statKey] || key}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">
                    {isPercent ? `${((currentValue as number) * 100).toFixed(1)}%` : currentValue}
                  </span>
                  {preview.targetLevel <= preview.maxLevel && (
                    <>
                      <span className="text-[var(--game-text-dim)]">→</span>
                      <span className={`text-sm font-semibold ${increase > 0 ? 'text-[#4ade80]' : 'text-white'}`}>
                        {isPercent ? `${((nextValue as number) * 100).toFixed(1)}%` : nextValue}
                      </span>
                      {increase > 0 && (
                        <span className="text-[#4ade80] text-xs">(+{increase})</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染强化等级星星
  const renderEnhanceStars = () => {
    const maxStars = Math.min(preview.maxLevel, 15);
    const filledStars = currentEquipment.enhanceLevel;

    return (
      <div className="flex items-center justify-center gap-1 mb-4">
        {Array.from({ length: maxStars }).map((_, index) => (
          <span
            key={index}
            className={`text-lg transition-all duration-300 ${
              index < filledStars
                ? 'text-[var(--game-gold)] animate-glow-pulse'
                : 'text-[var(--game-text-dim)] opacity-40'
            }`}
            style={index < filledStars ? { '--glow-color': 'rgba(245, 166, 35, 0.5)' } as React.CSSProperties : {}}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div
        className="game-modal w-full max-w-md animate-slide-up"
        style={{ borderTop: `3px solid ${qualityColor}` }}
      >
        {/* 头部 */}
        <div
          className="game-modal-header"
          style={{
            background: `linear-gradient(180deg, ${qualityColor}15 0%, transparent 100%)`,
          }}
        >
          <h2 className="game-modal-title flex items-center gap-2">
            <span>⬆️</span>
            <span>装备强化</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[var(--game-text-muted)] hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 装备信息 */}
        <div className="p-5">
          <div
            className="game-card p-4"
            style={{
              borderColor: qualityColor,
              boxShadow: `0 0 25px ${qualityColor}30`,
            }}
          >
            <div className="flex items-center gap-4">
              {/* 装备图标 */}
              <div
                className="game-icon game-icon-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${qualityColor}20 0%, ${qualityColor}05 100%)`,
                  border: `2px solid ${qualityColor}50`,
                }}
              >
                ⚔️
              </div>
              {/* 装备信息 */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-lg truncate"
                  style={{ color: qualityColor }}
                >
                  {currentEquipment.name}
                  {currentEquipment.enhanceLevel > 0 && (
                    <span className="text-[var(--game-gold)] ml-1">+{currentEquipment.enhanceLevel}</span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="game-tag game-tag-gold text-xs">
                    {getQualityName(currentEquipment.quality)}
                  </span>
                  <span className="text-[var(--game-text-dim)] text-xs">
                    最大强化: +{preview.maxLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* 强化等级星星 */}
            {renderEnhanceStars()}

            {/* 当前进度 */}
            <div className="mt-3 pt-3 border-t border-[var(--game-border)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--game-text-muted)]">当前加成</span>
                <span className="text-[var(--game-gold)] font-semibold">
                  {formatStatBonus(getStatBonus(currentEquipment.enhanceLevel))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 属性对比 */}
        <div className="px-5 pb-4">
          {renderStatsComparison()}
        </div>

        {/* 强化信息面板 */}
        {preview.targetLevel <= preview.maxLevel && (
          <div className="px-5 pb-4">
            <div className="game-panel p-4 space-y-3">
              {/* 目标等级 */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--game-text-muted)] text-sm">目标等级</span>
                <span className="text-white font-semibold">+{preview.targetLevel}</span>
              </div>

              {/* 成功率 */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--game-text-muted)] text-sm flex items-center gap-2">
                  <span>🎯</span>
                  <span>成功率</span>
                </span>
                <span
                  className={`font-semibold ${
                    preview.successRate >= 0.8
                      ? 'text-[#4ade80]'
                      : preview.successRate >= 0.5
                      ? 'text-[var(--game-gold)]'
                      : 'text-[#f87171]'
                  }`}
                >
                  {formatSuccessRate(preview.successRate)}
                </span>
              </div>

              {/* 金币消耗 */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--game-text-muted)] text-sm flex items-center gap-2">
                  <span>💰</span>
                  <span>消耗金币</span>
                </span>
                <span className={`font-semibold ${playerGold < preview.goldCost ? 'text-[#f87171]' : 'text-[var(--game-gold)]'}`}>
                  {preview.goldCost.toLocaleString()}
                </span>
              </div>

              {/* 失败惩罚 */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--game-text-muted)] text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>失败惩罚</span>
                </span>
                <span className={`text-sm ${preview.failPenalty === 'none' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {preview.failPenalty === 'none' ? '无' : '等级-1'}
                </span>
              </div>

              {/* 保护石选项 */}
              {preview.failPenalty === 'downgrade' && (
                <div className="pt-3 border-t border-[var(--game-border)]">
                  <button
                    onClick={handleToggleProtection}
                    disabled={!canUseProtection}
                    className={`
                      w-full p-3 rounded-lg border transition-all duration-200 flex items-center justify-between
                      ${useProtection
                        ? 'bg-[#1a3a4a] border-[#2a6a8a]'
                        : canUseProtection
                        ? 'bg-black/20 border-[var(--game-border)] hover:border-[var(--game-gold)]'
                        : 'bg-black/10 border-[var(--game-border)] opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PROTECTION_ITEM.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">
                          {PROTECTION_ITEM.name}
                        </div>
                        <div className="text-xs text-[var(--game-text-dim)]">
                          {PROTECTION_ITEM.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${canUseProtection ? 'text-[var(--game-gold)]' : 'text-[#f87171]'}`}>
                        ×{protectionCost}
                      </div>
                      <div className="text-xs text-[var(--game-text-dim)]">
                        拥有: {protectionStones}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 强化结果提示 */}
        {lastResult && (
          <div className="px-5 pb-4">
            <div
              className={`
                p-4 rounded-lg flex items-center gap-3 animate-slide-up
                ${lastResult.success
                  ? 'bg-[#1a3a2a] border border-[#2a6a4a]'
                  : lastResult.downgraded
                  ? 'bg-[#3a2a1a] border border-[#6a4a2a]'
                  : 'bg-[#3a1a1a] border border-[#6a2a2a]'}
              `}
            >
              <span className="text-2xl">
                {lastResult.success ? '✅' : lastResult.downgraded ? '💔' : '❌'}
              </span>
              <div>
                <span
                  className={`text-sm font-medium ${
                    lastResult.success
                      ? 'text-[#4ade80]'
                      : lastResult.downgraded
                      ? 'text-[#fbbf24]'
                      : 'text-[#f87171]'
                  }`}
                >
                  {lastResult.success
                    ? `强化成功！等级提升至 +${lastResult.newLevel}`
                    : lastResult.downgraded
                    ? `强化失败！等级降至 +${lastResult.newLevel}`
                    : '强化失败！等级保持不变'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="p-5 pt-0 space-y-3">
          {/* 已满级提示 */}
          {preview.targetLevel > preview.maxLevel && (
            <div className="text-center text-sm text-[var(--game-gold)] py-2 flex items-center justify-center gap-2">
              <span>🎉</span>
              <span>已达到该品质的最大强化等级！</span>
            </div>
          )}

          {/* 不能强化的原因 */}
          {!preview.canEnhance && preview.targetLevel <= preview.maxLevel && (
            <div className="text-center text-sm text-[#f87171] py-2 flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>{preview.reason}</span>
            </div>
          )}

          {/* 强化动画 */}
          {animationState === 'enhancing' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-3 text-lg text-[var(--game-gold)]">
                <span className="animate-spin text-2xl">🌀</span>
                <span>强化中...</span>
              </div>
            </div>
          )}

          {/* 强化按钮 */}
          <button
            onClick={handleEnhance}
            disabled={!canEnhance || animationState !== 'idle'}
            className="game-btn game-btn-primary w-full"
          >
            {animationState !== 'idle' ? (
              <span className="flex items-center justify-center gap-2">
                <span className={`text-lg ${animationState === 'enhancing' ? 'animate-spin' : ''}`}>
                  {animationState === 'enhancing' ? '🌀' : animationState === 'success' ? '✅' : '❌'}
                </span>
                <span>
                  {animationState === 'enhancing' ? '强化中...' : animationState === 'success' ? '强化成功！' : '强化失败'}
                </span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>⬆️</span>
                <span>
                  强化 +{preview.currentLevel} → +{preview.targetLevel}
                </span>
              </span>
            )}
          </button>

          <button
            onClick={onClose}
            className="game-btn w-full opacity-70 hover:opacity-100"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnhancementModal;
