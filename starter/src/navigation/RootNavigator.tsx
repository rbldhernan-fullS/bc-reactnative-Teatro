// ============================================
// NAVIGATION: RootNavigator — Semanas 06 y 07
// Tab Navigator raíz con Stack anidado, badge, creación/edición y Ajustes
// ============================================

import React from 'react';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { EditScreen } from '../screens/EditScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';
import { selectSavedCount, useSavedStore } from '../stores/savedStore';
import type { HomeStackParamList, RootTabParamList } from './types';

// ============================================
// 1. STACK NAVIGATOR ANIDADO (Pestaña Cartelera)
// ============================================
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.accent,
        headerTitleStyle: {
          fontWeight: TYPOGRAPHY.weight.bold,
          color: COLORS.textPrimary,
          fontSize: TYPOGRAPHY.size.md,
        },
        headerShadowVisible: false,
      }}
    >
      {/* Lista de obras en cartelera */}
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Detalle de la obra seleccionada con título dinámico */}
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route, navigation }) => ({
          title: route.params.name,
          headerBackTitle: 'Cartelera',
          headerShown: true,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Edit', { id: route.params.id })}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${route.params.name}`}
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            >
              <Ionicons
                name="create-outline"
                size={SIZES.iconMd}
                color={COLORS.accent}
              />
            </Pressable>
          ),
        })}
      />

      {/* Formulario de creación de una obra nueva */}
      <HomeStack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Nueva obra',
          headerBackTitle: 'Cartelera',
          presentation: 'modal',
        }}
      />

      {/* Formulario de edición con defaultValues desde la API */}
      <HomeStack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          title: 'Editar obra',
          headerBackTitle: 'Detalle',
        }}
      />
    </HomeStack.Navigator>
  );
}

// ============================================
// 2. TAB NAVIGATOR RAÍZ
// ============================================
const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Selector: el navigator solo se vuelve a renderizar si cambia el conteo.
  const savedCount = useSavedStore(selectSavedCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: SIZES.tabBarContentHeight + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: SIZES.tabBarPaddingTop,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.size.sm,
          fontWeight: TYPOGRAPHY.weight.semibold,
        },
      })}
    >
      {/* Pestaña 1: Cartelera (con Stack anidado para navegar a detalles) */}
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Cartelera',
        }}
      />

      {/* Pestaña 2: Obras Guardadas (conteo en vivo desde Zustand) */}
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Guardados',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accent,
            color: COLORS.background,
            fontSize: TYPOGRAPHY.size.xs,
            fontWeight: TYPOGRAPHY.weight.bold,
          },
        }}
      />

      {/* Pestaña 3: Ajustes (MMKV + SecureStore) */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
}
