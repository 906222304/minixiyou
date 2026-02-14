// 阵法配置

import type { Formation, FormationExpConfig } from '@/types/formation';

/** 阵法经验配置 */
export const FORMATION_EXP_CONFIG: FormationExpConfig = {
  baseExp: 100,
  expPerLevel: 50,
};

/** 阵法克制加成百分比 */
export const FORMATION_COUNTER_BONUS = 15; // 15%加成

/**
 * 阵法配置列表
 *
 * 位置布局说明（6人阵容）：
 * 前排：位置 0, 1, 2
 * 后排：位置 3, 4, 5
 */
export const FORMATIONS: Formation[] = [
  // 天覆阵 - 攻击型
  {
    id: 'formation_tianfu',
    name: '天覆阵',
    description: '攻其不备，势如破竹。全体攻击大幅提升，防御略降。',
    icon: '⚔️',
    type: 'attack',
    positions: [
      // 前排（0-2）
      {
        slot: 0,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalAttack',
            value: 12,
            description: '物理攻击+12%',
          },
          {
            type: 'damage_bonus',
            value: 8,
            description: '伤害加成+8%',
          },
        ],
      },
      {
        slot: 1,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalAttack',
            value: 10,
            description: '物理攻击+10%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'magicAttack',
            value: 10,
            description: '法术攻击+10%',
          },
        ],
      },
      {
        slot: 2,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'magicAttack',
            value: 12,
            description: '法术攻击+12%',
          },
          {
            type: 'damage_bonus',
            value: 8,
            description: '伤害加成+8%',
          },
        ],
      },
      // 后排（3-5）
      {
        slot: 3,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'critRate',
            value: 5,
            description: '暴击率+5%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'critDamage',
            value: 10,
            description: '暴击伤害+10%',
          },
        ],
      },
      {
        slot: 4,
        row: 'back',
        effects: [
          {
            type: 'damage_bonus',
            value: 15,
            description: '伤害加成+15%',
          },
        ],
      },
      {
        slot: 5,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'critRate',
            value: 5,
            description: '暴击率+5%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'critDamage',
            value: 10,
            description: '暴击伤害+10%',
          },
        ],
      },
    ],
    counters: ['formation_dizai'],  // 克制地载阵
    counteredBy: ['formation_fengyang'], // 被风扬阵克制
    maxLevel: 10,
    levelBonus: 0.1, // 每级效果提升10%
  },

  // 地载阵 - 防御型
  {
    id: 'formation_dizai',
    name: '地载阵',
    description: '厚德载物，固若金汤。全体防御大幅提升，速度略降。',
    icon: '🛡️',
    type: 'defense',
    positions: [
      // 前排（0-2）
      {
        slot: 0,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalDefense',
            value: 15,
            description: '物理防御+15%',
          },
          {
            type: 'damage_reduction',
            value: 8,
            description: '伤害减免+8%',
          },
        ],
      },
      {
        slot: 1,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalDefense',
            value: 12,
            description: '物理防御+12%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'magicDefense',
            value: 12,
            description: '法术防御+12%',
          },
        ],
      },
      {
        slot: 2,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'magicDefense',
            value: 15,
            description: '法术防御+15%',
          },
          {
            type: 'damage_reduction',
            value: 8,
            description: '伤害减免+8%',
          },
        ],
      },
      // 后排（3-5）
      {
        slot: 3,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'maxHp',
            value: 10,
            description: '最大生命+10%',
          },
          {
            type: 'heal_bonus',
            value: 10,
            description: '被治疗效果+10%',
          },
        ],
      },
      {
        slot: 4,
        row: 'back',
        effects: [
          {
            type: 'damage_reduction',
            value: 12,
            description: '伤害减免+12%',
          },
        ],
      },
      {
        slot: 5,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'maxHp',
            value: 10,
            description: '最大生命+10%',
          },
          {
            type: 'heal_bonus',
            value: 10,
            description: '被治疗效果+10%',
          },
        ],
      },
    ],
    counters: ['formation_fengyang'],  // 克制风扬阵
    counteredBy: ['formation_tianfu'], // 被天覆阵克制
    maxLevel: 10,
    levelBonus: 0.1,
  },

  // 风扬阵 - 速度型
  {
    id: 'formation_fengyang',
    name: '风扬阵',
    description: '风卷残云，迅若奔雷。全体速度大幅提升，先发制人。',
    icon: '💨',
    type: 'speed',
    positions: [
      // 前排（0-2）
      {
        slot: 0,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 15,
            description: '速度+15%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'dodgeRate',
            value: 5,
            description: '闪避率+5%',
          },
        ],
      },
      {
        slot: 1,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 18,
            description: '速度+18%',
          },
        ],
      },
      {
        slot: 2,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 15,
            description: '速度+15%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'dodgeRate',
            value: 5,
            description: '闪避率+5%',
          },
        ],
      },
      // 后排（3-5）
      {
        slot: 3,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 12,
            description: '速度+12%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'hitRate',
            value: 8,
            description: '命中率+8%',
          },
        ],
      },
      {
        slot: 4,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 20,
            description: '速度+20%',
          },
        ],
      },
      {
        slot: 5,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 12,
            description: '速度+12%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'hitRate',
            value: 8,
            description: '命中率+8%',
          },
        ],
      },
    ],
    counters: ['formation_tianfu'],  // 克制天覆阵
    counteredBy: ['formation_dizai'], // 被地载阵克制
    maxLevel: 10,
    levelBonus: 0.1,
  },

  // 云垂阵 - 平衡型
  {
    id: 'formation_yunchui',
    name: '云垂阵',
    description: '云卷云舒，攻守兼备。各项属性均衡提升，稳健持久。',
    icon: '☁️',
    type: 'balance',
    positions: [
      // 前排（0-2）
      {
        slot: 0,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalDefense',
            value: 8,
            description: '物理防御+8%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'physicalAttack',
            value: 6,
            description: '物理攻击+6%',
          },
        ],
      },
      {
        slot: 1,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'maxHp',
            value: 8,
            description: '最大生命+8%',
          },
          {
            type: 'damage_reduction',
            value: 5,
            description: '伤害减免+5%',
          },
        ],
      },
      {
        slot: 2,
        row: 'front',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'magicDefense',
            value: 8,
            description: '法术防御+8%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'magicAttack',
            value: 6,
            description: '法术攻击+6%',
          },
        ],
      },
      // 后排（3-5）
      {
        slot: 3,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'physicalAttack',
            value: 8,
            description: '物理攻击+8%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'critRate',
            value: 3,
            description: '暴击率+3%',
          },
        ],
      },
      {
        slot: 4,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'speed',
            value: 6,
            description: '速度+6%',
          },
          {
            type: 'heal_bonus',
            value: 8,
            description: '治疗效果+8%',
          },
        ],
      },
      {
        slot: 5,
        row: 'back',
        effects: [
          {
            type: 'stat_bonus',
            targetStat: 'magicAttack',
            value: 8,
            description: '法术攻击+8%',
          },
          {
            type: 'stat_bonus',
            targetStat: 'critRate',
            value: 3,
            description: '暴击率+3%',
          },
        ],
      },
    ],
    counters: [],  // 平衡阵不克制任何阵法
    counteredBy: [], // 也不被任何阵法克制
    maxLevel: 10,
    levelBonus: 0.08, // 平衡阵每级提升8%
  },
];

