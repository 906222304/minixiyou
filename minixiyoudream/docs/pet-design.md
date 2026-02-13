# 宠物系统设计

> 版本：1.1.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 设计原则

- **辅助定位**：宠物是战斗辅助，与人物共同组成6人阵容
- **收集乐趣**：多种宠物，鼓励收集和培养
- **策略搭配**：不同宠物有不同技能，适合不同场景
- **深度养成**：合宠、打书、炼妖，追求极品宠物

### 1.2 宠物系统组成

```
宠物捕捉 → 资质鉴定 → 技能学习 → 等级培养 → 合宠/打书/炼妖
```

### 1.3 MVP宠物功能范围

| 功能 | 说明 | MVP状态 |
|------|------|----------|
| **捕捉** | 野外战斗中捕捉怪物 | ✅ 必需 |
| **等级成长** | 跟随战斗获得经验 | ✅ 必需 |
| **资质系统** | 决定成长上限(0.8-1.5) | ✅ 必需 |
| **亲密度** | 影响战斗表现 | 🔶 简化 |
| **合宠** | 两只宠物合成，资质融合 | ✅ 必需 |
| **打书** | 学习新技能，可能覆盖旧技能 | ✅ 必需 |
| **炼妖** | 宠物+材料提升资质 | ✅ 必需 |
| **进化** | 达到条件进化为更高级形态 | 🔜 后续 |
| **内丹** | 额外属性加成 | 🔜 后续 |
| **坐骑技能** | 特殊战斗技能 | 🔜 后续 |

---

## 二、宠物基础

### 2.1 宠物类型

| 类型 | 定位 | 特点 |
|------|------|------|
| **攻击型** | 物理输出 | 高攻击，技能多为伤害 |
| **法术型** | 法术输出 | 高法攻，群体/元素技能 |
| **防御型** | 坦克 | 高HP/防御，保护主人 |
| **辅助型** | 治疗/增益 | 治疗、加状态技能 |
| **控制型** | 封印/减益 | 封印、减速、混乱等 |

### 2.2 宠物属性

```typescript
interface Pet {
  // 基础信息
  id: string;                    // 实例ID
  baseId: string;                // 宠物模板ID
  name: string;                  // 宠物名称（可自定义）
  nickname?: string;             // 昵称
  type: PetType;                 // 类型
  rarity: PetRarity;             // 稀有度
  element?: Element;             // 元素属性

  // 等级与经验
  level: number;
  exp: number;
  maxLevel: number;

  // 资质（决定成长）
  aptitude: PetAptitude;

  // 属性
  stats: PetStats;

  // 技能
  skills: PetSkill[];
  maxSkills: number;             // 最多学习技能数

  // 亲密度（MVP简化）
  intimacy: number;              // 0-100
  intimacyLevel: number;         // 1-5级

  // 忠诚度
  loyalty: number;               // 0-100，影响出战意愿

  // 状态
  isActive: boolean;             // 是否出战
  ownerType: 'player' | 'companion'; // 所属角色类型
  ownerId: string;               // 所属角色ID
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

interface PetAptitude {
  attack: number;      // 攻击资质 (0.8-1.5)
  defense: number;     // 防御资质
  magic: number;       // 法术资质
  speed: number;       // 速度资质
  hp: number;          // 生命资质
  mp: number;          // 法力资质
}

interface PetStats {
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  maxHp: number;
  maxMp: number;
  critRate: number;
  critDamage: number;
}

type PetType = 'attack' | 'magic' | 'defense' | 'support' | 'control';
type PetRarity = 'common' | 'rare' | 'epic' | 'legendary';
```

### 2.3 宠物稀有度

| 稀有度 | 颜色 | 资质范围 | 技能槽 | 出现率 |
|--------|------|----------|--------|--------|
| **普通** | 白色 | 0.8-1.0 | 2 | 60% |
| **稀有** | 蓝色 | 1.0-1.2 | 3 | 25% |
| **史诗** | 紫色 | 1.2-1.35 | 4 | 12% |
| **传说** | 橙色 | 1.35-1.5 | 5 | 3% |

