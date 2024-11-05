import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      userId: null,
      token: null,
      isAuthenticated: false,
      
      login: (userId, token) => {
        set({ userId, token, isAuthenticated: true });
      },
      
      logout: () => set({ userId: null, token: null, isAuthenticated: false }),
      
      verifyToken: () => {
        const { token } = get();
        if (token) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
