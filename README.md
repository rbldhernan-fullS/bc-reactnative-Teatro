# Semana 10 — Reanimated 4 + Gesture Handler: Mapa de Butacas

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-10`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que migra las animaciones de la Semana 09 a **Reanimated 4** e incorpora **React Native Gesture Handler** sobre el dominio del **Teatro Colón**: tarjetas arrastrables, botones con tap gestual, entrada escalonada de la cartelera y un **mapa interactivo de butacas** con zoom, desplazamiento y selección.

> ⚠️ **Build nativo obligatorio**: la app usa **MMKV** (Semana 07) con Nitro Modules y Reanimated 4. No funciona en Expo Go; ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y la cuenta de los socios del **Club Teatro Colón**:

1. **Autenticación (`Login` / `Register`)**: acceso de socios y registro simulado.
2. **Cartelera (`HomeList`)**: obras de la API, búsqueda, preferencias MMKV, paginación, modo offline, entrada escalonada y swipe.
3. **Detalle (`HomeDetail`)**: ficha artística, ocupación de la sala y acceso al mapa de butacas.
4. **Mapa de butacas (`SeatMap`)**: zoom, desplazamiento, selección y resumen de reserva.
5. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios Zod.
6. **Guardados (`Saved`)**: obras favoritas del socio.
7. **Perfil (`Profile`)** y **Ajustes (`Settings`)**: sesión, preferencias y SecureStore.

---

## ✨ Migración a Reanimated 4 y gestos

| Requisito | Archivo | Implementación |
|---|---|---|
| `SwipeableCard` con `Gesture.Pan` | `SwipeableCard` | Umbral ±120 px, rotación interpolada y `withSpring(0)` para el snap-back. |
| Acción de dominio al superar el umbral | `SwipeableCard` + `HomeScreen` | Derecha: guardar/quitar de la lista. Izquierda: descartar de la cartelera de la sesión. |
| `AnimatedButton` con `Gesture.Tap` | `AnimatedButton` | `withTiming` al presionar y `withSpring` al soltar; reemplaza el `Pressable` de la Semana 09. |
| Entrada escalonada | `HomeScreen` | `withDelay(index * 80, withTiming(...))` y `useAnimatedStyle`. |
| Transición del detalle | `DetailScreen` | Fade + slide con `useSharedValue`, `withTiming` e `interpolate`. |
| Mapa de butacas (bonus Pinch) | `SeatMapScreen` | `Gesture.Pinch` + `Gesture.Pan` simultáneos, patrón `savedScale`, selección por tap y confirmación. |
| Raíz de gestos | `App.tsx` | `GestureHandlerRootView` envolviendo toda la app. |
| Plugin de Babel | `babel.config.js` | `react-native-worklets/plugin` al final de la lista. |

### Nota sobre el plugin de la rúbrica

La rúbrica de la Semana 10 menciona `'react-native-reanimated/plugin'`, que era el plugin de Reanimated 2/3. En **Reanimated 4** el plugin correcto es `'react-native-worklets/plugin'`; el starter oficial de la semana 10 también lo usa. La funcionalidad exigida (worklets de `useSharedValue` y `useAnimatedStyle`) está cubierta y el bundle Android compila con él.

### Flujo de un gesto

1. `onBegin` / `onStart`: se guarda el estado inicial (`savedScale`, `startX`, `startY`).
2. `onUpdate`: se actualizan `useSharedValue` en el hilo de UI.
3. `onEnd`: se evalúa el umbral o se ajusta la escala; el snap-back usa `withSpring(0)`.
4. `runOnJS`: ejecuta acciones de JavaScript (guardar, descartar, confirmar) sin cruzar el hilo de UI durante el gesto.

---

## 🗺️ Mapa interactivo de butacas

- La sala se genera a partir de `HALL_LAYOUT`: **Sala Principal** 10 × 32, **Sala de Cámara** 8 × 15 y **Teatro Experimental** 8 × 10.
- Las butacas ocupadas se reparten de forma **determinista** con un hash del `id` de la obra, respetando `availableSeats`. El mismo mapa se mantiene entre visitas.
- **Pinch** para zoom entre `0.5x` y `2.5x`, con `savedScale` para acumular el gesto.
- **Pan de dos dedos** para recorrer salas grandes; el desplazamiento se acota al tamaño del contenido.
- **Tap** en una butaca disponible para seleccionarla; máximo **8 butacas** por reserva.
- Botón **Centrar** para restablecer zoom y posición.
- Resumen inferior con butacas seleccionadas, total en COP y confirmación con `Alert`.

---

## ✅ Cumplimiento de la rúbrica (Semana 10)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| `SwipeableCard` funcional con `Gesture.Pan` | 8 | Arrastre horizontal con rotación, umbral y acción de dominio. |
| Snap-back correcto sin superar el umbral | 6 | `withSpring(0)` en `translateX` y `translateY`. |
| Umbral detectado y acción ejecutada | 6 | ±120 px: guardar/quitar o descartar, con `runOnJS`. |
| Entrada animada con `useAnimatedStyle` | 5 | `StaggeredItem` y transición del detalle. |
| App compila correctamente | 3 | `pnpm typecheck` con 0 errores y bundle Android correcto. |
| Dominio coherente | 2 | Obras, salas, butacas, ocupación y reserva. |

### Criterios transversales

- Sin `Animated` de `react-native` ni `useNativeDriver` en el código de la Semana 10.
- Sin `TODO`, placeholders ni `as any`.
- `GestureHandlerRootView` presente en `App.tsx`.
- Plugin de worklets configurado en `babel.config.js`.
- El mapa de butacas cubre el bonus de `PinchableImage` con `Gesture.Pinch`.

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

# Tras cambiar babel.config.js, arranca Metro limpio:
pnpm start --clear
```

