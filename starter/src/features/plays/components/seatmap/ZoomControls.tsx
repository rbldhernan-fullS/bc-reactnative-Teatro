// ===== SEMANA 10 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../../../theme';
import { styles } from './webViewportStyles';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/** Botones de zoom del mapa en web: acercar, alejar y volver a la vista inicial. */
export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps): React.JSX.Element {
  return (
    <View style={styles.controls}>
      <View style={styles.zoomRow}>
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
          onPress={onZoomOut}
          accessibilityRole="button"
          accessibilityLabel="Alejar el mapa"
        >
          <Ionicons name="remove" size={16} color={COLORS.accent} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
          onPress={onZoomIn}
          accessibilityRole="button"
          accessibilityLabel="Acercar el mapa"
        >
          <Ionicons name="add" size={16} color={COLORS.accent} />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.resetButton, pressed && styles.controlPressed]}
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Centrar y restablecer el zoom"
      >
        <Ionicons name="scan-outline" size={16} color={COLORS.accent} />
        <Text style={styles.controlText}>Centrar</Text>
      </Pressable>
    </View>
  );
}
// ===== SEMANA 10 · FIN =====
