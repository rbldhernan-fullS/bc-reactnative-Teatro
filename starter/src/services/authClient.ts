// ============================================
// AUTH CLIENT — Semana 08
// Instancia Axios para dummyjson con inyección de tokens y refresco 401.
// Los tokens viven en SecureStore; este módulo nunca los expone a la UI.
// ============================================

import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import type { AuthTokens } from '../types';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './tokenService';

export const AUTH_BASE_URL = 'https://dummyjson.com';

const AUTH_TIMEOUT_MS = 15_000;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const;

/**
 * Cliente sin interceptores: solo para login y refresh. Evita un bucle
 * infinito si el propio refresh recibiera un 401.
 */
export const publicAuthClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: AUTH_TIMEOUT_MS,
  headers: JSON_HEADERS,
});

/** Cliente autenticado: inyecta el Bearer y reintenta tras un refresh. */
export const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: AUTH_TIMEOUT_MS,
  headers: JSON_HEADERS,
});

// ============================================================
// LISTENERS: permiten que Zustand refleje el token renovado
// sin que este módulo importe el store (evita dependencias circulares).
// ============================================================

type TokenRefreshListener = (tokens: AuthTokens) => void;
type AuthFailureListener = () => void;

let tokenRefreshListener: TokenRefreshListener | null = null;
let authFailureListener: AuthFailureListener | null = null;

/** Registra un callback para sincronizar el token en memoria del store. */
export function setTokenRefreshListener(
  listener: TokenRefreshListener | null
): void {
  tokenRefreshListener = listener;
}

/** Registra un callback para cerrar la sesión cuando el refresh falla. */
export function setAuthFailureListener(
  listener: AuthFailureListener | null
): void {
  authFailureListener = listener;
}

// ============================================================
// REFRESH SINGLE-FLIGHT
// Varias peticiones pueden recibir 401 a la vez: todas comparten una sola
// llamada a /auth/refresh en lugar de disparar refrescos en paralelo.
// ============================================================

let activeRefresh: Promise<AuthTokens> | null = null;

/** Renueva los tokens con el refresh token guardado y los persiste. */
export async function refreshAuthTokens(): Promise<AuthTokens> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('No hay refresh token guardado.');
  }

  const { data } = await publicAuthClient.post<AuthTokens>('/auth/refresh', {
    refreshToken,
    expiresInMins: 30,
  });

  await saveTokens(data);
  tokenRefreshListener?.(data);

  return data;
}

function requestSingleRefresh(): Promise<AuthTokens> {
  if (!activeRefresh) {
    activeRefresh = refreshAuthTokens().finally(() => {
      activeRefresh = null;
    });
  }

  return activeRefresh;
}

// ============================================================
// INTERCEPTORES
// ============================================================

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

authClient.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as
      | RetryableRequestConfig
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = await requestSingleRefresh();
      originalRequest.headers.set(
        'Authorization',
        `Bearer ${tokens.accessToken}`
      );

      return await authClient(originalRequest);
    } catch (refreshError) {
      try {
        await clearTokens();
      } catch {
        // Si SecureStore falla, igualmente cerramos la sesión en memoria.
      }

      authFailureListener?.();

      return Promise.reject(refreshError);
    }
  }
);
