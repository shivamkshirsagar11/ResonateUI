import { apiClient } from "@/lib/apiClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const TOKEN_KEY = "docmind_token";

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Login via REST API and persist token */
  login: (username: string, password: string) => Promise<void>;
  /** Signup then auto-login */
  signup: (username: string, email: string, password: string) => Promise<void>;
  /** Clear auth state */
  logout: () => void;
  /** Set token directly (used after external login flow) */
  setToken: (token: string, username: string) => void;
  /** Validate stored token on mount */
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: localStorage.getItem(TOKEN_KEY),
      username: null,
      isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const result = await apiClient.login({ username, password });
          const token = result.access_token;
          localStorage.setItem(TOKEN_KEY, token);
          set({ token, username, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      signup: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          await apiClient.signup({ username, email, password });
          const result = await apiClient.login({ username, password });
          const token = result.access_token;
          localStorage.setItem(TOKEN_KEY, token);
          set({ token, username, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ token: null, username: null, isAuthenticated: false });
      },

      setToken: (token: string, username: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ token, username, isAuthenticated: true });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
        set({ isLoading: true });
        try {
          const user = await apiClient.me(token);
          set({
            isAuthenticated: true,
            username: user.username,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          set({
            token: null,
            isAuthenticated: false,
            username: null,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "docmind-auth",
      partialize: (state) => ({ token: state.token, username: state.username }),
    },
  ),
);
