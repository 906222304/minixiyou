// 游戏主布局组件 - 迷你西游梦风格

import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  player,
  playerHp,
  playerMp,
  playerMaxHp,
  playerMaxMp,
  playerGold,
  playerLevel,
  currentPage,
  showSidebar,
  toggleSidebar,
  closeSidebar,
  navigateTo,
  type Page,
} from '@/signals';
import { gamePhase } from '@/signals/gameSignals';
import { initQuests, isQuestInitialized } from '@/signals/questSignals';
import { InventoryPage } from '@/components/inventory';
import { PetPage } from '@/components/pet';
import { CompanionPage } from '@/components/companion';
import { MapPage } from '@/components/map';
import { DungeonPage } from '@/components/dungeon';
import { CharacterPage } from '@/components/character/CharacterPage';
import { CultivationPage } from '@/components/cultivation';
import { AchievementPage } from '@/components/achievement';
import { QuestPage, QuestHint, QuestHintInline, QuestDialog } from '@/components/quest';
import { getMap } from '@/constants/maps';

// 迷你西游梦风格图标
const Icons = {
  home: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.84L19 12h-1v7h-3v-6H9v6H6v-7H5l7-7.16z"/>
    </svg>
  ),
  inventory: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
    </svg>
  ),
  pet: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  map: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
  ),
  companion: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  dungeon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  ),
  battle: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.92 5H5l6 6 1-1zm13.8 8.1l-1.41 1.41-3.54-3.54-1.41 1.41 3.54 3.54-1.41 1.41-3.54-3.54-1.42 1.42 3.54 3.54-1.41 1.41-4.95-4.95L4.93 17c-1.56 1.56-1.56 4.1 0 5.66l.7.7 5.66-5.66 5.66 5.66.7-.7c1.56-1.56 1.56-4.1 0-5.66l-.71-.71 3.54-3.54c.78-.78.78-2.05 0-2.83-.77-.78-2.05-.78-2.82 0z"/>
    </svg>
  ),
  more: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
};

const NAV_ITEMS: { page: Page; icon: React.ReactNode; label: string; emoji: string }[] = [
  { page: 'home', icon: Icons.home, label: '首页', emoji: '🏠' },
  { page: 'character', icon: Icons.home, label: '人物', emoji: '👤' },
  { page: 'inventory', icon: Icons.inventory, label: '背包', emoji: '🎒' },
  { page: 'pet', icon: Icons.pet, label: '宠物', emoji: '🐉' },
  { page: 'map', icon: Icons.map, label: '地图', emoji: '🗺️' },
  { page: 'companion', icon: Icons.companion, label: '伙伴', emoji: '👥' },
  { page: 'dungeon', icon: Icons.dungeon, label: '副本', emoji: '🏰' },
  { page: 'cultivation', icon: Icons.settings, label: '修炼', emoji: '🧘' },
  { page: 'achievement', icon: Icons.settings, label: '成就', emoji: '🏆' },
  { page: 'quest', icon: Icons.settings, label: '任务', emoji: '📜' },
];

