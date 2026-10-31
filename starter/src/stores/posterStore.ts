// ============================================
// STORE: posterStore — Semana 11
// Afiche local por obra. La API guarda URLs; las fotos capturadas con la
// cámara o la galería viven solo en el dispositivo, así que se mantienen
// aquí y no se envían al servidor.
// ============================================

import { create } from 'zustand';

/** Identificador del afiche mientras la obra aún no existe en la API. */
export const POSTER_DRAFT_ID = 'poster-draft';

export interface PosterStore {
  /** URI local del afiche, indexada por id de obra */
  posters: Record<string, string>;

  /** Registra o reemplaza el afiche local de una obra */
  setPoster: (targetId: string, uri: string) => void;

  /** Elimina el afiche local y vuelve al afiche de la API */
  removePoster: (targetId: string) => void;

  /** Traslada el afiche del borrador al id real de la obra creada */
  movePoster: (fromId: string, toId: string) => void;

  /** Descarta el afiche de un formulario cancelado */
  clearDraft: () => void;
}

export const usePosterStore = create<PosterStore>()((set, get) => ({
  posters: {},

  setPoster: (targetId, uri) => {
    set((state) => ({
      posters: { ...state.posters, [targetId]: uri },
    }));
  },

  removePoster: (targetId) => {
    const { posters } = get();

    if (!(targetId in posters)) {
      return;
    }

    const nextPosters = { ...posters };
    delete nextPosters[targetId];
    set({ posters: nextPosters });
  },

  movePoster: (fromId, toId) => {
    const { posters } = get();
    const uri = posters[fromId];

    if (!uri || fromId === toId) {
      return;
    }

    const nextPosters = { ...posters, [toId]: uri };
    delete nextPosters[fromId];
    set({ posters: nextPosters });
  },

  clearDraft: () => {
    const { posters } = get();

    if (!(POSTER_DRAFT_ID in posters)) {
      return;
    }

    const nextPosters = { ...posters };
    delete nextPosters[POSTER_DRAFT_ID];
    set({ posters: nextPosters });
  },
}));

/** Selector: afiche local de una obra o `undefined` si usa el de la API. */
export function selectPoster(
  targetId: string
): (state: PosterStore) => string | undefined {
  return (state) => state.posters[targetId];
}
