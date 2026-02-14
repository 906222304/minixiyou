// 战斗状态管理

import { signal, computed } from '@preact/signals-react';
import type { BattleState, BattleFormation, CombatUnit, BattleAction, BattleLog, BattleResult, Skill, PetSkill, ActionQueueItem } from '@/types';
import { generateUUID } from '@/types';
import { player } from './playerSignals';
import { activePet } from './petSignals';
import { activeCompanions } from './companionSignals';
import { removeItem } from './inventorySignals';
import { getSkill } from '@/constants/skills';
import { getItemTemplate } from '@/constants/items';

/** 技能冷却追踪 */
interface SkillCooldown {
  skillId: string;
  remainingCooldown: number;
}

/** 单位技能冷却映射 */
const unitCooldowns = new Map<string, SkillCooldown[]>();

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

/** 获取所有存活单位 */
function getAllAliveUnits(state: BattleState): CombatUnit[] {
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

  return units;
}

/** 构建行动队列 */
function buildActionQueue(state: BattleState): ActionQueueItem[] {
  const units = getAllAliveUnits(state);
  return units
    .map(unit => ({
      unit,
      speed: unit.stats.speed,
      isPlayerSide: unit.isPlayerSide,
      position: unit.position,
    }))
    .sort((a, b) => b.speed - a.speed);
}

