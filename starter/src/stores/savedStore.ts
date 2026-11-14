// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

import { storage } from '../storage/mmkv';

export interface SavedState {
  savedIds: string[];

  save: (id: string) => void;

  remove: (id: string) => void;

  toggle: (id: string) => void;

  clear: () => void;
}

interface PersistedSavedState {
  savedIds: string[];
}

const SAVED_STORAGE_KEY = 'teatro-saved';
const SAVED_STORAGE_VERSION = 1;

/**
 * Adaptador de `persist` sobre el almacenamiento del proyecto.
 *
 * `storage/mmkv.ts` (nativo) y `storage/mmkv.web.ts` (localStorage) exponen la
 * misma interfaz `getString`/`set`/`remove`, así que la lógica es idéntica en
 * ambas plataformas. `JSON.parse` va protegido: un valor corrupto se descarta
 * y el store arranca vacío en lugar de romper el arranque.
 */
const savedStorage: PersistStorage<PersistedSavedState> = {
  getItem: (name): StorageValue<PersistedSavedState> | null => {
    const raw = storage.getString(name);

    if (!raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (typeof parsed !== 'object' || parsed === null) {
        return null;
      }

      const candidate = parsed as StorageValue<PersistedSavedState>;
      const ids = candidate.state?.savedIds;

      if (!Array.isArray(ids)) {
        return null;
      }

      return {
        state: { savedIds: ids.filter((id): id is string => typeof id === 'string') },
        version: typeof candidate.version === 'number' ? candidate.version : undefined,
      };
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

function sanitizeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids.filter((id): id is string => typeof id === 'string');
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      // Sin seed: la lista de guardados es del usuario y arranca vacía.
      savedIds: [],

      save: (id) => {
        if (get().savedIds.includes(id)) {
          return;
        }

        set((state) => ({ savedIds: [...state.savedIds, id] }));
      },

      remove: (id) =>
        set((state) => ({
          savedIds: state.savedIds.filter((savedId) => savedId !== id),
        })),

      toggle: (id) => {
        const { savedIds, save, remove } = get();

        if (savedIds.includes(id)) {
          remove(id);
          return;
        }

        save(id);
      },

      clear: () => set({ savedIds: [] }),
    }),
    {
      name: SAVED_STORAGE_KEY,
      version: SAVED_STORAGE_VERSION,
      storage: savedStorage,
      // Solo se persisten los ids; las obras se resuelven desde la API.
      partialize: (state): PersistedSavedState => ({ savedIds: state.savedIds }),
      migrate: (persistedState, version): PersistedSavedState => {
        if (version < SAVED_STORAGE_VERSION) {
          const legacy = persistedState as { savedIds?: unknown } | undefined;
          return { savedIds: sanitizeIds(legacy?.savedIds) };
        }

        return persistedState as PersistedSavedState;
      },
    },
  ),
);

export const selectSavedCount = (state: SavedState): number => state.savedIds.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedState): boolean =>
    state.savedIds.includes(id);
// ===== SEMANA 04 · FIN =====
