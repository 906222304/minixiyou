// 战斗状态管理

import { signal, computed } from '@preact/signals-react';
import type { BattleState, BattleFormation, CombatUnit, BattleAction, BattleLog, BattleResult, Skill, PetSkill, ActionQueueItem, Enemy, AutoBattleConfig, CompanionAIConfig } from '@/types';
import { generateUUID, DEFAULT_AUTO_BATTLE_CONFIG, DEFAULT_COMPANION_AI_CONFIG } from '@/types';
import { player, getCaptureSkillLevel, calculateCaptureRate } from './playerSignals';
import { activePet } from './petSignals';
import { activeCompanions } from './companionSignals';
import { removeItem } from './inventorySignals';
import { getSkill } from '@/constants/skills';
import { getItemTemplate } from '@/constants/items';
import { updateKillQuestEvent, updateBattleWinEvent } from './questSignals';
import { createPet, addPet, petCount, maxPets } from './petSignals';
import { getEnemyTemplate } from '@/constants/enemies';

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

/** 获取所有存活单位（按速度排序） */
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

  // 按速度排序（高速度先行动）
  return units.sort((a, b) => b.stats.speed - a.stats.speed);
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
  if (!state) {
    console.log('[Battle] executeAction: 无战斗状态');
    return;
  }

  // 查找行动者
  const actor = findUnit(action.actorId);
  if (!actor || actor.hp <= 0) {
    console.log('[Battle] executeAction: 行动者无效或已死亡', { actorId: action.actorId, actor });
    return;
  }

  console.log(`[Battle] executeAction: ${actor.name} 执行 ${action.type} 行动`);

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
    case 'capture': {
      // 宠物捕捉
      const target = findUnit(action.targetId || '');
      if (!target || target.hp <= 0 || target.isPlayerSide) {
        log.text = `${actor.name} 无法捕捉该目标`;
        break;
      }

      // 获取敌人模板检查是否可捕捉
      const enemyRef = target.ref as Enemy | undefined;
      const templateId = enemyRef?.templateId || target.id.split('_')[0];
      const template = getEnemyTemplate(templateId);

      // 检查是否是普通怪物（只能捕捉普通怪物）
      if (!template || template.type !== 'normal') {
        log.text = `${target.name} 不是普通怪物，无法被捕捉`;
        break;
      }

      // 检查模板是否标记为可捕捉
      if (!template.capturable) {
        log.text = `${target.name} 无法被捕捉`;
        break;
      }

      // 检查宠物栏是否已满
      if (petCount.value >= maxPets) {
        log.text = `${actor.name} 尝试捕捉 ${target.name}，但宠物栏已满！`;
        break;
      }

      // 使用玩家捕捉技能等级计算捕捉率
      const skillLevel = getCaptureSkillLevel();
      const baseCaptureRate = calculateCaptureRate(skillLevel, template.type);

      // 敌人HP越低，成功率越高（最多+30%）
      const hpRatio = target.hp / target.maxHp;
      const hpBonus = (1 - hpRatio) * 0.3;
      const captureChance = Math.min(0.90, baseCaptureRate + hpBonus);

      const captured = Math.random() < captureChance;

      if (captured) {
        // 获取宠物模板ID
        const petTemplateId = template.petTemplateId || templateId.replace('enemy_', 'pet_');

        // 创建宠物
        const pet = createPet(petTemplateId);
        if (pet && addPet(pet)) {
          log.text = `${actor.name} 成功捕捉了 ${target.name}！`;
          log.result.heal = 0; // 标记成功

          // 将敌人从战斗中移除（设为死亡）
          target.hp = 0;
          target.isDead = true;
        } else {
          log.text = `${actor.name} 捕捉 ${target.name} 失败了...`;
        }
      } else {
        log.text = `${actor.name} 尝试捕捉 ${target.name}，但让它逃掉了！`;
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
  if (!state) {
    console.log('[Battle] advanceToNextActor: 无战斗状态');
    return;
  }

  // 重新计算行动队列（因为可能有单位死亡）
  const aliveUnits = getAllAliveUnits(state);

  // 如果战斗已结束，不推进
  if (aliveUnits.length === 0) {
    console.log('[Battle] advanceToNextActor: 无存活单位');
    return;
  }

  // 获取当前索引，跳过死亡单位
  let nextIndex = state.currentActorIndex + 1;

  console.log(`[Battle] advanceToNextActor: 当前索引 ${state.currentActorIndex}, 下一个索引 ${nextIndex}, 存活单位数 ${aliveUnits.length}`);

  // 如果已经到达队列末尾，开始新回合
  if (nextIndex >= aliveUnits.length) {
    console.log('[Battle] advanceToNextActor: 到达队列末尾，开始新回合');
    startNewRound();
    return;
  }

  // 更新索引
  state.currentActorIndex = nextIndex;
  battleState.value = { ...state };

  // 获取下一个行动者并记录日志
  const nextActor = aliveUnits[nextIndex];
  console.log(`[Battle] advanceToNextActor: 下一个行动者是 ${nextActor?.name} (${nextActor?.isPlayerSide ? '玩家方' : '敌方'})`);
}

/** 开始新回合 */
function startNewRound(): void {
  const state = battleState.value;
  if (!state) return;

  console.log(`[Battle] startNewRound: 当前回合 ${state.round}, 最大回合 ${state.maxRounds}`);

  // 检查是否达到最大回合数
  if (state.round >= state.maxRounds) {
    console.log('[Battle] startNewRound: 达到最大回合数，战斗结束');
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

  // 确保状态更新
  battleState.value = { ...state };

  console.log(`[Battle] startNewRound: 新回合 ${state.round} 开始，行动队列长度 ${state.actionQueue.length}`);

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
    // 根据敌人配置计算奖励
    for (const enemy of state.enemies) {
      // 获取敌人引用和模板
      const enemyRef = enemy.ref as Enemy | undefined;
      const templateId = enemyRef?.templateId || enemy.id.split('_').slice(0, -1).join('_') || enemy.id;
      const template = getEnemyTemplate(templateId);

      // 使用模板中的经验和金币奖励，如果没有则使用基础计算
      const baseExp = template?.expReward ?? Math.floor(20 + (enemy.stats.physicalAttack + enemy.stats.magicAttack) * 0.5);
      const baseGold = template?.goldReward ?? Math.floor(10 + enemy.maxHp * 0.1);

      expReward += baseExp;
      goldReward += baseGold;

      // 从敌人配置中获取掉落表
      if (template?.drops && template.drops.length > 0) {
        for (const drop of template.drops) {
          // 根据掉落概率判断是否掉落
          if (Math.random() < drop.rate) {
            // 随机数量（在minCount和maxCount之间）
            const count = Math.floor(Math.random() * (drop.maxCount - drop.minCount + 1)) + drop.minCount;
            if (count > 0) {
              itemDrops.push({ itemId: drop.itemId, count });
            }
          }
        }
      }
    }

    // 触发任务事件：击杀怪物和战斗胜利
    const currentPlayer = player.value;
    if (currentPlayer) {
      // 触发战斗胜利事件
      updateBattleWinEvent(currentPlayer.id).catch(err =>
        console.error('[Battle] Failed to trigger battle win event:', err)
      );

      // 为每个被击败的敌人触发击杀事件
      for (const enemyUnit of state.enemies) {
        // 获取敌人引用
        const enemyRef = enemyUnit.ref as Enemy | undefined;

        // 判断是否是Boss
        const isBoss = enemyRef?.type === 'boss' ||
                       enemyUnit.name.includes('Boss') ||
                       enemyUnit.name.includes('BOSS') ||
                       enemyUnit.name.includes('首领');

        // 优先使用templateId，否则使用ID或名称
        const monsterId = enemyRef?.templateId || enemyUnit.id || `enemy_${enemyUnit.name}`;

        console.log('[Battle] Triggering kill quest event for:', monsterId, 'isBoss:', isBoss);

        updateKillQuestEvent(currentPlayer.id, monsterId, isBoss).catch(err =>
          console.error('[Battle] Failed to trigger kill event:', err)
        );
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

// ============================================
// 自动战斗配置
// ============================================

/** 自动战斗配置 - 从localStorage加载或使用默认值 */
function loadAutoBattleConfig(): AutoBattleConfig {
  try {
    const saved = localStorage.getItem('autoBattleConfig');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('[Battle] Failed to load auto battle config:', e);
  }
  return {
    character: { ...DEFAULT_AUTO_BATTLE_CONFIG.character },
    pet: { ...DEFAULT_AUTO_BATTLE_CONFIG.pet },
  };
}

/** 保存自动战斗配置 */
function saveAutoBattleConfig(config: AutoBattleConfig): void {
  try {
    localStorage.setItem('autoBattleConfig', JSON.stringify(config));
  } catch (e) {
    console.error('[Battle] Failed to save auto battle config:', e);
  }
}

/** 自动战斗配置信号 */
export const autoBattleConfig = signal<AutoBattleConfig>(loadAutoBattleConfig());

/** 更新角色自动战斗配置 */
export function updateCharacterAutoConfig(config: Partial<AutoBattleConfig['character']>): void {
  const newConfig = {
    ...autoBattleConfig.value,
    character: {
      ...autoBattleConfig.value.character,
      ...config,
    },
  };
  autoBattleConfig.value = newConfig;
  saveAutoBattleConfig(newConfig);
}

/** 更新宠物自动战斗配置 */
export function updatePetAutoConfig(config: Partial<AutoBattleConfig['pet']>): void {
  const newConfig = {
    ...autoBattleConfig.value,
    pet: {
      ...autoBattleConfig.value.pet,
      ...config,
    },
  };
  autoBattleConfig.value = newConfig;
  saveAutoBattleConfig(newConfig);
}

/** 重置自动战斗配置为默认值 */
export function resetAutoBattleConfig(): void {
  const defaultConfig: AutoBattleConfig = {
    character: { ...DEFAULT_AUTO_BATTLE_CONFIG.character },
    pet: { ...DEFAULT_AUTO_BATTLE_CONFIG.pet },
  };
  autoBattleConfig.value = defaultConfig;
  saveAutoBattleConfig(defaultConfig);
}

// ============================================
// 伙伴AI配置
// ============================================

/** 伙伴AI配置映射 - 从localStorage加载 */
function loadCompanionAIConfigs(): Map<string, CompanionAIConfig> {
  const configs = new Map<string, CompanionAIConfig>();
  try {
    const saved = localStorage.getItem('companionAIConfigs');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [id, config] of Object.entries(parsed)) {
        configs.set(id, config as CompanionAIConfig);
      }
    }
  } catch (e) {
    console.error('[Battle] Failed to load companion AI configs:', e);
  }
  return configs;
}

/** 保存伙伴AI配置 */
function saveCompanionAIConfigs(configs: Map<string, CompanionAIConfig>): void {
  try {
    const obj: Record<string, CompanionAIConfig> = {};
    configs.forEach((config, id) => {
      obj[id] = config;
    });
    localStorage.setItem('companionAIConfigs', JSON.stringify(obj));
  } catch (e) {
    console.error('[Battle] Failed to save companion AI configs:', e);
  }
}

/** 伙伴AI配置映射 */
export const companionAIConfigs = signal<Map<string, CompanionAIConfig>>(loadCompanionAIConfigs());

/** 获取伙伴AI配置 */
export function getCompanionAIConfig(companionId: string): CompanionAIConfig {
  const config = companionAIConfigs.value.get(companionId);
  if (config) return config;

  // 返回默认配置
  return {
    companionId,
    strategy: DEFAULT_COMPANION_AI_CONFIG.strategy,
    preferredTarget: DEFAULT_COMPANION_AI_CONFIG.preferredTarget,
    skillPriority: [...DEFAULT_COMPANION_AI_CONFIG.skillPriority],
    protectTarget: DEFAULT_COMPANION_AI_CONFIG.protectTarget,
    defensiveHpThreshold: DEFAULT_COMPANION_AI_CONFIG.defensiveHpThreshold,
    autoHeal: DEFAULT_COMPANION_AI_CONFIG.autoHeal,
    healThreshold: DEFAULT_COMPANION_AI_CONFIG.healThreshold,
  };
}

/** 更新伙伴AI配置 */
export function updateCompanionAIConfig(companionId: string, config: Partial<Omit<CompanionAIConfig, 'companionId'>>): void {
  const currentConfig = getCompanionAIConfig(companionId);
  const newConfig = {
    ...currentConfig,
    ...config,
    companionId,
  };

  const newMap = new Map(companionAIConfigs.value);
  newMap.set(companionId, newConfig);
  companionAIConfigs.value = newMap;
  saveCompanionAIConfigs(newMap);
}

/** 重置伙伴AI配置为默认值 */
export function resetCompanionAIConfig(companionId: string): void {
  const newMap = new Map(companionAIConfigs.value);
  newMap.delete(companionId);
  companionAIConfigs.value = newMap;
  saveCompanionAIConfigs(newMap);
}

/** 检查敌人是否可捕捉 */
export function canCaptureEnemy(enemyUnit: CombatUnit): boolean {
  // 玩家方的单位不能捕捉
  if (enemyUnit.isPlayerSide) return false;

  // 已死亡的不能捕捉
  if (enemyUnit.hp <= 0) return false;

  // 获取敌人模板
  const enemyRef = enemyUnit.ref as Enemy | undefined;
  const templateId = enemyRef?.templateId || enemyUnit.id.split('_')[0];
  const template = getEnemyTemplate(templateId);

  // 没有模板或不可捕捉
  if (!template || !template.capturable) return false;

  // 只能捕捉普通怪物
  if (template.type !== 'normal') return false;

  // 检查宠物栏是否已满
  if (petCount.value >= maxPets) return false;

  return true;
}

/** 获取捕捉成功率（基于技能等级） */
export function getCaptureRate(enemyUnit: CombatUnit): number {
  if (!canCaptureEnemy(enemyUnit)) return 0;

  // 获取敌人模板
  const enemyRef = enemyUnit.ref as Enemy | undefined;
  const templateId = enemyRef?.templateId || enemyUnit.id.split('_')[0];
  const template = getEnemyTemplate(templateId);

  if (!template) return 0;

  // 使用玩家捕捉技能等级计算基础捕捉率
  const skillLevel = getCaptureSkillLevel();
  const baseCaptureRate = calculateCaptureRate(skillLevel, template.type);

  // 敌人HP越低，成功率越高（最多+30%）
  const hpRatio = enemyUnit.hp / enemyUnit.maxHp;
  const hpBonus = (1 - hpRatio) * 0.3;

  return Math.min(0.90, baseCaptureRate + hpBonus);
}
