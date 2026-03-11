import { create } from 'zustand';
import { authApi } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface User {
  id: string;
  email: string;
  nickname: string;
  minime?: any;
  miniRoom?: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('rimo_token', data.token);
    set({ user: data.user, isAuthenticated: true });
    connectSocket(data.user.id);
  },

  signup: async (email, password, nickname) => {
    const { data } = await authApi.signup({ email, password, nickname });
    localStorage.setItem('rimo_token', data.token);
    set({ user: data.user, isAuthenticated: true });
    connectSocket(data.user.id);
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('rimo_token');
    disconnectSocket();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rimo_token') : null;
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      connectSocket(data.user.id);
    } catch {
      localStorage.removeItem('rimo_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
