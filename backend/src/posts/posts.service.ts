import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getPosts(roomType: string, roomId: string) {
    return this.postRepository.find({
      where: { roomType: roomType as any, roomId },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }

  async createPost(roomType: string, roomId: string, authorId: string, data: { content: string; images?: string[] }) {
    const post = this.postRepository.create({
      roomType: roomType as any,
      roomId,
      authorId,
      content: data.content,
      images: data.images || [],
    });
    return this.postRepository.save(post);
  }

  async updatePost(postId: string, userId: string, data: { content?: string; images?: string[] }) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다');
    if (post.authorId !== userId) throw new ForbiddenException('수정 권한이 없습니다');
    Object.assign(post, data);
    return this.postRepository.save(post);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다');
    if (post.authorId !== userId) throw new ForbiddenException('삭제 권한이 없습니다');
    await this.postRepository.remove(post);
    return { success: true };
  }
}
