// 玩家状态管理

import { signal, computed } from '@preact/signals-react';
import type { Player, CreatePlayerOptions, CharacterTrait, FullStats, AllocatedPoints, BaseStats, RaceType } from '@/types';
import { generateUUID } from '@/types';
import { getRace } from '@/constants/races';
import { getFaction } from '@/constants/factions';
import { calculateCombatStats, calculateBaseStats } from '@/constants/formulas';

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
export const playerPosition = computed(() => player.value?.currentMapId ?? 'map_changan');

/** 创建玩家 */
export function createPlayer(options: CreatePlayerOptions): Player {
  const race = getRace(options.race);
  const faction = getFaction(options.factionId);

  if (!race || !faction) {
    throw new Error('Invalid race or faction');
  }

  // 基础属性
  const baseStats: FullStats = {
    strength: 10,
    intelligence: 10,
    vitality: 10,
    agility: 10,
    willpower: 10,
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
  };

  // 应用种族加成
  for (const [stat, bonus] of Object.entries(race.statBonus)) {
    if (stat in baseStats && typeof bonus === 'number') {
      (baseStats as unknown as Record<string, number>)[stat] = Math.floor(
        (baseStats as unknown as Record<string, number>)[stat] * bonus
      );
    }
  }

  // 计算战斗属性
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

  // 合并属性
  const finalStats: FullStats = {
    ...baseStats,
    ...combatStats,
  };

  // 处理特性
  const traits: CharacterTrait[] = options.traitIds.map(traitId => ({
    traitId,
    acquiredAt: Date.now(),
    source: 'creation' as const,
  }));

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
    elementResistances: {
      fire: 0,
      ice: 0,
      thunder: 0,
    },
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
    skills: [],
    skillPoints: 0,
    traits,
    hp: finalStats.maxHp,
    maxHp: finalStats.maxHp,
    mp: finalStats.maxMp,
    maxMp: finalStats.maxMp,
    gold: 100,
    activePetId: null,
    pets: [],
    currentMapId: 'map_changan',
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

/** 更新玩家位置 */
export function updatePlayerPosition(mapId: string, x?: number, y?: number): void {
  if (!player.value) return;

  player.value = {
    ...player.value,
    currentMapId: mapId,
    position: {
      x: x ?? player.value.position.x,
      y: y ?? player.value.position.y,
    },
    updatedAt: Date.now(),
  };
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
  baseValues: BaseStats,
  allocatedPoints: AllocatedPoints,
  level: number,
  race: RaceType
): FullStats {
  // 计算包含属性点的基础属性
  const newBaseStats = calculateStatsWithAllocatedPoints(
    baseValues,
    allocatedPoints,
    level,
    {
      strength: 2,
      intelligence: 2,
      vitality: 2,
      agility: 2,
      willpower: 2,
    }
  );

  // 计算战斗属性
  const newCombatStats = calculateCombatStats(newBaseStats, race, level);

  // 合并属性
  return {
    ...newBaseStats,
    ...newCombatStats,
  };
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

    // 重新计算属性（包含已分配的属性点）
    const finalStats = recalculatePlayerStats(
      {
        strength: 10,
        intelligence: 10,
        vitality: 10,
        agility: 10,
        willpower: 10,
      },
      player.value.allocatedPoints,
      currentLevel,
      player.value.race
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

  // 重新计算最终属性
  const finalStats = recalculatePlayerStats(
    {
      strength: 10,
      intelligence: 10,
      vitality: 10,
      agility: 10,
      willpower: 10,
    },
    newAllocatedPoints,
    player.value.level,
    player.value.race
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

  // 重新计算最终属性
  const finalStats = recalculatePlayerStats(
    {
      strength: 10,
      intelligence: 10,
      vitality: 10,
      agility: 10,
      willpower: 10,
    },
    newAllocatedPoints,
    player.value.level,
    player.value.race
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

  // 重新计算最终属性（不含分配的点数）
  const finalStats = recalculatePlayerStats(
    {
      strength: 10,
      intelligence: 10,
      vitality: 10,
      agility: 10,
      willpower: 10,
    },
    createEmptyAllocatedPoints(),
    player.value.level,
    player.value.race
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
