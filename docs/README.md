# Evidencias del proyecto Teatro Colón

Esta carpeta contiene la captura de la primera semana y los videos de las semanas 02 a 12. Cada README semanal enlaza a la evidencia publicada en `main`.

| Semana | Archivo |
| --- | --- |
| 01 | [Captura_Week_01.png](Week-01/Captura_Week_01.png) |
| 02 | [video_week_02.mp4](Week-02/video_week_02.mp4) |
| 03 | [video_week_03.mp4](Week-03/video_week_03.mp4) |
| 04 | [video_week_04.mp4](Week-04/video_week_04.mp4) |
| 05 | [video_week_05.mp4](Week-05/video_week_05.mp4) |
| 06 | [video_week_06.mp4](Week-06/video_week_06.mp4) |
| 07 | [video_week_07.mp4](Week-07/video_week_07.mp4) |
| 08 | [video_week_08.mp4](Week-08/video_week_08.mp4) |
| 09 | [video_week_09.mp4](Week-09/video_week_09.mp4) |
| 10 | [video_week_10.mp4](Week-10/video_week_10.mp4) |
| 11 | [video_week_11.mp4](Week-11/video_week_11.mp4) |
| 12 | [video_week_12.mp4](Week-12/video_week_12.mp4) |

## Convención

Cada archivo vive en `docs/Week-NN/`. La captura inicial se llama `Captura_Week_01.png`. Los videos se llaman `video_week_NN.mp4`, con dos dígitos para la semana.

## Descargar y verificar

En una copia local de `main`, con Git LFS instalado:

```bash
git lfs install
git lfs pull origin
git lfs ls-files
git lfs fsck
```

En el listado de `git lfs ls-files`, `*` indica que está disponible el archivo completo en el árbol de trabajo. La regla `*.mp4` de `.gitattributes` aplica Git LFS a todos los videos. Los enlaces de la tabla abren la vista del archivo en GitHub.