---

## 三、宠物捕捉系统

### 3.1 捕捉规则

```
捕捉条件：
├── 目标HP < 30%
├── 拥有捕捉道具
└── 捕捉率计算

捕捉率 = 基础20% + (30%-HP%)×1.5% + 异常状态加成×10% + 道具加成 - 稀有度惩罚
```

```typescript
interface CaptureConfig {
  minHpPercent: number;     // HP低于此百分比才能捕捉（默认30%）
  baseCaptureRate: number;  // 基础捕捉率
  itemBonus: number;        // 捕捉道具加成
}

function calculateCaptureRate(
  target: Enemy,
  item: CaptureItem
): number {
  // 基础捕捉率
  let rate = 0.2;

  // HP因素：HP越低，捕捉率越高
  const hpPercent = target.hp / target.maxHp;
  if (hpPercent < 0.3) {
    rate += (0.3 - hpPercent) * 1.5;  // HP每低1%，+1.5%
  }

  // 状态因素：异常状态增加捕捉率
  if (target.debuffs.length > 0) {
    rate += 0.1 * target.debuffs.length;
  }

  // 道具加成
  rate += item.captureBonus;

  // 稀有度惩罚
  const rarityPenalty = {
    common: 0,
    rare: -0.1,
    epic: -0.2,
    legendary: -0.3
  };
  rate += rarityPenalty[target.rarity] || 0;

  return Math.max(0.05, Math.min(0.95, rate));
}
```

### 3.2 捕捉道具

| 道具 | 效果 | 获取途径 |
|------|------|----------|
| 普通捕捉网 | 捕捉率+10% | 商店购买 |
| 高级捕捉网 | 捕捉率+25% | 商店/副本 |
| 精英捕捉网 | 捕捉率+40% | 副本/活动 |
| 大师捕捉网 | 捕捉率+60%，稀有度+1 | 活动限定 |

### 3.3 捕捉后生成

```typescript
function generateCapturedPet(
  enemyTemplate: Enemy,
  captureRate: number,
  prng: PRNG
): Pet | null {
  if (prng.next() > captureRate) {
    return null;  // 捕捉失败
  }

  // 确定稀有度
  const rarity = rollPetRarity(enemyTemplate.rarity, prng);

  // 生成资质
  const aptitude = generateAptitude(rarity, prng);

  // 创建宠物实例
  const pet: Pet = {
    id: generateUUID(),
    baseId: enemyTemplate.petTemplateId,
    name: enemyTemplate.name,
    type: determinePetType(enemyTemplate),
    rarity,
    element: enemyTemplate.element,
    level: Math.max(1, enemyTemplate.level - 5),  // 捕捉后等级-5
    exp: 0,
    maxLevel: 100,
    aptitude,
    stats: calculatePetStats(enemyTemplate.baseStats, aptitude, rarity),
    skills: [...enemyTemplate.skills.slice(0, getMaxSkills(rarity))],
    maxSkills: getMaxSkills(rarity),
    intimacy: 50,
    intimacyLevel: 1,
    loyalty: 80,
    isActive: false,
    ownerType: 'player',
    ownerId: '',
    hp: 0,
    maxHp: 0,
    mp: 0,
    maxMp: 0
  };

  // 计算最终HP/MP
  pet.maxHp = pet.stats.maxHp;
  pet.maxMp = pet.stats.maxMp;
  pet.hp = pet.maxHp;
  pet.mp = pet.maxMp;

  return pet;
}
```

---

## 四、合宠系统（资质融合）

### 4.1 合宠规则

```
合宠规则：
├── 两只宠物合成
├── 资质取随机值（在两只宠物资质范围内）
├── 技能池合并，随机保留
├── 有概率获得额外技能槽
└── 稀有度可能提升
```

### 4.2 合宠数据结构

