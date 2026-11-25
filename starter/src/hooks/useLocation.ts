// ===== SEMANA 01 · INICIO =====
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
// ===== SEMANA 01 · FIN =====
// ===== SEMANA 11 · INICIO =====
import * as Location from 'expo-location';

export interface UseLocationResult {
  permission: Location.LocationPermissionResponse | null;
  coords: Location.LocationObjectCoords | null;
  address: string | null;
  error: string | null;
  requesting: boolean;
  loading: boolean;
  watching: boolean;
  requestAccess: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleWatching: () => void;
  setAddress: (address: string | null) => void;
}

export function useLocation(): UseLocationResult {
  const [permission, setPermission] = useState<Location.LocationPermissionResponse | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState(false);
  const permissionRef = useRef<Location.LocationPermissionResponse | null>(null);

  useEffect(() => {
    permissionRef.current = permission;
  }, [permission]);

  const loadPosition = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // `reverseGeocodeAsync` fue eliminado del SDK 49 (E‑05): la dirección se
      // escribe a mano en la tarjeta de sede y solo se guardan las coordenadas.
      setCoords(position.coords);
    } catch {
      setError(
        'No pudimos obtener tu ubicación. Revisa que el GPS esté activo e inténtalo de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const requestAccess = useCallback(async (): Promise<void> => {
    setRequesting(true);
    setError(null);

    try {
      const response = await Location.requestForegroundPermissionsAsync();
      setPermission(response);

      if (response.granted) {
        await loadPosition();
      } else {
        setError('Sin permiso de ubicación no podemos calcular la distancia.');
      }
    } catch {
      setError('No se pudo solicitar el permiso de ubicación.');
    } finally {
      setRequesting(false);
    }
  }, [loadPosition]);

  const refresh = useCallback(async (): Promise<void> => {
    if (permission?.granted) {
      await loadPosition();
      return;
    }

    await requestAccess();
  }, [loadPosition, permission?.granted, requestAccess]);

  const toggleWatching = useCallback((): void => {
    setWatching((current) => !current);
  }, []);

  useEffect(() => {
    let active = true;

    void Location.getForegroundPermissionsAsync()
      .then((response) => {
        if (!active) {
          return;
        }

        setPermission(response);

        if (response.granted) {
          void loadPosition();
        }
      })
      .catch(() => {
        if (active) {
          setError('No se pudo consultar el permiso de ubicación.');
        }
      });

    return () => {
      active = false;
    };
  }, [loadPosition]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      void Location.getForegroundPermissionsAsync()
        .then((response) => {
          const wasGranted = permissionRef.current?.granted ?? false;
          permissionRef.current = response;
          setPermission(response);

          if (response.granted && !wasGranted) {
            void loadPosition();
          }
        })
        .catch(() => {
          setError('No se pudo consultar de nuevo el permiso de ubicación.');
        });
    });

    return () => subscription.remove();
  }, [loadPosition]);

  useEffect(() => {
    if (!watching || !permission?.granted) {
      return undefined;
    }

    let active = true;
    let subscription: Location.LocationSubscription | null = null;

    void Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (position) => {
        if (active) {
          setCoords(position.coords);
        }
      },
    )
      .then((created) => {
        if (active) {
          subscription = created;
        } else {
          created.remove();
        }
      })
      .catch(() => {
        if (active) {
          setWatching(false);
          setError('No se pudo iniciar el seguimiento de tu ubicación.');
        }
      });

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [permission?.granted, watching]);

  return {
    permission,
    coords,
    address,
    error,
    requesting,
    loading,
    watching,
    requestAccess,
    refresh,
    toggleWatching,
    setAddress,
  };
}
// ===== SEMANA 11 · FIN =====
