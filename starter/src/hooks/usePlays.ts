// ============================================
// HOOKS: usePlays — Semana 05: TanStack Query v5
// Estado del servidor centralizado en la caché de TanStack Query
// ============================================

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPlay,
  fetchPlayById,
  fetchPlays,
  updatePlay,
} from '../services/theatreApi';
import { readPlaysCache, writePlaysCache } from '../storage/playsCache';
import type {
  CreatePlayPayload,
  Item,
  PlaysWithSource,
  UpdatePlayPayload,
} from '../types';

/**
 * Query key semántica. Al invalidar la raíz `['plays']` se refrescan también
 * las queries de detalle (`['plays', id]`) gracias al matching por prefijo.
 */
export const PLAYS_QUERY_KEY = ['plays'] as const;

/**
 * Cartelera completa con caché offline.
 *
 * 1. Con red: consulta la API y guarda una copia en AsyncStorage.
 * 2. Sin red y con caché: devuelve la copia y marca `source: 'cache'`.
 * 3. Sin red y sin caché: propaga el error para la pantalla de reintento.
 */
export function usePlays() {
  return useQuery<PlaysWithSource>({
    queryKey: PLAYS_QUERY_KEY,
    queryFn: async (): Promise<PlaysWithSource> => {
      try {
        const plays = await fetchPlays();

        try {
          await writePlaysCache(plays);
        } catch {
          // La caché es best-effort: un fallo de escritura no debe romper
          // una carga de red que sí fue exitosa.
        }

        return { plays, source: 'network' };
      } catch (error) {
        const cachedPlays = await readPlaysCache();

        if (cachedPlays) {
          return { plays: cachedPlays, source: 'cache' };
        }

        throw error;
      }
    },
  });
}

/** Detalle de una obra. Solo consulta cuando el id es válido. */
export function usePlayById(id: string) {
  return useQuery<Item>({
    queryKey: [...PLAYS_QUERY_KEY, id],
    queryFn: () => fetchPlayById(id),
    enabled: id.length > 0,
  });
}

/** Crea una obra y refresca la cartelera automáticamente. */
export function useCreatePlay() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreatePlayPayload>({
    mutationFn: createPlay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYS_QUERY_KEY });
    },
  });
}

/** Actualiza una obra e invalida tanto la lista como su detalle. */
export function useUpdatePlay() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, UpdatePlayPayload>({
    mutationFn: updatePlay,
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: PLAYS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PLAYS_QUERY_KEY, variables.id],
      });
    },
  });
}
