// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

export interface SegmentOption<T extends string | number> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  description: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
}

/** Grupo de opciones excluyentes presentado como píldoras. */
export function SegmentedControl<T extends string | number>({
  label,
  description,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>): React.JSX.Element {
  return (
    <View style={styles.preferenceBlock}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowDesc}>{description}</Text>

      <View style={styles.segmented}>
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <Pressable
              key={String(option.value)}
              style={({ pressed }) => [
                styles.segment,
                isActive && styles.segmentActive,
                pressed && styles.segmentPressed,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${label}: ${option.label}`}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
// ===== SEMANA 07 · FIN =====
