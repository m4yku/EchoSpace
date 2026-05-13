// src/store/authStore.ts
import { create } from 'zustand';

// To-Do: I-link ito sa src/types/user.ts mamaya
interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, username: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  
  signIn: async (email, password) => {
    // Supabase logic mapupunta rito sa Batch 2
    console.log(`Simulating login for ${email}`);
    // Mock user para lang makapasa sa Home screen ngayon
    set({ user: { id: '123', email } }); 
  },

  signUp: async (email, password, username) => {
    console.log(`Simulating signup for ${username}`);
    set({ user: { id: '123', email, username } });
  },

  signOut: () => {
    set({ user: null });
  },
}));