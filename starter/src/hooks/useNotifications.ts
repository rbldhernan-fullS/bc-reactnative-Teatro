// ===== SEMANA 01 · INICIO =====
import { useCallback } from 'react';
// ===== SEMANA 01 · FIN =====

// ===== SEMANA 12 · INICIO =====
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

  refreshPermission: () => Promise<void>;

  registerForPush: () => Promise<{ token: string | null; error: string | null }>;

  openSystemSettings: () => Promise<void>;

  scheduleCartelera: (
    play: Item,
    change: 'created' | 'updated'
  ) => Promise<ScheduleOutcome>;

  scheduleReminder: (
    play: Item,
    kind: ReminderKind
  ) => Promise<ScheduleOutcome>;

  cancelReminder: (itemId: string) => Promise<boolean>;

  cancelAllReminders: () => Promise<number>;

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
// ===== SEMANA 12 · FIN =====
