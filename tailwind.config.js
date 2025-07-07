/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#f1fcf9',
          100: '#cff8f0',
          200: '#a0efe2',
          300: '#6de1d2',
          400: '#39c8ba',
          500: '#20aca1',
          600: '#178a83',
          700: '#166f6a',
          800: '#175856',
          900: '#174a47',
          950: '#072c2c',
        },
        // Secondary colors - 赤系
        secondary: {
          50: '#fdf3f4',
          100: '#fbe8e8',
          200: '#f8d3d6',
          300: '#f1b0b5',
          400: '#e9838e',
          500: '#e16d7c',
          600: '#c73750',
          700: '#a82842',
          800: '#8d243d',
          900: '#792239',
          950: '#430e1b',
        },
        // Key colors - Yellow系
        key: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        error: {
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
        // Background colors
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
        },
        // Text colors
        text: {
          DEFAULT: '#111827',
          secondary: '#6b7280',
          tertiary: '#9ca3af',
          inverse: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
