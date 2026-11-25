// ===== SEMANA 10 · INICIO =====
import 'react-native-gesture-handler';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 12 · INICIO =====
import './src/platform/devConsole';
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 01 · INICIO =====
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { NavigationContainer } from '@react-navigation/native';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 12 · INICIO =====
import * as Notifications from './src/services/notificationScheduler';

import { flushPendingNotificationNavigation, navigationRef } from './src/navigation/navigationRef';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { RootNavigator } from './src/navigation/RootNavigator';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { linking } from './src/navigation/linking';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 08 · INICIO =====
import { useAuthStore } from './src/stores/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from './src/theme';
// ===== SEMANA 08 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { AppProviders } from './src/app/providers';
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 12 · INICIO =====
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 08 · INICIO =====
function BootstrapGate(): React.JSX.Element {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const restoreError = useAuthStore((state) => state.restoreError);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let active = true;
    // Zustand también resuelve rehydrate cuando el perfil guardado es ilegible.
    // En ambos casos se comprueban las credenciales del almacenamiento seguro.
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      if (active) void bootstrap();
    });
    return () => {
      active = false;
    };
  }, [bootstrap]);

  async function retrySession(): Promise<void> {
    setRetrying(true);
    try {
      await bootstrap();
    } finally {
      setRetrying(false);
    }
  }

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
    <>
      {restoreError && (
        <View style={styles.retryBanner}>
          <Text accessibilityLiveRegion="polite" style={styles.retryMessage}>
            {restoreError}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={retrying}
            onPress={() => void retrySession()}
          >
            <Text style={styles.retryAction}>
              {retrying ? 'Reintentando…' : 'Reintentar sesión'}
            </Text>
          </Pressable>
        </View>
      )}
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onReady={flushPendingNotificationNavigation}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
// ===== SEMANA 08 · FIN =====

// ===== SEMANA 01 · INICIO =====
export default function App(): React.JSX.Element {
  return (
    <AppProviders>
      <BootstrapGate />
    </AppProviders>
  );
}
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 08 · INICIO =====
const styles = StyleSheet.create({
  retryBanner: {
    backgroundColor: COLORS.surfaceWarm,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  retryMessage: { color: COLORS.textPrimary },
  retryAction: { color: COLORS.accent, fontWeight: TYPOGRAPHY.weight.bold },
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
