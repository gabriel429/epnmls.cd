import { create } from 'zustand';
import type { Agent, User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  agent: Agent | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAgent: (agent: Agent | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  agent: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setAgent: (agent) => set({ agent }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, agent: null }),
}));
