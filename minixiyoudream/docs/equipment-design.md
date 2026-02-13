# 装备系统设计

> 版本：1.1.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 设计原则

- **9槽位装备**：完整的装备配置系统
- **品质分级**：5级品质系统，稀有度决定基础属性和词条数量
- **强化成长**：装备可通过强化提升属性
- **宝石镶嵌**：多种宝石提供额外属性
- **词条系统**：暗黑 + 梦幻缝合，随机词缀带来Build深度
- **套装收集**：收集同套装备获得额外加成

### 1.2 装备系统组成

```
装备基础 → 品质 → 词条属性 → 强化等级 → 镶嵌宝石 → 套装效果
```

### 1.3 装备来源分布

| 来源 | 品质范围 | 定位 | 说明 |
|------|----------|------|------|
| **怪物掉落** | 普通~稀有 | 过渡装备 | 野外战斗获得，用于过渡 |
| **副本Boss** | 稀有~传说 | 极品来源 | 挑战Boss有概率掉落极品 |
| **打造制作** | 任意品质 | 极品来源 | 材料打造，可出极品词条 |

---

## 二、装备槽位设计

### 2.1 槽位分类（9个）

| 槽位 | 英文 | 说明 | 主属性类型 |
|------|------|------|------------|
| **武器** | Weapon | 攻击装备 | 攻击/法攻 |
| **头盔** | Head | 防御装备 | 防御/HP |
| **衣服** | Body | 防御装备 | 防御/HP |
| **鞋子** | Boots | 速度装备 | 速度/闪避 |
| **腰带** | Belt | 辅助装备 | HP/负重 |
| **项链** | Necklace | 饰品 | 法攻/MP |
| **护符** | Charm | 饰品 | 特殊属性 |
| **戒指1** | Ring1 | 饰品 | 多样属性 |
| **戒指2** | Ring2 | 饰品 | 多样属性 |

### 2.2 槽位数据结构

```typescript
type EquipmentSlot =
  | 'weapon'      // 武器
  | 'head'        // 头盔
  | 'body'        // 衣服
  | 'boots'       // 鞋子
  | 'belt'        // 腰带
  | 'necklace'    // 项链
  | 'charm'       // 护符
  | 'ring1'       // 戒指1
  | 'ring2';      // 戒指2

interface EquipmentSlots {
  weapon: Equipment | null;
  head: Equipment | null;
  body: Equipment | null;
  boots: Equipment | null;
  belt: Equipment | null;
  necklace: Equipment | null;
  charm: Equipment | null;
  ring1: Equipment | null;
  ring2: Equipment | null;
}
```

---

## 三、装备品质系统

### 3.1 品质分级

| 品质 | 颜色 | 属性倍率 | 强化上限 | 词条数量 | 掉落权重 |
|------|------|----------|----------|----------|----------|
| **普通** | 白色 | 100% | +5 | 1-2条 | 50% |
| **稀有** | 蓝色 | 120% | +8 | 2-3条 | 30% |
| **史诗** | 紫色 | 150% | +10 | 3-4条 | 15% |
| **传说** | 橙色 | 180% | +12 | 4-5条 | 4% |
| **神话** | 金色 | 220% | +15 | 5-6条 | 1% |

### 3.2 MVP品质范围

> **MVP简化**：仅开放普通、稀有、史诗三种品质

### 3.3 品质属性计算

```typescript
const QUALITY_MULTIPLIERS = {
  common: 1.0,
  rare: 1.2,
  epic: 1.5,
  legendary: 1.8,
  mythic: 2.2
};

const QUALITY_CONFIG = {
  common: {
    color: '#FFFFFF',
    multiplier: 1.0,
    maxEnhance: 5,
    maxGemSlots: 1,
    affixCount: { min: 1, max: 2 }
  },
  rare: {
    color: '#0070DD',
    multiplier: 1.2,
    maxEnhance: 8,
    maxGemSlots: 2,
    affixCount: { min: 2, max: 3 }
  },
  epic: {
    color: '#A335EE',
    multiplier: 1.5,
    maxEnhance: 10,
    maxGemSlots: 2,
    affixCount: { min: 3, max: 4 }
  },
  legendary: {
    color: '#FF8000',
    multiplier: 1.8,
    maxEnhance: 12,
    maxGemSlots: 3,
    affixCount: { min: 4, max: 5 }
  },
  mythic: {
    color: '#E6CC80',
    multiplier: 2.2,
    maxEnhance: 15,
    maxGemSlots: 3,
    affixCount: { min: 5, max: 6 }
  }
};

function applyQualityMultiplier(
  baseStats: EquipmentStats,
  quality: EquipmentQuality
): EquipmentStats {
  const multiplier = QUALITY_MULTIPLIERS[quality];

  return {
    physicalAttack: Math.floor(baseStats.physicalAttack * multiplier),
    physicalDefense: Math.floor(baseStats.physicalDefense * multiplier),
    magicAttack: Math.floor(baseStats.magicAttack * multiplier),
    magicDefense: Math.floor(baseStats.magicDefense * multiplier),
    hp: Math.floor(baseStats.hp * multiplier),
    mp: Math.floor(baseStats.mp * multiplier),
    speed: Math.floor(baseStats.speed * multiplier),
    critRate: baseStats.critRate * multiplier,
    // ... 其他属性
  };
}
```

