// ============================================
// TOKEN SERVICE — Semana 08: Autenticación
// Única capa que toca los tokens. Siempre SecureStore, nunca AsyncStorage/MMKV.
// ============================================

import * as SecureStore from 'expo-secure-store';

import type { AuthTokens } from '../types';

/** Claves de SecureStore (solo letras, números, punto, guion y underscore). */
const TOKEN_KEYS = {
  ACCESS: 'teatro_access_token',
  REFRESH: 'teatro_refresh_token',
} as const;

/** Guarda ambos tokens en el almacenamiento cifrado del sistema. */
export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, tokens.accessToken),
    SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, tokens.refreshToken),
  ]);
}

/** Devuelve el access token o `null` si no existe. */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
}

/** Devuelve el refresh token o `null` si no existe. */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
}

/** Elimina ambos tokens (logout o sesión inválida). */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS),
    SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH),
  ]);
}
