# 战斗系统设计

> 版本：1.1.0
> 更新日期：2026-02-12
> 基于 spec.md v1.0.2

---

## 一、系统概述

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **回合制战斗** | 速度决定行动顺序 |
| **6人阵容** | 3人物 + 3宠物，策略搭配 |
| **元素系统** | 冰、火、雷三种元素克制 |
| **自动/手动** | 可切换控制模式 |
| **倍速支持** | 1x/2x/3x倍速 |
| **快节奏** | 单局战斗3-10回合 |

### 1.2 战斗流程

```
遭遇敌人 → 显示战斗界面 → 阵容展示 → 速度排序
    ↓
回合开始 → 行动队列第一位
    ↓
┌─────────────────────────────────────────┐
│  手动模式          │  自动模式           │
│  选择行动类型      │  AI自动选择         │
│  - 攻击           │  - 自动攻击/技能    │
│  - 技能（选择目标）│  - 智能目标选择     │
│  - 防御           │  - 自动防御/逃跑    │
│  - 道具           │                     │
│  - 逃跑           │                     │
└─────────────────────────────────────────┘
    ↓
执行行动 → 计算伤害/效果 → 伤害飘字 → 战斗日志
    ↓
下一个单位行动 → 本回合结束 → 下一回合
    ↓
检查战斗结束条件 → 结算 → 经验/金币/掉落
```

---

## 二、阵容系统（6人阵容）

### 2.1 阵容结构

```typescript
// MVP阵容：3人物 + 3宠物
interface BattleFormation {
  // 人物单位（3个）
  characters: [
    Player,      // 主角
    Companion,   // 伙伴1
    Companion    // 伙伴2
  ];

  // 宠物单位（3个）
  pets: [
    Pet,         // 主角宠物
    Pet,         // 伙伴1宠物
    Pet          // 伙伴2宠物
  ];
}

// 最终版阵容：10人（预留）
interface ExtendedBattleFormation {
  characters: CombatUnit[];  // 最多5人物
  pets: CombatUnit[];        // 最多5宠物
  totalSlots: 10;            // 总上限
}
```

### 2.2 阵容配置

```
阵容布局（移动端竖屏）：

我方区域                    敌方区域
┌─────────┐                ┌─────────┐
│ 主  伙1  伙2 │                │ 敌1  敌2  敌3 │
│ 角  伴   伴  │                │           │
│     +   +   │                │           │
│ 宠1  宠2  宠3│                │           │
└─────────┘                └─────────┘
```

### 2.3 出战配置

```typescript
interface FormationConfig {
  // 主角固定出战
  player: {
    character: Player;
    pet: Pet | null;          // 主角宠物
  };

  // 伙伴槽位（最多2个）
  companionSlots: [
    {
      companion: Companion | null;
      pet: Pet | null;
    },
    {
      companion: Companion | null;
      pet: Pet | null;
    }
  ];

  // 羁绊效果
  activeBonds: Bond[];
}

// 设置出战阵容
function setActiveFormation(
  config: FormationConfig
): void {
  // 验证伙伴数量
  const activeCompanions = config.companionSlots
    .filter(slot => slot.companion !== null);

  if (activeCompanions.length > 2) {
    throw new Error('最多只能上阵2个伙伴');
  }

  // 计算羁绊
  config.activeBonds = calculateBonds(activeCompanions);

  // 应用羁绊加成
  applyBondBonuses(config);
}
```

---

## 三、行动顺序系统

### 3.1 速度计算

```typescript
// 最终速度计算
function calculateFinalSpeed(unit: CombatUnit): number {
  // 基础速度 = 敏捷 × 2 + 等级
  const baseSpeed = unit.stats.agility * 2 + unit.level;

  // 装备加成
  const equipBonus = unit.equipmentBonuses?.speed || 0;

  // 羁绊加成
  const bondBonus = unit.bondBonuses?.speed || 0;

  // 状态加成/减益
  const statusMultiplier = getStatusSpeedMultiplier(unit.statusEffects);

  // 阵法加成（预留）
  const formationBonus = unit.formationBonuses?.speed || 0;

  // 最终速度
  return Math.floor(
    (baseSpeed + equipBonus + bondBonus + formationBonus) * statusMultiplier
  );
}
```

### 3.2 行动队列

