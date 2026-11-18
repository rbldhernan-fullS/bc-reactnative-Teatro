// ===== SEMANA 12 · INICIO =====
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { logger } from '../utils/logger';

/**
 * Cliente HTTP único de la app.
 *
 * Antes había tres clientes axios sueltos (`api.ts`, los dos de `authClient.ts`)
 * y cada uno repetía cabeceras, timeout y manejo de errores. Aquí se crean con
 * una fábrica: la URL base, el timeout, la inyección del token y —cuando se pide
 * `auth`— el reintento tras un 401 viven en un solo sitio.
 *
 * Todos los fallos se normalizan a `ApiError`, de modo que las pantallas nunca
 * tienen que preguntar si el error es de axios, de red o de negocio.
 */

export type ApiErrorKind = 'timeout' | 'network' | 'http' | 'unknown';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  /** Código HTTP, o `null` si no hubo respuesta (red, timeout). */
  readonly status: number | null;

  /** Cuerpo devuelto por el servidor, útil para mensajes concretos. */
  readonly details: unknown;

  constructor(
    message: string,
    options: { kind: ApiErrorKind; status?: number | null; details?: unknown; cause?: unknown },
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = options.kind;
    this.status = options.status ?? null;
    this.details = options.details;
    this.cause = options.cause;
  }
}

/** Convierte cualquier fallo (axios, `Error`, texto) en un `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;

    if (error.code === 'ECONNABORTED') {
      return new ApiError('La petición tardó demasiado.', {
        kind: 'timeout',
        cause: error,
      });
    }

    if (status === null) {
      return new ApiError('No hubo respuesta del servidor.', {
        kind: 'network',
        cause: error,
      });
    }

    return new ApiError(error.message || `HTTP ${status}`, {
      kind: 'http',
      status,
      details: error.response?.data,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { kind: 'unknown', cause: error });
  }

  return new ApiError('Ocurrió un error inesperado.', { kind: 'unknown' });
}

/** ¿El fallo es un 404? La obra no existe: es negocio, no una caída. */
export function isNotFoundError(error: unknown): boolean {
  return toApiError(error).status === 404;
}

/** Mensaje de la cartelera para la UI (E‑07). */
export function getApiErrorMessage(error: unknown): string {
  const apiError = toApiError(error);

  if (apiError.kind === 'timeout') {
    return 'La API tardó demasiado en responder. Intenta de nuevo.';
  }

  if (apiError.kind === 'network') {
    return 'No se pudo conectar con la cartelera. Verifica que la API local esté activa con "pnpm api" y que el celular esté en la misma red.';
  }

  if (apiError.status === 404) {
    return 'La obra solicitada no existe o fue eliminada de la cartelera.';
  }

  if (apiError.status !== null) {
    return `La API respondió con un error ${apiError.status}. Intenta de nuevo.`;
  }

  if (apiError.kind === 'unknown' && apiError.message.length > 0) {
    return apiError.message;
  }

  return 'Ocurrió un error inesperado al consultar la cartelera.';
}

export interface HttpAuthOptions {
  /** Token guardado; devuelve `null` mientras no haya sesión. */
  getAccessToken: () => Promise<string | null>;
  /** Renueva la sesión y devuelve el token nuevo (una sola vez por ráfaga). */
  refreshAccessToken: () => Promise<string>;
  /** Se llama cuando el refresco falla: hay que cerrar sesión. */
  onAuthFailure: () => Promise<void> | void;
}

export interface HttpClientOptions {
  baseURL: string;
  timeoutMs?: number;
  /** Etiqueta para los logs (`[plays]`, `[auth]`…). */
  label: string;
  auth?: HttpAuthOptions;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const DEFAULT_TIMEOUT_MS = 10_000;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const;

/** Un 404 se anota como detalle; el resto, como aviso de verdad. */
function logApiError(label: string, error: ApiError): void {
  if (error.status === 404) {
    logger.debug(`[${label}] recurso no encontrado`, error.message);
    return;
  }

  logger.warn(`[${label}] error`, error.status ?? error.kind, error.message);
}

export function createHttpClient({
  baseURL,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  label,
  auth,
}: HttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: timeoutMs,
    headers: JSON_HEADERS,
  });

  const reject = (error: unknown): Promise<never> => {
    const apiError = toApiError(error);
    logApiError(label, apiError);
    return Promise.reject(apiError);
  };

  if (!auth) {
    client.interceptors.response.use((response) => response, reject);
    return client;
  }

  const { getAccessToken, refreshAccessToken, onAuthFailure } = auth;

  // Varias peticiones pueden recibir 401 a la vez: se refresca una sola vez y
  // todas esperan el mismo token (se conserva el comportamiento anterior).
  let activeRefresh: Promise<string> | null = null;

  const requestSingleRefresh = (): Promise<string> => {
    if (!activeRefresh) {
      activeRefresh = refreshAccessToken().finally(() => {
        activeRefresh = null;
      });
    }

    return activeRefresh;
  };

  client.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const apiError = toApiError(error);
      const originalRequest = axios.isAxiosError(error)
        ? (error.config as RetryableRequestConfig | undefined)
        : undefined;

      if (apiError.status !== 401 || !originalRequest || originalRequest._retry) {
        return reject(apiError);
      }

      originalRequest._retry = true;

      try {
        const accessToken = await requestSingleRefresh();
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);

        return await client(originalRequest);
      } catch (refreshError) {
        await onAuthFailure();

        return reject(refreshError);
      }
    },
  );

  return client;
}
// ===== SEMANA 12 · FIN =====
