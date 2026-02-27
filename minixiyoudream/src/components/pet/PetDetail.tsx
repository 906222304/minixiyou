// 宠物详情组件

import { useSignals } from '@preact/signals-react/runtime';
import { getQualityColor, getQualityName } from '@/utils/helpers';
import type { Pet } from '@/types';
import { useConfirmModal } from '@/components/common/ConfirmModal';

interface PetDetailProps {
  pet: Pet;
  onClose: () => void;
  onSetActive: (petId: string) => void;
  onRelease: (petId: string) => void;
}

export function PetDetail({ pet, onClose, onSetActive, onRelease }: PetDetailProps) {
  useSignals();

  const { showConfirm, ConfirmModalComponent } = useConfirmModal();

  const getTypeName = (type: string): string => {
    const names: Record<string, string> = {
      attack: '攻击型',
      magic: '法术型',
      defense: '防御型',
      support: '辅助型',
      control: '控制型',
    };
    return names[type] || type;
  };

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

  const handleRelease = () => {
    showConfirm('确定要放生这只宠物吗？放生后无法恢复。', {
      title: '放生宠物',
      type: 'danger',
      onConfirm: () => {
        onRelease(pet.id);
      },
    });
  };

  const handleSetActive = () => {
    onSetActive(pet.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[#252540] w-full max-w-md rounded-t-2xl p-4 animate-fade-in max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{pet.icon}</span>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: getQualityColor(pet.rarity) }}
              >
                {pet.nickname || pet.name}
              </h3>
              <p className="text-sm text-gray-400">
                {getQualityName(pet.rarity)} · {getTypeName(pet.type)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center touch-btn"
          >
            ✕
          </button>
        </div>

        {/* 等级和经验 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>等级</span>
            <span>Lv.{pet.level}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${(pet.exp / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* HP/MP */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 w-8">HP</span>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${(pet.hp / pet.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-20 text-right">
              {pet.hp}/{pet.maxHp}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400 w-8">MP</span>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(pet.mp / pet.maxMp) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-20 text-right">
              {pet.mp}/{pet.maxMp}
            </span>
          </div>
        </div>

        {/* 属性 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">属性</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(pet.stats)
              .filter(([key]) => statNames[key])
              .slice(0, 8)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 min-h-[32px] items-center">
                  <span className="text-gray-400">{statNames[key]}</span>
                  <span className="text-white">{Math.floor(value as number)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* 资质 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">资质</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(pet.aptitude).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 min-h-[32px] items-center">
                <span className="text-gray-400">{aptitudeNames[key]}</span>
                <span
                  className={
                    value >= 1.3
                      ? 'text-orange-400'
                      : value >= 1.1
                        ? 'text-purple-400'
                        : value >= 1.0
                          ? 'text-blue-400'
                          : 'text-gray-300'
                  }
                >
                  {(value as number).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 亲密度和忠诚度 */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400">亲密度</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500"
                  style={{ width: `${pet.intimacy}%` }}
                />
              </div>
              <span>{pet.intimacy}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">忠诚度</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${pet.loyalty}%` }}
                />
              </div>
              <span>{pet.loyalty}</span>
            </div>
          </div>
        </div>

        {/* 技能 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            技能 ({pet.skills.length}/{pet.maxSkills})
          </h4>
          {pet.skills.length === 0 ? (
            <p className="text-gray-500 text-sm">暂无技能</p>
          ) : (
            <div className="space-y-1">
              {pet.skills.map((skill) => (
                <div key={skill.id} className="text-sm bg-gray-700/50 rounded px-3 py-2 min-h-[44px] flex items-center">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-gray-400 ml-2 text-xs">{skill.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          {!pet.isActive && (
            <button
              onClick={handleSetActive}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium touch-btn min-h-[48px] active:scale-95 transition-transform"
            >
              ⚔️ 设为出战
            </button>
          )}
          <button
            onClick={handleRelease}
            className="w-full py-3 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg touch-btn min-h-[48px] active:scale-95 transition-transform"
          >
            🚪 放生
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-400 hover:text-white touch-btn min-h-[48px] active:scale-95 transition-transform"
          >
            关闭
          </button>
        </div>
      </div>

      {/* 确认弹窗 */}
      {ConfirmModalComponent}
    </div>
  );
}
