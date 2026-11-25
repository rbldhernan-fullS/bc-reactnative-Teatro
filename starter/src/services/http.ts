// ===== SEMANA 05 · INICIO =====
import axios from 'axios';
import { getApiBaseUrl } from '../config/env';
import { getAccessToken } from './tokenService';

export const apiClient = axios.create({
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  config.baseURL = getApiBaseUrl();
  if (['post', 'put', 'patch', 'delete'].includes(config.method ?? '')) {
    const token = await getAccessToken();
    if (!token) throw new Error('Inicia sesión para modificar la cartelera.');
    // El servidor demo local no valida el token de DummyJSON.
  }
  return config;
});
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'La API tardó demasiado en responder. Intenta de nuevo.';
    }

    if (!error.response) {
      return 'No se pudo conectar con la cartelera. Verifica que la API local esté activa con "pnpm api" y que el celular esté en la misma red.';
    }

    if (error.response.status === 404) {
      return 'La obra solicitada no existe o fue eliminada de la cartelera.';
    }

    return `La API respondió con un error ${error.response.status}. Intenta de nuevo.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado al consultar la cartelera.';
}
// ===== SEMANA 05 · FIN =====
