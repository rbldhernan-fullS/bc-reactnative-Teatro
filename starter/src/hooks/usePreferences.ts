// ===== SEMANA 01 · INICIO =====
import { useCallback } from 'react';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 07 · INICIO =====
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

import { storage } from '../storage/mmkv';

export const PREF_KEYS = {
  SORT_ORDER: 'pref_sortOrder',
  COMPACT_MODE: 'pref_compactMode',
  ITEMS_PER_PAGE: 'pref_itemsPerPage',
  ONLY_AVAILABLE: 'pref_onlyAvailable',
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
} as const satisfies {
  sortOrder: SortOrder;
  compactMode: boolean;
  itemsPerPage: ItemsPerPage;
  onlyAvailable: boolean;
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

  const resetPreferences = useCallback((): void => {
    setSortOrder(DEFAULT_PREFERENCES.sortOrder);
    setCompactMode(DEFAULT_PREFERENCES.compactMode);
    setItemsPerPage(DEFAULT_PREFERENCES.itemsPerPage);
    setOnlyAvailable(DEFAULT_PREFERENCES.onlyAvailable);
  }, [setCompactMode, setItemsPerPage, setOnlyAvailable, setSortOrder]);

  return {
    sortOrder: normalizeSortOrder(storedSortOrder),
    setSortOrder: (value: SortOrder): void => setSortOrder(value),

    compactMode: storedCompactMode ?? DEFAULT_PREFERENCES.compactMode,
    setCompactMode: (value: boolean): void => setCompactMode(value),

    itemsPerPage: normalizeItemsPerPage(storedItemsPerPage),
    setItemsPerPage: (value: ItemsPerPage): void => setItemsPerPage(value),

    onlyAvailable: storedOnlyAvailable ?? DEFAULT_PREFERENCES.onlyAvailable,
    setOnlyAvailable: (value: boolean): void => setOnlyAvailable(value),

    resetPreferences,
  };
}
// ===== SEMANA 07 · FIN =====
