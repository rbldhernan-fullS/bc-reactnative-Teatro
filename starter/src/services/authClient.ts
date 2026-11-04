// ===== SEMANA 05 · INICIO =====
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 08 · INICIO =====
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

export const publicAuthClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: AUTH_TIMEOUT_MS,
  headers: JSON_HEADERS,
});

export const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: AUTH_TIMEOUT_MS,
  headers: JSON_HEADERS,
});

type TokenRefreshListener = (tokens: AuthTokens) => void;
type AuthFailureListener = () => void;

let tokenRefreshListener: TokenRefreshListener | null = null;
let authFailureListener: AuthFailureListener | null = null;

export function setTokenRefreshListener(
  listener: TokenRefreshListener | null
): void {
  tokenRefreshListener = listener;
}

export function setAuthFailureListener(
  listener: AuthFailureListener | null
): void {
  authFailureListener = listener;
}

let activeRefresh: Promise<AuthTokens> | null = null;

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
      } catch {}

      authFailureListener?.();

      return Promise.reject(refreshError);
    }
  }
);
// ===== SEMANA 08 · FIN =====
