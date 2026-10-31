// ============================================
// SCREEN: SeatMapScreen — Semana 10
// Mapa de butacas con zoom (Pinch), desplazamiento (Pan de 2 dedos),
// selección por tap y resumen de reserva.
// ============================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { Seat, TheatreHall } from '../types';
import type { SeatMapScreenProps } from '../navigation/types';
import { AnimatedButton } from '../components/AnimatedButton';
import { ScreenState } from '../components/ScreenState';
import { usePlayById } from '../hooks/usePlays';
import { getApiErrorMessage } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
import { HALL_LAYOUT, buildSeatMap, getHallCapacity } from '../utils/theatre';

const SEAT_SIZE = 22;
const SEAT_GAP = 5;
const ROW_LABEL_WIDTH = 24;
const AISLE_EXTRA = SPACING.md;
const STAGE_HEIGHT = 34;
const ROW_HEIGHT = SEAT_SIZE + SEAT_GAP;
const VIEWPORT_PADDING = SPACING.base * 2;
const MIN_INITIAL_SCALE = 0.55;
const MAX_SCALE = 2.5;
const MAX_SEATS_PER_BOOKING = 8;

function getFitScale(hall: TheatreHall, viewportWidth: number): number {
  const layout = HALL_LAYOUT[hall];
  const contentWidth =
    ROW_LABEL_WIDTH +
    layout.seatsPerRow * (SEAT_SIZE + SEAT_GAP) +
    AISLE_EXTRA;

  if (viewportWidth <= 0) {
    return 1;
  }

  return Math.min(1, (viewportWidth - VIEWPORT_PADDING) / contentWidth);
}

/** Mantiene el mapa dentro de límites razonables al soltar el gesto. */
function clampTranslation(
  value: number,
  contentSize: number,
  viewportSize: number,
  scale: number
): number {
  'worklet';
  const limit = Math.max(0, (contentSize * scale - viewportSize) / 2);
  return Math.min(limit, Math.max(-limit, value));
}

