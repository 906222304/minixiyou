// 装备强化服务

import type { Equipment, CombatStats, Quality } from '@/types';
import type { PRNG } from '@/utils/prng';
import {
  getEnhancementLevelConfig,
  getMaxEnhanceLevel,
  calculateEnhancementGoldCost,
  calculateProtectionStoneCost,
  getStatBonus,
  calculateEnhancedStats,
  canEnhance as checkCanEnhance,
  calculateActualSuccessRate,
  hasPityForLevel,
  getPityThreshold,
  ENHANCEMENT_PITY,
  type EnhancementResult,
  type EnhancementPreview,
} from '@/constants/enhancement';

// ============================================
// 强化服务类
// ============================================

class EnhancementService {
  /**
   * 强化装备
   * @param equipment 要强化的装备
   * @param useProtection 是否使用保护道具
   * @param prng 随机数生成器
   * @param goldAvailable 可用金币
   * @param protectionStonesAvailable 可用保护石数量
   * @returns 强化结果
   */
  enhanceEquipment(
    equipment: Equipment,
    useProtection: boolean,
    prng: PRNG,
    goldAvailable: number,
    protectionStonesAvailable: number = 0
  ): EnhancementResult & { equipment?: Equipment; pityTriggered?: boolean } {
    const currentLevel = equipment.enhanceLevel;
    const targetLevel = currentLevel + 1;
    const currentFailCount = equipment.enhanceFailCount ?? 0;

    // 检查是否可以强化
    const checkResult = checkCanEnhance(
      currentLevel,
      equipment.quality,
      goldAvailable,
      protectionStonesAvailable,
      useProtection
    );

    if (!checkResult.canEnhance) {
      return {
        success: false,
        newLevel: currentLevel,
        downgraded: false,
        cost: 0,
      };
    }

    // 获取配置
    const config = getEnhancementLevelConfig(targetLevel);
    if (!config) {
      return {
        success: false,
        newLevel: currentLevel,
        downgraded: false,
        cost: 0,
      };
    }

    const goldCost = config.goldCost;

    // 检查保护石（如果使用）
    if (useProtection) {
      const protectionCost = calculateProtectionStoneCost(targetLevel);
      if (protectionStonesAvailable < protectionCost) {
        return {
          success: false,
          newLevel: currentLevel,
          downgraded: false,
          cost: 0,
        };
      }
    }

    // 计算考虑保底后的实际成功率
    const actualSuccessRate = calculateActualSuccessRate(targetLevel, currentFailCount);

    // 进行强化判定
    const roll = prng.next();
    const success = roll < actualSuccessRate;

    // 检查是否触发保底
    const pityTriggered = hasPityForLevel(targetLevel) && currentFailCount >= getPityThreshold(targetLevel);

    if (success) {
      // 强化成功 - 重置保底计数器
      const newEquipment = this.updateEquipmentEnhanceLevel(equipment, targetLevel, true);
      return {
        success: true,
        newLevel: targetLevel,
        downgraded: false,
        cost: goldCost,
        equipment: newEquipment,
        pityTriggered,
      };
    } else {
      // 强化失败
      let newLevel = currentLevel;
      let newFailCount = currentFailCount;

      // 检查是否需要降级
      if (config.failPenalty === 'downgrade' && !useProtection && currentLevel > 0) {
        newLevel = Math.max(0, currentLevel - 1);
        // 降级时重置保底计数器
        newFailCount = 0;
      } else {
        // 未降级时增加保底计数器（仅对有保底的等级）
        if (hasPityForLevel(targetLevel)) {
          newFailCount = currentFailCount + 1;
        }
      }

      const newEquipment = this.updateEquipmentEnhanceLevel(equipment, newLevel, false, newFailCount);
      return {
        success: false,
        newLevel: newLevel,
        downgraded: newLevel < currentLevel,
        cost: goldCost,
        equipment: newEquipment,
      };
    }
  }

  /**
   * 更新装备的强化等级
   * @param equipment 装备
   * @param newLevel 新的强化等级
   * @param resetFailCount 是否重置保底计数器
   * @param failCount 新的失败次数（可选）
   */
  private updateEquipmentEnhanceLevel(
    equipment: Equipment,
    newLevel: number,
    resetFailCount: boolean = true,
    failCount?: number
  ): Equipment {
    return {
      ...equipment,
      enhanceLevel: newLevel,
      enhanceFailCount: resetFailCount ? 0 : (failCount ?? equipment.enhanceFailCount ?? 0),
    };
  }

  /**
   * 获取强化消耗
   * @param currentLevel 当前强化等级
   * @returns 金币消耗
   */
  getEnhancementCost(currentLevel: number): number {
    return calculateEnhancementGoldCost(currentLevel);
  }

