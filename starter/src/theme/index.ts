// ===== SEMANA 02 · INICIO =====
export const COLORS = {
  background: '#14090c',
  surface: '#221116',
  surfaceAlt: '#2d161d',

  border: '#4a2a32',
  borderLight: '#351a21',

  textPrimary: '#f5ecd9',
  textSecondary: '#b8a58a',
  textMuted: '#8a7560',

  accent: '#d4a24c',
  accentDim: '#d4a24c33',
  accentHover: '#e5b565',

  success: '#3fb950',
  warning: '#f0883e',
  error: '#f85149',
  info: '#58a6ff',

  overlay: 'rgba(20, 9, 12, 0.75)',
} as const;

export const TYPOGRAPHY = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    display: 48,
  },
  lineHeight: {
    base: 20,
    lg: 24,
  },
  letterSpacing: {
    wide: 0.5,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 60,
} as const;

export const SIZES = {
  cardImageHeight: 160,
  pressedScale: 0.995,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
// ===== SEMANA 02 · FIN =====
