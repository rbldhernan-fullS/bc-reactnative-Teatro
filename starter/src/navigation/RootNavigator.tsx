// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 12 · INICIO =====
import { flushPendingNotificationNavigation } from './navigationRef';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 08 · INICIO =====
import { useAuthStore } from '../stores/authStore';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
// ===== SEMANA 08 · FIN =====

// ===== SEMANA 03 · INICIO =====
export function RootNavigator(): React.JSX.Element {
  // ===== SEMANA 08 · INICIO =====
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // ===== SEMANA 08 · FIN =====

  // ===== SEMANA 12 · INICIO =====
  useEffect(() => {
    if (isAuthenticated) {
      flushPendingNotificationNavigation();
    }
  }, [isAuthenticated]);
  // ===== SEMANA 12 · FIN =====

  // ===== SEMANA 08 · INICIO =====
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
  // ===== SEMANA 08 · FIN =====
}
// ===== SEMANA 03 · FIN =====
