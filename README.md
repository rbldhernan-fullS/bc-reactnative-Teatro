# Semana 08 — Autenticación Completa: Club Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-08`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que incorpora autenticación JWT completa sobre la cartelera del **Teatro Colón**: login y registro con **React Hook Form + Zod**, tokens en **SecureStore**, estado global con **Zustand + persist**, navegación condicional e interceptor Axios con refresh automático en respuestas **401**.

> ⚠️ **Build nativo obligatorio**: la app usa **MMKV** (Semana 07) con Nitro Modules. No funciona en Expo Go; ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm ios`.

---

## 🎭 Dominio: Teatro

La app administra la cartelera y la cuenta de los socios del **Club Teatro Colón**:

1. **Autenticación (`Login` / `Register`)**: acceso de socios y registro simulado.
2. **Cartelera (`HomeList`)**: obras de la API, búsqueda, preferencias MMKV, paginación y modo offline.
3. **Detalle (`HomeDetail`)**: ficha artística completa con edición.
4. **Nueva obra (`Create`)** y **Editar obra (`Edit`)**: formularios Zod.
5. **Guardados (`Saved`)**: obras favoritas del socio.
6. **Perfil (`Profile`)**: datos del socio, número de miembro, obras guardadas y logout.
7. **Ajustes (`Settings`)**: preferencias y código de taquilla en SecureStore.

---

## 🔐 Flujo de autenticación

```
┌──────────────┐    POST /auth/login    ┌──────────────────┐
│ LoginScreen  │ ─────────────────────▶ │ dummyjson.com    │
│ RHF + Zod    │ ◀───────────────────── │ access + refresh │
└──────┬───────┘                        └──────────────────┘
       │ login()
       ▼
┌───────────────────────┐   saveTokens()   ┌─────────────────┐
│ useAuthStore (Zustand)│ ───────────────▶ │ SecureStore     │
│ user · isAuthenticated│                  │ access/refresh  │
│ accessToken (memoria) │                  └─────────────────┘
└──────────┬────────────┘
           │ isAuthenticated === true
           ▼
   RootNavigator → AppNavigator
```

Al reiniciar, `BootstrapGate` espera la hidratación de Zustand y ejecuta `bootstrap()`:

1. Lee el access token de SecureStore.
2. Si no existe → sesión cerrada.
3. Si existe → `GET /auth/me` con `Authorization: Bearer`.
4. Si el token expiró → el interceptor refresca y reintenta.
5. Si no hay red pero el refresh token sigue guardado → conserva el perfil persistido (sin pedir re-login).

---

## 🧠 `useAuthStore`

`src/stores/authStore.ts` expone exactamente el contrato pedido por la rúbrica:

| Campo / acción | Descripción |
|---|---|
| `user` | Perfil del socio (`id`, `username`, `email`, `firstName`, `lastName`, `image`). |
| `accessToken` | Copia **en memoria**; no se persiste con Zustand. |
| `isAuthenticated` | Alterna entre `AuthNavigator` y `AppNavigator`. |
| `isLoading` | Operación de login/registro/logout en curso. |
| `isBootstrapping` | Restauración de sesión al abrir la app. |
| `error` | Mensaje legible para Login/Registro. |
| `login()` | Llama a dummyjson, guarda tokens y actualiza el estado. |
| `register()` | Registro simulado; no autentica. |
| `logout()` | `clearTokens()` + estado limpio. |
| `refreshTokens()` | Renueva tokens desde el refresh token guardado. |
| `bootstrap()` | Restaura la sesión persistida sin re-login. |
| `clearError()` | Limpia el error de la pantalla. |

### Persistencia selectiva

```ts
persist(initializer, {
  name: 'teatro-auth',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
});
```

Solo se persisten el perfil y la bandera de sesión. **Los tokens nunca tocan AsyncStorage ni MMKV**: su única fuente de verdad es `expo-secure-store`.

---

## 🔁 Interceptor 401 y refresh single-flight

`src/services/authClient.ts` crea dos instancias Axios:

- `publicAuthClient`: login y refresh, sin interceptores (evita bucles).
- `authClient`: añade `Authorization: Bearer <accessToken>` desde SecureStore.

Si una petición autenticada responde **401**:

1. Marca la petición con `_retry` para no reintentar en bucle.
2. Usa un **single-flight**: varias peticiones 401 comparten una sola llamada a `/auth/refresh`.
3. Guarda los nuevos tokens en SecureStore y actualiza el token en memoria del store.
4. Reintenta la petición original con el nuevo Bearer.
5. Si el refresh falla, borra los tokens y cierra la sesión automáticamente.

---

## 📝 Formularios con RHF + Zod

`src/schemas/authSchema.ts` define dos schemas:

| Campo | Regla |
|---|---|
| `username` | 2–50 caracteres, solo letras/números/punto/guion/guion bajo. |
| `email` | Correo válido, normalizado a minúsculas. |
| `password` | 6–100 caracteres. |
| `confirmPassword` | Debe coincidir con `password` (`refine`). |
| `firstName` / `lastName` | 2–50 caracteres. |

`LoginScreen` y `RegisterScreen` usan `useForm` + `zodResolver`, muestran errores inline mediante `FormField` y deshabilitan el botón con `ActivityIndicator` mientras la petición está en curso.

---

## 🧪 Credenciales de prueba

| Usuario | Contraseña |
|---|---|
| `emilys` | `emilyspass` |

El Login incluye un botón **Rellenar demo** para cargar estas credenciales. El registro es **simulado**: dummyjson no persiste cuentas nuevas, así que al crear la cuenta se muestra un aviso y se redirige al Login.

---

## ✅ Cumplimiento de la rúbrica (Semana 08)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| `useAuthStore` con `user`, `accessToken`, `isAuthenticated`, `login`, `logout`, `refreshTokens` | 8 | Store Zustand con persist parcial y bootstrap de sesión. |
| Pantalla de Login con RHF + Zod y errores de credenciales | 7 | `loginSchema`, `zodResolver`, errores inline y mensaje del servidor traducido. |
| Navegación condicional Auth ↔ App | 7 | `RootNavigator` monta `AuthNavigator` o `AppNavigator` según `isAuthenticated`. |
| Persistencia al reiniciar sin re-login | 5 | Tokens en SecureStore + `bootstrap()` + perfil persistido. |
| App compila sin errores | 3 | `pnpm typecheck` con 0 errores y bundle Android correcto. |
| Interceptor 401 con refresh automático | Extra | Single-flight, reintento y logout si el refresh falla. |

### Criterios transversales

- Tokens **solo** en SecureStore; nunca en AsyncStorage, MMKV ni logs.
- El access token no se muestra en ninguna pantalla.
- La lógica de auth está encapsulada en `authClient`, `authService`, `tokenService` y `authStore`; las pantallas solo consumen acciones.
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

Tras la primera compilación puedes abrir la app instalada y arrancar Metro con `pnpm start`. **No uses Expo Go**: MMKV requiere el binario nativo.

Para un celular físico, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> El firewall de Windows debe permitir el puerto `3001`. Para restaurar la semilla: `git checkout -- api/db.json`.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                              # 0 errores
npx expo export --platform android          # bundle correcto
```