```typescript
interface ActionQueueItem {
  unit: CombatUnit;
  speed: number;
  isPlayerSide: boolean;
  position: number;  // 在阵容中的位置
}

function buildActionQueue(
  playerFormation: BattleFormation,
  enemies: Enemy[]
): ActionQueueItem[] {
  const allUnits: ActionQueueItem[] = [];

  // 添加人物
  playerFormation.characters.forEach((char, i) => {
    if (char && char.hp > 0) {
      allUnits.push({
        unit: char,
        speed: calculateFinalSpeed(char),
        isPlayerSide: true,
        position: i
      });
    }
  });

  // 添加宠物
  playerFormation.pets.forEach((pet, i) => {
    if (pet && pet.hp > 0) {
      allUnits.push({
        unit: pet,
        speed: calculateFinalSpeed(pet),
        isPlayerSide: true,
        position: i + 10  // 宠物位置偏移
      });
    }
  });

  // 添加敌人
  enemies.forEach((enemy, i) => {
    if (enemy.hp > 0) {
      allUnits.push({
        unit: enemy,
        speed: calculateFinalSpeed(enemy),
        isPlayerSide: false,
        position: i
      });
    }
  });

  // 按速度排序
  return allUnits.sort((a, b) => b.speed - a.speed);
}
```

---

## 四、战斗控制

### 4.1 自动/手动切换

```typescript
// signals/battleSignals.ts
export const isAutoBattle = signal<boolean>(false);

// 切换自动战斗
function toggleAutoBattle(): void {
  isAutoBattle.value = !isAutoBattle.value;

  if (isAutoBattle.value) {
    // 自动模式下，AI选择行动
    startAutoBattleLoop();
  }
}

// AI选择行动
function selectAIAction(
  unit: CombatUnit,
  battleState: BattleState
): BattleAction {
  const availableSkills = unit.skills.filter(s =>
    unit.mp >= s.mpCost && s.cooldown === 0
  );

  // 优先使用技能（如果有足够MP）
  if (availableSkills.length > 0 && Math.random() > 0.3) {
    const skill = selectBestSkill(unit, availableSkills, battleState);
    const target = selectBestTarget(unit, skill, battleState);
    return { type: 'skill', skillId: skill.id, targetId: target.id };
  }

  // 普通攻击
  const target = selectBestTarget(unit, null, battleState);
  return { type: 'attack', targetId: target.id };
}

// AI目标选择
function selectBestTarget(
  attacker: CombatUnit,
  skill: Skill | null,
  state: BattleState
): CombatUnit {
  const enemies = attacker.isPlayerSide
    ? state.enemies
    : [...state.formation.characters, ...state.formation.pets];

  const aliveEnemies = enemies.filter(e => e && e.hp > 0);

  // 优先攻击低HP目标
  return aliveEnemies.sort((a, b) => a.hp - b.hp)[0];
}
```

### 4.2 倍速控制

```typescript
// signals/battleSignals.ts
export const battleSpeed = signal<1 | 2 | 3>(1);

// 倍速对应的动画时长
const SPEED_DURATIONS = {
  1: { attack: 500, damage: 300, wait: 200 },
  2: { attack: 250, damage: 150, wait: 100 },
  3: { attack: 150, damage: 100, wait: 50 }
};

function getAnimationDuration(action: string): number {
  return SPEED_DURATIONS[battleSpeed.value][action];
}

// 执行战斗回合（带倍速）
async function executeTurn(action: BattleAction): Promise<void> {
  const duration = getAnimationDuration('attack');

  // 播放攻击动画
  await playAttackAnimation(action, duration);

  // 显示伤害
  await showDamageNumber(duration * 0.6);

  // 更新战斗日志
  addBattleLog(action);
}
```

---

## 五、伤害计算系统

### 5.1 物理伤害

```typescript
function calculatePhysicalDamage(
  attacker: CombatUnit,
  defender: CombatUnit,
  skillMultiplier: number = 1.0,
  prng: PRNG
): DamageResult {
  // 基础伤害
  const baseDamage = Math.max(1, attacker.stats.attack - defender.stats.defense);

  // 技能倍率
  const skillDamage = baseDamage * skillMultiplier;

  // 羁绊加成
  const bondMultiplier = 1 + (attacker.bondBonus?.damage || 0);

  // 随机波动 (90% ~ 110%)
  const randomFactor = 0.9 + prng.next() * 0.2;

  // 暴击判定
  const isCritical = prng.roll(attacker.stats.critRate * 100);
  const critMultiplier = isCritical ? 1.5 + attacker.stats.critDamage : 1.0;

  // 最终伤害
  const finalDamage = Math.floor(
    skillDamage * bondMultiplier * randomFactor * critMultiplier
  );

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    type: 'physical'
  };
}
```

