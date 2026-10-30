// ============================================
// API CLIENT — Semana 05: Networking con Axios
// Instancia centralizada, detección del host de desarrollo y errores legibles
// ============================================

import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 3001;

/**
 * En Expo Go el celular no puede resolver `localhost`: ese alias apunta al
 * propio dispositivo. `Constants.expoConfig.hostUri` contiene la IP del equipo
 * que ejecuta Metro (ej. "192.168.1.50:8081"), así que reutilizamos ese host
 * para llegar a json-server en la misma máquina.
 */
function resolveDevHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return host;
  }

  // Fallback para emuladores sin hostUri disponible.
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

// ============================================================
// INTERCEPTOR DE RESPUESTA — trazabilidad en desarrollo
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (__DEV__ && axios.isAxiosError(error)) {
      console.error(
        '[API Error]',
        error.response?.status ?? 'sin respuesta',
        error.config?.method?.toUpperCase(),
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);

/**
 * Traduce cualquier fallo de red a un mensaje accionable en español.
 * Se usa en las pantallas de error para no exponer detalles técnicos.
 */
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
