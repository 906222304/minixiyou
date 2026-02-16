// UI状态管理

import { signal } from '@preact/signals-react';
import { TimerManager } from '@/utils/timerManager';

/** Toast定时器管理器 */
const toastTimerManager = new TimerManager();

/** 当前页面/面板 */
export type Page =
  | 'explore'
  | 'home'
  | 'character'
  | 'inventory'
  | 'skills'
  | 'map'
  | 'battle'
  | 'pet'
  | 'companion'
  | 'dungeon'
  | 'cultivation'
  | 'achievement'
  | 'quest'
  | 'settings';

/** 当前页面 - 默认西游页面，开放世界体验 */
export const currentPage = signal<Page>('explore');

/** 是否显示侧边栏 */
export const showSidebar = signal(false);

/** 是否显示加载中 */
export const isLoading = signal(false);

/** 加载提示文本 */
export const loadingText = signal('');

/** Toast消息 */
export const toastMessage = signal<string | null>(null);

/** Toast类型 */
export const toastType = signal<'success' | 'error' | 'info'>('info');

/** 是否显示模态框 */
export const showModal = signal(false);

/** 模态框内容 */
export const modalContent = signal<{
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
} | null>(null);

/** 导航到页面 */
export function navigateTo(page: Page): void {
  currentPage.value = page;
  showSidebar.value = false;
}

/** 切换侧边栏 */
export function toggleSidebar(): void {
  showSidebar.value = !showSidebar.value;
}

/** 关闭侧边栏 */
export function closeSidebar(): void {
  showSidebar.value = false;
}

/** 返回西游页面 */
export function returnToExplore(): void {
  currentPage.value = 'explore';
  showSidebar.value = false;
}

/** 任务导航来源类型 */
export type QuestNavigationSource = 'normal' | 'claimable' | 'available';

/** 任务导航来源 - 用于自动切换任务视图 */
export const questNavigationSource = signal<QuestNavigationSource>('normal');

/** 导航到任务页面（带来源参数） */
export function navigateToQuest(source: QuestNavigationSource = 'normal'): void {
  questNavigationSource.value = source;
  currentPage.value = 'quest';
  showSidebar.value = false;
}

/** 显示加载 */
export function showLoading(text: string = '加载中...'): void {
  loadingText.value = text;
  isLoading.value = true;
}

/** 隐藏加载 */
export function hideLoading(): void {
  isLoading.value = false;
  loadingText.value = '';
}

/** 当前Toast定时器ID */
let currentToastTimerId: number | null = null;

/** 显示Toast */
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  toastMessage.value = message;
  toastType.value = type;

  // 清除之前的定时器
  if (currentToastTimerId !== null) {
    toastTimerManager.clearTimeout(currentToastTimerId);
  }

  // 3秒后自动关闭
  currentToastTimerId = toastTimerManager.setTimeout(() => {
    toastMessage.value = null;
    currentToastTimerId = null;
  }, 3000);
}

/** 显示成功Toast */
export function showSuccess(message: string): void {
  showToast(message, 'success');
}

/** 显示错误Toast */
export function showError(message: string): void {
  showToast(message, 'error');
}

/** 显示确认对话框 */
export function showConfirm(
  title: string,
  message: string,
  onConfirm?: () => void,
  onCancel?: () => void
): void {
  modalContent.value = { title, message, onConfirm, onCancel };
  showModal.value = true;
}

/** 关闭模态框 */
export function closeModal(): void {
  showModal.value = false;
  modalContent.value = null;
}

/** 确认模态框 */
export function confirmModal(): void {
  if (modalContent.value?.onConfirm) {
    modalContent.value.onConfirm();
  }
  closeModal();
}

/** 取消模态框 */
export function cancelModal(): void {
  if (modalContent.value?.onCancel) {
    modalContent.value.onCancel();
  }
  closeModal();
}
