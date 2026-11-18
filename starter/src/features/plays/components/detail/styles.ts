// ===== SEMANA 03 · INICIO =====
/**
 * Estilos compartidos de la ficha de obra.
 *
 * La pantalla se dividió en componentes (`DetailHero`, `DetailMetaGrid`, …)
 * para que ninguna supere las 300 líneas. El StyleSheet vive aquí porque las
 * piezas comparten la tarjeta de sección y los espaciados de la ficha.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../../../../theme';

export const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  notFoundTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SIZES.detailContentBottomPadding,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SIZES.detailImageHeight,
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 9, 12, 0.4)',
  },
  badgesRow: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.base,
    right: SPACING.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // ===== SEMANA 04 · INICIO =====
  savePill: {
    position: 'absolute',
    right: SPACING.base,
    bottom: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savePillActive: {
    borderColor: COLORS.accent,
  },
  savePillPressed: {
    opacity: 0.7,
  },
  savePillText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  savePillTextActive: {
    color: COLORS.accent,
  },
  // ===== SEMANA 04 · FIN =====
  // ===== SEMANA 11 · INICIO =====
  localPosterBadge: {
    position: 'absolute',
    left: SPACING.base,
    bottom: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  localPosterBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  // ===== SEMANA 11 · FIN =====
  genreBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  ratingBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  ratingBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  body: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textSecondary,
    marginTop: -SPACING.xs,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  metaCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: SIZES.iconMd,
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxs,
  },
  metaValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    gap: SPACING.md,
  },
  availabilityIcon: {
    fontSize: SIZES.iconLg,
  },
  availabilityTextWrapper: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  availabilitySubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  // ===== SEMANA 12 · INICIO =====
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  reminderBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  reminderDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  reminderDisabled: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.warning,
  },
  reminderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  reminderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  reminderActionPressed: {
    opacity: 0.75,
  },
  reminderActionDisabled: {
    opacity: 0.5,
  },
  reminderActionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  deletePlayButton: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deletePlayButtonPressed: {
    opacity: 0.7,
  },
  deletePlayText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
  // ===== SEMANA 12 · FIN =====
  synopsisText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  specLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceColumn: {
    flexDirection: 'column',
  },
  priceCaption: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  priceNumber: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  priceCurrency: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  bookButtonText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});
// ===== SEMANA 03 · FIN =====
