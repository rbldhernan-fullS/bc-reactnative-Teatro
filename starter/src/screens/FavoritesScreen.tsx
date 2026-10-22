// ============================================
// SCREEN: FavoritesScreen — Dominio Teatro
// Segunda pestaña: Obras teatrales destacadas y favoritas
// ============================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FAVORITES } from '../data/mockData';
import { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
import { FavoritesScreenNavigationProp } from '../navigation/types';

export function FavoritesScreen(): React.JSX.Element {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  const handleFavoritePress = useCallback(
    (item: Item): void => {
      navigation.navigate('Home', {
        screen: 'HomeDetail',
        params: {
          id: item.id,
          name: item.name,
          subtitle: item.subtitle,
          imageUri: item.imageUri,
          genre: item.genre,
          date: item.date,
          time: item.time,
          price: item.price,
          hall: item.hall,
          duration: item.duration,
          availableSeats: item.availableSeats,
          rating: item.rating,
          synopsis: item.synopsis,
        },
      });
    },
    [navigation]
  );

  const renderFavorite: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleFavoritePress(item)}
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
            <Text style={styles.heartIcon}>♥</Text>
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
    [handleFavoritePress]
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyHeartIcon}>♡</Text>
        <Text style={styles.emptyTitle}>Sin obras favoritas</Text>
        <Text style={styles.emptySubtitle}>
          Guarda tus obras favoritas desde la cartelera para encontrarlas y
          reservar rápidamente.
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header de la pestaña Favoritos */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Obras Favoritas</Text>
          <Text style={styles.headerSubtitle}>
            {FAVORITES.length} obras guardadas en tu lista personal
          </Text>
        </View>

        {/* Lista de Favoritos */}
        <FlatList
          data={FAVORITES}
          keyExtractor={(item) => item.id}
          renderItem={renderFavorite}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    width: 110,
    height: 140,
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
    marginBottom: 4,
  },
  genreBadge: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  heartIcon: {
    color: COLORS.error,
    fontSize: 18,
  },
  itemName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 4,
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
    marginTop: 4,
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
    paddingVertical: 80,
    paddingHorizontal: SPACING.xl,
  },
  emptyHeartIcon: {
    fontSize: 50,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
