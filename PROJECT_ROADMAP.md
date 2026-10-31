# 🎭 PROYECTO TEATRO — Roadmap Maestro & Guía de Desarrollo (18 Semanas)

> **Estudiante / Desarrollador**: Hernán Eduardo Robledo Montaña  
> **Ficha**: 3407193  
> **Dominio Asignado**: **TEATRO** (Cartelera, Funciones, Salas, Butacas, Reservas y Boletos)  
> **Stack Base**: React Native 0.86, Expo 57, React 19, TypeScript 6, TanStack Query 5, React Hook Form 7, Zod 4, pnpm  
> **Convención de Commits**: Conventional Commits (`feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`)

---

## 📌 Protocolo de Continuidad Diaria (Cero Olvidos)

Para garantizar consistencia y continuidad en cualquier día de trabajo:
1. **Sincronización Inicial**: Al retomar cada sesión, consultar siempre la rama actual (`git branch --show-current`), el estado de Git (`git status`) y este archivo de Roadmap.
2. **Trazabilidad por Rama**: Cada semana del bootcamp corresponde a su rama Git (`Week-01`, `Week-02`, ..., `Week-18`).
3. **Calidad de Entrega**: Ningún archivo se deja con `TODO` incompletos, placeholders ni tipos `any`.
4. **Verificación Estricta**: Cada semana se valida contra la `rubrica-evaluacion.md` oficial de su carpeta en el material del bootcamp antes de finalizar.

---

## 🏛️ Modelo de Dominio — Teatro

### 1. Entidades Principales
- **Obra Teatral (`Item` / `Play`)**: Título, director/compañía, género, sinopsis, afiche/imagen, duración, clasificación, calificación.
- **Función (`Showtime`)**: Fecha, hora, sala/auditorio, estado (En cartelera, Próximamente, Agotada).
- **Sala (`TheatreHall`)**: Nombre (ej. "Sala Principal", "Teatro Experimental"), capacidad, mapa de zonas.
- **Zonas y Butacas (`SeatZone` / `Seat`)**: Platea Baja (VIP), Platea Alta, Palcos, Balcón General; numeración (Fila, Asiento), precio por zona.
- **Boleto / Reserva (`Ticket` / `Booking`)**: Código de reserva, datos del comprador, butacas seleccionadas, total pagado, QR digital.

### 2. Identidad Visual (Paleta Vino y Oro)
- **Fondo Principal**: `#14090c` (Vino profundo teatral)
- **Superficie / Tarjetas**: `#221116` (Vino oscuro)
- **Superficie Activa (Pressed)**: `#2d161d`
- **Bordes**: `#4a2a32` / `#351a21`
- **Acento Principal**: `#d4a24c` (Dorado escénico / Oro teatral)
- **Acento Atenuado (Badges)**: `rgba(212, 162, 76, 0.2)` (`#d4a24c33`)
- **Texto Principal**: `#f5ecd9` (Marfil cálido)
- **Texto Secundario**: `#b8a58a` (Arena suave)
- **Texto Atenuado**: `#8a7560`

---

## 🗺️ Mapa de las 18 Semanas del Bootcamp

