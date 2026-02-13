# 人物系统详细设计文档

> 版本：1.0.0
> 日期：2026-02-13
> 状态：设计中

---

## 一、属性体系概览

### 1.1 属性层次结构

```
┌─────────────────────────────────────────────────────────────┐
│                      最终战斗属性                             │
│  物攻/物防/法攻/法防/速度/HP/MP/暴击率/暴击伤害/命中/闪避     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ 计算衍生
┌─────────────────────────────────────────────────────────────┐
│                      基础五维属性                             │
│         力量 / 灵力 / 体质 / 敏捷 / 魔力                      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ 来源
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴───────┐     ┌───────┴───────┐     ┌───────┴───────┐
│    种族加成    │     │    门派加成    │     │    特性加成    │
└───────────────┘     └───────────────┘     └───────────────┘
        ▲                     ▲                     ▲
        │                     │                     │
   创建时固定            创建时固定           创建时随机
```

---

## 二、基础五维属性

### 2.1 属性定义

| 属性 | 英文 | 说明 | 影响战斗属性 |
|------|------|------|--------------|
| **力量** | strength | 物理攻击力基础 | 物攻、物防、HP |
| **灵力** | intelligence | 法术攻击力基础 | 法攻、法防、MP |
| **体质** | vitality | 生命力和防御 | HP、物防、法防 |
| **敏捷** | agility | 速度和暴击 | 速度、暴击、命中、闪避 |
| **魔力** | willpower | 法力和法防 | MP、法防、法攻 |

### 2.2 初始属性范围

创建角色时，基础五维属性的初始值范围：

| 属性 | 最小值 | 最大值 | 默认值 |
|------|--------|--------|--------|
| 力量 | 8 | 12 | 10 |
| 灵力 | 8 | 12 | 10 |
| 体质 | 8 | 12 | 10 |
| 敏捷 | 8 | 12 | 10 |
| 魔力 | 8 | 12 | 10 |

**总点数约束**：5项属性总和 = 50点（每项平均10点）

### 2.3 属性成长

每升1级，各属性的成长公式：

```
属性成长值 = 基础成长率 × (1 + 门派成长加成) × (1 + 种族成长加成)
```

**基础成长率**：

| 属性 | 基础成长 |
|------|----------|
| 力量 | 2.0 |
| 灵力 | 2.0 |
| 体质 | 2.5 |
| 敏捷 | 1.8 |
| 魔力 | 2.0 |

---

## 三、战斗属性（衍生属性）

### 3.1 战斗属性列表

| 属性 | 英文 | 说明 | 基础值 |
|------|------|------|--------|
| 物理攻击 | physicalAttack | 物理伤害基础 | - |
| 物理防御 | physicalDefense | 减少物理伤害 | - |
| 法术攻击 | magicAttack | 法术伤害基础 | - |
| 法术防御 | magicDefense | 减少法术伤害 | - |
| 速度 | speed | 行动顺序判定 | - |
| 最大HP | maxHp | 生命值上限 | - |
| 最大MP | maxMp | 法力值上限 | - |
| 暴击率 | critRate | 暴击概率 | 5% |
| 暴击伤害 | critDamage | 暴击时伤害倍率 | 150% |
| 命中率 | hitRate | 攻击命中概率 | 90% |
| 闪避率 | dodgeRate | 被攻击闪避概率 | 2% |

### 3.2 战斗属性计算公式

```typescript
// 物理攻击
physicalAttack = floor(力量 × 2 + 敏捷 × 0.5 + 等级 × 2)

// 物理防御
physicalDefense = floor(体质 × 1.5 + 力量 × 0.3 + 等级)

// 法术攻击
magicAttack = floor(灵力 × 2.2 + 魔力 × 0.5 + 等级 × 2)

// 法术防御
magicDefense = floor(魔力 × 1.5 + 灵力 × 0.3 + 等级)

// 最大HP
maxHp = floor(体质 × 10 + 力量 × 2 + 等级 × 5 + 100)

// 最大MP
maxMp = floor(魔力 × 8 + 灵力 × 2 + 等级 × 3 + 50)

// 速度
speed = floor(敏捷 × 2 + 等级)

// 暴击率 (上限50%)
critRate = min(0.05 + 敏捷 × 0.002, 0.5)

// 暴击伤害 (基础150%)
critDamage = 0.5 + 敏捷 × 0.01

// 命中率 (上限99%)
hitRate = min(0.9 + 敏捷 × 0.001, 0.99)

// 闪避率 (上限30%)
dodgeRate = min(0.02 + 敏捷 × 0.002, 0.3)
```

### 3.3 属性计算示例

