import axios from 'axios';
import { logger } from '../utils/logger';
// ===== SEMANA 05 · INICIO =====
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPlay, fetchPlayById, fetchPlays, updatePlay } from '../services/theatreApi';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { readPlaysCache, writePlaysCache } from '../storage/playsCache';
import type { CreatePlayPayload, Item, PlaysWithSource, UpdatePlayPayload } from '../types';
// ===== SEMANA 07 · FIN =====

// ===== SEMANA 05 · INICIO =====
export const PLAYS_QUERY_KEY = ['plays'] as const;

export function usePlays() {
  return useQuery<PlaysWithSource>({
    queryKey: PLAYS_QUERY_KEY,
    networkMode: 'always',
    queryFn: async (): Promise<PlaysWithSource> => {
      try {
        const plays = await fetchPlays();

        try {
          await writePlaysCache(plays);
        } catch {
          logger.warn('No se pudo actualizar la caché de cartelera.');
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

export function usePlayById(id: string) {
  return useQuery<Item>({
    queryKey: [...PLAYS_QUERY_KEY, id],
    networkMode: 'always',
    queryFn: async () => {
      try {
        return await fetchPlayById(id);
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response) throw error;
        const cached = (await readPlaysCache())?.find((play) => play.id === id);
        if (cached) return cached;
        throw error;
      }
    },
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