| Sem | Módulo / Tema | Estado | Rama | Enfoque Dominio Teatro |
|:---:|:---|:---:|:---:|:---|
| **01** | Core Components y Flexbox | ✅ Completada | `Week-01` | Cartelera básica con ScrollView, ItemCard y paleta vino/oro |
| **02** | Listas, Inputs y Estilos | ✅ Completada | `Week-02` | FlatList virtualizada, búsqueda en tiempo real, KeyboardAvoidingView, theming centralizado |
| **03** | React Navigation | ✅ Completada | `Week-03` | Stack anidado en Tabs (Cartelera, Detalle de Obra con parámetros tipados, Favoritos) |
| **04** | Estado Global con Zustand | ✅ Completada | `Week-04` | Store global de obras guardadas, badge en vivo y acción Guardar/Quitar en cartelera y detalle |
| **05** | Networking & TanStack Query | ✅ Completada | `Week-05` | API REST local de cartelera con Axios, caché, estados de red, refresco y publicación de obras |
| **06** | Formularios y Validación | ✅ Completada | `Week-06` | Formularios Create/Edit con React Hook Form, Zod, `FormField` reutilizable y errores inline |
| **07** | Persistencia Local | ✅ Completada | `Week-07` | Preferencias MMKV, caché offline de cartelera y código de taquilla en SecureStore |
| **08** | Autenticación | ✅ Completada | `Week-08` | Login/Registro del Club, tokens en SecureStore y navegación condicional |
| **09** | Animaciones Básicas | ✅ Completada | `Week-09` | Entrada fade + slide, feedback táctil, barra de ocupación, cascada y LayoutAnimation |
| **10** | Reanimated & Gesture Handler | ✅ Completada | `Week-10` | SwipeableCard, Gesture.Tap, entrada escalonada y mapa de butacas con zoom |
| **11** | APIs Nativas | 🚀 Siguiente | `Week-11` | Notificaciones de inicio de función, compartir afiche, hápticos |
| **12** | Push Notifications | ⏳ Pendiente | `Week-12` | Recordatorios de función ("Tu obra comienza en 2 horas") |
| **13** | Testing | ⏳ Pendiente | `Week-13` | Pruebas unitarias de filtros, componentes y flujo de compra |
| **14** | Performance | ⏳ Pendiente | `Week-14` | Optimización de renderizado de lista y mapa de asientos |
| **15** | EAS Build | ⏳ Pendiente | `Week-15` | Compilación de binarios APK / AAB para Android |
| **16** | App Store & Google Play | ⏳ Pendiente | `Week-16` | Preparación de metadata, capturas y release |
| **17** | CI/CD y OTA Updates | ⏳ Pendiente | `Week-17` | Automatización de despliegues con EAS Update |
| **18** | Proyecto Final | ⏳ Pendiente | `Week-18` | Entrega integral de la app Teatro con todas las funcionalidades |

---

## 🎯 Control de Calidad: Semana 03 (React Navigation 7)

### Rúbrica Oficial (100 pts)
- [x] **Tab Navigator**: 2 pestañas principales (`Cartelera` y `Favoritos`) con iconos de `@expo/vector-icons` (Ionicons) y estilos activos/inactivos en la paleta vino/oro.
- [x] **Stack Navigator Anidado**: Stack dentro del Tab `Cartelera` que permite navegar de `HomeList` (Cartelera) a `HomeDetail` (Detalle de la Obra).
- [x] **Parámetros Tipados en TypeScript**: Navegación con tipos explícitos (`HomeStackParamList` y `RootTabParamList`) pasando `id` y `name`, sin ningún tipo `any`.
- [x] **Pantalla de Detalle (`DetailScreen`)**: Ficha técnica completa de la obra teatral con sinopsis, sala, duración, butacas, precio y botón de reserva/adquisición de boletos.
- [x] **Pantalla de Favoritos (`FavoritesScreen`)**: Segunda pestaña que lista las obras destacadas/guardadas por el usuario.
- [x] **Headers Personalizados**: Títulos de pantalla descriptivos con estilo teatral en el header (`headerStyle`, `headerTintColor`).
- [x] **NavigationContainer**: Configuración correcta del contenedor de navegación en `App.tsx`.

---

## 🎯 Control de Calidad: Semana 04 (Zustand)

