// 战斗操作按钮组件

import { useState, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  battleState,
  battleSpeed,
  isAutoBattle,
  executeAction,
  clearBattle,
  inventoryItems,
} from '@/signals';
import { gamePhase } from '@/signals/gameSignals';
import type { CombatUnit, BattleAction, Skill, Item } from '@/types';

interface BattleActionsProps {
  selectedTargetId?: string;
}

type PanelType = 'none' | 'skills' | 'items';

export function BattleActions({ selectedTargetId }: BattleActionsProps) {
  useSignals();

  const [activePanel, setActivePanel] = useState<PanelType>('none');

  const state = battleState.value;
  const speed = battleSpeed.value;
  const auto = isAutoBattle.value;
  const items = inventoryItems.value;

  if (!state) return null;

  // 获取当前行动单位
  const currentActor = getCurrentActor(state.playerFormation, state.enemies, state.currentActorIndex);
  const isPlayerTurn = currentActor?.isPlayerSide && (currentActor.type === 'player' || currentActor.type === 'companion');

  // 获取当前单位可用的技能
  const availableSkills = useMemo(() => {
    if (!currentActor || currentActor.skills.length === 0) return [];

    return currentActor.skills.filter(skill => {
      // 检查MP是否足够
      return currentActor.mp >= skill.mpCost;
    });
  }, [currentActor]);

  // 获取可用的道具（消耗品类）
  const usableItems = useMemo(() => {
    return items.filter(item =>
      item.type === 'consumable'
    );
  }, [items]);

  // 切换自动战斗
  const toggleAuto = () => {
    isAutoBattle.value = !auto;
  };

  // 切换速度
  const cycleSpeed = () => {
    const speeds: (1 | 2 | 3)[] = [1, 2, 3];
    const currentIndex = speeds.indexOf(speed);
    battleSpeed.value = speeds[(currentIndex + 1) % speeds.length];
  };

  // 执行普通攻击
  const handleAttack = () => {
    if (!currentActor || !selectedTargetId) return;

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'attack',
      targetId: selectedTargetId,
    };

    executeAction(action);
  };

  // 执行技能
  const handleUseSkill = (skill: Skill) => {
    if (!currentActor) return;

    // 群体技能不需要选择目标
    const targetId = skill.targetType === 'all_enemies' || skill.targetType === 'all_allies'
      ? undefined
      : selectedTargetId;

    // 单体技能需要选择目标
    if (skill.targetType === 'single_enemy' && !targetId) {
      return;
    }

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'skill',
      skillId: skill.id,
      targetId,
    };

    executeAction(action);
    setActivePanel('none');
  };

  // 使用道具
  const handleUseItem = (item: Item) => {
    if (!currentActor) return;

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'item',
      itemId: item.id,
      targetId: selectedTargetId,
    };

    executeAction(action);
    setActivePanel('none');
  };

  // 执行防御
  const handleDefend = () => {
    if (!currentActor) return;

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'defend',
    };

    executeAction(action);
  };

  // 尝试逃跑
  const handleEscape = () => {
    if (!currentActor) return;

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'escape',
    };

    executeAction(action);
  };

  // 战斗结束处理
  const handleBattleEnd = () => {
    clearBattle();
    gamePhase.value = 'playing';
  };

  // 如果战斗已结束，显示结算按钮
  if (state.result) {
    return (
      <div className="space-y-3">
        <div className={`text-center text-lg font-bold ${state.result.victory ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {state.result.victory ? '胜利！' : '失败...'}
        </div>
        {state.result.victory && (
          <div className="text-center text-sm text-[var(--game-text-muted)]">
            <p>获得经验: {state.result.rewards.exp}</p>
            <p>获得金币: {state.result.rewards.gold}</p>
          </div>
        )}
        <button
          onClick={() => handleBattleEnd()}
          className="game-btn game-btn-primary w-full py-3 font-medium"
        >
          确定
        </button>
      </div>
    );
  }

  // 如果不是玩家回合或自动战斗，显示等待状态
  if (!isPlayerTurn || auto) {
    return (
      <div className="space-y-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={toggleAuto}
            className={`game-btn game-btn-sm px-3 py-2 text-sm font-medium ${
              auto ? 'game-btn-success' : ''
            }`}
          >
            {auto ? '自动中' : '自动'}
          </button>
          <button
            onClick={cycleSpeed}
            className="game-btn game-btn-sm px-3 py-2 text-sm font-medium"
          >
            {speed}x
          </button>
        </div>
        <p className="text-center text-[var(--game-text-muted)] text-sm">
          {auto ? '自动战斗中...' : '等待敌人行动...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 顶部控制栏 */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-[var(--game-text-muted)]">回合:</span>{' '}
          <span className="font-medium text-[var(--game-text)]">{state.round}/{state.maxRounds}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleAuto}
            className={`game-btn game-btn-sm px-2 py-1 text-xs ${
              auto ? 'game-btn-success' : ''
            }`}
          >
            {auto ? '自动中' : '自动'}
          </button>
          <button
            onClick={cycleSpeed}
            className="game-btn game-btn-sm px-2 py-1 text-xs"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* 当前行动单位 */}
      <div className="text-center text-sm text-[var(--game-gold-dark)] font-medium">
        {currentActor?.name} 的回合
        {currentActor && (
          <span className="text-[var(--game-text-muted)] ml-2">
            MP: {currentActor.mp}/{currentActor.maxMp}
          </span>
        )}
      </div>

      {/* 技能面板 */}
      {activePanel === 'skills' && (
        <div className="game-panel p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[var(--game-text)]">选择技能</h4>
            <button
              onClick={() => setActivePanel('none')}
              className="text-xs text-[var(--game-text-muted)] hover:text-[var(--game-text)]"
            >
              关闭
            </button>
          </div>
          {availableSkills.length === 0 ? (
            <p className="text-center text-[var(--game-text-muted)] text-sm py-4">
              没有可用技能
            </p>
          ) : (
            <div className="space-y-2">
              {availableSkills.map((skill) => {
                const canUse = currentActor && currentActor.mp >= skill.mpCost;
                return (
                  <button
                    key={skill.id}
                    onClick={() => canUse && handleUseSkill(skill)}
                    disabled={!canUse}
                    className={`w-full game-card p-2 text-left ${!canUse ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{skill.name}</div>
                        <div className="text-xs text-[var(--game-text-muted)] truncate">
                          {skill.description}
                        </div>
                      </div>
                      <span className="text-xs text-[#60a5fa]">{skill.mpCost} MP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 道具面板 */}
      {activePanel === 'items' && (
        <div className="game-panel p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[var(--game-text)]">选择道具</h4>
            <button
              onClick={() => setActivePanel('none')}
              className="text-xs text-[var(--game-text-muted)] hover:text-[var(--game-text)]"
            >
              关闭
            </button>
          </div>
          {usableItems.length === 0 ? (
            <p className="text-center text-[var(--game-text-muted)] text-sm py-4">
              没有可用道具
            </p>
          ) : (
            <div className="space-y-2">
              {usableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleUseItem(item)}
                  className="w-full game-card p-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧪</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-[var(--game-text-muted)]">
                        消耗品
                      </div>
                    </div>
                    <span className="text-xs text-[var(--game-text-dim)]">×{item.count}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      {activePanel === 'none' && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleAttack}
              disabled={!selectedTargetId}
              className="game-btn game-btn-danger py-3 font-medium text-sm disabled:opacity-50"
            >
              攻击
            </button>
            <button
              onClick={() => setActivePanel('skills')}
              disabled={availableSkills.length === 0}
              className="game-btn game-btn-magic py-3 font-medium text-sm disabled:opacity-50"
            >
              技能
            </button>
            <button
              onClick={handleDefend}
              className="game-btn py-3 font-medium text-sm"
            >
              防御
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActivePanel('items')}
              disabled={usableItems.length === 0}
              className="game-btn game-btn-success py-2 font-medium text-sm disabled:opacity-50"
            >
              道具
            </button>
            <button
              onClick={handleEscape}
              className="game-btn py-2 font-medium text-sm"
            >
              逃跑
            </button>
          </div>
        </>
      )}

      {/* 目标选择提示 */}
      {!selectedTargetId && activePanel === 'none' && (
        <p className="text-center text-[var(--game-text-muted)] text-xs">
          请点击敌方单位选择攻击目标
        </p>
      )}
    </div>
  );
}

// 获取当前行动单位
function getCurrentActor(
  formation: { characters: (CombatUnit | null)[]; pets: (CombatUnit | null)[] },
  enemies: CombatUnit[],
  currentIndex: number
): CombatUnit | null {
  const allUnits: CombatUnit[] = [];

  // 添加所有存活的玩家方单位
  for (const char of formation.characters) {
    if (char && char.hp > 0) allUnits.push(char);
  }
  for (const pet of formation.pets) {
    if (pet && pet.hp > 0) allUnits.push(pet);
  }

  // 添加所有存活的敌人
  for (const enemy of enemies) {
    if (enemy.hp > 0) allUnits.push(enemy);
  }

  // 按速度排序
  allUnits.sort((a, b) => b.stats.speed - a.stats.speed);

  return allUnits[currentIndex] ?? null;
}
