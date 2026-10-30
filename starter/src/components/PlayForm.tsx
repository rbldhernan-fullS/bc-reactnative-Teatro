// ============================================
// COMPONENT: PlayForm — Semana 06
// Formulario compartido por Create y Edit (RHF + Zod)
// ============================================

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Control, FieldErrors } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

import { FormChips } from './FormChips';
import { FormField } from './FormField';
import type { PlayFormInput } from '../schemas/playSchema';
import { THEATRE_GENRES, THEATRE_HALLS } from '../types';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

interface PlayFormProps {
  control: Control<PlayFormInput>;
  errors: FieldErrors<PlayFormInput>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  intro: string;
  serverError?: string;
}

export function PlayForm({
  control,
  errors,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
  intro,
  serverError,
}: PlayFormProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.introCard}>
        <Ionicons name="sparkles-outline" size={SIZES.iconMd} color={COLORS.accent} />
        <Text style={styles.introText}>{intro}</Text>
      </View>

      <FormField
        control={control}
        name="name"
        label="Título de la obra"
        required
        placeholder="Ej. Sueño de una noche de verano"
        returnKeyType="next"
        errorMessage={errors.name?.message}
      />

      <FormField
        control={control}
        name="subtitle"
        label="Director o compañía"
        required
        placeholder="Ej. Dir. Ana Torres · Compañía del Alba"
        returnKeyType="next"
        errorMessage={errors.subtitle?.message}
      />

      <FormChips
        control={control}
        name="genre"
        label="Género teatral"
        required
        options={THEATRE_GENRES}
        errorMessage={errors.genre?.message}
      />

      <FormChips
        control={control}
        name="hall"
        label="Sala"
        required
        options={THEATRE_HALLS}
        errorMessage={errors.hall?.message}
      />

      <FormField
        control={control}
        name="date"
        label="Fecha de la función"
        required
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
        autoCorrect={false}
        errorMessage={errors.date?.message}
      />

      <FormField
        control={control}
        name="time"
        label="Hora de inicio"
        required
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
        autoCorrect={false}
        errorMessage={errors.time?.message}
      />

      <FormField
        control={control}
        name="price"
        label="Precio de la entrada (COP)"
        required
        placeholder="Ej. 45000"
        keyboardType="numeric"
        errorMessage={errors.price?.message}
      />

      <FormField
        control={control}
        name="duration"
        label="Duración"
        required
        placeholder="Ej. 120 min"
        errorMessage={errors.duration?.message}
      />

      <FormField
        control={control}
        name="availableSeats"
        label="Butacas disponibles"
        required
        placeholder="Ej. 40"
        keyboardType="numeric"
        errorMessage={errors.availableSeats?.message}
      />

      <FormField
        control={control}
        name="rating"
        label="Calificación (0 a 5)"
        required
        placeholder="Ej. 4.5"
        keyboardType="numeric"
        errorMessage={errors.rating?.message}
      />

      <FormField
        control={control}
        name="imageUri"
        label="URL del afiche"
        required
        placeholder="https://..."
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        errorMessage={errors.imageUri?.message}
      />

      <FormField
        control={control}
        name="synopsis"
        label="Sinopsis"
        required
        placeholder="Resumen del argumento de la obra..."
        multiline
        numberOfLines={5}
        errorMessage={errors.synopsis?.message}
      />

      {serverError ? (
        <Text style={styles.serverError}>{serverError}</Text>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isSubmitting) && styles.submitButtonPressed,
        ]}
        onPress={onSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.background} />
        ) : (
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancelar y volver"
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.base,
  },
  introCard: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  introText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  serverError: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.error,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
  },
  submitButton: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
});
