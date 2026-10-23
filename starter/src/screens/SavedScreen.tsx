// ============================================
// SCREEN: SavedScreen — Semana 04: Estado Global
// Segunda pestaña: obras guardadas leídas desde el store de Zustand
// ============================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { GestureResponderEvent, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
import type { SavedScreenNavigationProp } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';

export function SavedScreen(): React.JSX.Element {
  const navigation = useNavigation<SavedScreenNavigationProp>();

  // Selectores específicos: el componente solo reacciona a lo que usa.
  const savedItems = useSavedStore((state) => state.savedItems);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearSaved = useSavedStore((state) => state.clearSaved);

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
      // Evita que el toque del bookmark abra el detalle de la obra.
      event.stopPropagation();
      removeItem(id);
    },
    [removeItem]
  );

  const renderSavedItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleItemPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${item.name}`}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{item.genre}</Text>
            </View>

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
                color={COLORS.tabActive}
              />
            </Pressable>
          </View>

          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>🏛 {item.hall}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>📅 {item.date}</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
            <Text style={styles.priceText}>
              ${item.price.toLocaleString('es-CO')} COP
            </Text>
          </View>
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header de la pestaña Guardados */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Obras Guardadas</Text>
              <Text style={styles.headerSubtitle}>
                {savedItems.length}{' '}
                {savedItems.length === 1
                  ? 'obra guardada en tu lista'
                  : 'obras guardadas en tu lista'}
              </Text>
            </View>

            {savedItems.length > 0 && (
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

        {/* Lista de Guardados desde Zustand */}
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedItem}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
