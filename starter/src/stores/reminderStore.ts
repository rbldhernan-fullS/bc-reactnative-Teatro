// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '../storage/mmkv';
import type { ShowReminder } from '../types';

export interface ReminderStore {
  reminders: Record<string, ShowReminder>;

  saveReminder: (reminder: ShowReminder) => void;

  removeReminder: (itemId: string) => void;

  clearReminders: () => void;

  pruneReminders: (scheduledIds: string[]) => void;
}

type PersistedReminderState = Pick<ReminderStore, 'reminders'>;

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

export const selectReminder =
  (itemId: string) =>
  (state: ReminderStore): ShowReminder | undefined =>
    state.reminders[itemId];

export const selectReminderCount = (state: ReminderStore): number =>
  Object.keys(state.reminders).length;
  // ===== SEMANA 12 · FIN =====
