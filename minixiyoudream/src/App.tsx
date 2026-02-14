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

  // 主菜单 - 小清新风格
  return (
    <div className="min-h-screen text-[var(--game-text)] relative overflow-hidden">
      {/* 小清新背景 */}
      <div className="fixed inset-0">
        {/* 渐变背景 - 清新明亮 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e3f2fd] via-[#f5faff] to-[#fff8f0]" />

        {/* 云朵装饰 */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute w-20 h-10 bg-white rounded-full top-[5%] left-[10%] blur-sm" />
          <div className="absolute w-24 h-12 bg-white rounded-full top-[8%] left-[25%] blur-sm" />
          <div className="absolute w-16 h-8 bg-white rounded-full top-[12%] left-[60%] blur-sm" />
          <div className="absolute w-28 h-14 bg-white rounded-full top-[15%] left-[80%] blur-sm" />
          <div className="absolute w-32 h-16 bg-white rounded-full top-[20%] left-[15%] blur-sm" />
        </div>

        {/* 柔和光晕 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[var(--game-gold)]/10 rounded-full blur-[80px]" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto p-6 max-w-lg min-h-screen flex flex-col">
        {/* 头部 */}
        <header className="text-center pt-12 pb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--game-gold)]/20 to-white/50 border border-[var(--game-gold)]/30 mb-4 shadow-lg">
            <span className="text-5xl">🐉</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--game-gold)] mb-2">
            迷你西游梦
          </h1>
          <p className="text-[var(--game-text-muted)] text-sm tracking-widest">MiniXiyouDream</p>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full space-y-4 animate-fade-in">
            {/* 欢迎文字 */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-[var(--game-text)] mb-2">欢迎来到西游世界</h2>
              <p className="text-sm text-[var(--game-text-muted)]">踏上修仙之路，成就一段传奇</p>
            </div>

            {/* 按钮组 */}
            <div className="space-y-3">
              <button
                className="game-btn game-btn-primary w-full py-4 text-lg"
                onClick={() => gamePhase.value = 'creating'}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">⚔️</span>
                  <span>开始游戏</span>
                </span>
              </button>

              <button
                className="game-btn w-full py-4 opacity-60"
                disabled
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📂</span>
                  <span>读取存档</span>
                </span>
              </button>
            </div>

            {/* 功能预览 */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-[var(--game-border)]">
              <div className="text-center">
                <span className="text-2xl block mb-1">🗺️</span>
                <span className="text-xs text-[var(--game-text-muted)]">探索</span>
              </div>
              <div className="text-center">
                <span className="text-2xl block mb-1">⚔️</span>
                <span className="text-xs text-[var(--game-text-muted)]">战斗</span>
              </div>
              <div className="text-center">
                <span className="text-2xl block mb-1">🐉</span>
                <span className="text-xs text-[var(--game-text-muted)]">宠物</span>
              </div>
              <div className="text-center">
                <span className="text-2xl block mb-1">👥</span>
                <span className="text-xs text-[var(--game-text-muted)]">伙伴</span>
              </div>
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="text-center py-4">
          <p className="text-[var(--game-text-dim)] text-xs">MVP Version 0.1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
