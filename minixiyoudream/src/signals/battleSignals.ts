// 战斗状态管理

import { signal, computed } from '@preact/signals-react';
import type { BattleState, BattleFormation, CombatUnit, BattleAction, BattleLog, BattleResult, Skill, PetSkill } from '@/types';
import { generateUUID } from '@/types';
import { player } from './playerSignals';
import { activePet } from './petSignals';
import { activeCompanions } from './companionSignals';
import { removeItem } from './inventorySignals';
import { getSkill } from '@/constants/skills';
import { getItemTemplate } from '@/constants/items';

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

  // 获取玩家已学习的技能
  const playerSkills = currentPlayer.skills
    .map(ls => getSkill(ls.skillId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

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
    skills: playerSkills,
    statusEffects: [],
    isDefending: false,
    isDead: false,
    position: 0,
  };

  // 获取出战的伙伴
  const companions = activeCompanions.value;
  const companionUnits: (CombatUnit | null)[] = [null, null];

  companions.forEach((companion, index) => {
    if (index < 2) {
      // 获取伙伴已学习的技能
      const companionSkills = companion.skills
        .map(ls => getSkill(ls.skillId))
        .filter((s): s is NonNullable<typeof s> => s !== undefined);

      companionUnits[index] = {
        id: companion.id,
        name: companion.name,
        type: 'companion',
        isPlayerSide: true,
        stats: companion.finalStats,
        elementResistances: companion.elementResistances,
        hp: companion.hp,
        maxHp: companion.maxHp,
        mp: companion.mp,
        maxMp: companion.maxMp,
        skills: companionSkills,
        statusEffects: [],
        isDefending: false,
        isDead: false,
        position: index + 1,
      };
    }
  });

  // 获取出战的宠物
  const pet = activePet.value;
  const petUnits: (CombatUnit | null)[] = [null, null, null];

  if (pet) {
    // 转换宠物技能为战斗技能格式
    const petSkills = pet.skills
      .filter(ps => ps.type === 'active') // 只使用主动技能
      .map(ps => convertPetSkillToSkill(ps));

    petUnits[0] = {
      id: pet.id,
      name: pet.nickname || pet.name,
      type: 'pet',
      isPlayerSide: true,
      stats: pet.stats,
      elementResistances: { fire: 0, ice: 0, thunder: 0 },
      hp: pet.hp,
      maxHp: pet.maxHp,
      mp: pet.mp,
      maxMp: pet.maxMp,
      skills: petSkills,
      statusEffects: [],
      isDefending: false,
      isDead: false,
      position: 0,
    };
  }

  // 添加伙伴的宠物
  companions.forEach((companion, companionIndex) => {
    if (companion.activePetId && companionIndex < 2) {
      const companionPet = companion.pets.find(p => p.id === companion.activePetId);
      if (companionPet) {
        const companionPetSkills = companionPet.skills
          .filter(ps => ps.type === 'active')
          .map(ps => convertPetSkillToSkill(ps));

        petUnits[companionIndex + 1] = {
          id: companionPet.id,
          name: companionPet.nickname || companionPet.name,
          type: 'pet',
          isPlayerSide: true,
          stats: companionPet.stats,
          elementResistances: { fire: 0, ice: 0, thunder: 0 },
          hp: companionPet.hp,
          maxHp: companionPet.maxHp,
          mp: companionPet.mp,
          maxMp: companionPet.maxMp,
          skills: companionPetSkills,
          statusEffects: [],
          isDefending: false,
          isDead: false,
          position: companionIndex + 1,
        };
      }
    }
  });

  // 创建阵容
  const formation: BattleFormation = {
    characters: [playerUnit, companionUnits[0], companionUnits[1]],
    pets: petUnits,
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
    case 'skill': {
      // 查找技能
      const skill = actor.skills.find(s => s.id === action.skillId);
      if (!skill) {
        log.text = `${actor.name} 技能不存在`;
        break;
      }

      // 检查MP
      if (actor.mp < skill.mpCost) {
        log.text = `${actor.name} MP不足，无法使用 ${skill.name}`;
        break;
      }

      // 扣除MP
      actor.mp -= skill.mpCost;

      // 获取目标
      const targets = getSkillTargets(skill, actor, action.targetId);

      if (targets.length === 0) {
        log.text = `${actor.name} 使用 ${skill.name}，但没有有效目标`;
        break;
      }

      // 执行技能效果
      const effectTexts: string[] = [];
      for (const effect of skill.effects) {
        for (const target of targets) {
          const result = applySkillEffect(effect, actor, target, skill);
          if (result.damage) {
            log.result.damage = (log.result.damage || 0) + result.damage;
          }
          if (result.heal) {
            log.result.heal = (log.result.heal || 0) + result.heal;
          }
          effectTexts.push(result.text);
        }
      }

      log.text = `${actor.name} 使用 ${skill.name}：${effectTexts.join('；')}`;
      if (targets.length === 1) {
        log.target = { id: targets[0].id, name: targets[0].name };
      }
      break;
    }
    case 'item': {
      // 获取道具模板
      const itemTemplate = getItemTemplate(action.itemId || '');
      if (!itemTemplate) {
        log.text = `${actor.name} 道具不存在`;
        break;
      }

      // 执行道具效果
      const effectTexts: string[] = [];
      for (const effect of itemTemplate.effects || []) {
        const target = action.targetId ? findUnit(action.targetId) : actor;
        if (target) {
          const result = applyItemEffect(effect, target);
          if (result.heal) {
            log.result.heal = (log.result.heal || 0) + result.heal;
          }
          effectTexts.push(result.text);
          log.target = { id: target.id, name: target.name };
        }
      }

      // 从背包移除道具
      removeItem(action.itemId || '', 1);

      log.text = `${actor.name} 使用 ${itemTemplate.name}：${effectTexts.join('；')}`;
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

/** 获取技能目标 */
function getSkillTargets(skill: Skill, actor: CombatUnit, targetId?: string): CombatUnit[] {
  const state = battleState.value;
  if (!state) return [];

  const targets: CombatUnit[] = [];

  switch (skill.targetType) {
    case 'single_enemy': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && !target.isPlayerSide && target.hp > 0) {
          targets.push(target);
        }
      }
      break;
    }
    case 'all_enemies': {
      for (const enemy of state.enemies) {
        if (enemy.hp > 0) targets.push(enemy);
      }
      break;
    }
    case 'single_ally': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && target.isPlayerSide && target.hp > 0) {
          targets.push(target);
        }
      } else {
        targets.push(actor); // 默认自身
      }
      break;
    }
    case 'all_allies': {
      for (const char of state.playerFormation.characters) {
        if (char && char.hp > 0) targets.push(char);
      }
      for (const pet of state.playerFormation.pets) {
        if (pet && pet.hp > 0) targets.push(pet);
      }
      break;
    }
    case 'self': {
      targets.push(actor);
      break;
    }
    case 'dead_ally': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && target.isPlayerSide && target.hp <= 0) {
          targets.push(target);
        }
      }
      break;
    }
  }

  return targets;
}

