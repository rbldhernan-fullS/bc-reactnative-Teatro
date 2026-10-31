// ============================================
// NAVIGATION TYPES — Semanas 06, 07 y 08: Dominio Teatro
// Tipado estricto de parámetros para Tab y Stack Navigators (Sin tipos dinámicos)
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

  /** Formulario para publicar una obra nueva */
  Create: undefined;

  /** Formulario para editar una obra existente */
  Edit: {
    id: string;
  };

  /** Mapa interactivo de butacas de la función */
  SeatMap: {
    id: string;
    name: string;
  };

  /** Cámara a pantalla completa para capturar el afiche local */
  Camera: {
    /** Id de la obra, o `poster-draft` mientras se crea */
    targetId: string;
  };
};

// ============================================
// 2. TAB NAVIGATOR — Pantallas de nivel raíz
// ============================================
export type RootTabParamList = {
  /** Pestaña principal con Stack anidado tipado con NavigatorScreenParams */
  Home: NavigatorScreenParams<HomeStackParamList>;
  /** Pestaña de obras guardadas (su estado vive en Zustand) */
  Saved: undefined;
  /** Pestaña de ajustes: preferencias MMKV y código seguro */
  Settings: undefined;
  /** Pestaña del perfil del miembro autenticado */
  Profile: undefined;
};

// ============================================
// 3. AUTH STACK — Login y Registro (sin autenticación)
// ============================================
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ============================================
// 4. HELPERS DE TIPADO PARA PANTALLAS
// ============================================

// Props para DetailScreen
export type DetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'HomeDetail'
>;

// Props para EditScreen
export type EditScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'Edit'
>;

// Props para SeatMapScreen
export type SeatMapScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'SeatMap'
>;

// Props para CameraScreen
export type CameraScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'Camera'
>;

// Props para SavedScreen
export type SavedScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Saved'
>;

// Props para ProfileScreen
export type ProfileScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Profile'
>;

// Props para LoginScreen
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;

// Props para RegisterScreen
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;
