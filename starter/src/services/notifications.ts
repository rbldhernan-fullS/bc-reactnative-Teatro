// ============================================
// SERVICE: notifications — Semana 12
// Permisos, Expo Push Token y notificaciones locales del Teatro Colón.
// Todo el acceso a expo-notifications vive aquí: las pantallas y los stores
// solo consumen funciones tipadas.
// ============================================

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import type {
  Item,
  NotificationKind,
  NotificationPayload,
  NotificationScreen,
  ReminderKind,
  ScheduleOutcome,
} from '../types';

/** Canal de Android para avisos de funciones. */
export const TEATRO_NOTIFICATION_CHANNEL = 'teatro-funciones';

/** Los recordatorios de función se programan 2 horas antes. */
export const SHOW_REMINDER_OFFSET_MS = 2 * 60 * 60 * 1000;

/** Segundos de la prueba rápida solicitada en la rúbrica. */
export const DEMO_REMINDER_SECONDS = 10;

/** Margen mínimo para que un trigger con fecha siga siendo útil. */
const MIN_TRIGGER_LEAD_MS = 5 * 1000;

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

// ============================================
// 1. PERMISOS
// ============================================

export type NotificationPermissionState =
  | 'granted'
  | 'denied'
  | 'undetermined';

export interface NotificationPermissionSnapshot {
  granted: boolean;
  canAskAgain: boolean;
  status: NotificationPermissionState;
}

function normalizePermissionStatus(value: string): NotificationPermissionState {
  if (value === 'granted') {
    return 'granted';
  }

  if (value === 'denied') {
    return 'denied';
  }

  return 'undetermined';
}

function toPermissionSnapshot(
  response: Notifications.NotificationPermissionsStatus
): NotificationPermissionSnapshot {
  return {
    granted: response.granted,
    canAskAgain: response.canAskAgain,
    status: normalizePermissionStatus(response.status),
  };
}

/** Consulta el permiso sin mostrar ningún diálogo del sistema. */
export async function getNotificationPermission(): Promise<NotificationPermissionSnapshot> {
  const response = await Notifications.getPermissionsAsync();
  return toPermissionSnapshot(response);
}

/**
 * Consulta el permiso y, si `request` es `true`, abre el diálogo del sistema.
 * Con `request: false` nunca interrumpe al socio (útil al publicar una obra).
 */
export async function ensureNotificationPermission(
  request: boolean
): Promise<NotificationPermissionSnapshot> {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted || !request) {
    return toPermissionSnapshot(current);
  }

  const requested = await Notifications.requestPermissionsAsync();
  return toPermissionSnapshot(requested);
}

// ============================================
// 2. EXPO PUSH TOKEN
// ============================================

/**
 * El `projectId` se lee de la configuración de EAS. Si falta, la app muestra
 * un aviso visible en Ajustes en lugar de intentar un token que fallará.
 */
export function getEasProjectId(): string | null {
  const extra = Constants.expoConfig?.extra;
  const easExtra =
    extra && typeof extra === 'object'
      ? (extra as { eas?: { projectId?: unknown } }).eas
      : undefined;

  const fromExtra = easExtra?.projectId;
  const fromEasConfig = Constants.easConfig?.projectId;

  if (typeof fromExtra === 'string' && fromExtra.trim().length > 0) {
    return fromExtra.trim();
  }

  if (typeof fromEasConfig === 'string' && fromEasConfig.trim().length > 0) {
    return fromEasConfig.trim();
  }

  return null;
}

/** Obtiene el token que identifica a este dispositivo ante Expo Push API. */
export async function requestExpoPushToken(
  projectId: string
): Promise<string> {
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

// ============================================
// 3. CANAL DE ANDROID
// ============================================

/**
 * Android 8+ exige un canal antes de programar la primera notificación.
 * Se llama al arrancar la app y es idempotente.
 */
export async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(
      TEATRO_NOTIFICATION_CHANNEL,
      {
        name: 'Funciones del Teatro Colón',
        description: 'Recordatorios y novedades de la cartelera.',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#d4a24c',
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      }
    );
  } catch {
    // Sin canal Android usa el canal por defecto: no es un error bloqueante.
  }
}

