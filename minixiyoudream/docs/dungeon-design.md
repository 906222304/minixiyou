# 副本系统设计

> 版本：1.1.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 设计原则

- **难度分级**：每个副本4个难度等级
- **次数限制**：每日/每周进入次数限制
- **奖励丰富**：副本是高品质装备的主要来源
- **极品来源**：打造和副本Boss才能出极品装备

### 1.2 副本系统组成

```
副本入口 → 难度选择 → 层数/阶段 → Boss战 → 结算奖励
```

### 1.3 MVP副本范围

| 功能 | 说明 | MVP状态 |
|------|------|----------|
| **普通副本** | 基础PvE内容 | ✅ 必需（1个） |
| **难度选择** | 多难度挑战 | 🔶 简化（2个难度） |
| **Boss战** | 特殊机制战斗 | ✅ 必需 |
| **结算奖励** | 经验/金币/装备 | ✅ 必需 |
| **精英副本** | 更高难度和奖励 | 🔜 后续 |
| **团队副本** | 高难度挑战 | 🔜 后续 |
| **挑战副本** | 爬塔模式 | 🔜 后续 |
| **副本成就** | 特殊成就 | 🔜 后续 |

---

## 二、副本基础

### 2.1 副本类型

| 类型 | 说明 | 层数 | 重置时间 | MVP状态 |
|------|------|------|----------|----------|
| **普通副本** | 基础PvE内容 | 3-5层 | 每日 | ✅ 必需 |
| **精英副本** | 更高难度和奖励 | 3-5层 | 每日 | 🔜 后续 |
| **团队副本** | 高难度挑战 | 5-10层 | 每周 | 🔜 后续 |
| **挑战副本** | 无限层数，爬塔模式 | 无限 | 每周 | 🔜 后续 |

### 2.2 难度分级

| 难度 | 名称 | 怪物倍率 | 奖励倍率 | 进入条件 |
|------|------|----------|----------|----------|
| **简单** | 普通 | 100% | 100% | 无 |
| **普通** | 困难 | 130% | 150% | 完成简单 |
| **困难** | 噩梦 | 170% | 200% | 🔜 后续开放 |
| **地狱** | 地狱 | 220% | 300% | 🔜 后续开放 |

### 2.3 MVP难度简化

> **MVP简化**：仅开放简单和普通两个难度

```typescript
// MVP难度配置
const MVP_DIFFICULTIES: DungeonDifficulty[] = [
  { level: 1, name: '简单', monsterMultiplier: 1.0, rewardMultiplier: 1.0 },
  { level: 2, name: '普通', monsterMultiplier: 1.3, rewardMultiplier: 1.5, unlockCondition: 'clear_dungeon_1' }
];
```

### 2.4 副本数据结构

```typescript
interface Dungeon {
  // 基础信息
  id: string;
  name: string;
  description: string;
  type: DungeonType;

  // 位置
  mapId: string;           // 入口所在地图
  entrancePosition: { x: number; y: number };

  // 等级与人数
  levelRange: [number, number];
  maxPartySize: number;    // 最大队伍人数（单机默认1）

  // 层数
  floors: DungeonFloor[];

  // 难度配置
  difficulties: DungeonDifficulty[];

  // 进入限制
  entryRequirements: DungeonRequirement;
  dailyLimit: number;      // 每日次数限制
  weeklyLimit?: number;    // 每周次数限制

  // 奖励
  firstClearReward: Reward[];
  completionReward: Reward;
}

type DungeonType = 'normal' | 'elite' | 'raid' | 'challenge';

interface DungeonDifficulty {
  level: number;           // 难度等级 1-4
  name: string;
  monsterMultiplier: number;
  rewardMultiplier: number;
  unlockCondition?: string;
}

interface DungeonFloor {
  floorNumber: number;
  name: string;
  mapTemplate: string;     // 地图模板ID
  enemies: FloorEnemy[];
  boss?: FloorBoss;
  events?: DungeonEvent[];
  treasureChests?: ChestConfig[];
}

interface FloorEnemy {
  enemyId: string;
  count: [number, number]; // 数量范围
  levelBonus: number;      // 等级加成
  spawnPoints?: { x: number; y: number }[];
}

interface FloorBoss {
  enemyId: string;
  level: number;
  phase?: BossPhase[];
  mechanics?: BossMechanic[];
}

interface Reward {
  type: 'exp' | 'gold' | 'item';
  value?: number;
  itemId?: string;
  itemCount?: number;
  dropTable?: string;
}
```