```typescript
interface FusionConfig {
  // 资质融合方式
  aptitudeFusion: 'random' | 'average' | 'max';  // MVP使用random

  // 技能保留规则
  skillRetentionRate: number;  // 每个技能保留概率
  bonusSkillChance: number;    // 额外技能槽概率

  // 稀有度提升
  rarityUpChance: number;      // 稀有度提升概率
}

const FUSION_CONFIG: FusionConfig = {
  aptitudeFusion: 'random',
  skillRetentionRate: 0.6,
  bonusSkillChance: 0.15,
  rarityUpChance: 0.1
};

interface FusionResult {
  pet: Pet;                    // 合成后的宠物
  absorbedSkills: string[];    // 吸收的技能ID
  aptitudeChanges: {           // 资质变化
    stat: string;
    oldValue: number;
    newValue: number;
  }[];
  rarityUp: boolean;           // 是否稀有度提升
  bonusSkillSlot: boolean;     // 是否获得额外技能槽
}
```

### 4.3 合宠实现

```typescript
function fusePets(
  pet1: Pet,
  pet2: Pet,
  prng: PRNG
): FusionResult {
  // 选择主宠物（等级高的为主）
  const mainPet = pet1.level >= pet2.level ? pet1 : pet2;
  const subPet = pet1.level >= pet2.level ? pet2 : pet1;

  // 资质融合：在两只宠物资质范围内随机取值
  const newAptitude: PetAptitude = {
    attack: randomInRange(prng, pet1.aptitude.attack, pet2.aptitude.attack),
    defense: randomInRange(prng, pet1.aptitude.defense, pet2.aptitude.defense),
    magic: randomInRange(prng, pet1.aptitude.magic, pet2.aptitude.magic),
    speed: randomInRange(prng, pet1.aptitude.speed, pet2.aptitude.speed),
    hp: randomInRange(prng, pet1.aptitude.hp, pet2.aptitude.hp),
    mp: randomInRange(prng, pet1.aptitude.mp, pet2.aptitude.mp)
  };

  // 记录资质变化
  const aptitudeChanges = Object.keys(newAptitude).map(stat => ({
    stat,
    oldValue: mainPet.aptitude[stat],
    newValue: newAptitude[stat]
  }));

  // 技能池合并
  const skillPool = new Map<string, PetSkill>();
  [...pet1.skills, ...pet2.skills].forEach(skill => {
    skillPool.set(skill.id, skill);
  });

  // 随机保留技能
  const retainedSkills: PetSkill[] = [];
  const absorbedSkills: string[] = [];

  skillPool.forEach((skill, id) => {
    if (prng.next() < FUSION_CONFIG.skillRetentionRate) {
      retainedSkills.push(skill);
      absorbedSkills.push(id);
    }
  });

  // 稀有度提升判定
  let rarityUp = false;
  let newRarity = mainPet.rarity;
  if (prng.next() < FUSION_CONFIG.rarityUpChance) {
    const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
    const currentIndex = rarityOrder.indexOf(mainPet.rarity);
    if (currentIndex < rarityOrder.length - 1) {
      newRarity = rarityOrder[currentIndex + 1] as PetRarity;
      rarityUp = true;
    }
  }

  // 额外技能槽判定
  let bonusSkillSlot = false;
  let newMaxSkills = mainPet.maxSkills;
  if (prng.next() < FUSION_CONFIG.bonusSkillChance) {
    const maxPossible = getMaxSkills(newRarity);
    if (newMaxSkills < maxPossible) {
      newMaxSkills++;
      bonusSkillSlot = true;
    }
  }

  // 创建合成后的宠物
  const fusedPet: Pet = {
    ...mainPet,
    id: generateUUID(),
    aptitude: newAptitude,
    rarity: newRarity,
    maxSkills: newMaxSkills,
    skills: retainedSkills.slice(0, newMaxSkills)
  };

  // 重新计算属性
  fusedPet.stats = calculatePetStats(
    getPetTemplate(fusedPet.baseId).baseStats,
    fusedPet.aptitude,
    fusedPet.rarity,
    fusedPet.level
  );
  fusedPet.maxHp = fusedPet.stats.maxHp;
  fusedPet.maxMp = fusedPet.stats.maxMp;
  fusedPet.hp = fusedPet.maxHp;
  fusedPet.mp = fusedPet.maxMp;

  return {
    pet: fusedPet,
    absorbedSkills,
    aptitudeChanges,
    rarityUp,
    bonusSkillSlot
  };
}

// 辅助函数：在范围内随机取值（可以有偏移）
function randomInRange(prng: PRNG, val1: number, val2: number): number {
  const min = Math.min(val1, val2);
  const max = Math.max(val1, val2);
  // 有10%概率超出范围（向上）
  const range = max - min;
  const bonus = prng.next() < 0.1 ? range * 0.1 * prng.next() : 0;
  return Math.min(1.5, min + (max - min) * prng.next() + bonus);
}
```

