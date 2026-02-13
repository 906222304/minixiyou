# 实现计划: 打书系统

**分支**: `004-pet-skill-learning` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现宠物技能学习系统，使用技能书让宠物学习新技能，支持覆盖概率机制和保护道具。

---

## 项目结构

```text
src/
├── types/
│   └── pet.ts               # 扩展宠物技能类型
├── constants/
│   └── skillBooks.ts        # 技能书配置
├── services/
│   └── petSkillService.ts   # 打书服务
├── components/
│   └── pet/
│       └── PetSkillLearningModal.tsx
```

---

## 核心设计

```typescript
interface SkillBook {
  id: string;
  skillId: string;
  name: string;
  rarity: PetRarity;
  restrictions: {
    petType?: PetType[];
    minLevel?: number;
    element?: Element[];
  };
  overrideBonus?: number;
}

function teachSkillFromBook(
  pet: Pet,
  skillBook: SkillBook,
  useProtection: boolean,
  prng: PRNG
): LearnSkillResult {
  // 检查学习限制
  if (!checkRestrictions(pet, skillBook)) {
    return { success: false, reason: 'restriction' };
  }

  // 检查是否已学习
  if (pet.skills.some(s => s.id === skillBook.skillId)) {
    return { success: false, reason: 'already_learned' };
  }

  // 技能槽未满：直接学习
  if (pet.skills.length < pet.maxSkills) {
    pet.skills.push(getSkill(skillBook.skillId));
    return { success: true };
  }

  // 技能槽已满：覆盖机制
  const overrideChance = 0.7 + (skillBook.overrideBonus || 0);
  if (!useProtection && prng.next() > overrideChance) {
    return { success: false, reason: 'learn_failed' };
  }

  const targetIndex = selectSkillToOverride(pet, prng);
  const overridden = pet.skills[targetIndex];
  pet.skills[targetIndex] = getSkill(skillBook.skillId);

  return { success: true, overriddenSkill: overridden };
}
```

---

## 验收标准

- [ ] 技能学习正确
- [ ] 覆盖概率正确
- [ ] 保护道具正确
- [ ] 学习限制正确
