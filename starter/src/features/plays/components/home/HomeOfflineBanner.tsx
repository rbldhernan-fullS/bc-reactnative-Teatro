// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

interface HomeOfflineBannerProps {
  onRetry: () => void;
}

/** Aviso de que la cartelera viene de la caché local porque no hay red. */
export function HomeOfflineBanner({ onRetry }: HomeOfflineBannerProps): React.JSX.Element {
  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineIcon}>⚠️</Text>
      <View style={styles.offlineTextBlock}>
        <Text style={styles.offlineTitle}>Mostrando datos sin red</Text>
        <Text style={styles.offlineSubtitle}>
          Cartelera recuperada de la caché local del dispositivo.
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.offlineRetry, pressed && styles.offlineRetryPressed]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Volver a intentar la conexión"
      >
        <Text style={styles.offlineRetryText}>Reintentar</Text>
      </Pressable>
    </View>
  );
}
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 10 · INICIO =====
interface HomeDismissedBannerProps {
  count: number;
  onRestore: () => void;
}

/** Franja con las obras descartadas en esta sesión y su restauración. */
export function HomeDismissedBanner({
  count,
  onRestore,
}: HomeDismissedBannerProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.dismissedBanner, pressed && styles.dismissedBannerPressed]}
      onPress={onRestore}
      accessibilityRole="button"
      accessibilityLabel="Restaurar las obras descartadas"
    >
      <Text style={styles.dismissedText}>
        {count} {count === 1 ? 'obra descartada' : 'obras descartadas'}
      </Text>
      <Text style={styles.dismissedAction}>Restaurar</Text>
    </Pressable>
  );
}
// ===== SEMANA 10 · FIN =====
