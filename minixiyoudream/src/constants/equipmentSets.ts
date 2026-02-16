// 装备套装配置 - 梦幻西游风格

import type { CombatStats } from '@/types';

// ==================== 套装类型定义 ====================

/** 套装效果类型 */
export type SetBonusType =
  | 'stat_flat'      // 固定属性加成
  | 'stat_percent'   // 百分比属性加成
  | 'special'        // 特殊效果
  | 'immunity';      // 免疫效果

/** 套装效果配置 */
export interface SetBonusEffect {
  type: SetBonusType;
  stat?: keyof CombatStats;
  value: number;
  isPercent: boolean;
  description: string;
  // 特殊效果的额外数据
  specialData?: {
    effectType: string;
    value?: number;
    duration?: number;
  };
}

/** 套装配置 */
export interface EquipmentSetConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  // 套装品质
  quality: 'rare' | 'epic' | 'legendary' | 'mythic';
  // 等级要求
  levelRequirement: number;
  // 包含的装备模板ID（留空则动态匹配）
  pieces?: string[];
  // 套装效果（按件数）
  bonuses: {
    pieceCount: number;
    effects: SetBonusEffect[];
  }[];
}

// ==================== 套装配置数据 ====================

/** 定心套装 - 法术防御型 */
export const DINGXIN_SET: EquipmentSetConfig = {
  id: 'set_dingxin',
  name: '定心套装',
  description: '由定心石打造的套装，能稳定心神，抵御法术攻击。',
  icon: '☯️',
  quality: 'epic',
  levelRequirement: 40,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'magicDefense',
          value: 20,
          isPercent: false,
          description: '法术防御+20',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_percent',
          stat: 'magicDefense',
          value: 0.1,
          isPercent: true,
          description: '受到的法术伤害减少10%',
          specialData: {
            effectType: 'magic_damage_reduction',
            value: 0.1,
          },
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_percent',
          stat: 'magicAttack',
          value: 0.15,
          isPercent: true,
          description: '法术攻击+15%',
        },
      ],
    },
  ],
};

/** 逆鳞套装 - 物理攻击型 */
export const NILIN_SET: EquipmentSetConfig = {
  id: 'set_nilin',
  name: '逆鳞套装',
  description: '传说中龙的逆鳞制成的套装，蕴含龙之怒火，大幅提升攻击力。',
  icon: '🐲',
  quality: 'legendary',
  levelRequirement: 50,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalAttack',
          value: 15,
          isPercent: false,
          description: '物理攻击+15',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_flat',
          stat: 'critRate',
          value: 0.05,
          isPercent: false,
          description: '暴击率+5%',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_percent',
          stat: 'physicalAttack',
          value: 0.1,
          isPercent: true,
          description: '物理伤害+10%',
          specialData: {
            effectType: 'physical_damage_bonus',
            value: 0.1,
          },
        },
      ],
    },
  ],
};

/** 金刚套装 - 物理防御型 */
export const JINGANG_SET: EquipmentSetConfig = {
  id: 'set_jingang',
  name: '金刚套装',
  description: '金刚不坏之身的化身，坚不可摧，能抵御强力物理攻击。',
  icon: '🛡️',
  quality: 'epic',
  levelRequirement: 40,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalDefense',
          value: 25,
          isPercent: false,
          description: '物理防御+25',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_percent',
          stat: 'physicalDefense',
          value: 0.08,
          isPercent: true,
          description: '受到的物理伤害减少8%',
          specialData: {
            effectType: 'physical_damage_reduction',
            value: 0.08,
          },
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'immunity',
          value: 1,
          isPercent: false,
          description: '免疫眩晕效果',
          specialData: {
            effectType: 'immunity_stun',
          },
        },
      ],
    },
  ],
};

/** 定魂套装 - 法力型 */
export const DINGHUN_SET: EquipmentSetConfig = {
  id: 'set_dinghun',
  name: '定魂套装',
  description: '能安定魂魄的神秘套装，增幅法力，提升施法效率。',
  icon: '👻',
  quality: 'epic',
  levelRequirement: 40,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'maxMp',
          value: 200,
          isPercent: false,
          description: '法力上限+200',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_flat',
          stat: 'critRate',
          value: 0.05,
          isPercent: false,
          description: '法术暴击+5%',
          specialData: {
            effectType: 'magic_crit_bonus',
            value: 0.05,
          },
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'special',
          value: 0.1,
          isPercent: true,
          description: '施法速度+10%',
          specialData: {
            effectType: 'cast_speed_bonus',
            value: 0.1,
          },
        },
      ],
    },
  ],
};

/** 逆天套装 - 全能型（高级套装） */
export const NITIAN_SET: EquipmentSetConfig = {
  id: 'set_nitian',
  name: '逆天套装',
  description: '传说中能逆天改命的套装，全方位提升战斗能力。',
  icon: '⭐',
  quality: 'legendary',
  levelRequirement: 60,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'maxHp',
          value: 300,
          isPercent: false,
          description: '生命上限+300',
        },
        {
          type: 'stat_flat',
          stat: 'maxMp',
          value: 150,
          isPercent: false,
          description: '法力上限+150',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalAttack',
          value: 20,
          isPercent: false,
          description: '物理攻击+20',
        },
        {
          type: 'stat_flat',
          stat: 'magicAttack',
          value: 20,
          isPercent: false,
          description: '法术攻击+20',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_percent',
          stat: 'speed',
          value: 0.1,
          isPercent: true,
          description: '速度+10%',
        },
        {
          type: 'stat_flat',
          stat: 'critRate',
          value: 0.08,
          isPercent: false,
          description: '暴击率+8%',
        },
      ],
    },
  ],
};

