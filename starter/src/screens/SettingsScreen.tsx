// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 07 · INICIO =====
import * as SecureStore from 'expo-secure-store';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 07 · INICIO =====
import {
  ITEMS_PER_PAGE_OPTIONS,
  usePreferences,
} from '../hooks/usePreferences';
import type { ItemsPerPage, SortOrder } from '../hooks/usePreferences';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 12 · INICIO =====
import { useNotifications } from '../hooks/useNotifications';
import {
  formatScheduleDate,
  scheduleTestNotification,
  scheduleTestReminder,
  type NotificationPermissionState,
} from '../services/notifications';
// ===== SEMANA 12 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';

const SENSITIVE_KEY = 'teatro_taquilla_access_code';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateAccessCode(): string {
  let code = 'TC';

  for (let index = 0; index < 8; index += 1) {
    if (index === 4) {
      code += '-';
    }

    const randomIndex = Math.floor(Math.random() * CODE_ALPHABET.length);
    code += CODE_ALPHABET[randomIndex];
  }

  return code;
}

function maskSecret(value: string): string {
  if (value.length <= 6) {
    return '••••••';
  }

  return `${value.slice(0, 3)}•••${value.slice(-3)}`;
}

interface SwitchRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SwitchRow({
  label,
  description,
  value,
  onValueChange,
}: SwitchRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.accent }}
        thumbColor={COLORS.background}
        ios_backgroundColor={COLORS.border}
        accessibilityLabel={label}
      />
    </View>
  );
}

