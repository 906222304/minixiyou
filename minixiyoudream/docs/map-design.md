# 地图系统设计

> 版本：1.1.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 设计原则

- **移动端优先**：针对手机网页端优化操作体验
- **区域划分**：地图按区域分组，区域间需要传送
- **事件触发**：特定坐标触发事件、对话、战斗
- **探索乐趣**：隐藏区域、宝箱、随机事件

### 1.2 地图系统组成

```
世界地图 → 区域 → 地图 → 坐标 → 事件
```

### 1.3 MVP地图范围

| 功能 | 说明 | MVP状态 |
|------|------|----------|
| **区域移动** | 在地图间移动 | ✅ 必需 |
| **随机遭遇** | 野外遇怪 | ✅ 必需 |
| **NPC对话** | 与NPC交互 | ✅ 必需 |
| **传送点** | 快速移动 | ✅ 必需 |
| **隐藏地图** | 特殊条件触发 | 🔜 后续 |
| **地图成就** | 探索成就 | 🔜 后续 |
| **天气系统** | 动态天气 | 🔜 后续 |

---

## 二、世界结构

### 2.1 区域划分

| 区域 | 名称 | 等级范围 | 地图数量 | MVP状态 |
|------|------|----------|----------|----------|
| **新手村** | 长安郊外 | 1-10 | 8 | ✅ 必需 |
| **东土大唐** | 大唐境内 | 10-25 | 15 | 🔜 后续 |
| **西牛贺洲** | 西天取经路 | 25-40 | 20 | 🔜 后续 |
| **南瞻部洲** | 妖魔之地 | 40-60 | 22 | 🔜 后续 |
| **北俱芦洲** | 极北之地 | 60-80 | 18 | 🔜 后续 |
| **天界** | 神仙居所 | 80-100 | 12 | 🔜 后续 |

### 2.2 区域数据结构

```typescript
interface Region {
  id: string;
  name: string;
  description: string;
  levelRange: [number, number];
  maps: string[];           // 包含的地图ID
  adjacentRegions: string[]; // 相邻区域ID
  requirements?: {
    minLevel?: number;
    completedQuest?: string;
  };
}
```

---

## 三、地图设计

### 3.1 地图属性

```typescript
interface Map {
  // 基础信息
  id: string;
  name: string;
  description: string;
  region: string;           // 所属区域ID

  // 尺寸（MVP简化：使用小型地图）
  width: number;            // 地图宽度（坐标点数）
  height: number;           // 地图高度（坐标点数）

  // 等级
  levelRange: [number, number];

  // 类型
  type: MapType;

  // 连接
  connections: MapConnection[];

  // 遭遇
  encounters?: EncounterConfig;

  // 事件点
  events?: MapEvent[];

  // NPC
  npcs?: MapNPC[];

  // 传送点
  teleports?: TeleportPoint[];

  // 限制
  requirements?: MapRequirement;
}

type MapType =
  | 'town'        // 城镇（安全区）
  | 'field'       // 野外（有怪物）
  | 'dungeon'     // 地下城
  | 'building'    // 建筑内部
  | 'secret';     // 隐藏地图
```

### 3.2 地图连接

```typescript
interface MapConnection {
  direction: 'north' | 'south' | 'east' | 'west';
  targetMapId: string;
  targetPosition?: { x: number; y: number };
  requirements?: MapRequirement;
}

interface MapRequirement {
  minLevel?: number;
  requiredItem?: string;
  completedQuest?: string;
  requiredFaction?: string;
}
```

### 3.3 MVP新手村地图

