// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 06 · INICIO =====
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface FormChipsProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly string[];
  required?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormChips<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
  errorMessage,
  containerStyle,
}: FormChipsProps<T>): React.JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const message = errorMessage ?? error?.message;

        return (
          <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>
              {label}
              {required ? ' *' : ''}
            </Text>

            <View style={styles.optionsRow}>
              {options.map((option) => {
                const selected = value === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => onChange(option)}
                    style={({ pressed }) => [
                      styles.chip,
                      selected && styles.chipSelected,
                      pressed && styles.chipPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.error}>{message ?? ' '}</Text>
          </View>
        );
      }}
    />
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
  optionsRow: {
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
  chipPressed: {
    opacity: 0.75,
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
  error: {
    minHeight: 16,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
  },
});
// ===== SEMANA 06 · FIN =====
