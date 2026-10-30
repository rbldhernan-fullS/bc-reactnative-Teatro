# Semana 04 — Estado Global con Zustand: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  

App móvil desarrollada con **React Native 0.86**, **Expo 57**, **React Navigation 7** y **Zustand 5** que implementa un **Bottom Tab Navigator** raíz con un **Native Stack Navigator** anidado, tipado estricto de parámetros en TypeScript (cero `any`) y un **store global de obras guardadas** compartido entre la cartelera, el detalle y la pestaña de guardados, con **badge dinámico** en el tab bar.

---

## 🎭 Dominio: Teatro

La aplicación permite explorar la programación escénica del **Teatro Colón**, consultar la ficha artística de cada montaje y gestionar una lista personal de obras guardadas:

1. **Pestaña Cartelera (`Home`)**: Lista virtualizada con búsqueda en tiempo real. Cada tarjeta incluye una acción de marcador que guarda o quita la obra del store global sin abrir el detalle.
2. **Pantalla de Detalle (`HomeDetail`)**: Recibe únicamente `{ id, name }` y resuelve la obra desde el catálogo. Incluye ficha técnica, sinopsis, aforo, reserva y acción de guardar/quitar.
3. **Pestaña Guardados (`Saved`)**: Lee las obras directamente de `useSavedStore` (sin props) y muestra el conteo en vivo en el badge del tab.

---

## 🗺️ Arquitectura de Navegación

```
NavigationContainer (App.tsx)
└── Tab.Navigator (RootNavigator.tsx)
    ├── Tab 1: "Cartelera" (Icono: ticket / ticket-outline)
    │   └── HomeStack.Navigator (Stack Anidado)
    │       ├── "HomeList"   → HomeScreen (FlatList + Búsqueda en tiempo real)
    │       └── "HomeDetail" → DetailScreen (Ficha técnica + Reserva)
    │
    └── Tab 2: "Guardados" (Icono: bookmark / bookmark-outline + Badge)
        └── SavedScreen (Obras leídas del store global)
```

---

## 🧠 Arquitectura de Estado (Semana 04)

```
                    ┌──────────────────────────────┐
                    │     useSavedStore (Zustand)   │
                    │     savedItems: Item[]        │
                    │     save / remove / toggle    │
                    └──────────────┬───────────────┘
                                   │  (sin prop drilling)
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   ItemCard                  DetailScreen               RootNavigator
 (marcador en lista)     (acción guardar/quitar)   (badge con selectSavedCount)
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   │
                             SavedScreen
                    (lee savedItems y permite quitar)
```

### Store (`src/stores/savedStore.ts`)

```typescript
export interface SavedStore {
  savedItems: Item[];
  saveItem: (item: Item) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Item) => void;
  clearSaved: () => void;
}

export const useSavedStore = create<SavedStore>()((set, get) => ({
  savedItems: initialSavedItems,
  saveItem: (item) => {
    const { savedItems } = get();
    if (savedItems.some((saved) => saved.id === item.id)) return;
    set((state) => ({ savedItems: [...state.savedItems, item] }));
  },
  removeItem: (id) =>
    set((state) => ({
      savedItems: state.savedItems.filter((item) => item.id !== id),
    })),
  toggleItem: (item) => { /* decide entre guardar y quitar */ },
  clearSaved: () => set({ savedItems: [] }),
}));
```

El store arranca con las obras destacadas de la Semana 03 (`['3', '1', '6', '8']`) para que la pestaña Guardados y el badge tengan contenido desde el primer render.

### Selectores

```typescript
export const selectSavedCount = (state: SavedStore): number => state.savedItems.length;

export const selectIsSaved =
  (id: string) =>
  (state: SavedStore): boolean =>
    state.savedItems.some((item) => item.id === id);
```

Cada componente se suscribe a un fragmento concreto: `RootNavigator` solo re-renderiza cuando cambia el **conteo**, y cada tarjeta consulta únicamente si **su** obra está guardada.

---

## 📐 Tipado de Parámetros (`src/navigation/types.ts`)

El detalle recibe solo los datos mínimos de navegación; el resto se resuelve desde el catálogo:

