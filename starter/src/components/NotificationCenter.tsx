// ===== SEMANA 01 · INICIO =====
import { useEffect } from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 12 · INICIO =====
import * as Notifications from 'expo-notifications';

import {
  configureNotificationChannel,
  getScheduledNotificationIds,
  parseNotificationPayload,
} from '../services/notifications';
import { navigateFromNotification } from '../navigation/navigationRef';
import { useNotificationStore } from '../stores/notificationStore';
import { useReminderStore } from '../stores/reminderStore';

async function reconcileReminders(): Promise<void> {
  const scheduledIds = await getScheduledNotificationIds();

  if (scheduledIds) {
    useReminderStore.getState().pruneReminders(scheduledIds);
  }
}

export function NotificationCenter(): null {
  useEffect(() => {
    void configureNotificationChannel();
    void useNotificationStore.getState().refreshPermission();
    void reconcileReminders();
  }, []);

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

        await Notifications.clearLastNotificationResponseAsync();
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return null;
}
// ===== SEMANA 12 · FIN =====
