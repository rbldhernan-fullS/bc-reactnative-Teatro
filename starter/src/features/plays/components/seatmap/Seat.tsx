// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { Pressable, Text } from 'react-native';

import type { Seat as SeatModel } from '../../../../types';
import { styles } from './seatmapStyles';

interface SeatProps {
  seat: SeatModel;
  isSelected: boolean;
  isAisle: boolean;
  onPress: (seat: SeatModel) => void;
}

/** Butaca individual del mapa. Las ocupadas se muestran atenuadas y sin acción. */
export function Seat({ seat, isSelected, isAisle, onPress }: SeatProps): React.JSX.Element {
  const isOccupied = seat.status === 'occupied';

  return (
    <Pressable
      onPress={() => onPress(seat)}
      disabled={isOccupied}
      style={[
        styles.seat,
        isAisle && styles.aisleSeat,
        isOccupied && styles.seatOccupied,
        isSelected && styles.seatSelected,
      ]}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isOccupied,
        selected: isSelected,
      }}
      accessibilityLabel={`Fila ${seat.row}, butaca ${seat.number}${
        isOccupied ? ', ocupada' : isSelected ? ', seleccionada' : ', disponible'
      }`}
    >
      <Text
        style={[
          styles.seatNumber,
          isOccupied && styles.seatNumberOccupied,
          isSelected && styles.seatNumberSelected,
        ]}
      >
        {seat.number}
      </Text>
    </Pressable>
  );
}
// ===== SEMANA 10 · FIN =====
