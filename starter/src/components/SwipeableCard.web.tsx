// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, type PointerEvent, type ViewStyle } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Item } from '../types';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import { AnimatedCard } from './AnimatedCard';

interface SwipeableCardProps {
  item: Item;
  onPress: (item: Item) => void;
  saved: boolean;
  onToggleSave: (item: Item) => void;
  onDismiss: (item: Item) => void;
  compact?: boolean;
}

const SWIPE_THRESHOLD = 120;
const DRAG_ACTIVATION_PX = 6;
const OFFSCREEN_X = 480;

const SNAP_BACK_SPRING = { damping: 16, stiffness: 180 } as const;

/**
 * Estilos exclusivos de web que los tipos de React Native no cubren.
 * `touchAction: 'pan-y'` deja pasar el scroll vertical de la página y
 * `userSelect: 'none'` evita seleccionar texto al arrastrar la tarjeta.
 */
const dragSurface = {
  touchAction: 'pan-y',
  userSelect: 'none',
  cursor: 'grab',
} as unknown as ViewStyle;

/**
 * Variante web de `SwipeableCard`.
 *
 * `GestureDetector` en web emitía `Cannot record touch end without a touch
 * start` (E‑02) y dejaba gestos a medias, así que el arrastre se implementa con
 * Pointer Events. Se conserva además el botón “Descartar”, que es la vía
 * accesible por teclado y lector de pantalla.
 */
export const SwipeableCard = React.memo(function SwipeableCard({
  item,
  onPress,
  saved,
  onToggleSave,
  onDismiss,
  compact = false,
}: SwipeableCardProps): React.JSX.Element {
  const containerRef = useRef<View>(null);
  const translateX = useSharedValue(0);

  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const pointerId = useRef<number | null>(null);
  const axis = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const startPage = useRef({ x: 0, y: 0 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /**
   * El puntero se captura al empezar a arrastrar, no en `pointerdown`:
   * capturarlo antes reasignaría el clic al contenedor y rompería los botones
   * internos (abrir el detalle y guardar). Al capturarlo en cuanto hay
   * desplazamiento, el gesto no se corta si el cursor sale de la tarjeta.
   */
  function capturePointer(id: number): void {
    const node = containerRef.current as unknown as HTMLElement | null;

    try {
      node?.setPointerCapture(id);
    } catch {
      // El navegador ya liberó el puntero; el arrastre termina en pointerup.
    }
  }

  function releasePointer(id: number): void {
    const node = containerRef.current as unknown as HTMLElement | null;

    try {
      node?.releasePointerCapture(id);
    } catch {
      // La captura ya no estaba activa.
    }
  }

  const handlePointerDown = useCallback((event: PointerEvent): void => {
    isPointerDown.current = true;
    isDragging.current = false;
    didDrag.current = false;
    axis.current = 'none';
    startPage.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      if (!isPointerDown.current) {
        return;
      }

      const dx = event.nativeEvent.pageX - startPage.current.x;
      const dy = event.nativeEvent.pageY - startPage.current.y;

      if (axis.current === 'none') {
        if (Math.abs(dx) < DRAG_ACTIVATION_PX && Math.abs(dy) < DRAG_ACTIVATION_PX) {
          return;
        }

        axis.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';

        if (axis.current === 'horizontal') {
          isDragging.current = true;
          pointerId.current = event.nativeEvent.pointerId;
          capturePointer(pointerId.current);
        }
      }

      // Si el gesto es vertical, no se toca la tarjeta: la página sigue
      // desplazándose con normalidad.
      if (axis.current !== 'horizontal') {
        return;
      }

      translateX.value = dx;
    },
    [translateX],
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

    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;
    didDrag.current = true;

    const finalX = translateX.value;

    if (Math.abs(finalX) >= SWIPE_THRESHOLD) {
      translateX.value = withTiming(
        Math.sign(finalX) * OFFSCREEN_X,
        { duration: 160 },
        (finished) => {
          if (finished) {
            runOnJS(onDismiss)(item);
          }
        },
      );
      return;
    }

    translateX.value = withSpring(0, SNAP_BACK_SPRING);
  }, [item, onDismiss, translateX]);

  const handleCardPress = useCallback(
    (target: Item): void => {
      // El clic que llega justo después de un arrastre no debe abrir el detalle.
      if (didDrag.current) {
        didDrag.current = false;
        return;
      }

      onPress(target);
    },
    [onPress],
  );

  const handleToggleSave = useCallback(
    (target: Item): void => {
      // Igual que con la tarjeta: guardar no debe dispararse al soltar un arrastre.
      if (didDrag.current) {
        didDrag.current = false;
        return;
      }

      onToggleSave(target);
    },
    [onToggleSave],
  );

  return (
    <View
      ref={containerRef}
      style={[styles.container, dragSurface]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <Animated.View style={animatedStyle}>
        <AnimatedCard
          item={item}
          onPress={handleCardPress}
          saved={saved}
          onToggleSave={handleToggleSave}
          compact={compact}
        />
      </Animated.View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => onDismiss(item)}
          style={({ pressed }) => [styles.dismissButton, pressed && styles.dismissButtonPressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Descartar ${item.name} de la cartelera`}
        >
          <Ionicons name="eye-off-outline" size={SIZES.iconSm} color={COLORS.error} />
          <Text style={styles.dismissText}>Descartar</Text>
        </Pressable>
      </View>
    </View>
  );
});
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: SPACING.base,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  dismissButtonPressed: {
    opacity: 0.7,
  },
  dismissText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
});
