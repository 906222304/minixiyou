/**
 * 经验表数据 - 从 xiyou/assets/data/config/exp_table.json 迁移
 * 100 级经验曲线
 */

import { MigratedExpTable } from '../../types/xiyou';

/** 迁移后的经验表数据 */
export const MIGRATED_EXP_TABLE: MigratedExpTable = {
  curveType: 'polynomial_original',
  levels: [
    { level: 1, expRequired: 0, totalExp: 0 },
    { level: 2, expRequired: 28, totalExp: 28 },
    { level: 3, expRequired: 89, totalExp: 117 },
    { level: 4, expRequired: 220, totalExp: 337 },
    { level: 5, expRequired: 457, totalExp: 794 },
    { level: 6, expRequired: 848, totalExp: 1642 },
    { level: 7, expRequired: 1441, totalExp: 3083 },
    { level: 8, expRequired: 2280, totalExp: 5363 },
    { level: 9, expRequired: 3417, totalExp: 8780 },
    { level: 10, expRequired: 4908, totalExp: 13688 },
    { level: 11, expRequired: 6817, totalExp: 20505 },
    { level: 12, expRequired: 9208, totalExp: 29713 },
    { level: 13, expRequired: 12145, totalExp: 41858 },
    { level: 14, expRequired: 15700, totalExp: 57558 },
    { level: 15, expRequired: 19949, totalExp: 77507 },
    { level: 16, expRequired: 24976, totalExp: 102483 },
    { level: 17, expRequired: 30873, totalExp: 133356 },
    { level: 18, expRequired: 37740, totalExp: 171096 },
    { level: 19, expRequired: 45681, totalExp: 216777 },
    { level: 20, expRequired: 54808, totalExp: 271585 },
    { level: 21, expRequired: 65237, totalExp: 336822 },
    { level: 22, expRequired: 77092, totalExp: 413914 },
    { level: 23, expRequired: 90505, totalExp: 504419 },
    { level: 24, expRequired: 105612, totalExp: 610031 },
    { level: 25, expRequired: 122557, totalExp: 732588 },
    { level: 26, expRequired: 141592, totalExp: 874180 },
    { level: 27, expRequired: 162973, totalExp: 1037153 },
    { level: 28, expRequired: 186964, totalExp: 1224117 },
    { level: 29, expRequired: 213833, totalExp: 1437950 },
    { level: 30, expRequired: 243856, totalExp: 1681806 },
    { level: 31, expRequired: 277317, totalExp: 1959123 },
    { level: 32, expRequired: 314508, totalExp: 2273631 },
    { level: 33, expRequired: 355733, totalExp: 2629364 },
    { level: 34, expRequired: 401304, totalExp: 3030668 },
    { level: 35, expRequired: 451545, totalExp: 3482213 },
    { level: 36, expRequired: 506792, totalExp: 3989005 },
    { level: 37, expRequired: 567393, totalExp: 4556398 },
    { level: 38, expRequired: 633708, totalExp: 5190106 },
    { level: 39, expRequired: 706109, totalExp: 5896215 },
    { level: 40, expRequired: 784976, totalExp: 6681191 },
    { level: 41, expRequired: 870697, totalExp: 7551888 },
    { level: 42, expRequired: 963676, totalExp: 8515564 },
    { level: 43, expRequired: 1064329, totalExp: 9579893 },
    { level: 44, expRequired: 1173084, totalExp: 10752977 },
    { level: 45, expRequired: 1289381, totalExp: 12042358 },
    { level: 46, expRequired: 1413669, totalExp: 13456027 },
    { level: 47, expRequired: 1546405, totalExp: 15002432 },
    { level: 48, expRequired: 1688051, totalExp: 16690483 },
    { level: 49, expRequired: 1839077, totalExp: 18529560 },
    { level: 50, expRequired: 1999956, totalExp: 20529516 },
    { level: 51, expRequired: 2171177, totalExp: 22700693 },
    { level: 52, expRequired: 2353236, totalExp: 25053929 },
    { level: 53, expRequired: 2546641, totalExp: 27600570 },
    { level: 54, expRequired: 2751909, totalExp: 30352479 },
    { level: 55, expRequired: 2969561, totalExp: 33322040 },
    { level: 56, expRequired: 3200129, totalExp: 36522169 },
    { level: 57, expRequired: 3444135, totalExp: 39966304 },
    { level: 58, expRequired: 3702115, totalExp: 43668419 },
    { level: 59, expRequired: 3974614, totalExp: 47643033 },
    { level: 60, expRequired: 4262180, totalExp: 51905213 },
    { level: 61, expRequired: 4565367, totalExp: 56470580 },
    { level: 62, expRequired: 4884737, totalExp: 61355317 },
    { level: 63, expRequired: 5220855, totalExp: 66576172 },
    { level: 64, expRequired: 5574288, totalExp: 72150460 },
    { level: 65, expRequired: 5945609, totalExp: 78096069 },
    { level: 66, expRequired: 6335389, totalExp: 84431458 },
    { level: 67, expRequired: 6744203, totalExp: 91175661 },
    { level: 68, expRequired: 7172630, totalExp: 98348291 },
    { level: 69, expRequired: 7621247, totalExp: 105969538 },
    { level: 70, expRequired: 8090640, totalExp: 114060178 },
    { level: 71, expRequired: 8581398, totalExp: 122641576 },
    { level: 72, expRequired: 9094117, totalExp: 131735693 },
    { level: 73, expRequired: 9629398, totalExp: 141365091 },
    { level: 74, expRequired: 10187851, totalExp: 151552942 },
    { level: 75, expRequired: 10770087, totalExp: 162323029 },
    { level: 76, expRequired: 11376826, totalExp: 173699855 },
    { level: 77, expRequired: 12008794, totalExp: 185708649 },
    { level: 78, expRequired: 12666720, totalExp: 198375369 },
    { level: 79, expRequired: 13351340, totalExp: 211726709 },
    { level: 80, expRequired: 14063393, totalExp: 225790102 },
    { level: 81, expRequired: 14803623, totalExp: 240593725 },
    { level: 82, expRequired: 15572778, totalExp: 256166503 },
    { level: 83, expRequired: 16371610, totalExp: 272538113 },
    { level: 84, expRequired: 17200872, totalExp: 289738985 },
    { level: 85, expRequired: 18061222, totalExp: 307800207 },
    { level: 86, expRequired: 18953420, totalExp: 326753627 },
    { level: 87, expRequired: 19878230, totalExp: 346631857 },
    { level: 88, expRequired: 20836422, totalExp: 367468279 },
    { level: 89, expRequired: 21828772, totalExp: 389297051 },
    { level: 90, expRequired: 22856060, totalExp: 412153111 },
    { level: 91, expRequired: 23919074, totalExp: 436072185 },
    { level: 92, expRequired: 25018608, totalExp: 461090793 },
    { level: 93, expRequired: 26155466, totalExp: 487246259 },
    { level: 94, expRequired: 27330462, totalExp: 514576721 },
    { level: 95, expRequired: 28544414, totalExp: 543121135 },
    { level: 96, expRequired: 29798148, totalExp: 572919283 },
    { level: 97, expRequired: 31092498, totalExp: 604011781 },
    { level: 98, expRequired: 32428304, totalExp: 636440085 },
    { level: 99, expRequired: 33806414, totalExp: 670246499 },
    { level: 100, expRequired: 35227784, totalExp: 705474283 },
  ],
};

/** 根据等级获取升级所需经验 */
export const getExpRequired = (level: number): number => {
  const levelData = MIGRATED_EXP_TABLE.levels.find((l) => l.level === level);
  return levelData?.expRequired ?? 0;
};

/** 根据等级获取累计经验 */
export const getTotalExp = (level: number): number => {
  const levelData = MIGRATED_EXP_TABLE.levels.find((l) => l.level === level);
  return levelData?.totalExp ?? 0;
};

/** 根据经验值计算等级 */
export const getLevelFromExp = (exp: number): number => {
  for (let i = MIGRATED_EXP_TABLE.levels.length - 1; i >= 0; i--) {
    if (exp >= MIGRATED_EXP_TABLE.levels[i].totalExp) {
      return MIGRATED_EXP_TABLE.levels[i].level;
    }
  }
  return 1;
};

/** 最高等级 */
export const MAX_LEVEL = MIGRATED_EXP_TABLE.levels.length;

/** 升级到满级所需总经验 */
export const TOTAL_EXP_TO_MAX = MIGRATED_EXP_TABLE.levels[MIGRATED_EXP_TABLE.levels.length - 1].totalExp;
