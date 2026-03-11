import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../entities/media-file.entity';
import * as path from 'path';
import * as fs from 'fs';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/aac', 'audio/mp4'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(
    @InjectRepository(MediaFile)
    private mediaFileRepository: Repository<MediaFile>,
  ) {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.mimetype);

    if (!isImage && !isAudio) {
      throw new BadRequestException('지원하지 않는 파일 형식입니다');
    }
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('이미지 파일은 5MB 이하여야 합니다');
    }
    if (isAudio && file.size > MAX_AUDIO_SIZE) {
      throw new BadRequestException('오디오 파일은 10MB 이하여야 합니다');
    }

    const mediaFile = this.mediaFileRepository.create({
      userId,
      fileName: file.originalname,
      fileType: isImage ? 'image' : 'audio',
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath: file.path,
      url: `/uploads/${file.filename}`,
    });

    return this.mediaFileRepository.save(mediaFile);
  }

  async getFile(fileId: string) {
    const file = await this.mediaFileRepository.findOne({ where: { id: fileId } });
    if (!file) throw new NotFoundException('파일을 찾을 수 없습니다');
    return file;
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.mediaFileRepository.findOne({ where: { id: fileId } });
    if (!file) throw new NotFoundException('파일을 찾을 수 없습니다');
    if (file.userId !== userId) throw new BadRequestException('삭제 권한이 없습니다');

    if (fs.existsSync(file.storagePath)) {
      fs.unlinkSync(file.storagePath);
    }
    await this.mediaFileRepository.remove(file);
    return { success: true };
  }
}