---

## 四、装备强化系统

### 4.1 强化规则

| 强化等级 | 成功率 | 属性提升 | 消耗金币 |
|----------|--------|----------|----------|
| +1 → +3 | 100% | 每级+5% | 等级×100 |
| +4 → +6 | 80% | 每级+5% | 等级×200 |
| +7 → +9 | 60% | 每级+8% | 等级×500 |
| +10 → +12 | 40% | 每级+10% | 等级×1000 |
| +13 → +15 | 20% | 每级+15% | 等级×2000 |

**失败惩罚**：+3以上失败降1级（可用保护道具避免）

### 4.2 强化保护

```typescript
interface EnhancementConfig {
  baseSuccessRate: number;
  failPenalty: 'none' | 'downgrade' | 'reset';  // 失败惩罚
  protectionItem?: string;  // 保护道具（失败不降级）
}

const ENHANCEMENT_TABLE = [
  { level: 1, rate: 1.0, bonus: 0.05 },
  { level: 2, rate: 1.0, bonus: 0.05 },
  { level: 3, rate: 1.0, bonus: 0.05 },
  { level: 4, rate: 0.8, bonus: 0.05 },
  { level: 5, rate: 0.8, bonus: 0.05 },
  { level: 6, rate: 0.8, bonus: 0.05 },
  { level: 7, rate: 0.6, bonus: 0.08 },
  { level: 8, rate: 0.6, bonus: 0.08 },
  { level: 9, rate: 0.6, bonus: 0.08 },
  { level: 10, rate: 0.4, bonus: 0.10 },
  { level: 11, rate: 0.4, bonus: 0.10 },
  { level: 12, rate: 0.4, bonus: 0.10 },
  { level: 13, rate: 0.2, bonus: 0.15 },
  { level: 14, rate: 0.2, bonus: 0.15 },
  { level: 15, rate: 0.2, bonus: 0.15 },
];

function enhanceEquipment(
  equipment: Equipment,
  useProtection: boolean = false
): EnhancementResult {
  const currentLevel = equipment.enhanceLevel;
  const config = ENHANCEMENT_TABLE[currentLevel];

  if (currentLevel >= getMaxEnhanceLevel(equipment.quality)) {
    return { success: false, reason: 'max_level' };
  }

  const success = Math.random() < config.rate;

  if (success) {
    equipment.enhanceLevel++;
    equipment.enhanceBonus = calculateEnhanceBonus(equipment);
    return { success: true, newLevel: equipment.enhanceLevel };
  } else {
    if (!useProtection && currentLevel > 3) {
      equipment.enhanceLevel = Math.max(3, currentLevel - 1);
    }
    return { success: false, newLevel: equipment.enhanceLevel };
  }
}
```

### 4.3 强化属性计算

```typescript
function calculateEnhanceBonus(equipment: Equipment): EquipmentStats {
  const level = equipment.enhanceLevel;
  if (level === 0) return {};

  const config = ENHANCEMENT_TABLE[level - 1];
  const bonusMultiplier = level * config.bonus;

  return {
    physicalAttack: Math.floor(equipment.baseStats.physicalAttack * bonusMultiplier),
    physicalDefense: Math.floor(equipment.baseStats.physicalDefense * bonusMultiplier),
    // ... 其他属性
  };
}
```

---

## 五、宝石镶嵌系统

### 5.1 宝石类型

