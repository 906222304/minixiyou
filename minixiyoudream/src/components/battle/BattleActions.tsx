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
  isSkillUsable,
  getSkillCooldown,
  updatePlayerGold,
  addPlayerExp,
  addItem,
  canCaptureEnemy,
  getCaptureRate,
  playerLevel,
  checkLevelUnlockCompanion,
} from '@/signals';
import { gamePhase } from '@/signals/gameSignals';
import { getItemTemplate } from '@/constants/items';
import type { CombatUnit, BattleAction, Skill, Item } from '@/types';
import { AutoBattleConfigModal } from './AutoBattleConfigModal';

interface BattleActionsProps {
  selectedTargetId?: string;
  onSelectTarget?: (targetId: string) => void;
}

type PanelType = 'none' | 'skills' | 'items';

export function BattleActions({ selectedTargetId, onSelectTarget }: BattleActionsProps) {
  useSignals();

  const [activePanel, setActivePanel] = useState<PanelType>('none');
  const [showAutoConfig, setShowAutoConfig] = useState(false);

  const state = battleState.value;
  const speed = battleSpeed.value;
  const auto = isAutoBattle.value;
  const items = inventoryItems.value;

  if (!state) return null;

  // 获取当前行动单位
  const currentActor = getCurrentActor(state.playerFormation, state.enemies, state.currentActorIndex);
  // 玩家或伙伴的回合才可操作
  const isPlayerTurn = currentActor?.isPlayerSide &&
    (currentActor.type === 'player' || currentActor.type === 'companion');

  // 获取当前单位可用的技能（考虑冷却和MP）
  const availableSkills = useMemo(() => {
    if (!currentActor || currentActor.skills.length === 0) return [];

    return currentActor.skills.filter(skill => isSkillUsable(currentActor, skill.id));
  }, [currentActor]);

  // 获取所有技能（包括冷却中的）
  const allSkills = useMemo(() => {
    if (!currentActor) return [];
    return currentActor.skills.map(skill => ({
      skill,
      cooldown: getSkillCooldown(currentActor.id, skill.id),
      canUse: isSkillUsable(currentActor, skill.id),
    }));
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
    // 清除目标选择
    onSelectTarget?.('');
  };

  // 执行技能
  const handleUseSkill = (skill: Skill) => {
    if (!currentActor) return;

    // 群体技能不需要选择目标
    const targetId = skill.targetType === 'all_enemies' ||
                      skill.targetType === 'all_allies' ||
                      skill.targetType === 'self'
      ? undefined
      : selectedTargetId;

    // 单体技能需要选择目标
    if ((skill.targetType === 'single_enemy' || skill.targetType === 'single_ally') && !targetId) {
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
    // 清除目标选择
    onSelectTarget?.('');
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
    // 清除目标选择
    onSelectTarget?.('');
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

  // 尝试捕捉宠物
  const handleCapture = () => {
    if (!currentActor || !selectedTargetId) return;

    const action: BattleAction = {
      actorId: currentActor.id,
      type: 'capture',
      targetId: selectedTargetId,
    };

    executeAction(action);
    onSelectTarget?.('');
  };

  // 检查选中的目标是否可捕捉
  const selectedEnemy = selectedTargetId
    ? state.enemies.find(e => e.id === selectedTargetId)
    : null;
  const canCapture = selectedEnemy ? canCaptureEnemy(selectedEnemy) : false;
  const captureRate = selectedEnemy ? getCaptureRate(selectedEnemy) : 0;

  // 战斗结束处理 - 应用奖励
  const handleBattleEnd = () => {
    const previousLevel = playerLevel.value;

    if (state.result?.victory) {
      // 实际发放奖励
      const rewards = state.result.rewards;

      // 发放经验
      if (rewards.exp > 0) {
        addPlayerExp(rewards.exp);
      }

      // 发放金币
      if (rewards.gold > 0) {
        updatePlayerGold(rewards.gold);
      }

      // 发放物品
      if (rewards.items && rewards.items.length > 0) {
        for (const itemReward of rewards.items) {
          addItem(itemReward.itemId, itemReward.count || 1);
        }
      }

      // 检查等级解锁伙伴（等级变化时）
      const currentLevel = playerLevel.value;
      if (currentLevel > previousLevel) {
        checkLevelUnlockCompanion(currentLevel);
      }
    }
    clearBattle();
    gamePhase.value = 'playing';
  };

  // 如果战斗已结束，显示结算按钮
  if (state.result) {
    return (
      <div className="space-y-3">
        <div className={`text-center text-lg font-bold ${state.result.victory ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {state.result.victory ? '战斗胜利！' : '战斗失败...'}
        </div>
        {state.result.victory && (
          <div className="text-center text-sm text-[var(--game-text-muted)] space-y-1">
            <p>战斗回合: {state.result.stats.rounds}</p>
            <p>总伤害输出: {state.result.stats.totalDamageDealt}</p>
            <p>暴击次数: {state.result.stats.criticalHits}</p>
            <div className="border-t border-[var(--game-border)] pt-2 mt-2">
              <p className="text-[#16a34a]">获得经验: +{state.result.rewards.exp}</p>
              <p className="text-[#eab308]">获得金币: +{state.result.rewards.gold}</p>
              {state.result.rewards.items.length > 0 && (
                <div className="text-[#60a5fa]">
                  <span>获得物品: </span>
                  {state.result.rewards.items.map((i, idx) => {
                    const template = getItemTemplate(i.itemId);
                    const name = template?.name || i.itemId;
                    return <span key={idx}>{name}{i.count > 1 ? ` x${i.count}` : ''}{idx < state.result!.rewards.items.length - 1 ? ', ' : ''}</span>;
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={handleBattleEnd}
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
            onClick={() => setShowAutoConfig(true)}
            className="game-btn game-btn-sm px-2 py-2 text-sm font-medium"
            title="自动战斗配置"
          >
            ⚙️
          </button>
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
        <div className="text-center">
          <p className="text-sm text-[var(--game-gold-dark)] font-medium">
            {currentActor?.name} 的回合
          </p>
          <p className="text-[var(--game-text-muted)] text-sm">
            {auto ? '自动战斗中...' : '等待中...'}
          </p>
        </div>

        {/* 自动战斗配置弹窗 */}
        <AutoBattleConfigModal
          isOpen={showAutoConfig}
          onClose={() => setShowAutoConfig(false)}
        />
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
            onClick={() => setShowAutoConfig(true)}
            className="game-btn game-btn-sm px-2 py-1 text-xs"
            title="自动战斗配置"
          >
            ⚙️
          </button>
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
            HP: {currentActor.hp}/{currentActor.maxHp} | MP: {currentActor.mp}/{currentActor.maxMp}
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
          {allSkills.length === 0 ? (
            <p className="text-center text-[var(--game-text-muted)] text-sm py-4">
              没有可用技能
            </p>
          ) : (
            <div className="space-y-2">
              {allSkills.map(({ skill, cooldown, canUse }) => (
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
                    <div className="text-right">
                      <span className="text-xs text-[#60a5fa]">{skill.mpCost} MP</span>
                      {cooldown > 0 && (
                        <div className="text-xs text-[#f87171]">CD: {cooldown}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
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
                    <span className="text-lg">{'potion' in item ? '🧪' : '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-[var(--game-text-muted)]">
                        消耗品
                      </div>
                    </div>
                    <span className="text-xs text-[var(--game-text-dim)]">x{item.count}</span>
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
              className="game-btn game-btn-magic py-3 font-medium text-sm"
            >
              技能
              {availableSkills.length > 0 && (
                <span className="ml-1 text-xs">({availableSkills.length})</span>
              )}
            </button>
            <button
              onClick={handleDefend}
              className="game-btn py-3 font-medium text-sm"
            >
              防御
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActivePanel('items')}
              disabled={usableItems.length === 0}
              className="game-btn game-btn-success py-2 font-medium text-sm disabled:opacity-50"
            >
              道具
              {usableItems.length > 0 && (
                <span className="ml-1 text-xs">({usableItems.length})</span>
              )}
            </button>
            <button
              onClick={handleCapture}
              disabled={!canCapture}
              className="game-btn py-2 font-medium text-sm disabled:opacity-50"
              title={canCapture ? `捕捉成功率: ${Math.round(captureRate * 100)}%` : '该目标无法捕捉'}
            >
              🧬 捕捉
            </button>
            <button
              onClick={handleEscape}
              className="game-btn game-btn-danger py-2 font-medium text-sm"
            >
              🏃 逃跑
            </button>
          </div>
        </>
      )}

      {/* 目标选择提示 */}
      {activePanel === 'none' && (
        <p className="text-center text-[var(--game-text-muted)] text-xs">
          {selectedTargetId
            ? '已选择目标，点击"攻击"执行'
            : '请点击敌方单位选择攻击目标'}
        </p>
      )}

      {/* 自动战斗配置弹窗 */}
      <AutoBattleConfigModal
        isOpen={showAutoConfig}
        onClose={() => setShowAutoConfig(false)}
      />
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
