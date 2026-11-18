// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import type { DetailScreenProps } from '../../../navigation/types';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 12 · INICIO =====
import type { Item } from '../../../types';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { getApiErrorMessage, isNotFoundError } from '../../../services/http';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
// `usePlayById` (Semana 05) y `useDeletePlay` (Semana 12) viven en el mismo
// módulo: se importan juntos porque el linter no admite declaraciones repetidas.
import { useDeletePlay, usePlayById } from '../hooks/usePlays';
import { confirm, notify, notifyError } from '../../../platform/notify';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { SIZES } from '../../../theme';
import { selectIsSaved, useSavedStore } from '../../../stores/savedStore';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 11 · INICIO =====
import { selectPoster, usePosterStore } from '../../../stores/posterStore';
// ===== SEMANA 11 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { getHallCapacity, getHallOccupancy } from '../../../utils/theatre';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { DetailActionsBar } from '../components/detail/DetailActionsBar';
import { DetailAvailability } from '../components/detail/DetailAvailability';
import { DetailHero } from '../components/detail/DetailHero';
import { DetailMetaGrid } from '../components/detail/DetailMetaGrid';
import { DetailPosterSection } from '../components/detail/DetailPosterSection';
import { DetailReminderSection } from '../components/detail/DetailReminderSection';
import { DetailInfoSections, DetailStates } from '../components/detail/DetailStates';
import { useDetailReminder } from '../hooks/useDetailReminder';
import { styles } from '../components/detail/styles';
// ===== SEMANA 12 · FIN =====

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
  const toggleSaved = useSavedStore((state) => state.toggle);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 11 · INICIO =====
  const localPoster = usePosterStore(selectPoster(id));
  // ===== SEMANA 11 · FIN =====

  // ===== SEMANA 12 · INICIO =====
  const { reminder, remindersEnabled, isScheduling, schedule, scheduleDemo, cancel } =
    useDetailReminder(item);
  const deletePlayMutation = useDeletePlay();
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
      <DetailStates status="loading" onRetry={() => void refetch()} onBack={navigation.goBack} />
    );
  }

  if (isError) {
    return (
      <DetailStates
        status={isNotFoundError(error) ? 'notFound' : 'error'}
        message={getApiErrorMessage(error)}
        onRetry={() => void refetch()}
        onBack={navigation.goBack}
      />
    );
  }

  if (!item) {
    return (
      <DetailStates status="missing" onRetry={() => void refetch()} onBack={navigation.goBack} />
    );
  }
  // ===== SEMANA 05 · FIN =====

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
  async function handleDeletePlay(): Promise<void> {
    if (reminder) {
      await cancel();
    }

    try {
      await deletePlayMutation.mutateAsync(id);
      notify('Obra eliminada', `"${name}" salió de la cartelera.`);
      navigation.goBack();
    } catch (error) {
      notifyError('No se pudo eliminar la obra', getApiErrorMessage(error));
    }
  }

  async function confirmDeletePlay(): Promise<void> {
    const accepted = await confirm({
      title: 'Eliminar obra',
      message: `¿Seguro que quieres eliminar "${name}"? También se cancelará el recordatorio programado.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      destructive: true,
    });

    if (accepted) {
      await handleDeletePlay();
    }
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
        <DetailHero
          name={name}
          genre={genre}
          rating={rating}
          posterUri={posterUri}
          isSaved={isSaved}
          hasLocalPoster={localPoster !== null}
          onToggleSave={() => toggleSaved(id)}
        />

        <View style={styles.body}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <DetailMetaGrid hall={hall} duration={duration} date={date} time={time} />

          <DetailAvailability
            availableSeats={availableSeats}
            occupancy={occupancy}
            occupiedSeats={occupiedSeats}
            hallCapacity={hallCapacity}
            hall={hall}
          />

          <DetailPosterSection id={id} imageUri={imageUri} hall={hall} />

          <DetailReminderSection
            play={play}
            reminder={reminder}
            remindersEnabled={remindersEnabled}
            isScheduling={isScheduling}
            onSchedule={schedule}
            onDemo={scheduleDemo}
            onCancel={cancel}
          />

          <DetailInfoSections
            id={id}
            name={name}
            genre={genre}
            synopsis={synopsis}
            isDeleting={deletePlayMutation.isPending}
            onDelete={confirmDeletePlay}
          />
        </View>
      </Animated.ScrollView>

      <DetailActionsBar
        price={price}
        name={name}
        bottomInset={insets.bottom}
        onBook={handleBookingPress}
      />
    </View>
  );
}
// ===== SEMANA 03 · FIN =====
