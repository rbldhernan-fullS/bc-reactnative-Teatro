// ============================================
// COMPONENT: SwipeableCard — Semana 10
// Tarjeta arrastrable con Gesture.Pan, umbral ±120 px y snap-back
// ============================================

import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../theme';
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

const SNAP_SPRING = {
  damping: 18,
  stiffness: 190,
  mass: 0.8,
} as const;

export const SwipeableCard = React.memo(function SwipeableCard({
  item,
  onPress,
  saved,
  onToggleSave,
  onDismiss,
  compact = false,
}: SwipeableCardProps): React.JSX.Element {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const handleSwipeRight = useCallback((): void => {
    onToggleSave(item);
  }, [item, onToggleSave]);

  const handleSwipeLeft = useCallback((): void => {
    onDismiss(item);
  }, [item, onDismiss]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-18, 18])
        .onStart(() => {
          startX.value = translateX.value;
          startY.value = translateY.value;
        })
        .onUpdate((event) => {
          translateX.value = startX.value + event.translationX;
          translateY.value = startY.value + event.translationY * 0.35;
        })
        .onEnd(() => {
          if (translateX.value >= SWIPE_THRESHOLD) {
            runOnJS(handleSwipeRight)();
          } else if (translateX.value <= -SWIPE_THRESHOLD) {
            runOnJS(handleSwipeLeft)();
          }

          translateX.value = withSpring(0, SNAP_SPRING);
          translateY.value = withSpring(0, SNAP_SPRING);
        })
        .onFinalize(() => {
          translateX.value = withSpring(0, SNAP_SPRING);
          translateY.value = withSpring(0, SNAP_SPRING);
        }),
    [
      handleSwipeLeft,
      handleSwipeRight,
      startX,
      startY,
      translateX,
      translateY,
    ]
  );

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [-6, 0, 6],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const saveHintStyle = useAnimatedStyle(() => {
    const reveal = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: reveal,
      transform: [{ scale: 0.8 + reveal * 0.2 }],
    };
  });

  const dismissHintStyle = useAnimatedStyle(() => {
    const reveal = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: reveal,
      transform: [{ scale: 0.8 + reveal * 0.2 }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Acción derecha: guardar o quitar de la lista del socio */}
      <Animated.View
        style={[styles.actionLayer, styles.actionLeft, saveHintStyle]}
        pointerEvents="none"
      >
        <Ionicons
          name={saved ? 'bookmark-outline' : 'bookmark'}
          size={SIZES.iconMd}
          color={COLORS.accent}
        />
        <Text style={styles.saveActionText}>
          {saved ? 'Quitar' : 'Guardar'}
        </Text>
      </Animated.View>

      {/* Acción izquierda: descartar de la cartelera */}
      <Animated.View
        style={[styles.actionLayer, styles.actionRight, dismissHintStyle]}
        pointerEvents="none"
      >
        <Text style={styles.dismissActionText}>Descartar</Text>
        <Ionicons
          name="eye-off-outline"
          size={SIZES.iconMd}
          color={COLORS.error}
        />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <AnimatedCard
            item={item}
            onPress={onPress}
            saved={saved}
            onToggleSave={onToggleSave}
            compact={compact}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionLayer: {
    position: 'absolute',
    top: SPACING.xs,
    bottom: SPACING.xs,
    left: SPACING.base,
    right: SPACING.base,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionLeft: {
    justifyContent: 'flex-start',
    backgroundColor: COLORS.accentDim,
  },
  actionRight: {
    justifyContent: 'flex-end',
    backgroundColor: '#3a1418',
  },
  saveActionText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  dismissActionText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.error,
  },
});
