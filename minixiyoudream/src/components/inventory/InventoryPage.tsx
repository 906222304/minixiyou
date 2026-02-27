// 背包页面组件 - 专业游戏UI（优化版）

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  inventoryItems,
  inventoryEquipments,
  equippedSlots,
  itemCount,
  equipmentCount,
  unequipItem,
  useItem,
  removeItem,
  equipItem,
} from '@/signals';
import { showSuccess, showError } from '@/signals/uiSignals';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import { getItemTemplate } from '@/constants/items';
import { ConfirmModal, useConfirmModal } from '@/components/common/ConfirmModal';
import { EquipmentDetail } from './EquipmentDetail';
import type { Item, Equipment, EquipmentSlot } from '@/types';
import type { ItemTemplate } from '@/types/item';

type TabType = 'items' | 'equipment' | 'equipped';
type ItemFilterType = 'all' | 'consumable' | 'material' | 'special' | 'quest' | 'gem';

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

/** 物品类型筛选选项 */
const ITEM_FILTER_OPTIONS: { value: ItemFilterType; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: '📦' },
  { value: 'consumable', label: '消耗品', icon: '🧪' },
  { value: 'material', label: '材料', icon: '💎' },
  { value: 'special', label: '特殊', icon: '⭐' },
  { value: 'quest', label: '任务', icon: '📜' },
  { value: 'gem', label: '宝石', icon: '💠' },
];

/** 物品效果类型名称 */
const EFFECT_TYPE_NAMES: Record<string, string> = {
  heal_hp: '恢复HP',
  heal_mp: '恢复MP',
  heal_hp_percent: '恢复HP%',
  heal_mp_percent: '恢复MP%',
  buff: '增益效果',
  cure: '治愈状态',
  revive: '复活',
  add_exp: '获得经验',
  add_gold: '获得金币',
  open_box: '开启宝箱',
};

/** 物品属性预览Tooltip组件 */
interface ItemTooltipProps {
  item: Item;
  template: ItemTemplate | undefined;
  position: { x: number; y: number };
  onUse?: () => void;
  onDrop?: () => void;
}

