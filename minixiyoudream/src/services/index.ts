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
// 修复: 添加缺失的 saveService 和 companionEquipService 导出
export { saveService } from './saveService';
export type { SaveResult, LoadResult, SaveInfo } from './saveService';
export { companionEquipService } from './companionEquipService';
export type { EquipResult } from './companionEquipService';
