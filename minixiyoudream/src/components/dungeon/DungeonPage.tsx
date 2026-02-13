// 副本页面组件

import { useSignals } from '@preact/signals-react/runtime';
import { playerLevel } from '@/signals';
import { getAllDungeons } from '@/constants/dungeons';
import { gamePhase } from '@/signals/gameSignals';

export function DungeonPage() {
  useSignals();

  const level = playerLevel.value;
  const dungeons = getAllDungeons();

  const canEnter = (dungeonId: string): boolean => {
    const dungeon = dungeons.find((d) => d.id === dungeonId);
    if (!dungeon) return false;
    return level >= dungeon.requirements.minLevel;
  };

  const handleEnter = (dungeonId: string) => {
    if (canEnter(dungeonId)) {
      // 进入战斗测试
      gamePhase.value = 'battle';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">副本</h2>

      {/* 副本列表 */}
      <div className="space-y-3">
        {dungeons.map((dungeon) => {
          const canEnterDungeon = canEnter(dungeon.id);

          return (
            <div
              key={dungeon.id}
              className={`card ${!canEnterDungeon ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dungeon.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{dungeon.name}</div>
                  <div className="text-sm text-gray-400">{dungeon.description}</div>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="text-gray-400">
                      推荐: Lv.{dungeon.difficulties[0]?.recommendedLevel}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-yellow-400">
                      奖励: {dungeon.baseRewards.exp}经验 {dungeon.baseRewards.gold}金币
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEnter(dungeon.id)}
                  disabled={!canEnterDungeon}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium touch-btn ${
                    canEnterDungeon
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {canEnterDungeon ? '进入' : `需要Lv.${dungeon.requirements.minLevel}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
