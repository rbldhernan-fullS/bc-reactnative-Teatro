# Semana 02 — App de Listas con Búsqueda: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  

App móvil desarrollada con **React Native** y **Expo** que implementa una lista virtualizada con `FlatList`, filtrado y búsqueda en tiempo real mediante `TextInput`, optimización de renderizado con `useMemo` y `useCallback`, manejo responsivo del teclado con `KeyboardAvoidingView` y arquitectura de diseño visual centralizada (Theming).

---

## 🎭 Dominio: Teatro

La aplicación representa la cartelera oficial y el sistema de información de obras de un teatro. Permite explorar producciones en cartelera, conocer detalles de sala, fechas, horarios, butacas disponibles y filtrar obras de manera instantánea por:
- Título de la obra (ej. *Hamlet*, *El Fantasma de la Ópera*)
- Director o compañía teatral (ej. *Dir. Laura Gómez*, *Ensamble Lírico*)
- Género teatral (*Drama*, *Tragedia*, *Musical*, *Comedia*, *Clásico*, *Infantil*)
- Sala (*Sala Principal*, *Sala de Cámara*, *Teatro Experimental*)

---

## 📱 Capturas / Pantalla

| Cartelera Completa (FlatList) | Búsqueda en Tiempo Real | Estado Vacío (Sin Resultados) |
|---|---|---|
| Lista virtualizada con afiches y datos | Filtrado dinámico por texto | Mensaje personalizado con botón de limpieza |

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Expo SDK | 57.0.4 | Plataforma y herramientas de desarrollo |
| React Native | 0.86.0 | Framework nativo multiplataforma |
| React | 19.2.3 | Librería base de componentes y hooks |
| TypeScript | 6.0.3 | Tipado estricto sin `any` |
| Gestor de paquetes | pnpm (v12) | Manejo eficiente de dependencias |

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# Entrar a la carpeta de la app
cd starter

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo Metro
pnpm start

