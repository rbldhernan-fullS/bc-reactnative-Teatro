// ============================================
// SCREEN: RegisterScreen — Semana 08
// Registro simulado con RHF + Zod; al finalizar redirige al Login
// ============================================

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { registerSchema } from '../schemas/authSchema';
import type { RegisterFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../stores/authStore';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import type { RegisterScreenProps } from '../navigation/types';

export function RegisterScreen({
  navigation,
}: RegisterScreenProps): React.JSX.Element {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    clearError();
    return clearError;
  }, [clearError]);

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      Alert.alert(
        'Cuenta creada',
        'El registro es simulado en esta demo. Inicia sesión con las credenciales de prueba para entrar al Club.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        { cancelable: false }
      );
    } catch {
      // El store ya tradujo el error; se muestra en el banner.
    }
  };

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
          {/* Encabezado */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Volver al inicio de sesión"
            >
              <Ionicons
                name="arrow-back"
                size={SIZES.iconMd}
                color={COLORS.accent}
              />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.clubName}>Club Teatro Colón</Text>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>
                Regístrate para guardar tus obras favoritas y recibir los
                beneficios de socio.
              </Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formCard}>
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <FormField<RegisterFormValues>
                  control={control}
                  name="firstName"
                  label="Nombre"
                  required
                  placeholder="Emily"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.halfField}>
                <FormField<RegisterFormValues>
                  control={control}
                  name="lastName"
                  label="Apellido"
                  required
                  placeholder="Johnson"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <FormField<RegisterFormValues>
              control={control}
              name="username"
              label="Usuario"
              required
              placeholder="mi_usuario"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormField<RegisterFormValues>
              control={control}
              name="email"
              label="Correo electrónico"
              required
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormField<RegisterFormValues>
              control={control}
              name="password"
              label="Contraseña"
              required
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormField<RegisterFormValues>
              control={control}
              name="confirmPassword"
              label="Confirmar contraseña"
              required
              placeholder="Repite tu contraseña"
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
              accessibilityLabel="Crear cuenta"
              accessibilityState={{ disabled: isBusy }}
            >
              {isBusy ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="person-add-outline"
                    size={SIZES.iconSm}
                    color={COLORS.background}
                  />
                  <Text style={styles.submitButtonText}>Crear cuenta</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Aviso de simulación */}
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={SIZES.iconSm}
              color={COLORS.accent}
            />
            <Text style={styles.infoText}>
              El registro es simulado: dummyjson no persiste cuentas nuevas. Al
              terminar, inicia sesión con <Text style={styles.infoStrong}>emilys</Text> /{' '}
              <Text style={styles.infoStrong}>emilyspass</Text>.
            </Text>
          </View>

          <Pressable
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio de sesión"
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkHighlight}>Iniciar sesión</Text>
            </Text>
          </Pressable>
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
    paddingTop: SPACING.md,
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: SPACING.xxs,
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
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  rowFields: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  halfField: {
    flex: 1,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  infoStrong: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weight.bold,
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
});
