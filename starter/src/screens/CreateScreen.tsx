// ============================================
// SCREEN: CreateScreen — Semana 06
// Formulario validado con React Hook Form + Zod
// ============================================

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PlayForm } from '../components/PlayForm';
import { useCreatePlay } from '../hooks/usePlays';
import {
  EMPTY_PLAY_FORM,
  playSchema,
  toCreatePlayPayload,
  type PlayFormInput,
  type PlayFormValues,
} from '../schemas/playSchema';
import { getApiErrorMessage } from '../services/api';
import { COLORS, SPACING } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  const { mutateAsync: createPlay, isPending, error: mutationError } = useCreatePlay();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlayFormInput, unknown, PlayFormValues>({
    resolver: zodResolver(playSchema),
    defaultValues: EMPTY_PLAY_FORM,
    mode: 'onBlur',
  });

  async function onSubmit(values: PlayFormValues): Promise<void> {
    try {
      await createPlay(toCreatePlayPayload(values));
      navigation.goBack();
    } catch {
      // El mensaje se muestra desde mutationError con getApiErrorMessage.
    }
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
          submitLabel="Publicar obra"
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => navigation.goBack()}
          intro="Publica una nueva obra en la cartelera. Todos los campos se validan con Zod antes de enviarse a la API."
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
