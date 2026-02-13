# 实现计划: 合宠系统

**分支**: `003-pet-fusion` | **日期**: 2026-02-13 | **规范**: [spec.md](./spec.md)

---

## 概述

实现宠物合成系统，两只宠物合成为一只，资质融合、技能池合并，有概率获得额外收益。

---

## 项目结构

```text
src/
├── types/
│   └── pet.ts               # 扩展宠物类型
├── services/
│   └── petFusionService.ts  # 合宠服务
├── components/
│   └── pet/
│       └── PetFusionModal.tsx   # 合宠弹窗
```

---

## 核心设计

```typescript
interface FusionConfig {
  skillRetentionRate: number;  // 0.6
  bonusSkillChance: number;    // 0.15
  rarityUpChance: number;      // 0.1
  aptitudeBonusChance: number; // 0.1
}

function fusePets(pet1: Pet, pet2: Pet, prng: PRNG): FusionResult {
  // 选择主宠物（等级高的为主）
  const mainPet = pet1.level >= pet2.level ? pet1 : pet2;
  const subPet = pet1.level >= pet2.level ? pet2 : pet1;

  // 资质融合：在范围内随机
  const newAptitude = fuseAptitude(pet1.aptitude, pet2.aptitude, prng);

  // 技能池合并
  const skillPool = new Map([...pet1.skills, ...pet2.skills].map(s => [s.id, s]));

  // 随机保留技能
  const retainedSkills = retainSkills(skillPool, prng);

  // 判定额外收益
  const bonusSkillSlot = prng.next() < FUSION_CONFIG.bonusSkillChance;
  const rarityUp = prng.next() < FUSION_CONFIG.rarityUpChance;

  return { pet: fusedPet, bonusSkillSlot, rarityUp };
}
```

---

## 验收标准

- [ ] 资质融合正确
- [ ] 技能保留率正确
- [ ] 额外收益概率正确
- [ ] 副宠物正确移除
