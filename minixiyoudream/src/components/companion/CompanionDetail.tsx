// 伙伴详情组件

import { useSignals } from '@preact/signals-react/runtime';
import type { Companion } from '@/types';

interface CompanionDetailProps {
  companion: Companion;
  onClose: () => void;
  onToggleActive: (companionId: string) => void;
}

export function CompanionDetail({ companion, onClose, onToggleActive }: CompanionDetailProps) {
  useSignals();

  const statNames: Record<string, string> = {
    physicalAttack: '物理攻击',
    physicalDefense: '物理防御',
    magicAttack: '法术攻击',
    magicDefense: '法术防御',
    speed: '速度',
    maxHp: '最大HP',
    maxMp: '最大MP',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#252540] w-full max-w-md rounded-t-2xl p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
        {/* 标题 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{companion.avatar}</span>
            <div>
              <h3 className="text-lg font-bold">{companion.name}</h3>
              <p className="text-sm text-gray-400">{companion.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white touch-btn"
          >
            ✕
          </button>
        </div>

        {/* 等级 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>等级</span>
            <span>Lv.{companion.level}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${(companion.exp / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* 好感度 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>好感度</span>
            <span>{companion.favorability}/100</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500"
              style={{ width: `${companion.favorability}%` }}
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
                style={{ width: `${(companion.hp / companion.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-20 text-right">
              {companion.hp}/{companion.maxHp}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400 w-8">MP</span>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(companion.mp / companion.maxMp) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-20 text-right">
              {companion.mp}/{companion.maxMp}
            </span>
          </div>
        </div>

        {/* 属性 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">属性</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(companion.finalStats)
              .filter(([key]) => statNames[key])
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-400">{statNames[key]}</span>
                  <span className="text-white">{Math.floor(value as number)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* 技能 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">技能</h4>
          <div className="space-y-1">
            {companion.skills.map((skill) => (
              <div key={skill.skillId} className="text-sm bg-gray-700/50 rounded px-2 py-1">
                <span className="text-white">{skill.skillId}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onToggleActive(companion.id);
              onClose();
            }}
            className={`w-full py-3 rounded-lg font-medium touch-btn ${
              companion.inParty
                ? 'bg-gray-600 hover:bg-gray-500'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {companion.inParty ? '休息' : '出战'}
          </button>
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
