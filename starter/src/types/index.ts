// ===== SEMANA 02 · INICIO =====
export type TheatreGenre =
  | 'Drama'
  | 'Tragedia'
  | 'Musical'
  | 'Comedia'
  | 'Ópera'
  | 'Monólogo'
  | 'Clásico'
  | 'Infantil';
  // ===== SEMANA 02 · FIN =====

// ===== SEMANA 05 · INICIO =====
export type TheatreHall =
  | 'Sala Principal'
  | 'Sala de Cámara'
  | 'Teatro Experimental';
  // ===== SEMANA 05 · FIN =====

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
