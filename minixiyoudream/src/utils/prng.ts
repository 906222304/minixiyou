// PRNG 伪随机数生成器

/** PRNG 类 - Mulberry32 算法 */
export class PRNG {
  private seed: number;
  private state: number;

  constructor(seed: number) {
    this.seed = seed;
    this.state = seed;
  }

  /** 重置到初始种子 */
  reset(): void {
    this.state = this.seed;
  }

  /** 设置新种子 */
  setSeed(seed: number): void {
    this.seed = seed;
    this.state = seed;
  }

  /** 获取当前种子 */
  getSeed(): number {
    return this.seed;
  }

  /** 生成下一个随机数 (0-1) */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** 生成指定范围内的整数 */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** 生成指定范围内的浮点数 */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /** 概率判定 */
  roll(chance: number): boolean {
    return this.next() * 100 < chance;
  }

  /** 从数组中随机选择一个元素 */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot choose from empty array');
    }
    return array[this.nextInt(0, array.length - 1)];
  }

  /** 随机打乱数组 */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /** 获取当前状态（用于存档） */
  getState(): number {
    return this.state;
  }

  /** 恢复状态（用于读档） */
  setState(state: number): void {
    this.state = state;
  }
}

// 全局 PRNG 实例
let globalPRNG: PRNG | null = null;

/** 获取全局 PRNG 实例 */
export function getPRNG(): PRNG {
  if (!globalPRNG) {
    globalPRNG = new PRNG(Date.now());
  }
  return globalPRNG;
}

/** 重置全局 PRNG */
export function resetPRNG(seed?: number): void {
  globalPRNG = new PRNG(seed ?? Date.now());
}

/** 使用全局 PRNG 生成随机数 */
export function random(): number {
  return getPRNG().next();
}

/** 使用全局 PRNG 生成随机整数 */
export function randomInt(min: number, max: number): number {
  return getPRNG().nextInt(min, max);
}

/** 使用全局 PRNG 进行概率判定 */
export function randomRoll(chance: number): boolean {
  return getPRNG().roll(chance);
}

/** 使用全局 PRNG 从数组中随机选择 */
export function randomChoice<T>(array: T[]): T {
  return getPRNG().choice(array);
}
