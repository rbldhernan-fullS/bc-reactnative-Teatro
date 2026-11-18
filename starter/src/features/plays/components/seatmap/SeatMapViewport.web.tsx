// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type PointerEvent,
  type ViewStyle,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../../../theme';
import {
  SEAT_MAP_MIN_INITIAL_SCALE,
  clampScale,
  clampTranslation,
  getFitScale,
} from '../../../../utils/seatMap';

interface SeatMapViewportProps {
  contentWidth: number;
  contentHeight: number;
  children: React.ReactNode;
  /** Avisa que terminó un arrastre, para no confundirlo con un toque en una butaca. */
  onDragEnd?: () => void;
}

const RESET_SPRING = { damping: 16, stiffness: 180 } as const;
const DRAG_ACTIVATION_PX = 4;
const WHEEL_ZOOM_SPEED = 0.0015;
const ZOOM_STEP = 1.25;

/**
 * Estilos que solo existen en web y que los tipos de React Native no cubren.
 * `touchAction: 'none'` evita que el navegador robe el gesto para hacer scroll
 * y `userSelect: 'none'` impide seleccionar el texto de las butacas al arrastrar.
 */
const dragSurface = {
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'grab',
} as unknown as ViewStyle;

/**
 * Viewport del mapa de butacas para web.
 *
 * Sustituye los gestos de `react-native-gesture-handler` (que en web emiten
 * `Cannot record touch end without a touch start`) por Pointer Events:
 * arrastre con un puntero y zoom con la rueda o con los botones − / +.
 */
