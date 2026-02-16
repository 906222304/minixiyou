// 副本服务 - 管理副本数据持久化和核心逻辑

import { db, type DungeonData } from '@/db';
import { DUNGEONS, getDungeon } from '@/constants/dungeons';
import { getEnemyTemplate, createEnemy } from '@/constants/enemies';
import type {
  Dungeon,
  DungeonProgress,
  DungeonResult,
  DungeonDifficulty,
  DungeonFloor,
  CombatUnit,
  Enemy,
} from '@/types';
import { player } from '@/signals/playerSignals';
import { LRUCache } from '@/utils/cache';
import { random, randomInt } from '@/utils/prng';

/** 副本运行时状态 */
export interface DungeonRunState {
  dungeonId: string;
  difficulty: DungeonDifficulty;
  currentFloor: number;
  currentGroupIndex: number;
  startTime: number;
  stats: {
    totalRounds: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    enemiesDefeated: number;
  };
  floorClears: number[];
}

/** 创建默认副本进度 */
function createDefaultDungeonProgress(dungeonId: string): DungeonProgress {
  return {
    dungeonId,
    difficulty: 'easy',
    currentFloor: 1,
    completedFloors: [],
    firstClears: [],
    todayRuns: 0,
    weekRuns: 0,
    lastReset: Date.now(),
  };
}

/** 创建默认副本数据 */
function createDefaultDungeonData(playerId: string): DungeonData {
  const dungeonIds = Object.keys(DUNGEONS);
  return {
    playerId,
    progress: dungeonIds.map(id => createDefaultDungeonProgress(id)),
    updatedAt: Date.now(),
  };
}

/** 检查并重置每日/每周次数 */
function checkAndResetProgress(progress: DungeonProgress): DungeonProgress {
  const now = Date.now();
  const dungeon = getDungeon(progress.dungeonId);
  if (!dungeon) return progress;

  const resetTimeMs = dungeon.resetTime * 60 * 60 * 1000;
  const timeSinceReset = now - progress.lastReset;

  // 检查是否需要重置
  if (timeSinceReset >= resetTimeMs) {
    const daysPassed = Math.floor(timeSinceReset / (24 * 60 * 60 * 1000));
    return {
      ...progress,
      todayRuns: 0,
      weekRuns: daysPassed >= 7 ? 0 : progress.weekRuns,
      lastReset: now,
    };
  }

  return progress;
}

/**
 * 副本服务类
 */
class DungeonService {
  private cache: LRUCache<string, DungeonData> = new LRUCache(50);
  private runState: DungeonRunState | null = null;

  /**
   * 初始化玩家副本数据
   */
  async initPlayerDungeons(playerId: string): Promise<DungeonData> {
    const cached = this.cache.get(playerId);
    if (cached) {
      return cached;
    }

    let data = await this.loadDungeonData(playerId);

    if (!data) {
      data = createDefaultDungeonData(playerId);
      const id = await db.dungeonProgress.add(data);
      data = { ...data, id: id as number };
    }

    // 检查并重置过期的进度
    data.progress = data.progress.map(p => checkAndResetProgress(p));

    this.cache.set(playerId, data);
    return data;
  }

  /**
   * 从数据库加载副本数据
   */
  private async loadDungeonData(playerId: string): Promise<DungeonData | undefined> {
    const data = await db.dungeonProgress
      .where('playerId')
      .equals(playerId)
      .first();
    return data;
  }

  /**
   * 保存副本数据
   */
  async saveDungeonData(playerId: string): Promise<void> {
    const data = this.cache.get(playerId);
    if (!data) return;

    data.updatedAt = Date.now();

    if (data.id) {
      await db.dungeonProgress.put(data);
    } else {
      const id = await db.dungeonProgress.add(data);
      data.id = id as number;
    }
  }

  /**
   * 获取副本进度
   */
  getDungeonProgress(dungeonId: string): DungeonProgress | undefined {
    const currentPlayer = player.value;
    if (!currentPlayer) return undefined;

    const data = this.cache.get(currentPlayer.id);
    if (!data) return undefined;

    return data.progress.find(p => p.dungeonId === dungeonId);
  }

