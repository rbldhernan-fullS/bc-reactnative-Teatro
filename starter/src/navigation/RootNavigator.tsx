// ============================================
// NAVIGATION: RootNavigator — Semanas 08 y 12
// Navegación condicional: AuthNavigator ↔ AppNavigator según la sesión.
// Al iniciar sesión se procesa un tap de notificación pendiente.
// ============================================

import React, { useEffect } from 'react';

import { flushPendingNotificationNavigation } from './navigationRef';
import { useAuthStore } from '../stores/authStore';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

/**
 * Al cambiar `isAuthenticated`, React Navigation desmonta un árbol y monta el
 * otro sin recargar la app ni pedir de nuevo las credenciales.
 */
export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      flushPendingNotificationNavigation();
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
