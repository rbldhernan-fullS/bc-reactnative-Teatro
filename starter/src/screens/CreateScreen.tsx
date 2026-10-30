// ============================================
// SCREEN: CreateScreen — Semana 05
// Formulario básico para publicar una obra con useMutation
// ============================================

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useCreatePlay } from '../hooks/usePlays';
import { getApiErrorMessage } from '../services/api';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import type { CreatePlayPayload, TheatreGenre, TheatreHall } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;

const GENRES: readonly TheatreGenre[] = [
  'Drama',
  'Tragedia',
  'Musical',
  'Comedia',
  'Ópera',
  'Monólogo',
  'Clásico',
  'Infantil',
];

const HALLS: readonly TheatreHall[] = [
  'Sala Principal',
  'Sala de Cámara',
  'Teatro Experimental',
];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop&q=80';

interface FormState {
  name: string;
  subtitle: string;
  genre: TheatreGenre;
  hall: TheatreHall;
  price: string;
  synopsis: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  name: '',
  subtitle: '',
  genre: 'Drama',
  hall: 'Sala Principal',
  price: '',
  synopsis: '',
};

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  const { mutate: createPlay, isPending, error: mutationError } = useCreatePlay();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ): void {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = 'El título debe tener al menos 2 caracteres.';
    }

    if (form.subtitle.trim().length < 3) {
      nextErrors.subtitle = 'Indica el director o la compañía teatral.';
    }

    const priceValue = Number(form.price);
    if (form.price.trim().length === 0 || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = 'El precio debe ser un número mayor que cero.';
    }

    if (form.synopsis.trim().length < 20) {
      nextErrors.synopsis = 'La sinopsis debe tener al menos 20 caracteres.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(): void {
    if (!validate()) {
      return;
    }

    const payload: CreatePlayPayload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      imageUri: DEFAULT_IMAGE,
      genre: form.genre,
      date: '2027-03-06',
      time: '20:00',
      price: Number(form.price),
      hall: form.hall,
      duration: '120 min',
      availableSeats: 40,
      rating: 4.5,
      synopsis: form.synopsis.trim(),
    };

    createPlay(payload, {
      onSuccess: () => navigation.goBack(),
    });
  }

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
        <View style={styles.introCard}>
          <Ionicons name="sparkles-outline" size={SIZES.iconMd} color={COLORS.accent} />
          <Text style={styles.introText}>
            Publica una nueva obra en la cartelera. Los campos marcados con * son
            obligatorios; la fecha, la duración y el aforo se asignan con los
            valores de la temporada actual.
          </Text>
        </View>

        <Field
          label="Título de la obra *"
          value={form.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Ej. Sueño de una noche de verano"
          error={errors.name}
        />

        <Field
          label="Director o compañía *"
          value={form.subtitle}
          onChangeText={(value) => updateField('subtitle', value)}
          placeholder="Ej. Dir. Ana Torres · Compañía del Alba"
          error={errors.subtitle}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Género teatral *</Text>
          <View style={styles.chipsRow}>
            {GENRES.map((genre) => {
              const selected = form.genre === genre;
              return (
                <Pressable
                  key={genre}
                  onPress={() => updateField('genre', genre)}
                  style={[
                    styles.chip,
                    selected && styles.chipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {genre}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Sala *</Text>
          <View style={styles.chipsRow}>
            {HALLS.map((hall) => {
              const selected = form.hall === hall;
              return (
                <Pressable
                  key={hall}
                  onPress={() => updateField('hall', hall)}
                  style={[
                    styles.chip,
                    selected && styles.chipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {hall}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Field
          label="Precio de la entrada (COP) *"
          value={form.price}
          onChangeText={(value) => updateField('price', value)}
          placeholder="Ej. 45000"
          keyboardType="numeric"
          error={errors.price}
        />

        <Field
          label="Sinopsis *"
          value={form.synopsis}
          onChangeText={(value) => updateField('synopsis', value)}
          placeholder="Resumen del argumento de la obra..."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          error={errors.synopsis}
        />

        {mutationError ? (
          <Text style={styles.serverError}>
            {getApiErrorMessage(mutationError)}
          </Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            (pressed || isPending) && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
          disabled={isPending}
          accessibilityRole="button"
          accessibilityLabel="Publicar obra en la cartelera"
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.submitButtonText}>Publicar obra</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  keyboardType?: 'default' | 'numeric';
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines,
  textAlignVertical,
  keyboardType = 'default',
}: FieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          !!error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        keyboardType={keyboardType}
        autoCapitalize="sentences"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
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
  fieldGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    minHeight: 110,
    paddingTop: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentDim,
  },
  chipText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  chipTextSelected: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.bold,
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
