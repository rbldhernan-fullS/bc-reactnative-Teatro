// ===== SEMANA 12 · INICIO =====
import React, { useCallback, useEffect } from 'react';
import { Share, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { useNotifications } from '../../../hooks/useNotifications';
import { usePreferences } from '../../../hooks/usePreferences';
import { notify } from '../../../platform/notify';
import {
  scheduleTestNotification,
  scheduleTestReminder,
  type NotificationPermissionState,
} from '../../../services/notifications';
import { ReminderList } from './ReminderList';
import { SecureAction } from './SecureAction';
import { SwitchRow } from './SwitchRow';
import { styles } from '../styles';

const PERMISSION_LABELS: Record<NotificationPermissionState, string> = {
  granted: 'Concedido',
  denied: 'Bloqueado',
  undetermined: 'Sin decidir',
};

/**
 * Sección de notificaciones: permiso, push token de Expo, avisos de prueba y
 * recordatorios programados.
 */
export function NotificationsSection(): React.JSX.Element {
  const {
    permission,
    pushToken,
    projectId,
    isPhysicalDevice,
    isRegistering,
    error: notificationError,
    lastReceived,
    reminders,
    registerForPush,
    refreshPermission,
    openSystemSettings,
    cancelReminder,
    cancelAllReminders,
  } = useNotifications();

  const { remindersEnabled, setRemindersEnabled } = usePreferences();

  useEffect(() => {
    void refreshPermission();
  }, [refreshPermission]);

  const handleRegisterPush = useCallback(async (): Promise<void> => {
    const result = await registerForPush();

    if (result.token) {
      notify(
        'Notificaciones activas',
        'El Expo Push Token ya está disponible. Compártelo o pégalo en https://expo.dev/notifications para enviar un push de prueba.',
      );
      return;
    }

    if (result.error) {
      notify('No se pudo activar el push', result.error);
    }
  }, [registerForPush]);

  const handleShareToken = useCallback(async (): Promise<void> => {
    if (!pushToken) {
      return;
    }

    try {
      await Share.share({
        message: `Expo Push Token del Teatro Colón: ${pushToken}`,
      });
    } catch {
      notify('No se pudo compartir', 'Mantén pulsado el token para copiarlo manualmente.');
    }
  }, [pushToken]);

  const handleTestNotification = useCallback(async (): Promise<void> => {
    const outcome = await scheduleTestNotification();

    if (!outcome.ok) {
      notify('No se pudo enviar el aviso', outcome.reason);
    }
  }, []);

  const handleTestReminder = useCallback(async (): Promise<void> => {
    const outcome = await scheduleTestReminder();

    if (outcome.ok) {
      notify(
        'Prueba programada',
        'El recordatorio llegará en 10 segundos. Mantén la app abierta para verlo en primer plano.',
      );
      return;
    }

    notify('No se pudo programar la prueba', outcome.reason);
  }, []);

  const handleToggleReminders = useCallback(
    async (value: boolean): Promise<void> => {
      setRemindersEnabled(value);

      if (!value) {
        const count = await cancelAllReminders();

        if (count > 0) {
          notify(
            'Recordatorios desactivados',
            `Se cancelaron ${count} aviso(s) programado(s) en el sistema.`,
          );
        }
      }
    },
    [cancelAllReminders, setRemindersEnabled],
  );

  const handleCancelReminder = useCallback(
    async (itemId: string, playName: string): Promise<void> => {
      const cancelled = await cancelReminder(itemId);

      notify(
        cancelled ? 'Recordatorio cancelado' : 'Recordatorio retirado',
        cancelled
          ? `Se canceló el aviso de "${playName}".`
          : 'El aviso ya no estaba programado en el sistema; el registro local quedó limpio.',
      );
    },
    [cancelReminder],
  );

  const handleCancelAll = useCallback(async (): Promise<void> => {
    const count = await cancelAllReminders();

    notify(
      'Recordatorios cancelados',
      count > 0
        ? `Se cancelaron ${count} recordatorio(s) de función.`
        : 'No había recordatorios activos.',
    );
  }, [cancelAllReminders]);

  return (
    <>
      <Text style={styles.sectionTitle}>Notificaciones</Text>
      <Text style={styles.sectionHint}>
        Recordatorios 2 horas antes de cada función y avisos de la cartelera. El token identifica a
        este dispositivo ante Expo.
      </Text>

      <View style={styles.notificationCard}>
        <View style={styles.secureHeader}>
          <View style={styles.secureIcon}>
            <Ionicons name="notifications" size={SIZES.iconMd} color={COLORS.accent} />
          </View>

          <View style={styles.secureHeaderText}>
            <Text style={styles.rowLabel}>Avisos del Teatro Colón</Text>
            <Text style={styles.rowDesc}>
              {isPhysicalDevice
                ? 'Dispositivo físico · push y locales'
                : 'Emulador · solo notificaciones locales'}
            </Text>
          </View>

          <Text
            style={[
              styles.statusBadge,
              permission === 'granted'
                ? styles.statusSaved
                : permission === 'denied'
                  ? styles.statusDenied
                  : styles.statusEmpty,
            ]}
          >
            {PERMISSION_LABELS[permission]}
          </Text>
        </View>

        <SwitchRow
          label="Recordatorios de función"
          description="Habilita el aviso 2 h antes desde el detalle de cada obra."
          value={remindersEnabled}
          onValueChange={(value) => {
            void handleToggleReminders(value);
          }}
        />

        <View style={styles.tokenBox}>
          <Text style={styles.maskedLabel}>Expo Push Token</Text>

          {pushToken ? (
            <Text selectable style={styles.tokenValue}>
              {pushToken}
            </Text>
          ) : (
            <Text style={styles.tokenFallback}>
              {projectId
                ? 'Pulsa «Activar notificaciones» para solicitar el token al servidor de Expo.'
                : 'Falta el projectId de EAS. Ejecuta `npx eas init` o agrega `expo.extra.eas.projectId` en app.json.'}
            </Text>
          )}

          <Text style={styles.tokenMeta}>Proyecto: {projectId ?? 'sin configurar'}</Text>
        </View>

        {!isPhysicalDevice ? (
          <Text style={styles.secureNote}>
            Los push tokens requieren un dispositivo físico con APNs o FCM. En el emulador solo
            funcionan las notificaciones locales.
          </Text>
        ) : null}

        {notificationError ? (
          <Text style={styles.notificationError}>{notificationError}</Text>
        ) : null}

        <View style={styles.secureActions}>
          <SecureAction
            label={pushToken ? 'Actualizar token' : 'Activar notificaciones'}
            icon="notifications-outline"
            onPress={() => {
              void handleRegisterPush();
            }}
            variant="primary"
            disabled={isRegistering}
          />

          {pushToken ? (
            <SecureAction
              label="Compartir token"
              icon="share-outline"
              onPress={() => {
                void handleShareToken();
              }}
            />
          ) : null}

          {permission === 'denied' ? (
            <SecureAction
              label="Abrir ajustes"
              icon="settings-outline"
              onPress={() => {
                void openSystemSettings();
              }}
            />
          ) : null}
        </View>

        <View style={styles.secureActions}>
          <SecureAction
            label="Probar aviso inmediato"
            icon="flash-outline"
            onPress={() => {
              void handleTestNotification();
            }}
          />
          <SecureAction
            label="Probar recordatorio (10 s)"
            icon="timer-outline"
            onPress={() => {
              void handleTestReminder();
            }}
          />
        </View>

        <Text style={styles.secureNote}>
          Pega el token en https://expo.dev/notifications para enviar un push real desde la Expo
          Push Tool.
        </Text>
      </View>

      <ReminderList
        lastReceived={lastReceived}
        reminders={reminders}
        onCancelOne={handleCancelReminder}
        onCancelAll={handleCancelAll}
      />
    </>
  );
}
// ===== SEMANA 12 · FIN =====
