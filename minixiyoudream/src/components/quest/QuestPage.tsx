// 任务页面组件 - 初始化任务系统并显示任务面板

import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { player, playerLevel } from '@/signals/playerSignals';
import {
  isQuestInitialized,
  initQuests,
} from '@/signals/questSignals';
import { QuestPanel } from './QuestPanel';

export function QuestPage() {
  useSignals();

  const currentPlayer = player.value;
  const level = playerLevel.value;
  const initialized = isQuestInitialized.value;

  useEffect(() => {
    if (currentPlayer && !initialized) {
      initQuests(currentPlayer.id, level);
    }
  }, [currentPlayer, initialized, level]);

  if (!currentPlayer) {
    return (
      <div className="game-panel p-8 text-center">
        <div className="text-4xl mb-3">📜</div>
        <p className="text-[var(--game-text-muted)]">请先创建角色</p>
      </div>
    );
  }

  return <QuestPanel />;
}

export default QuestPage;
