import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');
  private userSocketMap = new Map<string, string>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.server.emit('partner:offline', userId);
        break;
      }
    }
  }

  @SubscribeMessage('user:register')
  handleUserRegister(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    this.userSocketMap.set(userId, client.id);
    this.server.emit('partner:online', userId);
  }

  @SubscribeMessage('room:join')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('room:leave')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.leave(roomId);
  }

  @SubscribeMessage('room:update')
  handleRoomUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; type: string; data: any; updatedBy: string },
  ) {
    client.to(data.roomId).emit('room:updated', {
      roomId: data.roomId,
      type: data.type,
      data: data.data,
      updatedBy: data.updatedBy,
      timestamp: Date.now(),
    });
  }

  @SubscribeMessage('status:update')
  handleStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; status: string },
  ) {
    this.server.emit('partner:status', { userId: data.userId, status: data.status });
  }

  sendNotification(userId: string, notification: { type: string; message: string }) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', {
        ...notification,
        timestamp: Date.now(),
      });
    }
  }
}
