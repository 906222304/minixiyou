// 基础技能服务 - 计算属性加成和检查技能解锁

import type { LearnedBaseSkill, BaseSkillBonus, BaseSkill, BaseSkillUnlock, FullStats } from '@/types';
import { getBaseSkillsByFaction, getBaseSkill, ALL_BASE_SKILLS } from '@/constants/baseSkills';

/**
 * 计算角色的基础技能属性加成
 */
export function calculateBaseSkillBonus(learnedBaseSkills: LearnedBaseSkill[]): BaseSkillBonus {
  const bonus: BaseSkillBonus = {
    hitRate: 0,
    damage: 0,
    magicPower: 0,
    defense: 0,
    dodge: 0,
    speed: 0,
    hp: 0,
    mp: 0,
  };

  for (const learned of learnedBaseSkills) {
    const baseSkill = getBaseSkill(learned.skillId);
    if (!baseSkill || baseSkill.bonusType === 'none') continue;

    const bonusValue = baseSkill.bonusPerLevel * learned.level;

    switch (baseSkill.bonusType) {
      case 'hitRate':
        bonus.hitRate += bonusValue;
        break;
      case 'damage':
        bonus.damage += bonusValue;
        break;
      case 'magicPower':
        bonus.magicPower += bonusValue;
        break;
      case 'defense':
        bonus.defense += bonusValue;
        break;
      case 'dodge':
        bonus.dodge += bonusValue;
        break;
      case 'speed':
        bonus.speed += bonusValue;
        break;
      case 'hp':
        bonus.hp += bonusValue;
        break;
      case 'mp':
        bonus.mp += bonusValue;
        break;
    }
  }

  return bonus;
}

/**
 * 应用基础技能属性加成到角色属性
 */
export function applyBaseSkillBonus(
  stats: FullStats,
  bonus: BaseSkillBonus,
): FullStats {
  return {
    ...stats,
    // 命中加成
    hitRate: Math.min(1, stats.hitRate + bonus.hitRate * 0.01), // 每点命中加0.01命中率
    // 物理攻击加成
    physicalAttack: stats.physicalAttack + bonus.damage,
    // 法术攻击加成
    magicAttack: stats.magicAttack + bonus.magicPower,
    // 物理防御加成
    physicalDefense: stats.physicalDefense + bonus.defense,
    // 法术防御加成
    magicDefense: stats.magicDefense + bonus.defense,
    // 躲避加成
    dodgeRate: Math.min(0.5, stats.dodgeRate + bonus.dodge * 0.005), // 每点躲避加0.005躲避率
    // 速度加成
    speed: stats.speed + bonus.speed,
    // HP上限加成
    maxHp: stats.maxHp + bonus.hp,
    // MP上限加成
    maxMp: stats.maxMp + bonus.mp,
  };
}

/**
 * 检查主动技能解锁条件
 * @returns 如果可以解锁返回 null，否则返回原因
 */
export function checkSkillUnlockCondition(
  skillId: string,
  learnedBaseSkills: LearnedBaseSkill[],
  isAscended: boolean = false,
): { canUnlock: boolean; reason: string; baseSkillId?: string; requiredLevel?: number } {
  // 查找该技能对应的基础技能要求
  const requirement = findSkillRequirement(skillId);

  if (!requirement) {
    // 没有基础技能要求，可以直接学习
    return { canUnlock: true, reason: '' };
  }

  const { baseSkill, unlock } = requirement;

  // 检查是否需要飞升
  if (unlock.isAscension && !isAscended) {
    return {
      canUnlock: false,
      reason: '需要飞升后才能学习',
      baseSkillId: baseSkill.id,
      requiredLevel: unlock.requiredLevel,
    };
  }

  // 检查基础技能是否已学习
  const learnedSkill = learnedBaseSkills.find(s => s.skillId === baseSkill.id);
  if (!learnedSkill) {
    return {
      canUnlock: false,
      reason: `需要先学习「${baseSkill.name}」`,
      baseSkillId: baseSkill.id,
      requiredLevel: unlock.requiredLevel,
    };
  }

  // 检查基础技能等级
  if (learnedSkill.level < unlock.requiredLevel) {
    return {
      canUnlock: false,
      reason: `需要「${baseSkill.name}」达到 ${unlock.requiredLevel} 级（当前 ${learnedSkill.level} 级）`,
      baseSkillId: baseSkill.id,
      requiredLevel: unlock.requiredLevel,
    };
  }

  return { canUnlock: true, reason: '' };
}

/**
 * 查找主动技能对应的基础技能要求
 */
export function findSkillRequirement(skillId: string): { baseSkill: BaseSkill; unlock: BaseSkillUnlock } | null {
  for (const baseSkill of ALL_BASE_SKILLS) {
    for (const unlock of baseSkill.unlockSkills) {
      if (unlock.skillId === skillId) {
        return { baseSkill, unlock };
      }
    }
  }
  return null;
}

/**
 * 获取角色可解锁的主动技能列表
 */