/** 应用技能效果 */
function applySkillEffect(
  effect: { type: string; damageType?: string; baseValue?: number; multiplier?: number; statScale?: { stat: string; ratio: number }; duration?: number },
  actor: CombatUnit,
  target: CombatUnit,
  skill: Skill
): { damage?: number; heal?: number; text: string } {
  const result: { damage?: number; heal?: number; text: string } = { text: '' };

  switch (effect.type) {
    case 'damage': {
      let damage = effect.baseValue || 0;

      // 根据伤害类型计算
      if (effect.damageType === 'physical') {
        const attack = actor.stats.physicalAttack;
        const defense = target.isDefending ? target.stats.physicalDefense * 1.5 : target.stats.physicalDefense;
        damage = Math.max(1, (effect.baseValue || attack) * (effect.multiplier || skill.multiplier) - defense);
      } else if (effect.damageType === 'magic') {
        const magicAtk = actor.stats.magicAttack;
        const magicDef = target.stats.magicDefense;
        damage = Math.max(1, (effect.baseValue || magicAtk) * (effect.multiplier || skill.multiplier) - magicDef);
      }

      // 暴击判定
      const isCritical = Math.random() < actor.stats.critRate;
      if (isCritical) {
        damage = Math.floor(damage * (1.5 + actor.stats.critDamage));
      }

      // 随机因子
      const randomFactor = 0.9 + Math.random() * 0.2;
      damage = Math.floor(damage * randomFactor);

      target.hp = Math.max(0, target.hp - damage);
      result.damage = damage;
      result.text = `${target.name} 受到 ${damage} 点伤害${isCritical ? '（暴击！）' : ''}`;
      break;
    }
    case 'heal': {
      let heal = effect.baseValue || 0;

      // 根据属性加成
      if (effect.statScale) {
        const stats = actor.stats as unknown as Record<string, number>;
        const statValue = stats[effect.statScale.stat] || 0;
        heal += Math.floor(statValue * effect.statScale.ratio);
      }

      heal = Math.floor(heal * (effect.multiplier || 1));
      target.hp = Math.min(target.maxHp, target.hp + heal);
      result.heal = heal;
      result.text = `${target.name} 恢复 ${heal} 点生命`;
      break;
    }
    default:
      result.text = `对 ${target.name} 产生效果`;
  }

  return result;
}

/** 应用道具效果 */
function applyItemEffect(
  effect: { type: string; value?: number },
  target: CombatUnit
): { heal?: number; text: string } {
  const result: { heal?: number; text: string } = { text: '' };

  switch (effect.type) {
    case 'heal_hp': {
      const heal = effect.value || 0;
      target.hp = Math.min(target.maxHp, target.hp + heal);
      result.heal = heal;
      result.text = `恢复 ${heal} 点HP`;
      break;
    }
    case 'heal_mp': {
      const heal = effect.value || 0;
      target.mp = Math.min(target.maxMp, target.mp + heal);
      result.heal = heal;
      result.text = `恢复 ${heal} 点MP`;
      break;
    }
    default:
      result.text = '产生效果';
  }

  return result;
}

/** 将宠物技能转换为战斗技能格式 */
function convertPetSkillToSkill(petSkill: PetSkill): Skill {
  return {
    id: petSkill.id,
    name: petSkill.name,
    description: petSkill.description,
    icon: '🐾',
    type: petSkill.type as 'active',
    damageType: 'physical',
    levelRequirement: 1,
    rarity: 'common',
    targetType: 'single_enemy',
    element: petSkill.element || 'none',
    mpCost: petSkill.mpCost || 0,
    cooldown: petSkill.cooldown || 0,
    effects: [{
      type: 'damage',
      damageType: 'physical',
      element: petSkill.element,
      baseValue: 10,
      multiplier: petSkill.multiplier || 1,
      description: petSkill.description,
    }],
    multiplier: petSkill.multiplier || 1,
  };
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
