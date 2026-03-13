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

  @Column({ default: 'happy' })
  expression: string;

  @Column({ default: 'fair' })
  skinColor: string;

  @Column({ default: 'short' })
  hairStyle: string;

  @Column({ default: '#2C1810' })
  hairColor: string;

  @Column({ default: 'tshirt' })
  outfit: string;

  @Column({ default: '#FF6B8A' })
  outfitColor: string;

  @Column('simple-json', { default: '[]' })
  accessories: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
