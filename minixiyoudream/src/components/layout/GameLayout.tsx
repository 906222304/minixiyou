// 游戏主布局组件 - UI/UX Pro Max 重设计

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
import { InventoryPage } from '@/components/inventory';
import { PetPage } from '@/components/pet';
import { CompanionPage } from '@/components/companion';
import { MapPage } from '@/components/map';
import { DungeonPage } from '@/components/dungeon';

// SVG Icons - 替代 emoji，使用 Heroicons 风格
const Icons = {
  home: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  inventory: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  pet: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  ),
  map: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  companion: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  dungeon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  battle: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  more: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const NAV_ITEMS: { page: Page; icon: React.ReactNode; label: string }[] = [
  { page: 'home', icon: Icons.home, label: '首页' },
  { page: 'inventory', icon: Icons.inventory, label: '背包' },
  { page: 'pet', icon: Icons.pet, label: '宠物' },
  { page: 'map', icon: Icons.map, label: '地图' },
  { page: 'companion', icon: Icons.companion, label: '伙伴' },
  { page: 'dungeon', icon: Icons.dungeon, label: '副本' },
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

  if (!currentPlayer) return null;

  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (mp / maxMp) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* 顶部状态栏 - 浮动卡片设计 */}
      <header className="sticky top-0 z-20 px-4 py-3">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：菜单 + 玩家信息 */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2.5 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 cursor-pointer touch-manipulation"
                aria-label="打开菜单"
              >
                {Icons.menu}
              </button>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{currentPlayer.name}</span>
                <span className="text-xs text-slate-400">Lv.{level}</span>
              </div>
            </div>

            {/* 右侧：金币 */}
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-xl">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-sm font-medium text-yellow-400">{gold.toLocaleString()}</span>
            </div>
          </div>

          {/* HP/MP 状态条 */}
          <div className="mt-3 space-y-2">
            {/* HP */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-red-400 w-6">HP</span>
              <div className="flex-1 h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-20 text-right">{hp}/{maxHp}</span>
            </div>

            {/* MP */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-blue-400 w-6">MP</span>
              <div className="flex-1 h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-20 text-right">{mp}/{maxMp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      {sidebarOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* 侧边栏内容 */}
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-slate-800/95 backdrop-blur-md z-40 shadow-2xl">
            <div className="p-6 h-full flex flex-col">
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">菜单</h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 cursor-pointer"
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
                    className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-200 cursor-pointer touch-manipulation ${
                      page === item.page
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className={`${page === item.page ? 'text-white' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* 底部设置按钮 */}
              <div className="pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    // TODO: 实现设置页面
                    closeSidebar();
                  }}
                  className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left flex items-center gap-4 transition-colors duration-200 cursor-pointer touch-manipulation text-slate-300 hover:text-white"
                >
                  <span className="text-slate-400">{Icons.settings}</span>
                  <span className="font-medium">设置</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 p-4 overflow-auto pb-24">
        {page === 'home' && (
          <div className="space-y-4">
            {/* 欢迎卡片 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
              <h2 className="text-lg font-semibold text-white mb-2">
                欢迎回来，{currentPlayer.name}！
              </h2>
              <p className="text-slate-400 text-sm">
                你现在位于 <span className="text-indigo-400">{currentPlayer.currentMapId}</span>
              </p>
            </div>

            {/* 战斗按钮 - 突出显示 */}
            <button
              onClick={() => gamePhase.value = 'battle'}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-2xl p-6 shadow-lg shadow-red-500/20 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="text-red-100">{Icons.battle}</span>
                <div className="text-left">
                  <div className="font-semibold text-lg">开始战斗</div>
                  <div className="text-sm text-red-100/80">探索未知，挑战强敌</div>
                </div>
              </div>
            </button>

            {/* 功能网格 */}
            <div className="grid grid-cols-2 gap-3">
              {NAV_ITEMS.slice(1).map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigateTo(item.page)}
                  className="bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 p-5 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-indigo-400">{item.icon}</span>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {page === 'inventory' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">背包</h2>
            <InventoryPage />
          </div>
        )}

        {page === 'pet' && <PetPage />}

        {page === 'map' && <MapPage />}

        {page === 'companion' && <CompanionPage />}

        {page === 'dungeon' && <DungeonPage />}
      </main>

      {/* 底部导航 - 浮动设计 */}
      <nav className="fixed bottom-4 left-4 right-4 z-20">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 px-2 py-2">
          <div className="flex justify-around items-center">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`flex flex-col items-center p-3 rounded-xl min-w-[56px] min-h-[56px] justify-center transition-all duration-200 cursor-pointer touch-manipulation ${
                  page === item.page
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                aria-label={item.label}
                aria-current={page === item.page ? 'page' : undefined}
              >
                <span className="transition-transform duration-200">{item.icon}</span>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={toggleSidebar}
              className="flex flex-col items-center p-3 rounded-xl min-w-[56px] min-h-[56px] justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 cursor-pointer touch-manipulation"
              aria-label="更多菜单"
            >
              {Icons.more}
              <span className="text-xs mt-1 font-medium">更多</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
