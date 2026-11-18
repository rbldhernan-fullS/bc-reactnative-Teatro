// ===== SEMANA 12 · INICIO =====
import type { LinkingOptions } from '@react-navigation/native';

import type { RootTabParamList } from './types';

/**
 * Enlaces profundos de la app.
 *
 * En web cada pestaña y cada ficha tienen URL propia, así que se puede
 * compartir o recargar una obra concreta:
 *
 * - `/` → cartelera
 * - `/obra/:id` → ficha de la obra
 * - `/obra/nueva` → formulario de creación
 * - `/obra/:id/editar` → edición
 * - `/obra/:id/butacas` → mapa de butacas
 * - `/guardados`, `/perfil`, `/ajustes` → pestañas
 *
 * Los prefijos se calculan del origen real del navegador porque la app no
 * declara un esquema nativo (`teatrocolon://`); así la misma configuración
 * sirve en `localhost` y en el dominio publicado.
 */
function getPrefixes(): string[] {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return ['/'];
  }

  const { origin } = window.location;
  return [origin, `${origin}/`];
}

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: getPrefixes(),
  config: {
    screens: {
      Home: {
        screens: {
          HomeList: '',
          Create: 'obra/nueva',
          HomeDetail: 'obra/:id',
          Edit: 'obra/:id/editar',
          SeatMap: 'obra/:id/butacas',
        },
      },
      Saved: 'guardados',
      Profile: 'perfil',
      Settings: 'ajustes',
    },
  },
};
// ===== SEMANA 12 · FIN =====