---

## 三、副本流程

### 3.1 进入副本

```typescript
interface DungeonState {
  dungeonId: string;
  difficulty: number;
  currentFloor: number;
  startTime: number;
  killedEnemies: string[];
  collectedChests: string[];
  deaths: number;
}

function enterDungeon(
  dungeon: Dungeon,
  difficulty: number,
  player: Player
): EnterResult {
  // 检查等级
  if (player.level < dungeon.levelRange[0] || player.level > dungeon.levelRange[1]) {
    return { success: false, reason: 'level_mismatch' };
  }

  // 检查次数限制
  const dailyCount = getDailyDungeonCount(dungeon.id);
  if (dailyCount >= dungeon.dailyLimit) {
    return { success: false, reason: 'daily_limit_reached' };
  }

  // 检查难度解锁
  if (difficulty > 1) {
    const prevDifficulty = dungeon.difficulties[difficulty - 2];
    if (prevDifficulty.unlockCondition && !checkCondition(prevDifficulty.unlockCondition)) {
      return { success: false, reason: 'difficulty_locked' };
    }
  }

  // 检查进入条件
  if (!checkRequirements(dungeon.entryRequirements, player)) {
    return { success: false, reason: 'requirements_not_met' };
  }

  // 消耗入场道具（如果有）
  if (dungeon.entryRequirements.requiredItem) {
    if (!player.inventory.hasItem(dungeon.entryRequirements.requiredItem, 1)) {
      return { success: false, reason: 'missing_entry_item' };
    }
    player.inventory.removeItem(dungeon.entryRequirements.requiredItem, 1);
  }

  // 创建副本实例
  const instance: DungeonState = {
    dungeonId: dungeon.id,
    difficulty,
    currentFloor: 1,
    startTime: Date.now(),
    killedEnemies: [],
    collectedChests: [],
    deaths: 0
  };

  return { success: true, instance };
}
```

### 3.2 副本战斗（6人阵容）

```typescript
function startFloorBattle(
  dungeon: Dungeon,
  state: DungeonState,
  floor: DungeonFloor,
  formation: BattleFormation  // 6人阵容
): BattleConfig {
  const difficulty = dungeon.difficulties[state.difficulty - 1];

  // 生成敌人（根据6人阵容调整数量）
  const enemies: Enemy[] = [];
  for (const enemyConfig of floor.enemies) {
    // MVP简化：敌人数量根据难度调整
    const baseCount = randomBetween(enemyConfig.count[0], enemyConfig.count[1]);
    const count = Math.ceil(baseCount * difficulty.monsterMultiplier);

    for (let i = 0; i < count; i++) {
      const baseEnemy = getEnemyTemplate(enemyConfig.enemyId);
      const enemy = scaleEnemy(baseEnemy, {
        levelBonus: enemyConfig.levelBonus,
        statMultiplier: difficulty.monsterMultiplier
      });
      enemies.push(enemy);
    }
  }

  return {
    formation,              // 玩家阵容
    enemies,
    isDungeonBattle: true,
    canEscape: false,       // 副本内不可逃跑
    rewards: calculateFloorRewards(floor, difficulty)
  };
}
```

### 3.3 Boss战机制（MVP简化）

