import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Schedule } from './schedule.entity';
import { Todo } from './todo.entity';

@Entity('mini_rooms')
export class MiniRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, user => user.miniRoom)
  @JoinColumn()
  user: User;

  @Column({ default: 'bg_default' })
  backgroundId: string;

  @Column({ nullable: true })
  bgmId: string;

  @Column('simple-json', { default: '[]' })
  items: { itemId: string; x: number; y: number; zIndex: number }[];

  @Column({ default: '', length: 100 })
  statusMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