// ============================================
// 4. FECHAS DE LA FUNCIÓN
// ============================================

/** Convierte `date` (YYYY-MM-DD) y `time` (HH:mm) en una fecha local. */
export function getShowDate(play: Item): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(play.date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(play.time);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;
  const showDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
    0
  );

  return Number.isNaN(showDate.getTime()) ? null : showDate;
}

/** Momento exacto en el que debe sonar el recordatorio (2 h antes). */
export function getShowReminderDate(play: Item): Date | null {
  const showDate = getShowDate(play);

  if (!showDate) {
    return null;
  }

  return new Date(showDate.getTime() - SHOW_REMINDER_OFFSET_MS);
}

/** Formato corto en español, sin depender de datos regionales de Intl. */
export function formatScheduleDate(timestamp: number): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'fecha inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_ES[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} · ${hours}:${minutes}`;
}

// ============================================
// 5. PROGRAMACIÓN
// ============================================

function buildPayload(
  play: Item,
  kind: NotificationKind
): NotificationPayload {
  return {
    screen: 'HomeDetail',
    kind,
    itemId: play.id,
    name: play.name,
  };
}

function immediateTrigger(): Notifications.NotificationTriggerInput {
  return Platform.OS === 'android'
    ? { channelId: TEATRO_NOTIFICATION_CHANNEL }
    : null;
}

function dateTrigger(timestamp: number): Notifications.NotificationTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: timestamp,
    channelId:
      Platform.OS === 'android' ? TEATRO_NOTIFICATION_CHANNEL : undefined,
  };
}

function timeIntervalTrigger(
  seconds: number
): Notifications.NotificationTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    repeats: false,
    channelId:
      Platform.OS === 'android' ? TEATRO_NOTIFICATION_CHANNEL : undefined,
  };
}

async function scheduleLocal(
  title: string,
  body: string,
  payload: NotificationPayload,
  trigger: Notifications.NotificationTriggerInput,
  scheduledAt: number
): Promise<ScheduleOutcome> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data: { ...payload },
      },
      trigger,
    });

    return { ok: true, notificationId, scheduledAt };
  } catch (error) {
    return { ok: false, reason: getNotificationErrorMessage(error) };
  }
}

/**
 * Aviso inmediato de cartelera. No pide permiso: si aún no está concedido,
 * simplemente no se programa para no interrumpir el alta de la obra.
 */
export async function scheduleCarteleraNotification(
  play: Item,
  change: 'created' | 'updated'
): Promise<ScheduleOutcome> {
  const permission = await ensureNotificationPermission(false);

  if (!permission.granted) {
    return {
      ok: false,
      reason:
        'Activa las notificaciones en Ajustes para recibir avisos de la cartelera.',
    };
  }

  const title =
    change === 'created'
      ? '🎭 Nueva obra en cartelera'
      : '📝 Ficha actualizada';

  const body =
    change === 'created'
      ? `"${play.name}" se suma a la temporada en la ${play.hall}.`
      : `Los datos de "${play.name}" cambiaron. Consulta la nueva función.`;

  return scheduleLocal(
    title,
    body,
    buildPayload(play, 'event'),
    immediateTrigger(),
    Date.now()
  );
}

/**
 * Recordatorio de una obra. `show` usa un trigger de fecha 2 h antes de la
 * función; `demo` usa un intervalo de 10 s para comprobar el formato.
 */
