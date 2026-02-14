// 伙伴AI配置组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getCompanionAIConfig,
  updateCompanionAIConfig,
  resetCompanionAIConfig,
} from '@/signals/battleSignals';
import { getSkill } from '@/constants/skills';
import type {
  CompanionStrategy,
  CompanionPreferredTarget,
  CompanionProtectTarget,
  CompanionAIConfig,
  Companion,
  Skill,
} from '@/types';

interface CompanionAIConfigProps {
  companion: Companion;
  onClose: () => void;
}

/** 策略描述 */
const STRATEGY_DESCRIPTIONS: Record<CompanionStrategy, { name: string; desc: string; icon: string }> = {
  aggressive: { name: '激进', desc: '优先攻击，较少防御', icon: '⚔️' },
  balanced: { name: '平衡', desc: '攻守兼备，根据战况调整', icon: '⚖️' },
  defensive: { name: '保守', desc: '优先生存，保护队友', icon: '🛡️' },
};

/** 优先目标描述 */
const PREFERRED_TARGET_DESCRIPTIONS: Record<CompanionPreferredTarget, { name: string; desc: string }> = {
  random: { name: '随机', desc: '随机选择敌人' },
  boss: { name: '首领优先', desc: '优先攻击Boss/精英怪' },
  weakest: { name: '最弱优先', desc: '优先攻击最弱的敌人' },
  highestDamage: { name: '高威胁', desc: '优先攻击攻击力最高的敌人' },
  lowestHp: { name: '残血优先', desc: '优先攻击血量最低的敌人' },
};

/** 保护目标描述 */
const PROTECT_TARGET_DESCRIPTIONS: Record<CompanionProtectTarget, { name: string; desc: string }> = {
  player: { name: '保护玩家', desc: '优先保护玩家角色' },
  weakest: { name: '保护弱者', desc: '优先保护血量最低的队友' },
  none: { name: '不保护', desc: '专注攻击，不刻意保护' },
};