/** 行动队列 */
export const actionQueue = computed(() => {
  const state = battleState.value;
  if (!state) return [];
  return buildActionQueue(state);
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

  // 清空技能冷却
  unitCooldowns.clear();

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

  // 初始化玩家技能冷却
  unitCooldowns.set(playerUnit.id, playerSkills.map(s => ({
    skillId: s.id,
    remainingCooldown: 0,
  })));

  // 获取出战的伙伴
  const companions = activeCompanions.value;
  const companionUnits: (CombatUnit | null)[] = [null, null];

  companions.forEach((companion, index) => {
    if (index < 2) {
      // 获取伙伴已学习的技能
      const companionSkills = companion.skills
        .map(ls => getSkill(ls.skillId))
        .filter((s): s is NonNullable<typeof s> => s !== undefined);

      const companionUnit: CombatUnit = {
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
      companionUnits[index] = companionUnit;

      // 初始化伙伴技能冷却
      unitCooldowns.set(companionUnit.id, companionSkills.map(s => ({
        skillId: s.id,
        remainingCooldown: 0,
      })));
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

    const petUnit: CombatUnit = {
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
    petUnits[0] = petUnit;

    // 初始化宠物技能冷却
    unitCooldowns.set(petUnit.id, petSkills.map(s => ({
      skillId: s.id,
      remainingCooldown: 0,
    })));
  }

  // 添加伙伴的宠物
  companions.forEach((companion, companionIndex) => {
    if (companion.activePetId && companionIndex < 2) {
      const companionPet = companion.pets.find(p => p.id === companion.activePetId);
      if (companionPet) {
        const companionPetSkills = companionPet.skills
          .filter(ps => ps.type === 'active')
          .map(ps => convertPetSkillToSkill(ps));

        const companionPetUnit: CombatUnit = {
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
        petUnits[companionIndex + 1] = companionPetUnit;

        // 初始化伙伴宠物技能冷却
        unitCooldowns.set(companionPetUnit.id, companionPetSkills.map(s => ({
          skillId: s.id,
          remainingCooldown: 0,
        })));
      }
    }
  });

  // 初始化敌人技能冷却
  enemyUnits.forEach(enemy => {
    unitCooldowns.set(enemy.id, enemy.skills.map(s => ({
      skillId: s.id,
      remainingCooldown: 0,
    })));
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

  // 构建初始行动队列
  newBattleState.actionQueue = buildActionQueue(newBattleState);

  // 添加战斗开始日志
  newBattleState.logs.push({
    round: 0,
    timestamp: Date.now(),
    actor: { id: 'system', name: '系统', isPlayer: false },
    action: 'attack',
    result: {},
    text: '战斗开始！',
  });

  battleState.value = newBattleState;
}

/** 检查技能是否可用（冷却和MP） */
export function isSkillUsable(unit: CombatUnit, skillId: string): boolean {
  const skill = unit.skills.find(s => s.id === skillId);
  if (!skill) return false;

  // 检查MP
  if (unit.mp < skill.mpCost) return false;

  // 检查冷却
  const cooldowns = unitCooldowns.get(unit.id);
  if (cooldowns) {
    const cd = cooldowns.find(c => c.skillId === skillId);
    if (cd && cd.remainingCooldown > 0) return false;
  }

  return true;
}

/** 获取技能剩余冷却 */
export function getSkillCooldown(unitId: string, skillId: string): number {
  const cooldowns = unitCooldowns.get(unitId);
  if (cooldowns) {
    const cd = cooldowns.find(c => c.skillId === skillId);
    return cd?.remainingCooldown ?? 0;
  }
  return 0;
}

/** 执行行动 */
export function executeAction(action: BattleAction): void {
  const state = battleState.value;
  if (!state) return;

  // 查找行动者
  const actor = findUnit(action.actorId);
  if (!actor || actor.hp <= 0) return;

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
      if (target && target.hp > 0) {
        const damage = calculateDamage(actor, target);
        target.hp = Math.max(0, target.hp - damage.damage);
        log.target = { id: target.id, name: target.name };
        log.result.damage = damage.damage;
        log.result.isCritical = damage.isCritical;
        log.result.isMiss = damage.isMiss;
        if (damage.isMiss) {
          log.text = `${actor.name} 攻击 ${target.name}，但是被闪避了！`;
        } else {
          log.text = `${actor.name} 对 ${target.name} 造成 ${damage.damage} 点伤害${damage.isCritical ? '（暴击！）' : ''}`;
        }
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

      // 检查技能是否可用
      if (!isSkillUsable(actor, action.skillId!)) {
        const cd = getSkillCooldown(actor.id, action.skillId!);
        if (cd > 0) {
          log.text = `${actor.name} 的 ${skill.name} 还在冷却中（剩余${cd}回合）`;
        } else {
          log.text = `${actor.name} MP不足，无法使用 ${skill.name}`;
        }
        break;
      }

      // 扣除MP
      actor.mp -= skill.mpCost;

      // 设置冷却
      if (skill.cooldown > 0) {
        const cooldowns = unitCooldowns.get(actor.id);
        if (cooldowns) {
          const cd = cooldowns.find(c => c.skillId === skill.id);
          if (cd) {
            cd.remainingCooldown = skill.cooldown;
          }
        }
      }

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
      log.text = `${actor.name} 进入防御姿态，受到伤害减半`;
      break;
    }
    case 'escape': {
      // 逃跑成功率基于速度差
      const avgEnemySpeed = state.enemies.filter(e => e.hp > 0)
        .reduce((sum, e) => sum + e.stats.speed, 0) / Math.max(1, state.enemies.filter(e => e.hp > 0).length);
      const escapeChance = 0.3 + (actor.stats.speed - avgEnemySpeed) * 0.01;
      const escaped = Math.random() < Math.min(0.8, Math.max(0.1, escapeChance));

      log.result.isMiss = !escaped;
      log.text = escaped ? `${actor.name} 成功逃脱战斗！` : `${actor.name} 逃跑失败`;
      if (escaped) {
        state.logs.push(log);
        battleState.value = { ...state };
        // 结束战斗
        endBattle(false);
        return;
      }
      break;
    }
  }

  // 添加日志
  state.logs.push(log);

  // 推进到下一个行动者
  advanceToNextActor();

  // 检查战斗结束
  checkBattleEnd();
}

/** 推进到下一个行动者 */
function advanceToNextActor(): void {
  const state = battleState.value;
  if (!state) return;

  // 重新计算行动队列（因为可能有单位死亡）
  const aliveUnits = getAllAliveUnits(state);

  // 如果战斗已结束，不推进
  if (aliveUnits.length === 0) return;

  // 获取当前索引，跳过死亡单位
  let nextIndex = state.currentActorIndex + 1;

  // 如果已经到达队列末尾，开始新回合
  if (nextIndex >= aliveUnits.length) {
    startNewRound();
    return;
  }

  // 更新索引
  state.currentActorIndex = nextIndex;
  battleState.value = { ...state };
}

/** 开始新回合 */
function startNewRound(): void {
  const state = battleState.value;
  if (!state) return;

  // 检查是否达到最大回合数
  if (state.round >= state.maxRounds) {
    endBattle(false);
    return;
  }

  // 重置所有单位的防御状态
  for (const char of state.playerFormation.characters) {
    if (char) char.isDefending = false;
  }
  for (const pet of state.playerFormation.pets) {
    if (pet) pet.isDefending = false;
  }
  for (const enemy of state.enemies) {
    enemy.isDefending = false;
  }

  // 减少所有单位的技能冷却
  for (const char of state.playerFormation.characters) {
    if (char) reduceCooldowns(char.id);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet) reduceCooldowns(pet.id);
  }
  for (const enemy of state.enemies) {
    reduceCooldowns(enemy.id);
  }

  // 处理状态效果（DoT/HoT）
  processStatusEffects();

  // 增加回合数
  state.round += 1;
  state.currentActorIndex = 0;

  // 重建行动队列
  state.actionQueue = buildActionQueue(state);

  // 添加回合开始日志
  state.logs.push({
    round: state.round,
    timestamp: Date.now(),
    actor: { id: 'system', name: '系统', isPlayer: false },
    action: 'attack',
    result: {},
    text: `第 ${state.round} 回合开始`,
  });

  battleState.value = { ...state };

  // 检查战斗结束（可能因为DoT死亡）
  checkBattleEnd();
}

/** 减少单位技能冷却 */
function reduceCooldowns(unitId: string): void {
  const cooldowns = unitCooldowns.get(unitId);
  if (cooldowns) {
    for (const cd of cooldowns) {
      if (cd.remainingCooldown > 0) {
        cd.remainingCooldown--;
      }
    }
  }
}

/** 处理状态效果 */
function processStatusEffects(): void {
  const state = battleState.value;
  if (!state) return;

  const effectLogs: string[] = [];

  // 处理所有单位的状态效果
  const allUnits = getAllAliveUnits(state);

  for (const unit of allUnits) {
    const expiredEffects: string[] = [];

    for (let i = unit.statusEffects.length - 1; i >= 0; i--) {
      const effect = unit.statusEffects[i];

      // 处理DoT伤害
      if (effect.dotDamage && effect.dotDamage > 0) {
        unit.hp = Math.max(0, unit.hp - effect.dotDamage);
        effectLogs.push(`${unit.name} 受到 ${effect.dotDamage} 点${effect.name}伤害`);
      }

      // 处理HoT治疗
      if (effect.hotHeal && effect.hotHeal > 0) {
        const heal = Math.min(effect.hotHeal, unit.maxHp - unit.hp);
        unit.hp += heal;
        effectLogs.push(`${unit.name} 恢复 ${heal} 点生命`);
      }

      // 减少持续时间
      effect.remaining--;

      // 检查是否过期
      if (effect.remaining <= 0) {
        expiredEffects.push(effect.name);
        unit.statusEffects.splice(i, 1);
      }
    }

    if (expiredEffects.length > 0) {
      effectLogs.push(`${unit.name} 的 ${expiredEffects.join('、')} 效果已消失`);
    }
  }

  // 添加状态效果日志
  if (effectLogs.length > 0) {
    state.logs.push({
      round: state.round,
      timestamp: Date.now(),
      actor: { id: 'system', name: '系统', isPlayer: false },
      action: 'attack',
      result: {},
      text: effectLogs.join('；'),
    });
  }
}

/** 计算伤害 */
function calculateDamage(attacker: CombatUnit, defender: CombatUnit): { damage: number; isCritical: boolean; isMiss: boolean } {
  // 命中判定
  const hitChance = attacker.stats.hitRate - defender.stats.dodgeRate;
  if (Math.random() > Math.max(0.1, Math.min(0.99, hitChance))) {
    return { damage: 0, isCritical: false, isMiss: true };
  }

  const attack = attacker.stats.physicalAttack;
  // 防御状态减伤50%
  const defense = defender.isDefending ? defender.stats.physicalDefense * 1.5 : defender.stats.physicalDefense;

  // 基础伤害 = 攻击 - 防御
  let baseDamage = Math.max(1, attack - defense);

  // 随机波动 90%-110%
  const randomFactor = 0.9 + Math.random() * 0.2;

  // 暴击判定
  const isCritical = Math.random() < attacker.stats.critRate;
  // 暴击伤害 = 150% + 暴击伤害加成
  const critMultiplier = isCritical ? (1.5 + attacker.stats.critDamage) : 1;

  const damage = Math.floor(baseDamage * randomFactor * critMultiplier);

  return { damage: Math.max(1, damage), isCritical, isMiss: false };
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
  effect: { type: string; damageType?: string; element?: string; baseValue?: number; multiplier?: number; statScale?: { stat: string; ratio: number }; duration?: number },
  actor: CombatUnit,
  target: CombatUnit,
  skill: Skill
): { damage?: number; heal?: number; text: string } {
  const result: { damage?: number; heal?: number; text: string } = { text: '' };

  switch (effect.type) {
    case 'damage': {
      // 命中判定
      const hitChance = actor.stats.hitRate - target.stats.dodgeRate;
      if (Math.random() > Math.max(0.1, Math.min(0.99, hitChance))) {
        result.text = `${target.name} 闪避了攻击`;
        return result;
      }

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
      } else if (effect.damageType === 'true') {
        // 真实伤害无视防御
        damage = (effect.baseValue || 0) * (effect.multiplier || skill.multiplier);
      } else if (effect.damageType === 'fixed') {
        // 固定伤害
        damage = effect.baseValue || 0;
      }

      // 元素克制加成
      let elementBonus = 1;
      if (effect.element && effect.element !== 'none' && effect.element !== 'physical') {
        const elementResistance = target.elementResistances[effect.element as 'fire' | 'ice' | 'thunder'] || 0;
        // 抗性减少伤害，负抗性增加伤害
        elementBonus = 1 - elementResistance * 0.01;
      }

      // 暴击判定
      const isCritical = Math.random() < actor.stats.critRate;
      if (isCritical) {
        damage = Math.floor(damage * (1.5 + actor.stats.critDamage));
      }

      // 随机因子 90%-110%
      const randomFactor = 0.9 + Math.random() * 0.2;
      damage = Math.floor(damage * randomFactor * elementBonus);

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
      // 治疗不超过最大HP
      const actualHeal = Math.min(heal, target.maxHp - target.hp);
      target.hp = Math.min(target.maxHp, target.hp + actualHeal);
      result.heal = actualHeal;
      result.text = `${target.name} 恢复 ${actualHeal} 点生命`;
      break;
    }
    case 'buff':
    case 'debuff': {
      // 添加状态效果
      if (effect.duration && effect.duration > 0) {
        const statusEffect = {
          id: `${skill.id}_${target.id}_${Date.now()}`,
          name: skill.name,
          type: effect.type as 'buff' | 'debuff' | 'control',
          icon: skill.icon,
          statModifiers: effect.statScale ? { [effect.statScale.stat]: effect.statScale.ratio } : undefined,
          duration: effect.duration,
          remaining: effect.duration,
          sourceId: actor.id,
        };
        target.statusEffects.push(statusEffect);
        result.text = `${target.name} 获得 ${skill.name} 效果（${effect.duration}回合）`;
      } else {
        result.text = `对 ${target.name} 产生效果`;
      }
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

  // 计算战斗统计
  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let criticalHits = 0;
  let skillsUsed = 0;

  for (const log of state.logs) {
    if (log.actor.isPlayer) {
      totalDamageDealt += log.result.damage || 0;
      if (log.result.isCritical) criticalHits++;
      if (log.action === 'skill') skillsUsed++;
    } else {
      totalDamageTaken += log.result.damage || 0;
    }
  }

  // 计算奖励
  let expReward = 0;
  let goldReward = 0;
  const itemDrops: { itemId: string; count: number }[] = [];

  if (victory) {
    // 根据敌人等级和数量计算奖励
    for (const enemy of state.enemies) {
      // 基础经验和金币
      const baseExp = Math.floor(20 + (enemy.stats.physicalAttack + enemy.stats.magicAttack) * 0.5);
      const baseGold = Math.floor(10 + enemy.maxHp * 0.1);

      expReward += baseExp;
      goldReward += baseGold;

      // 随机掉落物品 (10%概率)
      // TODO: 从敌人配置中获取掉落表
      if (Math.random() < 0.1) {
        itemDrops.push({ itemId: 'hp_potion_small', count: 1 });
      }
    }
  }

  const result: BattleResult = {
    victory,
    stats: {
      rounds: state.round,
      totalDamageDealt,
      totalDamageTaken,
      criticalHits,
      skillsUsed,
    },
    rewards: {
      exp: expReward,
      gold: goldReward,
      items: itemDrops,
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
  unitCooldowns.clear();
}
