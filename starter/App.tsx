// ===== SEMANA 10 · INICIO =====
import 'react-native-gesture-handler';
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from './src/navigation/RootNavigator';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 08 · INICIO =====
import { useAuthStore } from './src/stores/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from './src/theme';
// ===== SEMANA 08 · FIN =====

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

// ===== SEMANA 08 · INICIO =====
function BootstrapGate(): React.JSX.Element {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      void bootstrap();
    });

    if (useAuthStore.persist.hasHydrated()) {
      void bootstrap();
    }

    return unsubscribe;
  }, [bootstrap]);

  if (isBootstrapping) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashEmoji}>🎭</Text>
        <Text style={styles.splashTitle}>Teatro Colón</Text>
        <ActivityIndicator color={COLORS.accent} size="large" />
        <Text style={styles.splashText}>Restaurando tu sesión…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
// ===== SEMANA 08 · FIN =====

// ===== SEMANA 01 · INICIO =====
export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BootstrapGate />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 08 · INICIO =====
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  splashEmoji: {
    fontSize: TYPOGRAPHY.size.display,
  },
  splashTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  splashText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
});
// ===== SEMANA 08 · FIN =====
