// 状态管理统一导出

// 游戏全局状态
export {
  gamePhase,
  gameSeed,
  gameTime,
  isPlaying,
  type GamePhase,
} from './gameSignals';

// 玩家状态
export {
  player,
  isPlayerCreated,
  playerLevel,
  playerHp,
  playerMp,
  playerMaxHp,
  playerMaxMp,
  playerHpPercent,
  playerMpPercent,
  playerGold,
  playerPosition,
  createPlayer,
  updatePlayerHp,
  updatePlayerMp,
  updatePlayerGold,
  updatePlayerPosition,
  addPlayerExp,
} from './playerSignals';

// 伙伴状态
export {
  companions,
  activeCompanions,
  activeBonds,
  bondBonuses,
  unlockCompanion,
  setCompanionActive,
  increaseFavorability,
  getCompanion,
  canUnlockCompanion,
} from './companionSignals';

// 战斗状态
export {
  battleState,
  isInBattle as isBattleActive,
  currentRound,
  battleSpeed,
  isAutoBattle,
  currentActorIndex,
  playerFormation,
  enemies,
  actionQueue,
  isBattleEnded,
  battleResult,
  startBattle,
  executeAction,
  endBattle,
  clearBattle,
  nextRound,
} from './battleSignals';

// UI状态
export {
  currentPage,
  showSidebar,
  isLoading,
  loadingText,
  toastMessage,
  toastType,
  showModal,
  modalContent,
  navigateTo,
  toggleSidebar,
  closeSidebar,
  showLoading,
  hideLoading,
  showToast,
  showSuccess,
  showError,
  showConfirm,
  closeModal,
  confirmModal,
  cancelModal,
  type Page,
} from './uiSignals';

// 背包状态
export {
  inventoryItems,
  inventoryEquipments,
  equippedSlots,
  maxInventorySlots,
  itemCount,
  equipmentCount,
  isInventoryFull,
  addItem,
  removeItem,
  addEquipment,
  removeEquipment,
  equipItem,
  unequipItem,
  getEquipmentStats,
  clearInventory,
} from './inventorySignals';

// 宠物状态
export {
  playerPets,
  activePet,
  petCount,
  maxPets,
  createPet,
  addPet,
  removePet,
  setActivePet,
  unsetActivePet,
  addPetExp,
  restorePet,
  renamePet,
  clearPets,
} from './petSignals';
