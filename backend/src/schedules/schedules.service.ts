import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async getSchedules(roomType: string, roomId: string) {
    return this.scheduleRepository.find({
      where: { roomType: roomType as any, roomId },
      order: { date: 'ASC' },
    });
  }

  async createSchedule(roomType: string, roomId: string, creatorId: string, data: { title: string; date: string; description?: string }) {
    if (!data.title || !data.date) {
      throw new BadRequestException('제목과 날짜는 필수입니다');
    }
    const schedule = this.scheduleRepository.create({
      roomType: roomType as any,
      roomId,
      creatorId,
      title: data.title,
      date: new Date(data.date),
      description: data.description,
    });
    return this.scheduleRepository.save(schedule);
  }

  async updateSchedule(scheduleId: string, userId: string, data: Partial<Schedule>) {
    const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!schedule) throw new NotFoundException('일정을 찾을 수 없습니다');
    if (schedule.creatorId !== userId) throw new ForbiddenException('수정 권한이 없습니다');
    Object.assign(schedule, data);
    return this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(scheduleId: string, userId: string) {
    const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!schedule) throw new NotFoundException('일정을 찾을 수 없습니다');
    if (schedule.creatorId !== userId) throw new ForbiddenException('삭제 권한이 없습니다');
    await this.scheduleRepository.remove(schedule);
    return { success: true };
  }
}