---

## 五、打书系统（技能学习）

### 5.1 打书规则

```
打书规则：
├── 使用技能书学习新技能
├── 技能槽未满：直接学习
├── 技能槽已满：随机覆盖一个技能
├── 高级技能书有更高覆盖低级技能概率
└── 必定成功的保护机制（可选）
```

### 5.2 打书数据结构

```typescript
interface SkillBook {
  id: string;
  skillId: string;             // 教授的技能ID
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  // 学习限制
  restrictions: {
    petType?: PetType[];       // 限定宠物类型
    minLevel?: number;         // 最低等级要求
    element?: Element[];       // 限定元素
  };

  // 覆盖概率加成
  overrideBonus?: number;      // 覆盖低级技能的额外概率
}

interface LearnSkillResult {
  success: boolean;
  newSkill?: PetSkill;
  overriddenSkill?: PetSkill;  // 被覆盖的技能
  reason?: string;
}
```

### 5.3 打书实现

```typescript
function teachSkillFromBook(
  pet: Pet,
  skillBook: SkillBook,
  useProtection: boolean,      // 是否使用保护（必定成功）
  prng: PRNG
): LearnSkillResult {
  const skill = getSkillById(skillBook.skillId);
  if (!skill) {
    return { success: false, reason: 'skill_not_found' };
  }

  // 检查学习限制
  if (skillBook.restrictions.petType) {
    if (!skillBook.restrictions.petType.includes(pet.type)) {
      return { success: false, reason: 'pet_type_restriction' };
    }
  }

  if (skillBook.restrictions.minLevel) {
    if (pet.level < skillBook.restrictions.minLevel) {
      return { success: false, reason: 'level_requirement' };
    }
  }

  if (skillBook.restrictions.element) {
    if (!skillBook.restrictions.element.includes(pet.element!)) {
      return { success: false, reason: 'element_restriction' };
    }
  }

  // 检查是否已学习
  if (pet.skills.some(s => s.id === skill.id)) {
    return { success: false, reason: 'already_learned' };
  }

  // 技能槽未满：直接学习
  if (pet.skills.length < pet.maxSkills) {
    pet.skills.push(skill);
    return { success: true, newSkill: skill };
  }

  // 技能槽已满：覆盖机制
  // 选择覆盖目标（使用保护时，必定成功覆盖指定技能）
  let targetIndex: number;

  if (useProtection) {
    // 保护模式：随机覆盖，但必定成功
    targetIndex = Math.floor(prng.next() * pet.skills.length);
  } else {
    // 普通模式：有概率学习失败
    // 高级技能书更容易覆盖低级技能
    const overrideChance = 0.7 + (skillBook.overrideBonus || 0);
    if (prng.next() > overrideChance) {
      return { success: false, reason: 'learn_failed' };
    }
    targetIndex = selectSkillToOverride(pet, skillBook, prng);
  }

  const overriddenSkill = pet.skills[targetIndex];
  pet.skills[targetIndex] = skill;

  return {
    success: true,
    newSkill: skill,
    overriddenSkill
  };
}

// 选择要覆盖的技能（优先覆盖低级/弱技能）
function selectSkillToOverride(
  pet: Pet,
  skillBook: SkillBook,
  prng: PRNG
): number {
  // 计算每个技能的"保留权重"
  const weights = pet.skills.map((skill, index) => {
    let weight = 1;

    // 高级技能更难被覆盖
    const skillRarity = skill.rarity || 'common';
    const rarityWeight = { common: 1, rare: 2, epic: 3, legendary: 4 };
    weight *= rarityWeight[skillRarity];

    // 被动技能更难被覆盖
    if (skill.type === 'passive') {
      weight *= 1.5;
    }

    return weight;
  });

  // 权重越低，越容易被覆盖
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = prng.next() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }

  return weights.length - 1;
}
```

