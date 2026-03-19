import { create } from 'zustand';
import { authApi } from '@/lib/api';
import { disconnectSocket } from '@/lib/socket';
import { useRoomStore } from '@/store/room-store';

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

/** 브라우저에 저장된 RIMO 관련 키 전부 삭제 (localStorage + sessionStorage) */
export function clearAllRimoClientStorage() {
  if (typeof window === 'undefined') return;
  const strip = (storage: Storage) => {
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && k.startsWith('rimo_')) keys.push(k);
    }
    keys.forEach((k) => storage.removeItem(k));
  };
  strip(localStorage);
  strip(sessionStorage);
}

function clearToken() {
  clearAllRimoClientStorage();
  useRoomStore.getState().resetRooms();
}

interface User {
  id: string;
  email: string;
  nickname: string;
  oauthProvider?: string | null;
  minime?: any;
  miniRoom?: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginId: string, password: string, remember?: boolean) => Promise<void>;
  signup: (loginId: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (loginId, password, remember = false) => {
    const { data } = await authApi.login({ email: loginId, password });
    setToken(data.token, remember);
    set({ user: data.user, isAuthenticated: true });
  },

  signup: async (loginId, password, nickname) => {
    const { data } = await authApi.signup({ email: loginId, password, nickname });
    setToken(data.token, true);
    set({ user: data.user, isAuthenticated: true });
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
    } catch (err: any) {
      if (err.status === 401) {
        clearToken();
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

/** 로컬·메모리의 로그인·룸 상태를 모두 초기화 (서버 호출 없음) */
export function purgeAllLocalSession() {
  clearToken();
  disconnectSocket();
  useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
}
