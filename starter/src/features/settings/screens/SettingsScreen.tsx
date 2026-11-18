// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { COLORS, SIZES } from '../../../theme';
import { NotificationsSection } from '../components/NotificationsSection';
import { PreferencesSection } from '../components/PreferencesSection';
import { SecuritySection } from '../components/SecuritySection';
import { StorageSection } from '../components/StorageSection';
import { styles } from '../styles';

/**
 * Pantalla de Ajustes.
 *
 * Cada bloque vive en su propio componente (`components/`) para que esta
 * pantalla solo componga el encabezado y el desplazamiento. Las secciones
 * consumen sus hooks internamente; aquí no hay lógica de preferencias,
 * almacenamiento ni notificaciones.
 */
export function SettingsScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="options-outline" size={SIZES.iconLg} color={COLORS.accent} />
          <Text style={styles.headerTitle}>Ajustes</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Preferencias, notificaciones y seguridad del dispositivo
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PreferencesSection />
        <SecuritySection />
        <NotificationsSection />
        <StorageSection />
      </ScrollView>
    </SafeAreaView>
  );
}
// ===== SEMANA 07 · FIN =====
