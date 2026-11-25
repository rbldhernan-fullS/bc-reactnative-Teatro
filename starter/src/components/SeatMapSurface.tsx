// ===== SEMANA 10 · INICIO =====
import type { ComponentProps, ReactNode } from 'react';
import { GestureDetector, type ComposedGesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export interface SeatMapSurfaceProps {
  children: ReactNode;
  gesture: ComposedGesture;
  width: number;
  height: number;
  zoom: number;
  mapStyle: ComponentProps<typeof Animated.View>['style'];
}

export function SeatMapSurface({
  children,
  gesture,
  width,
  height,
  mapStyle,
}: SeatMapSurfaceProps): React.JSX.Element {
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width, height }, mapStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
// ===== SEMANA 10 · FIN =====
