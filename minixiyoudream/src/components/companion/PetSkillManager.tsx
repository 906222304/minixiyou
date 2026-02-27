// 宠物技能管理组件 - 梦幻西游风格打书系统

import { useState, useMemo, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import type { Pet, PetSkill } from '@/types';
import type { BeastScrollCategory, BeastScrollTier } from '@/constants/beastScrolls';
import { beastScrollService } from '@/services/beastScrollService';
import {
  ALL_BEAST_SCROLLS,
  getBeastScroll,
  type BeastScrollConfig,
} from '@/constants/beastScrolls';
import {
  getPetSkillSlotConfig,
  getMaxSkillSlots,
  getSkillSlotUnlockConfig,
  getSlotUnlockGoldCost,
  getSlotUnlockItem,
  SKILL_LOCK_CONFIG,
} from '@/constants/petSkillSlots';
import { showSuccess, showError } from '@/signals/uiSignals';

interface PetSkillManagerProps {
  pet: Pet;
  playerGold: number;
  beastScrolls: string[];  // 拥有的兽诀ID列表
  lockPearls: number;      // 锁妖珠数量
  goldenDews: number;      // 金柳露数量
  immortalDews: number;    // 仙露数量
  onClose: () => void;
  onPetUpdate: (pet: Pet) => void;
  onGoldChange: (delta: number) => void;
  onBeastScrollConsume: (scrollId: string) => void;
  onBeastScrollGain: (scrollId: string) => void;
  onLockPearlChange: (delta: number) => void;
  onGoldenDewChange: (delta: number) => void;
  onImmortalDewChange: (delta: number) => void;
}

/** 兽诀类别过滤 */
type CategoryFilter = 'all' | BeastScrollCategory;

/** 兽诀等级过滤 */
type TierFilter = 'all' | BeastScrollTier;

/** 兽诀品质颜色 */
const tierColors: Record<BeastScrollTier, string> = {
  low: 'bg-blue-600',
  high: 'bg-purple-600',
};

/** 兽诀品质边框 */
const tierBorders: Record<BeastScrollTier, string> = {
  low: 'border-blue-400',
  high: 'border-purple-400',
};

/** 技能类别图标 */
const categoryIcons: Record<BeastScrollCategory, string> = {
  attack: '⚔️',
  defense: '🛡️',
  support: '💚',
  magic: '🔮',
};

export function PetSkillManager({
  pet,
  playerGold,
  beastScrolls,
  lockPearls,
  goldenDews,
  immortalDews,
  onClose,
  onPetUpdate,
  onGoldChange,
  onBeastScrollConsume,
  onBeastScrollGain,
  onLockPearlChange,
  onGoldenDewChange,
  onImmortalDewChange,
}: PetSkillManagerProps) {
  useSignals();

  const [selectedSkill, setSelectedSkill] = useState<PetSkill | null>(null);
  const [selectedScroll, setSelectedScroll] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [isLearning, setIsLearning] = useState(false);
  const [showForgetConfirm, setShowForgetConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showUnlockSlotConfirm, setShowUnlockSlotConfirm] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{
    type: string;
    message: string;
    success: boolean;
  } | null>(null);

  // 计算技能槽配置
  const slotConfig = useMemo(() => getPetSkillSlotConfig(pet.quality), [pet.quality]);
  const maxSlots = useMemo(() => getMaxSkillSlots(pet.quality), [pet.quality]);
  const unlockedSlots = useMemo(() => pet.unlockedSlots || [], [pet.unlockedSlots]);

  // 计算当前可用技能格数量
  const availableSlots = useMemo(() => {
    // 基础技能格 + 已解锁的额外技能格
    let count = slotConfig.baseSlots;
    // 通过等级解锁的技能格
    for (let i = slotConfig.baseSlots + 1; i <= maxSlots; i++) {
      const config = getSkillSlotUnlockConfig(i);
      if (config?.unlockMethod === 'level' && pet.level >= (config.unlockLevel || 0)) {
        count++;
      } else if (unlockedSlots.includes(i)) {
        count++;
      }
    }
    return count;
  }, [slotConfig, maxSlots, pet.level, unlockedSlots]);

  const currentSlotUsage = pet.skills.length;
  const hasEmptySlot = currentSlotUsage < availableSlots;
  const lockedSkillsCount = pet.skills.filter(s => s.locked).length;

  // 获取可用的兽诀
  const availableScrolls = useMemo(() => {
    return beastScrolls
      .map(id => ALL_BEAST_SCROLLS[id])
      .filter((scroll): scroll is BeastScrollConfig => !!scroll)
      .filter(scroll => {
        if (categoryFilter !== 'all' && scroll.category !== categoryFilter) return false;
        if (tierFilter !== 'all' && scroll.tier !== tierFilter) return false;
        return true;
      });
  }, [beastScrolls, categoryFilter, tierFilter]);

  // 获取技能槽状态
  const slotStatus = useMemo(() => {
    const slots = [];
    for (let i = 1; i <= maxSlots; i++) {
      const config = getSkillSlotUnlockConfig(i);
      const isDefault = config?.unlockMethod === 'default';
      const isLevelUnlocked = config?.unlockMethod === 'level' && pet.level >= (config.unlockLevel || 0);
      const isItemUnlocked = unlockedSlots.includes(i);
      const isUnlocked = isDefault || isLevelUnlocked || isItemUnlocked;
      const needsItemUnlock = config?.unlockMethod === 'item' && !isItemUnlocked;
      const skill = pet.skills[i - 1];

      slots.push({
        slot: i,
        isUnlocked,
        isDefault,
        isLevelUnlocked,
        isItemUnlocked,
        needsItemUnlock,
        unlockLevel: config?.unlockLevel,
        unlockItem: config?.unlockItem,
        skill,
      });
    }
    return slots;
  }, [maxSlots, pet.level, pet.skills, unlockedSlots]);

  // 学习兽诀
  const handleLearnScroll = useCallback(async (scrollId: string) => {
    if (isLearning) return;

    setIsLearning(true);
    setLastResult(null);

    const scroll = getBeastScroll(scrollId);
    if (!scroll) {
      setLastResult({
        type: 'fail',
        message: '兽诀不存在',
        success: false,
      });
      setIsLearning(false);
      return;
    }

    // 创建伪随机数生成器
    const prng = {
      next: () => Math.random(),
      nextInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    };

    const result = beastScrollService.learnBeastScroll(pet, scrollId, prng as any);

    if (result.success) {
      onPetUpdate(result.pet);
      onBeastScrollConsume(scrollId);

      const messages: Record<string, string> = {
        learn: `成功学习技能【${result.newSkill?.name}】！`,
        upgrade: `技能【${result.newSkill?.name}】升级到 Lv.${result.newLevel}！`,
        override: `技能【${result.overriddenSkill?.name}】被替换为【${result.newSkill?.name}】！`,
      };

      setLastResult({
        type: result.type,
        message: messages[result.type] || '技能学习成功！',
        success: true,
      });

      showSuccess(messages[result.type] || '技能学习成功！');
    } else {
      setLastResult({
        type: result.type,
        message: result.reason || '技能学习失败',
        success: false,
      });

      // 学习失败也消耗兽诀
      onBeastScrollConsume(scrollId);
      if (result.type !== 'exclusive_conflict') {
        showError(result.reason || '技能学习失败');
      }
    }

    setIsLearning(false);
    setSelectedScroll(null);
  }, [isLearning, pet, onPetUpdate, onBeastScrollConsume]);

  // 遗忘技能
  const handleForgetSkill = useCallback(() => {
    if (!selectedSkill) return;

    const prng = {
      next: () => Math.random(),
      nextInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    };

    const result = beastScrollService.forgetSkill(pet, selectedSkill.id, playerGold, prng as any);

    if (result.success) {
      onPetUpdate(result.pet);
      onGoldChange(-result.goldCost);

      if (result.returnedScroll) {
        onBeastScrollGain(result.returnedScroll);
        showSuccess(`${result.message}，返还了兽诀！`);
      } else {
        showSuccess(result.message);
      }

      setSelectedSkill(null);
      setShowForgetConfirm(false);
    } else {
      showError(result.message);
    }
  }, [pet, selectedSkill, playerGold, onPetUpdate, onGoldChange, onBeastScrollGain]);

  // 锁定/解锁技能
  const handleLockSkill = useCallback(() => {
    if (!selectedSkill) return;

    if (selectedSkill.locked) {
      // 解锁
      const result = beastScrollService.unlockSkill(pet, selectedSkill.id);
      if (result.success) {
        onPetUpdate(result.pet);
        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    } else {
      // 锁定
      const result = beastScrollService.lockSkill(pet, selectedSkill.id, playerGold, lockPearls > 0);
      if (result.success) {
        onPetUpdate(result.pet);
        onGoldChange(-(result.goldCost || 0));
        onLockPearlChange(-1);
        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    }

    setSelectedSkill(null);
    setShowLockConfirm(false);
  }, [pet, selectedSkill, playerGold, lockPearls, onPetUpdate, onGoldChange, onLockPearlChange]);

  // 解锁技能格
  const handleUnlockSlot = useCallback((slotIndex: number) => {
    const slotConfig = getSkillSlotUnlockConfig(slotIndex);
    if (!slotConfig) return;

    if (slotConfig.unlockMethod === 'level') {
      const result = beastScrollService.unlockSlotByLevel(pet, slotIndex);
      const unlockGoldCost = getSlotUnlockGoldCost(slotIndex, pet.quality);
      if (result.success) {
        onPetUpdate(result.pet);
        onGoldChange(-unlockGoldCost);
        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    } else if (slotConfig.unlockMethod === 'item') {
      const unlockItem = getSlotUnlockItem(slotIndex);
      if (!unlockItem) return;

      const hasItem = unlockItem.itemId === 'item_golden_dew' ? goldenDews >= unlockItem.count : immortalDews >= unlockItem.count;
      const itemCount = unlockItem.itemId === 'item_golden_dew' ? goldenDews : immortalDews;

      const result = beastScrollService.unlockSlotWithItem(pet, slotIndex, hasItem, itemCount);
      if (result.success) {
        onPetUpdate(result.pet);
        onGoldChange(-(result.goldCost || 0));

        if (unlockItem.itemId === 'item_golden_dew') {
          onGoldenDewChange(-unlockItem.count);
        } else {
          onImmortalDewChange(-unlockItem.count);
        }

        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    }

    setShowUnlockSlotConfirm(null);
  }, [pet, playerGold, goldenDews, immortalDews, onPetUpdate, onGoldChange, onGoldenDewChange, onImmortalDewChange]);

  // 计算打书成功率预览
  const getSuccessRatePreview = useCallback((scroll: BeastScrollConfig): number => {
    return beastScrollService.calculateLearnSuccessRate(pet, scroll);
  }, [pet]);

  // 检查技能互斥
  const checkExclusive = useCallback((scroll: BeastScrollConfig): { hasConflict: boolean; conflictingSkill?: PetSkill } => {
    return beastScrollService.checkExclusiveConflict(scroll.skill.skillId!, pet.skills);
  }, [pet.skills]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#252540] w-full max-w-2xl rounded-2xl p-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{pet.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{pet.nickname || pet.name}</h3>
              <p className="text-sm text-gray-400">
                Lv.{pet.level} {slotConfig.name} | 技能 {currentSlotUsage}/{availableSlots}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white touch-btn text-2xl"
          >
            ×
          </button>
        </div>

        {/* 技能槽状态 */}
        <div className="mb-4 bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">技能格</span>
            <span className="text-sm text-yellow-400">
              锁定: {lockedSkillsCount}/{SKILL_LOCK_CONFIG.maxLockedSkills}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {slotStatus.map((slot) => (
              <div
                key={slot.slot}
                onClick={() => {
                  if (!slot.isUnlocked && slot.needsItemUnlock) {
                    setShowUnlockSlotConfirm(slot.slot);
                  } else if (slot.skill) {
                    setSelectedSkill(selectedSkill?.id === slot.skill.id ? null : slot.skill);
                  }
                }}
                className={`relative h-12 rounded flex items-center justify-center text-xs cursor-pointer transition-all active:scale-95 ${
                  !slot.isUnlocked
                    ? 'bg-gray-700/50 border border-gray-600 border-dashed'
                    : slot.skill
                      ? slot.skill.locked
                        ? 'bg-green-700 border-2 border-green-400'
                        : 'bg-blue-600 border border-blue-400'
                      : 'bg-gray-600 border border-gray-500'
                }`}
              >
                {slot.isUnlocked ? (
                  slot.skill ? (
                    <div className="flex flex-col items-center">
                      <span className="truncate w-full px-1">{slot.skill.name}</span>
                      {slot.skill.level && slot.skill.level > 1 && (
                        <span className="text-[10px] text-yellow-300">Lv.{slot.skill.level}</span>
                      )}
                      {slot.skill.locked && (
                        <span className="absolute top-0 right-0 text-[10px]">🔒</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">空</span>
                  )
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-gray-500">
                      {slot.unlockLevel ? `Lv.${slot.unlockLevel}` : slot.unlockItem === 'item_golden_dew' ? '💧' : '✨'}
                    </span>
                    {!slot.isDefault && !slot.isLevelUnlocked && (
                      <span className="text-[10px] text-gray-600">解锁</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>💡 点击锁定技能格可解锁</span>
            <span>💡 点击技能可锁定/遗忘</span>
          </div>
        </div>

        {/* 当前技能详情 */}
        {selectedSkill && !showForgetConfirm && !showLockConfirm && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">{selectedSkill.name}</span>
                  {selectedSkill.level && selectedSkill.level > 1 && (
                    <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded">
                      Lv.{selectedSkill.level}
                    </span>
                  )}
                  {selectedSkill.locked && (
                    <span className="text-xs bg-green-600 px-2 py-0.5 rounded">已锁定</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{selectedSkill.description}</p>
                {selectedSkill.multiplier && (
                  <p className="text-sm text-green-400 mt-1">
                    效果倍率: {(beastScrollService.calculateSkillMultiplier(selectedSkill) * 100).toFixed(0)}%
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              {/* 锁定按钮 */}
              <button
                onClick={() => setShowLockConfirm(true)}
                disabled={
                  selectedSkill.locked
                    ? false
                    : lockedSkillsCount >= SKILL_LOCK_CONFIG.maxLockedSkills || lockPearls <= 0
                }
                className={`flex-1 py-2 rounded text-sm min-h-[44px] active:scale-95 ${
                  selectedSkill.locked
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-blue-600 hover:bg-blue-500 disabled:opacity-50'
                }`}
              >
                {selectedSkill.locked
                  ? '解锁技能'
                  : `锁定技能 (-${SKILL_LOCK_CONFIG.lockGoldCost}金币, 1锁妖珠)`}
              </button>

              {/* 遗忘按钮 */}
              <button
                onClick={() => setShowForgetConfirm(true)}
                disabled={selectedSkill.locked}
                className="flex-1 py-2 rounded bg-red-600/30 hover:bg-red-600/50 disabled:opacity-50 text-sm min-h-[44px] active:scale-95"
              >
                遗忘技能
              </button>
            </div>
          </div>
        )}

        {/* 锁定确认 */}
        {showLockConfirm && selectedSkill && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
            <p className="text-sm mb-2">
              {selectedSkill.locked
                ? `确定要解锁技能【${selectedSkill.name}】吗？`
                : `确定要锁定技能【${selectedSkill.name}】吗？`}
            </p>
            {!selectedSkill.locked && (
              <p className="text-xs text-gray-400 mb-3">
                消耗 {SKILL_LOCK_CONFIG.lockGoldCost} 金币和 1 个锁妖珠。
                锁定后打书成功率降低 {SKILL_LOCK_CONFIG.lockSuccessRatePenalty}%。
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleLockSkill}
                disabled={!selectedSkill.locked && (playerGold < SKILL_LOCK_CONFIG.lockGoldCost || lockPearls <= 0)}
                className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm min-h-[44px] active:scale-95"
              >
                确认{selectedSkill.locked ? '解锁' : '锁定'}
              </button>
              <button
                onClick={() => setShowLockConfirm(false)}
                className="flex-1 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm min-h-[44px] active:scale-95"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 遗忘确认 */}
        {showForgetConfirm && selectedSkill && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
            <p className="text-sm mb-2">
              确定要遗忘技能【{selectedSkill.name}】吗？
            </p>
            <p className="text-xs text-gray-400 mb-3">
              消耗 1000 金币，有 30% 概率返还兽诀
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleForgetSkill}
                disabled={playerGold < 1000}
                className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm min-h-[44px] active:scale-95"
              >
                确认遗忘
              </button>
              <button
                onClick={() => setShowForgetConfirm(false)}
                className="flex-1 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm min-h-[44px] active:scale-95"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 技能格解锁确认 */}
        {showUnlockSlotConfirm && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500 rounded-lg">
            <p className="text-sm mb-2">
              确定要解锁第 {showUnlockSlotConfirm} 个技能格吗？
            </p>
            {(() => {
              const goldCost = getSlotUnlockGoldCost(showUnlockSlotConfirm, pet.quality);
              const unlockItem = getSlotUnlockItem(showUnlockSlotConfirm);

              return (
                <p className="text-xs text-gray-400 mb-3">
                  消耗 {goldCost} 金币
                  {unlockItem && (
                    <span>
                      ，{unlockItem.count} 个{unlockItem.itemId === 'item_golden_dew' ? '金柳露' : '仙露'}
                    </span>
                  )}
                </p>
              );
            })()}
            <div className="flex gap-2">
              <button
                onClick={() => handleUnlockSlot(showUnlockSlotConfirm)}
                className="flex-1 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-sm min-h-[44px] active:scale-95"
              >
                确认解锁
              </button>
              <button
                onClick={() => setShowUnlockSlotConfirm(null)}
                className="flex-1 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm min-h-[44px] active:scale-95"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 兽诀使用 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-400">使用兽诀</h4>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1"
              >
                <option value="all">全部类别</option>
                <option value="attack">攻击</option>
                <option value="defense">防御</option>
                <option value="support">辅助</option>
                <option value="magic">法术</option>
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as TierFilter)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1"
              >
                <option value="all">全部等级</option>
                <option value="low">低级</option>
                <option value="high">高级</option>
              </select>
            </div>
          </div>

          {availableScrolls.length === 0 ? (
            <div className="text-center text-gray-500 py-4 bg-gray-800/30 rounded-lg">
              背包中没有符合条件的兽诀
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableScrolls.map((scroll) => {
                const checkResult = beastScrollService.checkRestrictions(pet, scroll);
                const existingSkill = beastScrollService.findExistingSkill(pet, scroll.skill.skillId!);
                const exclusiveCheck = checkExclusive(scroll);
                const canLearn = checkResult.canLearn && !exclusiveCheck.hasConflict;
                const successRate = getSuccessRatePreview(scroll);

                return (
                  <div
                    key={scroll.id}
                    onClick={() => canLearn && setSelectedScroll(scroll.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-all border ${tierBorders[scroll.tier]} ${
                      !canLearn
                        ? 'opacity-50 bg-gray-700/30'
                        : selectedScroll === scroll.id
                          ? `${tierColors[scroll.tier]} scale-105`
                          : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[scroll.category]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{scroll.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <span>{scroll.tier === 'high' ? '高级' : '低级'}</span>
                          <span>|</span>
                          <span>
                            {existingSkill ? '升级' : hasEmptySlot ? '学习' : `覆盖 ${successRate.toFixed(0)}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!canLearn && (
                      <div className="text-xs text-red-400 mt-1">
                        {exclusiveCheck.hasConflict
                          ? `与【${exclusiveCheck.conflictingSkill?.name}】互斥`
                          : checkResult.reason || '条件不满足'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 兽诀使用确认 */}
        {selectedScroll && (
          <div className="mb-4 p-3 bg-purple-900/30 border border-purple-500 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{getBeastScroll(selectedScroll)?.name}</span>
              <button
                onClick={() => setSelectedScroll(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              {getBeastScroll(selectedScroll)?.description}
            </p>
            <div className="text-xs text-yellow-400 mb-3">
              {!hasEmptySlot && `成功率: ${getSuccessRatePreview(getBeastScroll(selectedScroll)!).toFixed(1)}%`}
              {hasEmptySlot && '技能格未满，100%成功'}
            </div>
            <button
              onClick={() => handleLearnScroll(selectedScroll)}
              disabled={isLearning}
              className="w-full py-2 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm min-h-[44px] active:scale-95"
            >
              {isLearning ? '学习中...' : '确认使用'}
            </button>
          </div>
        )}

        {/* 结果提示 */}
        {lastResult && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              lastResult.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'
            }`}
          >
            <p className="text-sm">{lastResult.message}</p>
          </div>
        )}

        {/* 道具状态 */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-400">锁妖珠</span>
            <div className="text-lg font-bold text-purple-400">{lockPearls}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-400">金柳露</span>
            <div className="text-lg font-bold text-blue-400">{goldenDews}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-400">仙露</span>
            <div className="text-lg font-bold text-yellow-400">{immortalDews}</div>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-medium touch-btn bg-gray-600 hover:bg-gray-500"
        >
          关闭
        </button>

        {/* 说明 */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>宠物品质: 野生({slotConfig.minSlots}-{slotConfig.maxSlots}格) | 宝宝(4-7格) | 变异(5-9格) | 神兽(8-12格)</p>
          <p>技能等级: 1-5级，每级效果+10%~25%</p>
          <p>技能互斥: 连击/必杀、隐身/感知、吸血/高级吸血等互斥</p>
          <p>锁定技能: 最多锁定3个，锁定后打书成功率-15%</p>
        </div>
      </div>
    </div>
  );
}
