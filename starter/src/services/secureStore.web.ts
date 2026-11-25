// ===== SEMANA 07 · INICIO =====
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
  const storage = getLocalStorage();
  if (!storage) throw new Error('El almacenamiento web no está disponible.');
  storage.setItem(PREFIX + key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  getLocalStorage()?.removeItem(PREFIX + key);
}
// ===== SEMANA 07 · FIN =====
