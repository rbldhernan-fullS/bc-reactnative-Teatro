// ===== SEMANA 03 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { ProgressBar } from '../../../../components/ui/ProgressBar';
import { styles } from './styles';

interface DetailAvailabilityProps {
  availableSeats: number;
  occupancy: number;
  occupiedSeats: number;
  hallCapacity: number;
  hall: string;
}

/** Aviso de butacas disponibles y barra de ocupación de la sala. */
export function DetailAvailability({
  availableSeats,
  occupancy,
  occupiedSeats,
  hallCapacity,
  hall,
}: DetailAvailabilityProps): React.JSX.Element {
  return (
    <>
      <View style={styles.availabilityBanner}>
        <Text style={styles.availabilityIcon}>🎭</Text>
        <View style={styles.availabilityTextWrapper}>
          <Text style={styles.availabilityTitle}>Aforo y Disponibilidad</Text>
          <Text style={styles.availabilitySubtitle}>
            {availableSeats > 10
              ? `${availableSeats} butacas disponibles en esta función`
              : `¡Últimas ${availableSeats} butacas disponibles!`}
          </Text>
        </View>
      </View>

      {/* ===== SEMANA 09 · INICIO ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado del aforo</Text>
        <ProgressBar
          progress={occupancy}
          label="Butacas ocupadas"
          caption={`${occupiedSeats} de ${hallCapacity} butacas ocupadas en la ${hall}`}
        />
      </View>
      {/* ===== SEMANA 09 · FIN ===== */}
    </>
  );
}
// ===== SEMANA 03 · FIN =====
