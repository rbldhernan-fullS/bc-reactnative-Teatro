// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { Ionicons } from '@expo/vector-icons';

import type { Item } from '../types';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import { AnimatedCard } from './AnimatedCard';

interface SwipeableCardProps {
  item: Item;
  onPress: (item: Item) => void;
  saved: boolean;
  onToggleSave: (item: Item) => void;
  onDismiss: (item: Item) => void;
  compact?: boolean;
}

/**
 * Variante web de `SwipeableCard`.
 *
 * En web, `GestureDetector` de react-native-gesture-handler provoca
 * `Cannot record touch end without a touch start` (E‑02) al combinarse con
 * `Pressable`. Aquí el gesto se sustituye por un botón explícito “Descartar”,
 * accesible por teclado y lector de pantalla. Metro resuelve este archivo
 * automáticamente para la plataforma web.
 */
export const SwipeableCard = React.memo(function SwipeableCard({
  item,
  onPress,
  saved,
  onToggleSave,
  onDismiss,
  compact = false,
}: SwipeableCardProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AnimatedCard
        item={item}
        onPress={onPress}
        saved={saved}
        onToggleSave={onToggleSave}
        compact={compact}
      />

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => onDismiss(item)}
          style={({ pressed }) => [styles.dismissButton, pressed && styles.dismissButtonPressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Descartar ${item.name} de la cartelera`}
        >
          <Ionicons name="eye-off-outline" size={SIZES.iconSm} color={COLORS.error} />
          <Text style={styles.dismissText}>Descartar</Text>
        </Pressable>
      </View>
    </View>
  );
});
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: SPACING.base,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  dismissButtonPressed: {
    opacity: 0.7,
  },
  dismissText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
});
