// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../../../theme';
import {
  SEAT_MAP_MAX_SCALE,
  SEAT_MAP_MIN_SCALE,
  SEAT_MAP_MIN_INITIAL_SCALE,
  clampTranslation,
  getFitScale,
} from '../../../../utils/seatMap';

interface SeatMapViewportProps {
  contentWidth: number;
  contentHeight: number;
  children: React.ReactNode;
  /** Solo lo usa la variante web: avisa que terminó un arrastre con puntero. */
  onDragEnd?: () => void;
}

const RESET_SPRING = { damping: 16, stiffness: 180 } as const;

/**
 * Viewport del mapa de butacas para nativo.
 *
 * Encapsula el zoom (pellizco) y el desplazamiento (dos dedos) para que la
 * pantalla solo se ocupe de pintar butacas. La variante web
 * (`SeatMapViewport.web.tsx`) ofrece el mismo contrato con ratón.
 */
export function SeatMapViewport({
  contentWidth,
  contentHeight,
  children,
}: SeatMapViewportProps): React.JSX.Element {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const initialScale = Math.max(
    SEAT_MAP_MIN_INITIAL_SCALE,
    getFitScale(contentWidth, viewport.width),
  );
  const minScale = SEAT_MAP_MIN_SCALE;

  useEffect(() => {
    scale.value = initialScale;
    translateX.value = 0;
    translateY.value = 0;
  }, [initialScale, scale, translateX, translateY]);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          savedScale.value = scale.value;
        })
        .onUpdate((event) => {
          scale.value = Math.min(
            SEAT_MAP_MAX_SCALE,
            Math.max(minScale, savedScale.value * event.scale),
          );
        })
        .onEnd(() => {
          translateX.value = withSpring(
            clampTranslation(translateX.value, contentWidth, viewport.width, scale.value),
          );
          translateY.value = withSpring(
            clampTranslation(translateY.value, contentHeight, viewport.height, scale.value),
          );
        }),
    [
      contentHeight,
      contentWidth,
      minScale,
      savedScale,
      scale,
      translateX,
      translateY,
      viewport.height,
      viewport.width,
    ],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(2)
        .onStart(() => {
          startX.value = translateX.value;
          startY.value = translateY.value;
        })
        .onUpdate((event) => {
          translateX.value = startX.value + event.translationX;
          translateY.value = startY.value + event.translationY;
        })
        .onEnd(() => {
          translateX.value = withSpring(
            clampTranslation(translateX.value, contentWidth, viewport.width, scale.value),
          );
          translateY.value = withSpring(
            clampTranslation(translateY.value, contentHeight, viewport.height, scale.value),
          );
        }),
    [
      contentHeight,
      contentWidth,
      scale,
      startX,
      startY,
      translateX,
      translateY,
      viewport.height,
      viewport.width,
    ],
  );

  const mapGesture = useMemo(
    () => Gesture.Simultaneous(pinchGesture, panGesture),
    [panGesture, pinchGesture],
  );

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleViewportLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  }, []);

  const handleResetView = useCallback((): void => {
    scale.value = withSpring(initialScale, RESET_SPRING);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  }, [initialScale, scale, translateX, translateY]);

  return (
    <>
      <View style={styles.viewport} onLayout={handleViewportLayout}>
        <GestureDetector gesture={mapGesture}>
          <Animated.View
            style={[styles.mapContent, { width: contentWidth, height: contentHeight }, mapStyle]}
          >
            {children}
          </Animated.View>
        </GestureDetector>

        <Pressable
          style={({ pressed }) => [styles.resetButton, pressed && styles.controlPressed]}
          onPress={handleResetView}
          accessibilityRole="button"
          accessibilityLabel="Centrar y restablecer el zoom"
        >
          <Ionicons name="scan-outline" size={16} color={COLORS.accent} />
          <Text style={styles.controlText}>Centrar</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>Pellizca para zoom · arrastra con dos dedos · toca una butaca</Text>
    </>
  );
}
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  resetButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.overlay,
  },
  controlPressed: {
    opacity: 0.7,
  },
  controlText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  hint: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
});
