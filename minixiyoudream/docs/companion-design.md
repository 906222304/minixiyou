# 伙伴系统设计

> 版本：1.0.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 设计原则

- **与主角同配置**：伙伴可穿戴装备、学习门派技能、升级
- **有门派限制**：复用12门派系统
- **有个性表现**：对话、剧情、好感度
- **羁绊系统**：特定伙伴组合激活羁绊效果

### 1.2 伙伴定位

伙伴是与主角并肩作战的战斗单位，与宠物不同：

| 对比项 | 宠物 | 伙伴 |
|--------|------|------|
| **装备系统** | 无 | 完整9槽位 |
| **技能系统** | 宠物技能池 | 门派技能树 |
| **门派限制** | 无 | 有 |
| **获取方式** | 野外捕捉 | 剧情解锁/商店/副本等 |
| **个性表现** | 无 | 有对话、剧情、好感度 |
| **出战位置** | 跟随所属角色 | 独立站位 |

### 1.3 MVP伙伴范围

| 功能 | 说明 | MVP状态 |
|------|------|----------|
| **剧情解锁** | 完成任务解锁伙伴 | ✅ 必需 |
| **装备配置** | 完整9槽位装备 | ✅ 必需 |
| **门派技能** | 复用门派技能树 | ✅ 必需 |
| **好感度** | 影响羁绊效果 | 🔶 简化 |
| **羁绊系统** | 特定组合加成 | 🔶 简化 |
| **个人剧情** | 伙伴专属故事线 | 🔜 后续 |
| **伙伴商店** | 商店购买伙伴 | 🔜 后续 |
| **副本掉落** | 副本获取伙伴 | 🔜 后续 |

---

## 二、伙伴基础

### 2.1 伙伴数据结构

```typescript
interface Companion {
  // 基础信息
  id: string;                    // 实例ID
  baseId: string;                // 伙伴模板ID
  name: string;
  title: string;                 // 称号（如：齐天大圣）
  description: string;           // 描述
  avatar: string;                // 头像

  // 门派信息
  factionId: string;             // 所属门派
  race: Race;                    // 种族

  // 等级与经验
  level: number;
  exp: number;
  maxLevel: number;

  // 属性
  baseStats: CharacterStats;     // 基础属性
  equipmentStats: CharacterStats; // 装备加成
  bondStats: CharacterStats;     // 羁绊加成

  // 装备
  equipment: EquipmentSlots;     // 9槽位装备

  // 技能
  skills: string[];              // 已学习技能ID
  skillPoints: number;           // 可用技能点

  // 好感度
  favorability: number;          // 0-100
  favorabilityLevel: number;     // 1-5级

  // 出战状态
  inParty: boolean;              // 是否在队伍中
  partySlot: 0 | 1;              // 队伍位置（主角=0，伙伴=1或2）

  // 宠物
  activePetId: string | null;    // 出战宠物ID
  pets: Pet[];                   // 伙伴的宠物列表

  // 战斗状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

interface CharacterStats {
  strength: number;              // 力量
  intelligence: number;          // 灵力
  vitality: number;              // 体质
  agility: number;               // 敏捷
  willpower: number;             // 魔力

  physicalAttack: number;        // 物理攻击
  physicalDefense: number;       // 物理防御
  magicAttack: number;           // 法术攻击
  magicDefense: number;          // 法术防御

  maxHp: number;                 // 最大HP
  maxMp: number;                 // 最大MP
  speed: number;                 // 速度

  critRate: number;              // 暴击率
  critDamage: number;            // 暴击伤害
  hitRate: number;               // 命中率
  dodgeRate: number;             // 闪避率
}
```

### 2.2 伙伴模板

