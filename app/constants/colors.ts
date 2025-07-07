export const Colors = {
  // Primary colors - Blue系
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // Secondary colors - グレー系
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
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
} as const;

// Commonly used color combinations
export const ColorPalette = {
  // Primary button styles
  primaryButton: {
    background: Colors.primary[600],
    text: Colors.text.inverse,
    hover: Colors.primary[700],
    active: Colors.primary[800],
  },
  // Secondary button styles
  secondaryButton: {
    background: Colors.secondary[200],
    text: Colors.secondary[700],
    hover: Colors.secondary[300],
    active: Colors.secondary[400],
  },
  // Key accent button styles
  keyButton: {
    background: Colors.key[400],
    text: Colors.secondary[900],
    hover: Colors.key[500],
    active: Colors.key[600],
  },
  // Card styles
  card: {
    background: Colors.background.DEFAULT,
    border: Colors.secondary[200],
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  // Status colors
  status: {
    success: Colors.success[500],
    warning: Colors.warning[500],
    error: Colors.error[500],
    info: Colors.primary[500],
  },
} as const;

// Type definitions for better TypeScript support
export type ColorScale = typeof Colors.primary;
export type ThemeColors = typeof Colors;
export type ColorPaletteType = typeof ColorPalette;
