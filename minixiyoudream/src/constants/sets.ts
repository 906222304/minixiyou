// 套装配置 - 四圣兽与麒麟套装
// 青龙(攻击型)、白虎(防御型)、朱雀(法术型)、玄武(均衡型)、麒麟(辅助型)

import type { CombatStats } from '@/types';

// ==================== 类型定义 ====================

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
  quality: 'rare' | 'epic' | 'legendary' | 'mythic';
  levelRequirement: number;
  pieces?: string[];
  bonuses: {
    pieceCount: number;
    effects: SetBonusEffect[];
  }[];
}

// ==================== 四圣兽套装 ====================

/** 青龙套装 - 攻击型 */
export const QINGLONG_SET: EquipmentSetConfig = {
  id: 'set_qinglong',
  name: '青龙套装',
  description: '东方圣兽青龙之力，主攻击，暴击如龙啸九天。',
  icon: '🐉',
  quality: 'legendary',
  levelRequirement: 50,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalAttack',
          value: 50,
          isPercent: false,
          description: '物理攻击+50',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'critRate',
          value: 0.10,
          isPercent: false,
          description: '暴击率+10%',
        },
      ],
    },
    {
      pieceCount: 6,
      effects: [
        {
          type: 'stat_percent',
          stat: 'critDamage',
          value: 0.20,
          isPercent: true,
          description: '技能伤害+20%',
          specialData: {
            effectType: 'skill_damage_bonus',
            value: 0.20,
          },
        },
      ],
    },
  ],
};

/** 白虎套装 - 防御型 */
export const BAIHU_SET: EquipmentSetConfig = {
  id: 'set_baihu',
  name: '白虎套装',
  description: '西方圣兽白虎之力，主防御，坚韧如虎踞山林。',
  icon: '🐯',
  quality: 'legendary',
  levelRequirement: 50,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalDefense',
          value: 60,
          isPercent: false,
          description: '物理防御+60',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'dodgeRate',
          value: 0.08,
          isPercent: false,
          description: '闪避率+8%',
        },
      ],
    },
    {
      pieceCount: 6,
      effects: [
        {
          type: 'stat_percent',
          stat: 'maxHp',
          value: 0.15,
          isPercent: true,
          description: '伤害减免+15%',
          specialData: {
            effectType: 'damage_reduction',
            value: 0.15,
          },
        },
      ],
    },
  ],
};

/** 朱雀套装 - 法术型 */
export const ZHUQUE_SET: EquipmentSetConfig = {
  id: 'set_zhuque',
  name: '朱雀套装',
  description: '南方圣兽朱雀之力，主法术，烈焰焚天灭地。',
  icon: '🔥',
  quality: 'legendary',
  levelRequirement: 50,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'magicAttack',
          value: 50,
          isPercent: false,
          description: '法术攻击+50',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'maxMp',
          value: 200,
          isPercent: false,
          description: '法力上限+200',
        },
        {
          type: 'stat_flat',
          stat: 'magicDefense',
          value: 30,
          isPercent: false,
          description: '法术防御+30',
        },
      ],
    },
    {
      pieceCount: 6,
      effects: [
        {
          type: 'stat_percent',
          stat: 'magicAttack',
          value: 0.20,
          isPercent: true,
          description: '法术伤害+20%',
          specialData: {
            effectType: 'magic_damage_bonus',
            value: 0.20,
          },
        },
      ],
    },
  ],
};

/** 玄武套装 - 均衡型 */
export const XUANWU_SET: EquipmentSetConfig = {
  id: 'set_xuanwu',
  name: '玄武套装',
  description: '北方圣兽玄武之力，主均衡，攻守兼备如龟蛇同体。',
  icon: '🐢',
  quality: 'legendary',
  levelRequirement: 50,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'maxHp',
          value: 300,
          isPercent: false,
          description: '最大HP+300',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'physicalDefense',
          value: 30,
          isPercent: false,
          description: '物理防御+30',
        },
        {
          type: 'stat_flat',
          stat: 'magicDefense',
          value: 30,
          isPercent: false,
          description: '法术防御+30',
        },
      ],
    },
    {
      pieceCount: 6,
      effects: [
        {
          type: 'stat_percent',
          stat: 'physicalAttack',
          value: 0.10,
          isPercent: true,
          description: '攻击+10%',
        },
        {
          type: 'stat_percent',
          stat: 'maxHp',
          value: 0.10,
          isPercent: true,
          description: '防御+10%',
          specialData: {
            effectType: 'defense_bonus',
            value: 0.10,
          },
        },
      ],
    },
  ],
};

/** 麒麟套装 - 辅助型 */
export const QILIN_SET: EquipmentSetConfig = {
  id: 'set_qilin',
  name: '麒麟套装',
  description: '瑞兽麒麟之力，主辅助，仁德护佑众生。',
  icon: '🦄',
  quality: 'mythic',
  levelRequirement: 60,
  bonuses: [
    {
      pieceCount: 2,
      effects: [
        {
          type: 'stat_flat',
          stat: 'speed',
          value: 20,
          isPercent: false,
          description: '速度+20',
        },
      ],
    },
    {
      pieceCount: 4,
      effects: [
        {
          type: 'stat_flat',
          stat: 'hitRate',
          value: 0.10,
          isPercent: false,
          description: '命中率+10%',
        },
        {
          type: 'stat_flat',
          stat: 'dodgeRate',
          value: 0.05,
          isPercent: false,
          description: '闪避率+5%',
        },
      ],
    },
    {
      pieceCount: 6,
      effects: [
        {
          type: 'special',
          value: 0.15,
          isPercent: true,
          description: '治疗效果+15%',
          specialData: {
            effectType: 'heal_bonus',
            value: 0.15,
          },
        },
        {
          type: 'special',
          value: 0.10,
          isPercent: true,
          description: '全属性+10%',
          specialData: {
            effectType: 'all_stats_bonus',
            value: 0.10,
          },
        },
      ],
    },
  ],
};

// ==================== 套装注册表 ====================

/** 所有套装配置 */
export const EQUIPMENT_SETS: Record<string, EquipmentSetConfig> = {
  set_qinglong: QINGLONG_SET,
  set_baihu: BAIHU_SET,
  set_zhuque: ZHUQUE_SET,
  set_xuanwu: XUANWU_SET,
  set_qilin: QILIN_SET,
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

/** 获取套装品质颜色 */
export function getSetQualityColor(setId: string): string {
  const setConfig = EQUIPMENT_SETS[setId];
  if (!setConfig) return '#FFFFFF';

  const colors: Record<string, string> = {
    rare: '#0070DD',
    epic: '#A335EE',
    legendary: '#FF8000',
    mythic: '#E6CC80',
  };

  return colors[setConfig.quality] || '#FFFFFF';
}
