// ===== SEMANA 04 · INICIO =====
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { Item } from '../types';
import { RADIUS, SIZES, SPACING } from '../theme';
import { ItemCard } from './ItemCard';
import { SaveButton } from './SaveButton';

interface PressableCardProps {
  item: Item;
  saved: boolean;
  onPress: (item: Item) => void;
  onToggleSave: (item: Item) => void;
  compact?: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const SAVE_BUTTON_TOP_MARGIN = 48;

/**
 * Tarjeta pulsable con su botón de guardar **como hermano**, no anidado.
 *
 * Estructura del DOM en web:
 *
 *   <div>                      ← contenedor relativo
 *     <button>…tarjeta…</button>   ← navega al detalle
 *     <button>guardar</button>     ← acción independiente
 *   </div>
 *
 * Así se elimina el error `<button> cannot be a descendant of <button>` (E‑01)
 * sin necesidad de `stopPropagation`.
 */
export const PressableCard = React.memo(function PressableCard({
  item,
  saved,
  onPress,
  onToggleSave,
  compact = false,
  onPressIn,
  onPressOut,
}: PressableCardProps): React.JSX.Element {
  const imageHeight = compact ? SIZES.cardImageCompactHeight : SIZES.cardImageHeight;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [styles.pressTarget, pressed && styles.pressTargetPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Obra ${item.name}, género ${item.genre}, precio ${item.price} pesos`}
      >
        <ItemCard item={item} compact={compact} />
      </Pressable>

      <SaveButton
        itemName={item.name}
        saved={saved}
        onPress={() => onToggleSave(item)}
        style={[styles.saveButton, { top: imageHeight - SAVE_BUTTON_TOP_MARGIN }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
  },
  pressTarget: {
    borderRadius: RADIUS.lg,
  },
  pressTargetPressed: {
    opacity: 0.92,
  },
  saveButton: {
    position: 'absolute',
    right: SPACING.sm,
  },
});
// ===== SEMANA 04 · FIN =====
