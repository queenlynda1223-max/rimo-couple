import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return { success: true, user };
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body('nickname') nickname: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      return { success: false, message: '권한이 없습니다' };
    }
    const user = await this.usersService.updateNickname(userId, nickname);
    return { success: true, user };
  }

  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
    @Body() dto: DeleteAccountDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      return { success: false, message: '권한이 없습니다' };
    }
    return this.usersService.deleteUser(userId, dto);
  }
}
