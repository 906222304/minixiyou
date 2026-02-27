/** PRNG 接口 - 用于确定性随机数生成 */
export interface PRNG {
  nextFloat: (min?: number, max?: number) => number;
  roll: (chance: number) => boolean;
  nextInt: (min: number, max: number) => number;
}

/** 默认随机数生成器 */
export const defaultPrng: PRNG = {
  nextFloat: (min = 0, max = 1) => Math.random() * (max - min) + min,
  roll: (chance) => Math.random() * 100 < chance,
  nextInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

/** 创建种子随机数生成器（用于确定性随机） */
export function createSeededPrng(seed: number): PRNG {
  // 使用简单的线性同余生成器
  let state = seed;
  const random = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };

  return {
    nextFloat: (min = 0, max = 1) => random() * (max - min) + min,
    roll: (chance) => random() * 100 < chance,
    nextInt: (min, max) => Math.floor(random() * (max - min + 1)) + min,
  };
}
