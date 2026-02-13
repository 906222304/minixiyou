# 战斗属性详细设计文档

> 版本：1.0.0
> 日期：2026-02-13
> 状态：设计中

---

## 一、战斗属性总览

### 1.1 核心战斗属性

| 属性 | 英文 | 说明 | 计算来源 |
|------|------|------|----------|
| 物理攻击 | physicalAttack | 物理伤害基础 | 力量×2 + 敏捷×0.5 + 等级×2 |
| 物理防御 | physicalDefense | 减少物理伤害 | 体质×1.5 + 力量×0.3 + 等级 |
| 法术攻击 | magicAttack | 法术伤害基础 | 灵力×2.2 + 魔力×0.5 + 等级×2 |
| 法术防御 | magicDefense | 减少法术伤害 | 魔力×1.5 + 灵力×0.3 + 等级 |
| 速度 | speed | 行动顺序 | 敏捷×2 + 等级 |
| 最大HP | maxHp | 生命值上限 | 体质×10 + 力量×2 + 等级×5 + 100 |
| 最大MP | maxMp | 法力值上限 | 魔力×8 + 灵力×2 + 等级×3 + 50 |
| 暴击率 | critRate | 暴击概率 | 5% + 敏捷×0.2% (上限50%) |
| 暴击伤害 | critDamage | 暴击伤害倍率 | 150% + 敏捷×1% |
| 命中率 | hitRate | 命中概率 | 90% + 敏捷×0.1% (上限99%) |
| 闪避率 | dodgeRate | 闪避概率 | 2% + 敏捷×0.2% (上限30%) |

### 1.2 扩展战斗属性

| 属性 | 英文 | 说明 | 默认值 |
|------|------|------|--------|
| 火抗 | fireResistance | 火系伤害减免 | 0% |
| 冰抗 | iceResistance | 冰系伤害减免 | 0% |
| 雷抗 | thunderResistance | 雷系伤害减免 | 0% |
| 物理穿透 | physicalPenetration | 无视物防 | 0 |
| 法术穿透 | magicPenetration | 无视法防 | 0 |
| 吸血 | lifesteal | 攻击回血 | 0% |
| 法术吸血 | spellVamp | 技能回血 | 0% |
| 伤害加成 | damageBonus | 总伤害加成 | 0% |
| 伤害减免 | damageReduction | 受伤减少 | 0% |
| 治疗加成 | healBonus | 治疗效果提升 | 0% |
| 被治疗加成 | healReceived | 被治疗效果 | 0% |

---

## 二、伤害计算公式

### 2.1 物理伤害计算

```typescript
/**
 * 计算物理伤害
 * @param attacker 攻击者属性
 * @param defender 防御者属性
 * @param skillMultiplier 技能倍率
 * @param prng 随机数生成器
 */
function calculatePhysicalDamage(
  attacker: CombatStats,
  defender: CombatStats,
  skillMultiplier: number,
  prng: PRNG
): DamageResult {
  // 1. 基础伤害 = 物攻 - 物防（最小为1）
  const baseDamage = Math.max(1, attacker.physicalAttack - defender.physicalDefense);

  // 2. 应用穿透
  const penDefense = Math.max(0, defender.physicalDefense - attacker.physicalPenetration);
  const penetrationDamage = Math.max(1, attacker.physicalAttack - penDefense);

  // 3. 技能倍率
  const skillDamage = penetrationDamage * skillMultiplier;

  // 4. 随机波动 (90% ~ 110%)
  const randomMultiplier = 0.9 + prng.next() * 0.2;

  // 5. 伤害加成
  const bonusMultiplier = 1 + (attacker.damageBonus || 0);

  // 6. 暴击判定
  const isCritical = prng.next() < attacker.critRate;
  const critMultiplier = isCritical ? (1 + attacker.critDamage) : 1;

  // 7. 伤害减免
  const reductionMultiplier = 1 - Math.min(0.75, defender.damageReduction || 0);

  // 8. 最终伤害
  let finalDamage = Math.floor(
    skillDamage * randomMultiplier * bonusMultiplier * critMultiplier * reductionMultiplier
  );

  // 9. 吸血计算
  const lifestealAmount = Math.floor(finalDamage * (attacker.lifesteal || 0));

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    lifestealAmount,
    element: 'physical'
  };
}
```

