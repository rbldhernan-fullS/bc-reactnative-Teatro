// ===== SEMANA 09 · INICIO =====
import React, { useEffect, useRef } from 'react';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const ENTRANCE_STAGGER_MS = 80;
const ENTRANCE_DURATION_MS = 420;

interface StaggeredItemProps {
  index: number;
  children: React.ReactNode;
}

/**
 * Envoltorio de entrada escalonada del listado.
 *
 * Solo anima la primera vez que se monta: al hacer scroll o al filtrar, las
 * tarjetas ya visibles no vuelven a aparecer desde abajo.
 */
export function StaggeredItem({ index, children }: StaggeredItemProps): React.JSX.Element {
  const progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    progress.value = withDelay(
      index * ENTRANCE_STAGGER_MS,
      withTiming(1, { duration: ENTRANCE_DURATION_MS }),
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [24, 0]),
      },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
// ===== SEMANA 10 · FIN =====
