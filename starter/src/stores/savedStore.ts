// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
import { ITEMS } from '../data/mockData';
import type { Item } from '../types';

export interface SavedStore {
  savedItems: Item[];

  saveItem: (item: Item) => void;

  removeItem: (id: string) => void;

  toggleItem: (item: Item) => void;

  clearSaved: () => void;
}

const INITIAL_SAVED_IDS = ['3', '1', '6', '8'];

const initialSavedItems: Item[] = ITEMS.filter((item) =>
  INITIAL_SAVED_IDS.includes(item.id)
);

export const useSavedStore = create<SavedStore>()((set, get) => ({
  savedItems: initialSavedItems,

  saveItem: (item) => {
    const { savedItems } = get();
    if (savedItems.some((saved) => saved.id === item.id)) {
      return;
    }

    set((state) => ({ savedItems: [...state.savedItems, item] }));
  },

  removeItem: (id) =>
    set((state) => ({
      savedItems: state.savedItems.filter((item) => item.id !== id),
    })),

  toggleItem: (item) => {
    const { savedItems } = get();
    const isSaved = savedItems.some((saved) => saved.id === item.id);

    if (isSaved) {
      set((state) => ({
        savedItems: state.savedItems.filter((saved) => saved.id !== item.id),
      }));
      return;
    }

    set((state) => ({ savedItems: [...state.savedItems, item] }));
  },

  clearSaved: () => set({ savedItems: [] }),
}));

export const selectSavedCount = (state: SavedStore): number =>
  state.savedItems.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedItems.some((item) => item.id === id);
    // ===== SEMANA 04 · FIN =====
