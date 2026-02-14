// 修炼系统服务

import type {
  CultivationType,
  CultivationData,
  CultivationProgress,
  LevelUpResult,
  BreakthroughResult,
  CultivationBonus,
} from '@/types/cultivation';
import {
  REALMS,
  getExpToNextLevel,
  getBonusPerLevel,
  getTotalBonus,
  getNextRealm,
  getCultivationPill,
  calculateBreakthroughSuccessRate,
  BREAKTHROUGH_FAIL_EXP_PENALTY,
  AUTO_CULTIVATION_INTERVAL,
  AUTO_CULTIVATION_EXP,
  OFFLINE_CULTIVATION_EFFICIENCY,
  MAX_OFFLINE_CULTIVATION_TIME,
  // 修复: 导入常量替代硬编码
  MAX_CULTIVATION_LEVEL,
} from '@/constants/cultivation';
import { PRNG } from '@/utils/prng';

// ============================================
// 修炼服务
// ============================================

export const cultivationService = {
  /**
   * 开始修炼
   * @param data 当前修炼数据
   * @param _type 修炼类型
   * @returns 更新后的修炼数据
   */
  startCultivation(data: CultivationData, _type: CultivationType): CultivationData {
    const now = Date.now();
    return {
      ...data,
      lastCultivateTime: now,
    };
  },

  /**
   * 获得修炼经验
   * @param data 当前修炼数据
   * @param type 修炼类型
   * @param amount 经验数量
   * @returns 升级结果和更新后的修炼数据
   */
  gainCultivationExp(
    data: CultivationData,
    type: CultivationType,
    amount: number
  ): { result: LevelUpResult; data: CultivationData } {
    const progress = data.cultivations[type];
    let currentExp = progress.exp + amount;
    let currentLevel = progress.level;
    let leveledUp = false;
    let totalBonusGained = 0;

    // 检查升级
    // 修复: 使用常量 MAX_CULTIVATION_LEVEL 替代硬编码的 100
    while (currentExp >= progress.expToNext && currentLevel < MAX_CULTIVATION_LEVEL) {
      currentExp -= progress.expToNext;
      currentLevel++;
      leveledUp = true;
      totalBonusGained += getBonusPerLevel(currentLevel);

      // 更新下一级所需经验
      progress.expToNext = getExpToNextLevel(currentLevel);
    }

    const result: LevelUpResult = {
      leveledUp,
      oldLevel: progress.level,
      newLevel: currentLevel,
      bonusGained: totalBonusGained,
    };

    // 更新进度
    const newProgress: CultivationProgress = {
      level: currentLevel,
      exp: currentExp,
      expToNext: getExpToNextLevel(currentLevel),
      bonus: getTotalBonus(currentLevel),
    };

    // 计算总修炼等级
    const newCultivations = {
      ...data.cultivations,
      [type]: newProgress,
    };

    const totalCultivation = Object.values(newCultivations).reduce(
      (sum, p) => sum + p.level,
      0
    );

    const newData: CultivationData = {
      ...data,
      cultivations: newCultivations,
      totalCultivation,
      lastCultivateTime: Date.now(),
    };

    return { result, data: newData };
  },

  /**
   * 使用修炼丹药
   * @param data 当前修炼数据
   * @param itemId 丹药物品ID
   * @param type 修炼类型（如果丹药不是指定类型则忽略）
   * @returns 是否成功使用及更新后的数据
   */
  useCultivationPill(
    data: CultivationData,
    itemId: string,
    type: CultivationType
  ): { success: boolean; data: CultivationData; expGained: number } {
    const pill = getCultivationPill(itemId);
    if (!pill) {
      return { success: false, data, expGained: 0 };
    }

    // 如果丹药有指定类型，检查是否匹配
    if (pill.targetType && pill.targetType !== type) {
      return { success: false, data, expGained: 0 };
    }

    const { data: newData } = this.gainCultivationExp(data, type, pill.expBonus);
    return {
      success: true,
      data: newData,
      expGained: pill.expBonus,
    };
  },

  /**
   * 尝试境界突破
   * @param data 当前修炼数据
   * @param prng 随机数生成器
   * @returns 突破结果
   */
  attemptBreakthrough(
    data: CultivationData,
    prng: PRNG
  ): { result: BreakthroughResult; data: CultivationData } {
    const nextRealm = getNextRealm(data.realm);

    // 检查是否已达最高境界
    if (!nextRealm) {
      return {
        result: {
          success: false,
          fromRealm: data.realm,
          toRealm: data.realm,
          newRealmName: data.realmName,
          reason: '已达最高境界',
        },
        data,
      };
    }

    // 检查修炼等级是否满足要求
    const totalLevel = Object.values(data.cultivations).reduce(
      (sum, p) => sum + p.level,
      0
    );

    if (totalLevel < nextRealm.requiredTotalLevel) {
      return {
        result: {
          success: false,
          fromRealm: data.realm,
          toRealm: data.realm,
          newRealmName: data.realmName,
          reason: `需要总修炼等级达到 ${nextRealm.requiredTotalLevel} 级`,
        },
        data,
      };
    }

    // TODO: 检查突破物品
    // if (nextRealm.requiredItem && !hasItem(nextRealm.requiredItem)) {
    //   return {
    //     result: {
    //       success: false,
    //       fromRealm: data.realm,
    //       toRealm: data.realm,
    //       newRealmName: data.realmName,
    //       reason: '缺少突破物品',
    //     },
    //     data,
    //   };
    // }

    // 计算成功率
    const successRate = calculateBreakthroughSuccessRate(
      nextRealm.baseSuccessRate,
      totalLevel,
      nextRealm.requiredTotalLevel
    );

    // 进行突破判定
    const roll = prng.next();
    const success = roll < successRate;

    if (success) {
      // 突破成功
      const rewards: string[] = [];
      if (nextRealm.effect) {
        rewards.push(`获得效果: ${nextRealm.effect}`);
      }
      rewards.push(`属性加成倍率提升至 ${nextRealm.bonusMultiplier}倍`);

      const record = {
        timestamp: Date.now(),
        fromRealm: data.realm,
        toRealm: nextRealm.level,
        success: true,
      };

      const newData: CultivationData = {
        ...data,
        realm: nextRealm.level,
        realmName: nextRealm.name,
        breakthroughHistory: [...data.breakthroughHistory, record],
      };

      return {
        result: {
          success: true,
          fromRealm: data.realm,
          toRealm: nextRealm.level,
          newRealmName: nextRealm.name,
          rewards,
        },
        data: newData,
      };
    } else {
      // 突破失败
      const record = {
        timestamp: Date.now(),
        fromRealm: data.realm,
        toRealm: nextRealm.level,
        success: false,
      };

      // 扣除部分修炼经验
      let newCultivations = { ...data.cultivations };
      for (const type of Object.keys(newCultivations) as CultivationType[]) {
        const progress = newCultivations[type];
        const expLoss = Math.floor(progress.exp * BREAKTHROUGH_FAIL_EXP_PENALTY);
        newCultivations[type] = {
          ...progress,
          exp: Math.max(0, progress.exp - expLoss),
        };
      }

      const newData: CultivationData = {
        ...data,
        cultivations: newCultivations,
        breakthroughHistory: [...data.breakthroughHistory, record],
      };

      return {
        result: {
          success: false,
          fromRealm: data.realm,
          toRealm: nextRealm.level,
          newRealmName: nextRealm.name,
          reason: '突破失败，损失部分修炼经验',
        },
        data: newData,
      };
    }
  },

  /**
   * 获取修炼加成
   * @param data 修炼数据
   * @returns 各属性加成
   */
  getCultivationBonus(data: CultivationData): CultivationBonus {
    const realm = REALMS.find(r => r.level === data.realm);
    const multiplier = realm?.bonusMultiplier ?? 1.0;

    return {
      strength: data.cultivations.strength.bonus * multiplier,
      intelligence: data.cultivations.intelligence.bonus * multiplier,
      vitality: data.cultivations.vitality.bonus * multiplier,
      agility: data.cultivations.agility.bonus * multiplier,
      willpower: data.cultivations.willpower.bonus * multiplier,
      realmMultiplier: multiplier,
    };
  },

  /**
   * 获取境界加成倍率
   * @param realmLevel 境界等级
   * @returns 加成倍率
   */
  getRealmBonus(realmLevel: number): number {
    const realm = REALMS.find(r => r.level === realmLevel);
    return realm?.bonusMultiplier ?? 1.0;
  },

  /**
   * 计算离线修炼收益
   * @param data 修炼数据
   * @param offlineTime 离线时间（毫秒）
   * @param activeType 正在修炼的类型
   * @returns 获得的经验和更新后的数据
   */
  calculateOfflineCultivation(
    data: CultivationData,
    offlineTime: number,
    activeType: CultivationType
  ): { expGained: number; data: CultivationData } {
    // 限制最大离线时间
    const effectiveTime = Math.min(offlineTime, MAX_OFFLINE_CULTIVATION_TIME);

    // 计算离线修炼次数
    const cycles = Math.floor(effectiveTime / AUTO_CULTIVATION_INTERVAL);

    // 计算获得的经验（考虑离线效率）
    const expGained = Math.floor(cycles * AUTO_CULTIVATION_EXP * OFFLINE_CULTIVATION_EFFICIENCY);

    if (expGained > 0) {
      const { data: newData } = this.gainCultivationExp(data, activeType, expGained);
      return { expGained, data: newData };
    }

    return { expGained: 0, data };
  },

  /**
   * 检查是否可以突破
   * @param data 修炼数据
   * @returns 是否可以突破及原因
   */
  canBreakthrough(data: CultivationData): { canBreakthrough: boolean; reason?: string } {
    const nextRealm = getNextRealm(data.realm);

    if (!nextRealm) {
      return { canBreakthrough: false, reason: '已达最高境界' };
    }

    const totalLevel = Object.values(data.cultivations).reduce(
      (sum, p) => sum + p.level,
      0
    );

    if (totalLevel < nextRealm.requiredTotalLevel) {
      return {
        canBreakthrough: false,
        reason: `需要总修炼等级 ${nextRealm.requiredTotalLevel}（当前 ${totalLevel}）`,
      };
    }

    // TODO: 检查突破物品
    // if (nextRealm.requiredItem && !hasItem(nextRealm.requiredItem)) {
    //   return { canBreakthrough: false, reason: '缺少突破物品' };
    // }

    return { canBreakthrough: true };
  },

  /**
   * 获取修炼进度百分比
   * @param progress 修炼进度
   * @returns 百分比（0-100）
   */
  getProgressPercent(progress: CultivationProgress): number {
    return Math.min(100, (progress.exp / progress.expToNext) * 100);
  },

  /**
   * 获取总修炼等级
   * @param data 修炼数据
   * @returns 总等级
   */
  getTotalLevel(data: CultivationData): number {
    return Object.values(data.cultivations).reduce((sum, p) => sum + p.level, 0);
  },

  /**
   * 获取境界信息
   * @param data 修炼数据
   * @returns 境界信息
   */
  getRealmInfo(data: CultivationData): {
    current: typeof REALMS[0] | undefined;
    next: typeof REALMS[0] | undefined;
    progress: number;
  } {
    const current = REALMS.find(r => r.level === data.realm);
    const next = getNextRealm(data.realm);
    const totalLevel = this.getTotalLevel(data);

    let progress = 0;
    if (next) {
      progress = Math.min(
        100,
        (totalLevel / next.requiredTotalLevel) * 100
      );
    } else {
      progress = 100;
    }

    return { current, next, progress };
  },
};

export default cultivationService;
