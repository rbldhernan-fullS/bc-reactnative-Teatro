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
import type { CreatePlayPayload, Item, UpdatePlayPayload } from '../types';

/**
 * Query key semántica. Al invalidar la raíz `['plays']` se refrescan también
 * las queries de detalle (`['plays', id]`) gracias al matching por prefijo.
 */
export const PLAYS_QUERY_KEY = ['plays'] as const;

/** Cartelera completa. */
export function usePlays() {
  return useQuery<Item[]>({
    queryKey: PLAYS_QUERY_KEY,
    queryFn: fetchPlays,
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
