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
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Favorites: undefined;
};

export type DetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'HomeDetail'
>;

export type FavoritesScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Favorites'
>;
// ===== SEMANA 03 · FIN =====
