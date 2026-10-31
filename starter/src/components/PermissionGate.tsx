// ============================================
// COMPONENT: PermissionGate — Semana 11
// Estado de permiso reutilizable: comprobando / denegado / concedido.
// Evita repetir la UI de "solicitar permiso" y "abrir ajustes" en cada API.
// ============================================

import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Forma mínima que comparten `CameraPermissionResponse` y
 * `LocationPermissionResponse`. Al declararla aquí, el componente no depende
 * de los tipos internos de expo-camera ni de expo-location.
 */
export interface PermissionSnapshot {
  granted: boolean;
  status: PermissionStatus;
  canAskAgain: boolean;
}

interface PermissionGateProps {
  /** `null` mientras se consulta el permiso por primera vez */
  permission: PermissionSnapshot | null;
  /** Muestra un spinner en el botón mientras el sistema responde */
  requesting?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  /** Explicación de para qué se usa el permiso dentro del dominio */
  description: string;
  /** Texto adicional cuando el usuario ya denegó el permiso */
  deniedHint?: string;
  onRequest: () => void;
  /** Contenido que solo se monta cuando el permiso está concedido */
  children?: React.ReactNode;
}

export function PermissionGate({
  permission,
  requesting = false,
  icon = 'lock-closed-outline',
  title,
  description,
  deniedHint,
  onRequest,
  children,
}: PermissionGateProps): React.JSX.Element {
  if (permission?.granted) {
    return <>{children}</>;
  }

  const isChecking = permission === null;
  const canAskAgain = permission?.canAskAgain ?? false;

  async function handleOpenSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch {
      // En algunos emuladores no existe la pantalla de ajustes de la app.
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {isChecking ? (
          <ActivityIndicator color={COLORS.accent} />
        ) : (
          <Ionicons name={icon} size={SIZES.iconLg} color={COLORS.accent} />
        )}
      </View>

      <Text style={styles.title}>
        {isChecking ? 'Comprobando permiso…' : title}
      </Text>

      <Text style={styles.description}>
        {isChecking ? 'Consultando el estado actual del permiso.' : description}
      </Text>

      {!isChecking && !canAskAgain ? (
        <Text style={styles.deniedHint}>
          {deniedHint ??
            'El permiso está bloqueado. Actívalo desde los ajustes del sistema.'}
        </Text>
      ) : null}

      {!isChecking ? (
        <Pressable
          style={({ pressed }) => [
            styles.action,
            (pressed || requesting) && styles.actionPressed,
          ]}
          onPress={canAskAgain ? onRequest : () => void handleOpenSettings()}
          disabled={requesting}
          accessibilityRole="button"
          accessibilityLabel={
            canAskAgain ? 'Permitir acceso' : 'Abrir ajustes del sistema'
          }
        >
          {requesting ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.actionText}>
              {canAskAgain ? 'Permitir acceso' : 'Abrir ajustes'}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.xl,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  deniedHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.warning,
    textAlign: 'center',
  },
  action: {
    marginTop: SPACING.md,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
});
