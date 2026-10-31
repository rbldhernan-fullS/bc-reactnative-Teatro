// ============================================
// STORAGE: MMKV — Semana 07: Persistencia local
// Instancia sincrónica para preferencias del usuario.
// ⚠️ Requiere un build nativo (expo run:android / expo run:ios):
// react-native-mmkv usa Nitro Modules (JSI) y no funciona en Expo Go.
// ============================================

import { createMMKV } from 'react-native-mmkv';

/**
 * Instancia única compartida por toda la app. Importar `storage` desde aquí
 * evita crear múltiples archivos MMKV con el mismo id.
 */
export const storage = createMMKV({ id: 'teatro-preferences' });