```typescript
interface CompanionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;

  // 门派与种族
  factionId: string;
  race: Race;

  // 基础属性
  baseStats: CharacterStats;

  // 成长率
  growthRate: {
    strength: number;
    intelligence: number;
    vitality: number;
    agility: number;
    willpower: number;
  };

  // 初始技能
  initialSkills: string[];

  // 解锁条件
  unlockCondition: UnlockCondition;

  // 羁绊信息
  bonds: string[];               // 可激活的羁绊ID

  // 个性对话
  dialogues: {
    greeting: string[];          // 问候语
    battle: string[];            // 战斗中
    victory: string[];           // 胜利
    defeat: string[];            // 失败
    idle: string[];              // 闲置
  };
}

interface UnlockCondition {
  type: 'story' | 'quest' | 'level' | 'item' | 'dungeon';
  targetId: string;              // 目标ID（任务ID、副本ID等）
  description: string;           // 解锁描述
}
```

---

## 三、MVP伙伴设计（3个）

### 3.1 伙伴列表

| 伙伴 | 门派 | 种族 | 定位 | 解锁条件 |
|------|------|------|------|----------|
| **孙悟空** | 大唐官府 | 人族 | 物理输出 | 完成第一章主线 |
| **小龙女** | 龙宫 | 仙族 | 法术群攻 | 完成东海副本 |
| **猪八戒** | 狮驼岭 | 魔族 | 坦克防御 | 角色达到20级 |

### 3.2 伙伴详细设计

#### 孙悟空（齐天大圣）

```typescript
const SunWukongTemplate: CompanionTemplate = {
  id: 'companion_sun_wukong',
  name: '孙悟空',
  title: '齐天大圣',
  description: '曾经大闹天宫的齐天大圣，如今保护唐僧西天取经。',
  avatar: 'avatar_sun_wukong',

  factionId: 'faction_datang',   // 大唐官府
  race: 'human',

  baseStats: {
    strength: 25,
    intelligence: 10,
    vitality: 18,
    agility: 22,
    willpower: 8,
    physicalAttack: 50,
    physicalDefense: 30,
    magicAttack: 20,
    magicDefense: 20,
    maxHp: 300,
    maxMp: 150,
    speed: 45,
    critRate: 0.1,
    critDamage: 0.5,
    hitRate: 0.95,
    dodgeRate: 0.08
  },

  growthRate: {
    strength: 3.5,
    intelligence: 1.5,
    vitality: 2.5,
    agility: 3.0,
    willpower: 1.0
  },

  initialSkills: [
    'skill_datang_hengsao',      // 横扫千军
    'skill_datang_pojian'        // 破剑式
  ],

  unlockCondition: {
    type: 'story',
    targetId: 'story_chapter_1',
    description: '完成第一章主线剧情'
  },

  bonds: ['bond_journey_west', 'bond_master_disciple'],

  dialogues: {
    greeting: ['师父，俺老孙来也！', '有什么需要帮忙的？'],
    battle: ['吃俺老孙一棒！', '妖怪，哪里跑！'],
    victory: ['小菜一碟！', '这种妖怪，俺老孙一根手指就能搞定！'],
    defeat: ['可恶，俺老孙轻敌了...', '师父莫怕，俺老孙还会回来的！'],
    idle: ['师父，我们什么时候出发？', '俺老孙的金箍棒好久没动了...']
  }
};
```

#### 小龙女（东海公主）

```typescript
const XiaolongnvTemplate: CompanionTemplate = {
  id: 'companion_xiaolongnv',
  name: '小龙女',
  title: '东海公主',
  description: '东海龙王之女，精通水系法术，性格温婉。',
  avatar: 'avatar_xiaolongnv',

  factionId: 'faction_longgong', // 龙宫
  race: 'celestial',

  baseStats: {
    strength: 10,
    intelligence: 28,
    vitality: 15,
    agility: 18,
    willpower: 20,
    physicalAttack: 20,
    physicalDefense: 20,
    magicAttack: 55,
    magicDefense: 35,
    maxHp: 250,
    maxMp: 250,
    speed: 38,
    critRate: 0.08,
    critDamage: 0.4,
    hitRate: 0.95,
    dodgeRate: 0.05
  },

  growthRate: {
    strength: 1.0,
    intelligence: 3.8,
    vitality: 2.0,
    agility: 2.5,
    willpower: 2.8
  },

  initialSkills: [
    'skill_longgong_longjuan',    // 龙卷雨击
    'skill_longgong_longteng'     // 龙腾
  ],

  unlockCondition: {
    type: 'dungeon',
    targetId: 'dungeon_east_sea',
    description: '完成东海副本'
  },

  bonds: ['bond_dragon_royal', 'bond_sea_siblings'],

  dialogues: {
    greeting: ['需要我帮忙吗？', '愿为您效劳。'],
    battle: ['龙吟九霄！', '水龙，听我号令！'],
    victory: ['承让了。', '这就是龙族的力量。'],
    defeat: ['我...还能战斗...', '龙族不会轻易放弃。'],
    idle: ['父王还好吗...', '东海的水，总是那么温暖。']
  }
};
```

