import { USE_NATIVE_DRIVER } from '../utils/animation';
// ===== SEMANA 01 · INICIO =====
import React, { useRef } from 'react';
import { Animated } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 09 · INICIO =====
import type { Item } from '../types';
import { SIZES } from '../theme';
import { PressableCard } from './PressableCard';

interface AnimatedCardProps {
  item: Item;
  onPress: (item: Item) => void;
  saved: boolean;
  onToggleSave: (item: Item) => void;
  compact?: boolean;
}

const PRESS_IN_SPRING = {
  toValue: SIZES.pressedScale,
  tension: 400,
  friction: 28,
  useNativeDriver: USE_NATIVE_DRIVER,
} as const;

const PRESS_OUT_SPRING = {
  toValue: 1,
  tension: 200,
  friction: 8,
  useNativeDriver: USE_NATIVE_DRIVER,
} as const;

export const AnimatedCard = React.memo(function AnimatedCard({
  item,
  onPress,
  saved,
  onToggleSave,
  compact = false,
}: AnimatedCardProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn(): void {
    Animated.spring(scale, PRESS_IN_SPRING).start();
  }

  function handlePressOut(): void {
    Animated.spring(scale, PRESS_OUT_SPRING).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <PressableCard
        item={item}
        saved={saved}
        onPress={onPress}
        onToggleSave={onToggleSave}
        compact={compact}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
    </Animated.View>
  );
});
// ===== SEMANA 09 · FIN =====