/** 根据ID获取阵法配置 */
export function getFormation(id: string): Formation | undefined {
  return FORMATIONS.find(f => f.id === id);
}

/** 获取所有阵法配置 */
export function getAllFormations(): Formation[] {
  return [...FORMATIONS];
}

/** 根据类型获取阵法列表 */
export function getFormationsByType(type: Formation['type']): Formation[] {
  return FORMATIONS.filter(f => f.type === type);
}

/** 获取阵法升级所需经验 */
export function getFormationExpRequired(level: number): number {
  return FORMATION_EXP_CONFIG.baseExp + (level - 1) * FORMATION_EXP_CONFIG.expPerLevel;
}

/** 获取阵法类型名称 */
export function getFormationTypeName(type: Formation['type']): string {
  const names: Record<Formation['type'], string> = {
    attack: '攻击型',
    defense: '防御型',
    speed: '速度型',
    balance: '平衡型',
  };
  return names[type];
}

/** 获取阵法类型颜色 */
export function getFormationTypeColor(type: Formation['type']): string {
  const colors: Record<Formation['type'], string> = {
    attack: '#FF6B6B',   // 红色
    defense: '#4ECDC4',  // 青色
    speed: '#95E1D3',    // 浅绿
    balance: '#F7DC6F',  // 金黄
  };
  return colors[type];
}
