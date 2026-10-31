// ============================================
// SCREEN: CameraScreen — Semana 11
// Cámara a pantalla completa con permiso gestionado por PermissionGate.
// La foto capturada se guarda como afiche local de la obra.
// ============================================

import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  CameraView,
  useCameraPermissions,
  type CameraType,
  type FlashMode,
} from 'expo-camera';

import { PermissionGate } from '../components/PermissionGate';
import { usePosterStore } from '../stores/posterStore';
import type { CameraScreenProps } from '../navigation/types';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

export function CameraScreen(): React.JSX.Element {
  const navigation = useNavigation<CameraScreenProps['navigation']>();
  const route = useRoute<CameraScreenProps['route']>();
  const insets = useSafeAreaInsets();

  const { targetId } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const setPoster = usePosterStore((state) => state.setPoster);

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);

  function handleClose(): void {
    navigation.goBack();
  }

  function handleFlip(): void {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleFlashToggle(): void {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  }

  async function handleCapture(): Promise<void> {
    if (!cameraRef.current || capturing) {
      return;
    }

    setCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo) {
        Alert.alert(
          'Captura vacía',
          'La cámara no devolvió una imagen. Inténtalo de nuevo.'
        );
        return;
      }

      setPoster(targetId, photo.uri);
      navigation.goBack();
    } catch {
      Alert.alert(
        'No se pudo capturar',
        'Cierra la cámara y vuelve a intentarlo. Si el problema continúa, usa la galería.'
      );
    } finally {
      setCapturing(false);
    }
  }

  const granted = permission?.granted ?? false;

  return (
    <View style={styles.screen}>
      {granted ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        />
      ) : null}

      {!granted ? (
        <View style={styles.centerContent}>
          <PermissionGate
            permission={permission}
            icon="camera-outline"
            title="Permiso de cámara"
            description="El Teatro Colón usa la cámara para capturar el afiche de la obra que estás consultando."
            deniedHint="Puedes habilitar la cámara desde los ajustes o elegir una foto de la galería."
            onRequest={() => {
              void requestPermission();
            }}
          />
        </View>
      ) : null}

      {/* Barra superior: cerrar, flash y cambio de cámara */}
      <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar la cámara"
        >
          <Ionicons name="close" size={SIZES.iconMd} color={COLORS.textPrimary} />
        </Pressable>

        {granted ? (
          <View style={styles.topActions}>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                flash === 'on' && styles.iconButtonActive,
                pressed && styles.iconButtonPressed,
              ]}
              onPress={handleFlashToggle}
              accessibilityRole="button"
              accessibilityLabel={
                flash === 'on' ? 'Apagar el flash' : 'Encender el flash'
              }
            >
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={SIZES.iconMd}
                color={flash === 'on' ? COLORS.background : COLORS.textPrimary}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
              onPress={handleFlip}
              accessibilityRole="button"
              accessibilityLabel="Cambiar entre cámara frontal y trasera"
            >
              <Ionicons
                name="camera-reverse-outline"
                size={SIZES.iconMd}
                color={COLORS.textPrimary}
              />
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Disparador y ayuda */}
      {granted ? (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.lg }]}>
          <Text style={styles.hint}>
            Encuadra el afiche y toca el botón dorado
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.shutter,
              (pressed || capturing) && styles.shutterPressed,
            ]}
            onPress={() => {
              void handleCapture();
            }}
            disabled={capturing}
            accessibilityRole="button"
            accessibilityLabel="Capturar el afiche"
            accessibilityState={{ disabled: capturing }}
          >
            {capturing ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <View style={styles.shutterInner} />
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    backgroundColor: 'rgba(20, 9, 12, 0.55)',
  },
  topActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 9, 12, 0.65)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.base,
    backgroundColor: 'rgba(20, 9, 12, 0.55)',
  },
  hint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderWidth: 4,
    borderColor: COLORS.accentDim,
  },
  shutterPressed: {
    opacity: 0.75,
  },
  shutterInner: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
  },
});
