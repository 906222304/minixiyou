// 统一确认弹窗组件 - 游戏风格

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmModalProps {
  /** 是否显示 */
  isOpen: boolean;
  /** 标题 */
  title?: string;
  /** 内容文本 */
  message: string;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认按钮类型 */
  type?: 'danger' | 'warning' | 'info';
  /** 确认回调 */
  onConfirm: () => void;
  /** 取消回调 */
  onCancel: () => void;
  /** 是否显示图标 */
  showIcon?: boolean;
}

export function ConfirmModal({
  isOpen,
  title = '确认',
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'warning',
  onConfirm,
  onCancel,
  showIcon = true,
}: ConfirmModalProps) {
  // 键盘事件处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
  }, [isOpen, onCancel, onConfirm]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '❓';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          confirmBtn: 'bg-red-500 hover:bg-red-600 text-white',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-100',
          confirmBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
        };
    }
  };

  const styles = getTypeStyles();

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* 弹窗内容 */}
      <div
        className="relative game-panel p-4 sm:p-6 max-w-sm w-full animate-scale-in shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 图标和标题 */}
        <div className="flex items-center gap-3 mb-4">
          {showIcon && (
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${styles.iconBg} flex items-center justify-center text-2xl`}>
              {getIcon()}
            </div>
          )}
          <h3 className="text-lg font-bold text-[var(--game-text)]">{title}</h3>
        </div>

        {/* 消息内容 */}
        <p className="text-sm sm:text-base text-[var(--game-text-muted)] mb-6 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>

        {/* 按钮区域 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium
                       bg-gray-100 hover:bg-gray-200 text-gray-700
                       transition-colors min-h-[44px] active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium
                       transition-colors min-h-[44px] active:scale-95 ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/** Hook: 使用确认弹窗 */
export function useConfirmModal() {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
  });

  const showConfirm = useCallback((
    message: string,
    options?: {
      title?: string;
      type?: 'danger' | 'warning' | 'info';
      onConfirm?: () => void;
    }
  ) => {
    setState({
      isOpen: true,
      title: options?.title || '确认',
      message,
      type: options?.type || 'warning',
      onConfirm: options?.onConfirm,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.onConfirm?.();
    setState(prev => ({ ...prev, isOpen: false }));
  }, [state]);

  const handleCancel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const modalProps: ConfirmModalProps = {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    type: state.type,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return { showConfirm, modalProps, ConfirmModalComponent: <ConfirmModal {...modalProps} /> };
}

export default ConfirmModal;
