// 装备详情组件 - 专业游戏UI

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { equipItem, playerGold, useItem, inventoryItems } from '@/signals';
import { showSuccess, showError } from '@/signals/uiSignals';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import { getStatBonus } from '@/constants/enhancement';
import { getEquipmentTemplate } from '@/constants/equipment';
import { getGemIcon, getGemColor } from '@/constants/gems';
import { gemService } from '@/services/gemService';
import { AffixList } from './AffixDisplay';
import { AffixReforgeModal } from './AffixReforgeModal';
import { EnhancementModal } from './EnhancementModal';
import { GemSocketModal } from './GemSocketModal';
import type { Item, Equipment } from '@/types';
import type { BaseStats } from '@/types/common';

interface EquipmentDetailProps {
  item: Item | Equipment;
  onClose: () => void;
  onUpdate?: (equipment: Equipment) => void;
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

export function EquipmentDetail({ item, onClose, onUpdate }: EquipmentDetailProps) {
  useSignals();

  const [showReforgeModal, setShowReforgeModal] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [showGemModal, setShowGemModal] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(
    'baseStats' in item ? item as Equipment : null
  );

  const isEquipment = 'baseStats' in item;
  const isEquipped = isEquipment && 'slot' in item;

  // 获取玩家金币
  const currentGold = playerGold.value;

  // 获取背包中的宝石
  const playerGems = inventoryItems.value.filter(i => i.type === 'gem');

  const handleEquip = () => {
    if (isEquipment) {
      equipItem(item.id);
      onClose();
    }
  };

  const handleUnequip = () => {
    onClose();
  };

  const handleOpenReforge = () => {
    setShowReforgeModal(true);
  };

  const handleOpenEnhance = () => {
    setShowEnhanceModal(true);
  };

  const handleOpenGem = () => {
    setShowGemModal(true);
  };

  const handleReforgeSuccess = (newEquipment: Equipment) => {
    setCurrentEquipment(newEquipment);
    onUpdate?.(newEquipment);
  };

  const handleEnhanceSuccess = (newEquipment: Equipment) => {
    setCurrentEquipment(newEquipment);
    onUpdate?.(newEquipment);
  };

  const handleGemSuccess = (newEquipment: Equipment) => {
    setCurrentEquipment(newEquipment);
    onUpdate?.(newEquipment);
  };

  // 使用消耗品
  const handleUseItem = () => {
    if (isEquipment) return;

    const result = useItem(item.id);
    if (result.success) {
      showSuccess(result.message);
      onClose();
    } else {
      showError(result.message);
    }
  };

  const displayItem = currentEquipment || item;
  const equipment = isEquipment ? (currentEquipment || item) as Equipment : null;
  const qualityColor = getQualityColor(displayItem.quality);

  /** 渲染基础属性 */
  const renderStats = () => {
    if (!equipment) return null;

    const stats = equipment.baseStats;
    const enhanceBonus = getStatBonus(equipment.enhanceLevel);
    const statEntries = Object.entries(stats).filter(([_, value]) => value);

    if (statEntries.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span className="text-base">📊</span>
          <span>基础属性</span>
          {enhanceBonus > 0 && (
            <span className="text-[var(--game-gold)] text-xs ml-auto">
              强化加成: +{(enhanceBonus * 100).toFixed(0)}%
            </span>
          )}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {statEntries.map(([key, value]) => {
            const statKey = key as keyof typeof STAT_NAMES;
            const isPercent = ['critRate', 'critDamage', 'hitRate', 'dodgeRate'].includes(key);

            // 计算强化后的值
            const baseValue = value as number;
            const enhancedValue = isPercent ? baseValue : Math.floor(baseValue * (1 + enhanceBonus));
            const displayValue = isPercent
              ? `${(enhancedValue * 100).toFixed(1)}%`
              : `+${enhancedValue}`;

            return (
              <div
                key={key}
                className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 border border-[var(--game-border)]"
              >
                <span className="text-sm">{STAT_ICONS[statKey] || '◆'}</span>
                <span className="text-[var(--game-text-muted)] text-xs flex-1">
                  {STAT_NAMES[statKey] || key}
                </span>
                <span className="text-[#4ade80] text-sm font-semibold">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /** 渲染词条 */
  const renderAffixes = () => {
    if (!equipment?.affixes?.length) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span className="text-base">📜</span>
          <span>词条属性</span>
        </h4>
        <AffixList
          affixes={equipment.affixes}
          equipmentId={equipment.id}
        />
      </div>
    );
  };

  /** 渲染宝石槽 */
  const renderGems = () => {
    const template = equipment ? getEquipmentTemplate(equipment.templateId) : null;
    if (!template || template.gemSlots <= 0) return null;

    const socketedCount = gemService.getSocketedGemCount(equipment!);

    // 宝石属性加成
    const gemStats = equipment ? gemService.getTotalGemStats(equipment) : {};
    const statEntries = Object.entries(gemStats).filter(([_, value]) => value && value > 0);

    const statNames: Record<keyof BaseStats, string> = {
      strength: '力量',
      intelligence: '灵力',
      vitality: '体质',
      agility: '敏捷',
      willpower: '魔力',
    };

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span className="text-base">💎</span>
          <span>宝石槽</span>
          <span className="text-xs text-[var(--game-text-dim)] ml-auto">
            {socketedCount} / {template.gemSlots}
          </span>
        </h4>
        <div className="flex gap-2 mb-3">
          {equipment!.gems.slice(0, template.gemSlots).map((gem, index) => (
            <div
              key={index}
              className={`
                w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xl
                transition-all duration-200 cursor-pointer
                ${gem
                  ? 'bg-[#2a1a3a] border-2 hover:shadow-[0_0_20px_rgba(192,132,252,0.5)]'
                  : 'bg-black/30 border-2 border-[var(--game-border)] hover:border-[var(--game-gold)]'
                }
              `}
              style={gem ? {
                borderColor: getGemColor(gem.type),
                boxShadow: `0 0 15px ${getGemColor(gem.type)}40`
              } : {}}
              onClick={handleOpenGem}
              title={gem ? `${gem.name}\n点击管理宝石` : '点击镶嵌宝石'}
            >
              {gem ? (
                <>
                  <span>{getGemIcon(gem.type)}</span>
                  <span className="text-[8px] text-[var(--game-text-dim)]">Lv.{gem.level}</span>
                </>
              ) : (
                <span className="text-[var(--game-text-dim)] text-xs">空</span>
              )}
            </div>
          ))}
        </div>
        {/* 宝石属性加成 */}
        {statEntries.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {statEntries.map(([stat, value]) => (
              <span
                key={stat}
                className="text-xs bg-[var(--game-gold)]/20 text-[var(--game-gold)] px-2 py-0.5 rounded"
              >
                {statNames[stat as keyof BaseStats]}+{value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="game-modal w-full max-w-md animate-slide-up max-h-[85vh] overflow-hidden flex flex-col"
          style={{ borderTop: `3px solid ${qualityColor}` }}
        >
          {/* 头部 */}
          <div
            className="game-modal-header"
            style={{
              background: `linear-gradient(180deg, ${qualityColor}15 0%, transparent 100%)`,
            }}
          >
            <div className="flex items-start gap-4 flex-1">
              {/* 装备图标 */}
              <div
                className="game-icon game-icon-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${qualityColor}20 0%, ${qualityColor}05 100%)`,
                  border: `2px solid ${qualityColor}50`,
                  boxShadow: `0 0 20px ${qualityColor}30`,
                }}
              >
                ⚔️
              </div>

              {/* 装备信息 */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-lg truncate"
                  style={{
                    color: qualityColor,
                    textShadow: `0 0 15px ${qualityColor}50`
                  }}
                >
                  {displayItem.name}
                  {equipment?.enhanceLevel ? equipment.enhanceLevel > 0 && (
                    <span className="text-[var(--game-gold)] ml-1">+{equipment.enhanceLevel}</span>
                  ) : null}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="game-tag game-tag-gold text-xs">
                    {getQualityName(displayItem.quality)}
                  </span>
                  {equipment && (
                    <span className="text-[var(--game-text-dim)] text-xs">
                      Lv.{equipment.templateId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-[var(--game-text-muted)] hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-5">
            {renderStats()}
            {renderAffixes()}
            {renderGems()}

            {!isEquipment && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🧪</div>
                <p className="text-[var(--game-text-muted)] text-sm">
                  消耗品 - 点击使用
                </p>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="p-5 border-t border-[var(--game-border)] space-y-3">
            {/* 强化按钮 */}
            {equipment && (
              <button
                onClick={handleOpenEnhance}
                className="game-btn game-btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⬆️</span>
                  <span>强化装备</span>
                  {equipment.enhanceLevel > 0 && (
                    <span className="text-[var(--game-gold)]">+{equipment.enhanceLevel}</span>
                  )}
                </span>
              </button>
            )}

            {/* 洗练按钮 */}
            {equipment && equipment.affixes && equipment.affixes.length > 0 && (
              <button
                onClick={handleOpenReforge}
                className="game-btn game-btn-magic w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔄</span>
                  词条洗练
                </span>
              </button>
            )}

            {/* 宝石镶嵌按钮 */}
            {equipment && (() => {
              const template = getEquipmentTemplate(equipment.templateId);
              return template && template.gemSlots > 0;
            })() && (
              <button
                onClick={handleOpenGem}
                className="game-btn w-full"
                style={{
                  background: 'linear-gradient(135deg, #2a1a4a 0%, #1a1a3a 100%)',
                  borderColor: '#7a5a9a',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>💎</span>
                  <span>宝石镶嵌</span>
                  {equipment.gems && equipment.gems.some(g => g !== null) && (
                    <span className="text-xs text-[#c084fc]">
                      ({equipment.gems.filter(g => g !== null).length}/{(() => {
                        const template = getEquipmentTemplate(equipment.templateId);
                        return template ? template.gemSlots : 0;
                      })()})
                    </span>
                  )}
                </span>
              </button>
            )}

            {/* 装备/卸下按钮 */}
            {isEquipment && !isEquipped && (
              <button
                onClick={handleEquip}
                className="game-btn w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⚔️</span>
                  装备
                </span>
              </button>
            )}

            {isEquipped && (
              <button
                onClick={handleUnequip}
                className="game-btn w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📦</span>
                  卸下
                </span>
              </button>
            )}

            {/* 使用消耗品按钮 */}
            {!isEquipment && (
              <button
                onClick={handleUseItem}
                className="game-btn game-btn-success w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🧪</span>
                  使用
                </span>
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

      {/* 洗练弹窗 */}
      {showReforgeModal && currentEquipment && (
        <AffixReforgeModal
          equipment={currentEquipment}
          onClose={() => setShowReforgeModal(false)}
          onReforgeSuccess={handleReforgeSuccess}
        />
      )}

      {/* 强化弹窗 */}
      {showEnhanceModal && currentEquipment && (
        <EnhancementModal
          equipment={currentEquipment}
          playerGold={currentGold}
          protectionStones={0}
          onClose={() => setShowEnhanceModal(false)}
          onEnhanceSuccess={handleEnhanceSuccess}
        />
      )}

      {/* 宝石镶嵌弹窗 */}
      {showGemModal && currentEquipment && (
        <GemSocketModal
          equipment={currentEquipment}
          playerGems={playerGems}
          onClose={() => setShowGemModal(false)}
          onSocketSuccess={(newEquipment) => handleGemSuccess(newEquipment)}
          onRemoveSuccess={(newEquipment) => handleGemSuccess(newEquipment)}
        />
      )}
    </>
  );
}
