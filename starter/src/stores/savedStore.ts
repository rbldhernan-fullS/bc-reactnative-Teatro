// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
import { persist, createJSONStorage, type PersistStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

export interface SavedStore {
  savedIds: string[];

  saveId: (id: string) => void;

  removeId: (id: string) => void;

  toggleSaved: (id: string) => void;

  clearSaved: () => void;
}

type SavedState = { savedIds: string[] };

const INITIAL_SAVED_IDS = ['3', '1', '6', '8'];

// Storage adaptable: AsyncStorage en nativo y localStorage en web.
// Así `persist` funciona en ambos entornos sin romper el bundler de web,
// que no resuelve la implementación nativa de AsyncStorage.
const webStorage: PersistStorage<SavedState, unknown> = {
  getItem: (key) => {
    const raw = (globalThis as any).localStorage?.getItem(key) ?? null;
    return raw
      ? Promise.resolve({ state: JSON.parse(raw) as SavedState, version: 1 })
      : Promise.resolve(null);
  },
  setItem: (key, value) => {
    (globalThis as any).localStorage?.setItem(key, JSON.stringify(value.state));
    return Promise.resolve();
  },
  removeItem: (key) => {
    (globalThis as any).localStorage?.removeItem(key);
    return Promise.resolve();
  },
};

const storage: PersistStorage<SavedState, unknown> | undefined =
  Platform.OS === 'web'
    ? webStorage
    : (createJSONStorage(() => {
        // @ts-ignore - `require` está disponible en el runtime de Metro/Expo
        const AsyncStorage = require('@react-native-async-storage/async-storage')
          .default;
        return AsyncStorage;
      }) as PersistStorage<SavedState, unknown>);

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedIds: INITIAL_SAVED_IDS,

      saveId: (id) => {
        const { savedIds } = get();
        if (savedIds.includes(id)) {
          return;
        }

        set((state) => ({ savedIds: [...state.savedIds, id] }));
      },

      removeId: (id) =>
        set((state) => ({
          savedIds: state.savedIds.filter((savedId) => savedId !== id),
        })),

      toggleSaved: (id) => {
        // Reusa saveId/removeId en lugar de duplicar la lógica de filtro/inserción.
        if (get().savedIds.includes(id)) {
          get().removeId(id);
          return;
        }

        get().saveId(id);
      },

      clearSaved: () => set({ savedIds: [] }),
    }),
    {
      name: 'saved-storage',
      storage,
      // Solo se persisten los ids; los objetos se resuelven desde ITEMS/api.
      partialize: (state) => ({ savedIds: state.savedIds }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // eslint-disable-next-line no-console
          console.log('[savedStore] estado rehidratado desde almacenamiento');
        }
      },
    }
  )
);

export const selectSavedCount = (state: SavedStore): number =>
  state.savedIds.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedIds.includes(id);
// ===== SEMANA 04 · FIN =====
