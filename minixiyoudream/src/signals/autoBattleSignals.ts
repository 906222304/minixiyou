// 挂机战斗状态管理

import { signal, computed } from '@preact/signals-react';
import { getMap } from '@/constants/maps';
import { getEnemyGroup, createEnemy, generateDynamicEnemyGroup, getEnemyGroupPreview } from '@/constants/enemies';
import { player, playerHp, playerMaxHp, updatePlayerHp, updatePlayerMp, addPlayerExp, updatePlayerGold } from './playerSignals';
import { startBattle, isInBattle, battleState, isBattleEnded, clearBattle } from './battleSignals';
import { gamePhase } from './gameSignals';
import { random } from '@/utils/prng';
import { logger } from '@/utils/logger';
import type { CombatUnit } from '@/types';

/** 挂机状态类型 */
export type AutoBattleStatus = 'idle' | 'searching' | 'battling' | 'resting' | 'stopped' | 'dead';

/** 挂机设置 */
export interface AutoBattleSettings {
  autoHeal: boolean;           // 自动使用药品
  healHpThreshold: number;      // HP低于此百分比使用药品
  healMpThreshold: number;      // MP低于此百分比使用药品
  stopOnDeath: boolean;         // 死亡后停止
  stopOnHpLow: boolean;         // HP过低停止
  stopHpThreshold: number;      // HP低于此百分比停止
  restBetweenBattles: boolean;  // 战斗间隙休息
  restDuration: number;         // 休息时间（毫秒）
  maxBattles: number;           // 最大战斗次数（0为无限）
}

/** 挂机统计 */
export interface AutoBattleStats {
  killCount: number;            // 击杀数
  battleCount: number;          // 战斗次数
  totalExp: number;             // 获得经验
  totalGold: number;            // 获得金币
  totalItems: { itemId: string; count: number }[]; // 获得物品
  startTime: number;            // 开始时间
  totalDamageDealt: number;     // 造成总伤害
  totalDamageTaken: number;     // 受到总伤害
}

/** 默认挂机设置 */
const DEFAULT_SETTINGS: AutoBattleSettings = {
  autoHeal: true,
  healHpThreshold: 30,
  healMpThreshold: 20,
  stopOnDeath: true,
  stopOnHpLow: true,
  stopHpThreshold: 20,
  restBetweenBattles: false,
  restDuration: 2000,
  maxBattles: 0,
};

/** 挂机状态 */
export const autoBattleEnabled = signal<boolean>(false);

/** 挂机状态 */
export const autoBattleStatus = signal<AutoBattleStatus>('idle');

/** 挂机设置 */
export const autoBattleSettings = signal<AutoBattleSettings>(DEFAULT_SETTINGS);

/** 挂机统计 */
export const autoBattleStats = signal<AutoBattleStats>({
  killCount: 0,
  battleCount: 0,
  totalExp: 0,
  totalGold: 0,
  totalItems: [],
  startTime: 0,
  totalDamageDealt: 0,
  totalDamageTaken: 0,
});

/** 挂机定时器ID */
let autoBattleTimer: ReturnType<typeof setTimeout> | null = null;

/** 挂机循环计数器 */
let autoBattleLoopCount = 0;

/** 是否可以挂机（当前地图是否有怪物） */
export const canAutoBattle = computed(() => {
  const currentMapId = player.value?.currentMapId;
  if (!currentMapId) return false;

  const map = getMap(currentMapId);
  if (!map || !map.encounterConfig) return false;

  return map.encounterConfig.enemyGroups.length > 0;
});

/** 挂机运行时间（秒） */
export const autoBattleRunTime = computed(() => {
  if (autoBattleStats.value.startTime === 0) return 0;
  return Math.floor((Date.now() - autoBattleStats.value.startTime) / 1000);
});

/** 格式化挂机运行时间 */
export function formatRunTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/** 开始挂机 */
export function startAutoBattle(): void {
  if (!canAutoBattle.value) return;

  autoBattleEnabled.value = true;
  autoBattleStatus.value = 'searching';
  autoBattleStats.value = {
    killCount: 0,
    battleCount: 0,
    totalExp: 0,
    totalGold: 0,
    totalItems: [],
    startTime: Date.now(),
    totalDamageDealt: 0,
    totalDamageTaken: 0,
  };
  autoBattleLoopCount = 0;

  // 开始挂机循环
  runAutoBattleLoop();
}