#### 猪八戒（天蓬元帅）

```typescript
const ZhuBajieTemplate: CompanionTemplate = {
  id: 'companion_zhu_bajie',
  name: '猪八戒',
  title: '天蓬元帅',
  description: '前世是天蓬元帅，因犯错被贬下凡，如今保护唐僧取经。',
  avatar: 'avatar_zhu_bajie',

  factionId: 'faction_shituoling', // 狮驼岭
  race: 'demon',

  baseStats: {
    strength: 20,
    intelligence: 8,
    vitality: 28,
    agility: 12,
    willpower: 10,
    physicalAttack: 40,
    physicalDefense: 45,
    magicAttack: 15,
    magicDefense: 30,
    maxHp: 400,
    maxMp: 120,
    speed: 28,
    critRate: 0.05,
    critDamage: 0.3,
    hitRate: 0.90,
    dodgeRate: 0.03
  },

  growthRate: {
    strength: 2.5,
    intelligence: 1.0,
    vitality: 3.5,
    agility: 1.5,
    willpower: 1.2
  },

  initialSkills: [
    'skill_shituo_yingji',        // 鹰击
    'skill_shituo_xiangbian'      // 象变
  ],

  unlockCondition: {
    type: 'level',
    targetId: 'level_20',
    description: '角色等级达到20级'
  },

  bonds: ['bond_journey_west', 'bond_master_disciple'],

  dialogues: {
    greeting: ['师父，俺老猪来了！', '有什么好吃的吗？'],
    battle: ['看我的九齿钉耙！', '别惹俺老猪生气！'],
    victory: ['嘿嘿，俺老猪还是有点本事的！', '收工，该吃饭了！'],
    defeat: ['哎哟，好疼...', '师父，先撤吧！'],
    idle: ['高老庄的翠花还好吗...', '肚子饿了...']
  }
};
```

---

## 四、羁绊系统

### 4.1 羁绊类型

| 羁绊类型 | 说明 | 示例 |
|----------|------|------|
| **属性加成** | 激活后获得永久属性提升 | 孙悟空+猪八戒：全队攻击+5% |
| **技能加成** | 强化特定技能效果 | 同门派伙伴：门派技能伤害+10% |
| **战斗效果** | 战斗开始时触发效果 | 取经组合：战斗开始回复10%HP |
| **被动效果** | 持续生效的被动增益 | 龙族组合：水系技能伤害+15% |

### 4.2 羁绊数据结构

```typescript
interface Bond {
  id: string;
  name: string;
  description: string;
  icon: string;

  // 激活条件
  requiredCompanions: string[];  // 需要的伙伴ID
  minFavorability?: number;      // 最低好感度要求

  // 羁绊效果
  effects: BondEffect[];

  // 羁绊等级（可选）
  levels?: {
    level: number;
    requiredFavorability: number;
    bonus: BondEffect;
  }[];
}

interface BondEffect {
  type: 'stat' | 'skill' | 'trigger' | 'passive';
  target: 'self' | 'party' | 'specific';
  targetIds?: string[];

  // 属性加成
  stat?: keyof CharacterStats;
  value?: number;
  isPercent?: boolean;

  // 技能加成
  skillId?: string;
  skillBonus?: number;

  // 触发效果
  trigger?: string;
  triggerEffect?: string;

  description: string;
}
```

