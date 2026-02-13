// 战斗操作按钮组件

import { useSignals } from '@preact/signals-react/runtime';
import {
  battleState,
  battleSpeed,
  isAutoBattle,
  executeAction,
  clearBattle,
} from '@/signals';
import { gamePhase } from '@/signals/gameSignals';
import type { CombatUnit, BattleAction } from '@/types';

interface BattleActionsProps {
  selectedTargetId?: string;
}

export function BattleActions({ selectedTargetId }: BattleActionsProps) {
  useSignals();

  const state = battleState.value;
  const speed = battleSpeed.value;
  const auto = isAutoBattle.value;

  if (!state) return null;

  // 获取当前行动单位
  const currentActor = getCurrentActor(state.playerFormation, state.enemies, state.currentActorIndex);
  const isPlayerTurn = currentActor?.isPlayerSide;

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
      <div className="space-y-2">
        <div className={`text-center text-lg font-bold ${state.result.victory ? 'text-green-400' : 'text-red-400'}`}>
          {state.result.victory ? '胜利！' : '失败...'}
        </div>
        {state.result.victory && (
          <div className="text-center text-sm text-gray-300">
            <p>获得经验: {state.result.rewards.exp}</p>
            <p>获得金币: {state.result.rewards.gold}</p>
          </div>
        )}
        <button
          onClick={() => handleBattleEnd()}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium touch-btn"
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
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              auto ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
            } touch-btn`}
          >
            {auto ? '自动中' : '自动'}
          </button>
          <button
            onClick={cycleSpeed}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm font-medium touch-btn"
          >
            {speed}x
          </button>
        </div>
        <p className="text-center text-gray-400 text-sm">
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
          <span className="text-gray-400">回合:</span>{' '}
          <span className="text-white">{state.round}/{state.maxRounds}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleAuto}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              auto ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
            } touch-btn`}
          >
            {auto ? '自动中' : '自动'}
          </button>
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs touch-btn"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* 当前行动单位 */}
      <div className="text-center text-sm text-yellow-400">
        {currentActor?.name} 的回合
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleAttack}
          disabled={!selectedTargetId}
          className="py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-sm touch-btn"
        >
          攻击
        </button>
        <button
          className="py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-sm touch-btn opacity-50"
          disabled
        >
          技能
        </button>
        <button
          onClick={handleDefend}
          className="py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm touch-btn"
        >
          防御
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-sm touch-btn opacity-50"
          disabled
        >
          道具
        </button>
        <button
          onClick={handleEscape}
          className="py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-sm touch-btn"
        >
          逃跑
        </button>
      </div>

      {/* 目标选择提示 */}
      {!selectedTargetId && (
        <p className="text-center text-gray-400 text-xs">
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
