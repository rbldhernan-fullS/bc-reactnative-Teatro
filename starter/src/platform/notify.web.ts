/**
 * Variante web de `platform/notify`.
 *
 * En React Native Web `Alert.alert` es una función vacía, así que aquí se usan
 * los diálogos nativos del navegador: `window.alert` y `window.confirm`.
 *
 * Metro resuelve este archivo automáticamente en la plataforma web; el resto
 * de plataformas usa `notify.ts`.
 */
export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

function formatMessage(title: string, message?: string): string {
  return message ? `${title}\n\n${message}` : title;
}

export function notify(title: string, message?: string): void {
  globalThis.alert(formatMessage(title, message));
}

export function notifyError(title: string, message?: string): void {
  globalThis.alert(formatMessage(title, message ?? 'Inténtalo de nuevo.'));
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  const accepted = globalThis.confirm(formatMessage(options.title, options.message));
  return Promise.resolve(accepted);
}
