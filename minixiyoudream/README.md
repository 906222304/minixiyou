# MiniXiyouDream 梦幻西游

> 西游题材单机文字 RPG 游戏
> 版本：2.0.0 (MVP)

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 功能特性

- **角色系统**：3种族、12门派、特性随机
- **战斗系统**：6人阵容（3人物+3宠物）、自动/手动、倍速
- **装备系统**：9槽位、品质、背包管理
- **宠物系统**：捕捉、资质、出战管理
- **伙伴系统**：3个剧情伙伴、羁绊效果
- **地图系统**：8张新手村地图
- **副本系统**：东海龙宫副本
- **PWA支持**：离线运行、添加到桌面

## 技术栈

- React 19 + TypeScript 5.8
- Vite 6 + Tailwind CSS 4
- Preact Signals 状态管理
- vite-plugin-pwa 离线支持

## 项目结构

```
src/
├── components/    # UI组件
├── constants/     # 游戏配置
├── signals/       # 状态管理
├── types/         # 类型定义
└── utils/         # 工具函数
```

## 文档

- [产品规格](docs/spec.md)
- [架构文档](docs/ARCHITECTURE.md)
- [MVP计划](docs/MVP-PLAN.md)
- [战斗设计](docs/battle-design.md)
- [宠物设计](docs/pet-design.md)
- [伙伴设计](docs/companion-design.md)

## 开发状态

**MVP 已完成** ✅

后续迭代计划：
- 存档系统（Dexie.js）
- 装备强化
- 合宠/打书
- 伙伴装备
- 词条系统完善

## License

MIT
