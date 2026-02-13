// 宠物页面组件

import { useState } from 'react';
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
import { getAllPetTemplates } from '@/constants/pets';
import { getQualityColor } from '@/utils/helpers';
import type { Pet } from '@/types';
import { PetDetail } from './PetDetail';

export function PetPage() {
  useSignals();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const pets = playerPets.value;
  const currentPet = activePet.value;
  const count = petCount.value;

  const handleSetActive = (petId: string) => {
    setActivePet(petId);
  };

  const handleUnsetActive = () => {
    unsetActivePet();
  };

  const handleRelease = (petId: string) => {
    if (confirm('确定要放生这只宠物吗？')) {
      removePet(petId);
      setSelectedPet(null);
    }
  };

  // 测试：创建一只随机宠物
  const handleCreateTestPet = () => {
    const templates = getAllPetTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const pet = createPet(randomTemplate.id);

    if (pet) {
      addPet(pet);
    }
  };

  return (
    <div className="space-y-4">
      {/* 宠物栏信息 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">我的宠物</h2>
        <span className="text-sm text-gray-400">
          {count}/{maxPets}
        </span>
      </div>

      {/* 当前出战宠物 */}
      {currentPet && (
        <div className="card bg-primary-900/30 border-primary-500">
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
                <span className="text-xs bg-primary-600 px-2 py-0.5 rounded">出战中</span>
              </div>
              <div className="text-sm text-gray-400">
                Lv.{currentPet.level} · {getTypeName(currentPet.type)}
              </div>
              {/* HP/MP条 */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 w-6">HP</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(currentPet.hp / currentPet.maxHp) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {currentPet.hp}/{currentPet.maxHp}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleUnsetActive}
              className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded touch-btn"
            >
              休息
            </button>
          </div>
        </div>
      )}

      {/* 宠物列表 */}
      {pets.length === 0 ? (
        <div className="card text-center py-8">
          <span className="text-4xl mb-2 block">🐾</span>
          <p className="text-gray-400">还没有宠物</p>
          <p className="text-sm text-gray-500 mt-1">在野外战斗可以捕捉宠物</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`card text-left hover:border-primary-500 transition-colors ${
                pet.isActive ? 'border-primary-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{pet.icon}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium truncate"
                    style={{ color: getQualityColor(pet.rarity) }}
                  >
                    {pet.nickname || pet.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Lv.{pet.level}
                  </div>
                </div>
                {pet.isActive && <span className="text-xs">⚔️</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 测试按钮：创建随机宠物 */}
      <button
        onClick={handleCreateTestPet}
        className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm touch-btn"
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
