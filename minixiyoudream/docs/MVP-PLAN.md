# MVP（最小可玩版本）开发计划

> 版本：2.0.0
> 更新日期：2026-02-13
> 状态：**MVP 已完成** ✅

---

## 一、MVP 完成状态

### 1.1 核心目标

创建一个**可运行、可游玩、可验证核心玩法**的最小版本：

- ✅ 验证 **6人阵容战斗**（3人物 + 3宠物）
- ✅ 验证 **长线养成循环**（装备/宠物/伙伴）
- ✅ 验证 **移动端体验**（PWA + 触摸操作）

### 1.2 MVP 功能完成状态

| 系统 | 状态 | MVP 包含内容 |
|------|------|--------------|
| 角色系统 | ✅ 完成 | 完整：种族+门派+特性随机 |
| 战斗系统 | ✅ 完成 | 6人阵容，自动/手动切换，倍速 |
| 装备系统 | ✅ 完成 | 9槽位，品质，背包管理 |
| 宠物系统 | ✅ 完成 | 捕捉，等级，资质，出战管理 |
| 伙伴系统 | ✅ 完成 | 3个剧情伙伴，羁绊系统 |
| 地图系统 | ✅ 完成 | 新手村8张地图，传送功能 |
| 副本系统 | ✅ 完成 | 1个普通副本，等级判断 |
| PWA | ✅ 完成 | 离线运行，添加到桌面 |

---

## 二、已完成开发阶段

### Phase 1: 项目初始化 ✅

**完成内容**：
- [x] Vite + React + TypeScript 项目
- [x] Tailwind CSS 4.x 配置
- [x] 路径别名 (@/)
- [x] ESLint 配置
- [x] 目录结构创建
- [x] Preact Signals 配置
- [x] PWA 配置 (vite-plugin-pwa)
- [x] 移动端视口配置

**验收**：✅ 通过

---

### Phase 2: 核心类型定义 ✅

**完成文件**：
```
types/
├── common.ts        ✅ 通用类型
├── race.ts          ✅ 种族
├── faction.ts       ✅ 门派
├── trait.ts         ✅ 特性
├── player.ts        ✅ 玩家
├── companion.ts     ✅ 伙伴
├── pet.ts           ✅ 宠物
├── skill.ts         ✅ 技能
├── battle.ts        ✅ 战斗（6人阵容）
├── equipment.ts     ✅ 装备
├── affix.ts         ✅ 词条
├── map.ts           ✅ 地图
├── dungeon.ts       ✅ 副本
├── enemy.ts         ✅ 怪物
└── item.ts          ✅ 物品
```

**验收**：✅ TypeScript 编译无错误

---

### Phase 3: 基础配置数据 ✅

**完成文件**：
```
constants/
├── races.ts         ✅ 3种族
├── factions.ts      ✅ 12门派
├── traits.ts        ✅ 20+特性
├── skills.ts        ✅ 基础技能
├── pets.ts          ✅ 5种宠物
├── companions.ts    ✅ 3个伙伴
├── maps.ts          ✅ 8张地图
├── dungeons.ts      ✅ 1个副本
├── enemies.ts       ✅ 怪物配置
├── expTable.ts      ✅ 经验表
├── formulas.ts      ✅ 计算公式
├── equipment.ts     ✅ 装备模板
└── items.ts         ✅ 物品模板
```

**验收**：✅ 配置数据可正常导入使用

---

### Phase 4: Signals 状态管理 ✅

**完成文件**：
```
signals/
├── gameSignals.ts       ✅ 游戏全局状态
├── playerSignals.ts     ✅ 玩家状态
├── companionSignals.ts  ✅ 伙伴状态
├── petSignals.ts        ✅ 宠物状态
├── battleSignals.ts     ✅ 战斗状态
├── inventorySignals.ts  ✅ 背包状态
├── uiSignals.ts         ✅ UI状态
└── index.ts             ✅ 统一导出
```

**验收**：✅ Signals 可正常读写，组件可订阅变化

---

### Phase 5: 工具函数 ✅

**完成文件**：
```
utils/
├── prng.ts              ✅ PRNG随机数
├── helpers.ts           ✅ 通用工具
└── index.ts             ✅ 统一导出
```

**验收**：✅ 核心函数正常工作

---

### Phase 6: 角色创建界面 ✅

**完成流程**：
1. ✅ 输入名称
2. ✅ 选择种族（3选1）
3. ✅ 选择门派（根据种族过滤）
4. ✅ 随机特性（3个，可重随）
5. ✅ 确认创建 → 进入游戏

**组件**：
```
components/character/
└── CharacterCreation.tsx  ✅ 完整流程
```

**验收**：✅ 完整流程可走完

---

### Phase 7: 主界面与布局 ✅

**完成功能**：
- ✅ 顶部状态栏（名称、等级、金币）
- ✅ HP/MP 状态条
- ✅ 侧边栏菜单
- ✅ 底部导航栏
- ✅ 主内容区域