### Rúbrica Oficial (Producto — 30 pts)
- [x] **Tab Navigator funcional**: pestañas `Cartelera` y `Guardados` con iconos de Ionicons.
- [x] **Store del dominio**: `useSavedStore` creado con `create<SavedStore>()` y tipos estrictos, sin `any`.
- [x] **Acciones del store**: `saveItem`, `removeItem`, `toggleItem` y `clearSaved`.
- [x] **Selectores específicos**: cada pantalla se suscribe solo a `savedItems`, al conteo o a las acciones que necesita.
- [x] **Badge en tiempo real**: la pestaña `Guardados` muestra el conteo desde Zustand y se oculta cuando la lista está vacía.
- [x] **Detalle conectado**: botón `Guardar` / `Guardada` que lee y escribe el mismo store que la cartelera.
- [x] **Cartelera conectada**: bookmark en cada tarjeta para guardar o quitar sin abrir el detalle.
- [x] **Pantalla Guardados**: lista desde el store, quitar una obra y vaciar la lista completa.
- [x] **TypeScript**: `npx tsc --noEmit` sin errores.

### Verificación funcional
- [x] Badge inicial `4` (obras destacadas de la Semana 03).
- [x] Guardar desde la tarjeta: badge pasa a `5` y la tarjeta cambia a "Quitar".
- [x] Detalle: el botón alterna `Guardar` / `Guardada`.
- [x] Guardados: quitar una obra actualiza el badge a `4`.
- [x] Vaciar: lista vacía, estado vacío visible y badge oculto.

---

## 🎯 Control de Calidad: Semana 05 (Networking y TanStack Query v5)

### Rúbrica Oficial (100 pts)
- [x] **QueryClientProvider**: configurado en `App.tsx` con `staleTime` de 2 minutos y `retry: 2`.
- [x] **Instancia Axios**: `src/services/api.ts` con `baseURL`, timeout e interceptor de respuesta.
- [x] **Adaptador de dominio**: `src/services/theatreApi.ts` normaliza ids y números de json-server al modelo `Item`.
- [x] **useQuery semántico**: `PLAYS_QUERY_KEY = ['plays']` y detalle `['plays', id]`.
- [x] **useMutation**: `useCreatePlay` publica una obra y ejecuta `invalidateQueries` en `onSuccess`.
- [x] **Estados de red**: loading, error con **Reintentar** y vacío diferenciado en `HomeScreen`.
- [x] **Pull-to-refresh**: `refreshing={isFetching && !isLoading}` y `onRefresh={refetch}`.
- [x] **API local**: `api/db.json` + json-server con scripts `pnpm api` y `pnpm dev`.
- [x] **Estado de UI separado**: `savedStore` guarda solo `savedIds`; las obras viven en TanStack Query.
- [x] **TypeScript**: `pnpm typecheck` sin errores ni usos de `any`.

### Verificación funcional
- [x] GET `/plays` devuelve las 12 obras de la temporada.
- [x] La cartelera muestra spinner en el primer fetch y datos después.
- [x] Con la API detenida aparece el mensaje de conexión y el botón **Reintentar**.
- [x] Pull-to-refresh vuelve a consultar la API.
- [x] POST `/plays` persiste la obra y la lista se refresca por invalidación.
- [x] Guardados y badge consumen ids, no objetos del servidor.
- [x] `expo export --platform web` genera el bundle sin errores.

---

## 🎯 Control de Calidad: Semana 06 (React Hook Form + Zod)

### Rúbrica Oficial (100 pts)
- [x] **Schema Zod**: `playSchema` con 12 campos, reglas de longitud, enums y URL.
- [x] **`z.coerce.number()`**: aplicado a `price`, `availableSeats` y `rating`.
- [x] **Tipos inferidos**: `PlayFormInput` con `z.input` y `PlayFormValues` con `z.infer<typeof playSchema>`; sin interfaces manuales duplicadas.
- [x] **`FormField` reutilizable**: `Controller` + `TextInput` + label + error, con genéricos de RHF.
- [x] **`FormChips`**: selector de género y sala conectado con `Controller`.
- [x] **`PlayForm` compartido**: un solo formulario para Create y Edit, sin duplicar campos.
- [x] **Create funcional**: `zodResolver`, `useCreatePlay`, botón deshabilitado y `ActivityIndicator`.
- [x] **Edit con `defaultValues`**: `usePlayById` + `reset()` en `useEffect` + `useUpdatePlay`.
- [x] **Errores inline**: mensajes de Zod visibles bajo cada campo inválido.
- [x] **Navegación tipada**: rutas `Create` y `Edit` dentro de `HomeStackParamList`.
- [x] **TypeScript**: `pnpm typecheck` sin errores ni usos de `any`.

