// 随机遇敌服务

import { signal } from '@preact/signals-react';
import { getMap } from '@/constants/maps';
import { getEnemyGroup, createEnemy, generateDynamicEnemyGroup, getEnemyGroupPreview } from '@/constants/enemies';
import { startBattle } from '@/signals/battleSignals';
import { player, playerLevel } from '@/signals/playerSignals';
import { random } from '@/utils/prng';
import type { CombatUnit, Enemy } from '@/types';

/** 步数计数器 */
export const stepCount = signal(0);

/** 上次遇敌的步数 */
export const lastEncounterStep = signal(0);

/** 遭遇敌人组信息（用于UI显示） */
export interface EncounterInfo {
  enemyGroupId: string;
  enemyGroupName: string;
  enemyCount: number;
  avgLevel: number;
}

/**
 * 检查是否触发遇敌
 * @param mapId 当前地图ID
 * @returns 是否触发遇敌
 */
export function checkEncounter(mapId: string): boolean {
  const map = getMap(mapId);
  if (!map || !map.encounterConfig) return false;

  const { rate, stepTrigger } = map.encounterConfig;

  // 检查是否达到最小步数触发
  const stepsSinceLastEncounter = stepCount.value - lastEncounterStep.value;
  if (stepsSinceLastEncounter < stepTrigger) {
    return false;
  }

  // 随机判定是否遇敌
  const roll = random();
  if (roll < rate) {
    lastEncounterStep.value = stepCount.value;
    return true;
  }

  return false;
}

/**
 * 获取当前地图可能遇到的敌人组信息
 * @param mapId 地图ID
 * @returns 敌人组信息列表
 */
export function getMapEncounterInfo(mapId: string): EncounterInfo[] {
  const map = getMap(mapId);
  if (!map || !map.encounterConfig) return [];

  const encounterInfos: EncounterInfo[] = [];

  for (const groupId of map.encounterConfig.enemyGroups) {
    const preview = getEnemyGroupPreview(groupId);
    if (preview) {
      const avgLevel = Math.round(
        preview.possibleEnemies.reduce((sum, e) => sum + (e.minLevel + e.maxLevel) / 2, 0) /
        preview.possibleEnemies.length
      );
      encounterInfos.push({
        enemyGroupId: groupId,
        enemyGroupName: preview.name,
        enemyCount: Math.round((preview.minCount + preview.maxCount) / 2),
        avgLevel,
      });
    }
  }

  return encounterInfos;
}

/**
 * 选择一个敌人组（随机选择，考虑玩家等级和组权重）
 * @param mapId 地图ID
 * @returns 敌人组ID或null
 */
export function selectEnemyGroup(mapId: string): string | null {
  const map = getMap(mapId);
  if (!map || !map.encounterConfig) return null;

  const groups = map.encounterConfig.enemyGroups;
  if (groups.length === 0) return null;

  // 获取所有敌人组信息
  const groupInfos = groups
    .map(groupId => {
      const group = getEnemyGroup(groupId);
      return group ? { groupId, group } : null;
    })
    .filter((g): g is NonNullable<typeof g> => g !== null);

  if (groupInfos.length === 0) return null;

  // 计算玩家等级与敌人组的匹配度
  const currentLevel = playerLevel.value;
  const weightedGroups = groupInfos.map(({ groupId, group }) => {
    // 获取预览信息来计算平均等级
    const preview = getEnemyGroupPreview(groupId);
    let avgLevel = currentLevel;
    if (preview && preview.possibleEnemies.length > 0) {
      avgLevel = Math.round(
        preview.possibleEnemies.reduce((sum, e) => sum + (e.minLevel + e.maxLevel) / 2, 0) /
        preview.possibleEnemies.length
      );
    } else if (group.enemies && group.enemies.length > 0) {
      avgLevel = group.enemies.reduce((sum, e) => sum + e.level, 0) / group.enemies.length;
    }

    // 等级差距越小，权重越高
    const levelDiff = Math.abs(avgLevel - currentLevel);
    const levelWeight = Math.max(1, 10 - levelDiff);

    // 组的基础权重
    const baseWeight = group.weight || 10;

    // 最终权重 = 组权重 * 等级权重
    // Boss组权重很低但不会被完全排除
    const finalWeight = baseWeight * levelWeight;

    return { groupId, weight: finalWeight };
  });

  // 加权随机选择
  const totalWeight = weightedGroups.reduce((sum, g) => sum + g.weight, 0);
  let randomVal = random() * totalWeight;

  for (const { groupId, weight } of weightedGroups) {
    randomVal -= weight;
    if (randomVal <= 0) {
      return groupId;
    }
  }

  // 默认返回第一个
  return groupInfos[0].groupId;
}

/**
 * 创建敌人战斗单位
 * @param enemyGroupId 敌人组ID
 * @returns 敌人战斗单位列表
 */
