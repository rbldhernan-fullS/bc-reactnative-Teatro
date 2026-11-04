// ===== SEMANA 06 · INICIO =====
export const THEATRE_GENRES = [
  'Drama',
  'Tragedia',
  'Musical',
  'Comedia',
  'Ópera',
  'Monólogo',
  'Clásico',
  'Infantil',
] as const;

export type TheatreGenre = (typeof THEATRE_GENRES)[number];

export const THEATRE_HALLS = [
  'Sala Principal',
  'Sala de Cámara',
  'Teatro Experimental',
] as const;

export type TheatreHall = (typeof THEATRE_HALLS)[number];
// ===== SEMANA 06 · FIN =====

// ===== SEMANA 01 · INICIO =====
export interface Item {
  id: string;

  name: string;

  subtitle: string;

  imageUri: string;

  genre: TheatreGenre;

  date: string;

  time: string;

  price: number;

  hall: TheatreHall;

  duration: string;

  availableSeats: number;

  rating: number;

  synopsis: string;
}
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 05 · INICIO =====
export type CreatePlayPayload = Omit<Item, 'id'>;

export type UpdatePlayPayload = Item;
// ===== SEMANA 05 · FIN =====
