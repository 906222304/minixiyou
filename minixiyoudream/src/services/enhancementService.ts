// 装备强化服务

import type { Equipment, CombatStats } from '@/types';
import type { PRNG } from '@/utils/prng';
import {
  getEnhancementLevelConfig,
  getMaxEnhanceLevel,
  calculateEnhancementGoldCost,
  calculateProtectionStoneCost,
  getStatBonus,
  calculateEnhancedStats,
  canEnhance as checkCanEnhance,
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
  ): EnhancementResult & { equipment?: Equipment } {
    const currentLevel = equipment.enhanceLevel;
    const targetLevel = currentLevel + 1;

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

    // 进行强化判定
    const roll = prng.next();
    const success = roll < config.successRate;

    if (success) {
      // 强化成功
      const newEquipment = this.updateEquipmentEnhanceLevel(equipment, targetLevel);
      return {
        success: true,
        newLevel: targetLevel,
        downgraded: false,
        cost: goldCost,
        equipment: newEquipment,
      };
    } else {
      // 强化失败
      let newLevel = currentLevel;

      // 检查是否需要降级
      if (config.failPenalty === 'downgrade' && !useProtection && currentLevel > 0) {
        newLevel = Math.max(0, currentLevel - 1);
      }

      const newEquipment = this.updateEquipmentEnhanceLevel(equipment, newLevel);
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
   */
  private updateEquipmentEnhanceLevel(equipment: Equipment, newLevel: number): Equipment {
    return {
      ...equipment,
      enhanceLevel: newLevel,
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
    return getMaxEnhanceLevel(quality as any) || 5;
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
}

// 导出单例
export const enhancementService = new EnhancementService();
