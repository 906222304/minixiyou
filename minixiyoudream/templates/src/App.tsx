import { useSignals } from '@preact/signals-react/runtime';
import { gamePhase } from '@/signals';

function App() {
  useSignals();

  const phase = gamePhase.value;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-primary-500">MiniXiyouDream</h1>
          <p className="text-gray-400 mt-2">西游题材文字RPG</p>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[60vh]">
          {phase === 'menu' && (
            <div className="text-center">
              <h2 className="text-2xl mb-8">欢迎来到西游世界</h2>
              <button
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-lg font-medium transition-colors"
                onClick={() => gamePhase.value = 'creating'}
              >
                开始游戏
              </button>
            </div>
          )}

          {phase === 'creating' && (
            <div className="text-center">
              <h2 className="text-2xl mb-4">角色创建</h2>
              <p className="text-gray-400">角色创建界面开发中...</p>
              <button
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                onClick={() => gamePhase.value = 'menu'}
              >
                返回
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-gray-500 text-sm py-4">
          MVP Version 0.1.0
        </footer>
      </div>
    </div>
  );
}

export default App;
