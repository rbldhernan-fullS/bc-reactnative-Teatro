# Semana 06 — Formularios y Validación: Teatro Colón

**Autor**: Hernán Eduardo Robledo Montaña  
**Ficha**: 3407193  
**Dominio Asignado**: Teatro  
**Rama**: `Week-06`

Aplicación móvil desarrollada con **React Native 0.86**, **Expo 57** y **TypeScript 6** que implementa formularios de creación y edición de obras teatrales con **React Hook Form + Zod**, conectados a una API REST local con **TanStack Query**.

---

## 🎭 Dominio: Teatro

La app administra la cartelera del **Teatro Colón**:

1. **Cartelera (`HomeList`)**: obras cargadas desde la API, búsqueda en tiempo real, pull-to-refresh y estados de carga, error y vacío.
2. **Detalle (`HomeDetail`)**: ficha artística consultada por `id`, sinopsis, sala, duración, aforo, precio, guardado y reserva. Incluye acceso directo a **Editar**.
3. **Nueva obra (`Create`)**: formulario completo validado con Zod antes de enviar el POST.
4. **Editar obra (`Edit`)**: mismo formulario con `defaultValues` cargados desde la API y `reset()` cuando llega la respuesta.
5. **Guardados (`Saved`)**: favoritos resueltos desde la caché usando solo ids en Zustand.

---

## 🗺️ Arquitectura de formularios

```
PlayForm (componente compartido)
├── FormField  → Controller + TextInput + error inline
└── FormChips  → Controller + Pressables (género y sala)
                      ↓
        useForm + zodResolver(playSchema)
                      ↓
      useCreatePlay / useUpdatePlay (TanStack Query)
                      ↓
             Axios → json-server → api/db.json
```

### Separación de estados

| Estado | Dónde vive | Ejemplo |
|---|---|---|
| Datos de la API | TanStack Query | Obras, precios, aforo, sinopsis |
| Estado del formulario | React Hook Form | Valores, errores, `isSubmitting` |
| Estado de UI | Zustand | Ids de obras guardadas y badge |

---

## 🧩 Componentes reutilizables

### `FormField<T>`

Encapsula `Controller` + `TextInput` + label + mensaje de error. Usa genéricos reales de React Hook Form (`Control<T>`, `FieldPath<T>`), sin `any`:

```tsx
<FormField
  control={control}
  name="name"
  label="Título de la obra"
  required
  placeholder="Ej. Sueño de una noche de verano"
  errorMessage={errors.name?.message}
/>
```

### `FormChips<T>`

Selector de opciones conectado al formulario. Se usa para `genre` y `hall`, que son uniones de literales en TypeScript:

```tsx
<FormChips
  control={control}
  name="genre"
  label="Género teatral"
  required
  options={THEATRE_GENRES}
  errorMessage={errors.genre?.message}
/>
```

### `PlayForm`

Formulario compartido por `CreateScreen` y `EditScreen`: evita duplicar los 11 campos, el botón de envío, el spinner y el mensaje de error del servidor.

---

## ✅ Reglas de validación (`src/schemas/playSchema.ts`)

| Campo | Regla Zod | Mensaje |
|---|---|---|
| `name` | `string().trim().min(2).max(80)` | Título de 2 a 80 caracteres |
| `subtitle` | `string().trim().min(3).max(120)` | Director o compañía obligatorio |
| `genre` | `z.enum(THEATRE_GENRES)` | Género teatral válido |
| `hall` | `z.enum(THEATRE_HALLS)` | Sala válida |
| `date` | regex `AAAA-MM-DD` + fecha real del calendario | Fecha existente |
| `time` | regex `HH:MM` (24 h) | Hora válida |
| `price` | `z.coerce.number().int().positive().max(1.000.000)` | Precio entero mayor que cero |
| `duration` | regex `120 min` | Formato de duración |
| `availableSeats` | `z.coerce.number().int().min(0).max(500)` | Aforo entre 0 y 500 |
| `rating` | `z.coerce.number().min(0).max(5)` | Calificación entre 0 y 5 |
| `imageUri` | `string().url()` | URL válida del afiche |
| `synopsis` | `string().trim().min(20).max(600)` | Sinopsis de 20 a 600 caracteres |

Los campos numéricos usan `z.coerce.number()` porque `TextInput` siempre entrega un `string`. El formulario se tipa con `z.input` para los valores de entrada y `z.output` para los valores ya convertidos:

```ts
useForm<PlayFormInput, unknown, PlayFormValues>({
  resolver: zodResolver(playSchema),
  defaultValues: EMPTY_PLAY_FORM,
});
```

---

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install

# API + Metro en un solo comando
pnpm dev

