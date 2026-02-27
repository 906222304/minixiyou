# Game Balance Skill

游戏数值平衡与调优技能。

## 用途

- 数值系统设计与调整
- 经济系统平衡
- 成长曲线优化
- 伤害公式调优
- 掉落率配置

## 触发词

数值、平衡、经济、成长、伤害公式、掉落、强化概率

## 核心原则

### 数值设计规范

1. **配置驱动** - 所有数值必须在 `constants/` 中配置
2. **公式一致** - 使用 `formulas.ts` 中的统一公式
3. **渐进增长** - 采用指数或幂函数增长，避免线性
4. **风险回报** - 高收益伴随高风险或高成本

### 经济平衡原则

```typescript
// 金币获取公式建议
goldDrop = baseGold * Math.pow(1.15, level) * typeMultiplier

// 等级对应金币示例
Lv.1:  10金
Lv.10: 40金
Lv.30: 660金
Lv.50: 2600金
Lv.80: 13000金
```

### 成长曲线设计

```typescript
// 属性成长公式
stat = baseStat + growthRate * (level - 1) * (1 + qualityBonus)

// 推荐成长率范围
// 基础属性: 1.0 - 1.5
// 战斗属性: 1.5 - 2.5
```

### 概率设计规范

| 类型 | 基础概率 | 上限 |
|------|---------|------|
| 暴击 | 5% | 50% |
| 闪避 | 2% | 40% |
| 掉落 | 1% | 100% |
| 强化 | 100%-5% | - |

### 保底机制

```typescript
// 强化保底示例
interface EnhancementPity {
  currentFailures: number;  // 连续失败次数
  maxPity: number;          // 保底阈值
  pityBonus: number;        // 每次失败增加的概率
}

// +15保底: 连续失败20次必成
```

## 常用公式参考

### 伤害计算

```typescript
// 物理伤害
physicalDamage = Math.max(1, attack - defense) * skillMultiplier * random(0.9, 1.1)

// 法术伤害（含五行克制）
magicDamage = baseDamage * skillMultiplier * elementMultiplier * resistance

// 元素克制倍率
const ELEMENT_MULTIPLIER = {
  counter: 1.3,   // 克制+30%
  countered: 0.8, // 被克-20%
  neutral: 1.0    // 中性100%
};
```

### 经验计算

```typescript
// 升级所需经验
expRequired = Math.floor(100 * Math.pow(1.2, level - 1))

// 怪物经验奖励
expReward = baseExp * (1 + levelDiff * 0.1)
```

## 检查清单

- [ ] 数值是否配置化（非硬编码）
- [ ] 公式是否统一（无重复定义）
- [ ] 成长曲线是否平滑
- [ ] 获取/消耗是否平衡
- [ ] 高难内容是否有足够奖励
- [ ] 是否有保底机制
