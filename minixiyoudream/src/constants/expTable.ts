// 经验表配置

/** 等级经验表 */
export const EXP_TABLE: number[] = [
  0,        // Lv1
  100,      // Lv2
  250,      // Lv3
  450,      // Lv4
  700,      // Lv5
  1000,     // Lv6
  1400,     // Lv7
  1900,     // Lv8
  2500,     // Lv9
  3200,     // Lv10
  4000,     // Lv11
  4900,     // Lv12
  5900,     // Lv13
  7000,     // Lv14
  8200,     // Lv15
  9500,     // Lv16
  10900,    // Lv17
  12400,    // Lv18
  14000,    // Lv19
  15700,    // Lv20
  17500,    // Lv21
  19400,    // Lv22
  21400,    // Lv23
  23500,    // Lv24
  25700,    // Lv25
  28000,    // Lv26
  30400,    // Lv27
  32900,    // Lv28
  35500,    // Lv29
  38200,    // Lv30
  41000,    // Lv31
  43900,    // Lv32
  46900,    // Lv33
  50000,    // Lv34
  53200,    // Lv35
  56500,    // Lv36
  59900,    // Lv37
  63400,    // Lv38
  67000,    // Lv39
  70700,    // Lv40
  74500,    // Lv41
  78400,    // Lv42
  82400,    // Lv43
  86500,    // Lv44
  90700,    // Lv45
  95000,    // Lv46
  99400,    // Lv47
  103900,   // Lv48
  108500,   // Lv49
  113200,   // Lv50
  // 50-100 继续增长
  118000,   // Lv51
  122900,   // Lv52
  127900,   // Lv53
  133000,   // Lv54
  138200,   // Lv55
  143500,   // Lv56
  148900,   // Lv57
  154400,   // Lv58
  160000,   // Lv59
  165700,   // Lv60
  171500,   // Lv61
  177400,   // Lv62
  183400,   // Lv63
  189500,   // Lv64
  195700,   // Lv65
  202000,   // Lv66
  208400,   // Lv67
  214900,   // Lv68
  221500,   // Lv69
  228200,   // Lv70
  235000,   // Lv71
  241900,   // Lv72
  248900,   // Lv73
  256000,   // Lv74
  263200,   // Lv75
  270500,   // Lv76
  277900,   // Lv77
  285400,   // Lv78
  293000,   // Lv79
  300700,   // Lv80
  308500,   // Lv81
  316400,   // Lv82
  324400,   // Lv83
  332500,   // Lv84
  340700,   // Lv85
  349000,   // Lv86
  357400,   // Lv87
  365900,   // Lv88
  374500,   // Lv89
  383200,   // Lv90
  392000,   // Lv91
  400900,   // Lv92
  409900,   // Lv93
  419000,   // Lv94
  428200,   // Lv95
  437500,   // Lv96
  446900,   // Lv97
  456400,   // Lv98
  466000,   // Lv99
  475700,   // Lv100 (满级)
];

/** 获取升级所需经验 */
export function getExpForLevel(level: number): number {
  if (level < 1 || level > 100) return 0;
  return EXP_TABLE[level - 1] || 0;
}

/** 获取累计经验 */
export function getTotalExpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getExpForLevel(i);
  }
  return total;
}

/** 宠物经验表（比角色经验少） */
export const PET_EXP_TABLE: number[] = [
  0,      // Lv1
  50,     // Lv2
  125,    // Lv3
  225,    // Lv4
  350,    // Lv5
  500,    // Lv6
  700,    // Lv7
  950,    // Lv8
  1250,   // Lv9
  1600,   // Lv10
  // ... 简化版
];

/** 获取宠物升级所需经验 */
export function getPetExpForLevel(level: number): number {
  if (level < 1 || level > 100) return 0;
  return PET_EXP_TABLE[Math.min(level - 1, PET_EXP_TABLE.length - 1)] || 1600 + (level - 10) * 200;
}
