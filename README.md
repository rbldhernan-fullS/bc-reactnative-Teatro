# Semana 03 — Navegación en Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  

Cartelera con búsqueda, detalle de obra y pestaña Favoritos con una selección de demostración. El detalle ofrece una confirmación de reserva simulada.

## Ejecutar en web

```bash
cd starter
pnpm install --frozen-lockfile
pnpm verify
pnpm web
pnpm export:web
```

Rutas web: `/` (cartelera), `/obra/:id` (detalle) y `/guardados` (Favoritos). La reserva confirmada muestra un aviso. El perfil se incorpora cuando exista la pantalla.

## Mapa de archivos por semana

Rutas desde `starter/`.

| Semana | Archivos |
| --- | --- |
| 01 | `App.tsx`, `src/components/ItemCard.tsx`, `src/data/mockData.ts`, `src/types/index.ts` |
| 02 | `src/screens/HomeScreen.tsx`, `src/theme/index.ts` y presentación de tarjetas |
| 03 | `src/navigation/`, `src/platform/`, `src/screens/DetailScreen.tsx`, `src/screens/FavoritesScreen.tsx` |

[Ver el video de Semana 03](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/blob/main/docs/Week-03/video_week_03.mp4)
