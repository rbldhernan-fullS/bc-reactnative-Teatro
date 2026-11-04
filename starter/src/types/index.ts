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

// ===== SEMANA 10 · INICIO =====
export type SeatStatus = 'available' | 'occupied';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 07 · INICIO =====
export type PlaysSource = 'network' | 'cache';

export interface PlaysWithSource {
  plays: Item[];
  source: PlaysSource;
}
// ===== SEMANA 07 · FIN =====

// ===== SEMANA 08 · INICIO =====
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface AuthSession extends AuthUser, AuthTokens {}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}
// ===== SEMANA 08 · FIN =====
