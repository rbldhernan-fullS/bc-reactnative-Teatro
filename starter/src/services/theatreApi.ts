// ===== SEMANA 05 · INICIO =====
import type { CreatePlayPayload, Item, UpdatePlayPayload } from '../types';
import { apiClient } from './api';

interface PlayDto extends Omit<Item, 'id'> {
  id: number | string;
}

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
  const { data } = await apiClient.get<PlayDto[]>('/plays');
  return data.map(normalizePlay);
}

export async function fetchPlayById(id: string): Promise<Item> {
  const { data } = await apiClient.get<PlayDto>(`/plays/${id}`);
  return normalizePlay(data);
}

export async function createPlay(payload: CreatePlayPayload): Promise<Item> {
  const { data } = await apiClient.post<PlayDto>('/plays', payload);
  return normalizePlay(data);
}

export async function updatePlay({
  id,
  ...payload
}: UpdatePlayPayload): Promise<Item> {
  const { data } = await apiClient.put<PlayDto>(`/plays/${id}`, payload);
  return normalizePlay(data);
}
// ===== SEMANA 05 · FIN =====
