import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { MinimeService } from './minime.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class MinimeController {
  constructor(private minimeService: MinimeService) {}

  @Get(':userId/minime')
  async getMinime(@Param('userId') userId: string) {
    const minime = await this.minimeService.getMinime(userId);
    return { success: true, minime };
  }

  @Put(':userId/minime')
  async updateMinime(@Param('userId') userId: string, @Body() data: any) {
    const minime = await this.minimeService.updateMinime(userId, data);
    return { success: true, minime };
  }
}
