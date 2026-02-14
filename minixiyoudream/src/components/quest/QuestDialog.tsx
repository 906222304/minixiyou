// 任务对话组件 - 梦幻西游风格

import { useEffect, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  currentDialog,
  currentDialogIndex,
  currentDialogLine,
  isDialogActive,
  advanceDialog,
  closeDialog,
} from '@/signals/questSignals';
import type { DialogLine } from '@/types/quest';

/** 单个对话气泡 */
function DialogBubble({ line, isPlayer }: { line: DialogLine; isPlayer: boolean }) {
  const getPositionClass = () => {
    if (isPlayer) return 'justify-end';
    return 'justify-start';
  };

  const getBubbleClass = () => {
    if (isPlayer) {
      return 'bg-[var(--game-gold)]/20 border-[var(--game-gold)]/30';
    }
    return 'bg-black/40 border-white/10';
  };

  return (
    <div className={`flex ${getPositionClass()} items-start gap-3 animate-fade-in`}>
      {/* 左侧头像 */}
      {!isPlayer && (
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl border-2 border-gray-600">
            {line.portrait || '👤'}
          </div>
        </div>
      )}

      {/* 对话内容 */}
      <div className={`flex-1 max-w-[70%] ${isPlayer ? 'text-right' : ''}`}>
        <div className="text-sm text-[var(--game-text-muted)] mb-1">
          {line.speaker}
        </div>
        <div
          className={`
            p-4 rounded-2xl border
            ${getBubbleClass()}
            ${isPlayer ? 'rounded-tr-sm' : 'rounded-tl-sm'}
          `}
        >
          <p className="text-white leading-relaxed">{line.text}</p>
        </div>
      </div>

      {/* 右侧头像 */}
      {isPlayer && (
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--game-gold)]/30 to-[var(--game-gold)]/10 flex items-center justify-center text-2xl border-2 border-[var(--game-gold)]/50">
            {line.portrait || '👤'}
          </div>
        </div>
      )}
    </div>
  );
}

/** 对话显示区域 */
function DialogContent() {
  useSignals();

  const dialog = currentDialog.value;
  const index = currentDialogIndex.value;
  const currentLine = currentDialogLine.value;

  if (!dialog || !currentLine) return null;

  // 判断是否是玩家说话
  const isPlayer = currentLine.position === 'right' || currentLine.speaker === '你';

  // 获取历史对话
  const historyLines = dialog.slice(0, index);

  return (
    <div className="flex flex-col h-full">
      {/* 历史对话区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {historyLines.map((line, idx) => (
          <DialogBubble
            key={idx}
            line={line}
            isPlayer={line.position === 'right' || line.speaker === '你'}
          />
        ))}

        {/* 当前对话 */}
        <DialogBubble line={currentLine} isPlayer={isPlayer} />
      </div>

      {/* 继续提示 */}
      <div className="p-4 border-t border-white/10 text-center">
        <button
          onClick={advanceDialog}
          className="text-[var(--game-text-muted)] hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <span>
            {index < dialog.length - 1 ? '点击继续' : '点击结束对话'}
          </span>
          <span className="animate-bounce">▼</span>
        </button>
      </div>
    </div>
  );
}

/** 全屏对话模式（有背景） */
function FullscreenDialog() {
  useSignals();

  const dialog = currentDialog.value;
  const currentLine = currentDialogLine.value;

  if (!dialog || !currentLine) return null;

  const isPlayer = currentLine.position === 'right' || currentLine.speaker === '你';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
        onClick={advanceDialog}
      />

      {/* 对话框 */}
      <div className="relative w-full max-w-2xl mx-4 mb-8">
        {/* 场景描述（如果有） */}
        {currentLine.speaker === '旁白' && (
          <div className="text-center mb-4 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-black/50 rounded-lg border border-white/10">
              <p className="text-white/80 italic text-lg">{currentLine.text}</p>
            </div>
          </div>
        )}

        {/* 角色立绘区域（可以扩展为实际图片） */}
        <div className="flex justify-between items-end mb-4 h-40">
          {/* 左侧角色 */}
          {!isPlayer && currentLine.speaker !== '旁白' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-4xl border-2 border-gray-600 shadow-lg">
                {currentLine.portrait || '👤'}
              </div>
              <div className="mt-2 px-3 py-1 bg-black/50 rounded text-sm text-white">
                {currentLine.speaker}
              </div>
            </div>
          )}

          {/* 右侧角色（玩家） */}
          {isPlayer && (
            <div className="flex flex-col items-center ml-auto animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--game-gold)]/30 to-[var(--game-gold)]/10 flex items-center justify-center text-4xl border-2 border-[var(--game-gold)]/50 shadow-lg">
                {currentLine.portrait || '👤'}
              </div>
              <div className="mt-2 px-3 py-1 bg-black/50 rounded text-sm text-[var(--game-gold)]">
                {currentLine.speaker}
              </div>
            </div>
          )}
        </div>

        {/* 对话内容框 */}
        {currentLine.speaker !== '旁白' && (
          <div
            className="bg-white/95 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all hover:brightness-105 shadow-lg border border-[var(--game-border)]"
            onClick={advanceDialog}
          >
            {/* 说话者名字 */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--game-border)]">
              <span className={`font-bold ${isPlayer ? 'text-[var(--game-gold)]' : 'text-gray-800'}`}>
                {currentLine.speaker}
              </span>
            </div>

            {/* 对话内容 */}
            <p className="text-gray-700 leading-relaxed text-lg">
              {currentLine.text}
            </p>

            {/* 继续提示 */}
            <div className="mt-4 text-right">
              <span className="text-gray-400 text-sm animate-pulse">
                {currentDialogIndex.value < dialog.length - 1 ? '点击继续 ▼' : '点击结束 ▼'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 紧凑对话模式（小窗口） */
function CompactDialog() {
  useSignals();

  const dialog = currentDialog.value;
  const currentLine = currentDialogLine.value;

  if (!dialog || !currentLine) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 max-w-lg mx-auto">
      <div className="game-panel p-4 animate-slide-up">
        <DialogContent />
      </div>
    </div>
  );
}

/** 任务对话组件 */
export function QuestDialog({ fullscreen = true }: { fullscreen?: boolean }) {
  useSignals();

  const isActive = isDialogActive.value;

  // 键盘事件处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        advanceDialog();
        break;
      case 'Escape':
        e.preventDefault();
        closeDialog();
        break;
    }
  }, [isActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isActive) return null;

  if (fullscreen) {
    return <FullscreenDialog />;
  }

  return <CompactDialog />;
}

/** 简单对话弹窗（用于快速确认） */
export function SimpleDialog({
  lines,
  onComplete,
  fullscreen = false,
}: {
  lines: DialogLine[];
  onComplete: () => void;
  fullscreen?: boolean;
}) {
  useSignals();

  // 临时设置对话
  useEffect(() => {
    currentDialog.value = lines;
    currentDialogIndex.value = 0;

    return () => {
      currentDialog.value = null;
      currentDialogIndex.value = 0;
    };
  }, [lines]);

  // 监听对话结束
  useEffect(() => {
    if (!isDialogActive.value) {
      onComplete();
    }
  }, [isDialogActive.value, onComplete]);

  if (!isDialogActive.value) return null;

  if (fullscreen) {
    return <FullscreenDialog />;
  }

  return <CompactDialog />;
}

export default QuestDialog;
