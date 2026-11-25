// ===== SEMANA 07 · INICIO =====
import * as SecureStore from './secureStore';
// ===== SEMANA 07 · FIN =====

// ===== SEMANA 08 · INICIO =====
import type { AuthTokens } from '../types';

const TOKEN_KEYS = {
  ACCESS: 'teatro_access_token',
  REFRESH: 'teatro_refresh_token',
} as const;

// Las escrituras asíncronas de una sesión anterior deben terminar antes del
// borrado o la escritura del siguiente socio, también en SecureStore nativo.
let pendingWrite = Promise.resolve();

function writeInOrder(operation: () => Promise<void>): Promise<void> {
  const result = pendingWrite.then(operation);
  pendingWrite = result.catch(() => undefined);
  return result;
}

export function saveTokens(tokens: AuthTokens): Promise<void> {
  return writeInOrder(async () => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, tokens.accessToken),
      SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, tokens.refreshToken),
    ]);
  });
}

export async function getAccessToken(): Promise<string | null> {
  await pendingWrite;
  return SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  await pendingWrite;
  return SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
}

export function clearTokens(): Promise<void> {
  return writeInOrder(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS),
      SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH),
    ]);
  });
}
// ===== SEMANA 08 · FIN =====
