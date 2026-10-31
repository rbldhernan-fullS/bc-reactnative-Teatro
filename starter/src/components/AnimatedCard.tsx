// ============================================
// COMPONENT: AnimatedCard — Semana 09
// Envoltorio táctil de ItemCard con feedback de escala (Animated.spring)
// ============================================

import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
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

const PRESS_IN_SPRING = {
  toValue: SIZES.pressedScale,
  tension: 400,
  friction: 28,
  useNativeDriver: true,
} as const;

const PRESS_OUT_SPRING = {
  toValue: 1,
  tension: 200,
  friction: 8,
  useNativeDriver: true,
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
