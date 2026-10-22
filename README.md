# 🎭 App de Cartelera Teatral — Bootcamp React Native

Bienvenido al repositorio central de la aplicación móvil de Cartelera Teatral. Este proyecto es el resultado de un bootcamp intensivo de aproximadamente 18 semanas enfocado en el desarrollo móvil multiplataforma utilizando React Native, Expo y TypeScript.

## 📌 Sobre el Proyecto

La aplicación permite a los usuarios explorar la cartelera de una temporada teatral, ver detalles de las obras (director, género, fechas, precios) y buscar funciones específicas. El proyecto está construido con un enfoque progresivo, evolucionando semana a semana para incorporar patrones de arquitectura avanzados y nuevas herramientas del ecosistema.

## 🛠️ Stack Tecnológico Base

- **Framework:** React Native (0.86.0) + Expo SDK 57
- **Lenguaje:** TypeScript
- **Enrutamiento:** React Navigation 7 (Bottom Tabs & Native Stack)
- **Estado Global:** Zustand + AsyncStorage (Persistencia)
- **Gestor de paquetes:** pnpm

*(El stack se irá ampliando conforme avancemos en las semanas del programa).*

## 🗺️ Hoja de Ruta del Desarrollo (Fases Iniciales)

El repositorio está organizado en ramas semanales que reflejan la evolución continua del proyecto. Hasta el momento, las fases planificadas incluyen:

### ✅ Semana 1: Fundamentos de UI
- Construcción de layouts con Flexbox.
- Uso de Core Components (`View`, `Text`, `Image`).
- Renderizado de listas básicas (`ScrollView`).
- Creación de componentes reutilizables (`ItemCard`).

### 🚧 Semana 2: Rendimiento y Theming (En progreso)
- Refactorización a listas optimizadas (`FlatList`).
- Captura de datos con `TextInput` (Buscador de obras).
- Manejo del teclado virtual (`KeyboardAvoidingView`).
- Implementación de un sistema de Theming (constantes de colores y tipografía).

### 📅 Semana 3: Navegación Nativa
- Integración de React Navigation 7.
- Implementación de `BottomTabNavigator` (Inicio, Favoritos, Perfil).
- Configuración de `StackNavigator` para el flujo "Lista ➡️ Detalle de la obra".
- Paso de parámetros entre pantallas de forma tipada con TypeScript.

### 📅 Semana 4: Estado Global
- Integración de Zustand para manejar datos compartidos.
- Creación de *slices* y selectores para evitar re-renders innecesarios.
- Persistencia del estado usando el middleware `persist` y `AsyncStorage`.

### 🚀 Semanas 5 a 18: Arquitectura y Escalabilidad
*(Los temas específicos se documentarán a medida que el bootcamp avance y logremos abarcar nuevos módulos).*

## 🚀 Cómo ejecutar el proyecto localmente

1. Clona el repositorio:
   ```bash
   git clone <URL-DE-TU-REPO>
