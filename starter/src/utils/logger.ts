// ===== SEMANA 12 · INICIO =====
import { env } from '../config/env';

/**
 * Único punto de salida de logs de la app.
 *
 * Motivo (E‑44 / D‑24): la app se valida en web con la consola abierta. Si cada
 * `catch` de un caso esperado (almacenamiento lleno, ajustes del sistema que no
 * existen en el navegador, caché que no se puede escribir) imprimiera por su
 * cuenta, la consola se llenaría de ruido y taparía los errores de verdad.
 *
 * Reglas:
 * - `debug` es **silencioso por defecto**: solo imprime si se arranca con
 *   `EXPO_PUBLIC_VERBOSE_LOGS=1`. Para los casos esperados.
 * - `info`, `warn` y `error` solo imprimen en desarrollo (`__DEV__`), y se
 *   reservan a anomalías que la persona que depura quiere ver.
 * - Fuera de desarrollo no se imprime nada: los errores reales los muestra la
 *   interfaz (`ScreenState`, `notifyError`), no la consola.
 */

const PREFIX = '[teatro]';

export const logger = {
  /** Caso esperado, sin interés salvo que se pida detalle. */
  debug(...args: unknown[]): void {
    if (!__DEV__ || !env.verboseLogs) {
      return;
    }

    console.debug(PREFIX, ...args);
  },

  info(...args: unknown[]): void {
    if (!__DEV__) {
      return;
    }

    console.info(PREFIX, ...args);
  },

  warn(...args: unknown[]): void {
    if (!__DEV__) {
      return;
    }

    console.warn(PREFIX, ...args);
  },

  error(...args: unknown[]): void {
    if (!__DEV__) {
      return;
    }

    console.error(PREFIX, ...args);
  },
};
// ===== SEMANA 12 · FIN =====