### 4.3 MVP羁绊设计

```typescript
const BONDS: Bond[] = [
  {
    id: 'bond_journey_west',
    name: '西天取经',
    description: '师徒三人齐心协力，共赴西天取经',
    icon: 'icon_journey_west',
    requiredCompanions: ['companion_sun_wukong', 'companion_zhu_bajie'],
    minFavorability: 20,
    effects: [
      {
        type: 'stat',
        target: 'party',
        stat: 'physicalAttack',
        value: 5,
        isPercent: true,
        description: '全队物理攻击+5%'
      },
      {
        type: 'trigger',
        target: 'party',
        trigger: 'battle_start',
        triggerEffect: 'heal_10_percent',
        description: '战斗开始时，全队回复10%HP'
      }
    ]
  },
  {
    id: 'bond_master_disciple',
    name: '师徒情深',
    description: '师徒之间的深厚情谊',
    icon: 'icon_master_disciple',
    requiredCompanions: ['companion_sun_wukong', 'companion_zhu_bajie'],
    minFavorability: 50,
    effects: [
      {
        type: 'stat',
        target: 'specific',
        targetIds: ['companion_sun_wukong', 'companion_zhu_bajie'],
        stat: 'critRate',
        value: 3,
        isPercent: true,
        description: '孙悟空、猪八戒暴击率+3%'
      }
    ]
  },
  {
    id: 'bond_dragon_royal',
    name: '龙族血脉',
    description: '龙族血统的强大力量',
    icon: 'icon_dragon',
    requiredCompanions: ['companion_xiaolongnv'],
    minFavorability: 30,
    effects: [
      {
        type: 'skill',
        target: 'self',
        skillId: 'skill_element_water',
        skillBonus: 15,
        description: '小龙女水系技能伤害+15%'
      }
    ]
  }
];
```

### 4.4 羁绊激活计算

```typescript
function calculateActiveBonds(
  partyCompanions: Companion[],
  allBonds: Bond[]
): ActiveBond[] {
  const activeBonds: ActiveBond[] = [];
  const companionIds = partyCompanions.map(c => c.baseId);

  for (const bond of allBonds) {
    // 检查是否满足伙伴要求
    const hasAllCompanions = bond.requiredCompanions.every(id =>
      companionIds.includes(id)
    );

    if (!hasAllCompanions) continue;

    // 检查好感度要求
    if (bond.minFavorability) {
      const allMeetFavorability = bond.requiredCompanions.every(id => {
        const companion = partyCompanions.find(c => c.baseId === id);
        return companion && companion.favorability >= bond.minFavorability;
      });

      if (!allMeetFavorability) continue;
    }

    // 激活羁绊
    activeBonds.push({
      bondId: bond.id,
      name: bond.name,
      description: bond.description,
      effects: bond.effects,
      members: bond.requiredCompanions.map(id => {
        const c = partyCompanions.find(comp => comp.baseId === id);
        return c?.name || id;
      })
    });
  }

  return activeBonds;
}
```

---

## 五、好感度系统

### 5.1 好感度等级

| 等级 | 好感度 | 称号 | 效果 |
|------|--------|------|------|
| 1 | 0-19 | 陌生 | 无加成 |
| 2 | 20-39 | 熟悉 | 全属性+2% |
| 3 | 40-59 | 信任 | 全属性+5%，解锁羁绊 |
| 4 | 60-79 | 亲密 | 全属性+8%，解锁特殊对话 |
| 5 | 80-100 | 生死之交 | 全属性+12%，解锁专属技能 |

### 5.2 好感度获取

