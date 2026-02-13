# 项目配置模板说明

本目录包含 MiniXiyouDream 项目的配置文件模板。

## 文件清单

```
templates/
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 构建配置
├── tailwind.config.js    # Tailwind CSS 配置
├── postcss.config.js     # PostCSS 配置
├── eslint.config.js      # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .gitignore            # Git 忽略配置
├── index.html            # HTML 入口
└── src/
    ├── main.tsx          # React 入口
    ├── App.tsx           # 根组件
    ├── vite-env.d.ts     # Vite 类型声明
    ├── styles/
    │   └── globals.css   # 全局样式
    └── signals/
        ├── index.ts      # Signals 导出
        └── gameSignals.ts # 游戏状态
```

## 使用方法

### 方法 1: 手动复制

1. 将 `templates/` 目录下的文件复制到项目根目录
2. 将 `templates/src/` 目录下的文件复制到 `src/` 目录
3. 运行 `pnpm install` 安装依赖
4. 运行 `pnpm dev` 启动开发服务器

### 方法 2: 使用初始化脚本（推荐）

在项目根目录执行以下命令：

```bash
# 创建目录结构
mkdir -p src/{types,constants,signals,utils,db,services,hooks,components/{common,layout,character,player,battle,inventory,map,pet,dungeon},styles}

# 复制配置文件
cp templates/package.json .
cp templates/tsconfig.json .
cp templates/vite.config.ts .
cp templates/tailwind.config.js .
cp templates/postcss.config.js .
cp templates/eslint.config.js .
cp templates/.prettierrc .
cp templates/.gitignore .
cp templates/index.html .

# 复制源文件
cp templates/src/main.tsx src/
cp templates/src/App.tsx src/
cp templates/src/vite-env.d.ts src/
cp -r templates/src/styles src/
cp -r templates/src/signals src/

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 依赖说明

### 生产依赖

| 包名 | 用途 |
|------|------|
| react | React 框架 |
| react-dom | React DOM 渲染 |
| @preact/signals-react | 响应式状态管理 |
| dexie | IndexedDB 封装 |
| dexie-react-hooks | Dexie React Hooks |
| lucide-react | 图标库 |

### 开发依赖

| 包名 | 用途 |
|------|------|
| typescript | TypeScript 编译器 |
| vite | 构建工具 |
| tailwindcss | CSS 框架 |
| eslint | 代码检查 |
| prettier | 代码格式化 |

## 目录结构说明

创建完成后，项目目录结构如下：

```
minixiyoudream/
├── src/
│   ├── types/            # 类型定义
│   ├── constants/        # 游戏配置数据
│   ├── signals/          # Preact Signals
│   ├── utils/            # 工具函数
│   ├── db/               # 数据库
│   ├── services/         # 业务服务
│   ├── hooks/            # React Hooks
│   ├── components/       # React 组件
│   │   ├── common/       # 通用组件
│   │   ├── layout/       # 布局组件
│   │   ├── character/    # 角色相关
│   │   ├── player/       # 玩家相关
│   │   ├── battle/       # 战斗相关
│   │   ├── inventory/    # 背包相关
│   │   ├── map/          # 地图相关
│   │   ├── pet/          # 宠物相关
│   │   └── dungeon/      # 副本相关
│   ├── styles/           # 样式文件
│   ├── main.tsx          # 入口
│   ├── App.tsx           # 根组件
│   └── vite-env.d.ts     # 类型声明
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .prettierrc
└── .gitignore
```

## 开发命令

```bash
# 开发模式
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 下一步

1. 参考 [MVP-PLAN.md](../docs/MVP-PLAN.md) 开始开发
2. 参考 [ARCHITECTURE.md](../docs/ARCHITECTURE.md) 了解架构设计