**角色：Lv.10 人族大唐官府**

基础属性（含成长）：
- 力量：10 + 2.0×9 + 10% = 30.8 → 30
- 灵力：10 + 2.0×9 = 28
- 体质：10 + 2.5×9 + 5% = 33.75 → 33
- 敏捷：10 + 1.8×9 + 5% = 29.12 → 29
- 魔力：10 + 2.0×9 = 28

战斗属性：
- 物理攻击：30×2 + 29×0.5 + 10×2 = 95
- 物理防御：33×1.5 + 30×0.3 + 10 = 69
- 法术攻击：28×2.2 + 28×0.5 + 10×2 = 90
- 法术防御：28×1.5 + 28×0.3 + 10 = 60
- 最大HP：33×10 + 30×2 + 10×5 + 100 = 540
- 最大MP：28×8 + 28×2 + 10×3 + 50 = 330
- 速度：29×2 + 10 = 68
- 暴击率：5% + 29×0.2% = 10.8%
- 暴击伤害：150% + 29×1% = 179%

---

## 四、种族系统

### 4.1 种族配置

| 种族 | 特点 | 属性偏向 | 种族被动 |
|------|------|----------|----------|
| **人族** | 均衡发展 | 全属性+5% | 坚韧意志 |
| **仙族** | 灵力深厚 | 法攻+15%，MP+10% | 仙体护佑 |
| **魔族** | 体魄强健 | 攻击+15%，HP+10% | 狂战血脉 |

### 4.2 种族被动技能

```typescript
// 人族 - 坚韧意志
// 致命伤害时，10%概率保留1HP存活
function humanWill(currentHp: number, damage: number): number {
  if (currentHp - damage <= 0 && Math.random() < 0.1) {
    return 1; // 保留1HP
  }
  return Math.max(0, currentHp - damage);
}

// 仙族 - 仙体护佑
// 每回合开始时恢复2%MP
function celestialBlessing(currentMp: number, maxMp: number): number {
  return Math.min(maxMp, currentMp + Math.floor(maxMp * 0.02));
}

// 魔族 - 狂战血脉
// HP低于30%时，物理攻击+20%
function demonBlood(currentHp: number, maxHp: number, attack: number): number {
  if (currentHp / maxHp < 0.3) {
    return Math.floor(attack * 1.2);
  }
  return attack;
}
```

### 4.3 种族属性加成

```typescript
const RACE_BONUS = {
  human: {
    statGrowth: { strength: 1.05, intelligence: 1.05, vitality: 1.05, agility: 1.05, willpower: 1.05 },
    passive: 'humanWill'
  },
  celestial: {
    statGrowth: { strength: 1.0, intelligence: 1.15, vitality: 1.0, agility: 1.0, willpower: 1.1 },
    combatBonus: { magicAttack: 1.15, maxMp: 1.1 },
    passive: 'celestialBlessing'
  },
  demon: {
    statGrowth: { strength: 1.15, intelligence: 1.0, vitality: 1.1, agility: 1.0, willpower: 1.0 },
    combatBonus: { physicalAttack: 1.15, maxHp: 1.1 },
    passive: 'demonBlood'
  }
};
```

---

## 五、门派系统

### 5.1 门派定位分类

| 定位 | 说明 | 代表门派 |
|------|------|----------|
| **物理输出** | 高物攻，单体/群体物理伤害 | 大唐、狮驼 |
| **法术输出** | 高法攻，群体法术伤害 | 龙宫、魔王 |
| **治疗辅助** | 治疗、复活、增益 | 化生、普陀 |
| **封印控制** | 封印、减速、减益 | 方寸、盘丝 |
| **全能型** | 攻防兼备 | 天宫 |
| **固定伤害** | 无视防御的伤害 | 地府 |

### 5.2 门派详细配置

#### 人族门派

| 门派 | 定位 | 属性成长加成 | 门派技能 |
|------|------|--------------|----------|
| **大唐官府** | 物理输出 | 力量+20% | 横扫千军 |
| **化生寺** | 治疗辅助 | 魔力+15%，体质+10% | 推气过宫 |
| **方寸山** | 封印控制 | 敏捷+20% | 定身符 |
| **女儿村** | 敏捷输出 | 敏捷+15%，力量+10% | 满天花雨 |

#### 仙族门派

| 门派 | 定位 | 属性成长加成 | 门派技能 |
|------|------|--------------|----------|
| **龙宫** | 法术群攻 | 灵力+20% | 龙卷雨击 |
| **天宫** | 全能型 | 全属性+5% | 天雷斩 |
| **普陀山** | 治疗法术 | 魔力+20% | 杨柳甘露 |
| **五庄观** | 辅助控制 | 灵力+10%，魔力+10% | 乾坤袖 |

