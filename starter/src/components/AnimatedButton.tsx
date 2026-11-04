// ===== SEMANA 01 · INICIO =====
import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';

type ButtonVariant = 'primary' | 'outline';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  compact?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 10 · INICIO =====
const PRESSED_SCALE = 0.95;
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 09 · INICIO =====
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
  // ===== SEMANA 10 · INICIO =====
  const scale = useSharedValue(1);
  // ===== SEMANA 10 · FIN =====
  const isPrimary = variant === 'primary';

  // ===== SEMANA 10 · INICIO =====
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
  // ===== SEMANA 10 · FIN =====

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
// ===== SEMANA 09 · FIN =====
