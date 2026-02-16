// 背包页面组件 - 专业游戏UI

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  inventoryItems,
  inventoryEquipments,
  equippedSlots,
  itemCount,
  equipmentCount,
  unequipItem,
} from '@/signals';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import type { Item, Equipment, EquipmentSlot } from '@/types';
import { EquipmentDetail } from './EquipmentDetail';

type TabType = 'items' | 'equipment' | 'equipped';

const SLOT_NAMES: Record<EquipmentSlot, string> = {
  weapon: '武器',
  helmet: '头盔',
  armor: '衣服',
  boots: '鞋子',
  belt: '腰带',
  necklace: '项链',
  charm: '护符',
  ring1: '戒指1',
  ring2: '戒指2',
};

const SLOT_ICONS: Record<EquipmentSlot, string> = {
  weapon: '⚔️',
  helmet: '🪖',
  armor: '🛡️',
  boots: '👢',
  belt: '🎒',
  necklace: '📿',
  charm: '🔮',
  ring1: '💍',
  ring2: '💍',
};

export function InventoryPage() {
  useSignals();

  const [activeTab, setActiveTab] = useState<TabType>('equipped');
  const [selectedItem, setSelectedItem] = useState<Item | Equipment | null>(null);

  const items = inventoryItems.value;
  const equipments = inventoryEquipments.value;
  const equipped = equippedSlots.value;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipped':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
              <span>⚔️</span>
              <span>已装备</span>
            </h3>
            <div className="space-y-3">
              {(Object.keys(equipped) as EquipmentSlot[]).map((slot) => {
                const equip = equipped[slot];
                const qualityColor = equip ? getQualityColor(equip.quality) : undefined;

                return (
                  <div
                    key={slot}
                    onClick={() => equip && setSelectedItem(equip)}
                    className={`
                      game-card p-4 flex items-center gap-3 cursor-pointer
                      ${equip ? '' : 'opacity-50'}
                    `}
                    style={equip ? {
                      borderColor: qualityColor,
                      boxShadow: `0 0 15px ${qualityColor}20`,
                    } : undefined}
                  >
                    <div className="game-icon game-icon-sm">
                      {equip ? SLOT_ICONS[slot] : '➕'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-600 mb-1">
                        {SLOT_NAMES[slot]}
                      </div>
                      {equip ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="font-semibold truncate"
                            style={{ color: qualityColor }}
                          >
                            {equip.name}
                          </span>
                          {equip.enhanceLevel > 0 && (
                            <span className="text-[var(--game-gold)] text-sm">+{equip.enhanceLevel}</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-sm">空</div>
                      )}
                    </div>
                    {equip && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unequipItem(slot);
                        }}
                        className="game-btn game-btn-sm text-xs px-3 py-1"
                      >
                        卸下
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'equipment':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
              <span>🎒</span>
              <span>装备 ({equipmentCount.value})</span>
            </h3>
            {equipments.length === 0 ? (
              <div className="game-panel p-8 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-[var(--game-text-muted)]">没有装备</p>
              </div>
            ) : (
              <div className="space-y-3">
                {equipments.map((equip) => {
                  const qualityColor = getQualityColor(equip.quality);
                  return (
                    <div
                      key={equip.id}
                      onClick={() => setSelectedItem(equip)}
                      className="game-card p-4 flex items-center gap-3 cursor-pointer"
                      style={{
                        borderColor: qualityColor,
                        boxShadow: `0 0 15px ${qualityColor}20`,
                      }}
                    >
                      <div
                        className="game-icon game-icon-sm"
                        style={{
                          background: `linear-gradient(135deg, ${qualityColor}20 0%, ${qualityColor}05 100%)`,
                          border: `1px solid ${qualityColor}40`,
                        }}
                      >
                        ⚔️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-semibold truncate"
                            style={{ color: qualityColor }}
                          >
                            {equip.name}
                          </span>
                          {equip.enhanceLevel > 0 && (
                            <span className="text-[var(--game-gold)] text-sm">+{equip.enhanceLevel}</span>
                          )}
                        </div>
                        <span className="game-tag game-tag-gold text-xs mt-1">
                          {getQualityName(equip.quality)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'items':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
              <span>🧪</span>
              <span>物品 ({itemCount.value})</span>
            </h3>
            {items.length === 0 ? (
              <div className="game-panel p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-[var(--game-text-muted)]">没有物品</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const qualityColor = getQualityColor(item.quality);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="game-card p-4 flex items-center gap-3 cursor-pointer"
                      style={{
                        borderColor: qualityColor,
                      }}
                    >
                      <div className="game-icon game-icon-sm">
                        🧪
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="font-semibold truncate block"
                          style={{ color: qualityColor }}
                        >
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="game-tag game-tag-gold text-xs">
                            {getQualityName(item.quality)}
                          </span>
                          <span className="text-slate-500 text-xs">
                            × {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎒</span>
        <h2 className="text-xl font-bold text-[var(--game-gold)]">背包</h2>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 p-1 bg-slate-200 rounded-lg">
        {(['equipped', 'equipment', 'items'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-200
              ${activeTab === tab
                ? 'bg-[var(--game-gold)] text-white shadow-lg'
                : 'text-[var(--game-text)] hover:text-[var(--game-gold)] hover:bg-slate-300 active:bg-slate-400'
              }
            `}
          >
            {tab === 'equipped' ? '⚔️ 装备中' : tab === 'equipment' ? '🎒 装备' : '🧪 物品'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      {renderTabContent()}

      {/* 选中物品详情 */}
      {selectedItem && (
        <EquipmentDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
