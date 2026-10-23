// ============================================
// NAVIGATION: RootNavigator — Semana 04: Estado Global
// Tab Navigator raíz con Stack anidado y badge conectado a Zustand
// ============================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { HomeScreen } from '../screens/HomeScreen';
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
        options={({ route }) => ({
          title: route.params.name,
          headerBackTitle: 'Cartelera',
          headerShown: true,
        })}
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
          } else {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.tabActive,
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
            backgroundColor: COLORS.tabActive,
            color: COLORS.background,
            fontSize: TYPOGRAPHY.size.xs,
            fontWeight: TYPOGRAPHY.weight.bold,
          },
        }}
      />
    </Tab.Navigator>
  );
}
