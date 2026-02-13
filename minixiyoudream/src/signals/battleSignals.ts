// 战斗状态管理

import { signal, computed } from '@preact/signals-react';
import type { BattleState, BattleFormation, CombatUnit, BattleAction, BattleLog, BattleResult } from '@/types';
import { generateUUID } from '@/types';
import { player } from './playerSignals';

/** 战斗状态 */
export const battleState = signal<BattleState | null>(null);

/** 是否在战斗中 */
export const isInBattle = computed(() => battleState.value !== null);

/** 当前回合 */
export const currentRound = computed(() => battleState.value?.round ?? 0);

/** 战斗速度 */
export const battleSpeed = signal<1 | 2 | 3>(1);

/** 是否自动战斗 */
export const isAutoBattle = signal(false);

/** 当前行动单位索引 */
export const currentActorIndex = computed(() => battleState.value?.currentActorIndex ?? 0);

/** 玩家阵容 */
export const playerFormation = computed<BattleFormation>(() => {
  const state = battleState.value;
  if (!state) {
    return { characters: [null, null, null], pets: [null, null, null] };
  }
  return state.playerFormation;
});

/** 敌人列表 */
export const enemies = computed(() => battleState.value?.enemies ?? []);

/** 行动队列 */
export const actionQueue = computed(() => {
  const state = battleState.value;
  if (!state) return [];

  const allUnits: CombatUnit[] = [];

  // 添加玩家方单位
  for (const char of state.playerFormation.characters) {
    if (char && char.hp > 0) allUnits.push(char);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) allUnits.push(pet);
  }

  // 添加敌人
  for (const enemy of state.enemies) {
    if (enemy.hp > 0) allUnits.push(enemy);
  }

  // 按速度排序
  return allUnits.sort((a, b) => b.stats.speed - a.stats.speed);
});

/** 战斗是否结束 */
export const isBattleEnded = computed(() => {
  const state = battleState.value;
  if (!state) return false;

  // 检查玩家方是否全灭
  const playerAlive = state.playerFormation.characters.some(c => c && c.hp > 0) ||
    state.playerFormation.pets.some(p => p && p.hp > 0);

  // 检查敌人是否全灭
  const enemyAlive = state.enemies.some(e => e.hp > 0);

  return !playerAlive || !enemyAlive;
});

/** 战斗结果 */
export const battleResult = computed(() => battleState.value?.result);

/** 开始战斗 */
export function startBattle(enemyUnits: CombatUnit[]): void {
  const currentPlayer = player.value;
  if (!currentPlayer) return;

  // 创建玩家战斗单位
  const playerUnit: CombatUnit = {
    id: currentPlayer.id,
    name: currentPlayer.name,
    type: 'player',
    isPlayerSide: true,
    stats: currentPlayer.finalStats,
    elementResistances: currentPlayer.elementResistances,
    hp: currentPlayer.hp,
    maxHp: currentPlayer.maxHp,
    mp: currentPlayer.mp,
    maxMp: currentPlayer.maxMp,
    skills: [],
    statusEffects: [],
    isDefending: false,
    isDead: false,
    position: 0,
  };

  // 创建阵容
  const formation: BattleFormation = {
    characters: [playerUnit, null, null],
    pets: [null, null, null],
  };

  // 创建战斗状态
  const newBattleState: BattleState = {
    id: generateUUID(),
    playerFormation: formation,
    enemies: enemyUnits,
    actionQueue: [],
    currentActorIndex: 0,
    round: 1,
    maxRounds: 30,
    logs: [],
    isAuto: false,
    speed: 1,
    seed: Date.now(),
  };

  battleState.value = newBattleState;
}

