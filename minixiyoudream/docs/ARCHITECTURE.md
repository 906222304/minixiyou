# MiniXiyouDream 技术架构文档

> 版本：2.0.0
> 更新日期：2026-02-13
> 状态：**MVP 已完成** ✅

---

## 一、项目概述

### 1.1 项目目标

创建一个西游题材的单机文字 RPG 游戏，采用现代化前端技术栈，实现：

- **长线养成**：宠物 + 装备 + 伙伴 三位一体养成系统
- **策略战斗**：6人阵容（3人物+3宠物）回合制战斗
- **Build深度**：装备词条 + 伙伴羁绊 + 门派技能 + 特性 + 阵容搭配
- **移动优先**：手机网页端为主，支持PWA离线运行

### 1.2 核心技术原则

| 原则 | 说明 | 状态 |
|------|------|------|
| **单机化** | 无需服务器，纯前端运行 | ✅ |
| **确定性随机** | PRNG种子控制（Mulberry32） | ✅ |
| **响应式更新** | Preact Signals 细粒度响应 | ✅ |
| **移动优先** | 触摸友好，PWA支持 | ✅ |
| **类型安全** | TypeScript 严格模式 | ✅ |

---

## 二、技术栈（已实现）

| 类别 | 技术 | 版本 | 状态 |
|------|------|------|------|
| **框架** | React | 19.x | ✅ |
| **语言** | TypeScript | 5.8.x | ✅ |
| **构建** | Vite | 6.x | ✅ |
| **状态** | @preact/signals-react | 2.x | ✅ |
| **样式** | Tailwind CSS | 4.x | ✅ |
| **图标** | Lucide React | latest | ✅ |
| **存储** | Dexie.js | 4.x | 📋 待集成 |
| **随机数** | 自定义 PRNG | - | ✅ |
| **PWA** | vite-plugin-pwa | latest | ✅ |

---

## 三、目录结构（已实现）

```
minixiyoudream/
├── docs/                          # 设计文档
│   ├── spec.md                    # 产品需求规格
│   ├── ARCHITECTURE.md            # 本文档
│   ├── MVP-PLAN.md                # MVP开发计划
│   ├── battle-design.md           # 战斗设计
│   ├── pet-design.md              # 宠物设计
│   └── companion-design.md        # 伙伴设计
│
├── src/
│   ├── main.tsx                   # 入口文件
│   ├── App.tsx                    # 根组件
│   ├── globals.css                # 全局样式
│   │
│   ├── types/                     # 类型定义 ✅
│   │   ├── index.ts
│   │   ├── common.ts
│   │   ├── race.ts
│   │   ├── faction.ts
│   │   ├── trait.ts
│   │   ├── player.ts
│   │   ├── companion.ts
│   │   ├── skill.ts
│   │   ├── battle.ts
│   │   ├── equipment.ts
│   │   ├── affix.ts
│   │   ├── pet.ts
│   │   ├── map.ts
│   │   ├── dungeon.ts
│   │   ├── enemy.ts
│   │   └── item.ts
│   │
│   ├── constants/                 # 游戏配置 ✅
│   │   ├── races.ts
│   │   ├── factions.ts
│   │   ├── traits.ts
│   │   ├── skills.ts
│   │   ├── pets.ts
│   │   ├── companions.ts
│   │   ├── maps.ts
│   │   ├── dungeons.ts
│   │   ├── enemies.ts
│   │   ├── expTable.ts
│   │   ├── formulas.ts
│   │   ├── equipment.ts
│   │   └── items.ts
│   │
│   ├── signals/                   # 状态管理 ✅
│   │   ├── index.ts
│   │   ├── gameSignals.ts
│   │   ├── playerSignals.ts
│   │   ├── companionSignals.ts
│   │   ├── petSignals.ts
│   │   ├── battleSignals.ts
│   │   ├── inventorySignals.ts
│   │   └── uiSignals.ts
│   │
│   ├── utils/                     # 工具函数 ✅
│   │   ├── index.ts
│   │   ├── prng.ts
│   │   └── helpers.ts
│   │
│   └── components/                # React 组件 ✅
│       ├── character/
│       │   └── CharacterCreation.tsx
│       ├── layout/
│       │   └── GameLayout.tsx
│       ├── battle/
│       │   ├── BattleLayout.tsx
│       │   ├── BattleUnit.tsx
│       │   ├── BattleLog.tsx
│       │   └── BattleActions.tsx
│       ├── inventory/
│       │   ├── InventoryPage.tsx
│       │   └── EquipmentDetail.tsx
│       ├── pet/
│       │   ├── PetPage.tsx
│       │   └── PetDetail.tsx
│       ├── companion/
│       │   ├── CompanionPage.tsx
│       │   └── CompanionDetail.tsx
│       ├── map/
│       │   └── MapPage.tsx
│       └── dungeon/
│           └── DungeonPage.tsx
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── postcss.config.js
```

---

## 四、状态管理架构

### 4.1 核心 Signals

```typescript
// 游戏阶段
gamePhase: signal<'menu' | 'creating' | 'playing' | 'battle'>

// 玩家状态
player: signal<Player | null>
playerLevel, playerHp, playerMp, playerGold...

// 战斗状态
battleState: signal<BattleState | null>
battleSpeed: signal<1 | 2 | 3>
isAutoBattle: signal<boolean>

// 宠物状态
playerPets: signal<Pet[]>
activePet: computed(() => Pet | null)

// 伙伴状态
companions: signal<Companion[]>
activeCompanions: computed(() => Companion[])

// 背包状态
inventoryItems: signal<Item[]>
inventoryEquipments: signal<Equipment[]>
equippedSlots: signal<EquipmentSlots>
```

### 4.2 组件使用示例

```tsx
import { useSignals } from '@preact/signals-react/runtime';
import { player, playerHp, playerMaxHp } from '@/signals';

export function PlayerStatus() {
  useSignals();

  const currentPlayer = player.value;
  const hp = playerHp.value;
  const maxHp = playerMaxHp.value;

  return (
    <div>
      <span>{currentPlayer?.name}</span>
      <div>HP: {hp}/{maxHp}</div>
    </div>
  );
}
```

---

## 五、PRNG 随机数系统

```typescript
// utils/prng.ts
export class PRNG {
  constructor(seed: number) { ... }
  next(): number { ... }
  nextInt(min: number, max: number): number { ... }
  roll(chance: number): boolean { ... }
  shuffle<T>(array: T[]): T[] { ... }
}
```

---

## 六、构建配置

### 6.1 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '梦幻西游',
        short_name: '梦幻西游',
        display: 'standalone',
        // ...
      }
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
```

---

## 七、后续迭代计划

| 优先级 | 功能 | 状态 |
|--------|------|------|
| 高 | 存档系统（Dexie.js） | 📋 待开发 |
| 高 | 装备强化系统 | 📋 待开发 |
| 高 | 合宠/打书系统 | 📋 待开发 |
| 中 | 伙伴装备系统 | 📋 待开发 |
| 中 | 词条系统完善 | 📋 待开发 |
| 低 | 阵法系统 | 📋 待开发 |

---

## 八、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 根据spec.md重构 |
| 2.0.0 | 2026-02-13 | **MVP 完成** |
