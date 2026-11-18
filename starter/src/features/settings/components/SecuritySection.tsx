// ===== SEMANA 07 · INICIO =====
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES } from '../../../theme';
import { notify } from '../../../platform/notify';
import * as SecureStore from '../../../services/secureStore';
import { SecureAction } from './SecureAction';
import { styles } from '../styles';

const SENSITIVE_KEY = 'teatro_taquilla_access_code';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateAccessCode(): string {
  let code = 'TC';

  for (let index = 0; index < 8; index += 1) {
    if (index === 4) {
      code += '-';
    }

    const randomIndex = Math.floor(Math.random() * CODE_ALPHABET.length);
    code += CODE_ALPHABET[randomIndex];
  }

  return code;
}

function maskSecret(value: string): string {
  if (value.length <= 6) {
    return '••••••';
  }

  return `${value.slice(0, 3)}•••${value.slice(-3)}`;
}

/**
 * Sección de seguridad: genera, lee y borra un código de taquilla cifrado con
 * SecureStore. El valor completo nunca llega a la interfaz, solo la versión
 * enmascarada.
 */
export function SecuritySection(): React.JSX.Element {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [maskedValue, setMaskedValue] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    void SecureStore.getItemAsync(SENSITIVE_KEY)
      .then((value) => {
        if (isMounted) {
          setIsSaved(value !== null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsSaved(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      const accessCode = generateAccessCode();
      await SecureStore.setItemAsync(SENSITIVE_KEY, accessCode);

      const storedCode = await SecureStore.getItemAsync(SENSITIVE_KEY);
      setIsSaved(storedCode !== null);
      setMaskedValue(storedCode ? maskSecret(storedCode) : null);

      notify('Código guardado', 'El código de taquilla quedó cifrado en SecureStore.');
    } catch {
      notify('No se pudo guardar', 'SecureStore no está disponible en este dispositivo.');
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleReadSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      const storedCode = await SecureStore.getItemAsync(SENSITIVE_KEY);

      if (storedCode) {
        setIsSaved(true);
        setMaskedValue(maskSecret(storedCode));
        return;
      }

      setIsSaved(false);
      setMaskedValue(null);
      notify(
        'Sin código guardado',
        'Genera y guarda un código de taquilla para verlo enmascarado.',
      );
    } catch {
      notify('No se pudo leer', 'SecureStore no está disponible en este dispositivo.');
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleDeleteSensitive = useCallback(async (): Promise<void> => {
    setIsBusy(true);

    try {
      await SecureStore.deleteItemAsync(SENSITIVE_KEY);
      setIsSaved(false);
      setMaskedValue(null);
      notify('Código eliminado', 'El código fue borrado de SecureStore.');
    } catch {
      notify('No se pudo eliminar', 'SecureStore no está disponible en este dispositivo.');
    } finally {
      setIsBusy(false);
    }
  }, []);

  return (
    <>
      <Text style={styles.sectionTitle}>Seguridad (SecureStore)</Text>
      <Text style={styles.sectionHint}>
        El código de acceso de taquilla se cifra en Keychain (iOS) o Keystore (Android). Nunca se
        guarda en MMKV ni en AsyncStorage.
      </Text>

      <View style={styles.secureCard}>
        <View style={styles.secureHeader}>
          <View style={styles.secureIcon}>
            <Ionicons name="lock-closed" size={SIZES.iconMd} color={COLORS.accent} />
          </View>

          <View style={styles.secureHeaderText}>
            <Text style={styles.rowLabel}>Código de acceso de taquilla</Text>
            <Text style={styles.rowDesc}>Se genera un código nuevo cada vez que guardas.</Text>
          </View>

          <Text style={[styles.statusBadge, isSaved ? styles.statusSaved : styles.statusEmpty]}>
            {isSaved ? 'Guardado' : 'Sin guardar'}
          </Text>
        </View>

        {maskedValue && (
          <View style={styles.maskedBox}>
            <Text style={styles.maskedLabel}>Valor leído (enmascarado)</Text>
            <Text style={styles.maskedValue}>{maskedValue}</Text>
          </View>
        )}

        <View style={styles.secureActions}>
          <SecureAction
            label="Generar y guardar"
            icon="save-outline"
            onPress={() => {
              void handleSaveSensitive();
            }}
            variant="primary"
            disabled={isBusy}
          />
          <SecureAction
            label="Leer"
            icon="eye-outline"
            onPress={() => {
              void handleReadSensitive();
            }}
            disabled={isBusy}
          />
          <SecureAction
            label="Eliminar"
            icon="trash-outline"
            onPress={() => {
              void handleDeleteSensitive();
            }}
            variant="danger"
            disabled={isBusy}
          />
        </View>

        <Text style={styles.secureNote}>
          El código completo nunca se muestra en pantalla: solo una versión enmascarada.
        </Text>
      </View>
    </>
  );
}
// ===== SEMANA 07 · FIN =====
