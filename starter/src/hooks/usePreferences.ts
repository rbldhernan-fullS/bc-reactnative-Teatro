// ============================================
// HOOK: usePreferences — Semana 07
// Preferencias de la cartelera persistidas con MMKV (reactivas y sincrónicas)
// ============================================

import { useCallback } from 'react';
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

import { storage } from '../storage/mmkv';

// ============================================
// 1. CLAVES Y VALORES POR DEFECTO
// ============================================

/** Claves centralizadas: evita strings sueltos repartidos por las pantallas. */
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

// ============================================
// 2. NORMALIZACIÓN DE VALORES GUARDADOS
// ============================================

/**
 * MMKV devuelve `string | undefined`. Si el archivo se editó a mano o cambió
 * la versión de la app, caemos al valor por defecto tipado.
 */
function normalizeSortOrder(value: string | undefined): SortOrder {
  return value === 'desc' ? 'desc' : DEFAULT_PREFERENCES.sortOrder;
}

function normalizeItemsPerPage(value: number | undefined): ItemsPerPage {
  if (value === 6 || value === 12 || value === 24) {
    return value;
  }

  return DEFAULT_PREFERENCES.itemsPerPage;
}

// ============================================
// 3. HOOK PRINCIPAL
// ============================================

/**
 * Expone las preferencias del usuario y sus setters.
 *
 * Los hooks `useMMKV*` son reactivos: al escribir en MMKV, todos los
 * componentes suscritos se vuelven a renderizar sin `async/await` ni
 * reiniciar la app. La escritura es sincrónica y sobrevive al cierre.
 */
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
  const [storedRemindersEnabled, setStoredRemindersEnabled] = useMMKVBoolean(
    PREF_KEYS.REMINDERS_ENABLED,
    storage
  );

  const resetPreferences = useCallback((): void => {
    setSortOrder(DEFAULT_PREFERENCES.sortOrder);
    setCompactMode(DEFAULT_PREFERENCES.compactMode);
    setItemsPerPage(DEFAULT_PREFERENCES.itemsPerPage);
    setOnlyAvailable(DEFAULT_PREFERENCES.onlyAvailable);
    setStoredRemindersEnabled(DEFAULT_PREFERENCES.remindersEnabled);
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
