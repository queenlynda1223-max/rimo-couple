import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Minime } from '../entities/minime.entity';

@Injectable()
export class MinimeService {
  constructor(
    @InjectRepository(Minime)
    private minimeRepository: Repository<Minime>,
  ) {}

  async getMinime(userId: string) {
    const minime = await this.minimeRepository.findOne({ where: { userId } });
    if (!minime) throw new NotFoundException('미니미를 찾을 수 없습니다');
    return minime;
  }

  async updateMinime(userId: string, data: Partial<Minime>) {
    let minime = await this.minimeRepository.findOne({ where: { userId } });
    if (!minime) {
      minime = this.minimeRepository.create({ userId, ...data });
    } else {
      Object.assign(minime, data);
    }
    return this.minimeRepository.save(minime);
  }
}
