// ============================================
// COMPONENT: NotificationCenter — Semana 12
// Monta los listeners globales de expo-notifications y reconcilia los
// recordatorios persistidos. No renderiza UI: su único trabajo son los
// efectos con cleanup correcto.
// ============================================

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import {
  configureNotificationChannel,
  getScheduledNotificationIds,
  parseNotificationPayload,
} from '../services/notifications';
import { navigateFromNotification } from '../navigation/navigationRef';
import { useNotificationStore } from '../stores/notificationStore';
import { useReminderStore } from '../stores/reminderStore';

/** Elimina registros locales cuyos avisos ya disparó el sistema. */
async function reconcileReminders(): Promise<void> {
  const scheduledIds = await getScheduledNotificationIds();

  if (scheduledIds) {
    useReminderStore.getState().pruneReminders(scheduledIds);
  }
}

export function NotificationCenter(): null {
  // Arranque: canal de Android, permiso actual y limpieza de registros viejos.
  useEffect(() => {
    void configureNotificationChannel();
    void useNotificationStore.getState().refreshPermission();
    void reconcileReminders();
  }, []);

  // Notificación recibida con la app abierta (foreground).
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        useNotificationStore.getState().markReceived(notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Tap sobre el banner con la app abierta o en segundo plano.
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const payload = parseNotificationPayload(
          response.notification.request.content.data
        );

        navigateFromNotification(payload ?? { screen: 'HomeList' });
      });

    return () => {
      subscription.remove();
    };
  }, []);

  // App cerrada (killed): el tap se recupera al montar la navegación.
  useEffect(() => {
    let active = true;

    void Notifications.getLastNotificationResponseAsync()
      .then(async (response) => {
        if (!active || !response) {
          return;
        }

        const payload = parseNotificationPayload(
          response.notification.request.content.data
        );

        navigateFromNotification(payload ?? { screen: 'HomeList' });

        // Evita repetir la navegación en el siguiente arranque.
        await Notifications.clearLastNotificationResponseAsync();
      })
      .catch(() => {
        // Sin respuesta previa: es el caso normal de un arranque manual.
      });

    return () => {
      active = false;
    };
  }, []);

  return null;
}
