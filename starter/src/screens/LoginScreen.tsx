// ============================================
// SCREEN: LoginScreen — Semana 08
// Formulario RHF + Zod conectado al authStore (tokens en SecureStore)
// ============================================

import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { FormField } from '../components/FormField';
import { loginSchema } from '../schemas/authSchema';
import type { LoginFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../stores/authStore';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import type { LoginScreenProps } from '../navigation/types';

const DEMO_USERNAME = 'emilys';
const DEMO_PASSWORD = 'emilyspass';

export function LoginScreen({
  navigation,
}: LoginScreenProps): React.JSX.Element {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Limpia el error compartido al entrar y al salir de la pantalla.
  useEffect(() => {
    clearError();
    return clearError;
  }, [clearError]);

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
      // RootNavigator detecta isAuthenticated === true y monta AppNavigator.
    } catch {
      // El store ya tradujo el error; se muestra en el banner.
    }
  };

  const handleFillDemo = useCallback((): void => {
    reset({ username: DEMO_USERNAME, password: DEMO_PASSWORD });
  }, [reset]);

  const isBusy = isLoading || isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado del Club */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🎭</Text>
            </View>
            <Text style={styles.clubName}>Club Teatro Colón</Text>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>
              Accede a tu cartelera, tus obras guardadas y los beneficios de
              socio.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formCard}>
            <FormField<LoginFormValues>
              control={control}
              name="username"
              label="Usuario"
              required
              placeholder="tu_usuario"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <FormField<LoginFormValues>
              control={control}
              name="password"
              label="Contraseña"
              required
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={SIZES.iconSm}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isBusy && styles.submitButtonPressed,
                isBusy && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isBusy}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
              accessibilityState={{ disabled: isBusy }}
            >
              {isBusy ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="log-in-outline"
                    size={SIZES.iconSm}
                    color={COLORS.background}
                  />
                  <Text style={styles.submitButtonText}>Entrar al Club</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Credenciales de prueba */}
          <View style={styles.demoCard}>
            <View style={styles.demoHeader}>
              <Ionicons
                name="key-outline"
                size={SIZES.iconSm}
                color={COLORS.accent}
              />
              <Text style={styles.demoTitle}>Credenciales de prueba</Text>
            </View>
            <Text style={styles.demoText}>
              Usuario: <Text style={styles.demoStrong}>{DEMO_USERNAME}</Text>
              {'  ·  '}
              Contraseña: <Text style={styles.demoStrong}>{DEMO_PASSWORD}</Text>
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.demoButton,
                pressed && styles.demoButtonPressed,
              ]}
              onPress={handleFillDemo}
              accessibilityRole="button"
              accessibilityLabel="Rellenar credenciales de prueba"
            >
              <Text style={styles.demoButtonText}>Rellenar demo</Text>
            </Pressable>
          </View>

          {/* Enlace a registro */}
          <Pressable
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="button"
            accessibilityLabel="Crear una cuenta nueva"
          >
            <Text style={styles.linkText}>
              ¿Aún no eres socio?{' '}
              <Text style={styles.linkHighlight}>Crear cuenta</Text>
            </Text>
          </Pressable>

          <View style={styles.securityNote}>
            <Ionicons
              name="lock-closed-outline"
              size={SIZES.iconSm}
              color={COLORS.textMuted}
            />
            <Text style={styles.securityText}>
              Tus tokens se guardan cifrados en SecureStore y nunca se muestran
              en pantalla.
            </Text>
          </View>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  logoEmoji: {
    fontSize: TYPOGRAPHY.size.display,
  },
  clubName: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    paddingHorizontal: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#3a1518',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
    minHeight: 48,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.accentHover,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  demoCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  demoTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  demoText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  demoStrong: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  demoButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  demoButtonPressed: {
    backgroundColor: COLORS.surface,
  },
  demoButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  linkHighlight: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  securityText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    textAlign: 'center',
  },
});