| 宝石 | 名称 | 主属性 | 可镶嵌槽位 |
|------|------|--------|------------|
| 红宝石 | 力量石 | 力量+X | 武器、戒指 |
| 蓝宝石 | 灵力石 | 灵力+X | 项链、护符 |
| 绿宝石 | 体质石 | 体质+X | 头盔、衣服、腰带 |
| 黄宝石 | 敏捷石 | 敏捷+X | 鞋子、戒指 |
| 紫宝石 | 魔力石 | 魔力+X | 项链、护符 |
| 钻石 | 全能石 | 全属性+X | 所有槽位 |

### 5.2 宝石等级

| 等级 | 名称 | 属性值 | 合成数量 |
|------|------|--------|----------|
| 1级 | 碎裂 | +2 | - |
| 2级 | 裂纹 | +4 | 3个1级 |
| 3级 | 普通 | +7 | 3个2级 |
| 4级 | 无瑕 | +12 | 3个3级 |
| 5级 | 完美 | +20 | 3个4级 |
| 6级 | 传奇 | +35 | 3个5级 |

### 5.3 镶嵌规则

```typescript
interface Gem {
  id: string;
  name: string;
  type: GemType;
  level: number;
  value: number;
  allowedSlots: EquipmentSlot[];
}

interface GemSlot {
  position: number;
  gem: Gem | null;
  unlocked: boolean;
}

function canSocketGem(
  equipment: Equipment,
  gem: Gem,
  slotPosition: number
): boolean {
  // 检查槽位是否解锁
  if (!equipment.gemSlots[slotPosition]?.unlocked) {
    return false;
  }

  // 检查槽位是否已有宝石
  if (equipment.gemSlots[slotPosition]?.gem) {
    return false;
  }

  // 检查宝石类型是否匹配槽位
  if (!gem.allowedSlots.includes(equipment.slot)) {
    return false;
  }

  // 检查装备等级是否满足宝石要求
  if (equipment.level < gem.level * 10) {
    return false;
  }

  return true;
}

function socketGem(
  equipment: Equipment,
  gem: Gem,
  slotPosition: number
): Equipment {
  if (!canSocketGem(equipment, gem, slotPosition)) {
    throw new Error('无法镶嵌此宝石');
  }

  equipment.gemSlots[slotPosition].gem = gem;
  recalculateEquipmentStats(equipment);

  return equipment;
}
```

### 5.4 宝石合成

```typescript
function synthesizeGems(gems: Gem[]): Gem | null {
  // 需要同类型、同等级的3个宝石
  if (gems.length !== 3) return null;
  if (!gems.every(g => g.type === gems[0].type)) return null;
  if (!gems.every(g => g.level === gems[0].level)) return null;

  const newLevel = gems[0].level + 1;
  const newValue = getGemValue(gems[0].type, newLevel);

  return {
    id: `gem_${gems[0].type}_${newLevel}`,
    name: getGemName(gems[0].type, newLevel),
    type: gems[0].type,
    level: newLevel,
    value: newValue,
    allowedSlots: gems[0].allowedSlots
  };
}
```

---

## 六、词条系统（暗黑 + 梦幻缝合）

### 6.1 词条类型分布

| 类型 | 占比 | 示例 | MVP状态 |
|------|------|------|----------|
| **基础属性** | 40% | 力量+10~50 | ✅ 必需 |
| **百分比加成** | 25% | 攻击+3%~15% | ✅ 必需 |
| **战斗属性** | 15% | 暴击率+2%~8% | ✅ 必需 |
| **条件触发** | 10% | HP<30%时攻击+20% | 🔜 后续 |
| **特殊效果** | 8% | 攻击时5%概率触发火球术 | 🔜 后续 |
| **负面词缀** | 2% | 攻击+15%但防御-10% | 🔜 后续 |

### 6.2 数值范围（按品质）

| 词条 | 白装 | 蓝装 | 紫装 | 橙装 | 金装 |
|------|------|------|------|------|------|
| 力量 | 5-15 | 10-30 | 20-60 | 40-100 | 80-150 |
| 攻击% | 1-3% | 2-5% | 3-8% | 5-12% | 8-20% |
| 暴击率 | 1-2% | 2-4% | 3-6% | 4-8% | 6-12% |
| 暴击伤害 | 5-10% | 8-15% | 12-25% | 20-40% | 30-60% |
| HP% | 1-3% | 2-5% | 3-8% | 5-12% | 8-20% |
| 速度 | 1-3 | 2-5 | 3-8 | 5-12 | 8-20 |

