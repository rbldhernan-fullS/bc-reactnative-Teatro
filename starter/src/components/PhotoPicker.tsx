// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 11 · INICIO =====
import * as ImagePicker from 'expo-image-picker';

import { usePosterStore } from '../stores/posterStore';
import type { HomeStackParamList } from '../navigation/types';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

type PhotoPickerNavigationProp = NativeStackNavigationProp<
  HomeStackParamList
>;

interface PhotoPickerProps {
  targetId: string;
  fallbackUri: string;
  showPreview?: boolean;
}

export function PhotoPicker({
  targetId,
  fallbackUri,
  showPreview = true,
}: PhotoPickerProps): React.JSX.Element {
  const navigation = useNavigation<PhotoPickerNavigationProp>();
  const poster = usePosterStore((state) => state.posters[targetId]);
  const setPoster = usePosterStore((state) => state.setPoster);
  const removePoster = usePosterStore((state) => state.removePoster);

  const [picking, setPicking] = useState(false);
  const previewUri = poster ?? fallbackUri;

  const pickFromLibrary = useCallback(async (): Promise<void> => {
    if (picking) {
      return;
    }

    setPicking(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (asset) {
        setPoster(targetId, asset.uri);
      }
    } catch {
      Alert.alert(
        'Galería no disponible',
        'No pudimos abrir tus fotos. Revisa los permisos de la galería e inténtalo de nuevo.'
      );
    } finally {
      setPicking(false);
    }
  }, [picking, setPoster, targetId]);

  return (
    <View style={styles.container}>
      {showPreview ? (
        <View style={styles.previewWrapper}>
          <Image
            source={{ uri: previewUri }}
            style={styles.preview}
            resizeMode="cover"
          />
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>
              {poster ? 'Afiche local' : 'Afiche de la API'}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
          onPress={() => navigation.navigate('Camera', { targetId })}
          accessibilityRole="button"
          accessibilityLabel="Capturar el afiche con la cámara"
        >
          <Ionicons name="camera-outline" size={SIZES.iconSm} color={COLORS.accent} />
          <Text style={styles.actionText}>Cámara</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
          onPress={() => {
            void pickFromLibrary();
          }}
          disabled={picking}
          accessibilityRole="button"
          accessibilityLabel="Elegir el afiche desde la galería"
          accessibilityState={{ disabled: picking }}
        >
          {picking ? (
            <ActivityIndicator size="small" color={COLORS.accent} />
          ) : (
            <Ionicons name="images-outline" size={SIZES.iconSm} color={COLORS.accent} />
          )}
          <Text style={styles.actionText}>Galería</Text>
        </Pressable>

        {poster ? (
          <Pressable
            style={({ pressed }) => [
              styles.action,
              styles.actionDanger,
              pressed && styles.actionPressed,
            ]}
            onPress={() => removePoster(targetId)}
            accessibilityRole="button"
            accessibilityLabel="Quitar el afiche local"
          >
            <Ionicons name="trash-outline" size={SIZES.iconSm} color={COLORS.error} />
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              Quitar
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.hint}>
        La foto se guarda en este dispositivo y se muestra en el detalle de la
        obra.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  previewWrapper: {
    position: 'relative',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  preview: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.borderLight,
  },
  previewBadge: {
    position: 'absolute',
    left: SPACING.sm,
    bottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
  },
  previewBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface,
  },
  actionDanger: {
    borderColor: COLORS.error,
  },
  actionPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.85,
  },
  actionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  actionTextDanger: {
    color: COLORS.error,
  },
  hint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
});
// ===== SEMANA 11 · FIN =====
