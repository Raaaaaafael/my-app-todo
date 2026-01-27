import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

@Injectable()
export class TodoItemsService {
  create(createTodoItemDto: CreateTodoItemDto) {
    return 'This action adds a new todoItem';
  }

  findAll() {
    return `This action returns all todoItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todoItem`;
  }

  update(id: number, updateTodoItemDto: UpdateTodoItemDto) {
    return `This action updates a #${id} todoItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} todoItem`;
  }
}
