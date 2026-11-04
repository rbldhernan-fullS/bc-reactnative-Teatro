// ===== SEMANA 07 · INICIO =====
interface WebMMKV {
  getString: (key: string) => string | undefined;
  getBoolean: (key: string) => boolean | undefined;
  getNumber: (key: string) => number | undefined;
  set: (key: string, value: string | number | boolean) => void;
  remove: (key: string) => void;
  clearAll: () => void;
}

const PREFIX = 'teatro-mmkv:';

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function createWebMMKV(id: string): WebMMKV {
  const prefix = `${PREFIX}${id}:`;
  const store = getLocalStorage();

  const read = (key: string): string | null => {
    try {
      return store?.getItem(prefix + key) ?? null;
    } catch {
      return null;
    }
  };

  const write = (key: string, value: string): void => {
    try {
      store?.setItem(prefix + key, value);
    } catch {}
  };

  return {
    getString: (key) => read(key) ?? undefined,
    getBoolean: (key) => {
      const raw = read(key);
      return raw === null ? undefined : raw === 'true';
    },
    getNumber: (key) => {
      const raw = read(key);
      if (raw === null) {
        return undefined;
      }

      const value = Number(raw);
      return Number.isNaN(value) ? undefined : value;
    },
    set: (key, value) => write(key, String(value)),
    remove: (key) => {
      try {
        store?.removeItem(prefix + key);
      } catch {}
    },
    clearAll: () => {
      try {
        if (!store) {
          return;
        }

        const keys = Array.from({ length: store.length }, (_, index) =>
          store.key(index)
        ).filter((key): key is string => key !== null && key.startsWith(prefix));

        keys.forEach((key) => store.removeItem(key));
      } catch {}
    },
  };
}

export const storage = createWebMMKV('teatro-preferences');
// ===== SEMANA 07 · FIN =====
