// 词条洗练弹窗组件 - 专业游戏UI

import { useState, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  toggleAffixLock,
  getLockedAffixIndices,
  clearAffixLockState,
  setSelectedEquipmentForReforge,
} from '@/signals';
import { affixService } from '@/services';
import { getPRNG } from '@/utils/prng';
import { calculateReforgeCost, formatReforgeCost, canReforge } from '@/constants/reforge';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import { AffixList } from './AffixDisplay';
import type { Equipment, ReforgeCost } from '@/types';

interface AffixReforgeModalProps {
  equipment: Equipment;
  onClose: () => void;
  onReforgeSuccess?: (newEquipment: Equipment) => void;
}

interface ReforgePreview {
  cost: ReforgeCost;
  canReforge: boolean;
  reason?: string;
}

export function AffixReforgeModal({
  equipment,
  onClose,
  onReforgeSuccess,
}: AffixReforgeModalProps) {
  useSignals();

  const [isReforgeing, setIsReforgeing] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const lockedIndices = getLockedAffixIndices(equipment.id);

  const preview: ReforgePreview = {
    cost: calculateReforgeCost(equipment.quality, lockedIndices.length),
    ...canReforge(lockedIndices.length, equipment.affixes.length),
  };

  const handleToggleLock = useCallback((index: number) => {
    toggleAffixLock(equipment.id, index);
  }, [equipment.id]);

  const handleReforge = useCallback(() => {
    if (!preview.canReforge) return;

    setIsReforgeing(true);
    setLastResult(null);

    const prng = getPRNG();
    const currentLocked = getLockedAffixIndices(equipment.id);

    const result = affixService.reforgeAffixes(equipment, currentLocked, prng);

    setTimeout(() => {
      setIsReforgeing(false);

      if (result.success) {
        setLastResult({
          success: true,
          message: '洗练成功！词条已更新',
        });

        clearAffixLockState(equipment.id);
        onReforgeSuccess?.(result.equipment);
      } else {
        setLastResult({
          success: false,
          message: result.error || '洗练失败',
        });
      }
    }, 600);
  }, [equipment, preview.canReforge, onReforgeSuccess]);

  const handleClose = () => {
    setSelectedEquipmentForReforge(null);
    onClose();
  };

  const qualityColor = getQualityColor(equipment.quality);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="game-modal w-full max-w-md animate-slide-up">
        {/* 头部 */}
        <div className="game-modal-header">
          <h2 className="game-modal-title flex items-center gap-2">
            <span>⚔️</span>
            <span>词条洗练</span>
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center text-[var(--game-text-muted)] hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 装备信息卡片 */}
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
                  {equipment.name}
                  {equipment.enhanceLevel > 0 && (
                    <span className="text-[var(--game-gold)] ml-1">+{equipment.enhanceLevel}</span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="game-tag game-tag-gold text-xs">
                    {getQualityName(equipment.quality)}
                  </span>
                  <span className="text-[var(--game-text-dim)] text-xs">
                    {equipment.affixes.length}条词条
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 词条列表 */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
              <span>📜</span>
              <span>词条列表</span>
            </h4>
            <span className="text-xs text-[var(--game-text-dim)]">
              点击锁定（最多3条）
            </span>
          </div>
          <div className="bg-black/30 rounded-lg p-3 border border-[var(--game-border)]">
            <AffixList
              affixes={equipment.affixes}
              equipmentId={equipment.id}
              showLock={true}
              onToggleLock={handleToggleLock}
            />
          </div>
        </div>

        {/* 消耗预览 */}
        <div className="px-5 pb-4">
          <div className="game-panel p-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--game-text-muted)] text-sm flex items-center gap-2">
                <span>💎</span>
                <span>洗练消耗</span>
              </span>
              <span className="text-[var(--game-gold)] font-semibold">
                {formatReforgeCost(preview.cost)}
              </span>
            </div>
            {lockedIndices.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[var(--game-border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--game-gold)]">
                  <span>🔒</span>
                  <span>已锁定 {lockedIndices.length} 条词条</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 结果提示 */}
        {lastResult && (
          <div className="px-5 pb-4">
            <div
              className={`
                p-4 rounded-lg flex items-center gap-3 animate-slide-up
                ${lastResult.success
                  ? 'bg-[#1a3a2a] border border-[#2a6a4a]'
                  : 'bg-[#3a1a1a] border border-[#6a2a2a]'}
              `}
            >
              <span className="text-2xl">
                {lastResult.success ? '✅' : '❌'}
              </span>
              <span className={`text-sm font-medium ${lastResult.success ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {lastResult.message}
              </span>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="p-5 pt-0 space-y-3">
          {!preview.canReforge && (
            <div className="text-center text-sm text-[#f87171] py-2 flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>{preview.reason}</span>
            </div>
          )}

          <button
            onClick={handleReforge}
            disabled={!preview.canReforge || isReforgeing}
            className="game-btn game-btn-primary w-full"
          >
            {isReforgeing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">🌀</span>
                <span>洗练中...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🔄</span>
                <span>开始洗练</span>
              </span>
            )}
          </button>

          <button
            onClick={handleClose}
            className="game-btn w-full opacity-70 hover:opacity-100"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default AffixReforgeModal;
