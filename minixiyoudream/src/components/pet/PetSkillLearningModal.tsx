// 宠物技能学习弹窗组件 - 打书系统UI

import { useState, useCallback, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { playerPets, activePet } from '@/signals';
import { petSkillService } from '@/services/petSkillService';
import { getSkillBook, SKILL_BOOKS, SKILL_PROTECTION_ITEM } from '@/constants/skillBooks';
import { getPRNG } from '@/utils/prng';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import type { Pet, PetSkill } from '@/types';

interface PetSkillLearningModalProps {
  onClose: () => void;
  initialPetId?: string;
  initialSkillBookId?: string;
  onSkillLearned?: (pet: Pet, result: {
    success: boolean;
    newSkill?: PetSkill;
    overriddenSkill?: PetSkill;
  }) => void;
}

type LearningState = 'idle' | 'selecting' | 'learning' | 'success' | 'failed';

export function PetSkillLearningModal({
  onClose,
  initialPetId,
  initialSkillBookId,
  onSkillLearned,
}: PetSkillLearningModalProps) {
  useSignals();

  const pets = playerPets.value;
  const currentActivePet = activePet.value;

  // 状态
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    initialPetId ?? currentActivePet?.id ?? null
  );
  const [selectedSkillBookId, setSelectedSkillBookId] = useState<string | null>(
    initialSkillBookId ?? null
  );
  const [useProtection, setUseProtection] = useState(false);
  const [learningState, setLearningState] = useState<LearningState>('idle');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    newSkill?: PetSkill;
    overriddenSkill?: PetSkill;
    successRate?: number;
  } | null>(null);

  // 获取选中的宠物
  const selectedPet = useMemo(() => {
    return pets.find(p => p.id === selectedPetId) ?? null;
  }, [pets, selectedPetId]);

  // 获取选中的技能书
  const selectedSkillBook = useMemo(() => {
    return selectedSkillBookId ? getSkillBook(selectedSkillBookId) : null;
  }, [selectedSkillBookId]);

  // 计算学习限制检查结果
  const restrictionCheck = useMemo(() => {
    if (!selectedPet || !selectedSkillBook) return null;
    return petSkillService.checkRestrictions(selectedPet, selectedSkillBook);
  }, [selectedPet, selectedSkillBook]);

  // 检查是否已学习该技能
  const alreadyLearned = useMemo(() => {
    if (!selectedPet || !selectedSkillBook) return false;
    return petSkillService.hasSkill(selectedPet, selectedSkillBook.skillId);
  }, [selectedPet, selectedSkillBook]);

  // 计算成功率
  const successRate = useMemo(() => {
    if (!selectedPet || !selectedSkillBook) return 0;
    if (selectedPet.skills.length < selectedPet.maxSkills) {
      return 100;
    }
    if (useProtection) {
      return 100;
    }
    return petSkillService.calculateOverrideSuccessRate(selectedSkillBook, selectedPet);
  }, [selectedPet, selectedSkillBook, useProtection]);

  // 是否可以学习
  const canLearn = useMemo(() => {
    if (!selectedPet || !selectedSkillBook) return false;
    if (alreadyLearned) return false;
    if (restrictionCheck && !restrictionCheck.canLearn) return false;
    return true;
  }, [selectedPet, selectedSkillBook, alreadyLearned, restrictionCheck]);

  // 模拟拥有的技能书（实际项目中应该从背包数据获取）
  const ownedSkillBooks = useMemo(() => {
    // 这里返回所有技能书作为演示
    // 实际项目中应该从背包系统中获取
    return Object.values(SKILL_BOOKS);
  }, []);

  // 执行学习技能
  const handleLearnSkill = useCallback(() => {
    if (!selectedPet || !selectedSkillBook || !canLearn) return;

    setLearningState('learning');
    setResult(null);

    // 使用setTimeout模拟学习动画
    setTimeout(() => {
      const prng = getPRNG();
      const learnResult = petSkillService.teachSkillFromBook(
        selectedPet,
        selectedSkillBookId!,
        useProtection,
        prng
      );

      if (learnResult.success) {
        // 更新宠物数据
        const petIndex = pets.findIndex(p => p.id === selectedPet.id);
        if (petIndex >= 0) {
          const newPets = [...pets];
          newPets[petIndex] = learnResult.pet;
          playerPets.value = newPets;
        }

        setLearningState('success');
        setResult({
          success: true,
          message: learnResult.overriddenSkill
            ? `成功学习${learnResult.newSkill?.name}！覆盖了${learnResult.overriddenSkill.name}`
            : `成功学习${learnResult.newSkill?.name}！`,
          newSkill: learnResult.newSkill,
          overriddenSkill: learnResult.overriddenSkill,
          successRate: learnResult.successRate,
        });

        onSkillLearned?.(learnResult.pet, {
          success: true,
          newSkill: learnResult.newSkill,
          overriddenSkill: learnResult.overriddenSkill,
        });
      } else {
        setLearningState('failed');
        setResult({
          success: false,
          message: learnResult.reason || '学习失败',
          successRate: learnResult.successRate,
        });

        onSkillLearned?.(selectedPet, { success: false });
      }
    }, 1200);
  }, [selectedPet, selectedSkillBook, selectedSkillBookId, canLearn, useProtection, pets, onSkillLearned]);

  // 重置状态
  const handleReset = useCallback(() => {
    setLearningState('idle');
    setResult(null);
  }, []);

  // 获取技能槽状态文本
  const getSkillSlotText = () => {
    if (!selectedPet) return '';
    return `${selectedPet.skills.length}/${selectedPet.maxSkills}`;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="game-modal w-full max-w-lg animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="game-modal-header flex-shrink-0">
          <h2 className="game-modal-title flex items-center gap-2">
            <span>📚</span>
            <span>宠物打书</span>
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
          {/* 宠物选择 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
              <span>🐾</span>
              <span>选择宠物</span>
            </h4>
            {pets.length === 0 ? (
              <div className="text-center py-8 text-[var(--game-text-dim)]">
                暂无宠物
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setSelectedPetId(pet.id);
                      handleReset();
                    }}
                    className={`
                      game-list-item text-left
                      ${selectedPetId === pet.id ? 'selected' : ''}
                    `}
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
                        Lv.{pet.level}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 选中宠物信息 */}
          {selectedPet && (
            <div className="game-card p-4" style={{
              borderColor: getQualityColor(selectedPet.rarity),
            }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPet.icon}</span>
                <div className="flex-1">
                  <div
                    className="font-bold"
                    style={{ color: getQualityColor(selectedPet.rarity) }}
                  >
                    {selectedPet.nickname || selectedPet.name}
                  </div>
                  <div className="text-xs text-[var(--game-text-dim)]">
                    {getQualityName(selectedPet.rarity)} · Lv.{selectedPet.level}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--game-text-muted)]">技能槽</div>
                  <div className="font-bold text-[var(--game-gold)]">{getSkillSlotText()}</div>
                </div>
              </div>

              {/* 当前技能列表 */}
              <div className="mt-3 pt-3 border-t border-[var(--game-border)]">
                <div className="text-xs text-[var(--game-text-dim)] mb-2">当前技能</div>
                {selectedPet.skills.length === 0 ? (
                  <div className="text-xs text-[var(--game-text-dim)] italic">暂无技能</div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedPet.skills.map(skill => (
                      <span
                        key={skill.id}
                        className="game-tag text-xs"
                        style={{
                          background: `linear-gradient(180deg, ${petSkillService.getSkillTypeColor(skill.type)}20 0%, ${petSkillService.getSkillTypeColor(skill.type)}10 100%)`,
                          border: `1px solid ${petSkillService.getSkillTypeColor(skill.type)}50`,
                          color: petSkillService.getSkillTypeColor(skill.type),
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 技能书选择 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
              <span>📖</span>
              <span>选择技能书</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {ownedSkillBooks.map(book => {
                const isSelected = selectedSkillBookId === book.id;
                const isDisabled = selectedPet && (
                  petSkillService.hasSkill(selectedPet, book.skillId) ||
                  !petSkillService.checkRestrictions(selectedPet, book).canLearn
                );

                return (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedSkillBookId(book.id);
                      handleReset();
                    }}
                    disabled={!!isDisabled && !isSelected}
                    className={`
                      game-list-item text-left
                      ${isSelected ? 'selected' : ''}
                      ${isDisabled && !isSelected ? 'opacity-50' : ''}
                    `}
                    style={{
                      borderColor: isSelected ? getQualityColor(book.rarity) : undefined,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${getQualityColor(book.rarity)}20 0%, ${getQualityColor(book.rarity)}05 100%)`,
                        border: `1px solid ${getQualityColor(book.rarity)}50`,
                      }}
                    >
                      📜
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-medium truncate"
                        style={{ color: getQualityColor(book.rarity) }}
                      >
                        {book.name}
                      </div>
                      <div className="text-xs text-[var(--game-text-dim)] truncate">
                        {book.description}
                      </div>
                      {book.overrideBonus && book.overrideBonus > 0 && (
                        <div className="text-xs text-[var(--game-gold)]">
                          成功率+{book.overrideBonus}%
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 学习预览 */}
          {selectedSkillBook && (
            <div className="game-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[var(--game-text-muted)]">学习预览</span>
                <span
                  className="font-bold text-lg"
                  style={{ color: getQualityColor(selectedSkillBook.rarity) }}
                >
                  {successRate.toFixed(0)}%
                </span>
              </div>

              {/* 限制检查 */}
              {restrictionCheck && !restrictionCheck.canLearn && (
                <div className="text-sm text-[#f87171] mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{restrictionCheck.reason}</span>
                </div>
              )}

              {/* 已学习提示 */}
              {alreadyLearned && (
                <div className="text-sm text-[#fbbf24] mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>宠物已学习此技能</span>
                </div>
              )}

              {/* 技能需求 */}
              <div className="space-y-1 text-xs text-[var(--game-text-dim)]">
                {petSkillService.formatSkillBookRequirements(selectedSkillBook).map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* 保护道具选项 */}
              {selectedPet && selectedPet.skills.length >= selectedPet.maxSkills && (
                <div className="mt-3 pt-3 border-t border-[var(--game-border)]">
                  <button
                    onClick={() => setUseProtection(!useProtection)}
                    className={`
                      w-full p-3 rounded-lg flex items-center gap-3 transition-all
                      ${useProtection
                        ? 'bg-[#1a2a3a] border border-[#3a6a9a]'
                        : 'bg-black/20 border border-[var(--game-border)]'}
                    `}
                  >
                    <span className="text-2xl">{SKILL_PROTECTION_ITEM.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-[var(--game-gold)]">
                        {SKILL_PROTECTION_ITEM.name}
                      </div>
                      <div className="text-xs text-[var(--game-text-dim)]">
                        {SKILL_PROTECTION_ITEM.description}
                      </div>
                    </div>
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${useProtection
                          ? 'bg-[var(--game-gold)] border-[var(--game-gold)]'
                          : 'border-[var(--game-border)]'}
                      `}
                    >
                      {useProtection && (
                        <span className="text-xs text-[#1a1a2a]">✓</span>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 结果显示 */}
        {result && (
          <div className="flex-shrink-0 px-5 pb-4">
            <div
              className={`
                p-4 rounded-lg flex items-center gap-3 animate-slide-up
                ${result.success
                  ? 'bg-[#1a3a2a] border border-[#2a6a4a]'
                  : 'bg-[#3a1a1a] border border-[#6a2a2a]'}
              `}
            >
              <span className="text-3xl">
                {result.success ? '✨' : '💔'}
              </span>
              <div className="flex-1">
                <div className={`text-sm font-medium ${result.success ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {result.message}
                </div>
                {result.overriddenSkill && (
                  <div className="text-xs text-[var(--game-text-dim)] mt-1">
                    {result.overriddenSkill.name} 已被覆盖
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex-shrink-0 p-5 pt-0 space-y-3">
          {learningState === 'learning' ? (
            <div className="game-btn game-btn-primary w-full opacity-70">
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">🌀</span>
                <span>学习中...</span>
              </span>
            </div>
          ) : learningState === 'success' || learningState === 'failed' ? (
            <>
              <button
                onClick={handleReset}
                className="game-btn game-btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔄</span>
                  <span>继续打书</span>
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
                onClick={handleLearnSkill}
                disabled={!canLearn}
                className="game-btn game-btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📚</span>
                  <span>
                    {selectedPet && selectedPet.skills.length >= selectedPet.maxSkills
                      ? `学习技能 (${successRate.toFixed(0)}%)`
                      : '学习技能'}
                  </span>
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

export default PetSkillLearningModal;
