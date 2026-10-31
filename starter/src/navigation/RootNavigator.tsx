// ============================================
// NAVIGATION: RootNavigator — Semana 08
// Navegación condicional: AuthNavigator ↔ AppNavigator según la sesión
// ============================================

import React from 'react';

import { useAuthStore } from '../stores/authStore';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

/**
 * Al cambiar `isAuthenticated`, React Navigation desmonta un árbol y monta el
 * otro sin recargar la app ni pedir de nuevo las credenciales.
 */
export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
