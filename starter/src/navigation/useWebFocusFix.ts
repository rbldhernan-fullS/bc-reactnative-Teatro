// ===== SEMANA 03 · INICIO =====
import { Platform } from 'react-native';

/** Libera el foco cuando la navegación web oculta la pantalla anterior. */
export function blurOnWebNavigation(): void {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }
}
// ===== SEMANA 03 · FIN =====
