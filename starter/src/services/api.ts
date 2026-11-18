// ===== SEMANA 05 · INICIO =====
import axios from 'axios';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { env } from '../config/env';
import { logger } from '../utils/logger';
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 05 · INICIO =====
// La URL base la resuelve y valida `config/env.ts`: aquí solo se consume. Con
// eso la detección del host de Expo y el `https` obligatorio fuera de
// desarrollo viven en un único sitio.
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (__DEV__ && axios.isAxiosError(error)) {
      const status = error.response?.status;
      const method = error.config?.method?.toUpperCase();
      const url = error.config?.url;

      // Un 404 es un caso de negocio (la obra no existe), no una caída de la
      // API: se registra como detalle para no ensuciar la consola (E‑07).
      if (status === 404) {
        logger.debug('[API] recurso no encontrado', method, url);
      } else {
        logger.warn('[API] error de red', status ?? 'sin respuesta', method, url);
      }
    }

    return Promise.reject(error);
  },
);

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

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
