// ===== SEMANA 12 · INICIO =====
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../../theme';
import { formatScheduleDate } from '../../../../services/notifications';
import type { Item, ShowReminder } from '../../../../types';
import { styles } from './styles';

interface DetailReminderSectionProps {
  play: Item;
  reminder: ShowReminder | undefined;
  remindersEnabled: boolean;
  isScheduling: boolean;
  onSchedule: () => Promise<void>;
  onDemo: () => Promise<void>;
  onCancel: () => Promise<void>;
}

/** Recordatorio de función: 2 horas antes o prueba de 10 segundos. */
export function DetailReminderSection({
  play,
  reminder,
  remindersEnabled,
  isScheduling,
  onSchedule,
  onDemo,
  onCancel,
}: DetailReminderSectionProps): React.JSX.Element {
  const { name, date, time } = play;
  const disabled = !remindersEnabled || isScheduling;

  return (
    <View style={styles.section}>
      <View style={styles.reminderHeader}>
        <Text style={styles.sectionTitle}>Recordatorio de función</Text>

        {reminder ? (
          <View style={styles.reminderBadge}>
            <Ionicons name="notifications" size={12} color={COLORS.background} />
            <Text style={styles.reminderBadgeText}>Activo</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.reminderDescription}>
        {reminder
          ? `Aviso programado para el ${formatScheduleDate(reminder.scheduledAt)}${
              reminder.kind === 'demo' ? ' (prueba de 10 s).' : ', 2 horas antes de la función.'
            }`
          : `Programa un aviso 2 horas antes de la función del ${date} a las ${time}.`}
      </Text>

      {!remindersEnabled ? (
        <Text style={styles.reminderDisabled}>
          Los recordatorios están desactivados en Ajustes.
        </Text>
      ) : null}

      <View style={styles.reminderActions}>
        {reminder ? (
          <Pressable
            style={({ pressed }) => [
              styles.reminderAction,
              pressed && styles.reminderActionPressed,
            ]}
            onPress={() => {
              void onCancel();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Cancelar el recordatorio de ${name}`}
          >
            <Ionicons name="notifications-off-outline" size={SIZES.iconSm} color={COLORS.accent} />
            <Text style={styles.reminderActionText}>Cancelar recordatorio</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.reminderAction,
              pressed && styles.reminderActionPressed,
              disabled && styles.reminderActionDisabled,
            ]}
            onPress={() => {
              void onSchedule();
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Programar recordatorio 2 horas antes de ${name}`}
            accessibilityState={{ disabled }}
          >
            {isScheduling ? (
              <ActivityIndicator size="small" color={COLORS.accent} />
            ) : (
              <Ionicons name="notifications-outline" size={SIZES.iconSm} color={COLORS.accent} />
            )}
            <Text style={styles.reminderActionText}>Recordar 2 h antes</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.reminderAction,
            pressed && styles.reminderActionPressed,
            disabled && styles.reminderActionDisabled,
          ]}
          onPress={() => {
            void onDemo();
          }}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Probar un recordatorio de ${name} en 10 segundos`}
          accessibilityState={{ disabled }}
        >
          <Ionicons name="timer-outline" size={SIZES.iconSm} color={COLORS.accent} />
          <Text style={styles.reminderActionText}>Probar en 10 s</Text>
        </Pressable>
      </View>
    </View>
  );
}
// ===== SEMANA 12 · FIN =====
