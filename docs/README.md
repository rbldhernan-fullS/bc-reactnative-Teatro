# Capturas — Proyecto Teatro

Esta carpeta centraliza las capturas de pantalla de las 12 semanas del proyecto **Teatro Colón** (`bc-reactnative-Teatro`).

> **Estado:** carpeta preparada. Las imágenes las agrega el autor del proyecto. Este `README.md` existe para que la carpeta tenga contenido y para dejar documentada la convención de nombres y de URLs.

---

## 1. Estrategia: una sola carpeta y URLs absolutas

Las ramas `Week-01` … `Week-12` son **fotos independientes** del proyecto, no una cadena lineal. Para no duplicar las mismas imágenes en 12 ramas, **todas las capturas viven aquí, en la rama `main`**, y cada README las muestra con una **URL absoluta**:

```text
https://raw.githubusercontent.com/rbldhernan-fullS/bc-reactnative-Teatro/main/docs/<archivo>
```

Ejemplo de uso dentro de cualquier README:

```md
![Semana 03 — Cartelera](https://raw.githubusercontent.com/rbldhernan-fullS/bc-reactnative-Teatro/main/docs/semana-03-home.png)
```

Esto funciona desde cualquier rama porque la URL no es relativa al README, sino al repositorio. La imagen se sube **una sola vez** a `main` y las 12 ramas la pueden mostrar.

> **Requisito:** para que la URL responda, las imágenes deben estar commiteadas y pusheadas en la rama `main`, dentro de esta carpeta `docs/`.

---

## 2. Convención de nombres

```text
semana-NN[-descripcion].ext
```

| Parte | Regla | Ejemplos |
|---|---|---|
| `semana-NN` | Semana con dos dígitos | `semana-01`, `semana-12` |
| `-descripcion` | Opcional, en minúsculas y con guiones | `-home`, `-detalle`, `-favoritos` |
| `.ext` | `png` para capturas, `gif` o `mp4` para movimiento | `.png`, `.gif`, `.mp4` |

Si una semana tiene una sola captura, se usa el nombre corto: `semana-01.png`. Si tiene varias, se agrega el sufijo descriptivo.

---

## 3. Archivos esperados

| Semana | Archivos |
|:-:|---|
| 01 | `semana-01.png` |
| 02 | `semana-02-busqueda.png`, `semana-02-vacio.png` |
| 03 | `semana-03-home.png`, `semana-03-detalle.png`, `semana-03-favoritos.png` |
| 04 | `semana-04-home-badge.png`, `semana-04-detalle-guardar.png`, `semana-04-guardados.png` |
| 05 | `semana-05-lista.png`, `semana-05-loading.png`, `semana-05-error.png`, `semana-05-crear.png` |
| 06 | `semana-06-validacion.png`, `semana-06-formulario.png`, `semana-06-edicion.png` |
| 07 | `semana-07-ajustes.png`, `semana-07-offline.png`, `semana-07-securestore.png`, `semana-07-persistencia.gif` |
| 08 | `semana-08-login.png`, `semana-08-login-error.png`, `semana-08-registro.png`, `semana-08-perfil.png` |
| 09 | `semana-09-detalle.png`, `semana-09-tarjeta.png`, `semana-09-animaciones.gif` |
| 10 | `semana-10-swipe.png`, `semana-10-butacas.png`, `semana-10-swipe.gif` |
| 11 | `semana-11-permiso-camara.png`, `semana-11-camara.png`, `semana-11-afiche.png`, `semana-11-sede.png` |
| 12 | `semana-12-ajustes.png`, `semana-12-token.png`, `semana-12-banner.png`, `semana-12-recordatorio.png`, `semana-12-push.png`, `semana-12-cold-start.mp4` |

El detalle de **qué debe mostrar cada captura** y la URL exacta para pegar en cada README está en:

```text
C:\Users\sena\Downloads\CATALOGO-CAPTURAS-TEATRO.md
```

---

## 4. Cómo agregar las imágenes

1. Colócate en la rama `main`:

   ```bash
   git switch main
   ```

2. Copia los archivos a esta carpeta (`docs/`).
3. Verifica que los nombres coincidan con la tabla anterior.
4. Commit y push:

   ```bash
   git add docs
   git commit -m "docs: agregar capturas de las semanas 01 a 12"
   git push origin main
   ```

5. Comprueba una URL en el navegador:

   ```text
   https://raw.githubusercontent.com/rbldhernan-fullS/bc-reactnative-Teatro/main/docs/semana-01.png
   ```

> Si trabajas desde otra rama, recuerda que las imágenes **no** se suben a esa rama: se suben a `main`. Los README de cada rama solo contienen el enlace absoluto.

---

## 5. Buenas prácticas

- **Formato:** PNG para capturas; GIF o MP4 corto para animaciones, gestos y notificaciones.
- **Tamaño:** 1080×2400 (Pixel) o 1170×2532 (iPhone), con la app completa y la barra de estado visible.
- **Peso:** idealmente menos de 1 MB por PNG y menos de 5 MB por GIF/MP4.
- **Consistencia:** mismo emulador, tema oscuro y escala en todas las semanas.
- **Privacidad:** en la Semana 12, **enmascara el Expo Push Token** antes de publicar la captura. Con ese token se pueden enviar notificaciones a tu dispositivo.
- **No** subas `node_modules`, `android/` ni `ios/`; ya están en `.gitignore`.

---

## 6. Alternativa: capturas por rama

Si en algún momento prefieres que cada rama sea autocontenida, sube la imagen a `docs/` de esa rama y cambia `main` por `Week-NN` en la URL:

```text
https://raw.githubusercontent.com/rbldhernan-fullS/bc-reactnative-Teatro/Week-03/docs/semana-03-home.png
```

La convención de nombres no cambia. La opción recomendada sigue siendo `main`, porque evita duplicar archivos y mantiene un único lugar de verdad.
