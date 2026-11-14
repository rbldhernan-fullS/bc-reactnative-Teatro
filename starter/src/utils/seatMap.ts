// ===== SEMANA 10 · INICIO =====
import { SPACING } from '../theme';

/** Límites de zoom del mapa de butacas, compartidos por nativo y web. */
export const SEAT_MAP_MIN_SCALE = 0.5;
export const SEAT_MAP_MAX_SCALE = 2.5;
export const SEAT_MAP_MIN_INITIAL_SCALE = 0.55;

const VIEWPORT_PADDING = SPACING.base * 2;

/**
 * Mantiene el mapa dentro del viewport una vez escalado.
 *
 * Vive fuera de las pantallas porque la usan las dos variantes del viewport
 * (nativa y web) y así la matemática no se duplica.
 */
export function clampTranslation(
  value: number,
  contentSize: number,
  viewportSize: number,
  scale: number,
): number {
  'worklet';
  const limit = Math.max(0, (contentSize * scale - viewportSize) / 2);
  return Math.min(limit, Math.max(-limit, value));
}

/** Escala que hace caber el mapa en el ancho disponible (nunca amplía). */
export function getFitScale(contentWidth: number, viewportWidth: number): number {
  if (viewportWidth <= 0) {
    return 1;
  }

  return Math.min(1, (viewportWidth - VIEWPORT_PADDING) / contentWidth);
}

export function clampScale(value: number): number {
  return Math.min(SEAT_MAP_MAX_SCALE, Math.max(SEAT_MAP_MIN_SCALE, value));
}
// ===== SEMANA 10 · FIN =====
