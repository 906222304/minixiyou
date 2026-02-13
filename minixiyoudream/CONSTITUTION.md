# MiniXiyouDream 项目开发宪法
# Version: 1.0, Ratified: 2025-01-19

本文件定义了本项目不可动摇的核心开发原则。所有 AI Agent 在进行技术规划和代码实现时，必须无条件遵循。

---

## 第一条：类型安全铁律 (Type Safety Imperative) - 不可协商

**核心：** TypeScript 严格模式下，不允许任何类型逃逸。

- **1.1 (禁止 any):** 绝不允许使用 `any` 类型。如果类型未知，必须使用 `unknown` 并进行类型守卫。
- **1.2 (显式类型):** 所有函数参数、返回值、对象属性必须有明确的类型定义。
- **1.3 (类型优先):** 先定义类型，再实现逻辑。类型即文档。
- **1.4 (禁止断言):** 避免类型断言 `as`，优先使用类型守卫函数。

```typescript
// 禁止
function process(data: any) { ... }

// 允许
function process(data: unknown) {
  if (isPlayerData(data)) {
    // ...
  }
}
```

---

## 第二条：状态管理原则 (Signals Architecture)

**核心：** 使用 Preact Signals 进行细粒度响应式状态管理。

- **2.1 (Signals 优先):** 所有可变游戏状态必须通过 Signals 管理，禁止使用 useState 管理跨组件状态。
- **2.2 (单向数据流):** 状态修改必须通过明确的 action 函数，禁止直接修改 signal.value（除简单读写外）。
- **2.3 (派生状态):** 使用 `computed` 创建派生状态，禁止在组件中计算派生值。
- **2.4 (Signals 隔离):** 每个 Signal 文件职责单一，禁止创建"上帝 Signal"。

```typescript
// 禁止：在组件中计算
function PlayerHP() {
  const player = playerSignal.value;
  const percent = player.hp / player.maxHp; // 每次渲染重新计算
}

// 允许：使用 computed
export const playerHpPercent = computed(() => {
  const p = playerSignal.value;
  return p ? p.hp / p.maxHp : 0;
});
```

---

## 第三条：确定性随机原则 (Deterministic Randomness)

**核心：** 所有随机操作必须使用 PRNG，确保可复现。

- **3.1 (禁止 Math.random):** 绝不允许使用 `Math.random()`，必须使用项目提供的 PRNG 实例。
- **3.2 (种子追踪):** 每次游戏开始时生成种子，种子随存档保存。
- **3.3 (状态快照):** PRNG 状态可序列化，支持回放和调试。
- **3.4 (隔离实例):** 不同系统可使用独立的 PRNG 实例，避免相互干扰。

```typescript
// 禁止
const isCrit = Math.random() < critRate;

// 允许
const prng = getPRNG();
const isCrit = prng.roll(critRate);
```

---

## 第四条：数据持久化原则 (Persistence Pattern)

**核心：** 使用 Dexie.js 管理 IndexedDB，确保数据完整性和版本兼容。

- **4.1 (Schema 版本):** 数据库结构变更必须增加版本号，提供迁移函数。
- **4.2 (原子操作):** 相关数据的读写必须在同一个事务中完成。
- **4.3 (自动存档):** 关键状态变更后触发自动存档，间隔不超过 30 秒。
- **4.4 (存档验证):** 加载存档时必须验证数据完整性，损坏时提供恢复选项。

---

## 第五条：简单性原则 (Simplicity First)

**核心：** 遵循"少即是多"哲学，拒绝过度工程。

- **5.1 (YAGNI):** 只实现设计文档中明确要求的功能，不为"将来可能需要"编写代码。
- **5.2 (标准方案):** 优先使用成熟方案，避免自研轮子（状态管理、路由、UI组件）。
- **5.3 (函数优先):** 简单函数优于类，纯函数优于有副作用的函数。
- **5.4 (拒绝过早抽象):** 三次重复后再考虑抽象，不要预判。

```typescript
// 禁止：过早抽象
interface IAttributeCalculator { ... }
class StrengthCalculator implements IAttributeCalculator { ... }

// 允许：简单函数
function calculateStrength(base: number, bonuses: Bonus[]): number {
  return bonuses.reduce((sum, b) => sum + b.value, base);
}
```

