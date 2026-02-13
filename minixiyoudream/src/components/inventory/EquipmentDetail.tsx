// 装备详情组件

import { useSignals } from '@preact/signals-react/runtime';
import { equipItem } from '@/signals';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import type { Item, Equipment } from '@/types';

interface EquipmentDetailProps {
  item: Item | Equipment;
  onClose: () => void;
}

export function EquipmentDetail({ item, onClose }: EquipmentDetailProps) {
  useSignals();

  const isEquipment = 'baseStats' in item;
  const isEquipped = isEquipment && 'slot' in item;

  const handleEquip = () => {
    if (isEquipment) {
      equipItem(item.id);
      onClose();
    }
  };

  const handleUnequip = () => {
    // 找到装备的槽位
    // 这里简化处理，实际需要查找
    onClose();
  };

  const renderStats = () => {
    if (!isEquipment) return null;

    const equip = item as Equipment;
    const stats = equip.baseStats;

    const statNames: Record<string, string> = {
      physicalAttack: '物理攻击',
      physicalDefense: '物理防御',
      magicAttack: '法术攻击',
      magicDefense: '法术防御',
      speed: '速度',
      maxHp: '最大HP',
      maxMp: '最大MP',
      critRate: '暴击率',
      critDamage: '暴击伤害',
      hitRate: '命中率',
      dodgeRate: '闪避率',
    };

    return (
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-400 mt-3">属性</h4>
        {Object.entries(stats).map(([key, value]) => {
          const statKey = key as keyof typeof statNames;
          if (!value) return null;

          const isPercent = ['critRate', 'critDamage', 'hitRate', 'dodgeRate'].includes(key);
          const displayValue = isPercent
            ? `${((value as number) * 100).toFixed(1)}%`
            : `+${value}`;

          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-400">{statNames[statKey] || key}</span>
              <span className="text-green-400">{displayValue}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#252540] w-full max-w-md rounded-t-2xl p-4 animate-fade-in">
        {/* 标题 */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: getQualityColor(item.quality) }}
            >
              {item.name}
              {isEquipment && (item as Equipment).enhanceLevel > 0 && (
                <span className="text-yellow-400 ml-1">
                  +{(item as Equipment).enhanceLevel}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-400">
              {getQualityName(item.quality)}
              {isEquipment && ` · ${(item as Equipment).templateId}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white touch-btn"
          >
            ✕
          </button>
        </div>

        {/* 描述 */}
        <p className="text-sm text-gray-300 mb-4">
          {isEquipment ? '一件装备' : '消耗品'}
        </p>

        {/* 属性 */}
        {renderStats()}

        {/* 宝石槽 */}
        {isEquipment && (item as Equipment).gems && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-400">宝石槽</h4>
            <div className="flex gap-2 mt-1">
              {(item as Equipment).gems.map((gem, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-sm"
                >
                  {gem ? '💎' : '空'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-4 space-y-2">
          {isEquipment && !isEquipped && (
            <button
              onClick={handleEquip}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium touch-btn"
            >
              装备
            </button>
          )}
          {isEquipped && (
            <button
              onClick={handleUnequip}
              className="w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium touch-btn"
            >
              卸下
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-400 hover:text-white touch-btn"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
