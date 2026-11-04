// ===== SEMANA 01 · INICIO =====
import { Platform } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 05 · INICIO =====
import Constants from 'expo-constants';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 12 · INICIO =====
import * as Notifications from 'expo-notifications';

import type {
  Item,
  NotificationKind,
  NotificationPayload,
  NotificationScreen,
  ReminderKind,
  ScheduleOutcome,
} from '../types';

export const TEATRO_NOTIFICATION_CHANNEL = 'teatro-funciones';

export const SHOW_REMINDER_OFFSET_MS = 2 * 60 * 60 * 1000;

export const DEMO_REMINDER_SECONDS = 10;

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

export async function getNotificationPermission(): Promise<NotificationPermissionSnapshot> {
  const response = await Notifications.getPermissionsAsync();
  return toPermissionSnapshot(response);
}

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

export async function requestExpoPushToken(
  projectId: string
): Promise<string> {
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

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
  } catch {}
}

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

export function getShowReminderDate(play: Item): Date | null {
  const showDate = getShowDate(play);

  if (!showDate) {
    return null;
  }

  return new Date(showDate.getTime() - SHOW_REMINDER_OFFSET_MS);
}

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

export async function getScheduledNotificationIds(): Promise<string[] | null> {
  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    return scheduled.map((notification) => notification.identifier);
  } catch {
    return null;
  }
}

function isNotificationScreen(value: unknown): value is NotificationScreen {
  return (
    value === 'HomeDetail' || value === 'HomeList' || value === 'Settings'
  );
}

function isNotificationKind(value: unknown): value is NotificationKind {
  return value === 'event' || value === 'reminder' || value === 'test';
}

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

export function getNotificationErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'No se pudo completar la operación con notificaciones.';
}
// ===== SEMANA 12 · FIN =====