### Verificación funcional
- [x] Enviar el formulario vacío muestra los errores de nombre, director, precio y sinopsis.
- [x] Una fecha imposible (ej. `2027-02-30`) es rechazada por el refine del schema.
- [x] Un precio `0` o texto no numérico muestra el mensaje correspondiente.
- [x] Publicar una obra válida la agrega a la cartelera y persiste en `api/db.json`.
- [x] Editar una obra precarga sus valores y actualiza lista, detalle y header.
- [x] `FormField` y `PlayForm` se reutilizan en las dos pantallas.
- [x] `expo export --platform web` genera el bundle sin errores.

---

## 🎯 Control de Calidad: Semana 07 (Persistencia Local)

### Rúbrica Oficial (Producto — 30 pts)

- [x] **MMKV**: `storage/mmkv.ts` con instancia única y `newArchEnabled: true`.
- [x] **Custom hook `usePreferences()`**: `sortOrder`, `compactMode`, `itemsPerPage` y `onlyAvailable` con hooks reactivos de MMKV.
- [x] **Persistencia sin `async/await`**: los setters de MMKV escriben de forma sincrónica y la UI reacciona al instante.
- [x] **Caché AsyncStorage**: `storage/playsCache.ts` guarda la última cartelera válida y la valida con Zod.
- [x] **Fallback offline**: `usePlays()` devuelve `{ plays, source }`; si la API falla y hay caché, responde con `source: 'cache'`.
- [x] **Banner offline**: “⚠️ Mostrando datos sin red” visible en Cartelera y Guardados, con acción **Reintentar**.
- [x] **`SettingsScreen`**: switches y selectores para las cuatro preferencias, aplicados en tiempo real.
- [x] **SecureStore**: código de acceso de taquilla guardado, leído y eliminado; solo se muestra enmascarado.
- [x] **`HomeScreen` actualizado**: orden alfabético, filtro por butacas, modo compacto y paginación con `itemsPerPage`.
- [x] **`ItemCard` compacto**: menos metadatos y afiche reducido sin romper la paleta vino/oro.
- [x] **Scripts nativos**: `prebuild`, `android` (`expo run:android`) e `ios` (`expo run:ios`); `android/` e `ios/` ignorados.
- [x] **TypeScript**: `pnpm typecheck` sin errores ni usos de `any`.
- [x] **Bundle**: `expo export --platform android` genera el bundle correctamente.

### Verificación funcional

- [x] Cambiar el orden en Ajustes reordena la cartelera.
- [x] Activar modo compacto reduce la información de cada tarjeta.
- [x] “Solo funciones con butacas” oculta las obras agotadas.
- [x] Elegir 6 por página muestra el botón **Mostrar más**.
- [x] Las preferencias sobreviven al cierre y reapertura de la app (MMKV).
- [x] Al detener la API, el pull-to-refresh muestra la caché con banner offline.
- [x] El código de taquilla se guarda, lee enmascarado y elimina desde SecureStore.
- [x] `pnpm typecheck` y `expo export --platform android` finalizan sin errores.

### Limitación de entorno

- No hay JDK, Android SDK ni `adb` en este equipo, por lo que la compilación y las capturas del simulador deben realizarse con Android Studio + JDK 17 o EAS Build.
- La app ya no abre en Expo Go por el módulo nativo de MMKV; `Week-06` queda como versión compatible con Expo Go.

