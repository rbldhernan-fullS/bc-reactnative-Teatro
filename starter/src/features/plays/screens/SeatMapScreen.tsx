// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import type { Seat } from '../../../types';
import type { SeatMapScreenProps } from '../../../navigation/types';
import { SeatMapViewport } from '../components/seatmap/SeatMapViewport';
import { Stage } from '../components/seatmap/Stage';
import { Seat as SeatButton } from '../components/seatmap/Seat';
import { SeatLegend } from '../components/seatmap/SeatLegend';
import { BookingSummary } from '../components/seatmap/BookingSummary';
import { SeatMapStates } from '../components/seatmap/SeatMapStates';
import { MAX_SEATS_PER_BOOKING, getSeatMapMetrics } from '../components/seatmap/layout';
import { styles } from '../components/seatmap/seatmapStyles';
import { notify } from '../../../platform/notify';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { usePlayById } from '../hooks/usePlays';
import { getApiErrorMessage } from '../../../services/http';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { HALL_LAYOUT, buildSeatMap, getHallCapacity } from '../../../utils/theatre';
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 10 · INICIO =====
/**
 * Mapa de butacas.
 *
 * La pantalla conserva la selección (con su límite y el antirrebote tras
 * arrastrar) y compone el mapa con los componentes de `components/seatmap`:
 * escenario, leyenda, butaca, resumen de reserva y estados previos.
 */
export function SeatMapScreen(): React.JSX.Element {
  const route = useRoute<SeatMapScreenProps['route']>();
  const insets = useSafeAreaInsets();

  const { id } = route.params;
  const { data: item, isLoading, isError, error, refetch } = usePlayById(id);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const dragEndedAt = useRef(0);

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

  const { contentWidth, contentHeight } = getSeatMapMetrics(layout);

  const handleMapDragEnd = useCallback((): void => {
    dragEndedAt.current = Date.now();
  }, []);

  const handleSeatPress = useCallback(
    (seat: Seat): void => {
      if (seat.status === 'occupied') {
        return;
      }

      // Tras arrastrar el mapa, el puntero puede terminar sobre una butaca y
      // disparar su pulsación: se descarta el clic inmediatamente posterior.
      if (Date.now() - dragEndedAt.current < 300) {
        return;
      }

      const alreadySelected = selectedIdSet.has(seat.id);

      if (!alreadySelected && selectedIds.length >= MAX_SEATS_PER_BOOKING) {
        notify(
          'Límite de butacas',
          `Puedes seleccionar hasta ${MAX_SEATS_PER_BOOKING} butacas por reserva.`,
        );
        return;
      }

      setSelectedIds((current) =>
        current.includes(seat.id)
          ? current.filter((selectedId) => selectedId !== seat.id)
          : [...current, seat.id],
      );
    },
    [selectedIdSet, selectedIds.length],
  );

  const handleConfirm = useCallback((): void => {
    if (!item || selectedIds.length === 0) {
      return;
    }

    const total = selectedIds.length * item.price;
    const seatLabel = selectedIds.length === 1 ? 'butaca' : 'butacas';

    notify(
      'Reserva confirmada',
      `${selectedIds.length} ${seatLabel} para "${item.name}"\n${item.hall} · ${item.date} · ${item.time}\nTotal: $${total.toLocaleString('es-CO')} COP`,
    );
    setSelectedIds([]);
  }, [item, selectedIds]);
  // ===== SEMANA 10 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  if (isLoading) {
    return <SeatMapStates status="loading" onRetry={() => void refetch()} />;
  }

  if (isError) {
    return (
      <SeatMapStates
        status="error"
        message={getApiErrorMessage(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!item) {
    return <SeatMapStates status="missing" onRetry={() => void refetch()} />;
  }
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const total = selectedIds.length * item.price;
  const capacity = getHallCapacity(item.hall);
  const aisleNumber = Math.ceil(layout.seatsPerRow / 2) + 1;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {item.hall} · {item.date} · {item.time}
        </Text>
        <Text style={styles.availability}>
          {item.availableSeats} de {capacity} butacas disponibles
        </Text>
      </View>

      <SeatLegend />

      <SeatMapViewport
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        onDragEnd={handleMapDragEnd}
      >
        <Stage />

        {rows.map(([row, rowSeats]) => (
          <View key={row} style={styles.seatRow}>
            <Text style={styles.rowLabel}>{row}</Text>

            {rowSeats.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seat}
                isSelected={selectedIdSet.has(seat.id)}
                isAisle={seat.number === aisleNumber}
                onPress={handleSeatPress}
              />
            ))}
          </View>
        ))}
      </SeatMapViewport>

      <BookingSummary
        selectedCount={selectedIds.length}
        total={total}
        bottomInset={insets.bottom}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
// ===== SEMANA 10 · FIN =====
