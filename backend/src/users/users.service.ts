import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
    await this.userRepository.remove(user);
    return { success: true, message: '계정이 삭제되었습니다' };
  }
}
