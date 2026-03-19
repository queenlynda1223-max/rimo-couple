import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { User } from '../entities/user.entity';
import { CoupleRoom } from '../entities/couple-room.entity';
import { MiniRoom } from '../entities/mini-room.entity';
import { Post } from '../entities/post.entity';
import { Schedule } from '../entities/schedule.entity';
import { Todo } from '../entities/todo.entity';
import { MediaFile } from '../entities/media-file.entity';
import { Minime } from '../entities/minime.entity';
import { DeleteAccountDto } from './dto/delete-account.dto';

const OAUTH_DELETE_CONFIRMATION = '회원탈퇴';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['minime', 'miniRoom'],
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateNickname(id: string, nickname: string) {
    await this.userRepository.update(id, { nickname });
    return this.findById(id);
  }

  private async assertDeletionAllowed(user: User, dto: DeleteAccountDto) {
    if (user.passwordHash) {
      if (!dto.password?.length) {
        throw new BadRequestException('비밀번호를 입력해 주세요');
      }
      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
      }
      return;
    }
    if (dto.confirmation !== OAUTH_DELETE_CONFIRMATION) {
      throw new BadRequestException(
        `확인 문구를 정확히 입력해 주세요: ${OAUTH_DELETE_CONFIRMATION}`,
      );
    }
  }

  async deleteUser(id: string, dto: DeleteAccountDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');

    await this.assertDeletionAllowed(user, dto);

    await this.dataSource.transaction(async (manager) => {
      const coupleRooms = await manager
        .createQueryBuilder(CoupleRoom, 'cr')
        .where('cr.user1Id = :id OR cr.user2Id = :id', { id })
        .getMany();

      for (const room of coupleRooms) {
        await manager.delete(Post, { roomType: 'couple', roomId: room.id });
        await manager.delete(Schedule, { roomType: 'couple', roomId: room.id });
        await manager.delete(Todo, { roomType: 'couple', roomId: room.id });
      }

      if (coupleRooms.length > 0) {
        await manager.delete(
          CoupleRoom,
          { id: In(coupleRooms.map((r) => r.id)) },
        );
      }

      const miniRoom = await manager.findOne(MiniRoom, { where: { userId: id } });
      if (miniRoom) {
        await manager.delete(Post, { roomType: 'mini', roomId: miniRoom.id });
        await manager.delete(Schedule, {
          roomType: 'mini',
          roomId: miniRoom.id,
        });
        await manager.delete(Todo, { roomType: 'mini', roomId: miniRoom.id });
        await manager.delete(MiniRoom, { id: miniRoom.id });
      }

      const mediaFiles = await manager.find(MediaFile, { where: { userId: id } });
      for (const file of mediaFiles) {
        try {
          if (file.storagePath && fs.existsSync(file.storagePath)) {
            fs.unlinkSync(file.storagePath);
          }
        } catch {
          /* ignore disk errors */
        }
      }
      if (mediaFiles.length > 0) {
        await manager.delete(MediaFile, { userId: id });
      }

      await manager.delete(Minime, { userId: id });
      await manager.delete(User, { id });
    });

    return { success: true, message: '계정이 삭제되었습니다' };
  }
}