### 2.2 法术伤害计算

```typescript
/**
 * 计算法术伤害
 */
function calculateMagicDamage(
  attacker: CombatStats,
  defender: CombatStats,
  skill: Skill,
  prng: PRNG
): DamageResult {
  // 1. 基础伤害 = 法攻 - 法防
  const baseDamage = Math.max(1, attacker.magicAttack - defender.magicDefense);

  // 2. 应用穿透
  const penDefense = Math.max(0, defender.magicDefense - attacker.magicPenetration);
  const penetrationDamage = Math.max(1, attacker.magicAttack - penDefense);

  // 3. 技能倍率
  const skillDamage = penetrationDamage * skill.multiplier;

  // 4. 元素克制
  const elementMultiplier = calculateElementMultiplier(
    skill.element,
    defender.weakness
  );

  // 5. 元素抗性
  const resistanceKey = `${skill.element}Resistance`;
  const resistance = defender[resistanceKey] || 0;
  const resistanceMultiplier = 1 - Math.min(0.75, resistance);

  // 6. 随机波动
  const randomMultiplier = 0.9 + prng.next() * 0.2;

  // 7. 伤害加成
  const bonusMultiplier = 1 + (attacker.damageBonus || 0);

  // 8. 暴击判定
  const isCritical = prng.next() < attacker.critRate;
  const critMultiplier = isCritical ? (1 + attacker.critDamage) : 1;

  // 9. 伤害减免
  const reductionMultiplier = 1 - Math.min(0.75, defender.damageReduction || 0);

  // 10. 最终伤害
  let finalDamage = Math.floor(
    skillDamage
    * elementMultiplier
    * resistanceMultiplier
    * randomMultiplier
    * bonusMultiplier
    * critMultiplier
    * reductionMultiplier
  );

  // 11. 法术吸血
  const vampAmount = Math.floor(finalDamage * (attacker.spellVamp || 0));

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    lifestealAmount: vampAmount,
    element: skill.element,
    elementalAdvantage: elementMultiplier > 1
  };
}
```

### 2.3 固定伤害计算

```typescript
/**
 * 计算固定伤害（无视防御）
 * 例：地府的阎罗令
 */
function calculateFixedDamage(
  baseDamage: number,
  level: number,
  defender: CombatStats,
  prng: PRNG
): DamageResult {
  // 等级系数
  const levelMultiplier = 1 + level * 0.05;

  // 随机波动 (95% ~ 105%)
  const randomMultiplier = 0.95 + prng.next() * 0.1;

  // 固定伤害仍受伤害减免影响
  const reductionMultiplier = 1 - Math.min(0.5, defender.damageReduction || 0);

  const finalDamage = Math.floor(
    baseDamage * levelMultiplier * randomMultiplier * reductionMultiplier
  );

  return {
    damage: Math.max(1, finalDamage),
    isCritical: false,
    isFixed: true
  };
}
```

### 2.4 真实伤害计算

```typescript
/**
 * 计算真实伤害（无视一切）
 */
function calculateTrueDamage(baseDamage: number): DamageResult {
  return {
    damage: Math.max(1, Math.floor(baseDamage)),
    isCritical: false,
    isTrue: true
  };
}
```

---

## 三、命中与闪避

### 3.1 命中判定公式

```typescript
/**
 * 判定攻击是否命中
 */
function checkHit(
  attacker: CombatStats,
  defender: CombatStats,
  skill?: Skill
): HitResult {
  // 技能命中率修正
  const skillAccuracy = skill?.accuracy || 1.0;

  // 最终命中率
  const finalHitRate = Math.min(0.99, attacker.hitRate * skillAccuracy);

  // 闪避修正
  const effectiveDodgeRate = Math.min(0.3, defender.dodgeRate);

  // 最终命中概率
  const hitChance = finalHitRate * (1 - effectiveDodgeRate);

  const random = Math.random();
  const isHit = random < hitChance;

  return {
    isHit,
    hitChance,
    rollValue: random,
    dodgeType: !isHit ? 'dodge' : null
  };
}
```

### 3.2 必中规则

以下情况必定命中：

1. **技能必中**：技能带有 `guaranteedHit: true`
2. **状态限制**：目标处于眩晕、冰冻状态
3. **元素克制**：使用克制元素的技能时，命中率+20%

