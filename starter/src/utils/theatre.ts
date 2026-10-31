// ============================================
// UTILS: theatre — Semanas 09, 10 y 11
// Aforo por sala, ocupación, mapa de butacas y sede del teatro
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

// ============================================
// Semana 11: sede del teatro y distancia
// ============================================

export interface VenueCoordinates {
  latitude: number;
  longitude: number;
}

export interface TheatreVenue extends VenueCoordinates {
  name: string;
  address: string;
  city: string;
}

/**
 * Sede física del Teatro Colón en La Candelaria (Bogotá). Se usa como destino
 * para calcular la distancia desde la ubicación del socio y para abrir el mapa.
 */
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

/**
 * Distancia en metros entre dos coordenadas usando la fórmula de Haversine.
 * Es suficientemente precisa para mostrar "estás a X del teatro" sin librerías.
 */
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

/** Formatea la distancia en metros o kilómetros con un decimal. */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) {
    return 'sin datos';
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

/** Enlace de Google Maps para llegar caminando a la sede. */
export function getVenueDirectionsUrl(
  venue: TheatreVenue = TEATRO_COLON_VENUE
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}&travelmode=walking`;
}
