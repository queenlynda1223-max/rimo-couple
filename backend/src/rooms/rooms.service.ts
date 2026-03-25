import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiniRoom } from '../entities/mini-room.entity';
import { CoupleRoom } from '../entities/couple-room.entity';
import { v4 as uuidv4 } from 'uuid';

function generateInvitationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(MiniRoom)
    private miniRoomRepository: Repository<MiniRoom>,
    @InjectRepository(CoupleRoom)
    private coupleRoomRepository: Repository<CoupleRoom>,
  ) {}

  async getMiniRoom(userId: string) {
    const room = await this.miniRoomRepository.findOne({ where: { userId } });
    if (!room) throw new NotFoundException('미니룸을 찾을 수 없습니다');
    return room;
  }

  async updateMiniRoom(userId: string, data: Partial<MiniRoom>) {
    const room = await this.miniRoomRepository.findOne({ where: { userId } });
    if (!room) throw new NotFoundException('미니룸을 찾을 수 없습니다');
    Object.assign(room, data);
    return this.miniRoomRepository.save(room);
  }

  async updateStatusMessage(userId: string, statusMessage: string) {
    if (statusMessage.length > 100) {
      throw new ConflictException('상태 메시지는 100자 이하여야 합니다');
    }
    return this.updateMiniRoom(userId, { statusMessage });
  }

  async createCoupleRoom(userId: string) {
    const existing = await this.coupleRoomRepository.findOne({
      where: [
        { user1Id: userId, isConnected: true },
        { user2Id: userId, isConnected: true },
      ],
    });
    if (existing) throw new ConflictException('이미 연결된 커플룸이 있습니다');

    const invitationCode = generateInvitationCode();
    const invitationLink = `/invite/${invitationCode}`;

    const room = this.coupleRoomRepository.create({
      user1Id: userId,
      invitationCode,
      invitationLink,
    });
    return this.coupleRoomRepository.save(room);
  }

  async getCoupleRoom(roomId: string, userId: string) {
    const room = await this.coupleRoomRepository.findOne({
      where: { id: roomId },
      relations: ['user1', 'user2'],
    });
    if (!room) throw new NotFoundException('커플룸을 찾을 수 없습니다');
    if (room.user1Id !== userId && room.user2Id !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }
    return room;
  }

  async getCoupleRoomByUser(userId: string) {
    const room = await this.coupleRoomRepository.findOne({
      where: [
        { user1Id: userId },
        { user2Id: userId },
      ],
      relations: ['user1', 'user2'],
    });
    return room;
  }

  async updateCoupleRoom(roomId: string, userId: string, data: Partial<CoupleRoom>) {
    const room = await this.getCoupleRoom(roomId, userId);
    Object.assign(room, data);
    return this.coupleRoomRepository.save(room);
  }

  async joinCoupleRoom(invitationCode: string, userId: string) {
    const room = await this.coupleRoomRepository.findOne({ where: { invitationCode } });
    if (!room) throw new NotFoundException('유효하지 않은 초대 코드입니다');
    if (room.isConnected) throw new ConflictException('이미 연결된 커플룸입니다');
    if (room.user1Id === userId) throw new ConflictException('자기 자신을 초대할 수 없습니다');

    const existingConnection = await this.coupleRoomRepository.findOne({
      where: [
        { user1Id: userId, isConnected: true },
        { user2Id: userId, isConnected: true },
      ],
    });
    if (existingConnection) throw new ConflictException('이미 다른 커플룸에 연결되어 있습니다');

    room.user2Id = userId;
    room.isConnected = true;
    room.connectedAt = new Date();
    return this.coupleRoomRepository.save(room);
  }

  async getInvitation(roomId: string, userId: string) {
    const room = await this.getCoupleRoom(roomId, userId);
    return {
      invitationCode: room.invitationCode,
      invitationLink: room.invitationLink,
    };
  }
}
