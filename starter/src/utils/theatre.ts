// ===== SEMANA 10 · INICIO =====
import type { Item, Seat, TheatreHall } from '../types';

export interface HallLayout {
  rows: number;
  seatsPerRow: number;
}
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 09 · INICIO =====
export const HALL_LAYOUT: Record<TheatreHall, HallLayout> = {
  'Sala Principal': { rows: 10, seatsPerRow: 32 },
  'Sala de Cámara': { rows: 8, seatsPerRow: 15 },
  'Teatro Experimental': { rows: 8, seatsPerRow: 10 },
};
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 10 · INICIO =====
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 09 · INICIO =====
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

// ===== SEMANA 10 · INICIO =====
function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

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
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 11 · INICIO =====
export interface VenueCoordinates {
  latitude: number;
  longitude: number;
}

export interface TheatreVenue extends VenueCoordinates {
  name: string;
  address: string;
  city: string;
}

export const TEATRO_COLON_VENUE: TheatreVenue = {
  name: 'Teatro Colón',
  address: 'Calle 10 # 5-32, La Candelaria',
  city: 'Bogotá',
  latitude: 4.5964,
  longitude: -74.0734,
};

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getDistanceInMeters(
  from: VenueCoordinates,
  to: VenueCoordinates
): number {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) {
    return 'sin datos';
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

export function getVenueDirectionsUrl(
  venue: TheatreVenue = TEATRO_COLON_VENUE
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}&travelmode=walking`;
}
// ===== SEMANA 11 · FIN =====
