// ===== SEMANA 04 · INICIO =====
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
} from 'react-native';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { Item } from '../../../../types';
import { RADIUS, SIZES, SPACING } from '../../../../theme';
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
  /**
   * Etiqueta y acciones accesibles del área pulsable. La variante web las usa
   * para explicar las flechas del teclado sin añadir un contenedor enfocable:
   * un `View` con `accessibilityRole="button"` se renderiza como `<button>` y
   * anidaría el botón de la tarjeta (E‑01).
   */
  accessibilityLabel?: string;
  accessibilityActions?: readonly AccessibilityActionInfo[];
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
  /**
   * Acción extra que se pinta a la izquierda del botón de guardar, dentro de la
   * misma fila absoluta. Sigue siendo hermana del área pulsable, así que no hay
   * botones anidados. La variante web la usa para el descartar discreto.
   */
  trailingAction?: React.ReactNode;
}

const SAVE_BUTTON_TOP_MARGIN = 48;

/**
 * Tarjeta pulsable con su botón de guardar **como hermano**, no anidado.
 *
 * Estructura del DOM en web:
 *
 *   <div>                      ← contenedor relativo
 *     <button>…tarjeta…</button>   ← navega al detalle
 *     <div>                         ← fila de acciones (hermana)
 *       <button>descartar</button>
 *       <button>guardar</button>
 *     </div>
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
  accessibilityLabel,
  accessibilityActions,
  onAccessibilityAction,
  trailingAction,
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
        accessibilityLabel={
          accessibilityLabel ??
          `Obra ${item.name}, género ${item.genre}, precio ${item.price} pesos`
        }
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={onAccessibilityAction}
      >
        <ItemCard item={item} compact={compact} />
      </Pressable>

      <View style={[styles.actionRow, { top: imageHeight - SAVE_BUTTON_TOP_MARGIN }]}>
        {trailingAction}

        <SaveButton itemName={item.name} saved={saved} onPress={() => onToggleSave(item)} />
      </View>
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
  actionRow: {
    position: 'absolute',
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
// ===== SEMANA 04 · FIN =====
