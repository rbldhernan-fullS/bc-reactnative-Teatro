// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { StyleSheet } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../../../../theme';
import { SWIPE_LABEL_REVEAL, SWIPE_THRESHOLD } from '../../../../utils/swipe';

interface SwipeActionPanelsProps {
  /** Desplazamiento horizontal actual de la tarjeta. */
  translateX: SharedValue<number>;
  saved: boolean;
}

/**
 * Paneles que aparecen **detrás** de la tarjeta al deslizarla.
 *
 * Derecha (`translateX > 0`) descubre el panel rojo de descartar; izquierda
 * (`translateX < 0`) descubre el dorado de guardar. Los estilos de revelado
 * viven aquí para que nativo y web se vean idénticos: la única diferencia entre
 * ambas variantes es cómo se captura el gesto.
 */
export function SwipeActionPanels({
  translateX,
  saved,
}: SwipeActionPanelsProps): React.JSX.Element {
  const dismissPanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SPACING.xl], [0, 1], Extrapolate.CLAMP),
  }));

  const dismissIconStyle = useAnimatedStyle(() => {
    const progress = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP);

    return { transform: [{ scale: 0.8 + progress * 0.35 }] };
  });

  const dismissLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [SWIPE_LABEL_REVEAL, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const savePanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SPACING.xl, 0], [1, 0], Extrapolate.CLAMP),
  }));

  const saveIconStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP,
    );

    return { transform: [{ scale: 0.8 + progress * 0.35 }] };
  });

  const saveLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_LABEL_REVEAL],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <>
      {/* Se descubre al arrastrar hacia la derecha. */}
      <Animated.View
        style={[styles.panel, styles.dismissPanel, dismissPanelStyle]}
        pointerEvents="none"
      >
        <Animated.View style={dismissIconStyle}>
          <Ionicons name="eye-off-outline" size={SIZES.iconMd} color={COLORS.error} />
        </Animated.View>
        <Animated.Text style={[styles.label, styles.dismissLabel, dismissLabelStyle]}>
          Descartar
        </Animated.Text>
      </Animated.View>

      {/* Se descubre al arrastrar hacia la izquierda. */}
      <Animated.View style={[styles.panel, styles.savePanel, savePanelStyle]} pointerEvents="none">
        <Animated.Text style={[styles.label, styles.saveLabel, saveLabelStyle]}>
          {saved ? 'Quitar' : 'Guardar'}
        </Animated.Text>
        <Animated.View style={saveIconStyle}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={SIZES.iconMd}
            color={COLORS.accent}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
}
// ===== SEMANA 10 · FIN =====

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: SPACING.xs,
    bottom: SPACING.xs,
    left: SPACING.base,
    right: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  dismissPanel: {
    justifyContent: 'flex-start',
    backgroundColor: COLORS.errorDim,
    borderColor: COLORS.error,
  },
  savePanel: {
    justifyContent: 'flex-end',
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accent,
  },
  label: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  dismissLabel: {
    color: COLORS.error,
  },
  saveLabel: {
    color: COLORS.accent,
  },
});
