// ============================================
// THEME — Semana 02: Dominio Teatro
// Constantes de diseño globales (Paleta Vino y Oro)
// ============================================

export const COLORS = {
  // Fondos principales (Inspiración: telón y atmósfera teatral)
  background: '#14090c',
  surface: '#221116',
  surfaceAlt: '#2d161d',

  // Bordes y separadores
  border: '#4a2a32',
  borderLight: '#351a21',

  // Tipografía y contrastes
  textPrimary: '#f5ecd9',   // Marfil cálido para títulos
  textSecondary: '#b8a58a', // Arena / dorado suave para subtítulos
  textMuted: '#8a7560',     // Tono apagado para detalles secundarios

  // Acento principal: Oro escénico / Dorado teatral
  accent: '#d4a24c',
  accentDim: '#d4a24c33',   // 20% de opacidad para fondos de chips/badges
  accentHover: '#e5b565',

  // Semánticos
  success: '#3fb950',
  warning: '#f0883e',
  error: '#f85149',
  info: '#58a6ff',

  // Overlay
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
