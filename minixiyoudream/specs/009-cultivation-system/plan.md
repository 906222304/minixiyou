# 实现计划: 修炼系统

**分支**: `009-cultivation-system` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现修炼系统，玩家可以通过修炼获得永久属性加成，并通过境界突破获得额外加成。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **修炼类型** | 5种（力量、灵力、体质、敏捷、魔力） |
| **境界数量** | 5个境界 |
| **存储方案** | IndexedDB（通过存档系统） |

---

## 项目结构

```text
src/
├── types/
│   └── cultivation.ts       # 修炼类型定义
├── constants/
│   └── cultivation.ts       # 修炼配置（境界、经验表）
├── services/
│   └── cultivationService.ts # 修炼服务
├── components/
│   └── cultivation/
│       ├── CultivationPage.tsx   # 修炼主页面
│       ├── CultivationProgress.tsx # 修炼进度
│       └── RealmBreakthrough.tsx # 境界突破
└── signals/
    └── cultivationSignals.ts # 修炼状态
```

---

## 核心设计

### 修炼数据结构

```typescript
interface CultivationData {
  // 当前境界
  realm: number;
  realmName: string;

  // 总修炼值
  totalCultivation: number;

  // 各类型修炼
  cultivations: {
    strength: CultivationProgress;
    intelligence: CultivationProgress;
    vitality: CultivationProgress;
    agility: CultivationProgress;
    willpower: CultivationProgress;
  };

  // 突破记录
  breakthroughHistory: BreakthroughRecord[];
}

interface CultivationProgress {
  level: number;           // 当前等级
  exp: number;             // 当前经验
  expToNext: number;       // 升级所需经验
  bonus: number;           // 属性加成值
}

interface BreakthroughRecord {
  fromRealm: number;
  toRealm: number;
  success: boolean;
  timestamp: number;
}
```

### 修炼服务

```typescript
export const cultivationService = {
  // 开始修炼
  startCultivation(type: CultivationType): void;

  // 获得修炼经验
  gainCultivationExp(type: CultivationType, amount: number): LevelUpResult;

  // 使用修炼丹
  useCultivationPill(itemId: string, type: CultivationType): void;

  // 尝试突破
  attemptBreakthrough(): BreakthroughResult;

  // 获取修炼加成
  getCultivationBonus(): CharacterStats;

  // 获取境界加成
  getRealmBonus(): number;  // 返回百分比加成
};
```

### 境界配置

```typescript
const REALMS = [
  { level: 1, name: '练气期', requiredCultivation: 0, bonus: 0, breakthroughRate: 1.0 },
  { level: 2, name: '筑基期', requiredCultivation: 1000, bonus: 0.02, breakthroughRate: 0.8 },
  { level: 3, name: '金丹期', requiredCultivation: 5000, bonus: 0.05, breakthroughRate: 0.6 },
  { level: 4, name: '元婴期', requiredCultivation: 20000, bonus: 0.10, breakthroughRate: 0.4 },
  { level: 5, name: '化神期', requiredCultivation: 100000, bonus: 0.15, breakthroughRate: 0.2 }
];

const CULTIVATION_EXP_TABLE = [
  100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200
];
```

---

## 验收标准

- [ ] 5种修炼类型可正常修炼
- [ ] 修炼属性加成正确
- [ ] 境界突破正常工作
- [ ] 修炼数据正确保存