### 6.3 词条数据结构

```typescript
// 词条类型
type AffixType =
  | 'basic_stat'      // 基础属性（力量、体质等）
  | 'percent_stat'    // 百分比加成
  | 'combat_stat'     // 战斗属性（暴击、命中）
  | 'conditional'     // 条件触发
  | 'special'         // 特殊效果
  | 'negative';       // 负面词缀

// 词条定义
interface AffixDefinition {
  id: string;
  name: string;
  type: AffixType;
  stat?: StatType;              // 关联属性
  valueRange: {                 // 按品质的数值范围
    common: [number, number];
    rare: [number, number];
    epic: [number, number];
    legendary: [number, number];
    mythic: [number, number];
  };
  isPercent: boolean;           // 是否百分比值
  weight: number;               // 权重
  allowedSlots?: EquipmentSlot[]; // 限定槽位
}

// 装备上的词条实例
interface EquipmentAffix {
  definitionId: string;         // 词条定义ID
  name: string;                 // 显示名称
  type: AffixType;
  stat: StatType;
  value: number;                // 实际数值
  isPercent: boolean;
  locked: boolean;              // 洗练时是否锁定
}

// 示例词条定义
const AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    id: 'affix_strength',
    name: '力量',
    type: 'basic_stat',
    stat: 'strength',
    valueRange: {
      common: [5, 15],
      rare: [10, 30],
      epic: [20, 60],
      legendary: [40, 100],
      mythic: [80, 150]
    },
    isPercent: false,
    weight: 100
  },
  {
    id: 'affix_attack_percent',
    name: '攻击',
    type: 'percent_stat',
    stat: 'physicalAttack',
    valueRange: {
      common: [1, 3],
      rare: [2, 5],
      epic: [3, 8],
      legendary: [5, 12],
      mythic: [8, 20]
    },
    isPercent: true,
    weight: 80
  },
  {
    id: 'affix_crit_rate',
    name: '暴击率',
    type: 'combat_stat',
    stat: 'critRate',
    valueRange: {
      common: [1, 2],
      rare: [2, 4],
      epic: [3, 6],
      legendary: [4, 8],
      mythic: [6, 12]
    },
    isPercent: true,
    weight: 50
  },
  {
    id: 'affix_crit_damage',
    name: '暴击伤害',
    type: 'combat_stat',
    stat: 'critDamage',
    valueRange: {
      common: [5, 10],
      rare: [8, 15],
      epic: [12, 25],
      legendary: [20, 40],
      mythic: [30, 60]
    },
    isPercent: true,
    weight: 40
  }
];
```

### 6.4 词条生成

```typescript
function generateAffixes(
  equipment: Equipment,
  prng: PRNG
): EquipmentAffix[] {
  const quality = equipment.quality;
  const config = QUALITY_CONFIG[quality];
  const affixCount = randomInt(prng, config.affixCount.min, config.affixCount.max);

  const affixes: EquipmentAffix[] = [];
  const usedDefinitions = new Set<string>();

  for (let i = 0; i < affixCount; i++) {
    const definition = rollAffixDefinition(prng, equipment.slot, usedDefinitions);
    if (!definition) continue;

    usedDefinitions.add(definition.id);

    const [min, max] = definition.valueRange[quality];
    const value = definition.isPercent
      ? randomFloat(prng, min, max)
      : randomInt(prng, min, max);

    affixes.push({
      definitionId: definition.id,
      name: definition.name,
      type: definition.type,
      stat: definition.stat!,
      value,
      isPercent: definition.isPercent,
      locked: false
    });
  }

  return affixes;
}

function rollAffixDefinition(
  prng: PRNG,
  slot: EquipmentSlot,
  usedDefinitions: Set<string>
): AffixDefinition | null {
  // MVP阶段只使用基础属性、百分比、战斗属性
  const allowedTypes: AffixType[] = ['basic_stat', 'percent_stat', 'combat_stat'];

  const candidates = AFFIX_DEFINITIONS.filter(def => {
    if (usedDefinitions.has(def.id)) return false;
    if (!allowedTypes.includes(def.type)) return false;
    if (def.allowedSlots && !def.allowedSlots.includes(slot)) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  // 按权重随机选择
  return weightedRandom(prng, candidates, c => c.weight);
}
```