---

## 四、暴击系统

### 4.1 暴击判定

```typescript
/**
 * 暴击判定
 */
function checkCritical(
  attacker: CombatStats,
  skill?: Skill
): CriticalResult {
  // 基础暴击率
  let critRate = attacker.critRate;

  // 技能暴击修正
  if (skill?.critBonus) {
    critRate += skill.critBonus;
  }

  // 暴击率上限
  critRate = Math.min(0.75, critRate);

  const random = Math.random();
  const isCritical = random < critRate;

  // 暴击伤害计算
  const critDamage = isCritical ? (1 + attacker.critDamage) : 1;

  return {
    isCritical,
    critRate,
    critDamage,
    rollValue: random
  };
}
```

### 4.2 暴击伤害上限

| 来源 | 伤害上限 |
|------|----------|
| 基础暴击 | 150% |
| 特性加成 | +50% (最大200%) |
| 装备加成 | +100% (最大300%) |
| 技能加成 | +50% (临时) |

**暴击伤害硬上限**：400%

---

## 五、元素系统

### 5.1 元素类型

| 元素 | 英文 | 效果 | 代表技能 |
|------|------|------|----------|
| 物理 | physical | 无特殊效果 | 普通攻击 |
| 火 | fire | 灼烧3%HP/回合 | 飞砂走石 |
| 冰 | ice | 减速30% | 龙卷雨击 |
| 雷 | thunder | 眩晕1回合 | 天雷斩 |
| 无 | none | 无元素 | 横扫千军 |

### 5.2 元素克制关系

```
    冰(水)
      ↓
      克
      ↓
    火 ──克──→ 雷
      ↑
      克
      ↓
    (循环)
```

| 攻击元素 | 克制目标 | 被克制 |
|----------|----------|--------|
| 冰 | 火 | 雷 |
| 火 | 雷 | 冰 |
| 雷 | 冰 | 火 |

### 5.3 元素克制计算

```typescript
const ELEMENT_ADVANTAGE: Record<Element, Element | null> = {
  ice: 'fire',      // 冰克火
  fire: 'thunder',  // 火克雷
  thunder: 'ice',   // 雷克冰
  physical: null,
  none: null
};

function calculateElementMultiplier(
  attackElement: Element,
  defenderElement: Element | undefined
): number {
  // 克制：+30%伤害
  if (ELEMENT_ADVANTAGE[attackElement] === defenderElement) {
    return 1.3;
  }

  // 被克：-30%伤害
  if (ELEMENT_ADVANTAGE[defenderElement || 'none'] === attackElement) {
    return 0.7;
  }

  // 无克制关系
  return 1.0;
}
```

### 5.4 元素抗性

| 抗性来源 | 抗性范围 |
|----------|----------|
| 基础抗性 | 0% |
| 装备加成 | 0~30% |
| 技能Buff | 0~50% |
| 硬上限 | 75% |

---

## 六、状态效果

### 6.1 控制效果

| 效果 | 持续时间 | 效果说明 | 解除方式 |
|------|----------|----------|----------|
| **眩晕** | 1回合 | 无法行动 | 受到伤害解除 |
| **冰冻** | 2回合 | 无法行动，受伤害+50% | - |
| **睡眠** | 1-3回合 | 无法行动 | 受到伤害解除 |
| **混乱** | 2回合 | 随机攻击 | - |
| **嘲讽** | 2回合 | 强制攻击嘲讽者 | - |

### 6.2 减益效果

| 效果 | 效果说明 | 叠加方式 |
|------|----------|----------|
| **减速** | 速度-30% | 刷新持续时间 |
| **破甲** | 物防-20% | 最多叠加3层 |
| **虚弱** | 攻击-20% | 最多叠加2层 |
| **致盲** | 命中率-30% | 不叠加 |
| **中毒** | 每回合损失2%HP | 叠加伤害 |

### 6.3 增益效果

| 效果 | 效果说明 | 持续时间 |
|------|----------|----------|
| **狂暴** | 攻击+30%，防御-20% | 3回合 |
| **护盾** | 吸收伤害 | 直到破碎 |
| **再生** | 每回合恢复5%HP | 3回合 |
| **法力回复** | 每回合恢复5%MP | 3回合 |
| **免疫** | 免疫控制效果 | 2回合 |

