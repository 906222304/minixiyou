// 角色创建组件 - UI/UX Pro Max 重设计

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { gamePhase, createPlayer } from '@/signals';
import { getAllRaces } from '@/constants/races';
import { getFactionsByRace } from '@/constants/factions';
import { rollRandomTraits } from '@/constants/traits';
import { PRNG } from '@/utils/prng';
import type { Trait, RaceType } from '@/types';

type CreationStep = 'name' | 'race' | 'faction' | 'traits' | 'confirm';

// SVG Icons
const Icons = {
  back: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  user: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

// 品质颜色映射 - 适配小清新风格
const RARITY_COLORS: Record<string, string> = {
  legendary: 'text-amber-600',
  epic: 'text-purple-600',
  rare: 'text-blue-600',
  common: 'text-slate-500',
};

const RARITY_BG: Record<string, string> = {
  legendary: 'border-amber-400/50 bg-amber-100/50',
  epic: 'border-purple-400/50 bg-purple-100/50',
  rare: 'border-blue-400/50 bg-blue-100/50',
  common: 'border-slate-300/50',
};

const STEPS: CreationStep[] = ['name', 'race', 'faction', 'traits', 'confirm'];
const STEP_LABELS: Record<CreationStep, string> = {
  name: '名称',
  race: '种族',
  faction: '门派',
  traits: '特性',
  confirm: '确认',
};

export function CharacterCreation() {
  useSignals();

  const [step, setStep] = useState<CreationStep>('name');
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState<RaceType | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [rolledTraits, setRolledTraits] = useState<Trait[]>([]);

  const races = getAllRaces();
  const availableFactions = selectedRace ? getFactionsByRace(selectedRace) : [];
  const currentStepIndex = STEPS.indexOf(step);

  const handleNameSubmit = () => {
    if (name.trim().length >= 2) {
      setStep('race');
    }
  };

  const handleRaceSelect = (raceType: RaceType) => {
    setSelectedRace(raceType);
    setStep('faction');
  };

  const handleFactionSelect = (factionId: string) => {
    setSelectedFaction(factionId);
    // 随机生成特性
    const prng = new PRNG(Date.now());
    const traits = rollRandomTraits(3, () => prng.next());
    setRolledTraits(traits);
    setStep('traits');
  };

  const handleRerollTraits = () => {
    const prng = new PRNG(Date.now());
    const traits = rollRandomTraits(3, () => prng.next());
    setRolledTraits(traits);
  };

  const handleConfirm = () => {
    if (!selectedRace || !selectedFaction) return;

    createPlayer({
      name: name.trim(),
      race: selectedRace,
      factionId: selectedFaction,
      traitIds: rolledTraits.map(t => t.id),
    });

    gamePhase.value = 'playing';
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f2fd] via-[#f5faff] to-[#fff8f0] text-[var(--game-text)]">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--game-gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c084fc]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto p-4 min-h-screen flex flex-col">
        {/* 标题与进度 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-[var(--game-gold-dark)]">
            创建角色
          </h1>

          {/* 步骤指示器 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    i < currentStepIndex
                      ? 'bg-[var(--game-gold)] text-white'
                      : i === currentStepIndex
                      ? 'bg-[var(--game-gold)]/20 border-2 border-[var(--game-gold)] text-[var(--game-gold-dark)]'
                      : 'bg-white/50 text-[var(--game-text-dim)] border border-[var(--game-border)]'
                  }`}
                >
                  {i < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-0.5 mx-1 transition-colors duration-300 ${
                      i < currentStepIndex ? 'bg-[var(--game-gold)]' : 'bg-[var(--game-border)]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 当前步骤标签 */}
          <p className="text-[var(--game-text-muted)] text-sm mt-4">
            步骤 {currentStepIndex + 1}/5: {STEP_LABELS[step]}
          </p>
        </div>

        {/* 内容区域 */}
        <div className="flex-1">
          {/* 步骤1：输入名称 */}
          {step === 'name' && (
            <div className="game-panel p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[var(--game-gold)]/20 rounded-xl">
                  {Icons.user}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--game-text)]">角色名称</h2>
                  <p className="text-sm text-[var(--game-text-muted)]">为你的角色取一个响亮的名字</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="character-name" className="block text-sm font-medium text-[var(--game-text)] mb-2">
                    名称
                  </label>
                  <input
                    id="character-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="请输入2-12个字符"
                    className="game-input w-full"
                    maxLength={12}
                    autoComplete="off"
                  />
                  <p className="text-xs text-[var(--game-text-dim)] mt-2">
                    {name.length}/12 字符
                  </p>
                </div>

                <button
                  onClick={handleNameSubmit}
                  disabled={name.trim().length < 2}
                  className="game-btn game-btn-primary w-full py-4 font-medium disabled:opacity-50"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* 步骤2：选择种族 */}
          {step === 'race' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--game-text)]">选择种族</h2>
                <p className="text-sm text-[var(--game-text-muted)]">不同种族拥有独特天赋和属性倾向</p>
              </div>

              <div className="space-y-3">
                {races.map((race) => {
                  // 计算属性条的最大值用于可视化
                  const maxStat = 14;
                  const statLabels: Record<string, { name: string; color: string }> = {
                    strength: { name: '力量', color: 'bg-red-400' },
                    intelligence: { name: '灵力', color: 'bg-blue-400' },
                    vitality: { name: '体质', color: 'bg-green-400' },
                    agility: { name: '敏捷', color: 'bg-yellow-400' },
                    willpower: { name: '魔力', color: 'bg-purple-400' },
                  };

                  return (
                    <button
                      key={race.type}
                      onClick={() => handleRaceSelect(race.type)}
                      className="w-full game-card p-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{race.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--game-text)]">{race.name}</h3>
                          <p className="text-sm text-[var(--game-text-muted)] mt-1">{race.description}</p>

                          {/* 属性倾向条 */}
                          <div className="mt-3 space-y-1.5">
                            {Object.entries(race.baseStats).map(([stat, value]) => {
                              const statInfo = statLabels[stat];
                              return (
                                <div key={stat} className="flex items-center gap-2">
                                  <span className="text-xs text-[var(--game-text-muted)] w-10">{statInfo.name}</span>
                                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${statInfo.color} rounded-full transition-all duration-300`}
                                      style={{ width: `${(value / maxStat) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-[var(--game-text-dim)] w-6 text-right">{value}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* 种族特性 */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {race.traits.map((trait) => (
                              <span
                                key={trait.id}
                                className="px-2 py-0.5 bg-[var(--game-gold)]/20 rounded text-xs text-[var(--game-gold-dark)]"
                              >
                                {trait.name}
                              </span>
                            ))}
                          </div>

                          {/* 被动技能 */}
                          <div className="mt-2 px-2 py-1 bg-blue-50 rounded-lg inline-block">
                            <p className="text-xs text-blue-600">
                              <span className="font-medium">{race.passiveSkill.name}</span>: {race.passiveSkill.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleBack}
                className="w-full py-3 text-[var(--game-text-muted)] hover:text-[var(--game-text)] flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回上一步</span>
              </button>
            </div>
          )}

          {/* 步骤3：选择门派 */}
          {step === 'faction' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--game-text)]">选择门派</h2>
                <p className="text-sm text-[var(--game-text-muted)]">学习强大的门派技能</p>
              </div>

              <div className="space-y-3">
                {availableFactions.map((faction) => (
                  <button
                    key={faction.id}
                    onClick={() => handleFactionSelect(faction.id)}
                    className="w-full game-card p-5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{faction.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--game-text)]">{faction.name}</h3>
                        <p className="text-sm text-[var(--game-text-muted)] mt-1">{faction.description}</p>
                        <div className="mt-2 px-2 py-1 bg-[#c084fc]/20 rounded-lg inline-block">
                          <p className="text-xs text-[#7c3aed]">
                            特色技能: {faction.signatureSkill.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleBack}
                className="w-full py-3 text-[var(--game-text-muted)] hover:text-[var(--game-text)] flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回上一步</span>
              </button>
            </div>
          )}

          {/* 步骤4：随机特性 */}
          {step === 'traits' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--game-text)]">随机特性</h2>
                <p className="text-sm text-[var(--game-text-muted)]">获得随机天赋，塑造独特角色</p>
              </div>

              <div className="space-y-3">
                {rolledTraits.map((trait) => (
                  <div
                    key={trait.id}
                    className={`game-card p-4 ${RARITY_BG[trait.rarity] || ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{trait.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${RARITY_COLORS[trait.rarity] || 'text-[var(--game-text)]'}`}>
                          {trait.name}
                        </h3>
                        <p className="text-sm text-[var(--game-text-muted)] mt-1">{trait.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRerollTraits}
                  className="game-btn flex-1 py-4 font-medium flex items-center justify-center gap-2"
                >
                  {Icons.refresh}
                  <span>重新随机</span>
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className="game-btn game-btn-primary flex-1 py-4 font-medium flex items-center justify-center gap-2"
                >
                  {Icons.check}
                  <span>确认特性</span>
                </button>
              </div>

              <button
                onClick={handleBack}
                className="w-full py-3 text-[var(--game-text-muted)] hover:text-[var(--game-text)] flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回上一步</span>
              </button>
            </div>
          )}

          {/* 步骤5：确认创建 */}
          {step === 'confirm' && (() => {
            const selectedRaceData = races.find(r => r.type === selectedRace);
            return (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--game-text)]">确认角色信息</h2>
                <p className="text-sm text-[var(--game-text-muted)]">检查并确认你的角色</p>
              </div>

              <div className="game-panel p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--game-border)]">
                  <div className="p-3 bg-[var(--game-gold)]/20 rounded-xl text-2xl">
                    {selectedRaceData?.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--game-text)] text-lg">{name}</h3>
                    <p className="text-sm text-[var(--game-text-muted)]">
                      {selectedRaceData?.name} · {availableFactions.find(f => f.id === selectedFaction)?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 种族信息 */}
                  <div className="pb-4 border-b border-[var(--game-border)]">
                    <p className="text-[var(--game-text-muted)] text-sm mb-2">种族属性</p>
                    {selectedRaceData && (
                      <div className="grid grid-cols-5 gap-2 text-center">
                        <div className="bg-red-50 rounded-lg p-2">
                          <div className="text-xs text-red-600">力量</div>
                          <div className="font-semibold text-red-700">{selectedRaceData.baseStats.strength}</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600">灵力</div>
                          <div className="font-semibold text-blue-700">{selectedRaceData.baseStats.intelligence}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="text-xs text-green-600">体质</div>
                          <div className="font-semibold text-green-700">{selectedRaceData.baseStats.vitality}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <div className="text-xs text-yellow-600">敏捷</div>
                          <div className="font-semibold text-yellow-700">{selectedRaceData.baseStats.agility}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600">魔力</div>
                          <div className="font-semibold text-purple-700">{selectedRaceData.baseStats.willpower}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 种族特性 */}
                  {selectedRaceData && selectedRaceData.traits.length > 0 && (
                    <div className="pb-4 border-b border-[var(--game-border)]">
                      <p className="text-[var(--game-text-muted)] text-sm mb-2">种族特性</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRaceData.traits.map((trait) => (
                          <span
                            key={trait.id}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--game-gold)]/20 text-[var(--game-gold-dark)]"
                          >
                            {trait.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 天赋特性 */}
                  <div className="pt-2">
                    <p className="text-[var(--game-text-muted)] text-sm mb-2">天赋特性</p>
                    <div className="flex flex-wrap gap-2">
                      {rolledTraits.map((trait) => (
                        <span
                          key={trait.id}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${RARITY_COLORS[trait.rarity]} bg-white/50`}
                        >
                          {trait.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="game-btn game-btn-primary w-full py-4 font-semibold flex items-center justify-center gap-2"
              >
                {Icons.sparkles}
                <span>创建角色，开始冒险</span>
              </button>

              <button
                onClick={handleBack}
                className="w-full py-3 text-[var(--game-text-muted)] hover:text-[var(--game-text)] flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回修改</span>
              </button>
            </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
