// ============================================
// COMPONENT: ItemCard — Dominio Teatro
// Tarjeta de obra teatral optimizada para listas
// ============================================

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export const ItemCard = React.memo(function ItemCard({
  item,
  onPress,
}: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Obra ${item.name}, género ${item.genre}, precio ${item.price} pesos`}
    >
      {/* Afiche / Portada de la obra */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.imageUri }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {/* Chip flotante de género */}
        <View style={styles.genreBadge}>
          <Text style={styles.genreBadgeText}>{item.genre}</Text>
        </View>

        {/* Chip flotante de calificación */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>★ {item.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Cuerpo informativo de la obra */}
      <View style={styles.cardBody}>
        {/* Título de la obra */}
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Director o compañía */}
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>

        {/* Sala y duración */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🏛 {item.hall}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>⏳ {item.duration}</Text>
        </View>

        {/* Fecha y hora de función */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {item.date}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>🕒 {item.time}</Text>
        </View>

        {/* Separador sutil */}
        <View style={styles.divider} />

        {/* Pie de tarjeta: Butacas y Precio */}
        <View style={styles.cardFooter}>
          <View style={styles.seatsContainer}>
            <Text style={styles.seatsLabel}>Disponibles</Text>
            <Text style={styles.seatsValue}>{item.availableSeats} butacas</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Entrada general</Text>
            <Text style={styles.priceValue}>
              ${item.price.toLocaleString('es-CO')} COP
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.9,
    transform: [{ scale: SIZES.pressedScale }],
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: SIZES.cardImageHeight,
    backgroundColor: COLORS.borderLight,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  genreBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  genreBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  ratingBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  cardBody: {
    padding: SPACING.base,
    gap: SPACING.xs,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  metaDot: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsContainer: {
    flexDirection: 'column',
  },
  seatsLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  seatsValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
});
