// ===== SEMANA 01 · INICIO =====
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 10 · INICIO =====
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 02 · INICIO =====
import type { Item } from '../types';
// ===== SEMANA 02 · FIN =====
// ===== SEMANA 10 · INICIO =====
import { SwipeableCard } from '../components/SwipeableCard';
// ===== SEMANA 10 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { AnimatedButton } from '../components/AnimatedButton';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { ScreenState } from '../components/ScreenState';
import { usePlays } from '../hooks/usePlays';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { usePreferences } from '../hooks/usePreferences';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { getApiErrorMessage } from '../services/api';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { useSavedStore } from '../stores/savedStore';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 09 · INICIO =====
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
// ===== SEMANA 09 · FIN =====
// ===== SEMANA 04 · INICIO =====
import type { HomeStackParamList } from '../navigation/types';
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 03 · INICIO =====
type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 04 · INICIO =====
const DOMAIN_TITLE = 'Teatro Colón';
const DOMAIN_SUBTITLE = 'Cartelera oficial de la temporada';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 09 · INICIO =====
const ENTRANCE_STAGGER_MS = 80;
const ENTRANCE_DURATION_MS = 420;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function animateListLayout(): void {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}
// ===== SEMANA 09 · FIN =====

// ===== SEMANA 10 · INICIO =====
interface StaggeredItemProps {
  index: number;
  children: React.ReactNode;
}

