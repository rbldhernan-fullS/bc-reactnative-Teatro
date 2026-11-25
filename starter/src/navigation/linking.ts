// ===== SEMANA 03 · INICIO =====
import type { LinkingOptions } from '@react-navigation/native';
import type { RootTabParamList } from './types';

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['/', 'teatro://'],
  config: {
    screens: {
      Home: {
        path: '',
        initialRouteName: 'HomeList',
        screens: {
          HomeList: '',
          HomeDetail: 'obra/:id',
        },
      },
      Saved: 'guardados',
    },
  },
};
// ===== SEMANA 03 · FIN =====
