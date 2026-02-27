// 宠物页面组件

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  playerPets,
  activePet,
  petCount,
  maxPets,
  setActivePet,
  unsetActivePet,
  removePet,
  createPet,
  addPet,
} from '@/signals/petSignals';
import { ALL_SUMMON_TEMPLATES } from '@/constants/summonTemplates';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import { randomChoice } from '@/utils/prng';
import type { Pet } from '@/types';
import { PetDetail } from './PetDetail';
import { useConfirmModal } from '@/components/common/ConfirmModal';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  pet: Pet | null;
}

interface CompareState {
  isOpen: boolean;
  pet1: Pet | null;
  pet2: Pet | null;
}

export function PetPage() {
  useSignals();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    pet: null,
  });
  const [compareState, setCompareState] = useState<CompareState>({
    isOpen: false,
    pet1: null,
    pet2: null,
  });
  const [selectingCompare, setSelectingCompare] = useState<Pet | null>(null);

  const { showConfirm, ConfirmModalComponent } = useConfirmModal();

  const pets = playerPets.value;
  const currentPet = activePet.value;
  const count = petCount.value;

  // Long press detection
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  const handleSetActive = (petId: string) => {
    setActivePet(petId);
  };

  const handleUnsetActive = () => {
    unsetActivePet();
  };

  const handleRelease = useCallback((petId: string) => {
    showConfirm('确定要放生这只宠物吗？放生后无法恢复。', {
      title: '放生宠物',
      type: 'danger',
      onConfirm: () => {
        removePet(petId);
        setSelectedPet(null);
        setContextMenu(prev => ({ ...prev, isOpen: false, pet: null }));
      },
    });
  }, [showConfirm]);

  // Context menu handlers
  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent, pet: Pet) => {
    e.preventDefault();
    e.stopPropagation();

    let x: number, y: number;
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    setContextMenu({
      isOpen: true,
      x,
      y,
      pet,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Long press handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, pet: Pet) => {
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      handleContextMenu(e, pet);
    }, 500); // 500ms long press
  }, [handleContextMenu]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.isOpen) {
        closeContextMenu();
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  // Context menu actions
  const handleContextMenuAction = useCallback((action: 'setActive' | 'release' | 'compare' | 'details') => {
    if (!contextMenu.pet) return;

    switch (action) {
      case 'setActive':
        handleSetActive(contextMenu.pet.id);
        closeContextMenu();
        break;
      case 'release':
        handleRelease(contextMenu.pet.id);
        break;
      case 'compare':
        if (selectingCompare) {
          setCompareState({
            isOpen: true,
            pet1: selectingCompare,
            pet2: contextMenu.pet,
          });
          setSelectingCompare(null);
        } else {
          setSelectingCompare(contextMenu.pet);
        }
        closeContextMenu();
        break;
      case 'details':
        setSelectedPet(contextMenu.pet);
        closeContextMenu();
        break;
    }
  }, [contextMenu.pet, closeContextMenu, handleRelease, selectingCompare]);

  // Compare functionality
  const startCompare = useCallback((pet: Pet) => {
    if (selectingCompare && selectingCompare.id !== pet.id) {
      setCompareState({
        isOpen: true,
        pet1: selectingCompare,
        pet2: pet,
      });
      setSelectingCompare(null);
    } else {
      setSelectingCompare(pet);
    }
  }, [selectingCompare]);

  const cancelCompare = useCallback(() => {
    setSelectingCompare(null);
    setCompareState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // 测试：创建一只随机宠物
  const handleCreateTestPet = () => {
    const templates = ALL_SUMMON_TEMPLATES;
    const randomTemplate = randomChoice(templates);
    const pet = createPet(randomTemplate.id);

    if (pet) {
      addPet(pet);
    }
  };

  return (
    <div className="space-y-4">
      {/* 宠物栏信息 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[var(--game-text)]">我的宠物</h2>
        <span className="text-sm text-[var(--game-text-muted)]">
          {count}/{maxPets}
        </span>
      </div>

      {/* 对比选择提示 */}
      {selectingCompare && (
        <div className="game-card bg-blue-50 border-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📊</span>
            <span className="text-sm text-blue-700">
              已选择 <strong>{selectingCompare.nickname || selectingCompare.name}</strong>，点击另一只宠物进行对比
            </span>
          </div>
          <button
            onClick={cancelCompare}
            className="text-sm px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-700 rounded min-h-[32px] active:scale-95 transition-transform"
          >
            取消
          </button>
        </div>
      )}

      {/* 当前出战宠物 */}
      {currentPet && (
        <div className="game-card bg-amber-50 border-amber-300">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentPet.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: getQualityColor(currentPet.rarity) }}
                >
                  {currentPet.nickname || currentPet.name}
                </span>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">出战中</span>
              </div>
              <div className="text-sm text-[var(--game-text-muted)]">
                Lv.{currentPet.level} · {getTypeName(currentPet.type)}
              </div>
              {/* HP/MP条 */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500 w-6">HP</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(currentPet.hp / currentPet.maxHp) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--game-text-muted)]">
                    {currentPet.hp}/{currentPet.maxHp}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleUnsetActive}
              className="text-sm px-4 py-2.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-[var(--game-text)] rounded-lg touch-btn transition-colors min-h-[44px]"
            >
              休息
            </button>
          </div>
        </div>
      )}

      {/* 宠物列表 */}
      {pets.length === 0 ? (
        <div className="game-card text-center py-8">
          <span className="text-4xl mb-2 block">🐾</span>
          <p className="text-[var(--game-text-muted)]">还没有宠物</p>
          <p className="text-sm text-[var(--game-text-dim)] mt-1">在野外战斗可以捕捉宠物</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              onClick={() => {
                if (selectingCompare) {
                  startCompare(pet);
                } else if (!longPressTriggeredRef.current) {
                  setSelectedPet(pet);
                }
              }}
              onContextMenu={(e) => handleContextMenu(e, pet)}
              onTouchStart={(e) => handleTouchStart(e, pet)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              className={`game-card text-left hover:border-amber-400 transition-colors cursor-pointer min-h-[80px] ${
                pet.isActive ? 'border-amber-400' : ''
              } ${selectingCompare?.id === pet.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
            >
              <div className="flex items-center gap-3 p-2">
                <span className="text-3xl">{pet.icon}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium truncate"
                    style={{ color: getQualityColor(pet.rarity) }}
                  >
                    {pet.nickname || pet.name}
                  </div>
                  <div className="text-xs text-[var(--game-text-muted)]">
                    Lv.{pet.level} · {getTypeName(pet.type)}
                  </div>
                  {/* 属性预览 */}
                  <div className="flex gap-3 mt-1 text-xs text-[var(--game-text-dim)]">
                    <span>ATK {Math.floor(pet.stats.physicalAttack)}</span>
                    <span>DEF {Math.floor(pet.stats.physicalDefense)}</span>
                    <span>SPD {Math.floor(pet.stats.speed)}</span>
                  </div>
                </div>
                {pet.isActive && <span className="text-lg">⚔️</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 快捷操作按钮 */}
      {pets.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (selectingCompare) {
                cancelCompare();
              } else if (pets.length >= 2) {
                setSelectingCompare(pets[0]);
              }
            }}
            className={`flex-1 py-3 rounded-lg text-sm font-medium touch-btn transition-colors min-h-[44px] active:scale-95 ${
              selectingCompare
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-[var(--game-text)]'
            }`}
          >
            {selectingCompare ? '取消对比' : '📊 对比宠物'}
          </button>
        </div>
      )}

      {/* 测试按钮：创建随机宠物 */}
      <button
        onClick={handleCreateTestPet}
        className="w-full py-3 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 rounded-lg text-sm touch-btn text-[var(--game-text)] font-medium transition-colors min-h-[44px]"
      >
        🎲 获得随机宠物（测试）
      </button>

      {/* 宠物详情弹窗 */}
      {selectedPet && (
        <PetDetail
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onSetActive={handleSetActive}
          onRelease={handleRelease}
        />
      )}

      {/* 右键菜单 */}
      {contextMenu.isOpen && contextMenu.pet && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          pet={contextMenu.pet}
          onAction={handleContextMenuAction}
          onClose={closeContextMenu}
        />
      )}

      {/* 宠物对比弹窗 */}
      {compareState.isOpen && compareState.pet1 && compareState.pet2 && (
        <PetCompareModal
          pet1={compareState.pet1}
          pet2={compareState.pet2}
          onClose={() => setCompareState(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* 确认弹窗 */}
      {ConfirmModalComponent}
    </div>
  );
}

/** 获取宠物类型名称 */
function getTypeName(type: string): string {
  const names: Record<string, string> = {
    attack: '攻击型',
    magic: '法术型',
    defense: '防御型',
    support: '辅助型',
    control: '控制型',
  };
  return names[type] || type;
}

/** 右键菜单组件 */
interface ContextMenuProps {
  x: number;
  y: number;
  pet: Pet;
  onAction: (action: 'setActive' | 'release' | 'compare' | 'details') => void;
  onClose: () => void;
}

function ContextMenu({ x, y, pet, onAction }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 调整菜单位置，确保不超出屏幕
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        menuRef.current.style.left = `${viewportWidth - rect.width - 10}px`;
      }
      if (rect.bottom > viewportHeight) {
        menuRef.current.style.top = `${viewportHeight - rect.height - 10}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] bg-[#252540] rounded-lg shadow-xl border border-gray-700 overflow-hidden min-w-[140px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 border-b border-gray-700">
        <span style={{ color: getQualityColor(pet.rarity) }} className="text-sm font-medium">
          {pet.nickname || pet.name}
        </span>
      </div>
      <div className="py-1">
        {!pet.isActive && (
          <button
            onClick={() => onAction('setActive')}
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-amber-600 flex items-center gap-2 min-h-[44px]"
          >
            <span>⚔️</span> 设为出战
          </button>
        )}
        <button
          onClick={() => onAction('compare')}
          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-blue-600 flex items-center gap-2 min-h-[44px]"
        >
          <span>📊</span> 对比属性
        </button>
        <button
          onClick={() => onAction('details')}
          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-600 flex items-center gap-2 min-h-[44px]"
        >
          <span>📋</span> 查看详情
        </button>
        <button
          onClick={() => onAction('release')}
          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/50 flex items-center gap-2 min-h-[44px]"
        >
          <span>🚪</span> 放生
        </button>
      </div>
    </div>
  );
}

/** 宠物对比弹窗组件 */
interface PetCompareModalProps {
  pet1: Pet;
  pet2: Pet;
  onClose: () => void;
}

function PetCompareModal({ pet1, pet2, onClose }: PetCompareModalProps) {
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
  };

  const aptitudeNames: Record<string, string> = {
    attack: '攻击资质',
    defense: '防御资质',
    hp: '体力资质',
    mp: '法力资质',
    speed: '速度资质',
    dodge: '躲闪资质',
  };

  const compareValue = (val1: number, val2: number): 'better' | 'worse' | 'equal' => {
    if (val1 > val2) return 'better';
    if (val1 < val2) return 'worse';
    return 'equal';
  };

  const getValueClass = (comparison: 'better' | 'worse' | 'equal'): string => {
    switch (comparison) {
      case 'better':
        return 'text-green-400';
      case 'worse':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#252540] w-full max-w-lg rounded-2xl p-4 animate-scale-in max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">宠物属性对比</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 宠物信息 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-4xl block mb-2">{pet1.icon}</span>
            <span className="font-bold" style={{ color: getQualityColor(pet1.rarity) }}>
              {pet1.nickname || pet1.name}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              Lv.{pet1.level} · {getQualityName(pet1.rarity)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-4xl block mb-2">{pet2.icon}</span>
            <span className="font-bold" style={{ color: getQualityColor(pet2.rarity) }}>
              {pet2.nickname || pet2.name}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              Lv.{pet2.level} · {getQualityName(pet2.rarity)}
            </div>
          </div>
        </div>

        {/* 属性对比 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">属性对比</h4>
          <div className="space-y-2">
            {Object.entries(statNames)
              .filter(([key]) => pet1.stats[key as keyof typeof pet1.stats] !== undefined)
              .slice(0, 8)
              .map(([key, name]) => {
                const val1 = Math.floor(pet1.stats[key as keyof typeof pet1.stats] as number);
                const val2 = Math.floor(pet2.stats[key as keyof typeof pet2.stats] as number);
                const comparison1 = compareValue(val1, val2);
                const comparison2 = compareValue(val2, val1);

                return (
                  <div key={key} className="flex items-center text-sm">
                    <span className="w-20 text-gray-400">{name}</span>
                    <span className={`flex-1 text-right pr-2 ${getValueClass(comparison1)}`}>
                      {val1}
                      {comparison1 === 'better' && ' ↑'}
                      {comparison1 === 'worse' && ' ↓'}
                    </span>
                    <span className="text-gray-500 px-2">vs</span>
                    <span className={`flex-1 text-left pl-2 ${getValueClass(comparison2)}`}>
                      {comparison2 === 'better' && '↑ '}
                      {comparison2 === 'worse' && '↓ '}
                      {val2}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 资质对比 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">资质对比</h4>
          <div className="space-y-2">
            {Object.entries(aptitudeNames).map(([key, name]) => {
              const val1 = pet1.aptitude[key as keyof typeof pet1.aptitude];
              const val2 = pet2.aptitude[key as keyof typeof pet2.aptitude];
              if (val1 === undefined || val2 === undefined) return null;
              const comparison1 = compareValue(val1, val2);
              const comparison2 = compareValue(val2, val1);

              return (
                <div key={key} className="flex items-center text-sm">
                  <span className="w-20 text-gray-400">{name}</span>
                  <span className={`flex-1 text-right pr-2 ${getValueClass(comparison1)}`}>
                    {val1.toFixed(2)}
                    {comparison1 === 'better' && ' ↑'}
                    {comparison1 === 'worse' && ' ↓'}
                  </span>
                  <span className="text-gray-500 px-2">vs</span>
                  <span className={`flex-1 text-left pl-2 ${getValueClass(comparison2)}`}>
                    {comparison2 === 'better' && '↑ '}
                    {comparison2 === 'worse' && '↓ '}
                    {val2.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 其他对比 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">成长率</span>
              <span className={getValueClass(compareValue(pet1.growthRate, pet2.growthRate))}>
                {pet1.growthRate.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">亲密度</span>
              <span>{pet1.intimacy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">忠诚度</span>
              <span>{pet1.loyalty}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">成长率</span>
              <span className={getValueClass(compareValue(pet2.growthRate, pet1.growthRate))}>
                {pet2.growthRate.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">亲密度</span>
              <span>{pet2.intimacy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">忠诚度</span>
              <span>{pet2.loyalty}</span>
            </div>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium min-h-[44px] active:scale-95 transition-transform"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
