// ===== SEMANA 10 · INICIO =====
/**
 * Medidas del mapa de butacas.
 *
 * Compartidas entre la pantalla y los componentes de `seatmap`: la butaca
 * necesita el tamaño, y el viewport necesita el ancho y el alto del contenido.
 */
import { SPACING } from '../../../../theme';
import type { HallLayout } from '../../../../utils/theatre';

export const SEAT_SIZE = 22;
export const SEAT_GAP = 5;
export const ROW_LABEL_WIDTH = 24;
export const AISLE_EXTRA = SPACING.md;
export const STAGE_HEIGHT = 34;
export const ROW_HEIGHT = SEAT_SIZE + SEAT_GAP;
export const MAX_SEATS_PER_BOOKING = 8;

export interface SeatMapMetrics {
  contentWidth: number;
  contentHeight: number;
}

export function getSeatMapMetrics(layout: HallLayout): SeatMapMetrics {
  return {
    contentWidth: ROW_LABEL_WIDTH + layout.seatsPerRow * (SEAT_SIZE + SEAT_GAP) + AISLE_EXTRA,
    contentHeight: STAGE_HEIGHT + layout.rows * ROW_HEIGHT + SPACING.sm,
  };
}
// ===== SEMANA 10 · FIN =====