  /**
   * 计算装备的强化属性加成
   * @param equipment 装备
   * @returns 强化后的属性
   */
  calculateEnhanceBonus(equipment: Equipment): Partial<CombatStats> {
    return calculateEnhancedStats(equipment.baseStats, equipment.enhanceLevel);
  }

  /**
   * 获取总属性加成百分比
   * @param level 强化等级
   * @returns 属性加成百分比
   */
  getTotalStatBonus(level: number): number {
    return getStatBonus(level);
  }

  /**
   * 检查装备是否可以强化
   * @param equipment 装备
   * @param gold 可用金币
   * @param protectionStones 可用保护石
   * @returns 是否可以强化及原因
   */
  canEnhance(
    equipment: Equipment,
    gold: number,
    protectionStones: number = 0
  ): { canEnhance: boolean; reason?: string } {
    return checkCanEnhance(equipment.enhanceLevel, equipment.quality, gold, protectionStones);
  }

  /**
   * 获取强化预览信息
   * @param equipment 装备
   * @param gold 可用金币
   * @param protectionStones 可用保护石
   * @returns 强化预览
   */
  getEnhancementPreview(
    equipment: Equipment,
    gold: number,
    protectionStones: number = 0
  ): EnhancementPreview {
    const maxLevel = getMaxEnhanceLevel(equipment.quality);
    const currentLevel = equipment.enhanceLevel;
    const targetLevel = currentLevel + 1;
    const config = getEnhancementLevelConfig(targetLevel);

    const checkResult = this.canEnhance(equipment, gold, protectionStones);

    return {
      currentLevel,
      targetLevel,
      successRate: config?.successRate || 0,
      goldCost: config?.goldCost || 0,
      failPenalty: config?.failPenalty || 'none',
      canEnhance: checkResult.canEnhance,
      reason: checkResult.reason,
      maxLevel,
    };
  }

  /**
   * 计算保护石消耗
   * @param targetLevel 目标等级
   * @returns 保护石数量
   */
  getProtectionStoneCost(targetLevel: number): number {
    return calculateProtectionStoneCost(targetLevel);
  }

  /**
   * 获取品质最大强化等级
   * @param quality 装备品质
   * @returns 最大强化等级
   */
  getMaxEnhanceLevel(quality: string): number {
    // 修复: 使用正确的 Quality 类型断言替代 any
    return getMaxEnhanceLevel(quality as Quality) || 5;
  }

  /**
   * 计算装备的最终属性（基础 + 强化加成）
   * @param equipment 装备
   * @returns 最终属性
   */
  getFinalStats(equipment: Equipment): Partial<CombatStats> {
    return this.calculateEnhanceBonus(equipment);
  }

  /**
   * 获取强化等级对应的属性加成显示
   * @param level 强化等级
   * @returns 属性加成字符串
   */
  getEnhancementBonusDisplay(level: number): string {
    if (level <= 0) return '无加成';
    const bonus = this.getTotalStatBonus(level);
    return `+${(bonus * 100).toFixed(0)}%`;
  }

  /**
   * 模拟强化（用于测试或预览）
   * @param _currentLevel 当前等级（未使用）
   * @param targetLevel 目标等级
   * @param prng 随机数生成器
   * @returns 是否成功
   */
  simulateEnhancement(_currentLevel: number, targetLevel: number, prng: PRNG): boolean {
    const config = getEnhancementLevelConfig(targetLevel);
    if (!config) return false;

    const roll = prng.next();
    return roll < config.successRate;
  }

  /**
   * 获取装备的保底进度信息
   * @param equipment 装备
   * @returns 保底进度信息
   */
  getPityProgress(equipment: Equipment): {
    hasPity: boolean;
    currentFails: number;
    threshold: number;
    bonusRate: number;
    actualSuccessRate: number;
    isGuaranteed: boolean;
    targetLevel: number;
  } {
    const targetLevel = equipment.enhanceLevel + 1;
    const currentFails = equipment.enhanceFailCount ?? 0;
    const hasPity = hasPityForLevel(targetLevel);
    const threshold = getPityThreshold(targetLevel);
    const bonusRate = currentFails * ENHANCEMENT_PITY.pityBonusPerFail;
    const actualSuccessRate = calculateActualSuccessRate(targetLevel, currentFails);
    const isGuaranteed = hasPity && currentFails >= threshold;

    return {
      hasPity,
      currentFails,
      threshold,
      bonusRate,
      actualSuccessRate,
      isGuaranteed,
      targetLevel,
    };
  }
}

// 导出单例
export const enhancementService = new EnhancementService();