```typescript
// 长安城（新手主城）
const ChangAnCity: Map = {
  id: 'map_changan_city',
  name: '长安城',
  description: '大唐国都，繁华热闹的皇城',
  region: 'region_newbie',
  width: 30,  // MVP简化：较小的地图
  height: 30,
  levelRange: [1, 10],
  type: 'town',
  connections: [
    { direction: 'north', targetMapId: 'map_changan_north' },
    { direction: 'south', targetMapId: 'map_wild_plains' },
    { direction: 'east', targetMapId: 'map_changan_east' },
    { direction: 'west', targetMapId: 'map_changan_west' }
  ],
  npcs: [
    { npcId: 'npc_innkeeper', position: { x: 15, y: 12 } },
    { npcId: 'npc_blacksmith', position: { x: 18, y: 15 } },
    { npcId: 'npc_elder', position: { x: 15, y: 20 } }
  ],
  teleports: [
    { id: 'teleport_inn', position: { x: 15, y: 10 }, targetBuilding: 'building_inn' }
  ]
};

// 野外地图
const WildPlains: Map = {
  id: 'map_wild_plains',
  name: '荒野平原',
  description: '长安城外的荒野平原，常有野兽出没',
  region: 'region_newbie',
  width: 40,
  height: 30,
  levelRange: [3, 10],
  type: 'field',
  connections: [
    { direction: 'north', targetMapId: 'map_changan_city' },
    { direction: 'south', targetMapId: 'map_forest_entrance' }
  ],
  encounters: {
    rate: 0.1,  // 每步10%遭遇率
    enemies: [
      { enemyId: 'enemy_wild_boar', weight: 40, levelRange: [3, 6] },
      { enemyId: 'enemy_wolf', weight: 30, levelRange: [4, 7] },
      { enemyId: 'enemy_bandit', weight: 20, levelRange: [5, 8] },
      { enemyId: 'enemy_elite_bandit', weight: 10, levelRange: [8, 10] }
    ]
  },
  events: [
    { id: 'event_treasure_1', position: { x: 25, y: 15 }, type: 'treasure' }
  ]
};
```

---

## 四、移动端适配

### 4.1 移动控制

```typescript
// 移动端控制方式
type MobileControlType =
  | 'direction_pad'    // 方向键（上下左右按钮）
  | 'swipe'            // 滑动控制
  | 'tap';             // 点击移动

interface MobileMapControl {
  controlType: MobileControlType;

  // 方向键配置
  dPad?: {
    position: 'left' | 'right';
    size: number;       // 按钮大小（px）
  };

  // 滑动配置
  swipe?: {
    sensitivity: number; // 灵敏度
    threshold: number;   // 最小滑动距离
  };
}

// 触摸友好的按钮尺寸
const MOBILE_BUTTON_SIZE = 48; // 最小44px，推荐48px
```

### 4.2 移动系统

```typescript
interface PlayerPosition {
  mapId: string;
  x: number;
  y: number;
  facing?: Direction;
}

type Direction = 'north' | 'south' | 'east' | 'west';

function movePlayer(
  currentPosition: PlayerPosition,
  direction: Direction,
  mapData: Map
): MovementResult {
  const { x, y } = currentPosition;
  let newX = x;
  let newY = y;

  // 计算新坐标
  switch (direction) {
    case 'north': newY = y - 1; break;
    case 'south': newY = y + 1; break;
    case 'east': newX = x + 1; break;
    case 'west': newX = x - 1; break;
  }

  // 边界检查
  if (newX < 0 || newX >= mapData.width || newY < 0 || newY >= mapData.height) {
    // 检查是否可以切换地图
    const connection = mapData.connections.find(c => c.direction === direction);
    if (connection) {
      return {
        type: 'map_change',
        newMapId: connection.targetMapId,
        newPosition: connection.targetPosition || getDefaultEnterPosition(connection.targetMapId, direction)
      };
    }
    return { type: 'blocked', reason: 'boundary' };
  }

  // 障碍物检查
  if (isObstacle(mapData, newX, newY)) {
    return { type: 'blocked', reason: 'obstacle' };
  }

  // 检查地图事件
  const event = checkMapEvent(mapData, newX, newY);

  // 检查怪物遭遇
  const encounter = checkEncounter(mapData, newX, newY);

  return {
    type: 'moved',
    newPosition: { mapId: currentPosition.mapId, x: newX, y: newY, facing: direction },
    event,
    encounter
  };
}
```

### 4.3 响应式迷你地图

```typescript
interface MiniMapConfig {
  // 移动端显示配置
  mobile: {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    size: number;        // 迷你地图尺寸（px）
    expandable: boolean; // 是否可展开
  };

  // PC端显示配置
  desktop: {
    position: 'top-right' | 'sidebar';
    size: number;
  };
}

function getMiniMapConfig(screenWidth: number): MiniMapConfig {
  const isMobile = screenWidth < 768;

  if (isMobile) {
    return {
      mobile: {
        position: 'top-right',
        size: 100,
        expandable: true
      },
      desktop: {
        position: 'top-right',
        size: 200
      }
    };
  }

  return {
    mobile: {
      position: 'top-right',
      size: 100,
      expandable: true
    },
    desktop: {
      position: 'sidebar',
      size: 200
    }
  };
}
```

---

## 五、坐标系统

### 5.1 玩家位置

```typescript
interface PlayerPosition {
  mapId: string;
  x: number;
  y: number;
  facing?: Direction;
}

type Direction = 'north' | 'south' | 'east' | 'west';
```

### 5.2 移动类型

