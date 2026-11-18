// ===== SEMANA 07 · INICIO =====
/**
 * Estilos compartidos de la pantalla de Ajustes.
 *
 * La pantalla se dividió en secciones (`components/`) para que ninguna supere
 * las 300 líneas. Los estilos se quedan en un solo módulo porque las secciones
 * reutilizan las mismas filas, tarjetas y píldoras de estado: duplicarlos en
 * cada componente haría que un cambio visual hubiera que aplicarlo cuatro
 * veces.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  sectionHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  rowDesc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xxs,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  preferenceBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  segmentText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  resetButtonPressed: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  secureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  secureIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureHeaderText: {
    flex: 1,
  },
  statusBadge: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  statusSaved: {
    color: COLORS.success,
    backgroundColor: COLORS.successSoft,
  },
  statusEmpty: {
    color: COLORS.textMuted,
    backgroundColor: COLORS.surfaceAlt,
  },
  statusDenied: {
    color: COLORS.error,
    backgroundColor: COLORS.errorSoft,
  },
  maskedBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xxs,
  },
  maskedLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  maskedValue: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  secureActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  actionPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionDanger: {
    borderColor: COLORS.error,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  actionTextPrimary: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  actionTextDanger: {
    color: COLORS.error,
  },
  secureNote: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  // La ficha de la tarjeta de estado (icono, texto y píldora) se comparte entre
  // Seguridad y Notificaciones.
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  infoLine: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  infoStrong: {
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  nativeNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.sm,
  },
  nativeNoticeText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  // ===== SEMANA 12 · INICIO =====
  notificationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  tokenBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  tokenValue: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
    letterSpacing: 0.5,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  tokenFallback: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  tokenMeta: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  notificationError: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  reminderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  cancelAll: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.error,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  reminderDate: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xxs,
  },
  reminderCancelPressed: {
    opacity: 0.6,
  },
  // ===== SEMANA 12 · FIN =====
});
// ===== SEMANA 07 · FIN =====
