// ===== SEMANA 10 · INICIO =====
import 'react-native-gesture-handler';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 12 · INICIO =====
import './src/platform/devConsole';
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={flushPendingNotificationNavigation}
    >
      <RootNavigator />
    </NavigationContainer>
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
