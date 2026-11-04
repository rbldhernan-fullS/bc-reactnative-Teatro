# Semana 05 — Networking y TanStack Query v5: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-05`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que consume una API REST local de cartelera teatral. El estado del servidor se gestiona exclusivamente con **TanStack Query v5** y **Axios**; **Zustand** queda reservado para el estado de UI (obras guardadas por identificador).

---

## 🎭 Dominio: Teatro

La app permite explorar la programación del **Teatro Colón**, consultar la ficha artística de cada montaje, guardar obras y publicar nuevas funciones en la cartelera:

1. **Cartelera (`HomeList`)**: lista virtualizada cargada desde la API, búsqueda en tiempo real, pull-to-refresh y estados de carga, error y vacío.
2. **Detalle (`HomeDetail`)**: ficha técnica consultada por `id` con sinopsis, sala, duración, aforo, precio, guardado y reserva.
3. **Guardados (`Saved`)**: obras favoritas resueltas desde la caché de TanStack Query usando solo los ids almacenados en Zustand.
4. **Nueva obra (`Create`)**: formulario que publica una función con `useMutation` e invalida la cartelera al terminar.

---

## 🗺️ Arquitectura

```
api/db.json  →  json-server :3001  →  axios (services/api.ts)
                                              ↓
                                   theatreApi.ts (adaptador de dominio)
                                              ↓
                                  TanStack Query (hooks/usePlays.ts)
                                              ↓
                     Home / Detail / Saved / Create (pantallas)
                                              ↓
                        Zustand savedStore = SOLO ids (estado de UI)
```

### Decisión clave: estado del servidor vs. estado de UI

| Estado | Dónde vive | Ejemplo |
|---|---|---|
| Datos de la API | TanStack Query | Obras, precios, aforo, sinopsis |
| Estado de UI | Zustand | Ids de obras guardadas, badge del tab |

`src/stores/savedStore.ts` guarda `savedIds: string[]`, no objetos `Item`. Así se evita duplicar el estado del servidor y se cumple la restricción de la rúbrica.

---

## 🚀 Cómo ejecutar

### 1. Instalar dependencias

```bash
cd starter
pnpm install
```

### 2. Levantar la API y la app

```bash
# Opción recomendada: API + Metro en un solo comando
pnpm dev

# Opción manual: dos terminales
pnpm api      # json-server en http://localhost:3001
pnpm start    # Expo / Metro
```

La API se sirve desde `api/db.json` en la raíz del repositorio y escucha en `0.0.0.0:3001` para que también sea accesible desde un celular en la misma red.

### 3. Celular físico

La app detecta automáticamente la IP del equipo que ejecuta Metro mediante `expo-constants`. Si tu red lo requiere, crea `starter/.env` a partir de `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> El firewall de Windows debe permitir conexiones al puerto `3001`.

### 4. Restaurar los datos de ejemplo

Las operaciones POST/PUT modifican `api/db.json`. Para volver a las 12 obras iniciales:

```bash
git checkout -- api/db.json
```

---

## 📱 Pantallas

| Pantalla | Ruta | Función |
|---|---|---|
| Cartelera | `HomeList` | `useQuery`, búsqueda, pull-to-refresh y estados de red |
| Detalle | `HomeDetail` | `usePlayById(id)`, ficha completa y guardado |
| Nueva obra | `Create` | `useMutation` + `invalidateQueries` |
| Guardados | `Saved` (tab) | Ids en Zustand + obras desde la caché |

### Estados de red implementados

- **Loading**: `ActivityIndicator` mientras `isLoading` es `true` (primer fetch).
- **Error**: mensaje accionable + botón **Reintentar** conectado a `refetch`.
- **Vacío**: `ListEmptyComponent` diferencia cartelera vacía de búsqueda sin resultados.
- **Pull-to-refresh**: `refreshing={isFetching && !isLoading}` y `onRefresh={refetch}`.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57.0.31 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| TanStack Query | 5.105 | Estado del servidor y caché |
| Axios | 1.21 | Cliente HTTP con `baseURL` e interceptors |
| json-server | 0.17.4 | API REST local persistente |
| Zustand | 5.0 | Estado de UI (ids guardados) |
| React Navigation | 7.x | Tabs + Stack anidado |
| pnpm | 12 | Gestor de dependencias |

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras (json-server)

starter/
├── App.tsx                         # QueryClientProvider + NavigationContainer
├── .env.example                    # Override opcional de EXPO_PUBLIC_API_URL
├── env.d.ts                        # Tipado de variables de entorno de Expo
└── src/
    ├── services/
    │   ├── api.ts                  # Instancia Axios, host de desarrollo y errores
    │   └── theatreApi.ts           # GET/POST/PUT adaptados al dominio Teatro
    ├── hooks/
    │   └── usePlays.ts             # usePlays, usePlayById, useCreatePlay, useUpdatePlay
    ├── navigation/
    │   ├── RootNavigator.tsx       # Tab + Stack anidado con ruta Create
    │   └── types.ts                # HomeStackParamList y RootTabParamList
    ├── screens/
    │   ├── HomeScreen.tsx          # Cartelera con estados de red y refresco
    │   ├── DetailScreen.tsx        # Ficha consultada por id
    │   ├── SavedScreen.tsx         # Guardados por id + caché
    │   └── CreateScreen.tsx        # Formulario básico de publicación
    ├── components/
    │   ├── ItemCard.tsx            # Tarjeta de obra
    │   └── ScreenState.tsx         # Loading / error / vacío reutilizable
    ├── stores/
    │   └── savedStore.ts           # Zustand: savedIds (estado de UI)
    ├── types/
    │   └── index.ts                # Item, CreatePlayPayload, UpdatePlayPayload
    └── theme/
        └── index.ts                # Paleta vino y oro
```

---

## ✅ Cumplimiento de la rúbrica (Semana 05)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| `QueryClientProvider` en la raíz | 3 | `App.tsx` envuelve `SafeAreaProvider` y `NavigationContainer` |
| Instancia Axios con `baseURL` | 4 | `src/services/api.ts` + detección automática del host de Expo |
| `useQuery` con `queryKey` semántico | 6 | `PLAYS_QUERY_KEY = ['plays']` en `usePlays` |
| `useMutation` + `invalidateQueries` | 7 | `useCreatePlay` invalida `['plays']` en `onSuccess` |
| Loading, error y vacío | 5 | `ScreenState` + `ListEmptyComponent` |
| Pull-to-refresh con `refetch` | 5 | `HomeScreen` y `SavedScreen` |
| Sin `as any` | — | Tipado estricto verificado con `tsc --noEmit` |
| Sin estado del servidor en Zustand | — | `savedStore` solo contiene `savedIds` |
| Sin fetch en `useEffect` | — | Toda la red pasa por TanStack Query |

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck          # 0 errores
pnpm expo export --platform web   # bundle de producción correcto
```

Prueba manual sugerida:

1. `pnpm dev` y abrir la app.
2. Buscar “Hamlet”, guardar una obra y revisar el badge del tab.
3. Hacer pull-to-refresh en la cartelera.
4. Detener la API (`Ctrl+C` en `pnpm api`) y comprobar el estado de error con **Reintentar**.
5. Publicar una obra nueva y confirmar que aparece en la cartelera.
6. Editar `api/db.json` o reiniciar la API para comprobar la persistencia.

---

## 🌐 Ejecutar en web

```bash
cd starter
pnpm install
pnpm web
```

La app también corre en el navegador con `react-native-web` y Metro.
