import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { logger } from '../utils/logger';

// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';

export interface SavedStore {
  savedIds: string[];

  saveId: (id: string) => void;

  removeId: (id: string) => void;

  toggleSaved: (id: string) => void;

  clearSaved: () => void;
}

function savedIdsFrom(value: unknown): string[] {
  if (!value || typeof value !== 'object' || !('savedIds' in value)) return [];
  if (!Array.isArray(value.savedIds)) return [];
  return [
    ...new Set(
      value.savedIds.filter((id): id is string => typeof id === 'string' && id.length > 0),
    ),
  ];
}

const savedStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      logger.warn('No se pudieron recuperar los guardados.');
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      logger.warn('No se pudieron persistir los guardados.');
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      logger.warn('No se pudo borrar la persistencia de guardados.');
    }
  },
};
export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedIds: [],

      saveId: (id) => {
        // ===== SEMANA 05 · INICIO =====
        const { savedIds } = get();
        // ===== SEMANA 05 · FIN =====
        if (savedIds.includes(id)) {
          return;
        }

        // ===== SEMANA 05 · INICIO =====
        set((state) => ({ savedIds: [...state.savedIds, id] }));
        // ===== SEMANA 05 · FIN =====
      },

      removeId: (id) =>
        set((state) => ({
          savedIds: state.savedIds.filter((savedId) => savedId !== id),
        })),

      toggleSaved: (id) => {
        // ===== SEMANA 05 · INICIO =====
        const { savedIds } = get();
        // ===== SEMANA 05 · FIN =====

        if (savedIds.includes(id)) {
          set((state) => ({
            savedIds: state.savedIds.filter((savedId) => savedId !== id),
          }));
          return;
        }

        // ===== SEMANA 05 · INICIO =====
        set((state) => ({ savedIds: [...state.savedIds, id] }));
        // ===== SEMANA 05 · FIN =====
      },

      clearSaved: () => set({ savedIds: [] }),
    }),
    {
      name: 'teatro-saved',
      version: 1,
      storage: createJSONStorage(() => savedStorage),
      partialize: (state) => ({ savedIds: state.savedIds }),
      migrate: (stored) => ({ savedIds: savedIdsFrom(stored) }),
      merge: (stored, current) => ({ ...current, savedIds: savedIdsFrom(stored) }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) logger.warn('Se ignoró un estado de guardados inválido.');
      },
    },
  ),
);

export const selectSavedCount = (state: SavedStore): number => state.savedIds.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedIds.includes(id);
// ===== SEMANA 04 · FIN =====
