// 日志工具

const IS_DEV = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (IS_DEV) console.log('[DEBUG]', ...args);
  },
  info: (...args: unknown[]) => {
    if (IS_DEV) console.info('[INFO]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
};
