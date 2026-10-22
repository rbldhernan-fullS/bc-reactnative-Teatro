// ============================================
// NAVIGATION: RootNavigator — Dominio Teatro
// Tab Navigator raíz con Stack Navigator anidado
// ============================================

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { COLORS, TYPOGRAPHY } from '../theme';
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else {
            iconName = focused ? 'heart' : 'heart-outline';
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
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.size.xs,
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

      {/* Pestaña 2: Obras Favoritas */}
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
        }}
      />
    </Tab.Navigator>
  );
}
