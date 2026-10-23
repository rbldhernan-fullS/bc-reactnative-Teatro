// ============================================
// STORE: savedStore — Semana 04: Estado Global con Zustand
// Obras guardadas compartidas entre Cartelera, Detalle y Guardados
// ============================================

import { create } from 'zustand';
import { ITEMS } from '../data/mockData';
import type { Item } from '../types';

export interface SavedStore {
  /** Obras que el usuario guardó para consultarlas después */
  savedItems: Item[];

  /** Agrega una obra si todavía no está guardada */
  saveItem: (item: Item) => void;

  /** Quita una obra por su identificador */
  removeItem: (id: string) => void;

  /** Guarda o quita la obra según su estado actual */
  toggleItem: (item: Item) => void;

  /** Vacía por completo la lista de guardados */
  clearSaved: () => void;
}

// Estado inicial: las obras destacadas que ya traía la app en la Semana 03.
// Así la pestaña Guardados y el badge tienen contenido desde el primer arranque.
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

// Selectores reutilizables: cada componente se suscribe solo a lo que necesita.
export const selectSavedCount = (state: SavedStore): number =>
  state.savedItems.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedItems.some((item) => item.id === id);
