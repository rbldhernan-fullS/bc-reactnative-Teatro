// ===== SEMANA 01 · INICIO =====
/**
 * Estilos compartidos de la cartelera.
 *
 * La pantalla se dividió en componentes (`HomeHeader`, `HomeSearchBar`,
 * `HomeResultsBar`, `HomeOfflineBanner`, `HomeEmptyState`, `HomeFooter`) para
 * que ninguna supere las 300 líneas. El StyleSheet vive aquí porque todas las
 * piezas son partes de la misma pantalla y comparten la paleta y el ritmo
 * vertical del listado.
 */
import { StyleSheet, Platform } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  theaterIcon: {
    fontSize: TYPOGRAPHY.size.xl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  searchSection: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    fontSize: TYPOGRAPHY.size.base,
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + SPACING.xxs,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}),
  },
  clearIconWrapper: {
    padding: SPACING.xs,
  },
  clearIconText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  activeFilterBadge: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceWarm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  offlineIcon: {
    fontSize: TYPOGRAPHY.size.base,
  },
  offlineTextBlock: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.warning,
  },
  offlineSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  offlineRetry: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  offlineRetryPressed: {
    opacity: 0.7,
  },
  offlineRetryText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
  },
  dismissedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dismissedBannerPressed: {
    opacity: 0.75,
  },
  dismissedText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  dismissedAction: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  swipeHint: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  swipeHintText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
  },
  footerHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: TYPOGRAPHY.size.display,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING.lg,
  },
  clearFilterButton: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  clearFilterButtonPressed: {
    opacity: 0.7,
  },
  clearFilterButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});
// ===== SEMANA 01 · FIN =====
