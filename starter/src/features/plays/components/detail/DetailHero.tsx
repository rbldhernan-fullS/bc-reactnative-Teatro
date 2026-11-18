// ===== SEMANA 03 · INICIO =====
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../../theme';
import { styles } from './styles';

interface DetailHeroProps {
  name: string;
  genre: string;
  rating: number;
  posterUri: string;
  isSaved: boolean;
  hasLocalPoster: boolean;
  onToggleSave: () => void;
}

/** Cabecera de la ficha: afiche, insignias de género/valoración y guardado. */
export function DetailHero({
  name,
  genre,
  rating,
  posterUri,
  isSaved,
  hasLocalPoster,
  onToggleSave,
}: DetailHeroProps): React.JSX.Element {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: posterUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.imageOverlay} />

      <View style={styles.badgesRow}>
        <View style={styles.genreBadge}>
          <Text style={styles.genreBadgeText}>{genre}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>★ {rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* ===== SEMANA 11 · INICIO ===== */}
      {hasLocalPoster ? (
        <View style={styles.localPosterBadge}>
          <Ionicons name="camera" size={12} color={COLORS.background} />
          <Text style={styles.localPosterBadgeText}>Afiche local</Text>
        </View>
      ) : null}
      {/* ===== SEMANA 11 · FIN ===== */}

      {/* ===== SEMANA 04 · INICIO ===== */}
      <Pressable
        style={({ pressed }) => [
          styles.savePill,
          isSaved && styles.savePillActive,
          pressed && styles.savePillPressed,
        ]}
        onPress={onToggleSave}
        accessibilityRole="button"
        accessibilityState={{ selected: isSaved }}
        accessibilityLabel={
          isSaved ? `Quitar ${name} de guardados` : `Guardar ${name} en guardados`
        }
      >
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={SIZES.iconSm}
          color={isSaved ? COLORS.accent : COLORS.textPrimary}
        />
        <Text style={[styles.savePillText, isSaved && styles.savePillTextActive]}>
          {isSaved ? 'Guardada' : 'Guardar'}
        </Text>
      </Pressable>
      {/* ===== SEMANA 04 · FIN ===== */}
    </View>
  );
}
// ===== SEMANA 03 · FIN =====
