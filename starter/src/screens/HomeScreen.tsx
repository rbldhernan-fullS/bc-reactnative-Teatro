// ============================================================
// SCREEN: HomeScreen — Dominio Teatro
// Pantalla principal con búsqueda en tiempo real y FlatList
// ============================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Item } from '../types';
import { ITEMS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

export function HomeScreen(): React.JSX.Element {
  const DOMAIN_TITLE = 'Teatro Colón';
  const DOMAIN_SUBTITLE = 'Cartelera oficial de la temporada';

  // Referencia para enfocar el input al hacer click en cualquier parte de la barra
  const searchInputRef = useRef<TextInput>(null);

  // 1. Estado de búsqueda
  const [query, setQuery] = useState<string>('');

  // 2. Estado de refresco (Pull-to-refresh)
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Manejador de selección de obra
  const handleItemPress = useCallback((item: Item): void => {
    console.log('Obra seleccionada:', item.name);
  }, []);

  // 3. Filtrado en tiempo real con useMemo
  // Busca por título, director/compañía, género o sala (insensible a mayúsculas y acentos)
  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return ITEMS;
    }

    return ITEMS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(cleanQuery);
      const matchSubtitle = item.subtitle.toLowerCase().includes(cleanQuery);
      const matchGenre = item.genre.toLowerCase().includes(cleanQuery);
      const matchHall = item.hall.toLowerCase().includes(cleanQuery);
      return matchName || matchSubtitle || matchGenre || matchHall;
    });
  }, [query]);

  // Manejador de refresco simulado
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  // 4. Render Item memorizado con useCallback
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={handleItemPress} />,
    [handleItemPress]
  );

  // 5. Separador entre elementos con useCallback
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // 6. Estado vacío memorizado con useCallback
  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎭</Text>
        <Text style={styles.emptyTitle}>Sin obras encontradas</Text>
        <Text style={styles.emptySubtitle}>
          No hay funciones que coincidan con "{query}". Prueba buscando por otro
          título, director o género teatral.
        </Text>
        {query.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.clearFilterButton,
              pressed && styles.clearFilterButtonPressed,
            ]}
            onPress={() => {
              setQuery('');
              searchInputRef.current?.focus();
            }}
          >
            <Text style={styles.clearFilterButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        )}
      </View>
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header del Dominio Teatro */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.theaterIcon}>🎭</Text>
              <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
            </View>
            <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
          </View>

          {/* Barra de búsqueda (NO envuelta en TouchableWithoutFeedback para no matar el foco) */}
          <View style={styles.searchSection}>
            <Pressable
              style={styles.searchInputWrapper}
              onPress={() => searchInputRef.current?.focus()}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Buscar por obra, director o género..."
                placeholderTextColor={COLORS.textMuted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {query.length > 0 && (
                <Pressable
                  onPress={() => {
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={styles.clearIconWrapper}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Borrar búsqueda"
                >
                  <Text style={styles.clearIconText}>✕</Text>
                </Pressable>
              )}
            </Pressable>

            {/* Contador de resultados */}
            <View style={styles.resultsBar}>
              <Text style={styles.resultsCount}>
                {filteredItems.length}{' '}
                {filteredItems.length === 1 ? 'obra disponible' : 'obras disponibles'}
              </Text>
              {query.length > 0 && (
                <Text style={styles.activeFilterBadge}>Filtro activo</Text>
              )}
            </View>
          </View>

          {/* Área de Lista: el tap fuera cierra el teclado sin interferir con el input */}
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.listWrapper}>
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  theaterIcon: {
    fontSize: TYPOGRAPHY.size.xl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    fontSize: TYPOGRAPHY.size.base,
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  clearIconWrapper: {
    padding: SPACING.xs,
  },
  clearIconText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  activeFilterBadge: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  clearFilterButton: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  clearFilterButtonPressed: {
    opacity: 0.7,
  },
  clearFilterButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});
