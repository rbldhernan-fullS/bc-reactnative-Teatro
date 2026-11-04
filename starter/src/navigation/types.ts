// ===== SEMANA 03 · INICIO =====
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeList: undefined;

  HomeDetail: {
    id: string;
    name: string;
  };

  Create: undefined;

  Edit: {
    id: string;
  };

  SeatMap: {
    id: string;
    name: string;
  };

  Camera: {
    targetId: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Saved: undefined;
  Settings: undefined;
  Profile: undefined;
};
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 08 · INICIO =====
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
// ===== SEMANA 08 · FIN =====

// ===== SEMANA 04 · INICIO =====
export type DetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'HomeDetail'
>;
// ===== SEMANA 04 · FIN =====

// ===== SEMANA 06 · INICIO =====
export type EditScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'Edit'
>;
// ===== SEMANA 06 · FIN =====

// ===== SEMANA 10 · INICIO =====
export type SeatMapScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'SeatMap'
>;
// ===== SEMANA 10 · FIN =====

// ===== SEMANA 11 · INICIO =====
export type CameraScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'Camera'
>;
// ===== SEMANA 11 · FIN =====

// ===== SEMANA 03 · INICIO =====
export type SavedScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Saved'
>;
// ===== SEMANA 03 · FIN =====

// ===== SEMANA 08 · INICIO =====
export type ProfileScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Profile'
>;

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;
// ===== SEMANA 08 · FIN =====
