// ============================================
// COMPONENT: AnimatedButton — Semana 10
// Feedback táctil con Gesture.Tap + withTiming / withSpring (Reanimated 4)
// ============================================

import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';

type ButtonVariant = 'primary' | 'outline';

interface AnimatedButtonProps {
  /** Texto visible del botón */
  label: string;
  /** Acción ejecutada al completar el tap */
  onPress: () => void;
  /** Estilo visual: relleno dorado u contorno sobre fondo vino */
  variant?: ButtonVariant;
  /** Icono opcional de Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Reduce paddings y tipografía para cabeceras */
  compact?: boolean;
  /** Bloquea la interacción y atenúa el botón */
  disabled?: boolean;
  /** Etiqueta accesible cuando el texto visible no basta */
  accessibilityLabel?: string;
}

const PRESSED_SCALE = 0.95;

const PRESS_OUT_SPRING = {
  damping: 10,
  stiffness: 240,
  mass: 0.7,
} as const;

export function AnimatedButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  compact = false,
  disabled = false,
  accessibilityLabel,
}: AnimatedButtonProps): React.JSX.Element {
  const scale = useSharedValue(1);
  const isPrimary = variant === 'primary';

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(!disabled)
        .onBegin(() => {
          scale.value = withTiming(PRESSED_SCALE, { duration: 90 });
        })
        .onEnd((_event, success) => {
          scale.value = withSpring(1, PRESS_OUT_SPRING);

          if (success) {
            runOnJS(onPress)();
          }
        })
        .onFinalize(() => {
          scale.value = withSpring(1, PRESS_OUT_SPRING);
        }),
    [disabled, onPress, scale]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          styles.base,
          compact && styles.compact,
          isPrimary ? styles.primary : styles.outline,
          disabled && styles.disabled,
          animatedStyle,
        ]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={compact ? SIZES.iconSm : SIZES.iconMd}
            color={isPrimary ? COLORS.background : COLORS.accent}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            compact && styles.labelCompact,
            isPrimary ? styles.labelPrimary : styles.labelOutline,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  compact: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  primary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  outline: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.accent,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  labelCompact: {
    fontSize: TYPOGRAPHY.size.xs,
  },
  labelPrimary: {
    color: COLORS.background,
  },
  labelOutline: {
    color: COLORS.accent,
  },
});
