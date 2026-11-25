# Semana 12 — Push Notifications: Recordatorios de Función

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-12`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que incorpora **notificaciones** sobre la cartelera del **Teatro Colón**: avisos de cartelera al publicar o editar una obra, recordatorios **2 horas antes** de cada función, prueba de **10 segundos**, **Expo Push Token** visible en Ajustes y navegación al detalle al tocar el banner.

> ⚠️ **Build nativo obligatorio**: la app usa **MMKV** (Semana 07), **Reanimated 4** (Semana 10), cámara/ubicación (Semana 11) y **expo-notifications** (Semana 12). No funciona en Expo Go; ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y la cuenta de los socios del **Club Teatro Colón**:

1. **Autenticación (`Login` / `Register`)**: acceso de socios y registro simulado.
2. **Cartelera (`HomeList`)**: búsqueda, preferencias MMKV, paginación, modo offline, entrada escalonada y swipe.
3. **Detalle (`HomeDetail`)**: ficha artística, ocupación, afiche local, sede del teatro y **recordatorio de función**.
4. **Mapa de butacas (`SeatMap`)**: zoom, desplazamiento, selección y resumen de reserva.
5. **Cámara (`Camera`)**: captura a pantalla completa del afiche de la obra.
6. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios Zod, afiche local y **aviso de cartelera**.
7. **Guardados, Perfil y Ajustes**: sesión, preferencias, SecureStore y **notificaciones / push token**.

---

## 🔔 Notificaciones implementadas

| # | Tipo | Cuándo se programa | Contenido | Archivo |
|:--:|---|---|---|---|
| 1 | **Evento de cartelera** | Al publicar o editar una obra (si el permiso ya está concedido) | «🎭 Nueva obra en cartelera» / «📝 Ficha actualizada» | `CreateScreen`, `EditScreen` |
| 2 | **Recordatorio de función** | Desde el detalle de la obra, 2 h antes de la función | «🎭 Tu función comienza en 2 horas» | `DetailScreen` |
| 3 | **Prueba de recordatorio** | Desde el detalle o Ajustes, en 10 s | «⏱ Prueba de recordatorio» | `DetailScreen`, `SettingsScreen` |
| 4 | **Prueba inmediata** | Desde Ajustes | «🔔 Notificaciones activas» | `SettingsScreen` |

Todas llevan `data` tipado (`NotificationPayload`) para navegar al detalle de la obra:

```ts
{
  screen: 'HomeDetail',
  kind: 'reminder',
  itemId: '1',
  name: 'Hamlet',
}
```

### Flujo de una notificación

1. **Permiso**: `getPermissionsAsync()` consulta sin diálogo; `requestPermissionsAsync()` se llama solo en acciones del socio (recordatorio o botón de Ajustes).
2. **Programación**: `scheduleNotificationAsync()` con `trigger: { type: DATE, date }` para las 2 h o `{ type: TIME_INTERVAL, seconds: 10 }` para la prueba.
3. **Primer plano**: `setNotificationHandler` (nivel de módulo en `App.tsx`) muestra banner y sonido; `addNotificationReceivedListener` actualiza la última notificación en Ajustes.
4. **Tap**: `addNotificationResponseReceivedListener` valida el payload y navega al detalle mediante `navigationRef` (`navigateFromNotification`). Si la app estaba cerrada, `getLastNotificationResponseAsync()` recupera el tap al arrancar.
5. **Cancelación**: `cancelScheduledNotificationAsync()` desde el detalle, la lista de Ajustes o al desactivar el switch de recordatorios.
6. **Cleanup**: cada `EventSubscription` se elimina con `subscription.remove()` en el `return` del `useEffect`.

### Persistencia y reconciliación

- `reminderStore` guarda `{ itemId, playName, notificationId, scheduledAt, kind }` por obra en **MMKV**.
- `NotificationCenter` compara al arrancar los ids con `getAllScheduledNotificationsAsync()` (`pruneReminders`) para descartar avisos ya disparados.
- Al recibir un recordatorio se elimina su registro solo si coincide el `notificationId`, sin tocar avisos más recientes.

---

## 🔑 Expo Push Token

Ajustes muestra el estado del permiso, si es dispositivo físico, el `projectId` y el token:

```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

El `projectId` se lee de `Constants.expoConfig?.extra?.eas?.projectId` y, como respaldo, de `Constants.easConfig?.projectId`. Si falta, la app **no intenta un token que fallará**: muestra el aviso visible con las instrucciones.

Para habilitar el push remoto:

```bash
cd starter
npx eas init          # crea el proyecto y escribe extra.eas.projectId en app.json
npx eas build --profile development --platform android
```

Después:

1. Abre la app en un **dispositivo físico** y toca **Activar notificaciones**.
2. Comparte o copia el token desde Ajustes.
3. Envía el push desde [https://expo.dev/notifications](https://expo.dev/notifications) o con `curl`:

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[TU_TOKEN]",
    "title": "🎭 Hamlet comienza pronto",
    "body": "Tu función empieza en 2 horas en la Sala Principal.",
    "data": { "screen": "HomeDetail", "itemId": "1", "name": "Hamlet" }
  }'