  /**
   * 获取所有副本进度
   */
  getAllDungeonProgress(): DungeonProgress[] {
    const currentPlayer = player.value;
    if (!currentPlayer) return [];

    const data = this.cache.get(currentPlayer.id);
    if (!data) return [];

    return data.progress;
  }

  /**
   * 检查是否可以进入副本
   */
  canEnterDungeon(dungeonId: string, difficulty?: DungeonDifficulty): {
    canEnter: boolean;
    reason?: string;
  } {
    const dungeon = getDungeon(dungeonId);
    if (!dungeon) {
      return { canEnter: false, reason: '副本不存在' };
    }

    const currentPlayer = player.value;
    if (!currentPlayer) {
      return { canEnter: false, reason: '玩家不存在' };
    }

    // 检查等级
    if (currentPlayer.level < dungeon.requirements.minLevel) {
      return {
        canEnter: false,
        reason: `需要等级 ${dungeon.requirements.minLevel}`,
      };
    }

    // 检查所需物品
    if (dungeon.requirements.requiredItems) {
      // TODO: 检查背包中是否有所需物品
      // 暂时跳过
    }

    // 检查所需任务
    if (dungeon.requirements.requiredQuest) {
      // TODO: 检查是否完成前置任务
      // 暂时跳过
    }

    // 检查每日次数
    const progress = this.getDungeonProgress(dungeonId);
    if (progress) {
      const dailyLimit = dungeon.dailyLimit;
      if (dailyLimit && progress.todayRuns >= dailyLimit) {
        return {
          canEnter: false,
          reason: '今日挑战次数已用完',
        };
      }

      const weeklyLimit = dungeon.weeklyLimit;
      if (weeklyLimit && progress.weekRuns >= weeklyLimit) {
        return {
          canEnter: false,
          reason: '本周挑战次数已用完',
        };
      }
    }

    // 检查难度要求
    if (difficulty) {
      const diffConfig = dungeon.difficulties.find(d => d.difficulty === difficulty);
      if (diffConfig) {
        // 可以添加战力检查
        const power = this.calculatePlayerPower(currentPlayer);
        if (power < diffConfig.recommendedPower * 0.7) {
          return {
            canEnter: false,
            reason: `推荐战力 ${diffConfig.recommendedPower}`,
          };
        }
      }
    }

    return { canEnter: true };
  }

  /**
   * 计算玩家战力（简化版）
   */
  private calculatePlayerPower(playerData: typeof player.value): number {
    if (!playerData) return 0;
    const stats = playerData.finalStats;
    return (
      stats.physicalAttack * 2 +
      stats.magicAttack * 2 +
      stats.physicalDefense +
      stats.magicDefense +
      stats.maxHp * 0.5 +
      stats.speed * 3
    );
  }

  /**
   * 进入副本
   */
  enterDungeon(dungeonId: string, difficulty: DungeonDifficulty): {
    success: boolean;
    state?: DungeonRunState;
    enemies?: CombatUnit[];
    error?: string;
  } {
    // 检查是否可以进入
    const checkResult = this.canEnterDungeon(dungeonId, difficulty);
    if (!checkResult.canEnter) {
      return { success: false, error: checkResult.reason };
    }

    const dungeon = getDungeon(dungeonId);
    if (!dungeon) {
      return { success: false, error: '副本不存在' };
    }

    const currentPlayer = player.value;
    if (!currentPlayer) {
      return { success: false, error: '玩家不存在' };
    }

    // 获取难度配置
    const diffConfig = dungeon.difficulties.find(d => d.difficulty === difficulty);
    if (!diffConfig) {
      return { success: false, error: '难度配置不存在' };
    }

    // 初始化运行状态
    const runState: DungeonRunState = {
      dungeonId,
      difficulty,
      currentFloor: 1,
      currentGroupIndex: 0,
      startTime: Date.now(),
      stats: {
        totalRounds: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        enemiesDefeated: 0,
      },
      floorClears: [],
    };

    this.runState = runState;

    // 生成第一层敌人
    const enemies = this.generateFloorEnemies(dungeon, 1, diffConfig.enemyMultiplier);

    // 更新进度中的挑战次数
    this.incrementRunCount(dungeonId);

    return { success: true, state: runState, enemies };
  }

