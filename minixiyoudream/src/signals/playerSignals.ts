// 玩家状态管理

import { signal, computed } from '@preact/signals-react';
import type { Player, CreatePlayerOptions, CharacterTrait, FullStats, AllocatedPoints, BaseStats, RaceType } from '@/types';
import { generateUUID } from '@/types';
import { getRace } from '@/constants/races';
import { getFaction } from '@/constants/factions';
import { calculateCombatStats, calculateBaseStats } from '@/constants/formulas';
import { getSkill, getFactionSkills } from '@/constants/skills';
import type { LearnedSkill } from '@/types';
import { applyTraitBonuses, applyTraitElementResistances } from '@/services/traitService';

/** 每级获得的属性点数 */
const POINTS_PER_LEVEL = 5;

/** 初始化空属性点分配 */
function createEmptyAllocatedPoints(): AllocatedPoints {
  return {
    strength: 0,
    intelligence: 0,
    vitality: 0,
    agility: 0,
    willpower: 0,
  };
}

/** 玩家状态 */
export const player = signal<Player | null>(null);

/** 玩家是否已创建 */
export const isPlayerCreated = computed(() => player.value !== null);

/** 玩家等级 */
export const playerLevel = computed(() => player.value?.level ?? 1);

/** 玩家当前HP/MP */
export const playerHp = computed(() => player.value?.hp ?? 0);
export const playerMp = computed(() => player.value?.mp ?? 0);

/** 玩家最大HP/MP */
export const playerMaxHp = computed(() => player.value?.maxHp ?? 100);
export const playerMaxMp = computed(() => player.value?.maxMp ?? 50);

/** 玩家HP百分比 */
export const playerHpPercent = computed(() =>
  player.value ? (player.value.hp / player.value.maxHp) * 100 : 100
);

/** 玩家MP百分比 */
export const playerMpPercent = computed(() =>
  player.value ? (player.value.mp / player.value.maxMp) * 100 : 100
);

/** 玩家金币 */
export const playerGold = computed(() => player.value?.gold ?? 0);

/** 玩家经验值 */
export const playerExp = computed(() => player.value?.exp ?? 0);

/** 玩家当前位置 */
export const playerPosition = computed(() => player.value?.currentMapId ?? 'map_donghai_village');

