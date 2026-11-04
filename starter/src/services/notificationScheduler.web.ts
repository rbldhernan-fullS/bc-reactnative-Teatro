// ===== SEMANA 12 · INICIO =====
import type {
  Notification,
  NotificationPermissionsStatus,
  NotificationResponse,
} from 'expo-notifications';

export type {
  Notification,
  NotificationPermissionsStatus,
  NotificationResponse,
};

export const AndroidImportance = {
  MIN: 1,
  LOW: 2,
  DEFAULT: 3,
  HIGH: 4,
  MAX: 5,
} as const;

export const SchedulableTriggerInputTypes = {
  CALENDAR: 'calendar',
  DAILY: 'daily',
  DATE: 'date',
  MONTHLY: 'monthly',
  TIME_INTERVAL: 'timeInterval',
  WEEKLY: 'weekly',
  YEARLY: 'yearly',
} as const;

interface Subscription {
  remove: () => void;
}

const subscription: Subscription = {
  remove: () => undefined,
};

const deniedPermission = {
  status: 'denied',
  granted: false,
  canAskAgain: false,
  expires: 'never',
  ios: undefined,
  android: undefined,
} as unknown as NotificationPermissionsStatus;

export const webNotSupportedMessage =
  'Las notificaciones no están disponibles en la versión web.';

export function setNotificationHandler(): void {}

export async function getPermissionsAsync(): Promise<NotificationPermissionsStatus> {
  return deniedPermission;
}

export async function requestPermissionsAsync(): Promise<NotificationPermissionsStatus> {
  return deniedPermission;
}

export async function getExpoPushTokenAsync(): Promise<{ data: string }> {
  throw new Error(webNotSupportedMessage);
}

export async function setNotificationChannelAsync(): Promise<null> {
  return null;
}

export async function scheduleNotificationAsync(): Promise<string> {
  throw new Error(webNotSupportedMessage);
}

export async function cancelScheduledNotificationAsync(): Promise<void> {}

export async function getAllScheduledNotificationsAsync(): Promise<
  Notification[]
> {
  return [];
}

export function addNotificationReceivedListener(): Subscription {
  return subscription;
}

export function addNotificationResponseReceivedListener(): Subscription {
  return subscription;
}

export async function getLastNotificationResponseAsync(): Promise<NotificationResponse | null> {
  return null;
}

export async function clearLastNotificationResponseAsync(): Promise<void> {}
// ===== SEMANA 12 · FIN =====
