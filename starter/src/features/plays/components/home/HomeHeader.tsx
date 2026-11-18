// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { AnimatedButton } from '../../../../components/ui/AnimatedButton';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { styles } from './styles';

const DOMAIN_TITLE = 'Teatro Colón';
const DOMAIN_SUBTITLE = 'Cartelera oficial de la temporada';
// ===== SEMANA 04 · FIN =====

interface HomeHeaderProps {
  onCreate: () => void;
}

/** Encabezado de la cartelera con el acceso directo a crear una obra. */
export function HomeHeader({ onCreate }: HomeHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <View style={styles.headerTextBlock}>
          <View style={styles.titleLine}>
            <Text style={styles.theaterIcon}>🎭</Text>
            <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
        </View>

        <AnimatedButton
          label="Nueva"
          onPress={onCreate}
          icon="add"
          compact
          accessibilityLabel="Crear una obra nueva"
        />
      </View>
    </View>
  );
}
