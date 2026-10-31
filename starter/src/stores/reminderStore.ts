// ============================================
// STORE: reminderStore — Semana 12
// Recordatorios activos por obra, persistidos en MMKV para poder cancelarlos
// aunque la app se cierre. Solo guarda ids y metadatos, no las obras.
// ============================================

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '../storage/mmkv';
import type { ShowReminder } from '../types';

export interface ReminderStore {
  /** Recordatorios indexados por id de obra (uno activo por obra) */
  reminders: Record<string, ShowReminder>;

  /** Registra o reemplaza el recordatorio de una obra */
  saveReminder: (reminder: ShowReminder) => void;

  /** Quita el registro local de una obra */
  removeReminder: (itemId: string) => void;

  /** Vacía todos los registros locales */
  clearReminders: () => void;

  /** Elimina registros cuyo aviso ya no existe en el sistema operativo */
  pruneReminders: (scheduledIds: string[]) => void;
}

type PersistedReminderState = Pick<ReminderStore, 'reminders'>;

/**
 * Adaptador sincrónico sobre la instancia MMKV compartida. Evita async/await
 * en el arranque y mantiene el mismo storage que las preferencias.
 */
const mmkvStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
}));

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: {},

      saveReminder: (reminder) => {
        set((state) => ({
          reminders: { ...state.reminders, [reminder.itemId]: reminder },
        }));
      },

      removeReminder: (itemId) => {
        set((state) => {
          if (!(itemId in state.reminders)) {
            return state;
          }

          const nextReminders = { ...state.reminders };
          delete nextReminders[itemId];
          return { reminders: nextReminders };
        });
      },

      clearReminders: () => set({ reminders: {} }),

      pruneReminders: (scheduledIds) => {
        set((state) => {
          const scheduled = new Set(scheduledIds);
          const nextReminders: Record<string, ShowReminder> = {};
          let changed = false;

          for (const [itemId, reminder] of Object.entries(state.reminders)) {
            if (scheduled.has(reminder.notificationId)) {
              nextReminders[itemId] = reminder;
            } else {
              changed = true;
            }
          }

          return changed ? { reminders: nextReminders } : state;
        });
      },
    }),
    {
      name: 'teatro-reminders',
      storage: mmkvStorage,
      partialize: (state): PersistedReminderState => ({
        reminders: state.reminders,
      }),
    }
  )
);

/** Selector: recordatorio activo de una obra. */
export const selectReminder =
  (itemId: string) =>
  (state: ReminderStore): ShowReminder | undefined =>
    state.reminders[itemId];

/** Selector: cantidad de recordatorios activos. */
export const selectReminderCount = (state: ReminderStore): number =>
  Object.keys(state.reminders).length;
