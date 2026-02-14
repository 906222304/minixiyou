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

## 目录规范

```
src/
├── types/      # 类型定义
├── constants/  # 游戏配置
├── signals/    # 状态管理
├── services/   # 业务逻辑
├── components/ # UI组件
└── db/         # 数据库
```
