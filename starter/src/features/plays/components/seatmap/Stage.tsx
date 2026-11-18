// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { Text } from 'react-native';

import { styles } from './seatmapStyles';

/** Etiqueta del escenario: marca el frente de la sala sobre el mapa. */
export function Stage(): React.JSX.Element {
  return <Text style={styles.stageLabel}>ESCENARIO</Text>;
}
// ===== SEMANA 10 · FIN =====
