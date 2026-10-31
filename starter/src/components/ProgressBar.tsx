// ============================================
// COMPONENT: ProgressBar — Semana 09
// Ancho y color interpolados según la ocupación de la sala
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ProgressBarProps {
  /** Progreso normalizado entre 0 y 1 */
  progress: number;
  /** Título corto de la métrica */
  label: string;
  /** Detalle numérico bajo la barra */
  caption?: string;
}

const TRACK_HEIGHT = 10;
const ANIMATION_DURATION = 900;

export function ProgressBar({
  progress,
  label,
  caption,
}: ProgressBarProps): React.JSX.Element {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const animation = Animated.timing(animatedProgress, {
      toValue: clampedProgress,
      duration: ANIMATION_DURATION,
      // El ancho y el color no son propiedades nativas: deben animarse en JS.
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [animatedProgress, clampedProgress]);

  const width = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth],
    extrapolate: 'clamp',
  });

  const backgroundColor = animatedProgress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [COLORS.success, '#facc15', COLORS.error],
    extrapolate: 'clamp',
  });

  const percent = Math.round(clampedProgress * 100);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <View
        style={styles.track}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <Animated.View
          style={[styles.fill, { width, backgroundColor }]}
        />
      </View>

      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  percent: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  caption: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
});
