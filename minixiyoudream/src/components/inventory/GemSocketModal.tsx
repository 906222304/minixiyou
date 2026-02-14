// 宝石镶嵌弹窗组件 - 专业游戏UI

import { useState, useCallback, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { gemService, SocketResult, RemoveResult, SynthesizeResult } from '@/services/gemService';
import { getGemTypeConfig, getGemColor, getGemIcon, getGemName, getSynthesizeCost, getRemoveGemCost, calculateGemStats } from '@/constants/gems';
import { getEquipmentTemplate } from '@/constants/equipment';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import { getPRNG } from '@/utils/prng';
import { showSuccess, showError } from '@/signals/uiSignals';
import { playerGold } from '@/signals/playerSignals';
import type { Equipment, Gem, GemType } from '@/types/equipment';
import type { Item } from '@/types';
import type { BaseStats } from '@/types/common';

interface GemSocketModalProps {
  equipment: Equipment;
  playerGems: Item[];  // 玩家背包中的宝石
  onClose: () => void;
  onSocketSuccess?: (newEquipment: Equipment, usedGemId: string) => void;
  onRemoveSuccess?: (newEquipment: Equipment, removedGem: Gem) => void;
  onSynthesizeSuccess?: (newGem: Gem, consumedGemIds: string[], cost: number) => void;
}

/** 宝石属性名称映射 */
const STAT_NAMES: Record<keyof BaseStats, string> = {
  strength: '力量',
  intelligence: '灵力',
  vitality: '体质',
  agility: '敏捷',
  willpower: '魔力',
};

/** 动画状态类型 */
type AnimationState = 'idle' | 'socketing' | 'removing' | 'synthesizing';

export function GemSocketModal({
  equipment,
  playerGems,
  onClose,
  onSocketSuccess,
  onRemoveSuccess,
  onSynthesizeSuccess,
}: GemSocketModalProps) {
  useSignals();

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedGem, setSelectedGem] = useState<Item | null>(null);
  const [synthesizeGems, setSynthesizeGems] = useState<Item[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [lastResult, setLastResult] = useState<{
    type: 'socket' | 'remove' | 'synthesize';
    success: boolean;
    message: string;
  } | null>(null);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(equipment);
  const [activeTab, setActiveTab] = useState<'socket' | 'synthesize'>('socket');

  // 获取当前金币
  const currentGold = playerGold.value;
  const qualityColor = getQualityColor(currentEquipment.quality);

  // 获取装备模板
  const template = getEquipmentTemplate(currentEquipment.templateId);

  // 获取宝石槽位信息
  const gemSlots = useMemo(() => {
    if (!template) return [];
    return gemService.getGemSlotInfo(currentEquipment);
  }, [currentEquipment, template]);

  // 筛选可用于当前装备的宝石
  const availableGems = useMemo(() => {
    if (!template) return [];

    return playerGems.filter(gem => {
      if (!gem.gemType || !gem.gemLevel) return false;
      const allowedGems = template.allowedGems && template.allowedGems.length > 0
        ? template.allowedGems
        : (Object.keys(getGemTypeConfig('ruby') ? { ruby: true, sapphire: true, emerald: true, topaz: true, amethyst: true, diamond: true } : {}) as GemType[]);
      return allowedGems.includes(gem.gemType as GemType);
    });
  }, [playerGems, template]);

  // 按类型分组宝石
  const groupedGems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    for (const gem of availableGems) {
      const key = `${gem.gemType}_${gem.gemLevel}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(gem);
    }
    return groups;
  }, [availableGems]);

  // 镶嵌宝石
  const handleSocket = useCallback(() => {
    if (selectedSlot === null || !selectedGem || !selectedGem.gemType || !selectedGem.gemLevel) {
      return;
    }

    setAnimationState('socketing');
    setLastResult(null);

    const gem: Gem = {
      id: selectedGem.id,
      type: selectedGem.gemType as GemType,
      level: selectedGem.gemLevel,
      name: selectedGem.name,
      statBonus: {},
    };

    // 计算宝石属性
    gem.statBonus = calculateGemStats(gem.type, gem.level);

    setTimeout(() => {
      const result: SocketResult = gemService.socketGem(currentEquipment, gem, selectedSlot);

      setAnimationState('idle');

      if (result.success && result.equipment) {
        setCurrentEquipment(result.equipment);
        setLastResult({
          type: 'socket',
          success: true,
          message: `成功镶嵌 ${gem.name}！`,
        });
        showSuccess(`成功镶嵌 ${gem.name}！`);
        onSocketSuccess?.(result.equipment, selectedGem.id);
        setSelectedGem(null);
        setSelectedSlot(null);
      } else {
        setLastResult({
          type: 'socket',
          success: false,
          message: result.error || '镶嵌失败',
        });
        showError(result.error || '镶嵌失败');
      }
    }, 500);
  }, [selectedSlot, selectedGem, currentEquipment, onSocketSuccess]);

  // 拆卸宝石
  const handleRemove = useCallback((slotIndex: number) => {
    const gem = currentEquipment.gems[slotIndex];
    if (!gem) return;

    const cost = getRemoveGemCost(gem.level);
    if (currentGold < cost) {
      showError(`金币不足，拆卸需要 ${cost.toLocaleString()} 金币`);
      return;
    }

    setAnimationState('removing');
    setLastResult(null);

    setTimeout(() => {
      const result: RemoveResult = gemService.removeGem(currentEquipment, slotIndex, currentGold);

      setAnimationState('idle');

      if (result.success && result.equipment && result.gem) {
        setCurrentEquipment(result.equipment);
        setLastResult({
          type: 'remove',
          success: true,
          message: `成功拆卸 ${result.gem.name}，消耗 ${result.cost?.gold.toLocaleString()} 金币`,
        });
        showSuccess(`成功拆卸 ${result.gem.name}`);
        onRemoveSuccess?.(result.equipment, result.gem);
      } else {
        setLastResult({
          type: 'remove',
          success: false,
          message: result.error || '拆卸失败',
        });
        showError(result.error || '拆卸失败');
      }
    }, 500);
  }, [currentEquipment, currentGold, onRemoveSuccess]);

  // 选择合成宝石
  const handleSelectSynthesizeGem = useCallback((gem: Item) => {
    if (!gem.gemType || !gem.gemLevel) return;

    // 检查是否已选择
    const alreadySelected = synthesizeGems.find(g =>
      g.id === gem.id || (g.gemType === gem.gemType && g.gemLevel === gem.gemLevel && synthesizeGems.length >= 3)
    );

    if (alreadySelected) {
      // 取消选择
      setSynthesizeGems(prev => prev.filter(g => g.id !== gem.id));
    } else {
      // 检查是否同类型
      if (synthesizeGems.length > 0) {
        const firstGem = synthesizeGems[0];
        if (firstGem.gemType !== gem.gemType || firstGem.gemLevel !== gem.gemLevel) {
          showError('只能选择同类型同等级的宝石进行合成');
          return;
        }
      }

      // 添加选择
      setSynthesizeGems(prev => [...prev, gem]);
    }
  }, [synthesizeGems]);

  // 合成预览
  const synthesizePreview = useMemo(() => {
    if (synthesizeGems.length === 0) return null;

    const firstGem = synthesizeGems[0];
    if (!firstGem.gemType || !firstGem.gemLevel) return null;

    const targetLevel = firstGem.gemLevel + 1;
    const costConfig = getSynthesizeCost(targetLevel);

    return {
      type: firstGem.gemType as GemType,
      currentLevel: firstGem.gemLevel,
      targetLevel,
      requiredGems: costConfig.gems,
      requiredGold: costConfig.gold,
      successRate: costConfig.successRate,
      selectedCount: synthesizeGems.length,
      canSynthesize: synthesizeGems.length >= costConfig.gems,
    };
  }, [synthesizeGems]);

  // 执行合成
  const handleSynthesize = useCallback(() => {
    if (!synthesizePreview || !synthesizePreview.canSynthesize) return;

    if (currentGold < synthesizePreview.requiredGold) {
      showError(`金币不足，合成需要 ${synthesizePreview.requiredGold.toLocaleString()} 金币`);
      return;
    }

    setAnimationState('synthesizing');
    setLastResult(null);

    setTimeout(() => {
      const prng = getPRNG();
      const gems: Gem[] = synthesizeGems.slice(0, synthesizePreview.requiredGems).map(g => ({
        id: g.id,
        type: g.gemType as GemType,
        level: g.gemLevel!,
        name: g.name,
        statBonus: {},
      }));

      const result: SynthesizeResult = gemService.synthesizeGem(gems, currentGold, prng);

      setAnimationState('idle');

      if (result.success && result.newGem) {
        setLastResult({
          type: 'synthesize',
          success: true,
          message: `合成成功！获得 ${result.newGem.name}！`,
        });
        showSuccess(`合成成功！获得 ${result.newGem.name}！`);
        onSynthesizeSuccess?.(result.newGem, result.consumedGems, result.cost?.gold || 0);
        setSynthesizeGems([]);
      } else {
        setLastResult({
          type: 'synthesize',
          success: false,
          message: result.error || '合成失败',
        });
        showError(result.error || '合成失败');
        if (result.consumedGems.length > 0) {
          // 合成失败宝石消失，需要通知父组件
          onSynthesizeSuccess?.({} as Gem, result.consumedGems, result.cost?.gold || 0);
        }
        setSynthesizeGems([]);
      }
    }, 800);
  }, [synthesizePreview, synthesizeGems, currentGold, onSynthesizeSuccess]);

  // 渲染宝石槽位
  const renderGemSlots = () => {
    if (!template) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span className="text-base">💎</span>
          <span>宝石槽位</span>
          <span className="text-xs text-[var(--game-text-dim)] ml-auto">
            {gemSlots.filter(s => s.gem).length} / {gemSlots.length}
          </span>
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {gemSlots.map((slot) => {
            const isSelected = selectedSlot === slot.index;
            const gemColor = slot.gem ? getGemColor(slot.gem.type) : 'transparent';

            return (
              <button
                key={slot.index}
                onClick={() => {
                  if (slot.gem) {
                    // 已有宝石，点击拆卸
                    handleRemove(slot.index);
                  } else {
                    // 空槽位，选中进行镶嵌
                    setSelectedSlot(isSelected ? null : slot.index);
                  }
                }}
                disabled={animationState !== 'idle'}
                className={`
                  relative w-full aspect-square rounded-xl
                  transition-all duration-200 flex flex-col items-center justify-center
                  ${slot.gem
                    ? 'bg-[#1a1a2e] border-2 hover:border-[#4a4a6a]'
                    : isSelected
                    ? 'bg-[#1a2a3e] border-2 border-[#4a9eff]'
                    : 'bg-black/30 border-2 border-[var(--game-border)] hover:border-[var(--game-gold)]'
                  }
                `}
                style={slot.gem ? { borderColor: gemColor, boxShadow: `0 0 15px ${gemColor}40` } : {}}
              >
                {slot.gem ? (
                  <>
                    <span className="text-2xl mb-1">{getGemIcon(slot.gem.type)}</span>
                    <span className="text-xs text-[var(--game-text-dim)]">Lv.{slot.gem.level}</span>
                    <span className="absolute top-1 right-1 text-xs text-[#f87171] opacity-0 hover:opacity-100 transition-opacity">
                      ✕
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-[var(--game-text-dim)] opacity-30">◇</span>
                    <span className="text-xs text-[var(--game-text-dim)] mt-1">
                      {isSelected ? '已选中' : '空槽'}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
        {selectedSlot !== null && (
          <div className="mt-2 text-xs text-center text-[var(--game-text-muted)]">
            点击空槽位选择，点击已有宝石拆卸
          </div>
        )}
      </div>
    );
  };

  // 渲染宝石列表
  const renderGemList = () => {
    const gemGroups = Object.entries(groupedGems);

    if (gemGroups.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">💎</div>
          <p className="text-[var(--game-text-dim)] text-sm">没有可用的宝石</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-[200px] overflow-y-auto">
        {gemGroups.map(([key, gems]) => {
          const firstGem = gems[0];
          if (!firstGem.gemType || !firstGem.gemLevel) return null;

          const typeConfig = getGemTypeConfig(firstGem.gemType as GemType);
          const gemColor = getGemColor(firstGem.gemType as GemType);
          const isSelected = selectedGem?.id === firstGem.id;

          return (
            <button
              key={key}
              onClick={() => setSelectedGem(isSelected ? null : firstGem)}
              disabled={animationState !== 'idle' || selectedSlot === null}
              className={`
                w-full p-3 rounded-lg flex items-center gap-3
                transition-all duration-200
                ${isSelected
                  ? 'bg-[#1a3a4a] border-2 border-[#4a9eff]'
                  : selectedSlot === null
                  ? 'bg-black/20 border border-[var(--game-border)] opacity-50 cursor-not-allowed'
                  : 'bg-black/20 border border-[var(--game-border)] hover:border-[var(--game-gold)]'
                }
              `}
              style={isSelected ? { borderColor: gemColor, boxShadow: `0 0 10px ${gemColor}40` } : {}}
            >
              <span className="text-2xl" style={{ color: gemColor }}>
                {typeConfig?.icon || '💎'}
              </span>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm" style={{ color: gemColor }}>
                  {firstGem.name}
                </div>
                <div className="text-xs text-[var(--game-text-dim)]">
                  {typeConfig?.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--game-text-muted)]">
                  x{gems.length}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // 渲染合成界面
  const renderSynthesizeTab = () => {
    const gemGroups = Object.entries(groupedGems).filter(([_, gems]) => gems.length >= 1);

    if (gemGroups.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">💎</div>
          <p className="text-[var(--game-text-dim)] text-sm">没有可合成的宝石</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* 可合成宝石列表 */}
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {gemGroups.map(([key, gems]) => {
            const firstGem = gems[0];
            if (!firstGem.gemType || !firstGem.gemLevel) return null;
            if (firstGem.gemLevel >= 10) return null; // 最高级不能合成

            const typeConfig = getGemTypeConfig(firstGem.gemType as GemType);
            const gemColor = getGemColor(firstGem.gemType as GemType);
            const selectedCount = synthesizeGems.filter(g =>
              g.gemType === firstGem.gemType && g.gemLevel === firstGem.gemLevel
            ).length;

            return (
              <button
                key={key}
                onClick={() => handleSelectSynthesizeGem(firstGem)}
                disabled={animationState !== 'idle'}
                className={`
                  w-full p-3 rounded-lg flex items-center gap-3
                  transition-all duration-200
                  ${selectedCount > 0
                    ? 'bg-[#1a3a4a] border-2'
                    : 'bg-black/20 border border-[var(--game-border)] hover:border-[var(--game-gold)]'
                  }
                `}
                style={selectedCount > 0 ? { borderColor: gemColor, boxShadow: `0 0 10px ${gemColor}40` } : {}}
              >
                <span className="text-2xl" style={{ color: gemColor }}>
                  {typeConfig?.icon || '💎'}
                </span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm" style={{ color: gemColor }}>
                    {firstGem.name}
                  </div>
                  <div className="text-xs text-[var(--game-text-dim)]">
                    拥有: {gems.length} | 已选: {selectedCount}
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(3, gems.length) }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < selectedCount ? 'bg-[var(--game-gold)]' : 'bg-[var(--game-border)]'}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* 合成预览 */}
        {synthesizePreview && (
          <div className="game-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--game-text-muted)]">目标宝石</span>
              <span style={{ color: getGemColor(synthesizePreview.type) }}>
                {getGemIcon(synthesizePreview.type)} {getGemName(synthesizePreview.type, synthesizePreview.targetLevel)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--game-text-muted)]">需要宝石</span>
              <span className={synthesizePreview.selectedCount >= synthesizePreview.requiredGems ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                {synthesizePreview.selectedCount} / {synthesizePreview.requiredGems}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--game-text-muted)]">消耗金币</span>
              <span className={currentGold >= synthesizePreview.requiredGold ? 'text-[var(--game-gold)]' : 'text-[#f87171]'}>
                {synthesizePreview.requiredGold.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--game-text-muted)]">成功率</span>
              <span className={
                synthesizePreview.successRate >= 0.8 ? 'text-[#4ade80]' :
                synthesizePreview.successRate >= 0.5 ? 'text-[var(--game-gold)]' : 'text-[#f87171]'
              }>
                {(synthesizePreview.successRate * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染镶嵌属性加成
  const renderGemStats = () => {
    const totalStats = gemService.getTotalGemStats(currentEquipment);
    const statEntries = Object.entries(totalStats).filter(([_, value]) => value && value > 0);

    if (statEntries.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-2 flex items-center gap-2">
          <span>📊</span>
          <span>宝石属性加成</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {statEntries.map(([stat, value]) => (
            <span
              key={stat}
              className="text-xs bg-[var(--game-gold)]/20 text-[var(--game-gold)] px-2 py-1 rounded"
            >
              {STAT_NAMES[stat as keyof BaseStats]}+{value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div
        className="game-modal w-full max-w-lg animate-slide-up max-h-[90vh] overflow-hidden flex flex-col"
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
            <span>💎</span>
            <span>宝石镶嵌</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[var(--game-text-muted)] hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 装备信息 */}
        <div className="p-4 border-b border-[var(--game-border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{
                background: `linear-gradient(135deg, ${qualityColor}20 0%, ${qualityColor}05 100%)`,
                border: `2px solid ${qualityColor}50`,
              }}
            >
              ⚔️
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate" style={{ color: qualityColor }}>
                {currentEquipment.name}
                {currentEquipment.enhanceLevel > 0 && (
                  <span className="text-[var(--game-gold)] ml-1">+{currentEquipment.enhanceLevel}</span>
                )}
              </h3>
              <span className="game-tag game-tag-gold text-xs">
                {getQualityName(currentEquipment.quality)}
              </span>
            </div>
          </div>
          {renderGemStats()}
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-[var(--game-border)]">
          <button
            onClick={() => setActiveTab('socket')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === 'socket'
                ? 'text-[var(--game-gold)] border-b-2 border-[var(--game-gold)]'
                : 'text-[var(--game-text-muted)] hover:text-white'
            }`}
          >
            镶嵌 / 拆卸
          </button>
          <button
            onClick={() => setActiveTab('synthesize')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === 'synthesize'
                ? 'text-[var(--game-gold)] border-b-2 border-[var(--game-gold)]'
                : 'text-[var(--game-text-muted)] hover:text-white'
            }`}
          >
            宝石合成
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'socket' ? (
            <>
              {renderGemSlots()}
              {selectedSlot !== null && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                    <span>🎒</span>
                    <span>选择宝石</span>
                  </h4>
                  {renderGemList()}
                </div>
              )}
            </>
          ) : (
            renderSynthesizeTab()
          )}
        </div>

        {/* 结果提示 */}
        {lastResult && (
          <div className="px-4 pb-2">
            <div
              className={`
                p-3 rounded-lg flex items-center gap-3 animate-slide-up
                ${lastResult.success
                  ? 'bg-[#1a3a2a] border border-[#2a6a4a]'
                  : 'bg-[#3a1a1a] border border-[#6a2a2a]'}
              `}
            >
              <span className="text-xl">
                {lastResult.success ? '✅' : '❌'}
              </span>
              <span className={`text-sm ${lastResult.success ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {lastResult.message}
              </span>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="p-4 border-t border-[var(--game-border)] space-y-3">
          {/* 当前金币显示 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--game-text-muted)]">当前金币</span>
            <span className="text-[var(--game-gold)] font-semibold">
              {currentGold.toLocaleString()}
            </span>
          </div>

          {/* 镶嵌按钮 */}
          {activeTab === 'socket' && selectedSlot !== null && selectedGem && (
            <button
              onClick={handleSocket}
              disabled={animationState !== 'idle'}
              className="game-btn game-btn-primary w-full"
            >
              {animationState === 'socketing' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🌀</span>
                  <span>镶嵌中...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>💎</span>
                  <span>镶嵌 {selectedGem.name}</span>
                </span>
              )}
            </button>
          )}

          {/* 合成按钮 */}
          {activeTab === 'synthesize' && synthesizePreview?.canSynthesize && (
            <button
              onClick={handleSynthesize}
              disabled={animationState !== 'idle'}
              className="game-btn game-btn-magic w-full"
            >
              {animationState === 'synthesizing' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🌀</span>
                  <span>合成中...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>合成 {getGemName(synthesizePreview.type, synthesizePreview.targetLevel)}</span>
                </span>
              )}
            </button>
          )}

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

export default GemSocketModal;
