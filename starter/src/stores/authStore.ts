// ===== SEMANA 07 · INICIO =====
import AsyncStorage from '@react-native-async-storage/async-storage';
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 08 · INICIO =====
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';

import {
  beginSessionChange,
  extractAuthUser,
  getAuthErrorMessage,
  getProfile,
  getSessionVersion,
  isUnauthorizedError,
  login as loginRequest,
  refreshAuthTokens,
  register as registerRequest,
  setTokenRefreshListener,
} from '../services/authApi';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../services/tokenService';
import { logger } from '../utils/logger';
import type { AuthUser, LoginCredentials, RegisterData } from '../types';

export interface AuthState {
  user: AuthUser | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  isBootstrapping: boolean;

  restoreError: string | null;

  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  logout: (message?: string) => Promise<void>;

  refreshTokens: () => Promise<void>;

  bootstrap: () => Promise<void>;

  clearError: () => void;
}

type PersistedAuthState = Pick<AuthState, 'user' | 'isAuthenticated'>;

const cachedProfile = z.object({
  isAuthenticated: z.literal(true),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    image: z.string().optional(),
  }),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isBootstrapping: true,
      restoreError: null,
      error: null,

      login: async (credentials: LoginCredentials): Promise<void> => {
        const version = beginSessionChange();
        set({ isLoading: true, error: null });

        try {
          const session = await loginRequest(credentials);
          if (version !== getSessionVersion()) return;

          await saveTokens({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
          });

          if (version !== getSessionVersion()) return;
          set({
            user: extractAuthUser(session),
            accessToken: session.accessToken,
            isAuthenticated: true,
            restoreError: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          if (version !== getSessionVersion()) return;
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

      logout: async (message?: string): Promise<void> => {
        const version = beginSessionChange();
        set({ isLoading: true });

        try {
          await clearTokens();
        } catch (error) {
          // El cierre de sesión debe completarse aunque falle el almacenamiento.
          logger.debug('No se pudieron borrar los tokens al cerrar sesión', error);
        }

        if (version !== getSessionVersion()) return;
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          restoreError: null,
          isBootstrapping: false,
          isLoading: false,
          error: message ?? null,
        });
      },

      refreshTokens: async (): Promise<void> => {
        const version = getSessionVersion();
        set({ error: null });

        try {
          await refreshAuthTokens();
        } catch (error) {
          if (version !== getSessionVersion()) return;
          if (isUnauthorizedError(error)) {
            await get().logout('Tu sesión expiró. Inicia sesión de nuevo.');
          } else {
            set({ restoreError: getAuthErrorMessage(error) });
          }
          throw error;
        }
      },

      bootstrap: async (): Promise<void> => {
        const version = getSessionVersion();
        try {
          const accessToken = await getAccessToken();
          if (version !== getSessionVersion()) return;

          if (!accessToken && !(await getRefreshToken())) {
            if (version !== getSessionVersion()) return;
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isBootstrapping: false,
              restoreError: null,
            });
            return;
          }

          if (version !== getSessionVersion()) return;
          if (!accessToken) await refreshAuthTokens();
          else set({ accessToken });
          if (version !== getSessionVersion()) return;
          const user = await getProfile();
          if (version !== getSessionVersion()) return;
          set({
            user,
            isAuthenticated: true,
            isBootstrapping: false,
            restoreError: null,
            error: null,
          });
        } catch (error) {
          if (version !== getSessionVersion()) return;
          if (isUnauthorizedError(error)) {
            await get().logout('Tu sesión expiró. Inicia sesión de nuevo.');
          } else {
            set({ isBootstrapping: false, restoreError: getAuthErrorMessage(error) });
          }
        }
      },

      clearError: (): void => {
        set({ error: null });
      },
    }),
    {
      name: 'teatro-auth',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const profile = cachedProfile.safeParse(persisted);
        return profile.success ? { ...current, ...profile.data } : current;
      },
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

setTokenRefreshListener((tokens) => {
  useAuthStore.setState({ accessToken: tokens.accessToken });
});

// ===== SEMANA 08 · FIN =====
