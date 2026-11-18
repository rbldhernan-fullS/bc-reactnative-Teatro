// ===== SEMANA 05 · INICIO =====
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenState } from '../../../../components/ui/ScreenState';
import { COLORS } from '../../../../theme';
import { styles } from './styles';

type DetailStateKind = 'loading' | 'notFound' | 'error' | 'missing';

interface DetailStatesProps {
  status: DetailStateKind;
  message?: string;
  onRetry: () => void;
  onBack: () => void;
}

/**
 * Estados de la ficha antes de tener la obra: cargando, 404, error de red y
 * "sin datos". Se separan de la pantalla para que el flujo normal quede legible
 * y para no repetir el envoltorio de `ScreenState`.
 */
export function DetailStates({
  status,
  message,
  onRetry,
  onBack,
}: DetailStatesProps): React.JSX.Element {
  if (status === 'loading') {
    return (
      <View style={styles.screenWrapper}>
        <ScreenState
          loading
          title="Cargando la obra"
          message="Consultando la ficha artística de la función."
        />
      </View>
    );
  }

  // Un 404 no es una caída de la API: la obra no existe (E‑07). Se muestra un
  // estado de "no encontrada" sin reintentos ni errores en consola.
  if (status === 'notFound') {
    return (
      <View style={styles.screenWrapper}>
        <ScreenState
          icon="search-outline"
          title="Obra no encontrada"
          message="La obra que buscas no existe o salió de cartelera."
          actionLabel="Volver a la cartelera"
          onAction={onBack}
        />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.screenWrapper}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la obra"
          message={message ?? 'Revisa tu conexión e inténtalo de nuevo.'}
          actionLabel="Reintentar"
          onAction={onRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screenWrapper, styles.notFoundContainer]}>
      <Text style={styles.notFoundTitle}>Obra no encontrada</Text>
      <Text style={styles.notFoundSubtitle}>La obra que buscas ya no está en cartelera.</Text>
      <Pressable
        style={styles.bookButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver a la cartelera"
      >
        <Text style={styles.bookButtonText}>Volver a la cartelera</Text>
      </Pressable>
    </View>
  );
}

interface DetailInfoSectionsProps {
  id: string;
  name: string;
  genre: string;
  synopsis: string;
  isDeleting: boolean;
  onDelete: () => void;
}

/** Sinopsis, ficha artística y acción de eliminar la obra. */
export function DetailInfoSections({
  id,
  name,
  genre,
  synopsis,
  isDeleting,
  onDelete,
}: DetailInfoSectionsProps): React.JSX.Element {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sinopsis Argumental</Text>
        <Text style={styles.synopsisText}>{synopsis}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ficha Artística</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Identificador</Text>
          <Text style={styles.specValue}>OBRA-{id.padStart(3, '0')}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Género</Text>
          <Text style={styles.specValue}>{genre}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Público</Text>
          <Text style={styles.specValue}>
            {genre === 'Infantil' ? 'Familiar / Todo público' : 'Mayores de 14 años'}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Idioma</Text>
          <Text style={styles.specValue}>Español</Text>
        </View>

        {/* ===== SEMANA 12 · INICIO ===== */}
        <Pressable
          style={({ pressed }) => [
            styles.deletePlayButton,
            pressed && styles.deletePlayButtonPressed,
          ]}
          onPress={onDelete}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar la obra ${name}`}
        >
          {isDeleting ? (
            <ActivityIndicator color={COLORS.error} />
          ) : (
            <>
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              <Text style={styles.deletePlayText}>Eliminar obra</Text>
            </>
          )}
        </Pressable>
        {/* ===== SEMANA 12 · FIN ===== */}
      </View>
    </>
  );
}
// ===== SEMANA 05 · FIN =====
