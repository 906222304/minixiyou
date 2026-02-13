// 战斗界面主布局

import { useState, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  battleState,
  battleSpeed,
  isAutoBattle,
  isBattleEnded,
  executeAction,
  startBattle,
  clearBattle,
} from '@/signals';
import { gamePhase } from '@/signals/gameSignals';
import { player } from '@/signals/playerSignals';
import { BattleUnit } from './BattleUnit';
import { BattleLog } from './BattleLog';
import { BattleActions } from './BattleActions';
import type { CombatUnit, BattleAction } from '@/types';
import { generateUUID } from '@/types';

export function BattleLayout() {
  useSignals();

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const state = battleState.value;
  const speed = battleSpeed.value;
  const auto = isAutoBattle.value;
  const ended = isBattleEnded.value;
  const currentPlayer = player.value;

  // 如果没有战斗状态且有玩家，创建测试战斗
  useEffect(() => {
    if (!state && currentPlayer) {
      // 创建测试敌人
      const testEnemies: CombatUnit[] = [
        {
          id: generateUUID(),
          name: '野狼',
          type: 'enemy',
          isPlayerSide: false,
          stats: {
            physicalAttack: 30,
            physicalDefense: 15,
            magicAttack: 10,
            magicDefense: 10,
            speed: 25,
            maxHp: 150,
            maxMp: 0,
            critRate: 0.05,
            critDamage: 0.5,
            hitRate: 0.9,
            dodgeRate: 0.05,
          },
          elementResistances: { fire: 0, ice: 0, thunder: 0 },
          hp: 150,
          maxHp: 150,
          mp: 0,
          maxMp: 0,
          skills: [],
          statusEffects: [],
          isDefending: false,
          isDead: false,
          position: 0,
        },
        {
          id: generateUUID(),
          name: '山贼',
          type: 'enemy',
          isPlayerSide: false,
          stats: {
            physicalAttack: 40,
            physicalDefense: 20,
            magicAttack: 10,
            magicDefense: 15,
            speed: 20,
            maxHp: 200,
            maxMp: 0,
            critRate: 0.08,
            critDamage: 0.6,
            hitRate: 0.85,
            dodgeRate: 0.03,
          },
          elementResistances: { fire: 0, ice: 0, thunder: 0 },
          hp: 200,
          maxHp: 200,
          mp: 0,
          maxMp: 0,
          skills: [],
          statusEffects: [],
          isDefending: false,
          isDead: false,
          position: 1,
        },
      ];

      startBattle(testEnemies);
    }
  }, [state, currentPlayer]);

  // 自动战斗逻辑
  useEffect(() => {
    if (!auto || !state || ended || state.result) return;

    const timer = setTimeout(() => {
      // 获取当前行动单位
      const allUnits = getAllUnits(state);
      const currentActor = allUnits[state.currentActorIndex];

      if (!currentActor || currentActor.hp <= 0) return;

      // AI选择行动
      if (currentActor.isPlayerSide) {
        // 玩家方自动：随机攻击敌人
        const aliveEnemies = state.enemies.filter(e => e.hp > 0);
        if (aliveEnemies.length > 0) {
          const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          const action: BattleAction = {
            actorId: currentActor.id,
            type: 'attack',
            targetId: target.id,
          };
          executeAction(action);
        }
      } else {
        // 敌人自动：随机攻击玩家方
        const aliveAllies = [
          ...state.playerFormation.characters.filter(c => c && c.hp > 0),
          ...state.playerFormation.pets.filter(p => p && p.hp > 0),
        ] as CombatUnit[];

        if (aliveAllies.length > 0) {
          const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
          const action: BattleAction = {
            actorId: currentActor.id,
            type: 'attack',
            targetId: target.id,
          };
          executeAction(action);
        }
      }
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [auto, state, speed, ended]);

  // 处理目标选择
  const handleSelectTarget = (targetId: string) => {
    setSelectedTargetId(targetId === selectedTargetId ? null : targetId);
  };

  // 返回主界面
  const handleReturn = () => {
    clearBattle();
    gamePhase.value = 'playing';
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
        <p>加载战斗中...</p>
      </div>
    );
  }

  // 获取当前行动单位
  const allUnits = getAllUnits(state);
  const currentActor = allUnits[state.currentActorIndex];
  const isPlayerTurn = currentActor?.isPlayerSide && !auto;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col">
      {/* 顶部信息栏 */}
      <header className="bg-[#252540] px-4 py-2 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-400">回合:</span>{' '}
          <span className="font-medium">{state.round}</span>/{state.maxRounds}
        </div>
        <button
          onClick={handleReturn}
          className="text-sm text-gray-400 hover:text-white touch-btn"
        >
          返回
        </button>
      </header>

      {/* 敌方区域 */}
      <div className="bg-gradient-to-b from-[#2a2a4e] to-[#1a1a2e] p-4">
        <div className="flex justify-center gap-4 flex-wrap">
          {state.enemies.map((enemy) => (
            <BattleUnit
              key={enemy.id}
              unit={enemy}
              isEnemy
              isActive={currentActor?.id === enemy.id}
              selectable={isPlayerTurn && enemy.hp > 0}
              onClick={() => isPlayerTurn && enemy.hp > 0 && handleSelectTarget(enemy.id)}
            />
          ))}
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="flex-1 p-4 overflow-hidden">
        <BattleLog />
      </div>

      {/* 我方区域 - 人物 */}
      <div className="bg-gradient-to-t from-[#252540] to-[#1a1a2e] p-4">
        <div className="flex justify-center gap-4 flex-wrap mb-2">
          {state.playerFormation.characters.map((char, index) =>
            char ? (
              <BattleUnit
                key={char.id}
                unit={char}
                isActive={currentActor?.id === char.id}
              />
            ) : (
              <div
                key={`empty-char-${index}`}
                className="w-20 h-24 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-600"
              >
                空
              </div>
            )
          )}
        </div>

        {/* 我方区域 - 宠物 */}
        <div className="flex justify-center gap-4 flex-wrap">
          {state.playerFormation.pets.map((pet, index) =>
            pet ? (
              <BattleUnit
                key={pet.id}
                unit={pet}
                isPet
                isActive={currentActor?.id === pet.id}
              />
            ) : (
              <div
                key={`empty-pet-${index}`}
                className="w-20 h-20 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-600 text-xs"
              >
                空
              </div>
            )
          )}
        </div>
      </div>

      {/* 操作区域 */}
      <div className="bg-[#252540] p-4 border-t border-gray-700">
        <BattleActions
          selectedTargetId={selectedTargetId ?? undefined}
        />
      </div>
    </div>
  );
}

// 获取所有战斗单位（按速度排序）
function getAllUnits(state: { playerFormation: { characters: (CombatUnit | null)[]; pets: (CombatUnit | null)[] }; enemies: CombatUnit[] }): CombatUnit[] {
  const units: CombatUnit[] = [];

  for (const char of state.playerFormation.characters) {
    if (char && char.hp > 0) units.push(char);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) units.push(pet);
  }
  for (const enemy of state.enemies) {
    if (enemy.hp > 0) units.push(enemy);
  }

  return units.sort((a, b) => b.stats.speed - a.stats.speed);
}
