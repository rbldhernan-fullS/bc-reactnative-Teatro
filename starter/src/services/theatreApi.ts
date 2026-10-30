// ============================================
// THEATRE API — Semana 05
// Adaptador entre json-server y el modelo Item del dominio Teatro
// ============================================

import type { CreatePlayPayload, Item, UpdatePlayPayload } from '../types';
import { apiClient } from './api';

/** json-server devuelve ids numéricos cuando autoincrementa, por eso el DTO es flexible. */
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

/** Lista completa de obras en cartelera. */
export async function fetchPlays(): Promise<Item[]> {
  const { data } = await apiClient.get<PlayDto[]>('/plays');
  return data.map(normalizePlay);
}

/** Ficha individual de una obra por identificador. */
export async function fetchPlayById(id: string): Promise<Item> {
  const { data } = await apiClient.get<PlayDto>(`/plays/${id}`);
  return normalizePlay(data);
}

/** Crea una obra nueva en la cartelera. */
export async function createPlay(payload: CreatePlayPayload): Promise<Item> {
  const { data } = await apiClient.post<PlayDto>('/plays', payload);
  return normalizePlay(data);
}

/** Reemplaza todos los campos editables de una obra existente. */
export async function updatePlay({
  id,
  ...payload
}: UpdatePlayPayload): Promise<Item> {
  const { data } = await apiClient.put<PlayDto>(`/plays/${id}`, payload);
  return normalizePlay(data);
}
