// ============================================
// TYPES — Semana 05: Dominio Teatro
// Modelo de datos de las obras y contratos de la API
// ============================================

export type TheatreGenre =
  | 'Drama'
  | 'Tragedia'
  | 'Musical'
  | 'Comedia'
  | 'Ópera'
  | 'Monólogo'
  | 'Clásico'
  | 'Infantil';

export type TheatreHall =
  | 'Sala Principal'
  | 'Sala de Cámara'
  | 'Teatro Experimental';

export interface Item {
  /** Identificador único de la obra teatral */
  id: string;

  /** Título de la obra */
  name: string;

  /** Director o compañía teatral */
  subtitle: string;

  /** Afiche promocional / imagen de portada */
  imageUri: string;

  /** Género o categoría teatral */
  genre: TheatreGenre;

  /** Fecha de la próxima función (YYYY-MM-DD) */
  date: string;

  /** Hora de inicio de la función (ej. '20:00') */
  time: string;

  /** Precio general en pesos colombianos (COP) */
  price: number;

  /** Sala o auditorio del teatro */
  hall: TheatreHall;

  /** Duración aproximada (ej. '120 min') */
  duration: string;

  /** Butacas disponibles */
  availableSeats: number;

  /** Calificación de la crítica/público (ej. 4.8) */
  rating: number;

  /** Sinopsis y argumento dramático de la obra */
  synopsis: string;
}

/** Cuerpo que espera json-server al crear una obra (sin id) */
export type CreatePlayPayload = Omit<Item, 'id'>;

/** Cuerpo completo para reemplazar una obra existente */
export type UpdatePlayPayload = Item;