**组件**：
```
components/layout/
└── GameLayout.tsx  ✅ 完整布局
```

**验收**：✅ 移动端布局正确

---

### Phase 8: 战斗系统 ✅

**完成功能**：
- ✅ 6人阵容显示（3人物+3宠物 vs 敌人）
- ✅ 速度排序行动队列
- ✅ 手动选择攻击目标
- ✅ 伤害计算与显示
- ✅ 战斗日志
- ✅ 自动/手动切换
- ✅ 1x/2x/3x倍速
- ✅ 战斗结束结算

**组件**：
```
components/battle/
├── BattleLayout.tsx   ✅ 战斗主场景
├── BattleUnit.tsx     ✅ 单位显示
├── BattleLog.tsx      ✅ 战斗日志
├── BattleActions.tsx  ✅ 操作按钮
└── index.ts           ✅ 导出
```

**验收**：✅ 战斗流程正常

---

### Phase 9: 装备系统 ✅

**完成功能**：
- ✅ 装备槽位显示
- ✅ 装备穿戴/卸下
- ✅ 背包物品管理
- ✅ 物品详情弹窗

**组件**：
```
components/inventory/
├── InventoryPage.tsx    ✅ 背包页面
├── EquipmentDetail.tsx  ✅ 装备详情
└── index.ts             ✅ 导出
```

**验收**：✅ 装备功能正常

---

### Phase 10: 宠物系统 ✅

**完成功能**：
- ✅ 宠物列表管理
- ✅ 宠物出战/休息
- ✅ 宠物资质显示
- ✅ 宠物详情弹窗

**组件**：
```
components/pet/
├── PetPage.tsx    ✅ 宠物页面
├── PetDetail.tsx  ✅ 宠物详情
└── index.ts       ✅ 导出
```

**验收**：✅ 宠物功能正常

---

### Phase 11: 伙伴系统 ✅

**完成功能**：
- ✅ 伙伴解锁显示
- ✅ 伙伴上阵（最多2个）
- ✅ 伙伴详情显示
- ✅ 好感度显示

**组件**：
```
components/companion/
├── CompanionPage.tsx    ✅ 伙伴页面
├── CompanionDetail.tsx  ✅ 伙伴详情
└── index.ts             ✅ 导出
```

**验收**：✅ 伙伴功能正常

---

### Phase 12: 地图系统 ✅

**完成功能**：
- ✅ 地图列表显示
- ✅ 当前位置标识
- ✅ 地图传送功能

**组件**：
```
components/map/
├── MapPage.tsx  ✅ 地图页面
└── index.ts     ✅ 导出
```

**验收**：✅ 地图功能正常

---

### Phase 13: 副本系统 ✅

**完成功能**：
- ✅ 副本列表显示
- ✅ 进入条件判断
- ✅ 进入战斗功能

**组件**：
```
components/dungeon/
├── DungeonPage.tsx  ✅ 副本页面
└── index.ts         ✅ 导出
```

**验收**：✅ 副本功能正常

---

## 三、项目结构（已实现）

```
minixiyoudream/
├── src/
│   ├── components/
│   │   ├── battle/       ✅ 战斗界面
│   │   ├── character/    ✅ 角色创建
│   │   ├── companion/    ✅ 伙伴系统
│   │   ├── dungeon/      ✅ 副本系统
│   │   ├── inventory/    ✅ 背包装备
│   │   ├── layout/       ✅ 主布局
│   │   ├── map/          ✅ 地图系统
│   │   └── pet/          ✅ 宠物系统
│   ├── constants/        ✅ 配置数据
│   ├── signals/          ✅ 状态管理
│   ├── types/            ✅ 类型定义
│   └── utils/            ✅ 工具函数
└── dist/                 ✅ 构建输出
```

---

## 四、启动命令

```bash
# 开发模式
cd minixiyoudream
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

---

## 五、MVP 后续迭代计划

| 迭代 | 内容 | 优先级 | 状态 |
|------|------|--------|------|
| 迭代1 | 完善词条系统（条件触发、特殊效果） | 高 | 待开发 |
| 迭代2 | 装备强化系统 | 高 | 待开发 |
| 迭代3 | 合宠系统 | 高 | 待开发 |
| 迭代4 | 打书系统 | 高 | 待开发 |
| 迭代5 | 存档系统（Dexie.js） | 高 | 待开发 |
| 迭代6 | 伙伴装备系统 | 中 | 待开发 |
| 迭代7 | 扩展地图和副本 | 中 | 待开发 |
| 迭代8 | 阵法系统 | 中 | 待开发 |
| 迭代9 | 修炼系统 | 低 | 待开发 |
| 迭代10 | 成就系统 | 低 | 待开发 |

---

## 六、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 根据spec.md重新规划 |
| 2.0.0 | 2026-02-13 | **MVP 完成**，所有核心系统可用 |
