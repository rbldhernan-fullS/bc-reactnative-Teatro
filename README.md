# Semana 01 — App de Tarjetas: Teatro

Autor: Hernán Eduardo Robledo Montaña
Ficha: 3407193

App móvil de pantalla única hecha con React Native y Expo que muestra la cartelera de un teatro como una lista de tarjetas.

## Dominio: Teatro

Cada tarjeta representa una obra con su título, director o compañía, género, fecha de función y precio. La pantalla principal tiene un header con el nombre del dominio ("Teatro") y el subtítulo "Cartelera de la temporada".

## Pantalla

![Pantalla principal](./[COMPLETAR: nombre-de-la-captura].png)

## Stack

| Tecnología | Versión |
|---|---|
| Expo SDK | 57.0.4 |
| React Native | 0.86.0 |
| React | 19.2.3 |
| TypeScript | 6.0.3 |
| Gestor de paquetes | pnpm |

## Cómo ejecutar

```bash
pnpm install
pnpm start
```

Para verla en el navegador se agregaron `react-dom` y `react-native-web`:

```bash
pnpm add react-dom@19.2.3
pnpm expo install react-native-web
pnpm expo start --web
```

Probada en: [COMPLETAR: web / Expo Go en celular / ambos].

## Estructura

```
src/
├── types/index.ts          # Interfaz Item (obra)
├── data/mockData.ts        # Datos de ejemplo del dominio
├── components/ItemCard.tsx # Tarjeta reutilizable
└── screens/HomeScreen.tsx  # Header + lista de tarjetas
```

## Modelo de datos

```ts
export interface Item {
  id: string;
  name: string;       // título de la obra
  subtitle: string;   // director o compañía
  imageUri: string;
  genre: string;
  date: string;
  price: number;      // en COP
}
```

## Decisiones de diseño

- **Tarjeta con `Pressable`:** cambia la opacidad al tocarla (`pressed`), lo que da feedback visual al usuario.
- **Layout con Flexbox:** imagen arriba y texto debajo (eje vertical por defecto); la fila de género/fecha y precio usa `flexDirection: 'row'` con `justifyContent: 'space-between'`.
- **Imagen con `resizeMode="cover"`:** recorta en vez de estirar, para evitar deformaciones.
- **Precio formateado** con `toLocaleString('es-CO')`.
- **Paleta:** [COMPLETAR: confirma si aplicaste la paleta vino y oro (fondo `#14090c`, tarjeta `#221116`, acento dorado `#d4a24c`) o si dejaste los colores originales].
- **Lista con `ScrollView` y `map`:** cada tarjeta usa `key={item.id}`. En la Semana 2 se cambia a `FlatList`.

## Requisitos de la semana

- [x] Pantalla principal con lista de tarjetas (`ScrollView`)
- [x] Mínimo 3 tarjetas con datos del dominio (4 en `mockData.ts`)
- [x] Cada tarjeta con imagen, dos textos con estilos distintos y un `Pressable` con feedback visual
- [x] Header con el nombre del dominio
- [x] Estilos con `StyleSheet.create`, sin estilos inline
- [x] Interfaces TypeScript para los datos
- [x] Sin `position: 'absolute'` ni librerías de UI externas

## Problemas encontrados y soluciones

| Problema | Causa | Solución |
|---|---|---|
| Pantalla en blanco en web | `react` (19.2.3) y `react-dom` (19.0.0) con versiones distintas | `pnpm add react-dom@19.2.3` |
| Subrayado rojo en `tsconfig.json` | Ruta en `paths` sin `./` (no hay `baseUrl`) | Usar `"@/*": ["./src/*"]` |
| Tarjetas descuadradas | Se renderizaban dentro del estilo del placeholder (`emptyState`) | Renderizar `ItemCard` directo dentro del `ScrollView` |

## Pendientes

- Imágenes locales en `assets/images/` (hoy se cargan desde `picsum.photos`).