export function getUnlockableSkills(
  factionId: string,
  learnedBaseSkills: LearnedBaseSkill[],
  learnedSkillIds: string[],
  isAscended: boolean = false,
): BaseSkillUnlock[] {
  const factionBaseSkills = getBaseSkillsByFaction(factionId);
  const unlockableSkills: BaseSkillUnlock[] = [];

  for (const baseSkill of factionBaseSkills) {
    for (const unlock of baseSkill.unlockSkills) {
      // 跳过已学习的技能
      if (learnedSkillIds.includes(unlock.skillId)) continue;

      // 检查解锁条件
      const result = checkSkillUnlockCondition(
        unlock.skillId,
        learnedBaseSkills,
        isAscended,
      );

      if (result.canUnlock) {
        unlockableSkills.push(unlock);
      }
    }
  }

  return unlockableSkills;
}

/**
 * 获取基础技能升级所需经验
 * 公式：基础经验 * 等级^1.5
 */
export function getBaseSkillUpgradeExp(currentLevel: number): number {
  const baseExp = 100;
  return Math.floor(baseExp * Math.pow(currentLevel, 1.5));
}

/**
 * 获取基础技能升级所需金币
 * 公式：基础金币 * 等级^1.2
 */
export function getBaseSkillUpgradeGold(currentLevel: number): number {
  const baseGold = 50;
  return Math.floor(baseGold * Math.pow(currentLevel, 1.2));
}

/**
 * 初始化角色门派基础技能
 * 创建角色时自动获得所有门派基础技能（1级）
 */
export function initializeFactionBaseSkills(factionId: string): LearnedBaseSkill[] {
  const factionBaseSkills = getBaseSkillsByFaction(factionId);
  return factionBaseSkills.map(skill => ({
    skillId: skill.id,
    level: 1,
  }));
}

/**
 * 获取基础技能详情（包含已学习等级）
 */
export function getBaseSkillDetails(
  factionId: string,
  learnedBaseSkills: LearnedBaseSkill[],
): Array<BaseSkill & { learnedLevel: number; canUpgrade: boolean }> {
  const factionBaseSkills = getBaseSkillsByFaction(factionId);

  return factionBaseSkills.map(skill => {
    const learned = learnedBaseSkills.find(s => s.skillId === skill.id);
    const learnedLevel = learned?.level ?? 0;

    return {
      ...skill,
      learnedLevel,
      canUpgrade: learnedLevel > 0 && learnedLevel < skill.maxLevel,
    };
  });
}

/**
 * 升级基础技能
 */
export function upgradeBaseSkill(
  skillId: string,
  learnedBaseSkills: LearnedBaseSkill[],
  currentExp: number,
  currentGold: number,
): { success: boolean; message: string; newSkills?: LearnedBaseSkill[]; expCost?: number; goldCost?: number } {
  const baseSkill = getBaseSkill(skillId);
  if (!baseSkill) {
    return { success: false, message: '技能不存在' };
  }

  const learnedIndex = learnedBaseSkills.findIndex(s => s.skillId === skillId);
  if (learnedIndex === -1) {
    return { success: false, message: '未学习该技能' };
  }

  const currentLevel = learnedBaseSkills[learnedIndex].level;
  if (currentLevel >= baseSkill.maxLevel) {
    return { success: false, message: '已达最高等级' };
  }

  const expCost = getBaseSkillUpgradeExp(currentLevel);
  const goldCost = getBaseSkillUpgradeGold(currentLevel);

  if (currentExp < expCost) {
    return { success: false, message: `经验不足，需要 ${expCost} 经验`, expCost, goldCost };
  }

  if (currentGold < goldCost) {
    return { success: false, message: `金币不足，需要 ${goldCost} 金币`, expCost, goldCost };
  }

  // 升级技能
  const newSkills = [...learnedBaseSkills];
  newSkills[learnedIndex] = {
    ...newSkills[learnedIndex],
    level: currentLevel + 1,
  };

  return {
    success: true,
    message: `「${baseSkill.name}」升级到 ${currentLevel + 1} 级`,
    newSkills,
    expCost,
    goldCost,
  };
}

/**
 * 获取基础技能提供的总属性加成描述
 */
export function getBaseSkillBonusDescription(bonus: BaseSkillBonus): string[] {
  const descriptions: string[] = [];

  if (bonus.hitRate > 0) {
    descriptions.push(`命中 +${(bonus.hitRate * 0.01).toFixed(1)}%`);
  }
  if (bonus.damage > 0) {
    descriptions.push(`伤害力 +${bonus.damage}`);
  }
  if (bonus.magicPower > 0) {
    descriptions.push(`灵力 +${bonus.magicPower}`);
  }
  if (bonus.defense > 0) {
    descriptions.push(`防御力 +${bonus.defense}`);
  }
  if (bonus.dodge > 0) {
    descriptions.push(`躲避力 +${bonus.dodge}`);
  }
  if (bonus.speed > 0) {
    descriptions.push(`速度 +${bonus.speed}`);
  }
  if (bonus.hp > 0) {
    descriptions.push(`气血上限 +${bonus.hp}`);
  }
  if (bonus.mp > 0) {
    descriptions.push(`魔法上限 +${bonus.mp}`);
  }

  return descriptions;
}