/** 停止挂机 */
export function stopAutoBattle(): void {
  autoBattleEnabled.value = false;
  autoBattleStatus.value = 'stopped';

  if (autoBattleTimer) {
    clearTimeout(autoBattleTimer);
    autoBattleTimer = null;
  }
}

/** 暂停挂机 */
export function pauseAutoBattle(): void {
  autoBattleEnabled.value = false;
  autoBattleStatus.value = 'idle';

  if (autoBattleTimer) {
    clearTimeout(autoBattleTimer);
    autoBattleTimer = null;
  }
}

/** 恢复挂机 */
export function resumeAutoBattle(): void {
  if (!canAutoBattle.value) return;

  autoBattleEnabled.value = true;
  autoBattleStatus.value = 'searching';
  runAutoBattleLoop();
}

/** 切换挂机状态 */
export function toggleAutoBattle(): void {
  if (autoBattleEnabled.value) {
    stopAutoBattle();
  } else {
    startAutoBattle();
  }
}

/** 更新挂机设置 */
export function updateAutoBattleSettings(settings: Partial<AutoBattleSettings>): void {
  autoBattleSettings.value = {
    ...autoBattleSettings.value,
    ...settings,
  };
}

/** 重置挂机统计 */
export function resetAutoBattleStats(): void {
  autoBattleStats.value = {
    killCount: 0,
    battleCount: 0,
    totalExp: 0,
    totalGold: 0,
    totalItems: [],
    startTime: Date.now(),
    totalDamageDealt: 0,
    totalDamageTaken: 0,
  };
}

/** 挂机主循环 */
function runAutoBattleLoop(): void {
  if (!autoBattleEnabled.value) return;

  // 检查玩家状态
  const currentPlayer = player.value;
  if (!currentPlayer) {
    stopAutoBattle();
    return;
  }

  // 检查HP是否过低需要停止
  const hpPercent = (playerHp.value / playerMaxHp.value) * 100;
  if (autoBattleSettings.value.stopOnHpLow && hpPercent < autoBattleSettings.value.stopHpThreshold) {
    autoBattleStatus.value = 'stopped';
    stopAutoBattle();
    return;
  }

  // 检查最大战斗次数
  if (autoBattleSettings.value.maxBattles > 0 &&
      autoBattleStats.value.battleCount >= autoBattleSettings.value.maxBattles) {
    stopAutoBattle();
    return;
  }

  // 如果正在战斗中，等待战斗结束
  if (isInBattle.value) {
    autoBattleStatus.value = 'battling';
    autoBattleTimer = setTimeout(runAutoBattleLoop, 500);
    return;
  }

  // 检查是否需要休息
  if (autoBattleSettings.value.restBetweenBattles && autoBattleLoopCount > 0) {
    autoBattleStatus.value = 'resting';
    autoBattleTimer = setTimeout(() => {
      autoBattleStatus.value = 'searching';
      triggerAutoEncounter();
    }, autoBattleSettings.value.restDuration);
    return;
  }

  // 寻找怪物并开始战斗
  autoBattleStatus.value = 'searching';
  triggerAutoEncounter();
}

/** 触发自动遇敌 */
function triggerAutoEncounter(): void {
  if (!autoBattleEnabled.value) return;

  const currentPlayer = player.value;
  if (!currentPlayer) {
    stopAutoBattle();
    return;
  }

  const map = getMap(currentPlayer.currentMapId);
  if (!map || !map.encounterConfig) {
    stopAutoBattle();
    return;
  }

  // 随机选择一个敌人组
  const groups = map.encounterConfig.enemyGroups;
  if (groups.length === 0) {
    stopAutoBattle();
    return;
  }

  // 加权随机选择（优先选择适合玩家等级的敌人）
  const groupId = selectWeightedEnemyGroup(groups, currentPlayer.level);
  if (!groupId) {
    stopAutoBattle();
    return;
  }

  // 创建敌人单位
  const enemyUnits = createEnemyUnitsForAutoBattle(groupId);
  if (enemyUnits.length === 0) {
    stopAutoBattle();
    return;
  }

  logger.debug('[AutoBattle] triggerAutoEncounter: 开始战斗，敌人数量:', enemyUnits.length);

  // 开始战斗
  startBattle(enemyUnits);
  autoBattleStatus.value = 'battling';
  autoBattleLoopCount++;

  // 切换到战斗界面
  gamePhase.value = 'battle';

  // 设置自动战斗标志
  import('./battleSignals').then(({ isAutoBattle }) => {
    isAutoBattle.value = true;
  });

  // 监控战斗状态
  monitorBattleEnd();
}

