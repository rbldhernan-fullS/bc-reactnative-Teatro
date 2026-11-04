// ===== SEMANA 01 · INICIO =====
import React from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { NavigationContainer } from '@react-navigation/native';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 01 · INICIO =====
import { StatusBar } from 'expo-status-bar';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
// ===== SEMANA 03 · FIN =====

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
export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
// ===== SEMANA 01 · FIN =====
