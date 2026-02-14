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
import { autoBattleConfig, getCompanionAIConfig } from '@/signals/battleSignals';
import { gamePhase } from '@/signals/gameSignals';
import { player } from '@/signals/playerSignals';
import { BattleUnit } from './BattleUnit';
import { BattleLog } from './BattleLog';
import { BattleActions } from './BattleActions';
import { random, randomChoice } from '@/utils/prng';
import { logger } from '@/utils/logger';
import type { CombatUnit, BattleAction, TargetStrategy, CompanionAIConfig } from '@/types';
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
    // 检查是否应该执行自动战斗
    if (!auto || !state || ended || state.result) {
      logger.debug('[BattleLayout] 自动战斗条件不满足:', { auto, hasState: !!state, ended, hasResult: !!state?.result });
      return;
    }

    // 获取当前行动单位
    const currentActor = getCurrentActor();

    logger.debug('[BattleLayout] 自动战斗检查:', {
      currentActorIndex: state.currentActorIndex,
      currentActor: currentActor?.name,
      isPlayerSide: currentActor?.isPlayerSide,
      hp: currentActor?.hp
    });

    // 如果没有当前行动者或行动者已死亡，尝试推进
    if (!currentActor || currentActor.hp <= 0) {
      logger.debug('[BattleLayout] 当前行动者无效或已死亡');
      return;
    }

    const timer = setTimeout(() => {
      // 重新获取当前行动者（可能在等待期间状态已改变）
      const actor = getCurrentActor();
      const currentState = battleState.value;

      if (!actor || actor.hp <= 0 || !currentState || currentState.result) {
        logger.debug('[BattleLayout] 延迟执行时条件不满足');
        return;
      }

      console.log(`[BattleLayout] 执行自动战斗: ${actor.name} (${actor.isPlayerSide ? '玩家方' : '敌方'})`);

      // AI选择行动
      if (actor.isPlayerSide) {
        // 玩家方自动AI
        executePlayerSideAI(actor, currentState);
      } else {
        // 敌人自动AI
        executeEnemyAI(actor, currentState);
      }
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [auto, state?.currentActorIndex, state?.round, speed, ended, getCurrentActor]);

  // 非自动战斗时处理AI单位（敌人、宠物等）
  useEffect(() => {
    // 只在非自动战斗时执行
    if (auto || !state || ended || state.result) return;

    const currentActor = getCurrentActor();
    if (!currentActor || currentActor.hp <= 0) return;

    // 判断是否是AI控制的单位
    const isAIControlled = !currentActor.isPlayerSide || // 敌人
                           currentActor.type === 'pet';   // 宠物

    if (!isAIControlled) {
      logger.debug('[BattleLayout] 等待玩家操作:', currentActor.name);
      return;
    }

    console.log(`[BattleLayout] AI单位自动行动: ${currentActor.name} (${currentActor.type})`);

    const timer = setTimeout(() => {
      const actor = getCurrentActor();
      const currentState = battleState.value;

      if (!actor || actor.hp <= 0 || !currentState || currentState.result) return;

      if (!actor.isPlayerSide) {
        // 敌人AI
        executeEnemyAI(actor, currentState);
      } else if (actor.type === 'pet') {
        // 宠物AI
        executePlayerSideAI(actor, currentState);
      }
    }, 800 / speed);

    return () => clearTimeout(timer);
  }, [auto, state?.currentActorIndex, state?.round, speed, ended, getCurrentActor]);

  // 根据目标策略选择目标
  const selectTargetByStrategy = (enemies: CombatUnit[], strategy: TargetStrategy): CombatUnit => {
    if (enemies.length === 1) return enemies[0];

    switch (strategy) {
      case 'weakest':
        // 优先攻击最大HP最少的
        return enemies.reduce((weakest, unit) =>
          unit.maxHp < weakest.maxHp ? unit : weakest, enemies[0]);
      case 'strongest':
        // 优先攻击最大HP最多的
        return enemies.reduce((strongest, unit) =>
          unit.maxHp > strongest.maxHp ? unit : strongest, enemies[0]);
      case 'lowestHp':
        // 优先攻击当前HP最少的
        return enemies.reduce((lowest, unit) =>
          unit.hp < lowest.hp ? unit : lowest, enemies[0]);
      case 'highestHp':
        // 优先攻击当前HP最多的
        return enemies.reduce((highest, unit) =>
          unit.hp > highest.hp ? unit : highest, enemies[0]);
      case 'random':
      default:
        return randomChoice(enemies);
    }
  };

  // 玩家方AI逻辑 - 使用配置
  const executePlayerSideAI = (actor: CombatUnit, currentState: typeof state) => {
    if (!currentState) {
      logger.debug('[BattleLayout] executePlayerSideAI: 无状态');
      return;
    }

    const aliveEnemies = currentState.enemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) {
      logger.debug('[BattleLayout] executePlayerSideAI: 无存活敌人，跳过');
      // 即使没有敌人也执行防御行动以推进回合
      const action: BattleAction = {
        actorId: actor.id,
        type: 'defend',
      };
      executeAction(action);
      return;
    }

    // 获取配置
    const config = autoBattleConfig.value;
    const isCharacter = actor.type === 'player' || actor.type === 'companion';

    // 如果是伙伴，使用伙伴AI配置
    if (actor.type === 'companion') {
      executeCompanionAI(actor, currentState, aliveEnemies);
      return;
    }

    const autoConfig = isCharacter ? config.character : config.pet;

    // 检查是否需要使用药品（仅角色）
    if (isCharacter && config.character.autoUsePotion) {
      const hpPercent = (actor.hp / actor.maxHp) * 100;
      const mpPercent = (actor.mp / actor.maxMp) * 100;

      if (hpPercent < config.character.hpThreshold || mpPercent < config.character.mpThreshold) {
        // 尝试使用药品（这里简化处理，实际应检查背包）
        // 暂时跳过，继续攻击
      }
    }

    // 根据配置的优先技能选择
    const usableSkills = actor.skills.filter(skill => isSkillUsable(actor, skill.id));

    if (autoConfig.preferredSkillId) {
      const preferredSkill = usableSkills.find(s => s.id === autoConfig.preferredSkillId);
      if (preferredSkill) {
        const target = selectTargetByStrategy(aliveEnemies, autoConfig.targetStrategy);
        const action: BattleAction = {
          actorId: actor.id,
          type: 'skill',
          skillId: preferredSkill.id,
          targetId: preferredSkill.targetType === 'single_enemy' ? target.id : undefined,
        };
        executeAction(action);
        return;
      }
    }

    // 使用其他可用技能
    if (usableSkills.length > 0 && random() < 0.5) {
      const skill = randomChoice(usableSkills);
      const target = selectTargetByStrategy(aliveEnemies, autoConfig.targetStrategy);
      const action: BattleAction = {
        actorId: actor.id,
        type: 'skill',
        skillId: skill.id,
        targetId: skill.targetType === 'single_enemy' ? target.id : undefined,
      };
      executeAction(action);
      return;
    }

    // 普通攻击 - 使用目标策略
    const target = selectTargetByStrategy(aliveEnemies, autoConfig.targetStrategy);
    const action: BattleAction = {
      actorId: actor.id,
      type: 'attack',
      targetId: target.id,
    };
    executeAction(action);
  };

  // 伙伴AI逻辑 - 使用伙伴专属配置
  const executeCompanionAI = (actor: CombatUnit, currentState: NonNullable<typeof state>, aliveEnemies: CombatUnit[]) => {
    const companionConfig = getCompanionAIConfig(actor.id);

    // 获取存活的盟友
    const aliveAllies = [
      ...currentState.playerFormation.characters.filter(c => c && c.hp > 0),
      ...currentState.playerFormation.pets.filter(p => p && p.hp > 0),
    ] as CombatUnit[];

    // 检查是否需要防御（低血量）
    const hpPercent = (actor.hp / actor.maxHp) * 100;
    if (hpPercent < companionConfig.defensiveHpThreshold && companionConfig.strategy === 'defensive') {
      const action: BattleAction = {
        actorId: actor.id,
        type: 'defend',
      };
      executeAction(action);
      return;
    }

    // 检查是否需要治疗盟友
    if (companionConfig.autoHeal) {
      const woundedAlly = aliveAllies.find(ally => {
        const allyHpPercent = (ally.hp / ally.maxHp) * 100;
        return allyHpPercent < companionConfig.healThreshold;
      });

      if (woundedAlly) {
        // 查找治疗技能
        const healSkill = actor.skills.find(s =>
          s.targetType === 'single_ally' || s.targetType === 'all_allies'
        );

        if (healSkill && isSkillUsable(actor, healSkill.id)) {
          const action: BattleAction = {
            actorId: actor.id,
            type: 'skill',
            skillId: healSkill.id,
            targetId: healSkill.targetType === 'single_ally' ? woundedAlly.id : undefined,
          };
          executeAction(action);
          return;
        }
      }
    }

    // 根据技能优先级选择技能
    const usableSkills = actor.skills.filter(skill => isSkillUsable(actor, skill.id));

    if (companionConfig.skillPriority.length > 0) {
      for (const skillId of companionConfig.skillPriority) {
        const skill = usableSkills.find(s => s.id === skillId);
        if (skill) {
          const target = selectCompanionTarget(aliveEnemies, companionConfig);
          const action: BattleAction = {
            actorId: actor.id,
            type: 'skill',
            skillId: skill.id,
            targetId: skill.targetType === 'single_enemy' ? target.id : undefined,
          };
          executeAction(action);
          return;
        }
      }
    }

    // 使用其他可用技能
    if (usableSkills.length > 0) {
      // 根据策略决定技能使用频率
      const skillChance = companionConfig.strategy === 'aggressive' ? 0.7 :
                          companionConfig.strategy === 'defensive' ? 0.3 : 0.5;

      if (random() < skillChance) {
        const skill = randomChoice(usableSkills);
        const target = selectCompanionTarget(aliveEnemies, companionConfig);
        const action: BattleAction = {
          actorId: actor.id,
          type: 'skill',
          skillId: skill.id,
          targetId: skill.targetType === 'single_enemy' ? target.id : undefined,
        };
        executeAction(action);
        return;
      }
    }

    // 普通攻击
    const target = selectCompanionTarget(aliveEnemies, companionConfig);
    const action: BattleAction = {
      actorId: actor.id,
      type: 'attack',
      targetId: target.id,
    };
    executeAction(action);
  };

  // 伙伴目标选择
  const selectCompanionTarget = (enemies: CombatUnit[], config: CompanionAIConfig): CombatUnit => {
    if (enemies.length === 1) return enemies[0];

    switch (config.preferredTarget) {
      case 'boss':
        // 优先攻击Boss/精英（这里简化为攻击HP最多的）
        return enemies.reduce((boss, unit) =>
          unit.maxHp > boss.maxHp ? unit : boss, enemies[0]);
      case 'weakest':
        return enemies.reduce((weakest, unit) =>
          unit.maxHp < weakest.maxHp ? unit : weakest, enemies[0]);
      case 'highestDamage':
        // 优先攻击攻击力最高的
        return enemies.reduce((highest, unit) =>
          unit.stats.physicalAttack > highest.stats.physicalAttack ? unit : highest, enemies[0]);
      case 'lowestHp':
        return enemies.reduce((lowest, unit) =>
          unit.hp < lowest.hp ? unit : lowest, enemies[0]);
      case 'random':
      default:
        return randomChoice(enemies);
    }
  };

  // 敌人AI逻辑
  const executeEnemyAI = (actor: CombatUnit, currentState: typeof state) => {
    if (!currentState) {
      logger.debug('[BattleLayout] executeEnemyAI: 无状态');
      return;
    }

    const aliveAllies = [
      ...currentState.playerFormation.characters.filter(c => c && c.hp > 0),
      ...currentState.playerFormation.pets.filter(p => p && p.hp > 0),
    ] as CombatUnit[];

    if (aliveAllies.length === 0) {
      logger.debug('[BattleLayout] executeEnemyAI: 无存活目标，跳过');
      // 即使没有目标也执行防御行动以推进回合
      const action: BattleAction = {
        actorId: actor.id,
        type: 'defend',
      };
      executeAction(action);
      return;
    }

    // 优先使用技能
    const usableSkills = actor.skills.filter(skill => isSkillUsable(actor, skill.id));
    if (usableSkills.length > 0 && random() < 0.3) {
      const skill = randomChoice(usableSkills);
      const targetId = skill.targetType === 'single_enemy' || skill.targetType === 'single_ally'
        ? randomChoice(aliveAllies).id
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
    // 如果战斗未结束，弹出确认
    if (state && !state.result) {
      if (window.confirm('战斗尚未结束，确定要退出吗？')) {
        clearBattle();
        gamePhase.value = 'playing';
      }
    } else {
      clearBattle();
      gamePhase.value = 'playing';
    }
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
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-[var(--game-text-muted)]">回合:</span>{' '}
            <span className="font-medium">{state.round}</span>/{state.maxRounds}
          </div>
          {auto && (
            <span className="game-tag game-tag-green text-xs">
              自动战斗中
            </span>
          )}
        </div>
        <button
          onClick={handleReturn}
          className="game-btn game-btn-danger game-btn-sm text-sm px-4"
        >
          🚪 退出战斗
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