export function createEnemyUnits(enemyGroupId: string): CombatUnit[] {
  const group = getEnemyGroup(enemyGroupId);
  if (!group) return [];

  const units: CombatUnit[] = [];

  // 使用动态生成来获取敌人配置
  const enemyConfigs = generateDynamicEnemyGroup(enemyGroupId, playerLevel.value);

  for (const enemyConfig of enemyConfigs) {
    const enemy = createEnemy(enemyConfig.templateId, enemyConfig.level);
    if (enemy) {
      const unit = convertEnemyToCombatUnit(enemy, enemyConfig.position);
      units.push(unit);
    }
  }

  return units;
}

/**
 * 将敌人转换为战斗单位
 */
function convertEnemyToCombatUnit(enemy: Enemy, position: number): CombatUnit {
  // 将PetSkill转换为Skill格式（简化版本）
  const convertedSkills = enemy.skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description || '',
    icon: '⚔️',
    type: 'active' as const,
    damageType: 'physical' as const,
    levelRequirement: 1,
    rarity: 'common' as const,
    targetType: 'single_enemy' as const,
    element: skill.element || 'none',
    mpCost: skill.mpCost || 0,
    cooldown: skill.cooldown || 0,
    effects: [{
      type: 'damage' as const,
      damageType: 'physical' as const,
      element: skill.element,
      baseValue: 10,
      multiplier: skill.multiplier || 1,
      description: skill.description || '',
    }],
    multiplier: skill.multiplier || 1,
  }));

  return {
    id: enemy.id,
    name: enemy.name,
    type: 'enemy',
    isPlayerSide: false,
    stats: {
      physicalAttack: enemy.stats.physicalAttack,
      physicalDefense: enemy.stats.physicalDefense,
      magicAttack: enemy.stats.magicAttack,
      magicDefense: enemy.stats.magicDefense,
      speed: enemy.stats.speed,
      maxHp: enemy.stats.maxHp,
      maxMp: enemy.stats.maxMp,
      critRate: enemy.stats.critRate,
      critDamage: enemy.stats.critDamage,
      hitRate: enemy.stats.hitRate,
      dodgeRate: enemy.stats.dodgeRate,
    },
    elementResistances: enemy.elementResistances,
    hp: enemy.hp,
    maxHp: enemy.maxHp,
    mp: enemy.mp,
    maxMp: enemy.maxMp,
    skills: convertedSkills,
    statusEffects: [],
    isDefending: false,
    isDead: false,
    position,
    ref: enemy, // 保存原始敌人引用，用于获取templateId
  };
}

/**
 * 触发遇敌战斗
 * @param mapId 地图ID
 * @returns 是否成功触发战斗
 */
export function triggerEncounterBattle(mapId: string): boolean {
  // 检查是否有玩家
  if (!player.value) return false;

  // 选择敌人组
  const enemyGroupId = selectEnemyGroup(mapId);
  if (!enemyGroupId) return false;

  // 创建敌人单位
  const enemyUnits = createEnemyUnits(enemyGroupId);
  if (enemyUnits.length === 0) return false;

  // 开始战斗
  startBattle(enemyUnits);

  return true;
}

/**
 * 玩家移动一步（增加步数计数）
 */
export function playerStep(): void {
  stepCount.value++;
}

/**
 * 重置步数
 */
export function resetSteps(): void {
  stepCount.value = 0;
  lastEncounterStep.value = 0;
}

/**
 * 尝试在当前地图移动并触发遇敌
 * @returns 是否触发战斗
 */
export function tryMoveAndEncounter(): boolean {
  const currentPlayer = player.value;
  if (!currentPlayer) return false;

  // 增加步数
  playerStep();

  // 检查是否遇敌
  if (checkEncounter(currentPlayer.currentMapId)) {
    return triggerEncounterBattle(currentPlayer.currentMapId);
  }

  return false;
}

/**
 * 获取地图遇敌率描述
 * @param mapId 地图ID
 * @returns 遇敌率描述
 */
export function getEncounterRateDescription(mapId: string): string {
  const map = getMap(mapId);
  if (!map || !map.encounterConfig) return '安全区域';

  const { rate } = map.encounterConfig;
  const ratePercent = Math.round(rate * 100);

  if (rate < 0.1) return `低危险 (${ratePercent}%遇敌率)`;
  if (rate < 0.2) return `中等危险 (${ratePercent}%遇敌率)`;
  return `高危险 (${ratePercent}%遇敌率)`;
}

/** 遇敌服务对象 */
export const encounterService = {
  checkEncounter,
  getMapEncounterInfo,
  selectEnemyGroup,
  createEnemyUnits,
  triggerEncounterBattle,
  playerStep,
  resetSteps,
  tryMoveAndEncounter,
  getEncounterRateDescription,
};