---

## 六、炼妖系统（资质提升）

### 6.1 炼妖规则

```
炼妖规则：
├── 宠物 + 材料 → 提升资质
├── 不同材料提升不同资质
├── 有成功率，失败可能降低资质
├── 可使用保护道具避免失败惩罚
└── 资质上限为1.5（神话品质可达1.6）
```

### 6.2 炼妖数据结构

```typescript
interface AlchemyMaterial {
  id: string;
  name: string;
  targetAptitude: keyof PetAptitude;  // 提升的资质类型
  bonusRange: [number, number];       // 提升范围
  successRate: number;                // 基础成功率
  failPenalty: number;                // 失败惩罚（资质降低）
}

interface AlchemyResult {
  success: boolean;
  aptitudeChange?: {
    stat: keyof PetAptitude;
    oldValue: number;
    newValue: number;
  };
  reason?: string;
}

const ALCHEMY_MATERIALS: AlchemyMaterial[] = [
  {
    id: 'material_attack_essence',
    name: '攻击精华',
    targetAptitude: 'attack',
    bonusRange: [0.02, 0.05],
    successRate: 0.7,
    failPenalty: 0.02
  },
  {
    id: 'material_defense_essence',
    name: '防御精华',
    targetAptitude: 'defense',
    bonusRange: [0.02, 0.05],
    successRate: 0.7,
    failPenalty: 0.02
  },
  {
    id: 'material_magic_essence',
    name: '法术精华',
    targetAptitude: 'magic',
    bonusRange: [0.02, 0.05],
    successRate: 0.7,
    failPenalty: 0.02
  },
  {
    id: 'material_hp_essence',
    name: '生命精华',
    targetAptitude: 'hp',
    bonusRange: [0.02, 0.05],
    successRate: 0.75,
    failPenalty: 0.015
  },
  {
    id: 'material_speed_essence',
    name: '速度精华',
    targetAptitude: 'speed',
    bonusRange: [0.01, 0.03],
    successRate: 0.6,
    failPenalty: 0.02
  }
];
```

### 6.3 炼妖实现

```typescript
function alchemyPet(
  pet: Pet,
  material: AlchemyMaterial,
  useProtection: boolean,
  prng: PRNG
): AlchemyResult {
  const stat = material.targetAptitude;
  const currentValue = pet.aptitude[stat];

  // 检查资质上限
  const maxAptitude = pet.rarity === 'legendary' ? 1.6 : 1.5;
  if (currentValue >= maxAptitude) {
    return { success: false, reason: 'aptitude_maxed' };
  }

  // 成功率判定
  const successRate = useProtection ? 1.0 : material.successRate;

  if (prng.next() < successRate) {
    // 成功：提升资质
    const bonus = randomInRange(prng, material.bonusRange[0], material.bonusRange[1]);
    const newValue = Math.min(maxAptitude, currentValue + bonus);

    pet.aptitude[stat] = newValue;

    // 重新计算属性
    pet.stats = calculatePetStats(
      getPetTemplate(pet.baseId).baseStats,
      pet.aptitude,
      pet.rarity,
      pet.level
    );
    pet.maxHp = pet.stats.maxHp;
    pet.maxMp = pet.stats.maxMp;

    return {
      success: true,
      aptitudeChange: {
        stat,
        oldValue: currentValue,
        newValue
      }
    };
  } else {
    // 失败
    if (!useProtection) {
      // 降低资质
      const penalty = material.failPenalty;
      const newValue = Math.max(0.8, currentValue - penalty);

      pet.aptitude[stat] = newValue;

      // 重新计算属性
      pet.stats = calculatePetStats(
        getPetTemplate(pet.baseId).baseStats,
        pet.aptitude,
        pet.rarity,
        pet.level
      );
      pet.maxHp = pet.stats.maxHp;
      pet.maxMp = pet.stats.maxMp;

      return {
        success: false,
        aptitudeChange: {
          stat,
          oldValue: currentValue,
          newValue
        },
        reason: 'alchemy_failed_penalty'
      };
    }

    return { success: false, reason: 'alchemy_failed_protected' };
  }
}
```