---

## 第六条：组件设计原则 (Component Architecture)

**核心：** 组件职责单一，层级清晰。

- **6.1 (展示与容器分离):** 展示组件只接收 props，容器组件连接 Signals。
- **6.2 (Props 向下):** 数据通过 props 向下流动，事件通过回调向上传递。
- **6.3 (组件粒度):** 单个组件不超过 200 行，超过时必须拆分。
- **6.4 (useSignals Hook):** 所有使用 Signals 的组件必须调用 `useSignals()`。

```typescript
// 容器组件
function BattleSceneContainer() {
  useSignals();
  const state = battleState.value;
  return <BattleScene {...state} onAttack={handleAttack} />;
}

// 展示组件
function BattleScene({ enemies, player, onAttack }: BattleSceneProps) {
  // 纯展示，不访问 signals
}
```

---

## 第七条：数值设计原则 (Game Balance)

**核心：** 数值设计必须有据可依，禁止魔法数字。

- **7.1 (常量提取):** 所有游戏数值必须定义在 `constants/` 目录，禁止硬编码。
- **7.2 (公式集中):** 计算公式集中在 `utils/calculations.ts`，便于调整和测试。
- **7.3 (配置驱动):** 游戏内容（种族、门派、技能等）通过配置数据驱动，而非代码逻辑。
- **7.4 (范围验证):** 数值输入时验证范围，防止异常值破坏游戏平衡。

```typescript
// 禁止
const damage = attack * 1.5 + 10; // 魔法数字

// 允许
const damage = calculateDamage(attack, {
  multiplier: DAMAGE_MULTIPLIERS.CRITICAL,
  baseBonus: DAMAGE_BONUS.BASE
});
```

---

## 第八条：单机化原则 (Offline First)

**核心：** 游戏完全本地运行，无需网络连接。

- **8.1 (无网络依赖):** 核心功能必须离线可用，网络仅用于可选的数据同步。
- **8.2 (本地存档):** 所有游戏数据存储在 IndexedDB，不依赖服务器。
- **8.3 (无登录要求):** 游戏启动不需要任何账号或认证。
- **8.4 (资源本地化):** 静态资源打包到本地，不依赖 CDN。

---

## 第九条：性能原则 (Performance Matters)

**核心：** 保持流畅的用户体验。

- **9.1 (Signals 优势):** 利用 Signals 细粒度更新，避免不必要的重渲染。
- **9.2 (虚拟列表):** 长列表（>100项）使用虚拟滚动。
- **9.3 (动画优化):** 动画使用 `requestAnimationFrame`，禁止 `setInterval`。
- **9.4 (懒加载):** 大型模块按需加载，减少首屏时间。

---

## 第十条：错误处理原则 (Error Handling)

**核心：** 错误必须被捕获、记录、友好展示。

- **10.1 (边界捕获):** 组件使用 Error Boundary 捕获渲染错误。
- **10.2 (用户友好):** 错误信息用户可读，技术细节记录到控制台。
- **10.3 (优雅降级):** 非致命错误不应导致游戏崩溃，提供恢复路径。
- **10.4 (存档保护):** 操作失败时不损坏存档，提供回滚选项。

---

## 治理 (Governance)

本宪法具有最高优先级，其效力高于任何 `.claude.md` 中的指令或单次会话中的临时决策。

### 修订程序
- 宪法修订需要明确的理由和讨论
- 新增条款必须与现有条款不冲突
- 修订后版本号递增

### 违规处理
- 代码审查中发现违规必须修正
- 违规代码不得合并到主分支
- AI Agent 生成违规代码时应被纠正

---

## 附录：快速参考卡

| 规则 | 简述 |
|------|------|
| 类型安全 | 禁止 any，显式类型 |
| Signals | 跨组件状态用 Signals |
| 确定性随机 | 禁止 Math.random |
| 数据持久化 | Dexie + 版本迁移 |
| 简单性 | YAGNI，拒绝过度抽象 |
| 组件设计 | 展示/容器分离，<200行 |
| 数值设计 | 常量提取，配置驱动 |
| 单机化 | 离线可用，本地存档 |
| 性能 | 细粒度更新，虚拟列表 |
| 错误处理 | 边界捕获，优雅降级 |