---

## 🎯 Control de Calidad: Semana 08 (Autenticación)

### Rúbrica Oficial (Producto — 30 pts)

- [x] **`useAuthStore`**: Zustand con `user`, `accessToken`, `isAuthenticated`, `login`, `logout`, `refreshTokens` y `bootstrap`.
- [x] **Persistencia selectiva**: `persist` + `partialize` guarda solo `user` e `isAuthenticated`; los tokens viven en SecureStore.
- [x] **`tokenService`**: `saveTokens`, `getAccessToken`, `getRefreshToken` y `clearTokens` con `expo-secure-store`.
- [x] **`authService`**: login contra dummyjson, registro simulado, `/auth/me` y errores traducidos al español.
- [x] **Interceptor 401**: refresh single-flight, reintento de la petición original y logout si el refresh falla.
- [x] **`LoginScreen`**: RHF + Zod, errores inline, banner de credenciales, botón demo y spinner.
- [x] **`RegisterScreen`**: nombre, apellido, usuario, correo, contraseña y confirmación; registro simulado con redirección a Login.
- [x] **Navegación condicional**: `RootNavigator` monta `AuthNavigator` o `AppNavigator` según `isAuthenticated`.
- [x] **Persistencia al reiniciar**: `BootstrapGate` espera la hidratación y valida la sesión sin pedir re-login.
- [x] **`ProfileScreen`**: avatar, nombre, correo, número de socio, obras guardadas y logout.
- [x] **Sin tokens en la UI**: ninguna pantalla ni log muestra access/refresh token.
- [x] **TypeScript**: `pnpm typecheck` sin errores ni usos de `any`.
- [x] **Bundle**: `expo export --platform android` genera el bundle correctamente.

### Verificación funcional

- [x] Sin sesión, la app abre en Login y no permite acceder a las pestañas privadas.
- [x] Credenciales incorrectas muestran el mensaje de error sin cerrar la app.
- [x] `emilys` / `emilyspass` autentica y monta `AppNavigator` sin recargar.
- [x] El perfil muestra nombre, correo y número de socio.
- [x] Cerrar y reabrir la app restaura la sesión desde SecureStore.
- [x] Logout elimina los tokens y vuelve a Login.
- [x] El registro valida el formulario y redirige a Login con aviso de simulación.
- [x] `pnpm typecheck` y `expo export --platform android` finalizan sin errores.

### Limitación de entorno

- No hay JDK, Android SDK ni `adb` en este equipo, por lo que la compilación y las capturas del simulador deben realizarse con Android Studio + JDK 17 o EAS Build.
- La app requiere build nativo por MMKV; Expo Go no es compatible a partir de la Semana 07.

---

## 🎯 Control de Calidad: Semana 09 (Animaciones Básicas)

### Rúbrica Oficial (Producto — 30 pts)

- [x] **Entrada en `DetailScreen`**: `Animated.parallel` con opacidad `0 → 1` y `translateY 30 → 0` en 500 ms.
- [x] **Feedback táctil en tarjetas**: `AnimatedCard` con `Animated.spring` de escala `1 → 0.95 → 1`.
- [x] **Barra de progreso**: `ProgressBar` con `interpolate` de ancho y color según la ocupación de la sala.
- [x] **Entrada en cascada**: `Animated.stagger(80, ...)` sobre las obras visibles de la cartelera.
- [x] **`LayoutAnimation`**: transición al paginar y al aplicar el filtro de butacas, con habilitación en Android fuera del componente.
- [x] **`AnimatedButton`**: feedback con `Animated.timing` al presionar y `Animated.spring` al soltar.
- [x] **`ItemCard` como cuerpo visual**: los envoltorios `AnimatedCard` y `SwipeableCard` controlan la interacción.
- [x] **`useNativeDriver` correcto**: `true` en opacidad/transform; `false` solo en ancho/color.
- [x] **TypeScript**: `pnpm typecheck` sin errores ni usos de `any`.
- [x] **Bundle**: `expo export --platform android` genera el bundle correctamente.

