// 自动战斗配置弹窗组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  autoBattleConfig,
  updateCharacterAutoConfig,
  updatePetAutoConfig,
  resetAutoBattleConfig,
} from '@/signals/battleSignals';
import { player } from '@/signals/playerSignals';
import { activePet } from '@/signals/petSignals';
import { getSkill } from '@/constants/skills';
import type { TargetStrategy, CharacterAutoConfig, PetAutoConfig } from '@/types';
import type { Skill } from '@/types';

interface AutoBattleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 目标策略描述 */
const TARGET_STRATEGY_DESCRIPTIONS: Record<TargetStrategy, { name: string; desc: string }> = {
  random: { name: '随机', desc: '随机选择一个敌人' },
  weakest: { name: '最弱', desc: '优先攻击HP最少的敌人' },
  strongest: { name: '最强', desc: '优先攻击HP最多的敌人' },
  lowestHp: { name: '血量最低', desc: '优先攻击当前血量最低的敌人' },
  highestHp: { name: '血量最高', desc: '优先攻击当前血量最高的敌人' },
};

export function AutoBattleConfigModal({ isOpen, onClose }: AutoBattleConfigModalProps) {
  useSignals();

  const config = autoBattleConfig.value;
  const currentPlayer = player.value;
  const pet = activePet.value;

  const [activeTab, setActiveTab] = useState<'character' | 'pet'>('character');

  if (!isOpen) return null;

  // 获取玩家技能列表
  const playerSkills: Skill[] = currentPlayer?.skills
    .map(ls => getSkill(ls.skillId))
    .filter((s): s is Skill => s !== undefined) || [];

  // 获取宠物技能列表
  const petSkills = pet?.skills
    .filter(ps => ps.type === 'active')
    .map(ps => ({
      id: ps.id,
      name: ps.name,
      icon: '🐾',
    })) || [];

  // 处理角色配置更新
  const handleCharacterConfigChange = (updates: Partial<CharacterAutoConfig>) => {
    updateCharacterAutoConfig(updates);
  };

  // 处理宠物配置更新
  const handlePetConfigChange = (updates: Partial<PetAutoConfig>) => {
    updatePetAutoConfig(updates);
  };

  // 重置配置
  const handleReset = () => {
    resetAutoBattleConfig();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="game-modal w-full max-w-md max-h-[90vh] overflow-hidden animate-fade-in">
        {/* 标题栏 */}
        <div className="game-modal-header">
          <h2 className="game-modal-title">自动战斗配置</h2>
          <button
            onClick={onClose}
            className="text-[var(--game-text-muted)] hover:text-[var(--game-text)] transition-colors text-xl"
          >
            x
          </button>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-[var(--game-border)]">
          <button
            onClick={() => setActiveTab('character')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'character'
                ? 'text-[var(--game-gold-dark)] border-b-2 border-[var(--game-gold)]'
                : 'text-[var(--game-text-muted)]'
            }`}
          >
            角色设置
          </button>
          <button
            onClick={() => setActiveTab('pet')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pet'
                ? 'text-[var(--game-gold-dark)] border-b-2 border-[var(--game-gold)]'
                : 'text-[var(--game-text-muted)]'
            }`}
          >
            宠物设置
          </button>
        </div>

        {/* 内容区域 */}
        <div className="game-modal-body overflow-y-auto max-h-[60vh]">
          {/* 角色配置 */}
          {activeTab === 'character' && (
            <div className="space-y-5">
              {/* 优先技能 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--game-text)]">
                  优先使用技能
                </label>
                <p className="text-xs text-[var(--game-text-muted)]">
                  自动战斗时优先使用的技能，留空则随机选择
                </p>
                <select
                  value={config.character.preferredSkillId || ''}
                  onChange={(e) => handleCharacterConfigChange({
                    preferredSkillId: e.target.value || null,
                  })}
                  className="game-input w-full"
                >
                  <option value="">随机选择</option>
                  {playerSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.icon} {skill.name} ({skill.mpCost} MP)
                    </option>
                  ))}
                </select>
              </div>

              {/* 目标选择策略 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--game-text)]">
                  目标选择策略
                </label>
                <p className="text-xs text-[var(--game-text-muted)]">
                  选择敌人时的优先顺序
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TARGET_STRATEGY_DESCRIPTIONS).map(([key, { name, desc }]) => (
                    <button
                      key={key}
                      onClick={() => handleCharacterConfigChange({ targetStrategy: key as TargetStrategy })}
                      className={`p-3 rounded-lg text-left transition-all ${
                        config.character.targetStrategy === key
                          ? 'bg-[var(--game-gold-glow)] border-2 border-[var(--game-gold)]'
                          : 'bg-[var(--game-bg-card)] border border-[var(--game-border)] hover:border-[var(--game-border-active)]'
                      }`}
                    >
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-[var(--game-text-muted)]">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 药品使用设置 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--game-text)]">
                    自动使用药品
                  </label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={config.character.autoUsePotion}
                      onChange={(e) => handleCharacterConfigChange({ autoUsePotion: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {config.character.autoUsePotion && (
                  <div className="space-y-3 pl-2 border-l-2 border-[var(--game-border)]">
                    {/* HP阈值 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--game-text-muted)]">HP低于此值时使用药品</span>
                        <span className="font-medium text-[var(--hp-color)]">{config.character.hpThreshold}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="5"
                        value={config.character.hpThreshold}
                        onChange={(e) => handleCharacterConfigChange({
                          hpThreshold: parseInt(e.target.value),
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* MP阈值 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--game-text-muted)]">MP低于此值时使用药品</span>
                        <span className="font-medium text-[var(--mp-color)]">{config.character.mpThreshold}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="5"
                        value={config.character.mpThreshold}
                        onChange={(e) => handleCharacterConfigChange({
                          mpThreshold: parseInt(e.target.value),
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 宠物配置 */}
          {activeTab === 'pet' && (
            <div className="space-y-5">
              {!pet ? (
                <div className="text-center py-8 text-[var(--game-text-muted)]">
                  <p>当前没有出战的宠物</p>
                  <p className="text-sm mt-1">请在宠物界面选择出战宠物</p>
                </div>
              ) : (
                <>
                  {/* 宠物信息 */}
                  <div className="flex items-center gap-3 p-3 bg-[var(--game-bg-card)] rounded-lg border border-[var(--game-border)]">
                    <div className="game-icon">
                      {pet.icon || '🐾'}
                    </div>
                    <div>
                      <div className="font-medium">{pet.nickname || pet.name}</div>
                      <div className="text-xs text-[var(--game-text-muted)]">Lv.{pet.level}</div>
                    </div>
                  </div>

                  {/* 优先技能 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--game-text)]">
                      优先使用技能
                    </label>
                    <p className="text-xs text-[var(--game-text-muted)]">
                      自动战斗时宠物优先使用的技能
                    </p>
                    <select
                      value={config.pet.preferredSkillId || ''}
                      onChange={(e) => handlePetConfigChange({
                        preferredSkillId: e.target.value || null,
                      })}
                      className="game-input w-full"
                    >
                      <option value="">随机选择</option>
                      {petSkills.map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.icon} {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 目标选择策略 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--game-text)]">
                      目标选择策略
                    </label>
                    <p className="text-xs text-[var(--game-text-muted)]">
                      宠物选择敌人时的优先顺序
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(TARGET_STRATEGY_DESCRIPTIONS).map(([key, { name, desc }]) => (
                        <button
                          key={key}
                          onClick={() => handlePetConfigChange({ targetStrategy: key as TargetStrategy })}
                          className={`p-3 rounded-lg text-left transition-all ${
                            config.pet.targetStrategy === key
                              ? 'bg-[var(--game-gold-glow)] border-2 border-[var(--game-gold)]'
                              : 'bg-[var(--game-bg-card)] border border-[var(--game-border)] hover:border-[var(--game-border-active)]'
                          }`}
                        >
                          <div className="font-medium text-sm">{name}</div>
                          <div className="text-xs text-[var(--game-text-muted)]">{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="game-modal-footer">
          <button
            onClick={handleReset}
            className="game-btn px-3 py-2 text-sm"
          >
            恢复默认
          </button>
          <button
            onClick={onClose}
            className="game-btn game-btn-primary px-3 py-2 text-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
