/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: {
          50: '#fafaf8',
          100: '#f2f1ec',
          200: '#e3e1d7',
          300: '#ccc9bc',
          400: '#b0ab99',
          500: '#96907c',
          600: '#7d7766',
          700: '#676254',
          800: '#554f45',
          900: '#47433b',
          950: '#1c1a16',
        },
        gold: {
          DEFAULT: '#d4a843',
          light: '#e8c96b',
          dark: '#a8822e',
          muted: '#f5edd8',
        },
        teal: {
          DEFAULT: '#2a7c7c',
          light: '#3da8a8',
          dark: '#1e5c5c',
          muted: '#d4eded',
        },
        rose: { DEFAULT: '#c24b6e', light: '#e06d8a', dark: '#9c3457', muted: '#fce8ef' },
        violet: { DEFAULT: '#6b4fa8', light: '#8e72c4', dark: '#4f3884', muted: '#ede8f8' },
        success: '#2d7a4f',
        warning: '#b5620e',
        danger: '#a32d2d',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