```typescript
export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Saved: undefined;
};
```

---

## 📱 Pantallas de la Aplicación

| 1. Cartelera (`HomeList`) | 2. Detalle de Obra (`HomeDetail`) | 3. Obras Guardadas (`Saved`) |
|---|---|---|
| Lista virtualizada con buscador y marcador por tarjeta | Ficha artística, aforo, sinopsis, reserva y guardado | Obras del store, badge en vivo y acción de quitar |

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Navigation | 7.x | Enrutamiento nativo multiplataforma (Tabs y Stacks) |
| Zustand | 5.0.16 | Estado global compartido sin `Provider` |
| @expo/vector-icons | 15.1.1 | Iconografía vectorial nativa (Ionicons) |
| Expo SDK | 57.0.31 | Runtime y tooling |
| React Native | 0.86.3 | Framework móvil nativo |
| React | 19.2.3 | Biblioteca de componentes |
| TypeScript | 6.0.3 | Tipado estricto (100% sin `any`) |
| pnpm | v12 | Gestor de dependencias ultrarrápido |

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
cd starter

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo Metro
pnpm start

# Ejecutar en plataforma específica
pnpm android   # Emulador Android / celular conectado
pnpm ios       # Simulador iOS
pnpm web       # Navegador web (localhost:8081)

# Verificación de tipos
pnpm exec tsc --noEmit
```

---

## 📂 Estructura del Código

```
starter/
├── App.tsx                         # Contenedor raíz con SafeAreaProvider y NavigationContainer
├── app.json                        # Configuración de Expo (paleta vino y oro)
├── package.json                    # Dependencias de Expo, React Navigation y Zustand
├── tsconfig.json                   # Configuración estricta de TypeScript
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx       # Tab Navigator + HomeStack + badge del store
    │   └── types.ts                # Parámetros tipados (RootTabParamList, HomeStackParamList)
    ├── screens/
    │   ├── HomeScreen.tsx          # Cartelera + búsqueda + marcador por tarjeta
    │   ├── DetailScreen.tsx        # Ficha técnica + reserva + guardado
    │   └── SavedScreen.tsx         # Obras leídas del store global
    ├── stores/
    │   └── savedStore.ts           # Store Zustand + selectores
    ├── components/
    │   └── ItemCard.tsx            # Tarjeta reutilizable con acción de guardado
    ├── data/
    │   └── mockData.ts             # 12 obras completas del dominio Teatro
    ├── types/
    │   └── index.ts                # Modelo de datos Item (sinopsis, aforo, sala)
    └── theme/
        └── index.ts                # Tokens de diseño teatral Vino y Oro
```

---

## ✅ Cumplimiento de la Rúbrica — Semana 04

| Criterio Evaluado | Pts | Estado | Implementación |
|---|:---:|:---:|---|
| Tab Navigator funcional (mínimo 2 pestañas) | 5 | ✅ | Pestañas `Cartelera` y `Guardados` con Ionicons y safe area inferior |
| Store del dominio con `create<StoreInterface>()` y tipos correctos | 5 | ✅ | `SavedStore` tipado en `savedStore.ts`, sin `any` |
| Al menos 2 acciones en el store | 5 | ✅ | `saveItem`, `removeItem`, `toggleItem` y `clearSaved` |
| Componente consumiendo el store con selector | 5 | ✅ | `RootNavigator`, `SavedScreen`, `HomeScreen`, `ItemCard` y `DetailScreen` |
| Badge en tab bar con conteo en tiempo real | 5 | ✅ | `tabBarBadge` alimentado por `selectSavedCount` |
| App funcional sin errores TypeScript | 5 | ✅ | `tsc --noEmit` con 0 errores |

### Semana 03 (vigente)

| Criterio | Estado |
|---|:---:|
| Tab Navigator con 2+ tabs | ✅ |
| Stack Navigator anidado | ✅ |
| Parámetros tipados sin `any` | ✅ |
| Header descriptivo y dinámico | ✅ |
| `NavigationContainer` raíz | ✅ |
| Dominio coherente (Teatro) | ✅ |
