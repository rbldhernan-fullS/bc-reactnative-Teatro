// ============================================
// UTILS: theatre — Semana 09
// Aforo por sala y ocupación usada por la barra de progreso
// ============================================

import type { TheatreHall } from '../types';

/**
 * Distribución física de cada sala. El número total de butacas se deriva de
 * estas dimensiones para que el mapa de la Semana 10 y la barra de ocupación
 * de la Semana 09 nunca se contradigan.
 */
export const HALL_LAYOUT: Record<
  TheatreHall,
  { rows: number; seatsPerRow: number }
> = {
  'Sala Principal': { rows: 10, seatsPerRow: 32 },
  'Sala de Cámara': { rows: 8, seatsPerRow: 15 },
  'Teatro Experimental': { rows: 8, seatsPerRow: 10 },
};

/** Capacidad total de butacas de una sala. */
export function getHallCapacity(hall: TheatreHall): number {
  const layout = HALL_LAYOUT[hall];
  return layout.rows * layout.seatsPerRow;
}

/**
 * Proporción de butacas ocupadas (0 = sala vacía, 1 = lleno).
 * Se acota para tolerar datos de la API fuera de rango.
 */
export function getHallOccupancy(
  hall: TheatreHall,
  availableSeats: number
): number {
  const capacity = getHallCapacity(hall);
  const occupiedSeats = capacity - availableSeats;
  return Math.min(1, Math.max(0, occupiedSeats / capacity));
}