```

> El token **no existe en simulador**: no hay APNs ni FCM. En emulador funcionan las notificaciones locales y la prueba de 10 s. El push remoto en Android también requiere credenciales FCM (`google-services.json`) configuradas en EAS.

---

## 🔐 Permisos declarados

| Plataforma | Permiso | Motivo |
|---|---|---|
| iOS | `NSUserNotificationsUsageDescription` (gestionado por el plugin) | Recordatorios y avisos de cartelera |
| iOS | `NSCameraUsageDescription` | Capturar el afiche de la obra |
| iOS | `NSPhotoLibraryUsageDescription` | Elegir el afiche desde la galería |
| iOS | `NSLocationWhenInUseUsageDescription` | Sede y distancia al teatro |
| Android | `POST_NOTIFICATIONS` | Notificaciones en Android 13+ |
| Android | `RECEIVE_BOOT_COMPLETED` | Conservar avisos tras reiniciar |
| Android | `VIBRATE` | Vibración del canal de funciones |
| Android | `CAMERA` | Capturar el afiche |
| Android | `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` | Ubicación del socio y distancia |

El plugin `expo-notifications` se configura con el color dorado del tema y el canal `teatro-funciones`. El canal se crea al arrancar con `setNotificationChannelAsync` (importancia `HIGH`).

---

## ✅ Cumplimiento de la rúbrica (Semana 12)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| 2 tipos de notificaciones coherentes al dominio | 8 | Aviso de cartelera y recordatorio 2 h antes, más pruebas de 10 s. |
| Notificación local en primer plano | 6 | `setNotificationHandler` + `scheduleNotificationAsync` + banner visible. |
| Push token en dispositivo físico | 6 | `Device.isDevice` + `getExpoPushTokenAsync({ projectId })` visible en Ajustes. |
| Handler en la raíz de la app | 4 | `Notifications.setNotificationHandler` a nivel de módulo en `App.tsx`. |
| Listeners con cleanup | 4 | `subscription.remove()` en los tres efectos de `NotificationCenter`. |
| TypeScript sin errores | 2 | `pnpm typecheck` con 0 errores y sin `as any`. |

### Criterios de desempeño cubiertos

- `Device.isDevice` antes de solicitar el token.
- `requestPermissionsAsync()` con manejo de `denied` y acceso a ajustes del sistema.
- `getExpoPushTokenAsync({ projectId })` y visualización del token.
- `scheduleNotificationAsync` con `DATE` (2 h antes) y `TIME_INTERVAL` (10 s).
- `addNotificationReceivedListener` y `addNotificationResponseReceivedListener` con cleanup.
- Navegación al detalle al tocar el banner, incluso desde app cerrada.
- Cancelación individual y masiva de recordatorios.
- TypeScript valida los payloads usados para navegar desde las notificaciones.

---

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install --frozen-lockfile

# 1. API local de la cartelera (terminal 1)
pnpm api

# 2. Build nativo + Metro (terminal 2)
pnpm prebuild      # genera android/ e ios/ (ignorados por git)
pnpm android       # o: pnpm ios
```

Requisitos del build nativo:

- **Android**: JDK 17 + Android Studio con emulador o dispositivo USB.
- **iOS**: macOS con Xcode y simulador o dispositivo.

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No uses Expo Go**.

Para un celular físico, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> Para el emulador de Android la URL del host es `http://10.0.2.2:3001`. El firewall de Windows debe permitir el puerto `3001`.

### Probar notificaciones en emulador

