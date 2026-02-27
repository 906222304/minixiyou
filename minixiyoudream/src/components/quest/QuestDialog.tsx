// 任务对话组件
// 特性: 立绘系统、入场动画、选项系统

import { useEffect, useState, useCallback } from 'react';
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

/** 立绘组件 */
function CharacterPortrait({
  speaker,
  portrait,
  position,
  isSpeaking,
}: {
  speaker: string;
  portrait?: string;
  position: 'left' | 'right';
  isSpeaking?: boolean;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, [speaker]);

  // 判断是否使用图片头像
  const isImagePortrait = portrait?.startsWith('avatar_') || portrait?.startsWith('/');
  const avatarUrl = isImagePortrait && portrait?.startsWith('avatar_')
    ? `/avatars/${portrait}_large.png`
    : portrait;

  return (
    <div
      className={`
        absolute bottom-28 sm:bottom-32 ${position === 'left' ? 'left-2 sm:left-8' : 'right-2 sm:right-8'}
        w-24 sm:w-40 h-32 sm:h-56
        transition-all duration-500 ease-out
        ${entered
          ? 'translate-y-0 opacity-100'
          : `${position === 'left' ? '-translate-x-full' : 'translate-x-full'} opacity-0`
        }
        ${isSpeaking ? 'scale-105 z-10' : 'scale-100'}
      `}
      style={{
        filter: isSpeaking ? 'drop-shadow(0 0 20px rgba(251,191,36,0.5))' : 'none',
      }}
    >
      {/* 角色图片 */}
      {isImagePortrait && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={speaker}
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.5))',
          }}
        />
      ) : (
        /* Emoji头像 */
        <div
          className={`
            w-16 h-16 sm:w-28 sm:h-28 mx-auto
            rounded-full flex items-center justify-center text-3xl sm:text-5xl
            ${position === 'left'
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600'
              : 'bg-gradient-to-br from-amber-400/30 to-amber-500/10 border-2 border-amber-400/50'
            }
            shadow-lg
          `}
        >
          {portrait || '👤'}
        </div>
      )}

      {/* 角色名称标签 */}
      <div
        className={`
          absolute -bottom-2 left-1/2 -translate-x-1/2
          px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium
          ${position === 'left'
            ? 'bg-gray-800/90 text-white'
            : 'bg-amber-500/90 text-white'
          }
          whitespace-nowrap shadow-lg
        `}
      >
        {speaker}
      </div>

      {/* 说话指示器 */}
      {isSpeaking && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}

/** 增强版对话框 */
function EnhancedDialog() {
  useSignals();

  const dialog = currentDialog.value;
  const currentLine = currentDialogLine.value;

  if (!dialog || !currentLine) return null;

  const isPlayer = currentLine.position === 'right' || currentLine.speaker === '你';
  const isNarrator = currentLine.speaker === '旁白';

  return (
    <div className="dialog-container">
      {/* 背景遮罩 */}
      <div className="dialog-overlay" onClick={advanceDialog} />

      {/* 角色立绘 */}
      {!isNarrator && (
        <>
          {!isPlayer && (
            <CharacterPortrait
              speaker={currentLine.speaker}
              portrait={currentLine.portrait}
              position="left"
              isSpeaking={true}
            />
          )}
          {isPlayer && (
            <CharacterPortrait
              speaker={currentLine.speaker}
              portrait={currentLine.portrait}
              position="right"
              isSpeaking={true}
            />
          )}
        </>
      )}

      {/* 对话框 */}
      <DialogBox
        line={currentLine}
        isPlayer={isPlayer}
        isNarrator={isNarrator}
        hasNext={currentDialogIndex.value < dialog.length - 1}
      />
    </div>
  );
}

