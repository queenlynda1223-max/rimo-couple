import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CoupleRoom } from '../entities/couple-room.entity';
import { MiniRoom } from '../entities/mini-room.entity';
import { Post } from '../entities/post.entity';
import { Schedule } from '../entities/schedule.entity';
import { Todo } from '../entities/todo.entity';
import { MediaFile } from '../entities/media-file.entity';
import { Minime } from '../entities/minime.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CoupleRoom,
      MiniRoom,
      Post,
      Schedule,
      Todo,
      MediaFile,
      Minime,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
