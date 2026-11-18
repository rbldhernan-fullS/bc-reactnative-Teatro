// ===== SEMANA 02 · INICIO =====
import { useCallback, useEffect, useMemo, useState } from 'react';
// ===== SEMANA 02 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { usePreferences, type ItemsPerPage, type SortOrder } from '../../../hooks/usePreferences';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { Item, PlaysWithSource } from '../../../types';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { animateListLayout } from '../utils/listAnimation';
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 04 · INICIO =====
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
// ===== SEMANA 04 · FIN =====

export interface HomeFilters {
  query: string;
  setQuery: (value: string) => void;
  sortOrder: SortOrder;
  compactMode: boolean;
  itemsPerPage: ItemsPerPage;
  onlyAvailable: boolean;
  filteredItems: Item[];
  visibleItems: Item[];
  dismissedIds: string[];
  remaining: number;
  handleDismiss: (item: Item) => void;
  handleRestoreDismissed: () => void;
  handleLoadMore: () => void;
  handleToggleOnlyAvailable: (value: boolean) => void;
}

/**
 * Estado de la cartelera: búsqueda, preferencias, descartes de la sesión y
 * paginación local.
 *
 * Vive en un hook para que la pantalla solo componga. El filtrado se calcula
 * con `useMemo`: buscar y ordenar son operaciones de lista, no de red.
 */
export function useHomeFilters(data: PlaysWithSource | undefined): HomeFilters {
  // ===== SEMANA 07 · INICIO =====
  const { sortOrder, compactMode, itemsPerPage, onlyAvailable, setOnlyAvailable } =
    usePreferences();
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const [query, setQuery] = useState<string>('');
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const dismissedIdSet = useMemo(() => new Set(dismissedIds), [dismissedIds]);
  // ===== SEMANA 10 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const plays = useMemo(() => data?.plays ?? [], [data]);

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [itemsPerPage, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const handleDismiss = useCallback((item: Item): void => {
    animateListLayout();
    setDismissedIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
  }, []);

  const handleRestoreDismissed = useCallback((): void => {
    animateListLayout();
    setDismissedIds([]);
  }, []);
  // ===== SEMANA 10 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const filteredItems = useMemo(() => {
    const cleanQuery = normalizeText(query.trim());

    // ===== SEMANA 04 · INICIO =====
    const result = plays.filter((item) => {
      // ===== SEMANA 10 · INICIO =====
      if (dismissedIdSet.has(item.id)) {
        return false;
      }
      // ===== SEMANA 10 · FIN =====

      // ===== SEMANA 07 · INICIO =====
      if (onlyAvailable && item.availableSeats === 0) {
        return false;
      }

      if (!cleanQuery) {
        return true;
      }
      // ===== SEMANA 07 · FIN =====

      return [item.name, item.subtitle, item.genre, item.hall].some((field) =>
        normalizeText(field).includes(cleanQuery),
      );
    });

    return result.sort((first, second) =>
      sortOrder === 'asc'
        ? first.name.localeCompare(second.name, 'es')
        : second.name.localeCompare(first.name, 'es'),
    );
    // ===== SEMANA 04 · FIN =====
  }, [dismissedIdSet, plays, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount],
  );

  const handleLoadMore = useCallback((): void => {
    // ===== SEMANA 09 · INICIO =====
    animateListLayout();
    // ===== SEMANA 09 · FIN =====
    setVisibleCount((current) => current + itemsPerPage);
  }, [itemsPerPage]);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 09 · INICIO =====
  const handleToggleOnlyAvailable = useCallback(
    (value: boolean): void => {
      animateListLayout();
      setOnlyAvailable(value);
    },
    [setOnlyAvailable],
  );
  // ===== SEMANA 09 · FIN =====

  return {
    query,
    setQuery,
    sortOrder,
    compactMode,
    itemsPerPage,
    onlyAvailable,
    filteredItems,
    visibleItems,
    dismissedIds,
    remaining: filteredItems.length - visibleItems.length,
    handleDismiss,
    handleRestoreDismissed,
    handleLoadMore,
    handleToggleOnlyAvailable,
  };
}
