// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { GestureResponderEvent, ListRenderItem } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 07 · INICIO =====
import type { Item } from '../types';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { ScreenState } from '../components/ScreenState';
import { usePlays } from '../hooks/usePlays';
import { getApiErrorMessage } from '../services/api';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
import type { SavedScreenNavigationProp } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';

export function SavedScreen(): React.JSX.Element {
  const navigation = useNavigation<SavedScreenNavigationProp>();

  // ===== SEMANA 05 · INICIO =====
  const savedIds = useSavedStore((state) => state.savedIds);
  const removeId = useSavedStore((state) => state.removeId);
  // ===== SEMANA 05 · FIN =====
  const clearSaved = useSavedStore((state) => state.clearSaved);

  // ===== SEMANA 07 · INICIO =====
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 08 · INICIO =====
  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);
  // ===== SEMANA 08 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const plays = useMemo(() => data?.plays ?? [], [data]);
  const isOffline = data?.source === 'cache';
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const savedItems = useMemo(
    () => plays.filter((item) => savedIdSet.has(item.id)),
    [plays, savedIdSet]
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
    [navigation]
  );

  const handleRemovePress = useCallback(
    (event: GestureResponderEvent, id: string): void => {
      event.stopPropagation();
      removeId(id);
    },
    [removeId]
  );

  const renderSavedItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleItemPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${item.name}`}
      >
        {/* ===== SEMANA 05 · INICIO ===== */}
        <Image
          source={{ uri: item.imageUri }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {/* ===== SEMANA 05 · FIN ===== */}

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            {/* ===== SEMANA 05 · INICIO ===== */}
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{item.genre}</Text>
            </View>
            {/* ===== SEMANA 05 · FIN ===== */}

            <Pressable
              onPress={(event) => handleRemovePress(event, item.id)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Quitar ${item.name} de guardados`}
            >
              <Ionicons
                name="bookmark"
                size={SIZES.iconMd}
                color={COLORS.accent}
              />
            </Pressable>
          </View>

          {/* ===== SEMANA 08 · INICIO ===== */}
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          {/* ===== SEMANA 08 · FIN ===== */}
          {/* ===== SEMANA 07 · INICIO ===== */}
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
          {/* ===== SEMANA 07 · FIN ===== */}

          {/* ===== SEMANA 06 · INICIO ===== */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>🏛 {item.hall}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>📅 {item.date}</Text>
          </View>
          {/* ===== SEMANA 06 · FIN ===== */}

          {/* ===== SEMANA 05 · INICIO ===== */}
          <View style={styles.cardFooter}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
            <Text style={styles.priceText}>
              ${item.price.toLocaleString('es-CO')} COP
            </Text>
          </View>
          {/* ===== SEMANA 05 · FIN ===== */}
        </View>
      </Pressable>
    ),
    [handleItemPress, handleRemovePress]
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="bookmark-outline"
          size={SIZES.iconXl}
          color={COLORS.textMuted}
        />
        <Text style={styles.emptyTitle}>Sin obras guardadas</Text>
        <Text style={styles.emptySubtitle}>
          Usa el bookmark de la cartelera o del detalle para guardar una obra y
          encontrarla aquí.
        </Text>
      </View>
    ),
    []
  );

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
                {savedIds.length}{' '}
                {/* ===== SEMANA 05 · FIN ===== */}
                {savedIds.length === 1
                  ? 'obra guardada en tu lista'
                  : 'obras guardadas en tu lista'}
              </Text>
            </View>

            {savedIds.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.clearButtonPressed,
                ]}
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
            <Text style={styles.offlineText}>
              ⚠️ Mostrando datos sin red — caché local
            </Text>
          </View>
        )}
        {/* ===== SEMANA 07 · FIN ===== */}

        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedItem}
          ListEmptyComponent={renderEmpty}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  offlineBanner: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: '#3a2210',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  offlineText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
  },
  listContent: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.9,
  },
  cardImage: {
    width: SIZES.favoriteImageWidth,
    height: SIZES.favoriteImageHeight,
    backgroundColor: COLORS.borderLight,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  genreBadge: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  removeButton: {
    padding: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  removeButtonPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.7,
  },
  itemName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  metaDot: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  ratingText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  priceText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
});
// ===== SEMANA 04 · FIN =====
