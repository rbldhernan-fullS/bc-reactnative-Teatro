// ===== SEMANA 04 · INICIO =====
/**
 * Estilos compartidos de la lista de guardados.
 *
 * La pantalla se dividió en `SavedCard` y `SavedEmptyState` para que ninguna
 * supere las 300 líneas. El StyleSheet vive aquí porque la tarjeta y el vacío
 * comparten la paleta y los radios del resto de la app.
 */
import { StyleSheet } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  headerTextBlock: {
    flex: 1,
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
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  offlineBanner: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceWarm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  offlineText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
  },
  listContent: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.md,
  },
  card: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardPressTarget: {
    flexDirection: 'row',
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.9,
  },
  cardImage: {
    width: SIZES.favoriteImageWidth,
    height: SIZES.favoriteImageHeight,
    backgroundColor: COLORS.borderLight,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  genreBadge: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  genreBadgeText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  removeButtonSlot: {
    width: SIZES.iconMd + SPACING.xxs * 2,
  },
  removeButtonPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.7,
  },
  itemName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  metaDot: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  ratingText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  priceText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  emptyButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentDim,
  },
  emptyButtonPressed: {
    opacity: 0.7,
  },
  emptyButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});
// ===== SEMANA 04 · FIN =====