export function GameLayout() {
  useSignals();

  const currentPlayer = player.value;
  const hp = playerHp.value;
  const mp = playerMp.value;
  const maxHp = playerMaxHp.value;
  const maxMp = playerMaxMp.value;
  const gold = playerGold.value;
  const level = playerLevel.value;
  const page = currentPage.value;
  const sidebarOpen = showSidebar.value;
  const questInitialized = isQuestInitialized.value;

  // 初始化任务系统
  useEffect(() => {
    if (currentPlayer && !questInitialized) {
      initQuests(currentPlayer.id, currentPlayer.level);
    }
  }, [currentPlayer?.id, questInitialized]);

  if (!currentPlayer) return null;

  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (mp / maxMp) * 100));

  return (
    <div className="min-h-screen text-[var(--game-text)] flex flex-col">
      {/* 小清新背景层 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 渐变背景 - 清新明亮 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e3f2fd] via-[#f5faff] to-[#fff8f0]" />
        {/* 云朵装饰 */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-16 h-8 bg-white rounded-full top-[8%] left-[10%] blur-sm" />
          <div className="absolute w-20 h-10 bg-white rounded-full top-[12%] left-[70%] blur-sm" />
          <div className="absolute w-24 h-12 bg-white rounded-full top-[25%] left-[30%] blur-sm" />
        </div>
        {/* 柔和光晕 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[var(--game-gold)]/10 rounded-full blur-[80px]" />
      </div>

      {/* 顶部状态栏 */}
      <header className="sticky top-0 z-20 px-4 py-3">
        <div className="game-panel px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：菜单 + 玩家信息 */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--game-bg-hover)] rounded-lg transition-colors cursor-pointer text-[var(--game-text-muted)] hover:text-[var(--game-text)]"
                aria-label="打开菜单"
              >
                {Icons.menu}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--game-gold)]/20 to-white/50 border border-[var(--game-gold)]/30 flex items-center justify-center text-lg shadow-sm">
                  👤
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[var(--game-text)]">{currentPlayer.name}</span>
                  <span className="text-xs text-[var(--game-text-muted)]">Lv.{level}</span>
                </div>
              </div>
            </div>

            {/* 右侧：金币 */}
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-[var(--game-border)] shadow-sm">
              <span className="text-lg">💰</span>
              <span className="text-sm font-semibold text-[var(--game-gold-dark)]">{gold.toLocaleString()}</span>
            </div>
          </div>

          {/* HP/MP 状态条 */}
          <div className="mt-3 space-y-2">
            {/* HP */}
            <div className="flex items-center gap-3">
              <span className="text-sm">❤️</span>
              <div className="flex-1 game-progress game-progress-hp" style={{height: '10px'}}>
                <div className="game-progress-fill" style={{ width: `${hpPercent}%` }} />
              </div>
              <span className="text-xs text-[var(--game-text-muted)] w-20 text-right">{hp}/{maxHp}</span>
            </div>

            {/* MP */}
            <div className="flex items-center gap-3">
              <span className="text-sm">💙</span>
              <div className="flex-1 game-progress game-progress-mp" style={{height: '10px'}}>
                <div className="game-progress-fill" style={{ width: `${mpPercent}%` }} />
              </div>
              <span className="text-xs text-[var(--game-text-muted)] w-20 text-right">{mp}/{maxMp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      {sidebarOpen && (
        <>
          {/* 遮罩层 - 小清新风格 */}
          <div
            className="fixed inset-0 bg-[#2c3e50]/30 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* 侧边栏内容 */}
          <div className="fixed left-0 top-0 bottom-0 w-72 z-40">
            <div className="h-full game-panel rounded-none rounded-r-2xl p-5 flex flex-col">
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--game-gold)] flex items-center gap-2">
                  <span>📜</span>
                  <span>菜单</span>
                </h2>
                <button
                  onClick={closeSidebar}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[var(--game-bg-hover)] rounded-lg transition-colors cursor-pointer text-[var(--game-text-muted)] hover:text-[var(--game-text)]"
                  aria-label="关闭菜单"
                >
                  {Icons.close}
                </button>
              </div>

              {/* 导航项 */}
              <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => navigateTo(item.page)}
                    className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                      page === item.page
                        ? 'bg-[var(--game-gold)]/15 border border-[var(--game-gold)]/30 text-[var(--game-gold-dark)]'
                        : 'hover:bg-[var(--game-bg-hover)] text-[var(--game-text-muted)] hover:text-[var(--game-text)] border border-transparent'
                    }`}
                  >
                    <span className="text-xl w-8 text-center">{item.emoji}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* 底部设置按钮 */}
              <div className="pt-4 border-t border-[var(--game-border)]">
                <button
                  onClick={() => {
                    closeSidebar();
                  }}
                  className="w-full p-3 hover:bg-[var(--game-bg-hover)] rounded-lg text-left flex items-center gap-3 transition-colors cursor-pointer text-[var(--game-text-muted)] hover:text-[var(--game-text)]"
                >
                  <span className="text-xl w-8 text-center">⚙️</span>
                  <span className="font-medium">设置</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 p-4 overflow-auto pb-28 relative z-10">
        {page === 'home' && (
          <div className="space-y-5">
            {/* 欢迎信息 + 任务栏 */}
            <div className="game-panel p-4">
              <div className="flex items-center justify-between">
                {/* 左侧：欢迎信息 */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👋</span>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--game-gold)]">
                      欢迎回来，{currentPlayer.name}！
                    </h2>
                    <p className="text-sm text-[var(--game-text-muted)]">
                      你现在位于 <span className="text-[#60a5fa]">{getMap(currentPlayer.currentMapId)?.name ?? currentPlayer.currentMapId}</span>
                    </p>
                  </div>
                </div>
                {/* 右侧：任务栏 */}
                <QuestHintInline />
              </div>
            </div>

            {/* 战斗按钮 */}
            <button
              onClick={() => gamePhase.value = 'battle'}
              className="game-btn game-btn-danger w-full py-5"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚔️</span>
                <div className="text-left">
                  <div className="font-bold text-lg">开始战斗</div>
                  <div className="text-sm opacity-80">探索未知，挑战强敌</div>
                </div>
              </div>
            </button>

            {/* 功能网格 */}
            <div className="grid grid-cols-2 gap-3">
              {NAV_ITEMS.slice(1).map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigateTo(item.page)}
                  className="game-card p-4 flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-sm font-semibold text-[var(--game-text)]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {page === 'inventory' && (
          <div>
            <InventoryPage />
          </div>
        )}

        {page === 'character' && <CharacterPage />}

        {page === 'pet' && <PetPage />}

        {page === 'map' && <MapPage />}

        {page === 'companion' && <CompanionPage />}

        {page === 'dungeon' && <DungeonPage />}

        {page === 'cultivation' && <CultivationPage />}

        {page === 'achievement' && <AchievementPage />}

        {page === 'quest' && <QuestPage />}
      </main>

      {/* 常驻任务提示 */}
      <QuestHint />

      {/* 底部导航 */}
      <nav className="fixed bottom-4 left-4 right-4 z-20">
        <div className="game-panel px-3 py-2">
          <div className="flex justify-around items-center">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] min-h-[56px] justify-center transition-all duration-200 cursor-pointer ${
                  page === item.page
                    ? 'text-[var(--game-gold-dark)]'
                    : 'text-[var(--game-text-muted)] hover:text-[var(--game-text)]'
                }`}
                aria-label={item.label}
                aria-current={page === item.page ? 'page' : undefined}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={toggleSidebar}
              className="flex flex-col items-center p-2 rounded-lg min-w-[56px] min-h-[56px] justify-center text-[var(--game-text-muted)] hover:text-[var(--game-text)] transition-colors cursor-pointer"
              aria-label="更多菜单"
            >
              <span className="text-2xl">📋</span>
              <span className="text-xs mt-1 font-medium">更多</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 任务对话弹窗 */}
      <QuestDialog fullscreen />
    </div>
  );
}
