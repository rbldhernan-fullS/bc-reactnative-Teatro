// ===== SEMANA 05 · INICIO =====
import { env } from '../config/env';
import { createHttpClient, toApiError } from './http';
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 08 · INICIO =====
import type { AuthSession, AuthTokens, AuthUser, LoginCredentials, RegisterData } from '../types';
import { logger } from '../utils/logger';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenService';

const AUTH_TIMEOUT_MS = 15_000;

const REGISTER_DELAY_MS = 700;

interface AuthErrorBody {
  message?: string;
}

type TokenRefreshListener = (tokens: AuthTokens) => void;
type AuthFailureListener = () => void;

let tokenRefreshListener: TokenRefreshListener | null = null;
let authFailureListener: AuthFailureListener | null = null;

export function setTokenRefreshListener(listener: TokenRefreshListener | null): void {
  tokenRefreshListener = listener;
}

export function setAuthFailureListener(listener: AuthFailureListener | null): void {
  authFailureListener = listener;
}

/** Cliente sin token: solo login y refresco, que aún no tienen sesión. */
const publicAuthClient = createHttpClient({
  baseURL: env.authUrl,
  timeoutMs: AUTH_TIMEOUT_MS,
  label: 'auth',
});

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

/**
 * Cliente con token: añade la cabecera `Authorization` y, si el servidor
 * responde 401, refresca la sesión una sola vez y reintenta la petición. Si el
 * refresco falla, borra los tokens y avisa al store para que cierre sesión.
 */
const authClient = createHttpClient({
  baseURL: env.authUrl,
  timeoutMs: AUTH_TIMEOUT_MS,
  label: 'auth',
  auth: {
    getAccessToken,
    refreshAccessToken: async (): Promise<string> => {
      const tokens = await refreshAuthTokens();
      return tokens.accessToken;
    },
    onAuthFailure: async (): Promise<void> => {
      try {
        await clearTokens();
      } catch (error) {
        logger.debug('No se pudieron borrar los tokens caducados', error);
      }

      authFailureListener?.();
    },
  },
});

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await publicAuthClient.post<AuthSession>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30,
  });

  return data;
}

export async function register(payload: RegisterData): Promise<AuthUser> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, REGISTER_DELAY_MS);
  });

  return {
    id: Date.now(),
    username: payload.username,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
  };
}

export async function getProfile(): Promise<AuthUser> {
  const { data } = await authClient.get<AuthUser>('/auth/me');
  return data;
}

export function extractAuthUser(session: AuthSession): AuthUser {
  return {
    id: session.id,
    username: session.username,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    image: session.image,
  };
}

export function isUnauthorizedError(error: unknown): boolean {
  return toApiError(error).status === 401;
}

export function getAuthErrorMessage(error: unknown): string {
  const apiError = toApiError(error);

  if (apiError.kind === 'network' || apiError.kind === 'timeout') {
    return 'No pudimos conectar con el servicio de autenticación. Revisa tu conexión a internet.';
  }

  if (apiError.status === 400 || apiError.status === 401) {
    return 'Usuario o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
  }

  if (apiError.status !== null) {
    const body = apiError.details as AuthErrorBody | undefined;
    const serverMessage = body?.message;

    return serverMessage
      ? `No se pudo completar la operación: ${serverMessage}`
      : `El servicio de autenticación respondió con un error ${apiError.status}.`;
  }

  if (apiError.message.length > 0) {
    return apiError.message;
  }

  return 'Ocurrió un error inesperado al autenticarte.';
}
// ===== SEMANA 08 · FIN =====
