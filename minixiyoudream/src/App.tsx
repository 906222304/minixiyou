import { useEffect, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { gamePhase, player } from '@/signals';
import { startMpRegeneration, stopMpRegeneration } from '@/signals/playerSignals';
import { CharacterCreation } from '@/components/character/CharacterCreation';
import { GameLayout } from '@/components/layout/GameLayout';
import { BattleLayout } from '@/components/battle';
import { autoSave, loadAutoSave, hasAutoSave, list, load, deleteSave, type SaveInfo } from '@/services/saveService';

/** 扩展的存档信息（包含自动存档） */
interface ExtendedSaveInfo extends SaveInfo {
  isAuto?: boolean;
}

function App() {
  useSignals();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSave, setHasSave] = useState(false);
  const [showSaveList, setShowSaveList] = useState(false);
  const [saveList, setSaveList] = useState<ExtendedSaveInfo[]>([]);
  const [loadingSaveId, setLoadingSaveId] = useState<number | null>(null);

  const phase = gamePhase.value;

  // 加载存档列表（包含自动存档）
  const loadSaveList = async () => {
    const saves = await list();
    const autoSaveExists = await hasAutoSave();

    // 将自动存档添加到列表顶部
    const extendedSaves: ExtendedSaveInfo[] = [];

    if (autoSaveExists) {
      extendedSaves.push({
        id: -1, // 使用特殊ID表示自动存档
        name: '自动存档',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        playTime: 0,
        currentMapId: '',
        isAuto: true,
      });
    }

    extendedSaves.push(...saves);
    setSaveList(extendedSaves);
    setHasSave(autoSaveExists || saves.length > 0);
  };

  // 启动时检查并加载存档
  useEffect(() => {
    async function initGame() {
      try {
        const saved = await hasAutoSave();
        setHasSave(saved);
        await loadSaveList();

        if (saved) {
          const result = await loadAutoSave();
          if (result.success && result.data?.player) {
            gamePhase.value = 'playing';
          }
        }
      } catch (error) {
        console.error('Failed to load save:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initGame();
  }, []);

  // 自动存档 - 每30秒保存一次
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(() => {
      if (player.value) {
        autoSave().catch(console.error);
      }
    }, 30000);

    // 页面关闭时保存
    const handleBeforeUnload = () => {
      if (player.value) {
        autoSave().catch(console.error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [phase]);

  // 启动MP自动恢复
  useEffect(() => {
    if (phase === 'playing') {
      startMpRegeneration();
    } else {
      stopMpRegeneration();
    }

    return () => {
      stopMpRegeneration();
    };
  }, [phase]);

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e3f2fd] to-[#fff8f0]">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">🐉</div>
          <p className="text-[var(--game-text-muted)]">加载中...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen text-[var(--game-text)] relative overflow-hidden pt-[env(safe-area-inset-top)]">
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
                className="game-btn game-btn-primary w-full py-4 text-lg touch-manipulation"
                onClick={() => gamePhase.value = 'creating'}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">⚔️</span>
                  <span>开始游戏</span>
                </span>
              </button>

              <button
                className="game-btn w-full py-4 touch-manipulation disabled:opacity-50"
                disabled={!hasSave}
                onClick={async () => {
                  if (hasSave) {
                    const result = await loadAutoSave();
                    if (result.success) {
                      gamePhase.value = 'playing';
                    }
                  }
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">▶️</span>
                  <span>{hasSave ? '继续游戏' : '无存档'}</span>
                </span>
              </button>

              <button
                className="game-btn w-full py-4 touch-manipulation disabled:opacity-50"
                disabled={saveList.length === 0}
                onClick={() => setShowSaveList(true)}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📂</span>
                  <span>读取存档 {saveList.length > 0 && `(${saveList.length})`}</span>
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
        <footer className="text-center py-4 pb-[env(safe-area-inset-bottom)]">
          <p className="text-[var(--game-text-dim)] text-xs">MVP Version 0.1.0</p>
        </footer>
      </div>

      {/* 存档选择弹窗 */}
      {showSaveList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* 标题 */}
            <div className="bg-gradient-to-r from-[var(--game-primary)] to-[var(--game-secondary)] p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>📂</span>
                  <span>选择存档</span>
                </h3>
                <button
                  onClick={() => setShowSaveList(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 存档列表 */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {saveList.length === 0 ? (
                <div className="text-center py-8 text-[var(--game-text-muted)]">
                  <span className="text-4xl block mb-2">📭</span>
                  <p>暂无存档</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {saveList.map((saveItem) => (
                    <div
                      key={saveItem.id}
                      className={`game-panel p-4 hover:shadow-lg transition-shadow cursor-pointer ${saveItem.isAuto ? 'border-blue-200 bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1"
                          onClick={async () => {
                            if (loadingSaveId) return;
                            setLoadingSaveId(saveItem.id);

                            let result;
                            if (saveItem.isAuto) {
                              // 加载自动存档
                              result = await loadAutoSave();
                            } else {
                              // 加载手动存档
                              result = await load(saveItem.id);
                            }

                            setLoadingSaveId(null);
                            if (result.success) {
                              setShowSaveList(false);
                              gamePhase.value = 'playing';
                            }
                          }}
                        >
                          <div className="font-medium text-[var(--game-text)] mb-1 flex items-center gap-2">
                            {saveItem.isAuto && <span className="text-blue-500">🔄</span>}
                            {saveItem.name}
                          </div>
                          {!saveItem.isAuto && (
                            <>
                              <div className="text-sm text-[var(--game-text-muted)] flex items-center gap-3">
                                {saveItem.playerName && (
                                  <span>👤 {saveItem.playerName}</span>
                                )}
                                {saveItem.playerLevel && (
                                  <span>Lv.{saveItem.playerLevel}</span>
                                )}
                              </div>
                              <div className="text-xs text-[var(--game-text-dim)] mt-1">
                                {new Date(saveItem.updatedAt).toLocaleString('zh-CN')}
                              </div>
                            </>
                          )}
                          {saveItem.isAuto && (
                            <div className="text-xs text-blue-500 mt-1">
                              自动保存，退出游戏时更新
                            </div>
                          )}
                        </div>
                        {!saveItem.isAuto && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm('确定要删除这个存档吗？')) {
                                await deleteSave(saveItem.id);
                                await loadSaveList();
                              }
                            }}
                            className="ml-2 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            删除
                          </button>
                        )}
                      </div>
                      {loadingSaveId === saveItem.id && (
                        <div className="mt-2 text-xs text-[var(--game-gold)]">加载中...</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="p-4 border-t border-[var(--game-border)]">
              <button
                onClick={() => setShowSaveList(false)}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
