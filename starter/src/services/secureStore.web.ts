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
  try {
    getLocalStorage()?.setItem(PREFIX + key, value);
  } catch {}
}

export async function deleteItemAsync(key: string): Promise<void> {
  try {
    getLocalStorage()?.removeItem(PREFIX + key);
  } catch {}
}
// ===== SEMANA 07 · FIN =====
