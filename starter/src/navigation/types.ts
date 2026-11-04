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
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Saved: undefined;
};
// ===== SEMANA 03 · FIN =====

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

// ===== SEMANA 03 · INICIO =====
export type SavedScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Saved'
>;
// ===== SEMANA 03 · FIN =====
