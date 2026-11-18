// ===== SEMANA 09 · INICIO =====
/**
 * Animación de layout compartida por la cartelera.
 *
 * En Android hay que habilitar LayoutAnimation de forma explícita; en el resto
 * de plataformas `configureNext` funciona sin preparación.
 */
import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function animateListLayout(): void {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}
// ===== SEMANA 09 · FIN =====
