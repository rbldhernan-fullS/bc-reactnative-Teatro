// ===== SEMANA 03 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

interface DetailMetaGridProps {
  hall: string;
  duration: string;
  date: string;
  time: string;
}

/** Ficha rápida de la función: sala, duración, fecha y horario. */
export function DetailMetaGrid({
  hall,
  duration,
  date,
  time,
}: DetailMetaGridProps): React.JSX.Element {
  return (
    <View style={styles.metaGrid}>
      <View style={styles.metaCard}>
        <Text style={styles.metaIcon}>🏛</Text>
        <Text style={styles.metaLabel}>Sala</Text>
        <Text style={styles.metaValue} numberOfLines={1}>
          {hall}
        </Text>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaIcon}>⏳</Text>
        <Text style={styles.metaLabel}>Duración</Text>
        <Text style={styles.metaValue}>{duration}</Text>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaIcon}>📅</Text>
        <Text style={styles.metaLabel}>Fecha</Text>
        <Text style={styles.metaValue}>{date}</Text>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaIcon}>🕒</Text>
        <Text style={styles.metaLabel}>Horario</Text>
        <Text style={styles.metaValue}>{time}</Text>
      </View>
    </View>
  );
}
// ===== SEMANA 03 · FIN =====