---

## 七、宠物培养系统

### 7.1 等级成长

```typescript
// 宠物经验表
const PET_EXP_TABLE = [
  0,      // Lv1
  100,    // Lv2
  250,    // Lv3
  500,    // Lv4
  // ...
];

function calculatePetStats(
  baseStats: PetStats,
  aptitude: PetAptitude,
  rarity: PetRarity,
  level: number
): PetStats {
  const rarityMultiplier = {
    common: 1.0,
    rare: 1.1,
    epic: 1.2,
    legendary: 1.3
  };

  const mult = rarityMultiplier[rarity];
  const levelFactor = 1 + (level - 1) * 0.05;  // 每级+5%

  return {
    attack: Math.floor(baseStats.attack * aptitude.attack * mult * levelFactor),
    defense: Math.floor(baseStats.defense * aptitude.defense * mult * levelFactor),
    magicAttack: Math.floor(baseStats.magicAttack * aptitude.magic * mult * levelFactor),
    magicDefense: Math.floor(baseStats.magicDefense * aptitude.magic * mult * levelFactor),
    speed: Math.floor(baseStats.speed * aptitude.speed * mult * levelFactor),
    maxHp: Math.floor(baseStats.maxHp * aptitude.hp * mult * levelFactor),
    maxMp: Math.floor(baseStats.maxMp * aptitude.mp * mult * levelFactor),
    critRate: baseStats.critRate,
    critDamage: baseStats.critDamage
  };
}
```

### 7.2 亲密度系统（MVP简化）

```typescript
interface IntimacyLevel {
  level: number;
  requiredIntimacy: number;
  bonuses: IntimacyBonus[];
}

const INTIMACY_LEVELS: IntimacyLevel[] = [
  { level: 1, requiredIntimacy: 0, bonuses: [] },
  { level: 2, requiredIntimacy: 20, bonuses: [{ stat: 'all', value: 0.05 }] },
  { level: 3, requiredIntimacy: 50, bonuses: [{ stat: 'all', value: 0.10 }] },
  { level: 4, requiredIntimacy: 80, bonuses: [{ stat: 'all', value: 0.15 }] },
  { level: 5, requiredIntimacy: 100, bonuses: [{ stat: 'all', value: 0.20 }] }
];

// MVP简化：亲密度只通过战斗获得
const INTIMACY_SOURCES = {
  battle_win: 1,       // 战斗胜利
  battle_participate: 0.5  // 参与战斗
};
```

### 7.3 宠物喂食

```typescript
interface PetFood {
  id: string;
  name: string;
  expBonus: number;      // 经验加成
  intimacyBonus: number; // 亲密度加成
  quality: 'common' | 'rare' | 'epic';
}

function feedPet(pet: Pet, food: PetFood): void {
  // 增加经验
  pet.exp += food.expBonus;

  // 增加亲密度
  pet.intimacy = Math.min(100, pet.intimacy + food.intimacyBonus);

  // 检查升级
  while (pet.exp >= PET_EXP_TABLE[pet.level] && pet.level < pet.maxLevel) {
    pet.exp -= PET_EXP_TABLE[pet.level];
    pet.level++;
    // 重新计算属性
    pet.stats = calculatePetStats(
      getPetTemplate(pet.baseId).baseStats,
      pet.aptitude,
      pet.rarity,
      pet.level
    );
    pet.maxHp = pet.stats.maxHp;
    pet.maxMp = pet.stats.maxMp;
  }
}
```

