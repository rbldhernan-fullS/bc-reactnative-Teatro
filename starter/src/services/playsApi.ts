// ===== SEMANA 05 · INICIO =====
import { env } from '../config/env';
import type { CreatePlayPayload, Item, UpdatePlayPayload } from '../types';
import { createHttpClient } from './http';

interface PlayDto extends Omit<Item, 'id'> {
  id: number | string;
}

/**
 * Cliente de la cartelera. json-server no pide token, así que se crea sin
 * `auth`: solo hereda de `http.ts` la URL base, el timeout y el `ApiError`.
 */
const playsClient = createHttpClient({ baseURL: env.apiUrl, label: 'plays' });

function normalizePlay(dto: PlayDto): Item {
  return {
    ...dto,
    id: String(dto.id),
    price: Number(dto.price),
    availableSeats: Number(dto.availableSeats),
    rating: Number(dto.rating),
  };
}

export async function fetchPlays(): Promise<Item[]> {
  const { data } = await playsClient.get<PlayDto[]>('/plays');
  return data.map(normalizePlay);
}

export async function fetchPlayById(id: string): Promise<Item> {
  const { data } = await playsClient.get<PlayDto>(`/plays/${id}`);
  return normalizePlay(data);
}

export async function createPlay(payload: CreatePlayPayload): Promise<Item> {
  const { data } = await playsClient.post<PlayDto>('/plays', payload);
  return normalizePlay(data);
}

export async function updatePlay({ id, ...payload }: UpdatePlayPayload): Promise<Item> {
  const { data } = await playsClient.put<PlayDto>(`/plays/${id}`, payload);
  return normalizePlay(data);
}

export async function deletePlay(id: string): Promise<void> {
  await playsClient.delete(`/plays/${id}`);
}
// ===== SEMANA 05 · FIN =====
