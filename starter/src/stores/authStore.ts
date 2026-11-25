// ===== SEMANA 07 · INICIO =====
// ===== SEMANA 07 · FIN =====
// ===== SEMANA 04 · INICIO =====
import { create } from 'zustand';
// ===== SEMANA 04 · FIN =====
// ===== SEMANA 08 · INICIO =====

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
import { clearTokens, getAccessToken, saveTokens } from '../services/tokenService';
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

let activeBootstrap: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
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
    } catch {
      // Se limpia el estado en memoria incluso si el dispositivo falla.
    }

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

  bootstrap: () => {
    if (activeBootstrap) return activeBootstrap;
    if (!get().isBootstrapping) return Promise.resolve();
    activeBootstrap = (async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        set({ accessToken });
        const user = await getProfile();
        set({ user, isAuthenticated: true, error: null });
      } catch {
        await get().logout();
        set({ error: 'No se pudo restaurar la sesión. Inicia sesión de nuevo.' });
      } finally {
        set({ isBootstrapping: false });
      }
    })().finally(() => {
      activeBootstrap = null;
    });
    return activeBootstrap;
  },
  clearError: (): void => {
    set({ error: null });
  },
}));

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