- **Android**: las notificaciones locales funcionan sin Google Play Services. Verifica en **Ajustes → Apps → Teatro → Notificaciones** que el canal `Funciones del Teatro Colón` esté activo.
- **iOS Simulator**: las notificaciones locales funcionan; el push token no.
- **Prueba rápida**: Ajustes → **Probar aviso inmediato** o **Probar recordatorio (10 s)**. Mantén la app abierta para ver el banner en primer plano.
- **Recordatorio real**: abre una obra y toca **Recordar 2 h antes**. Ajusta la fecha de la obra en la API si la función está a menos de 2 horas.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                              # 0 errores
npx expo export --platform android          # bundle correcto
```

Flujo manual sugerido:

1. Entrar con `emilys` / `emilyspass`.
2. Abrir **Ajustes** y tocar **Activar notificaciones**; conceder el permiso.
3. En dispositivo físico, verificar el **Expo Push Token** y enviar un push desde Expo Push Tool.
4. Tocar **Probar aviso inmediato** y confirmar banner + sección «Última notificación recibida».
5. Abrir una obra y tocar **Recordar 2 h antes**; revisar la fecha programada en la sección y en Ajustes.
6. Tocar **Probar en 10 s**, esperar el aviso y comprobar que el registro desaparece al recibirlo.
7. Tocar el banner (app abierta y app cerrada) y confirmar que abre el detalle de la obra.
8. Crear o editar una obra con permiso concedido y ver el aviso de cartelera.
9. Desactivar **Recordatorios de función** y confirmar que se cancelan los avisos activos.

> Las capturas y el push real deben generarse en un equipo con Android Studio + JDK 17 o con EAS Build. La configuración de EAS debe incluir un `projectId` válido para probar el push remoto.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57.0.31 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| Expo Notifications | 57.0.24 | Permisos, token, programación y listeners |
| Expo Device | 57.0.2 | Diferenciar dispositivo físico de simulador |
| Expo Camera | 57.0.6 | Captura del afiche |
| Expo Image Picker | 57.0.20 | Selección desde la galería |
| Expo Location | 57.0.22 | Ubicación y seguimiento; referencia escrita por el usuario |
| React Native Reanimated | 4.5.1 | Animaciones en el hilo de UI |
| React Native Gesture Handler | 2.32.0 | Pan, pinch y tap |
| TanStack Query | 5.105 | Estado del servidor |
| Zustand | 5.0 | Sesión, guardados, afiche y recordatorios |
| React Hook Form + Zod | 7.81 / 4.4.3 | Formularios y validación |
| Expo SecureStore | 57.0.4 | Tokens cifrados |
| React Native MMKV | 4.3.2 | Preferencias y recordatorios |
| AsyncStorage | 2.2.0 | Perfil persistido y caché offline |
| Axios | 1.21 | Cliente HTTP e interceptor 401 |

---

## 📂 Estructura del código

| Ruta | Responsabilidad |
| --- | --- |
| `api/db.json` | Semilla de la cartelera para json-server |
| `starter/App.tsx` y `starter/src/app/providers.tsx` | Arranque y proveedores de la aplicación |
| `starter/src/features/` | Autenticación, cartelera, guardados, ajustes y sede |
| `starter/src/components/ui/` | Componentes compartidos y escucha de notificaciones |
| `starter/src/services/`, `starter/src/storage/` y `starter/src/stores/` | API, caché, almacenamiento y estado |
| `starter/src/navigation/` | Rutas, tipos y navegación desde notificaciones |

---

## 🌐 Ejecutar en web

Desde `starter`, ejecuta `pnpm install --frozen-lockfile` y `pnpm verify`. Inicia `pnpm api` en una terminal y `pnpm web` en otra. Abre la dirección que indique Expo.

Ejecuta `pnpm export:web` para compilar. Configura `EXPO_PUBLIC_API_URL` con la URL HTTPS de la API antes de exportar si vas a servir `dist`. En web, MMKV y SecureStore usan `localStorage` y las notificaciones quedan deshabilitadas. El afiche personalizado vive en memoria y se pierde al recargar.

[Video de la Semana 12](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/blob/main/docs/Week-12/video_week_12.mp4)

## Mapa de archivos por semana

Rutas desde `starter/`. Un archivo puede reunir cambios de varias semanas.

| Semana | Archivos principales |
| --- | --- |
| 01 | `App.tsx`, `src/features/plays/components/cards/ItemCard.tsx`, `src/types/index.ts` |
| 02 | `src/features/plays/components/home/HomeSearchBar.tsx`, `src/features/plays/hooks/useHomeFilters.ts`, `src/theme/index.ts` |
| 03 | `src/navigation/`, `src/features/plays/screens/DetailScreen.tsx`, `src/platform/notify.ts` |
| 04 | `src/stores/savedStore.ts`, `src/features/saved/screens/SavedScreen.tsx`, `src/features/plays/components/cards/SaveButton.tsx` |
| 05 | `src/config/env.ts`, `src/services/http.ts`, `src/features/plays/api/playsApi.ts`, `src/features/plays/hooks/usePlays.ts` |
| 06 | `src/features/plays/schemas/playSchema.ts`, `src/features/plays/components/forms/PlayForm.tsx`, `src/features/plays/screens/EditScreen.tsx` |
| 07 | `src/storage/`, `src/hooks/usePreferences.ts`, `src/features/settings/components/PreferencesSection.tsx` |
| 08 | `src/stores/authStore.ts`, `src/services/authApi.ts`, `src/features/auth/` |
| 09 | `src/features/plays/components/cards/AnimatedCard.tsx`, `src/components/ui/AnimatedButton.tsx`, `src/components/ui/ProgressBar.tsx` |
| 10 | `src/features/plays/components/cards/SwipeableCard.tsx`, `src/features/plays/components/cards/SwipeableCard.web.tsx`, `src/features/plays/screens/SeatMapScreen.tsx`, `src/features/plays/components/seatmap/SeatMapViewport.web.tsx` |
| 11 | `src/features/venue/hooks/useLocation.ts`, `src/features/venue/components/VenueCard.tsx`, `src/features/venue/components/PhotoPicker.tsx`, `src/features/venue/screens/CameraScreen.tsx` |
| 12 | `src/hooks/useNotifications.ts`, `src/components/ui/NotificationCenter.tsx`, `src/services/notifications.ts`, `src/stores/reminderStore.ts` |