#### 魔族门派

| 门派 | 定位 | 属性成长加成 | 门派技能 |
|------|------|--------------|----------|
| **狮驼岭** | 物理爆发 | 力量+25% | 鹰击 |
| **魔王寨** | 法术爆发 | 灵力+25% | 飞砂走石 |
| **阴曹地府** | 固定伤害 | 体质+15%，魔力+15% | 阎罗令 |
| **盘丝洞** | 封印控制 | 敏捷+20% | 盘丝阵 |

### 5.3 门派技能示例

```typescript
// 大唐官府 - 横扫千军
const横扫千军 = {
  id: 'skill_hengsao',
  name: '横扫千军',
  type: 'active',
  mpCost: 30,
  targetType: 'single',

  effect: {
    // 连续攻击3次，每次伤害递减
    hits: 3,
    damageMultiplier: [1.0, 0.8, 0.6],
    element: 'physical'
  },

  cooldown: 2, // 2回合冷却
  description: '连续攻击目标3次，伤害分别为100%/80%/60%'
};

// 龙宫 - 龙卷雨击
const 龙卷雨击 = {
  id: 'skill_longjuan',
  name: '龙卷雨击',
  type: 'active',
  mpCost: 40,
  targetType: 'all_enemies',

  effect: {
    damageMultiplier: 0.8,
    element: 'ice',
    // 冰冻效果
    statusEffect: {
      type: 'freeze',
      chance: 0.2,
      duration: 1,
      effect: { speedMultiplier: 0.7 }
    }
  },

  description: '对全体敌人造成水系法术伤害，20%概率减速30%'
};
```

---

## 六、特性系统

### 6.1 特性分类

| 类别 | 说明 | 示例 |
|------|------|------|
| **属性型** | 直接增加属性 | 力量+5% |
| **战斗型** | 战斗中触发效果 | 暴击时回复HP |
| **被动型** | 持续生效 | 受伤减少5% |
| **条件型** | 满足条件触发 | HP<30%时攻击+10% |

### 6.2 特性稀有度

| 稀有度 | 颜色 | 概率 | 效果强度 |
|--------|------|------|----------|
| 普通 | 白色 | 50% | 1-3%加成 |
| 稀有 | 蓝色 | 30% | 3-5%加成 |
| 史诗 | 紫色 | 15% | 5-8%加成 |
| 传说 | 橙色 | 4% | 8-12%加成 |
| 神话 | 金色 | 1% | 12-15%加成 |

### 6.3 特性池设计

#### 属性型特性

```typescript
const ATTRIBUTE_TRAITS = [
  // 普通级
  { id: 'trait_str_1', name: '力量之源', rarity: 'common', effect: { strength: 0.03 } },
  { id: 'trait_int_1', name: '智慧之光', rarity: 'common', effect: { intelligence: 0.03 } },
  { id: 'trait_vit_1', name: '坚韧体魄', rarity: 'common', effect: { vitality: 0.03 } },
  { id: 'trait_agi_1', name: '身手敏捷', rarity: 'common', effect: { agility: 0.03 } },
  { id: 'trait_wil_1', name: '魔力涌动', rarity: 'common', effect: { willpower: 0.03 } },

  // 稀有级
  { id: 'trait_str_2', name: '天生神力', rarity: 'rare', effect: { strength: 0.05, physicalAttack: 0.03 } },
  { id: 'trait_int_2', name: '天资聪颖', rarity: 'rare', effect: { intelligence: 0.05, magicAttack: 0.03 } },
  { id: 'trait_vit_2', name: '铜皮铁骨', rarity: 'rare', effect: { vitality: 0.05, maxHp: 0.05 } },

  // 史诗级
  { id: 'trait_all_1', name: '天命之人', rarity: 'epic', effect: { allStats: 0.05 } },
  { id: 'trait_crit_1', name: '暴击专精', rarity: 'epic', effect: { critRate: 0.05, critDamage: 0.1 } },

  // 传说级
  { id: 'trait_duel_1', name: '单挑之王', rarity: 'legendary', effect: { singleTargetDamage: 0.15 } },
  { id: 'trait_aoe_1', name: '横扫千军', rarity: 'legendary', effect: { aoeDamage: 0.12 } },

  // 神话级
  { id: 'trait_immortal', name: '不灭金身', rarity: 'mythic', effect: { damageReduction: 0.1, reviveChance: 0.1 } },
];
```

#### 战斗型特性