### 6.5 洗练机制

| 操作 | 消耗 | 说明 |
|------|------|------|
| **全部重随** | 洗练石×1 + 金币 | 所有词条重新随机 |
| **锁定1条** | 锁定石×1 + 洗练石×1 + 金币 | 1条固定，其他重随 |
| **锁定2条** | 锁定石×3 + 洗练石×1 + 金币 | 2条固定，其他重随 |
| **锁定3条** | 锁定石×6 + 洗练石×1 + 金币 | 3条固定，其他重随 |

```typescript
interface ReforgeCost {
  reforgeStones: number;  // 洗练石
  lockStones: number;     // 锁定石
  gold: number;           // 金币
}

const REFORGE_COST_TABLE: Record<number, ReforgeCost> = {
  0: { reforgeStones: 1, lockStones: 0, gold: 1000 },
  1: { reforgeStones: 1, lockStones: 1, gold: 2000 },
  2: { reforgeStones: 1, lockStones: 3, gold: 4000 },
  3: { reforgeStones: 1, lockStones: 6, gold: 8000 }
};

function reforgeEquipment(
  equipment: Equipment,
  prng: PRNG
): Equipment {
  const lockedAffixes = equipment.affixes.filter(a => a.locked);
  const lockedCount = lockedAffixes.length;

  // 计算需要生成的词条数
  const config = QUALITY_CONFIG[equipment.quality];
  const targetCount = randomInt(prng, config.affixCount.min, config.affixCount.max);
  const newAffixCount = Math.max(0, targetCount - lockedCount);

  // 生成新词条
  const usedDefinitionIds = new Set(lockedAffixes.map(a => a.definitionId));
  const newAffixes: EquipmentAffix[] = [...lockedAffixes];

  for (let i = 0; i < newAffixCount; i++) {
    const definition = rollAffixDefinition(prng, equipment.slot, usedDefinitionIds);
    if (!definition) continue;

    usedDefinitionIds.add(definition.id);

    const [min, max] = definition.valueRange[equipment.quality];
    const value = definition.isPercent
      ? randomFloat(prng, min, max)
      : randomInt(prng, min, max);

    newAffixes.push({
      definitionId: definition.id,
      name: definition.name,
      type: definition.type,
      stat: definition.stat!,
      value,
      isPercent: definition.isPercent,
      locked: false
    });
  }

  equipment.affixes = newAffixes;
  recalculateEquipmentStats(equipment);

  return equipment;
}
```

### 6.6 MVP词条范围

> **MVP简化**：词条系统仅开放以下内容

| 保留内容 | 说明 |
|----------|------|
| ✅ 基础属性 | 力量、灵力、体质、敏捷、魔力 |
| ✅ 百分比加成 | 攻击%、防御%、HP%、MP% |
| ✅ 战斗属性 | 暴击率、暴击伤害、命中率、闪避率 |

| 暂不开放 | 说明 |
|----------|------|
| 🔜 条件触发 | HP<30%时攻击+20%等 |
| 🔜 特殊效果 | 攻击时触发火球术等 |
| 🔜 负面词缀 | 攻击+15%但防御-10%等 |

---

## 七、套装系统

### 7.1 套装设计

套装由 3-5 件装备组成，穿戴指定数量可获得套装效果。

### 7.2 套装效果

| 穿戴数量 | 效果等级 | 示例 |
|----------|----------|------|
| 2件 | 基础效果 | 攻击+5% |
| 3件 | 中级效果 | 攻击+5%，HP+10% |
| 4件 | 高级效果 | 攻击+5%，HP+10%，暴击+5% |
| 5件 | 完整效果 | 攻击+5%，HP+10%，暴击+5%，特殊技能 |

### 7.3 套装数据结构

