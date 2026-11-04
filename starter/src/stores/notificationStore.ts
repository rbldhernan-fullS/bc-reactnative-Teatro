// ===== SEMANA 01 · INICIO =====
import { Linking } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { isDevice } from '../services/deviceInfo';
import * as Notifications from '../services/notificationScheduler';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 12 · INICIO =====
import {
  ensureNotificationPermission,
  getEasProjectId,
  getNotificationErrorMessage,
  getNotificationPermission,
  parseNotificationPayload,
  requestExpoPushToken,
  type NotificationPermissionState,
} from '../services/notifications';
import { useReminderStore } from './reminderStore';
import type { NotificationPayload } from '../types';

export interface ReceivedNotification {
  title: string;
  body: string;
  receivedAt: number;
  payload: NotificationPayload | null;
}

export interface RegisterPushResult {
  token: string | null;
  error: string | null;
}

export interface NotificationState {
  permission: NotificationPermissionState;
  canAskAgain: boolean;
  pushToken: string | null;
  projectId: string | null;
  isPhysicalDevice: boolean;
  isRegistering: boolean;
  error: string | null;
  lastReceived: ReceivedNotification | null;

  refreshPermission: () => Promise<void>;

  registerForPush: () => Promise<RegisterPushResult>;

  openSystemSettings: () => Promise<void>;

  markReceived: (notification: Notifications.Notification) => void;

  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  permission: 'undetermined',
  canAskAgain: true,
  pushToken: null,
  projectId: getEasProjectId(),
  isPhysicalDevice: isDevice,
  isRegistering: false,
  error: null,
  lastReceived: null,

  refreshPermission: async (): Promise<void> => {
    try {
      const snapshot = await getNotificationPermission();
      set({
        permission: snapshot.status,
        canAskAgain: snapshot.canAskAgain,
      });
    } catch (error) {
      set({ error: getNotificationErrorMessage(error) });
    }
  },

  registerForPush: async (): Promise<RegisterPushResult> => {
    set({ isRegistering: true, error: null });

    if (!isDevice) {
      const message =
        'Los push tokens solo funcionan en dispositivos físicos. En el emulador puedes probar las notificaciones locales.';
      set({ isRegistering: false, error: message });
      return { token: null, error: message };
    }

    try {
      const snapshot = await ensureNotificationPermission(true);

      set({
        permission: snapshot.status,
        canAskAgain: snapshot.canAskAgain,
      });

      if (!snapshot.granted) {
        const message = snapshot.canAskAgain
          ? 'No se concedió el permiso de notificaciones.'
          : 'Las notificaciones están bloqueadas. Actívalas desde los ajustes del sistema.';

        set({ isRegistering: false, error: message });
        return { token: null, error: message };
      }

      const projectId = getEasProjectId();

      if (!projectId) {
        const message =
          'Falta el projectId de EAS. Ejecuta `npx eas init` o agrega `expo.extra.eas.projectId` en app.json para obtener el token.';

        set({ isRegistering: false, projectId: null, error: message });
        return { token: null, error: message };
      }

      const token = await requestExpoPushToken(projectId);

      set({
        pushToken: token,
        projectId,
        isRegistering: false,
        error: null,
      });

      return { token, error: null };
    } catch (error) {
      const message = getNotificationErrorMessage(error);
      set({ isRegistering: false, error: message });
      return { token: null, error: message };
    }
  },

  openSystemSettings: async (): Promise<void> => {
    try {
      await Linking.openSettings();
    } catch {}
  },

  markReceived: (notification: Notifications.Notification): void => {
    const content = notification.request.content;
    const payload = parseNotificationPayload(content.data);

    if (payload?.kind === 'reminder' && payload.itemId) {
      const reminder = useReminderStore.getState().reminders[payload.itemId];

      if (reminder?.notificationId === notification.request.identifier) {
        useReminderStore.getState().removeReminder(payload.itemId);
      }
    }

    set({
      lastReceived: {
        title: content.title ?? 'Notificación del Teatro Colón',
        body: content.body ?? '',
        receivedAt: Date.now(),
        payload,
      },
    });
  },

  clearError: (): void => {
    set({ error: null });
  },
}));
// ===== SEMANA 12 · FIN =====