---

## 八、宠物技能系统

### 8.1 技能类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **主动技能** | 战斗中手动/自动释放 | 火球术、撕咬 |
| **被动技能** | 永久生效 | 攻击+10%、暴击+5% |
| **触发技能** | 满足条件触发 | 反击、濒死回复 |

### 8.2 技能数据结构

```typescript
interface PetSkill {
  id: string;
  name: string;
  type: 'active' | 'passive' | 'trigger';
  description: string;
  rarity?: PetRarity;          // 技能稀有度
  mpCost?: number;
  cooldown?: number;
  effects: SkillEffect[];
  learnRequirements?: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };
}
```

---

## 九、宠物战斗系统

### 9.1 宠物AI

```typescript
enum PetAIBehavior {
  AGGRESSIVE = 'aggressive',    // 激进：优先攻击
  DEFENSIVE = 'defensive',      // 防御：优先保护主人
  BALANCED = 'balanced',        // 平衡：根据情况选择
  SUPPORT = 'support'           // 辅助：优先治疗/增益
}

function getPetAction(
  pet: Pet,
  battleState: BattleState,
  behavior: PetAIBehavior
): PetAction {
  const availableSkills = pet.skills.filter(s =>
    s.type === 'active' &&
    pet.mp >= (s.mpCost || 0)
  );

  switch (behavior) {
    case PetAIBehavior.AGGRESSIVE:
      return selectAggressiveAction(pet, availableSkills, battleState);
    case PetAIBehavior.DEFENSIVE:
      return selectDefensiveAction(pet, availableSkills, battleState);
    case PetAIBehavior.SUPPORT:
      return selectSupportAction(pet, availableSkills, battleState);
    default:
      return selectBalancedAction(pet, availableSkills, battleState);
  }
}
```

### 9.2 宠物伤害计算

```typescript
function calculatePetDamage(
  pet: Pet,
  target: CombatUnit,
  skill?: PetSkill
): DamageResult {
  const skillMultiplier = skill?.multiplier || 1.0;

  // 根据宠物类型选择攻击属性
  const isMagicAttack = pet.type === 'magic' || pet.type === 'support';
  const attack = isMagicAttack ? pet.stats.magicAttack : pet.stats.attack;
  const defense = isMagicAttack ? target.magicDefense : target.physicalDefense;

  // 基础伤害
  const baseDamage = Math.max(1, attack - defense);

  // 技能倍率
  const skillDamage = baseDamage * skillMultiplier;

  // 亲密度加成
  const intimacyBonus = 1 + (pet.intimacyLevel - 1) * 0.05;

  // 随机波动
  const randomFactor = 0.9 + Math.random() * 0.2;

  // 暴击
  const isCritical = Math.random() < pet.stats.critRate;
  const critMultiplier = isCritical ? 1.5 + pet.stats.critDamage : 1.0;

  const finalDamage = Math.floor(
    skillDamage * intimacyBonus * randomFactor * critMultiplier
  );

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    type: isMagicAttack ? 'magic' : 'physical',
    element: skill?.element || pet.element
  };
}
```

---

## 十、宠物管理界面

### 10.1 宠物列表（6人阵容适配）

```typescript
interface PetStorage {
  // 按角色分组
  playerPets: Pet[];            // 主角的宠物
  companionPets: Map<string, Pet[]>; // 伙伴的宠物（伙伴ID -> 宠物列表）

  // 当前出战
  activePets: {
    player: Pet | null;
    companion1: Pet | null;
    companion2: Pet | null;
  };

  maxPetsPerCharacter: number;  // 每个角色最大宠物数（默认5）
}

function setActivePet(
  storage: PetStorage,
  petId: string,
  ownerType: 'player' | 'companion',
  ownerId?: string
): boolean {
  const petList = ownerType === 'player'
    ? storage.playerPets
    : storage.companionPets.get(ownerId!) || [];

  const pet = petList.find(p => p.id === petId);
  if (!pet) return false;

  // 取消当前出战
  const currentActive = ownerType === 'player'
    ? storage.activePets.player
    : (ownerId === 'companion1' ? storage.activePets.companion1 : storage.activePets.companion2);

  if (currentActive) {
    currentActive.isActive = false;
  }

  // 设置新出战
  pet.isActive = true;

  if (ownerType === 'player') {
    storage.activePets.player = pet;
  } else {
    if (ownerId === 'companion1') {
      storage.activePets.companion1 = pet;
    } else {
      storage.activePets.companion2 = pet;
    }
  }

  return true;
}
```

