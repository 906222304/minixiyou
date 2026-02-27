// 门派类型定义

import type { UUID, BaseStats } from './common';
import type { RaceType } from './race';

/** 门派定位 */
export type FactionRole =
  | 'physical_dps'   // 物理输出
  | 'magic_dps'      // 法术输出
  | 'tank'           // 坦克
  | 'healer'         // 治疗
  | 'support'        // 辅助
  | 'control';       // 控制

/** 门派配置 */
export interface Faction {
  id: UUID;
  name: string;
  shortName: string;
  description: string;
  icon: string;

  // 所属种族
  race: RaceType;

  // 门派定位
  role: FactionRole;

  // 主要属性
  primaryStat: 'strength' | 'intelligence' | 'vitality' | 'agility' | 'willpower';
  secondaryStat: 'strength' | 'intelligence' | 'vitality' | 'agility' | 'willpower';

  // 属性成长率（每级增加的属性点）
  growthRate?: BaseStats;

  // 门派特色技能
  signatureSkill: {
    id: string;
    name: string;
    description: string;
  };

  // 可学习技能ID列表
  skills: string[];

  // 元素倾向
  elementAffinity?: 'fire' | 'ice' | 'thunder' | 'wood' | 'water' | 'metal' | 'earth' | 'none';
}

/** 门派技能树节点 */
export interface FactionSkillNode {
  id: string;
  skillId: string;
  levelRequirement: number;
  prerequisites: string[];
  position: { x: number; y: number };
}
