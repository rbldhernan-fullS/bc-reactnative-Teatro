// ============================================
// COMPONENT: FormField — Semana 06
// Controller + TextInput + label + mensaje de error reutilizable
// ============================================

import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface FormFieldProps<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  errorMessage,
  containerStyle,
  inputStyle,
  multiline = false,
  style,
  ...textInputProps
}: FormFieldProps<T>): React.JSX.Element {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          const message = errorMessage ?? error?.message;

          const stringValue =
            value === null || value === undefined
              ? ''
              : typeof value === 'string'
                ? value
                : String(value);

          return (
            <>
              <TextInput
                style={[
                  styles.input,
                  multiline && styles.inputMultiline,
                  !!message && styles.inputError,
                  inputStyle,
                  style,
                ]}
                value={stringValue}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor={COLORS.textMuted}
                multiline={multiline}
                accessibilityLabel={label}
                {...textInputProps}
              />

              {/* Altura reservada para que el layout no salte al aparecer el error */}
              <Text style={styles.error}>{message ?? ' '}</Text>
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    minHeight: 16,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
  },
});