function StaggeredItem({
  index,
  children,
}: StaggeredItemProps): React.JSX.Element {
  const progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    progress.value = withDelay(
      index * ENTRANCE_STAGGER_MS,
      withTiming(1, { duration: ENTRANCE_DURATION_MS })
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [24, 0]),
      },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 04 · INICIO =====
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 01 · INICIO =====
export function HomeScreen(): React.JSX.Element {
  // ===== SEMANA 03 · INICIO =====
  const navigation = useNavigation<HomeScreenNavProp>();
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const { data, isLoading, isError, error, refetch, isFetching } = usePlays();
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const {
    sortOrder,
    compactMode,
    itemsPerPage,
    onlyAvailable,
    setOnlyAvailable,
  } = usePreferences();
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const savedIds = useSavedStore((state) => state.savedIds);
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const searchInputRef = useRef<TextInput>(null);

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
  const isOffline = data?.source === 'cache';

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [itemsPerPage, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 03 · INICIO =====
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', {
        id: item.id,
        name: item.name,
      });
    },
    [navigation]
  );
  // ===== SEMANA 03 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const handleToggleSave = useCallback(
    (item: Item): void => {
      toggleSaved(item.id);
    },
    [toggleSaved]
  );
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 10 · INICIO =====
  const handleDismiss = useCallback((item: Item): void => {
    animateListLayout();
    setDismissedIds((current) =>
      current.includes(item.id) ? current : [...current, item.id]
    );
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
        normalizeText(field).includes(cleanQuery)
      );
    });

    return result.sort((first, second) =>
      sortOrder === 'asc'
        ? first.name.localeCompare(second.name, 'es')
        : second.name.localeCompare(first.name, 'es')
    );
    // ===== SEMANA 04 · FIN =====
  }, [dismissedIdSet, plays, query, onlyAvailable, sortOrder]);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 07 · INICIO =====
  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );
  // ===== SEMANA 07 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);
  // ===== SEMANA 05 · FIN =====

  // ===== SEMANA 07 · INICIO =====
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
    [setOnlyAvailable]
  );
  // ===== SEMANA 09 · FIN =====

  // ===== SEMANA 02 · INICIO =====
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item, index }) => (
      <StaggeredItem index={index}>
        <SwipeableCard
          item={item}
          onPress={handleItemPress}
          saved={savedIdSet.has(item.id)}
          onToggleSave={handleToggleSave}
          onDismiss={handleDismiss}
          compact={compactMode}
        />
      </StaggeredItem>
    ),
    [
      compactMode,
      handleDismiss,
      handleItemPress,
      savedIdSet,
      handleToggleSave,
    ]
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const renderEmpty = useCallback(() => {
    // ===== SEMANA 05 · INICIO =====
    if (plays.length === 0) {
      return (
        <ScreenState
          icon="ticket-outline"
          title="Cartelera vacía"
          message="Todavía no hay obras registradas. Crea la primera función para abrir la temporada."
          actionLabel="Crear obra"
          onAction={() => navigation.navigate('Create')}
        />
      );
    }
    // ===== SEMANA 05 · FIN =====

    // ===== SEMANA 07 · INICIO =====
    if (query.trim().length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyTitle}>Sin obras encontradas</Text>
          <Text style={styles.emptySubtitle}>
            No hay funciones que coincidan con "{query}". Prueba buscando por
            otro título, director o género teatral.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.clearFilterButton,
              pressed && styles.clearFilterButtonPressed,
            ]}
            onPress={() => {
              setQuery('');
              searchInputRef.current?.focus();
            }}
          >
            <Text style={styles.clearFilterButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        </View>
      );
    }
    // ===== SEMANA 07 · FIN =====

    // ===== SEMANA 10 · INICIO =====
    if (dismissedIds.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🙈</Text>
          <Text style={styles.emptyTitle}>Cartelera descartada</Text>
          <Text style={styles.emptySubtitle}>
            Descartaste {dismissedIds.length}{' '}
            {dismissedIds.length === 1 ? 'obra' : 'obras'} de esta sesión.
            Puedes restaurarlas cuando quieras.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.clearFilterButton,
              pressed && styles.clearFilterButtonPressed,
            ]}
            onPress={handleRestoreDismissed}
          >
            <Text style={styles.clearFilterButtonText}>Restaurar cartelera</Text>
          </Pressable>
        </View>
      );
    }
    // ===== SEMANA 10 · FIN =====

    return (
      <View style={styles.emptyContainer}>
        {/* ===== SEMANA 07 · INICIO ===== */}
        <Text style={styles.emptyIcon}>🎟️</Text>
        <Text style={styles.emptyTitle}>Sin funciones disponibles</Text>
        {/* ===== SEMANA 07 · FIN ===== */}
        <Text style={styles.emptySubtitle}>
          Todas las obras de la cartelera están agotadas. Desactiva el filtro
          para volver a ver la temporada completa.
        </Text>
        {/* ===== SEMANA 05 · INICIO ===== */}
        <Pressable
          style={({ pressed }) => [
            styles.clearFilterButton,
            pressed && styles.clearFilterButtonPressed,
          ]}
          onPress={() => handleToggleOnlyAvailable(false)}
        >
          <Text style={styles.clearFilterButtonText}>Ver todas las obras</Text>
        </Pressable>
        {/* ===== SEMANA 05 · FIN ===== */}
      </View>
    );
  }, [
    dismissedIds.length,
    handleRestoreDismissed,
    handleToggleOnlyAvailable,
    navigation,
    onlyAvailable,
    plays.length,
    query,
  ]);

  const renderFooter = useCallback(() => {
    // ===== SEMANA 07 · INICIO =====
    const remaining = filteredItems.length - visibleItems.length;

    if (remaining <= 0) {
      return null;
    }
    // ===== SEMANA 07 · FIN =====

    return (
      <View style={styles.footer}>
        <AnimatedButton
          label={`Mostrar ${Math.min(remaining, itemsPerPage)} más`}
          onPress={handleLoadMore}
          variant="outline"
          accessibilityLabel={`Mostrar ${Math.min(remaining, itemsPerPage)} obras más`}
        />
        <Text style={styles.footerHint}>
          {visibleItems.length} de {filteredItems.length} obras
        </Text>
      </View>
    );
  }, [filteredItems.length, handleLoadMore, itemsPerPage, visibleItems.length]);
  // ===== SEMANA 02 · FIN =====

  // ===== SEMANA 05 · INICIO =====
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          loading
          title="Cargando cartelera"
          message="Consultando las obras y funciones de la temporada."
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenState
          icon="cloud-offline-outline"
          title="No se pudo cargar la cartelera"
          message={getApiErrorMessage(error)}
          actionLabel="Reintentar"
          onAction={handleRefresh}
        />
      </SafeAreaView>
    );
  }
  // ===== SEMANA 05 · FIN =====

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTextBlock}>
                <View style={styles.titleLine}>
                  <Text style={styles.theaterIcon}>🎭</Text>
                  <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
                </View>
                <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
              </View>

              <AnimatedButton
                label="Nueva"
                onPress={() => navigation.navigate('Create')}
                icon="add"
                compact
                accessibilityLabel="Crear una obra nueva"
              />
            </View>
          </View>

          <View style={styles.searchSection}>
            <Pressable
              style={styles.searchInputWrapper}
              onPress={() => searchInputRef.current?.focus()}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Buscar por obra, director o género..."
                placeholderTextColor={COLORS.textMuted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {Platform.OS !== 'ios' && query.length > 0 && (
                <Pressable
                  onPress={() => {
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={styles.clearIconWrapper}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Borrar búsqueda"
                >
                  <Text style={styles.clearIconText}>✕</Text>
                </Pressable>
              )}
            </Pressable>

            <View style={styles.resultsBar}>
              <Text style={styles.resultsCount}>
                {filteredItems.length}{' '}
                {/* ===== SEMANA 07 · INICIO ===== */}
                {filteredItems.length === 1
                  ? 'obra disponible'
                  : 'obras disponibles'}
                  {/* ===== SEMANA 07 · FIN ===== */}
              </Text>

              {/* ===== SEMANA 07 · INICIO ===== */}
              <View style={styles.activeFilters}>
                <Text style={styles.activeFilterBadge}>
                  {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                </Text>
                {compactMode && (
                  <Text style={styles.activeFilterBadge}>Compacto</Text>
                )}
                {onlyAvailable && (
                  <Text style={styles.activeFilterBadge}>Con butacas</Text>
                )}
              </View>
              {/* ===== SEMANA 07 · FIN ===== */}
            </View>
          </View>

          {/* ===== SEMANA 07 · INICIO ===== */}
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineIcon}>⚠️</Text>
              <View style={styles.offlineTextBlock}>
                <Text style={styles.offlineTitle}>Mostrando datos sin red</Text>
                <Text style={styles.offlineSubtitle}>
                  Cartelera recuperada de la caché local del dispositivo.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.offlineRetry,
                  pressed && styles.offlineRetryPressed,
                ]}
                onPress={handleRefresh}
                accessibilityRole="button"
                accessibilityLabel="Volver a intentar la conexión"
              >
                <Text style={styles.offlineRetryText}>Reintentar</Text>
              </Pressable>
            </View>
          )}
          {/* ===== SEMANA 07 · FIN ===== */}

          {/* ===== SEMANA 10 · INICIO ===== */}
          {dismissedIds.length > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.dismissedBanner,
                pressed && styles.dismissedBannerPressed,
              ]}
              onPress={handleRestoreDismissed}
              accessibilityRole="button"
              accessibilityLabel="Restaurar las obras descartadas"
            >
              <Text style={styles.dismissedText}>
                {dismissedIds.length}{' '}
                {dismissedIds.length === 1
                  ? 'obra descartada'
                  : 'obras descartadas'}
              </Text>
              <Text style={styles.dismissedAction}>Restaurar</Text>
            </Pressable>
          )}

          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>
              Desliza → guardar · ← descartar
            </Text>
          </View>
          {/* ===== SEMANA 10 · FIN ===== */}

          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.listWrapper}>
              <FlatList
                data={visibleItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                refreshing={isFetching && !isLoading}
                onRefresh={handleRefresh}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  theaterIcon: {
    fontSize: TYPOGRAPHY.size.xl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  searchSection: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    fontSize: TYPOGRAPHY.size.base,
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + SPACING.xxs,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}),
  },
  clearIconWrapper: {
    padding: SPACING.xs,
  },
  clearIconText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  activeFilterBadge: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: '#3a2210',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  offlineIcon: {
    fontSize: TYPOGRAPHY.size.base,
  },
  offlineTextBlock: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.warning,
  },
  offlineSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  offlineRetry: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  offlineRetryPressed: {
    opacity: 0.7,
  },
  offlineRetryText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
  },
  dismissedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dismissedBannerPressed: {
    opacity: 0.75,
  },
  dismissedText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  dismissedAction: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  swipeHint: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  swipeHintText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
  },
  footerHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: TYPOGRAPHY.size.display,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING.lg,
  },
  clearFilterButton: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  clearFilterButtonPressed: {
    opacity: 0.7,
  },
  clearFilterButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});
// ===== SEMANA 01 · FIN =====