### 6.4 状态效果实现

```typescript
interface StatusEffect {
  id: string;
  name: string;
  icon: string;
  type: 'buff' | 'debuff' | 'control';
  duration: number;        // 回合数
  remaining: number;       // 剩余回合
  stackable: boolean;      // 是否可叠加
  maxStacks: number;       // 最大叠加层数
  stacks: number;          // 当前层数

  // 效果
  effects: {
    statMultiplier?: Partial<CombatStats>;  // 属性倍率
    statFlat?: Partial<CombatStats>;        // 固定属性
    dot?: { type: 'hp' | 'mp'; percent: number }; // 持续伤害
    hot?: { type: 'hp' | 'mp'; percent: number }; // 持续回复
    control?: 'stun' | 'freeze' | 'sleep' | 'confuse' | 'taunt';
    shield?: number;       // 护盾值
  };

  // 触发条件
  trigger?: {
    onAttack?: () => void;
    onHit?: () => void;
    onTurnStart?: () => void;
    onTurnEnd?: () => void;
  };
}
```

---

## 七、行动顺序

### 7.1 速度排序

```typescript
/**
 * 计算行动顺序
 */
function calculateActionOrder(
  allies: CombatUnit[],
  enemies: CombatUnit[]
): CombatUnit[] {
  // 合并所有存活单位
  const allUnits = [
    ...allies.filter(u => u.hp > 0),
    ...enemies.filter(u => u.hp > 0)
  ];

  // 按速度降序排列
  return allUnits.sort((a, b) => {
    // 速度相同时随机决定
    if (a.stats.speed === b.stats.speed) {
      return Math.random() - 0.5;
    }
    return b.stats.speed - a.stats.speed;
  });
}
```

### 7.2 速度修正

| 修正来源 | 效果 |
|----------|------|
| 冰冻状态 | -30%速度 |
| 加速Buff | +20%速度 |
| 装备加成 | 固定值 |

---

## 八、伤害数值平衡

### 8.1 伤害预期

| 等级 | 物攻范围 | 法攻范围 | HP范围 | 普攻伤害 |
|------|----------|----------|--------|----------|
| 1 | 20-30 | 25-35 | 150-200 | 15-25 |
| 10 | 80-120 | 90-130 | 400-600 | 50-80 |
| 30 | 200-300 | 250-350 | 1000-1500 | 120-200 |
| 50 | 400-600 | 500-700 | 2000-3000 | 250-400 |

### 8.2 伤害占比设计

| 伤害来源 | 占比 |
|----------|------|
| 基础攻击 | 60% |
| 技能倍率 | 25% |
| 暴击加成 | 10% |
| 其他加成 | 5% |

---

## 九、战斗日志

### 9.1 日志格式

```typescript
interface BattleLogEntry {
  timestamp: number;
  round: number;
  actor: {
    id: string;
    name: string;
    isPlayerSide: boolean;
  };
  action: string;
  target?: {
    id: string;
    name: string;
  };
  result: {
    damage?: number;
    heal?: number;
    isCritical?: boolean;
    isMiss?: boolean;
    element?: Element;
    statusEffect?: string;
  };
  text: string;  // 可读文本
}
```

### 9.2 日志示例

```
[回合1] 孙悟空 使用 横扫千军 攻击 野狼
        造成 150 伤害 (暴击！)
        野狼 HP: 50/200

[回合1] 野狼 攻击 孙悟空
        造成 45 伤害
        孙悟空 HP: 355/400
```

---

## 十、实现检查清单

### 10.1 伤害计算

- [ ] 物理伤害公式
- [ ] 法术伤害公式
- [ ] 固定伤害公式
- [ ] 真实伤害公式
- [ ] 伤害数字显示

### 10.2 命中系统

- [ ] 命中判定
- [ ] 闪避判定
- [ ] 必中规则

### 10.3 暴击系统

- [ ] 暴击判定
- [ ] 暴击伤害计算
- [ ] 暴击数字特效

### 10.4 元素系统

- [ ] 元素克制
- [ ] 元素抗性
- [ ] 元素效果

### 10.5 状态效果

- [ ] 控制效果
- [ ] 增益效果
- [ ] 减益效果
- [ ] 效果叠加

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-13 | 初始设计文档 |
