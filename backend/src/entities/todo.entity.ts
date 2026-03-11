import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomType: 'mini' | 'couple';

  @Column()
  roomId: string;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, user => user.todos)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  title: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
