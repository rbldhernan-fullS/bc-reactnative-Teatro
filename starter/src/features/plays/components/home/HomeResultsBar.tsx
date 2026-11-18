// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import type { SortOrder } from '../../../../hooks/usePreferences';
import { styles } from './styles';

interface HomeResultsBarProps {
  count: number;
  sortOrder: SortOrder;
  compactMode: boolean;
  onlyAvailable: boolean;
}

/** Contador de resultados y píldoras con los filtros activos. */
export function HomeResultsBar({
  count,
  sortOrder,
  compactMode,
  onlyAvailable,
}: HomeResultsBarProps): React.JSX.Element {
  return (
    <View style={styles.resultsBar}>
      <Text style={styles.resultsCount}>
        {count} {count === 1 ? 'obra disponible' : 'obras disponibles'}
      </Text>

      <View style={styles.activeFilters}>
        <Text style={styles.activeFilterBadge}>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</Text>
        {compactMode && <Text style={styles.activeFilterBadge}>Compacto</Text>}
        {onlyAvailable && <Text style={styles.activeFilterBadge}>Con butacas</Text>}
      </View>
    </View>
  );
}
// ===== SEMANA 07 · FIN =====