export async function scheduleShowReminder(
  play: Item,
  kind: ReminderKind
): Promise<ScheduleOutcome> {
  const permission = await ensureNotificationPermission(true);

  if (!permission.granted) {
    return {
      ok: false,
      reason:
        'Sin permiso de notificaciones no podemos programar el recordatorio. Actívalo en Ajustes del sistema.',
    };
  }

  if (kind === 'demo') {
    const scheduledAt = Date.now() + DEMO_REMINDER_SECONDS * 1000;

    return scheduleLocal(
      '⏱ Prueba de recordatorio',
      `Así llegará el aviso de "${play.name}" 2 horas antes de la función.`,
      buildPayload(play, 'reminder'),
      timeIntervalTrigger(DEMO_REMINDER_SECONDS),
      scheduledAt
    );
  }

  const reminderDate = getShowReminderDate(play);

  if (!reminderDate) {
    return {
      ok: false,
      reason: 'La fecha u hora de la función no es válida.',
    };
  }

  if (reminderDate.getTime() <= Date.now() + MIN_TRIGGER_LEAD_MS) {
    return {
      ok: false,
      reason:
        'La función empieza en menos de 2 horas o su fecha ya pasó. Usa «Probar en 10 s» para ver el formato del aviso.',
    };
  }

  return scheduleLocal(
    '🎭 Tu función comienza en 2 horas',
    `"${play.name}" inicia a las ${play.time} en la ${play.hall}.`,
    buildPayload(play, 'reminder'),
    dateTrigger(reminderDate.getTime()),
    reminderDate.getTime()
  );
}

/** Aviso inmediato de prueba lanzado desde Ajustes. */
export async function scheduleTestNotification(): Promise<ScheduleOutcome> {
  const permission = await ensureNotificationPermission(true);

  if (!permission.granted) {
    return {
      ok: false,
      reason:
        'Sin permiso de notificaciones no podemos mostrar el aviso de prueba.',
    };
  }

  return scheduleLocal(
    '🔔 Notificaciones activas',
    'Recibirás recordatorios de tus funciones en el Teatro Colón.',
    { screen: 'HomeList', kind: 'test' },
    immediateTrigger(),
    Date.now()
  );
}

/** Recordatorio genérico de 10 s para comprobar el flujo desde Ajustes. */
export async function scheduleTestReminder(): Promise<ScheduleOutcome> {
  const permission = await ensureNotificationPermission(true);

  if (!permission.granted) {
    return {
      ok: false,
      reason:
        'Sin permiso de notificaciones no podemos programar el recordatorio de prueba.',
    };
  }

  const scheduledAt = Date.now() + DEMO_REMINDER_SECONDS * 1000;

  return scheduleLocal(
    '⏱ Prueba de recordatorio',
    'Este es el aviso que recibirás 2 horas antes de cada función.',
    { screen: 'HomeList', kind: 'test' },
    timeIntervalTrigger(DEMO_REMINDER_SECONDS),
    scheduledAt
  );
}

/** Cancela un aviso ya programado. Devuelve `false` si el sistema falla. */
export async function cancelScheduledNotification(
  notificationId: string
): Promise<boolean> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return true;
  } catch {
    return false;
  }
}

/** Identificadores que siguen programados en el sistema operativo. */
export async function getScheduledNotificationIds(): Promise<string[] | null> {
  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    return scheduled.map((notification) => notification.identifier);
  } catch {
    return null;
  }
}

// ============================================
// 6. PAYLOAD Y ERRORES
// ============================================

function isNotificationScreen(value: unknown): value is NotificationScreen {
  return (
    value === 'HomeDetail' || value === 'HomeList' || value === 'Settings'
  );
}

function isNotificationKind(value: unknown): value is NotificationKind {
  return value === 'event' || value === 'reminder' || value === 'test';
}

/**
 * Valida el `data` que llega desde el sistema operativo. Puede venir de una
 * notificación local o de un push enviado desde Expo Push Tool.
 */
export function parseNotificationPayload(
  data: unknown
): NotificationPayload | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const screen = record.screen;

  if (!isNotificationScreen(screen)) {
    return null;
  }

  const itemId =
    typeof record.itemId === 'string' ? record.itemId : undefined;
  const name = typeof record.name === 'string' ? record.name : undefined;
  const kind = isNotificationKind(record.kind) ? record.kind : undefined;

  return {
    screen,
    ...(kind ? { kind } : {}),
    ...(itemId ? { itemId } : {}),
    ...(name ? { name } : {}),
  };
}

/** Mensaje legible para cualquier fallo de expo-notifications. */
export function getNotificationErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'No se pudo completar la operación con notificaciones.';
}
