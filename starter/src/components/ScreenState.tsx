// ============================================
// COMPONENT: ScreenState — Semana 05
// Estado reutilizable de carga, error o lista vacía
// ============================================

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

interface ScreenStateProps {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function ScreenState({
  title,
  message,
  icon = 'information-circle-outline',
  loading = false,
  actionLabel,
  onAction,
}: ScreenStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <Ionicons name={icon} size={SIZES.iconXl} color={COLORS.textMuted} />
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  title: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  actionButton: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  actionButtonPressed: {
    backgroundColor: COLORS.accentHover,
    opacity: 0.9,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
});
