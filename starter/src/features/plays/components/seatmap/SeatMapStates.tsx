// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { View } from 'react-native';

import { ScreenState } from '../../../../components/ui/ScreenState';
import { styles } from './seatmapStyles';

type SeatMapStateKind = 'loading' | 'error' | 'missing';

interface SeatMapStatesProps {
  status: SeatMapStateKind;
  message?: string;
  onRetry: () => void;
}

/** Estados previos al mapa: cargando, error de red y función inexistente. */
export function SeatMapStates({ status, message, onRetry }: SeatMapStatesProps): React.JSX.Element {
  if (status === 'loading') {
    return (
      <View style={styles.screen}>
        <ScreenState
          loading
          title="Preparando el mapa"
          message="Consultando la sala y las butacas disponibles."
        />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.screen}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la sala"
          message={message ?? 'Revisa tu conexión e inténtalo de nuevo.'}
          actionLabel="Reintentar"
          onAction={onRetry}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenState
        icon="ticket-outline"
        title="Función no encontrada"
        message="La obra que intentas reservar ya no está en cartelera."
      />
    </View>
  );
}
// ===== SEMANA 10 · FIN =====
