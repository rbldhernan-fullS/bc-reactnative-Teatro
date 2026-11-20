// ===== SEMANA 05 · INICIO =====
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPlay, deletePlay, fetchPlayById, fetchPlays, updatePlay } from '../api/playsApi';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { readPlaysCache, writePlaysCache } from '../../../storage/playsCache';
import type { CreatePlayPayload, Item, PlaysWithSource, UpdatePlayPayload } from '../../../types';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { isNotFoundError } from '../../../services/http';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { logger } from '../../../utils/logger';
// ===== SEMANA 12 · FIN =====

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
        } catch (cacheError) {
          // La caché es una mejora opcional: si falla, la lista ya está en memoria.
          logger.debug('No se pudo guardar la caché de la cartelera', cacheError);
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
    queryFn: async (): Promise<Item> => {
      try {
        return await fetchPlayById(id);
      } catch (error) {
        // Un 404 significa que la obra no existe: la caché no debe resucitarla (E‑07).
        if (isNotFoundError(error)) {
          throw error;
        }

        try {
          const cachedPlays = await readPlaysCache();
          const cachedPlay = cachedPlays?.find((play) => play.id === id);

          if (cachedPlay) {
            logger.debug('Detalle servido desde la caché tras fallar la red', { id });
            return cachedPlay;
          }
        } catch (cacheError) {
          logger.debug('No se pudo leer la caché para el detalle', cacheError);
        }

        throw error;
      }
    },
    enabled: id.length > 0,
    // React Query pausa las consultas cuando el navegador está sin red; sin esto
    // el `queryFn` no llega a ejecutarse y el fallback a la caché nunca ocurre.
    networkMode: 'always',
    // Un 404 no se reintenta: la obra no existe y reintentar solo llena la consola (E‑07).
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 2,
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
