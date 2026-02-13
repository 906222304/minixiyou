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

// 品质颜色映射
const RARITY_COLORS: Record<string, string> = {
  legendary: 'text-amber-400',
  epic: 'text-purple-400',
  rare: 'text-blue-400',
  common: 'text-slate-300',
};

const RARITY_BG: Record<string, string> = {
  legendary: 'border-amber-500/50 bg-amber-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  rare: 'border-blue-500/50 bg-blue-500/10',
  common: 'border-slate-600/50',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto p-4 min-h-screen flex flex-col">
        {/* 标题与进度 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            创建角色
          </h1>

          {/* 步骤指示器 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    i < currentStepIndex
                      ? 'bg-indigo-500 text-white'
                      : i === currentStepIndex
                      ? 'bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400'
                      : 'bg-slate-700/50 text-slate-500'
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
                      i < currentStepIndex ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 当前步骤标签 */}
          <p className="text-slate-400 text-sm mt-4">
            步骤 {currentStepIndex + 1}/5: {STEP_LABELS[step]}
          </p>
        </div>

        {/* 内容区域 */}
        <div className="flex-1">
          {/* 步骤1：输入名称 */}
          {step === 'name' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  {Icons.user}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">角色名称</h2>
                  <p className="text-sm text-slate-400">为你的角色取一个响亮的名字</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="character-name" className="block text-sm font-medium text-slate-300 mb-2">
                    名称
                  </label>
                  <input
                    id="character-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="请输入2-12个字符"
                    className="w-full px-4 py-3.5 bg-slate-700/50 rounded-xl text-white placeholder-slate-500 border border-slate-600/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200"
                    maxLength={12}
                    autoComplete="off"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {name.length}/12 字符
                  </p>
                </div>

                <button
                  onClick={handleNameSubmit}
                  disabled={name.trim().length < 2}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-medium transition-all duration-200 cursor-pointer touch-manipulation disabled:cursor-not-allowed"
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
                <h2 className="text-lg font-semibold text-white">选择种族</h2>
                <p className="text-sm text-slate-400">不同种族拥有独特天赋</p>
              </div>

              <div className="space-y-3">
                {races.map((race) => (
                  <button
                    key={race.type}
                    onClick={() => handleRaceSelect(race.type)}
                    className="w-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 p-5 text-left transition-all duration-200 cursor-pointer touch-manipulation"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{race.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{race.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{race.description}</p>
                        <div className="mt-2 px-2 py-1 bg-indigo-500/20 rounded-lg inline-block">
                          <p className="text-xs text-indigo-400">
                            {race.passiveSkill.name}: {race.passiveSkill.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleBack}
                className="w-full py-3 text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
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
                <h2 className="text-lg font-semibold text-white">选择门派</h2>
                <p className="text-sm text-slate-400">学习强大的门派技能</p>
              </div>

              <div className="space-y-3">
                {availableFactions.map((faction) => (
                  <button
                    key={faction.id}
                    onClick={() => handleFactionSelect(faction.id)}
                    className="w-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 p-5 text-left transition-all duration-200 cursor-pointer touch-manipulation"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{faction.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{faction.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{faction.description}</p>
                        <div className="mt-2 px-2 py-1 bg-purple-500/20 rounded-lg inline-block">
                          <p className="text-xs text-purple-400">
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
                className="w-full py-3 text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
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
                <h2 className="text-lg font-semibold text-white">随机特性</h2>
                <p className="text-sm text-slate-400">获得随机天赋，塑造独特角色</p>
              </div>

              <div className="space-y-3">
                {rolledTraits.map((trait) => (
                  <div
                    key={trait.id}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border p-4 ${RARITY_BG[trait.rarity] || ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{trait.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${RARITY_COLORS[trait.rarity] || 'text-white'}`}>
                          {trait.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{trait.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRerollTraits}
                  className="flex-1 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
                >
                  {Icons.refresh}
                  <span>重新随机</span>
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
                >
                  {Icons.check}
                  <span>确认特性</span>
                </button>
              </div>

              <button
                onClick={handleBack}
                className="w-full py-3 text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回上一步</span>
              </button>
            </div>
          )}

          {/* 步骤5：确认创建 */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-white">确认角色信息</h2>
                <p className="text-sm text-slate-400">检查并确认你的角色</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    {Icons.user}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{name}</h3>
                    <p className="text-sm text-slate-400">
                      {races.find(r => r.type === selectedRace)?.name} · {availableFactions.find(f => f.id === selectedFaction)?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">种族</span>
                    <span className="text-white font-medium">{races.find(r => r.type === selectedRace)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">门派</span>
                    <span className="text-white font-medium">{availableFactions.find(f => f.id === selectedFaction)?.name}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-slate-400 mb-3">特性</p>
                    <div className="flex flex-wrap gap-2">
                      {rolledTraits.map((trait) => (
                        <span
                          key={trait.id}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${RARITY_COLORS[trait.rarity]} bg-slate-700/50`}
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
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.sparkles}
                <span>创建角色，开始冒险</span>
              </button>

              <button
                onClick={handleBack}
                className="w-full py-3 text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer touch-manipulation"
              >
                {Icons.back}
                <span>返回修改</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