```typescript
const COMBAT_TRAITS = [
  // 普通级
  { id: 'trait_lifesteal_1', name: '吸血本能', rarity: 'common', effect: { lifesteal: 0.03 } },
  { id: 'trait_mana_leech_1', name: '法力汲取', rarity: 'common', effect: { manaLeech: 0.02 } },

  // 稀有级
  { id: 'trait_counter_1', name: '反击风暴', rarity: 'rare', trigger: 'on_hit', effect: { counterChance: 0.15 } },
  { id: 'trait_combo_1', name: '连击之心', rarity: 'rare', effect: { extraAttackChance: 0.1 } },

  // 史诗级
  { id: 'trait_execute_1', name: '处决', rarity: 'epic', effect: { executeDamage: 0.3, executeThreshold: 0.2 } },
  { id: 'trait_crit_heal_1', name: '暴击治愈', rarity: 'epic', trigger: 'on_crit', effect: { healPercent: 0.05 } },

  // 传说级
  { id: 'trait_phoenix', name: '凤凰涅槃', rarity: 'legendary', trigger: 'on_death', effect: { revive: true, reviveHp: 0.3, cooldown: 300 } },

  // 神话级
  { id: 'trait_god_mode', name: '战神附体', rarity: 'mythic', effect: { allDamage: 0.15, damageReduction: 0.08 } },
];
```

---

## 七、等级成长系统

### 7.1 等级上限

- **玩家等级上限**：100级
- **MVP阶段上限**：50级

### 7.2 经验表

升级所需经验公式：

```
expToNextLevel = floor(100 × 1.15^(level - 1))
```

| 等级 | 所需经验 | 累计经验 |
|------|----------|----------|
| 1→2 | 100 | 100 |
| 5→6 | 175 | 575 |
| 10→11 | 354 | 1,745 |
| 20→21 | 1,431 | 6,514 |
| 30→31 | 5,793 | 26,419 |
| 40→41 | 23,462 | 107,060 |
| 50→51 | 95,024 | 433,913 |

### 7.3 属性成长曲线

```
Lv.1  基础属性: 50 (每项10)
Lv.10 基础属性: ~150 (每项~30)
Lv.30 基础属性: ~300 (每项~60)
Lv.50 基础属性: ~450 (每项~90)
Lv.100 基础属性: ~750 (每项~150)
```

---

## 八、属性汇总计算

### 8.1 完整计算流程

```typescript
function calculateFinalStats(player: Player): FullStats {
  // 1. 基础属性（等级成长）
  let stats = calculateBaseStats(
    player.baseStats,
    player.level,
    getGrowthRate(player.factionId)
  );

  // 2. 种族加成
  stats = applyRaceBonus(stats, player.race);

  // 3. 门派加成
  stats = applyFactionBonus(stats, player.factionId);

  // 4. 特性加成
  for (const trait of player.traits) {
    stats = applyTraitBonus(stats, trait);
  }

  // 5. 装备加成
  const equipmentBonus = calculateEquipmentBonus(player.equipment);
  stats = mergeStats(stats, equipmentBonus);

  // 6. 羁绊加成
  const bondBonus = calculateBondBonus(player.activeBonds);
  stats = mergeStats(stats, bondBonus);

  // 7. 战斗属性衍生
  const combatStats = calculateCombatStats(stats, player.race, player.level);

  return { ...stats, ...combatStats };
}
```

### 8.2 属性优先级

当多个来源提供相同属性加成时，计算顺序：

1. 基础属性（五维）
2. 种族百分比加成
3. 门派百分比加成
4. 特性加成（加法叠加）
5. 装备固定值加成
6. 装备百分比加成
7. 羁绊加成
8. Buff/Debuff（战斗中）

---

## 九、实现优先级

### 9.1 Phase 1：基础属性系统

- [ ] 完善基础五维属性计算
- [ ] 实现战斗属性衍生计算
- [ ] 种族被动效果实现

### 9.2 Phase 2：门派技能系统

- [ ] 门派属性加成
- [ ] 门派技能数据
- [ ] 技能效果实现

### 9.3 Phase 3：特性系统

- [ ] 特性池完善
- [ ] 特性效果实现
- [ ] 特性触发机制

### 9.4 Phase 4：战斗属性集成

- [ ] 属性汇总计算
- [ ] 战斗伤害公式
- [ ] 暴击/命中/闪避判定

---

## 十、待讨论问题

1. **属性平衡**：各属性的投资回报率是否合理？
2. **门派平衡**：12门派的强度差异如何控制？
3. **特性稀有度**：神话特性是否过于强力？
4. **成长曲线**：1-100级的数值膨胀是否合理？
5. **PVP考量**：是否需要PVP平衡调整？

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-13 | 初始设计文档 |