/** 加权选择敌人组 */
function selectWeightedEnemyGroup(groupIds: string[], playerLevel: number): string | null {
  const groupInfos = groupIds
    .map(id => {
      const group = getEnemyGroup(id);
      return group ? { groupId: id, group } : null;
    })
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .map(({ groupId, group }) => {
      // 获取预览信息来计算平均等级
      const preview = getEnemyGroupPreview(groupId);
      let avgLevel = playerLevel;
      if (preview && preview.possibleEnemies.length > 0) {
        avgLevel = Math.round(
          preview.possibleEnemies.reduce((sum, e) => sum + (e.minLevel + e.maxLevel) / 2, 0) /
          preview.possibleEnemies.length
        );
      } else if (group.enemies && group.enemies.length > 0) {
        avgLevel = group.enemies.reduce((sum, e) => sum + e.level, 0) / group.enemies.length;
      }

      // 等级差距越小权重越高
      const levelDiff = Math.abs(avgLevel - playerLevel);
      const levelWeight = Math.max(1, 10 - levelDiff);

      // 组的基础权重
      const baseWeight = group.weight || 10;

      // 最终权重
      const weight = baseWeight * levelWeight;

      return { groupId, weight, avgLevel };
    });

  if (groupInfos.length === 0) return null;

  // 加权随机选择
  const totalWeight = groupInfos.reduce((sum, g) => sum + g.weight, 0);
  let randomVal = random() * totalWeight;

  for (const info of groupInfos) {
    randomVal -= info.weight;
    if (randomVal <= 0) {
      return info.groupId;
    }
  }

  return groupInfos[0].groupId;
}

/** 创建敌人战斗单位（用于挂机战斗） */
function createEnemyUnitsForAutoBattle(groupId: string): CombatUnit[] {
  const group = getEnemyGroup(groupId);
  if (!group) return [];

  const units: CombatUnit[] = [];

  // 使用动态生成来获取敌人配置
  const currentPlayer = player.value;
  const playerLvl = currentPlayer?.level || 1;
  const enemyConfigs = generateDynamicEnemyGroup(groupId, playerLvl);

  for (const enemyConfig of enemyConfigs) {
    // 使用 createEnemy 创建完整的敌人实例
    const enemy = createEnemy(enemyConfig.templateId, enemyConfig.level);
    if (!enemy) continue;

    const unit: CombatUnit = {
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
        antiCritRate: enemy.stats.antiCritRate ?? 0,
        penetration: enemy.stats.penetration ?? 0,
        lifeSteal: enemy.stats.lifeSteal ?? 0,
        reflect: enemy.stats.reflect ?? 0,
        healBonus: enemy.stats.healBonus ?? 0,
        cooldownReduction: enemy.stats.cooldownReduction ?? 0,
      },
      elementResistances: { ...enemy.elementResistances },
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      mp: enemy.mp,
      maxMp: enemy.maxMp,
      skills: [],
      statusEffects: [],
      isDefending: false,
      isDead: false,
      position: enemyConfig.position,
      ref: enemy, // 保存原始敌人引用，用于获取templateId
    };

    units.push(unit);
  }

  return units;
}

/** 监控战斗结束 */
function monitorBattleEnd(): void {
  const checkInterval = setInterval(() => {
    if (!autoBattleEnabled.value) {
      clearInterval(checkInterval);
      return;
    }

    if (isBattleEnded.value) {
      clearInterval(checkInterval);
      handleBattleEnd();
    }
  }, 300);
}

