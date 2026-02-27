// 任务服务 - 管理任务数据持久化和核心逻辑

import {
  QUESTS,
  QUEST_CHAPTERS,
  getQuest,
  getDailyQuests,
  CHAPTER_FIRST_CLEAR_BONUS,
  getRewardPool,
  getRewardPoolIdByChapter,
} from '@/constants/quests';
import type {
  Quest,
  PlayerQuest,
  QuestProgressInfo,
  QuestStats,
  QuestTracker,
  QuestEvent,
  QuestStatus,
  QuestCondition,
  QuestReward,
  RewardPoolItem,
  FirstClearBonus,
} from '@/types/quest';

/** localStorage 存储键前缀 */
const STORAGE_KEY_PREFIX = 'minixiyou_quest_';

/** 任务数据存储结构 */
export interface QuestData {
  /** 自增主键 */
  id?: number;
  /** 玩家ID */
  playerId: string;
  /** 玩家任务列表 */
  quests: PlayerQuest[];
  /** 任务追踪器 */
  tracker: QuestTracker;
  /** 已领取首通奖励的章节 */
  chapterFirstClearClaimed: number[];
  /** 更新时间戳 */
  updatedAt: number;
}

/** 创建默认追踪器 */
function createDefaultTracker(): QuestTracker {
  return {
    monstersKilled: {},
    itemsCollected: {},
    npcsTalked: [],
    mapsVisited: [],
    equipmentsObtained: [],
    battlesWon: {},
    dungeonsCompleted: {},
    skillsUsed: {},
    equipmentsEnhanced: 0,
    arenaBattles: 0,
    giftsGiven: 0,
    fishCaught: 0,
    dailyQuestsCompletedToday: [],
    lastDailyReset: Date.now(),
  };
}

/** 创建默认任务数据 */
function createDefaultQuestData(playerId: string): QuestData {
  // 找到自动接取的任务
  const autoAcceptQuests = QUESTS.filter((q) => q.autoAccept);

  return {
    playerId,
    quests: autoAcceptQuests.map((quest) => ({
      questId: quest.id,
      status: 'in_progress' as QuestStatus,
      acceptedAt: Date.now(),
      conditionProgress: {},
    })),
    tracker: createDefaultTracker(),
    chapterFirstClearClaimed: [],
    updatedAt: Date.now(),
  };
}

/** 获取存储键 */
function getStorageKey(playerId: string): string {
  return `${STORAGE_KEY_PREFIX}${playerId}`;
}

/** 检查 localStorage 是否可用 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    // 测试是否可以正常读写
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/** localStorage 是否可用 */
const hasLocalStorage = isLocalStorageAvailable();

/**
 * 任务服务类
 */
class QuestService {
  private memoryCache: Map<string, QuestData> = new Map();

