// ===== SEMANA 04 · INICIO =====
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, RADIUS, SIZES, SPACING } from '../../../../theme';

interface SaveButtonProps {
  itemName: string;
  saved: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón de guardar/quitado de una obra.
 *
 * Nace para la corrección E‑01: debe ser **hermano** del área pulsable de la
 * tarjeta, nunca su descendiente. En HTML un `<button>` dentro de otro `<button>`
 * es inválido y provoca un error de hidratación en React Native Web.
 */
export const SaveButton = React.memo(function SaveButton({
  itemName,
  saved,
  onPress,
  style,
}: SaveButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        saved && styles.buttonActive,
        pressed && styles.buttonPressed,
        style,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        saved ? `Quitar ${itemName} de guardados` : `Guardar ${itemName} en guardados`
      }
      accessibilityState={{ selected: saved }}
    >
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={SIZES.iconMd}
        color={saved ? COLORS.accent : COLORS.textPrimary}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonActive: {
    borderColor: COLORS.accent,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
// ===== SEMANA 04 · FIN =====
