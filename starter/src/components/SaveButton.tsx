// ===== SEMANA 04 · INICIO =====
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SIZES, SPACING } from '../theme';

interface SaveButtonProps {
  name: string;
  saved: boolean;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
}

export function SaveButton({ name, saved, onPress, style }: SaveButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? `Quitar ${name} de guardados` : `Guardar ${name} en guardados`}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        saved && styles.active,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={SIZES.iconMd}
        color={saved ? COLORS.tabActive : COLORS.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  active: { borderColor: COLORS.tabActive },
  pressed: { opacity: 0.7 },
});
// ===== SEMANA 04 · FIN =====
