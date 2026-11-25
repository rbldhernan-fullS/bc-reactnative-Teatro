// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';

interface SavedStore {
  savedIds: string[];
  saveItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearSaved: () => void;
}

export const useSavedStore = create<SavedStore>()((set, get) => ({
  savedIds: [],
  saveItem: (id) =>
    set((state) => (state.savedIds.includes(id) ? state : { savedIds: [...state.savedIds, id] })),
  removeItem: (id) =>
    set((state) => ({
      savedIds: state.savedIds.filter((savedId) => savedId !== id),
    })),
  toggleItem: (id) => {
    const { savedIds, saveItem, removeItem } = get();
    if (savedIds.includes(id)) {
      removeItem(id);
    } else {
      saveItem(id);
    }
  },
  clearSaved: () => set({ savedIds: [] }),
}));

export const selectSavedCount = (state: SavedStore): number => state.savedIds.length;
export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedIds.includes(id);
// ===== SEMANA 04 · FIN =====