```typescript
const FAVORABILITY_SOURCES = {
  battle_win: 2,           // 战斗胜利
  battle_with_companion: 1, // 与伙伴并肩作战
  gift_common: 5,          // 普通礼物
  gift_rare: 15,           // 稀有礼物
  gift_epic: 30,           // 史诗礼物
  quest_complete: 10,      // 完成伙伴任务
  dialogue: 1              // 对话互动
};

function increaseFavorability(
  companion: Companion,
  amount: number
): FavorabilityResult {
  const oldLevel = companion.favorabilityLevel;
  companion.favorability = Math.min(100, companion.favorability + amount);

  // 计算新等级
  const newLevel = calculateFavorabilityLevel(companion.favorability);
  companion.favorabilityLevel = newLevel;

  const levelUp = newLevel > oldLevel;

  return {
    companion,
    oldLevel,
    newLevel,
    levelUp,
    unlockedFeatures: levelUp ? getUnlockedFeatures(newLevel) : []
  };
}

function calculateFavorabilityLevel(favorability: number): number {
  if (favorability >= 80) return 5;
  if (favorability >= 60) return 4;
  if (favorability >= 40) return 3;
  if (favorability >= 20) return 2;
  return 1;
}

function getUnlockedFeatures(level: number): string[] {
  const features: Record<number, string[]> = {
    2: ['全属性+2%'],
    3: ['全属性+5%', '羁绊激活'],
    4: ['全属性+8%', '特殊对话'],
    5: ['全属性+12%', '专属技能']
  };
  return features[level] || [];
}
```

---

## 六、伙伴管理

### 6.1 伙伴存储

```typescript
interface CompanionStorage {
  // 已解锁的伙伴
  companions: Map<string, Companion>;

  // 当前队伍（最多2个伙伴）
  partySlots: {
    slot1: Companion | null;
    slot2: Companion | null;
  };

  // 最大伙伴数
  maxCompanions: number;
}

function addCompanionToParty(
  storage: CompanionStorage,
  companionId: string,
  slot: 1 | 2
): boolean {
  const companion = storage.companions.get(companionId);
  if (!companion) return false;

  // 检查是否已在队伍中
  if (storage.partySlots.slot1?.id === companionId ||
      storage.partySlots.slot2?.id === companionId) {
    return false;
  }

  // 移除原槽位伙伴
  if (slot === 1 && storage.partySlots.slot1) {
    storage.partySlots.slot1.inParty = false;
  } else if (slot === 2 && storage.partySlots.slot2) {
    storage.partySlots.slot2.inParty = false;
  }

  // 添加到队伍
  companion.inParty = true;
  companion.partySlot = slot === 1 ? 0 : 1;

  if (slot === 1) {
    storage.partySlots.slot1 = companion;
  } else {
    storage.partySlots.slot2 = companion;
  }

  return true;
}

function removeCompanionFromParty(
  storage: CompanionStorage,
  slot: 1 | 2
): Companion | null {
  const companion = slot === 1 ? storage.partySlots.slot1 : storage.partySlots.slot2;
  if (!companion) return null;

  companion.inParty = false;
  companion.partySlot = 0;

  if (slot === 1) {
    storage.partySlots.slot1 = null;
  } else {
    storage.partySlots.slot2 = null;
  }

  return companion;
}
```

### 6.2 伙伴解锁

```typescript
function unlockCompanion(
  storage: CompanionStorage,
  templateId: string
): Companion | null {
  // 检查是否已解锁
  if (storage.companions.has(templateId)) {
    return null;
  }

  const template = getCompanionTemplate(templateId);
  if (!template) return null;

  // 创建伙伴实例
  const companion: Companion = {
    id: generateUUID(),
    baseId: templateId,
    name: template.name,
    title: template.title,
    description: template.description,
    avatar: template.avatar,
    factionId: template.factionId,
    race: template.race,
    level: 1,
    exp: 0,
    maxLevel: 100,
    baseStats: { ...template.baseStats },
    equipmentStats: createEmptyStats(),
    bondStats: createEmptyStats(),
    equipment: createEmptyEquipmentSlots(),
    skills: [...template.initialSkills],
    skillPoints: 0,
    favorability: 0,
    favorabilityLevel: 1,
    inParty: false,
    partySlot: 0,
    activePetId: null,
    pets: [],
    hp: template.baseStats.maxHp,
    maxHp: template.baseStats.maxHp,
    mp: template.baseStats.maxMp,
    maxMp: template.baseStats.maxMp
  };

  storage.companions.set(templateId, companion);

  return companion;
}
```

