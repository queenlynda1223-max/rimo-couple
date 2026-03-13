import { create } from 'zustand';
import { authApi } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rimo_token') || sessionStorage.getItem('rimo_token');
}

function setToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem('rimo_token', token);
    localStorage.setItem('rimo_remember', 'true');
    sessionStorage.removeItem('rimo_token');
  } else {
    sessionStorage.setItem('rimo_token', token);
    localStorage.removeItem('rimo_token');
    localStorage.removeItem('rimo_remember');
  }
}

function clearToken() {
  localStorage.removeItem('rimo_token');
  localStorage.removeItem('rimo_remember');
  sessionStorage.removeItem('rimo_token');
}

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
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (email: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password, remember = false) => {
    const { data } = await authApi.login({ email, password });
    setToken(data.token, remember);
    set({ user: data.user, isAuthenticated: true });
    connectSocket(data.user.id);
  },

  signup: async (email, password, nickname) => {
    const { data } = await authApi.signup({ email, password, nickname });
    setToken(data.token, true);
    set({ user: data.user, isAuthenticated: true });
    connectSocket(data.user.id);
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    clearToken();
    disconnectSocket();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      connectSocket(data.user.id);
    } catch (err: any) {
      if (err.status === 401) {
        clearToken();
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
