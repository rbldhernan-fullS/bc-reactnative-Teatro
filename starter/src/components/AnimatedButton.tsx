// ===== SEMANA 01 · INICIO =====
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
// ===== SEMANA 01 · FIN =====
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

const PRESS_IN_CONFIG = {
  toValue: 0.95,
  duration: 90,
  useNativeDriver: true,
} as const;

const PRESS_OUT_CONFIG = {
  toValue: 1,
  tension: 220,
  friction: 9,
  useNativeDriver: true,
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
  const scale = useRef(new Animated.Value(1)).current;
  const isPrimary = variant === 'primary';

  function handlePressIn(): void {
    Animated.timing(scale, PRESS_IN_CONFIG).start();
  }

  function handlePressOut(): void {
    Animated.spring(scale, PRESS_OUT_CONFIG).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        style={[
          styles.base,
          compact && styles.compact,
          isPrimary ? styles.primary : styles.outline,
          disabled && styles.disabled,
        ]}
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
      </Pressable>
    </Animated.View>
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
