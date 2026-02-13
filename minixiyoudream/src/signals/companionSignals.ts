// 伙伴状态管理

import { signal, computed } from '@preact/signals-react';
import type { Companion, ActiveBond } from '@/types';
import { generateUUID } from '@/types';
import { COMPANION_TEMPLATES, BONDS } from '@/constants/companions';

/** 已解锁伙伴列表 */
export const companions = signal<Companion[]>([]);

/** 当前出战的伙伴（最多2个） */
export const activeCompanions = computed(() =>
  companions.value.filter(c => c.inParty).slice(0, 2)
);

/** 激活的羁绊 */
export const activeBonds = computed<ActiveBond[]>(() => {
  const active = activeCompanions.value;
  if (active.length < 1) return [];

  const result: ActiveBond[] = [];
  const companionIds = active.map(c => c.baseId);

  for (const bond of Object.values(BONDS)) {
    // 检查是否满足伙伴要求
    const hasAllCompanions = bond.requiredCompanions.every(id =>
      companionIds.includes(id)
    );

    if (!hasAllCompanions) continue;

    // 检查好感度要求
    if (bond.minFavorability !== undefined) {
      const allMeetFavorability = bond.requiredCompanions.every(id => {
        const companion = active.find(c => c.baseId === id);
        return companion && companion.favorability >= bond.minFavorability!;
      });

      if (!allMeetFavorability) continue;
    }

    // 激活羁绊
    result.push({
      bondId: bond.id,
      name: bond.name,
      description: bond.description,
      effects: bond.effects,
      members: bond.requiredCompanions.map(id => {
        const c = active.find(comp => comp.baseId === id);
        return c?.name || id;
      }),
    });
  }

  return result;
});

/** 羁绊加成汇总 */
export const bondBonuses = computed(() => {
  const bonuses: Record<string, number> = {};

  for (const bond of activeBonds.value) {
    for (const effect of bond.effects) {
      if (effect.stat && effect.value) {
        const key = effect.stat;
        bonuses[key] = (bonuses[key] || 0) + effect.value;
      }
    }
  }

  return bonuses;
});

/** 解锁伙伴 */
export function unlockCompanion(templateId: string): Companion | null {
  // 检查是否已解锁
  if (companions.value.some(c => c.baseId === templateId)) {
    return null;
  }

  const template = COMPANION_TEMPLATES[templateId];
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
    equipmentStats: {},
    bondStats: {},
    finalStats: { ...template.baseStats },
    elementResistances: {
      fire: 0,
      ice: 0,
      thunder: 0,
    },
    equipment: {
      weapon: null,
      helmet: null,
      armor: null,
      boots: null,
      belt: null,
      necklace: null,
      charm: null,
      ring1: null,
      ring2: null,
    },
    skills: template.initialSkills.map(id => ({
      skillId: id,
      level: 1,
      cooldownRemaining: 0,
    })),
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
    maxMp: template.baseStats.maxMp,
  };

  companions.value = [...companions.value, companion];
  return companion;
}

/** 设置伙伴出战 */
export function setCompanionActive(companionId: string, active: boolean): boolean {
  const companion = companions.value.find(c => c.id === companionId);
  if (!companion) return false;

  // 如果要出战，检查是否已有2个伙伴出战
  if (active) {
    const currentActive = companions.value.filter(c => c.inParty);
    if (currentActive.length >= 2 && !companion.inParty) {
      return false;
    }
  }

  // 更新状态
  companions.value = companions.value.map(c =>
    c.id === companionId ? { ...c, inParty: active } : c
  );

  return true;
}

/** 增加好感度 */
export function increaseFavorability(companionId: string, amount: number): void {
  const companion = companions.value.find(c => c.id === companionId);
  if (!companion) return;

  const newFavorability = Math.min(100, companion.favorability + amount);
  let newLevel = 1;

  if (newFavorability >= 80) newLevel = 5;
  else if (newFavorability >= 60) newLevel = 4;
  else if (newFavorability >= 40) newLevel = 3;
  else if (newFavorability >= 20) newLevel = 2;

  companions.value = companions.value.map(c =>
    c.id === companionId
      ? { ...c, favorability: newFavorability, favorabilityLevel: newLevel }
      : c
  );
}

/** 获取伙伴 */
export function getCompanion(id: string): Companion | undefined {
  return companions.value.find(c => c.id === id);
}

/** 检查伙伴是否可解锁 */
export function canUnlockCompanion(templateId: string): boolean {
  const template = COMPANION_TEMPLATES[templateId];
  if (!template) return false;

  // 检查是否已解锁
  if (companions.value.some(c => c.baseId === templateId)) {
    return false;
  }

  // TODO: 检查解锁条件
  return true;
}
