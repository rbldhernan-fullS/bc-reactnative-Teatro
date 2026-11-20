// ===== SEMANA 01 · INICIO =====
import React, { useEffect } from 'react';
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
import { notify } from '../../../platform/notify';
import { registerSchema } from '../schemas/authSchema';
import type { RegisterFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../../../stores/authStore';
import { COLORS, SIZES } from '../../../theme';
import { registerStyles } from '../styles';
import type { RegisterScreenProps } from '../../../navigation/types';

export function RegisterScreen({ navigation }: RegisterScreenProps): React.JSX.Element {
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

  useEffect(() => clearError, [clearError]);

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      notify(
        'Cuenta creada',
        'El registro es simulado en esta demo. Inicia sesión con las credenciales de prueba para entrar al Club.',
      );
      navigation.navigate('Login');
    } catch {
      // El mensaje de error lo muestra el formulario desde el store.
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <SafeAreaView style={registerStyles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={registerStyles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={registerStyles.container}
          contentContainerStyle={registerStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={registerStyles.header}>
            <Pressable
              style={registerStyles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Volver al inicio de sesión"
            >
              <Ionicons name="arrow-back" size={SIZES.iconMd} color={COLORS.accent} />
            </Pressable>

            <View style={registerStyles.headerText}>
              <Text style={registerStyles.clubName}>Club Teatro Colón</Text>
              <Text style={registerStyles.title}>Crear cuenta</Text>
              <Text style={registerStyles.subtitle}>
                Regístrate para guardar tus obras favoritas y recibir los beneficios de socio.
              </Text>
            </View>
          </View>

          <View style={registerStyles.formCard}>
            <View style={registerStyles.rowFields}>
              <View style={registerStyles.halfField}>
                <FormField<RegisterFormValues>
                  control={control}
                  name="firstName"
                  maxLength={50}
                  label="Nombre"
                  required
                  placeholder="Emily"
                  autoCapitalize="words"
                />
              </View>

              <View style={registerStyles.halfField}>
                <FormField<RegisterFormValues>
                  control={control}
                  name="lastName"
                  maxLength={50}
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
              maxLength={50}
              label="Usuario"
              required
              placeholder="mi_usuario"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormField<RegisterFormValues>
              control={control}
              name="email"
              maxLength={254}
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
              maxLength={128}
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
              maxLength={128}
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
              <View style={registerStyles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={SIZES.iconSm} color={COLORS.error} />
                <Text style={registerStyles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                registerStyles.submitButton,
                pressed && !isBusy && registerStyles.submitButtonPressed,
                isBusy && registerStyles.submitButtonDisabled,
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
                  <Text style={registerStyles.submitButtonText}>Crear cuenta</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={registerStyles.infoCard}>
            <Ionicons name="information-circle-outline" size={SIZES.iconSm} color={COLORS.accent} />
            <Text style={registerStyles.infoText}>
              El registro es simulado: dummyjson no persiste cuentas nuevas. Al terminar, inicia
              sesión con <Text style={registerStyles.infoStrong}>emilys</Text> /{' '}
              <Text style={registerStyles.infoStrong}>emilyspass</Text>.
            </Text>
          </View>

          <Pressable
            style={registerStyles.linkButton}
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio de sesión"
          >
            <Text style={registerStyles.linkText}>
              ¿Ya tienes cuenta? <Text style={registerStyles.linkHighlight}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// ===== SEMANA 08 · FIN =====
