// ============================================
// NAVIGATION: navigationRef — Semana 12
// Puente entre los listeners de notificaciones (fuera de React) y la
// navegación tipada. Conserva el destino si la app aún no está lista.
// ============================================

import { createNavigationContainerRef } from '@react-navigation/native';

import type { NotificationPayload } from '../types';
import type { RootTabParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

let pendingPayload: NotificationPayload | null = null;

/** Navega al destino del tap o lo deja pendiente hasta que el árbol exista. */
export function navigateFromNotification(payload: NotificationPayload): void {
  if (!navigationRef.isReady()) {
    pendingPayload = payload;
    return;
  }

  const rootState = navigationRef.getRootState();

  // Con la sesión cerrada el árbol raíz es AuthStack: se guarda el destino
  // y RootNavigator lo procesa después del login.
  if (!rootState || !rootState.routeNames.includes('Home')) {
    pendingPayload = payload;
    return;
  }

  pendingPayload = null;

  if (payload.screen === 'HomeDetail' && payload.itemId) {
    navigationRef.navigate('Home', {
      screen: 'HomeDetail',
      params: {
        id: payload.itemId,
        name: payload.name ?? 'Función del Teatro Colón',
      },
    });
    return;
  }

  if (payload.screen === 'Settings') {
    navigationRef.navigate('Settings');
    return;
  }

  navigationRef.navigate('Home', { screen: 'HomeList' });
}

/** Se llama cuando NavigationContainer está listo o cuando inicia sesión. */
export function flushPendingNotificationNavigation(): void {
  if (pendingPayload) {
    navigateFromNotification(pendingPayload);
  }
}
