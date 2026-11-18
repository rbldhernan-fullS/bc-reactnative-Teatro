// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Item } from '../../../../types';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SWIPE_MAX_ROTATION, SWIPE_SNAP_SPRING, SWIPE_THRESHOLD } from '../../../../utils/swipe';
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

const ACTIVATION_X = 12;
const FAIL_OFFSET_Y = 18;

/**
 * Variante nativa de `SwipeableCard`.
 *
 * El gesto es el mismo que en web: **derecha descarta** e **izquierda guarda**.
 * Los paneles y el umbral viven en `SwipeActionPanels` y `utils/swipe` para que
 * las dos plataformas no se separen.
 */
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

  const handleDismiss = useCallback((): void => {
    onDismiss(item);
  }, [item, onDismiss]);

  const handleToggleSave = useCallback((): void => {
    onToggleSave(item);
  }, [item, onToggleSave]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-ACTIVATION_X, ACTIVATION_X])
        .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
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
            runOnJS(handleDismiss)();
          } else if (translateX.value <= -SWIPE_THRESHOLD) {
            runOnJS(handleToggleSave)();
          }
        })
        .onFinalize(() => {
          translateX.value = withSpring(0, SWIPE_SNAP_SPRING);
          translateY.value = withSpring(0, SWIPE_SNAP_SPRING);
        }),
    [handleDismiss, handleToggleSave, startX, startY, translateX, translateY],
  );

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [-SWIPE_MAX_ROTATION, 0, SWIPE_MAX_ROTATION],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <SwipeActionPanels translateX={translateX} saved={saved} />

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
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
