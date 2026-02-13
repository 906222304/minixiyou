# 实现计划: 完善词条系统

**分支**: `001-affix-system-enhancement` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)
**输入**: 功能规范来自 `specs/001-affix-system-enhancement/spec.md`

---

## 概述

扩展现有词条系统，添加条件触发类型和特殊效果类型词条，并实现词条洗练锁定功能。这将显著增加装备Build的深度和玩家追求极品装备的动力。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **语言/版本** | TypeScript 5.8 / React 19 |
| **构建工具** | Vite 6.2 |
| **样式方案** | Tailwind CSS 4 |
| **状态管理** | @preact/signals-react 2.x |
| **目标平台** | Web (现代浏览器) |
| **性能目标** | 战斗帧率保持60fps |
| **约束条件** | 保持与现有词条系统向后兼容 |

---

## 设计检查

- [x] 是否符合游戏核心玩法设计？是的，增加Build深度
- [x] 是否与现有系统架构兼容？是的，扩展现有词条类型
- [x] 是否考虑了状态同步？是的，单机无需同步
- [x] 是否有性能影响评估？是的，触发效果在战斗循环中执行

---

## 项目结构

### 功能文档

```text
specs/001-affix-system-enhancement/
├── spec.md          # 功能规范
├── plan.md          # 本文件
└── tasks.md         # 任务清单
```

### 源码结构

```text
src/
├── types/
│   └── affix.ts              # 扩展词条类型定义
├── constants/
│   └── affixes.ts            # 新增词条定义
├── utils/
│   └── affixUtils.ts         # 词条工具函数
├── services/
│   └── affixService.ts       # 词条服务（生成、洗练）
├── components/
│   └── inventory/
│       ├── EquipmentDetail.tsx  # 装备详情（词条显示）
│       └── AffixReforge.tsx     # 词条洗练界面
└── signals/
    └── inventorySignals.ts   # 背包状态（锁定状态）
```

**结构决策**: 扩展现有文件结构，新增词条相关服务和组件

---

## 核心设计

### 数据模型

```typescript
// 扩展词条类型
type AffixType =
  | 'basic_stat'      // 基础属性（已有）
  | 'percent_stat'    // 百分比加成（已有）
  | 'combat_stat'     // 战斗属性（已有）
  | 'conditional'     // 条件触发（新增）
  | 'special'         // 特殊效果（新增）
  | 'negative';       // 负面词缀（后续）

// 条件触发词条
interface ConditionalAffix extends EquipmentAffix {
  type: 'conditional';
  condition: {
    type: 'hp_threshold' | 'mp_threshold' | 'on_crit' | 'on_kill' | 'on_hit';
    threshold?: number;  // 阈值（如HP百分比）
    operator?: 'lt' | 'gt' | 'eq';
  };
  effect: {
    stat: StatType;
    value: number;
    isPercent: boolean;
  };
}

// 特殊效果词条
interface SpecialAffix extends EquipmentAffix {
  type: 'special';
  trigger: {
    event: 'on_attack' | 'on_hit' | 'on_crit' | 'on_kill';
    chance: number;  // 触发概率 (0-1)
  };
  effect: {
    type: 'skill' | 'damage' | 'status' | 'heal';
    skillId?: string;
    damageValue?: number;
    statusEffect?: StatusEffect;
    healPercent?: number;
  };
}

// 词条锁定状态
interface AffixLockState {
  equipmentId: string;
  lockedIndices: number[];  // 锁定的词条索引
}
```

### 状态管理

```typescript
// signals/inventorySignals.ts 扩展
export const affixLockStates = signal<Map<string, AffixLockState>>(new Map());

// 洗练消耗计算
function calculateReforgeCost(lockedCount: number): ReforgeCost {
  const lockStoneCost = [0, 1, 3, 6][lockedCount] || 0;
  return {
    reforgeStones: 1,
    lockStones: lockStoneCost,
    gold: 1000 * (1 + lockedCount)
  };
}
```

### 组件设计

| 组件 | 职责 | 依赖 |
|------|------|------|
| AffixDisplay | 词条显示，区分类型高亮 | EquipmentAffix |
| AffixReforgeModal | 洗练弹窗，支持锁定 | affixLockStates |
| ConditionalIndicator | 条件触发状态指示器 | 战斗状态 |

### 服务接口

```typescript
// services/affixService.ts
export const affixService = {
  // 生成条件触发词条
  generateConditionalAffix(quality: EquipmentQuality, prng: PRNG): ConditionalAffix;

  // 生成特殊效果词条
  generateSpecialAffix(quality: EquipmentQuality, prng: PRNG): SpecialAffix;

  // 洗练词条（支持锁定）
  reforgeAffixes(
    equipment: Equipment,
    lockedIndices: number[],
    prng: PRNG
  ): Equipment;

  // 检查条件触发
  checkConditionalAffix(
    affix: ConditionalAffix,
    unit: CombatUnit
  ): boolean;

  // 执行特殊效果
  executeSpecialAffix(
    affix: SpecialAffix,
    source: CombatUnit,
    target: CombatUnit,
    battleState: BattleState,
    prng: PRNG
  ): void;
};
```

---

## 复杂度追踪

| 违规项 | 为何需要 | 拒绝简单方案的原因 |
|--------|----------|-------------------|
| 新增词条类型枚举 | 支持5种词条类型 | 原有3种类型无法表达新需求 |
| 词条锁定状态 | 支持洗练锁定功能 | 无状态无法实现锁定 |

---

## 风险与依赖

### 技术风险

- **性能风险**: 战斗中频繁检查条件触发可能影响帧率
  - 缓解：使用缓存和惰性计算
- **平衡风险**: 新词条可能过强或过弱
  - 缓解：数值测试和调整

### 外部依赖

- 无新增外部依赖

---

## 验收标准

- [ ] 条件触发词条在满足条件时生效
- [ ] 特殊效果词条按概率触发
- [ ] 词条锁定功能正常工作
- [ ] 洗练消耗计算正确
- [ ] 无 TypeScript 类型错误
- [ ] ESLint 检查通过
- [ ] 性能指标达标

---

## 参考资料

- [equipment-design.md](../../docs/equipment-design.md)
- [battle-design.md](../../docs/battle-design.md)
