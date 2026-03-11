import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MiniRoom } from '../entities/mini-room.entity';
import { CoupleRoom } from '../entities/couple-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiniRoom, CoupleRoom])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