```typescript
interface BossMechanic {
  id: string;
  name: string;
  trigger: MechanicTrigger;
  effects: MechanicEffect[];
  cooldown?: number;
  announce?: string;  // 预警提示
}

interface MechanicTrigger {
  type: 'hp_threshold' | 'turn' | 'timer' | 'phase';
  value: number;
}

interface MechanicEffect {
  type: 'summon' | 'buff' | 'debuff' | 'aoe' | 'special';
  params: Record<string, any>;
}

// MVP简化版Boss机制
const BanditLeaderMechanics_MVP: BossMechanic[] = [
  {
    id: 'mechanic_summon_minions',
    name: '召唤手下',
    trigger: { type: 'hp_threshold', value: 0.5 },
    effects: [
      { type: 'summon', params: { enemyId: 'enemy_bandit', count: 2 } }
    ],
    announce: '山贼首领大喊：小的们，给我上！'
  },
  {
    id: 'mechanic_rage',
    name: '狂暴',
    trigger: { type: 'hp_threshold', value: 0.3 },
    effects: [
      { type: 'buff', params: { stat: 'attack', value: 0.3, duration: 999 } }
    ],
    announce: '山贼首领进入狂暴状态，攻击力提升！'
  }
];

function processBossMechanics(
  boss: CombatUnit,
  mechanics: BossMechanic[],
  battleState: BattleState
): MechanicResult[] {
  const results: MechanicResult[] = [];

  for (const mechanic of mechanics) {
    // 检查触发条件
    let triggered = false;

    switch (mechanic.trigger.type) {
      case 'hp_threshold':
        const hpPercent = boss.hp / boss.maxHp;
        triggered = hpPercent <= mechanic.trigger.value &&
                   !battleState.triggeredMechanics.includes(mechanic.id);
        break;

      case 'turn':
        triggered = battleState.round === mechanic.trigger.value;
        break;
    }

    if (triggered) {
      battleState.triggeredMechanics.push(mechanic.id);
      results.push({
        mechanic,
        announce: mechanic.announce
      });

      // 执行效果
      for (const effect of mechanic.effects) {
        executeMechanicEffect(effect, battleState);
      }
    }
  }

  return results;
}
```

### 3.4 副本结算

```typescript
interface DungeonCompletion {
  dungeonId: string;
  difficulty: number;
  completionTime: number;  // 秒
  floorsCleared: number;
  totalFloors: number;
  killedEnemies: number;
  deaths: number;
  rating: number;          // 1-3星

  rewards: {
    exp: number;
    gold: number;
    items: ItemDrop[];
    firstClear?: boolean;
  };
}

function completeDungeon(
  dungeon: Dungeon,
  state: DungeonState
): DungeonCompletion {
  const difficulty = dungeon.difficulties[state.difficulty - 1];
  const completionTime = Math.floor((Date.now() - state.startTime) / 1000);

  // 计算评分
  const rating = calculateRating(dungeon, state, completionTime);

  // 基础奖励
  let exp = dungeon.completionReward.value || 0;
  let gold = dungeon.completionReward.value || 0;

  // 应用难度倍率
  exp = Math.floor(exp * difficulty.rewardMultiplier);
  gold = Math.floor(gold * difficulty.rewardMultiplier);

  // 评星加成
  const ratingBonus = 1 + (rating - 1) * 0.2;  // 每星+20%
  exp = Math.floor(exp * ratingBonus);
  gold = Math.floor(gold * ratingBonus);

  // 首次通关奖励
  let firstClear = false;
  if (!hasCompletedDungeon(dungeon.id, state.difficulty)) {
    firstClear = true;
    exp += dungeon.firstClearReward.reduce((sum, r) => sum + (r.type === 'exp' ? r.value : 0), 0);
    gold += dungeon.firstClearReward.reduce((sum, r) => sum + (r.type === 'gold' ? r.value : 0), 0);
  }

  // 掉落物品（极品来源）
  const items = rollDungeonDrops(dungeon, difficulty, rating);

  // 记录完成
  recordDungeonCompletion(dungeon.id, state.difficulty, {
    time: completionTime,
    rating,
    firstClear
  });

  return {
    dungeonId: dungeon.id,
    difficulty: state.difficulty,
    completionTime,
    floorsCleared: state.currentFloor,
    totalFloors: dungeon.floors.length,
    killedEnemies: state.killedEnemies.length,
    deaths: state.deaths,
    rating,
    rewards: {
      exp,
      gold,
      items,
      firstClear
    }
  };
}

function calculateRating(
  dungeon: Dungeon,
  state: DungeonState,
  completionTime: number
): number {
  let rating = 3;

  // 时间惩罚
  const expectedTime = dungeon.floors.length * 120;  // 每层预期2分钟
  if (completionTime > expectedTime * 1.5) rating--;
  if (completionTime > expectedTime * 2) rating--;

  // 死亡惩罚
  if (state.deaths > 0) rating--;
  if (state.deaths > 2) rating--;

  return Math.max(1, rating);
}
```

