// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ProgressBarProps {
  progress: number;
  label: string;
  caption?: string;
}

const TRACK_HEIGHT = 10;
const ANIMATION_DURATION = 900;

export function ProgressBar({
  progress,
  label,
  caption,
}: ProgressBarProps): React.JSX.Element {
  // ===== SEMANA 10 · INICIO =====
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const progressValue = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  // ===== SEMANA 10 · FIN =====

  useEffect(() => {
    progressValue.value = withTiming(clampedProgress, {
      duration: ANIMATION_DURATION,
    });
  }, [clampedProgress, progressValue]);

  // ===== SEMANA 10 · INICIO =====
  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * progressValue.value,
    backgroundColor: interpolateColor(
      progressValue.value,
      [0, 0.6, 1],
      [COLORS.success, '#facc15', COLORS.error]
    ),
  }));
  // ===== SEMANA 10 · FIN =====

  const percent = Math.round(clampedProgress * 100);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <View
        style={styles.track}
        onLayout={(event) => {
          trackWidth.value = event.nativeEvent.layout.width;
        }}
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <Animated.View style={[styles.fill, fillStyle]} />
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
// ===== SEMANA 09 · FIN =====
