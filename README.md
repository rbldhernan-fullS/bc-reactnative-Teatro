# Semana 07 — Persistencia Local: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-07`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que añade una capa de persistencia local a la cartelera del **Teatro Colón** usando los tres storages del ecosistema: **MMKV** para preferencias, **AsyncStorage** para caché offline y **Expo SecureStore** para un dato sensible del dominio.

> ⚠️ **Build nativo obligatorio**: `react-native-mmkv` 4 usa Nitro Modules (JSI) y no funciona en Expo Go. Ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y las funciones del Teatro Colón:

1. **Cartelera (`HomeList`)**: obras desde la API, búsqueda en tiempo real, orden alfabético, filtro por butacas, modo compacto, paginación y banner offline.
2. **Detalle (`HomeDetail`)**: ficha artística, sinopsis, sala, duración, aforo, precio, guardado y edición.
3. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios validados con Zod.
4. **Guardados (`Saved`)**: favoritos por `id` resueltos desde la caché de TanStack Query, también disponibles sin red.
5. **Ajustes (`Settings`)**: preferencias persistentes con MMKV y código de acceso de taquilla cifrado con SecureStore.

---

## 🗂️ Los tres storages y su responsabilidad

| Storage | Qué guarda en Teatro | Por qué |
|---|---|---|
| **MMKV** | `sortOrder`, `compactMode`, `itemsPerPage`, `onlyAvailable` | Lectura/escritura sincrónica y reactiva; ideal para preferencias pequeñas que deben aplicarse al instante. |
| **AsyncStorage** | Última copia válida de la cartelera (`@teatro/plays_cache_v1`) | Asíncrono y pensado para volúmenes mayores; permite mostrar la cartelera sin conexión. |
| **SecureStore** | Código de acceso de taquilla (`teatro_taquilla_access_code`) | Cifrado por Keychain (iOS) o Keystore (Android); nunca se muestra completo en la UI. |

Los tokens de sesión de la Semana 08 también vivirán exclusivamente en SecureStore.

---

## ⚡ MMKV: preferencias reactivas

`src/storage/mmkv.ts` crea una única instancia:

```ts
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'teatro-preferences' });
```

`src/hooks/usePreferences.ts` encapsula las claves, los valores por defecto y los setters tipados. Usa los hooks reactivos de MMKV (`useMMKVString`, `useMMKVBoolean`, `useMMKVNumber`), por lo que cualquier pantalla suscrita se actualiza sin `async/await` y sin reiniciar la app:

```ts
const {
  sortOrder, setSortOrder,
  compactMode, setCompactMode,
  itemsPerPage, setItemsPerPage,
  onlyAvailable, setOnlyAvailable,
  resetPreferences,
} = usePreferences();
```

| Preferencia | Tipo | Valores | Efecto |
|---|---|---|---|
| `sortOrder` | `'asc' \| 'desc'` | A → Z / Z → A | Ordena la cartelera por título (`localeCompare('es')`). |
| `compactMode` | `boolean` | `false` / `true` | `ItemCard` oculta director, hora, duración y butacas; reduce el afiche a 96 px. |
| `itemsPerPage` | `6 \| 12 \| 24` | 6 / 12 / 24 | Controla cuántas tarjetas se muestran antes del botón **Mostrar más**. |
| `onlyAvailable` | `boolean` | `false` / `true` | Oculta las obras con `availableSeats === 0`. |

Los valores guardados se normalizan al leerlos: si MMKV devuelve un valor inesperado, la app cae al valor por defecto tipado en lugar de romper la pantalla.

---

## 📴 Caché offline con AsyncStorage

`src/storage/playsCache.ts` encapsula lectura, escritura y limpieza. Antes de devolver datos valida el JSON con Zod reutilizando `playSchema` (Semana 06) más el `id`. Si la caché está corrupta, se elimina y se devuelve `null`.

`usePlays()` ahora responde con `PlaysWithSource`:

```ts
interface PlaysWithSource {
  plays: Item[];
  source: 'network' | 'cache';
}
```

Flujo de la query:

```
¿La API responde?
├── Sí → guarda copia en AsyncStorage y devuelve { source: 'network' }
└── No → ¿existe caché válida?
    ├── Sí → devuelve { source: 'cache' }
    └── No → propaga el error → pantalla con Reintentar
```

Cuando `source === 'cache'`, `HomeScreen` y `SavedScreen` muestran el banner **“⚠️ Mostrando datos sin red”** con un botón **Reintentar** que vuelve a lanzar la query.

La caché es *best-effort*: si falla la escritura en disco, la carga de red sigue funcionando.

---

## 🔐 SecureStore: código de acceso de taquilla

`SettingsScreen` genera un código tipo `TCXXXX-XXXX` con un alfabeto sin caracteres ambiguos, lo guarda con `SecureStore.setItemAsync` y permite leerlo o eliminarlo:

- **Generar y guardar** → `setItemAsync`.
- **Leer** → `getItemAsync`; solo se muestra `TC-•••Q2M` (enmascarado).
- **Eliminar** → `deleteItemAsync`.

