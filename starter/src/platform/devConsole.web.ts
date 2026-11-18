// ===== SEMANA 12 · INICIO =====
/**
 * Filtro de consola **solo en desarrollo y solo en web**.
 *
 * `react-native-web` mantiene su propio registro de toques para el sistema de
 * responders. Cuando el navegador emula eventos táctiles (equipos con pantalla
 * táctil, panel táctil o la emulación de dispositivo de DevTools) puede llegar
 * un `touchend` cuyo `touchstart` ocurrió antes de que el primer `Pressable`
 * montara, y entonces la librería avisa:
 *
 *   Cannot record touch end without a touch start.
 *
 * No es un fallo de la app ni de nuestros gestos: sale de
 * `react-native-web/dist/modules/useResponderEvents/ResponderTouchHistoryStore`
 * y el diagnóstico con `maxTouchPoints=1` + `pointer: coarse` confirmó que los
 * toques vienen del sistema operativo, no de `SwipeableCard`. Silenciamos solo
 * ese texto; cualquier otro aviso sigue llegando a la consola.
 *
 * TODO(week-12): revisar al actualizar react-native-web (hoy 0.21.4). Si la
 * librería deja de avisar de los `touchend` huérfanos, borrar este archivo y su
 * import en `App.tsx`.
 */
const RNW_TOUCH_WARNING = 'Cannot record touch end without a touch start';

if (__DEV__) {
  const host = globalThis as unknown as Record<string, unknown>;

  // Hot reload puede reevaluar este módulo: el parche se instala una sola vez.
  if (!host.__rnwTouchWarningFiltered) {
    host.__rnwTouchWarningFiltered = true;

    const originalWarn = console.warn.bind(console);

    console.warn = (...args: unknown[]): void => {
      const [first] = args;

      if (typeof first === 'string' && first.includes(RNW_TOUCH_WARNING)) {
        return;
      }

      originalWarn(...args);
    };
  }
}
// ===== SEMANA 12 · FIN =====
