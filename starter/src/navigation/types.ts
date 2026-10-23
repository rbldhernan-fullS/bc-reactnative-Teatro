// ============================================
// NAVIGATION TYPES — Semana 03: Dominio Teatro
// Tipado estricto de parámetros para Tab y Stack Navigators (Sin any)
// ============================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

// ============================================
// 1. STACK NAVIGATOR — Anidado en la pestaña Home
// ============================================
export type HomeStackParamList = {
  /** Pantalla de catálogo de obras con FlatList y búsqueda */
  HomeList: undefined;

  /** Pantalla de detalle de la obra seleccionada */
  HomeDetail: {
    id: string;
    name: string;
  };
};

// ============================================
// 2. TAB NAVIGATOR — Pantallas de nivel raíz
// ============================================
export type RootTabParamList = {
  /** Pestaña principal con Stack anidado tipado con NavigatorScreenParams */
  Home: NavigatorScreenParams<HomeStackParamList>;
  /** Pestaña de obras guardadas / favoritas */
  Favorites: undefined;
};

// ============================================
// 3. HELPERS DE TIPADO PARA PANTALLAS
// ============================================

// Props para DetailScreen
export type DetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'HomeDetail'
>;

// Props para FavoritesScreen
export type FavoritesScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Favorites'
>;