El valor completo nunca se pinta en pantalla. Al entrar a la pantalla se comprueba si existe el código, pero no se revela.

---

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install

# 1. API local de la cartelera (terminal 1)
pnpm api

# 2. Build nativo + Metro (terminal 2)
pnpm prebuild      # genera android/ e ios/ (ignorados por git)
pnpm android       # o: pnpm ios
```

Requisitos del build nativo:

- **Android**: JDK 17 + Android Studio con un emulador o dispositivo conectado por USB.
- **iOS**: macOS con Xcode y simulador.

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No abras el proyecto en Expo Go**: MMKV necesita el binario nativo.

Para un celular físico, la app detecta la IP de Metro. Si tu red lo requiere, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> El firewall de Windows debe permitir el puerto `3001`. Para restaurar la semilla: `git checkout -- api/db.json`.

---

## ✅ Cumplimiento de la rúbrica (Semana 07)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| **MMKV**: ≥ 2 preferencias persistentes sin `async/await` | 8 | Cuatro preferencias en `usePreferences` con hooks reactivos; Settings las cambia en tiempo real. |
| **AsyncStorage**: caché mostrada sin red con banner | 8 | `playsCache` + fallback en `usePlays` + banner “⚠️ Mostrando datos sin red” en Cartelera y Guardados. |
| **SecureStore**: dato sensible guardado y leído | 6 | Código de taquilla con `setItemAsync` / `getItemAsync` / `deleteItemAsync`, siempre enmascarado. |
| **Custom hook** `usePreferences()` | 5 | Claves, defaults, normalización y setters tipados en un solo hook. |
| App funcional y TypeScript sin errores | 3 | `pnpm typecheck` con 0 errores; bundle Android exportado correctamente. |

### Criterios transversales

- Ningún token ni contraseña en AsyncStorage o MMKV.
- `useState` se usa solo para estado de UI (búsqueda, paginación, lectura del código); la persistencia vive en MMKV/AsyncStorage/SecureStore.
- La lógica de storage no está dispersa: `storage/mmkv.ts`, `storage/playsCache.ts`, `hooks/usePreferences.ts`.
- Sin `TODO`, placeholders ni `as any`.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                              # 0 errores
npx expo export --platform android          # bundle nativo correcto
```

Flujo manual sugerido:

1. Abrir **Ajustes** y cambiar el orden a **Z → A**: la cartelera se reordena al volver.
2. Activar **Modo compacto** y **Solo funciones con butacas**: las tarjetas cambian y desaparecen las agotadas.
3. Elegir **6 por página**: la lista muestra 6 tarjetas y el botón **Mostrar más**.
4. Cerrar y reabrir la app: las cuatro preferencias se conservan (MMKV).
5. Con la app abierta, detener `pnpm api` y hacer pull-to-refresh: aparece el banner offline con la caché.
6. En **Ajustes**, generar y guardar el código de taquilla, leerlo (enmascarado) y eliminarlo.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| React Native MMKV | 4.3.2 | Preferencias sincrónicas (Nitro/JSI) |
| react-native-nitro-modules | 0.36.1 | Runtime nativo requerido por MMKV 4 |
| AsyncStorage | 2.2.0 | Caché offline de la cartelera |
| Expo SecureStore | 57.0.4 | Código sensible cifrado |
| TanStack Query | 5.105 | Estado del servidor y caché en memoria |
| React Hook Form + Zod | 7.81 / 4.4.3 | Formularios y validación |
| Zustand | 5.0 | Ids de obras guardadas |
| React Navigation | 7.x | Tabs + Stack anidado |

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras

starter/
├── App.tsx                         # QueryClientProvider + NavigationContainer
├── app.json                        # newArchEnabled + plugin expo-secure-store
├── pnpm-workspace.yaml             # Peer de Zod 4 para @hookform/resolvers
└── src/
    ├── storage/
    │   ├── mmkv.ts                 # Instancia única de MMKV
    │   └── playsCache.ts           # Caché AsyncStorage validada con Zod
    ├── hooks/
    │   ├── usePreferences.ts       # Preferencias MMKV tipadas
    │   └── usePlays.ts             # Query con fallback offline
    ├── screens/
    │   ├── HomeScreen.tsx          # Banner, orden, compacto y paginación
    │   ├── SavedScreen.tsx         # Guardados con aviso de caché
    │   └── SettingsScreen.tsx      # MMKV + SecureStore
    ├── components/
    │   ├── ItemCard.tsx            # Variante compacta
    │   └── ScreenState.tsx         # Loading / error / vacío
    ├── navigation/
    │   ├── RootNavigator.tsx       # Pestañas Cartelera, Guardados y Ajustes
    │   └── types.ts                # RootTabParamList tipado
    ├── schemas/
    │   └── playSchema.ts           # Zod reutilizado por la caché
    ├── services/
    │   ├── api.ts                  # Axios y errores legibles
    │   └── theatreApi.ts           # Adaptador de dominio
    ├── stores/
    │   └── savedStore.ts           # Zustand: savedIds
    ├── types/
    │   └── index.ts                # Item, PlaysWithSource y payloads
    └── theme/
        └── index.ts                # Paleta vino y oro
```