```typescript
type MovementResult =
  | { type: 'moved'; newPosition: PlayerPosition; event?: MapEvent; encounter?: boolean }
  | { type: 'map_change'; newMapId: string; newPosition: PlayerPosition }
  | { type: 'blocked'; reason: string };
```

---

## 六、地图事件系统

### 6.1 事件类型

```typescript
type MapEventType =
  | 'treasure'      // 宝箱
  | 'npc'           // NPC对话
  | 'quest'         // 任务触发
  | 'teleport'      // 传送点
  | 'battle'        // 强制战斗
  | 'random'        // 随机事件
  | 'story';        // 剧情事件

interface MapEvent {
  id: string;
  type: MapEventType;
  position: { x: number; y: number };
  trigger: 'step' | 'interact' | 'auto';  // 触发方式
  repeatable: boolean;
  conditions?: EventCondition[];
  actions: EventAction[];
}
```

### 6.2 事件条件与动作

```typescript
interface EventCondition {
  type: 'level' | 'item' | 'quest' | 'flag';
  value: string | number;
  operator?: 'eq' | 'gt' | 'lt' | 'has' | 'not';
}

interface EventAction {
  type:
    | 'dialogue'      // 显示对话
    | 'give_item'     // 给予物品
    | 'take_item'     // 拿走物品
    | 'give_exp'      // 给予经验
    | 'give_gold'     // 给予金币
    | 'start_battle'  // 开始战斗
    | 'teleport'      // 传送
    | 'set_flag'      // 设置标记
    | 'start_quest'   // 开始任务
    | 'complete_quest'; // 完成任务
  params: Record<string, any>;
}
```

### 6.3 事件示例

```typescript
// 隐藏宝箱事件
const TreasureEvent: MapEvent = {
  id: 'event_hidden_treasure_1',
  type: 'treasure',
  position: { x: 25, y: 15 },
  trigger: 'step',
  repeatable: false,
  conditions: [
    { type: 'level', value: 5, operator: 'gt' }
  ],
  actions: [
    {
      type: 'dialogue',
      params: { text: '你发现了一个隐藏的宝箱！' }
    },
    {
      type: 'give_item',
      params: { itemId: 'item_treasure_key', count: 1 }
    },
    {
      type: 'give_gold',
      params: { amount: 500 }
    }
  ]
};

// 剧情事件（解锁伙伴）
const StoryEvent: MapEvent = {
  id: 'event_story_meet_monkey',
  type: 'story',
  position: { x: 12, y: 8 },
  trigger: 'step',
  repeatable: false,
  conditions: [
    { type: 'quest', value: 'quest_journey_begin', operator: 'eq' }
  ],
  actions: [
    {
      type: 'dialogue',
      params: {
        speaker: '孙悟空',
        text: '你就是那个要去西天取经的人？嘿嘿，有意思...'
      }
    },
    {
      type: 'set_flag',
      params: { flag: 'met_monkey_king', value: true }
    }
  ]
};
```

---

## 七、传送系统

### 7.1 传送点类型

| 类型 | 说明 | 费用 |
|------|------|------|
| **固定传送点** | 城镇间的传送阵 | 金币 |
| **回城卷轴** | 道具传送回绑定点 | 道具消耗 |
| **副本入口** | 进入副本 | 无/门票 |
| **建筑入口** | 进入建筑内部 | 无 |

### 7.2 传送数据结构

```typescript
interface TeleportPoint {
  id: string;
  name: string;
  position: { x: number; y: number };
  type: 'fixed' | 'dungeon' | 'building';

  // 目标
  target: {
    mapId: string;
    position?: { x: number; y: number };
  };

  // 费用
  cost?: {
    gold?: number;
    item?: string;
  };

  // 条件
  requirements?: MapRequirement;

  // 是否已解锁
  unlocked: boolean;
}
```

---

## 八、NPC 系统

### 8.1 NPC 类型

```typescript
type NPCType =
  | 'merchant'     // 商人
  | 'quest_giver'  // 任务发布者
  | 'trainer'      // 技能训练师
  | 'innkeeper'    // 客栈老板
  | 'blacksmith'   // 铁匠
  | 'storage'      // 仓库管理员
  | 'generic';     // 普通NPC
```

### 8.2 NPC 数据结构