---

## 七、伙伴养成

### 7.1 等级成长

```typescript
function levelUpCompanion(companion: Companion): boolean {
  if (companion.level >= companion.maxLevel) return false;

  const template = getCompanionTemplate(companion.baseId);
  if (!template) return false;

  companion.level++;

  // 更新基础属性（根据成长率）
  companion.baseStats.strength += template.growthRate.strength;
  companion.baseStats.intelligence += template.growthRate.intelligence;
  companion.baseStats.vitality += template.growthRate.vitality;
  companion.baseStats.agility += template.growthRate.agility;
  companion.baseStats.willpower += template.growthRate.willpower;

  // 获得技能点
  companion.skillPoints++;

  // 重新计算最终属性
  recalculateCompanionStats(companion);

  return true;
}

function recalculateCompanionStats(companion: Companion): void {
  const template = getCompanionTemplate(companion.baseId);
  const faction = getFaction(companion.factionId);

  // 基础属性 = 初始基础 + 成长 × 等级
  // + 装备加成 + 羁绊加成 + 好感度加成

  const favorabilityBonus = 1 + (companion.favorabilityLevel - 1) * 0.02;

  // 计算最终属性
  companion.physicalAttack = Math.floor(
    (companion.baseStats.physicalAttack + companion.equipmentStats.physicalAttack) *
    favorabilityBonus
  );

  // ... 其他属性类似
}
```

### 7.2 技能学习

```typescript
function learnCompanionSkill(
  companion: Companion,
  skillId: string
): LearnSkillResult {
  // 检查是否已学习
  if (companion.skills.includes(skillId)) {
    return { success: false, reason: 'already_learned' };
  }

  // 检查技能点
  if (companion.skillPoints <= 0) {
    return { success: false, reason: 'no_skill_points' };
  }

  // 检查门派限制
  const skill = getSkill(skillId);
  if (!skill) {
    return { success: false, reason: 'skill_not_found' };
  }

  if (skill.factionId && skill.factionId !== companion.factionId) {
    return { success: false, reason: 'faction_restriction' };
  }

  if (skill.levelRequirement && companion.level < skill.levelRequirement) {
    return { success: false, reason: 'level_requirement' };
  }

  // 学习技能
  companion.skills.push(skillId);
  companion.skillPoints--;

  return { success: true, skillId };
}
```

---

## 八、伙伴战斗

### 8.1 伙伴战斗属性

```typescript
function getCompanionBattleStats(companion: Companion): BattleStats {
  recalculateCompanionStats(companion);

  return {
    // 基础属性
    maxHp: companion.maxHp,
    maxMp: companion.maxMp,
    hp: companion.hp,
    mp: companion.mp,

    // 攻防属性
    physicalAttack: companion.physicalAttack,
    physicalDefense: companion.physicalDefense,
    magicAttack: companion.magicAttack,
    magicDefense: companion.magicDefense,

    // 战斗属性
    speed: companion.speed,
    critRate: companion.critRate,
    critDamage: companion.critDamage,
    hitRate: companion.hitRate,
    dodgeRate: companion.dodgeRate,

    // 门派信息
    factionId: companion.factionId,
    skills: companion.skills.map(id => getSkill(id)),

    // 宠物
    pet: companion.activePetId ? getPetById(companion.activePetId) : null
  };
}
```

---

## 九、待完善事项

1. [x] 设计3个MVP伙伴
2. [x] 设计羁绊系统
3. [x] 设计好感度系统
4. [ ] 设计更多伙伴（完整版15-20个）
5. [ ] 设计伙伴专属任务
6. [ ] 设计伙伴礼物系统
7. [ ] 平衡伙伴数值

---

## 十、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-12 | 初始版本，包含3个MVP伙伴设计 |
