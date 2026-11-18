// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import type { ListRenderItem } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { Item } from '../../../types';
import type { SavedScreenNavigationProp } from '../../../navigation/types';
import { useSavedStore } from '../../../stores/savedStore';
import { SavedCard } from '../components/SavedCard';
import { SavedEmptyState } from '../components/SavedEmptyState';
import { styles } from '../styles';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { ScreenState } from '../../../components/ui/ScreenState';
import { usePlays } from '../../plays/hooks/usePlays';
import { getApiErrorMessage } from '../../../services/http';
// ===== SEMANA 05 · FIN =====

// ===== SEMANA 04 · INICIO =====
/**
 * Obras guardadas.
 *
 * La pantalla filtra la cartelera con los ids del store y compone la lista con
 * `SavedCard` y `SavedEmptyState`; el detalle se abre en la pestaña Cartelera
 * para no duplicar la ficha (E‑09).
 */
export function SavedScreen(): React.JSX.Element {
  const navigation = useNavigation<SavedScreenNavigationProp>();

  // ===== SEMANA 05 · INICIO =====
  const savedIds = useSavedStore((state) => state.savedIds);
  const removeSaved = useSavedStore((state) => state.remove);
  // ===== SEMANA 05 · FIN =====
  const clearSaved = useSavedStore((state) => state.clear);

  // ===== SEMANA 05 · INICIO =====
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const plays = useMemo(() => data?.plays ?? [], [data]);
  const isOffline = data?.source === 'cache';
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const savedItems = useMemo(
    () => plays.filter((item) => savedIdSet.has(item.id)),
    [plays, savedIdSet],
  );

  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);
  // ===== SEMANA 05 · FIN =====

  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('Home', {
        screen: 'HomeDetail',
        params: {
          id: item.id,
          name: item.name,
        },
      });
    },
    [navigation],
  );

  const handleRemovePress = useCallback(
    (id: string): void => {
      // ===== SEMANA 05 · INICIO =====
      removeSaved(id);
      // ===== SEMANA 05 · FIN =====
    },
    [removeSaved],
  );

  const handleEmptyAction = useCallback((): void => {
    navigation.navigate('Home', { screen: 'HomeList' });
  }, [navigation]);

  const renderSavedItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <SavedCard item={item} onPress={handleItemPress} onRemove={handleRemovePress} />,
    [handleItemPress, handleRemovePress],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // ===== SEMANA 05 · INICIO =====
  if (savedIds.length > 0 && isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          loading
          title="Cargando tus obras"
          message="Recuperando las obras guardadas desde la cartelera."
        />
      </SafeAreaView>
    );
  }

  if (savedIds.length > 0 && isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudieron cargar tus obras"
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Obras Guardadas</Text>
              <Text style={styles.headerSubtitle}>
                {/* ===== SEMANA 05 · INICIO ===== */}
                {savedIds.length} {/* ===== SEMANA 05 · FIN ===== */}
                {savedIds.length === 1
                  ? 'obra guardada en tu lista'
                  : 'obras guardadas en tu lista'}
              </Text>
            </View>

            {savedIds.length > 0 && (
              <Pressable
                style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
                onPress={clearSaved}
                accessibilityRole="button"
                accessibilityLabel="Vaciar la lista de obras guardadas"
              >
                <Text style={styles.clearButtonText}>Vaciar</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ===== SEMANA 07 · INICIO ===== */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>⚠️ Mostrando datos sin red — caché local</Text>
          </View>
        )}
        {/* ===== SEMANA 07 · FIN ===== */}

        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedItem}
          ListEmptyComponent={<SavedEmptyState onShowCartelera={handleEmptyAction} />}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching && !isLoading}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
// ===== SEMANA 04 · FIN =====