```typescript
interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  level: number;           // 适用等级
  equipmentIds: string[];  // 套装包含的装备ID

  bonuses: {
    pieces: number;        // 需要件数
    effects: SetBonus[];   // 获得效果
  }[];
}

interface SetBonus {
  type: 'stat' | 'skill' | 'special';
  stat?: StatType;
  value?: number;
  skillId?: string;
  description: string;
}

// 示例：龙鳞套装
const DragonScaleSet: EquipmentSet = {
  id: 'set_dragon_scale',
  name: '龙鳞套装',
  description: '由龙族鳞片打造的神圣装备',
  level: 50,
  equipmentIds: [
    'equip_dragon_scale_sword',
    'equip_dragon_scale_helm',
    'equip_dragon_scale_armor',
    'equip_dragon_scale_boots',
    'equip_dragon_scale_ring'
  ],
  bonuses: [
    { pieces: 2, effects: [{ type: 'stat', stat: 'physicalAttack', value: 5, description: '攻击+5%' }] },
    { pieces: 3, effects: [
      { type: 'stat', stat: 'physicalAttack', value: 5, description: '攻击+5%' },
      { type: 'stat', stat: 'hp', value: 10, description: 'HP+10%' }
    ]},
    { pieces: 4, effects: [
      { type: 'stat', stat: 'physicalAttack', value: 5, description: '攻击+5%' },
      { type: 'stat', stat: 'hp', value: 10, description: 'HP+10%' },
      { type: 'stat', stat: 'critRate', value: 5, description: '暴击率+5%' }
    ]},
    { pieces: 5, effects: [
      { type: 'stat', stat: 'physicalAttack', value: 5, description: '攻击+5%' },
      { type: 'stat', stat: 'hp', value: 10, description: 'HP+10%' },
      { type: 'stat', stat: 'critRate', value: 5, description: '暴击率+5%' },
      { type: 'skill', skillId: 'passive_dragon_breath', description: '获得技能：龙息' }
    ]}
  ]
};
```

### 7.4 套装效果计算

```typescript
function calculateSetBonuses(
  equippedItems: Equipment[]
): ActiveSetBonus[] {
  const activeBonuses: ActiveSetBonus[] = [];

  // 统计各套装的穿戴数量
  const setCounts = new Map<string, number>();

  for (const item of equippedItems) {
    if (item.setId) {
      setCounts.set(item.setId, (setCounts.get(item.setId) || 0) + 1);
    }
  }

  // 计算激活的套装效果
  for (const [setId, count] of setCounts) {
    const setData = getEquipmentSet(setId);
    if (!setData) continue;

    for (const bonus of setData.bonuses) {
      if (count >= bonus.pieces) {
        activeBonuses.push({
          setId,
          setName: setData.name,
          pieces: bonus.pieces,
          equippedCount: count,
          effects: bonus.effects
        });
      }
    }
  }

  return activeBonuses;
}
```

---

## 八、打造系统

### 8.1 打造配方

```typescript
interface ForgeRecipe {
  id: string;
  resultEquipmentId: string;
  resultQuality: EquipmentQuality;
  requiredMaterials: MaterialRequirement[];
  requiredGold: number;
  requiredRecipe?: string;  // 需要先获得图纸
  successRate: number;
}

interface MaterialRequirement {
  itemId: string;
  count: number;
}

// 示例配方
const DragonBladeRecipe: ForgeRecipe = {
  id: 'forge_dragon_blade',
  resultEquipmentId: 'equip_dragon_blade',
  resultQuality: 'epic',
  requiredMaterials: [
    { itemId: 'item_dragon_scale', count: 10 },
    { itemId: 'item_iron_ore', count: 50 },
    { itemId: 'item_fire_crystal', count: 5 }
  ],
  requiredGold: 50000,
  requiredRecipe: 'recipe_dragon_blade',
  successRate: 0.8
};
```

### 8.2 打造流程

```typescript
function forgeEquipment(
  recipe: ForgeRecipe,
  inventory: Inventory,
  prng: PRNG
): ForgeResult {
  // 检查材料
  for (const mat of recipe.requiredMaterials) {
    if (inventory.getItemCount(mat.itemId) < mat.count) {
      return { success: false, reason: 'insufficient_materials' };
    }
  }

  // 检查金币
  if (inventory.gold < recipe.requiredGold) {
    return { success: false, reason: 'insufficient_gold' };
  }

  // 检查图纸
  if (recipe.requiredRecipe && !inventory.hasRecipe(recipe.requiredRecipe)) {
    return { success: false, reason: 'missing_recipe' };
  }

  // 消耗材料
  for (const mat of recipe.requiredMaterials) {
    inventory.removeItem(mat.itemId, mat.count);
  }
  inventory.gold -= recipe.requiredGold;

  // 成功率判定
  if (prng.next() < recipe.successRate) {
    const equipment = createEquipment(
      recipe.resultEquipmentId,
      recipe.resultQuality,
      prng
    );
    return { success: true, equipment };
  } else {
    return { success: false, reason: 'forge_failed' };
  }
}
```