### 5.2 法术伤害

```typescript
function calculateMagicDamage(
  attacker: CombatUnit,
  defender: CombatUnit,
  skill: Skill,
  prng: PRNG
): DamageResult {
  // 基础伤害
  const baseDamage = Math.max(1, attacker.stats.magicAttack - defender.stats.magicDefense);

  // 技能倍率
  const skillDamage = baseDamage * skill.multiplier;

  // 元素倍率
  const elementMultiplier = calculateElementMultiplier(
    skill.element,
    defender.elementResistances
  );

  // 羁绊加成
  const bondMultiplier = 1 + (attacker.bondBonus?.magicDamage || 0);

  // 随机波动
  const randomFactor = 0.9 + prng.next() * 0.2;

  // 暴击
  const isCritical = prng.roll(attacker.stats.magicCritRate * 100);
  const critMultiplier = isCritical ? 1.5 + attacker.stats.magicCritDamage : 1.0;

  const finalDamage = Math.floor(
    skillDamage * elementMultiplier * bondMultiplier * randomFactor * critMultiplier
  );

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    type: 'magic',
    element: skill.element
  };
}
```

### 5.3 伤害类型汇总

| 类型 | 计算方式 | 特点 |
|------|----------|------|
| **物理伤害** | 攻击 - 防御 | 受物理防御影响 |
| **法术伤害** | 法攻 - 法防 | 受法防和元素抗性影响 |
| **固定伤害** | 基础值 × 等级系数 | 无视防御 |
| **真实伤害** | 固定值 | 无视一切 |

---

## 六、元素系统

### 6.1 三元素设计

| 元素 | 效果 | 持续时间 | 代表门派 |
|------|------|----------|----------|
| **冰(水)** | 减速30% | 2回合 | 龙宫 |
| **火** | 灼烧3%HP/回合 | 3回合 | 魔王寨 |
| **雷** | 眩晕1回合 | 1回合 | 天宫、方寸山 |

### 6.2 元素克制

```
冰 → 火 → 雷 → 冰
(水克火，火克雷，雷克水)

克制关系：
- 克制：伤害 +30%
- 被克：伤害 -30%
```

### 6.3 元素计算

```typescript
const ELEMENT_ADVANTAGE = {
  ice: 'fire',
  fire: 'thunder',
  thunder: 'ice'
};

function calculateElementMultiplier(
  attackElement: Element,
  defenderResistances: ElementResistances
): number {
  let multiplier = 1.0;

  // 基础抗性
  multiplier *= (1 - (defenderResistances[attackElement] || 0) / 100);

  // 克制加成
  if (defenderResistances.weakness === attackElement) {
    multiplier *= 1.3;  // 克制+30%
  }

  // 被克减益
  if (ELEMENT_ADVANTAGE[defenderResistances.element] === attackElement) {
    multiplier *= 0.7;  // 被克-30%
  }

  return multiplier;
}
```

---

## 七、状态效果系统

### 7.1 状态类型

```typescript
type StatusType =
  | 'buff'    // 增益
  | 'debuff'  // 减益
  | 'control'; // 控制

interface StatusEffect {
  id: string;
  name: string;
  type: StatusType;
  icon: string;

  // 效果
  statModifiers?: Partial<CombatStats>;
  dotDamage?: number;       // 持续伤害
  hotHeal?: number;         // 持续治疗

  // 控制
  stun?: boolean;           // 眩晕
  silence?: boolean;        // 沉默
  taunt?: string;           // 嘲讽目标ID

  // 持续
  duration: number;         // 回合数
  remaining: number;

  // 来源
  sourceId: string;
}
```

### 7.2 状态列表

| 状态 | 类型 | 效果 | 获取方式 |
|------|------|------|----------|
| **攻击UP** | buff | 攻击+20% | 技能、道具 |
| **防御UP** | buff | 防御+30% | 技能、道具 |
| **速度UP** | buff | 速度+20% | 技能 |
| **攻击DOWN** | debuff | 攻击-20% | 敌方技能 |
| **防御DOWN** | debuff | 防御-20% | 敌方技能 |
| **减速** | debuff | 速度-30% | 冰系技能 |
| **灼烧** | debuff | 3%HP/回合 | 火系技能 |
| **眩晕** | control | 无法行动 | 雷系技能 |
| **沉默** | control | 无法使用技能 | 方寸山技能 |
| **封印** | control | 无法行动 | 方寸山技能 |

---

