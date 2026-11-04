// ===== SEMANA 01 · INICIO =====
import { useCallback } from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 07 · INICIO =====
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from '../storage/mmkvHooks';

import { storage } from '../storage/mmkv';

export const PREF_KEYS = {
  SORT_ORDER: 'pref_sortOrder',
  COMPACT_MODE: 'pref_compactMode',
  ITEMS_PER_PAGE: 'pref_itemsPerPage',
  ONLY_AVAILABLE: 'pref_onlyAvailable',
  REMINDERS_ENABLED: 'pref_remindersEnabled',
} as const;

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24] as const;
export type ItemsPerPage = (typeof ITEMS_PER_PAGE_OPTIONS)[number];

export const DEFAULT_PREFERENCES = {
  sortOrder: 'asc',
  compactMode: false,
  itemsPerPage: 12,
  onlyAvailable: false,
  remindersEnabled: true,
} as const satisfies {
  sortOrder: SortOrder;
  compactMode: boolean;
  itemsPerPage: ItemsPerPage;
  onlyAvailable: boolean;
  remindersEnabled: boolean;
};

function normalizeSortOrder(value: string | undefined): SortOrder {
  return value === 'desc' ? 'desc' : DEFAULT_PREFERENCES.sortOrder;
}

function normalizeItemsPerPage(value: number | undefined): ItemsPerPage {
  if (value === 6 || value === 12 || value === 24) {
    return value;
  }

  return DEFAULT_PREFERENCES.itemsPerPage;
}

export function usePreferences() {
  const [storedSortOrder, setSortOrder] = useMMKVString(
    PREF_KEYS.SORT_ORDER,
    storage
  );
  const [storedCompactMode, setCompactMode] = useMMKVBoolean(
    PREF_KEYS.COMPACT_MODE,
    storage
  );
  const [storedItemsPerPage, setItemsPerPage] = useMMKVNumber(
    PREF_KEYS.ITEMS_PER_PAGE,
    storage
  );
  const [storedOnlyAvailable, setOnlyAvailable] = useMMKVBoolean(
    PREF_KEYS.ONLY_AVAILABLE,
    storage
  );
  // ===== SEMANA 12 · INICIO =====
  const [storedRemindersEnabled, setStoredRemindersEnabled] = useMMKVBoolean(
    PREF_KEYS.REMINDERS_ENABLED,
    storage
  );
  // ===== SEMANA 12 · FIN =====

  const resetPreferences = useCallback((): void => {
    setSortOrder(DEFAULT_PREFERENCES.sortOrder);
    setCompactMode(DEFAULT_PREFERENCES.compactMode);
    setItemsPerPage(DEFAULT_PREFERENCES.itemsPerPage);
    setOnlyAvailable(DEFAULT_PREFERENCES.onlyAvailable);
    // ===== SEMANA 12 · INICIO =====
    setStoredRemindersEnabled(DEFAULT_PREFERENCES.remindersEnabled);
    // ===== SEMANA 12 · FIN =====
  }, [
    setCompactMode,
    setItemsPerPage,
    setOnlyAvailable,
    setSortOrder,
    setStoredRemindersEnabled,
  ]);

  return {
    sortOrder: normalizeSortOrder(storedSortOrder),
    setSortOrder: (value: SortOrder): void => setSortOrder(value),

    compactMode: storedCompactMode ?? DEFAULT_PREFERENCES.compactMode,
    setCompactMode: (value: boolean): void => setCompactMode(value),

    itemsPerPage: normalizeItemsPerPage(storedItemsPerPage),
    setItemsPerPage: (value: ItemsPerPage): void => setItemsPerPage(value),

    onlyAvailable: storedOnlyAvailable ?? DEFAULT_PREFERENCES.onlyAvailable,
    setOnlyAvailable: (value: boolean): void => setOnlyAvailable(value),

    remindersEnabled:
      storedRemindersEnabled ?? DEFAULT_PREFERENCES.remindersEnabled,
    setRemindersEnabled: (value: boolean): void =>
      setStoredRemindersEnabled(value),

    resetPreferences,
  };
}
// ===== SEMANA 07 · FIN =====
