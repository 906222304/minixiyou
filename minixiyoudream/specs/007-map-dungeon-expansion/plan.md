# 实现计划: 扩展地图和副本

**分支**: `007-map-dungeon-expansion` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

扩展游戏地图和副本内容，开放东土大唐区域和新副本，增加区域传送系统。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **新增区域** | 东土大唐（15张地图） |
| **新增副本** | 蜘蛛巢穴(15-25级)、妖狐洞府(20-30级) |
| **传送系统** | 固定传送点 + 金币费用 |

---

## 项目结构

```text
src/
├── constants/
│   ├── maps.ts              # 扩展地图配置
│   ├── dungeons.ts          # 扩展副本配置
│   ├── enemies.ts           # 新怪物配置
│   └── teleports.ts         # 传送点配置
├── services/
│   └── teleportService.ts   # 传送服务
├── components/
│   └── map/
│       ├── TeleportPanel.tsx  # 传送面板
│       └── RegionMap.tsx      # 区域地图
└── signals/
    └── playerSignals.ts     # 解锁状态管理
```

---

## 核心设计

### 东土大唐区域地图

```typescript
const DATANG_REGION: Region = {
  id: 'region_datang',
  name: '东土大唐',
  description: '大唐国境，繁华之地',
  levelRange: [10, 25],
  maps: [
    'map_datang_capital',      // 大唐都城
    'map_datang_east',         // 东郊
    'map_datang_west',         // 西郊
    'map_datang_north',        // 北郊
    'map_datang_south',        // 南郊
    'map_fox_valley',          // 狐狸谷
    'map_spider_forest',       // 蜘蛛林
    'map_bandit_stronghold',   // 山贼据点
    'map_ancient_temple',      // 古庙
    'map_misty_swamp',         // 迷雾沼泽
    'map_dragon_pool',         // 龙潭
    'map_tiger_den',           // 虎穴
    'map_fairy_peak',          // 仙峰
    'map_ghost_town',          // 鬼城
    'map_dungeon_entrance'     // 副本入口区
  ],
  adjacentRegions: ['region_newbie', 'region_xiniu'],
  requirements: { minLevel: 10 }
};
```

### 新副本配置

```typescript
const SpiderCaveDungeon: Dungeon = {
  id: 'dungeon_spider_cave',
  name: '蜘蛛巢穴',
  description: '巨大的蜘蛛巢穴，蛛网密布',
  type: 'normal',
  levelRange: [15, 25],
  floors: [
    { floorNumber: 1, name: '蛛网走廊', enemies: [...] },
    { floorNumber: 2, name: '孵化室', enemies: [...] },
    { floorNumber: 3, name: '蛛后大厅', boss: {...} }
  ],
  difficulties: [
    { level: 1, name: '简单', monsterMultiplier: 1.0, rewardMultiplier: 1.0 },
    { level: 2, name: '普通', monsterMultiplier: 1.3, rewardMultiplier: 1.5 }
  ],
  dailyLimit: 3
};
```

### 传送系统

```typescript
interface TeleportPoint {
  id: string;
  name: string;
  mapId: string;
  position: { x: number; y: number };
  targetTeleportId: string;
  cost: {
    gold: number;
  };
  unlocked: boolean;
  unlockCondition?: {
    minLevel?: number;
    visited?: boolean;
  };
}

export const teleportService = {
  unlockTeleport(teleportId: string): void;
  teleport(teleportId: string): TeleportResult;
  getUnlockedTeleports(): TeleportPoint[];
  calculateCost(from: string, to: string): number;
};
```

---

## 验收标准

- [ ] 东土大唐区域可正常进入
- [ ] 15张新地图可正常探索
- [ ] 2个新副本可正常挑战
- [ ] 传送系统正常工作
- [ ] 新怪物配置正确
