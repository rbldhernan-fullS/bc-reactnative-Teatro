// ===== SEMANA 05 · INICIO =====
import { env } from '../config/env';
import { ApiError, createHttpClient, toApiError } from './http';
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 08 · INICIO =====
import type { AuthSession, AuthTokens, AuthUser, LoginCredentials, RegisterData } from '../types';
import { getAccessToken, getRefreshToken, saveTokens } from './tokenService';

const AUTH_TIMEOUT_MS = 15_000;

const REGISTER_DELAY_MS = 700;

interface AuthErrorBody {
  message?: string;
}

type TokenRefreshListener = (tokens: AuthTokens) => void;

let tokenRefreshListener: TokenRefreshListener | null = null;
let sessionVersion = 0;
let pendingRefresh: Promise<AuthTokens> | null = null;

export function setTokenRefreshListener(listener: TokenRefreshListener | null): void {
  tokenRefreshListener = listener;
}

export function getSessionVersion(): number {
  return sessionVersion;
}

export function beginSessionChange(): number {
  pendingRefresh = null;
  return ++sessionVersion;
}

/** Cliente sin token: solo login y refresco, que aún no tienen sesión. */
const publicAuthClient = createHttpClient({
  baseURL: env.authUrl,
  timeoutMs: AUTH_TIMEOUT_MS,
  label: 'auth',
});

async function renewSession(version: number): Promise<AuthTokens> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new ApiError('Falta la credencial de renovación.', { kind: 'http', status: 401 });
  }

  let data: AuthTokens;
  try {
    const response = await publicAuthClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
      expiresInMins: 30,
    });
    data = response.data;
  } catch (error) {
    // El proveedor también responde 400 ante un token de renovación inválido.
    if (toApiError(error).status === 400) {
      throw new ApiError('Credencial de renovación rechazada.', {
        kind: 'http',
        status: 401,
        cause: error,
      });
    }
    throw error;
  }

  if ((await getRefreshToken()) !== refreshToken || version !== sessionVersion) {
    throw new Error('La sesión cambió durante la renovación.');
  }
  await saveTokens(data);
  if (version !== sessionVersion) throw new Error('La sesión cambió durante la renovación.');
  tokenRefreshListener?.(data);

  return data;
}

export function refreshAuthTokens(): Promise<AuthTokens> {
  const version = sessionVersion;
  pendingRefresh ??= renewSession(version).finally(() => {
    if (version === sessionVersion) pendingRefresh = null;
  });
  return pendingRefresh;
}

/**
 * Cliente con token: añade la cabecera `Authorization` y, si el servidor
 * responde 401, refresca la sesión una sola vez y reintenta la petición. Si el
 * proveedor rechaza la sesión, el store gestiona su cierre.
 */
const authClient = createHttpClient({
  baseURL: env.authUrl,
  timeoutMs: AUTH_TIMEOUT_MS,
  label: 'auth',
  auth: {
    getAccessToken,
    getSessionVersion,
    refreshAccessToken: async (): Promise<string> => {
      const tokens = await refreshAuthTokens();
      return tokens.accessToken;
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
  const { status } = toApiError(error);
  return status === 401 || status === 403;
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
