import { Controller, Get, Post as HttpPost, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/rooms/:roomType/:roomId/posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(@Param('roomType') roomType: string, @Param('roomId') roomId: string) {
    const posts = await this.postsService.getPosts(roomType, roomId);
    return { success: true, posts };
  }

  @HttpPost()
  async createPost(
    @Param('roomType') roomType: string,
    @Param('roomId') roomId: string,
    @Body() data: { content: string; images?: string[] },
    @CurrentUser('id') userId: string,
  ) {
    const post = await this.postsService.createPost(roomType, roomId, userId, data);
    return { success: true, post };
  }

  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() data: { content?: string; images?: string[] },
    @CurrentUser('id') userId: string,
  ) {
    const post = await this.postsService.updatePost(postId, userId, data);
    return { success: true, post };
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string, @CurrentUser('id') userId: string) {
    return this.postsService.deletePost(postId, userId);
  }
}
