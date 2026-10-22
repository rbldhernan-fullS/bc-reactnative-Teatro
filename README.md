# Semana 03 — React Navigation 7: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  

App móvil desarrollada con **React Native 0.86**, **Expo 57** y **React Navigation 7** que implementa una arquitectura de navegación integral compuesta por un **Bottom Tab Navigator** raíz y un **Native Stack Navigator** anidado, con tipado estricto de parámetros en TypeScript (cero `any`).

---

## 🎭 Dominio: Teatro

La aplicación permite explorar la programación escénica del **Teatro Colón**, consultar la ficha artística de cada montaje y gestionar obras guardadas en favoritos:
1. **Pestaña Cartelera (`Home`)**: Lista interactiva virtualizada con búsqueda en tiempo real. Al tocar cualquier obra teatral, navega fluidamente a la pantalla de detalle enviando sus parámetros tipados.
2. **Pantalla de Detalle (`HomeDetail`)**: Ficha técnica y artística completa con afiche en alta resolución, sinopsis dramática, sala asignada, duración, butacas disponibles y botón de reserva.
3. **Pestaña Favoritos (`Favorites`)**: Colección personal de obras destacadas por el usuario con acceso directo a la función y reserva.

---

## 🗺️ Arquitectura de Navegación

```
NavigationContainer (App.tsx)
└── Tab.Navigator (RootNavigator.tsx)
    ├── Tab 1: "Cartelera" (Icono: ticket / ticket-outline)
    │   └── HomeStack.Navigator (Stack Anidado)
    │       ├── "HomeList"   → HomeScreen (FlatList + Búsqueda en tiempo real)
    │       └── "HomeDetail" → DetailScreen (Ficha técnica + Parámetros tipados)
    │
    └── Tab 2: "Favoritos" (Icono: heart / heart-outline)
        └── FavoritesScreen (Lista de obras preferidas con navegación al detalle)
```

---

## 📐 Tipado de Parámetros (`src/navigation/types.ts`)

La navegación está tipada de extremo a extremo utilizando los tipos oficiales de React Navigation 7, garantizando autocompletado y validación en tiempo de compilación sin recurrir a `any`:

```typescript
export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
    subtitle: string;
    imageUri: string;
    genre: TheatreGenre;
    date: string;
    time: string;
    price: number;
    hall: string;
    duration: string;
    availableSeats: number;
    rating: number;
    synopsis: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Favorites: undefined;
};
```

---

## 📱 Pantallas de la Aplicación

| 1. Cartelera (`HomeList`) | 2. Detalle de Obra (`HomeDetail`) | 3. Obras Favoritas (`Favorites`) |
|---|---|---|
| Lista virtualizada con buscador y chips de género | Ficha artística, aforo, sinopsis y botón de reserva | Obras preferidas guardadas y acceso a detalles |

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Navigation | 7.x | Enrutamiento nativo multiplataforma (Tabs y Stacks) |
| @expo/vector-icons | 15.1.1 | Iconografía vectorial nativa (Ionicons) |
| Expo SDK | 57.0.4 | Runtime y tooling |
| React Native | 0.86.0 | Framework móvil nativo |
| React | 19.2.3 | Biblioteca de componentes |
| TypeScript | 6.0.3 | Tipado estricto (100% sin `any`) |
| pnpm | v12 | Gestor de dependencias ultrarrápido |

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
cd starter

# Instalar dependencias si es necesario
pnpm install

# Iniciar servidor de desarrollo Metro
pnpm start

# Ejecutar en plataforma específica
pnpm android   # Emulador Android / celular conectado
pnpm ios       # Simulador iOS
pnpm web       # Navegador web (localhost:8081)
```

---

## 📂 Estructura del Código

```
starter/
├── App.tsx                         # Contenedor raíz con SafeAreaProvider y NavigationContainer
├── package.json                    # Dependencias de React Navigation 7 y Expo
├── tsconfig.json                   # Configuración estricta de TypeScript
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx       # Bottom Tab Navigator + HomeStack anidado
    │   └── types.ts                # Parámetros tipados (RootTabParamList, HomeStackParamList)
    ├── screens/
    │   ├── HomeScreen.tsx          # Pantalla de cartelera (FlatList + navegación al tocar)
    │   ├── DetailScreen.tsx        # Ficha técnica, sinopsis y reserva (recibe params)
    │   └── FavoritesScreen.tsx     # Segunda pestaña con obras destacadas
    ├── components/
    │   └── ItemCard.tsx            # Tarjeta reutilizable adaptada al dominio Teatro
    ├── data/
    │   └── mockData.ts             # 12 obras completas y lista de favoritas
    ├── types/
    │   └── index.ts                # Modelo de datos Item (con sinopsis, aforo y sala)
    └── theme/
        └── index.ts                # Tokens de diseño teatral Vino y Oro
```

---

## ✅ Cumplimiento de Criterios de Evaluación (Semana 03)

| Criterio Evaluado | Estado | Implementación en el Proyecto |
|---|:---:|---|
| **Tab Navigator con 2+ tabs** | ✅ Cumplido | Pestañas `Cartelera` y `Favoritos` con iconos Ionicons y tintes del tema |
| **Stack Navigator Anidado** | ✅ Cumplido | `HomeStack` anidado dentro de la pestaña `Home`, permitiendo lista ➔ detalle |
| **Parámetros Tipados** | ✅ Cumplido | `HomeStackParamList` tipado estrictamente sin ningún tipo `any` |
| **Header Descriptivo** | ✅ Cumplido | Título dinámico en detalle (`route.params.name`) y estilo vino y oro |
| **NavigationContainer Raíz** | ✅ Cumplido | Configurado en `App.tsx` junto con `SafeAreaProvider` |
| **Dominio Coherente** | ✅ Cumplido | 100% adaptado al dominio Teatro (sinopsis, butacas, funciones, salas) |
| **TypeScript Estricto** | ✅ Cumplido | 0 errores de compilación (`tsc --noEmit`), 0 usos de `any` |