  /**
   * 生成指定层的敌人
   */
  generateFloorEnemies(
    dungeon: Dungeon,
    floorNumber: number,
    enemyMultiplier: number
  ): CombatUnit[] {
    const floor = dungeon.floors.find(f => f.floorNumber === floorNumber);
    if (!floor) return [];

    // 如果有Boss，使用Boss
    if (floor.bossId) {
      const bossTemplate = getEnemyTemplate(floor.bossId);
      if (bossTemplate) {
        const bossEnemy = createEnemy(floor.bossId, bossTemplate.levelRange.min);
        if (bossEnemy) {
          return [this.enemyToCombatUnit(bossEnemy, enemyMultiplier, 0)];
        }
      }
    }

    // 否则随机选择一个敌人组
    const groupIndex = randomInt(0, floor.enemyGroups.length - 1);
    const group = floor.enemyGroups[groupIndex];

    if (!group) return [];

    const enemies: CombatUnit[] = [];
    group.enemyIds.forEach((enemyId, index) => {
      const template = getEnemyTemplate(enemyId);
      if (template) {
        const level = randomInt(template.levelRange.min, template.levelRange.max);
        const enemy = createEnemy(enemyId, level);
        if (enemy) {
          enemies.push(this.enemyToCombatUnit(enemy, enemyMultiplier, index));
        }
      }
    });

    return enemies;
  }

