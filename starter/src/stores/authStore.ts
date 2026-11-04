// ===== SEMANA 07 · INICIO =====
import AsyncStorage from '@react-native-async-storage/async-storage';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 08 · INICIO =====
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
  user: AuthUser | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  isBootstrapping: boolean;

  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  logout: () => Promise<void>;

  refreshTokens: () => Promise<void>;

  bootstrap: () => Promise<void>;

  clearError: () => void;
}

type PersistedAuthState = Pick<AuthState, 'user' | 'isAuthenticated'>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isBootstrapping: true,
      error: null,

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

      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          await clearTokens();
        } catch {}

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

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

      clearError: (): void => {
        set({ error: null });
      },
    }),
    {
      name: 'teatro-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

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
// ===== SEMANA 08 · FIN =====
