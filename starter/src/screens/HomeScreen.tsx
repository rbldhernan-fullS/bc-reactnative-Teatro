// ===== SEMANA 01 · INICIO =====
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
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
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 05 · INICIO =====
import type { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ScreenState } from '../components/ScreenState';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { usePlays } from '../hooks/usePlays';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { usePreferences } from '../hooks/usePreferences';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { getApiErrorMessage } from '../services/api';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { useSavedStore } from '../stores/savedStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { HomeStackParamList } from '../navigation/types';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 03 · INICIO =====
type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 04 · INICIO =====
const DOMAIN_TITLE = 'Teatro Colón';
const DOMAIN_SUBTITLE = 'Cartelera oficial de la temporada';

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 01 · INICIO =====
export function HomeScreen(): React.JSX.Element {
  // ===== SEMANA 03 · INICIO =====
  const navigation = useNavigation<HomeScreenNavProp>();
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();

  const {
    sortOrder,
    compactMode,
    itemsPerPage,
    onlyAvailable,
    setOnlyAvailable,
  } = usePreferences();
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const savedIds = useSavedStore((state) => state.savedIds);
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);

  const searchInputRef = useRef<TextInput>(null);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 04 · INICIO =====
  const [query, setQuery] = useState<string>('');
  // ===== SEMANA 04 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage);

  const plays = useMemo(() => data?.plays ?? [], [data]);
  const isOffline = data?.source === 'cache';

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [itemsPerPage, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 03 · INICIO =====
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', {
        id: item.id,
        name: item.name,
      });
    },
    [navigation]
  );
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const handleToggleSave = useCallback(
    (item: Item): void => {
      toggleSaved(item.id);
    },
    [toggleSaved]
  );
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const filteredItems = useMemo(() => {
    const cleanQuery = normalizeText(query.trim());

    // ===== SEMANA 04 · INICIO =====
    const result = plays.filter((item) => {
      // ===== SEMANA 07 · INICIO =====
      if (onlyAvailable && item.availableSeats === 0) {
        return false;
      }

      if (!cleanQuery) {
        return true;
      }
      // ===== SEMANA 07 · FIN =====

      return [item.name, item.subtitle, item.genre, item.hall].some((field) =>
        normalizeText(field).includes(cleanQuery)
      );
    });

    return result.sort((first, second) =>
      sortOrder === 'asc'
        ? first.name.localeCompare(second.name, 'es')
        : second.name.localeCompare(first.name, 'es')
    );
    // ===== SEMANA 04 · FIN =====
  }, [plays, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const handleLoadMore = useCallback((): void => {
    setVisibleCount((current) => current + itemsPerPage);
  }, [itemsPerPage]);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <ItemCard
        item={item}
        onPress={handleItemPress}
        saved={savedIdSet.has(item.id)}
        onToggleSave={handleToggleSave}
        compact={compactMode}
      />
    ),
    [compactMode, handleItemPress, savedIdSet, handleToggleSave]
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const renderEmpty = useCallback(() => {
    // ===== SEMANA 05 · INICIO =====
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
    // ===== SEMANA 05 · FIN =====

    // ===== SEMANA 07 · INICIO =====
    if (query.trim().length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyTitle}>Sin obras encontradas</Text>
          <Text style={styles.emptySubtitle}>
            No hay funciones que coincidan con "{query}". Prueba buscando por
            otro título, director o género teatral.
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
    }
    // ===== SEMANA 07 · FIN =====

    return (
      <View style={styles.emptyContainer}>
        {/* ===== SEMANA 07 · INICIO ===== */}
        <Text style={styles.emptyIcon}>🎟️</Text>
        <Text style={styles.emptyTitle}>Sin funciones disponibles</Text>
        {/* ===== SEMANA 07 · FIN ===== */}
        <Text style={styles.emptySubtitle}>
          Todas las obras de la cartelera están agotadas. Desactiva el filtro
          para volver a ver la temporada completa.
        </Text>
        {/* ===== SEMANA 05 · INICIO ===== */}
        <Pressable
          style={({ pressed }) => [
            styles.clearFilterButton,
            pressed && styles.clearFilterButtonPressed,
          ]}
          onPress={() => setOnlyAvailable(false)}
        >
          <Text style={styles.clearFilterButtonText}>Ver todas las obras</Text>
        </Pressable>
        {/* ===== SEMANA 05 · FIN ===== */}
      </View>
    );
  }, [navigation, onlyAvailable, plays.length, query, setOnlyAvailable]);
  // ===== SEMANA 02 · FIN =====

  const renderFooter = useCallback(() => {
    // ===== SEMANA 07 · INICIO =====
    const remaining = filteredItems.length - visibleItems.length;

    if (remaining <= 0) {
      return null;
    }
    // ===== SEMANA 07 · FIN =====

    return (
      <View style={styles.footer}>
        {/* ===== SEMANA 05 · INICIO ===== */}
        <Pressable
          style={({ pressed }) => [
            styles.loadMoreButton,
            pressed && styles.loadMoreButtonPressed,
          ]}
          onPress={handleLoadMore}
          accessibilityRole="button"
          accessibilityLabel={`Mostrar ${Math.min(remaining, itemsPerPage)} obras más`}
        >
          <Text style={styles.loadMoreText}>
            Mostrar {Math.min(remaining, itemsPerPage)} más
          </Text>
        </Pressable>
        {/* ===== SEMANA 05 · FIN ===== */}
        {/* ===== SEMANA 07 · INICIO ===== */}
        <Text style={styles.footerHint}>
          {visibleItems.length} de {filteredItems.length} obras
        </Text>
        {/* ===== SEMANA 07 · FIN ===== */}
      </View>
    );
  }, [filteredItems.length, handleLoadMore, itemsPerPage, visibleItems.length]);

  // ===== SEMANA 05 · INICIO =====
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
  // ===== SEMANA 05 · FIN =====

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
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

            <View style={styles.resultsBar}>
              <Text style={styles.resultsCount}>
                {filteredItems.length}{' '}
                {filteredItems.length === 1
                  ? 'obra disponible'
                  : 'obras disponibles'}
              </Text>

              {/* ===== SEMANA 07 · INICIO ===== */}
              <View style={styles.activeFilters}>
                <Text style={styles.activeFilterBadge}>
                  {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                </Text>
                {compactMode && (
                  <Text style={styles.activeFilterBadge}>Compacto</Text>
                )}
                {onlyAvailable && (
                  <Text style={styles.activeFilterBadge}>Con butacas</Text>
                )}
              </View>
              {/* ===== SEMANA 07 · FIN ===== */}
            </View>
          </View>

          {/* ===== SEMANA 07 · INICIO ===== */}
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineIcon}>⚠️</Text>
              <View style={styles.offlineTextBlock}>
                <Text style={styles.offlineTitle}>Mostrando datos sin red</Text>
                <Text style={styles.offlineSubtitle}>
                  Cartelera recuperada de la caché local del dispositivo.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.offlineRetry,
                  pressed && styles.offlineRetryPressed,
                ]}
                onPress={handleRefresh}
                accessibilityRole="button"
                accessibilityLabel="Volver a intentar la conexión"
              >
                <Text style={styles.offlineRetryText}>Reintentar</Text>
              </Pressable>
            </View>
          )}
          {/* ===== SEMANA 07 · FIN ===== */}

          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.listWrapper}>
              <FlatList
                data={visibleItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
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
    gap: SPACING.sm,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: '#3a2210',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  offlineIcon: {
    fontSize: TYPOGRAPHY.size.base,
  },
  offlineTextBlock: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.warning,
  },
  offlineSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  offlineRetry: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  offlineRetryPressed: {
    opacity: 0.7,
  },
  offlineRetryText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
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
  footer: {
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
  },
  loadMoreButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface,
  },
  loadMoreButtonPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.8,
  },
  loadMoreText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  footerHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
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
// ===== SEMANA 01 · FIN =====
