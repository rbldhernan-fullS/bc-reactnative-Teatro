// ============================================
// SCHEMA: playSchema — Semana 06
// Validación Zod compartida por los formularios Create y Edit
// ============================================

import { z } from 'zod';
import { THEATRE_GENRES, THEATRE_HALLS } from '../types';
import type { CreatePlayPayload, Item, UpdatePlayPayload } from '../types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DURATION_PATTERN = /^\d{2,3} min$/;

export const DEFAULT_PLAY_IMAGE =
  'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop&q=80';

/** Comprueba que la fecha exista realmente en el calendario (ej. rechaza 2027-02-30). */
function isValidCalendarDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const playSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres.')
    .max(80, 'El título no puede superar 80 caracteres.'),

  subtitle: z
    .string()
    .trim()
    .min(3, 'Indica el director o la compañía teatral.')
    .max(120, 'El director o compañía no puede superar 120 caracteres.'),

  genre: z.enum(THEATRE_GENRES, {
    error: 'Selecciona un género teatral válido.',
  }),

  hall: z.enum(THEATRE_HALLS, {
    error: 'Selecciona una sala válida.',
  }),

  date: z
    .string()
    .regex(DATE_PATTERN, 'Usa el formato AAAA-MM-DD.')
    .refine(isValidCalendarDate, 'La fecha no existe en el calendario.'),

  time: z.string().regex(TIME_PATTERN, 'Usa el formato HH:MM (24 horas).'),

  price: z.coerce
    .number({ error: 'El precio debe ser un número.' })
    .int('El precio debe ser un entero.')
    .positive('El precio debe ser mayor que cero.')
    .max(1_000_000, 'El precio no puede superar 1.000.000 COP.'),

  duration: z
    .string()
    .trim()
    .regex(DURATION_PATTERN, 'Usa el formato "120 min".'),

  availableSeats: z.coerce
    .number({ error: 'El aforo debe ser un número.' })
    .int('El aforo debe ser un entero.')
    .min(0, 'El aforo no puede ser negativo.')
    .max(500, 'El aforo no puede superar 500 butacas.'),

  rating: z.coerce
    .number({ error: 'La calificación debe ser un número.' })
    .min(0, 'La calificación mínima es 0.')
    .max(5, 'La calificación máxima es 5.'),

  imageUri: z
    .string()
    .trim()
    .url('Ingresa una URL válida para el afiche.'),

  synopsis: z
    .string()
    .trim()
    .min(20, 'La sinopsis debe tener al menos 20 caracteres.')
    .max(600, 'La sinopsis no puede superar 600 caracteres.'),
});

/** Valores que entran al formulario (los numéricos llegan como texto desde TextInput). */
export type PlayFormInput = z.input<typeof playSchema>;

/**
 * Valores ya validados y convertidos (price, aforo y rating son number).
 * `z.infer` es equivalente a `z.output` y evita declarar una interfaz manual
 * que podría desincronizarse del schema.
 */
export type PlayFormValues = z.infer<typeof playSchema>;

/** Valores iniciales del formulario de creación. */
export const EMPTY_PLAY_FORM: PlayFormInput = {
  name: '',
  subtitle: '',
  genre: 'Drama',
  hall: 'Sala Principal',
  date: '2027-03-06',
  time: '20:00',
  price: '',
  duration: '120 min',
  availableSeats: '40',
  rating: '4.5',
  imageUri: DEFAULT_PLAY_IMAGE,
  synopsis: '',
};

/** Convierte una obra de la API en valores editables del formulario. */
export function toPlayFormInput(play: Item): PlayFormInput {
  return {
    name: play.name,
    subtitle: play.subtitle,
    genre: play.genre,
    hall: play.hall,
    date: play.date,
    time: play.time,
    price: String(play.price),
    duration: play.duration,
    availableSeats: String(play.availableSeats),
    rating: String(play.rating),
    imageUri: play.imageUri,
    synopsis: play.synopsis,
  };
}

/** El output del schema coincide campo a campo con el cuerpo de creación. */
export function toCreatePlayPayload(values: PlayFormValues): CreatePlayPayload {
  return values;
}

/** Agrega el id para reemplazar la obra existente con PUT. */
export function toUpdatePlayPayload(
  id: string,
  values: PlayFormValues
): UpdatePlayPayload {
  return { id, ...values };
}
