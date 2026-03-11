import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    socket = io(backendUrl, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(userId: string) {
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
