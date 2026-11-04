// ===== SEMANA 01 · INICIO =====
import React from 'react';
import { Pressable } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 03 · INICIO =====
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 06 · INICIO =====
import { DetailScreen } from '../screens/DetailScreen';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 05 · INICIO =====
import { SavedScreen } from '../screens/SavedScreen';
// ===== SEMANA 05 · FIN =====
// ===== SEMANA 06 · INICIO =====
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { EditScreen } from '../screens/EditScreen';
// ===== SEMANA 06 · FIN =====
// ===== SEMANA 07 · INICIO =====
import { SettingsScreen } from '../screens/SettingsScreen';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';
import { selectSavedCount, useSavedStore } from '../stores/savedStore';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 03 · INICIO =====
import type { HomeStackParamList, RootTabParamList } from './types';

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
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

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

      {/* ===== SEMANA 05 · INICIO ===== */}
      <HomeStack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Nueva obra',
          headerBackTitle: 'Cartelera',
          presentation: 'modal',
        }}
      />
      {/* ===== SEMANA 05 · FIN ===== */}

      {/* ===== SEMANA 06 · INICIO ===== */}
      <HomeStack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          title: 'Editar obra',
          headerBackTitle: 'Detalle',
        }}
      />
      {/* ===== SEMANA 06 · FIN ===== */}
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  // ===== SEMANA 04 · INICIO =====
  const insets = useSafeAreaInsets();

  const savedCount = useSavedStore(selectSavedCount);
  // ===== SEMANA 04 · FIN =====

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
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Cartelera',
        }}
      />

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

      {/* ===== SEMANA 07 · INICIO ===== */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
        }}
      />
      {/* ===== SEMANA 07 · FIN ===== */}
    </Tab.Navigator>
  );
}
// ===== SEMANA 03 · FIN =====
