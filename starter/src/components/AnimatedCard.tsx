// ============================================
// COMPONENT: AnimatedCard — Semana 10
// Envoltorio táctil migrado a Reanimated: spring de escala sin Animated API
// ============================================

import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { Item } from '../types';
import { SIZES } from '../theme';
import { ItemCard } from './ItemCard';

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

export const AnimatedCard = React.memo(function AnimatedCard({
  item,
  onPress,
  saved,
  onToggleSave,
  compact = false,
}: AnimatedCardProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn(): void {
    scale.value = withTiming(SIZES.pressedScale, { duration: 90 });
  }

  function handlePressOut(): void {
    scale.value = withSpring(1, PRESS_OUT_SPRING);
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Obra ${item.name}, género ${item.genre}, precio ${item.price} pesos`}
      >
        <ItemCard
          item={item}
          saved={saved}
          onToggleSave={onToggleSave}
          compact={compact}
        />
      </Pressable>
    </Animated.View>
  );
});
