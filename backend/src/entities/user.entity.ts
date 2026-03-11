import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Minime } from './minime.entity';
import { MiniRoom } from './mini-room.entity';
import { Post } from './post.entity';
import { Schedule } from './schedule.entity';
import { Todo } from './todo.entity';
import { MediaFile } from './media-file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  oauthProvider: string;

  @Column({ nullable: true })
  oauthId: string;

  @Column({ nullable: true })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToOne(() => Minime, minime => minime.user)
  minime: Minime;

  @OneToOne(() => MiniRoom, miniRoom => miniRoom.user)
  miniRoom: MiniRoom;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Schedule, schedule => schedule.creator)
  schedules: Schedule[];

  @OneToMany(() => Todo, todo => todo.creator)
  todos: Todo[];

  @OneToMany(() => MediaFile, media => media.user)
  mediaFiles: MediaFile[];
}
