// ===== SEMANA 01 · INICIO =====
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
// ===== SEMANA 03 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { useForm } from 'react-hook-form';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 08 · INICIO =====
import { zodResolver } from '@hookform/resolvers/zod';
// ===== SEMANA 08 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 08 · INICIO =====
import { FormField } from '../../../components/ui/FormField';
import { loginSchema } from '../schemas/authSchema';
import type { LoginFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../../../stores/authStore';
import { COLORS, SIZES } from '../../../theme';
import { loginStyles } from '../styles';
import type { LoginScreenProps } from '../../../navigation/types';
// ===== SEMANA 12 · INICIO =====
import { logger } from '../../../utils/logger';
// ===== SEMANA 12 · FIN =====

const DEMO_USERNAME = 'emilys';
const DEMO_PASSWORD = 'emilyspass';

export function LoginScreen({ navigation }: LoginScreenProps): React.JSX.Element {
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

  useEffect(() => clearError, [clearError]);

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
    } catch (error) {
      // El store ya publica el mensaje en `error`; aquí solo se registra.
      logger.warn('No se pudo iniciar sesión', error);
    }
  };

  const handleFillDemo = useCallback((): void => {
    reset({ username: DEMO_USERNAME, password: DEMO_PASSWORD });
  }, [reset]);

  const isBusy = isLoading || isSubmitting;

  return (
    <SafeAreaView style={loginStyles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={loginStyles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={loginStyles.container}
          contentContainerStyle={loginStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={loginStyles.header}>
            <View style={loginStyles.logoCircle}>
              <Text style={loginStyles.logoEmoji}>🎭</Text>
            </View>
            <Text style={loginStyles.clubName}>Club Teatro Colón</Text>
            <Text style={loginStyles.title}>Iniciar sesión</Text>
            <Text style={loginStyles.subtitle}>
              Accede a tu cartelera, tus obras guardadas y los beneficios de socio.
            </Text>
          </View>

          <View style={loginStyles.formCard}>
            <FormField<LoginFormValues>
              control={control}
              name="username"
              maxLength={50}
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
              maxLength={128}
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
              <View style={loginStyles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={SIZES.iconSm} color={COLORS.error} />
                <Text style={loginStyles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                loginStyles.submitButton,
                pressed && !isBusy && loginStyles.submitButtonPressed,
                isBusy && loginStyles.submitButtonDisabled,
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
                  <Ionicons name="log-in-outline" size={SIZES.iconSm} color={COLORS.background} />
                  <Text style={loginStyles.submitButtonText}>Entrar al Club</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={loginStyles.demoCard}>
            <View style={loginStyles.demoHeader}>
              <Ionicons name="key-outline" size={SIZES.iconSm} color={COLORS.accent} />
              <Text style={loginStyles.demoTitle}>Credenciales de prueba</Text>
            </View>
            <Text style={loginStyles.demoText}>
              Usuario: <Text style={loginStyles.demoStrong}>{DEMO_USERNAME}</Text>
              {'  ·  '}
              Contraseña: <Text style={loginStyles.demoStrong}>{DEMO_PASSWORD}</Text>
            </Text>
            <Pressable
              style={({ pressed }) => [
                loginStyles.demoButton,
                pressed && loginStyles.demoButtonPressed,
              ]}
              onPress={handleFillDemo}
              accessibilityRole="button"
              accessibilityLabel="Rellenar credenciales de prueba"
            >
              <Text style={loginStyles.demoButtonText}>Rellenar demo</Text>
            </Pressable>
          </View>

          <Pressable
            style={loginStyles.linkButton}
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="button"
            accessibilityLabel="Crear una cuenta nueva"
          >
            <Text style={loginStyles.linkText}>
              ¿Aún no eres socio? <Text style={loginStyles.linkHighlight}>Crear cuenta</Text>
            </Text>
          </Pressable>

          <View style={loginStyles.securityNote}>
            <Ionicons name="lock-closed-outline" size={SIZES.iconSm} color={COLORS.textMuted} />
            <Text style={loginStyles.securityText}>
              Tus tokens se guardan cifrados en SecureStore y nunca se muestran en pantalla.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// ===== SEMANA 08 · FIN =====