  /**
   * 从 localStorage 加载数据
   */
  private loadFromStorage(playerId: string): QuestData | null {
    if (!hasLocalStorage) return null;

    try {
      const key = getStorageKey(playerId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored) as QuestData;
        return data;
      }
    } catch (error) {
      console.error('[QuestService] Failed to load from localStorage:', error);
    }
    return null;
  }

  /**
   * 保存到 localStorage
   */
  private saveToStorage(playerId: string, data: QuestData): void {
    if (!hasLocalStorage) return;

    try {
      const key = getStorageKey(playerId);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('[QuestService] Failed to save to localStorage:', error);
    }
  }

  /**
   * 初始化玩家任务数据
   */
  async initPlayerQuests(playerId: string): Promise<QuestData> {
    // 先检查内存缓存
    const cached = this.memoryCache.get(playerId);
    if (cached) {
      // 检查日常任务重置
      return this.checkDailyReset(cached);
    }

    // 从 localStorage 加载
    let data = this.loadFromStorage(playerId);

    if (!data) {
      // 没有存储的数据，创建新的
      data = createDefaultQuestData(playerId);
      this.saveToStorage(playerId, data);
    }

    // 存入内存缓存
    this.memoryCache.set(playerId, data);

    // 检查日常任务重置
    return this.checkDailyReset(data);
  }

  /**
   * 检查并重置日常任务
   */
  private checkDailyReset(data: QuestData): QuestData {
    const now = Date.now();
    const lastReset = data.tracker.lastDailyReset;

    // 检查是否需要重置（跨越了零点）
    const lastResetDate = new Date(lastReset);
    const nowDate = new Date(now);

    if (
      lastResetDate.getDate() !== nowDate.getDate() ||
      lastResetDate.getMonth() !== nowDate.getMonth() ||
      lastResetDate.getFullYear() !== nowDate.getFullYear()
    ) {
      // 重置日常任务
      const dailyQuests = getDailyQuests();
      const dailyQuestIds = dailyQuests.map((q) => q.id);

      // 移除已完成的日常任务
      data.quests = data.quests.filter((pq) => !dailyQuestIds.includes(pq.questId));

      // 重置追踪器中的日常完成记录
      data.tracker.dailyQuestsCompletedToday = [];
      data.tracker.lastDailyReset = now;
    }

    return data;
  }

  /**
   * 获取玩家任务数据
   */
  async getPlayerQuests(playerId: string): Promise<QuestData | undefined> {
    return this.memoryCache.get(playerId);
  }

  /**
   * 保存玩家任务数据（内存缓存 + localStorage）
   */
  async savePlayerQuests(playerId: string): Promise<void> {
    const data = this.memoryCache.get(playerId);
    if (!data) return;

    data.updatedAt = Date.now();
    // 更新内存缓存
    this.memoryCache.set(playerId, data);
    // 持久化到 localStorage
    this.saveToStorage(playerId, data);
  }

  /**
   * 接取任务
   */
  async acceptQuest(playerId: string, questId: string): Promise<{
    success: boolean;
    message: string;
    quest?: Quest;
  }> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) {
      return { success: false, message: '任务数据不存在' };
    }

    // 检查任务是否存在
    const quest = getQuest(questId);
    if (!quest) {
      return { success: false, message: '任务不存在' };
    }

    // 检查是否已接取（更严格：不允许已接取的任务再次接取）
    const existingQuest = data.quests.find((pq) => pq.questId === questId);
    if (existingQuest && existingQuest.status !== 'locked' && existingQuest.status !== 'available') {
      return { success: false, message: '任务已接取' };
    }

    // 添加任务
    const playerQuest: PlayerQuest = {
      questId,
      status: 'in_progress',
      acceptedAt: Date.now(),
      conditionProgress: {},
    };

    if (existingQuest) {
      // 更新现有记录
      Object.assign(existingQuest, playerQuest);
    } else {
      data.quests.push(playerQuest);
    }

    await this.savePlayerQuests(playerId);

    return { success: true, message: '任务接取成功', quest };
  }

  /**
   * 完成任务
   */
  async completeQuest(playerId: string, questId: string): Promise<{
    success: boolean;
    message: string;
    quest?: Quest;
  }> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) {
      return { success: false, message: '任务数据不存在' };
    }

    const playerQuest = data.quests.find((pq) => pq.questId === questId);
    if (!playerQuest) {
      return { success: false, message: '任务未接取' };
    }

    const quest = getQuest(questId);
    if (!quest) {
      return { success: false, message: '任务配置不存在' };
    }

    // 检查是否满足完成条件
    if (!this.checkQuestCompletion(quest, playerQuest)) {
      return { success: false, message: '任务条件未完成' };
    }

    // 标记完成
    playerQuest.status = 'completed';
    playerQuest.completedAt = Date.now();

    // 如果是日常任务，记录完成
    if (quest.type === 'daily') {
      data.tracker.dailyQuestsCompletedToday.push(questId);
    }

    await this.savePlayerQuests(playerId);

    return { success: true, message: '任务完成', quest };
  }

  /**
   * 领取任务奖励
   */
  async claimReward(playerId: string, questId: string): Promise<{
    success: boolean;
    message: string;
    quest?: Quest;
    rewards?: Quest['rewards'];
    firstClearBonus?: FirstClearBonus;
    poolRewards?: QuestReward;
  }> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) {
      return { success: false, message: '任务数据不存在' };
    }

    const playerQuest = data.quests.find((pq) => pq.questId === questId);
    if (!playerQuest) {
      return { success: false, message: '任务未接取' };
    }

    if (playerQuest.status !== 'completed' && playerQuest.status !== 'claimed') {
      return { success: false, message: '任务未完成' };
    }

    if (playerQuest.status === 'claimed') {
      return { success: false, message: '奖励已领取' };
    }

    const quest = getQuest(questId);
    if (!quest) {
      return { success: false, message: '任务配置不存在' };
    }

    // 生成最终奖励
    const finalRewards = this.generateFinalRewards(quest);
    let firstClearBonus: FirstClearBonus | undefined;
    let poolRewards: QuestReward | undefined;

    // 检查是否需要发放首通奖励（章节首次完成）
    const isFirstClear = quest.chapter && !data.chapterFirstClearClaimed.includes(quest.chapter);
    if (isFirstClear && quest.chapter) {
      firstClearBonus = CHAPTER_FIRST_CLEAR_BONUS[quest.chapter];
      data.chapterFirstClearClaimed.push(quest.chapter);
      playerQuest.firstClearClaimed = true;
    }

    // 如果有奖励池，生成随机奖励
    if (finalRewards.rewardPoolId) {
      poolRewards = this.drawFromRewardPool(finalRewards.rewardPoolId);
    }

    // 标记已领取
    playerQuest.status = 'claimed';
    playerQuest.claimedAt = Date.now();

    await this.savePlayerQuests(playerId);

    return {
      success: true,
      message: '奖励领取成功',
      quest,
      rewards: finalRewards,
      firstClearBonus,
      poolRewards,
    };
  }

  /**
   * 生成最终奖励（包含随机金币和经验）
   */
  private generateFinalRewards(quest: Quest): QuestReward {
    const baseRewards = { ...quest.rewards };

    // 如果有金币范围，随机生成金币
    if (baseRewards.goldRange) {
      baseRewards.gold = this.randomInRange(
        baseRewards.goldRange.min,
        baseRewards.goldRange.max
      );
      delete baseRewards.goldRange;
    }

    // 如果有经验范围，随机生成经验
    if (baseRewards.expRange) {
      baseRewards.exp = this.randomInRange(
        baseRewards.expRange.min,
        baseRewards.expRange.max
      );
      delete baseRewards.expRange;
    }

    // 如果没有设置奖励池ID，根据章节自动分配
    if (!baseRewards.rewardPoolId && quest.chapter) {
      baseRewards.rewardPoolId = getRewardPoolIdByChapter(quest.chapter, quest.type);
    }

    return baseRewards;
  }

  /**
   * 从奖励池中抽取奖励
   */
  private drawFromRewardPool(poolId: string): QuestReward {
    const pool = getRewardPool(poolId);
    if (!pool) {
      console.warn(`[QuestService] Reward pool not found: ${poolId}`);
      return {};
    }

    const result: QuestReward = {};
    const drawCount = pool.drawCount || 1;

    // 添加保底奖励
    if (pool.guaranteedRewards && pool.guaranteedRewards.length > 0) {
      for (const guaranteed of pool.guaranteedRewards) {
        this.mergeRewards(result, guaranteed);
      }
    }

    // 随机抽取
    for (let i = 0; i < drawCount; i++) {
      const drawnItem = this.drawRandomItem(pool.rewards);
      if (drawnItem) {
        const reward = this.convertPoolItemToReward(drawnItem);
        this.mergeRewards(result, reward);
      }
    }

    return result;
  }

  /**
   * 根据权重随机抽取奖励
   */
  private drawRandomItem(items: RewardPoolItem[]): RewardPoolItem | null {
    if (items.length === 0) return null;

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) return null;

    let random = Math.random() * totalWeight;

    for (const item of items) {
      random -= item.weight;
      if (random <= 0) {
        return item;
      }
    }

    return items[items.length - 1];
  }

  /**
   * 将奖励池物品转换为任务奖励
   */
  private convertPoolItemToReward(item: RewardPoolItem): QuestReward {
    const quantity = item.quantity
      ? this.randomInRange(item.quantity.min, item.quantity.max)
      : 1;

    switch (item.type) {
      case 'gold':
        return { gold: typeof item.value === 'number' ? item.value * quantity : quantity };
      case 'exp':
        return { exp: typeof item.value === 'number' ? item.value * quantity : quantity };
      case 'item':
        return {
          items: [{
            itemId: String(item.value),
            count: quantity,
          }],
        };
      case 'equipment':
        return {
          equipments: [{
            equipmentId: String(item.value),
            count: quantity,
          }],
        };
      default:
        return {};
    }
  }

  /**
   * 合并奖励
   */
  private mergeRewards(target: QuestReward, source: QuestReward): void {
    // 合并金币
    if (source.gold) {
      target.gold = (target.gold || 0) + source.gold;
    }

    // 合并经验
    if (source.exp) {
      target.exp = (target.exp || 0) + source.exp;
    }

    // 合并物品
    if (source.items && source.items.length > 0) {
      if (!target.items) target.items = [];
      for (const item of source.items) {
        const existing = target.items.find(i => i.itemId === item.itemId);
        if (existing) {
          existing.count += item.count;
        } else {
          target.items.push({ ...item });
        }
      }
    }

    // 合并装备
    if (source.equipments && source.equipments.length > 0) {
      if (!target.equipments) target.equipments = [];
      for (const equip of source.equipments) {
        const existing = target.equipments.find(e => e.equipmentId === equip.equipmentId);
        if (existing) {
          existing.count += equip.count;
        } else {
          target.equipments.push({ ...equip });
        }
      }
    }

    // 合并解锁内容
    if (source.unlocks) {
      if (!target.unlocks) {
        target.unlocks = { maps: [], features: [], npcs: [] };
      }
      if (source.unlocks.maps) {
        target.unlocks.maps = [...(target.unlocks.maps || []), ...source.unlocks.maps];
      }
      if (source.unlocks.features) {
        target.unlocks.features = [...(target.unlocks.features || []), ...source.unlocks.features];
      }
      if (source.unlocks.npcs) {
        target.unlocks.npcs = [...(target.unlocks.npcs || []), ...source.unlocks.npcs];
      }
    }
  }

  /**
   * 生成指定范围内的随机整数
   */
  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 处理任务事件
   */
  async processEvent(playerId: string, event: QuestEvent): Promise<string[]> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) return [];

    // 更新追踪器
    this.updateTracker(data.tracker, event);

    // 检查任务进度更新
    const updatedQuestIds: string[] = [];

    for (const playerQuest of data.quests) {
      if (playerQuest.status !== 'in_progress') continue;

      const quest = getQuest(playerQuest.questId);
      if (!quest) continue;

      // 更新条件进度
      const hadUpdate = this.updateQuestProgress(quest, playerQuest, event, data.tracker);
      if (hadUpdate) {
        updatedQuestIds.push(playerQuest.questId);
      }
    }

    if (updatedQuestIds.length > 0) {
      await this.savePlayerQuests(playerId);
    }

    return updatedQuestIds;
  }

  /**
   * 更新追踪器
   */
  private updateTracker(tracker: QuestTracker, event: QuestEvent): void {
    switch (event.type) {
      case 'monster_killed': {
        const monsterId = event.targetId;
        tracker.monstersKilled[monsterId] = (tracker.monstersKilled[monsterId] || 0) + (event.count || 1);
        break;
      }

      case 'item_collected': {
        const itemId = event.targetId;
        tracker.itemsCollected[itemId] = (tracker.itemsCollected[itemId] || 0) + (event.count || 1);
        break;
      }

      case 'npc_talked':
        if (!tracker.npcsTalked.includes(event.targetId)) {
          tracker.npcsTalked.push(event.targetId);
        }
        break;

      case 'map_reached':
        if (!tracker.mapsVisited.includes(event.targetId)) {
          tracker.mapsVisited.push(event.targetId);
        }
        break;

      case 'item_equipped':
        if (!tracker.equipmentsObtained.includes(event.targetId)) {
          tracker.equipmentsObtained.push(event.targetId);
        }
        break;

      case 'battle_won': {
        const battleTarget = event.targetId || 'any';
        tracker.battlesWon[battleTarget] = (tracker.battlesWon[battleTarget] || 0) + (event.count || 1);
        break;
      }

      case 'pet_captured': {
        // 捕获宠物，使用 itemsCollected 以 pet_ 前缀存储
        const petId = `pet_${event.targetId}`;
        tracker.itemsCollected[petId] = (tracker.itemsCollected[petId] || 0) + (event.count || 1);
        break;
      }

      case 'dungeon_completed': {
        const dungeonId = event.targetId || 'any';
        tracker.dungeonsCompleted[dungeonId] = (tracker.dungeonsCompleted[dungeonId] || 0) + (event.count || 1);
        break;
      }

      case 'skill_used': {
        const skillId = event.targetId || 'any';
        tracker.skillsUsed[skillId] = (tracker.skillsUsed[skillId] || 0) + (event.count || 1);
        break;
      }

      case 'equipment_enhanced':
        tracker.equipmentsEnhanced += event.count || 1;
        break;

      case 'arena_battle':
        tracker.arenaBattles += event.count || 1;
        break;

      case 'gift_given':
        tracker.giftsGiven += event.count || 1;
        break;

      case 'fish_caught':
        tracker.fishCaught += event.count || 1;
        break;

      case 'level_reached':
        // level_reached 事件通过 updateLevelCondition 方法处理
        // 这里不需要更新 tracker，因为等级条件直接存储在 conditionProgress 中
        break;
    }
  }

  /**
   * 更新任务进度
   */
  private updateQuestProgress(
    quest: Quest,
    playerQuest: PlayerQuest,
    _event: QuestEvent,
    tracker: QuestTracker
  ): boolean {
    let hadUpdate = false;

    for (const condition of quest.conditions) {
      const key = `${condition.type}_${condition.target}`;
      const prevProgress = playerQuest.conditionProgress[key] || 0;
      const newProgress = this.calculateConditionProgress(condition, tracker);

      if (newProgress !== prevProgress) {
        playerQuest.conditionProgress[key] = newProgress;
        hadUpdate = true;
      }
    }

    return hadUpdate;
  }

  /**
   * 计算条件进度
   */
  private calculateConditionProgress(condition: QuestCondition, tracker: QuestTracker): number {
    switch (condition.type) {
      case 'kill':
        if (condition.target === 'any') {
          // 统计所有击杀
          return Object.values(tracker.monstersKilled).reduce((a, b) => a + b, 0);
        }
        if (condition.target === 'boss') {
          // 统计Boss击杀（Boss通常以boss_开头或包含boss关键词）
          return Object.entries(tracker.monstersKilled)
            .filter(([id]) => id.includes('boss') || id === 'boss')
            .reduce((sum, [, count]) => sum + count, 0);
        }
        if (condition.target === 'elite') {
          // 统计精英怪物击杀
          return Object.entries(tracker.monstersKilled)
            .filter(([id]) => id.includes('elite') || id.includes('_elite_'))
            .reduce((sum, [, count]) => sum + count, 0);
        }
        return tracker.monstersKilled[condition.target] || 0;

      case 'collect':
        if (condition.target === 'any_gem') {
          // 统计所有宝石收集
          return Object.entries(tracker.itemsCollected)
            .filter(([id]) => id.startsWith('gem_'))
            .reduce((sum, [, count]) => sum + count, 0);
        }
        if (condition.target === 'any_material') {
          // 统计所有材料收集
          return Object.entries(tracker.itemsCollected)
            .filter(([id]) => id.startsWith('item_') && !id.includes('potion'))
            .reduce((sum, [, count]) => sum + count, 0);
        }
        return tracker.itemsCollected[condition.target] || 0;

      case 'talk':
        return tracker.npcsTalked.includes(condition.target) ? 1 : 0;

      case 'visit_map':
        if (condition.target === 'any') {
          return tracker.mapsVisited.length;
        }
        return tracker.mapsVisited.includes(condition.target) ? 1 : 0;

      case 'equip':
        if (condition.target === 'any') {
          return tracker.equipmentsObtained.length;
        }
        return tracker.equipmentsObtained.includes(condition.target) ? 1 : 0;

      case 'battle':
        if (condition.target === 'any') {
          return Object.values(tracker.battlesWon).reduce((a, b) => a + b, 0);
        }
        if (condition.target === 'with_pet') {
          // 带宠物的战斗，暂时用总战斗数
          return Object.values(tracker.battlesWon).reduce((a, b) => a + b, 0);
        }
        return tracker.battlesWon[condition.target] || 0;

      case 'level':
        // level条件通过updateLevelCondition方法更新，不从tracker读取
        return 0;

      case 'dungeon':
        if (condition.target === 'any') {
          return Object.values(tracker.dungeonsCompleted).reduce((a, b) => a + b, 0);
        }
        return tracker.dungeonsCompleted[condition.target] || 0;

      case 'skill_use':
        if (condition.target === 'any') {
          return Object.values(tracker.skillsUsed).reduce((a, b) => a + b, 0);
        }
        return tracker.skillsUsed[condition.target] || 0;

      case 'enhance':
        return tracker.equipmentsEnhanced;

      case 'arena':
        return tracker.arenaBattles;

      case 'gift':
        return tracker.giftsGiven;

      case 'fish':
        return tracker.fishCaught;

      case 'capture':
        // 捕捉条件，使用物品收集中的宠物相关物品
        return Object.entries(tracker.itemsCollected)
          .filter(([id]) => id.startsWith('pet_'))
          .reduce((sum, [, count]) => sum + count, 0);

      default:
        return 0;
    }
  }

  /**
   * 检查任务是否完成
   */
  private checkQuestCompletion(quest: Quest, playerQuest: PlayerQuest): boolean {
    // 无条件的任务直接完成
    if (quest.conditions.length === 0) {
      return true;
    }

    for (const condition of quest.conditions) {
      const key = `${condition.type}_${condition.target}`;
      const progress = playerQuest.conditionProgress[key] || 0;

      if (progress < condition.required) {
        return false;
      }
    }

    return true;
  }

  /**
   * 获取任务进度列表
   */
  async getQuestProgress(
    playerId: string,
    playerLevel: number
  ): Promise<QuestProgressInfo[]> {
    const data = await this.getPlayerQuests(playerId);

    return QUESTS.map((quest) => {
      const playerQuest = data?.quests.find((pq) => pq.questId === quest.id);
      const tracker = data?.tracker || createDefaultTracker();

      // 计算条件进度
      const conditionDetails = quest.conditions.map((condition) => {
        const key = `${condition.type}_${condition.target}`;
        const current = playerQuest?.conditionProgress[key] ||
          this.calculateConditionProgress(condition, tracker);
        const required = condition.required;
        const completed = current >= required;

        // 动态替换描述模板中的占位符
        const formattedDescription = this.formatConditionDescription(
          condition.description,
          current,
          required
        );

        return {
          condition: {
            ...condition,
            description: formattedDescription,
          },
          current,
          required,
          completed,
        };
      });

      // 计算总进度
      const completedConditions = conditionDetails.filter((cd) => cd.completed).length;
      const progressPercent = quest.conditions.length > 0
        ? (completedConditions / quest.conditions.length) * 100
        : 100;

      // 判断状态
      let status: QuestStatus = 'locked';
      if (playerQuest) {
        status = playerQuest.status;
      } else if (this.canAcceptQuest(quest, data?.quests || [], playerLevel)) {
        status = 'available';
      }

      const canAccept = status === 'available';
      const canClaim = status === 'completed';
      const showDetails = status !== 'locked';

      return {
        quest,
        playerData: playerQuest || {
          questId: quest.id,
          status,
          conditionProgress: {},
        },
        progressPercent,
        canClaim,
        canAccept,
        showDetails,
        conditionDetails,
      };
    });
  }

  /**
   * 格式化条件描述，替换占位符
   */
  private formatConditionDescription(description: string, current: number, required: number): string {
    return description
      .replace(/{current}/g, String(Math.min(current, required)))
      .replace(/{required}/g, String(required));
  }

  /**
   * 检查是否可以接取任务
   */
  private canAcceptQuest(
    quest: Quest,
    playerQuests: PlayerQuest[],
    playerLevel: number
  ): boolean {
    // 检查等级
    if (quest.levelRequired && playerLevel < quest.levelRequired) {
      return false;
    }

    // 检查前置任务（completed 或 claimed 都算完成）
    if (quest.prerequisites) {
      const completedIds = playerQuests
        .filter((pq) => pq.status === 'completed' || pq.status === 'claimed')
        .map((pq) => pq.questId);

      const hasAllPrereqs = quest.prerequisites.every((prereq) =>
        completedIds.includes(prereq)
      );

      if (!hasAllPrereqs) {
        return false;
      }
    }

    // 检查是否已接取
    const existingQuest = playerQuests.find((pq) => pq.questId === quest.id);
    if (existingQuest && existingQuest.status !== 'locked') {
      return false;
    }

    return true;
  }

  /**
   * 获取任务统计
   */
  async getQuestStats(playerId: string, playerLevel: number): Promise<QuestStats> {
    const progress = await this.getQuestProgress(playerId, playerLevel);

    const completedQuests = progress.filter(
      (p) => p.playerData.status === 'completed' || p.playerData.status === 'claimed'
    ).length;

    const inProgressQuests = progress.filter(
      (p) => p.playerData.status === 'in_progress'
    ).length;

    const availableQuests = progress.filter((p) => p.canAccept).length;

    // 计算主线进度
    const mainQuests = progress.filter((p) => p.quest.type === 'main');
    const completedMainQuests = mainQuests.filter(
      (p) => p.playerData.status === 'completed' || p.playerData.status === 'claimed'
    );

    // 找到当前章节
    let currentChapter = 1;
    let chapterName = QUEST_CHAPTERS[0]?.name || '第一章';

    for (const chapter of QUEST_CHAPTERS) {
      const chapterQuests = mainQuests.filter((p) => p.quest.chapter === chapter.id);
      const completedInChapter = chapterQuests.filter(
        (p) => p.playerData.status === 'completed' || p.playerData.status === 'claimed'
      ).length;

      if (completedInChapter < chapter.questIds.length) {
        currentChapter = chapter.id;
        chapterName = chapter.name;
        break;
      }
      currentChapter = chapter.id + 1;
      chapterName = QUEST_CHAPTERS.find((c) => c.id === currentChapter)?.name || chapterName;
    }

    // 日常任务统计
    const data = await this.getPlayerQuests(playerId);
    const dailyQuests = getDailyQuests();
    const dailyCompletedToday = data?.tracker.dailyQuestsCompletedToday.length || 0;

    return {
      totalQuests: QUESTS.length,
      completedQuests,
      inProgressQuests,
      availableQuests,
      mainStoryProgress: {
        chapter: currentChapter,
        chapterName,
        completedInChapter: completedMainQuests.length,
        totalInChapter: mainQuests.length,
      },
      dailyCompletedToday,
      dailyTotal: dailyQuests.length,
    };
  }

  /**
   * 获取当前进行中的任务
   */
  async getActiveQuests(playerId: string, playerLevel: number): Promise<QuestProgressInfo[]> {
    const progress = await this.getQuestProgress(playerId, playerLevel);
    return progress.filter(
      (p) => p.playerData.status === 'in_progress' || p.playerData.status === 'completed'
    );
  }

  /**
   * 获取追踪器数据
   */
  async getTracker(playerId: string): Promise<QuestTracker | undefined> {
    const data = await this.getPlayerQuests(playerId);
    return data?.tracker;
  }

  /**
   * 更新等级条件
   */
  async updateLevelCondition(playerId: string, level: number): Promise<string[]> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) return [];

    const updatedQuestIds: string[] = [];

    for (const playerQuest of data.quests) {
      if (playerQuest.status !== 'in_progress') continue;

      const quest = getQuest(playerQuest.questId);
      if (!quest) continue;

      // 检查等级条件
      for (const condition of quest.conditions) {
        if (condition.type === 'level') {
          const key = `${condition.type}_${condition.target}`;
          playerQuest.conditionProgress[key] = level;
          updatedQuestIds.push(playerQuest.questId);
        }
      }
    }

    if (updatedQuestIds.length > 0) {
      await this.savePlayerQuests(playerId);
    }

    return updatedQuestIds;
  }

  /**
   * 清除缓存
   */
  clearCache(playerId?: string): void {
    if (playerId) {
      this.memoryCache.delete(playerId);
      // 同时清除 localStorage
      if (hasLocalStorage) {
        try {
          localStorage.removeItem(getStorageKey(playerId));
        } catch (error) {
          console.error('[QuestService] Failed to clear localStorage:', error);
        }
      }
    } else {
      this.memoryCache.clear();
      // 清除所有任务相关的 localStorage
      if (hasLocalStorage) {
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.error('[QuestService] Failed to clear all localStorage:', error);
        }
      }
    }
  }

  /**
   * 模拟奖励抽取（用于预览）
   */
  simulateRewardDraw(poolId: string): QuestReward {
    return this.drawFromRewardPool(poolId);
  }

  /**
   * 获取章节首通奖励
   */
  getChapterFirstClearBonus(chapter: number): FirstClearBonus | undefined {
    return CHAPTER_FIRST_CLEAR_BONUS[chapter];
  }

  /**
   * 检查章节是否已完成
   */
  async isChapterCompleted(playerId: string, chapter: number): Promise<boolean> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) return false;

    const chapterQuests = QUESTS.filter(q => q.chapter === chapter);
    if (chapterQuests.length === 0) return false;

    return chapterQuests.every(quest => {
      const playerQuest = data.quests.find(pq => pq.questId === quest.id);
      return playerQuest && (playerQuest.status === 'completed' || playerQuest.status === 'claimed');
    });
  }

  /**
   * 检查是否可以领取章节首通奖励
   */
  async canClaimChapterFirstClear(playerId: string, chapter: number): Promise<boolean> {
    const data = await this.getPlayerQuests(playerId);
    if (!data) return false;

    // 检查是否已领取过首通奖励
    if (data.chapterFirstClearClaimed.includes(chapter)) {
      return false;
    }

    // 检查章节是否完成
    return this.isChapterCompleted(playerId, chapter);
  }

  /**
   * 计算任务预览奖励（包含随机范围）
   */
  calculatePreviewRewards(quest: Quest): {
    base: QuestReward;
    poolId?: string;
    firstClear?: FirstClearBonus;
    goldRange?: { min: number; max: number };
    expRange?: { min: number; max: number };
  } {
    const result: {
      base: QuestReward;
      poolId?: string;
      firstClear?: FirstClearBonus;
      goldRange?: { min: number; max: number };
      expRange?: { min: number; max: number };
    } = {
      base: {
        gold: quest.rewards.gold,
        exp: quest.rewards.exp,
        items: quest.rewards.items,
        equipments: quest.rewards.equipments,
        unlocks: quest.rewards.unlocks,
      },
    };

    // 保存范围信息用于显示
    if (quest.rewards.goldRange) {
      result.goldRange = quest.rewards.goldRange;
    }
    if (quest.rewards.expRange) {
      result.expRange = quest.rewards.expRange;
    }

    // 获取奖励池ID
    if (quest.rewards.rewardPoolId) {
      result.poolId = quest.rewards.rewardPoolId;
    } else if (quest.chapter) {
      result.poolId = getRewardPoolIdByChapter(quest.chapter, quest.type);
    }

    // 获取首通奖励
    if (quest.chapter) {
      result.firstClear = CHAPTER_FIRST_CLEAR_BONUS[quest.chapter];
    }

    return result;
  }
}

/** 任务服务实例 */
export const questService = new QuestService();

export default questService;
