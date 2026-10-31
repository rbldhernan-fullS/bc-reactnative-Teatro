// ============================================
// APP ENTRY POINT — Semanas 05, 07 y 08
// QueryClientProvider + restauración de sesión + NavigationContainer
// ============================================

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/stores/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from './src/theme';

// Una sola instancia por app: se crea fuera del componente para que no se
// recree en cada render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Espera la hidratación de Zustand y luego valida/restaura la sesión desde
 * SecureStore antes de montar la navegación. Evita el parpadeo Login → App.
 */
function BootstrapGate(): React.JSX.Element {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    // Nos suscribimos primero para no perder la hidratación si terminó
    // entre el render y la ejecución del efecto.
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

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <BootstrapGate />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
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
