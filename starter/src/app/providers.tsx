// ===== SEMANA 05 · INICIO =====
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaProvider } from 'react-native-safe-area-context';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { NotificationCenter } from '../components/ui/NotificationCenter';
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 05 · INICIO =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 01 · INICIO =====
interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Envoltorio de proveedores globales: gestos, React Query, área segura, avisos
 * y barra de estado. Vive fuera de `App.tsx` para que el punto de entrada quede
 * solo con el arranque de la sesión y el navegador.
 */
export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  // ===== SEMANA 10 · INICIO =====
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          {children}
          {/* ===== SEMANA 12 · INICIO ===== */}
          <NotificationCenter />
          {/* ===== SEMANA 12 · FIN ===== */}
          <StatusBar style="light" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
  // ===== SEMANA 10 · FIN =====
}
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 01 · INICIO =====
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
// ===== SEMANA 01 · FIN =====