```typescript
interface NPC {
  id: string;
  name: string;
  type: NPCType;
  dialogue: NPCDialogue[];
  services?: NPCService[];
  quests?: string[];       // 可发布的任务ID
  shop?: string;           // 商店ID（如果是商人）
}

interface NPCDialogue {
  id: string;
  conditions?: EventCondition[];
  text: string;
  responses?: DialogueResponse[];
}

interface DialogueResponse {
  text: string;
  action?: EventAction;
  nextDialogue?: string;
}

interface NPCService {
  type: 'shop' | 'repair' | 'identify' | 'storage' | 'rest' | 'train';
  params: Record<string, any>;
}
```

### 8.3 NPC 示例

```typescript
// 铁匠NPC
const BlacksmithNPC: NPC = {
  id: 'npc_blacksmith_changan',
  name: '张铁匠',
  type: 'blacksmith',
  dialogue: [
    {
      id: 'greeting',
      text: '客官，要打铁还是修理装备？',
      responses: [
        { text: '我要打造装备', action: { type: 'open_shop', params: { shopId: 'shop_blacksmith' } } },
        { text: '我要修理装备', action: { type: 'repair', params: {} } },
        { text: '只是看看', nextDialogue: 'browse' }
      ]
    },
    {
      id: 'browse',
      text: '好的，有什么需要随时叫我。',
      responses: [
        { text: '告辞' }
      ]
    }
  ],
  services: [
    { type: 'shop', params: { shopId: 'shop_blacksmith' } },
    { type: 'repair', params: { costPerPoint: 10 } }
  ]
};
```

---

## 九、怪物遭遇系统

### 9.1 遭遇配置

```typescript
interface EncounterConfig {
  rate: number;           // 每步遭遇概率
  enemies: EnemySpawn[];
  minDistance?: number;   // 上次战斗后最少步数
}

interface EnemySpawn {
  enemyId: string;
  weight: number;         // 权重
  levelRange: [number, number];
  isBoss?: boolean;
}

function checkEncounter(
  mapData: Map,
  x: number,
  y: number,
  stepsSinceLastBattle: number
): Enemy[] | null {
  // 安全区域不遭遇
  if (mapData.type === 'town' || mapData.type === 'building') {
    return null;
  }

  // 最小步数检查
  if (mapData.encounters?.minDistance && stepsSinceLastBattle < mapData.encounters.minDistance) {
    return null;
  }

  // 概率检查
  const encounterRate = mapData.encounters?.rate || 0.1;
  if (Math.random() > encounterRate) {
    return null;
  }

  // 选择敌人
  const enemies = selectEnemies(mapData.encounters!);

  return enemies;
}
```

---

## 十、迷你地图

### 10.1 迷你地图显示

```typescript
interface MiniMapData {
  width: number;
  height: number;
  playerPosition: { x: number; y: number };
  exploredTiles: boolean[][];  // 已探索区域
  pointsOfInterest: POI[];
}

interface POI {
  type: 'npc' | 'teleport' | 'quest' | 'shop' | 'dungeon';
  position: { x: number; y: number };
  name: string;
  icon: string;
}
```

---

## 十一、地图数据统计

### 11.1 完整地图分布

| 区域 | 地图数 | 城镇 | 野外 | 副本 |
|------|--------|------|------|------|
| 新手村 | 8 | 2 | 5 | 1 |
| 东土大唐 | 15 | 3 | 10 | 2 |
| 西牛贺洲 | 20 | 4 | 13 | 3 |
| 南瞻部洲 | 22 | 3 | 15 | 4 |
| 北俱芦洲 | 18 | 2 | 12 | 4 |
| 天界 | 12 | 2 | 6 | 4 |
| **总计** | **95** | **16** | **61** | **18** |

### 11.2 MVP地图（新手村8张）

| 地图名 | 类型 | 等级 | 说明 |
|--------|------|------|------|
| 长安城 | 城镇 | 1-10 | 主城，NPC集中 |
| 长安北门 | 野外 | 3-8 | 北边入口 |
| 长安南门 | 野外 | 3-8 | 南边入口 |
| 长安东门 | 野外 | 3-8 | 东边入口 |
| 长安西门 | 野外 | 3-8 | 西边入口 |
| 荒野平原 | 野外 | 5-10 | 第一个战斗区域 |
| 迷雾森林 | 野外 | 6-10 | 中级战斗区域 |
| 山贼洞穴 | 副本 | 8-10 | 第一个副本 |

---

## 十二、待完善事项

1. [x] 移动端控制方案设计
2. [x] MVP新手村地图规划
3. [ ] 详细设计每个地图的内容
4. [ ] 设计地图之间的连接关系
5. [ ] 设计随机事件池
6. [ ] 设计隐藏地图触发条件

---

## 十三、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 添加移动端适配、MVP范围定义 |
