// /store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const userEmptyState = {
  name: '',
  email: '',
  // otros campos necesarios para el estado vacío de `user`
};

const useUserStore = create(
  persist(
    (set, get) => ({
      user: userEmptyState,
      token: null,
      isAuthenticated: false,
      
      login: (newUser, token) => {
        set({ user: newUser, token, isAuthenticated: true });
      },
      
      createUser: (newUser) => set({ user: newUser }), 
      
      modifyUser: (partialUser) =>
        set((state) => ({ user: { ...state.user, ...partialUser } })),
      
      resetUser: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),
      
      logout: () => set({ user: userEmptyState, token: null, isAuthenticated: false }),
      
      verifyToken: () => {
        const { token, logout } = get();
        if (token) {
          set({ isAuthenticated: true });
          return true;
        } else { 
          logout();
          return false;
        }
      },
    }),
    {
      name: 'user-storage', // Nombre del almacenamiento en localStorage
      getStorage: () => localStorage, // Usa localStorage
    }
  )
);

export default useUserStore;
