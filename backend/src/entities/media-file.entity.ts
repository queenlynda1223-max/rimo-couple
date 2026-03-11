import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.mediaFiles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fileName: string;

  @Column()
  fileType: 'image' | 'audio';

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column()
  storagePath: string;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;
}
