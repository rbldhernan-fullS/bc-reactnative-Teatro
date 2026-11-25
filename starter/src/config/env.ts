// ===== SEMANA 05 · INICIO =====
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  const host =
    Constants.expoConfig?.hostUri?.split(':')[0] ??
    (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
  if (!configured && !__DEV__) {
    throw new Error('Configura EXPO_PUBLIC_API_URL con la URL HTTPS de la cartelera.');
  }
  const url = new URL(configured || 'http://' + host + ':3001');
  if (url.protocol !== 'https:' && (!__DEV__ || url.protocol !== 'http:')) {
    throw new Error('La URL de la cartelera requiere HTTPS fuera de desarrollo.');
  }
  return url.href.replace(/\/+$/, '');
}
// ===== SEMANA 05 · FIN =====