interface SegmentOption<T extends string | number> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  description: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string | number>({
  label,
  description,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>): React.JSX.Element {
  return (
    <View style={styles.preferenceBlock}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowDesc}>{description}</Text>

      <View style={styles.segmented}>
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <Pressable
              key={String(option.value)}
              style={({ pressed }) => [
                styles.segment,
                isActive && styles.segmentActive,
                pressed && styles.segmentPressed,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${label}: ${option.label}`}
            >
              <Text
                style={[
                  styles.segmentText,
                  isActive && styles.segmentTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface SecureActionProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
}

function SecureAction({
  label,
  icon,
  onPress,
  variant = 'outline',
  disabled = false,
}: SecureActionProps): React.JSX.Element {
  const iconColor =
    variant === 'primary'
      ? COLORS.background
      : variant === 'danger'
        ? COLORS.error
        : COLORS.accent;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' && styles.actionPrimary,
        variant === 'danger' && styles.actionDanger,
        pressed && !disabled && styles.actionPressed,
        disabled && styles.actionDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Ionicons name={icon} size={SIZES.iconSm} color={iconColor} />
      <Text
        style={[
          styles.actionText,
          variant === 'primary' && styles.actionTextPrimary,
          variant === 'danger' && styles.actionTextDanger,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const SORT_OPTIONS: readonly SegmentOption<SortOrder>[] = [
  { label: 'A → Z', value: 'asc' },
  { label: 'Z → A', value: 'desc' },
];

const PAGE_OPTIONS: readonly SegmentOption<ItemsPerPage>[] =
  ITEMS_PER_PAGE_OPTIONS.map((size) => ({
    label: `${size} por página`,
    value: size,
  }));
  // ===== SEMANA 07 · FIN =====

// ===== SEMANA 12 · INICIO =====
const PERMISSION_LABELS: Record<NotificationPermissionState, string> = {
  granted: 'Concedido',
  denied: 'Bloqueado',
  undetermined: 'Sin decidir',
};
// ===== SEMANA 12 · FIN =====

// ===== SEMANA 07 · INICIO =====
export function SettingsScreen(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
    onlyAvailable,
    setOnlyAvailable,
    remindersEnabled,
    setRemindersEnabled,
    resetPreferences,
  } = usePreferences();

  // ===== SEMANA 12 · INICIO =====
  const {
    permission,
    pushToken,
    projectId,
    isPhysicalDevice,
    isRegistering,
    error: notificationError,
    lastReceived,
    reminders,
    registerForPush,
    refreshPermission,
    openSystemSettings,
    cancelReminder,
    cancelAllReminders,
  } = useNotifications();

  const reminderList = Object.values(reminders);
  // ===== SEMANA 12 · FIN =====

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [maskedValue, setMaskedValue] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    void SecureStore.getItemAsync(SENSITIVE_KEY)
      .then((value) => {
        if (isMounted) {
          setIsSaved(value !== null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsSaved(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      const accessCode = generateAccessCode();
      await SecureStore.setItemAsync(SENSITIVE_KEY, accessCode);

      const storedCode = await SecureStore.getItemAsync(SENSITIVE_KEY);
      setIsSaved(storedCode !== null);
      setMaskedValue(storedCode ? maskSecret(storedCode) : null);

      Alert.alert(
        'Código guardado',
        'El código de taquilla quedó cifrado en SecureStore.'
      );
    } catch {
      Alert.alert(
        'No se pudo guardar',
        'SecureStore no está disponible en este dispositivo.'
      );
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleReadSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      const storedCode = await SecureStore.getItemAsync(SENSITIVE_KEY);

      if (storedCode) {
        setIsSaved(true);
        setMaskedValue(maskSecret(storedCode));
        return;
      }

      setIsSaved(false);
      setMaskedValue(null);
      Alert.alert(
        'Sin código guardado',
        'Genera y guarda un código de taquilla para verlo enmascarado.'
      );
    } catch {
      Alert.alert(
        'No se pudo leer',
        'SecureStore no está disponible en este dispositivo.'
      );
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleDeleteSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      await SecureStore.deleteItemAsync(SENSITIVE_KEY);
      setIsSaved(false);
      setMaskedValue(null);
      Alert.alert('Código eliminado', 'El código fue borrado de SecureStore.');
    } catch {
      Alert.alert(
        'No se pudo eliminar',
        'SecureStore no está disponible en este dispositivo.'
      );
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleResetPreferences = useCallback((): void => {
    resetPreferences();
    Alert.alert(
      'Preferencias restablecidas',
      'La cartelera vuelve al orden A → Z, sin modo compacto y con todas las funciones.'
    );
  }, [resetPreferences]);

  // ===== SEMANA 12 · INICIO =====
  useEffect(() => {
    void refreshPermission();
  }, [refreshPermission]);

  const handleRegisterPush = useCallback(async (): Promise<void> => {
    const result = await registerForPush();

    if (result.token) {
      Alert.alert(
        'Notificaciones activas',
        'El Expo Push Token ya está disponible. Compártelo o pégalo en https://expo.dev/notifications para enviar un push de prueba.'
      );
      return;
    }

    if (result.error) {
      Alert.alert('No se pudo activar el push', result.error);
    }
  }, [registerForPush]);

  const handleShareToken = useCallback(async (): Promise<void> => {
    if (!pushToken) {
      return;
    }

    try {
      await Share.share({
        message: `Expo Push Token del Teatro Colón: ${pushToken}`,
      });
    } catch {
      Alert.alert(
        'No se pudo compartir',
        'Mantén pulsado el token para copiarlo manualmente.'
      );
    }
  }, [pushToken]);

  const handleTestNotification = useCallback(async (): Promise<void> => {
    const outcome = await scheduleTestNotification();

    if (!outcome.ok) {
      Alert.alert('No se pudo enviar el aviso', outcome.reason);
    }
  }, []);

  const handleTestReminder = useCallback(async (): Promise<void> => {
    const outcome = await scheduleTestReminder();

    if (outcome.ok) {
      Alert.alert(
        'Prueba programada',
        'El recordatorio llegará en 10 segundos. Mantén la app abierta para verlo en primer plano.'
      );
      return;
    }

    Alert.alert('No se pudo programar la prueba', outcome.reason);
  }, []);

  const handleToggleReminders = useCallback(
    async (value: boolean): Promise<void> => {
      setRemindersEnabled(value);

      if (!value) {
        const count = await cancelAllReminders();

        if (count > 0) {
          Alert.alert(
            'Recordatorios desactivados',
            `Se cancelaron ${count} aviso(s) programado(s) en el sistema.`
          );
        }
      }
    },
    [cancelAllReminders, setRemindersEnabled]
  );

  const handleCancelReminder = useCallback(
    async (itemId: string, playName: string): Promise<void> => {
      const cancelled = await cancelReminder(itemId);

      Alert.alert(
        cancelled ? 'Recordatorio cancelado' : 'Recordatorio retirado',
        cancelled
          ? `Se canceló el aviso de "${playName}".`
          : 'El aviso ya no estaba programado en el sistema; el registro local quedó limpio.'
      );
    },
    [cancelReminder]
  );

  const handleCancelAll = useCallback(async (): Promise<void> => {
    const count = await cancelAllReminders();

    Alert.alert(
      'Recordatorios cancelados',
      count > 0
        ? `Se cancelaron ${count} recordatorio(s) de función.`
        : 'No había recordatorios activos.'
    );
  }, [cancelAllReminders]);
  // ===== SEMANA 12 · FIN =====

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons
            name="options-outline"
            size={SIZES.iconLg}
            color={COLORS.accent}
          />
          <Text style={styles.headerTitle}>Ajustes</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Preferencias, notificaciones y seguridad del dispositivo
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Preferencias de la cartelera</Text>
        <Text style={styles.sectionHint}>
          Se guardan con MMKV y se aplican al instante, sin botón de guardar ni
          reiniciar la app.
        </Text>

        <SwitchRow
          label="Modo compacto"
          description="Afiche más bajo y menos datos por obra en la lista."
          value={compactMode}
          onValueChange={setCompactMode}
        />

        <SwitchRow
          label="Solo funciones con butacas"
          description="Oculta las obras agotadas de la cartelera."
          value={onlyAvailable}
          onValueChange={setOnlyAvailable}
        />

        <SegmentedControl
          label="Orden de la lista"
          description="Ordena alfabéticamente por título de la obra."
          value={sortOrder}
          options={SORT_OPTIONS}
          onChange={setSortOrder}
        />

        <SegmentedControl
          label="Obras por página"
          description="Controla cuántas tarjetas se cargan antes de usar «Mostrar más»."
          value={itemsPerPage}
          options={PAGE_OPTIONS}
          onChange={setItemsPerPage}
        />

        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
          onPress={handleResetPreferences}
          accessibilityRole="button"
          accessibilityLabel="Restablecer preferencias"
        >
          <Ionicons
            name="refresh-outline"
            size={SIZES.iconSm}
            color={COLORS.textSecondary}
          />
          <Text style={styles.resetButtonText}>Restablecer preferencias</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Seguridad (SecureStore)</Text>
        <Text style={styles.sectionHint}>
          El código de acceso de taquilla se cifra en Keychain (iOS) o Keystore
          (Android). Nunca se guarda en MMKV ni en AsyncStorage.
        </Text>

        <View style={styles.secureCard}>
          <View style={styles.secureHeader}>
            <View style={styles.secureIcon}>
              <Ionicons
                name="lock-closed"
                size={SIZES.iconMd}
                color={COLORS.accent}
              />
            </View>

            <View style={styles.secureHeaderText}>
              <Text style={styles.rowLabel}>Código de acceso de taquilla</Text>
              <Text style={styles.rowDesc}>
                Se genera un código nuevo cada vez que guardas.
              </Text>
            </View>

            <Text
              style={[
                styles.statusBadge,
                isSaved ? styles.statusSaved : styles.statusEmpty,
              ]}
            >
              {isSaved ? 'Guardado' : 'Sin guardar'}
            </Text>
          </View>

          {maskedValue && (
            <View style={styles.maskedBox}>
              <Text style={styles.maskedLabel}>Valor leído (enmascarado)</Text>
              <Text style={styles.maskedValue}>{maskedValue}</Text>
            </View>
          )}

          <View style={styles.secureActions}>
            <SecureAction
              label="Generar y guardar"
              icon="save-outline"
              onPress={() => {
                void handleSaveSensitive();
              }}
              variant="primary"
              disabled={isBusy}
            />
            <SecureAction
              label="Leer"
              icon="eye-outline"
              onPress={() => {
                void handleReadSensitive();
              }}
              disabled={isBusy}
            />
            <SecureAction
              label="Eliminar"
              icon="trash-outline"
              onPress={() => {
                void handleDeleteSensitive();
              }}
              variant="danger"
              disabled={isBusy}
            />
          </View>

          <Text style={styles.secureNote}>
            El código completo nunca se muestra en pantalla: solo una versión
            enmascarada.
          </Text>
        </View>

        {/* ===== SEMANA 12 · INICIO ===== */}
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <Text style={styles.sectionHint}>
          Recordatorios 2 horas antes de cada función y avisos de la
          cartelera. El token identifica a este dispositivo ante Expo.
        </Text>

        <View style={styles.notificationCard}>
          <View style={styles.secureHeader}>
            <View style={styles.secureIcon}>
              <Ionicons
                name="notifications"
                size={SIZES.iconMd}
                color={COLORS.accent}
              />
            </View>

            <View style={styles.secureHeaderText}>
              <Text style={styles.rowLabel}>Avisos del Teatro Colón</Text>
              <Text style={styles.rowDesc}>
                {isPhysicalDevice
                  ? 'Dispositivo físico · push y locales'
                  : 'Emulador · solo notificaciones locales'}
              </Text>
            </View>

            <Text
              style={[
                styles.statusBadge,
                permission === 'granted'
                  ? styles.statusSaved
                  : permission === 'denied'
                    ? styles.statusDenied
                    : styles.statusEmpty,
              ]}
            >
              {PERMISSION_LABELS[permission]}
            </Text>
          </View>

          <SwitchRow
            label="Recordatorios de función"
            description="Habilita el aviso 2 h antes desde el detalle de cada obra."
            value={remindersEnabled}
            onValueChange={(value) => {
              void handleToggleReminders(value);
            }}
          />

          <View style={styles.tokenBox}>
            <Text style={styles.maskedLabel}>Expo Push Token</Text>

            {pushToken ? (
              <Text selectable style={styles.tokenValue}>
                {pushToken}
              </Text>
            ) : (
              <Text style={styles.tokenFallback}>
                {projectId
                  ? 'Pulsa «Activar notificaciones» para solicitar el token al servidor de Expo.'
                  : 'Falta el projectId de EAS. Ejecuta `npx eas init` o agrega `expo.extra.eas.projectId` en app.json.'}
              </Text>
            )}

            <Text style={styles.tokenMeta}>
              Proyecto: {projectId ?? 'sin configurar'}
            </Text>
          </View>

          {!isPhysicalDevice ? (
            <Text style={styles.secureNote}>
              Los push tokens requieren un dispositivo físico con APNs o FCM.
              En el emulador solo funcionan las notificaciones locales.
            </Text>
          ) : null}

          {notificationError ? (
            <Text style={styles.notificationError}>{notificationError}</Text>
          ) : null}

          <View style={styles.secureActions}>
            <SecureAction
              label={pushToken ? 'Actualizar token' : 'Activar notificaciones'}
              icon="notifications-outline"
              onPress={() => {
                void handleRegisterPush();
              }}
              variant="primary"
              disabled={isRegistering}
            />

            {pushToken ? (
              <SecureAction
                label="Compartir token"
                icon="share-outline"
                onPress={() => {
                  void handleShareToken();
                }}
              />
            ) : null}

            {permission === 'denied' ? (
              <SecureAction
                label="Abrir ajustes"
                icon="settings-outline"
                onPress={() => {
                  void openSystemSettings();
                }}
              />
            ) : null}
          </View>

          <View style={styles.secureActions}>
            <SecureAction
              label="Probar aviso inmediato"
              icon="flash-outline"
              onPress={() => {
                void handleTestNotification();
              }}
            />
            <SecureAction
              label="Probar recordatorio (10 s)"
              icon="timer-outline"
              onPress={() => {
                void handleTestReminder();
              }}
            />
          </View>

          <Text style={styles.secureNote}>
            Pega el token en https://expo.dev/notifications para enviar un push
            real desde la Expo Push Tool.
          </Text>
        </View>

        {lastReceived ? (
          <View style={styles.infoBox}>
            <Text style={styles.maskedLabel}>
              Última notificación recibida
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.infoStrong}>{lastReceived.title}</Text>
            </Text>
            {lastReceived.body ? (
              <Text style={styles.infoLine}>{lastReceived.body}</Text>
            ) : null}
            <Text style={styles.infoLine}>
              {formatScheduleDate(lastReceived.receivedAt)}
              {lastReceived.payload?.itemId
                ? ` · obra ${lastReceived.payload.itemId}`
                : ''}
            </Text>
          </View>
        ) : null}

        {reminderList.length > 0 ? (
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <Text style={styles.rowLabel}>
                Recordatorios programados ({reminderList.length})
              </Text>

              <Pressable
                onPress={() => {
                  void handleCancelAll();
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
                    void handleCancelReminder(
                      reminder.itemId,
                      reminder.playName
                    );
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Cancelar el recordatorio de ${reminder.playName}`}
                  style={({ pressed }) =>
                    pressed ? styles.reminderCancelPressed : undefined
                  }
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={SIZES.iconMd}
                    color={COLORS.error}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}
        {/* ===== SEMANA 12 · FIN ===== */}

        <Text style={styles.sectionTitle}>Almacenamiento de la app</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>
            <Text style={styles.infoStrong}>MMKV</Text> · preferencias
            sincrónicas de la cartelera.
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoStrong}>AsyncStorage</Text> · copia de la
            cartelera para mostrarla sin red.
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoStrong}>SecureStore</Text> · código
            sensible de taquilla cifrado por el sistema.
          </Text>
        </View>

        <View style={styles.nativeNotice}>
          <Ionicons
            name="phone-portrait-outline"
            size={SIZES.iconSm}
            color={COLORS.textMuted}
          />
          <Text style={styles.nativeNoticeText}>
            MMKV requiere un build nativo: ejecuta `pnpm prebuild` y luego
            `pnpm android` o `pnpm ios`.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  sectionHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  rowDesc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xxs,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  preferenceBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  segmentText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  resetButtonPressed: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  secureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  secureIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureHeaderText: {
    flex: 1,
  },
  statusBadge: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  statusSaved: {
    color: COLORS.success,
    backgroundColor: '#1f3323',
  },
  statusEmpty: {
    color: COLORS.textMuted,
    backgroundColor: COLORS.surfaceAlt,
  },
  statusDenied: {
    color: COLORS.error,
    backgroundColor: '#3a1a1a',
  },
  notificationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accentDim,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  tokenBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  tokenValue: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
    letterSpacing: 0.5,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  tokenFallback: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  tokenMeta: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  notificationError: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  reminderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  cancelAll: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.error,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  reminderDate: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xxs,
  },
  reminderCancelPressed: {
    opacity: 0.6,
  },
  maskedBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xxs,
  },
  maskedLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  maskedValue: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  secureActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  actionPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionDanger: {
    borderColor: COLORS.error,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  actionTextPrimary: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  actionTextDanger: {
    color: COLORS.error,
  },
  secureNote: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  infoLine: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  infoStrong: {
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  nativeNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.sm,
  },
  nativeNoticeText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
});
// ===== SEMANA 07 · FIN =====
