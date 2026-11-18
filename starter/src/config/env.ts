// ===== SEMANA 12 · INICIO =====
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { z } from 'zod';

/**
 * Configuración de entorno validada una sola vez, al arrancar.
 *
 * Reglas:
 * - `EXPO_PUBLIC_API_URL` y `EXPO_PUBLIC_AUTH_URL` son opcionales en
 *   desarrollo: si faltan se deduce el host desde Expo (`hostUri`) para que la
 *   app funcione en el emulador, en el celular de la misma red y en web sin
 *   configurar nada.
 * - Fuera de desarrollo **no hay host de desarrollo**: la API y la
 *   autenticación deben venir declaradas y con `https://`. Si no, la app falla
 *   al arrancar con un mensaje concreto en lugar de apuntar a `localhost`.
 * - `EXPO_PUBLIC_VERBOSE_LOGS=1` activa los `logger.debug` (ver `utils/logger`).
 *   Por defecto los logs de depuración quedan silenciados, para que la consola
 *   del navegador no acumule ruido (E‑44 / D‑24).
 *
 * El resultado se publica como `env`, ya tipado y sin `undefined`: el resto de
 * la app nunca vuelve a leer `process.env`.
 */

const DEFAULT_API_PORT = 3001;
const DEFAULT_AUTH_URL = 'https://dummyjson.com';

/**
 * Host de la API en desarrollo.
 *
 * `Constants.expoConfig?.hostUri` trae algo como `192.168.1.50:8081`: la IP que
 * Expo usa para servir el bundle, que es justo la del equipo donde corre
 * `json-server`. Si no hay `hostUri` (por ejemplo en web o en una build local)
 * caemos en el host por defecto de cada plataforma: `10.0.2.2` es el alias del
 * anfitrión en el emulador de Android.
 */
function resolveDevHost(): string {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

/**
 * URL absoluta normalizada (sin la barra final, para no generar `//plays`).
 * En producción se exige `https://`; en desarrollo se acepta `http://` porque
 * `json-server` corre sin certificado.
 */
function createUrlSchema(variable: string, devFallback: string) {
  return z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : devFallback))
    .pipe(
      z
        .string()
        .url(`${variable} debe ser una URL absoluta, por ejemplo https://api.ejemplo.com.`)
        .refine((value) => __DEV__ || value.startsWith('https://'), {
          message: `${variable} debe usar https:// fuera de desarrollo.`,
        })
        .transform((value) => value.replace(/\/+$/, '')),
    );
}

const envSchema = z.object({
  apiUrl: createUrlSchema(
    'EXPO_PUBLIC_API_URL',
    __DEV__ ? `http://${resolveDevHost()}:${DEFAULT_API_PORT}` : '',
  ),
  authUrl: createUrlSchema('EXPO_PUBLIC_AUTH_URL', DEFAULT_AUTH_URL),
  verboseLogs: z.boolean(),
});

export type AppEnv = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse({
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  authUrl: process.env.EXPO_PUBLIC_AUTH_URL ?? '',
  verboseLogs: process.env.EXPO_PUBLIC_VERBOSE_LOGS === '1',
});

if (!parsedEnv.success) {
  throw new Error(`Configuración de entorno inválida:\n${z.prettifyError(parsedEnv.error)}`);
}

export const env: AppEnv = parsedEnv.data;
// ===== SEMANA 12 · FIN =====
