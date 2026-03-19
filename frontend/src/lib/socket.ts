import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function useRealSocket(): boolean {
  if (typeof window === 'undefined') return true;
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
  if (!url && window.location.hostname !== 'localhost') return false;
  if (url.startsWith('http://localhost') && window.location.hostname !== 'localhost') return false;
  return true;
}

const noopSocket = {
  connected: false,
  connect: () => {},
  disconnect: () => {},
  emit: () => noopSocket,
  on: () => noopSocket,
  off: () => noopSocket,
} as unknown as Socket;

export function getSocket(): Socket {
  if (!useRealSocket()) return noopSocket;
  if (!socket) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    if (typeof window !== 'undefined' && (backendUrl === 'http://localhost:4000' || backendUrl.startsWith('http://localhost'))) {
      return noopSocket;
    }
    socket = io(backendUrl, {
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 10000,
    });
  }
  return socket;
}

export function shouldConnect(): boolean {
  return useRealSocket();
}

export function connectSocket(userId: string) {
  if (!shouldConnect()) return;
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.emit('user:register', userId);
  }
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function joinRoom(roomId: string) {
  getSocket().emit('room:join', roomId);
}

export function leaveRoom(roomId: string) {
  getSocket().emit('room:leave', roomId);
}

export function emitRoomUpdate(roomId: string, type: string, data: any, updatedBy: string) {
  getSocket().emit('room:update', { roomId, type, data, updatedBy });
}

export function emitStatusUpdate(userId: string, status: string) {
  getSocket().emit('status:update', { userId, status });
}
