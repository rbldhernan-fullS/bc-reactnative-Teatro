// ============================================
// TYPES — Semana 06: Dominio Teatro
// Modelo de datos, catálogos y contratos de la API
// ============================================

/**
 * Catálogo de géneros teatrales. Se declara como tupla `as const` para poder
 * reutilizarlo en el schema Zod (`z.enum`) sin duplicar la lista.
 */
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

/** Catálogo de salas del teatro, reutilizado por el formulario y por Zod. */
export const THEATRE_HALLS = [
  'Sala Principal',
  'Sala de Cámara',
  'Teatro Experimental',
] as const;

export type TheatreHall = (typeof THEATRE_HALLS)[number];

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

// ============================================
// Semana 07: origen de la cartelera (red o caché)
// ============================================

/** Origen de los datos que está mostrando la app. */
export type PlaysSource = 'network' | 'cache';

/**
 * Resultado de `usePlays`: las obras y su procedencia.
 * `source === 'cache'` activa el banner de modo offline en la cartelera.
 */
export interface PlaysWithSource {
  plays: Item[];
  source: PlaysSource;
}