export function SeatMapScreen(): React.JSX.Element {
  const route = useRoute<SeatMapScreenProps['route']>();
  const insets = useSafeAreaInsets();

  const { id } = route.params;
  const { data: item, isLoading, isError, error, refetch } = usePlayById(id);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const hall = item?.hall ?? 'Sala Principal';
  const layout = HALL_LAYOUT[hall];
  const seats = useMemo(() => (item ? buildSeatMap(item) : []), [item]);
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const rows = useMemo(() => {
    const grouped = new Map<string, Seat[]>();

    seats.forEach((seat) => {
      const rowSeats = grouped.get(seat.row);
      if (rowSeats) {
        rowSeats.push(seat);
      } else {
        grouped.set(seat.row, [seat]);
      }
    });

    return Array.from(grouped.entries());
  }, [seats]);

  const contentWidth =
    ROW_LABEL_WIDTH +
    layout.seatsPerRow * (SEAT_SIZE + SEAT_GAP) +
    AISLE_EXTRA;
  const contentHeight = STAGE_HEIGHT + layout.rows * ROW_HEIGHT + SPACING.sm;
  const initialScale = Math.max(
    MIN_INITIAL_SCALE,
    getFitScale(hall, viewport.width)
  );
  const minScale = 0.5;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    scale.value = initialScale;
    translateX.value = 0;
    translateY.value = 0;
  }, [initialScale, item?.id, scale, translateX, translateY]);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          savedScale.value = scale.value;
        })
        .onUpdate((event) => {
          scale.value = Math.min(
            MAX_SCALE,
            Math.max(minScale, savedScale.value * event.scale)
          );
        })
        .onEnd(() => {
          translateX.value = withSpring(
            clampTranslation(
              translateX.value,
              contentWidth,
              viewport.width,
              scale.value
            )
          );
          translateY.value = withSpring(
            clampTranslation(
              translateY.value,
              contentHeight,
              viewport.height,
              scale.value
            )
          );
        }),
    [
      contentHeight,
      contentWidth,
      minScale,
      savedScale,
      scale,
      translateX,
      translateY,
      viewport.height,
      viewport.width,
    ]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(2)
        .onStart(() => {
          startX.value = translateX.value;
          startY.value = translateY.value;
        })
        .onUpdate((event) => {
          translateX.value = startX.value + event.translationX;
          translateY.value = startY.value + event.translationY;
        })
        .onEnd(() => {
          translateX.value = withSpring(
            clampTranslation(
              translateX.value,
              contentWidth,
              viewport.width,
              scale.value
            )
          );
          translateY.value = withSpring(
            clampTranslation(
              translateY.value,
              contentHeight,
              viewport.height,
              scale.value
            )
          );
        }),
    [
      contentHeight,
      contentWidth,
      scale,
      startX,
      startY,
      translateX,
      translateY,
      viewport.height,
      viewport.width,
    ]
  );

  const mapGesture = useMemo(
    () => Gesture.Simultaneous(pinchGesture, panGesture),
    [panGesture, pinchGesture]
  );

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleViewportLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height }
    );
  }, []);

  const handleResetView = useCallback((): void => {
    scale.value = withSpring(initialScale, { damping: 16, stiffness: 180 });
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  }, [initialScale, scale, translateX, translateY]);

  const handleSeatPress = useCallback(
    (seat: Seat): void => {
      if (seat.status === 'occupied') {
        return;
      }

      const alreadySelected = selectedIdSet.has(seat.id);

      if (!alreadySelected && selectedIds.length >= MAX_SEATS_PER_BOOKING) {
        Alert.alert(
          'Límite de butacas',
          `Puedes seleccionar hasta ${MAX_SEATS_PER_BOOKING} butacas por reserva.`
        );
        return;
      }

      setSelectedIds((current) =>
        current.includes(seat.id)
          ? current.filter((selectedId) => selectedId !== seat.id)
          : [...current, seat.id]
      );
    },
    [selectedIdSet, selectedIds.length]
  );

  const handleConfirm = useCallback((): void => {
    if (!item || selectedIds.length === 0) {
      return;
    }

    const total = selectedIds.length * item.price;

    Alert.alert(
      'Reserva confirmada',
      `${selectedIds.length} ${
        selectedIds.length === 1 ? 'butaca' : 'butacas'
      } para "${item.name}"\n${item.hall} · ${item.date} · ${item.time}\nTotal: $${total.toLocaleString(
        'es-CO'
      )} COP`,
      [{ text: 'Cerrar', onPress: () => setSelectedIds([]) }]
    );
  }, [item, selectedIds]);

  if (isLoading) {
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

  if (isError) {
    return (
      <View style={styles.screen}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la sala"
          message={getApiErrorMessage(error)}
          actionLabel="Reintentar"
          onAction={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!item) {
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

  const total = selectedIds.length * item.price;
  const capacity = getHallCapacity(item.hall);

  return (
    <View style={styles.screen}>
      {/* Resumen de la función */}
      <View style={styles.header}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {item.hall} · {item.date} · {item.time}
        </Text>
        <Text style={styles.availability}>
          {item.availableSeats} de {capacity} butacas disponibles
        </Text>
      </View>

      {/* Leyenda */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendAvailable]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendSelected]} />
          <Text style={styles.legendText}>Seleccionada</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendOccupied]} />
          <Text style={styles.legendText}>Ocupada</Text>
        </View>
      </View>

      {/* Mapa con zoom y desplazamiento */}
      <View style={styles.viewport} onLayout={handleViewportLayout}>
        <GestureDetector gesture={mapGesture}>
          <Animated.View
            style={[
              styles.mapContent,
              { width: contentWidth, height: contentHeight },
              mapStyle,
            ]}
          >
            <Text style={styles.stageLabel}>ESCENARIO</Text>

            {rows.map(([row, rowSeats]) => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLabel}>{row}</Text>

                {rowSeats.map((seat) => {
                  const isSelected = selectedIdSet.has(seat.id);
                  const isOccupied = seat.status === 'occupied';
                  const isAisleSeat =
                    seat.number === Math.ceil(layout.seatsPerRow / 2) + 1;

                  return (
                    <Pressable
                      key={seat.id}
                      onPress={() => handleSeatPress(seat)}
                      disabled={isOccupied}
                      style={[
                        styles.seat,
                        isAisleSeat && styles.aisleSeat,
                        isOccupied && styles.seatOccupied,
                        isSelected && styles.seatSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{
                        disabled: isOccupied,
                        selected: isSelected,
                      }}
                      accessibilityLabel={`Fila ${seat.row}, butaca ${
                        seat.number
                      }${
                        isOccupied
                          ? ', ocupada'
                          : isSelected
                            ? ', seleccionada'
                            : ', disponible'
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
                })}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>

        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
          onPress={handleResetView}
          accessibilityRole="button"
          accessibilityLabel="Centrar y restablecer el zoom"
        >
          <Ionicons name="scan-outline" size={16} color={COLORS.accent} />
          <Text style={styles.resetText}>Centrar</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        Pellizca para zoom · arrastra con dos dedos · toca una butaca
      </Text>

      {/* Resumen y confirmación */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: SPACING.md + insets.bottom },
        ]}
      >
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>
            {selectedIds.length}{' '}
            {selectedIds.length === 1 ? 'butaca' : 'butacas'}
          </Text>
          <Text style={styles.summaryTotal}>
            ${total.toLocaleString('es-CO')}{' '}
            <Text style={styles.summaryCurrency}>COP</Text>
          </Text>
        </View>

        <AnimatedButton
          label="Confirmar"
          onPress={handleConfirm}
          disabled={selectedIds.length === 0}
          accessibilityLabel="Confirmar la reserva de butacas"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.xxs,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  availability: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  legendAvailable: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
  },
  legendSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accentHover,
  },
  legendOccupied: {
    backgroundColor: COLORS.borderLight,
    borderColor: COLORS.border,
  },
  legendText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  viewport: {
    flex: 1,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  stageLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  rowLabel: {
    width: ROW_LABEL_WIDTH,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textMuted,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SEAT_GAP,
  },
  aisleSeat: {
    marginLeft: SPACING.md,
  },
  seatOccupied: {
    backgroundColor: COLORS.borderLight,
    borderColor: COLORS.border,
    opacity: 0.45,
  },
  seatSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accentHover,
  },
  seatNumber: {
    fontSize: 8,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  seatNumberOccupied: {
    color: COLORS.textMuted,
  },
  seatNumberSelected: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resetButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.overlay,
  },
  resetButtonPressed: {
    opacity: 0.7,
  },
  resetText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  hint: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  summary: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  summaryTotal: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  summaryCurrency: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
});
