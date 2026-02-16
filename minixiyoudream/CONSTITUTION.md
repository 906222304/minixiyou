# MiniXiyouDream 开发规范

## 核心规则

| 规则 | 约束 |
|------|------|
| 类型安全 | 禁止 `any`，显式类型定义 |
| 状态管理 | 使用 Preact Signals，禁止 useState 管理全局状态 |
| 随机数 | 使用 PRNG，禁止 `Math.random()` |
| 数据存储 | 使用 Dexie.js (IndexedDB) |
| 数值设计 | 配置驱动，禁止硬编码魔法数字 |
| 组件设计 | 单文件 < 200 行 |
| 单机优先 | 离线可用，本地存档 |

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI框架 |
| TypeScript | 5.8.x | 类型安全 |
| Vite | 6.x | 构建工具 |
| Preact Signals | 2.x | 状态管理 |
| Dexie.js | 4.x | 本地存储 |
| Tailwind CSS | 4.x | 样式系统 |
| Capacitor | 7.x | 移动端打包 |

## 目录规范

```
src/
├── types/      # 类型定义
├── constants/  # 游戏配置
├── signals/    # 状态管理
├── services/   # 业务逻辑
├── components/ # UI组件
├── db/         # 数据库
└── styles/     # 全局样式
```

## ID 命名规范

| 类型 | 前缀 | 示例 |
|------|------|------|
| 物品 | `item_` | `item_potion_hp` |
| 敌人 | `enemy_` | `enemy_bandit` |
| 可捕捉宠物 | `enemy_pet_` | `enemy_pet_firespirit` |
| 宠物 | `pet_` | `pet_firespirit` |
| 地图 | `map_` | `map_changan` |
| 任务 | `main_`/`daily_` | `main_1_1` |
| 门派 | `faction_` | `faction_datang` |
| 技能 | `skill_` | `skill_hengsao` |
| 特性 | `trait_` | `trait_brave` |
| 种族 | `race_` | `race_human` |
| 套装 | `set_` | `set_flame` |

## 五行系统

```
相克关系：金克木 → 木克土 → 土克水 → 水克火 → 火克金
元素属性：metal, wood, water, fire, earth
抗性加成：本系+20%，被克系-20%
```

## 已实现功能

- 角色创建（门派、种族、特性选择）
- 回合制战斗系统
- 五行属性与相克
- 宠物捕捉与培养
- 装备强化与锻造
- 剧情任务系统
- 成就系统
- 伙伴系统
- 移动端适配（Capacitor）

## UI 颜色对比度规范

### 常见问题与陷阱

1. **品质颜色问题**
   - 问题：普通品质(common)颜色为 `#FFFFFF`(白色)，在浅色背景上完全不可见
   - 解决：使用深色如 `#4b5563`(灰色) 替代白色
   - 位置：`src/utils/helpers.ts` - `QUALITY_COLORS`

2. **透明背景问题**
   - 问题：`bg-black/30`, `bg-black/40` 等透明黑色背景在浅色主题下对比度极低
   - 解决：使用纯色背景如 `bg-slate-100`, `bg-slate-200`
   - 影响组件：所有面板、卡片、按钮背景

3. **文字颜色与背景冲突**
   - 问题：`text-white` 在浅色背景上不可见
   - 解决：浅色背景使用 `text-[var(--game-text)]` 或 `text-slate-700`

### 推荐的颜色组合

| 场景 | 背景色 | 文字色 |
|------|--------|--------|
| 默认背景 | `bg-slate-100` | `text-[var(--game-text)]` |
| 悬停状态 | `bg-slate-200` | 同上 |
| 激活状态 | `bg-slate-300` | 同上 |
| 进度条背景 | `bg-slate-200` | - |
| 成功状态 | `bg-green-100` | `text-green-700` |
| 警告状态 | `bg-amber-100` | `text-amber-700` |
| 信息状态 | `bg-blue-100` | `text-blue-700` |

### 品质颜色对照表

| 品质 | 颜色值 | 说明 |
|------|--------|------|
| common | `#4b5563` | 深灰色，浅色背景可见 |
| rare | `#0070DD` | 蓝色 |
| epic | `#A335EE` | 紫色 |
| legendary | `#FF8000` | 橙色 |
| mythic | `#E6CC80` | 金色 |

### 检查清单

- [ ] 所有 `#FFFFFF` 文字是否在深色背景上使用？
- [ ] 所有 `text-white` 是否在深色背景上使用？
- [ ] 所有 `bg-black/XX` 是否已替换为纯色背景？
- [ ] 品质颜色是否在浅色背景上可见？
- [ ] 进度条背景是否使用 `bg-slate-200`？
- [ ] 状态徽章是否使用高对比度组合（如 `bg-*-100 text-*-700`）？
