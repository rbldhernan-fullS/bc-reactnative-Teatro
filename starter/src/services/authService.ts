// ===== SEMANA 05 · INICIO =====
import axios from 'axios';
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 08 · INICIO =====
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types';
import { authClient, publicAuthClient } from './authClient';

const REGISTER_DELAY_MS = 700;

interface AuthErrorBody {
  message?: string;
}

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
// ===== SEMANA 08 · FIN =====
