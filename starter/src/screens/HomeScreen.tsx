// ===== SEMANA 01 · INICIO =====
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
  const DOMAIN_TITLE = 'Teatro';
  const DOMAIN_SUBTITLE = 'Cartelera de la temporada';

  function handleItemPress(item: Item): void {
    console.log('Item seleccionado:', item.name);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#14090c" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
        <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
      </View>

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

  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
});
// ===== SEMANA 01 · FIN =====
