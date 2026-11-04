// ===== SEMANA 07 · INICIO =====
import * as SecureStore from './secureStore';
// ===== SEMANA 07 · FIN =====

// ===== SEMANA 08 · INICIO =====
import type { AuthTokens } from '../types';

const TOKEN_KEYS = {
  ACCESS: 'teatro_access_token',
  REFRESH: 'teatro_refresh_token',
} as const;

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, tokens.accessToken),
    SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, tokens.refreshToken),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS),
    SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH),
  ]);
}
// ===== SEMANA 08 · FIN =====
