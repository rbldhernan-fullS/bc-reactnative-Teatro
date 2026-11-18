// ===== SEMANA 03 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, SIZES } from '../../../theme';
import { styles } from '../styles';

interface SavedEmptyStateProps {
  onShowCartelera: () => void;
}

/** Estado vacío de guardados, con salida directa a la cartelera. */
export function SavedEmptyState({ onShowCartelera }: SavedEmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={SIZES.iconXl} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Sin obras guardadas</Text>
      <Text style={styles.emptySubtitle}>
        Usa el bookmark de la cartelera o del detalle para guardar una obra y encontrarla aquí.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.emptyButton, pressed && styles.emptyButtonPressed]}
        onPress={onShowCartelera}
        accessibilityRole="button"
        accessibilityLabel="Ver la cartelera de obras"
      >
        <Text style={styles.emptyButtonText}>Ver cartelera</Text>
      </Pressable>
    </View>
  );
}
// ===== SEMANA 04 · FIN =====
