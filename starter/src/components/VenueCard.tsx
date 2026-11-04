// ===== SEMANA 01 · INICIO =====
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 11 · INICIO =====
import { PermissionGate } from './PermissionGate';
import { useLocation } from '../hooks/useLocation';
import type { TheatreHall } from '../types';
import {
  TEATRO_COLON_VENUE,
  formatDistance,
  getDistanceInMeters,
  getVenueDirectionsUrl,
} from '../utils/theatre';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

interface VenueCardProps {
  hall: TheatreHall;
}

export function VenueCard({ hall }: VenueCardProps): React.JSX.Element {
  const {
    permission,
    coords,
    address,
    error,
    requesting,
    loading,
    watching,
    requestAccess,
    refresh,
    toggleWatching,
  } = useLocation();

  async function handleOpenMaps(): Promise<void> {
    try {
      await Linking.openURL(getVenueDirectionsUrl());
    } catch {
      Alert.alert(
        'Mapas no disponible',
        'No pudimos abrir la aplicación de mapas en este dispositivo.'
      );
    }
  }

  const distance = coords
    ? getDistanceInMeters(
        { latitude: coords.latitude, longitude: coords.longitude },
        TEATRO_COLON_VENUE
      )
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="location-outline" size={SIZES.iconMd} color={COLORS.accent} />
        <Text style={styles.title}>Sede del teatro</Text>
      </View>

      <View style={styles.venueBlock}>
        <Text style={styles.venueName}>{TEATRO_COLON_VENUE.name}</Text>
        <Text style={styles.venueAddress}>
          {TEATRO_COLON_VENUE.address} · {TEATRO_COLON_VENUE.city}
        </Text>
        <Text style={styles.venueHall}>Tu función es en la {hall}</Text>
      </View>

      <PermissionGate
        permission={permission}
        requesting={requesting}
        icon="navigate-outline"
        title="Permiso de ubicación"
        description="Comparte tu ubicación para calcular la distancia al teatro y mostrarte la dirección desde donde estás."
        deniedHint="Puedes activar la ubicación desde los ajustes del sistema y volver a intentarlo."
        onRequest={() => {
          void requestAccess();
        }}
      >
        <View style={styles.locationBlock}>
          {loading && !coords ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.accent} />
              <Text style={styles.loadingText}>Obteniendo tu ubicación…</Text>
            </View>
          ) : null}

          {coords ? (
            <>
              <View style={styles.distanceRow}>
                <Text style={styles.distanceIcon}>📍</Text>
                <Text style={styles.distanceText}>
                  Estás a{' '}
                  <Text style={styles.distanceValue}>
                    {distance !== null ? formatDistance(distance) : 'sin datos'}
                  </Text>{' '}
                  del {TEATRO_COLON_VENUE.name}
                </Text>
              </View>

              <Text style={styles.addressLabel}>Tu ubicación</Text>
              <Text style={styles.addressValue}>
                {address ?? 'Dirección no disponible en este dispositivo'}
              </Text>
              <Text style={styles.coordsValue}>
                {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
              </Text>

              <View style={styles.watchRow}>
                <View style={styles.watchInfo}>
                  <Text style={styles.watchLabel}>Seguir mi recorrido</Text>
                  <Text style={styles.watchHint}>
                    Actualiza la distancia cada 5 segundos mientras caminas.
                  </Text>
                </View>
                <Switch
                  value={watching}
                  onValueChange={toggleWatching}
                  trackColor={{ false: COLORS.border, true: COLORS.accent }}
                  thumbColor={COLORS.background}
                  accessibilityLabel="Seguir mi recorrido hasta el teatro"
                />
              </View>
            </>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.action,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                void refresh();
              }}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Actualizar mi ubicación"
              accessibilityState={{ disabled: loading }}
            >
              <Ionicons name="refresh" size={SIZES.iconSm} color={COLORS.accent} />
              <Text style={styles.actionText}>
                {loading ? 'Actualizando…' : 'Actualizar'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.action,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                void handleOpenMaps();
              }}
              accessibilityRole="button"
              accessibilityLabel="Abrir la sede en la aplicación de mapas"
            >
              <Ionicons name="map-outline" size={SIZES.iconSm} color={COLORS.accent} />
              <Text style={styles.actionText}>Cómo llegar</Text>
            </Pressable>
          </View>
        </View>
      </PermissionGate>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  venueBlock: {
    gap: SPACING.xxs,
  },
  venueName: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  venueAddress: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  venueHall: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  locationBlock: {
    gap: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  distanceIcon: {
    fontSize: TYPOGRAPHY.size.sm,
  },
  distanceText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  distanceValue: {
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  addressLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  addressValue: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textPrimary,
  },
  coordsValue: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontVariant: ['tabular-nums'],
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.xs,
  },
  watchInfo: {
    flex: 1,
    gap: SPACING.xxs,
  },
  watchLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  watchHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  error: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.warning,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  actionPressed: {
    opacity: 0.75,
  },
  actionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});
// ===== SEMANA 11 · FIN =====
