import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get('mini/:userId')
  async getMiniRoom(@Param('userId') userId: string) {
    const room = await this.roomsService.getMiniRoom(userId);
    return { success: true, room };
  }

  @Patch('mini/:userId')
  async updateMiniRoom(
    @Param('userId') userId: string,
    @Body() data: any,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      return { success: false, message: '권한이 없습니다' };
    }
    const room = await this.roomsService.updateMiniRoom(userId, data);
    return { success: true, room };
  }

  @Patch('mini/:userId/status')
  async updateStatus(
    @Param('userId') userId: string,
    @Body('statusMessage') statusMessage: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      return { success: false, message: '권한이 없습니다' };
    }
    const room = await this.roomsService.updateStatusMessage(userId, statusMessage);
    return { success: true, room };
  }

  @Post('couple')
  async createCoupleRoom(@CurrentUser('id') userId: string) {
    const room = await this.roomsService.createCoupleRoom(userId);
    return { success: true, room };
  }

  @Get('couple/my')
  async getMyCoupleRoom(@CurrentUser('id') userId: string) {
    const room = await this.roomsService.getCoupleRoomByUser(userId);
    return { success: true, room };
  }

  @Get('couple/:roomId')
  async getCoupleRoom(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
  ) {
    const room = await this.roomsService.getCoupleRoom(roomId, userId);
    return { success: true, room };
  }

  @Patch('couple/:roomId')
  async updateCoupleRoom(
    @Param('roomId') roomId: string,
    @Body() data: any,
    @CurrentUser('id') userId: string,
  ) {
    const room = await this.roomsService.updateCoupleRoom(roomId, userId, data);
    return { success: true, room };
  }

  @Post('couple/:roomId/invite')
  async getInvitation(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
  ) {
    const invitation = await this.roomsService.getInvitation(roomId, userId);
    return { success: true, ...invitation };
  }

  @Post('couple/join')
  async joinCoupleRoom(
    @Body('invitationCode') invitationCode: string,
    @CurrentUser('id') userId: string,
  ) {
    const room = await this.roomsService.joinCoupleRoom(invitationCode, userId);
    return { success: true, room, message: '커플룸에 연결되었습니다' };
  }
}
