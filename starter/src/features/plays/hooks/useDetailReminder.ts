// ===== SEMANA 12 · INICIO =====
import { useState } from 'react';

import { useNotifications } from '../../../hooks/useNotifications';
import { usePreferences } from '../../../hooks/usePreferences';
import { notify, notifyError } from '../../../platform/notify';
import { formatScheduleDate } from '../../../services/notifications';
import type { Item, ShowReminder } from '../../../types';

export interface DetailReminderState {
  reminder: ShowReminder | undefined;
  remindersEnabled: boolean;
  isScheduling: boolean;
  schedule: () => Promise<void>;
  scheduleDemo: () => Promise<void>;
  cancel: () => Promise<void>;
}

/**
 * Estado y acciones del recordatorio de una obra.
 *
 * Vive en un hook para que la ficha no acumule el manejo de avisos y para que
 * el flujo de eliminación pueda cancelar el recordatorio antes de borrar la
 * obra usando la misma instancia.
 */
export function useDetailReminder(play: Item | undefined): DetailReminderState {
  const { reminders, scheduleReminder, cancelReminder } = useNotifications();
  const { remindersEnabled } = usePreferences();
  const [isScheduling, setIsScheduling] = useState(false);

  const reminder = play ? reminders[play.id] : undefined;

  async function schedule(): Promise<void> {
    if (!play) {
      return;
    }

    setIsScheduling(true);

    try {
      const outcome = await scheduleReminder(play, 'show');

      if (outcome.ok) {
        notify(
          'Recordatorio programado',
          `Te avisaremos el ${formatScheduleDate(outcome.scheduledAt)}, 2 horas antes de "${play.name}".`,
        );
        return;
      }

      notifyError('No se pudo programar', outcome.reason);
    } finally {
      setIsScheduling(false);
    }
  }

  async function scheduleDemo(): Promise<void> {
    if (!play) {
      return;
    }

    setIsScheduling(true);

    try {
      const outcome = await scheduleReminder(play, 'demo');

      if (outcome.ok) {
        notify(
          'Prueba programada',
          `El aviso de "${play.name}" llegará en 10 segundos. Mantén la app abierta para verlo en primer plano.`,
        );
        return;
      }

      notifyError('No se pudo programar la prueba', outcome.reason);
    } finally {
      setIsScheduling(false);
    }
  }

  async function cancel(): Promise<void> {
    if (!play) {
      return;
    }

    const cancelled = await cancelReminder(play.id);

    notify(
      cancelled ? 'Recordatorio cancelado' : 'Recordatorio retirado',
      cancelled
        ? `Ya no recibirás el aviso de "${play.name}".`
        : 'El aviso ya no estaba programado en el sistema; el registro local quedó limpio.',
    );
  }

  return {
    reminder,
    remindersEnabled,
    isScheduling,
    schedule,
    scheduleDemo,
    cancel,
  };
}
// ===== SEMANA 12 · FIN =====
