# Semana 04 — Obras guardadas con Zustand

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  

La cartelera del Teatro Colón permite buscar obras, consultar el detalle y guardar o quitar obras desde la tarjeta, el detalle o Guardados. La pestaña Guardados muestra el conteo actual.

El store empieza con `savedIds: []`, conserva los IDs en memoria durante la sesión y resuelve los datos desde el catálogo. Al recargar la página se vacían los guardados. La persistencia se incorpora en la Semana 07.

## Ejecutar en web

```bash
cd starter
pnpm install --frozen-lockfile
pnpm verify
pnpm web
pnpm export:web
```

Rutas web: `/` (cartelera), `/obra/:id` (detalle) y `/guardados`.

## Mapa de archivos por semana

Rutas desde `starter/`.

| Semana | Archivos |
| --- | --- |
| 01 | `App.tsx`, catálogo `src/data/mockData.ts` y modelos `src/types/` |
| 02 | `src/screens/HomeScreen.tsx`, `src/theme/` y presentación de tarjetas |
| 03 | `src/navigation/`, `src/platform/` y detalle en `src/screens/DetailScreen.tsx` |
| 04 | `src/stores/savedStore.ts`, `src/screens/SavedScreen.tsx`, `src/components/SaveButton.tsx` e integración de guardados en cartelera y detalle |

[Ver el video de Semana 04](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/blob/main/docs/Week-04/video_week_04.mp4)
