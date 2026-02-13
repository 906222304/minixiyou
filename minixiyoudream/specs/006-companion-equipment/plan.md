# 实现计划: 伙伴装备系统

**分支**: `006-companion-equipment` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

为伙伴添加完整的9槽位装备系统，复用主角装备系统的核心逻辑和组件。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **装备槽位** | 9槽位（武器、头盔、衣服、腰带、鞋子、项链、戒指x2、护符） |
| **数据结构** | 复用 EquipmentSlots 类型 |
| **界面复用** | 复用主角装备组件 |

---

## 项目结构

```text
src/
├── types/
│   └── companion.ts           # 已有 equipment 字段
├── services/
│   └── companionEquipService.ts  # 伙伴装备服务
├── components/
│   └── companion/
│       ├── CompanionEquipment.tsx  # 伙伴装备界面
│       └── CompanionDetail.tsx     # 更新详情页
└── signals/
    └── companionSignals.ts    # 伙伴状态管理
```

---

## 核心设计

### 伙伴装备数据结构（已有）

```typescript
interface Companion {
  // ... 其他字段
  equipment: EquipmentSlots;     // 9槽位装备（已定义）
  equipmentStats: CharacterStats; // 装备加成（已定义）
}
```

### 伙伴装备服务

```typescript
export const companionEquipService = {
  // 穿戴装备
  equipItem(companionId: string, item: Equipment, slot: EquipmentSlot): EquipResult;

  // 卸下装备
  unequipItem(companionId: string, slot: EquipmentSlot): Equipment | null;

  // 获取可穿戴装备列表
  getEquipableItems(companionId: string, slot: EquipmentSlot): Equipment[];

  // 重新计算装备属性
  recalculateEquipmentStats(companionId: string): void;
};
```

### 属性计算流程

```typescript
function recalculateCompanionStats(companion: Companion): void {
  // 基础属性 + 装备加成 + 羁绊加成 + 好感度加成
  const equipmentBonus = calculateEquipmentStats(companion.equipment);
  const bondBonus = calculateBondStats(companion);
  const favorBonus = getFavorabilityBonus(companion.favorabilityLevel);

  companion.equipmentStats = equipmentBonus;
  // 最终属性 = (基础 + 装备) * 羁绊 * 好感度
}
```

---

## 验收标准

- [ ] 伙伴装备界面正常显示
- [ ] 装备穿戴/卸下正常工作
- [ ] 装备属性正确计算
- [ ] 与主角装备界面风格一致
