// ===== SEMANA 05 · INICIO =====
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

export const PLAYS_QUERY_KEY = ['plays'] as const;

export function usePlays() {
  return useQuery<Item[]>({
    queryKey: PLAYS_QUERY_KEY,
    queryFn: fetchPlays,
  });
}

export function usePlayById(id: string) {
  return useQuery<Item>({
    queryKey: [...PLAYS_QUERY_KEY, id],
    queryFn: () => fetchPlayById(id),
    enabled: id.length > 0,
  });
}

export function useCreatePlay() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreatePlayPayload>({
    mutationFn: createPlay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYS_QUERY_KEY });
    },
  });
}

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
// ===== SEMANA 05 · FIN =====
