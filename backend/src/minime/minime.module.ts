import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinimeController } from './minime.controller';
import { MinimeService } from './minime.service';
import { Minime } from '../entities/minime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Minime])],
  controllers: [MinimeController],
  providers: [MinimeService],
  exports: [MinimeService],
})
export class MinimeModule {}
