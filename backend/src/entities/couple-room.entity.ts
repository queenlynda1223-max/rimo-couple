import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('couple_rooms')
export class CoupleRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user1Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @Column({ nullable: true })
  user2Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @Column({ unique: true, length: 8 })
  invitationCode: string;

  @Column({ unique: true })
  invitationLink: string;

  @Column({ default: false })
  isConnected: boolean;

  @Column({ default: 'bg_couple_default' })
  backgroundId: string;

  @Column({ nullable: true })
  bgmId: string;

  @Column('simple-json', { default: '[]' })
  items: { itemId: string; x: number; y: number; zIndex: number }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  connectedAt: Date;
}
