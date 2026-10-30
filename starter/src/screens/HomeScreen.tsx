// ============================================================
// SCREEN: HomeScreen — Semana 05: Networking
// Cartelera cargada desde la API con estados de red y refresco
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
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ScreenState } from '../components/ScreenState';
import { usePlays } from '../hooks/usePlays';
import { getApiErrorMessage } from '../services/api';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

const DOMAIN_TITLE = 'Teatro Colón';
const DOMAIN_SUBTITLE = 'Cartelera oficial de la temporada';

/**
 * Normaliza un texto para búsquedas insensibles a mayúsculas y acentos.
 * Ej.: "Ópera" -> "opera".
 */
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavProp>();

  // Estado del servidor: TanStack Query es la única fuente de las obras.
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();

  // Estado de UI: solo los ids guardados viven en Zustand.
  const savedIds = useSavedStore((state) => state.savedIds);
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);

  // Referencia para enfocar el input al hacer click en cualquier parte de la barra
  const searchInputRef = useRef<TextInput>(null);

  // 1. Estado de búsqueda
  const [query, setQuery] = useState<string>('');

  const plays = useMemo(() => data ?? [], [data]);

  // Manejador de selección de obra con navegación al detalle tipada
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', {
        id: item.id,
        name: item.name,
      });
    },
    [navigation]
  );

  // Guarda o quita la obra usando únicamente su identificador.
  const handleToggleSave = useCallback(
    (item: Item): void => {
      toggleSaved(item.id);
    },
    [toggleSaved]
  );

  // 2. Filtrado en tiempo real con useMemo
  const filteredItems = useMemo(() => {
    const cleanQuery = normalizeText(query.trim());
    if (!cleanQuery) {
      return plays;
    }

    return plays.filter((item) =>
      [item.name, item.subtitle, item.genre, item.hall].some((field) =>
        normalizeText(field).includes(cleanQuery)
      )
    );
  }, [plays, query]);

  // 3. Pull-to-refresh delegado a TanStack Query
  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);

  // 4. Render Item memorizado con useCallback
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <ItemCard
        item={item}
        onPress={handleItemPress}
        saved={savedIdSet.has(item.id)}
        onToggleSave={handleToggleSave}
      />
    ),
    [handleItemPress, savedIdSet, handleToggleSave]
  );

  // 5. Separador entre elementos con useCallback
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // 6. Estado vacío: distingue cartelera vacía de búsqueda sin resultados
  const renderEmpty = useCallback(() => {
    if (plays.length === 0) {
      return (
        <ScreenState
          icon="ticket-outline"
          title="Cartelera vacía"
          message="Todavía no hay obras registradas. Crea la primera función para abrir la temporada."
          actionLabel="Crear obra"
          onAction={() => navigation.navigate('Create')}
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎭</Text>
        <Text style={styles.emptyTitle}>Sin obras encontradas</Text>
        <Text style={styles.emptySubtitle}>
          No hay funciones que coincidan con "{query}". Prueba buscando por otro
          título, director o género teatral.
        </Text>
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
      </View>
    );
  }, [navigation, plays.length, query]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          loading
          title="Cargando cartelera"
          message="Consultando las obras y funciones de la temporada."
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la cartelera"
          message={getApiErrorMessage(error)}
          actionLabel="Reintentar"
          onAction={handleRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header del Dominio Teatro */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTextBlock}>
                <View style={styles.titleLine}>
                  <Text style={styles.theaterIcon}>🎭</Text>
                  <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
                </View>
                <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.createButtonPressed,
                ]}
                onPress={() => navigation.navigate('Create')}
                accessibilityRole="button"
                accessibilityLabel="Crear una obra nueva"
              >
                <Ionicons
                  name="add"
                  size={SIZES.iconSm}
                  color={COLORS.background}
                />
                <Text style={styles.createButtonText}>Nueva</Text>
              </Pressable>
            </View>
          </View>

          {/* Barra de búsqueda */}
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
              {Platform.OS !== 'ios' && query.length > 0 && (
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

          {/* Área de Lista con dismiss de teclado al tocar fuera */}
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
                refreshing={isFetching && !isLoading}
                onRefresh={handleRefresh}
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
    gap: SPACING.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  titleLine: {
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
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  createButtonPressed: {
    backgroundColor: COLORS.accentHover,
    opacity: 0.9,
  },
  createButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
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
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + SPACING.xxs,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}),
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
    paddingVertical: SPACING.xxs,
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
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: TYPOGRAPHY.size.display,
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
    lineHeight: TYPOGRAPHY.lineHeight.base,
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
