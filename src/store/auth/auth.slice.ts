import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth.types';
import { API_CONFIG } from '@/constants/config';

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  loginWithPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Zustand store for authentication state.
 * Uses the persist middleware to sync state with localStorage.
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,

      setAuth: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          isAdmin: user.role === 'admin',
        }),

      loginWithPin: async (pin: string) => {
        set({ isLoading: true });
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        if (pin === '1234') { // Default admin PIN
          const adminUser: User = {
            id: 'admin-1',
            name: 'Administrador',
            email: 'admin@menudriver.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          set({
            user: adminUser,
            token: 'admin-mock-token',
            isAuthenticated: true,
            isAdmin: true,
            isLoading: false,
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: API_CONFIG.USER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist user and token, not loading states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
