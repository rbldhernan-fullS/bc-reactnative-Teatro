// ============================================================
// SCREEN: HomeScreen
// ============================================================
// Pantalla principal: header con el nombre del dominio
// y lista de tarjetas usando ScrollView.
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_ITEMS } from '../data/mockData';


export function HomeScreen(): React.JSX.Element {
  // TODO: Personaliza el título con el nombre de tu dominio
  // Ejemplos: 'Mi Biblioteca', 'Farmacia Central', 'GymApp', 'Menú del Día'
  const DOMAIN_TITLE = 'Teatro';
  const DOMAIN_SUBTITLE = 'Cartelera de la temporada';

  /**
   * Handles item card press.
   * For now, just logs the item name. In week-03 we'll add navigation.
   */
  function handleItemPress(item: Item): void {
    // TODO: Mostrar un alert o log con el nombre del item
    console.log('Item seleccionado:', item.name);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#14090c" />

      {/* ============================================
          TODO: Implementar el Header de la app
          Debe mostrar: título del dominio y subtítulo
          Usa flexDirection: 'column' o 'row' según el diseño
          ============================================ */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
        <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
      </View>

      {/* ============================================
          TODO: Implementar la lista de tarjetas
          Usa ScrollView para permitir scroll vertical
          Renderiza un ItemCard por cada elemento en MOCK_ITEMS
          ============================================ */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ITEMS.map((item) => (
          <ItemCard key={item.id} item={item} onPress={handleItemPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14090c',
  },

  // Header — TODO: ajusta según el diseño de tu dominio
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4a2a32',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4a24c',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#b8a58a',
    marginTop: 4,
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },

  // Empty state placeholder — elimina cuando implementes la lista real
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
});
