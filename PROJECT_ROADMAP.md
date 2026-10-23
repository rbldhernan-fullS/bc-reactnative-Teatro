# 🎭 PROYECTO TEATRO — Roadmap Maestro & Guía de Desarrollo (18 Semanas)

> **Estudiante / Desarrollador**: Hernán Eduardo Robledo Montaña  
> **Ficha**: 3407193  
> **Dominio Asignado**: **TEATRO** (Cartelera, Funciones, Salas, Butacas, Reservas y Boletos)  
> **Stack Base**: React Native 0.86, Expo 57, React 19, TypeScript 6, pnpm  
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
| **05** | Networking & TanStack Query | ⏳ Pendiente | `Week-05` | Consumo de API de cartelera, cache y refresco de funciones |
| **06** | Formularios y Validación | ⏳ Pendiente | `Week-06` | Formulario de reserva, datos del asistente, validación Zod |
| **07** | Persistencia Local | ⏳ Pendiente | `Week-07` | Historial de reservas y boletos guardados offline (MMKV / AsyncStorage) |
| **08** | Autenticación | ⏳ Pendiente | `Week-08` | Login/Registro para miembros del club del teatro |
| **09** | Animaciones Básicas | ⏳ Pendiente | `Week-09` | Transición de telón, fade-in de afiches, feedback táctil |
| **10** | Reanimated & Gesture Handler | ⏳ Pendiente | `Week-10` | Mapa interactivo de butacas con zoom y gestos |
| **11** | APIs Nativas | ⏳ Pendiente | `Week-11` | Notificaciones de inicio de función, compartir afiche, hápticos |
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
