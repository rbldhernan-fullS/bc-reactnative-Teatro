// ============================================
// SCREEN: DetailScreen — Semana 04: Estado Global
// Ficha técnica completa y acción de guardar conectada a Zustand
// ============================================

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { DetailScreenProps } from '../navigation/types';
import { ITEMS } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
import { selectIsSaved, useSavedStore } from '../stores/savedStore';

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailScreenProps['route']>();
  const navigation = useNavigation<DetailScreenProps['navigation']>();
  const insets = useSafeAreaInsets();

  const { id } = route.params;
  const item = ITEMS.find((play) => play.id === id);

  // Estado global: el botón lee y escribe el mismo store que la cartelera.
  const isSaved = useSavedStore(selectIsSaved(id));
  const toggleItem = useSavedStore((state) => state.toggleItem);

  if (!item) {
    return (
      <View style={[styles.screenWrapper, styles.notFoundContainer]}>
        <Text style={styles.notFoundTitle}>Obra no encontrada</Text>
        <Text style={styles.notFoundSubtitle}>
          La obra que buscas ya no está en cartelera.
        </Text>
        <Pressable
          style={styles.bookButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver a la cartelera"
        >
          <Text style={styles.bookButtonText}>Volver a la cartelera</Text>
        </Pressable>
      </View>
    );
  }

  const {
    name,
    subtitle,
    imageUri,
    genre,
    date,
    time,
    price,
    hall,
    duration,
    availableSeats,
    rating,
    synopsis,
  } = item;

  function handleBookingPress(): void {
    const message = `¿Deseas iniciar la selección de butacas para "${name}" en la ${hall} (${date} · ${time})?`;
    if (Platform.OS === 'web') {
      window.alert(
        `Reserva iniciada:\n${message}\nValor: $${price.toLocaleString('es-CO')} COP`
      );
    } else {
      Alert.alert('Reservar Butacas', message, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () =>
            Alert.alert('Reserva iniciada', `Obra: ${name}\nID: ${id}`),
        },
      ]);
    }
  }

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: SIZES.detailContentBottomPadding + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner principal / Afiche */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Badges superiores sobre la imagen */}
          <View style={styles.badgesRow}>
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{genre}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>★ {rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Acción Guardar / Quitar conectada al store */}
          <Pressable
            style={({ pressed }) => [
              styles.savePill,
              isSaved && styles.savePillActive,
              pressed && styles.savePillPressed,
            ]}
            onPress={() => toggleItem(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSaved }}
            accessibilityLabel={
              isSaved
                ? `Quitar ${name} de guardados`
                : `Guardar ${name} en guardados`
            }
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={SIZES.iconSm}
              color={isSaved ? COLORS.tabActive : COLORS.textPrimary}
            />
            <Text
              style={[
                styles.savePillText,
                isSaved && styles.savePillTextActive,
              ]}
            >
              {isSaved ? 'Guardada' : 'Guardar'}
            </Text>
          </Pressable>
        </View>

        {/* Información Principal */}
        <View style={styles.body}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Barra de metadatos rápidos */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>🏛</Text>
              <Text style={styles.metaLabel}>Sala</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {hall}
              </Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>⏳</Text>
              <Text style={styles.metaLabel}>Duración</Text>
              <Text style={styles.metaValue}>{duration}</Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaLabel}>Fecha</Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaIcon}>🕒</Text>
              <Text style={styles.metaLabel}>Horario</Text>
              <Text style={styles.metaValue}>{time}</Text>
            </View>
          </View>

          {/* Disponibilidad de butacas */}
          <View style={styles.availabilityBanner}>
            <Text style={styles.availabilityIcon}>🎭</Text>
            <View style={styles.availabilityTextWrapper}>
              <Text style={styles.availabilityTitle}>
                Aforo y Disponibilidad
              </Text>
              <Text style={styles.availabilitySubtitle}>
                {availableSeats > 10
                  ? `${availableSeats} butacas disponibles en esta función`
                  : `¡Últimas ${availableSeats} butacas disponibles!`}
              </Text>
            </View>
          </View>

          {/* Sinopsis de la obra */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopsis Argumental</Text>
            <Text style={styles.synopsisText}>{synopsis}</Text>
          </View>

          {/* Ficha Técnica Teatral */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ficha Artística</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Identificador</Text>
              <Text style={styles.specValue}>OBRA-{id.padStart(3, '0')}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Género</Text>
              <Text style={styles.specValue}>{genre}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Público</Text>
              <Text style={styles.specValue}>
                {genre === 'Infantil' ? 'Familiar / Todo público' : 'Mayores de 14 años'}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Idioma</Text>
              <Text style={styles.specValue}>Español</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barra de acción inferior fija */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: SPACING.md + insets.bottom },
        ]}
      >
        <View style={styles.priceColumn}>
          <Text style={styles.priceCaption}>Entrada General</Text>
          <Text style={styles.priceNumber}>
            ${price.toLocaleString('es-CO')}{' '}
            <Text style={styles.priceCurrency}>COP</Text>
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            pressed && styles.bookButtonPressed,
          ]}
          onPress={handleBookingPress}
          accessibilityRole="button"
          accessibilityLabel={`Reservar butacas para ${name}`}
        >
          <Text style={styles.bookButtonText}>Reservar Butacas</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  notFoundTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SIZES.detailContentBottomPadding,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SIZES.detailImageHeight,
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 9, 12, 0.4)',
  },
  badgesRow: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.base,
    right: SPACING.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savePill: {
    position: 'absolute',
    right: SPACING.base,
    bottom: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savePillActive: {
    borderColor: COLORS.tabActive,
  },
  savePillPressed: {
    opacity: 0.7,
  },
  savePillText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  savePillTextActive: {
    color: COLORS.tabActive,
  },
  genreBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  ratingBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  ratingBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  body: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textSecondary,
    marginTop: -SPACING.xs,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  metaCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: SIZES.iconMd,
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxs,
  },
  metaValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    gap: SPACING.md,
  },
  availabilityIcon: {
    fontSize: SIZES.iconLg,
  },
  availabilityTextWrapper: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  availabilitySubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  synopsisText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  specLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceColumn: {
    flexDirection: 'column',
  },
  priceCaption: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  priceNumber: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  priceCurrency: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  bookButtonPressed: {
    opacity: 0.8,
  },
  bookButtonText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});