## 八、战斗UI设计

### 8.1 战斗界面布局（移动端）

```
┌─────────────────────────────────┐
│ 回合 3/10    ⚡1x 2x 3x  🔄自动 │  ← 顶部控制栏
├─────────────────────────────────┤
│                                 │
│   ┌────┐   ┌────┐   ┌────┐     │
│   │ 👤 │   │ 👤 │   │ 👤 │     │  ← 敌人区域（小人）
│   │▓▓▓▓│   │▓▓░░│   │▓▓▓▓│     │     血条显示
│   │ 野狼│   │ 山贼│   │ 强盗│     │     名称/等级
│   └────┘   └────┘   └────┘     │
│                                 │
├─────────────────────────────────┤
│  【战斗日志】                    │
│  主角 对 野狼 造成 234 伤害     │  ← 战斗日志（可滚动）
│  暴击！                         │
│  伙伴1 使用 横扫千军            │
│                                 │
├─────────────────────────────────┤
│                                 │
│   ┌────┐   ┌────┐   ┌────┐     │
│   │ 🧑 │   │ 🧑 │   │ 🧑 │     │  ← 我方人物（小人）
│   │▓▓▓▓│   │▓▓▓▓│   │▓▓░░│     │     HP/MP条
│   │ 主角│   │悟空 │   │八戒 │     │     名称
│   └────┘   └────┘   └────┘     │
│   ┌────┐   ┌────┐   ┌────┐     │
│   │ 🐾 │   │ 🐾 │   │ 🐾 │     │  ← 我方宠物（小人）
│   │ 小龙│   │ 小虎│   │ 小熊│     │
│   └────┘   └────┘   └────┘     │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [ 攻击 ] [ 技能 ] [ 防御 ]     │  ← 操作按钮
│  [ 道具 ]       [ 逃跑 ]        │     （大按钮 44px+）
│                                 │
└─────────────────────────────────┘
```

### 8.2 小人动画（SpriteFigure）

```tsx
// components/battle/SpriteFigure.tsx
interface SpriteFigureProps {
  unit: CombatUnit;
  isEnemy?: boolean;
  isPet?: boolean;
  onAction?: () => void;
}

export function SpriteFigure({ unit, isEnemy, isPet, onAction }: SpriteFigureProps) {
  const [animation, setAnimation] = useState<'idle' | 'attack' | 'hurt' | 'dead'>('idle');

  // 动画状态
  useEffect(() => {
    if (unit.hp <= 0) {
      setAnimation('dead');
    }
  }, [unit.hp]);

  return (
    <div className={`
      sprite-figure
      ${isEnemy ? 'enemy' : 'ally'}
      ${isPet ? 'pet' : 'character'}
      animation-${animation}
    `}>
      {/* 小人图形 */}
      <div className="sprite-body">
        {isPet ? '🐾' : isEnemy ? '👤' : '🧑'}
      </div>

      {/* HP条 */}
      <div className="hp-bar">
        <div
          className="hp-fill"
          style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
        />
      </div>

      {/* MP条（仅人物） */}
      {!isPet && (
        <div className="mp-bar">
          <div
            className="mp-fill"
            style={{ width: `${(unit.mp / unit.maxMp) * 100}%` }}
          />
        </div>
      )}

      {/* 名称 */}
      <div className="unit-name">{unit.name}</div>
    </div>
  );
}
```

### 8.3 伤害飘字

```tsx
// components/battle/DamageNumber.tsx
interface DamageNumberProps {
  damage: number;
  isCritical: boolean;
  type: 'physical' | 'magic' | 'heal';
  position: { x: number; y: number };
}

export function DamageNumber({ damage, isCritical, type, position }: DamageNumberProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // 飘字动画
    const animation = setInterval(() => {
      setOffset(prev => prev - 2);
    }, 16);

    // 1秒后消失
    setTimeout(() => {
      clearInterval(animation);
    }, 1000);
  }, []);

  return (
    <div
      className={`
        damage-number
        ${type}
        ${isCritical ? 'critical' : ''}
      `}
      style={{
        left: position.x,
        top: position.y + offset
      }}
    >
      {isCritical && <span className="critical-text">暴击!</span>}
      <span className="damage-value">
        {type === 'heal' ? '+' : '-'}{damage}
      </span>
    </div>
  );
}
```

---

## 九、战斗结算

### 9.1 胜利结算

