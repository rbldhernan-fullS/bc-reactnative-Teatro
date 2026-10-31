# Semana 11 — APIs Nativas: Cámara, Galería y Ubicación

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-11`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que incorpora **APIs nativas** sobre la cartelera del **Teatro Colón**: captura del afiche con **expo-camera**, selección desde la **galería** con **expo-image-picker** y la **sede del teatro** con **expo-location**, distancia y dirección textual.

> ⚠️ **Build nativo obligatorio**: la app usa **MMKV** (Semana 07), **Reanimated 4** (Semana 10) y módulos de cámara/ubicación. No funciona en Expo Go; ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y la cuenta de los socios del **Club Teatro Colón**:

1. **Autenticación (`Login` / `Register`)**: acceso de socios y registro simulado.
2. **Cartelera (`HomeList`)**: búsqueda, preferencias MMKV, paginación, modo offline, entrada escalonada y swipe.
3. **Detalle (`HomeDetail`)**: ficha artística, ocupación, afiche local y sede del teatro.
4. **Mapa de butacas (`SeatMap`)**: zoom, desplazamiento, selección y resumen de reserva.
5. **Cámara (`Camera`)**: captura a pantalla completa del afiche de la obra.
6. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios Zod + afiche local.
7. **Guardados, Perfil y Ajustes**: sesión, preferencias y SecureStore.

---

## ✨ APIs nativas implementadas

| # | Comportamiento | Archivo | Implementación |
|:--:|---|---|---|
| 1 | Permiso reutilizable | `PermissionGate` | Estados comprobando / denegado / concedido, solicitud y `Linking.openSettings()`. |
| 2 | Captura de afiche | `CameraScreen` | `useCameraPermissions()` + `CameraView` + `takePictureAsync({ quality: 0.8 })`. |
| 3 | Selección de galería | `PhotoPicker` | `launchImageLibraryAsync` con `mediaTypes: ['images']`, recorte `3:4` y manejo de `result.canceled`. |
| 4 | Afiche local | `posterStore` | URI por obra; prioridad sobre `imageUri` de la API y badge **Afiche local**. |
| 5 | Ubicación puntual | `useLocation` | `requestForegroundPermissionsAsync` + `getCurrentPositionAsync` con `Location.Accuracy.Balanced`. |
| 6 | Dirección textual | `useLocation` | `reverseGeocodeAsync` con `formattedAddress` y composición de respaldo. |
| 7 | Seguimiento en vivo | `useLocation` | `watchPositionAsync` cada 5 s / 10 m con `subscription.remove()` en cleanup. |
| 8 | Distancia a la sede | `VenueCard` | Haversine contra las coordenadas del Teatro Colón y `formatDistance`. |
| 9 | Abrir mapas | `VenueCard` | `Linking.openURL` con la ruta caminando a la sede. |

### Flujo de permisos

1. `useCameraPermissions()` y `getForegroundPermissionsAsync()` consultan sin mostrar diálogos.
2. **Comprobando**: `PermissionGate` muestra un spinner mientras llega la respuesta.
3. **No concedido**: explica el uso del permiso en el dominio y ofrece **Permitir acceso**.
4. **Denegado sin reintento**: el botón cambia a **Abrir ajustes** (`Linking.openSettings()`).
5. Al volver de ajustes, `useLocation` relee el permiso con `AppState` y carga la posición si ya está concedido.

### Nota sobre el afiche

La API sigue guardando `imageUri` como URL. La foto capturada o elegida se guarda en `posterStore` (estado local de la sesión) y tiene prioridad en el detalle; no se envía al servidor. Es una decisión deliberada para no subir archivos binarios a `json-server` y mantener el contrato de la API intacto.

---

## 🔐 Permisos declarados

| Plataforma | Permiso | Motivo |
|---|---|---|
| iOS | `NSCameraUsageDescription` | Capturar el afiche de la obra |
| iOS | `NSPhotoLibraryUsageDescription` | Elegir el afiche desde la galería |
| iOS | `NSLocationWhenInUseUsageDescription` | Mostrar la sede y la distancia al teatro |
| Android | `CAMERA` | Capturar el afiche |
| Android | `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` | Ubicación del socio y distancia |
| Android | — | El selector de fotos usa el Photo Picker; no requiere almacenamiento |

Los permisos se declaran con los plugins de `expo-camera`, `expo-image-picker` y `expo-location` en `app.json`. El micrófono queda desactivado (`recordAudioAndroid: false`, `microphonePermission: false`) porque la app no graba audio.

---

## ✅ Cumplimiento de la rúbrica (Semana 11)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| `PermissionGate` reutilizable con estados | 7 | Cámara y ubicación comparten el mismo componente; incluye ajustes del sistema. |
| `PhotoPicker` integrado al dominio | 7 | Cámara o galería para el afiche, con recorte, preview y acción de quitar. |
| Ubicación relevante al dominio | 6 | Sede del teatro, dirección del socio, distancia y ruta caminando. |
| App compila y corre sin crashes | 5 | `pnpm typecheck` con 0 errores y bundle Android correcto. |
| Coherencia con el dominio | 3 | Afiche de la obra y sede del Teatro Colón; nada genérico. |
| Originalidad | 2 | Implementación propia sobre el dominio Teatro. |

### Criterios de desempeño cubiertos

- `useCameraPermissions()` en lugar de la API deprecada.
- `CameraView` montado a pantalla completa y `takePictureAsync()`.
- `launchImageLibraryAsync()` con `result.canceled` controlado.
- `requestForegroundPermissionsAsync()` y `Location.Accuracy` importado del paquete.
- `getCurrentPositionAsync()`, `watchPositionAsync()` y `reverseGeocodeAsync()`.
- `subscription.remove()` en el cleanup del `useEffect`.
- Sin `TODO`, placeholders ni `as any`.

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

- **Android**: JDK 17 + Android Studio con emulador o dispositivo USB.
- **iOS**: macOS con Xcode y simulador.

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No uses Expo Go**.

Para un celular físico, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> Para el emulador de Android la URL del host es `http://10.0.2.2:3001`. El firewall de Windows debe permitir el puerto `3001`.

