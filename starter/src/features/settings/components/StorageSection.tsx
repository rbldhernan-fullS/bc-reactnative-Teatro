// ===== SEMANA 07 · INICIO =====
import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { styles } from '../styles';

/**
 * Sección informativa: dónde guarda la app cada dato y qué requiere un build
 * nativo. No tiene interacción.
 */
export function StorageSection(): React.JSX.Element {
  return (
    <>
      <Text style={styles.sectionTitle}>Almacenamiento de la app</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLine}>
          <Text style={styles.infoStrong}>MMKV</Text> · preferencias sincrónicas de la cartelera.
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoStrong}>AsyncStorage</Text> · copia de la cartelera para mostrarla
          sin red.
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.infoStrong}>SecureStore</Text> · código sensible de taquilla cifrado
          por el sistema.
        </Text>
      </View>

      <View style={styles.nativeNotice}>
        <Ionicons name="phone-portrait-outline" size={SIZES.iconSm} color={COLORS.textMuted} />
        <Text style={styles.nativeNoticeText}>
          MMKV requiere un build nativo: ejecuta `pnpm prebuild` y luego `pnpm android` o `pnpm
          ios`.
        </Text>
      </View>
    </>
  );
}
// ===== SEMANA 07 · FIN =====
