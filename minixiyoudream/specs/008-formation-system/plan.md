# 实现计划: 阵法系统

**分支**: `008-formation-system` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现阵法系统，为6人阵容战斗增加策略深度，不同位置获得不同加成。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **阵法数量** | 4种基础阵法 |
| **阵法等级** | 1-5级 |
| **位置系统** | 前排3人 + 后排3人 |

---

## 项目结构

```text
src/
├── types/
│   └── formation.ts          # 阵法类型定义
├── constants/
│   └── formations.ts         # 阵法配置
├── services/
│   └── formationService.ts   # 阵法服务
├── components/
│   └── formation/
│       ├── FormationSelect.tsx   # 阵法选择
│       ├── FormationSlot.tsx     # 阵法槽位
│       └── FormationUpgrade.tsx  # 阵法升级
└── signals/
    └── formationSignals.ts   # 阵法状态
```

---

## 核心设计

### 阵法类型定义

```typescript
interface Formation {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 阵法类型
  type: 'attack' | 'defense' | 'speed' | 'balance';

  // 位置效果
  positions: FormationPosition[];

  // 克制关系
  counters: string[];     // 克制的阵法ID
  counteredBy: string[];  // 被克制的阵法ID

  // 升级配置
  maxLevel: number;
  levelBonus: number;     // 每级效果加成%
}

interface FormationPosition {
  slot: number;           // 0-5，对应6个位置
  row: 'front' | 'back';  // 前排/后排
  effects: FormationEffect[];
}

interface FormationEffect {
  stat: keyof CharacterStats;
  value: number;          // 基础值
  isPercent: boolean;
}

interface PlayerFormation {
  formationId: string;
  level: number;
  exp: number;
  unlocked: boolean;
}
```

### 阵法服务

```typescript
export const formationService = {
  // 获取阵法效果
  getFormationEffects(formationId: string, level: number, slot: number): FormationEffect[];

  // 计算克制加成
  getCounterBonus(attackFormation: string, defenseFormation: string): number;

  // 升级阵法
  upgradeFormation(formationId: string, expGain: number): UpgradeResult;

  // 切换阵法
  setActiveFormation(formationId: string): void;
};
```

### 4种基础阵法配置

```typescript
const FORMATIONS: Formation[] = [
  {
    id: 'formation_tianfu',
    name: '天覆阵',
    description: '攻击型阵法，前排伤害提升',
    type: 'attack',
    positions: [
      { slot: 0, row: 'front', effects: [{ stat: 'physicalAttack', value: 10, isPercent: true }] },
      { slot: 1, row: 'front', effects: [{ stat: 'physicalAttack', value: 10, isPercent: true }] },
      { slot: 2, row: 'front', effects: [{ stat: 'physicalAttack', value: 10, isPercent: true }] },
      { slot: 3, row: 'back', effects: [{ stat: 'speed', value: 5, isPercent: true }] },
      { slot: 4, row: 'back', effects: [{ stat: 'speed', value: 5, isPercent: true }] },
      { slot: 5, row: 'back', effects: [{ stat: 'speed', value: 5, isPercent: true }] }
    ],
    counters: ['formation_dizai'],
    counteredBy: ['formation_fengyang'],
    maxLevel: 5,
    levelBonus: 2
  },
  // ... 其他阵法
];
```

---

## 验收标准

- [ ] 4种基础阵法可正常选择
- [ ] 阵法效果正确应用
- [ ] 阵法升级正常工作
- [ ] 克制关系正确计算
