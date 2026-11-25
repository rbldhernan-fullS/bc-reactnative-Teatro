// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';

export interface SavedStore {
  savedIds: string[];

  saveId: (id: string) => void;

  removeId: (id: string) => void;

  toggleSaved: (id: string) => void;

  clearSaved: () => void;
}

export const useSavedStore = create<SavedStore>()((set, get) => ({
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
}));

export const selectSavedCount = (state: SavedStore): number => state.savedIds.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedIds.includes(id);
// ===== SEMANA 04 · FIN =====
