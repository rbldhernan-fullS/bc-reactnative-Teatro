// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, SIZES } from '../../../theme';
import type { Item } from '../../../types';
import { styles } from '../styles';

interface SavedCardProps {
  item: Item;
  onPress: (item: Item) => void;
  onRemove: (id: string) => void;
}

/**
 * Tarjeta de una obra guardada.
 *
 * El botón de quitar es hermano del área pulsable y no va dentro: así no se
 * anida un `<button>` dentro de otro (E‑01).
 */
export function SavedCard({ item, onPress, onRemove }: SavedCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.cardPressTarget, pressed && styles.cardPressed]}
        onPress={() => onPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${item.name}`}
      >
        {/* ===== SEMANA 12 · INICIO ===== */}
        <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
        {/* ===== SEMANA 12 · FIN ===== */}

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            {/* ===== SEMANA 12 · INICIO ===== */}
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{item.genre}</Text>
            </View>
            {/* ===== SEMANA 12 · FIN ===== */}
            <View style={styles.removeButtonSlot} />
          </View>

          {/* ===== SEMANA 12 · INICIO ===== */}
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
            <Text style={styles.priceText}>${item.price.toLocaleString('es-CO')} COP</Text>
          </View>
          {/* ===== SEMANA 12 · FIN ===== */}
        </View>
      </Pressable>

      <Pressable
        onPress={() => onRemove(item.id)}
        style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Quitar ${item.name} de guardados`}
      >
        <Ionicons name="bookmark" size={SIZES.iconMd} color={COLORS.accent} />
      </Pressable>
    </View>
  );
}
// ===== SEMANA 04 · FIN =====
