# 实现计划: 成就系统

**分支**: `010-achievement-system` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现成就系统，追踪玩家游戏进度，提供成就点数和奖励，增加游戏长期目标。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **成就数量** | 50+成就 |
| **成就类别** | 5类（成长、战斗、收集、探索、社交） |
| **存储方案** | IndexedDB（通过存档系统） |

---

## 项目结构

```text
src/
├── types/
│   └── achievement.ts       # 成就类型定义
├── constants/
│   └── achievements.ts      # 成就配置
├── services/
│   └── achievementService.ts # 成就服务
├── components/
│   └── achievement/
│       ├── AchievementPage.tsx   # 成就主页面
│       ├── AchievementCard.tsx   # 成就卡片
│       ├── AchievementReward.tsx # 奖励领取
│       └── TitleDisplay.tsx      # 称号显示
└── signals/
    └── achievementSignals.ts # 成就状态
```

---

## 核心设计

### 成就数据结构

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;

  // 成就点数
  points: number;

  // 完成条件
  condition: AchievementCondition;

  // 奖励
  rewards: AchievementReward[];

  // 前置成就
  prerequisite?: string;

  // 隐藏成就（未完成前不显示详情）
  hidden?: boolean;
}

type AchievementCategory = 'growth' | 'battle' | 'collection' | 'exploration' | 'social';

interface AchievementCondition {
  type:
    | 'level'           // 等级达到
    | 'kill_count'      // 击杀数量
    | 'dungeon_clear'   // 通关副本
    | 'item_collect'    // 收集物品
    | 'pet_collect'     // 收集宠物
    | 'map_explore'     // 探索地图
    | 'favorability'    // 好感度
    | 'achievement_points'; // 成就点数
  target: string | number;
  count?: number;       // 需要的数量
}

interface AchievementReward {
  type: 'gold' | 'exp' | 'item' | 'title';
  value?: number;
  itemId?: string;
  titleId?: string;
}

interface PlayerAchievement {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: number;
  claimed: boolean;
  claimedAt?: number;
  progress: number;     // 0-100 进度
  currentValue: number; // 当前进度值
}

interface AchievementData {
  // 总成就点数
  totalPoints: number;

  // 已解锁成就
  unlockedAchievements: PlayerAchievement[];

  // 已装备称号
  equippedTitle: string | null;

  // 已解锁称号
  unlockedTitles: string[];
}
```

### 成就服务

```typescript
export const achievementService = {
  // 检查成就进度
  checkProgress(type: string, value: number): void;

  // 获取成就列表
  getAchievements(category?: AchievementCategory): Achievement[];

  // 获取玩家成就进度
  getPlayerAchievement(achievementId: string): PlayerAchievement | undefined;

  // 领取奖励
  claimReward(achievementId: string): ClaimResult;

  // 一键领取所有
  claimAllRewards(): ClaimResult[];

  // 装备称号
  equipTitle(titleId: string): void;

  // 获取成就点数
  getTotalPoints(): number;
};
```

### 成就配置示例

```typescript
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_level_10',
    name: '初出茅庐',
    description: '角色等级达到10级',
    category: 'growth',
    icon: 'icon_level',
    points: 5,
    condition: { type: 'level', target: 10 },
    rewards: [{ type: 'gold', value: 100 }]
  },
  {
    id: 'ach_kill_100',
    name: '百人斩',
    description: '累计击败100只怪物',
    category: 'battle',
    icon: 'icon_sword',
    points: 10,
    condition: { type: 'kill_count', target: 100 },
    rewards: [{ type: 'exp', value: 500 }]
  },
  {
    id: 'ach_dungeon_first',
    name: '副本先锋',
    description: '首次通关任意副本',
    category: 'battle',
    icon: 'icon_dungeon',
    points: 10,
    condition: { type: 'dungeon_clear', target: 'any', count: 1 },
    rewards: [{ type: 'item', itemId: 'item_dungeon_badge' }]
  }
];
```

---

## 验收标准

- [ ] 成就列表正常显示
- [ ] 成就进度正确追踪
- [ ] 成就奖励正常领取
- [ ] 称号系统正常工作
