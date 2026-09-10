/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F8FAFC',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
        },
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