Requisitos del build nativo:

- **Android**: JDK 17 + Android Studio con emulador o dispositivo USB.
- **iOS**: macOS con Xcode y simulador.

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No uses Expo Go**: MMKV y Reanimated 4 requieren el binario nativo.

Para un celular físico, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> Para el emulador de Android la URL del host es `http://10.0.2.2:3001`. El firewall de Windows debe permitir el puerto `3001`.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                              # 0 errores
npx expo export --platform android          # bundle correcto
```

Flujo manual sugerido:

1. Entrar con `emilys` / `emilyspass`.
2. En la cartelera, deslizar una tarjeta a la derecha: se guarda o se quita de Guardados.
3. Deslizar a la izquierda: la obra se descarta y aparece el aviso **Restaurar**.
4. Tocar **Mostrar más**: las tarjetas nuevas entran con `withDelay`.
5. Abrir una obra: el detalle entra con fade + slide y muestra la ocupación.
6. Tocar **Reservar Butacas**: se abre el mapa de la sala.
7. Hacer pinch para zoom y arrastrar con dos dedos para recorrer el mapa.
8. Seleccionar butacas disponibles (máximo 8) y confirmar la reserva.

> Las capturas del simulador deben generarse en un equipo con Android Studio + JDK 17 o con EAS Build. En este entorno no hay JDK, Android SDK ni `adb`.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57.0.31 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| React Native Reanimated | 4.5.1 | Animaciones en el hilo de UI |
| React Native Gesture Handler | 2.32.0 | Pan, pinch y tap |
| React Native Worklets | 0.10.1 | Plugin de Babel para worklets |
| TanStack Query | 5.105 | Estado del servidor |
| Zustand | 5.0 | Sesión y obras guardadas |
| React Hook Form + Zod | 7.81 / 4.4.3 | Formularios y validación |
| Expo SecureStore | 57.0.4 | Tokens cifrados |
| React Native MMKV | 4.3.2 | Preferencias locales |
| AsyncStorage | 2.2.0 | Perfil persistido y caché offline |
| Axios | 1.21 | Cliente HTTP e interceptor 401 |

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras

starter/
├── App.tsx                         # GestureHandlerRootView + BootstrapGate
├── babel.config.js                 # react-native-worklets/plugin
├── app.json                        # newArchEnabled + plugin expo-secure-store
└── src/
    ├── components/
    │   ├── SwipeableCard.tsx       # Gesture.Pan + umbral + snap-back
    │   ├── AnimatedCard.tsx        # Tap + escala con Reanimated
    │   ├── AnimatedButton.tsx      # Gesture.Tap + withSpring
    │   ├── ProgressBar.tsx         # Ocupación con Reanimated
    │   ├── ItemCard.tsx            # Cuerpo visual de la tarjeta
    │   ├── FormField.tsx           # Controller + TextInput + error
    │   └── ScreenState.tsx         # Loading / error / vacío
    ├── screens/
    │   ├── HomeScreen.tsx          # Cascada + swipe + descartadas
    │   ├── DetailScreen.tsx        # Fade + slide + ocupación
    │   ├── SeatMapScreen.tsx       # Zoom, pan y selección de butacas
    │   ├── LoginScreen.tsx         # RHF + Zod + credenciales demo
    │   ├── RegisterScreen.tsx      # Registro simulado
    │   ├── SavedScreen.tsx         # Obras guardadas
    │   ├── ProfileScreen.tsx       # Perfil y logout
    │   └── SettingsScreen.tsx      # MMKV + SecureStore
    ├── navigation/
    │   ├── RootNavigator.tsx       # Auth ↔ App condicional
    │   ├── AuthNavigator.tsx       # Login / Registro
    │   ├── AppNavigator.tsx        # Stack con SeatMap
    │   └── types.ts                # Parámetros tipados de navegación
    ├── stores/
    │   ├── authStore.ts            # Zustand + persist + bootstrap
    │   └── savedStore.ts           # Ids de obras guardadas
    ├── services/
    │   ├── authClient.ts           # Axios auth + interceptor 401
    │   ├── authService.ts          # login / register / getProfile
    │   ├── tokenService.ts         # SecureStore
    │   ├── api.ts                  # Axios de la cartelera
    │   └── theatreApi.ts           # Adaptador de dominio
    ├── storage/
    │   ├── mmkv.ts                 # Instancia MMKV
    │   └── playsCache.ts           # Caché offline AsyncStorage
    ├── utils/
    │   └── theatre.ts              # Aforo, ocupación y mapa de butacas
    ├── types/
    │   └── index.ts                # Item, Seat, AuthUser, AuthSession
    └── theme/
        └── index.ts                # Paleta vino y oro
```

---

## 🌐 Ejecutar en web

```bash
cd starter
pnpm install
pnpm web
```

La app también corre en el navegador con `react-native-web` y Metro. Los módulos exclusivos de nativo
se sustituyen por implementaciones web mediante archivos `.web.ts`: **MMKV** y **SecureStore** usan
`localStorage`, y las notificaciones quedan deshabilitadas en web sin romper el arranque.