### Probar cámara y ubicación en emulador

- **Android**: el emulador trae una cámara virtual; en **Extended controls → Camera** puedes usar la webcam o una imagen.
- **Ubicación**: en **Extended controls → Location** define una coordenada (por ejemplo, la del Teatro Colón: `4.5964, -74.0734`) y pulsa **Set location**.
- **iOS Simulator**: no tiene cámara; usa **Galería** con una foto del carrete. La ubicación se configura en **Features → Location**.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                              # 0 errores
npx expo export --platform android          # bundle correcto
```

Flujo manual sugerido:

1. Entrar con `emilys` / `emilyspass`.
2. Abrir una obra y tocar **Cámara** en **Afiche de la obra**; conceder el permiso y capturar.
3. Confirmar que el banner del detalle cambia y muestra el badge **Afiche local**.
4. Tocar **Galería**, elegir una imagen y verificar que reemplaza el afiche.
5. Tocar **Quitar** y confirmar que vuelve el afiche de la API.
6. En **Sede del teatro**, tocar **Permitir acceso**, revisar coordenadas, dirección y distancia.
7. Activar **Seguir mi recorrido**, mover la ubicación simulada y ver la distancia actualizada.
8. Tocar **Cómo llegar**: se abre la app de mapas con la ruta a la sede.
9. Crear una obra con afiche local y confirmar que se conserva al abrir su detalle.

> Las capturas del simulador deben generarse en un equipo con Android Studio + JDK 17 o con EAS Build. En este entorno no hay JDK, Android SDK ni `adb`.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| Expo Camera | 57.0.6 | Captura del afiche |
| Expo Image Picker | 57.0.20 | Selección desde la galería |
| Expo Location | 57.0.22 | Ubicación, geocodificación inversa y seguimiento |
| React Native Reanimated | 4.5.1 | Animaciones en el hilo de UI |
| React Native Gesture Handler | 2.32.0 | Pan, pinch y tap |
| TanStack Query | 5.105 | Estado del servidor |
| Zustand | 5.0 | Sesión, guardados y afiche local |
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
├── app.json                        # Plugins y permisos de cámara, fotos y ubicación
├── babel.config.js                 # react-native-worklets/plugin
└── src/
    ├── components/
    │   ├── PermissionGate.tsx      # Estados de permiso + ajustes del sistema
    │   ├── PhotoPicker.tsx         # Cámara o galería para el afiche
    │   ├── VenueCard.tsx           # Sede, dirección, distancia y seguimiento
    │   ├── SwipeableCard.tsx       # Gesture.Pan + umbral + snap-back
    │   ├── AnimatedCard.tsx        # Tap + escala con Reanimated
    │   ├── AnimatedButton.tsx      # Gesture.Tap + withSpring
    │   ├── ProgressBar.tsx         # Ocupación con Reanimated
    │   ├── ItemCard.tsx            # Cuerpo visual de la tarjeta
    │   ├── PlayForm.tsx            # Formulario + afiche local
    │   └── ScreenState.tsx         # Loading / error / vacío
    ├── screens/
    │   ├── HomeScreen.tsx          # Cascada + swipe + descartadas
    │   ├── DetailScreen.tsx        # Ficha, afiche local y sede
    │   ├── SeatMapScreen.tsx       # Zoom, pan y selección de butacas
    │   ├── CameraScreen.tsx        # Cámara fullscreen
    │   ├── CreateScreen.tsx        # Alta con afiche local
    │   ├── EditScreen.tsx          # Edición con afiche local
    │   ├── LoginScreen.tsx         # RHF + Zod + credenciales demo
    │   ├── RegisterScreen.tsx      # Registro simulado
    │   ├── SavedScreen.tsx         # Obras guardadas
    │   ├── ProfileScreen.tsx       # Perfil y logout
    │   └── SettingsScreen.tsx      # MMKV + SecureStore
    ├── hooks/
    │   ├── useLocation.ts          # Permiso, posición, dirección y watch
    │   ├── usePlays.ts             # TanStack Query
    │   └── usePreferences.ts       # Preferencias MMKV
    ├── navigation/
    │   ├── RootNavigator.tsx       # Auth ↔ App condicional
    │   ├── AuthNavigator.tsx       # Login / Registro
    │   ├── AppNavigator.tsx        # Stack con SeatMap y Camera
    │   └── types.ts                # Parámetros tipados de navegación
    ├── stores/
    │   ├── authStore.ts            # Zustand + persist + bootstrap
    │   ├── savedStore.ts           # Ids de obras guardadas
    │   └── posterStore.ts          # Afiche local por obra
    ├── services/                   # Axios, auth y adaptador de dominio
    ├── storage/                    # MMKV y caché offline
    ├── utils/
    │   └── theatre.ts              # Aforo, butacas, sede y distancia
    ├── types/
    │   └── index.ts                # Item, Seat, AuthUser, AuthSession
    └── theme/
        └── index.ts                # Paleta vino y oro
```