  /**
   * 将敌人转换为战斗单位
   */
  private enemyToCombatUnit(enemy: Enemy, multiplier: number, position: number): CombatUnit {
    return {
      id: enemy.id,
      name: enemy.name,
      type: 'enemy',
      isPlayerSide: false,
      stats: {
        physicalAttack: Math.floor(enemy.stats.physicalAttack * multiplier),
        physicalDefense: Math.floor(enemy.stats.physicalDefense * multiplier),
        magicAttack: Math.floor(enemy.stats.magicAttack * multiplier),
        magicDefense: Math.floor(enemy.stats.magicDefense * multiplier),
        maxHp: Math.floor(enemy.maxHp * multiplier),
        maxMp: Math.floor(enemy.maxMp * multiplier),
        speed: enemy.stats.speed,
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
      elementResistances: enemy.elementResistances || { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 },
      hp: Math.floor(enemy.maxHp * multiplier),
      maxHp: Math.floor(enemy.maxHp * multiplier),
      mp: Math.floor(enemy.maxMp * multiplier),
      maxMp: Math.floor(enemy.maxMp * multiplier),
      skills: [],
      statusEffects: [],
      isDefending: false,
      isDead: false,
      position,
      ref: enemy,
    };
  }

  /**
   * 获取当前副本运行状态
   */
  getCurrentRunState(): DungeonRunState | null {
    return this.runState;
  }

  /**
   * 获取当前层数
   */
  getCurrentFloor(): number {
    return this.runState?.currentFloor ?? 0;
  }

  /**
   * 推进到下一层
   */
  advanceFloor(): {
    success: boolean;
    state?: DungeonRunState;
    enemies?: CombatUnit[];
    isComplete?: boolean;
    error?: string;
  } {
    if (!this.runState) {
      return { success: false, error: '未在副本中' };
    }

    const dungeon = getDungeon(this.runState.dungeonId);
    if (!dungeon) {
      return { success: false, error: '副本不存在' };
    }

    // 记录当前层已通关
    this.runState.floorClears.push(this.runState.currentFloor);

    // 检查是否是最后一层
    const maxFloor = dungeon.floors.length;
    if (this.runState.currentFloor >= maxFloor) {
      // 副本完成
      return { success: true, state: this.runState, isComplete: true };
    }

    // 推进到下一层
    this.runState.currentFloor++;
    this.runState.currentGroupIndex = 0;

    // 获取难度配置
    const diffConfig = dungeon.difficulties.find(
      d => d.difficulty === this.runState!.difficulty
    );
    const enemyMultiplier = diffConfig?.enemyMultiplier ?? 1;

    // 生成下一层敌人
    const enemies = this.generateFloorEnemies(
      dungeon,
      this.runState.currentFloor,
      enemyMultiplier
    );

    return { success: true, state: this.runState, enemies, isComplete: false };
  }

  /**
   * 更新战斗统计
   */
  updateBattleStats(stats: Partial<DungeonRunState['stats']>): void {
    if (!this.runState) return;

    if (stats.totalRounds !== undefined) {
      this.runState.stats.totalRounds += stats.totalRounds;
    }
    if (stats.totalDamageDealt !== undefined) {
      this.runState.stats.totalDamageDealt += stats.totalDamageDealt;
    }
    if (stats.totalDamageTaken !== undefined) {
      this.runState.stats.totalDamageTaken += stats.totalDamageTaken;
    }
    if (stats.enemiesDefeated !== undefined) {
      this.runState.stats.enemiesDefeated += stats.enemiesDefeated;
    }
  }

  /**
   * 完成副本结算
   */
  completeDungeon(): DungeonResult {
    if (!this.runState) {
      return this.createFailedResult('未在副本中');
    }

    const dungeon = getDungeon(this.runState.dungeonId);
    if (!dungeon) {
      return this.createFailedResult('副本不存在');
    }

    const currentPlayer = player.value;
    if (!currentPlayer) {
      return this.createFailedResult('玩家不存在');
    }

    const timeSpent = Date.now() - this.runState.startTime;

    // 获取难度配置
    const diffConfig = dungeon.difficulties.find(
      d => d.difficulty === this.runState!.difficulty
    );
    const rewardMultiplier = diffConfig?.rewardMultiplier ?? 1;

    // 检查是否首通
    const progress = this.getDungeonProgress(dungeon.id);
    const isFirstClear = !progress?.firstClears.some(
      fc => fc.difficulty === this.runState!.difficulty
    );

    // 计算奖励
    let expReward = Math.floor(dungeon.baseRewards.exp * rewardMultiplier);
    let goldReward = Math.floor(dungeon.baseRewards.gold * rewardMultiplier);
    const itemDrops: { itemId: string; count: number }[] = [];

    // 首通奖励
    if (isFirstClear && dungeon.firstClearReward) {
      expReward += dungeon.firstClearReward.exp;
      goldReward += dungeon.firstClearReward.gold;
      dungeon.firstClearReward.items.forEach(item => {
        itemDrops.push({ itemId: item.itemId, count: item.count });
      });
    }

    // 掉落池
    dungeon.dropPool.forEach(drop => {
      if (random() < drop.rate) {
        const count = randomInt(drop.minCount, drop.maxCount);
        itemDrops.push({ itemId: drop.itemId, count });
      }
    });

    // 更新进度
    this.updateProgressOnComplete(dungeon.id, this.runState.difficulty, timeSpent, isFirstClear);

    const result: DungeonResult = {
      success: true,
      dungeonId: dungeon.id,
      difficulty: this.runState.difficulty,
      floorsCleared: this.runState.currentFloor,
      stats: {
        totalRounds: this.runState.stats.totalRounds,
        totalDamageDealt: this.runState.stats.totalDamageDealt,
        totalDamageTaken: this.runState.stats.totalDamageTaken,
        enemiesDefeated: this.runState.stats.enemiesDefeated,
        timeSpent,
      },
      rewards: {
        exp: expReward,
        gold: goldReward,
        items: itemDrops,
        isFirstClear,
      },
    };

    // 清除运行状态
    this.runState = null;

    return result;
  }

  /**
   * 副本失败处理
   */
  failDungeon(): DungeonResult {
    if (!this.runState) {
      return this.createFailedResult('未在副本中');
    }

    const timeSpent = Date.now() - this.runState.startTime;

    const result: DungeonResult = {
      success: false,
      dungeonId: this.runState.dungeonId,
      difficulty: this.runState.difficulty,
      floorsCleared: this.runState.floorClears.length,
      stats: {
        totalRounds: this.runState.stats.totalRounds,
        totalDamageDealt: this.runState.stats.totalDamageDealt,
        totalDamageTaken: this.runState.stats.totalDamageTaken,
        enemiesDefeated: this.runState.stats.enemiesDefeated,
        timeSpent,
      },
      rewards: {
        exp: 0,
        gold: 0,
        items: [],
        isFirstClear: false,
      },
    };

    // 清除运行状态
    this.runState = null;

    return result;
  }

  /**
   * 创建失败结果
   */
  private createFailedResult(_error: string): DungeonResult {
    return {
      success: false,
      dungeonId: this.runState?.dungeonId ?? '',
      difficulty: this.runState?.difficulty ?? 'easy',
      floorsCleared: 0,
      stats: {
        totalRounds: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        enemiesDefeated: 0,
        timeSpent: 0,
      },
      rewards: {
        exp: 0,
        gold: 0,
        items: [],
        isFirstClear: false,
      },
    };
  }

  /**
   * 增加挑战次数
   */
  private incrementRunCount(dungeonId: string): void {
    const currentPlayer = player.value;
    if (!currentPlayer) return;

    const data = this.cache.get(currentPlayer.id);
    if (!data) return;

    const progressIndex = data.progress.findIndex(p => p.dungeonId === dungeonId);
    if (progressIndex === -1) return;

    data.progress[progressIndex].todayRuns++;
    data.progress[progressIndex].weekRuns++;

    // 异步保存
    this.saveDungeonData(currentPlayer.id).catch(err =>
      console.error('[DungeonService] Failed to save dungeon data:', err)
    );
  }

  /**
   * 完成时更新进度
   */
  private updateProgressOnComplete(
    dungeonId: string,
    difficulty: DungeonDifficulty,
    _timeSpent: number,
    isFirstClear: boolean
  ): void {
    const currentPlayer = player.value;
    if (!currentPlayer) return;

    const data = this.cache.get(currentPlayer.id);
    if (!data) return;

    const progressIndex = data.progress.findIndex(p => p.dungeonId === dungeonId);
    if (progressIndex === -1) return;

    const progress = data.progress[progressIndex];

    // 记录首通
    if (isFirstClear) {
      progress.firstClears.push({
        difficulty,
        clearedAt: Date.now(),
      });
    }

    // 记录完成层数
    const dungeon = getDungeon(dungeonId);
    if (dungeon) {
      progress.completedFloors = dungeon.floors.map(f => f.floorNumber);
    }

    // 异步保存
    this.saveDungeonData(currentPlayer.id).catch(err =>
      console.error('[DungeonService] Failed to save dungeon data:', err)
    );
  }

  /**
   * 获取当前层配置
   */
  getCurrentFloorConfig(): DungeonFloor | null {
    if (!this.runState) return null;

    const dungeon = getDungeon(this.runState.dungeonId);
    if (!dungeon) return null;

    return (
      dungeon.floors.find(f => f.floorNumber === this.runState!.currentFloor) ?? null
    );
  }

  /**
   * 检查当前层是否有Boss
   */
  isBossFloor(): boolean {
    const floor = this.getCurrentFloorConfig();
    return floor?.bossId !== undefined;
  }

  /**
   * 获取副本总层数
   */
  getTotalFloors(dungeonId: string): number {
    const dungeon = getDungeon(dungeonId);
    return dungeon?.floors.length ?? 0;
  }

  /**
   * 获取副本最佳通关时间
   */
  getBestClearTime(_dungeonId: string, _difficulty: DungeonDifficulty): number | null {
    // TODO: 从进度中获取最佳时间
    // 暂时返回 null
    return null;
  }

  /**
   * 清除缓存
   */
  clearCache(playerId?: string): void {
    if (playerId) {
      this.cache.delete(playerId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 退出副本（中途退出）
   */
  exitDungeon(): void {
    this.runState = null;
  }

  /**
   * 是否在副本中
   */
  isInDungeon(): boolean {
    return this.runState !== null;
  }
}

/** 副本服务实例 */
export const dungeonService = new DungeonService();

export default dungeonService;
