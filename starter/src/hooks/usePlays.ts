// ===== SEMANA 05 · INICIO =====
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPlay,
  deletePlay,
  fetchPlayById,
  fetchPlays,
  updatePlay,
} from '../services/theatreApi';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { readPlaysCache, writePlaysCache } from '../storage/playsCache';
import type {
  CreatePlayPayload,
  Item,
  PlaysWithSource,
  UpdatePlayPayload,
} from '../types';
// ===== SEMANA 07 · FIN =====

// ===== SEMANA 05 · INICIO =====
export const PLAYS_QUERY_KEY = ['plays'] as const;

export function usePlays() {
  return useQuery<PlaysWithSource>({
    queryKey: PLAYS_QUERY_KEY,
    queryFn: async (): Promise<PlaysWithSource> => {
      try {
        const plays = await fetchPlays();

        try {
          await writePlaysCache(plays);
        } catch {}

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

export function useDeletePlay() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deletePlay,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: PLAYS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...PLAYS_QUERY_KEY, id] });
    },
  });
}
// ===== SEMANA 05 · FIN =====
