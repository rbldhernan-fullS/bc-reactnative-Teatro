// ===== SEMANA 11 · INICIO =====
const MAX_POSTER_BYTES = 5 * 1024 * 1024;
const POSTER_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function pickPosterFile(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = [...POSTER_MIME_TYPES].join(',');
    input.hidden = true;
    input.addEventListener(
      'cancel',
      () => {
        input.remove();
        resolve(null);
      },
      { once: true },
    );
    input.addEventListener(
      'change',
      () => {
        const file = input.files?.[0];
        input.remove();
        if (!file) {
          resolve(null);
          return;
        }
        if (!POSTER_MIME_TYPES.has(file.type) || file.size === 0 || file.size > MAX_POSTER_BYTES) {
          reject(new Error('Elige una imagen JPG, PNG o WebP de hasta 5 MB.'));
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('No se pudo leer el afiche.'));
        reader.onload = async () => {
          try {
            if (typeof reader.result !== 'string') throw new Error();
            const image = new globalThis.Image();
            image.src = reader.result;
            await image.decode();
            resolve(reader.result);
          } catch {
            reject(new Error('No se pudo abrir la imagen seleccionada.'));
          }
        };
        reader.readAsDataURL(file);
      },
      { once: true },
    );
    document.body.appendChild(input);
    input.click();
  });
}
// ===== SEMANA 11 · FIN =====
