// ===== SEMANA 10 · INICIO =====
import { useLayoutEffect, useRef } from 'react';
import { View } from 'react-native';
import { SPACING } from '../theme';
import type { SeatMapSurfaceProps } from './SeatMapSurface';

export function SeatMapSurface({
  children,
  width,
  height,
  zoom,
}: SeatMapSurfaceProps): React.JSX.Element {
  const viewport = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = viewport.current;
    if (node) node.scrollLeft = (node.scrollWidth - node.clientWidth) / 2;
  }, []);
  return (
    <div
      ref={viewport}
      style={{ flex: 1, alignSelf: 'stretch', minHeight: 0, overflow: 'auto' }}
      aria-label="Mapa desplazable de butacas"
    >
      <div style={{ minWidth: '100%', width: 'max-content', zoom }}>
        <View
          style={{
            width,
            minHeight: height,
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: SPACING.sm,
          }}
        >
          {children}
        </View>
      </div>
    </div>
  );
}
// ===== SEMANA 10 · FIN =====
