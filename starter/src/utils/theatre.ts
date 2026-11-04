// ===== SEMANA 09 · INICIO =====
import type { TheatreHall } from '../types';

export const HALL_LAYOUT: Record<
  TheatreHall,
  { rows: number; seatsPerRow: number }
> = {
  'Sala Principal': { rows: 10, seatsPerRow: 32 },
  'Sala de Cámara': { rows: 8, seatsPerRow: 15 },
  'Teatro Experimental': { rows: 8, seatsPerRow: 10 },
};

export function getHallCapacity(hall: TheatreHall): number {
  const layout = HALL_LAYOUT[hall];
  return layout.rows * layout.seatsPerRow;
}

export function getHallOccupancy(
  hall: TheatreHall,
  availableSeats: number
): number {
  const capacity = getHallCapacity(hall);
  const occupiedSeats = capacity - availableSeats;
  return Math.min(1, Math.max(0, occupiedSeats / capacity));
}
// ===== SEMANA 09 · FIN =====
