// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { useForm } from 'react-hook-form';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { zodResolver } from '@hookform/resolvers/zod';
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 08 · INICIO =====
import { PlayForm } from '../components/PlayForm';
import { useCreatePlay } from '../hooks/usePlays';
// ===== SEMANA 08 · FIN =====
// ===== SEMANA 06 · INICIO =====
import {
  DEFAULT_PLAY_IMAGE,
  EMPTY_PLAY_FORM,
  playSchema,
  toCreatePlayPayload,
  type PlayFormInput,
  type PlayFormValues,
} from '../schemas/playSchema';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 11 · INICIO =====
import { POSTER_DRAFT_ID, usePosterStore } from '../stores/posterStore';
// ===== SEMANA 11 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { getApiErrorMessage } from '../services/api';
import { COLORS, SPACING } from '../theme';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 05 · INICIO =====
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();
  // ===== SEMANA 11 · INICIO =====
  const movePoster = usePosterStore((state) => state.movePoster);
  const clearDraft = usePosterStore((state) => state.clearDraft);
  // ===== SEMANA 11 · FIN =====

  // ===== SEMANA 06 · INICIO =====
  const { mutateAsync: createPlay, isPending, error: mutationError } = useCreatePlay();
  // ===== SEMANA 06 · FIN =====

  // ===== SEMANA 11 · INICIO =====
  useEffect(() => () => clearDraft(), [clearDraft]);
  // ===== SEMANA 11 · FIN =====

  // ===== SEMANA 06 · INICIO =====
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlayFormInput, unknown, PlayFormValues>({
    resolver: zodResolver(playSchema),
    defaultValues: EMPTY_PLAY_FORM,
    mode: 'onBlur',
  });
  // ===== SEMANA 06 · FIN =====

  async function onSubmit(values: PlayFormValues): Promise<void> {
    try {
      // ===== SEMANA 11 · INICIO =====
      const created = await createPlay(toCreatePlayPayload(values));
      movePoster(POSTER_DRAFT_ID, created.id);
      // ===== SEMANA 11 · FIN =====
      navigation.goBack();
    } catch {}
  }

  // ===== SEMANA 06 · INICIO =====
  const submitting = isSubmitting || isPending;
  // ===== SEMANA 06 · FIN =====

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
          submitLabel="Publicar obra"
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => navigation.goBack()}
          intro="Publica una nueva obra en la cartelera. Todos los campos se validan con Zod antes de enviarse a la API."
          posterTargetId={POSTER_DRAFT_ID}
          posterFallbackUri={DEFAULT_PLAY_IMAGE}
          serverError={
            mutationError ? getApiErrorMessage(mutationError) : undefined
          }
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
// ===== SEMANA 05 · FIN =====
