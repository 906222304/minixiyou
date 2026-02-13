/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 游戏主题色
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 品质颜色
        quality: {
          common: '#FFFFFF',    // 普通 - 白色
          rare: '#0070DD',      // 稀有 - 蓝色
          epic: '#A335EE',      // 史诗 - 紫色
          legendary: '#FF8000', // 传说 - 橙色
          mythic: '#E6CC80',    // 神话 - 金色
        },
        // 种族颜色
        race: {
          human: '#FFD700',     // 人族 - 金色
          celestial: '#00BFFF', // 仙族 - 天蓝
          demon: '#FF4500',     // 魔族 - 橙红
        },
      },
      fontFamily: {
        game: ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'damage-pop': 'damagePop 0.5s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        damagePop: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-30px) scale(1.2)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