/** 混沌套装 - 神话级套装 */
export const HUNDUN_SET: EquipmentSetConfig = {
  id: 'set_hundun',
  name: '混沌套装',
  description: '诞生于混沌之初的套装，蕴含创世之力。',
  icon: '🌌',
  quality: 'mythic',
  levelRequirement: 80,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_percent',
          stat: 'maxHp',
          value: 0.15,
          isPercent: true,
          description: '生命上限+15%',
        },
        {
          type: 'stat_percent',
          stat: 'maxMp',
          value: 0.15,
          isPercent: true,
          description: '法力上限+15%',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'stat_percent',
          stat: 'physicalAttack',
          value: 0.12,
          isPercent: true,
          description: '物理攻击+12%',
        },
        {
          type: 'stat_percent',
          stat: 'magicAttack',
          value: 0.12,
          isPercent: true,
          description: '法术攻击+12%',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_percent',
          stat: 'physicalDefense',
          value: 0.15,
          isPercent: true,
          description: '物理防御+15%',
        },
        {
          type: 'stat_percent',
          stat: 'magicDefense',
          value: 0.15,
          isPercent: true,
          description: '法术防御+15%',
        },
        {
          type: 'immunity',
          value: 1,
          isPercent: false,
          description: '免疫所有控制效果',
          specialData: {
            effectType: 'immunity_all_cc',
          },
        },
      ],
    },
  ],
};

/** 龙魂套装 - 龙宫专属 */
export const LONGHUN_SET: EquipmentSetConfig = {
  id: 'set_longhun',
  name: '龙魂套装',
  description: '蕴含龙族精魂的套装，提升水系法术威力。',
  icon: '💠',
  quality: 'legendary',
  levelRequirement: 55,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'magicAttack',
          value: 30,
          isPercent: false,
          description: '法术攻击+30',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'special',
          value: 0.15,
          isPercent: true,
          description: '水系法术伤害+15%',
          specialData: {
            effectType: 'element_damage_bonus',
            value: 0.15,
          },
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'maxMp',
          value: 300,
          isPercent: false,
          description: '法力上限+300',
        },
        {
          type: 'stat_flat',
          stat: 'speed',
          value: 15,
          isPercent: false,
          description: '速度+15',
        },
      ],
    },
  ],
};

/** 神威套装 - 天宫专属 */
export const SHENWEI_SET: EquipmentSetConfig = {
  id: 'set_shenwei',
  name: '神威套装',
  description: '天神赐予的套装，蕴含雷霆之力。',
  icon: '🌩️',
  quality: 'legendary',
  levelRequirement: 55,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalAttack',
          value: 25,
          isPercent: false,
          description: '物理攻击+25',
        },
        {
          type: 'stat_flat',
          stat: 'magicAttack',
          value: 25,
          isPercent: false,
          description: '法术攻击+25',
        },
      ],
    },
    {
      pieceCount: 3,
      effects: [
        {
          type: 'special',
          value: 0.15,
          isPercent: true,
          description: '雷系法术伤害+15%',
          specialData: {
            effectType: 'element_damage_bonus',
            value: 0.15,
          },
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'critDamage',
          value: 0.2,
          isPercent: false,
          description: '暴击伤害+20%',
        },
      ],
    },
  ],
};

// ==================== 套装注册表 ====================

/** 所有套装配置 */
export const EQUIPMENT_SETS: Record<string, EquipmentSetConfig> = {
  set_dingxin: DINGXIN_SET,
  set_nilin: NILIN_SET,
  set_jingang: JINGANG_SET,
  set_dinghun: DINGHUN_SET,
  set_nitian: NITIAN_SET,
  set_hundun: HUNDUN_SET,
  set_longhun: LONGHUN_SET,
  set_shenwei: SHENWEI_SET,
};

// ==================== 辅助函数 ====================

/** 获取套装配置 */
export function getEquipmentSetConfig(setId: string): EquipmentSetConfig | undefined {
  return EQUIPMENT_SETS[setId];
}

/** 获取所有套装列表 */
export function getAllEquipmentSets(): EquipmentSetConfig[] {
  return Object.values(EQUIPMENT_SETS);
}

/** 根据品质获取套装 */
export function getEquipmentSetsByQuality(quality: string): EquipmentSetConfig[] {
  return Object.values(EQUIPMENT_SETS).filter((set) => set.quality === quality);
}

/** 根据等级获取可用套装 */
export function getEquipmentSetsByLevel(level: number): EquipmentSetConfig[] {
  return Object.values(EQUIPMENT_SETS).filter(
    (set) => set.levelRequirement <= level
  );
}

/** 计算套装效果 */
export function calculateSetBonuses(
  setId: string,
  pieceCount: number
): SetBonusEffect[] {
  const setConfig = EQUIPMENT_SETS[setId];
  if (!setConfig) return [];

  const bonuses: SetBonusEffect[] = [];
  for (const bonus of setConfig.bonuses) {
    if (pieceCount >= bonus.pieceCount) {
      bonuses.push(...bonus.effects);
    }
  }

  return bonuses;
}

/** 获取套装效果描述 */
export function getSetBonusDescription(setId: string): string[] {
  const setConfig = EQUIPMENT_SETS[setId];
  if (!setConfig) return [];

  return setConfig.bonuses.map((bonus) => {
    const effectDesc = bonus.effects.map((e) => e.description).join(', ');
    return `${bonus.pieceCount}件: ${effectDesc}`;
  });
}