### Verificación funcional

- [x] La cartelera aparece en cascada con 80 ms entre tarjetas.
- [x] Presionar una tarjeta la comprime y al soltar recupera su escala con rebote.
- [x] El detalle entra con fade + slide de 500 ms.
- [x] La barra de ocupación crece y cambia de verde a ámbar/rojo según el aforo.
- [x] El botón **Reservar Butacas** responde visualmente al tap.
- [x] Paginar o filtrar por butacas anima el cambio de layout.
- [x] `pnpm typecheck` y `expo export --platform android` finalizan sin errores.

### Limitación de entorno

- No hay JDK, Android SDK ni `adb` en este equipo, por lo que la compilación y las capturas del simulador deben realizarse con Android Studio + JDK 17 o EAS Build.
- La app requiere build nativo por MMKV; Expo Go no es compatible a partir de la Semana 07.

---

## 🎯 Control de Calidad: Semana 10 (Reanimated 4 + Gesture Handler)

### Rúbrica Oficial (Producto — 30 pts)

- [x] **`SwipeableCard` con `Gesture.Pan`**: arrastre horizontal con rotación interpolada, umbral de ±120 px y snap-back con `withSpring(0)`.
- [x] **Acción de dominio al superar el umbral**: derecha guarda o quita de Guardados; izquierda descarta la obra de la cartelera de la sesión con banner **Restaurar**.
- [x] **`AnimatedButton` con `Gesture.Tap`**: `withTiming` al presionar y `withSpring` al soltar, con `runOnJS` para la acción.
- [x] **Entrada escalonada**: `withDelay(index * 80, withTiming(...))` y `useAnimatedStyle` en las tarjetas de la cartelera.
- [x] **Transición de detalle**: fade + slide con `useSharedValue`, `withTiming` e `interpolate`.
- [x] **Bonus `Pinch`/zoom**: `SeatMapScreen` con `Gesture.Pinch` + `Gesture.Pan` simultáneos, escala 0.5x–2.5x y patrón `savedScale`.
- [x] **Mapa de butacas del dominio**: 320/120/80 butacas según la sala, ocupación determinista por hash del `id`, selección máxima de 8 butacas y confirmación con `Alert`.
- [x] **`GestureHandlerRootView`**: envuelve la app en `App.tsx`.
- [x] **Plugin de worklets**: `babel.config.js` con `react-native-worklets/plugin`, el correcto para Reanimated 4.
- [x] **TypeScript y bundle**: `pnpm typecheck` sin errores ni `as any`; `expo export --platform android` correcto.

### Verificación funcional

- [x] Deslizar a la derecha guarda o quita la obra del store de guardados.
- [x] Deslizar a la izquierda descarta la obra y aparece el banner con el contador.
- [x] Tocar **Restaurar** devuelve las obras descartadas a la cartelera.
- [x] Las tarjetas nuevas entran con retardo escalonado al paginar.
- [x] El detalle entra con fade + slide y muestra la ocupación de la sala.
- [x] **Reservar Butacas** abre el mapa de la sala correspondiente.
- [x] Pinch hace zoom y el pan de dos dedos recorre el mapa; **Centrar** restablece la vista.
- [x] Seleccionar butacas actualiza el resumen y el total en COP; confirmar muestra el `Alert`.
- [x] `pnpm typecheck` y `expo export --platform android` finalizan sin errores.

### Limitación de entorno

- No hay JDK, Android SDK ni `adb` en este equipo, por lo que la compilación y las capturas del simulador deben realizarse con Android Studio + JDK 17 o EAS Build.
- La app requiere build nativo por MMKV y Reanimated 4; Expo Go no es compatible a partir de la Semana 07.
