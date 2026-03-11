import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MinimeModule } from './minime/minime.module';
import { RoomsModule } from './rooms/rooms.module';
import { PostsModule } from './posts/posts.module';
import { SchedulesModule } from './schedules/schedules.module';
import { TodosModule } from './todos/todos.module';
import { MediaModule } from './media/media.module';
import { EventsModule } from './gateway/events.module';
import { User } from './entities/user.entity';
import { Minime } from './entities/minime.entity';
import { MiniRoom } from './entities/mini-room.entity';
import { CoupleRoom } from './entities/couple-room.entity';
import { Post } from './entities/post.entity';
import { Schedule } from './entities/schedule.entity';
import { Todo } from './entities/todo.entity';
import { MediaFile } from './entities/media-file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(__dirname, '..', 'rimo.db'),
      autoSave: true,
      entities: [User, Minime, MiniRoom, CoupleRoom, Post, Schedule, Todo, MediaFile],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    MinimeModule,
    RoomsModule,
    PostsModule,
    SchedulesModule,
    TodosModule,
    MediaModule,
    EventsModule,
  ],
})
export class AppModule {}