export function CompanionAIConfig({ companion, onClose }: CompanionAIConfigProps) {
  useSignals();

  const [config, setConfig] = useState<CompanionAIConfig>(() => getCompanionAIConfig(companion.id));

  // 获取伙伴技能列表
  const companionSkills = companion.skills
    .map(ls => getSkill(ls.skillId))
    .filter((s): s is Skill => s !== undefined);

  // 更新配置
  const handleUpdate = (updates: Partial<Omit<CompanionAIConfig, 'companionId'>>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    updateCompanionAIConfig(companion.id, updates);
  };

  // 重置配置
  const handleReset = () => {
    resetCompanionAIConfig(companion.id);
    setConfig(getCompanionAIConfig(companion.id));
  };

  // 技能优先级移动
  const moveSkillUp = (index: number) => {
    if (index === 0) return;
    const newPriority = [...config.skillPriority];
    [newPriority[index - 1], newPriority[index]] = [newPriority[index], newPriority[index - 1]];
    handleUpdate({ skillPriority: newPriority });
  };

  const moveSkillDown = (index: number) => {
    if (index >= config.skillPriority.length - 1) return;
    const newPriority = [...config.skillPriority];
    [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
    handleUpdate({ skillPriority: newPriority });
  };

  const removeSkill = (skillId: string) => {
    handleUpdate({ skillPriority: config.skillPriority.filter(id => id !== skillId) });
  };

  const addSkill = (skillId: string) => {
    if (config.skillPriority.includes(skillId)) return;
    handleUpdate({ skillPriority: [...config.skillPriority, skillId] });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="game-modal w-full max-w-md max-h-[90vh] overflow-hidden animate-fade-in">
        {/* 标题栏 */}
        <div className="game-modal-header">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{companion.avatar}</span>
            <div>
              <h2 className="game-modal-title">AI战斗配置</h2>
              <p className="text-xs text-[var(--game-text-muted)]">{companion.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--game-text-muted)] hover:text-[var(--game-text)] transition-colors text-xl"
          >
            x
          </button>
        </div>

        {/* 内容区域 */}
        <div className="game-modal-body overflow-y-auto max-h-[65vh] space-y-5">
          {/* 攻击策略 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--game-text)]">
              攻击策略
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STRATEGY_DESCRIPTIONS).map(([key, { name, desc, icon }]) => (
                <button
                  key={key}
                  onClick={() => handleUpdate({ strategy: key as CompanionStrategy })}
                  className={`p-3 rounded-lg text-center transition-all ${
                    config.strategy === key
                      ? 'bg-[var(--game-gold-glow)] border-2 border-[var(--game-gold)]'
                      : 'bg-[var(--game-bg-card)] border border-[var(--game-border)] hover:border-[var(--game-border-active)]'
                  }`}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-medium text-sm">{name}</div>
                  <div className="text-xs text-[var(--game-text-muted)]">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 优先目标 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--game-text)]">
              优先目标
            </label>
            <select
              value={config.preferredTarget}
              onChange={(e) => handleUpdate({ preferredTarget: e.target.value as CompanionPreferredTarget })}
              className="game-input w-full"
            >
              {Object.entries(PREFERRED_TARGET_DESCRIPTIONS).map(([key, { name, desc }]) => (
                <option key={key} value={key}>
                  {name} - {desc}
                </option>
              ))}
            </select>
          </div>

          {/* 技能优先级 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--game-text)]">
              技能使用优先级
            </label>
            <p className="text-xs text-[var(--game-text-muted)]">
              排在前面的技能优先使用，未添加的技能按MP消耗决定
            </p>

            {/* 已添加的技能 */}
            <div className="space-y-1">
              {config.skillPriority.length === 0 ? (
                <p className="text-xs text-[var(--game-text-dim)] text-center py-2">
                  未设置技能优先级，将自动选择
                </p>
              ) : (
                config.skillPriority.map((skillId, index) => {
                  const skill = companionSkills.find(s => s.id === skillId);
                  if (!skill) return null;
                  return (
                    <div
                      key={skillId}
                      className="flex items-center gap-2 p-2 bg-[var(--game-bg-card)] rounded-lg border border-[var(--game-border)]"
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveSkillUp(index)}
                          disabled={index === 0}
                          className="text-xs text-[var(--game-text-muted)] hover:text-[var(--game-text)] disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSkillDown(index)}
                          disabled={index === config.skillPriority.length - 1}
                          className="text-xs text-[var(--game-text-muted)] hover:text-[var(--game-text)] disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <span className="text-lg">{skill.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{skill.name}</div>
                        <div className="text-xs text-[var(--game-text-muted)]">{skill.mpCost} MP</div>
                      </div>
                      <button
                        onClick={() => removeSkill(skillId)}
                        className="text-xs text-red-500 hover:text-red-600 px-2"
                      >
                        移除
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* 添加技能 */}
            {companionSkills.filter(s => !config.skillPriority.includes(s.id)).length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) addSkill(e.target.value);
                }}
                className="game-input w-full text-sm"
              >
                <option value="">添加技能到优先列表...</option>
                {companionSkills
                  .filter(s => !config.skillPriority.includes(s.id))
                  .map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.icon} {skill.name} ({skill.mpCost} MP)
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* 保护目标 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--game-text)]">
              保护目标
            </label>
            <select
              value={config.protectTarget}
              onChange={(e) => handleUpdate({ protectTarget: e.target.value as CompanionProtectTarget })}
              className="game-input w-full"
            >
              {Object.entries(PROTECT_TARGET_DESCRIPTIONS).map(([key, { name, desc }]) => (
                <option key={key} value={key}>
                  {name} - {desc}
                </option>
              ))}
            </select>
          </div>

          {/* 治疗设置 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--game-text)]">
                自动使用治疗技能
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.autoHeal}
                  onChange={(e) => handleUpdate({ autoHeal: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {config.autoHeal && (
              <div className="space-y-2 pl-2 border-l-2 border-[var(--game-border)]">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--game-text-muted)]">队友HP低于此值时治疗</span>
                    <span className="font-medium text-green-600">{config.healThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={config.healThreshold}
                    onChange={(e) => handleUpdate({ healThreshold: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 防御阈值 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--game-text-muted)]">低血量时更倾向防御</span>
              <span className="font-medium text-orange-500">{config.defensiveHpThreshold}%</span>
            </div>
            <p className="text-xs text-[var(--game-text-dim)]">
              HP低于此百分比时，伙伴更倾向于选择防御行动
            </p>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={config.defensiveHpThreshold}
              onChange={(e) => handleUpdate({ defensiveHpThreshold: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="game-modal-footer">
          <button
            onClick={handleReset}
            className="game-btn px-4 py-2 text-sm"
          >
            恢复默认
          </button>
          <button
            onClick={onClose}
            className="game-btn game-btn-primary px-6 py-2 text-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
