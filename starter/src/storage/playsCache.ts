// ============================================
// STORAGE: playsCache — Semana 07
// Caché offline de la cartelera con AsyncStorage.
// AsyncStorage es asíncrono y está pensado para volúmenes mayores que MMKV;
// aquí guarda la última copia válida de las obras para mostrarla sin red.
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { playSchema } from '../schemas/playSchema';
import type { Item } from '../types';

/** Versión en la clave: permite invalidar la caché si cambia el modelo. */
const CACHE_KEY = '@teatro/plays_cache_v1';

/**
 * Reutiliza las reglas de la Semana 06 y añade el id. Validar al leer evita
 * que un archivo corrupto rompa la lista con datos incompletos.
 */
const playsCacheSchema = z.array(playSchema.extend({ id: z.string().min(1) }));

/** Guarda la última respuesta exitosa de la API. */
export async function writePlaysCache(plays: Item[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(plays));
}

/**
 * Recupera la cartelera guardada. Devuelve `null` si no existe o si el
 * contenido ya no cumple el contrato del dominio.
 */
export async function readPlaysCache(): Promise<Item[] | null> {
  try {
    const rawCache = await AsyncStorage.getItem(CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const parsedCache: unknown = JSON.parse(rawCache);
    const result = playsCacheSchema.safeParse(parsedCache);

    if (!result.success) {
      await AsyncStorage.removeItem(CACHE_KEY);
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

/** Elimina la caché (útil para depuración o para forzar una recarga limpia). */
export async function clearPlaysCache(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
