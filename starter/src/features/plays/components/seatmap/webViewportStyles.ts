// ===== SEMANA 10 · INICIO =====
/**
 * Estilos del viewport web del mapa de butacas.
 *
 * Compartidos por `SeatMapViewport.web` y `ZoomControls`: ambos pintan sobre el
 * mismo recuadro y usan la misma paleta.
 */
import { StyleSheet } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../../../theme';

export const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  controls: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  zoomRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.overlay,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.overlay,
  },
  controlPressed: {
    opacity: 0.7,
  },
  controlText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  hint: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
});
// ===== SEMANA 10 · FIN =====
