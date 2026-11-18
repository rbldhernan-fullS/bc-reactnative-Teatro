// ===== SEMANA 01 · INICIO =====
import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 08 · INICIO =====
import { selectSavedCount, useSavedStore } from '../../../stores/savedStore';
import { useAuthStore } from '../../../stores/authStore';
import { confirm } from '../../../platform/notify';
import { COLORS, SIZES } from '../../../theme';
import { profileStyles } from '../styles';
import type { ProfileScreenNavigationProp } from '../../../navigation/types';

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

  const initial = user?.firstName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? '?';

  const handleLogoutPress = useCallback((): void => {
    // `confirm` usa `window.confirm` en web y `Alert.alert` en nativo (E‑10).
    void (async (): Promise<void> => {
      const accepted = await confirm({
        title: 'Cerrar sesión',
        message: '¿Seguro que quieres salir del Club Teatro Colón?',
        confirmText: 'Salir',
        cancelText: 'Cancelar',
        destructive: true,
      });

      if (accepted) {
        await logout();
      }
    })();
  }, [logout]);

  return (
    <SafeAreaView style={profileStyles.safeArea} edges={['top']}>
      <View style={profileStyles.header}>
        <View style={profileStyles.headerTitleRow}>
          <Ionicons name="person-circle-outline" size={SIZES.iconLg} color={COLORS.accent} />
          <Text style={profileStyles.headerTitle}>Mi cuenta</Text>
        </View>
        <Text style={profileStyles.headerSubtitle}>Perfil del socio y seguridad de la sesión</Text>
      </View>

      <ScrollView
        style={profileStyles.container}
        contentContainerStyle={profileStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={profileStyles.identityCard}>
          <View style={profileStyles.avatarWrapper}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={profileStyles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={profileStyles.avatarFallback}>
                <Text style={profileStyles.avatarInitial}>{initial}</Text>
              </View>
            )}
            <View style={profileStyles.clubBadge}>
              <Ionicons name="star" size={SIZES.iconSm - 6} color={COLORS.background} />
            </View>
          </View>

          <Text style={profileStyles.name}>{fullName}</Text>
          <Text style={profileStyles.email}>{user?.email ?? '—'}</Text>

          <View style={profileStyles.membershipPill}>
            <Text style={profileStyles.membershipText}>MIEMBRO DEL CLUB</Text>
          </View>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Información del socio</Text>

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Usuario</Text>
            <Text style={profileStyles.infoValue}>{user?.username ?? '—'}</Text>
          </View>

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>N° de socio</Text>
            <Text style={profileStyles.infoValue}>{formatMemberNumber(user?.id)}</Text>
          </View>

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Membresía</Text>
            <Text style={profileStyles.infoValue}>Club Teatro Colón</Text>
          </View>

          <View style={[profileStyles.infoRow, profileStyles.infoRowLast]}>
            <Text style={profileStyles.infoLabel}>Obras guardadas</Text>
            <Text style={profileStyles.infoValue}>
              {savedCount} {savedCount === 1 ? 'obra' : 'obras'}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            profileStyles.savedButton,
            pressed && profileStyles.savedButtonPressed,
          ]}
          onPress={() => navigation.navigate('Saved')}
          accessibilityRole="button"
          accessibilityLabel="Ver mis obras guardadas"
        >
          <Ionicons name="bookmark-outline" size={SIZES.iconMd} color={COLORS.accent} />
          <Text style={profileStyles.savedButtonText}>Ver mis obras guardadas</Text>
          <Ionicons name="chevron-forward" size={SIZES.iconSm} color={COLORS.textMuted} />
        </Pressable>

        <View style={profileStyles.securityCard}>
          <View style={profileStyles.securityHeader}>
            <Ionicons name="shield-checkmark-outline" size={SIZES.iconMd} color={COLORS.success} />
            <Text style={profileStyles.securityTitle}>Sesión protegida</Text>
          </View>
          <Text style={profileStyles.securityText}>
            El access y el refresh token viven cifrados en SecureStore. Esta pantalla nunca muestra
            los tokens en texto plano.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            profileStyles.logoutButton,
            pressed && profileStyles.logoutButtonPressed,
          ]}
          onPress={handleLogoutPress}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out-outline" size={SIZES.iconMd} color={COLORS.error} />
          <Text style={profileStyles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
// ===== SEMANA 08 · FIN =====
