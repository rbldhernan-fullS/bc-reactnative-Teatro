// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 11 · INICIO =====
export const POSTER_DRAFT_ID = 'poster-draft';

export interface PosterStore {
  posters: Record<string, string>;

  setPoster: (targetId: string, uri: string) => void;

  removePoster: (targetId: string) => void;

  movePoster: (fromId: string, toId: string) => void;

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

export function selectPoster(
  targetId: string
): (state: PosterStore) => string | undefined {
  return (state) => state.posters[targetId];
}
// ===== SEMANA 11 · FIN =====
