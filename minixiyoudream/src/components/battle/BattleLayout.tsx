// 战斗界面主布局

import { useState, useEffect, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  battleState,
  battleSpeed,
  isAutoBattle,
  isBattleEnded,
  executeAction,
  startBattle,
  clearBattle,
  isSkillUsable,
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

  // 获取当前行动单位
  const getCurrentActor = useCallback((): CombatUnit | null => {
    if (!state) return null;
    const allUnits = getAllUnits(state);
    return allUnits[state.currentActorIndex] ?? null;
  }, [state]);

  // 自动战斗逻辑
  useEffect(() => {
    if (!auto || !state || ended || state.result) return;

    const timer = setTimeout(() => {
      // 获取当前行动单位
      const currentActor = getCurrentActor();

      if (!currentActor || currentActor.hp <= 0) return;

      // AI选择行动
      if (currentActor.isPlayerSide) {
        // 玩家方自动AI
        executePlayerSideAI(currentActor, state);
      } else {
        // 敌人自动AI
        executeEnemyAI(currentActor, state);
      }
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [auto, state, speed, ended, getCurrentActor]);

  // 玩家方AI逻辑
  const executePlayerSideAI = (actor: CombatUnit, currentState: typeof state) => {
    if (!currentState) return;

    const aliveEnemies = currentState.enemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) return;

    // 优先使用技能
    const usableSkills = actor.skills.filter(skill => isSkillUsable(actor, skill.id));
    if (usableSkills.length > 0 && Math.random() < 0.5) {
      const skill = usableSkills[Math.floor(Math.random() * usableSkills.length)];
      // 根据技能目标类型选择目标
      const targetId = skill.targetType === 'single_enemy'
        ? aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)].id
        : undefined;

      const action: BattleAction = {
        actorId: actor.id,
        type: 'skill',
        skillId: skill.id,
        targetId,
      };
      executeAction(action);
      return;
    }

    // 普通攻击
    const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const action: BattleAction = {
      actorId: actor.id,
      type: 'attack',
      targetId: target.id,
    };
    executeAction(action);
  };

  // 敌人AI逻辑
  const executeEnemyAI = (actor: CombatUnit, currentState: typeof state) => {
    if (!currentState) return;

    const aliveAllies = [
      ...currentState.playerFormation.characters.filter(c => c && c.hp > 0),
      ...currentState.playerFormation.pets.filter(p => p && p.hp > 0),
    ] as CombatUnit[];

    if (aliveAllies.length === 0) return;

    // 优先使用技能
    const usableSkills = actor.skills.filter(skill => isSkillUsable(actor, skill.id));
    if (usableSkills.length > 0 && Math.random() < 0.3) {
      const skill = usableSkills[Math.floor(Math.random() * usableSkills.length)];
      const targetId = skill.targetType === 'single_enemy' || skill.targetType === 'single_ally'
        ? aliveAllies[Math.floor(Math.random() * aliveAllies.length)].id
        : undefined;

      const action: BattleAction = {
        actorId: actor.id,
        type: 'skill',
        skillId: skill.id,
        targetId,
      };
      executeAction(action);
      return;
    }

    // 普通攻击 - 优先攻击HP最低的目标
    const target = aliveAllies.reduce((lowest, unit) =>
      unit.hp < lowest.hp ? unit : lowest
    , aliveAllies[0]);

    const action: BattleAction = {
      actorId: actor.id,
      type: 'attack',
      targetId: target.id,
    };
    executeAction(action);
  };

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
      <div className="min-h-screen bg-gradient-to-b from-[#e3f2fd] to-[#fff8f0] text-[var(--game-text)] flex items-center justify-center">
        <p>加载战斗中...</p>
      </div>
    );
  }

  // 获取当前行动单位
  const currentActor = getCurrentActor();
  const isPlayerTurn = currentActor?.isPlayerSide && !auto;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f2fd] via-[#f5faff] to-[#fff8f0] text-[var(--game-text)] flex flex-col">
      {/* 顶部信息栏 */}
      <header className="game-panel mx-4 mt-4 px-4 py-2 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-[var(--game-text-muted)]">回合:</span>{' '}
          <span className="font-medium">{state.round}</span>/{state.maxRounds}
        </div>
        <button
          onClick={handleReturn}
          className="game-btn game-btn-sm text-sm"
        >
          返回
        </button>
      </header>

      {/* 敌方区域 */}
      <div className="bg-gradient-to-b from-transparent to-[var(--game-bg-panel)]/30 p-4">
        <div className="flex justify-center gap-4 flex-wrap">
          {state.enemies.map((enemy) => (
            <BattleUnit
              key={enemy.id}
              unit={enemy}
              isEnemy
              isActive={currentActor?.id === enemy.id}
              selectable={isPlayerTurn && enemy.hp > 0}
              isSelected={selectedTargetId === enemy.id}
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
      <div className="bg-gradient-to-t from-[var(--game-bg-panel)]/50 to-transparent p-4">
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
                className="w-20 h-24 border border-dashed border-[var(--game-border)] rounded-lg flex items-center justify-center text-[var(--game-text-dim)] bg-white/50"
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
                className="w-20 h-20 border border-dashed border-[var(--game-border)] rounded-lg flex items-center justify-center text-[var(--game-text-dim)] text-xs bg-white/50"
              >
                空
              </div>
            )
          )}
        </div>
      </div>

      {/* 操作区域 */}
      <div className="game-panel mx-4 mb-4 p-4">
        <BattleActions
          selectedTargetId={selectedTargetId ?? undefined}
          onSelectTarget={handleSelectTarget}
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
