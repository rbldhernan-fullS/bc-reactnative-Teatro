import { Alert } from 'react-native';

/**
 * Diálogos multiplataforma.
 *
 * `Alert.alert` **no está implementado en React Native Web** (es una función
 * vacía en `react-native-web`), por lo que los `onPress` de sus botones nunca
 * se ejecutan. Este módulo expone una API mínima que Metro resuelve a la
 * variante nativa (`notify.ts`) o a la web (`notify.web.ts`).
 *
 * Regla: nunca llames a `Alert.alert` directamente desde pantallas o
 * componentes; usa `notify`, `notifyError` o `confirm`.
 */
export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function notify(title: string, message?: string): void {
  Alert.alert(title, message);
}

export function notifyError(title: string, message?: string): void {
  Alert.alert(title, message ?? 'Inténtalo de nuevo.');
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  const {
    title,
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    destructive = false,
  } = options;

  return new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
        {
          text: confirmText,
          style: destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
