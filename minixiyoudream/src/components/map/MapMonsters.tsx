// 地图怪物展示组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  getCurrentMapMonsters,
  attackMonsterImmediately,
} from '@/signals/autoBattleSignals';
import { isInBattle } from '@/signals/battleSignals';
import { playerLevel } from '@/signals/playerSignals';

/** 难度颜色配置 */
const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
  normal: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  hard: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
  elite: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  boss: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
};

/** 难度名称 */
const DIFFICULTY_NAMES: Record<string, string> = {
  easy: '简单',
  normal: '普通',
  hard: '困难',
  elite: '精英',
  boss: 'BOSS',
};

/** 怪物组详情弹窗 */
function MonsterGroupDetail({
  monster,
  onClose,
  onAttack,
}: {
  monster: ReturnType<typeof getCurrentMapMonsters>[0];
  onClose: () => void;
  onAttack: () => void;
}) {
  const currentLevel = playerLevel.value;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* 头部 */}
        <div className={`p-4 ${DIFFICULTY_COLORS[monster.difficulty]?.bg || 'bg-gray-100'} rounded-t-xl border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{monster.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{monster.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[monster.difficulty]?.bg} ${DIFFICULTY_COLORS[monster.difficulty]?.text}`}>
                    {DIFFICULTY_NAMES[monster.difficulty] || monster.difficulty}
                  </span>
                  <span className="text-gray-500">
                    Lv.{Math.round(monster.avgLevel)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              x
            </button>
          </div>
        </div>

        {/* 描述 */}
        {monster.description && (
          <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600 italic">
            "{monster.description}"
          </div>
        )}

        {/* 数量信息 */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">怪物数量:</span>
            <span className="font-medium">
              {monster.minCount === monster.maxCount
                ? monster.minCount
                : `${monster.minCount} - ${monster.maxCount}`}
              只
            </span>
          </div>
        </div>

        {/* 怪物列表 */}
        <div className="p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">可能出现:</h4>
          <div className="space-y-2">
            {monster.enemies.map((enemy) => {
              const levelDiff = Math.round((enemy.minLevel + enemy.maxLevel) / 2) - currentLevel;
              const isDangerous = levelDiff > 3;
              const isTooWeak = levelDiff < -5;

              return (
                <div
                  key={enemy.templateId}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{enemy.icon}</span>
                    <span className="font-medium">{enemy.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      isDangerous ? 'text-red-600' :
                      isTooWeak ? 'text-gray-400' :
                      'text-green-600'
                    }`}>
                      Lv.{enemy.minLevel === enemy.maxLevel
                        ? enemy.minLevel
                        : `${enemy.minLevel}-${enemy.maxLevel}`}
                    </span>
                    {isDangerous && (
                      <span className="text-xs text-red-500">!</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onAttack}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          >
            发起攻击
          </button>
        </div>
      </div>
    </div>
  );
}

export function MapMonsters() {
  useSignals();

  const [selectedMonster, setSelectedMonster] = useState<ReturnType<typeof getCurrentMapMonsters>[0] | null>(null);

  const monsters = getCurrentMapMonsters();
  const currentLevel = playerLevel.value;
  const inBattle = isInBattle.value;

  if (monsters.length === 0) {
    return null;
  }

  const handleAttackClick = (groupId: string) => {
    if (inBattle) return;
    attackMonsterImmediately(groupId);
    setSelectedMonster(null);
  };

  return (
    <>
      <div className="game-panel p-4">
        <h4 className="text-sm font-bold text-[var(--game-gold-dark)] mb-3 flex items-center gap-2">
          <span>👹</span>
          <span>野外怪物</span>
          <span className="text-xs text-[var(--game-text-muted)] font-normal ml-auto">
            点击查看详情
          </span>
        </h4>

        <div className="space-y-2">
          {monsters.map((monster) => {
            const colors = DIFFICULTY_COLORS[monster.difficulty] || DIFFICULTY_COLORS.normal;
            const levelDiff = monster.avgLevel - currentLevel;
            const isDangerous = levelDiff > 3;
            const isTooWeak = levelDiff < -5;

            return (
              <div
                key={monster.groupId}
                onClick={() => !inBattle && setSelectedMonster(monster)}
                className={`p-3 rounded-lg border cursor-pointer transition-all
                  ${inBattle
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-md hover:scale-[1.02]'
                  }
                  ${colors.bg} ${colors.text} ${colors.border}
                `}
              >
                {/* 怪物组名称和等级 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{monster.icon}</span>
                    <span className="font-bold">{monster.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {DIFFICULTY_NAMES[monster.difficulty] || monster.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      isDangerous ? 'text-red-600' :
                      isTooWeak ? 'text-gray-400' :
                      'text-green-600'
                    }`}>
                      Lv.{Math.round(monster.avgLevel)}
                    </span>
                    {isDangerous && (
                      <span className="text-xs text-red-500">危险</span>
                    )}
                  </div>
                </div>

                {/* 怪物数量和预览 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">数量:</span>
                  <span className="text-xs font-medium">
                    {monster.minCount === monster.maxCount
                      ? monster.minCount
                      : `${monster.minCount}-${monster.maxCount}`}
                    只
                  </span>
                </div>

                {/* 怪物图标列表 */}
                <div className="flex flex-wrap gap-1.5">
                  {monster.enemies.map((enemy) => (
                    <div
                      key={enemy.templateId}
                      className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-md text-xs"
                      title={`${enemy.name} Lv.${enemy.minLevel === enemy.maxLevel ? enemy.minLevel : `${enemy.minLevel}-${enemy.maxLevel}`}`}
                    >
                      <span className="text-base">{enemy.icon}</span>
                      <span>{enemy.name}</span>
                    </div>
                  ))}
                </div>

                {/* 等级建议 */}
                {isDangerous && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <span>!</span>
                    <span>建议等级 {Math.round(monster.avgLevel) - 2}+ 挑战</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedMonster && (
        <MonsterGroupDetail
          monster={selectedMonster}
          onClose={() => setSelectedMonster(null)}
          onAttack={() => handleAttackClick(selectedMonster.groupId)}
        />
      )}
    </>
  );
}
