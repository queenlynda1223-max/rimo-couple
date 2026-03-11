import { Controller, Post, Get, Delete, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.UPLOAD_DIR || './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser('id') userId: string) {
    const mediaFile = await this.mediaService.uploadFile(file, userId);
    return { success: true, file: mediaFile };
  }

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string) {
    const file = await this.mediaService.getFile(fileId);
    return { success: true, file };
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string, @CurrentUser('id') userId: string) {
    return this.mediaService.deleteFile(fileId, userId);
  }
}
