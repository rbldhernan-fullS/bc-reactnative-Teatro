// ============================================
// HOOK: useNotifications — Semana 12
// Fachada de la Semana 12: expone el estado compartido del store y las
// operaciones de dominio (avisos de cartelera y recordatorios de función).
// ============================================

import { useCallback } from 'react';

import {
  cancelScheduledNotification,
  scheduleCarteleraNotification,
  scheduleShowReminder,
  type NotificationPermissionState,
} from '../services/notifications';
import {
  useNotificationStore,
  type ReceivedNotification,
} from '../stores/notificationStore';
import { useReminderStore } from '../stores/reminderStore';
import type {
  Item,
  ReminderKind,
  ScheduleOutcome,
  ShowReminder,
} from '../types';

export interface UseNotificationsResult {
  permission: NotificationPermissionState;
  canAskAgain: boolean;
  pushToken: string | null;
  projectId: string | null;
  isPhysicalDevice: boolean;
  isRegistering: boolean;
  error: string | null;
  lastReceived: ReceivedNotification | null;
  reminders: Record<string, ShowReminder>;

  /** Relee el permiso del sistema sin abrir diálogos */
  refreshPermission: () => Promise<void>;

  /** Pide permiso y obtiene el Expo Push Token */
  registerForPush: () => Promise<{ token: string | null; error: string | null }>;

  /** Abre los ajustes del sistema para desbloquear el permiso */
  openSystemSettings: () => Promise<void>;

  /** Aviso inmediato al publicar o editar una obra */
  scheduleCartelera: (
    play: Item,
    change: 'created' | 'updated'
  ) => Promise<ScheduleOutcome>;

  /** Programa el recordatorio 2 h antes o la prueba de 10 s */
  scheduleReminder: (
    play: Item,
    kind: ReminderKind
  ) => Promise<ScheduleOutcome>;

  /** Cancela el recordatorio de una obra. `false` si el sistema falla. */
  cancelReminder: (itemId: string) => Promise<boolean>;

  /** Cancela todos los recordatorios y devuelve cuántos había */
  cancelAllReminders: () => Promise<number>;

  /** Limpia el error de la sección de notificaciones */
  clearError: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const permission = useNotificationStore((state) => state.permission);
  const canAskAgain = useNotificationStore((state) => state.canAskAgain);
  const pushToken = useNotificationStore((state) => state.pushToken);
  const projectId = useNotificationStore((state) => state.projectId);
  const isPhysicalDevice = useNotificationStore(
    (state) => state.isPhysicalDevice
  );
  const isRegistering = useNotificationStore((state) => state.isRegistering);
  const error = useNotificationStore((state) => state.error);
  const lastReceived = useNotificationStore((state) => state.lastReceived);
  const refreshPermission = useNotificationStore(
    (state) => state.refreshPermission
  );
  const registerForPush = useNotificationStore((state) => state.registerForPush);
  const openSystemSettings = useNotificationStore(
    (state) => state.openSystemSettings
  );
  const clearError = useNotificationStore((state) => state.clearError);

  const reminders = useReminderStore((state) => state.reminders);
  const saveReminder = useReminderStore((state) => state.saveReminder);

  const scheduleCartelera = useCallback(
    (play: Item, change: 'created' | 'updated'): Promise<ScheduleOutcome> =>
      scheduleCarteleraNotification(play, change),
    []
  );

  const scheduleReminder = useCallback(
    async (play: Item, kind: ReminderKind): Promise<ScheduleOutcome> => {
      const previous = useReminderStore.getState().reminders[play.id];
      const outcome = await scheduleShowReminder(play, kind);

      if (outcome.ok) {
        if (
          previous &&
          previous.notificationId !== outcome.notificationId
        ) {
          await cancelScheduledNotification(previous.notificationId);
        }

        saveReminder({
          itemId: play.id,
          playName: play.name,
          notificationId: outcome.notificationId,
          scheduledAt: outcome.scheduledAt,
          kind,
        });
      }

      return outcome;
    },
    [saveReminder]
  );

  const cancelReminder = useCallback(
    async (itemId: string): Promise<boolean> => {
      const current = useReminderStore.getState().reminders[itemId];

      if (!current) {
        return false;
      }

      const cancelled = await cancelScheduledNotification(
        current.notificationId
      );

      useReminderStore.getState().removeReminder(itemId);
      return cancelled;
    },
    []
  );

  const cancelAllReminders = useCallback(async (): Promise<number> => {
    const active = Object.values(useReminderStore.getState().reminders);

    if (active.length === 0) {
      return 0;
    }

    await Promise.all(
      active.map((reminder) =>
        cancelScheduledNotification(reminder.notificationId)
      )
    );

    useReminderStore.getState().clearReminders();
    return active.length;
  }, []);

  return {
    permission,
    canAskAgain,
    pushToken,
    projectId,
    isPhysicalDevice,
    isRegistering,
    error,
    lastReceived,
    reminders,
    refreshPermission,
    registerForPush,
    openSystemSettings,
    scheduleCartelera,
    scheduleReminder,
    cancelReminder,
    cancelAllReminders,
    clearError,
  };
}
