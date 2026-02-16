# MiniXiyouDream 开发技能

## 项目概述
- **名称**: 迷你西游梦 (MiniXiyouDream)
- **类型**: 单机文字RPG游戏（西游题材，参考梦幻西游）
- **技术栈**: React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 + Preact Signals + Dexie.js + PWA + Capacitor
- **状态**: 核心功能已完成，支持Web和Android平台

---

## 已实现功能

### 核心系统
- [x] 角色系统（5种种族、6大门派、50+特性）
- [x] 五行系统（金木水火土相生相克）
- [x] 战斗系统（回合制、多段攻击、状态效果）
- [x] 宠物系统（捕捉、合宠、打书、技能槽）
- [x] 装备系统（强化、重铸、转移、分解、套装）
- [x] 任务系统（主线剧情、日常任务）
- [x] 成就系统（79个成就、8个称号）
- [x] NPC服务（商店、治疗、传送）
- [x] 地图系统（12章剧情地图）

### 特色功能
- 兽诀打书系统（35+兽诀、技能互斥组）
- 装备套装系统（5大套装）
- 五行元素抗性
- 特性加成实装

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

### ID 前缀约定
| 类型 | 前缀 | 示例 |
|------|------|------|
| 物品 | `item_` | `item_potion_hp` |
| 敌人 | `enemy_` | `enemy_bandit` |
| 宠物 | `pet_` / `enemy_pet_` | `pet_sea_turtle` |
| 地图 | `map_` | `map_changan` |
| 任务 | `main_` / `daily_` | `main_1_1` |
| NPC | `npc_` | `npc_village_chief` |
| 技能 | `skill_` | `skill_fireball` |
| 兽诀 | `scroll_` | `scroll_power_strike` |

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
│   │   ├── skills.ts      # 技能配置
│   │   ├── enemies.ts     # 敌人配置（含五行属性）
│   │   ├── pets.ts        # 宠物配置（含五行属性）
│   │   ├── beastScrolls.ts # 兽诀配置
│   │   ├── sets.ts        # 套装配置
│   │   ├── quests.ts      # 任务配置
│   │   └── achievements.ts # 成就配置
│   ├── signals/       # Preact Signals 状态
│   ├── db/            # Dexie.js 数据库
│   ├── utils/         # 工具函数
│   ├── hooks/         # React Hooks
│   ├── services/      # 业务服务
│   │   ├── traitService.ts    # 特性加成服务
│   │   ├── beastScrollService.ts # 兽诀服务
│   │   ├── questService.ts    # 任务服务
│   │   └── npcService.ts      # NPC服务
│   └── components/    # React 组件
│       ├── common/    # 通用组件
│       ├── layout/    # 布局组件
│       ├── character/ # 角色创建
│       ├── battle/    # 战斗相关
│       ├── inventory/ # 背包相关
│       ├── map/       # 地图相关
│       ├── pet/       # 宠物相关
│       └── quest/     # 任务相关
├── android/           # Capacitor Android 项目
├── docs/              # 设计文档
└── specs/             # 迭代规范
```

---

## 常用命令

```bash
# 安装依赖
npm install

# 开发模式（支持局域网访问）
npm run dev -- --host

# 类型检查
npx tsc --noEmit

# 构建 Web 版本
npm run build

# 预览构建结果
npm run preview

# 同步到 Android
npx cap sync android

# 构建 Android APK（需要 Java 21）
export JAVA_HOME="D:/wokEnvironment/java/jdk-21.0.10"
cd android && ./gradlew.bat assembleDebug

# APK 输出位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 五行系统

### 相克关系
- 金克木 → 木克土 → 土克水 → 水克火 → 火克金

### 元素抗性规则
- 自身属性抗性 +20%
- 被克属性抗性 -20%

---

## 代码审查要点

- 类型安全（无 any）
- 组件复用（不重复造轮子）
- 状态管理（使用 Signals）
- 移动端适配（响应式设计）
- 配置驱动（数值在 constants 中定义）
