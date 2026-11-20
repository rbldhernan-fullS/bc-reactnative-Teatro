// ===== SEMANA 01 · INICIO =====
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 12 · INICIO =====
import * as Notifications from '../../services/notificationScheduler';

import {
  configureNotificationChannel,
  getScheduledNotificationIds,
  parseNotificationPayload,
} from '../../services/notifications';
import { navigateFromNotification } from '../../navigation/navigationRef';
import { useNotificationStore } from '../../stores/notificationStore';
import { useReminderStore } from '../../stores/reminderStore';
import { logger } from '../../utils/logger';

async function reconcileReminders(): Promise<void> {
  const scheduledIds = await getScheduledNotificationIds();

  if (scheduledIds) {
    useReminderStore.getState().pruneReminders(scheduledIds);
  }
}

export function NotificationCenter(): null {
  const lastHandledResponseId = useRef<string | null>(null);

  /**
   * Una respuesta puede llegar por el listener, por `getLastNotificationResponseAsync`
   * o al volver del background. El identificador de la notificación evita navegar
   * dos veces al mismo destino.
   */
  const handleResponse = useCallback((response: Notifications.NotificationResponse): void => {
    const responseId = response.notification.request.identifier;

    if (lastHandledResponseId.current === responseId) {
      return;
    }

    lastHandledResponseId.current = responseId;

    const payload = parseNotificationPayload(response.notification.request.content.data);

    navigateFromNotification(payload ?? { screen: 'HomeList' });
  }, []);

  useEffect(() => {
    void configureNotificationChannel();
    void useNotificationStore.getState().refreshPermission();
    void reconcileReminders();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      useNotificationStore.getState().markReceived(notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handleResponse(response);
    });

    return () => {
      subscription.remove();
    };
  }, [handleResponse]);

  useEffect(() => {
    let active = true;

    void Notifications.getLastNotificationResponseAsync()
      .then(async (response) => {
        if (!active || !response) {
          return;
        }

        handleResponse(response);

        await Notifications.clearLastNotificationResponseAsync();
      })
      .catch((error: unknown) => {
        logger.warn('No se pudo leer la última notificación', error);
      });

    return () => {
      active = false;
    };
  }, [handleResponse]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }

      void reconcileReminders();
      void Notifications.getLastNotificationResponseAsync()
        .then(async (response) => {
          if (!response) {
            return;
          }

          handleResponse(response);

          await Notifications.clearLastNotificationResponseAsync();
        })
        .catch((error: unknown) => {
          logger.warn('No se pudo reconciliar la notificación pendiente', error);
        });
    });

    return () => {
      subscription.remove();
    };
  }, [handleResponse]);

  return null;
}
// ===== SEMANA 12 · FIN =====
