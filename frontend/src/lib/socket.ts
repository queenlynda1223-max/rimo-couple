import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
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

function shouldConnect(): boolean {
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
  if (typeof window !== 'undefined' && !url && window.location.hostname !== 'localhost') {
    return false;
  }
  return true;
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
