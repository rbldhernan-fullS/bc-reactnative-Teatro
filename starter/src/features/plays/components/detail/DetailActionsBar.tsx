// ===== SEMANA 03 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { AnimatedButton } from '../../../../components/ui/AnimatedButton';
import { SPACING } from '../../../../theme';
import { styles } from './styles';

interface DetailActionsBarProps {
  price: number;
  name: string;
  bottomInset: number;
  onBook: () => void;
}

/** Barra inferior fija con el precio de la entrada y la reserva de butacas. */
export function DetailActionsBar({
  price,
  name,
  bottomInset,
  onBook,
}: DetailActionsBarProps): React.JSX.Element {
  return (
    <View style={[styles.bottomBar, { paddingBottom: SPACING.md + bottomInset }]}>
      <View style={styles.priceColumn}>
        <Text style={styles.priceCaption}>Entrada General</Text>
        <Text style={styles.priceNumber}>
          ${price.toLocaleString('es-CO')} <Text style={styles.priceCurrency}>COP</Text>
        </Text>
      </View>

      <AnimatedButton
        label="Reservar Butacas"
        onPress={onBook}
        icon="ticket-outline"
        accessibilityLabel={`Reservar butacas para ${name}`}
      />
    </View>
  );
}
// ===== SEMANA 03 · FIN =====