### 8.3 MVP打造范围

| 功能 | 说明 | MVP状态 |
|------|------|----------|
| **基础打造** | 材料制作固定装备 | ✅ 必需 |
| **随机词条** | 打造时随机生成属性 | ✅ 必需 |
| 定向打造 | 指定属性（消耗更多） | 🔜 后续 |
| 装备重铸 | 改变随机属性 | 🔜 后续 |
| 装备合成 | 低品质合成高品质 | 🔜 后续 |
| 图纸系统 | 先获得图纸才能打造 | 🔜 后续 |

---

## 九、装备数据结构

### 9.1 完整装备接口

```typescript
interface Equipment {
  // 基础信息
  id: string;                    // 实例ID（唯一）
  baseId: string;                // 基础装备ID
  name: string;
  description: string;
  slot: EquipmentSlot;
  quality: EquipmentQuality;
  level: number;                 // 需求等级

  // 套装
  setId?: string;

  // 属性
  baseStats: EquipmentStats;     // 基础属性（品质已应用）
  affixes: EquipmentAffix[];     // 词条列表 ⭐
  enhanceLevel: number;          // 强化等级
  enhanceBonus: EquipmentStats;  // 强化加成
  gemBonus: EquipmentStats;      // 宝石加成

  // 宝石槽
  gemSlots: GemSlot[];
  maxGemSlots: number;           // 最大宝石槽（由品质决定）

  // 元素属性
  element?: Element;
  elementDamage?: number;

  // 特殊效果
  specialEffects?: EquipmentEffect[];

  // 价值
  sellPrice: number;
}

interface EquipmentStats {
  strength?: number;             // 力量
  intelligence?: number;         // 灵力
  vitality?: number;             // 体质
  agility?: number;              // 敏捷
  willpower?: number;            // 魔力

  physicalAttack?: number;       // 物理攻击
  physicalDefense?: number;      // 物理防御
  magicAttack?: number;          // 法术攻击
  magicDefense?: number;         // 法术防御

  hp?: number;                   // HP加成
  mp?: number;                   // MP加成
  speed?: number;                // 速度

  critRate?: number;             // 暴击率
  critDamage?: number;           // 暴击伤害
  dodgeRate?: number;            // 闪避率
  hitRate?: number;              // 命中率
}

type EquipmentQuality = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
```

### 9.2 属性汇总计算

```typescript
function calculateTotalStats(equipment: Equipment): EquipmentStats {
  const total: EquipmentStats = { ...equipment.baseStats };

  // 加上词条属性
  for (const affix of equipment.affixes) {
    if (affix.isPercent) {
      // 百分比加成
      const baseValue = total[affix.stat] || 0;
      total[affix.stat] = baseValue * (1 + affix.value / 100);
    } else {
      // 固定值加成
      total[affix.stat] = (total[affix.stat] || 0) + affix.value;
    }
  }

  // 加上强化加成
  addStats(total, equipment.enhanceBonus);

  // 加上宝石加成
  addStats(total, equipment.gemBonus);

  return total;
}

function addStats(target: EquipmentStats, source: EquipmentStats): void {
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined) {
      target[key] = (target[key] || 0) + value;
    }
  }
}
```

---

## 十、装备等级分段

| 等级段 | 名称 | 套装数量 |
|--------|------|----------|
| 1-10 | 新手 | 2套 |
| 11-20 | 初级 | 3套 |
| 21-30 | 中级 | 3套 |
| 31-40 | 高级 | 3套 |
| 41-50 | 精英 | 4套 |
| 51-60 | 英雄 | 4套 |
| 61-70 | 史诗 | 3套 |
| 71-80 | 传说 | 2套 |
| 81-90 | 神话 | 2套 |
| 91-100 | 至尊 | 1套 |

---

## 十一、待完善事项

1. [x] 设计词条系统（暗黑 + 梦幻缝合）
2. [x] 设计洗练机制（锁定功能）
3. [ ] 设计具体装备列表（武器、防具、饰品）
4. [ ] 设计套装列表（每个等级段2-3套）
5. [ ] 平衡强化成功率和消耗
6. [ ] 设计宝石获取途径
7. [ ] 设计装备分解系统

---

## 十二、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 添加词条系统、洗练机制、MVP范围定义 |
