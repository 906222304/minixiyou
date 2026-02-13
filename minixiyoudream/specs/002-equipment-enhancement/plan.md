# 实现计划: 装备强化系统

**分支**: `002-equipment-enhancement` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现完整的装备强化系统，包括成功率计算、失败惩罚、保护道具和属性加成。这是核心养成系统之一。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **语言/版本** | TypeScript 5.8 / React 19 |
| **构建工具** | Vite 6.2 |
| **状态管理** | @preact/signals-react 2.x |
| **目标平台** | Web (现代浏览器) |

---

## 项目结构

```text
src/
├── types/
│   └── equipment.ts          # 扩展装备类型（强化相关）
├── constants/
│   └── enhancement.ts        # 强化配置表
├── services/
│   └── enhancementService.ts # 强化服务
├── components/
│   └── inventory/
│       └── EnhancementModal.tsx  # 强化弹窗
└── signals/
    └── inventorySignals.ts   # 背包状态
```

---

## 核心设计

### 强化配置

```typescript
interface EnhancementLevel {
  level: number;           // 目标等级
  successRate: number;     // 成功率 (0-1)
  statBonus: number;       // 属性加成百分比
  goldCost: number;        // 金币消耗（基础值×等级）
  failPenalty: 'none' | 'downgrade';  // 失败惩罚
}

const ENHANCEMENT_TABLE: EnhancementLevel[] = [
  { level: 1, successRate: 1.0, statBonus: 0.05, goldCost: 100, failPenalty: 'none' },
  { level: 2, successRate: 1.0, statBonus: 0.05, goldCost: 200, failPenalty: 'none' },
  { level: 3, successRate: 1.0, statBonus: 0.05, goldCost: 300, failPenalty: 'none' },
  { level: 4, successRate: 0.8, statBonus: 0.05, goldCost: 400, failPenalty: 'downgrade' },
  // ... 更多等级配置
];

const QUALITY_MAX_ENHANCE = {
  common: 5,
  rare: 8,
  epic: 10,
  legendary: 12,
  mythic: 15
};
```

### 强化服务

```typescript
function enhanceEquipment(
  equipment: Equipment,
  useProtection: boolean,
  prng: PRNG
): EnhancementResult {
  const currentLevel = equipment.enhanceLevel;
  const maxLevel = QUALITY_MAX_ENHANCE[equipment.quality];

  if (currentLevel >= maxLevel) {
    return { success: false, reason: 'max_level' };
  }

  const config = ENHANCEMENT_TABLE[currentLevel];
  const success = prng.next() < config.successRate;

  if (success) {
    equipment.enhanceLevel++;
    recalculateEnhanceBonus(equipment);
    return { success: true, newLevel: equipment.enhanceLevel };
  } else {
    if (!useProtection && config.failPenalty === 'downgrade' && currentLevel > 3) {
      equipment.enhanceLevel = Math.max(3, currentLevel - 1);
    }
    return { success: false, newLevel: equipment.enhanceLevel };
  }
}
```

---

## 验收标准

- [ ] 强化成功率符合配置
- [ ] 失败惩罚正确执行
- [ ] 保护道具功能正常
- [ ] 属性计算正确
- [ ] 品质上限正确
