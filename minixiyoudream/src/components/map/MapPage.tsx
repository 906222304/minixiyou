// 地图页面组件 - 完整的地图导航系统

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CurrentMapInfo } from './CurrentMapInfo';
import { AdjacentMaps } from './AdjacentMaps';
import { RegionMapView } from './RegionMapView';
import { TeleportPanel } from './TeleportPanel';

type TabType = 'navigate' | 'teleport' | 'region';

export function MapPage() {
  useSignals();

  const [activeTab, setActiveTab] = useState<TabType>('navigate');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'navigate', label: '移动', icon: '🚶' },
    { id: 'teleport', label: '传送', icon: '✨' },
    { id: 'region', label: '区域', icon: '🗺️' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--game-gold-dark)] flex items-center gap-2">
        <span>🗺️</span>
        <span>地图导航</span>
      </h2>

      {/* 当前位置信息 */}
      <CurrentMapInfo />

      {/* Tab切换 */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--game-gold)]/20 text-[var(--game-gold-dark)] border border-[var(--game-gold)]/40'
                : 'bg-white/50 text-[var(--game-text-muted)] hover:bg-white/70 border border-transparent'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab内容 */}
      <div className="min-h-[300px]">
        {activeTab === 'navigate' && (
          <div className="space-y-4">
            {/* 相邻地图导航 */}
            <AdjacentMaps />

            {/* 使用说明 */}
            <div className="game-panel p-3 text-xs text-[var(--game-text-muted)]">
              <div className="flex items-start gap-2">
                <span>💡</span>
                <div>
                  <p className="font-medium text-[var(--game-text)] mb-1">移动提示</p>
                  <p>步行移动只能到达相邻的地图。传送到远处请使用"传送"功能。</p>
                  <p className="mt-1">首次到达新地图时，会自动解锁该地图的传送点。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teleport' && (
          <TeleportPanel />
        )}

        {activeTab === 'region' && (
          <RegionMapView />
        )}
      </div>
    </div>
  );
}
