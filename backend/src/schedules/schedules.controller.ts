import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/rooms/:roomType/:roomId/schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  async getSchedules(@Param('roomType') roomType: string, @Param('roomId') roomId: string) {
    const schedules = await this.schedulesService.getSchedules(roomType, roomId);
    return { success: true, schedules };
  }

  @Post()
  async createSchedule(
    @Param('roomType') roomType: string,
    @Param('roomId') roomId: string,
    @Body() data: { title: string; date: string; description?: string },
    @CurrentUser('id') userId: string,
  ) {
    const schedule = await this.schedulesService.createSchedule(roomType, roomId, userId, data);
    return { success: true, schedule };
  }

  @Patch(':scheduleId')
  async updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() data: any,
    @CurrentUser('id') userId: string,
  ) {
    const schedule = await this.schedulesService.updateSchedule(scheduleId, userId, data);
    return { success: true, schedule };
  }

  @Delete(':scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduleId: string, @CurrentUser('id') userId: string) {
    return this.schedulesService.deleteSchedule(scheduleId, userId);
  }
}
