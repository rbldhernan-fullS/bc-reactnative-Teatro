// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './seatmapStyles';

/** Leyenda de colores del mapa: disponible, seleccionada y ocupada. */
export function SeatLegend(): React.JSX.Element {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.legendAvailable]} />
        <Text style={styles.legendText}>Disponible</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.legendSelected]} />
        <Text style={styles.legendText}>Seleccionada</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.legendOccupied]} />
        <Text style={styles.legendText}>Ocupada</Text>
      </View>
    </View>
  );
}
// ===== SEMANA 10 · FIN =====
