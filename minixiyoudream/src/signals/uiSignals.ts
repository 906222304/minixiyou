// UI状态管理

import { signal } from '@preact/signals-react';

/** 当前页面/面板 */
export type Page =
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
  | 'settings';

/** 当前页面 */
export const currentPage = signal<Page>('home');

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

/** 显示Toast */
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  toastMessage.value = message;
  toastType.value = type;

  // 3秒后自动关闭
  setTimeout(() => {
    toastMessage.value = null;
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
