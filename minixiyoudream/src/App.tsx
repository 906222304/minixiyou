import { useSignals } from '@preact/signals-react/runtime';
import { gamePhase } from '@/signals';
import { CharacterCreation } from '@/components/character/CharacterCreation';
import { GameLayout } from '@/components/layout/GameLayout';
import { BattleLayout } from '@/components/battle';

function App() {
  useSignals();

  const phase = gamePhase.value;

  // 角色创建阶段
  if (phase === 'creating') {
    return <CharacterCreation />;
  }

  // 战斗阶段
  if (phase === 'battle') {
    return <BattleLayout />;
  }

  // 游戏进行阶段
  if (phase === 'playing') {
    return <GameLayout />;
  }

  // 主菜单
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <div className="container mx-auto p-4 max-w-lg">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold text-primary-500">梦幻西游</h1>
          <p className="text-gray-400 mt-2">MiniXiyouDream</p>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fade-in">
            <h2 className="text-xl mb-8">欢迎来到西游世界</h2>
            <div className="space-y-4">
              <button
                className="w-full px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-lg font-medium transition-colors touch-btn"
                onClick={() => gamePhase.value = 'creating'}
              >
                开始游戏
              </button>
              <button
                className="w-full px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-medium transition-colors touch-btn"
                disabled
              >
                读取存档
              </button>
            </div>
          </div>
        </main>

        <footer className="text-center text-gray-500 text-sm py-4">
          MVP Version 0.1.0
        </footer>
      </div>
    </div>
  );
}

export default App;
