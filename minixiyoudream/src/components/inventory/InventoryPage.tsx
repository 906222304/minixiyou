// 背包页面组件

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
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">已装备</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(equipped) as EquipmentSlot[]).map((slot) => {
                const equip = equipped[slot];
                return (
                  <button
                    key={slot}
                    onClick={() => equip && setSelectedItem(equip)}
                    className={`card flex items-center gap-3 text-left ${
                      equip ? 'hover:border-primary-500' : 'opacity-50'
                    }`}
                  >
                    <span className="text-2xl w-10 text-center">
                      {equip ? '⚔️' : '➕'}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">{SLOT_NAMES[slot]}</div>
                      {equip ? (
                        <>
                          <div style={{ color: getQualityColor(equip.quality) }}>
                            {equip.name}
                            {equip.enhanceLevel > 0 && (
                              <span className="text-yellow-400 ml-1">+{equip.enhanceLevel}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">空</div>
                      )}
                    </div>
                    {equip && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unequipItem(slot);
                        }}
                        className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded touch-btn"
                      >
                        卸下
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'equipment':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">
              装备 ({equipmentCount.value})
            </h3>
            {equipments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">没有装备</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {equipments.map((equip) => (
                  <button
                    key={equip.id}
                    onClick={() => setSelectedItem(equip)}
                    className="card flex items-center gap-3 text-left hover:border-primary-500"
                  >
                    <span className="text-2xl w-10 text-center">⚔️</span>
                    <div className="flex-1">
                      <div style={{ color: getQualityColor(equip.quality) }}>
                        {equip.name}
                        {equip.enhanceLevel > 0 && (
                          <span className="text-yellow-400 ml-1">+{equip.enhanceLevel}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getQualityName(equip.quality)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'items':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">
              物品 ({itemCount.value})
            </h3>
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">没有物品</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="card flex items-center gap-3 text-left hover:border-primary-500"
                  >
                    <span className="text-2xl w-10 text-center">🧪</span>
                    <div className="flex-1">
                      <div style={{ color: getQualityColor(item.quality) }}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getQualityName(item.quality)} × {item.count}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 标签页切换 */}
      <div className="flex gap-2">
        {(['equipped', 'equipment', 'items'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors touch-btn ${
              activeTab === tab
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab === 'equipped' ? '装备中' : tab === 'equipment' ? '装备' : '物品'}
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
