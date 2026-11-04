// ===== SEMANA 01 · INICIO =====
import React from 'react';
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 08 · INICIO =====
import { useAuthStore } from '../stores/authStore';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
// ===== SEMANA 08 · FIN =====

// ===== SEMANA 03 · INICIO =====
export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
// ===== SEMANA 03 · FIN =====
