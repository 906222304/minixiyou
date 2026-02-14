// 成就服务 - 管理成就数据持久化和核心逻辑

import { db, type AchievementData } from '@/db';
import {
  ACHIEVEMENTS,
  getAchievement,
  getTitle,
  getTotalAchievementPoints,
} from '@/constants/achievements';
import type {
  Achievement,
  PlayerTitle,
  AchievementTracker,
  AchievementProgressInfo,
  AchievementStats,
  AchievementCategory,
  AchievementEvent,
  AchievementConditionType,
  Title,
} from '@/types/achievement';
import { LRUCache } from '@/utils/cache';

/** 默认成就追踪数据 */
function createDefaultTracker(): AchievementTracker {
  return {
    maxLevel: 1,
    maxRealm: 1,
    totalPlayTime: 0,
    totalGoldEarned: 0,
    totalExpEarned: 0,
    monstersKilled: 0,
    bossesKilled: 0,
    dungeonsCleared: [],
    noDamageDungeons: [],
    pvpWins: 0,
    totalDamageDealt: 0,
    battlesWon: 0,
    equipmentCollected: 0,
    legendaryCollected: 0,
    mythicCollected: 0,
    petsCollected: 0,
    companionsCollected: 0,
    itemsCollected: 0,
    mapsExplored: [],
    secretsDiscovered: 0,
    teleportsUnlocked: [],
    maxFavorabilityCompanions: [],
    bondsUnlocked: 0,
    maxLevelBonds: 0,
  };
}

/** 创建默认成就数据 */
function createDefaultAchievementData(playerId: string): AchievementData {
  return {
    playerId,
    achievements: ACHIEVEMENTS.map((a) => ({
      achievementId: a.id,
      unlocked: false,
      claimed: false,
      progress: 0,
    })),
    titles: [],
    activeTitleId: null,
    tracker: createDefaultTracker(),
    totalPoints: 0,
    updatedAt: Date.now(),
  };
}

/**
 * 成就服务类
 */
class AchievementService {
  private cache: LRUCache<string, AchievementData> = new LRUCache(50);

  /**
   * 初始化玩家成就数据
   */
  async initPlayerAchievements(playerId: string): Promise<AchievementData> {
    // 先检查缓存
    const cached = this.cache.get(playerId);
    if (cached) {
      return cached;
    }

    // 从数据库加载
    let data = await db.achievements.where('playerId').equals(playerId).first();

    if (!data) {
      // 创建新的成就数据
      data = createDefaultAchievementData(playerId);
      const id = await db.achievements.add(data);
      data = { ...data, id: id as number };
    }

    // 更新缓存
    this.cache.set(playerId, data);
    return data;
  }

  /**
   * 获取玩家成就数据
   */
  async getPlayerAchievements(playerId: string): Promise<AchievementData | undefined> {
    // 检查缓存
    const cached = this.cache.get(playerId);
    if (cached) {
      return cached;
    }

    // 从数据库加载
    const data = await db.achievements.where('playerId').equals(playerId).first();
    if (data) {
      this.cache.set(playerId, data);
    }
    return data;
  }

  /**
   * 保存玩家成就数据
   */
  async savePlayerAchievements(playerId: string): Promise<void> {
    const data = this.cache.get(playerId);
    if (!data) return;

    data.updatedAt = Date.now();

    if (data.id) {
      // Use put instead of update to handle complex nested data
      await db.achievements.put(data);
    } else {
      const id = await db.achievements.add(data);
      data.id = id as number;
    }
  }

  /**
   * 更新追踪器数据并检查成就
   */
  async updateTracker(
    playerId: string,
    updates: Partial<AchievementTracker>
  ): Promise<string[]> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return [];

    // 更新追踪数据
    const tracker = { ...data.tracker, ...updates };

    // 处理数组类型的更新（累加而非替换）
    if (updates.mapsExplored) {
      const newMaps = updates.mapsExplored.filter(m => !data.tracker.mapsExplored.includes(m));
      tracker.mapsExplored = [...data.tracker.mapsExplored, ...newMaps];
    }
    if (updates.dungeonsCleared) {
      const newDungeons = updates.dungeonsCleared.filter(d => !data.tracker.dungeonsCleared.includes(d));
      tracker.dungeonsCleared = [...data.tracker.dungeonsCleared, ...newDungeons];
    }
    if (updates.noDamageDungeons) {
      const newNoDamage = updates.noDamageDungeons.filter(d => !data.tracker.noDamageDungeons.includes(d));
      tracker.noDamageDungeons = [...data.tracker.noDamageDungeons, ...newNoDamage];
    }
    if (updates.teleportsUnlocked) {
      const newTeleports = updates.teleportsUnlocked.filter(t => !data.tracker.teleportsUnlocked.includes(t));
      tracker.teleportsUnlocked = [...data.tracker.teleportsUnlocked, ...newTeleports];
    }
    if (updates.maxFavorabilityCompanions) {
      const newCompanions = updates.maxFavorabilityCompanions.filter(
        c => !data.tracker.maxFavorabilityCompanions.includes(c)
      );
      tracker.maxFavorabilityCompanions = [...data.tracker.maxFavorabilityCompanions, ...newCompanions];
    }