Flujo manual sugerido:

1. Abrir la app sin sesión: se muestra **Login**.
2. Enviar el formulario vacío: aparecen los errores de Zod.
3. Probar credenciales incorrectas: banner “Usuario o contraseña incorrectos”.
4. Tocar **Rellenar demo** y entrar: se monta `AppNavigator` sin recargar.
5. Abrir **Perfil**: se ven nombre, correo, número de socio y obras guardadas.
6. Cerrar y reabrir la app: la sesión se restaura sin volver a pedir credenciales.
7. Cerrar sesión: vuelve a Login y los tokens se eliminan de SecureStore.
8. Crear una cuenta en **Registro**: se valida el formulario y se redirige a Login (registro simulado).

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57 | Runtime y tooling |
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

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras

starter/
├── App.tsx                         # BootstrapGate + QueryClient + Navigation
├── app.json                        # newArchEnabled + plugin expo-secure-store
└── src/
    ├── services/
    │   ├── authClient.ts           # Axios auth + interceptor 401 single-flight
    │   ├── authService.ts          # login / register / getProfile / errores
    │   ├── tokenService.ts         # SecureStore: save/get/clear tokens
    │   ├── api.ts                  # Axios de la cartelera
    │   └── theatreApi.ts           # Adaptador de dominio
    ├── stores/
    │   ├── authStore.ts            # Zustand + persist + bootstrap
    │   └── savedStore.ts           # Ids de obras guardadas
    ├── schemas/
    │   ├── authSchema.ts           # Login y Registro con Zod
    │   └── playSchema.ts           # Formularios de obras
    ├── screens/
    │   ├── LoginScreen.tsx         # RHF + Zod + credenciales demo
    │   ├── RegisterScreen.tsx      # Registro simulado
    │   ├── ProfileScreen.tsx       # Perfil, guardados y logout
    │   ├── HomeScreen.tsx          # Cartelera y banner offline
    │   ├── SavedScreen.tsx         # Obras guardadas
    │   └── SettingsScreen.tsx      # MMKV + SecureStore
    ├── navigation/
    │   ├── RootNavigator.tsx       # Auth ↔ App condicional
    │   ├── AuthNavigator.tsx       # Login / Registro
    │   ├── AppNavigator.tsx        # Cartelera / Guardados / Perfil / Ajustes
    │   └── types.ts                # AuthStackParamList + RootTabParamList
    ├── components/
    │   ├── FormField.tsx           # Controller + TextInput + error
    │   └── ItemCard.tsx            # Tarjeta con modo compacto
    ├── storage/
    │   ├── mmkv.ts                 # Instancia MMKV
    │   └── playsCache.ts           # Caché offline AsyncStorage
    ├── types/
    │   └── index.ts                # Item, AuthUser, AuthTokens, AuthSession
    └── theme/
        └── index.ts                # Paleta vino y oro
```
