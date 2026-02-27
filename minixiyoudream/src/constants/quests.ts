// 任务配置 - 迷你西游梦风格剧情系统（复刻自xiyou项目）

import type { Quest, QuestChapter, DialogLine, RewardPool } from '@/types/quest';

/** 章节配置 */
export const QUEST_CHAPTERS: QuestChapter[] = [
  {
    id: 1,
    name: '初入江湖',
    description: '踏入西游世界的第一步，从东海村开始冒险',
    icon: '🌊',
    questIds: ['main_1_1', 'main_1_2', 'main_1_3', 'main_1_4', 'main_1_5', 'main_1_6', 'main_1_7', 'main_1_8'],
    levelRequired: 1,
  },
  {
    id: 2,
    name: '长安风云',
    description: '来到繁华的长安城，邂逅各路豪杰',
    icon: '🏯',
    questIds: ['main_2_1', 'main_2_2', 'main_2_3', 'main_2_4', 'main_2_5', 'main_2_6', 'main_2_7', 'main_2_8'],
    levelRequired: 3,
  },
  {
    id: 3,
    name: '仙法奇缘',
    description: '得遇仙人传授法术，踏上修行之路',
    icon: '✨',
    questIds: ['main_3_1', 'main_3_2', 'main_3_3', 'main_3_4', 'main_3_5', 'main_3_6'],
    levelRequired: 5,
  },
  {
    id: 4,
    name: '红颜知己',
    description: '与清清姑娘结下不解之缘',
    icon: '💕',
    questIds: ['main_4_1', 'main_4_2', 'main_4_3', 'main_4_4', 'main_4_5', 'main_4_6'],
    levelRequired: 8,
  },
  {
    id: 5,
    name: '比武招亲',
    description: '振远镖局比武招亲，卷入一场江湖风波',
    icon: '⚔️',
    questIds: ['main_5_1', 'main_5_2', 'main_5_3', 'main_5_4', 'main_5_5', 'main_5_6'],
    levelRequired: 10,
  },
  {
    id: 6,
    name: '妖塔迷踪',
    description: '大雁塔中妖魔作乱，踏上降妖之路',
    icon: '🗼',
    questIds: ['main_6_1', 'main_6_2', 'main_6_3', 'main_6_4', 'main_6_5', 'main_6_6'],
    levelRequired: 12,
  },
  {
    id: 7,
    name: '方寸问道',
    description: '方寸山寻访道长，揭开千年之谜',
    icon: '⛰️',
    questIds: ['main_7_1', 'main_7_2', 'main_7_3', 'main_7_4', 'main_7_5', 'main_7_6'],
    levelRequired: 15,
  },
  {
    id: 8,
    name: '西域风云',
    description: '远赴西域追寻清清，揭开身世之谜',
    icon: '🏜️',
    questIds: ['main_8_1', 'main_8_2', 'main_8_3', 'main_8_4', 'main_8_5', 'main_8_6'],
    levelRequired: 18,
  },
  {
    id: 9,
    name: '西凉公主',
    description: '进入西凉国，解救清清公主',
    icon: '👸',
    questIds: ['main_9_1', 'main_9_2', 'main_9_3', 'main_9_4', 'main_9_5', 'main_9_6'],
    levelRequired: 20,
  },
  {
    id: 10,
    name: '魔王降临',
    description: '巫王病危，魔王乘机作乱',
    icon: '👹',
    questIds: ['main_10_1', 'main_10_2', 'main_10_3', 'main_10_4', 'main_10_5', 'main_10_6'],
    levelRequired: 22,
  },
  {
    id: 11,
    name: '天命之战',
    description: '最终决战，拯救三界',
    icon: '🌟',
    questIds: ['main_11_1', 'main_11_2', 'main_11_3', 'main_11_4', 'main_11_5', 'main_11_6'],
    levelRequired: 25,
  },
  {
    id: 12,
    name: '西游新生',
    description: '新的旅程，新的希望',
    icon: '🌈',
    questIds: ['main_12_1', 'main_12_2', 'main_12_3', 'main_12_4', 'main_12_5'],
    levelRequired: 28,
  },
];

// ==================== 奖励池配置 ====================