    data.tracker = tracker;

    // 检查并解锁成就
    const unlockedIds = this.checkAndUnlockAchievements(data);

    // 保存数据
    await this.savePlayerAchievements(playerId);

    return unlockedIds;
  }

  /**
   * 处理成就事件
   */
  async processEvent(playerId: string, event: AchievementEvent): Promise<string[]> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return [];

    const trackerUpdates: Partial<AchievementTracker> = {};

    switch (event.type) {
      case 'level_up': {
        const newLevel = event.data.level as number;
        if (newLevel > data.tracker.maxLevel) {
          trackerUpdates.maxLevel = newLevel;
        }
        break;
      }

      case 'realm_breakthrough': {
        const newRealm = event.data.realm as number;
        if (newRealm > data.tracker.maxRealm) {
          trackerUpdates.maxRealm = newRealm;
        }
        break;
      }

      case 'monster_killed': {
        const isBoss = event.data.isBoss as boolean;
        if (isBoss) {
          trackerUpdates.bossesKilled = data.tracker.bossesKilled + 1;
        } else {
          trackerUpdates.monstersKilled = data.tracker.monstersKilled + 1;
        }
        break;
      }

      case 'boss_killed':
        trackerUpdates.bossesKilled = data.tracker.bossesKilled + 1;
        break;

      case 'dungeon_cleared': {
        const dungeonId = event.data.dungeonId as string;
        const noDamage = event.data.noDamage as boolean;
        trackerUpdates.dungeonsCleared = [dungeonId];
        if (noDamage) {
          trackerUpdates.noDamageDungeons = [dungeonId];
        }
        break;
      }

      case 'equipment_obtained': {
        const quality = event.data.quality as string;
        trackerUpdates.equipmentCollected = data.tracker.equipmentCollected + 1;
        if (quality === 'legendary') {
          trackerUpdates.legendaryCollected = data.tracker.legendaryCollected + 1;
        } else if (quality === 'mythic') {
          trackerUpdates.mythicCollected = data.tracker.mythicCollected + 1;
        }
        break;
      }

      case 'pet_obtained':
        trackerUpdates.petsCollected = event.data.count as number;
        break;

      case 'companion_unlocked':
        trackerUpdates.companionsCollected = event.data.count as number;
        break;

      case 'map_entered': {
        const mapId = event.data.mapId as string;
        if (!data.tracker.mapsExplored.includes(mapId)) {
          trackerUpdates.mapsExplored = [mapId];
        }
        break;
      }

      case 'teleport_unlocked': {
        const teleportId = event.data.teleportId as string;
        if (!data.tracker.teleportsUnlocked.includes(teleportId)) {
          trackerUpdates.teleportsUnlocked = [teleportId];
        }
        break;
      }

      case 'favorability_increased': {
        const isMax = event.data.isMax as boolean;
        const companionId = event.data.companionId as string;
        if (isMax && !data.tracker.maxFavorabilityCompanions.includes(companionId)) {
          trackerUpdates.maxFavorabilityCompanions = [companionId];
        }
        break;
      }

      case 'bond_unlocked':
        trackerUpdates.bondsUnlocked = event.data.count as number;
        break;

      case 'gold_earned':
        trackerUpdates.totalGoldEarned = data.tracker.totalGoldEarned + (event.data.amount as number);
        break;

      case 'exp_earned':
        trackerUpdates.totalExpEarned = data.tracker.totalExpEarned + (event.data.amount as number);
        break;

      case 'damage_dealt':
        trackerUpdates.totalDamageDealt = data.tracker.totalDamageDealt + (event.data.amount as number);
        break;

      case 'battle_won':
        trackerUpdates.battlesWon = data.tracker.battlesWon + 1;
        break;
    }

    // 更新追踪器
    if (Object.keys(trackerUpdates).length > 0) {
      return this.updateTracker(playerId, trackerUpdates);
    }

    return [];
  }

  /**
   * 检查并解锁成就
   */
  private checkAndUnlockAchievements(data: AchievementData): string[] {
    const unlockedIds: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // 跳过已解锁的成就
      const playerAch = data.achievements.find(pa => pa.achievementId === achievement.id);
      if (!playerAch || playerAch.unlocked) continue;

      // 检查前置成就
      if (achievement.prerequisiteId) {
        const prereq = data.achievements.find(pa => pa.achievementId === achievement.prerequisiteId);
        if (!prereq || !prereq.unlocked) continue;
      }

      // 计算进度
      const progress = this.calculateProgress(achievement, data.tracker);
      playerAch.progress = progress;

      // 检查是否满足条件
      if (progress >= achievement.condition.target) {
        playerAch.unlocked = true;
        playerAch.unlockedAt = Date.now();
        data.totalPoints += achievement.points;

        // 检查是否有称号奖励
        if (achievement.reward?.titleId) {
          this.grantTitle(data, achievement.reward.titleId);
        }

        unlockedIds.push(achievement.id);
      }
    }

    return unlockedIds;
  }

  /**
   * 计算成就进度
   */
  private calculateProgress(achievement: Achievement, tracker: AchievementTracker): number {
    const type = achievement.condition.type;

    const progressMap: Record<AchievementConditionType, number> = {
      reach_level: tracker.maxLevel,
      reach_realm: tracker.maxRealm,
      accumulate_playtime: tracker.totalPlayTime,
      accumulate_gold: tracker.totalGoldEarned,
      accumulate_exp: tracker.totalExpEarned,
      defeat_monsters: tracker.monstersKilled,
      defeat_bosses: tracker.bossesKilled,
      clear_dungeon: tracker.dungeonsCleared.length,
      clear_dungeon_no_damage: tracker.noDamageDungeons.length,
      win_pvp_battles: tracker.pvpWins,
      total_damage_dealt: tracker.totalDamageDealt,
      win_battles: tracker.battlesWon,
      collect_equipment: tracker.equipmentCollected,
      collect_legendary: tracker.legendaryCollected,
      collect_mythic: tracker.mythicCollected,
      collect_pets: tracker.petsCollected,
      collect_companions: tracker.companionsCollected,
      collect_items: tracker.itemsCollected,
      explore_maps: tracker.mapsExplored.length,
      discover_secrets: tracker.secretsDiscovered,
      unlock_teleports: tracker.teleportsUnlocked.length,
      visit_all_maps: tracker.mapsExplored.length,
      max_favorability: tracker.maxFavorabilityCompanions.length,
      unlock_bonds: tracker.bondsUnlocked,
      max_bond_level: tracker.maxLevelBonds,
    };

    return progressMap[type] ?? 0;
  }

  /**
   * 授予称号
   */
  private grantTitle(data: AchievementData, titleId: string): void {
    if (data.titles.some(t => t.titleId === titleId)) return;

    const title = getTitle(titleId);
    if (!title) return;

    data.titles.push({
      titleId,
      acquiredAt: Date.now(),
      isActive: false,
    });
  }

  /**
   * 检查特定成就
   */
  async checkAchievement(playerId: string, achievementId: string): Promise<boolean> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return false;

    const achievement = getAchievement(achievementId);
    if (!achievement) return false;

    const playerAch = data.achievements.find(pa => pa.achievementId === achievementId);
    if (!playerAch || playerAch.unlocked) return playerAch?.unlocked ?? false;

    // 重新计算进度
    const progress = this.calculateProgress(achievement, data.tracker);
    playerAch.progress = progress;

    if (progress >= achievement.condition.target) {
      playerAch.unlocked = true;
      playerAch.unlockedAt = Date.now();
      data.totalPoints += achievement.points;

      if (achievement.reward?.titleId) {
        this.grantTitle(data, achievement.reward.titleId);
      }

      await this.savePlayerAchievements(playerId);
      return true;
    }

    return false;
  }

  /**
   * 领取成就奖励
   */
  async claimReward(playerId: string, achievementId: string): Promise<{
    success: boolean;
    message: string;
    reward?: Achievement['reward'];
  }> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) {
      return { success: false, message: '成就数据不存在' };
    }

    const playerAch = data.achievements.find(pa => pa.achievementId === achievementId);
    if (!playerAch) {
      return { success: false, message: '成就不存在' };
    }

    if (!playerAch.unlocked) {
      return { success: false, message: '成就未解锁' };
    }

    if (playerAch.claimed) {
      return { success: false, message: '奖励已领取' };
    }

    const achievement = getAchievement(achievementId);
    if (!achievement) {
      return { success: false, message: '成就配置不存在' };
    }

    // 标记为已领取
    playerAch.claimed = true;
    playerAch.claimedAt = Date.now();

    await this.savePlayerAchievements(playerId);

    return {
      success: true,
      message: '奖励领取成功',
      reward: achievement.reward,
    };
  }

  /**
   * 获取成就进度列表
   */
  async getAchievementProgress(playerId: string): Promise<AchievementProgressInfo[]> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) {
      // 返回默认进度
      return ACHIEVEMENTS.map(achievement => ({
        achievement,
        playerData: {
          achievementId: achievement.id,
          unlocked: false,
          claimed: false,
          progress: 0,
        },
        progressPercent: 0,
        canClaim: false,
        showDetails: !achievement.hidden,
      }));
    }

    return ACHIEVEMENTS.map(achievement => {
      const playerAch = data.achievements.find(pa => pa.achievementId === achievement.id) ?? {
        achievementId: achievement.id,
        unlocked: false,
        claimed: false,
        progress: 0,
      };

      const progress = this.calculateProgress(achievement, data.tracker);
      const progressPercent = Math.min(100, (progress / achievement.condition.target) * 100);
      const showDetails = !achievement.hidden || playerAch.unlocked;
      const canClaim = playerAch.unlocked && !playerAch.claimed && achievement.reward !== undefined;

      return {
        achievement,
        playerData: playerAch,
        progressPercent,
        canClaim,
        showDetails,
      };
    });
  }

  /**
   * 获取成就统计
   */
  async getAchievementStats(playerId: string): Promise<AchievementStats> {
    const data = await this.getPlayerAchievements(playerId);

    const categoryProgress: AchievementStats['categoryProgress'] = {
      growth: { total: 0, unlocked: 0, points: 0, earnedPoints: 0 },
      combat: { total: 0, unlocked: 0, points: 0, earnedPoints: 0 },
      collection: { total: 0, unlocked: 0, points: 0, earnedPoints: 0 },
      explore: { total: 0, unlocked: 0, points: 0, earnedPoints: 0 },
      social: { total: 0, unlocked: 0, points: 0, earnedPoints: 0 },
    };

    for (const achievement of ACHIEVEMENTS) {
      const cat = categoryProgress[achievement.category];
      cat.total++;
      cat.points += achievement.points;
    }

    if (data) {
      for (const playerAch of data.achievements) {
        if (playerAch.unlocked) {
          const achievement = getAchievement(playerAch.achievementId);
          if (achievement) {
            categoryProgress[achievement.category].unlocked++;
            categoryProgress[achievement.category].earnedPoints += achievement.points;
          }
        }
      }
    }

    const unlockedCount = data?.achievements.filter(a => a.unlocked).length ?? 0;
    const claimedCount = data?.achievements.filter(a => a.claimed).length ?? 0;

    return {
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: unlockedCount,
      claimedRewards: claimedCount,
      totalPoints: getTotalAchievementPoints(),
      earnedPoints: data?.totalPoints ?? 0,
      categoryProgress,
    };
  }

  /**
   * 获取总点数
   */
  async getTotalPoints(playerId: string): Promise<number> {
    const data = await this.getPlayerAchievements(playerId);
    return data?.totalPoints ?? 0;
  }

  /**
   * 激活称号
   */
  async activateTitle(playerId: string, titleId: string): Promise<boolean> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return false;

    const playerTitle = data.titles.find(t => t.titleId === titleId);
    if (!playerTitle) return false;

    // 取消当前激活的称号
    data.titles.forEach(t => {
      t.isActive = t.titleId === titleId;
    });
    data.activeTitleId = titleId;

    await this.savePlayerAchievements(playerId);
    return true;
  }

  /**
   * 取消激活称号
   */
  async deactivateTitle(playerId: string): Promise<boolean> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return false;

    data.titles.forEach(t => {
      t.isActive = false;
    });
    data.activeTitleId = null;

    await this.savePlayerAchievements(playerId);
    return true;
  }

  /**
   * 获取玩家称号列表
   */
  async getPlayerTitles(playerId: string): Promise<Array<PlayerTitle & { title: Title }>> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data) return [];

    return data.titles
      .map(pt => {
        const title = getTitle(pt.titleId);
        return title ? { ...pt, title } : null;
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null);
  }

  /**
   * 获取当前激活的称号
   */
  async getActiveTitle(playerId: string): Promise<{ title: Title; playerTitle: PlayerTitle } | null> {
    const data = await this.getPlayerAchievements(playerId);
    if (!data || !data.activeTitleId) return null;

    const playerTitle = data.titles.find(t => t.titleId === data.activeTitleId);
    if (!playerTitle) return null;

    const title = getTitle(data.activeTitleId);
    if (!title) return null;

    return { title, playerTitle };
  }

  /**
   * 获取追踪器数据
   */
  async getTracker(playerId: string): Promise<AchievementTracker | undefined> {
    const data = await this.getPlayerAchievements(playerId);
    return data?.tracker;
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
   * 获取类别下的成就进度
   */
  async getCategoryProgress(
    playerId: string,
    category: AchievementCategory
  ): Promise<AchievementProgressInfo[]> {
    const allProgress = await this.getAchievementProgress(playerId);
    return allProgress.filter(p => p.achievement.category === category);
  }
}

/** 成就服务实例 */
export const achievementService = new AchievementService();

export default achievementService;
