// 宠物合成弹窗组件 - 合宠系统UI

import { useState, useCallback, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { playerPets } from '@/signals';
import { petFusionService } from '@/services/petFusionService';
import { getPRNG } from '@/utils/prng';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import type { PetAptitude, FusionResult } from '@/types';

interface PetFusionModalProps {
  onClose: () => void;
  initialMainPetId?: string;
  playerGold: number;
  onFusionComplete?: (result: FusionResult) => void;
  onGoldChange?: (cost: number) => void;
}

type FusionState = 'idle' | 'fusing' | 'success';

export function PetFusionModal({
  onClose,
  initialMainPetId,
  playerGold,
  onFusionComplete,
  onGoldChange,
}: PetFusionModalProps) {
  useSignals();

  const pets = playerPets.value;

  // 状态
  const [mainPetId, setMainPetId] = useState<string | null>(initialMainPetId ?? null);
  const [subPetId, setSubPetId] = useState<string | null>(null);
  const [fusionState, setFusionState] = useState<FusionState>('idle');
  const [result, setResult] = useState<FusionResult | null>(null);

  // 获取选中的宠物
  const mainPet = useMemo(() => {
    return pets.find(p => p.id === mainPetId) ?? null;
  }, [pets, mainPetId]);

  const subPet = useMemo(() => {
    return pets.find(p => p.id === subPetId) ?? null;
  }, [pets, subPetId]);

  // 验证合宠
  const validation = useMemo(() => {
    if (!mainPet || !subPet) return { valid: true };
    return petFusionService.validateFusion(mainPet, subPet);
  }, [mainPet, subPet]);

  // 获取预览信息
  const preview = useMemo(() => {
    if (!mainPet || !subPet) return null;
    return petFusionService.getFusionPreview(mainPet, subPet);
  }, [mainPet, subPet]);

  // 是否可以合宠
  const canFuse = useMemo(() => {
    if (!mainPet || !subPet) return false;
    if (!validation.valid) return false;
    if (!preview) return false;
    if (playerGold < preview.goldCost) return false;
    return true;
  }, [mainPet, subPet, validation, preview, playerGold]);

  // 可选择为主宠物的列表
  const availableMainPets = useMemo(() => {
    return pets;
  }, [pets]);

  // 可选择为副宠物的列表（排除主宠物，且必须是同类型宠物）
  const availableSubPets = useMemo(() => {
    if (!mainPet) return [];
    return pets.filter(p => p.id !== mainPet.id && p.baseId === mainPet.baseId);
  }, [pets, mainPet]);

  // 执行合宠
  const handleFuse = useCallback(() => {
    if (!mainPet || !subPet || !canFuse) return;

    setFusionState('fusing');
    setResult(null);

    setTimeout(() => {
      const prng = getPRNG();
      const fusionResult = petFusionService.fusePets(mainPet, subPet, prng);

      // 更新宠物列表：移除主宠物和副宠物，添加新宠物
      const newPets = pets.filter(p => p.id !== mainPet.id && p.id !== subPet.id);
      newPets.push(fusionResult.pet);
      playerPets.value = newPets;

      // 扣除金币
      if (onGoldChange && preview) {
        onGoldChange(preview.goldCost);
      }

      setFusionState('success');
      setResult(fusionResult);

      onFusionComplete?.(fusionResult);
    }, 1500);
  }, [mainPet, subPet, canFuse, pets, preview, onGoldChange, onFusionComplete]);

  // 重置状态
  const handleReset = useCallback(() => {
    setMainPetId(null);
    setSubPetId(null);
    setFusionState('idle');
    setResult(null);
  }, []);

  // 渲染资质范围预览
  const renderAptitudePreview = () => {
    if (!preview) return null;

    const statKeys: (keyof PetAptitude)[] = ['attack', 'defense', 'hp', 'mp', 'speed', 'dodge'];

    return (
      <div className="space-y-2">
        {statKeys.map(key => {
          const range = preview.aptitudeRange[key];
          if (!range) return null;
          const diff = range.max - range.min;
          const isSameRange = diff < 0.01;

          return (
            <div
              key={key}
              className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-[var(--game-border)]"
            >
              <span className="text-sm text-[var(--game-text-muted)]">
                {petFusionService.getAptitudeName(key)}
              </span>
              <div className="flex items-center gap-2">
                {isSameRange ? (
                  <span className="text-white text-sm font-semibold">
                    {range.min.toFixed(2)}
                  </span>
                ) : (
                  <>
                    <span className="text-[var(--game-text-dim)] text-xs">
                      {range.min.toFixed(2)}
                    </span>
                    <span className="text-[var(--game-text-dim)]">~</span>
                    <span className="text-white text-sm font-semibold">
                      {range.max.toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染技能池预览
  const renderSkillPoolPreview = () => {
    if (!preview) return null;

    if (preview.mergedSkillPool.length === 0) {
      return (
        <div className="text-center py-4 text-[var(--game-text-dim)] text-sm">
          暂无技能
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {preview.mergedSkillPool.map(skill => {
          const isFromMain = mainPet?.skills.some(s => s.id === skill.id);
          const isFromSub = subPet?.skills.some(s => s.id === skill.id);
          const isShared = isFromMain && isFromSub;

          return (
            <span
              key={skill.id}
              className="game-tag text-xs"
              style={{
                background: isShared
                  ? 'linear-gradient(180deg, #a855f720 0%, #a855f710 100%)'
                  : isFromMain
                  ? 'linear-gradient(180deg, #3b82f620 0%, #3b82f610 100%)'
                  : 'linear-gradient(180deg, #22c55e20 0%, #22c55e10 100%)',
                border: `1px solid ${isShared ? '#a855f750' : isFromMain ? '#3b82f650' : '#22c55e50'}`,
                color: isShared ? '#a855f7' : isFromMain ? '#3b82f6' : '#22c55e',
              }}
            >
              {skill.name}
              {isShared && ' (共)'}
              {!isShared && isFromMain && ' (主)'}
              {!isShared && isFromSub && ' (副)'}
            </span>
          );
        })}
      </div>
    );
  };

  // 渲染合宠结果
  const renderFusionResult = () => {
    if (!result || !mainPet) return null;

    const newPet = result.pet;

    return (
      <div className="space-y-4">
        {/* 新宠物信息 */}
        <div
          className="game-card p-4"
          style={{
            borderColor: getQualityColor(newPet.rarity),
            boxShadow: `0 0 25px ${getQualityColor(newPet.rarity)}30`,
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{newPet.icon}</span>
            <div className="flex-1">
              <div
                className="font-bold text-lg"
                style={{ color: getQualityColor(newPet.rarity) }}
              >
                {newPet.nickname || newPet.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="game-tag text-xs"
                  style={{
                    background: `linear-gradient(180deg, ${getQualityColor(newPet.rarity)}20 0%, ${getQualityColor(newPet.rarity)}10 100%)`,
                    border: `1px solid ${getQualityColor(newPet.rarity)}50`,
                  }}
                >
                  {getQualityName(newPet.rarity)}
                </span>
                <span className="text-xs text-[var(--game-text-dim)]">
                  Lv.{newPet.level}
                </span>
                <span className="text-xs text-[var(--game-gold)]">
                  {newPet.skills.length}/{newPet.maxSkills} 技能
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 额外收益提示 */}
        <div className="space-y-2">
          {result.rarityUp && (
            <div className="flex items-center gap-2 text-sm text-[#a855f7] bg-[#1a1a3a] rounded-lg px-3 py-2 border border-[#3a3a6a]">
              <span>✨</span>
              <span>稀有度提升！</span>
            </div>
          )}
          {result.bonusSkillSlot && (
            <div className="flex items-center gap-2 text-sm text-[#22c55e] bg-[#1a2a1a] rounded-lg px-3 py-2 border border-[#2a4a2a]">
              <span>🎁</span>
              <span>获得额外技能槽！</span>
            </div>
          )}
          {result.absorbedSkills.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[var(--game-gold)] bg-[#2a2a1a] rounded-lg px-3 py-2 border border-[#4a4a2a]">
              <span>💫</span>
              <span>吸收技能: {result.absorbedSkills.join(', ')}</span>
            </div>
          )}
        </div>

        {/* 资质变化 */}
        <div className="game-panel p-4">
          <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>资质变化</span>
          </h4>
          <div className="space-y-2">
            {result.aptitudeChanges.map(change => {
              const diff = change.newValue - change.oldValue;
              const isIncrease = diff > 0.001;
              const isDecrease = diff < -0.001;

              return (
                <div
                  key={change.stat}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-[var(--game-text-muted)]">
                    {petFusionService.getAptitudeName(change.stat)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--game-text-dim)]">
                      {change.oldValue.toFixed(2)}
                    </span>
                    <span className="text-[var(--game-text-dim)]">→</span>
                    <span
                      className={`font-semibold ${
                        isIncrease
                          ? 'text-[#4ade80]'
                          : isDecrease
                          ? 'text-[#f87171]'
                          : 'text-[var(--game-text)]'
                      }`}
                    >
                      {change.newValue.toFixed(2)}
                    </span>
                    {isIncrease && (
                      <span className="text-[#4ade80] text-xs">
                        +{(diff).toFixed(2)}
                      </span>
                    )}
                    {isDecrease && (
                      <span className="text-[#f87171] text-xs">
                        {(diff).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="game-modal w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="game-modal-header flex-shrink-0">
          <h2 className="game-modal-title flex items-center gap-2">
            <span>🔮</span>
            <span>宠物合成</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[var(--game-text-muted)] hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {fusionState === 'success' && result ? (
            // 合宠成功结果
            renderFusionResult()
          ) : (
            <>
              {/* 宠物选择区 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 主宠物选择 */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                    <span>⭐</span>
                    <span>主宠物</span>
                  </h4>
                  {mainPet ? (
                    <div
                      className="game-card p-3 cursor-pointer hover:border-[var(--game-gold)] transition-all"
                      style={{
                        borderColor: getQualityColor(mainPet.rarity),
                      }}
                      onClick={() => setMainPetId(null)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{mainPet.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-medium truncate"
                            style={{ color: getQualityColor(mainPet.rarity) }}
                          >
                            {mainPet.nickname || mainPet.name}
                          </div>
                          <div className="text-xs text-[var(--game-text-dim)]">
                            {getQualityName(mainPet.rarity)} · Lv.{mainPet.level}
                          </div>
                          <div className="text-xs text-[var(--game-text-dim)]">
                            {mainPet.skills.length}/{mainPet.maxSkills} 技能
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {availableMainPets.length === 0 ? (
                        <div className="text-center py-6 text-[var(--game-text-dim)] text-sm">
                          暂无宠物
                        </div>
                      ) : (
                        availableMainPets.map(pet => (
                          <button
                            key={pet.id}
                            onClick={() => {
                              setMainPetId(pet.id);
                              setSubPetId(null); // 重置副宠物选择
                            }}
                            className="game-list-item text-left"
                          >
                            <span className="text-2xl">{pet.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium truncate"
                                style={{ color: getQualityColor(pet.rarity) }}
                              >
                                {pet.nickname || pet.name}
                              </div>
                              <div className="text-xs text-[var(--game-text-dim)]">
                                {getQualityName(pet.rarity)} · Lv.{pet.level}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* 副宠物选择 */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                    <span>🔄</span>
                    <span>副宠物</span>
                    {subPet && <span className="text-xs text-[#f87171]">(合成后消失)</span>}
                  </h4>
                  {subPet ? (
                    <div
                      className="game-card p-3 cursor-pointer hover:border-[#f87171] transition-all"
                      style={{
                        borderColor: getQualityColor(subPet.rarity),
                        opacity: 0.8,
                      }}
                      onClick={() => setSubPetId(null)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{subPet.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-medium truncate"
                            style={{ color: getQualityColor(subPet.rarity) }}
                          >
                            {subPet.nickname || subPet.name}
                          </div>
                          <div className="text-xs text-[var(--game-text-dim)]">
                            {getQualityName(subPet.rarity)} · Lv.{subPet.level}
                          </div>
                          <div className="text-xs text-[var(--game-text-dim)]">
                            {subPet.skills.length}/{subPet.maxSkills} 技能
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {!mainPet ? (
                        <div className="text-center py-6 text-[var(--game-text-dim)] text-sm">
                          请先选择主宠物
                        </div>
                      ) : availableSubPets.length === 0 ? (
                        <div className="text-center py-6 text-[var(--game-text-dim)] text-sm">
                          没有可用的同类型宠物
                        </div>
                      ) : (
                        availableSubPets.map(pet => (
                          <button
                            key={pet.id}
                            onClick={() => setSubPetId(pet.id)}
                            className="game-list-item text-left opacity-80 hover:opacity-100"
                          >
                            <span className="text-2xl">{pet.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium truncate"
                                style={{ color: getQualityColor(pet.rarity) }}
                              >
                                {pet.nickname || pet.name}
                              </div>
                              <div className="text-xs text-[var(--game-text-dim)]">
                                {getQualityName(pet.rarity)} · Lv.{pet.level}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 验证错误 */}
              {!validation.valid && (
                <div className="text-sm text-[#f87171] flex items-center gap-2 bg-[#2a1a1a] rounded-lg px-4 py-3 border border-[#4a2a2a]">
                  <span>⚠️</span>
                  <span>{validation.reason}</span>
                </div>
              )}

              {/* 预览面板 */}
              {preview && validation.valid && (
                <div className="space-y-4">
                  {/* 资质范围预览 */}
                  <div className="game-panel p-4">
                    <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                      <span>📈</span>
                      <span>资质范围预览</span>
                      <span className="text-xs text-[var(--game-gold)] ml-auto">
                        {preview.overflowChance}%概率超范围
                      </span>
                    </h4>
                    {renderAptitudePreview()}
                  </div>

                  {/* 技能池预览 */}
                  <div className="game-panel p-4">
                    <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                      <span>✨</span>
                      <span>技能池 (每个技能60%保留)</span>
                    </h4>
                    {renderSkillPoolPreview()}
                  </div>

                  {/* 额外收益概率 */}
                  <div className="game-panel p-4">
                    <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
                      <span>🎁</span>
                      <span>额外收益概率</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--game-text-muted)]">额外技能槽</span>
                        <span className="text-[#4ade80]">{preview.bonusSlotChance}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--game-text-muted)]">稀有度提升</span>
                        <span className="text-[#a855f7]">{preview.rarityUpChance}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 消耗 */}
                  <div className="game-panel p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--game-text-muted)] flex items-center gap-2">
                        <span>💰</span>
                        <span>消耗金币</span>
                      </span>
                      <span
                        className={`font-bold ${
                          playerGold < preview.goldCost ? 'text-[#f87171]' : 'text-[var(--game-gold)]'
                        }`}
                      >
                        {preview.goldCost.toLocaleString()}
                      </span>
                    </div>
                    {playerGold < preview.goldCost && (
                      <div className="mt-2 text-xs text-[#f87171] flex items-center gap-1">
                        <span>⚠️</span>
                        <span>金币不足</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex-shrink-0 p-5 pt-0 space-y-3">
          {fusionState === 'fusing' ? (
            <div className="game-btn game-btn-primary w-full opacity-70">
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">🌀</span>
                <span>合成中...</span>
              </span>
            </div>
          ) : fusionState === 'success' ? (
            <>
              <button
                onClick={handleReset}
                className="game-btn game-btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔄</span>
                  <span>继续合宠</span>
                </span>
              </button>
              <button
                onClick={onClose}
                className="game-btn w-full opacity-70 hover:opacity-100"
              >
                关闭
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFuse}
                disabled={!canFuse}
                className="game-btn game-btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔮</span>
                  <span>开始合成</span>
                </span>
              </button>
              <button
                onClick={onClose}
                className="game-btn w-full opacity-70 hover:opacity-100"
              >
                关闭
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetFusionModal;
