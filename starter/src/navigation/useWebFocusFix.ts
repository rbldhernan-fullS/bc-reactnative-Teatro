// ===== SEMANA 03 · INICIO =====
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { navigationRef } from './navigationRef';

function blurFocusedElement(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

/**
 * Evita el aviso `Blocked aria-hidden on an element because its descendant
 * retained focus` (E‑03).
 *
 * React Navigation oculta la pantalla saliente con `aria-hidden`, pero si un
 * `<button>` de esa pantalla conserva el foco, el navegador bloquea el cambio
 * y lo reporta en consola. Al cambiar el estado de navegación se retira el foco.
 *
 * En nativo es un no-op: no hay `document` ni `aria-hidden`.
 */
export function useWebFocusFix(): void {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    return navigationRef.addListener('state', blurFocusedElement);
  }, []);
}
// ===== SEMANA 03 · FIN =====
