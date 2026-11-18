// ===== SEMANA 10 · INICIO =====
/**
 * Estilos compartidos del mapa de butacas.
 *
 * La pantalla se dividió en componentes (`Stage`, `SeatLegend`, `Seat`,
 * `BookingSummary`, `SeatMapStates`) para que ninguna supere las 300 líneas.
 * El StyleSheet vive aquí porque todos son partes de la misma sala.
 */
import { StyleSheet } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../../../theme';
import { ROW_HEIGHT, ROW_LABEL_WIDTH, SEAT_GAP, SEAT_SIZE } from './layout';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.xxs,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  availability: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  legendAvailable: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
  },
  legendSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accentHover,
  },
  legendOccupied: {
    backgroundColor: COLORS.borderLight,
    borderColor: COLORS.border,
  },
  legendText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  stageLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  rowLabel: {
    width: ROW_LABEL_WIDTH,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textMuted,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SEAT_GAP,
  },
  aisleSeat: {
    marginLeft: SPACING.md,
  },
  seatOccupied: {
    backgroundColor: COLORS.borderLight,
    borderColor: COLORS.border,
    opacity: 0.45,
  },
  seatSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accentHover,
  },
  seatNumber: {
    fontSize: 8,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  seatNumberOccupied: {
    color: COLORS.textMuted,
  },
  seatNumberSelected: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  summary: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  summaryTotal: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  summaryCurrency: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
});
// ===== SEMANA 10 · FIN =====