export function SeatMapViewport({
  contentWidth,
  contentHeight,
  children,
  onDragEnd,
}: SeatMapViewportProps): React.JSX.Element {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const viewportRef = useRef<View>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const pointerId = useRef<number | null>(null);
  const startPage = useRef({ x: 0, y: 0 });
  const startTranslate = useRef({ x: 0, y: 0 });

  const initialScale = Math.max(
    SEAT_MAP_MIN_INITIAL_SCALE,
    getFitScale(contentWidth, viewport.width),
  );

  useEffect(() => {
    scale.value = initialScale;
    translateX.value = 0;
    translateY.value = 0;
  }, [initialScale, scale, translateX, translateY]);

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

  // React registra `onWheel` como listener pasivo en la raíz, así que
  // `preventDefault()` no funcionaría y la página haría scroll mientras se
  // hace zoom. Por eso la rueda se escucha directamente sobre el nodo del DOM
  // con `passive: false`.
  useEffect(() => {
    const node = viewportRef.current as unknown as HTMLElement | null;

    if (!node) {
      return undefined;
    }

    function handleWheel(event: WheelEvent): void {
      event.preventDefault();

      const nextScale = clampScale(scale.value * Math.exp(-event.deltaY * WHEEL_ZOOM_SPEED));
      scale.value = nextScale;
      translateX.value = withSpring(
        clampTranslation(translateX.value, contentWidth, viewport.width, nextScale),
        RESET_SPRING,
      );
      translateY.value = withSpring(
        clampTranslation(translateY.value, contentHeight, viewport.height, nextScale),
        RESET_SPRING,
      );
    }

    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      node.removeEventListener('wheel', handleWheel);
    };
  }, [contentHeight, contentWidth, scale, translateX, translateY, viewport.height, viewport.width]);

  /**
   * El puntero se captura al superar el umbral de arrastre, no en `pointerdown`:
   * capturarlo antes reasignaría el clic al viewport y las butacas dejarían de
   * responder. Una vez empieza el arrastre, la captura evita perder el gesto si
   * el cursor sale del mapa.
   */
  function capturePointer(id: number): void {
    const node = viewportRef.current as unknown as HTMLElement | null;

    try {
      node?.setPointerCapture(id);
    } catch {
      // El navegador ya liberó el puntero; el arrastre termina en pointerup.
    }
  }

  function releasePointer(id: number): void {
    const node = viewportRef.current as unknown as HTMLElement | null;

    try {
      node?.releasePointerCapture(id);
    } catch {
      // La captura ya no estaba activa.
    }
  }

  const settleTranslation = useCallback((): void => {
    translateX.value = withSpring(
      clampTranslation(translateX.value, contentWidth, viewport.width, scale.value),
      RESET_SPRING,
    );
    translateY.value = withSpring(
      clampTranslation(translateY.value, contentHeight, viewport.height, scale.value),
      RESET_SPRING,
    );
  }, [contentHeight, contentWidth, scale, translateX, translateY, viewport.height, viewport.width]);

  const handlePointerDown = useCallback(
    (event: PointerEvent): void => {
      isPointerDown.current = true;
      isDragging.current = false;
      startPage.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
      startTranslate.current = { x: translateX.value, y: translateY.value };
    },
    [translateX, translateY],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      if (!isPointerDown.current) {
        return;
      }

      const dx = event.nativeEvent.pageX - startPage.current.x;
      const dy = event.nativeEvent.pageY - startPage.current.y;

      if (!isDragging.current) {
        if (Math.abs(dx) < DRAG_ACTIVATION_PX && Math.abs(dy) < DRAG_ACTIVATION_PX) {
          return;
        }

        isDragging.current = true;
        pointerId.current = event.nativeEvent.pointerId;
        capturePointer(pointerId.current);
      }

      translateX.value = startTranslate.current.x + dx;
      translateY.value = startTranslate.current.y + dy;
    },
    [translateX, translateY],
  );

  const handlePointerEnd = useCallback((): void => {
    if (!isPointerDown.current) {
      return;
    }

    isPointerDown.current = false;

    if (pointerId.current !== null) {
      releasePointer(pointerId.current);
      pointerId.current = null;
    }

    if (isDragging.current) {
      isDragging.current = false;
      settleTranslation();
      onDragEnd?.();
    }
  }, [onDragEnd, settleTranslation]);

  const zoomBy = useCallback(
    (factor: number): void => {
      const nextScale = clampScale(scale.value * factor);
      scale.value = withTiming(nextScale, { duration: 120 });
      translateX.value = withSpring(
        clampTranslation(translateX.value, contentWidth, viewport.width, nextScale),
        RESET_SPRING,
      );
      translateY.value = withSpring(
        clampTranslation(translateY.value, contentHeight, viewport.height, nextScale),
        RESET_SPRING,
      );
    },
    [contentHeight, contentWidth, scale, translateX, translateY, viewport.height, viewport.width],
  );

  const handleResetView = useCallback((): void => {
    scale.value = withSpring(initialScale, RESET_SPRING);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  }, [initialScale, scale, translateX, translateY]);

  return (
    <>
      <View
        ref={viewportRef}
        style={[styles.viewport, dragSurface]}
        onLayout={handleViewportLayout}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        <Animated.View
          style={[styles.mapContent, { width: contentWidth, height: contentHeight }, mapStyle]}
        >
          {children}
        </Animated.View>

        <View style={styles.controls}>
          <View style={styles.zoomRow}>
            <Pressable
              style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
              onPress={() => zoomBy(1 / ZOOM_STEP)}
              accessibilityRole="button"
              accessibilityLabel="Alejar el mapa"
            >
              <Ionicons name="remove" size={16} color={COLORS.accent} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
              onPress={() => zoomBy(ZOOM_STEP)}
              accessibilityRole="button"
              accessibilityLabel="Acercar el mapa"
            >
              <Ionicons name="add" size={16} color={COLORS.accent} />
            </Pressable>
          </View>

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
      </View>

      <Text style={styles.hint}>
        Arrastra para mover · rueda o botones para zoom · toca una butaca
      </Text>
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
  controls: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  zoomRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.overlay,
  },
  resetButton: {
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
