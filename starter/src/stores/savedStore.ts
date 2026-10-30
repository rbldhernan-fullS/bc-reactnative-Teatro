// ============================================
// STORE: savedStore — Semana 05
// Solo guarda IDs (estado de UI). Los datos de las obras viven en TanStack Query.
// ============================================

import { create } from 'zustand';

export interface SavedStore {
  /** Identificadores de las obras que el usuario guardó */
  savedIds: string[];

  /** Agrega un id si todavía no está guardado */
  saveId: (id: string) => void;

  /** Quita un id de la lista */
  removeId: (id: string) => void;

  /** Guarda o quita la obra según su estado actual */
  toggleSaved: (id: string) => void;

  /** Vacía por completo la lista de guardados */
  clearSaved: () => void;
}

// Estado inicial: las obras destacadas que ya traía la app.
const INITIAL_SAVED_IDS = ['3', '1', '6', '8'];

export const useSavedStore = create<SavedStore>()((set, get) => ({
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
    const { savedIds } = get();

    if (savedIds.includes(id)) {
      set((state) => ({
        savedIds: state.savedIds.filter((savedId) => savedId !== id),
      }));
      return;
    }

    set((state) => ({ savedIds: [...state.savedIds, id] }));
  },

  clearSaved: () => set({ savedIds: [] }),
}));

// Selectores reutilizables: cada componente se suscribe solo a lo que necesita.
export const selectSavedCount = (state: SavedStore): number =>
  state.savedIds.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedIds.includes(id);
