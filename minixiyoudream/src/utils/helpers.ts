// 通用工具函数

/** 格式化数字（添加千位分隔符） */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/** 格式化百分比 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** 格式化时间（秒转为时分秒） */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}时${minutes}分${secs}秒`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
}

/** 延迟执行 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 限制数值范围 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** 线性插值 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** 深拷贝 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** 防抖函数 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/** 节流函数 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/** 品质颜色映射 */
export const QUALITY_COLORS: Record<string, string> = {
  common: '#4b5563',  // 深灰色 - 在浅色背景上可见
  rare: '#0070DD',
  epic: '#A335EE',
  legendary: '#FF8000',
  mythic: '#E6CC80',
};

/** 获取品质颜色 */
export function getQualityColor(quality: string): string {
  return QUALITY_COLORS[quality] || QUALITY_COLORS.common;
}

/** 品质名称映射 */
export const QUALITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
  mythic: '神话',
};

/** 获取品质名称 */
export function getQualityName(quality: string): string {
  return QUALITY_NAMES[quality] || quality;
}
