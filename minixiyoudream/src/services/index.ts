// 服务统一导出

export { affixService } from './affixService';
export { enhancementService } from './enhancementService';
export { petSkillService } from './petSkillService';
export { petFusionService } from './petFusionService';
export { cultivationService } from './cultivationService';
export { formationService } from './formationService';
export {
  teleportService,
  unlockedTeleports,
  allTeleports,
  unlockedTeleportDetails,
  availableTeleports,
} from './teleportService';
export { achievementService } from './achievementService';
export {
  mapService,
  currentMap,
  DIRECTION_NAMES,
  DIRECTION_ICONS,
} from './mapService';
export {
  encounterService,
  stepCount,
  lastEncounterStep,
  getMapEncounterInfo,
  getEncounterRateDescription,
  tryMoveAndEncounter,
} from './encounterService';
export type { EncounterInfo } from './encounterService';
// 修复: 添加缺失的 saveService 和 companionEquipService 导出
export { saveService } from './saveService';
export type { SaveResult, LoadResult, SaveInfo } from './saveService';
export { companionEquipService } from './companionEquipService';
export type { EquipResult } from './companionEquipService';
export { beastScrollService } from './beastScrollService';
export type {
  LearnBeastScrollResult,
  LockSkillResult,
  UnlockSkillResult,
  UnlockSlotResult,
  ForgetSkillResult,
  RestrictionCheckResult,
} from './beastScrollService';
export { questService } from './questService';
export type { QuestData } from './questService';
export { gemService } from './gemService';
export type {
  SocketResult,
  RemoveResult,
  SynthesizeResult,
  SocketCheckResult,
  SynthesizePreview,
} from './gemService';
export { dungeonService } from './dungeonService';
export type { DungeonRunState } from './dungeonService';
export { petService } from './petService';
export type { PRNG } from './petService';
export { skillBookService } from './skillBookService';
export {
  equipmentService,
  // 分解系统
  decomposeEquipment,
  calculateDecomposeResult,
  // 重铸系统
  reforgeEquipment,
  calculateReforgeCost,
  // 传承系统
  transferEnhancement,
  calculateTransferCost,
  // 强化检查
  canEnhanceWithProtection,
} from './equipmentService';
export type {
  DecomposeResult,
  DecomposeMaterial,
  ReforgeResult,
  TransferResult,
} from './equipmentService';
export {
  // 商店功能
  currentShopId,
  isShopOpen,
  openShop,
  closeShop,
  getCurrentShopItems,
  buyItem,
  sellItem,
  // 治疗功能
  healPlayer,
  calculateHealCost,
  // 传送功能
  teleportToMap,
  getTeleportDestinationInfo,
} from './npcService';
export type { BuyResult, SellResult, HealResult, TeleportResult } from './npcService';
export {
  applyTraitBonuses,
  applyTraitElementResistances,
  getTraitSpecialEffects,
  hasTraitEffect,
  getTraitEffectValue,
} from './traitService';
