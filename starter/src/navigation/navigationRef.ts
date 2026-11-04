// ===== SEMANA 03 · INICIO =====
import { createNavigationContainerRef } from '@react-navigation/native';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 12 · INICIO =====
import type { NotificationPayload } from '../types';
import type { RootTabParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

let pendingPayload: NotificationPayload | null = null;

export function navigateFromNotification(payload: NotificationPayload): void {
  if (!navigationRef.isReady()) {
    pendingPayload = payload;
    return;
  }

  const rootState = navigationRef.getRootState();

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

export function flushPendingNotificationNavigation(): void {
  if (pendingPayload) {
    navigateFromNotification(pendingPayload);
  }
}
// ===== SEMANA 12 · FIN =====