---

## 四、副本奖励

### 4.1 奖励类型（极品来源）

```typescript
interface DungeonRewards {
  // 基础奖励（每次通关）
  base: {
    exp: number;
    gold: number;
  };

  // 首次通关奖励
  firstClear: Reward[];

  // 评星奖励
  starRewards: {
    stars: number;
    rewards: Reward[];
  }[];

  // Boss掉落（极品来源）
  bossDrops: DropTable[];

  // 宝箱奖励
  chestDrops: DropTable[];
}
```

### 4.2 装备来源分布

| 来源 | 品质范围 | 定位 |
|------|----------|------|
| **怪物掉落** | 普通~稀有 | 过渡装备 |
| **副本Boss** | 稀有~传说 | **极品来源** |
| **打造制作** | 任意品质 | **极品来源** |

### 4.3 掉落计算

```typescript
function rollDungeonDrops(
  dungeon: Dungeon,
  difficulty: DungeonDifficulty,
  rating: number
): ItemDrop[] {
  const drops: ItemDrop[] = [];

  // Boss掉落（有概率出极品）
  for (const floor of dungeon.floors) {
    if (floor.boss) {
      const bossDrops = getBossDropTable(floor.boss.enemyId);
      for (const drop of bossDrops) {
        let rate = drop.rate * difficulty.rewardMultiplier;

        // 评星加成
        rate *= (1 + (rating - 1) * 0.1);

        if (Math.random() * 100 < rate) {
          drops.push({
            itemId: drop.itemId,
            count: randomBetween(drop.minCount, drop.maxCount)
          });
        }
      }
    }
  }

  // 保底机制：如果没有掉落任何物品，给一个保底奖励
  if (drops.length === 0) {
    drops.push({
      itemId: getDungeonGuaranteedDrop(dungeon.id),
      count: 1
    });
  }

  return drops;
}
```

---

## 五、MVP副本设计

### 5.1 山贼洞穴（唯一MVP副本）