### 10.2 宠物放生

```typescript
function releasePet(
  storage: PetStorage,
  petId: string,
  ownerType: 'player' | 'companion',
  ownerId?: string
): ItemDrop[] | null {
  const petList = ownerType === 'player'
    ? storage.playerPets
    : storage.companionPets.get(ownerId!) || [];

  const petIndex = petList.findIndex(p => p.id === petId);
  if (petIndex === -1) return null;

  const pet = petList[petIndex];

  // 出战中的宠物不能放生
  if (pet.isActive) return null;

  // 移除宠物
  petList.splice(petIndex, 1);

  // 返回放生奖励
  const rewards: ItemDrop[] = [
    { itemId: 'item_pet_food', count: Math.floor(pet.level / 10) + 1 }
  ];

  // 稀有宠物额外奖励
  if (pet.rarity !== 'common') {
    rewards.push({ itemId: 'item_pet_token', count: 1 });
  }

  return rewards;
}
```

---

## 十一、宠物数据示例

### 11.1 宠物模板

```typescript
interface PetTemplate {
  id: string;
  name: string;
  description: string;
  type: PetType;
  baseRarity: PetRarity;
  baseStats: PetStats;
  learnableSkills: string[];     // 可学习的技能ID
  evolution?: Evolution;         // 进化信息
  captureLocations: string[];    // 可捕捉的地图ID
}

// 示例：小火龙
const FireDragonTemplate: PetTemplate = {
  id: 'pet_fire_dragon',
  name: '小火龙',
  description: '一只活泼的小火龙，喜欢喷吐火焰',
  type: 'magic',
  baseRarity: 'rare',
  baseStats: {
    attack: 20,
    defense: 15,
    magicAttack: 35,
    magicDefense: 25,
    speed: 30,
    maxHp: 200,
    maxMp: 150,
    critRate: 0.05,
    critDamage: 0.5
  },
  learnableSkills: [
    'skill_fireball',
    'skill_flame_breath',
    'skill_burn',
    'skill_fire_shield'
  ],
  captureLocations: ['map_volcano', 'map_fire_cave']
};
```

---

## 十二、待完善事项

1. [x] 设计合宠系统（资质融合）
2. [x] 设计打书系统（技能学习）
3. [x] 设计炼妖系统（资质提升）
4. [ ] 设计具体宠物列表（初始设计15种）
5. [ ] 设计宠物技能书列表
6. [ ] 平衡宠物数值
7. [ ] 设计宠物图鉴系统

---

## 十三、宠物数量规划

| 类型 | 数量 | 获取途径 |
|------|------|----------|
| 攻击型 | 5 | 野外捕捉、副本 |
| 法术型 | 5 | 野外捕捉、副本 |
| 防御型 | 3 | 副本掉落 |
| 辅助型 | 2 | 任务奖励、活动 |
| 控制型 | 2 | 特殊副本 |
| **总计** | **17** | - |

---

## 十四、初始宠物

创建角色时，根据门派推荐初始宠物：

| 门派类型 | 推荐初始宠物 |
|----------|--------------|
| 物理攻击门派 | 小狼（攻击型） |
| 法术门派 | 小精灵（法术型） |
| 辅助门派 | 小熊猫（辅助型） |
| 控制门派 | 小狐狸（控制型） |

---

## 十五、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 添加合宠、打书、炼妖系统，适配6人阵容 |
