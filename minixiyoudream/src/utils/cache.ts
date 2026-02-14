// LRU 缓存实现 - 用于限制缓存大小，防止内存溢出

/**
 * LRU (Least Recently Used) 缓存类
 * 当缓存达到最大容量时，自动移除最久未使用的条目
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  /**
   * 创建 LRU 缓存实例
   * @param maxSize 最大缓存条目数，默认 100
   */
  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * 获取缓存值
   * 访问时会将条目移到最近使用的位置
   * @param key 缓存键
   * @returns 缓存值，如果不存在则返回 undefined
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // 删除并重新设置，使其成为最新使用的
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  /**
   * 设置缓存值
   * 如果缓存已满，会移除最久未使用的条目
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // 如果键已存在，先删除
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 缓存已满，移除最久未使用的（第一个）条目
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  /**
   * 检查缓存中是否存在指定键
   * @param key 缓存键
   * @returns 是否存在
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 删除缓存中的指定键
   * @param key 缓存键
   * @returns 是否成功删除
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取当前缓存大小
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * 获取最大缓存大小
   */
  get maxCacheSize(): number {
    return this.maxSize;
  }

  /**
   * 获取所有缓存键
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * 获取所有缓存值
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * 获取缓存条目
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries();
  }
}
