// ===== SEMANA 02 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';

import { AnimatedButton } from '../../../../components/ui/AnimatedButton';
import { styles } from './styles';

interface HomeFooterProps {
  remaining: number;
  itemsPerPage: number;
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
}

/** Pie del listado: carga la siguiente página de obras. */
export function HomeFooter({
  remaining,
  itemsPerPage,
  visibleCount,
  totalCount,
  onLoadMore,
}: HomeFooterProps): React.JSX.Element | null {
  if (remaining <= 0) {
    return null;
  }

  const nextPage = Math.min(remaining, itemsPerPage);

  return (
    <View style={styles.footer}>
      <AnimatedButton
        label={`Mostrar ${nextPage} más`}
        onPress={onLoadMore}
        variant="outline"
        accessibilityLabel={`Mostrar ${nextPage} obras más`}
      />
      <Text style={styles.footerHint}>
        {visibleCount} de {totalCount} obras
      </Text>
    </View>
  );
}
// ===== SEMANA 02 · FIN =====
