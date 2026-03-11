import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/rooms/:roomType/:roomId/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async getTodos(@Param('roomType') roomType: string, @Param('roomId') roomId: string) {
    const todos = await this.todosService.getTodos(roomType, roomId);
    return { success: true, ...todos };
  }

  @Post()
  async createTodo(
    @Param('roomType') roomType: string,
    @Param('roomId') roomId: string,
    @Body() data: { title: string },
    @CurrentUser('id') userId: string,
  ) {
    const todo = await this.todosService.createTodo(roomType, roomId, userId, data);
    return { success: true, todo };
  }

  @Patch(':todoId')
  async updateTodo(
    @Param('todoId') todoId: string,
    @Body() data: any,
    @CurrentUser('id') userId: string,
  ) {
    const todo = await this.todosService.updateTodo(todoId, userId, data);
    return { success: true, todo };
  }

  @Delete(':todoId')
  async deleteTodo(@Param('todoId') todoId: string, @CurrentUser('id') userId: string) {
    return this.todosService.deleteTodo(todoId, userId);
  }
}
