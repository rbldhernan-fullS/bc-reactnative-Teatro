// ============================================
// NAVIGATION TYPES — Semana 03: Dominio Teatro
// Tipado estricto de parámetros para Tab y Stack Navigators (Sin any)
// ============================================

import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Item, TheatreGenre } from '../types';

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
    subtitle: string;
    imageUri: string;
    genre: TheatreGenre;
    date: string;
    time: string;
    price: number;
    hall: string;
    duration: string;
    availableSeats: number;
    rating: number;
    synopsis: string;
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

// Prop de navegación para HomeScreen (Stack anidado dentro de Tabs)
export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeList'>,
  BottomTabNavigationProp<RootTabParamList>
>;

// Props para DetailScreen
export type DetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeDetail'>;

// Props para FavoritesScreen
export type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Favorites'>,
  NativeStackNavigationProp<HomeStackParamList>
>;