# Ejecutar en plataforma específica
pnpm android   # Emulador Android / dispositivo
pnpm ios       # Simulador iOS
pnpm web       # Navegador web (localhost:8081)
```

---

## 📂 Estructura del Código

```
starter/
├── App.tsx                     # Punto de entrada de la aplicación
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración de TypeScript y path aliases (@/*)
└── src/
    ├── types/
    │   └── index.ts            # Interfaz Item y tipos de dominio (TheatreGenre)
    ├── theme/
    │   └── index.ts            # Tokens de diseño (COLORS, TYPOGRAPHY, SPACING, RADIUS)
    ├── data/
    │   └── mockData.ts         # 12 obras teatrales realistas con datos detallados
    ├── components/
    │   └── ItemCard.tsx        # Tarjeta de obra reutilizable con feedback táctil
    └── screens/
        └── HomeScreen.tsx      # Pantalla principal con FlatList, TextInput y búsqueda
```

---

## 📐 Modelo de Datos (`src/types/index.ts`)

```typescript
export type TheatreGenre =
  | 'Drama'
  | 'Tragedia'
  | 'Musical'
  | 'Comedia'
  | 'Ópera'
  | 'Monólogo'
  | 'Clásico'
  | 'Infantil';

export interface Item {
  id: string;              // ID único (utilizado en keyExtractor)
  name: string;            // Título de la obra
  subtitle: string;        // Director o compañía teatral
  imageUri: string;        // Afiche promocional
  genre: TheatreGenre;     // Género teatral
  date: string;            // Fecha de función (YYYY-MM-DD)
  time: string;            // Hora de función
  price: number;           // Precio en pesos colombianos (COP)
  hall: string;            // Sala teatral (Principal, Cámara, Experimental)
  duration: string;        // Duración aproximada
  availableSeats: number;  // Butacas disponibles
  rating: number;          // Calificación del público (1 a 5)
}
```

---

## 🎨 Paleta de Color e Identidad Visual (`src/theme/index.ts`)

Inspirada en el telón de terciopelo y la atmósfera de una sala clásica de teatro:
- **Fondo principal (`COLORS.background`)**: `#14090c` (Vino tinto oscuro)
- **Superficie de tarjetas (`COLORS.surface`)**: `#221116`
- **Superficie activa al presionar (`COLORS.surfaceAlt`)**: `#2d161d`
- **Acento dorado (`COLORS.accent`)**: `#d4a24c` (Oro escénico)
- **Bordes (`COLORS.border` / `COLORS.borderLight`)**: `#4a2a32` / `#351a21`
- **Texto principal (`COLORS.textPrimary`)**: `#f5ecd9` (Marfil cálido)
- **Texto secundario (`COLORS.textSecondary`)**: `#b8a58a` (Arena dorado)
- **Tipografía y espaciado**: Escalas estandarizadas sin valores numéricos sueltos o hardcoded.

---

## 💡 Decisiones de Diseño y Rendimiento

1. **Migración de `ScrollView` a `FlatList`**:
   - `ScrollView` renderiza todos los elementos en memoria de inmediato, lo que degrada el rendimiento en listas medianas y largas.
   - `FlatList` implementa virtualización: solo renderiza los elementos visibles en la ventana gráfica y recicla vistas, garantizando 60 FPS estables.
2. **Identificadores Únicos con `keyExtractor`**:
   - Se utiliza `keyExtractor={(item) => item.id}` garantizando que React identifique cada elemento sin depender del índice del array, previniendo fallos de reconciliación y pérdida de estado.
3. **Filtrado Eficiente con `useMemo`**:
   - El filtrado de texto sobre la lista de obras se encapsula en `useMemo(() => ..., [query])`, ejecutándose únicamente cuando la consulta del usuario cambia, evitando recálculos innecesarios en re-renders ajenos.
4. **Memorización de Callbacks con `useCallback`**:
   - `renderItem`, `renderEmpty` y el separador se memorizan con `useCallback` para evitar crear nuevas instancias de función en cada ciclo de render.
5. **Manejo del Teclado y UX**:
   - `KeyboardAvoidingView` ajusta dinámicamente la altura (`behavior="padding"` en iOS).
   - `TouchableWithoutFeedback` con `Keyboard.dismiss` permite cerrar el teclado tocando cualquier área libre de la pantalla.
   - `keyboardShouldPersistTaps="handled"` asegura que al tocar una tarjeta mientras el teclado está abierto, el evento de toque se procese correctamente.
6. **Estado Vacío Resiliente (`ListEmptyComponent`)**:
   - Si una búsqueda no arroja coincidencias, se presenta un mensaje comprensivo con ilustración simbólica y un botón interactivo para restablecer la búsqueda con un solo toque.

---

## ✅ Cumplimiento de Criterios de Evaluación (Semana 02)

| Criterio Evaluado | Estado | Detalle de Implementación |
|---|:---:|---|
| **FlatList con `keyExtractor` por ID** | ✅ Cumplido | `keyExtractor={(item) => item.id}` en `HomeScreen.tsx` |
| **TextInput con búsqueda funcional** | ✅ Cumplido | Búsqueda reactiva en tiempo real sobre título, director y género |
| **`useMemo` para filtrado** | ✅ Cumplido | Memorizado con dependencia `[query]` insensible a mayúsculas |
| **Componente `ItemCard` con 3+ campos** | ✅ Cumplido | Muestra afiche, título, director, género, sala, duración, butacas y precio |
| **Estado vacío personalizado** | ✅ Cumplido | Componente `renderEmpty` con feedback y botón de limpieza |
| **`KeyboardAvoidingView` correcto** | ✅ Cumplido | Configurado con dismiss en toque externo |
| **Constantes de tema (`COLORS`, etc.)** | ✅ Cumplido | Todos los estilos provienen de `src/theme/index.ts` |
| **TypeScript sin `any`** | ✅ Cumplido | Tipado estricto en datos, props, callbacks y StyleSheet |
| **Mínimo 10 items del dominio** | ✅ Cumplido | 12 obras completas en `mockData.ts` adaptadas al dominio Teatro |
