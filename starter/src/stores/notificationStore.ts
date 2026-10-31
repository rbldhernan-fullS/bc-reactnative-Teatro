// ============================================
// STORE: notificationStore — Semana 12
// Estado compartido por Ajustes y el detalle: permiso, Expo Push Token,
// dispositivo físico y última notificación recibida en primer plano.
// ============================================

import { Linking } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

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

  /** Relee el permiso sin abrir diálogos del sistema */
  refreshPermission: () => Promise<void>;

  /** Pide permiso y obtiene el Expo Push Token del proyecto EAS */
  registerForPush: () => Promise<RegisterPushResult>;

  /** Abre los ajustes de la app en el sistema operativo */
  openSystemSettings: () => Promise<void>;

  /** Guarda la última notificación recibida en primer plano */
  markReceived: (notification: Notifications.Notification) => void;

  /** Limpia el mensaje de error de la sección de notificaciones */
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  permission: 'undetermined',
  canAskAgain: true,
  pushToken: null,
  projectId: getEasProjectId(),
  isPhysicalDevice: Device.isDevice,
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

    if (!Device.isDevice) {
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
    } catch {
      // Algunos emuladores no exponen la pantalla de ajustes de la app.
    }
  },

  markReceived: (notification: Notifications.Notification): void => {
    const content = notification.request.content;
    const payload = parseNotificationPayload(content.data);

    // Si el aviso era un recordatorio de esta obra, el registro local ya
    // cumplió su función. Se compara el id para no borrar uno más reciente.
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
