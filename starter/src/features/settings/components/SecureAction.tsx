// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { styles } from '../styles';

interface SecureActionProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
}

/** Botón compacto con icono usado en las tarjetas de Seguridad y Notificaciones. */
export function SecureAction({
  label,
  icon,
  onPress,
  variant = 'outline',
  disabled = false,
}: SecureActionProps): React.JSX.Element {
  const iconColor =
    variant === 'primary' ? COLORS.background : variant === 'danger' ? COLORS.error : COLORS.accent;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' && styles.actionPrimary,
        variant === 'danger' && styles.actionDanger,
        pressed && !disabled && styles.actionPressed,
        disabled && styles.actionDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Ionicons name={icon} size={SIZES.iconSm} color={iconColor} />
      <Text
        style={[
          styles.actionText,
          variant === 'primary' && styles.actionTextPrimary,
          variant === 'danger' && styles.actionTextDanger,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
// ===== SEMANA 07 · FIN =====
