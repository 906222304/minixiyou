import { signal } from '@preact/signals-react';

// 游戏阶段
export type GamePhase = 'menu' | 'creating' | 'battle' | 'result';
export const gamePhase = signal<GamePhase>('menu');

// 游戏种子（用于PRNG）
export const gameSeed = signal(Date.now());

// 游戏时间
export const gameTime = signal({
  totalSeconds: 0,
  playDays: 0,
});