/** 处理战斗结束 */
function handleBattleEnd(): void {
  const state = battleState.value;
  const result = state?.result;

  logger.debug('[AutoBattle] handleBattleEnd: 战斗结束，胜利:', result?.victory);

  if (!result) {
    clearBattle();
    // 返回游戏界面
    gamePhase.value = 'playing';
    if (autoBattleEnabled.value) {
      autoBattleTimer = setTimeout(runAutoBattleLoop, 1000);
    }
    return;
  }

  // 更新统计
  const stats = autoBattleStats.value;
  stats.battleCount++;
  stats.totalDamageDealt += result.stats?.totalDamageDealt || 0;
  stats.totalDamageTaken += result.stats?.totalDamageTaken || 0;

  if (result.victory) {
    // 击杀数
    const enemyCount = state.enemies.length;
    stats.killCount += enemyCount;

    // 经验和金币
    const exp = result.rewards?.exp || 0;
    const gold = result.rewards?.gold || 0;
    stats.totalExp += exp;
    stats.totalGold += gold;

    // 物品
    if (result.rewards?.items) {
      for (const item of result.rewards.items) {
        const existing = stats.totalItems.find(i => i.itemId === item.itemId);
        if (existing) {
          existing.count += item.count;
        } else {
          stats.totalItems.push({ ...item });
        }
      }
    }

    // 应用奖励
    addPlayerExp(exp);
    updatePlayerGold(gold);

    // 更新玩家HP/MP（战斗后的状态）
    if (state.playerFormation.characters[0]) {
      const playerUnit = state.playerFormation.characters[0];
      updatePlayerHp(playerUnit.hp - player.value!.hp);
      updatePlayerMp(playerUnit.mp - player.value!.mp);
    }
  } else {
    // 战斗失败
    if (autoBattleSettings.value.stopOnDeath) {
      autoBattleStatus.value = 'dead';
      stopAutoBattle();
      clearBattle();
      // 返回游戏界面
      gamePhase.value = 'playing';
      logger.debug('[AutoBattle] handleBattleEnd: 玩家死亡，停止挂机，返回游戏界面');
      return;
    }
  }

  autoBattleStats.value = { ...stats };
  clearBattle();

  // 继续挂机循环
  if (autoBattleEnabled.value) {
    autoBattleStatus.value = 'searching';
    // 返回游戏界面（下一场战斗会再切换到战斗界面）
    gamePhase.value = 'playing';
    autoBattleTimer = setTimeout(runAutoBattleLoop, 1000);
  } else {
    // 返回游戏界面
    gamePhase.value = 'playing';
  }
}

/** 手动攻击怪物（立即触发战斗） */
export function attackMonsterImmediately(groupId: string): void {
  if (isInBattle.value) {
    logger.debug('[AutoBattle] attackMonsterImmediately: 已在战斗中，跳过');
    return;
  }

  const enemyUnits = createEnemyUnitsForAutoBattle(groupId);
  if (enemyUnits.length === 0) {
    logger.debug('[AutoBattle] attackMonsterImmediately: 无法创建敌人单位，groupId:', groupId);
    return;
  }

  logger.debug('[AutoBattle] attackMonsterImmediately: 开始战斗，敌人数量:', enemyUnits.length);
  startBattle(enemyUnits);

  // 切换到战斗界面
  gamePhase.value = 'battle';
  logger.debug('[AutoBattle] attackMonsterImmediately: 已切换到战斗界面');
}

/** 获取当前地图的怪物信息 */
export function getCurrentMapMonsters(): {
  groupId: string;
  name: string;
  icon: string;
  difficulty: string;
  description: string;
  enemies: { templateId: string; name: string; minLevel: number; maxLevel: number; icon: string }[];
  minCount: number;
  maxCount: number;
  avgLevel: number;
}[] {
  const currentMapId = player.value?.currentMapId;
  if (!currentMapId) return [];

  const map = getMap(currentMapId);
  if (!map || !map.encounterConfig) return [];

  const monsters: {
    groupId: string;
    name: string;
    icon: string;
    difficulty: string;
    description: string;
    enemies: { templateId: string; name: string; minLevel: number; maxLevel: number; icon: string }[];
    minCount: number;
    maxCount: number;
    avgLevel: number;
  }[] = [];

  for (const groupId of map.encounterConfig.enemyGroups) {
    const preview = getEnemyGroupPreview(groupId);
    if (!preview) continue;

    const enemies = preview.possibleEnemies.map(e => ({
      templateId: e.templateId,
      name: e.name,
      minLevel: e.minLevel,
      maxLevel: e.maxLevel,
      icon: e.icon,
    }));

    const avgLevel = Math.round(
      preview.possibleEnemies.reduce((sum, e) => sum + (e.minLevel + e.maxLevel) / 2, 0) /
      preview.possibleEnemies.length
    );

    monsters.push({
      groupId,
      name: preview.name,
      icon: preview.icon,
      difficulty: preview.difficulty,
      description: preview.description,
      enemies,
      minCount: preview.minCount,
      maxCount: preview.maxCount,
      avgLevel,
    });
  }

  return monsters;
}