/** 创建玩家 */
export function createPlayer(options: CreatePlayerOptions): Player {
  const race = getRace(options.race);
  const faction = getFaction(options.factionId);

  if (!race || !faction) {
    throw new Error('Invalid race or faction');
  }

  // 使用种族的初始基础属性
  const raceBaseStats = race.baseStats;

  // 基础属性 - 使用种族初始值
  const baseStats: FullStats = {
    strength: raceBaseStats.strength,
    intelligence: raceBaseStats.intelligence,
    vitality: raceBaseStats.vitality,
    agility: raceBaseStats.agility,
    willpower: raceBaseStats.willpower,
    physicalAttack: 20,
    physicalDefense: 10,
    magicAttack: 20,
    magicDefense: 10,
    maxHp: 100,
    maxMp: 50,
    speed: 10,
    critRate: 0.05,
    critDamage: 0.5,
    hitRate: 0.9,
    dodgeRate: 0.02,
    antiCritRate: 0,
    penetration: 0,
    lifeSteal: 0,
    reflect: 0,
    healBonus: 0,
    cooldownReduction: 0,
  };

  // 计算战斗属性（内部会应用种族加成）
  const combatStats = calculateCombatStats(
    {
      strength: baseStats.strength,
      intelligence: baseStats.intelligence,
      vitality: baseStats.vitality,
      agility: baseStats.agility,
      willpower: baseStats.willpower,
    },
    options.race,
    1
  );

  // 处理特性
  const traits: CharacterTrait[] = options.traitIds.map(traitId => ({
    traitId,
    acquiredAt: Date.now(),
    source: 'creation' as const,
  }));

  // 合并基础属性和战斗属性
  let finalStats: FullStats = {
    ...baseStats,
    ...combatStats,
  };

  // 应用特性加成到属性
  if (traits.length > 0) {
    finalStats = applyTraitBonuses(finalStats, traits);
  }

  // 计算元素抗性（含特性加成）
  const baseElementResistances = {
    metal: 0,
    wood: 0,
    water: 0,
    fire: 0,
    earth: 0,
  };
  const elementResistances = traits.length > 0
    ? applyTraitElementResistances(baseElementResistances, traits)
    : baseElementResistances;

  // 自动学习门派基础技能
  const initialSkills: LearnedSkill[] = [];
  const factionSkills = getFactionSkills(options.factionId);
  // 学习门派的1级基础技能（levelRequirement为1的技能）
  for (const skill of factionSkills) {
    if (skill.levelRequirement === 1) {
      initialSkills.push({
        skillId: skill.id,
        level: 1,
        cooldownRemaining: 0,
      });
    }
  }

  // 创建玩家
  const newPlayer: Player = {
    id: generateUUID(),
    name: options.name,
    avatar: '🧑',
    race: options.race,
    factionId: options.factionId,
    level: 1,
    exp: 0,
    // 属性点系统 - 初始有5点可分配
    attributePoints: POINTS_PER_LEVEL,
    allocatedPoints: createEmptyAllocatedPoints(),
    baseStats: finalStats,
    equipmentStats: {},
    bondStats: {},
    finalStats: finalStats,
    elementResistances,
    equipment: {
      weapon: null,
      helmet: null,
      armor: null,
      boots: null,
      belt: null,
      necklace: null,
      charm: null,
      ring1: null,
      ring2: null,
    },
    skills: initialSkills,
    skillPoints: 1, // 初始给1点技能点
    traits,
    hp: finalStats.maxHp,
    maxHp: finalStats.maxHp,
    mp: finalStats.maxMp,
    maxMp: finalStats.maxMp,
    gold: 100,
    activePetId: null,
    pets: [],
    captureSkillLevel: 1, // 默认捕捉技能等级为1
    currentMapId: 'map_donghai_village', // 初始地图为新手村（东海村）
    position: { x: 5, y: 5 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    playTime: 0,
  };

  player.value = newPlayer;
  return newPlayer;
}

/** 更新玩家HP */
export function updatePlayerHp(delta: number): void {
  if (!player.value) return;

  const newHp = Math.max(0, Math.min(player.value.maxHp, player.value.hp + delta));
  player.value = {
    ...player.value,
    hp: newHp,
    updatedAt: Date.now(),
  };
}

/** 更新玩家MP */
export function updatePlayerMp(delta: number): void {
  if (!player.value) return;

  const newMp = Math.max(0, Math.min(player.value.maxMp, player.value.mp + delta));
  player.value = {
    ...player.value,
    mp: newMp,
    updatedAt: Date.now(),
  };
}

/** 更新玩家金币 */
export function updatePlayerGold(delta: number): boolean {
  if (!player.value) return false;

  const newGold = player.value.gold + delta;
  if (newGold < 0) return false;

  player.value = {
    ...player.value,
    gold: newGold,
    updatedAt: Date.now(),
  };
  return true;
}

/** 获取捕捉技能等级 */
export function getCaptureSkillLevel(): number {
  return player.value?.captureSkillLevel ?? 1;
}

/** 升级捕捉技能 */
export function upgradeCaptureSkill(): boolean {
  if (!player.value) return false;

  const maxLevel = 10;
  if (player.value.captureSkillLevel >= maxLevel) return false;

  player.value = {
    ...player.value,
    captureSkillLevel: player.value.captureSkillLevel + 1,
    updatedAt: Date.now(),
  };
  return true;
}

/** 计算捕捉成功率（基于技能等级） */
export function calculateCaptureRate(skillLevel: number, enemyType: string): number {
  // 只能捕捉普通怪物
  if (enemyType !== 'normal') return 0;

  // 基础捕捉率 20% + 每级增加 5%
  const baseRate = 0.20;
  const bonusPerLevel = 0.05;
  return Math.min(0.80, baseRate + (skillLevel - 1) * bonusPerLevel);
}

/** 更新玩家位置 */
export function updatePlayerPosition(mapId: string, x?: number, y?: number): void {
  if (!player.value) return;

  const previousMapId = player.value.currentMapId;

  player.value = {
    ...player.value,
    currentMapId: mapId,
    position: {
      x: x ?? player.value.position.x,
      y: y ?? player.value.position.y,
    },
    updatedAt: Date.now(),
  };

  // 如果地图发生变化，触发地图访问任务事件
  if (previousMapId !== mapId) {
    // 异步触发任务事件，不阻塞当前位置更新
    import('./questSignals').then(({ updateMapVisitEvent }) => {
      updateMapVisitEvent(player.value!.id, mapId);
    });
  }
}

/** 计算包含已分配属性点的基础属性 */
function calculateStatsWithAllocatedPoints(
  baseValues: BaseStats,
  allocatedPoints: AllocatedPoints,
  level: number,
  growthRate: BaseStats
): BaseStats {
  // 基础成长
  const baseGrowth = calculateBaseStats(baseValues, level, growthRate);

  // 加上已分配的属性点
  return {
    strength: baseGrowth.strength + allocatedPoints.strength,
    intelligence: baseGrowth.intelligence + allocatedPoints.intelligence,
    vitality: baseGrowth.vitality + allocatedPoints.vitality,
    agility: baseGrowth.agility + allocatedPoints.agility,
    willpower: baseGrowth.willpower + allocatedPoints.willpower,
  };
}

/** 重新计算玩家最终属性 */
function recalculatePlayerStats(
  raceType: RaceType,
  allocatedPoints: AllocatedPoints,
  level: number,
  traits: CharacterTrait[] = []
): FullStats {
  const race = getRace(raceType);
  if (!race) {
    throw new Error('Invalid race type');
  }

  // 计算每级成长值（基于种族成长率）
  const growthRate: BaseStats = {
    strength: 2 * race.statGrowth.strength,
    intelligence: 2 * race.statGrowth.intelligence,
    vitality: 2 * race.statGrowth.vitality,
    agility: 2 * race.statGrowth.agility,
    willpower: 2 * race.statGrowth.willpower,
  };

  // 计算包含属性点的基础属性（使用种族初始属性）
  const newBaseStats = calculateStatsWithAllocatedPoints(
    race.baseStats,
    allocatedPoints,
    level,
    growthRate
  );

  // 计算战斗属性
  const newCombatStats = calculateCombatStats(newBaseStats, raceType, level);

  // 合并基础属性和战斗属性
  let finalStats: FullStats = {
    ...newBaseStats,
    ...newCombatStats,
  };

  // 应用特性加成
  if (traits.length > 0) {
    finalStats = applyTraitBonuses(finalStats, traits);
  }

  return finalStats;
}

/** 增加经验值 */
export function addPlayerExp(exp: number): boolean {
  if (!player.value) return false;

  let currentExp = player.value.exp + exp;
  let currentLevel = player.value.level;
  let leveledUp = false;
  let levelsGained = 0;

  // 检查升级（简化版）
  while (currentExp >= 100 * currentLevel && currentLevel < 100) {
    currentExp -= 100 * currentLevel;
    currentLevel++;
    leveledUp = true;
    levelsGained++;
  }

  if (leveledUp) {
    // 获得新的属性点（每级5点）
    const newAttributePoints = player.value.attributePoints + levelsGained * POINTS_PER_LEVEL;

    // 重新计算属性（包含已分配的属性点和特性加成）
    const finalStats = recalculatePlayerStats(
      player.value.race,
      player.value.allocatedPoints,
      currentLevel,
      player.value.traits
    );

    player.value = {
      ...player.value,
      level: currentLevel,
      exp: currentExp,
      attributePoints: newAttributePoints,
      baseStats: finalStats,
      finalStats: finalStats,
      maxHp: finalStats.maxHp,
      maxMp: finalStats.maxMp,
      hp: finalStats.maxHp,
      mp: finalStats.maxMp,
      skillPoints: player.value.skillPoints + levelsGained,
      updatedAt: Date.now(),
    };
  } else {
    player.value = {
      ...player.value,
      exp: currentExp,
      updatedAt: Date.now(),
    };
  }

  return leveledUp;
}

/** 分配属性点 */
export function allocateAttributePoint(stat: keyof BaseStats): boolean {
  if (!player.value) return false;
  if (player.value.attributePoints <= 0) return false;

  // 增加对应属性点
  const newAllocatedPoints = {
    ...player.value.allocatedPoints,
    [stat]: player.value.allocatedPoints[stat] + 1,
  };

  // 重新计算最终属性（含特性加成）
  const finalStats = recalculatePlayerStats(
    player.value.race,
    newAllocatedPoints,
    player.value.level,
    player.value.traits
  );

  player.value = {
    ...player.value,
    attributePoints: player.value.attributePoints - 1,
    allocatedPoints: newAllocatedPoints,
    baseStats: finalStats,
    finalStats: finalStats,
    maxHp: finalStats.maxHp,
    maxMp: finalStats.maxMp,
    // 如果当前HP/MP低于新的最大值，则补满
    hp: Math.max(player.value.hp, finalStats.maxHp),
    mp: Math.max(player.value.mp, finalStats.maxMp),
    updatedAt: Date.now(),
  };

  return true;
}

/** 撤销属性点分配 */
export function deallocateAttributePoint(stat: keyof BaseStats): boolean {
  if (!player.value) return false;
  if (player.value.allocatedPoints[stat] <= 0) return false;

  // 减少对应属性点
  const newAllocatedPoints = {
    ...player.value.allocatedPoints,
    [stat]: player.value.allocatedPoints[stat] - 1,
  };

  // 重新计算最终属性（含特性加成）
  const finalStats = recalculatePlayerStats(
    player.value.race,
    newAllocatedPoints,
    player.value.level,
    player.value.traits
  );

  player.value = {
    ...player.value,
    attributePoints: player.value.attributePoints + 1,
    allocatedPoints: newAllocatedPoints,
    baseStats: finalStats,
    finalStats: finalStats,
    maxHp: finalStats.maxHp,
    maxMp: finalStats.maxMp,
    // 如果当前HP/MP超过新的最大值，则调整为最大值
    hp: Math.min(player.value.hp, finalStats.maxHp),
    mp: Math.min(player.value.mp, finalStats.maxMp),
    updatedAt: Date.now(),
  };

  return true;
}

/** 重置所有属性点（需要消耗金币） */
export function resetAttributePoints(goldCost: number): boolean {
  if (!player.value) return false;
  if (player.value.gold < goldCost) return false;

  // 计算总已分配点数
  const totalAllocated = Object.values(player.value.allocatedPoints).reduce((sum, v) => sum + v, 0);

  // 重新计算最终属性（不含分配的点数，但含特性加成）
  const finalStats = recalculatePlayerStats(
    player.value.race,
    createEmptyAllocatedPoints(),
    player.value.level,
    player.value.traits
  );

  player.value = {
    ...player.value,
    gold: player.value.gold - goldCost,
    attributePoints: player.value.attributePoints + totalAllocated,
    allocatedPoints: createEmptyAllocatedPoints(),
    baseStats: finalStats,
    finalStats: finalStats,
    maxHp: finalStats.maxHp,
    maxMp: finalStats.maxMp,
    hp: Math.min(player.value.hp, finalStats.maxHp),
    mp: Math.min(player.value.mp, finalStats.maxMp),
    updatedAt: Date.now(),
  };

  return true;
}

/** 计算属性点重置费用 */
export function calculateResetCost(): number {
  if (!player.value) return 0;
  // 基础费用100金币，每级增加50金币
  return 100 + player.value.level * 50;
}

/** 获取当前可分配属性点数 */
export const playerAttributePoints = computed(() => player.value?.attributePoints ?? 0);

/** 获取已分配属性点 */
export const playerAllocatedPoints = computed(() => player.value?.allocatedPoints ?? createEmptyAllocatedPoints());

// ============================================
// 技能学习系统
// ============================================

/** 学习技能 */
export function learnSkill(skillId: string): { success: boolean; message: string } {
  if (!player.value) {
    return { success: false, message: '玩家不存在' };
  }

  // 检查技能是否存在
  const skill = getSkill(skillId);
  if (!skill) {
    return { success: false, message: '技能不存在' };
  }

  // 检查是否已学习该技能
  if (player.value.skills.some(s => s.skillId === skillId)) {
    return { success: false, message: '已经学习了该技能' };
  }

  // 检查等级要求
  if (player.value.level < skill.levelRequirement) {
    return { success: false, message: `需要等级 ${skill.levelRequirement}` };
  }

  // 检查门派限制
  if (skill.factionId && skill.factionId !== player.value.factionId) {
    return { success: false, message: '不是本门派技能' };
  }

  // 检查技能点
  if (player.value.skillPoints <= 0) {
    return { success: false, message: '技能点不足' };
  }

  // 学习技能
  const newSkill: LearnedSkill = {
    skillId,
    level: 1,
    cooldownRemaining: 0,
  };

  player.value = {
    ...player.value,
    skills: [...player.value.skills, newSkill],
    skillPoints: player.value.skillPoints - 1,
    updatedAt: Date.now(),
  };

  return { success: true, message: `成功学习「${skill.name}」` };
}

/** 升级技能 */
export function upgradeSkill(skillId: string): { success: boolean; message: string } {
  if (!player.value) {
    return { success: false, message: '玩家不存在' };
  }

  // 检查是否已学习该技能
  const learnedSkill = player.value.skills.find(s => s.skillId === skillId);
  if (!learnedSkill) {
    return { success: false, message: '未学习该技能' };
  }

  // 检查技能点
  if (player.value.skillPoints <= 0) {
    return { success: false, message: '技能点不足' };
  }

  // 检查技能等级上限
  if (learnedSkill.level >= 10) {
    return { success: false, message: '技能已达到最高等级' };
  }

  // 升级技能
  const updatedSkills = player.value.skills.map(s =>
    s.skillId === skillId ? { ...s, level: s.level + 1 } : s
  );

  player.value = {
    ...player.value,
    skills: updatedSkills,
    skillPoints: player.value.skillPoints - 1,
    updatedAt: Date.now(),
  };

  const skill = getSkill(skillId);
  return { success: true, message: `「${skill?.name}」升级到 ${learnedSkill.level + 1} 级` };
}

/** 获取可学习的技能列表 */
export function getAvailableSkillsToLearn(): { id: string; name: string; levelRequirement: number; canLearn: boolean; reason: string }[] {
  if (!player.value) return [];

  const factionSkills = getFactionSkills(player.value.factionId);
  const commonSkills = Object.values(getSkill('skill_attack') ? [getSkill('skill_attack')!] : []);

  // 合并门派技能和通用技能（排除已学习的）
  const allSkills = [...factionSkills, ...commonSkills];
  const learnedIds = new Set(player.value.skills.map(s => s.skillId));

  return allSkills
    .filter(skill => !learnedIds.has(skill.id))
    .map(skill => {
      let canLearn = true;
      let reason = '';

      if (player.value!.level < skill.levelRequirement) {
        canLearn = false;
        reason = `需要等级 ${skill.levelRequirement}`;
      } else if (player.value!.skillPoints <= 0) {
        canLearn = false;
        reason = '技能点不足';
      }

      return {
        id: skill.id,
        name: skill.name,
        levelRequirement: skill.levelRequirement,
        canLearn,
        reason,
      };
    });
}

/** 获取当前技能点数 */
export const playerSkillPoints = computed(() => player.value?.skillPoints ?? 0);

/** 获取已学习技能列表（带详情） */
export const playerLearnedSkills = computed(() => {
  if (!player.value) return [];
  return player.value.skills.map(ls => ({
    ...ls,
    skill: getSkill(ls.skillId),
  }));
});

/** 清除玩家数据（退出游戏时使用） */
export function clearPlayer(): void {
  player.value = null;
}