```typescript
interface BattleResult {
  victory: boolean;

  // 战斗统计
  stats: {
    rounds: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    criticalHits: number;
    skillsUsed: number;
  };

  // 奖励
  rewards: {
    exp: number;
    gold: number;
    items: ItemDrop[];
    petExp?: number;  // 宠物经验
  };

  // 首次击杀奖励
  firstKill?: {
    bonus: Reward;
  };
}

function calculateBattleReward(
  enemies: Enemy[],
  battleState: BattleState
): BattleResult['rewards'] {
  let exp = 0;
  let gold = 0;
  const items: ItemDrop[] = [];

  for (const enemy of enemies) {
    exp += enemy.expReward;
    gold += enemy.goldReward;

    // 掉落计算
    for (const drop of enemy.drops) {
      if (prng.roll(drop.rate)) {
        items.push({
          itemId: drop.itemId,
          count: prng.nextInt(drop.minCount, drop.maxCount)
        });
      }
    }
  }

  // 倍速惩罚（可选）
  if (battleSpeed.value > 1) {
    exp = Math.floor(exp * (1 - (battleSpeed.value - 1) * 0.1));
    gold = Math.floor(gold * (1 - (battleSpeed.value - 1) * 0.1));
  }

  return { exp, gold, items };
}
```

### 9.2 失败处理

```typescript
interface DefeatResult {
  victory: false;

  // 惩罚
  penalty: {
    gold: number;      // 金币损失
    expLoss: number;   // 经验损失（可选）
  };

  // 复活选项
  reviveOptions: [
    { type: 'gold', cost: number },
    { type: 'item', itemId: string },
    { type: 'respawn', location: string }  // 回城复活
  ];
}

function handleDefeat(player: Player): DefeatResult {
  // 金币损失（10%，最多1000）
  const goldLoss = Math.min(1000, Math.floor(player.gold * 0.1));

  return {
    victory: false,
    penalty: {
      gold: goldLoss,
      expLoss: 0  // MVP暂无经验损失
    },
    reviveOptions: [
      { type: 'gold', cost: goldLoss * 2 },
      { type: 'item', itemId: 'item_revive_scroll' },
      { type: 'respawn', location: 'map_changan_city' }
    ]
  };
}
```

---

## 十、战斗日志系统

### 10.1 日志格式

```typescript
interface BattleLog {
  round: number;
  timestamp: number;

  // 行动者信息
  actor: {
    id: string;
    name: string;
    isPlayer: boolean;
  };

  // 行动类型
  action: 'attack' | 'skill' | 'defend' | 'item' | 'escape';
  skillId?: string;
  itemId?: string;

  // 目标
  target?: {
    id: string;
    name: string;
  };

  // 结果
  result: {
    damage?: number;
    heal?: number;
    isCritical?: boolean;
    isMiss?: boolean;
    effectsApplied?: string[];
  };

  // 显示文本
  text: string;
}

// 生成日志文本
function generateLogText(log: BattleLog): string {
  const { actor, action, target, result, skillId } = log;

  switch (action) {
    case 'attack':
      if (result.isMiss) {
        return `${actor.name} 的攻击未命中 ${target!.name}`;
      }
      const critText = result.isCritical ? '暴击！' : '';
      return `${actor.name} 对 ${target!.name} 造成 ${result.damage} 伤害 ${critText}`;

    case 'skill':
      const skill = getSkill(skillId!);
      return `${actor.name} 使用 ${skill.name} 对 ${target!.name} 造成 ${result.damage} 伤害`;

    case 'defend':
      return `${actor.name} 进入防御姿态`;

    case 'item':
      const item = getItem(log.itemId!);
      return `${actor.name} 使用了 ${item.name}`;

    case 'escape':
      return result.isMiss
        ? `${actor.name} 逃跑失败`
        : `${actor.name} 成功逃脱`;
  }
}
```

---

## 十一、MVP简化范围

### 11.1 MVP包含

- ✅ 6人阵容战斗
- ✅ 自动/手动切换
- ✅ 1x/2x/3x倍速
- ✅ 基础伤害计算
- ✅ 元素系统（简化）
- ✅ 小人动画UI
- ✅ 伤害飘字
- ✅ 战斗日志

### 11.2 MVP暂不包含

- ⏳ 阵法系统（预留）
- ⏳ 复杂状态效果
- ⏳ 连击/追击系统
- ⏳ 战斗回放
- ⏳ 跳过战斗

---

## 十二、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | - | 初始版本 |
| 1.1.0 | 2026-02-12 | 根据 spec.md 更新：6人阵容、自动/手动、倍速、小人UI |
