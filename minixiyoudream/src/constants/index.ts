// 常量配置统一导出

// 种族
export * from './races';

// 门派
export * from './factions';

// 特性
export * from './traits';

// 技能
export * from './skills';

// 经验表
export * from './expTable';

// 计算公式
export * from './formulas';

// 宠物
export * from './pets';

// 伙伴
export * from './companions';

// 地图
export * from './maps';

// 敌人
export * from './enemies';

// 副本
export * from './dungeons';

// 词条
export * from './affixes';

// 洗练
export * from './reforge';

// 强化
export * from './enhancement';

// 技能书
export * from './skillBooks';

// 修炼
export * from './cultivation';

// 阵法
export * from './formations';

// 传送点
export * from './teleports';

// 合宠
export * from './petFusion';

// 成就
export * from './achievements';

// 任务
export * from './quests';

// 宝石
export * from './gems';

// 物品
export * from './items';

// 装备
export * from './equipment';

// 装备特效和特技
export * from './equipmentEffects';

// 装备套装
export * from './equipmentSets';

// 新套装系统（四圣兽+麒麟）- 使用命名导出避免冲突
export {
  QINGLONG_SET,
  BAIHU_SET,
  ZHUQUE_SET,
  XUANWU_SET,
  QILIN_SET,
  getSetQualityColor as getNewSetQualityColor,
} from './sets';

// 宠物成长
export * from './petGrowth';

// 宠物捕捉
export * from './petCapture';

// 宠物进化
export * from './petEvolution';

// 图标配置
export * from './iconConfig';

// 商店
export * from './shops';

// 宠物技能槽配置
export {
  PET_SKILL_SLOT_CONFIG,
  SKILL_SLOT_UNLOCK_CONFIG,
  SKILL_LOCK_CONFIG,
  getPetSkillSlotConfig,
  getInitialSkillSlots,
  getMaxSkillSlots,
  getSkillSlotUnlockConfig,
  canUnlockSlotByLevel,
  needsItemUnlock,
  getSlotUnlockItem,
  getSlotUnlockGoldCost,
  getAllSlotUnlockItems,
  getAvailableSkillSlots as getPetAvailableSkillSlots,
} from './petSkillSlots';

// 兽诀配置
export * from './beastScrolls';
