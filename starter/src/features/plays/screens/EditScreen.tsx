// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PlayForm } from '../components/forms/PlayForm';
import { ScreenState } from '../../../components/ui/ScreenState';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { useNotifications } from '../../../hooks/useNotifications';
import { notify, notifyError } from '../../../platform/notify';
import { formatScheduleDate } from '../../../services/notifications';
import { logger } from '../../../utils/logger';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { usePlayById, useUpdatePlay } from '../hooks/usePlays';
import {
  EMPTY_PLAY_FORM,
  playSchema,
  toPlayFormInput,
  toUpdatePlayPayload,
  type PlayFormInput,
  type PlayFormValues,
} from '../schemas/playSchema';
import { getApiErrorMessage } from '../../../services/http';
import { COLORS, SPACING } from '../../../theme';
import type { EditScreenProps, HomeStackParamList } from '../../../navigation/types';

type EditNavProp = NativeStackNavigationProp<HomeStackParamList, 'Edit'>;

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditNavProp>();
  const route = useRoute<EditScreenProps['route']>();
  const { id } = route.params;

  const { data: play, isLoading, isError, error, refetch } = usePlayById(id);
  const { mutateAsync: updatePlay, isPending, error: mutationError } = useUpdatePlay();
  // ===== SEMANA 12 · INICIO =====
  const { reminders, scheduleCartelera, scheduleReminder, cancelReminder } = useNotifications();
  // ===== SEMANA 12 · FIN =====

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlayFormInput, unknown, PlayFormValues>({
    resolver: zodResolver(playSchema),
    defaultValues: EMPTY_PLAY_FORM,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (play) {
      reset(toPlayFormInput(play));
    }
  }, [play, reset]);

  async function onSubmit(values: PlayFormValues): Promise<void> {
    if (!play) {
      return;
    }

    try {
      // ===== SEMANA 12 · INICIO =====
      const scheduleChanged = play.date !== values.date || play.time !== values.time;
      const shouldReschedule = scheduleChanged && reminders[id]?.kind === 'show';

      const updated = await updatePlay(toUpdatePlayPayload(id, values));

      await scheduleCartelera(updated, 'updated');

      if (shouldReschedule) {
        const cancelled = await cancelReminder(id);

        if (!cancelled) {
          notifyError(
            'No se pudo reprogramar el recordatorio',
            'El aviso anterior sigue activo en el sistema. Inténtalo de nuevo desde el detalle de la obra.',
          );
        } else {
          const outcome = await scheduleReminder(updated, 'show');

          if (outcome.ok) {
            notify(
              'Recordatorio reprogramado',
              `Te avisaremos el ${formatScheduleDate(outcome.scheduledAt)}, 2 horas antes de "${updated.name}".`,
            );
          } else {
            notifyError('No se pudo reprogramar el recordatorio', outcome.reason);
          }
        }
      }
      // ===== SEMANA 12 · FIN =====

      navigation.goBack();
    } catch (error) {
      // El formulario ya muestra el error de la mutación; aquí solo se registra.
      logger.warn('No se pudo actualizar la obra', error);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ScreenState
          loading
          title="Cargando la obra"
          message="Recuperando los datos para editar la ficha."
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
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

  if (!play) {
    return (
      <View style={styles.screen}>
        <ScreenState
          icon="alert-circle-outline"
          title="Obra no encontrada"
          message="La obra que intentas editar ya no está en cartelera."
          actionLabel="Volver"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const submitting = isSubmitting || isPending;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PlayForm
          control={control}
          errors={errors}
          isSubmitting={submitting}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => navigation.goBack()}
          intro={`Actualiza la ficha de "${play.name}". Los cambios se validan con Zod y se guardan en la API.`}
          posterTargetId={id}
          posterFallbackUri={play.imageUri}
          serverError={mutationError ? getApiErrorMessage(mutationError) : undefined}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },
});
// ===== SEMANA 06 · FIN =====
