// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 02 · INICIO =====
import type { Item } from '../../../types';
// ===== SEMANA 02 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { SwipeableCard } from '../components/cards/SwipeableCard';
import { HomeEmptyState, type HomeEmptyVariant } from '../components/home/HomeEmptyState';
import { HomeFooter } from '../components/home/HomeFooter';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeDismissedBanner, HomeOfflineBanner } from '../components/home/HomeOfflineBanner';
import { HomeResultsBar } from '../components/home/HomeResultsBar';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import { StaggeredItem } from '../components/home/StaggeredItem';
import { useHomeFilters } from '../hooks/useHomeFilters';
import { styles } from '../components/home/styles';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { ScreenState } from '../../../components/ui/ScreenState';
import { usePlays } from '../hooks/usePlays';
import { getApiErrorMessage } from '../../../services/http';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { useSavedStore } from '../../../stores/savedStore';
import type { HomeStackParamList } from '../../../navigation/types';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 03 · INICIO =====
type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 01 · INICIO =====
/**
 * Cartelera.
 *
 * La pantalla compone el encabezado, la búsqueda, los avisos y el listado; el
 * estado (búsqueda, filtros, paginación y descartes) vive en `useHomeFilters`
 * y cada bloque visual en `components/home`.
 */
export function HomeScreen(): React.JSX.Element {
  // ===== SEMANA 03 · INICIO =====
  const navigation = useNavigation<HomeScreenNavProp>();
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const {
    query,
    setQuery,
    sortOrder,
    compactMode,
    itemsPerPage,
    onlyAvailable,
    filteredItems,
    visibleItems,
    dismissedIds,
    remaining,
    handleDismiss,
    handleRestoreDismissed,
    handleLoadMore,
    handleToggleOnlyAvailable,
  } = useHomeFilters(data);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const searchInputRef = useRef<TextInput>(null);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const savedIds = useSavedStore((state) => state.savedIds);
  const toggleSaved = useSavedStore((state) => state.toggle);

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 03 · INICIO =====
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', {
        id: item.id,
        name: item.name,
      });
    },
    [navigation],
  );
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const handleToggleSave = useCallback(
    (item: Item): void => {
      toggleSaved(item.id);
    },
    [toggleSaved],
  );

  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item, index }) => (
      <StaggeredItem index={index}>
        <SwipeableCard
          item={item}
          onPress={handleItemPress}
          saved={savedIdSet.has(item.id)}
          onToggleSave={handleToggleSave}
          onDismiss={handleDismiss}
          compact={compactMode}
        />
      </StaggeredItem>
    ),
    [compactMode, handleDismiss, handleItemPress, savedIdSet, handleToggleSave],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const renderEmpty = useCallback(() => {
    const variant: HomeEmptyVariant =
      (data?.plays.length ?? 0) === 0
        ? 'empty'
        : query.trim().length > 0
          ? 'search'
          : dismissedIds.length > 0
            ? 'dismissed'
            : 'soldOut';

    return (
      <HomeEmptyState
        variant={variant}
        query={query}
        dismissedCount={dismissedIds.length}
        onCreate={() => navigation.navigate('Create')}
        onClearQuery={() => {
          setQuery('');
          searchInputRef.current?.focus();
        }}
        onRestore={handleRestoreDismissed}
        onShowAll={() => handleToggleOnlyAvailable(false)}
      />
    );
  }, [
    data?.plays.length,
    dismissedIds.length,
    handleRestoreDismissed,
    handleToggleOnlyAvailable,
    navigation,
    query,
    setQuery,
  ]);
  // ===== SEMANA 10 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const renderFooter = useCallback(
    () => (
      <HomeFooter
        remaining={remaining}
        itemsPerPage={itemsPerPage}
        visibleCount={visibleItems.length}
        totalCount={filteredItems.length}
        onLoadMore={handleLoadMore}
      />
    ),
    [filteredItems.length, handleLoadMore, itemsPerPage, remaining, visibleItems.length],
  );
  // ===== SEMANA 02 · FIN =====

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
          <HomeHeader onCreate={() => navigation.navigate('Create')} />

          <View style={styles.searchSection}>
            <HomeSearchBar query={query} onChangeQuery={setQuery} inputRef={searchInputRef} />
            <HomeResultsBar
              count={filteredItems.length}
              sortOrder={sortOrder}
              compactMode={compactMode}
              onlyAvailable={onlyAvailable}
            />
          </View>

          {/* ===== SEMANA 07 · INICIO ===== */}
          {data?.source === 'cache' && <HomeOfflineBanner onRetry={handleRefresh} />}
          {/* ===== SEMANA 07 · FIN ===== */}

          {/* ===== SEMANA 10 · INICIO ===== */}
          {dismissedIds.length > 0 && (
            <HomeDismissedBanner count={dismissedIds.length} onRestore={handleRestoreDismissed} />
          )}

          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>← Guardar · Descartar →</Text>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          {/* ===== SEMANA 10 · FIN ===== */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// ===== SEMANA 01 · FIN =====