/** 执行行动 */
export function executeAction(action: BattleAction): void {
  const state = battleState.value;
  if (!state) return;

  // 查找行动者
  const actor = findUnit(action.actorId);
  if (!actor) return;

  // 生成日志
  const log: BattleLog = {
    round: state.round,
    timestamp: Date.now(),
    actor: {
      id: actor.id,
      name: actor.name,
      isPlayer: actor.isPlayerSide,
    },
    action: action.type,
    skillId: action.skillId,
    itemId: action.itemId,
    result: {},
    text: '',
  };

  // 处理不同行动类型
  switch (action.type) {
    case 'attack': {
      const target = findUnit(action.targetId || '');
      if (target) {
        const damage = calculateDamage(actor, target);
        target.hp = Math.max(0, target.hp - damage.damage);
        log.target = { id: target.id, name: target.name };
        log.result.damage = damage.damage;
        log.result.isCritical = damage.isCritical;
        log.text = `${actor.name} 对 ${target.name} 造成 ${damage.damage} 点伤害${damage.isCritical ? '（暴击！）' : ''}`;
      }
      break;
    }
    case 'defend': {
      actor.isDefending = true;
      log.text = `${actor.name} 进入防御姿态`;
      break;
    }
    case 'escape': {
      const escaped = Math.random() > 0.5;
      log.result.isMiss = !escaped;
      log.text = escaped ? `${actor.name} 成功逃脱` : `${actor.name} 逃跑失败`;
      if (escaped) {
        // 结束战斗
        endBattle(false);
        return;
      }
      break;
    }
  }

  // 添加日志
  state.logs.push(log);

  // 更新状态
  battleState.value = { ...state };

  // 检查战斗结束
  checkBattleEnd();
}

/** 计算伤害 */
function calculateDamage(attacker: CombatUnit, defender: CombatUnit): { damage: number; isCritical: boolean } {
  const attack = attacker.stats.physicalAttack;
  const defense = defender.isDefending ? defender.stats.physicalDefense * 1.5 : defender.stats.physicalDefense;

  let baseDamage = Math.max(1, attack - defense);
  const randomFactor = 0.9 + Math.random() * 0.2;

  const isCritical = Math.random() < attacker.stats.critRate;
  const critMultiplier = isCritical ? (1.5 + attacker.stats.critDamage) : 1;

  const damage = Math.floor(baseDamage * randomFactor * critMultiplier);

  return { damage: Math.max(1, damage), isCritical };
}

/** 查找战斗单位 */
function findUnit(id: string): CombatUnit | undefined {
  const state = battleState.value;
  if (!state) return undefined;

  for (const char of state.playerFormation.characters) {
    if (char?.id === id) return char;
  }
  for (const pet of state.playerFormation.pets) {
    if (pet?.id === id) return pet;
  }
  for (const enemy of state.enemies) {
    if (enemy.id === id) return enemy;
  }

  return undefined;
}

/** 检查战斗结束 */
function checkBattleEnd(): void {
  const state = battleState.value;
  if (!state) return;

  const playerAlive = state.playerFormation.characters.some(c => c && c.hp > 0) ||
    state.playerFormation.pets.some(p => p && p.hp > 0);
  const enemyAlive = state.enemies.some(e => e.hp > 0);

  if (!playerAlive || !enemyAlive) {
    endBattle(playerAlive);
  }
}

/** 结束战斗 */
export function endBattle(victory: boolean): void {
  const state = battleState.value;
  if (!state) return;

  const result: BattleResult = {
    victory,
    stats: {
      rounds: state.round,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      criticalHits: 0,
      skillsUsed: 0,
    },
    rewards: {
      exp: victory ? 50 : 0,
      gold: victory ? 30 : 0,
      items: [],
    },
  };

  battleState.value = {
    ...state,
    result,
  };
}

/** 清除战斗状态 */
export function clearBattle(): void {
  battleState.value = null;
}

/** 下一回合 */
export function nextRound(): void {
  const state = battleState.value;
  if (!state) return;

  // 重置防御状态
  for (const char of state.playerFormation.characters) {
    if (char) char.isDefending = false;
  }
  for (const pet of state.playerFormation.pets) {
    if (pet) pet.isDefending = false;
  }
  for (const enemy of state.enemies) {
    enemy.isDefending = false;
  }

  battleState.value = {
    ...state,
    round: state.round + 1,
    currentActorIndex: 0,
  };
}
