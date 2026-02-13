# 实现计划: 存档系统

**分支**: `005-save-system` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

使用 Dexie.js 实现存档系统，支持多存档、自动存档和数据迁移。

---

## 技术上下文

| 属性 | 描述 |
|------|------|
| **存储方案** | IndexedDB (Dexie.js 4.x) |
| **存档上限** | 5个 |
| **自动存档间隔** | 关键事件触发 |

---

## 项目结构

```text
src/
├── db/
│   ├── index.ts              # Dexie 数据库配置
│   ├── schemas.ts            # 存档数据结构
│   └── migrations.ts         # 数据迁移
├── services/
│   └── saveService.ts        # 存档服务
├── components/
│   └── menu/
│       └── SaveLoadModal.tsx # 存档界面
└── hooks/
    └── useAutoSave.ts        # 自动存档 Hook
```

---

## 核心设计

### 数据库结构

```typescript
import Dexie, { Table } from 'dexie';

interface SaveData {
  id?: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  data: {
    player: Player;
    inventory: Inventory;
    pets: Pet[];
    companions: Companion[];
    gameProgress: GameProgress;
  };
}

class GameDatabase extends Dexie {
  saves!: Table<SaveData>;

  constructor() {
    super('MiniXiyouDream');
    this.version(1).stores({
      saves: '++id, name, updatedAt'
    });
  }
}

export const db = new GameDatabase();
```

### 存档服务

```typescript
export const saveService = {
  async save(name: string, data: SaveData['data']): Promise<number>;
  async load(id: number): Promise<SaveData | undefined>;
  async list(): Promise<SaveData[]>;
  async delete(id: number): Promise<void>;
  async quickSave(): Promise<void>;
  async autoSave(data: SaveData['data']): Promise<void>;
};
```

---

## 验收标准

- [ ] 存档保存正确
- [ ] 存档加载正确
- [ ] 多存档支持正常
- [ ] 自动存档正常
- [ ] 数据迁移支持
