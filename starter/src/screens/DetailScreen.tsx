// ===== SEMANA 01 · INICIO =====
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { DetailScreenProps } from '../navigation/types';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 12 · INICIO =====
import type { Item } from '../types';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { AnimatedButton } from '../components/AnimatedButton';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 11 · INICIO =====
import { PhotoPicker } from '../components/PhotoPicker';
// ===== SEMANA 11 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { ProgressBar } from '../components/ProgressBar';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { ScreenState } from '../components/ScreenState';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 11 · INICIO =====
import { VenueCard } from '../components/VenueCard';
// ===== SEMANA 11 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { usePlayById } from '../hooks/usePlays';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { useNotifications } from '../hooks/useNotifications';
import { usePreferences } from '../hooks/usePreferences';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { getApiErrorMessage } from '../services/api';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { formatScheduleDate } from '../services/notifications';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
import { selectIsSaved, useSavedStore } from '../stores/savedStore';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 11 · INICIO =====
import { selectPoster, usePosterStore } from '../stores/posterStore';
// ===== SEMANA 11 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { getHallCapacity, getHallOccupancy } from '../utils/theatre';
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 03 · INICIO =====
export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailScreenProps['route']>();
  const navigation = useNavigation<DetailScreenProps['navigation']>();
  // ===== SEMANA 04 · INICIO =====
  const insets = useSafeAreaInsets();

  const { id } = route.params;
  // ===== SEMANA 04 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const { data: item, isLoading, isError, error, refetch } = usePlayById(id);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const entrance = useSharedValue(0);
  // ===== SEMANA 10 · FIN =====
  // ===== SEMANA 09 · INICIO =====
  const itemId = item?.id;

  useEffect(() => {
    if (!itemId) {
      return;
    }

    // ===== SEMANA 10 · INICIO =====
    entrance.value = 0;
    entrance.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    // ===== SEMANA 10 · FIN =====
  }, [entrance, itemId]);
  // ===== SEMANA 09 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const contentStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [
      {
        translateY: interpolate(entrance.value, [0, 1], [30, 0]),
      },
    ],
  }));
  // ===== SEMANA 10 · FIN =====

  // ===== SEMANA 04 · INICIO =====
  const isSaved = useSavedStore(selectIsSaved(id));
  // ===== SEMANA 04 · FIN =====
  // ===== SEMANA 05 · INICIO =====
  const toggleSaved = useSavedStore((state) => state.toggleSaved);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 11 · INICIO =====
  const localPoster = usePosterStore(selectPoster(id));
  // ===== SEMANA 11 · FIN =====

  // ===== SEMANA 12 · INICIO =====
  const { reminders, scheduleReminder, cancelReminder } = useNotifications();
  const { remindersEnabled } = usePreferences();
  const [isScheduling, setIsScheduling] = useState(false);
  const reminder = reminders[id];
  // ===== SEMANA 12 · FIN =====

  // ===== SEMANA 06 · INICIO =====
  useEffect(() => {
    if (item) {
      navigation.setOptions({ title: item.name });
    }
  }, [item, navigation]);
  // ===== SEMANA 06 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  if (isLoading) {
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

  if (isError) {
    return (
      <View style={styles.screenWrapper}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la obra"
          message={getApiErrorMessage(error)}
          actionLabel="Reintentar"
          onAction={() => {
            void refetch();
          }}
        />
      </View>
    );
  }
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 04 · INICIO =====
  if (!item) {
    return (
      <View style={[styles.screenWrapper, styles.notFoundContainer]}>
        <Text style={styles.notFoundTitle}>Obra no encontrada</Text>
        <Text style={styles.notFoundSubtitle}>
          La obra que buscas ya no está en cartelera.
        </Text>
        <Pressable
          style={styles.bookButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver a la cartelera"
        >
          <Text style={styles.bookButtonText}>Volver a la cartelera</Text>
        </Pressable>
      </View>
    );
  }
  // ===== SEMANA 04 · FIN =====

  const {
    name,
    subtitle,
    imageUri,
    genre,
    date,
    time,
    price,
    hall,
    duration,
    availableSeats,
    rating,
    synopsis,
  } = item;

  // ===== SEMANA 12 · INICIO =====
  const play: Item = item;
  // ===== SEMANA 12 · FIN =====

  // ===== SEMANA 09 · INICIO =====
  const hallCapacity = getHallCapacity(hall);
  const occupiedSeats = Math.max(0, hallCapacity - availableSeats);
  const occupancy = getHallOccupancy(hall, availableSeats);
  // ===== SEMANA 09 · FIN =====
  // ===== SEMANA 11 · INICIO =====
  const posterUri = localPoster ?? imageUri;
  // ===== SEMANA 11 · FIN =====

  // ===== SEMANA 12 · INICIO =====
  async function handleScheduleReminder(): Promise<void> {
    setIsScheduling(true);

    try {
      const outcome = await scheduleReminder(play, 'show');

      if (outcome.ok) {
        Alert.alert(
          'Recordatorio programado',
          `Te avisaremos el ${formatScheduleDate(
            outcome.scheduledAt
          )}, 2 horas antes de "${name}".`
        );
        return;
      }

      Alert.alert('No se pudo programar', outcome.reason);
    } finally {
      setIsScheduling(false);
    }
  }

  async function handleDemoReminder(): Promise<void> {
    setIsScheduling(true);

    try {
      const outcome = await scheduleReminder(play, 'demo');

      if (outcome.ok) {
        Alert.alert(
          'Prueba programada',
          `El aviso de "${name}" llegará en 10 segundos. Mantén la app abierta para verlo en primer plano.`
        );
        return;
      }

      Alert.alert('No se pudo programar la prueba', outcome.reason);
    } finally {
      setIsScheduling(false);
    }
  }

  async function handleCancelReminder(): Promise<void> {
    const cancelled = await cancelReminder(id);

    Alert.alert(
      cancelled ? 'Recordatorio cancelado' : 'Recordatorio retirado',
      cancelled
        ? `Ya no recibirás el aviso de "${name}".`
        : 'El aviso ya no estaba programado en el sistema; el registro local quedó limpio.'
    );
  }
  // ===== SEMANA 12 · FIN =====

  function handleBookingPress(): void {
    navigation.navigate('SeatMap', { id, name });
  }

  return (
    <View style={styles.screenWrapper}>
      <Animated.ScrollView
        style={[styles.container, contentStyle]}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: SIZES.detailContentBottomPadding + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: posterUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.badgesRow}>
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{genre}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>★ {rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* ===== SEMANA 11 · INICIO ===== */}
          {localPoster ? (
            <View style={styles.localPosterBadge}>
              <Ionicons name="camera" size={12} color={COLORS.background} />
              <Text style={styles.localPosterBadgeText}>Afiche local</Text>
            </View>
          ) : null}
          {/* ===== SEMANA 11 · FIN ===== */}

          {/* ===== SEMANA 04 · INICIO ===== */}
          <Pressable
            style={({ pressed }) => [
              styles.savePill,
              isSaved && styles.savePillActive,
              pressed && styles.savePillPressed,
            ]}
            onPress={() => toggleSaved(id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSaved }}
            accessibilityLabel={
              isSaved
                ? `Quitar ${name} de guardados`
                : `Guardar ${name} en guardados`
            }
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={SIZES.iconSm}
              color={isSaved ? COLORS.accent : COLORS.textPrimary}
            />
            <Text
              style={[
                styles.savePillText,
                isSaved && styles.savePillTextActive,
              ]}
            >
              {isSaved ? 'Guardada' : 'Guardar'}
            </Text>
          </Pressable>
          {/* ===== SEMANA 04 · FIN ===== */}
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>🏛</Text>
              <Text style={styles.metaLabel}>Sala</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {hall}
              </Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>⏳</Text>
              <Text style={styles.metaLabel}>Duración</Text>
              <Text style={styles.metaValue}>{duration}</Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaLabel}>Fecha</Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>🕒</Text>
              <Text style={styles.metaLabel}>Horario</Text>
              <Text style={styles.metaValue}>{time}</Text>
            </View>
          </View>

          <View style={styles.availabilityBanner}>
            <Text style={styles.availabilityIcon}>🎭</Text>
            <View style={styles.availabilityTextWrapper}>
              <Text style={styles.availabilityTitle}>
                Aforo y Disponibilidad
              </Text>
              <Text style={styles.availabilitySubtitle}>
                {availableSeats > 10
                  ? `${availableSeats} butacas disponibles en esta función`
                  : `¡Últimas ${availableSeats} butacas disponibles!`}
              </Text>
            </View>
          </View>

          {/* ===== SEMANA 09 · INICIO ===== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado del aforo</Text>
            <ProgressBar
              progress={occupancy}
              label="Butacas ocupadas"
              caption={`${occupiedSeats} de ${hallCapacity} butacas ocupadas en la ${hall}`}
            />
          </View>
          {/* ===== SEMANA 09 · FIN ===== */}

          {/* ===== SEMANA 11 · INICIO ===== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Afiche de la obra</Text>
            <PhotoPicker
              targetId={id}
              fallbackUri={imageUri}
              showPreview={false}
            />
          </View>

          <VenueCard hall={hall} />
          {/* ===== SEMANA 11 · FIN ===== */}

          {/* ===== SEMANA 12 · INICIO ===== */}
          <View style={styles.section}>
            <View style={styles.reminderHeader}>
              <Text style={styles.sectionTitle}>Recordatorio de función</Text>

              {reminder ? (
                <View style={styles.reminderBadge}>
                  <Ionicons
                    name="notifications"
                    size={12}
                    color={COLORS.background}
                  />
                  <Text style={styles.reminderBadgeText}>Activo</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.reminderDescription}>
              {reminder
                ? `Aviso programado para el ${formatScheduleDate(
                    reminder.scheduledAt
                  )}${
                    reminder.kind === 'demo'
                      ? ' (prueba de 10 s).'
                      : ', 2 horas antes de la función.'
                  }`
                : `Programa un aviso 2 horas antes de la función del ${date} a las ${time}.`}
            </Text>

            {!remindersEnabled ? (
              <Text style={styles.reminderDisabled}>
                Los recordatorios están desactivados en Ajustes.
              </Text>
            ) : null}

            <View style={styles.reminderActions}>
              {reminder ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.reminderAction,
                    pressed && styles.reminderActionPressed,
                  ]}
                  onPress={() => {
                    void handleCancelReminder();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Cancelar el recordatorio de ${name}`}
                >
                  <Ionicons
                    name="notifications-off-outline"
                    size={SIZES.iconSm}
                    color={COLORS.accent}
                  />
                  <Text style={styles.reminderActionText}>
                    Cancelar recordatorio
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.reminderAction,
                    pressed && styles.reminderActionPressed,
                    (!remindersEnabled || isScheduling) &&
                      styles.reminderActionDisabled,
                  ]}
                  onPress={() => {
                    void handleScheduleReminder();
                  }}
                  disabled={!remindersEnabled || isScheduling}
                  accessibilityRole="button"
                  accessibilityLabel={`Programar recordatorio 2 horas antes de ${name}`}
                  accessibilityState={{
                    disabled: !remindersEnabled || isScheduling,
                  }}
                >
                  {isScheduling ? (
                    <ActivityIndicator size="small" color={COLORS.accent} />
                  ) : (
                    <Ionicons
                      name="notifications-outline"
                      size={SIZES.iconSm}
                      color={COLORS.accent}
                    />
                  )}
                  <Text style={styles.reminderActionText}>
                    Recordar 2 h antes
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.reminderAction,
                  pressed && styles.reminderActionPressed,
                  (!remindersEnabled || isScheduling) &&
                    styles.reminderActionDisabled,
                ]}
                onPress={() => {
                  void handleDemoReminder();
                }}
                disabled={!remindersEnabled || isScheduling}
                accessibilityRole="button"
                accessibilityLabel={`Probar un recordatorio de ${name} en 10 segundos`}
                accessibilityState={{
                  disabled: !remindersEnabled || isScheduling,
                }}
              >
                <Ionicons
                  name="timer-outline"
                  size={SIZES.iconSm}
                  color={COLORS.accent}
                />
                <Text style={styles.reminderActionText}>Probar en 10 s</Text>
              </Pressable>
            </View>
          </View>
          {/* ===== SEMANA 12 · FIN ===== */}

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
          </View>
        </View>
      </Animated.ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: SPACING.md + insets.bottom },
        ]}
      >
        <View style={styles.priceColumn}>
          <Text style={styles.priceCaption}>Entrada General</Text>
          <Text style={styles.priceNumber}>
            ${price.toLocaleString('es-CO')}{' '}
            <Text style={styles.priceCurrency}>COP</Text>
          </Text>
        </View>

        <AnimatedButton
          label="Reservar Butacas"
          onPress={handleBookingPress}
          icon="ticket-outline"
          accessibilityLabel={`Reservar butacas para ${name}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  notFoundTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SIZES.detailContentBottomPadding,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SIZES.detailImageHeight,
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 9, 12, 0.4)',
  },
  badgesRow: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.base,
    right: SPACING.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savePill: {
    position: 'absolute',
    right: SPACING.base,
    bottom: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savePillActive: {
    borderColor: COLORS.accent,
  },
  savePillPressed: {
    opacity: 0.7,
  },
  savePillText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  savePillTextActive: {
    color: COLORS.accent,
  },
  localPosterBadge: {
    position: 'absolute',
    left: SPACING.base,
    bottom: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  localPosterBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  genreBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  ratingBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  ratingBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  body: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textSecondary,
    marginTop: -SPACING.xs,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  metaCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: SIZES.iconMd,
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxs,
  },
  metaValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    gap: SPACING.md,
  },
  availabilityIcon: {
    fontSize: SIZES.iconLg,
  },
  availabilityTextWrapper: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  availabilitySubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  reminderBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  reminderDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  reminderDisabled: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.warning,
  },
  reminderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  reminderAction: {
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
  reminderActionPressed: {
    opacity: 0.75,
  },
  reminderActionDisabled: {
    opacity: 0.5,
  },
  reminderActionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  synopsisText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  specLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceColumn: {
    flexDirection: 'column',
  },
  priceCaption: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  priceNumber: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  priceCurrency: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  bookButtonText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});
// ===== SEMANA 03 · FIN =====
