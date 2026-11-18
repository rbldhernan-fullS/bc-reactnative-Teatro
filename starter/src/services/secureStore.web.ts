// ===== SEMANA 07 · INICIO =====
import { logger } from '../utils/logger';

const PREFIX = 'teatro-secure:';

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export async function isAvailableAsync(): Promise<boolean> {
  return getLocalStorage() !== null;
}

export async function getItemAsync(key: string): Promise<string | null> {
  try {
    return getLocalStorage()?.getItem(PREFIX + key) ?? null;
  } catch {
    return null;
  }
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  try {
    getLocalStorage()?.setItem(PREFIX + key, value);
  } catch (error) {
    // Cuota llena o almacenamiento bloqueado: la sesión sigue en memoria.
    logger.debug('No se pudo guardar el valor seguro', key, error);
  }
}

export async function deleteItemAsync(key: string): Promise<void> {
  try {
    getLocalStorage()?.removeItem(PREFIX + key);
  } catch (error) {
    logger.debug('No se pudo borrar el valor seguro', key, error);
  }
}
// ===== SEMANA 07 · FIN =====
