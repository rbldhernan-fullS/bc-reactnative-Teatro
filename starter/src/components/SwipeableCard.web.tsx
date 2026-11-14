// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, type PointerEvent, type ViewStyle } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Item } from '../types';
import { COLORS, RADIUS, SIZES, SPACING } from '../theme';
import { SWIPE_MAX_ROTATION, SWIPE_SNAP_SPRING, SWIPE_THRESHOLD } from '../utils/swipe';
import { AnimatedCard } from './AnimatedCard';
import { SwipeActionPanels } from './SwipeActionPanels';

interface SwipeableCardProps {
  item: Item;
  onPress: (item: Item) => void;
  saved: boolean;
  onToggleSave: (item: Item) => void;
  onDismiss: (item: Item) => void;
  compact?: boolean;
}

/** Píxeles que hay que mover antes de considerar que es un arrastre y no un clic. */
const DRAG_ACTIVATION_PX = 6;
/** Fuera de pantalla, para la salida animada al descartar. */
const OFFSCREEN_X = 480;
const DISMISS_DURATION_MS = 180;
/**
 * Un arrastre puede terminar generando un `click` sobre la tarjeta. Durante
 * esta ventana se ignora cualquier pulsación, en lugar de usar una bandera que
 * se quedaría activa si el navegador no llega a emitir el clic.
 */
const CLICK_GUARD_MS = 250;

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

/** Nodo DOM del contenedor, necesario para captura de puntero, foco y teclado. */
function getNode(ref: React.RefObject<View | null>): HTMLElement | null {
  return ref.current as unknown as HTMLElement | null;
}

/**
 * El puntero se captura al empezar a arrastrar, no en `pointerdown`:
 * capturarlo antes reasignaría el clic al contenedor y rompería los botones
 * internos (abrir el detalle y guardar). Al capturarlo en cuanto hay
 * desplazamiento, el gesto no se corta si el cursor sale de la tarjeta.
 */
function capturePointer(node: HTMLElement | null, id: number): void {
  try {
    node?.setPointerCapture(id);
  } catch {
    // El navegador ya liberó el puntero; el arrastre termina en pointerup.
  }
}

function releasePointer(node: HTMLElement | null, id: number): void {
  try {
    node?.releasePointerCapture(id);
  } catch {
    // La captura ya no estaba activa.
  }
}

interface DismissButtonProps {
  itemName: string;
  onPress: () => void;
}

/**
 * Descartar discreto: mismo aspecto que `SaveButton` y hermano suyo dentro de
 * la fila de acciones de la tarjeta, nunca anidado en su área pulsable.
 */
