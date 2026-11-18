// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Switch, Text, View } from 'react-native';

import { COLORS } from '../../../theme';
import { styles } from '../styles';

interface SwitchRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/** Fila de ajuste booleano: texto a la izquierda y `Switch` a la derecha. */
export function SwitchRow({
  label,
  description,
  value,
  onValueChange,
}: SwitchRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.accent }}
        thumbColor={COLORS.background}
        ios_backgroundColor={COLORS.border}
        accessibilityLabel={label}
      />
    </View>
  );
}
// ===== SEMANA 07 · FIN =====