# O en dos terminales
pnpm api    # json-server en http://localhost:3001
pnpm start  # Expo / Metro
```

Para un celular físico, la app detecta la IP de Metro automáticamente. Si tu red lo requiere, crea `starter/.env` desde `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

> El firewall de Windows debe permitir el puerto `3001`. Para restaurar la semilla: `git checkout -- api/db.json`.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React Native | 0.86.3 | Framework móvil |
| Expo SDK | 57 | Runtime y tooling |
| React | 19.2.3 | Componentes |
| TypeScript | 6.0.3 | Tipado estricto (sin `any`) |
| React Hook Form | 7.81.0 | Estado y envío de formularios |
| Zod | 4.4.3 | Validación y tipos inferidos |
| @hookform/resolvers | 5.4.0 | `zodResolver` |
| TanStack Query | 5.105 | Estado del servidor |
| Axios | 1.21 | Cliente HTTP |
| json-server | 0.17.4 | API REST local |
| Zustand | 5.0 | Estado de UI (ids guardados) |
| React Navigation | 7.x | Tabs + Stack anidado |

> **Nota de tooling**: Expo incluye Zod 3 de forma transitiva. `starter/pnpm-workspace.yaml` declara el peer de Zod en `@hookform/resolvers` para que pnpm enlace la versión 4 del proyecto y TypeScript resuelva una sola instancia.

---

## 📂 Estructura del código

```
api/
└── db.json                         # Semilla de las 12 obras

starter/
├── App.tsx                         # QueryClientProvider + NavigationContainer
├── pnpm-workspace.yaml             # Peer de Zod 4 para @hookform/resolvers
└── src/
    ├── schemas/
    │   └── playSchema.ts           # Schema Zod, inferencia y mapeo de payloads
    ├── components/
    │   ├── FormField.tsx           # Controller + TextInput + error
    │   ├── FormChips.tsx           # Selector de género y sala
    │   ├── PlayForm.tsx            # Formulario compartido Create/Edit
    │   ├── ItemCard.tsx            # Tarjeta de obra
    │   └── ScreenState.tsx         # Loading / error / vacío
    ├── hooks/
    │   └── usePlays.ts             # Queries y mutations de la API
    ├── navigation/
    │   ├── RootNavigator.tsx       # HomeList, HomeDetail, Create y Edit
    │   └── types.ts                # HomeStackParamList tipado
    ├── screens/
    │   ├── HomeScreen.tsx          # Cartelera con estados de red
    │   ├── DetailScreen.tsx        # Detalle + acceso a editar
    │   ├── CreateScreen.tsx        # Formulario de creación
    │   ├── EditScreen.tsx          # Formulario con defaultValues
    │   └── SavedScreen.tsx         # Guardados por id
    ├── services/
    │   ├── api.ts                  # Axios y errores legibles
    │   └── theatreApi.ts           # Adaptador de dominio
    ├── stores/
    │   └── savedStore.ts           # Zustand: savedIds
    ├── types/
    │   └── index.ts                # Item, catálogos y payloads
    └── theme/
        └── index.ts                # Paleta vino y oro
```

---

## ✅ Cumplimiento de la rúbrica (Semana 06)

| Criterio | Puntos | Implementación |
|---|:---:|---|
| `FormField` reutilizable | 5 | `Controller` + `TextInput` + error, usado en las dos pantallas vía `PlayForm` |
| `CreateScreen` funcional | 8 | `useForm` + `zodResolver` + `useCreatePlay`; navega atrás en `onSuccess` |
| `EditScreen` con `defaultValues` | 8 | `usePlayById` + `reset()` en `useEffect` + `useUpdatePlay` |
| Validación activa y errores inline | 5 | Mensajes de Zod bajo cada campo y borde rojo |
| App corriendo en simulador | 4 | Flujo verificado en Expo Web; estructura compatible con Expo Go |

### Criterios transversales

- `FormField` y `FormChips` con genéricos, sin `any`.
- `zodResolver` conectado a `useForm` en ambos formularios.
- `z.coerce.number()` en precio, aforo y calificación.
- `PlayFormData` inferido con `z.infer`; no hay interfaces manuales duplicando el schema.
- Botón deshabilitado y `ActivityIndicator` mientras `isSubmitting || isPending`.

---

## 🧪 Verificación

```bash
cd starter
pnpm typecheck                     # 0 errores
pnpm expo export --platform web    # bundle correcto
```

Flujo manual sugerido:

1. `pnpm dev` y abrir la app.
2. Tocar **Nueva** y enviar el formulario vacío: aparecen los errores inline.
3. Corregir los campos y publicar: la obra aparece en la cartelera.
4. Abrir el detalle y tocar el icono de edición del header.
5. Cambiar el título o el precio, guardar y comprobar la actualización en detalle y lista.
6. Revisar la persistencia en `api/db.json` y reiniciar la app.
