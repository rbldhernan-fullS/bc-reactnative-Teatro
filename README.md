# Teatro Colón · Cartelera teatral

Proyecto de React Native organizado en doce ramas semanales. La app evoluciona desde una cartelera con datos locales hasta un club de socios con API, guardados, reserva de butacas, afiches y recordatorios.

La rama `main` reúne esta portada y el [índice de evidencias](docs/README.md). Cada rama `Week-NN` contiene su implementación, guía y criterios de esa entrega.

## Entregas por semana

| Rama | Qué se incorpora | Evidencia |
| --- | --- | --- |
| [Week-01](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-01) | Fundamentos de interfaz y cartelera | [Captura](docs/Week-01/Captura_Week_01.png) |
| [Week-02](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-02) | Búsqueda y listas optimizadas | [Video](docs/Week-02/video_week_02.mp4) |
| [Week-03](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-03) | Navegación y detalle tipado | [Video](docs/Week-03/video_week_03.mp4) |
| [Week-04](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-04) | Guardados con Zustand | [Video](docs/Week-04/video_week_04.mp4) |
| [Week-05](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-05) | API y estados de carga, error y vacío | [Video](docs/Week-05/video_week_05.mp4) |
| [Week-06](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-06) | Formularios y validación | [Video](docs/Week-06/video_week_06.mp4) |
| [Week-07](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-07) | Persistencia y funcionamiento sin conexión | [Video](docs/Week-07/video_week_07.mp4) |
| [Week-08](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-08) | Autenticación y sesión | [Video](docs/Week-08/video_week_08.mp4) |
| [Week-09](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-09) | Animaciones y transiciones | [Video](docs/Week-09/video_week_09.mp4) |
| [Week-10](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-10) | Gestos y mapa de butacas | [Video](docs/Week-10/video_week_10.mp4) |
| [Week-11](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-11) | Cámara, afiches y ubicación | [Video](docs/Week-11/video_week_11.mp4) |
| [Week-12](https://github.com/rbldhernan-fullS/bc-reactnative-Teatro/tree/Week-12) | Notificaciones y recordatorios | [Video](docs/Week-12/video_week_12.mp4) |

## Ejecutar en web

Usa Node 22 y pnpm 12.14.0. Clona la rama que quieras revisar. Por ejemplo, para la entrega más reciente:

```bash
git clone --branch Week-12 https://github.com/rbldhernan-fullS/bc-reactnative-Teatro.git
cd bc-reactnative-Teatro/starter
pnpm install --frozen-lockfile
pnpm verify
```

- **Semanas 01 a 04.** Ejecuta `pnpm web` y abre la URL que indica Expo. La cartelera usa datos locales.
- **Semanas 05 a 12.** Ejecuta `pnpm api` en una terminal y `pnpm web` en otra, ambas en `starter`. La API de demostración escucha en el puerto 3001.
- **Exportación.** Ejecuta `pnpm export:web`. Para servir `dist` de las semanas 05 a 12, configura `EXPO_PUBLIC_API_URL` con la URL HTTPS de tu API antes de exportar.

## Stack

Expo SDK 57, React Native 0.86, React Native Web y TypeScript. La navegación usa React Navigation. Las ramas posteriores incorporan Zustand, TanStack Query, Zod y Reanimated según el tema de cada semana.

## Evaluación

Abre el README de la rama de tu interés para consultar los criterios, archivos y recorridos de esa entrega. Para la revisión web, comprueba `pnpm verify`, `pnpm export:web` y el flujo manual indicado en la rama. Los recordatorios y el push de `Week-12` requieren un entorno nativo compatible.

## Evidencias locales

Los MP4 se almacenan con Git LFS. En una copia de `main`, ejecuta `git lfs pull origin` para descargar los videos. El índice de evidencias contiene los nombres exactos y los pasos de verificación.
