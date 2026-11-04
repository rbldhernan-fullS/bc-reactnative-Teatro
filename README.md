# Semana 09 — Animaciones Básicas: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-09`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que incorpora animaciones fluidas sobre la cartelera del **Teatro Colón**: entrada del detalle con fade + slide, feedback táctil en las tarjetas y botones, barra de ocupación de la sala, aparición en cascada de la cartelera y transiciones de layout al cambiar la lista.

> ⚠️ **Build nativo obligatorio**: la app usa **MMKV** (Semana 07) con Nitro Modules. No funciona en Expo Go; ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y la cuenta de los socios del **Club Teatro Colón**:

1. **Autenticación (`Login` / `Register`)**: acceso de socios y registro simulado.
2. **Cartelera (`HomeList`)**: obras de la API, búsqueda, preferencias MMKV, paginación, modo offline y animación de entrada.
3. **Detalle (`HomeDetail`)**: ficha artística, ocupación de la sala y acceso a la reserva.
4. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios Zod.
5. **Guardados (`Saved`)**: obras favoritas del socio.
6. **Perfil (`Profile`)**: datos del socio, número de miembro, obras guardadas y logout.
7. **Ajustes (`Settings`)**: preferencias y código de taquilla en SecureStore.

---

## ✨ Animaciones implementadas

| # | Comportamiento | Archivo | Implementación |
|:--:|---|---|---|
| 1 | Entrada del detalle | `DetailScreen` | `Animated.parallel` con opacidad `0 → 1` y `translateY 30 → 0` en 500 ms. |
| 2 | Feedback táctil de la tarjeta | `AnimatedCard` | `Animated.spring` de escala `1 → 0.95` al presionar y `0.95 → 1` con rebote al soltar. |
| 3 | Ocupación de la sala | `ProgressBar` | `interpolate` de ancho y color según `(capacidad − butacas disponibles) / capacidad`. |
| 4 | Entrada en cascada | `HomeScreen` | `Animated.stagger(80, [...])` sobre cada obra visible, con fade y `translateY 24 → 0`. |
| 5 | Cambios de layout | `HomeScreen` | `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` al paginar y al aplicar el filtro de butacas. |
| Extra | Botón con feedback | `AnimatedButton` | `Animated.timing` al presionar y `Animated.spring` con rebote al soltar. |

### Detalle técnico

- Las propiedades de opacidad y transform usan `useNativeDriver: true`.
- `ProgressBar` usa `useNativeDriver: false` **a propósito**: `width` y `backgroundColor` no son propiedades nativas. No hay otras animaciones con el driver desactivado.
- La barra de ocupación se calcula con la capacidad real de cada sala (`Sala Principal` 320, `Sala de Cámara` 120, `Teatro Experimental` 80) y se acota entre 0 y 1.
- En Android, `UIManager.setLayoutAnimationEnabledExperimental?.(true)` se ejecuta una sola vez, fuera del componente.
- `ItemCard` quedó como **cuerpo visual** reutilizable; `AnimatedCard` es el envoltorio que aporta el tap y la escala. Esto permite que la Semana 10 sustituya el envoltorio por `SwipeableCard` sin reescribir estilos.

---

## ✅ Cumplimiento de la rúbrica (Semana 09)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| Animación de entrada en `DetailScreen` | 8 | `Animated.parallel` de opacidad y desplazamiento vertical, 500 ms. |
| Feedback de tap en tarjetas del dominio | 7 | `AnimatedCard` con `Animated.spring` y rebote al soltar. |
| `LayoutAnimation` al agregar/eliminar elementos | 7 | Paginación y filtro de butacas animan la transición de la lista. |
| App compila y corre sin errores | 5 | `pnpm typecheck` con 0 errores y bundle Android correcto. |
| Animaciones coherentes con el dominio | 3 | Ocupación de sala, cartelera, ficha artística y botón de reserva. |

### Criterios transversales

- Sin `TODO`, placeholders ni `as any`.
- Animaciones construidas con `Animated.Value`, no con estilos hardcodeados.
- `Animated.stagger(80, ...)`, `Animated.parallel` y `Animated.spring` presentes en el código.
- La interfaz conserva la paleta **Vino y Oro** y los estilos existentes.

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

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No uses Expo Go**: MMKV requiere el binario nativo.

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

1. Abrir la app y entrar con `emilys` / `emilyspass`.
2. Observar la entrada en cascada de la cartelera.
3. Presionar una tarjeta: se comprime con rebote y se abre el detalle.
4. En el detalle, confirmar el fade + slide y la barra de ocupación de la sala.
5. Tocar **Reservar Butacas**: el botón se comprime y vuelve con rebote.
6. Volver a la cartelera, aplicar **Solo funciones con butacas** y tocar **Mostrar más**: la lista cambia con `LayoutAnimation`.

> Las capturas del simulador deben generarse en un equipo con Android Studio + JDK 17 o con EAS Build. En este entorno no hay JDK, Android SDK ni `adb`.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57.0.31 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| React Hook Form | 7.81.0 | Estado de formularios |
| Zod | 4.4.3 | Validación y tipos inferidos |
| Zustand | 5.0 | Estado de sesión y guardados |
| TanStack Query | 5.105 | Estado del servidor |
| Axios | 1.21 | Cliente HTTP e interceptor 401 |
| Expo SecureStore | 57.0.4 | Tokens cifrados |
| React Native MMKV | 4.3.2 | Preferencias locales |
| AsyncStorage | 2.2.0 | Perfil persistido y caché offline |
| Animated API | React Native | Animaciones de la Semana 09 |

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras

starter/
├── App.tsx                         # BootstrapGate + QueryClient + Navigation
├── app.json                        # newArchEnabled + plugin expo-secure-store
└── src/
    ├── components/
    │   ├── AnimatedCard.tsx        # Envoltorio táctil con spring
    │   ├── AnimatedButton.tsx      # Botón con timing + spring
    │   ├── ProgressBar.tsx         # Ancho y color interpolados
    │   ├── ItemCard.tsx            # Cuerpo visual de la tarjeta
    │   ├── FormField.tsx           # Controller + TextInput + error
    │   └── ScreenState.tsx         # Loading / error / vacío
    ├── screens/
    │   ├── LoginScreen.tsx         # RHF + Zod + credenciales demo
    │   ├── RegisterScreen.tsx      # Registro simulado
    │   ├── HomeScreen.tsx          # Cascada + LayoutAnimation
    │   ├── DetailScreen.tsx        # Fade + slide + ocupación
    │   ├── SavedScreen.tsx         # Obras guardadas
    │   ├── ProfileScreen.tsx       # Perfil, guardados y logout
    │   └── SettingsScreen.tsx      # MMKV + SecureStore
    ├── navigation/
    │   ├── RootNavigator.tsx       # Auth ↔ App condicional
    │   ├── AuthNavigator.tsx       # Login / Registro
    │   ├── AppNavigator.tsx        # Cartelera / Guardados / Perfil / Ajustes
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
    │   └── theatre.ts              # Aforo y ocupación por sala
    ├── types/
    │   └── index.ts                # Item, AuthUser, AuthTokens, AuthSession
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
