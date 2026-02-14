// 定时器管理器 - 统一管理定时器，防止内存泄漏

/**
 * 定时器管理器类
 * 用于集中管理 setTimeout 和 setInterval，便于统一清理
 */
export class TimerManager {
  private timers: Set<number> = new Set();
  private intervals: Set<number> = new Set();

  /**
   * 设置延时定时器
   * @param callback 回调函数
   * @param delay 延时时间（毫秒）
   * @returns 定时器ID
   */
  setTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);
    this.timers.add(id);
    return id;
  }

  /**
   * 设置循环定时器
   * @param callback 回调函数
   * @param delay 间隔时间（毫秒）
   * @returns 定时器ID
   */
  setInterval(callback: () => void, delay: number): number {
    const id = window.setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  /**
   * 清除延时定时器
   * @param id 定时器ID
   */
  clearTimeout(id: number): void {
    window.clearTimeout(id);
    this.timers.delete(id);
  }

  /**
   * 清除循环定时器
   * @param id 定时器ID
   */
  clearInterval(id: number): void {
    window.clearInterval(id);
    this.intervals.delete(id);
  }

  /**
   * 清除所有定时器
   */
  clearAll(): void {
    this.timers.forEach(id => window.clearTimeout(id));
    this.intervals.forEach(id => window.clearInterval(id));
    this.timers.clear();
    this.intervals.clear();
  }
}

/** 全局定时器管理器实例 */
export const globalTimerManager = new TimerManager();
