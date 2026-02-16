# MiniXiyouDream 项目宪法

> 迷你西游梦 - 西游题材单机文字 RPG 游戏开发规范

## 核心原则

### 1. 类型安全
- 禁止使用 `any` 类型
- 所有变量、函数参数、返回值必须有显式类型定义
- 使用 TypeScript 5.8+ 严格模式

### 2. 状态管理
- 全局状态必须使用 Preact Signals
- 禁止使用 useState 管理跨组件状态
- 组件内局部状态可使用 useState

### 3. 随机数生成
- 必须使用 PRNG（伪随机数生成器）
- 禁止直接使用 `Math.random()`
- 确保游戏结果可复现

### 4. 数据持久化
- 使用 Dexie.js (IndexedDB) 存储游戏数据
- 支持离线游戏体验
- 实现自动存档机制

### 5. 配置驱动
- 游戏数值必须配置化
- 禁止硬编码魔法数字
- 所有配置数据放在 `src/constants/`

### 6. 组件设计
- 单文件代码不超过 200 行
- 超过 200 行必须拆分
- 组件职责单一

### 7. 单机优先
- 离线可用
- 本地存档
- 无需网络连接

## 技术栈约束

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 语言 | TypeScript | 5.8.x |
| 构建 | Vite | 6.x |
| 状态 | Preact Signals | 2.x |
| 存储 | Dexie.js | 4.x |
| 样式 | Tailwind CSS | 4.x |
| 移动端 | Capacitor | 7.x |

## 目录规范

```
src/
├── types/          # TypeScript 类型定义
├── constants/      # 游戏配置数据
├── signals/        # Preact Signals 状态管理
├── services/       # 业务逻辑服务层
├── components/     # React 组件
├── db/             # Dexie.js 数据库
└── styles/         # 全局样式
```

## 五行系统

### 相克关系
```
金克木 → 木克土 → 土克水 → 水克火 → 火克金
```

### 元素类型
- `metal` 金系
- `wood` 木系
- `water` 水系
- `fire` 火系
- `earth` 土系

### 抗性规则
- 本系技能抗性 +20%
- 被克系技能抗性 -20%
- 其他系技能抗性 0%

## 开发工作流

### 阶段 1: 需求分析 (Specify)
- 编写功能规格文档 (spec.md)
- 定义用户故事和验收标准
- 识别依赖关系

### 阶段 2: 技术规划 (Plan)
- 设计技术方案
- 确定文件结构和模块划分
- 评估风险点

### 阶段 3: 任务分解 (Tasks)
- 将计划拆分为可执行任务
- 每个任务独立可测试
- 标注优先级

### 阶段 4: 实现 (Implement)
- 按任务顺序编码
- 遵循代码规范
- 编写类型定义

### 阶段 5: 测试验证 (Test)
- TypeScript 类型检查
- 功能测试
- 边界条件验证

### 阶段 6: 维护更新 (Maintain)
- 更新相关文档
- 同步规格文档
- 版本控制

## 命名约定

### 文件命名
- 组件: PascalCase (如 `BattlePage.tsx`)
- 服务: camelCase + Service (如 `battleService.ts`)
- 类型: camelCase (如 `battle.ts`)
- 常量: camelCase (如 `enemies.ts`)

### 变量命名
- 常量: UPPER_SNAKE_CASE
- 变量/函数: camelCase
- 类型/接口: PascalCase
- 私有成员: 前缀 _

### ID 命名
- 物品: `item_` 前缀 (如 `item_potion_hp`)
- 敌人: `enemy_` 前缀 (如 `enemy_bandit`)
- 可捕捉宠物敌人: `enemy_pet_` 前缀 (如 `enemy_pet_firespirit`)
- 宠物: `pet_` 前缀 (如 `pet_firespirit`)
- 地图: `map_` 前缀 (如 `map_changan`)
- 任务: `main_` / `daily_` 前缀
- 门派: `faction_` 前缀 (如 `faction_datang`)
- 技能: `skill_` 前缀 (如 `skill_hengsao`)
- 特性: `trait_` 前缀 (如 `trait_brave`)
- 种族: `race_` 前缀 (如 `race_human`)
- 套装: `set_` 前缀 (如 `set_flame`)

## 禁止事项

1. 禁止在生产代码中使用 `console.log`
2. 禁止提交未使用的代码
3. 禁止绕过类型检查
4. 禁止直接修改全局状态
5. 禁止在组件中直接访问数据库

## 检查清单

每次提交前检查:

- [ ] TypeScript 编译无错误 (`npx tsc --noEmit`)
- [ ] 无 eslint 警告
- [ ] 代码格式化正确
- [ ] 新功能有对应类型定义
- [ ] 遵循 200 行限制