const DismissButton = React.memo(function DismissButton({
  itemName,
  onPress,
}: DismissButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.dismissButton, pressed && styles.dismissButtonPressed]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Descartar ${itemName}`}
    >
      <Ionicons name="eye-off-outline" size={SIZES.iconMd} color={COLORS.error} />
    </Pressable>
  );
});

/**
 * Variante web de `SwipeableCard`.
 *
 * `GestureDetector` en web emitía `Cannot record touch end without a touch
 * start` (E‑02) y dejaba gestos a medias, así que el arrastre se implementa con
 * Pointer Events. Arrastrar a la derecha descarta y a la izquierda guarda, con
 * los mismos paneles que la versión nativa.
 *
 * Accesibilidad sin depender del gesto: el botón de la tarjeta (hermano del de
 * guardar y de descartar) recibe las flechas ←/→, que guardan y descartan, y
 * expone las mismas acciones por `accessibilityActions`. El contenedor no es
 * enfocable a propósito: un `View` con rol de botón se renderiza como
 * `<button>` y anidaría los botones internos (E‑01).
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
  const pointerId = useRef<number | null>(null);
  const axis = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const startPage = useRef({ x: 0, y: 0 });
  const releasedAt = useRef(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [-SWIPE_MAX_ROTATION, 0, SWIPE_MAX_ROTATION],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotation}deg` }],
    };
  });

  /** Evita que el clic posterior a un arrastre abra el detalle o guarde. */
  function isClickAfterDrag(): boolean {
    return Date.now() - releasedAt.current < CLICK_GUARD_MS;
  }

  const handlePointerDown = useCallback((event: PointerEvent): void => {
    const { button, pointerType, pageX, pageY } = event.nativeEvent;

    // Solo el botón principal del ratón inicia un arrastre.
    if (pointerType === 'mouse' && button !== 0) {
      return;
    }

    isPointerDown.current = true;
    isDragging.current = false;
    axis.current = 'none';
    startPage.current = { x: pageX, y: pageY };
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
          capturePointer(getNode(containerRef), pointerId.current);

          const node = getNode(containerRef);
          if (node) {
            node.style.cursor = 'grabbing';
          }
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

  const finishDrag = useCallback(
    (commit: boolean): void => {
      if (!isPointerDown.current) {
        return;
      }

      isPointerDown.current = false;

      if (pointerId.current !== null) {
        releasePointer(getNode(containerRef), pointerId.current);
        pointerId.current = null;
      }

      const node = getNode(containerRef);
      if (node) {
        node.style.cursor = 'grab';
      }

      if (!isDragging.current) {
        return;
      }

      isDragging.current = false;
      releasedAt.current = Date.now();

      const finalX = translateX.value;

      // Arrastrar a la derecha descarta.
      if (commit && finalX >= SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          OFFSCREEN_X,
          { duration: DISMISS_DURATION_MS },
          (finished) => {
            if (finished) {
              runOnJS(onDismiss)(item);
            }
          },
        );
        return;
      }

      // Arrastrar a la izquierda guarda (la tarjeta vuelve a su sitio).
      if (commit && finalX <= -SWIPE_THRESHOLD) {
        onToggleSave(item);
      }

      translateX.value = withSpring(0, SWIPE_SNAP_SPRING);
    },
    [item, onDismiss, onToggleSave, translateX],
  );

  const handlePointerUp = useCallback((): void => finishDrag(true), [finishDrag]);
  const handlePointerCancel = useCallback((): void => finishDrag(false), [finishDrag]);

  const handleCardPress = useCallback(
    (target: Item): void => {
      if (isClickAfterDrag()) {
        return;
      }

      onPress(target);
    },
    [onPress],
  );

  const handleToggleSave = useCallback(
    (target: Item): void => {
      if (isClickAfterDrag()) {
        return;
      }

      onToggleSave(target);
    },
    [onToggleSave],
  );

  const handleDismissPress = useCallback((): void => {
    if (isClickAfterDrag()) {
      return;
    }

    onDismiss(item);
  }, [item, onDismiss]);

  /**
   * Teclado y foco se resuelven con listeners del DOM porque los tipos de
   * react-native-web no reenvían `onKeyDown` de forma fiable y el anillo de
   * foco necesita `outline`, que no existe como estilo de React Native.
   */
  useEffect(() => {
    const node = getNode(containerRef);

    if (!node) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onToggleSave(item);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onDismiss(item);
      }
    };

    const handleFocusIn = (): void => {
      node.style.outline = `2px solid ${COLORS.accent}`;
      node.style.outlineOffset = '2px';
      node.style.borderRadius = `${RADIUS.lg}px`;
    };

    const handleFocusOut = (event: FocusEvent): void => {
      const next = event.relatedTarget as Node | null;

      if (next && node.contains(next)) {
        return;
      }

      node.style.outline = '';
      node.style.outlineOffset = '';
    };

    node.addEventListener('keydown', handleKeyDown);
    node.addEventListener('focusin', handleFocusIn);
    node.addEventListener('focusout', handleFocusOut);

    return () => {
      node.removeEventListener('keydown', handleKeyDown);
      node.removeEventListener('focusin', handleFocusIn);
      node.removeEventListener('focusout', handleFocusOut);
    };
  }, [item, onDismiss, onToggleSave]);

  return (
    <View
      ref={containerRef}
      style={[styles.container, dragSurface]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <SwipeActionPanels translateX={translateX} saved={saved} />

      <Animated.View style={animatedStyle}>
        <AnimatedCard
          item={item}
          onPress={handleCardPress}
          saved={saved}
          onToggleSave={handleToggleSave}
          compact={compact}
          trailingAction={<DismissButton itemName={item.name} onPress={handleDismissPress} />}
          accessibilityLabel={`Obra ${item.name}, género ${item.genre}, precio ${item.price} pesos. Flecha izquierda guarda, flecha derecha descarta.`}
          accessibilityActions={[
            { name: 'guardar', label: saved ? 'Quitar de guardados' : 'Guardar en guardados' },
            { name: 'descartar', label: 'Descartar de la cartelera' },
          ]}
          onAccessibilityAction={(event) => {
            const { actionName } = event.nativeEvent;

            if (actionName === 'guardar') {
              onToggleSave(item);
            } else if (actionName === 'descartar') {
              onDismiss(item);
            }
          }}
        />
      </Animated.View>
    </View>
  );
});
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dismissButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dismissButtonPressed: {
    opacity: 0.7,
  },
});
