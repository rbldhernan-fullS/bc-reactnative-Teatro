// ============================================
// STORE: authStore — Semana 08
// Estado de sesión con Zustand + persist (solo user/isAuthenticated).
// Los tokens viven en SecureStore y el access token se refleja en memoria.
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  extractAuthUser,
  getAuthErrorMessage,
  getProfile,
  login as loginRequest,
  register as registerRequest,
} from '../services/authService';
import {
  refreshAuthTokens,
  setAuthFailureListener,
  setTokenRefreshListener,
} from '../services/authClient';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '../services/tokenService';
import type { AuthUser, LoginCredentials, RegisterData } from '../types';

export interface AuthState {
  /** Perfil del miembro autenticado */
  user: AuthUser | null;

  /**
   * Copia en memoria del access token. NO se persiste con Zustand:
   * la fuente de verdad es SecureStore.
   */
  accessToken: string | null;

  /** Bandera que decide entre AuthNavigator y AppNavigator */
  isAuthenticated: boolean;

  /** Operación de login/registro/logout en curso */
  isLoading: boolean;

  /** Restauración de la sesión al abrir la app */
  isBootstrapping: boolean;

  /** Último error legible para mostrar en Login/Registro */
  error: string | null;

  /** Autentica y guarda los tokens en SecureStore */
  login: (credentials: LoginCredentials) => Promise<void>;

  /** Registro simulado: no autentica, la pantalla redirige al Login */
  register: (data: RegisterData) => Promise<void>;

  /** Cierra sesión y elimina los tokens cifrados */
  logout: () => Promise<void>;

  /** Renueva el access token usando el refresh token guardado */
  refreshTokens: () => Promise<void>;

  /** Restaura la sesión persistida al iniciar la app */
  bootstrap: () => Promise<void>;

  /** Limpia el error de la pantalla actual */
  clearError: () => void;
}

/** Solo estos campos sobreviven al cierre de la app (nunca los tokens). */
type PersistedAuthState = Pick<AuthState, 'user' | 'isAuthenticated'>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ─── Estado inicial ────────────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isBootstrapping: true,
      error: null,

      // ─── login ─────────────────────────────────────────
      login: async (credentials: LoginCredentials): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          const session = await loginRequest(credentials);

          await saveTokens({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
          });

          set({
            user: extractAuthUser(session),
            accessToken: session.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: getAuthErrorMessage(error),
            isLoading: false,
          });

          throw error;
        }
      },

      // ─── register (simulado) ───────────────────────────
      register: async (data: RegisterData): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          await registerRequest(data);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: getAuthErrorMessage(error),
            isLoading: false,
          });

          throw error;
        }
      },

      // ─── logout ────────────────────────────────────────
      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          await clearTokens();
        } catch {
          // Aunque SecureStore falle, la sesión en memoria debe cerrarse.
        }

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // ─── refreshTokens ─────────────────────────────────
      refreshTokens: async (): Promise<void> => {
        set({ error: null });

        try {
          const tokens = await refreshAuthTokens();
          set({ accessToken: tokens.accessToken });
        } catch (error) {
          await get().logout();
          set({ error: getAuthErrorMessage(error) });
          throw error;
        }
      },

      // ─── bootstrap ─────────────────────────────────────
      bootstrap: async (): Promise<void> => {
        set({ isBootstrapping: true });

        try {
          const accessToken = await getAccessToken();

          if (!accessToken) {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isBootstrapping: false,
            });
            return;
          }

          set({ accessToken });

          try {
            const user = await getProfile();

            set({
              user,
              isAuthenticated: true,
              isBootstrapping: false,
              error: null,
            });
          } catch {
            /*
             * Si el refresh falló, el interceptor ya borró los tokens.
             * Si la red está caída, el refresh token sigue existiendo y
             * conservamos el perfil persistido para no pedir re-login.
             */
            const refreshToken = await getRefreshToken();

            if (!refreshToken) {
              set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isBootstrapping: false,
                error: 'Tu sesión expiró. Inicia sesión de nuevo.',
              });
              return;
            }

            set({ isBootstrapping: false });
          }
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isBootstrapping: false,
          });
        }
      },

      // ─── clearError ────────────────────────────────────
      clearError: (): void => {
        set({ error: null });
      },
    }),
    {
      name: 'teatro-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Los tokens NO se persisten aquí: viven en SecureStore.
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================================
// SINCRONIZACIÓN CON EL CLIENTE HTTP
// Sin importar el store desde authClient evitamos ciclos de módulos.
// ============================================================

setTokenRefreshListener((tokens) => {
  useAuthStore.setState({ accessToken: tokens.accessToken });
});

setAuthFailureListener(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: 'Tu sesión expiró. Inicia sesión de nuevo.',
  });
});
