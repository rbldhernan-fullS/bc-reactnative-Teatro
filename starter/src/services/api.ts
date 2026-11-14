// ===== SEMANA 05 · INICIO =====
import axios from 'axios';
import Constants from 'expo-constants';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 01 · INICIO =====
import { Platform } from 'react-native';
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 05 · INICIO =====
const API_PORT = 3001;

function resolveDevHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim();

const API_BASE_URL =
  ENV_BASE_URL && ENV_BASE_URL.length > 0
    ? ENV_BASE_URL.replace(/\/+$/, '')
    : `http://${resolveDevHost()}:${API_PORT}`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
      // API: se registra como aviso para no ensuciar la consola con errores (E‑07).
      if (status === 404) {
        console.warn('[API] recurso no encontrado', method, url);
      } else {
        console.warn('[API] error de red', status ?? 'sin respuesta', method, url);
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