```typescript
const BanditCaveDungeon_MVP: Dungeon = {
  id: 'dungeon_bandit_cave',
  name: '山贼洞穴',
  description: '位于长安城外的山贼巢穴，据说藏有大量财宝',
  type: 'normal',
  mapId: 'map_bandit_entrance',
  entrancePosition: { x: 15, y: 20 },
  levelRange: [8, 10],  // MVP等级范围
  maxPartySize: 1,
  floors: [
    {
      floorNumber: 1,
      name: '洞穴入口',
      mapTemplate: 'map_dungeon_cave_entrance',
      enemies: [
        { enemyId: 'enemy_bandit', count: [2, 3], levelBonus: 0 }
      ],
      treasureChests: [
        { position: { x: 10, y: 5 }, dropTable: 'drop_common_chest' }
      ]
    },
    {
      floorNumber: 2,
      name: '山贼营地',
      mapTemplate: 'map_dungeon_cave_camp',
      enemies: [
        { enemyId: 'enemy_bandit', count: [2, 3], levelBonus: 1 },
        { enemyId: 'enemy_bandit_elite', count: [1, 1], levelBonus: 1 }
      ],
      treasureChests: [
        { position: { x: 15, y: 10 }, dropTable: 'drop_rare_chest' }
      ]
    },
    {
      floorNumber: 3,
      name: '首领大厅',
      mapTemplate: 'map_dungeon_cave_boss',
      enemies: [
        { enemyId: 'enemy_bandit_elite', count: [1, 2], levelBonus: 2 }
      ],
      boss: {
        enemyId: 'boss_bandit_leader',
        level: 10,
        mechanics: BanditLeaderMechanics_MVP
      }
    }
  ],
  difficulties: [
    { level: 1, name: '简单', monsterMultiplier: 1.0, rewardMultiplier: 1.0 },
    { level: 2, name: '普通', monsterMultiplier: 1.3, rewardMultiplier: 1.5, unlockCondition: 'clear_dungeon_bandit_cave_1' }
  ],
  entryRequirements: {
    minLevel: 8
  },
  dailyLimit: 3,
  firstClearReward: [
    { type: 'exp', value: 300 },
    { type: 'gold', value: 500 },
    { type: 'item', itemId: 'item_bandit_badge', itemCount: 1 }
  ],
  completionReward: {
    type: 'exp',
    value: 150
  }
};
```

---

## 六、副本存档

### 6.1 进度保存

```typescript
interface DungeonSave {
  dungeonId: string;
  difficulty: number;
  currentFloor: number;
  playerHp: number;
  playerMp: number;
  startTime: number;
  floorProgress: {
    floor: number;
    killedEnemies: string[];
    collectedChests: string[];
  }[];
}

function saveDungeonProgress(state: DungeonState, player: Player): DungeonSave {
  return {
    dungeonId: state.dungeonId,
    difficulty: state.difficulty,
    currentFloor: state.currentFloor,
    playerHp: player.hp,
    playerMp: player.mp,
    startTime: state.startTime,
    floorProgress: []
  };
}

function resumeDungeon(save: DungeonSave, player: Player): DungeonState {
  // 恢复玩家状态
  player.hp = save.playerHp;
  player.mp = save.playerMp;

  // 恢复副本状态
  return {
    dungeonId: save.dungeonId,
    difficulty: save.difficulty,
    currentFloor: save.currentFloor,
    startTime: save.startTime,
    killedEnemies: [],
    collectedChests: [],
    deaths: 0
  };
}
```

---

## 七、完整副本列表

### 7.1 副本总览

| 名称 | 类型 | 等级 | 层数 | MVP状态 |
|------|------|------|------|----------|
| 山贼洞穴 | 普通 | 8-10 | 3 | ✅ 必需 |
| 蜘蛛巢穴 | 普通 | 15-25 | 3 | 🔜 后续 |
| 妖狐洞府 | 普通 | 20-30 | 4 | 🔜 后续 |
| 古代遗迹 | 精英 | 25-35 | 4 | 🔜 后续 |
| 火焰山 | 精英 | 35-45 | 5 | 🔜 后续 |
| 龙宫秘境 | 精英 | 45-55 | 5 | 🔜 后续 |
| 幽冥地府 | 团队 | 55-65 | 6 | 🔜 后续 |
| 天宫宝库 | 团队 | 65-75 | 6 | 🔜 后续 |
| 魔王寨 | 团队 | 75-85 | 7 | 🔜 后续 |
| 花果山 | 团队 | 85-95 | 8 | 🔜 后续 |
| 天梯塔 | 挑战 | 1-100 | 无限 | 🔜 后续 |
| 封魔塔 | 挑战 | 50+ | 无限 | 🔜 后续 |

---

## 八、待完善事项

1. [x] MVP副本设计（山贼洞穴）
2. [x] MVP难度简化（2个难度）
3. [x] Boss机制简化
4. [ ] 设计全部18个副本的详细内容
5. [ ] 平衡各难度数值
6. [ ] 设计更多Boss机制
7. [ ] 设计副本排行榜

---

## 九、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 添加MVP简化范围、6人阵容适配 |