function ItemTooltip({ item, template, position, onUse, onDrop }: ItemTooltipProps) {
  if (!template) return null;

  const qualityColor = getQualityColor(item.quality);

  return (
    <div
      className="game-tooltip"
      style={{
        position: 'fixed',
        left: Math.min(position.x + 10, window.innerWidth - 280),
        top: Math.min(position.y + 10, window.innerHeight - 300),
        zIndex: 1000,
        maxWidth: 260,
      }}
    >
      {/* 标题 */}
      <div className="game-tooltip-title" style={{ color: qualityColor }}>
        {template.icon} {item.name}
      </div>

      {/* 品质和类型 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="game-tag game-tag-gold text-xs">
          {getQualityName(item.quality)}
        </span>
        <span className="text-xs text-slate-500">
          {template.type === 'consumable' ? '消耗品' :
           template.type === 'material' ? '材料' :
           template.type === 'special' ? '特殊物品' :
           template.type === 'quest' ? '任务物品' :
           template.type === 'gem' ? '宝石' : '物品'}
        </span>
        <span className="text-xs text-slate-500 ml-auto">x{item.count}</span>
      </div>

      {/* 描述 */}
      <div className="game-tooltip-description">
        {template.description}
      </div>

      {/* 效果 */}
      {template.effects && template.effects.length > 0 && (
        <div className="game-tooltip-stats">
          <div className="text-xs text-slate-500 mb-1">效果:</div>
          {template.effects.map((effect, idx) => (
            <div key={idx} className="game-tooltip-stat">
              <span className="game-tooltip-stat-label">
                {EFFECT_TYPE_NAMES[effect.type] || effect.type}
              </span>
              <span className="game-tooltip-stat-value">
                {effect.value ? (effect.type.includes('percent') ? `${effect.value}%` : effect.value) : '-'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 使用条件 */}
      {template.useRequirements && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          {template.useRequirements.minLevel && (
            <div className="text-xs text-amber-600">
              需要等级: {template.useRequirements.minLevel}
            </div>
          )}
        </div>
      )}

      {/* 售价 */}
      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs">
        <span className="text-slate-500">售价:</span>
        <span className="text-[var(--game-gold)]">{template.sellPrice} 金币</span>
      </div>

      {/* 快捷操作按钮 */}
      <div className="mt-3 flex gap-2">
        {template.usable && onUse && (
          <button
            onClick={onUse}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg
                       bg-gradient-to-b from-green-50 to-green-100 border border-green-300
                       text-green-700 hover:from-green-100 hover:to-green-200
                       transition-all min-h-[36px] active:scale-95"
          >
            使用
          </button>
        )}
        {template.type !== 'quest' && onDrop && (
          <button
            onClick={onDrop}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg
                       bg-gradient-to-b from-red-50 to-red-100 border border-red-300
                       text-red-700 hover:from-red-100 hover:to-red-200
                       transition-all min-h-[36px] active:scale-95"
          >
            丢弃
          </button>
        )}
      </div>
    </div>
  );
}

/** 装备属性预览Tooltip组件 */
interface EquipTooltipProps {
  equipment: Equipment;
  position: { x: number; y: number };
  onEquip?: () => void;
}

function EquipTooltip({ equipment, position, onEquip }: EquipTooltipProps) {
  const qualityColor = getQualityColor(equipment.quality);

  const stats = equipment.baseStats;
  const statEntries = Object.entries(stats).filter(([_, value]) => value);

  const statNames: Record<string, string> = {
    physicalAttack: '物攻',
    physicalDefense: '物防',
    magicAttack: '法攻',
    magicDefense: '法防',
    speed: '速度',
    maxHp: '生命',
    maxMp: '法力',
    critRate: '暴击',
    critDamage: '暴伤',
    hitRate: '命中',
    dodgeRate: '闪避',
  };

  const statIcons: Record<string, string> = {
    physicalAttack: '⚔️',
    physicalDefense: '🛡️',
    magicAttack: '🔮',
    magicDefense: '✨',
    speed: '💨',
    maxHp: '❤️',
    maxMp: '💙',
    critRate: '💥',
    critDamage: '💢',
    hitRate: '🎯',
    dodgeRate: '🌀',
  };

  return (
    <div
      className="game-tooltip"
      style={{
        position: 'fixed',
        left: Math.min(position.x + 10, window.innerWidth - 280),
        top: Math.min(position.y + 10, window.innerHeight - 350),
        zIndex: 1000,
        maxWidth: 260,
      }}
    >
      {/* 标题 */}
      <div className="game-tooltip-title flex items-center gap-2" style={{ color: qualityColor }}>
        <span>⚔️</span>
        <span>{equipment.name}</span>
        {equipment.enhanceLevel > 0 && (
          <span className="text-[var(--game-gold)]">+{equipment.enhanceLevel}</span>
        )}
      </div>

      {/* 品质 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="game-tag game-tag-gold text-xs">
          {getQualityName(equipment.quality)}
        </span>
      </div>

      {/* 属性 */}
      {statEntries.length > 0 && (
        <div className="game-tooltip-stats">
          {statEntries.map(([key, value]) => {
            const isPercent = ['critRate', 'critDamage', 'hitRate', 'dodgeRate'].includes(key);
            return (
              <div key={key} className="game-tooltip-stat">
                <span className="game-tooltip-stat-label flex items-center gap-1">
                  <span>{statIcons[key] || '◆'}</span>
                  <span>{statNames[key] || key}</span>
                </span>
                <span className="game-tooltip-stat-value">
                  {isPercent ? `${((value as number) * 100).toFixed(1)}%` : `+${value}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 词条 */}
      {equipment.affixes && equipment.affixes.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500 mb-1">词条:</div>
          {equipment.affixes.slice(0, 3).map((affix, idx) => (
            <div key={idx} className="text-xs text-purple-600">
              {affix.description}
            </div>
          ))}
          {equipment.affixes.length > 3 && (
            <div className="text-xs text-slate-400">
              +{equipment.affixes.length - 3} 更多...
            </div>
          )}
        </div>
      )}

      {/* 装备按钮 */}
      {onEquip && (
        <div className="mt-3">
          <button
            onClick={onEquip}
            className="w-full px-3 py-2 text-xs font-medium rounded-lg
                       bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-300
                       text-amber-700 hover:from-amber-100 hover:to-amber-200
                       transition-all min-h-[36px] active:scale-95"
          >
            装备
          </button>
        </div>
      )}
    </div>
  );
}

export function InventoryPage() {
  useSignals();

  const [activeTab, setActiveTab] = useState<TabType>('equipped');
  const [selectedItem, setSelectedItem] = useState<Item | Equipment | null>(null);
  const [itemFilter, setItemFilter] = useState<ItemFilterType>('all');

  // Tooltip状态
  const [tooltipItem, setTooltipItem] = useState<{
    item: Item;
    template: ItemTemplate;
    position: { x: number; y: number };
  } | null>(null);
  const [tooltipEquip, setTooltipEquip] = useState<{
    equipment: Equipment;
    position: { x: number; y: number };
  } | null>(null);

  // 长按检测
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  // 确认弹窗
  const { showConfirm, modalProps } = useConfirmModal();
  const [pendingDropItem, setPendingDropItem] = useState<Item | null>(null);

  const items = inventoryItems.value;
  const equipments = inventoryEquipments.value;
  const equipped = equippedSlots.value;

  // 筛选后的物品列表
  const filteredItems = items.filter(item => {
    if (itemFilter === 'all') return true;
    return item.type === itemFilter;
  });

  // 清理长按计时器
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // 处理物品长按开始
  const handleItemTouchStart = useCallback((item: Item, e: React.TouchEvent | React.MouseEvent) => {
    const template = getItemTemplate(item.templateId);
    if (!template) return;

    setIsLongPress(false);

    // 获取位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // 设置长按计时器 (400ms)
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setTooltipItem({
        item,
        template,
        position: { x: clientX, y: clientY },
      });
    }, 400);
  }, []);

  // 处理物品长按结束
  const handleItemTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // 处理鼠标悬停 (桌面端)
  const handleItemMouseEnter = useCallback((item: Item, e: React.MouseEvent) => {
    const template = getItemTemplate(item.templateId);
    if (!template) return;

    setTooltipItem({
      item,
      template,
      position: { x: e.clientX, y: e.clientY },
    });
  }, []);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    if (!isLongPress) {
      setTooltipItem(null);
      setTooltipEquip(null);
    }
  }, [isLongPress]);

  // 关闭tooltip
  const handleCloseTooltip = useCallback(() => {
    setTooltipItem(null);
    setTooltipEquip(null);
    setIsLongPress(false);
  }, []);

  // 处理装备悬停
  const handleEquipMouseEnter = useCallback((equipment: Equipment, e: React.MouseEvent) => {
    setTooltipEquip({
      equipment,
      position: { x: e.clientX, y: e.clientY },
    });
  }, []);

  // 处理物品使用 (从tooltip)
  const handleUseItemFromTooltip = useCallback((item: Item) => {
    const result = useItem(item.id);
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
    handleCloseTooltip();
  }, [handleCloseTooltip, showSuccess, showError]);

  // 处理物品丢弃
  const handleDropItem = useCallback((item: Item) => {
    setPendingDropItem(item);
    showConfirm(`确定要丢弃 ${item.name} x${item.count} 吗？`, {
      title: '丢弃物品',
      type: 'danger',
      onConfirm: () => {
        if (pendingDropItem) {
          removeItem(pendingDropItem.id, pendingDropItem.count);
          showSuccess(`已丢弃 ${pendingDropItem.name}`);
        }
        setPendingDropItem(null);
        handleCloseTooltip();
      },
    });
  }, [showConfirm, pendingDropItem, handleCloseTooltip, showSuccess]);

  // 处理装备装备 (从tooltip)
  const handleEquipFromTooltip = useCallback((equipment: Equipment) => {
    equipItem(equipment.id);
    handleCloseTooltip();
  }, [handleCloseTooltip]);

  // 快速使用消耗品 (双击或点击)
  const handleQuickUseItem = useCallback((item: Item) => {
    const template = getItemTemplate(item.templateId);
    if (!template?.usable) {
      // 不可使用的物品打开详情
      setSelectedItem(item);
      return;
    }

    // 可使用物品直接使用
    const result = useItem(item.id);
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  }, [showSuccess, showError]);

  // 处理卸下装备确认
  const handleUnequip = useCallback((slot: EquipmentSlot) => {
    const equip = equipped[slot];
    if (!equip) return;

    showConfirm(`确定要卸下 ${equip.name} 吗？`, {
      title: '卸下装备',
      type: 'info',
      onConfirm: () => {
        unequipItem(slot);
        showSuccess(`已卸下 ${equip.name}`);
      },
    });
  }, [equipped, showConfirm, showSuccess]);

  // 渲染已装备内容
  const renderEquippedContent = () => (
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
              onMouseEnter={equip ? (e) => handleEquipMouseEnter(equip, e) : undefined}
              onMouseLeave={handleMouseLeave}
              className={`
                game-card p-4 flex items-center gap-3 cursor-pointer min-h-[60px]
                ${equip ? '' : 'opacity-50'}
              `}
              style={equip ? {
                borderColor: qualityColor,
                boxShadow: `0 0 15px ${qualityColor}20`,
              } : undefined}
            >
              <div className="game-icon game-icon-sm flex-shrink-0">
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
                    handleUnequip(slot);
                  }}
                  className="game-btn game-btn-sm text-xs px-4 py-2 min-h-[44px]"
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

  // 渲染装备列表内容
  const renderEquipmentContent = () => (
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
                onMouseEnter={(e) => handleEquipMouseEnter(equip, e)}
                onMouseLeave={handleMouseLeave}
                className="game-card p-4 flex items-center gap-3 cursor-pointer min-h-[60px]"
                style={{
                  borderColor: qualityColor,
                  boxShadow: `0 0 15px ${qualityColor}20`,
                }}
              >
                <div
                  className="game-icon game-icon-sm flex-shrink-0"
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
                {/* 快速装备按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEquipFromTooltip(equip);
                  }}
                  className="game-btn game-btn-primary text-xs px-4 py-2 min-h-[44px]"
                >
                  装备
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // 渲染物品列表内容
  const renderItemsContent = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
        <span>🧪</span>
        <span>物品 ({itemCount.value})</span>
      </h3>

      {/* 物品类型筛选 */}
      <div className="flex gap-2 flex-wrap">
        {ITEM_FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setItemFilter(option.value)}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[40px]
              ${itemFilter === option.value
                ? 'bg-[var(--game-gold)] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-[var(--game-gold)]'
              }
            `}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="game-panel p-8 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-[var(--game-text-muted)]">
            {itemFilter === 'all' ? '没有物品' : '该类型没有物品'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const qualityColor = getQualityColor(item.quality);
            const template = getItemTemplate(item.templateId);
            const isUsable = template?.usable;

            return (
              <div
                key={item.id}
                onClick={() => handleQuickUseItem(item)}
                onTouchStart={(e) => handleItemTouchStart(item, e)}
                onTouchEnd={handleItemTouchEnd}
                onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                className="game-card p-4 flex items-center gap-3 cursor-pointer min-h-[60px]"
                style={{
                  borderColor: qualityColor,
                }}
              >
                <div className="game-icon game-icon-sm flex-shrink-0">
                  {template?.icon || '🧪'}
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
                      x {item.count}
                    </span>
                    {isUsable && (
                      <span className="text-xs text-green-500">可使用</span>
                    )}
                  </div>
                </div>
                {/* 快速使用按钮 */}
                {isUsable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickUseItem(item);
                    }}
                    className="game-btn game-btn-success text-xs px-4 py-2 min-h-[44px]"
                  >
                    使用
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipped':
        return renderEquippedContent();
      case 'equipment':
        return renderEquipmentContent();
      case 'items':
        return renderItemsContent();
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
              flex-1 py-3 px-3 rounded-md text-sm font-semibold transition-all duration-200 min-h-[48px]
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

      {/* 物品Tooltip */}
      {tooltipItem && (
        <ItemTooltip
          item={tooltipItem.item}
          template={tooltipItem.template}
          position={tooltipItem.position}
          onUse={() => handleUseItemFromTooltip(tooltipItem.item)}
          onDrop={() => handleDropItem(tooltipItem.item)}
        />
      )}

      {/* 装备Tooltip */}
      {tooltipEquip && (
        <EquipTooltip
          equipment={tooltipEquip.equipment}
          position={tooltipEquip.position}
          onEquip={() => handleEquipFromTooltip(tooltipEquip.equipment)}
        />
      )}

      {/* 点击其他区域关闭tooltip */}
      {(tooltipItem || tooltipEquip) && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={handleCloseTooltip}
        />
      )}

      {/* 确认弹窗 */}
      <ConfirmModal {...modalProps} />
    </div>
  );
}
