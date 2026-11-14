// ===== SEMANA 01 · INICIO =====
import React from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
// ===== SEMANA 10 · FIN =====
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

const PRESS_OUT_SPRING = {
  damping: 10,
  stiffness: 220,
  mass: 0.7,
} as const;
// ===== SEMANA 09 · FIN =====

export const AnimatedCard = React.memo(function AnimatedCard({
  item,
  onPress,
  saved,
  onToggleSave,
  compact = false,
}: AnimatedCardProps): React.JSX.Element {
  // ===== SEMANA 10 · INICIO =====
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  // ===== SEMANA 10 · FIN =====

  function handlePressIn(): void {
    scale.value = withTiming(SIZES.pressedScale, { duration: 90 });
  }

  function handlePressOut(): void {
    scale.value = withSpring(1, PRESS_OUT_SPRING);
  }

  return (
    <Animated.View style={animatedStyle}>
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
