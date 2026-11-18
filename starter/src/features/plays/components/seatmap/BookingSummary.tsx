// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { AnimatedButton } from '../../../../components/ui/AnimatedButton';
import { SPACING } from '../../../../theme';
import { styles } from './seatmapStyles';

interface BookingSummaryProps {
  selectedCount: number;
  total: number;
  bottomInset: number;
  onConfirm: () => void;
}

/** Barra inferior con el resumen de la reserva y la confirmación. */
export function BookingSummary({
  selectedCount,
  total,
  bottomInset,
  onConfirm,
}: BookingSummaryProps): React.JSX.Element {
  return (
    <View style={[styles.bottomBar, { paddingBottom: SPACING.md + bottomInset }]}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          {selectedCount} {selectedCount === 1 ? 'butaca' : 'butacas'}
        </Text>
        <Text style={styles.summaryTotal}>
          ${total.toLocaleString('es-CO')} <Text style={styles.summaryCurrency}>COP</Text>
        </Text>
      </View>

      <AnimatedButton
        label="Confirmar"
        onPress={onConfirm}
        disabled={selectedCount === 0}
        accessibilityLabel="Confirmar la reserva de butacas"
      />
    </View>
  );
}
// ===== SEMANA 10 · FIN =====
