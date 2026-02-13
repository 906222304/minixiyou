# MiniXiyouDream 开发技能

## 项目概述
- **名称**: MiniXiyouDream (梦幻西游单机版)
- **类型**: 单机文字RPG游戏（西游题材）
- **技术栈**: React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 + Preact Signals + Dexie.js + PWA
- **状态**: MVP 已完成，进入迭代开发阶段

---

## 开发规范

### 命名约定
| 类型 | 命名风格 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `BattleScene.tsx` |
| 函数 | camelCase | `calculateDamage()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_SAVE_SLOTS` |
| 类型/接口 | PascalCase | `PlayerStats` |
| Signal | camelCase | `playerStats` |
| 文件 | PascalCase (组件) / camelCase (工具) | `BattleUtils.ts` |

### Git 提交规范
```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

### 目录结构
```
minixiyoudream/
├── src/
│   ├── types/         # 类型定义
│   ├── constants/     # 游戏常量/配置数据
│   ├── signals/       # Preact Signals 状态
│   ├── db/            # Dexie.js 数据库
│   ├── utils/         # 工具函数
│   ├── hooks/         # React Hooks
│   ├── services/      # 业务服务
│   └── components/    # React 组件
│       ├── common/    # 通用组件
│       ├── layout/    # 布局组件
│       ├── character/ # 角色创建
│       ├── player/    # 玩家相关
│       ├── companion/ # 伙伴相关
│       ├── battle/    # 战斗相关
│       ├── inventory/ # 背包相关
│       ├── map/       # 地图相关
│       ├── pet/       # 宠物相关
│       └── dungeon/   # 副本相关
├── docs/              # 设计文档
└── specs/             # 迭代规范（Spec-Driven Development）
```

---

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式（支持局域网访问）
pnpm dev --host

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 构建
pnpm build

# 预览
pnpm preview
```

---

## 设计文档索引

### 核心文档
| 文档 | 说明 |
|------|------|
| [spec.md](../minixiyoudream/docs/spec.md) | 产品需求规格 |
| [ARCHITECTURE.md](../minixiyoudream/docs/ARCHITECTURE.md) | 技术架构文档 |
| [MVP-PLAN.md](../minixiyoudream/docs/MVP-PLAN.md) | MVP开发计划 |

### 系统设计
| 文档 | 说明 |
|------|------|
| [battle-design.md](../minixiyoudream/docs/battle-design.md) | 战斗系统设计 |
| [battle-attributes-design.md](../minixiyoudream/docs/battle-attributes-design.md) | 战斗属性详细设计 |
| [equipment-design.md](../minixiyoudream/docs/equipment-design.md) | 装备系统设计 |
| [pet-design.md](../minixiyoudream/docs/pet-design.md) | 宠物系统设计 |
| [companion-design.md](../minixiyoudream/docs/companion-design.md) | 伙伴系统设计 |
| [map-design.md](../minixiyoudream/docs/map-design.md) | 地图系统设计 |
| [dungeon-design.md](../minixiyoudream/docs/dungeon-design.md) | 副本系统设计 |

### 基础配置
| 文档 | 说明 |
|------|------|
| [character-design.md](../minixiyoudream/docs/character-design.md) | 角色系统设计 |
| [faction-design.md](../minixiyoudream/docs/faction-design.md) | 门派设计 |
| [trait-design.md](../minixiyoudream/docs/trait-design.md) | 特性设计 |

---

## 迭代开发规范 (Specs)

项目采用 **Spec-Driven Development** 方法论，每个迭代包含三个规范文件：

| 迭代 | 功能 | 优先级 | 状态 |
|------|------|--------|------|
| [001](../minixiyoudream/specs/001-affix-system-enhancement/) | 完善词条系统 | 高 | 待开发 |
| [002](../minixiyoudream/specs/002-equipment-enhancement/) | 装备强化系统 | 高 | 待开发 |
| [003](../minixiyoudream/specs/003-pet-fusion/) | 合宠系统 | 高 | 待开发 |
| [004](../minixiyoudream/specs/004-pet-skill-learning/) | 打书系统 | 高 | 待开发 |
| [005](../minixiyoudream/specs/005-save-system/) | 存档系统 | 高 | 待开发 |
| [006](../minixiyoudream/specs/006-companion-equipment/) | 伙伴装备系统 | 中 | 待开发 |
| [007](../minixiyoudream/specs/007-map-dungeon-expansion/) | 扩展地图和副本 | 中 | 待开发 |
| [008](../minixiyoudream/specs/008-formation-system/) | 阵法系统 | 中 | 待开发 |
| [009](../minixiyoudream/specs/009-cultivation-system/) | 修炼系统 | 低 | 待开发 |
| [010](../minixiyoudream/specs/010-achievement-system/) | 成就系统 | 低 | 待开发 |

### 规范文件结构
每个迭代目录包含：
- **spec.md** - 功能规范（用户故事、验收场景、需求）
- **plan.md** - 实现计划（技术上下文、核心设计）
- **tasks.md** - 任务清单（分阶段任务、依赖关系）

---

## 开发工作流

### 开始新迭代
1. 阅读 `specs/{迭代号}/spec.md` 了解需求
2. 阅读 `specs/{迭代号}/plan.md` 了解技术方案
3. 按照 `specs/{迭代号}/tasks.md` 执行任务

### 完成任务后
1. 更新 tasks.md 勾选完成的任务
2. 确保通过 TypeScript 编译
3. 提交代码时引用任务ID

### 代码审查要点
- 类型安全（无 any）
- 组件复用（不重复造轮子）
- 状态管理（使用 Signals）
- 移动端适配（响应式设计）
