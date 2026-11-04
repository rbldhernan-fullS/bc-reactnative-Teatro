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

  hall: string;

  duration: string;

  availableSeats: number;

  rating: number;
}
// ===== SEMANA 01 · FIN =====