/** 奖励池定义 */
export const REWARD_POOLS: Record<string, RewardPool> = {
  // 第一章奖励池 - 初入江湖
  pool_chapter1: {
    poolId: 'pool_chapter1',
    name: '初入江湖奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_small', weight: 40, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_mp_potion_small', weight: 30, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_enhance_stone', weight: 15, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_exp_pill_small', weight: 10, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_treasure_box_bronze', weight: 5, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第二章奖励池 - 长安风云
  pool_chapter2: {
    poolId: 'pool_chapter2',
    name: '长安风云奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_medium', weight: 35, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_mp_potion_medium', weight: 25, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_skill_book_common', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_bronze', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_silver', weight: 2, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第三章奖励池 - 仙法奇缘
  pool_chapter3: {
    poolId: 'pool_chapter3',
    name: '仙法奇缘奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_medium', weight: 30, quantity: { min: 2, max: 3 } },
      { type: 'item', value: 'item_mp_potion_medium', weight: 25, quantity: { min: 2, max: 3 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_exp_pill_medium', weight: 15, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_skill_book_common', weight: 6, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_silver', weight: 4, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第四章奖励池 - 红颜知己
  pool_chapter4: {
    poolId: 'pool_chapter4',
    name: '红颜知己奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_medium', weight: 25, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_mp_potion_medium', weight: 25, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 2, max: 5 } },
      { type: 'item', value: 'item_reforge_stone', weight: 15, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_skill_book_rare', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_silver', weight: 5, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_companion_gift', weight: 2, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第五章奖励池 - 比武招亲
  pool_chapter5: {
    poolId: 'pool_chapter5',
    name: '比武招亲奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_large', weight: 25, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_mp_potion_large', weight: 25, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_reforge_stone', weight: 12, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_skill_book_rare', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_silver', weight: 5, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_gold', weight: 3, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第六章奖励池 - 妖塔迷踪
  pool_chapter6: {
    poolId: 'pool_chapter6',
    name: '妖塔迷踪奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_large', weight: 25, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_mp_potion_large', weight: 25, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_enhance_stone_advanced', weight: 18, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_reforge_stone', weight: 12, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_skill_book_rare', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_gold', weight: 6, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_pet_egg_common', weight: 4, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第七章奖励池 - 方寸问道
  pool_chapter7: {
    poolId: 'pool_chapter7',
    name: '方寸问道奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_large', weight: 20, quantity: { min: 2, max: 5 } },
      { type: 'item', value: 'item_mp_potion_large', weight: 20, quantity: { min: 2, max: 5 } },
      { type: 'item', value: 'item_enhance_stone_advanced', weight: 18, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_reforge_stone', weight: 15, quantity: { min: 2, max: 5 } },
      { type: 'item', value: 'item_skill_book_epic', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_gold', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_pet_egg_rare', weight: 5, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_fragment', weight: 2, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 第八章奖励池 - 西域风云
  pool_chapter8: {
    poolId: 'pool_chapter8',
    name: '西域风云奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_large', weight: 18, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_mp_potion_large', weight: 18, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_enhance_stone_advanced', weight: 18, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_reforge_stone', weight: 15, quantity: { min: 3, max: 6 } },
      { type: 'item', value: 'item_skill_book_epic', weight: 12, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_gold', weight: 10, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_pet_egg_rare', weight: 6, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_fragment', weight: 3, quantity: { min: 1, max: 2 } },
    ],
    guaranteedRewards: [],
    drawCount: 2,
  },

  // 第九章奖励池 - 西凉公主
  pool_chapter9: {
    poolId: 'pool_chapter9',
    name: '西凉公主奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_super', weight: 20, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_mp_potion_super', weight: 20, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_enhance_stone_advanced', weight: 18, quantity: { min: 3, max: 6 } },
      { type: 'item', value: 'item_reforge_stone_advanced', weight: 15, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_skill_book_epic', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_platinum', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_pet_egg_epic', weight: 5, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_fragment', weight: 4, quantity: { min: 1, max: 2 } },
    ],
    guaranteedRewards: [],
    drawCount: 2,
  },

  // 第十章奖励池 - 魔王降临
  pool_chapter10: {
    poolId: 'pool_chapter10',
    name: '魔王降临奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_super', weight: 18, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_mp_potion_super', weight: 18, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_enhance_stone_supreme', weight: 15, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_reforge_stone_advanced', weight: 15, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_skill_book_legendary', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_platinum', weight: 10, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_pet_egg_epic', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_fragment', weight: 6, quantity: { min: 2, max: 3 } },
    ],
    guaranteedRewards: [],
    drawCount: 2,
  },

  // 第十一章奖励池 - 天命之战
  pool_chapter11: {
    poolId: 'pool_chapter11',
    name: '天命之战奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_super', weight: 15, quantity: { min: 4, max: 6 } },
      { type: 'item', value: 'item_mp_potion_super', weight: 15, quantity: { min: 4, max: 6 } },
      { type: 'item', value: 'item_enhance_stone_supreme', weight: 15, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_reforge_stone_supreme', weight: 12, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_skill_book_legendary', weight: 12, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_legendary', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_pet_egg_legendary', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_fragment', weight: 8, quantity: { min: 2, max: 4 } },
      { type: 'item', value: 'item_legendary_title', weight: 5, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 3,
  },

  // 第十二章奖励池 - 西游新生
  pool_chapter12: {
    poolId: 'pool_chapter12',
    name: '西游新生奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_super', weight: 12, quantity: { min: 5, max: 8 } },
      { type: 'item', value: 'item_mp_potion_super', weight: 12, quantity: { min: 5, max: 8 } },
      { type: 'item', value: 'item_enhance_stone_supreme', weight: 15, quantity: { min: 4, max: 6 } },
      { type: 'item', value: 'item_reforge_stone_supreme', weight: 12, quantity: { min: 3, max: 5 } },
      { type: 'item', value: 'item_skill_book_legendary', weight: 12, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_treasure_box_legendary', weight: 12, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_pet_egg_legendary', weight: 10, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_spirit_bead_complete', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_legendary_title', weight: 7, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 3,
  },

  // 日常任务奖励池
  pool_daily: {
    poolId: 'pool_daily',
    name: '日常任务奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_small', weight: 30, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_mp_potion_small', weight: 25, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_exp_pill_small', weight: 15, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_gold_bag_small', weight: 8, quantity: { min: 1, max: 1 } },
      { type: 'item', value: 'item_treasure_box_bronze', weight: 2, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },

  // 支线任务奖励池
  pool_side: {
    poolId: 'pool_side',
    name: '支线任务奖励池',
    rewards: [
      { type: 'item', value: 'item_hp_potion_medium', weight: 25, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_mp_potion_medium', weight: 25, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_enhance_stone', weight: 20, quantity: { min: 1, max: 3 } },
      { type: 'item', value: 'item_reforge_stone', weight: 15, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_exp_pill_medium', weight: 10, quantity: { min: 1, max: 2 } },
      { type: 'item', value: 'item_treasure_box_silver', weight: 5, quantity: { min: 1, max: 1 } },
    ],
    guaranteedRewards: [],
    drawCount: 1,
  },
};

/** 章节首通奖励配置 */
export const CHAPTER_FIRST_CLEAR_BONUS: Record<number, import('@/types/quest').FirstClearBonus> = {
  1: {
    gold: 500,
    exp: 500,
    items: [{ itemId: 'item_treasure_box_bronze', count: 2 }],
  },
  2: {
    gold: 1000,
    exp: 1000,
    items: [{ itemId: 'item_skill_book_common', count: 1 }, { itemId: 'item_treasure_box_silver', count: 1 }],
  },
  3: {
    gold: 1500,
    exp: 1500,
    items: [{ itemId: 'item_skill_book_rare', count: 1 }],
  },
  4: {
    gold: 2000,
    exp: 2000,
    items: [{ itemId: 'item_companion_gift', count: 3 }],
  },
  5: {
    gold: 3000,
    exp: 3000,
    items: [{ itemId: 'item_skill_book_rare', count: 1 }, { itemId: 'item_treasure_box_gold', count: 1 }],
  },
  6: {
    gold: 4000,
    exp: 4000,
    items: [{ itemId: 'item_pet_egg_rare', count: 1 }],
  },
  7: {
    gold: 5000,
    exp: 5000,
    items: [{ itemId: 'item_spirit_bead_fragment', count: 2 }, { itemId: 'item_skill_book_epic', count: 1 }],
  },
  8: {
    gold: 6000,
    exp: 6000,
    items: [{ itemId: 'item_pet_egg_rare', count: 1 }, { itemId: 'item_treasure_box_gold', count: 2 }],
  },
  9: {
    gold: 8000,
    exp: 8000,
    items: [{ itemId: 'item_pet_egg_epic', count: 1 }, { itemId: 'item_treasure_box_platinum', count: 1 }],
  },
  10: {
    gold: 10000,
    exp: 10000,
    items: [{ itemId: 'item_skill_book_legendary', count: 1 }, { itemId: 'item_spirit_bead_fragment', count: 3 }],
  },
  11: {
    gold: 15000,
    exp: 15000,
    items: [
      { itemId: 'item_pet_egg_legendary', count: 1 },
      { itemId: 'item_treasure_box_legendary', count: 1 },
      { itemId: 'item_spirit_bead_complete', count: 1 },
    ],
  },
  12: {
    gold: 20000,
    exp: 20000,
    items: [
      { itemId: 'item_legendary_title', count: 1 },
      { itemId: 'item_treasure_box_legendary', count: 2 },
    ],
  },
};

/** 获取奖励池 */
export function getRewardPool(poolId: string): RewardPool | undefined {
  return REWARD_POOLS[poolId];
}

/** 根据章节获取奖励池ID */
export function getRewardPoolIdByChapter(chapter: number, questType: 'main' | 'side' | 'daily'): string {
  if (questType === 'daily') return 'pool_daily';
  if (questType === 'side') return 'pool_side';
  return `pool_chapter${chapter}`;
}

// ==================== 第一章：初入江湖 ====================

/** 村长对话 */
const villageChiefDialog1: DialogLine[] = [
  { speaker: '村长', text: '欢迎你，年轻人！我是这个村子的村长。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '最近村子外沙滩上出现了很多具有攻击性的螃蟹，村民们都很担心。', portrait: '👴', position: 'left' },
  { speaker: '你', text: '村长，有什么我可以帮忙的吗？', portrait: '👤', position: 'right' },
  { speaker: '村长', text: '年轻人，你能帮我除掉一些螃蟹吗？记得先使用新手礼包，戴上装备再去！', portrait: '👴', position: 'left' },
];

/** 村长任务完成对话 */
const crabCompleteDialog: DialogLine[] = [
  { speaker: '村长', text: '干得漂亮！你果然是个有潜力的年轻人。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '不过...潮水洞穴深处似乎还有更大的威胁。你愿意去巡视一下吗？', portrait: '👴', position: 'left' },
  { speaker: '你', text: '没问题，村长！我这就去看看。', portrait: '👤', position: 'right' },
];

/** 发现蟹精对话 */
const crabSpiritDialog: DialogLine[] = [
  { speaker: '旁白', text: '你在洞穴深处发现了一只巨大的蟹精！', portrait: '📖' },
  { speaker: '你', text: '不好！这只蟹精已经成精了，必须赶快向村长报告！', portrait: '👤', position: 'right' },
];

/** 击败蟹精对话 */
const crabSpiritDefeatedDialog: DialogLine[] = [
  { speaker: '村长', text: '小伙子年轻有为，果然不负众望！', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '这里有些银两，还有一封信。你带着船票去码头找船夫，让他带你到外面的世界历练。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '这封信交给长安城的店小二，他看到信会帮你的！', portrait: '👴', position: 'left' },
  { speaker: '你', text: '谢谢村长！我一定不会让您失望的！', portrait: '👤', position: 'right' },
];

// ==================== 第二章：长安风云 ====================

/** 店小二对话 */
const shopAssistantDialog1: DialogLine[] = [
  { speaker: '店小二', text: '虽然你是村长介绍来的，不过也要自食其力。', portrait: '🧑', position: 'left' },
  { speaker: '店小二', text: '你就帮我招呼下客人，挣点零花钱吧！手脚麻利点，别偷懒！', portrait: '🧑', position: 'left' },
  { speaker: '你', text: '好的，小二哥！', portrait: '👤', position: 'right' },
];

/** 黑衣客人对话 */
const blackGuestDialog: DialogLine[] = [
  { speaker: '黑衣客商', text: '小二！给我们两间上好客房！没有我们的吩咐，不许有人打扰！', portrait: '🎭', position: 'left' },
  { speaker: '你', text: '是...这容易，小的马上照办！', portrait: '👤', position: 'right' },
  { speaker: '黑衣客人', text: '很好！往后这几天，只要你乖乖听我们的话办事，赏银不会少你的。', portrait: '🎭', position: 'left' },
];

/** 醉道士对话 */
const drunkTaoistDialog: DialogLine[] = [
  { speaker: '店小二', text: '快把门口那个臭要饭的赶走，免得妨碍我们做生意！', portrait: '🧑', position: 'left' },
  { speaker: '你', text: '去去去！没钱给你！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '我不是要钱，我只想讨些酒喝！小兄弟，拜托一下，给我一点酒吧！', portrait: '🧙', position: 'left' },
];

/** 赐酒给醉道士 */
const giveWineDialog: DialogLine[] = [
  { speaker: '你', text: '看你可怜，就给你喝一口吧！喂！只能喝一口喔！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '（拿起酒一饮而尽）啊...好酒！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '哎呀...你怎么喝光了！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '嗝~我一口就是那么大口，真是不好意思。你不是很想学仙法吗？看在酒的份上，贫道可以破例指点你几招！', portrait: '🧙', position: 'left' },
];

/** 学仙法对话 */
const learnMagicDialog: DialogLine[] = [
  { speaker: '醉道士', text: '今晚三更城南荒野，不见不散！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '真的要教我仙法？太好了！我一定准时赴约！', portrait: '👤', position: 'right' },
];

// ==================== 第三章：仙法奇缘 ====================

/** 城南荒野学法 */
const learnMagicNightDialog: DialogLine[] = [
  { speaker: '醉道士', text: '哈哈哈！小伙子你果然守信。', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '前辈！请您收我为徒！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '贫道一向漂泊惯了，不想收徒弟。不过我可以教你几招仙法要诀，算是回报你赐酒之恩。仔细看清楚了！', portrait: '🧙', position: 'left' },
  { speaker: '旁白', text: '醉道士捏个手决，以气御力，指尖激出一道金光！在空中飞旋，瞬间分作数十条，忽又合为一体！只听轰的一声，远处巨石已被击得粉碎...', portrait: '📖' },
  { speaker: '醉道士', text: '以无限为有限，以无法为有法，修仙得道之路，不进则退！我教你的几招仙法，助你固本培元，你好生练习，便可一生受用无穷。', portrait: '🧙', position: 'left' },
];

/** 学成归来 */
const magicLearnedDialog: DialogLine[] = [
  { speaker: '旁白', text: '你按醉道士所教，将法术演练了几遍，忽然觉得仿佛有一道清泉贯彻全身...', portrait: '📖' },
  { speaker: '你', text: '哇...已经天亮了！糟了，回去又要挨骂了！', portrait: '👤', position: 'right' },
  { speaker: '旁白', text: '【学会了排山倒海技能】', portrait: '📖', effect: 'flash' },
];

// ==================== 第四章：红颜知己 ====================

/** 发现清清 */
const findQingqingDialog: DialogLine[] = [
  { speaker: '旁白', text: '你偷偷摸摸地溜进睡房，打开布袋...', portrait: '📖' },
  { speaker: '你', text: '哇！是位大姑娘...清清！？你怎么在这里？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '师父...我要回去救师父！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '嘘~小声点...那些黑衣人为什么要抓你？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '师父受了重伤，我好担心...求求你带我回仙泉，师父就快死了...', portrait: '👧', position: 'left' },
];

/** 婆婆临终 */
const grandmaDeathDialog: DialogLine[] = [
  { speaker: '婆婆', text: '唉...十年了...终究躲不过。清清...师父...不能再保护你了...', portrait: '👵', position: 'left' },
  { speaker: '清清', text: '不要...清清不要...您要是死了，您叫清清怎么办？', portrait: '👧', position: 'left' },
  { speaker: '婆婆', text: '小伙子...以后清清就托付给你了。你要好好保护她...', portrait: '👵', position: 'left' },
  { speaker: '你', text: '婆婆您放心...我一定会照顾好清清的！', portrait: '👤', position: 'right' },
  { speaker: '婆婆', text: '还有...你要带清清回西域故乡，找到她娘亲的下落...', portrait: '👵', position: 'left' },
  { speaker: '旁白', text: '不等清清说完，师父便断气了...', portrait: '📖', effect: 'flash' },
];

/** 清清的誓言 */
const qingqingVowDialog: DialogLine[] = [
  { speaker: '清清', text: '师父~您在天有灵，保佑孩儿早日找到娘亲...清清...就此拜别...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '清清...你以后有何打算？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '当然是...跟着你...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '好吧！事到如今，走一步算一步。反正你也没地方去了，先跟我一起吧。', portrait: '👤', position: 'right' },
];

// ==================== 第五章：比武招亲 ====================

/** 比武招亲开始 */
const martialArtsDialog: DialogLine[] = [
  { speaker: '萧升', text: '诸位乡亲~今日小女的比武招亲终于有了结果，多谢诸位乡亲共襄盛举！', portrait: '👨', position: 'left' },
  { speaker: '萧晓月', text: '爹~！人家才不依呢...', portrait: '👩', position: 'left' },
  { speaker: '萧升', text: '哈哈哈！难得~难得~想不到月儿也会害臊！小伙子，还愣在那干什么？跟着月儿去呀！', portrait: '👨', position: 'left' },
  { speaker: '你', text: '我！？...为什么？', portrait: '👤', position: 'right' },
  { speaker: '萧升', text: '还装傻！？比武招亲擂台之上你既胜了月儿，自然就是我萧家的女婿了！', portrait: '👨', position: 'left' },
];

/** 拒婚对话 */
const rejectMarriageDialog: DialogLine[] = [
  { speaker: '你', text: '我与令嫒略有误会，才上擂台比试，招亲这...这事还请前辈三思！', portrait: '👤', position: 'right' },
  { speaker: '萧升', text: '难道少侠嫌弃小女？', portrait: '👨', position: 'left' },
  { speaker: '你', text: '不敢！不敢！只是婚姻大事并非儿戏，晚辈不敢轻言承诺，只怕辜负了小姐。', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '如果...你...我...可以自己去找娘亲~你不必顾虑我...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '这怎么行！说好的要带你去西域找妈妈，怎能轻食诺言！', portrait: '👤', position: 'right' },
];

// ==================== 第六章：妖塔迷踪 ====================

/** 大雁塔发现 */
const pagodaDiscoveryDialog: DialogLine[] = [
  { speaker: '萧晓月', text: '前面不远处有座慈恩寺~听说寺内大雁塔上常有妖怪出没，有不少少女被掳到塔中下落不明！', portrait: '👩', position: 'left' },
  { speaker: '你', text: '那清清会不会被抓到那里去了？', portrait: '👤', position: 'right' },
  { speaker: '萧晓月', text: '很有可能！我爹曾多次招募志士进入塔内除妖，可是都没有成功。我们快去看看！', portrait: '👩', position: 'left' },
];

/** 战蛇妖 */
const snakeDemonDialog: DialogLine[] = [
  { speaker: '蛇妖男', text: '你们闯进我的地盘来做什么？', portrait: '🐍', position: 'left' },
  { speaker: '你', text: '你就是那只蛇妖！？把清清还我！', portrait: '👤', position: 'right' },
  { speaker: '蛇妖男', text: '谁是清清？', portrait: '🐍', position: 'left' },
  { speaker: '你', text: '废话少说~再不交出人就吃我一剑！', portrait: '👤', position: 'right' },
  { speaker: '蛇妖男', text: '黄毛小子！敢口出狂言~今天定叫你有来无回！', portrait: '🐍', position: 'left' },
];

/** 救出少女 */
const rescueGirlsDialog: DialogLine[] = [
  { speaker: '萧晓月', text: '这里果然有很多被抓来的女孩子！', portrait: '👩', position: 'left' },
  { speaker: '晓慧', text: '是啊~我们都是被妖怪抓来的！谢谢恩公相救！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '清清呢？你们有没有看到一个叫清清的姑娘？', portrait: '👤', position: 'right' },
  { speaker: '晓慧', text: '没有...我们这里没有一个叫清清的。', portrait: '👧', position: 'left' },
  { speaker: '你', text: '那...会是谁抓走了清清？', portrait: '👤', position: 'right' },
];

// ==================== 第七章：方寸问道 ====================

/** 方寸山寻道 */
const fangcunMountainDialog: DialogLine[] = [
  { speaker: '扫地小童', text: '知者不言...言者不知...', portrait: '🧒', position: 'left' },
  { speaker: '你', text: '小道长~请问清风道长在吗？', portrait: '👤', position: 'right' },
  { speaker: '扫地小童', text: '道可道...非常道...', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '我总觉得这间寺庙四周似乎...有股妖气。', portrait: '👧', position: 'left' },
  { speaker: '你', text: '妖气？怎么可能！这里可是道家清修之地呢？', portrait: '👤', position: 'right' },
];

/** 清风道长真面目 */
const qingfengTruthDialog: DialogLine[] = [
  { speaker: '清风道长', text: '贫道是道家清修之人，从不过问外界之俗事，三位请回吧！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '道长此言差矣，出家人降魔卫道本天经地义，何以是外界的俗事呢？', portrait: '👤', position: 'right' },
  { speaker: '清风道长', text: '既然施主答应了替贫道做一件事，贫道就答应你下山收妖！', portrait: '🧙', position: 'left' },
  { speaker: '清风道长', text: '替你焚香更衣啊！你得在我这出家当道士！', portrait: '🧙', position: 'left' },
  { speaker: '三人齐声', text: '哪有这种事！？', portrait: '📖', position: 'left' },
];

/** 晓风真身 */
const xiaofengTruthDialog: DialogLine[] = [
  { speaker: '清清', text: '原来清风道长是假的！', portrait: '👧', position: 'left' },
  { speaker: '晓风', text: '我乃菩提老祖所戴玉佩所化~已经修行九百九十九年了。', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '既然你已有千年的道行，就应该潜心修炼，求天师之道！为何自甘堕落，迫害村民？', portrait: '👧', position: 'left' },
  { speaker: '晓风', text: '呜...从来都没有人教过我这些道理，求求菩萨收我当弟子...', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '好吧...既然你有心...从今以后，你就跟着我吧。你就叫做小丸吧！', portrait: '👧', position: 'left' },
];

// ==================== 第八章：西域风云 ====================

/** 天法国绑架 */
const tianfaguoKidnapDialog: DialogLine[] = [
  { speaker: '吴文', text: '不好了~霜儿被抓走了！', portrait: '👨', position: 'left' },
  { speaker: '你', text: '是谁干的？', portrait: '👤', position: 'right' },
  { speaker: '吴文', text: '那带头的人自称是天法国的长老，他说~如果要霜儿平安，就要清姑娘自己一个人到长安城内的兵马俑阵~', portrait: '👨', position: 'left' },
  { speaker: '清清', text: '他们的目的是我，不会对霜儿姐姐不利的！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '那当然！这次我一定要把他们全部打回老家，永远不敢再来烦你！', portrait: '👤', position: 'right' },
];

/** 项长老对话 */
const elderXiangDialog: DialogLine[] = [
  { speaker: '项长老', text: '殿下~老臣得罪了。', portrait: '👴', position: 'left' },
  { speaker: '清清', text: '如果你们敢伤害他，我...我就立刻自尽！', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '这万万不可~大王可是一直盼着能见到失散十年的亲生女儿最后一面啊。', portrait: '👴', position: 'left' },
  { speaker: '清清', text: '最后一面...？', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '巫王陛下得了重病，已经没有多少日子了。希望您念在父女情份上回到他身边。', portrait: '👴', position: 'left' },
];

/** 清清离别 */
const qingqingDepartureDialog: DialogLine[] = [
  { speaker: '清清', text: '好...放了他们，我就跟你们走...', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '公主殿下睿智！', portrait: '👴', position: 'left' },
  { speaker: '旁白', text: '菩提玉随着清清离去...', portrait: '📖' },
  { speaker: '你', text: '我不会让她离开我的！我一定要找到清清！', portrait: '👤', position: 'right' },
  { speaker: '萧晓月', text: '呆瓜小贼~我也跟你一起去！', portrait: '👩', position: 'left' },
];

/** 任务列表 */
export const QUESTS: Quest[] = [
  // ===== 第一章：初入江湖 =====
  {
    id: 'main_1_1',
    name: '初来乍到',
    description: '创建角色后自动完成，开始你的冒险之旅',
    type: 'main',
    chapter: 1,
    icon: '🌟',
    levelRequired: 1,
    conditions: [],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_hp_potion_small', count: 5 }],
    },
    startDialog: [
      { speaker: '旁白', text: '在这个神秘的世界里，一个新的传奇即将诞生...', portrait: '📖' },
      { speaker: '旁白', text: '你睁开眼睛，发现自己身处一个宁静的海边小村庄——东海村。', portrait: '📖' },
      { speaker: '你', text: '这里...是哪里？我感觉好像忘记了一些事情...', portrait: '👤', position: 'right' },
      { speaker: '旁白', text: '虽然记忆模糊，但你感受到体内蕴藏的力量，一段新的冒险即将开始！', portrait: '📖', effect: 'flash' },
    ],
    autoAccept: true,
    order: 1,
  },
  {
    id: 'main_1_2',
    name: '村长的请求',
    description: '与村长对话，帮助解决村外的螃蟹威胁',
    type: 'main',
    chapter: 1,
    icon: '👴',
    levelRequired: 1,
    prerequisites: ['main_1_1'],
    autoAccept: true,
    conditions: [
      { type: 'talk', target: 'npc_village_chief', required: 1, description: '与村长对话' },
    ],
    rewards: { gold: 50, exp: 30, items: [{ itemId: 'item_hp_potion_small', count: 2 }] },
    startDialog: villageChiefDialog1,
    hints: ['村长在村庄中央'],
    location: { mapId: 'map_donghai_village', npcId: 'npc_village_chief' },
    order: 2,
  },
  {
    id: 'main_1_3',
    name: '清除螃蟹',
    description: '击败8只螃蟹，保护村庄安全',
    type: 'main',
    chapter: 1,
    icon: '🦀',
    levelRequired: 1,
    prerequisites: ['main_1_2'],
    conditions: [
      { type: 'kill', target: 'enemy_crab', required: 8, description: '击败螃蟹 ({current}/{required})' },
    ],
    rewards: { gold: 100, exp: 100, items: [{ itemId: 'item_hp_potion_small', count: 3 }] },
    completeDialog: crabCompleteDialog,
    hints: ['螃蟹在村外的沙滩上出没'],
    order: 3,
  },
  {
    id: 'main_1_4',
    name: '洞穴巡视',
    description: '前往潮水洞穴巡视，查看是否有更大的威胁',
    type: 'main',
    chapter: 1,
    icon: '🕳️',
    levelRequired: 2,
    prerequisites: ['main_1_3'],
    conditions: [
      { type: 'visit_map', target: 'map_tidal_cave', required: 1, description: '进入潮水洞穴' },
    ],
    rewards: { gold: 80, exp: 80, items: [{ itemId: 'item_mp_potion_small', count: 2 }] },
    hints: ['潮水洞穴在村外东侧'],
    order: 4,
  },
  {
    id: 'main_1_5',
    name: '蟹精之患',
    description: '击败洞穴中的蟹精，彻底消除威胁',
    type: 'main',
    chapter: 1,
    icon: '🦞',
    levelRequired: 3,
    prerequisites: ['main_1_4'],
    conditions: [
      { type: 'kill', target: 'enemy_crab_spirit', required: 1, description: '击败蟹精 ({current}/{required})' },
    ],
    rewards: {
      gold: 200,
      exp: 200,
      items: [
        { itemId: 'item_village_letter', count: 1 },
        { itemId: 'item_enhance_stone', count: 2 },
      ],
    },
    startDialog: crabSpiritDialog,
    completeDialog: crabSpiritDefeatedDialog,
    hints: ['蟹精在潮水洞穴深处'],
    order: 5,
  },
  {
    id: 'main_1_6',
    name: '踏上旅途',
    description: '带着村长的信，前往长安城开始新的冒险',
    type: 'main',
    chapter: 1,
    icon: '🚢',
    levelRequired: 3,
    prerequisites: ['main_1_5'],
    conditions: [
      { type: 'visit_map', target: 'map_changan', required: 1, description: '到达长安城' },
    ],
    rewards: {
      gold: 150,
      exp: 150,
      unlocks: { maps: ['map_changan'] },
      items: [{ itemId: 'item_exp_pill_small', count: 3 }],
    },
    hints: ['从码头乘坐船只前往长安城'],
    order: 6,
  },
  {
    id: 'main_1_7',
    name: '老渔夫的请求',
    description: '帮助老渔夫找回丢失的鱼竿',
    type: 'main',
    chapter: 1,
    icon: '🎣',
    levelRequired: 2,
    prerequisites: ['main_1_5'],
    conditions: [
      { type: 'talk', target: 'npc_old_fisherman', required: 1, description: '与老渔夫对话' },
      { type: 'collect', target: 'item_fishing_rod', required: 1, description: '找回鱼竿 ({current}/{required})' },
    ],
    rewards: { gold: 120, exp: 100, items: [{ itemId: 'item_mp_potion_small', count: 3 }] },
    startDialog: [
      { speaker: '老渔夫', text: '年轻人啊，我这把老骨头不中用了，鱼竿被海浪卷走了...', portrait: '👴', position: 'left' },
      { speaker: '你', text: '老人家别急，我帮您找回来！', portrait: '👤', position: 'right' },
    ],
    hints: ['鱼竿可能被冲到沙滩附近'],
    order: 7,
  },
  {
    id: 'main_1_8',
    name: '东海村告别',
    description: '向村长和老渔夫道别，正式踏上旅程',
    type: 'main',
    chapter: 1,
    icon: '👋',
    levelRequired: 3,
    prerequisites: ['main_1_6', 'main_1_7'],
    conditions: [
      { type: 'talk', target: 'npc_village_chief', required: 1, description: '向村长道别' },
      { type: 'talk', target: 'npc_old_fisherman', required: 1, description: '向老渔夫道别' },
    ],
    rewards: { gold: 200, exp: 200, items: [{ itemId: 'item_treasure_box_bronze', count: 1 }] },
    startDialog: [
      { speaker: '村长', text: '孩子，外面的世界很精彩也很危险，记住要勇敢也要谨慎。', portrait: '👴', position: 'left' },
      { speaker: '老渔夫', text: '这是我家传的宝箱，送给你作为临别礼物！', portrait: '👴', position: 'left' },
    ],
    completeDialog: [
      { speaker: '旁白', text: '你怀着激动的心情，踏上了前往长安城的旅程...', portrait: '📖', effect: 'flash' },
    ],
    order: 8,
  },

  // ===== 第二章：长安风云 =====
  {
    id: 'main_2_1',
    name: '客栈小伙计',
    description: '将村长的信交给南城客栈的店小二',
    type: 'main',
    chapter: 2,
    icon: '🏨',
    levelRequired: 3,
    prerequisites: ['main_1_6'],
    conditions: [
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '与店小二对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: shopAssistantDialog1,
    hints: ['南城客栈在长安城内'],
    location: { mapId: 'map_nancheng_inn', npcId: 'npc_shop_assistant' },
    order: 7,
  },
  {
    id: 'main_2_2',
    name: '神秘客人',
    description: '为黑衣客人服务，探听他们的来历',
    type: 'main',
    chapter: 2,
    icon: '🎭',
    levelRequired: 3,
    prerequisites: ['main_2_1'],
    conditions: [
      { type: 'talk', target: 'npc_black_guest', required: 1, description: '与黑衣客人对话' },
    ],
    rewards: { gold: 150, exp: 120 },
    startDialog: blackGuestDialog,
    hints: ['黑衣客人在客栈睡房'],
    order: 8,
  },
  {
    id: 'main_2_3',
    name: '醉道士',
    description: '处理门口的醉道士，他会给你意想不到的收获',
    type: 'main',
    chapter: 2,
    icon: '🧙',
    levelRequired: 4,
    prerequisites: ['main_2_2'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '与醉道士对话' },
    ],
    rewards: { gold: 50, exp: 80 },
    startDialog: drunkTaoistDialog,
    hints: ['醉道士在客栈门口'],
    order: 9,
  },
  {
    id: 'main_2_4',
    name: '桂花酒',
    description: '将桂花酒给醉道士，获得他的指点',
    type: 'main',
    chapter: 2,
    icon: '🍶',
    levelRequired: 4,
    prerequisites: ['main_2_3'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '将桂花酒给醉道士' },
    ],
    rewards: { gold: 100, exp: 150 },
    startDialog: giveWineDialog,
    order: 10,
  },
  {
    id: 'main_2_5',
    name: '深夜之约',
    description: '在三更时分前往城南荒野，学习仙法',
    type: 'main',
    chapter: 2,
    icon: '🌙',
    levelRequired: 5,
    prerequisites: ['main_2_4'],
    conditions: [
      { type: 'visit_map', target: 'map_chengnan_wasteland', required: 1, description: '前往城南荒野' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: learnMagicDialog,
    hints: ['城南荒野在长安城外南方'],
    order: 11,
  },
  {
    id: 'main_2_6',
    name: '仙法传承',
    description: '向醉道士学习仙法要诀',
    type: 'main',
    chapter: 2,
    icon: '✨',
    levelRequired: 5,
    prerequisites: ['main_2_5'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '学习仙法' },
    ],
    rewards: {
      gold: 200,
      exp: 300,
      unlocks: { features: ['skill_push_mountain'] }
    },
    startDialog: learnMagicNightDialog,
    completeDialog: magicLearnedDialog,
    order: 12,
  },
  {
    id: 'main_2_7',
    name: '长安夜市',
    description: '逛一逛长安城的夜市，打听消息',
    type: 'main',
    chapter: 2,
    icon: '🏮',
    levelRequired: 4,
    prerequisites: ['main_2_6'],
    conditions: [
      { type: 'visit_map', target: 'map_changan_night_market', required: 1, description: '前往夜市' },
      { type: 'talk', target: 'npc_merchant_wang', required: 1, description: '与王商人对话' },
    ],
    rewards: { gold: 150, exp: 150 },
    startDialog: [
      { speaker: '王商人', text: '小伙子，看你气宇不凡，像是修仙之人啊！', portrait: '🧔', position: 'left' },
      { speaker: '你', text: '老伯好眼力，我刚从一位道长那里学了些仙法。', portrait: '👤', position: 'right' },
      { speaker: '王商人', text: '最近城里的黑衣人越来越多了，你要小心些。', portrait: '🧔', position: 'left' },
    ],
    hints: ['夜市在长安城东边'],
    order: 13,
  },
  {
    id: 'main_2_8',
    name: '可疑的行踪',
    description: '跟踪黑衣人，发现他们的秘密据点',
    type: 'main',
    chapter: 2,
    icon: '🕵️',
    levelRequired: 5,
    prerequisites: ['main_2_7'],
    conditions: [
      { type: 'kill', target: 'enemy_scout', required: 3, description: '击败斥候 ({current}/{required})' },
      { type: 'visit_map', target: 'map_secret_hideout', required: 1, description: '发现秘密据点' },
    ],
    rewards: { gold: 250, exp: 250 },
    startDialog: [
      { speaker: '旁白', text: '你悄悄跟踪几个黑衣人，发现他们进入了一座废弃的宅院...', portrait: '📖' },
      { speaker: '黑衣斥候', text: '谁在那里？！', portrait: '🎭', position: 'left' },
    ],
    completeDialog: [
      { speaker: '旁白', text: '原来这里是一个神秘组织的据点，与你所知的客栈有关联...', portrait: '📖' },
    ],
    order: 14,
  },

  // ===== 第三章：仙法奇缘 =====
  {
    id: 'main_3_1',
    name: '客栈风波',
    description: '回到南城客栈，发现客栈出了大事',
    type: 'main',
    chapter: 3,
    icon: '⚠️',
    levelRequired: 5,
    prerequisites: ['main_2_6'],
    conditions: [
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '与店小二对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '店小二', text: '唉呀！你死哪里去了！不知怎么回事，客栈里好多客人中毒了！快出人命了！', portrait: '🧑', position: 'left' },
      { speaker: '你', text: '啊！？', portrait: '👤', position: 'right' },
    ],
    order: 13,
  },
  {
    id: 'main_3_2',
    name: '寻药救人',
    description: '去药店找杨中顺，为中毒的客人求取解药',
    type: 'main',
    chapter: 3,
    icon: '💊',
    levelRequired: 5,
    prerequisites: ['main_3_1'],
    conditions: [
      { type: 'talk', target: 'npc_pharmacist', required: 1, description: '与药铺掌柜对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '杨中顺', text: '这些人中的毒很奇怪，老夫也从未见过。事不宜迟，老夫这就回去配药！', portrait: '👨', position: 'left' },
      { speaker: '杨中顺', text: '不过这偏方药引不好找！需要5个动物碎齿。', portrait: '👨', position: 'left' },
    ],
    location: { mapId: 'map_changan', npcId: 'npc_pharmacist' },
    order: 14,
  },
  {
    id: 'main_3_3',
    name: '收集药引',
    description: '收集5个动物碎齿交给药铺掌柜',
    type: 'main',
    chapter: 3,
    icon: '🦷',
    levelRequired: 5,
    prerequisites: ['main_3_2'],
    conditions: [
      { type: 'collect', target: 'item_animal_tooth', required: 5, description: '收集动物碎齿 ({current}/{required})' },
    ],
    rewards: { gold: 150, exp: 150 },
    hints: ['动物碎齿可以从大老鼠身上获得'],
    order: 15,
  },
  {
    id: 'main_3_4',
    name: '仙泉求露',
    description: '前往仙泉，向仙子求取仙露救人',
    type: 'main',
    chapter: 3,
    icon: '💧',
    levelRequired: 6,
    prerequisites: ['main_3_3'],
    conditions: [
      { type: 'visit_map', target: 'map_xianquan', required: 1, description: '到达仙泉' },
    ],
    rewards: { gold: 150, exp: 200 },
    startDialog: [
      { speaker: '杨中顺', text: '听说仙泉中常有仙子出现，赐凡人仙露以解危难！你不妨去试试！', portrait: '👨', position: 'left' },
      { speaker: '你', text: '好！我这就去！', portrait: '👤', position: 'right' },
    ],
    hints: ['仙泉在望南街过去的曲江池边'],
    order: 16,
  },
  {
    id: 'main_3_5',
    name: '药到病除',
    description: '将仙露带给药铺掌柜配制解药，救治中毒的客人',
    type: 'main',
    chapter: 3,
    icon: '🌿',
    levelRequired: 6,
    prerequisites: ['main_3_4'],
    conditions: [
      { type: 'talk', target: 'npc_pharmacist', required: 1, description: '将仙露交给杨中顺' },
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '将解药带回客栈' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: [
      { speaker: '杨中顺', text: '造化~造化！这些人的性命有救了！我这就配药！', portrait: '👨', position: 'left' },
      { speaker: '你', text: '嘿嘿~', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '店小二', text: '多亏有你帮忙！你也早点休息吧~', portrait: '🧑', position: 'left' },
      { speaker: '你', text: '好~', portrait: '👤', position: 'right' },
    ],
    order: 17,
  },
  {
    id: 'main_3_6',
    name: '仙子之赠',
    description: '再次前往仙泉，感谢仙子的帮助',
    type: 'main',
    chapter: 3,
    icon: '🧚',
    levelRequired: 6,
    prerequisites: ['main_3_5'],
    conditions: [
      { type: 'visit_map', target: 'map_xianquan', required: 1, description: '前往仙泉' },
      { type: 'talk', target: 'npc_fairy', required: 1, description: '与仙子对话' },
    ],
    rewards: {
      gold: 250,
      exp: 300,
      items: [{ itemId: 'item_spirit_bead_fragment', count: 1 }],
    },
    startDialog: [
      { speaker: '仙子', text: '年轻人，你的善良和勇气让我感动。', portrait: '🧚', position: 'left' },
      { speaker: '你', text: '多谢仙子赐予仙露，救了客栈的客人。', portrait: '👤', position: 'right' },
      { speaker: '仙子', text: '这是一块灵珠碎片，它会在你需要的时候帮助你。去吧，你的命运已经开始了...', portrait: '🧚', position: 'left' },
    ],
    order: 18,
  },

  // ===== 第四章：红颜知己 =====
  {
    id: 'main_4_1',
    name: '神秘少女',
    description: '在客栈睡房发现被绑架的清清姑娘',
    type: 'main',
    chapter: 4,
    icon: '👧',
    levelRequired: 6,
    prerequisites: ['main_3_5'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 150, exp: 200 },
    startDialog: findQingqingDialog,
    hints: ['清清被关在客栈睡房'],
    order: 18,
  },
  {
    id: 'main_4_2',
    name: '黑衣人之战',
    description: '击败黑衣大汉，保护清清',
    type: 'main',
    chapter: 4,
    icon: '⚔️',
    levelRequired: 7,
    prerequisites: ['main_4_1'],
    conditions: [
      { type: 'kill', target: 'enemy_black_guards', required: 3, description: '击败黑衣人 ({current}/{required})' },
    ],
    rewards: { gold: 250, exp: 300 },
    startDialog: [
      { speaker: '黑衣大汉', text: '咱们天法国的事你最好别管！', portrait: '🎭', position: 'left' },
      { speaker: '你', text: '嘿~在我们客栈拐卖人口，我当然非管不可！', portrait: '👤', position: 'right' },
      { speaker: '黑衣大汉', text: '你找死！', portrait: '🎭', position: 'left' },
    ],
    order: 19,
  },
  {
    id: 'main_4_3',
    name: '仙泉送别',
    description: '将清清送回仙泉，却遭遇变故',
    type: 'main',
    chapter: 4,
    icon: '🙏',
    levelRequired: 7,
    prerequisites: ['main_4_2'],
    conditions: [
      { type: 'visit_map', target: 'map_xianquan', required: 1, description: '护送清清回仙泉' },
      { type: 'talk', target: 'npc_grandma', required: 1, description: '与婆婆对话' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: grandmaDeathDialog,
    order: 20,
  },
  {
    id: 'main_4_4',
    name: '掩埋婆婆',
    description: '帮助清清安葬师父，陪伴她度过难关',
    type: 'main',
    chapter: 4,
    icon: '🪦',
    levelRequired: 7,
    prerequisites: ['main_4_3'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 100, exp: 150 },
    startDialog: [
      { speaker: '清清', text: '师父~都怪清清不好，没有听您的话...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '好了...别难过了，事已至此~我想你师父也不希望你一直这么伤心。', portrait: '👤', position: 'right' },
    ],
    order: 21,
  },
  {
    id: 'main_4_5',
    name: '新的开始',
    description: '清清决定跟随你，一起踏上冒险之旅',
    type: 'main',
    chapter: 4,
    icon: '🌅',
    levelRequired: 8,
    prerequisites: ['main_4_4'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: qingqingVowDialog,
    completeDialog: [
      { speaker: '旁白', text: '从此，清清成为了你的伙伴，一起踏上了冒险之旅。', portrait: '📖', effect: 'flash' },
    ],
    order: 22,
  },
  {
    id: 'main_4_6',
    name: '清清的身世',
    description: '从清清口中了解她的过去',
    type: 'main',
    chapter: 4,
    icon: '📜',
    levelRequired: 8,
    prerequisites: ['main_4_5'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '听清清讲述身世' },
    ],
    rewards: { gold: 150, exp: 200 },
    startDialog: [
      { speaker: '清清', text: '其实...我并不记得小时候的事，师父说我来自西域...', portrait: '👧', position: 'left' },
      { speaker: '清清', text: '师父说我的娘亲是西域的贵族，但我从未见过她。', portrait: '👧', position: 'left' },
      { speaker: '你', text: '放心，我会帮你找到娘亲的。', portrait: '👤', position: 'right' },
      { speaker: '清清', text: '谢谢你...能有你陪伴，我很幸福。', portrait: '👧', position: 'left' },
    ],
    order: 23,
  },

  // ===== 第五章：比武招亲 =====
  {
    id: 'main_5_1',
    name: '城隍庙烧香',
    description: '带清清去城隍庙烧香许愿',
    type: 'main',
    chapter: 5,
    icon: '⛩️',
    levelRequired: 8,
    prerequisites: ['main_4_5'],
    conditions: [
      { type: 'visit_map', target: 'map_chenghuang_temple', required: 1, description: '前往城隍庙' },
    ],
    rewards: { gold: 150, exp: 150 },
    hints: ['城隍庙在歪柳巷'],
    order: 23,
  },
  {
    id: 'main_5_2',
    name: '萧晓月',
    description: '在城隍庙遇到野蛮的萧晓月',
    type: 'main',
    chapter: 5,
    icon: '👩',
    levelRequired: 8,
    prerequisites: ['main_5_1'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_xiaoyue', required: 1, description: '与萧晓月对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '旁白', text: '一个穿着阔气的野蛮丫头正拿着鞭子抽打两个被吊在树上的人...', portrait: '📖' },
      { speaker: '你', text: '这位大姐，他们俩犯了什么错为什么要这样打他们？', portrait: '👤', position: 'right' },
      { speaker: '萧晓月', text: '这两人是咱们家的丫环和长工，暗通款曲想要私奔！现在让我撞见了就该受罚！', portrait: '👩', position: 'left' },
    ],
    order: 24,
  },
  {
    id: 'main_5_3',
    name: '比武招亲',
    description: '振远镖局举办比武招亲，萧升邀请你参加',
    type: 'main',
    chapter: 5,
    icon: '🏆',
    levelRequired: 9,
    prerequisites: ['main_5_2'],
    conditions: [
      { type: 'visit_map', target: 'map_zhenyuan_biaoju', required: 1, description: '前往振远镖局' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: martialArtsDialog,
    hints: ['振远镖局在长安城内'],
    order: 25,
  },
  {
    id: 'main_5_4',
    name: '擂台比武',
    description: '在擂台上击败萧晓月',
    type: 'main',
    chapter: 5,
    icon: '🥊',
    levelRequired: 10,
    prerequisites: ['main_5_3'],
    conditions: [
      { type: 'kill', target: 'enemy_xiao_xiaoyue', required: 1, description: '击败萧晓月 ({current}/{required})' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '萧晓月', text: '呆瓜小贼~看招~', portrait: '👩', position: 'left' },
      { speaker: '你', text: '得罪了！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '萧晓月', text: '我认输了...', portrait: '👩', position: 'left' },
      { speaker: '你', text: '承让~', portrait: '👤', position: 'right' },
    ],
    order: 26,
  },
  {
    id: 'main_5_5',
    name: '婚事风波',
    description: '萧升想要你入赘萧家，但你心中挂念着清清',
    type: 'main',
    chapter: 5,
    icon: '💍',
    levelRequired: 10,
    prerequisites: ['main_5_4'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_sheng', required: 1, description: '与萧升对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: rejectMarriageDialog,
    order: 27,
  },
  {
    id: 'main_5_6',
    name: '镖局危机',
    description: '振远镖局遭遇袭击，萧晓月请求帮助',
    type: 'main',
    chapter: 5,
    icon: '⚠️',
    levelRequired: 10,
    prerequisites: ['main_5_5'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_xiaoyue', required: 1, description: '与萧晓月对话' },
      { type: 'kill', target: 'enemy_bandit', required: 5, description: '击败强盗 ({current}/{required})' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: [
      { speaker: '萧晓月', text: '不好了！有强盗袭击镖局！', portrait: '👩', position: 'left' },
      { speaker: '你', text: '别慌，我来帮忙！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '萧升', text: '多谢少侠相助！萧家欠你一个人情。', portrait: '👨', position: 'left' },
    ],
    order: 28,
  },

  // ===== 第六章：妖塔迷踪 =====
  {
    id: 'main_6_1',
    name: '狐妖之祸',
    description: '镇远镖局遭遇狐妖袭击，清清失踪',
    type: 'main',
    chapter: 6,
    icon: '🦊',
    levelRequired: 10,
    prerequisites: ['main_5_5'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_sheng', required: 1, description: '与萧升对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: [
      { speaker: '萧升', text: '妖怪？竟敢在萧家堡作乱！', portrait: '👨', position: 'left' },
      { speaker: '萧晓月', text: '狐妖，是只半人半狐的妖怪，刚才就在西厢房里面！', portrait: '👩', position: 'left' },
      { speaker: '你', text: '清清！清清人呢？', portrait: '👤', position: 'right' },
      { speaker: '萧晓月', text: '清姑娘不见了！', portrait: '👩', position: 'left' },
    ],
    order: 28,
  },
  {
    id: 'main_6_2',
    name: '大雁塔寻人',
    description: '前往大雁塔寻找清清的下落',
    type: 'main',
    chapter: 6,
    icon: '🗼',
    levelRequired: 11,
    prerequisites: ['main_6_1'],
    conditions: [
      { type: 'visit_map', target: 'map_dayan_ta', required: 1, description: '进入大雁塔' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: pagodaDiscoveryDialog,
    hints: ['大雁塔在慈恩寺内'],
    order: 29,
  },
  {
    id: 'main_6_3',
    name: '斩杀蛇妖',
    description: '在大雁塔中击败蛇妖',
    type: 'main',
    chapter: 6,
    icon: '🐍',
    levelRequired: 12,
    prerequisites: ['main_6_2'],
    conditions: [
      { type: 'kill', target: 'enemy_snake_demon', required: 1, description: '击败蛇妖 ({current}/{required})' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: snakeDemonDialog,
    order: 30,
  },
  {
    id: 'main_6_4',
    name: '狐妖女',
    description: '击败大雁塔中的狐妖女',
    type: 'main',
    chapter: 6,
    icon: '🦊',
    levelRequired: 13,
    prerequisites: ['main_6_3'],
    conditions: [
      { type: 'kill', target: 'enemy_fox_demon_female', required: 1, description: '击败狐妖女 ({current}/{required})' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '妖狐女', text: '你们...想干什么？', portrait: '🦊', position: 'left' },
      { speaker: '你', text: '清清呢？你们把她藏在哪里？', portrait: '👤', position: 'right' },
      { speaker: '妖狐女', text: '老娘这儿没有一个叫清清的！', portrait: '🦊', position: 'left' },
    ],
    completeDialog: rescueGirlsDialog,
    order: 31,
  },
  {
    id: 'main_6_5',
    name: '高家庄寻人',
    description: '在高家庄找到了清清',
    type: 'main',
    chapter: 6,
    icon: '🏠',
    levelRequired: 13,
    prerequisites: ['main_6_4'],
    conditions: [
      { type: 'visit_map', target: 'map_gaojia_zhuang', required: 1, description: '前往高家庄' },
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: [
      { speaker: '小乞丐', text: '吴村长的女儿昨天救了一个外地女子！', portrait: '👦', position: 'left' },
      { speaker: '你', text: '一定是清清！快带我去！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '你', text: '清清...！！', portrait: '👤', position: 'right' },
      { speaker: '清清', text: '你终于来了...', portrait: '👧', position: 'left' },
    ],
    order: 32,
  },
  {
    id: 'main_6_6',
    name: '塔内宝物',
    description: '在大雁塔深处发现传说中的法宝',
    type: 'main',
    chapter: 6,
    icon: '📿',
    levelRequired: 13,
    prerequisites: ['main_6_5'],
    conditions: [
      { type: 'visit_map', target: 'map_dayan_ta_deep', required: 1, description: '探索大雁塔深处' },
      { type: 'kill', target: 'enemy_tower_guardian', required: 1, description: '击败塔守护者 ({current}/{required})' },
    ],
    rewards: {
      gold: 500,
      exp: 500,
      items: [{ itemId: 'item_magic_mirror', count: 1 }],
    },
    startDialog: [
      { speaker: '清清', text: '听说大雁塔深处藏有上古法宝...', portrait: '👧', position: 'left' },
      { speaker: '萧晓月', text: '我们去看看吧！说不定能找到好东西！', portrait: '👩', position: 'left' },
    ],
    completeDialog: [
      { speaker: '旁白', text: '你获得了一面神秘的法镜，据说能照出妖魔真身...', portrait: '📖', effect: 'flash' },
    ],
    order: 33,
  },

  // ===== 第七章：方寸问道 =====
  {
    id: 'main_7_1',
    name: '海妖之患',
    description: '高家庄饱受海妖肆虐，决定上山请道长除妖',
    type: 'main',
    chapter: 7,
    icon: '🌊',
    levelRequired: 14,
    prerequisites: ['main_6_5'],
    conditions: [
      { type: 'talk', target: 'npc_wu_wen', required: 1, description: '与吴村长对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: [
      { speaker: '吴文', text: '这附近一带的村子饱受海妖肆虐，能搬走的人都搬走了。', portrait: '👨', position: 'left' },
      { speaker: '你', text: '海妖一日不除，这里的居民还是永无宁日。我上山请道长下山除妖！', portrait: '👤', position: 'right' },
    ],
    order: 33,
  },
  {
    id: 'main_7_2',
    name: '方寸山寻道',
    description: '前往方寸山，拜访清风道长',
    type: 'main',
    chapter: 7,
    icon: '⛰️',
    levelRequired: 14,
    prerequisites: ['main_7_1'],
    conditions: [
      { type: 'visit_map', target: 'map_fangcun_mountain', required: 1, description: '前往方寸山' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: fangcunMountainDialog,
    order: 34,
  },
  {
    id: 'main_7_3',
    name: '道士阴谋',
    description: '发现清风道长的真面目',
    type: 'main',
    chapter: 7,
    icon: '😈',
    levelRequired: 15,
    prerequisites: ['main_7_2'],
    conditions: [
      { type: 'talk', target: 'npc_qingfeng_daoshi', required: 1, description: '与清风道长对话' },
    ],
    rewards: { gold: 250, exp: 300 },
    startDialog: qingfengTruthDialog,
    order: 35,
  },
  {
    id: 'main_7_4',
    name: '击败清风',
    description: '击败清风道长，揭开真相',
    type: 'main',
    chapter: 7,
    icon: '⚔️',
    levelRequired: 16,
    prerequisites: ['main_7_3'],
    conditions: [
      { type: 'kill', target: 'enemy_qingfeng_daoshi', required: 1, description: '击败清风道长 ({current}/{required})' },
    ],
    rewards: { gold: 600, exp: 600 },
    completeDialog: xiaofengTruthDialog,
    order: 36,
  },
  {
    id: 'main_7_5',
    name: '赤血龙王',
    description: '前往东海海底莽林，消灭赤血龙王',
    type: 'main',
    chapter: 7,
    icon: '🐉',
    levelRequired: 17,
    prerequisites: ['main_7_4'],
    conditions: [
      { type: 'visit_map', target: 'map_donghai_seaforest', required: 1, description: '进入东海海底莽林' },
      { type: 'kill', target: 'enemy_red_blood_dragon', required: 1, description: '击败赤血龙王 ({current}/{required})' },
    ],
    rewards: {
      gold: 1000,
      exp: 1000,
      items: [{ itemId: 'item_earth_spirit_bead', count: 1 }],
    },
    startDialog: [
      { speaker: '晓风', text: '赤血龙王就躲在那水底下的血池中，他用邪法操纵海妖吸食人血。', portrait: '🧒', position: 'left' },
      { speaker: '你', text: '这么邪恶的妖魔！我一定要消灭他！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '清清', text: '原来...土灵珠在这妖怪身上！', portrait: '👧', position: 'left' },
      { speaker: '旁白', text: '【获得土灵珠】', portrait: '📖', effect: 'flash' },
    ],
    order: 37,
  },
  {
    id: 'main_7_6',
    name: '晓风加入',
    description: '晓风决定加入队伍，一起前往西域',
    type: 'main',
    chapter: 7,
    icon: '🧒',
    levelRequired: 17,
    prerequisites: ['main_7_5'],
    conditions: [
      { type: 'talk', target: 'npc_xiaofeng', required: 1, description: '与晓风对话' },
    ],
    rewards: { gold: 300, exp: 400 },
    startDialog: [
      { speaker: '晓风', text: '经过这段时间的相处，我...想跟你们一起去西域。', portrait: '🧒', position: 'left' },
      { speaker: '清清', text: '真的吗？太好了！', portrait: '👧', position: 'left' },
      { speaker: '你', text: '欢迎加入！有你的法力相助，我们一定能找到清清的娘亲！', portrait: '👤', position: 'right' },
    ],
    order: 38,
  },

  // ===== 第八章：西域风云 =====
  {
    id: 'main_8_1',
    name: '天法国绑架',
    description: '霜儿被天法国长老绑架，用来要挟清清',
    type: 'main',
    chapter: 8,
    icon: '⚠️',
    levelRequired: 18,
    prerequisites: ['main_7_5'],
    conditions: [
      { type: 'talk', target: 'npc_wu_wen', required: 1, description: '与吴村长对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: tianfaguoKidnapDialog,
    order: 38,
  },
  {
    id: 'main_8_2',
    name: '兵马俑阵',
    description: '前往兵马俑阵，与项长老对峙',
    type: 'main',
    chapter: 8,
    icon: '🗿',
    levelRequired: 19,
    prerequisites: ['main_8_1'],
    conditions: [
      { type: 'visit_map', target: 'map_bingmayong', required: 1, description: '进入兵马俑阵' },
      { type: 'kill', target: 'enemy_terracotta_warriors', required: 5, description: '击败兵马俑 ({current}/{required})' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '兵马俑', text: '来者何人？报上名来！', portrait: '🗿', position: 'left' },
      { speaker: '清清', text: '我就是清清！你们快将霜儿姐姐放了！', portrait: '👧', position: 'left' },
    ],
    order: 39,
  },
  {
    id: 'main_8_3',
    name: '公主殿下',
    description: '得知清清是西域公主的身世',
    type: 'main',
    chapter: 8,
    icon: '👸',
    levelRequired: 20,
    prerequisites: ['main_8_2'],
    conditions: [
      { type: 'talk', target: 'npc_elder_xiang', required: 1, description: '与项长老对话' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: elderXiangDialog,
    order: 40,
  },
  {
    id: 'main_8_4',
    name: '离别与重逢',
    description: '清清为了保护大家，决定跟随天法国的人离开，你发誓要找到她',
    type: 'main',
    chapter: 8,
    icon: '💔',
    levelRequired: 20,
    prerequisites: ['main_8_3'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: qingqingDepartureDialog,
    order: 41,
  },
  {
    id: 'main_8_5',
    name: '准备西行',
    description: '为西行做准备，收集必要的物资',
    type: 'main',
    chapter: 8,
    icon: '🎒',
    levelRequired: 20,
    prerequisites: ['main_8_4'],
    conditions: [
      { type: 'collect', target: 'item_travel_rations', required: 10, description: '准备干粮 ({current}/{required})' },
      { type: 'collect', target: 'item_water_skin', required: 5, description: '准备水袋 ({current}/{required})' },
      { type: 'talk', target: 'npc_xiao_xiaoyue', required: 1, description: '与萧晓月告别' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: [
      { speaker: '萧晓月', text: '呆瓜小贼！我也要跟你们去西域！', portrait: '👩', position: 'left' },
      { speaker: '你', text: '此去西域路途遥远危险，你确定要去？', portrait: '👤', position: 'right' },
      { speaker: '萧晓月', text: '哼！本小姐决定了的事，谁也改变不了！', portrait: '👩', position: 'left' },
    ],
    order: 42,
  },
  {
    id: 'main_8_6',
    name: '踏上西行路',
    description: '出发前往西域，追寻清清的踪迹',
    type: 'main',
    chapter: 8,
    icon: '🐪',
    levelRequired: 20,
    prerequisites: ['main_8_5'],
    conditions: [
      { type: 'visit_map', target: 'map_silk_road', required: 1, description: '踏上丝绸之路' },
    ],
    rewards: {
      gold: 500,
      exp: 500,
      unlocks: { maps: ['map_western_region'] },
    },
    startDialog: [
      { speaker: '旁白', text: '你们踏上了漫长的西行之路...', portrait: '📖' },
      { speaker: '晓风', text: '前方就是丝绸之路，穿过它就能到达西域了。', portrait: '🧒', position: 'left' },
    ],
    completeDialog: [
      { speaker: '旁白', text: '西域的风沙扑面而来，清清就在这片土地的某处...', portrait: '📖', effect: 'flash' },
    ],
    order: 43,
  },

  // ===== 第九章：西凉公主 =====
  {
    id: 'main_9_1',
    name: '西域初探',
    description: '初到西域，探索这片神秘的土地',
    type: 'main',
    chapter: 9,
    icon: '🏜️',
    levelRequired: 21,
    prerequisites: ['main_8_6'],
    conditions: [
      { type: 'visit_map', target: 'map_western_region', required: 1, description: '探索西域' },
      { type: 'talk', target: 'npc_caravan_leader', required: 1, description: '与商队首领对话' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: [
      { speaker: '商队首领', text: '外乡人？很少见到从中原来的旅人。', portrait: '🧔', position: 'left' },
      { speaker: '你', text: '请问您见过一个叫清清的姑娘吗？', portrait: '👤', position: 'right' },
      { speaker: '商队首领', text: '清清...？你是说西凉国的公主？', portrait: '🧔', position: 'left' },
    ],
    order: 44,
  },
  {
    id: 'main_9_2',
    name: '西凉国',
    description: '前往西凉国，寻找清清的下落',
    type: 'main',
    chapter: 9,
    icon: '🏰',
    levelRequired: 22,
    prerequisites: ['main_9_1'],
    conditions: [
      { type: 'visit_map', target: 'map_xiliang_kingdom', required: 1, description: '进入西凉国' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '旁白', text: '一座宏伟的城池出现在眼前，这就是传说中的西凉国...', portrait: '📖' },
    ],
    order: 45,
  },
  {
    id: 'main_9_3',
    name: '宫廷守卫',
    description: '击败宫廷守卫，进入王宫',
    type: 'main',
    chapter: 9,
    icon: '💂',
    levelRequired: 22,
    prerequisites: ['main_9_2'],
    conditions: [
      { type: 'kill', target: 'enemy_palace_guard', required: 5, description: '击败宫廷守卫 ({current}/{required})' },
    ],
    rewards: { gold: 600, exp: 600 },
    startDialog: [
      { speaker: '宫廷守卫', text: '来者止步！王宫重地，闲人免进！', portrait: '💂', position: 'left' },
      { speaker: '你', text: '我必须见清清！', portrait: '👤', position: 'right' },
    ],
    order: 46,
  },
  {
    id: 'main_9_4',
    name: '巫王召见',
    description: '觐见巫王，得知真相',
    type: 'main',
    chapter: 9,
    icon: '👑',
    levelRequired: 23,
    prerequisites: ['main_9_3'],
    conditions: [
      { type: 'talk', target: 'npc_witch_king', required: 1, description: '与巫王对话' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '巫王', text: '你就是保护小女的中原人？', portrait: '👑', position: 'left' },
      { speaker: '你', text: '巫王陛下，清清她...？', portrait: '👤', position: 'right' },
      { speaker: '巫王', text: '清清是我的女儿，西凉国的公主。她的娘亲...是我对不起的人...', portrait: '👑', position: 'left' },
    ],
    order: 47,
  },
  {
    id: 'main_9_5',
    name: '重逢清清',
    description: '与清清重逢，但她似乎变了',
    type: 'main',
    chapter: 9,
    icon: '💕',
    levelRequired: 23,
    prerequisites: ['main_9_4'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: [
      { speaker: '清清', text: '你...你来了...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '清清！你没事太好了！', portrait: '👤', position: 'right' },
      { speaker: '清清', text: '可是...父王病重，国中又有人图谋不轨...', portrait: '👧', position: 'left' },
    ],
    order: 48,
  },
  {
    id: 'main_9_6',
    name: '内忧外患',
    description: '帮助清清稳定局势',
    type: 'main',
    chapter: 9,
    icon: '⚔️',
    levelRequired: 24,
    prerequisites: ['main_9_5'],
    conditions: [
      { type: 'kill', target: 'enemy_rebel_soldier', required: 10, description: '击败叛军 ({current}/{required})' },
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '向清清汇报' },
    ],
    rewards: { gold: 800, exp: 800 },
    startDialog: [
      { speaker: '清清', text: '国内有人趁父王病重起兵造反，请帮帮我！', portrait: '👧', position: 'left' },
      { speaker: '你', text: '放心，有我在！', portrait: '👤', position: 'right' },
    ],
    order: 49,
  },

  // ===== 第十章：魔王降临 =====
  {
    id: 'main_10_1',
    name: '巫王病危',
    description: '巫王病入膏肓，清清忧心忡忡',
    type: 'main',
    chapter: 10,
    icon: '😔',
    levelRequired: 24,
    prerequisites: ['main_9_6'],
    conditions: [
      { type: 'talk', target: 'npc_witch_king', required: 1, description: '探望巫王' },
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '安慰清清' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '巫王', text: '咳咳...时日无多了...清清，父王对不起你...', portrait: '👑', position: 'left' },
      { speaker: '清清', text: '父王！您别说这样的话...', portrait: '👧', position: 'left' },
    ],
    order: 50,
  },
  {
    id: 'main_10_2',
    name: '魔气涌动',
    description: '西凉国出现魔气，似有大难将至',
    type: 'main',
    chapter: 10,
    icon: '😈',
    levelRequired: 25,
    prerequisites: ['main_10_1'],
    conditions: [
      { type: 'visit_map', target: 'map_demonic_rift', required: 1, description: '调查魔气源头' },
      { type: 'kill', target: 'enemy_lesser_demon', required: 8, description: '击败小魔 ({current}/{required})' },
    ],
    rewards: { gold: 600, exp: 600 },
    startDialog: [
      { speaker: '晓风', text: '不好！这魔气...是魔王即将复活的征兆！', portrait: '🧒', position: 'left' },
      { speaker: '你', text: '魔王？！', portrait: '👤', position: 'right' },
    ],
    order: 51,
  },
  {
    id: 'main_10_3',
    name: '寻找封印',
    description: '寻找封印魔王的上古法阵',
    type: 'main',
    chapter: 10,
    icon: '🔮',
    levelRequired: 25,
    prerequisites: ['main_10_2'],
    conditions: [
      { type: 'visit_map', target: 'map_ancient_seal', required: 1, description: '找到上古封印' },
      { type: 'collect', target: 'item_seal_fragment', required: 3, description: '收集封印碎片 ({current}/{required})' },
    ],
    rewards: { gold: 700, exp: 700 },
    startDialog: [
      { speaker: '旁白', text: '传说在西凉国深处的神殿中，封印着上古魔王...', portrait: '📖' },
    ],
    order: 52,
  },
  {
    id: 'main_10_4',
    name: '魔王复苏',
    description: '封印被破坏，魔王即将苏醒',
    type: 'main',
    chapter: 10,
    icon: '👹',
    levelRequired: 26,
    prerequisites: ['main_10_3'],
    conditions: [
      { type: 'kill', target: 'enemy_demon_general', required: 3, description: '击败魔将 ({current}/{required})' },
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清商议' },
    ],
    rewards: { gold: 800, exp: 800 },
    startDialog: [
      { speaker: '旁白', text: '封印已破，黑暗的气息从深渊中涌出...', portrait: '📖' },
      { speaker: '魔王之声', text: '哈哈哈...吾即将重现人间！', portrait: '👹', position: 'left' },
    ],
    order: 53,
  },
  {
    id: 'main_10_5',
    name: '巫王遗愿',
    description: '巫王临终前将王位传给清清，并托付给你',
    type: 'main',
    chapter: 10,
    icon: '👑',
    levelRequired: 26,
    prerequisites: ['main_10_4'],
    conditions: [
      { type: 'talk', target: 'npc_witch_king', required: 1, description: '聆听巫王遗言' },
    ],
    rewards: { gold: 600, exp: 600 },
    startDialog: [
      { speaker: '巫王', text: '清清...父王的时间到了...西凉国...交给你了...', portrait: '👑', position: 'left' },
      { speaker: '巫王', text: '年轻人...请你...保护清清...保护西凉...', portrait: '👑', position: 'left' },
      { speaker: '清清', text: '父王！！！', portrait: '👧', position: 'left' },
    ],
    order: 54,
  },
  {
    id: 'main_10_6',
    name: '誓死抵抗',
    description: '带领西凉军抵抗魔王大军',
    type: 'main',
    chapter: 10,
    icon: '🛡️',
    levelRequired: 27,
    prerequisites: ['main_10_5'],
    conditions: [
      { type: 'kill', target: 'enemy_demon_army', required: 20, description: '击败魔军 ({current}/{required})' },
      { type: 'kill', target: 'enemy_demon_captain', required: 1, description: '击败魔军队长 ({current}/{required})' },
    ],
    rewards: {
      gold: 1000,
      exp: 1000,
      items: [{ itemId: 'item_dragon_slayer_sword', count: 1 }],
    },
    startDialog: [
      { speaker: '清清', text: '为了父王，为了西凉国，我们绝不退缩！', portrait: '👧', position: 'left' },
      { speaker: '你', text: '跟我一起战斗！', portrait: '👤', position: 'right' },
    ],
    order: 55,
  },

  // ===== 第十一章：天命之战 =====
  {
    id: 'main_11_1',
    name: '神器觉醒',
    description: '身上的灵珠碎片开始发光，似乎感应到了什么',
    type: 'main',
    chapter: 11,
    icon: '✨',
    levelRequired: 27,
    prerequisites: ['main_10_6'],
    conditions: [
      { type: 'talk', target: 'npc_xiaofeng', required: 1, description: '与晓风商议' },
      { type: 'collect', target: 'item_spirit_bead', required: 5, description: '收集灵珠碎片 ({current}/{required})' },
    ],
    rewards: { gold: 800, exp: 800 },
    startDialog: [
      { speaker: '晓风', text: '灵珠碎片在发光！它们在召唤其他碎片！', portrait: '🧒', position: 'left' },
      { speaker: '你', text: '难道是...神器的力量？', portrait: '👤', position: 'right' },
    ],
    order: 56,
  },
  {
    id: 'main_11_2',
    name: '魔王城',
    description: '攻入魔王城，直捣黄龙',
    type: 'main',
    chapter: 11,
    icon: '🏰',
    levelRequired: 28,
    prerequisites: ['main_11_1'],
    conditions: [
      { type: 'visit_map', target: 'map_demon_castle', required: 1, description: '进入魔王城' },
      { type: 'kill', target: 'enemy_demon_elite', required: 10, description: '击败精锐恶魔 ({current}/{required})' },
    ],
    rewards: { gold: 1000, exp: 1000 },
    startDialog: [
      { speaker: '旁白', text: '魔王城耸立在前方，黑暗的力量笼罩着一切...', portrait: '📖' },
    ],
    order: 57,
  },
  {
    id: 'main_11_3',
    name: '四魔将',
    description: '击败镇守魔王城的四魔将',
    type: 'main',
    chapter: 11,
    icon: '💀',
    levelRequired: 28,
    prerequisites: ['main_11_2'],
    conditions: [
      { type: 'kill', target: 'enemy_four_demon_general', required: 4, description: '击败四魔将 ({current}/{required})' },
    ],
    rewards: { gold: 1200, exp: 1200 },
    startDialog: [
      { speaker: '魔将', text: '想见魔王大人？先过我们这一关！', portrait: '💀', position: 'left' },
    ],
    order: 58,
  },
  {
    id: 'main_11_4',
    name: '最终决战',
    description: '与魔王展开最终决战',
    type: 'main',
    chapter: 11,
    icon: '⚔️',
    levelRequired: 29,
    prerequisites: ['main_11_3'],
    conditions: [
      { type: 'kill', target: 'enemy_demon_king', required: 1, description: '击败魔王 ({current}/{required})' },
    ],
    rewards: {
      gold: 2000,
      exp: 2000,
      items: [
        { itemId: 'item_legend_treasure_box', count: 1 },
        { itemId: 'item_spirit_bead_complete', count: 1 },
      ],
    },
    startDialog: [
      { speaker: '魔王', text: '哈哈哈！愚蠢的人类，你们竟敢挑战本座！', portrait: '👹', position: 'left' },
      { speaker: '你', text: '今天就是你的末日！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '魔王', text: '不可能...本座怎么会败在凡人手中...！！！', portrait: '👹', position: 'left' },
      { speaker: '旁白', text: '魔王在光芒中消散，三界的危机终于解除...', portrait: '📖', effect: 'flash' },
    ],
    order: 59,
  },
  {
    id: 'main_11_5',
    name: '战后重建',
    description: '帮助西凉国重建，恢复和平',
    type: 'main',
    chapter: 11,
    icon: '🏘️',
    levelRequired: 29,
    prerequisites: ['main_11_4'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
      { type: 'collect', target: 'item_building_material', required: 20, description: '收集建材 ({current}/{required})' },
    ],
    rewards: { gold: 800, exp: 800 },
    startDialog: [
      { speaker: '清清', text: '感谢你拯救了西凉国...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '我们一起努力，重建家园。', portrait: '👤', position: 'right' },
    ],
    order: 60,
  },
  {
    id: 'main_11_6',
    name: '女王的抉择',
    description: '清清面临成为女王还是随你离开的选择',
    type: 'main',
    chapter: 11,
    icon: '👸',
    levelRequired: 30,
    prerequisites: ['main_11_5'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清深谈' },
    ],
    rewards: { gold: 1000, exp: 1000 },
    startDialog: [
      { speaker: '清清', text: '我...我不知道该怎么办。作为公主，我有责任留下来治理国家...', portrait: '👧', position: 'left' },
      { speaker: '清清', text: '但我又想...和你一起去看看这个世界...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '无论你做什么选择，我都支持你。', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '清清', text: '我想...让晓月帮我治理国家，等一切都稳定了...我就去找你！', portrait: '👧', position: 'left' },
      { speaker: '萧晓月', text: '没问题！本小姐一定能帮清清管好这个国家！', portrait: '👩', position: 'left' },
    ],
    order: 61,
  },

  // ===== 第十二章：西游新生 =====
  {
    id: 'main_12_1',
    name: '新的旅程',
    description: '告别西凉国，开始新的冒险',
    type: 'main',
    chapter: 12,
    icon: '🌅',
    levelRequired: 30,
    prerequisites: ['main_11_6'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清告别' },
      { type: 'visit_map', target: 'map_central_plains', required: 1, description: '返回中原' },
    ],
    rewards: { gold: 800, exp: 800 },
    startDialog: [
      { speaker: '清清', text: '你要走了吗？我会想你的...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '我会回来的，等我！', portrait: '👤', position: 'right' },
    ],
    order: 62,
  },
  {
    id: 'main_12_2',
    name: '重返长安',
    description: '回到长安城，物是人非',
    type: 'main',
    chapter: 12,
    icon: '🏯',
    levelRequired: 30,
    prerequisites: ['main_12_1'],
    conditions: [
      { type: 'visit_map', target: 'map_changan', required: 1, description: '返回长安城' },
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '与店小二叙旧' },
    ],
    rewards: { gold: 600, exp: 600 },
    startDialog: [
      { speaker: '店小二', text: '哎呀！是你！好久不见啊！', portrait: '🧑', position: 'left' },
      { speaker: '你', text: '小二哥，别来无恙？', portrait: '👤', position: 'right' },
    ],
    order: 63,
  },
  {
    id: 'main_12_3',
    name: '新的威胁',
    description: '听说东海出现了新的妖魔',
    type: 'main',
    chapter: 12,
    icon: '🌊',
    levelRequired: 31,
    prerequisites: ['main_12_2'],
    conditions: [
      { type: 'talk', target: 'npc_village_chief', required: 1, description: '与村长对话' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '村长', text: '年轻人！你终于回来了！东海那边又出了妖怪！', portrait: '👴', position: 'left' },
      { speaker: '你', text: '放心，交给我！', portrait: '👤', position: 'right' },
    ],
    order: 64,
  },
  {
    id: 'main_12_4',
    name: '龙宫探秘',
    description: '前往东海龙宫，调查妖魔来源',
    type: 'main',
    chapter: 12,
    icon: '🐉',
    levelRequired: 31,
    prerequisites: ['main_12_3'],
    conditions: [
      { type: 'visit_map', target: 'map_dragon_palace', required: 1, description: '进入龙宫' },
      { type: 'kill', target: 'enemy_sea_monster', required: 10, description: '击败海怪 ({current}/{required})' },
    ],
    rewards: { gold: 1000, exp: 1000 },
    startDialog: [
      { speaker: '旁白', text: '神秘的龙宫深处，似乎隐藏着更大的秘密...', portrait: '📖' },
    ],
    order: 65,
  },
  {
    id: 'main_12_5',
    name: '新的传说',
    description: '踏上新的征程，书写属于你的传说',
    type: 'main',
    chapter: 12,
    icon: '🌟',
    levelRequired: 32,
    prerequisites: ['main_12_4'],
    conditions: [
      { type: 'talk', target: 'npc_dragon_king', required: 1, description: '与龙王对话' },
    ],
    rewards: {
      gold: 2000,
      exp: 2000,
      items: [{ itemId: 'item_legendary_title', count: 1 }],
    },
    startDialog: [
      { speaker: '龙王', text: '年轻人，你战胜了魔王，拯救了三界。你的传说才刚刚开始...', portrait: '🐉', position: 'left' },
      { speaker: '龙王', text: '去吧，探索更广阔的世界，书写属于你的传奇！', portrait: '🐉', position: 'left' },
    ],
    completeDialog: [
      { speaker: '旁白', text: '你的冒险还在继续，前方有无数的挑战和机遇...', portrait: '📖' },
      { speaker: '旁白', text: '清清在西凉国等你，新的伙伴、新的敌人、新的传说...', portrait: '📖' },
      { speaker: '旁白', text: '【第一章主线任务到此结束，敬请期待后续更新！！！】', portrait: '📖', effect: 'flash' },
    ],
    order: 66,
  },

  // ===== 支线任务 =====
  {
    id: 'side_herb_collector',
    name: '草药收集者',
    description: '帮助药师收集10份草药',
    type: 'side',
    icon: '🌿',
    levelRequired: 2,
    conditions: [
      { type: 'collect', target: 'item_herb', required: 10, description: '收集草药 ({current}/{required})' },
    ],
    rewards: {
      gold: 200,
      exp: 100,
      items: [
        { itemId: 'item_hp_potion_small', count: 5 },
        { itemId: 'item_mp_potion_small', count: 3 },
      ],
    },
    hints: ['草药可以通过战斗掉落或在地图上采集获得'],
    order: 100,
  },
  {
    id: 'side_monster_hunter',
    name: '怪物猎人',
    description: '累计击败50只怪物',
    type: 'side',
    icon: '🎯',
    levelRequired: 3,
    conditions: [
      { type: 'kill', target: 'any', required: 50, description: '击败任意怪物 ({current}/{required})' },
    ],
    rewards: {
      gold: 500,
      exp: 300,
      items: [
        { itemId: 'item_enhance_stone', count: 3 },
        { itemId: 'item_exp_pill_small', count: 2 },
      ],
    },
    hints: ['持续战斗可以积累击杀数'],
    order: 101,
  },
  {
    id: 'side_explorer',
    name: '探索者',
    description: '访问5个不同的地图区域',
    type: 'side',
    icon: '🗺️',
    levelRequired: 3,
    conditions: [
      { type: 'visit_map', target: 'any', required: 5, description: '访问不同区域 ({current}/{required})' },
    ],
    rewards: {
      gold: 300,
      exp: 200,
      unlocks: { features: ['teleport'] },
      items: [{ itemId: 'item_gold_bag_medium', count: 1 }],
    },
    hints: ['通过地图界面探索新的区域'],
    order: 102,
  },
  {
    id: 'side_material_collector',
    name: '材料收集者',
    description: '收集20个任意材料',
    type: 'side',
    icon: '📦',
    levelRequired: 5,
    conditions: [
      { type: 'collect', target: 'any_material', required: 20, description: '收集材料 ({current}/{required})' },
    ],
    rewards: {
      gold: 400,
      exp: 250,
      items: [
        { itemId: 'item_reforge_stone', count: 2 },
        { itemId: 'item_treasure_box_bronze', count: 1 },
      ],
    },
    hints: ['材料可以从怪物掉落或采集获得'],
    order: 103,
  },
  {
    id: 'side_gem_hunter',
    name: '宝石猎人',
    description: '获得5颗宝石',
    type: 'side',
    icon: '💎',
    levelRequired: 10,
    conditions: [
      { type: 'collect', target: 'any_gem', required: 5, description: '获得宝石 ({current}/{required})' },
    ],
    rewards: {
      gold: 800,
      exp: 500,
      items: [
        { itemId: 'item_enhance_stone_advanced', count: 3 },
        { itemId: 'item_treasure_box_silver', count: 1 },
      ],
    },
    hints: ['宝石可以从Boss掉落或合成获得'],
    order: 104,
  },

  // ===== 日常任务 =====
  {
    id: 'daily_kill_monsters',
    name: '日常狩猎',
    description: '每日击败10只怪物',
    type: 'daily',
    icon: '🗡️',
    levelRequired: 1,
    conditions: [
      { type: 'kill', target: 'any', required: 10, description: '击败任意怪物 ({current}/{required})' },
    ],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_hp_potion_small', count: 2 }],
    },
    hints: ['每天都可以完成一次'],
    order: 200,
  },
  {
    id: 'daily_battle_3',
    name: '日常战斗',
    description: '每日完成3场战斗',
    type: 'daily',
    icon: '⚔️',
    levelRequired: 1,
    conditions: [
      { type: 'battle', target: 'any', required: 3, description: '完成战斗 ({current}/{required})' },
    ],
    rewards: {
      gold: 80,
      exp: 40,
      items: [{ itemId: 'item_exp_pill_small', count: 1 }],
    },
    order: 201,
  },
  {
    id: 'daily_boss_challenge',
    name: '日常Boss挑战',
    description: '每日挑战一次Boss',
    type: 'daily',
    icon: '👹',
    levelRequired: 5,
    conditions: [
      { type: 'kill', target: 'boss', required: 1, description: '击败Boss ({current}/{required})' },
    ],
    rewards: {
      gold: 200,
      exp: 100,
      items: [
        { itemId: 'item_enhance_stone', count: 1 },
        { itemId: 'item_gold_bag_small', count: 1 },
      ],
    },
    order: 202,
  },
  {
    id: 'daily_herb_gathering',
    name: '日常采药',
    description: '每日收集5份草药',
    type: 'daily',
    icon: '🌿',
    levelRequired: 2,
    conditions: [
      { type: 'collect', target: 'item_herb', required: 5, description: '收集草药 ({current}/{required})' },
    ],
    rewards: {
      gold: 80,
      exp: 40,
      items: [{ itemId: 'item_hp_potion_small', count: 3 }],
    },
    order: 203,
  },
  {
    id: 'daily_capture_training',
    name: '精英狩猎',
    description: '每日击败5只精英怪物',
    type: 'daily',
    icon: '⚔️',
    levelRequired: 5,
    conditions: [
      { type: 'kill', target: 'elite', required: 5, description: '击败精英怪物 ({current}/{required})' },
    ],
    rewards: {
      gold: 150,
      exp: 80,
      items: [{ itemId: 'item_enhance_stone', count: 2 }],
    },
    order: 204,
  },
  {
    id: 'daily_gold_earning',
    name: '日常赚钱',
    description: '每日通过战斗获得500金币',
    type: 'daily',
    icon: '💰',
    levelRequired: 3,
    conditions: [
      { type: 'collect', target: 'gold', required: 500, description: '获得金币 ({current}/{required})' },
    ],
    rewards: {
      gold: 200,
      exp: 60,
      items: [{ itemId: 'item_gold_bag_medium', count: 1 }],
    },
    hints: ['通过战斗和出售物品获得金币'],
    order: 205,
  },
  {
    id: 'daily_material_collect',
    name: '日常材料收集',
    description: '每日收集10个任意材料',
    type: 'daily',
    icon: '📦',
    levelRequired: 3,
    conditions: [
      { type: 'collect', target: 'any_material', required: 10, description: '收集材料 ({current}/{required})' },
    ],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_reforge_stone', count: 1 }],
    },
    order: 206,
  },
  {
    id: 'daily_exp_training',
    name: '日常修行',
    description: '每日获得500经验值',
    type: 'daily',
    icon: '📚',
    levelRequired: 5,
    conditions: [
      { type: 'collect', target: 'exp', required: 500, description: '获得经验值 ({current}/{required})' },
    ],
    rewards: {
      gold: 150,
      exp: 100,
      items: [{ itemId: 'item_exp_pill_small', count: 2 }],
    },
    order: 207,
  },
  {
    id: 'daily_dungeon_explore',
    name: '日常副本探索',
    description: '每日完成一次副本',
    type: 'daily',
    icon: '🗺️',
    levelRequired: 8,
    conditions: [
      { type: 'dungeon', target: 'any', required: 1, description: '完成副本 ({current}/{required})' },
    ],
    rewards: {
      gold: 300,
      exp: 150,
      items: [{ itemId: 'item_treasure_box_bronze', count: 1 }],
    },
    order: 208,
  },
  {
    id: 'daily_gem_collect',
    name: '日常宝石收集',
    description: '每日获得2颗宝石',
    type: 'daily',
    icon: '💎',
    levelRequired: 10,
    conditions: [
      { type: 'collect', target: 'any_gem', required: 2, description: '获得宝石 ({current}/{required})' },
    ],
    rewards: {
      gold: 200,
      exp: 100,
      items: [{ itemId: 'item_gem_chest', count: 1 }],
    },
    order: 209,
  },
  {
    id: 'daily_pet_training',
    name: '宠物日常训练',
    description: '带着宠物战斗5次',
    type: 'daily',
    icon: '🐾',
    levelRequired: 5,
    conditions: [
      { type: 'battle', target: 'with_pet', required: 5, description: '带宠物战斗 ({current}/{required})' },
    ],
    rewards: {
      gold: 120,
      exp: 60,
      items: [{ itemId: 'item_pet_food', count: 3 }],
    },
    order: 210,
  },
  {
    id: 'daily_skill_practice',
    name: '技能日常练习',
    description: '在战斗中使用技能20次',
    type: 'daily',
    icon: '🎯',
    levelRequired: 5,
    conditions: [
      { type: 'skill_use', target: 'any', required: 20, description: '使用技能 ({current}/{required})' },
    ],
    rewards: {
      gold: 100,
      exp: 80,
      items: [{ itemId: 'item_mp_potion_small', count: 3 }],
    },
    order: 211,
  },
  {
    id: 'daily_map_explore',
    name: '日常探索',
    description: '每日访问3个不同的地图',
    type: 'daily',
    icon: '🧭',
    levelRequired: 3,
    conditions: [
      { type: 'visit_map', target: 'any', required: 3, description: '访问地图 ({current}/{required})' },
    ],
    rewards: {
      gold: 100,
      exp: 60,
    },
    order: 212,
  },
  {
    id: 'daily_equipment_enhance',
    name: '装备日常强化',
    description: '每日强化1件装备',
    type: 'daily',
    icon: '🔨',
    levelRequired: 8,
    conditions: [
      { type: 'enhance', target: 'equipment', required: 1, description: '强化装备 ({current}/{required})' },
    ],
    rewards: {
      gold: 150,
      exp: 80,
      items: [{ itemId: 'item_enhance_stone', count: 2 }],
    },
    order: 213,
  },
  {
    id: 'daily_arena_challenge',
    name: '竞技场日常',
    description: '每日进行3次竞技场挑战',
    type: 'daily',
    icon: '🏟️',
    levelRequired: 10,
    conditions: [
      { type: 'arena', target: 'any', required: 3, description: '竞技场挑战 ({current}/{required})' },
    ],
    rewards: {
      gold: 250,
      exp: 120,
      items: [{ itemId: 'item_arena_token', count: 5 }],
    },
    order: 214,
  },
  {
    id: 'daily_companion_gift',
    name: '伙伴日常关怀',
    description: '每日送给伙伴3件礼物',
    type: 'daily',
    icon: '🎁',
    levelRequired: 5,
    conditions: [
      { type: 'gift', target: 'companion', required: 3, description: '送礼物 ({current}/{required})' },
    ],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_affinity_potion', count: 1 }],
    },
    order: 215,
  },
  {
    id: 'daily_fishing',
    name: '日常钓鱼',
    description: '每日钓鱼5次',
    type: 'daily',
    icon: '🎣',
    levelRequired: 3,
    conditions: [
      { type: 'fish', target: 'any', required: 5, description: '钓鱼 ({current}/{required})' },
    ],
    rewards: {
      gold: 80,
      exp: 40,
      items: [{ itemId: 'item_fish_chest', count: 1 }],
    },
    hints: ['在水边可以钓鱼'],
    order: 216,
  },
];

/** 任务类型配置 */
export const QUEST_TYPE_CONFIG = {
  main: {
    name: '主线任务',
    icon: '📜',
    color: '#FFD700',
    description: '推动剧情发展的核心任务',
  },
  side: {
    name: '支线任务',
    icon: '📋',
    color: '#4CAF50',
    description: '额外的挑战和奖励',
  },
  daily: {
    name: '日常任务',
    icon: '🔄',
    color: '#2196F3',
    description: '每日可重复完成的任务',
  },
} as const;

/** 根据ID获取任务 */
export function getQuest(questId: string): Quest | undefined {
  return QUESTS.find((q) => q.id === questId);
}

/** 获取章节信息 */
export function getChapter(chapterId: number): QuestChapter | undefined {
  return QUEST_CHAPTERS.find((c) => c.id === chapterId);
}

/** 获取指定类型的任务 */
export function getQuestsByType(type: Quest['type']): Quest[] {
  return QUESTS.filter((q) => q.type === type);
}

/** 获取指定章节的任务 */
export function getQuestsByChapter(chapterId: number): Quest[] {
  return QUESTS.filter((q) => q.chapter === chapterId);
}

/** 获取可接取的任务 */
export function getAvailableQuests(
  completedQuestIds: string[],
  playerLevel: number
): Quest[] {
  return QUESTS.filter((quest) => {
    // 已完成的任务不再显示
    if (completedQuestIds.includes(quest.id)) return false;

    // 检查等级要求
    if (quest.levelRequired && playerLevel < quest.levelRequired) return false;

    // 检查前置任务
    if (quest.prerequisites) {
      const hasAllPrereqs = quest.prerequisites.every((prereq) =>
        completedQuestIds.includes(prereq)
      );
      if (!hasAllPrereqs) return false;
    }

    return true;
  });
}

/** 获取日常任务列表 */
export function getDailyQuests(): Quest[] {
  return QUESTS.filter((q) => q.type === 'daily');
}

/** 获取主线任务总数 */
export function getMainQuestCount(): number {
  return QUESTS.filter((q) => q.type === 'main').length;
}

/** 获取章节总数 */
export function getChapterCount(): number {
  return QUEST_CHAPTERS.length;
}
