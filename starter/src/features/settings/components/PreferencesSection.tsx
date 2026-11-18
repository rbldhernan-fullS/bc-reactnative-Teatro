// ===== SEMANA 07 · INICIO =====
import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { notify } from '../../../platform/notify';
import { ITEMS_PER_PAGE_OPTIONS, usePreferences } from '../../../hooks/usePreferences';
import type { ItemsPerPage, SortOrder } from '../../../hooks/usePreferences';
import { SegmentedControl, type SegmentOption } from './SegmentedControl';
import { SwitchRow } from './SwitchRow';
import { styles } from '../styles';

const SORT_OPTIONS: readonly SegmentOption<SortOrder>[] = [
  { label: 'A → Z', value: 'asc' },
  { label: 'Z → A', value: 'desc' },
];

const PAGE_OPTIONS: readonly SegmentOption<ItemsPerPage>[] = ITEMS_PER_PAGE_OPTIONS.map((size) => ({
  label: `${size} por página`,
  value: size,
}));

/**
 * Sección de preferencias de la cartelera.
 *
 * Se guardan en MMKV y se aplican al instante: por eso la sección consume
 * `usePreferences` directamente y no recibe props.
 */
export function PreferencesSection(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
    onlyAvailable,
    setOnlyAvailable,
    resetPreferences,
  } = usePreferences();

  const handleResetPreferences = useCallback((): void => {
    resetPreferences();
    notify(
      'Preferencias restablecidas',
      'La cartelera vuelve al orden A → Z, sin modo compacto y con todas las funciones.',
    );
  }, [resetPreferences]);

  return (
    <>
      <Text style={styles.sectionTitle}>Preferencias de la cartelera</Text>
      <Text style={styles.sectionHint}>
        Se guardan con MMKV y se aplican al instante, sin botón de guardar ni reiniciar la app.
      </Text>

      <SwitchRow
        label="Modo compacto"
        description="Afiche más bajo y menos datos por obra en la lista."
        value={compactMode}
        onValueChange={setCompactMode}
      />

      <SwitchRow
        label="Solo funciones con butacas"
        description="Oculta las obras agotadas de la cartelera."
        value={onlyAvailable}
        onValueChange={setOnlyAvailable}
      />

      <SegmentedControl
        label="Orden de la lista"
        description="Ordena alfabéticamente por título de la obra."
        value={sortOrder}
        options={SORT_OPTIONS}
        onChange={setSortOrder}
      />

      <SegmentedControl
        label="Obras por página"
        description="Controla cuántas tarjetas se cargan antes de usar «Mostrar más»."
        value={itemsPerPage}
        options={PAGE_OPTIONS}
        onChange={setItemsPerPage}
      />

      <Pressable
        style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
        onPress={handleResetPreferences}
        accessibilityRole="button"
        accessibilityLabel="Restablecer preferencias"
      >
        <Ionicons name="refresh-outline" size={SIZES.iconSm} color={COLORS.textSecondary} />
        <Text style={styles.resetButtonText}>Restablecer preferencias</Text>
      </Pressable>
    </>
  );
}
// ===== SEMANA 07 · FIN =====
