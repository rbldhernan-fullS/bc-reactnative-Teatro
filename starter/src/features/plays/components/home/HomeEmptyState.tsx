// ===== SEMANA 05 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../../../components/ui/ScreenState';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { styles } from './styles';

export type HomeEmptyVariant = 'empty' | 'search' | 'dismissed' | 'soldOut';

interface HomeEmptyStateProps {
  variant: HomeEmptyVariant;
  query: string;
  dismissedCount: number;
  onCreate: () => void;
  onClearQuery: () => void;
  onRestore: () => void;
  onShowAll: () => void;
}

function ClearButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.clearFilterButton,
        pressed && styles.clearFilterButtonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.clearFilterButtonText}>{label}</Text>
    </Pressable>
  );
}

/**
 * Estado vacío del listado. Cada causa tiene su propio mensaje y su salida
 * directa: crear la primera obra, limpiar la búsqueda, restaurar las
 * descartadas o desactivar el filtro de butacas.
 */
export function HomeEmptyState({
  variant,
  query,
  dismissedCount,
  onCreate,
  onClearQuery,
  onRestore,
  onShowAll,
}: HomeEmptyStateProps): React.JSX.Element {
  if (variant === 'empty') {
    return (
      <ScreenState
        icon="ticket-outline"
        title="Cartelera vacía"
        message="Todavía no hay obras registradas. Crea la primera función para abrir la temporada."
        actionLabel="Crear obra"
        onAction={onCreate}
      />
    );
  }

  if (variant === 'search') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎭</Text>
        <Text style={styles.emptyTitle}>Sin obras encontradas</Text>
        <Text style={styles.emptySubtitle}>
          No hay funciones que coincidan con "{query}". Prueba buscando por otro título, director o
          género teatral.
        </Text>
        <ClearButton label="Limpiar búsqueda" onPress={onClearQuery} />
      </View>
    );
  }

  if (variant === 'dismissed') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🙈</Text>
        <Text style={styles.emptyTitle}>Cartelera descartada</Text>
        <Text style={styles.emptySubtitle}>
          Descartaste {dismissedCount} {dismissedCount === 1 ? 'obra' : 'obras'} de esta sesión.
          Puedes restaurarlas cuando quieras.
        </Text>
        <ClearButton label="Restaurar cartelera" onPress={onRestore} />
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎟️</Text>
      <Text style={styles.emptyTitle}>Sin funciones disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Todas las obras de la cartelera están agotadas. Desactiva el filtro para volver a ver la
        temporada completa.
      </Text>
      <ClearButton label="Ver todas las obras" onPress={onShowAll} />
    </View>
  );
}
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 10 · INICIO =====
// El estado «Cartelera descartada» vive dentro de HomeEmptyState: comparte la
// maqueta del vacío y solo cambia el texto y la acción.
// ===== SEMANA 10 · FIN =====
