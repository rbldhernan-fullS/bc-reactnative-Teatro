// ===== SEMANA 12 · INICIO =====
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { formatScheduleDate } from '../../../services/notifications';
import type { ReceivedNotification } from '../../../stores/notificationStore';
import type { ShowReminder } from '../../../types';
import { styles } from '../styles';

interface ReminderListProps {
  lastReceived: ReceivedNotification | null;
  reminders: Record<string, ShowReminder>;
  onCancelOne: (itemId: string, playName: string) => Promise<void>;
  onCancelAll: () => Promise<void>;
}

/**
 * Diario de avisos: la última notificación recibida y los recordatorios que
 * siguen programados en el sistema, con su acción de cancelación.
 */
export function ReminderList({
  lastReceived,
  reminders,
  onCancelOne,
  onCancelAll,
}: ReminderListProps): React.JSX.Element {
  const reminderList = Object.values(reminders);

  return (
    <>
      {lastReceived ? (
        <View style={styles.infoBox}>
          <Text style={styles.maskedLabel}>Última notificación recibida</Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoStrong}>{lastReceived.title}</Text>
          </Text>
          {lastReceived.body ? <Text style={styles.infoLine}>{lastReceived.body}</Text> : null}
          <Text style={styles.infoLine}>
            {formatScheduleDate(lastReceived.receivedAt)}
            {lastReceived.payload?.itemId ? ` · obra ${lastReceived.payload.itemId}` : ''}
          </Text>
        </View>
      ) : null}

      {reminderList.length > 0 ? (
        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Text style={styles.rowLabel}>Recordatorios programados ({reminderList.length})</Text>

            <Pressable
              onPress={() => {
                void onCancelAll();
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar todos los recordatorios"
            >
              <Text style={styles.cancelAll}>Cancelar todos</Text>
            </Pressable>
          </View>

          {reminderList.map((reminder) => (
            <View key={reminder.itemId} style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderName} numberOfLines={1}>
                  {reminder.playName}
                </Text>
                <Text style={styles.reminderDate}>
                  {reminder.kind === 'show' ? '2 h antes · ' : 'Prueba · '}
                  {formatScheduleDate(reminder.scheduledAt)}
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  void onCancelOne(reminder.itemId, reminder.playName);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Cancelar el recordatorio de ${reminder.playName}`}
                style={({ pressed }) => (pressed ? styles.reminderCancelPressed : undefined)}
              >
                <Ionicons name="close-circle-outline" size={SIZES.iconMd} color={COLORS.error} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}
// ===== SEMANA 12 · FIN =====
