import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('minimes')
export class Minime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, user => user.minime)
  @JoinColumn()
  user: User;

  @Column({ default: 'default' })
  faceType: string;

  @Column({ default: 'default' })
  hairStyle: string;

  @Column({ default: '#000000' })
  hairColor: string;

  @Column({ default: 'default' })
  outfit: string;

  @Column('simple-json', { default: '[]' })
  accessories: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
