// ============================================
// UTILS: theatre — Semanas 09 y 10
// Aforo por sala, ocupación y generación del mapa de butacas
// ============================================

import type { Item, Seat, TheatreHall } from '../types';

export interface HallLayout {
  rows: number;
  seatsPerRow: number;
}

/**
 * Distribución física de cada sala. El número total de butacas se deriva de
 * estas dimensiones para que el mapa de la Semana 10 y la barra de ocupación
 * de la Semana 09 nunca se contradigan.
 */
export const HALL_LAYOUT: Record<TheatreHall, HallLayout> = {
  'Sala Principal': { rows: 10, seatsPerRow: 32 },
  'Sala de Cámara': { rows: 8, seatsPerRow: 15 },
  'Teatro Experimental': { rows: 8, seatsPerRow: 10 },
};

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

/**
 * Hash determinista y barato para repartir las butacas ocupadas de una obra.
 * Así el mismo mapa se mantiene estable entre renders y visitas.
 */
function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Construye el mapa completo de una función: todas las butacas de la sala,
 * marcando como ocupadas exactamente `capacidad - availableSeats`.
 */
export function buildSeatMap(
  item: Pick<Item, 'id' | 'hall' | 'availableSeats'>
): Seat[] {
  const layout = HALL_LAYOUT[item.hall];
  const totalSeats = layout.rows * layout.seatsPerRow;
  const availableSeats = Math.min(
    totalSeats,
    Math.max(0, item.availableSeats)
  );
  const occupiedCount = totalSeats - availableSeats;
  const occupiedIndices = new Set<number>();

  let state = hashString(`${item.id}-${item.hall}`) || 1;

  while (occupiedIndices.size < occupiedCount) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    occupiedIndices.add(state % totalSeats);
  }

  const seats: Seat[] = [];

  for (let rowIndex = 0; rowIndex < layout.rows; rowIndex += 1) {
    const row = ROW_LABELS[rowIndex] ?? `F${rowIndex + 1}`;

    for (let seatNumber = 1; seatNumber <= layout.seatsPerRow; seatNumber += 1) {
      const seatIndex = rowIndex * layout.seatsPerRow + (seatNumber - 1);

      seats.push({
        id: `${row}${seatNumber}`,
        row,
        number: seatNumber,
        status: occupiedIndices.has(seatIndex) ? 'occupied' : 'available',
      });
    }
  }

  return seats;
}
