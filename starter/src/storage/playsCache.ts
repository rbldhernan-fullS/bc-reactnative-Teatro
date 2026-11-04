// ===== SEMANA 07 · INICIO =====
import AsyncStorage from '@react-native-async-storage/async-storage';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { z } from 'zod';
// ===== SEMANA 06 · FIN =====

// ===== SEMANA 07 · INICIO =====
import { playSchema } from '../schemas/playSchema';
import type { Item } from '../types';

const CACHE_KEY = '@teatro/plays_cache_v1';

const playsCacheSchema = z.array(playSchema.extend({ id: z.string().min(1) }));

export async function writePlaysCache(plays: Item[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(plays));
}

export async function readPlaysCache(): Promise<Item[] | null> {
  try {
    const rawCache = await AsyncStorage.getItem(CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const parsedCache: unknown = JSON.parse(rawCache);
    const result = playsCacheSchema.safeParse(parsedCache);

    if (!result.success) {
      await AsyncStorage.removeItem(CACHE_KEY);
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

export async function clearPlaysCache(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
// ===== SEMANA 07 · FIN =====
