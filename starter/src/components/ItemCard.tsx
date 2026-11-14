// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 01 · INICIO =====
interface ItemCardProps {
  item: Item;
  compact?: boolean;
}

/**
 * Tarjeta **presentacional**: solo pinta la obra.
 *
 * El área pulsable y el botón de guardar viven en `PressableCard`, para que el
 * botón sea hermano del contenedor y no un `<button>` anidado (corrección E‑01).
 */
export const ItemCard = React.memo(function ItemCard({
  item,
  compact = false,
}: ItemCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {/* ===== SEMANA 02 · INICIO ===== */}
      <View style={[styles.imageWrapper, compact && styles.imageWrapperCompact]}>
        <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.genreBadge}>
          <Text style={styles.genreBadgeText}>{item.genre}</Text>
        </View>

        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>★ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
      {/* ===== SEMANA 02 · FIN ===== */}

      <View style={[styles.cardBody, compact && styles.cardBodyCompact]}>
        {/* ===== SEMANA 02 · INICIO ===== */}
        <Text style={[styles.cardTitle, compact && styles.cardTitleCompact]} numberOfLines={1}>
          {item.name}
        </Text>
        {/* ===== SEMANA 02 · FIN ===== */}

        {/* ===== SEMANA 07 · INICIO ===== */}
        {!compact && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        {/* ===== SEMANA 07 · FIN ===== */}

        {/* ===== SEMANA 02 · INICIO ===== */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🏛 {item.hall}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>📅 {item.date}</Text>
        </View>

        {compact ? (
          <View style={styles.compactFooter}>
            {/* ===== SEMANA 07 · INICIO ===== */}
            <Text style={styles.compactSeats}>{item.availableSeats} butacas</Text>
            {/* ===== SEMANA 07 · FIN ===== */}
            <Text style={styles.priceValue}>${item.price.toLocaleString('es-CO')} COP</Text>
          </View>
        ) : (
          <>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>🕒 {item.time}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>⏳ {item.duration}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <View style={styles.seatsContainer}>
                <Text style={styles.seatsLabel}>Disponibles</Text>
                <Text style={styles.seatsValue}>{item.availableSeats} butacas</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Entrada general</Text>
                <Text style={styles.priceValue}>${item.price.toLocaleString('es-CO')} COP</Text>
              </View>
            </View>
          </>
        )}
        {/* ===== SEMANA 02 · FIN ===== */}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: SIZES.cardImageHeight,
    backgroundColor: COLORS.borderLight,
  },
  imageWrapperCompact: {
    height: SIZES.cardImageCompactHeight,
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
  cardBodyCompact: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xxs,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  cardTitleCompact: {
    fontSize: TYPOGRAPHY.size.md,
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
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xxs,
  },
  compactSeats: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
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
// ===== SEMANA 01 · FIN =====
