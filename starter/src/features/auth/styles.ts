// ===== SEMANA 08 · INICIO =====
/**
 * Estilos de las pantallas de acceso.
 *
 * `Login`, `Register` y `Profile` comparten la misma maqueta (cabecera, tarjeta
 * y pie) pero con bloques distintos, así que cada una conserva su propio
 * StyleSheet en este módulo en lugar de repetirlo dentro de la pantalla. Así
 * ninguna pantalla supera las 300 líneas y los tres formularios siguen el
 * mismo ritmo vertical.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export const loginStyles = StyleSheet.create({
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
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  logoEmoji: {
    fontSize: TYPOGRAPHY.size.display,
  },
  clubName: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    paddingHorizontal: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
    minHeight: 48,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.accentHover,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  demoCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  demoTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  demoText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  demoStrong: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  demoButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  demoButtonPressed: {
    backgroundColor: COLORS.surface,
  },
  demoButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  linkHighlight: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  securityText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    textAlign: 'center',
  },
});

export const registerStyles = StyleSheet.create({
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
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: SPACING.xxs,
  },
  clubName: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  rowFields: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  halfField: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
    minHeight: 48,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.accentHover,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  infoStrong: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  linkHighlight: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});

export const profileStyles = StyleSheet.create({
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
    gap: SPACING.base,
  },
  identityCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.xxs,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  clubBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  membershipPill: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  membershipText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    flexShrink: 1,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  savedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: SPACING.md,
  },
  savedButtonPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.9,
  },
  savedButtonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  securityTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  securityText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: SPACING.md,
  },
  logoutButtonPressed: {
    backgroundColor: COLORS.dangerSoft,
    opacity: 0.9,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.error,
  },
});
// ===== SEMANA 08 · FIN =====
