import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getTodos(roomType: string, roomId: string) {
    const todos = await this.todoRepository.find({
      where: { roomType: roomType as any, roomId },
      order: { createdAt: 'DESC' },
    });
    return {
      incomplete: todos.filter(t => !t.isCompleted),
      completed: todos.filter(t => t.isCompleted),
    };
  }

  async createTodo(roomType: string, roomId: string, creatorId: string, data: { title: string }) {
    const todo = this.todoRepository.create({
      roomType: roomType as any,
      roomId,
      creatorId,
      title: data.title,
    });
    return this.todoRepository.save(todo);
  }

  async updateTodo(todoId: string, userId: string, data: Partial<Todo>) {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });
    if (!todo) throw new NotFoundException('할 일을 찾을 수 없습니다');
    if (data.isCompleted !== undefined && data.isCompleted && !todo.isCompleted) {
      data.completedAt = new Date();
    }
    Object.assign(todo, data);
    return this.todoRepository.save(todo);
  }

  async deleteTodo(todoId: string, userId: string) {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });
    if (!todo) throw new NotFoundException('할 일을 찾을 수 없습니다');
    await this.todoRepository.remove(todo);
    return { success: true };
  }
}
