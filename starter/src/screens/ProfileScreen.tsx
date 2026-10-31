// ============================================
// SCREEN: ProfileScreen — Semana 08
// Perfil del socio autenticado + acceso a sus obras guardadas y logout
// ============================================

import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { selectSavedCount, useSavedStore } from '../stores/savedStore';
import { useAuthStore } from '../stores/authStore';
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY } from '../theme';
import type { ProfileScreenNavigationProp } from '../navigation/types';

/** Convierte el id numérico en un número de socio legible. */
function formatMemberNumber(id: number | undefined): string {
  if (id === undefined) {
    return '—';
  }

  return `TC-${String(id).padStart(4, '0')}`;
}

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const savedCount = useSavedStore(selectSavedCount);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'Socio del Club';

  const initial =
    user?.firstName?.[0]?.toUpperCase() ??
    user?.username?.[0]?.toUpperCase() ??
    '?';

  const handleLogoutPress = useCallback((): void => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres salir del Club Teatro Colón?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            void logout();
          },
        },
      ]
    );
  }, [logout]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons
            name="person-circle-outline"
            size={SIZES.iconLg}
            color={COLORS.accent}
          />
          <Text style={styles.headerTitle}>Mi cuenta</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Perfil del socio y seguridad de la sesión
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de identidad */}
        <View style={styles.identityCard}>
          <View style={styles.avatarWrapper}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
            <View style={styles.clubBadge}>
              <Ionicons
                name="star"
                size={SIZES.iconSm - 6}
                color={COLORS.background}
              />
            </View>
          </View>

          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{user?.email ?? '—'}</Text>

          <View style={styles.membershipPill}>
            <Text style={styles.membershipText}>MIEMBRO DEL CLUB</Text>
          </View>
        </View>

        {/* Información de la cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del socio</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Usuario</Text>
            <Text style={styles.infoValue}>{user?.username ?? '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° de socio</Text>
            <Text style={styles.infoValue}>
              {formatMemberNumber(user?.id)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Membresía</Text>
            <Text style={styles.infoValue}>Club Teatro Colón</Text>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Obras guardadas</Text>
            <Text style={styles.infoValue}>
              {savedCount} {savedCount === 1 ? 'obra' : 'obras'}
            </Text>
          </View>
        </View>

        {/* Acción de dominio: ir a guardados */}
        <Pressable
          style={({ pressed }) => [
            styles.savedButton,
            pressed && styles.savedButtonPressed,
          ]}
          onPress={() => navigation.navigate('Saved')}
          accessibilityRole="button"
          accessibilityLabel="Ver mis obras guardadas"
        >
          <Ionicons name="bookmark-outline" size={SIZES.iconMd} color={COLORS.accent} />
          <Text style={styles.savedButtonText}>Ver mis obras guardadas</Text>
          <Ionicons
            name="chevron-forward"
            size={SIZES.iconSm}
            color={COLORS.textMuted}
          />
        </Pressable>

        {/* Seguridad de la sesión */}
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={SIZES.iconMd}
              color={COLORS.success}
            />
            <Text style={styles.securityTitle}>Sesión protegida</Text>
          </View>
          <Text style={styles.securityText}>
            El access y el refresh token viven cifrados en SecureStore. Esta
            pantalla nunca muestra los tokens en texto plano.
          </Text>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogoutPress}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out-outline" size={SIZES.iconMd} color={COLORS.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
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
    gap: SPACING.base,
  },
  identityCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.xxs,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  clubBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  membershipPill: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.full,
  },
  membershipText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    flexShrink: 1,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  savedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: SPACING.md,
  },
  savedButtonPressed: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.9,
  },
  savedButtonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  securityTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  securityText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: SPACING.md,
  },
  logoutButtonPressed: {
    backgroundColor: '#3a1518',
    opacity: 0.9,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.error,
  },
});