/** 对话框组件 */
function DialogBox({
  line,
  isPlayer,
  isNarrator,
  hasNext,
}: {
  line: DialogLine;
  isPlayer: boolean;
  isNarrator: boolean;
  hasNext: boolean;
}) {
  // 旁白模式
  if (isNarrator) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="max-w-2xl text-center animate-fade-in cursor-pointer"
          onClick={advanceDialog}
        >
          <div className="px-8 py-6 bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-xl text-white/90 italic leading-relaxed">
              {line.text}
            </p>
          </div>
          <div className="mt-4 text-white/60 text-sm animate-pulse">
            点击继续 ▼
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dialog-box dialog-appear cursor-pointer"
      onClick={advanceDialog}
    >
      {/* 头部装饰 */}
      <div className="dialog-header-decoration" />

      {/* 说话者信息 */}
      <div className="dialog-speaker">
        <span
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-xl
            ${isPlayer
              ? 'bg-gradient-to-br from-amber-400 to-amber-500'
              : 'bg-gradient-to-br from-gray-600 to-gray-700'
            }
          `}
        >
          {line.portrait || (isPlayer ? '👤' : ' npc')}
        </span>
        <div>
          <div className={`dialog-speaker-name ${isPlayer ? 'text-amber-600' : 'text-gray-800'}`}>
            {line.speaker}
          </div>
          {line.title && (
            <div className="dialog-speaker-title">{line.title}</div>
          )}
        </div>
      </div>

      {/* 对话内容 */}
      <div className="dialog-content">
        {line.text}
      </div>

      {/* 选项区域（如果有） */}
      {line.options && line.options.length > 0 && (
        <div className="dialog-options">
          {line.options.map((option, index) => (
            <button
              key={index}
              className="dialog-option"
              onClick={(e) => {
                e.stopPropagation();
                option.action?.();
                advanceDialog();
              }}
            >
              <span className="dialog-option-icon">
                {option.icon || '💬'}
              </span>
              <span className="dialog-option-text">{option.text}</span>
              <span className="text-gray-400">→</span>
            </button>
          ))}
        </div>
      )}

      {/* 继续提示 */}
      {!line.options && (
        <div className="dialog-continue">
          {hasNext ? '点击继续 ▼' : '点击结束 ▼'}
        </div>
      )}
    </div>
  );
}

/** 紧凑模式对话（用于小屏幕或嵌入式场景） */
function CompactDialogEnhanced() {
  useSignals();

  const dialog = currentDialog.value;
  const currentLine = currentDialogLine.value;

  if (!dialog || !currentLine) return null;

  const isPlayer = currentLine.position === 'right' || currentLine.speaker === '你';

  return (
    <div className="fixed left-4 right-4 z-40 max-w-lg mx-auto" style={{ bottom: 'calc(7rem + env(safe-area-inset-bottom) + 0.5rem)' }}>
      <div
        className="game-panel p-3 sm:p-4 animate-slide-up cursor-pointer"
        onClick={advanceDialog}
      >
        {/* 说话者 */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--game-border)]">
          <span
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-lg
              ${isPlayer ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}
            `}
          >
            {currentLine.portrait || '👤'}
          </span>
          <span className={`font-medium ${isPlayer ? 'text-amber-600' : 'text-gray-700'}`}>
            {currentLine.speaker}
          </span>
        </div>

        {/* 内容 */}
        <p className="text-[var(--game-text)] leading-relaxed text-sm sm:text-base">
          {currentLine.text}
        </p>

        {/* 继续提示 */}
        <div className="text-right mt-2 text-xs text-[var(--game-text-muted)]">
          {currentDialogIndex.value < dialog.length - 1 ? '点击继续 ▼' : '点击结束 ▼'}
        </div>
      </div>
    </div>
  );
}

/** 主组件 */
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
    return <EnhancedDialog />;
  }

  return <CompactDialogEnhanced />;
}

/** 简单对话弹窗 */
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

  useEffect(() => {
    currentDialog.value = lines;
    currentDialogIndex.value = 0;

    return () => {
      currentDialog.value = null;
      currentDialogIndex.value = 0;
    };
  }, [lines]);

  useEffect(() => {
    if (!isDialogActive.value) {
      onComplete();
    }
  }, [isDialogActive.value, onComplete]);

  if (!isDialogActive.value) return null;

  if (fullscreen) {
    return <EnhancedDialog />;
  }

  return <CompactDialogEnhanced />;
}

export default QuestDialog;
