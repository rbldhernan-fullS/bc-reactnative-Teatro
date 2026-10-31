// ============================================
// AUTH SERVICE — Semana 08
// Llamadas a dummyjson.com/auth y mensajes de error en español
// ============================================

import axios from 'axios';

import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types';
import { authClient, publicAuthClient } from './authClient';

/** Espera simulada del registro para mostrar el spinner del formulario. */
const REGISTER_DELAY_MS = 700;

interface AuthErrorBody {
  message?: string;
}

/**
 * Autentica al miembro contra dummyjson. Los tokens llegan en la misma
 * respuesta que el perfil; el store los separa y los envía a SecureStore.
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthSession> {
  const { data } = await publicAuthClient.post<AuthSession>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30,
  });

  return data;
}

/**
 * dummyjson no ofrece un registro real: crea usuarios temporales que luego no
 * pueden iniciar sesión. Para la demo simulamos la creación de la cuenta y
 * redirigimos al Login, donde se usan las credenciales públicas.
 */
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

/**
 * Perfil autenticado. `authClient` añade el Bearer desde SecureStore y, si el
 * access token expiró, refresca y reintenta la petición automáticamente.
 */
export async function getProfile(): Promise<AuthUser> {
  const { data } = await authClient.get<AuthUser>('/auth/me');
  return data;
}

/** Separa el perfil de los tokens que devuelve `/auth/login`. */
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

/** Traduce cualquier fallo de autenticación a un mensaje accionable. */
export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError<AuthErrorBody>(error)) {
    if (!error.response) {
      return 'No pudimos conectar con el servicio de autenticación. Revisa tu conexión a internet.';
    }

    if (error.response.status === 400 || error.response.status === 401) {
      return 'Usuario o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
    }

    const serverMessage = error.response.data?.message;

    return serverMessage
      ? `No se pudo completar la operación: ${serverMessage}`
      : `El servicio de autenticación respondió con un error ${error.response.status}.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado al autenticarte.';
}
